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

SKIP_X = 1062
SKIP_Y = 877

def log(s):
    print(f"{datetime.now()}: {s}")

def get_today_key():
    return datetime.now().strftime("%Y-%m-%d")

def close_tab():
    log("Closing tab")
    hotkey("command", key="w")
    time.sleep(1)

def click_point(x, y, wait_time=1):
    pyautogui.moveTo(x, y, duration=MOUSE_SPEED)
    pyautogui.click()

def hotkey(*modifiers, key, delay=0.05):
    for mod in modifiers:
        pyautogui.keyDown(mod)
        time.sleep(delay)

    pyautogui.press(key)
    time.sleep(delay)

    for mod in reversed(modifiers):
        pyautogui.keyUp(mod)
        time.sleep(delay)


class Listener(BaseHTTPRequestHandler):

    def __init__(self, request, client_address, server):
        self.load_stats()
        super().__init__(request, client_address, server)
    
    def load_stats(self):
        try:
            if os.path.exists(STATS_FILE):
                with open(STATS_FILE, 'r') as f:
                    stats = json.load(f)
                    self.advertisers = stats.get('advertisers', {})
                    self.skips = stats.get('skips', 0)
                    self.payloads = stats.get('payloads', 0)
                    self.cta_texts = stats.get('cta_texts', {})
                    self.daily_stats = stats.get('daily_stats', {})
                    log(f"Loaded stats from {STATS_FILE}")
            else:
                self.advertisers = {}
                self.skips = 0
                self.payloads = 0
                self.cta_texts = {}
                self.daily_stats = {}
                log("No existing stats file found, starting fresh")
        except Exception as e:
            log(f"Error loading stats: {e}")
            self.advertisers = {}
            self.skips = 0
            self.payloads = 0
            self.cta_texts = {}
            self.daily_stats = {}
    
    def save_stats(self):
        try:
            stats = {
                'advertisers': self.advertisers,
                'skips': self.skips,
                'payloads': self.payloads,
                'cta_texts': self.cta_texts,
                'daily_stats': self.daily_stats,
                'last_updated': time.time()
            }

            temp_file = f"{STATS_FILE}.tmp"
            with open(temp_file, 'w') as f:
                json.dump(stats, f, indent=2)

            os.replace(temp_file, STATS_FILE)
            log(f"Stats saved to {STATS_FILE}")

        except Exception as e:
            log(f"Error saving stats: {e}")
    
    def handle_ad(self, payload=None):
        if payload:
            event = payload.get('event')
            cta_text = payload.get('cta_text')
            advertiser = payload.get('advertiser')

            today = get_today_key()

            # Ensure today's structure exists
            self.daily_stats.setdefault(today, {
                'clicks': 0,
                'skips': 0
            })

            # Track CTA texts
            self.cta_texts.setdefault(cta_text, 0)
            self.cta_texts[cta_text] += 1

            self.payloads += 1

            if event == 'cta_clicked':
                self.advertisers.setdefault(advertiser, 0)
                self.advertisers[advertiser] += 1

                self.daily_stats[today]['clicks'] += 1

                time.sleep(10)
                close_tab()
            else:
                self.skips += 1
                self.daily_stats[today]['skips'] += 1

            click_point(SKIP_X, SKIP_Y)

            # Save stats after every update
            self.save_stats()

            total_clicks = sum(self.advertisers.values())

            log(f"Advertiser: {advertiser}, CTA: {cta_text}")
            log(f"Payloads received: {self.payloads}")
            log(f"Clicks performed: {total_clicks}")
            log(f"Skips performed: {self.skips}")
            log(f"Today's stats: {self.daily_stats[today]}")
            log("-"*40)
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        payload = None
        try:
            if post_data:
                payload = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError as e:
            log(f"Error decoding JSON: {e}")
            log(f"Raw data: {post_data}")
        
        self.handle_ad(payload)
        
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