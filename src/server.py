from http.server import BaseHTTPRequestHandler, HTTPServer

import pyautogui
import time 
from datetime import datetime
import json
import os

# Configuration
STATS_FILE = "ad_stats.json"

SERVER_ADDRESS = "0.0.0.0"
SERVER_PORT = 5007

MOUSE_SPEED = 0.01

SKIP_X = 1591
SKIP_Y = 1130

def log(s):
    print(f"{datetime.now()}: {s}")

def close_tab():
    log("Closing tab")
    hotkey("command", key="w")
    time.sleep(1)

def click_point(x, y, wait_time=1):
    pyautogui.moveTo(x, y, duration=MOUSE_SPEED)
    pyautogui.click()

def hotkey(*modifiers, key, delay=0.05):
    # press all modifiers
    for mod in modifiers:
        pyautogui.keyDown(mod)
        time.sleep(delay)

    # press the main key
    pyautogui.press(key)
    time.sleep(delay)

    # release modifiers in reverse order (important)
    for mod in reversed(modifiers):
        pyautogui.keyUp(mod)
        time.sleep(delay)


class Listener(BaseHTTPRequestHandler):

    def __init__(self, request, client_address, server):
        # Load existing stats from file
        self.load_stats()
        
        # Call the parent class __init__ with the required arguments
        super().__init__(request, client_address, server)
    
    def load_stats(self):
        """Load statistics from JSON file"""
        try:
            if os.path.exists(STATS_FILE):
                with open(STATS_FILE, 'r') as f:
                    stats = json.load(f)
                    self.advertisers = stats.get('advertisers', {})
                    self.skips = stats.get('skips', 0)
                    self.payloads = stats.get('payloads', 0)
                    self.cta_texts = stats.get('cta_texts', {})
                    log(f"Loaded stats from {STATS_FILE}")
            else:
                # Initialize with empty stats
                self.advertisers = {}
                self.skips = 0
                self.payloads = 0
                self.cta_texts = {}
                log(f"No existing stats file found, starting fresh")
        except Exception as e:
            log(f"Error loading stats: {e}")
            # Initialize with empty stats on error
            self.advertisers = {}
            self.skips = 0
            self.payloads = 0
            self.cta_texts = {}
    
    def save_stats(self):
        """Save current statistics to JSON file"""
        try:
            stats = {
                'advertisers': self.advertisers,
                'skips': self.skips,
                'payloads': self.payloads,
                'cta_texts': self.cta_texts,
                'last_updated': time.time()
            }
            
            # Write to a temporary file first, then rename to avoid corruption
            temp_file = f"{STATS_FILE}.tmp"
            with open(temp_file, 'w') as f:
                json.dump(stats, f, indent=2)
            
            # Rename temp file to actual file (atomic operation on most systems)
            os.replace(temp_file, STATS_FILE)
            
            log(f"Stats saved to {STATS_FILE}")
        except Exception as e:
            log(f"Error saving stats: {e}")
    
    def handle_ad(self, payload=None):
        if payload:
            event = payload.get('event')
            cta_text = payload.get('cta_text')
            advertiser = payload.get('advertiser')

            self.cta_texts.setdefault(cta_text, 0)
            self.cta_texts[cta_text] += 1

            self.payloads += 1

            if event == 'cta_clicked':
                self.advertisers.setdefault(advertiser, 0)
                self.advertisers[advertiser] += 1

                time.sleep(10)  
                close_tab()  # close the new tab opened by the CTA button

            time.sleep(3)  # wait for the ad to load
            click_point(SKIP_X, SKIP_Y)
            self.skips += 1

            # Save stats after every update
            self.save_stats()

            total_clicks = sum(self.advertisers.values())

            log(f"Advertiser: {advertiser}, CTA: {cta_text}")
            log(f"Payloads received: {self.payloads}")
            log(f"Clicks performed: {total_clicks}")
            log(f"Skips performed: {self.skips - total_clicks}")
            # log(f"CTA Texts: {self.cta_texts}")
            # log(f"Advertisers: {self.advertisers}")
            log("-"*40)
    
    def do_POST(self):
        # Get the content length
        content_length = int(self.headers.get('Content-Length', 0))
        
        # Read the POST data
        post_data = self.rfile.read(content_length)
        
        # Parse JSON payload
        payload = None
        try:
            if post_data:
                payload = json.loads(post_data.decode('utf-8'))
                # log(f"Received JSON payload: {json.dumps(payload, indent=2)}")
        except json.JSONDecodeError as e:
            log(f"Error decoding JSON: {e}")
            log(f"Raw data: {post_data}")
        
        # Pass payload to handle_ad
        self.handle_ad(payload)
        
        # Send response
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
    
    def log_message(self, format, *args):
        return


if __name__ == "__main__":

    server = HTTPServer((SERVER_ADDRESS, SERVER_PORT), Listener)
    log(f"Listening on http://{SERVER_ADDRESS}:{SERVER_PORT}")
    log(f"Stats will be saved to {STATS_FILE}")
    server.serve_forever()
