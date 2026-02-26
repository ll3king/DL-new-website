"""
GBP Scraper — Gemini 2.5 Reader Mode (google-genai SDK).

Perceptions Upgrade:
  1. Extracted all text content (body.get_text()) from the website.
  2. Gemini 2.5 Flash acts as a data extraction expert.
  3. No brittle CSS selectors/tags.
"""

import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

CAFE_INFO_PATH = os.path.join(os.path.dirname(__file__), 'cafe_info.json')
CAFE_WEBSITE_URL = "https://www.dandylanecafe.com"

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
MODEL_ID = "gemini-2.5-flash"
print(f"DEBUG: scraper.py loaded with MODEL_ID={MODEL_ID}")

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept-Language': 'en-AU,en;q=0.9'
}

def load_existing_info():
    try:
        with open(CAFE_INFO_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {"name": "Dandy Lane Cafe"}

def save_info(data):
    try:
        with open(CAFE_INFO_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"SUCCESS: cafe_info.json updated via Gemini 2.5 Reader.")
    except Exception as e:
        print(f"ERROR: Failed to save cafe_info.json: {e}")

def get_gbp_text():
    """Fetch raw text content from the cafe's website (main, contact, blog)."""
    texts = []
    urls = [CAFE_WEBSITE_URL, f"{CAFE_WEBSITE_URL}/contact-us/", f"{CAFE_WEBSITE_URL}/blog/"]
    
    for url in urls:
        try:
            print(f"READING: {url}...")
            resp = requests.get(url, headers=HEADERS, timeout=15)
            resp.raise_for_status()
            
            # Simple text extraction using HTML stripper
            from html.parser import HTMLParser
            class ScrapingParser(HTMLParser):
                def __init__(self):
                    super().__init__()
                    self.text = []
                    self.ignore = False
                def handle_starttag(self, tag, attrs):
                    if tag in ('script', 'style'): self.ignore = True
                def handle_endtag(self, tag):
                    if tag in ('script', 'style'): self.ignore = False
                def handle_data(self, data):
                    if not self.ignore:
                        d = data.strip()
                        if d: self.text.append(d)
                def get_result(self): return " ".join(self.text)
            
            parser = ScrapingParser()
            parser.feed(resp.text)
            texts.append(f"--- CONTENT FROM {url} ---\n{parser.get_result()}")
        except Exception as e:
            print(f"SKIP: Failed to fetch {url}: {e}")
            
    return "\n\n".join(texts)

def sync_gbp_data():
    """Perception Layer: Fetch website text and let Gemini 2.5 generate cafe_info.json."""
    MODEL_ID = "gemini-2.5-flash"
    print(f"GBP SYNC: Starting AI Perception Flow using {MODEL_ID}...")
    raw_text = get_gbp_text()
    if not raw_text.strip():
        print("FAIL: No context extracted from website.")
        return None

    # [V4.0] Pure AI Perception Prompt
    prompt = f"""You are an advanced data extraction expert for Dandy Lane Cafe.
Analyze the following website context and generate a complete cafe_info.json.

REQUIRED FIELDS:
1. hours: A dictionary mapping days (Monday-Sunday) to their opening hours.
2. holiday_closure: Any mention of upcoming holidays, special closing dates, or "None currently".
3. latest_post: The most recent news or blog post title/summary.
4. basic_info: address, phone, and a short location_description.

WEBSITE CONTEXT:
{raw_text}

Output ONLY valid JSON.
"""
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            config=types.GenerateContentConfig(
                response_mime_type='application/json'
            ),
            contents=prompt
        )
        extraction = json.loads(response.text)
        
        # Standardize keys and merge
        existing = load_existing_info()
        existing.update(extraction)
        existing['last_updated'] = datetime.now().isoformat()
        
        save_info(existing)
        return existing
        
    except Exception as e:
        print(f"AI PERCEPTION FAILED: {e}")
        return None

def scrape():
    """Legacy wrapper for backward compatibility."""
    return sync_gbp_data()

if __name__ == '__main__':
    sync_gbp_data()
