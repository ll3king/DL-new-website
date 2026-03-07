import os
import json
import yaml
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

# ═══════════════════════════════════════════
# SDK Configuration
# ═══════════════════════════════════════════

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
MODEL_ID = "gemini-2.5-flash"

SITE_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'site.yaml')

def _load_site_data():
    try:
        with open(SITE_DATA_PATH, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"ERROR: Could not load site.yaml: {e}")
        return {}

# System Instruction Generation Helper
def _get_dynamic_instruction():
    """Generates a dynamic system instruction with LATEST site.yaml data."""
    site = _load_site_data()
    
    # Extract sections for context
    identity = site.get('identity', {})
    dishes = site.get('signature_dishes', [])
    hours_text = site.get('operations', {}).get('hours_text', 'See website')
    
    # Base instructions from site.yaml
    base_prompt = site.get('chatbot', {}).get('system_prompt', "You are the Dandy Lane Concierge.")
    
    # Inject variables into the prompt if needed, or just append data
    # (The site.yaml prompt already uses Jinja-like placeholders but we can resolve them here or just let Gemini handle it)
    
    knowledge_context = f"""
    --- KNOWLEDGE BASE (LATEST) ---
    Venue: {identity.get('name')}
    Purpose: {identity.get('core_purpose')}
    Description: {identity.get('description')}
    Hours: {hours_text}
    
    Signature Dishes:
    {chr(10).join([f"- {d['name']}: {d['description']}" for d in dishes])}
    
    Booking Terms:
    {chr(10).join([f"- {t}" for t in site.get('booking', {}).get('terms', [])])}
    
    Current DateTime: {datetime.now().strftime('%Y-%m-%d %A %H:%M')}
    --- END KNOWLEDGE BASE ---
    """
    
    return f"{base_prompt}\n\n{knowledge_context}"

class GeminiBrain:
    def __init__(self, sheets_service):
        self.sheets_service = sheets_service
        self.conversations = {}

    def _get_system_instruction(self):
        return _get_dynamic_instruction()

    def get_current_bookings(self, date: str) -> str:
        """Reads all bookings for a specific date (YYYY-MM-DD). Call this to check availability or existing records."""
        print(f"TOOL CALL: get_current_bookings(date={date})")
        try:
            records = self.sheets_service.get_all_records()
            day_bookings = [r for r in records if r.get('date') == date]
            
            if not day_bookings:
                return f"Date {date}: No bookings."
            
            summary = [f"Date {date}: {len(day_bookings)} bookings found."]
            for b in day_bookings:
                summary.append(f"- Name: {b.get('name')}, Time: {b.get('time')}, Pax: {b.get('group_size')}, Contact: {b.get('contact')}")
            
            return "\n".join(summary)
        except Exception as e:
            return f"ERROR: Could not fetch bookings: {e}"

    def manage_booking(self, action: str, name: str, contact: str, date: str, time: str = "", group_size: int = 2) -> str:
        """Manages table reservations (Confirmed, Manual_Review, Cancelled)."""
        print(f"TOOL CALL: manage_booking(action={action}, name={name}, contact={contact}, date={date}, time={time}, group_size={group_size})")
        try:
            if action == 'create':
                if 6 < group_size <= 10:
                    return "FAILED_WALK_IN_RECOMMENDED: We always reserve space for walk-ins. Please guide the guest to just come by."
                
                if group_size > 10:
                    data = {
                        'name': name, 'date': date, 'time': time, 'group_size': group_size, 'contact': contact,
                        'status': 'Manual_Review',
                        'notes': f"SYSTEM ALERT: Large Group Inquiry ({group_size})"
                    }
                    self.sheets_service.sync_to_sheets(data)
                    return "FAILED_MANUAL_REVIEW_TRIGGERED: Group size > 10. Manager notified. Guide guest to walk-in while we review."

                # Standard booking (<= 6)
                data = {
                    'name': name, 'date': date, 'time': time, 'group_size': group_size, 'contact': contact,
                    'status': 'Confirmed'
                }
                success = self.sheets_service.sync_to_sheets(data)
                return "Success: Booking created." if success else "FAILED: Could not write to sheet."
            
            elif action == 'update':
                existing = self.sheets_service.find_same_day_booking(name, contact, date)
                if not existing:
                    return f"FAILED: No existing booking found to update."
                
                data = {
                    'name': name, 'date': date, 'time': time, 'group_size': group_size, 'contact': contact,
                    'needs_manual_review': group_size > 6,
                    'status': 'Manual_Review' if group_size > 6 else 'Confirmed'
                }
                success = self.sheets_service.update_booking(existing['row_index'], data)
                return "Success: Booking updated (overwritten)." if success else "FAILED: Update failed."
            
            elif action == 'delete':
                existing = self.sheets_service.find_same_day_booking(name, contact, date)
                if not existing:
                    existing = self.sheets_service.find_latest_booking(contact) or self.sheets_service.find_latest_booking(name)
                
                if not existing:
                    return f"FAILED: No booking found to delete."
                
                success = self.sheets_service.move_to_archive(existing['row_index'])
                return "Success: Booking cancelled and archived." if success else "FAILED: Archival failed."
            
            return f"FAILED: Unknown action."
        except Exception as e:
            return f"ERROR: {e}"

    def get_cafe_info(self) -> str:
        """Fetch the latest cafe information (hours, location, contact) from site.yaml."""
        print("TOOL CALL: get_cafe_info()")
        try:
            site = _load_site_data()
            info = {
                'identity': site.get('identity'),
                'contact': site.get('contact'),
                'operations': site.get('operations')
            }
            return json.dumps(info, indent=2, ensure_ascii=False)
        except Exception as e:
            return f"ERROR: Could not load cafe info: {e}"

    def handle_message(self, sender_id, message_text):
        """Processes message using automatic function calling with Gemini 2.5 SDK."""
        print(f"[GEMINI_STATUS] Processing message for {sender_id[:8]}...")
        
        # [V4.1] ENSURE SESSION PERSISTENCE
        try:
            if sender_id not in self.conversations:
                print(f"[GEMINI_STATUS] Creating NEW session with FRESH instructions for {sender_id[:8]}")
                self.conversations[sender_id] = client.chats.create(
                    model=MODEL_ID,
                    config=types.GenerateContentConfig(
                        system_instruction=self._get_system_instruction(),
                        tools=[self.get_current_bookings, self.manage_booking, self.get_cafe_info],
                        automatic_function_calling=types.AutomaticFunctionCallingConfig(maximum_remote_calls=5),
                        max_output_tokens=200,
                        temperature=0.7
                    )
                )
            else:
                print(f"[GEMINI_STATUS] Reusing EXISTING session for {sender_id[:8]} | Current Stack: {len(self.conversations)}")
            
            chat = self.conversations[sender_id]
            response = chat.send_message(message_text)
            reply = response.text
            
            if not reply:
                # Fallback if AI produces no text after tool calls
                return "I've handled your request. Is there anything else I can help with?"
            
            # [V4.7] SILENT REASONING: Filter out internal logic leaks or technical artifacts
            refined_reply = reply.strip()
            # Simple cleanup for common AI technical prefixes if they leak (unlikely with auto-function calling but safe)
            import re
            refined_reply = re.sub(r'^(\[Attempting to call|I am calling|Calling tool).*?\n?', '', refined_reply, flags=re.MULTILINE | re.IGNORECASE)
            
            print(f"[GEMINI_STATUS] Reply generated for {sender_id[:8]}: {refined_reply[:50]}...")
            return refined_reply

        except Exception as e:
            # SILENT CIRCUIT BREAKER
            print(f"DEBUG: Gemini Failsafe Triggered for {sender_id[:8]}: {e}")
            # If the session is corrupted/expired, clear it so next attempt starts fresh
            if sender_id in self.conversations:
                print(f"[GEMINI_STATUS] Clearing corrupted session for {sender_id[:8]}")
                del self.conversations[sender_id]
            return None


    def clear_history(self, sender_id):
        if sender_id in self.conversations:
            try:
                del self.conversations[sender_id]
            except:
                pass
