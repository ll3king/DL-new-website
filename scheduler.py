"""
Task Scheduler for Dandy Lane Cafe.

Runs two daily jobs:
  1. GBP Scraper (Gemini mode) at 08:00
  2. Archive expired bookings at 00:30
"""

import schedule
import time
from datetime import datetime

def run_scraper():
    print(f"[SCHEDULER] Starting GBP Sync...")
    try:
        from gbp_scraper import scrape
        scrape()
        print(f"[SCHEDULER] Scrape complete.")
    except Exception as e:
        print(f"[SCHEDULER ERROR] Scraper failed: {e}")

def run_archive():
    print(f"[SCHEDULER] Starting Data Archive...")
    try:
        # Spreadsheet ID from the environment or a hardcoded fallback
        from sheets_tool import SheetsTool
        SPREADSHEET_ID = '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc'
        CREDENTIALS_PATH = 'cafe-booking-system-487709-f93eb34997fe.json'
        
        service = SheetsTool(SPREADSHEET_ID, CREDENTIALS_PATH)
        count = service.archive_old_data()
        print(f"[SCHEDULER] Archive complete. Moved {count} entries.")
    except Exception as e:
        print(f"[SCHEDULER ERROR] Archive failed: {e}")

if __name__ == '__main__':
    print("=" * 50)
    print("  Dandy Lane Cafe - Daily Scheduler")
    print(f"  Started at {datetime.now().isoformat()}")
    print("  Jobs: Scraper @ 08:00, Archive @ 00:30")
    print("=" * 50)
    
    schedule.every().day.at("08:00").do(run_scraper)
    schedule.every().day.at("00:30").do(run_archive)
    
    # Run both once on startup
    run_scraper()
    run_archive()
    
    while True:
        schedule.run_pending()
        time.sleep(60)
