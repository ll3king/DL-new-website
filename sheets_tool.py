import gspread
import os
from google.oauth2.service_account import Credentials
from datetime import datetime, timedelta

# Scopes for Google Sheets and Drive
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

# Standard Headers
# Standard Headers (Aligned with Cloudflare Master Schema)
HEADERS = ['Name', 'Email', 'Mobile', 'Group_Size', 'Date', 'Time', 'Timestamp', 'Status', 'Source']

class SheetsTool:
    def __init__(self, spreadsheet_id, credentials_path):
        self.spreadsheet_id = spreadsheet_id
        self.credentials_path = credentials_path
        self.client = self._authenticate()
        self.sheet = None
        if self.client:
            try:
                self.sheet = self.client.open_by_key(self.spreadsheet_id).get_worksheet(0)
                self.current_platform = 'Messenger'
                self.current_sender_id = None
                self._ensure_headers()
            except Exception as e:
                print(f"CRITICAL: Failed to open Google Sheet (ID: {self.spreadsheet_id}). Error: {e}")

    def _authenticate(self):
        try:
            if not os.path.exists(self.credentials_path):
                print(f"CRITICAL: Credentials file not found at {self.credentials_path}")
                return None
            creds = Credentials.from_service_account_file(self.credentials_path, scopes=SCOPES)
            return gspread.authorize(creds)
        except Exception as e:
            print(f"CRITICAL: Google Auth failed. Error: {e}")
            return None

    def _ensure_headers(self):
        """
        Ensures the sheet has the standardized headers, updating if needed.
        """
        if self.sheet:
            try:
                existing_headers = self.sheet.row_values(1)
                if not existing_headers:
                    self.sheet.append_row(HEADERS)
                elif len(existing_headers) < len(HEADERS):
                    # Migration: Update existing header row to include new columns
                    print(f"MIGRATION: Updating headers from {len(existing_headers)} to {len(HEADERS)} columns.")
                    self.sheet.update('A1', [HEADERS])
            except Exception as e:
                print(f"ERROR: Failed to ensure headers: {e}")

    def get_all_records(self):
        """
        Fetches all rows from the Google Sheet, standardizes keys, and sorts them.
        """
        if not self.sheet:
            return []
        try:
            records = self.sheet.get_all_records()
            standardized = []
            
            for i, r in enumerate(records):
                standardized.append({
                    'row_index': i + 2,
                    'name': r.get('Name', 'Unknown'),
                    'email': r.get('Email', '-'),
                    'mobile': r.get('Mobile', '-'),
                    'group_size': r.get('Group_Size', 1),
                    'date': r.get('Date', '-'),
                    'time': r.get('Time', '-'),
                    'timestamp': r.get('Timestamp', '-'),
                    'status': r.get('Status', 'Pending'),
                    'source': r.get('Source', 'Messenger')
                })
            
            standardized.sort(key=lambda x: (x['date'], x['time']))
            return standardized
        except Exception as e:
            print(f"ERROR: Failed to fetch records: {e}")
            return []

    def get_existing_bookings(self, start_time, end_time):
        if not self.sheet:
            return []
        try:
            all_values = self.sheet.get_all_values()
            if not all_values or len(all_values) <= 1:
                return []
            
            bookings = []
            for row in all_values[1:]:
                try:
                    # Name, Email, Mobile, Group_Size, Date, Time, Timestamp, Status, Source
                    date_str = row[4]
                    time_str = row[5]
                    group_size = int(row[3]) if str(row[3]).isdigit() else 0
                    
                    booking_dt = datetime.fromisoformat(f"{date_str}T{time_str}")
                    if start_time <= booking_dt <= end_time:
                        bookings.append({'guests': group_size, 'time': booking_dt})
                except:
                    continue
            return bookings
        except Exception as e:
            print(f"Error fetching for capacity check: {e}")
            return []

    def sync_to_sheets(self, data):
        """
        Appends a new booking row to the Google Sheet using 9-column schema.
        """
        if not self.sheet:
            return False
        try:
            row = [
                data.get('name', 'Unknown'),
                data.get('email', ''),
                data.get('mobile', ''),
                data.get('group_size', 1),
                data.get('date', ''),
                data.get('time', ''),
                data.get('timestamp', datetime.now().isoformat()),
                data.get('status', 'Pending'),
                data.get('source', self.current_platform)
            ]
            self.sheet.append_row(row)
            
            # Apply highlighting if Manual_Review
            if data.get('status') == 'Manual_Review':
                try:
                    # Get the index of the newly added row
                    last_row = len(self.sheet.get_all_values())
                    self.sheet.format(f"A{last_row}:I{last_row}", {
                        "backgroundColor": {"red": 1.0, "green": 0.9, "blue": 0.6}, # Light Gold/Yellow
                        "textFormat": {"bold": True}
                    })
                except Exception as format_err:
                    print(f"Warning: Could not format row: {format_err}")
                    
            return True
        except Exception as e:
            print(f"Failed to sync to Sheets: {e}")
            # print(f"DEBUG DATA: {data}")
            return False

    def update_booking(self, row_index, data):
        """
        Updates a specific row in the sheet using 9-column schema.
        """
        if not self.sheet:
            return False
        try:
            row_values = [
                data.get('name'),
                data.get('email'),
                data.get('mobile'),
                data.get('group_size'),
                data.get('date'),
                data.get('time'),
                data.get('timestamp', datetime.now().isoformat()),
                data.get('status'),
                data.get('source', self.current_platform)
            ]
            
            cell_range = f"A{row_index}:I{row_index}"
            self.sheet.update(cell_range, [row_values])
            return True
        except Exception as e:
            print(f"ERROR updating sheet at row {row_index}: {e}")
            return False

    def find_latest_booking(self, identifier):
        """
        Finds the latest booking row for a given email/mobile/name.
        """
        if not self.sheet:
            return None
        try:
            all_values = self.sheet.get_all_values()
            if not all_values or len(all_values) <= 1:
                return None
            
            search = identifier.strip().lower()
            for i, row in enumerate(reversed(all_values[1:]), start=1):
                # Columns: Name(0), Email(1), Mobile(2)...
                if any(search in str(val).lower() for val in row[:3]):
                    actual_index = len(all_values) - i + 1
                    return {
                        'row_index': actual_index,
                        'name': row[0],
                        'email': row[1],
                        'mobile': row[2],
                        'group_size': row[3],
                        'date': row[4],
                        'time': row[5],
                        'status': row[7]
                    }
            return None
        except Exception as e:
            print(f"ERROR: find_latest_booking failed: {e}")
            return None

    def move_to_archive(self, row_index, status_override=None):
        """
        Moves a specific row from the active sheet to the Archive sheet.
        """
        if not self.client or not self.sheet:
            return False
        try:
            all_values = self.sheet.get_all_values()
            row_data = all_values[row_index - 1]
            if status_override:
                row_data[7] = status_override

            spreadsheet = self.client.open_by_key(self.spreadsheet_id)
            try:
                archive_sheet = spreadsheet.worksheet('Archive')
            except:
                archive_sheet = spreadsheet.add_worksheet(title='Archive', rows=1000, cols=9)
                archive_sheet.append_row(HEADERS)

            archive_sheet.append_row(row_data)
            self.sheet.delete_rows(row_index)
            return True
        except Exception as e:
            print(f"ERROR: move_to_archive failed: {e}")
            return False

    def find_same_day_booking(self, identifier, date):
        if not self.sheet:
            return None
        try:
            all_values = self.sheet.get_all_values()
            search = identifier.strip().lower()
            for i, row in enumerate(all_values[1:], start=2):
                if len(row) < 8: continue
                if row[4] == date and any(search in str(val).lower() for val in row[:3]):
                    return {
                        'row_index': i,
                        'name': row[0],
                        'date': row[4],
                        'status': row[7]
                    }
            return None
        except Exception as e:
            print(f"ERROR: find_same_day_booking failed: {e}")
            return None

    def archive_old_data(self):
        """
        Move bookings with dates before today from main sheet to Archive.
        """
        if not self.client or not self.sheet:
            return 0
        try:
            spreadsheet = self.client.open_by_key(self.spreadsheet_id)
            try:
                archive_sheet = spreadsheet.worksheet('Archive')
            except:
                archive_sheet = spreadsheet.add_worksheet(title='Archive', rows=1000, cols=9)
                archive_sheet.append_row(HEADERS)
            
            all_values = self.sheet.get_all_values()
            if len(all_values) <= 1: return 0
            
            today_str = datetime.now().strftime('%Y-%m-%d')
            rows_to_archive = []
            row_indices_to_delete = []
            
            for i, row in enumerate(all_values[1:], start=2):
                if len(row) < 8: continue
                row_date = row[4]
                row_status = row[7]
                
                if (row_date and row_date < today_str) or (row_status == 'Archived'):
                    rows_to_archive.append(row)
                    row_indices_to_delete.append(i)
            
            if rows_to_archive:
                archive_sheet.append_rows(rows_to_archive)
                for idx in sorted(row_indices_to_delete, reverse=True):
                    self.sheet.delete_rows(idx)
            
            return len(rows_to_archive)
        except Exception as e:
            print(f"ERROR: archive_old_data failed: {e}")
            return 0


