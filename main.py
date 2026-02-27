from flask import Flask, render_template, request, jsonify
from models import db, Booking
import os
import json
import requests
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from scraper import sync_gbp_data
from dotenv import load_dotenv

from dataclasses import dataclass

load_dotenv()

# WhatsApp Config
WHATSAPP_TOKEN = os.getenv('WHATSAPP_TOKEN')
PHONE_NUMBER_ID = os.getenv('PHONE_NUMBER_ID')
VERIFY_TOKEN = os.getenv('VERIFY_TOKEN', 'MY_VERIFY_TOKEN')

from sheets_tool import SheetsTool
from gemini_brain import GeminiBrain

PAGE_ACCESS_TOKEN = os.getenv('FB_PAGE_ACCESS_TOKEN')
if not PAGE_ACCESS_TOKEN:
    print("[CRITICAL] Missing FB_PAGE_ACCESS_TOKEN in environment!")


# Google Sheets Config (User needs to provide/update these)
SPREADSHEET_ID = '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc'
CREDENTIALS_PATH = 'cafe-booking-system-487709-f93eb34997fe.json'

app = Flask(__name__, static_folder='public', static_url_path='')
# Use a local SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookings.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize Services
sheets_service = SheetsTool(SPREADSHEET_ID, CREDENTIALS_PATH)
gemini_brain = GeminiBrain(sheets_service)     # Pure AI for Messenger

with app.app_context():
    db.create_all()

@dataclass
class InboundMessage:
    sender_id: str
    text: str
    platform: str # 'messenger', 'whatsapp', 'web'
    raw_data: dict = None

# --- APScheduler: Background Sync & Housekeeping ---
def scheduled_sync():
    print("[CRON] Starting GBP Sync...")
    try:
        sync_gbp_data()
        print("[CRON] GBP Sync Completed.")
    except Exception as e:
        print(f"[CRON] GBP Sync Failed: {e}")

def scheduled_housekeeping():
    print("[CRON] Starting Booking Archival...")
    try:
        from archive_old_data import run_janitor
        run_janitor()
        print("[CRON] Booking Archival Completed.")
    except Exception as e:
        print(f"[CRON] Booking Archival Failed: {e}")

scheduler = BackgroundScheduler()
# Run GBP sync daily at 04:00
scheduler.add_job(func=scheduled_sync, trigger="cron", hour=4, minute=0)
# Run Housekeeping daily at 04:30
scheduler.add_job(func=scheduled_housekeeping, trigger="cron", hour=4, minute=30)
scheduler.start()

@app.route('/api/admin/sync_now')
def sync_now():
    """Manual trigger for the GBP sync."""
    print("[MANUAL] Triggering GBP Sync...")
    try:
        sync_gbp_data()
        return jsonify({'status': 'success', 'message': 'Sync triggered successfully.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.context_processor
def utility_processor():
    def is_phone(s):
        import re
        if not s: return False
        # Match typical phone characters: +, digits, spaces, hyphens
        return bool(re.match(r'^[\d\s\+\-\(\)]+$', str(s)))
    return dict(is_phone=is_phone)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/backend_dashboard')
def dashboard():
    bookings = []
    error_msg = None
    ai_status = {}
    summary = {"total_pax": 0, "manual": 0, "full": 0}
    
    try:
        # Load Cafe Info
        cafe_info_path = os.path.join(os.path.dirname(__file__), 'cafe_info.json')
        with open(cafe_info_path, 'r', encoding='utf-8') as f:
            info = json.load(f)
        
        # Determine GBP Status
        is_holiday = "none" not in info.get('holiday_special_closure', '').lower()
        now = datetime.now()
        day_str = now.strftime('%A')
        current_hours = info.get('opening_hours', {}).get(day_str, 'Closed')
        
        # Simple open/closed check (this is an approximation, but better than nothing)
        ai_status = {
            'is_open': not is_holiday and current_hours != 'Closed',
            'hours': current_hours,
            'is_holiday': is_holiday
        }

        # Fetch and Filter Bookings
        all_bookings = sheets_service.get_all_records()
        today_str = now.strftime('%Y-%m-%d')
        
        # Filter: Active only (Status != Cancelled)
        bookings = [b for b in all_bookings if b.get('status') != 'Cancelled']
        
        # Summary for TODAY
        for b in bookings:
            if b.get('date') == today_str:
                summary['total_pax'] += int(b.get('group_size', 0))
                if b.get('status') == 'Manual_Review':
                    summary['manual'] += 1
                if b.get('status') == 'FULL':
                    summary['full'] += 1

        print(f"DEBUG: Active bookings: {len(bookings)} | Today Pax: {summary['total_pax']}")
    except Exception as e:
        error_msg = str(e)
        print(f"CRITICAL ERROR: Dashboard stats failed: {e}")
    
    return render_template('dashboard.html', bookings=bookings, error=error_msg, ai_status=ai_status, summary=summary)

@app.route('/api/calendar/events')
def calendar_events():
    bookings = []
    try:
        bookings = sheets_service.get_all_records()
    except Exception as e:
        print(f"Error fetching calendar events: {e}")
        return jsonify([])

    events = []
    for b in bookings:
        # FullCalendar expects start in ISO format or similar
        # Since we have separate Date and Time, concatenate them
        dt_str = f"{b['date']}T{b['time']}"
        
        # Color coding
        color = "#81B29A" # Default Confirmed (Green)
        if b['status'] == 'Pending':
            color = "#F2CC8F" # Yellow
        elif b['status'] == 'FULL' or b['status'] == 'Cancelled':
            color = "#E07A5F" # Red/Coral
        
        events.append({
            'title': f"{b['name']} ({b['group_size']})",
            'start': dt_str,
            'backgroundColor': color,
            'borderColor': color,
            'extendedProps': {
                'row_index': b.get('row_index'),
                'contact': b.get('contact'),
                'status': b.get('status')
            }
        })
    return jsonify(events)

@app.route('/api/bookings/update', methods=['POST'])
def update_booking_api():
    """
    Handles AJAX updates from the dashboard.
    """
    data = request.json
    row_index = data.get('row_index')
    
    if not row_index:
        return jsonify({'status': 'error', 'message': 'Missing row_index'}), 400
    
    # Standardize review to boolean if it comes as string "true"/"false"
    manual_review = data.get('needs_manual_review')
    if isinstance(manual_review, str):
        manual_review = manual_review.lower() == 'true'

    updated_data = {
        'name': data.get('name'),
        'date': data.get('date'),
        'time': data.get('time'),
        'group_size': data.get('group_size'),
        'contact': data.get('contact'),
        'needs_manual_review': manual_review,
        'status': data.get('status')
    }
    
    success = False
    if updated_data['status'] == 'Cancelled':
        print(f"ARCHIVING: Row {row_index} is being CANCELLED.")
        success = sheets_service.move_to_archive(int(row_index))
    else:
        success = sheets_service.update_booking(row_index, updated_data)
    
    if success:
        return jsonify({'status': 'success'})
    else:
        print(f"FAILED TO UPDATE/ARCHIVE SHEET. Row: {row_index}")
        return jsonify({'status': 'error', 'message': 'Failed to process update'}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.order_by(Booking.booking_time.desc()).all()
    return jsonify([b.to_dict() for b in bookings])

# Form handling removed in V3.1 as it was using legacy rules. 
# Dashboards now use direct API calls if needed.

# Webhook for Facebook Messenger
@app.route('/webhook/messenger', methods=['GET', 'POST'])
def webhook_messenger():
    if request.method == 'GET':
        mode = request.args.get('hub.mode')
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        
        if mode and token:
            if mode == 'subscribe' and token == 'MY_VERIFY_TOKEN': 
                return challenge, 200
            else:
                return 'Forbidden', 403
    
    elif request.method == 'POST':
        data = request.json
        try:
            entries = data.get('entry', [])
            for entry in entries:
                messaging = entry.get('messaging', [])
                for msg in messaging:
                    sender_id = msg.get('sender', {}).get('id')
                    message_text = msg.get('message', {}).get('text')
                    
                    if message_text:
                        inbound = InboundMessage(sender_id=sender_id, text=message_text, platform='messenger')
                        process_unified_message(inbound)
                        
            return 'EVENT_RECEIVED', 200
        except Exception as e:
            print(f"MESSENGER WEBHOOK ERROR: {e}")
            return 'ERROR', 500

    return 'OK', 200

# Webhook for WhatsApp
@app.route('/webhook/whatsapp', methods=['GET', 'POST'])
def webhook_whatsapp():
    if request.method == 'GET':
        mode = request.args.get('hub.mode')
        token = request.args.get('hub.verify_token')
        challenge = request.args.get('hub.challenge')
        
        if mode == 'subscribe' and token == VERIFY_TOKEN:
            return challenge, 200
        return 'Forbidden', 403

    elif request.method == 'POST':
        data = request.json
        try:
            # WhatsApp Business API payload structure
            entry = data.get('entry', [{}])[0]
            changes = entry.get('changes', [{}])[0]
            value = changes.get('value', {})
            messages = value.get('messages', [])
            
            for msg in messages:
                sender_id = msg.get('from') # WhatsApp number
                message_text = msg.get('text', {}).get('body')
                
                if message_text:
                    inbound = InboundMessage(sender_id=sender_id, text=message_text, platform='whatsapp')
                    process_unified_message(inbound)
            
            return 'EVENT_RECEIVED', 200
        except Exception as e:
            print(f"WHATSAPP WEBHOOK ERROR: {e}")
            return 'ERROR', 500
    
    return 'OK', 200

def process_unified_message(inbound: InboundMessage):
    """
    Core routing logic for all channels.
    Injects platform context and hands off to Gemini.
    """
    # [V4.6] Inject platform context and sender info into SheetsTool for tool calling
    sheets_service.current_platform = inbound.platform
    sheets_service.current_sender_id = inbound.sender_id
    
    # Process with Gemini
    reply = gemini_brain.handle_message(inbound.sender_id, inbound.text)
    
    if reply:
        send_standard_response(inbound.platform, inbound.sender_id, reply)
    else:
        print(f"DEBUG: Gemini Silent Circuit Break for {inbound.sender_id} on {inbound.platform}")

@app.route('/api/chat', methods=['POST'])
def chat_api():
    """
    Real-time Chatbot API for the website widget.
    Expected JSON: { "message": "...", "sender_id": "..." }
    """
    data = request.json
    message_text = data.get('message', '').strip()
    sender_id = data.get('sender_id', 'web_user_anonymous')
    
    if not message_text:
        return jsonify({'error': 'Empty message'}), 400
        
    print(f"[WEB_CHAT] Message from {sender_id}: {message_text[:30]}")
    
    # Process through Gemini
    reply = gemini_brain.handle_message(sender_id, message_text)
    
    if reply:
        return jsonify({'reply': reply})
    else:
        # Fallback if AI fails or circuit breaks
        fallback = "Hi, I'm the Dandy Lane Concierge. I'm having a slight technical hitch, but I'm here to help. Could you try your question again? No worries!"
        return jsonify({'reply': fallback})

@app.route('/api/chat/reset', methods=['POST'])
def reset_chat():
    """Reset conversation history for a sender."""
    sender_id = request.json.get('sender_id', '')
    if sender_id:
        gemini_brain.clear_history(sender_id)
    return jsonify({'status': 'ok'})

@app.route('/api/bookings/<int:booking_id>/process', methods=['POST'])
def process_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    booking.status = 'confirmed'
    db.session.commit()
    
    if booking.source == 'messenger':
        try:
            sender_id = booking.customer_name.split(' ')[-1]
            send_message(sender_id, f"Great news! Your booking #{booking.id} has been confirmed. We look forward to seeing you!")
        except:
            print(f"Could not extract sender_id from {booking.customer_name}")
            
    return jsonify(booking.to_dict())

def send_standard_response(platform, recipient_id, text):
    """Unified dispatcher for all channels."""
    if platform in ('messenger', 'web'):
        send_messenger_message(recipient_id, text)
    elif platform == 'whatsapp':
        send_whatsapp_message(recipient_id, text)
    else:
        print(f"[DISPATCHER] Unknown platform: {platform}")

def send_whatsapp_message(recipient_id, text):
    """Sends a message via WhatsApp Business API."""
    if not WHATSAPP_TOKEN or not PHONE_NUMBER_ID:
        print("[WHATSAPP] Missing config. Cannot send.")
        return

    url = f"https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": recipient_id,
        "type": "text",
        "text": {"body": text},
    }
    
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=15)
        if r.status_code != 200:
            print(f"[WHATSAPP_ERROR] {r.status_code} | {r.text}")
        else:
            print(f"[WHATSAPP_SUCCESS] Sent to {recipient_id}")
    except Exception as e:
        print(f"[WHATSAPP_CRASH] {e}")

def send_messenger_message(recipient_id, text):
    """Sends a message via Facebook Graph API with robust logging and masking."""
    if not PAGE_ACCESS_TOKEN:
        print(f"[REJECTED] Cannot send message to {recipient_id}: Token is MISSING.")
        return
        
    url = "https://graph.facebook.com/v18.0/me/messages"
    params = {"access_token": PAGE_ACCESS_TOKEN}
    headers = {"Content-Type": "application/json"}
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": text}
    }
    
    # Masked logging
    masked_token = f"{PAGE_ACCESS_TOKEN[:6]}...{PAGE_ACCESS_TOKEN[-6:]}" if PAGE_ACCESS_TOKEN else "None"
    print(f"[MESSENGER] Attempting send to {recipient_id} | Token: {masked_token}")
    
    try:
        r = requests.post(url, params=params, headers=headers, json=payload, timeout=15)
        if r.status_code != 200:
            print(f"[MESSENGER_ERROR] Failed to send: {r.status_code}")
            print(f"RESPONSE JSON: {r.text}")
        else:
            print(f"[MESSENGER_SUCCESS] Message sent to {recipient_id}")
    except Exception as e:
        print(f"[MESSENGER_CRASH] exception during post: {e}")


if __name__ == '__main__':
    # [V4.0] Run Janitor on startup
    from archive_old_data import run_janitor
    run_janitor()
    
    app.run(debug=False, port=5001)
