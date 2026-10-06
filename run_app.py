#!/usr/bin/env python3
"""
Launcher script for ME-IXL: Analysis in Mechanical Engineering Exam 1 Mastery App.
Double-click or run: python run_app.py
"""

import os
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, HTTPServer
import threading

def open_browser(port):
    url = f"http://localhost:{port}/index.html"
    print(f"\n========================================================")
    print(f"  ME-IXL: Analysis in Mechanical Engineering")
    print(f"  Exam 1 Interactive Mastery Platform")
    print(f"========================================================")
    print(f"\nOpening {url} in your browser...")
    webbrowser.open(url)

def main():
    # Change working directory to this script's directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    PORT = 8080
    # Try running local HTTP server for optimal browser security compatibility
    try:
        server = HTTPServer(('localhost', PORT), SimpleHTTPRequestHandler)
        threading.Timer(0.8, lambda: open_browser(PORT)).start()
        print(f"Local server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server when finished.\n")
        server.serve_forever()
    except Exception as e:
        # Fallback to direct file open
        print(f"Starting direct browser open (HTTP server: {e})...")
        file_path = os.path.join(script_dir, "index.html")
        webbrowser.open(f"file://{file_path}")

if __name__ == "__main__":
    main()
