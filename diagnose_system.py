import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

def diagnose():
    print("--- SYSTEM DIAGNOSIS REPORT ---")
    
    # Check Gemini
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("[FAIL] GEMINI_API_KEY missing in .env")
    else:
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.0-flash', # Testing with known stable ID first
                contents="ping"
            )
            print(f"[OK] Gemini API connected. Response: {response.text.strip()}")
        except Exception as e:
            print(f"[FAIL] Gemini API connection error: {e}")

    # Check Sheets Service
    SPREADSHEET_ID = '1d-FmRVSMfrUqNOhJjsbNVk2cgeqvkk5ZdDnDtx8QONc'
    CREDENTIALS_PATH = 'cafe-booking-system-487709-f93eb34997fe.json'
    
    if not os.path.exists(CREDENTIALS_PATH):
        print(f"[FAIL] Credentials file {CREDENTIALS_PATH} not found.")
    else:
        try:
            import gspread
            from google.oauth2.service_account import Credentials
            
            scopes = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
            creds = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=scopes)
            gc = gspread.authorize(creds)
            sheet = gc.open_by_key(SPREADSHEET_ID)
            print(f"[OK] Google Sheets connected. Spreadsheet title: {sheet.title}")
        except Exception as e:
            print(f"[FAIL] Google Sheets connection error: {e}")

    print("--- END OF REPORT ---")

if __name__ == "__main__":
    diagnose()
