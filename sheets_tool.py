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
HEADERS = ['Name', 'Date', 'Time', 'Group_Size', 'Contact', 'Review', 'Status', 'Source']

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
        Returns a list of dicts with an extra 'row_index' field.
        """
        if not self.sheet:
            return []
        try:
            # get_all_records() returns a list of dictionaries mapping header to cell value
            records = self.sheet.get_all_records()
            standardized = []
            
            # gspread row index is 1-based, data rows start at row 2
            for i, r in enumerate(records):
                standardized.append({
                    'row_index': i + 2, # Corresponds to the actual row in the sheet
                    'name': r.get('Name', 'Unknown'),
                    'date': r.get('Date', '-'),
                    'time': r.get('Time', '-'),
                    'group_size': r.get('Group_Size', 1),
                    'contact': r.get('Contact', '-'),
                    'needs_manual_review': r.get('Review', False), # Header was Review
                    'status': r.get('Status', 'Pending'),
                    'source': r.get('Source', 'Messenger')
                })
            
            # Sort by Date and then Time ascending
            standardized.sort(key=lambda x: (x['date'], x['time']))
            return standardized
        except Exception as e:
            print(f"ERROR: Failed to fetch and sort records: {e}")
            return []

    def get_existing_bookings(self, start_time, end_time):
        """
        Internal capacity check helper.
        """
        if not self.sheet:
            return []
        try:
            all_values = self.sheet.get_all_values()
            if not all_values or len(all_values) <= 1:
                return []
            
            bookings = []
            for row in all_values[1:]:
                try:
                    # Name, Date, Time, Group_Size, Contact, Manual, Status
                    date_str = row[1]
                    time_str = row[2]
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
        Appends a new booking row to the Google Sheet.
        data: { 'name', 'date', 'time', 'group_size', 'contact', 'needs_manual_review', 'status' }
        """
        if not self.sheet:
            return False
        try:
            # [V4.6] WhatsApp Contact Logic: Use sender_id if platform is whatsapp
            contact = data.get('contact')
            if self.current_platform == 'whatsapp' and (not contact or contact == 'None'):
                contact = self.current_sender_id or contact

            row = [
                data.get('name', 'Unknown'),
                data.get('date', ''),
                data.get('time', ''),
                data.get('group_size', 1),
                contact if contact else 'Messenger',
                data.get('needs_manual_review', False),
                data.get('status', 'Pending'),
                data.get('source', self.current_platform)
            ]
            self.sheet.append_row(row)
            return True
        except Exception as e:
            print(f"Failed to sync to Sheets: {e}")
            # print(f"DEBUG DATA: {data}")
            return False

    def update_booking(self, row_index, data):
        """
        Updates a specific row in the sheet.
        data: { 'name', 'date', 'time', 'group_size', 'contact', 'needs_manual_review', 'status' }
        """
        if not self.sheet:
            return False
        try:
            row_values = [
                data.get('name'),
                data.get('date'),
                data.get('time'),
                data.get('group_size'),
                data.get('contact'),
                data.get('needs_manual_review'),
                data.get('status'),
                data.get('source', self.current_platform)
            ]
            
            cell_range = f"A{row_index}:H{row_index}"
            self.sheet.update(cell_range, [row_values])
            print(f"Successfully updated row {row_index} in Sheets.")
            return True
        except Exception as e:
            print(f"ERROR updating sheet at row {row_index}: {e}")
            return False

    def find_latest_booking(self, contact):
        """
        Finds the latest booking row for a given contact/name.
        Searches by Contact column (index 4) or Name column (index 0).
        Returns dict with row data + row_index, or None if not found.
        """
        if not self.sheet:
            return None
        try:
            all_values = self.sheet.get_all_values()
            if not all_values or len(all_values) <= 1:
                return None
            
            latest_row = None
            latest_index = -1
            
            for i, row in enumerate(all_values[1:], start=2):  # Start at row 2 (skip header)
                if len(row) < 7:
                    continue
                # Match by Contact (col 4) or Name (col 0), case-insensitive
                row_contact = str(row[4]).strip().lower()
                row_name = str(row[0]).strip().lower()
                search = contact.strip().lower()
                
                if search in row_contact or search in row_name:
                    # Take the latest (highest row index)
                    if i > latest_index:
                        latest_index = i
                        latest_row = {
                            'row_index': i,
                            'name': row[0],
                            'date': row[1],
                            'time': row[2],
                            'group_size': int(row[3]) if str(row[3]).isdigit() else 1,
                            'contact': row[4],
                            'needs_manual_review': row[5],
                            'status': row[6]
                        }
            
            if latest_row:
                print(f"RESCHEDULE: Found booking for '{contact}' at row {latest_index}")
            else:
                print(f"RESCHEDULE: No booking found for '{contact}'")
            return latest_row
        except Exception as e:
            print(f"ERROR: find_latest_booking failed: {e}")
            return None

    def move_to_archive(self, row_index):
        """
        Moves a specific row from the active sheet to the Archive sheet.
        Used for cancellations or explicit removals.
        """
        if not self.client or not self.sheet:
            return False
        try:
            # 1. Get raw row data before deleting
            all_values = self.sheet.get_all_values()
            row_data = all_values[row_index - 1] # 1st row is header, index fits
            
            # Ensure status is marked as Cancelled in the archive
            if len(row_data) >= 7:
                row_data[6] = 'Cancelled'

            # 2. Get or create Archive sheet
            spreadsheet = self.client.open_by_key(self.spreadsheet_id)
            try:
                archive_sheet = spreadsheet.worksheet('Archive')
            except:
                archive_sheet = spreadsheet.add_worksheet(title='Archive', rows=1000, cols=8)
                archive_sheet.append_row(HEADERS)

            # 3. Append to archive
            archive_sheet.append_row(row_data)

            # 4. Physical delete from active
            self.sheet.delete_rows(row_index)
            print(f"ARCHIVED & DELETED: Row {row_index} moved to Archive.")
            return True
        except Exception as e:
            print(f"ERROR: move_to_archive failed for row {row_index}: {e}")
            return False

    def delete_row(self, row_index):
        """DEPRECATED: Use move_to_archive for safety. Physically deletes a row."""
        if not self.sheet:
            return False
        try:
            self.sheet.delete_rows(int(row_index))
            return True
        except Exception as e:
            print(f"ERROR: delete_row failed: {e}")
            return False

    def find_same_day_booking(self, name, contact, date):
        """
        Find an existing booking for the same name/contact on the same date.
        Used for semantic dedup — overwrite instead of creating duplicates.
        """
        if not self.sheet:
            return None
        try:
            all_values = self.sheet.get_all_values()
            if not all_values or len(all_values) <= 1:
                return None
            
            search_name = name.strip().lower()
            search_contact = contact.strip().lower()
            
            for i, row in enumerate(all_values[1:], start=2):
                if len(row) < 7:
                    continue
                row_name = str(row[0]).strip().lower()
                row_contact = str(row[4]).strip().lower()
                row_date = str(row[1]).strip()
                
                # Same date AND same person (by name or contact)
                if row_date == date and (search_name in row_name or row_name in search_name
                                         or search_contact in row_contact or row_contact in search_contact):
                    return {
                        'row_index': i,
                        'name': row[0],
                        'date': row[1],
                        'time': row[2],
                        'group_size': int(row[3]) if str(row[3]).isdigit() else 1,
                        'contact': row[4],
                        'needs_manual_review': row[5],
                        'status': row[6]
                    }
            return None
        except Exception as e:
            print(f"ERROR: find_same_day_booking failed: {e}")
            return None

    def archive_old_data(self):
        """
        Move bookings with dates before today from main sheet to Archive sheet.
        Creates the Archive sheet if it doesn't exist.
        """
        if not self.client or not self.sheet:
            print("ARCHIVE: No sheet connection available.")
            return 0
        
        try:
            spreadsheet = self.client.open_by_key(self.spreadsheet_id)
            
            # Get or create Archive sheet
            archive_sheet = None
            for ws in spreadsheet.worksheets():
                if ws.title == 'Archive':
                    archive_sheet = ws
                    break
            if not archive_sheet:
                # Add sheet if missing
                archive_sheet = spreadsheet.add_worksheet(title='Archive', rows=1000, cols=8)
                archive_sheet.append_row(HEADERS)
                print("ARCHIVE: Created 'Archive' worksheet.")
            
            # Get all data from main sheet
            all_values = self.sheet.get_all_values()
            if not all_values or len(all_values) <= 1:
                return 0
            
            today_str = datetime.now().strftime('%Y-%m-%d')
            rows_to_archive = []
            row_indices_to_delete = []
            
            for i, row in enumerate(all_values[1:], start=2):
                if len(row) < 2:
                    continue
                row_date = str(row[1]).strip()
                row_status = str(row[6]).strip() if len(row) > 6 else ""
                
                # Archive if date is old OR status is explicitly 'Archived'
                if (row_date and row_date < today_str) or (row_status == 'Archived'):
                    rows_to_archive.append(row)
                    row_indices_to_delete.append(i)
            
            if not rows_to_archive:
                print("ARCHIVE: No old data to archive.")
                return 0
            
            # Batch append to Archive
            archive_sheet.append_rows(rows_to_archive)
            
            # Delete from main sheet (reverse order)
            for idx in sorted(row_indices_to_delete, reverse=True):
                self.sheet.delete_rows(idx)
            
            print(f"ARCHIVE: Moved {len(rows_to_archive)} old entries to Archive.")
            return len(rows_to_archive)
        
        except Exception as e:
            print(f"ERROR: archive_old_data failed: {e}")
            return 0

