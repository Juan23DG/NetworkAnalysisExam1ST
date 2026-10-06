#!/usr/bin/env python3
"""
ME-IXL: Local Mobile Sharing Server
Spins up a local server, detects your Wi-Fi/LAN IP address,
and opens the QR Code Share Dashboard in your browser.
"""
import os
import sys
import socket
import webbrowser
from http.server import SimpleHTTPRequestHandler, HTTPServer
import threading

def get_lan_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        try:
            ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    lan_ip = get_lan_ip()
    port = 8080

    mobile_url = f"http://{lan_ip}:{port}/mobile.html"
    share_url = f"http://localhost:{port}/share.html?ip={lan_ip}&port={port}"

    print("=" * 65)
    print("  ME-IXL: Analysis in Mechanical Engineering (Exam 1)")
    print("  Local Mobile App Sharing Server (Zero Cloud Hosting Needed)")
    print("=" * 65)
    print(f"\n[*] Detected Wi-Fi / Hotspot IP: {lan_ip}")
    print(f"[*] Phone Direct Link:")
    print(f"    --> {mobile_url}")
    print(f"\n[*] Opening QR Code Dashboard on your computer...")
    print(f"    --> {share_url}")
    print("\n[+] Point your iPhone or Android camera at the QR code to open!")
    print("[+] Press Ctrl+C to stop the server when finished.\n" + "=" * 65)

    threading.Timer(0.8, lambda: webbrowser.open(share_url)).start()

    server = HTTPServer(('0.0.0.0', port), SimpleHTTPRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped. Happy studying!")

if __name__ == "__main__":
    main()
