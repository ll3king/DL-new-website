from datetime import datetime
from sheets_tool import SheetsTool
import os

# Google Sheets Config
SPREADSHEET_ID = '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc'
CREDENTIALS_PATH = 'cafe-booking-system-487709-f93eb34997fe.json'

def run_janitor():
    """Archives rows where date < today."""
    print("JANITOR: Starting archival process...")
    try:
        sheets = SheetsTool(SPREADSHEET_ID, CREDENTIALS_PATH)
        success = sheets.archive_old_data()
        if success:
            print("JANITOR SUCCESS: Old bookings moved to Archive.")
        else:
            print("JANITOR: No records needed archiving.")
    except Exception as e:
        print(f"JANITOR ERROR: {e}")

if __name__ == '__main__':
    run_janitor()
