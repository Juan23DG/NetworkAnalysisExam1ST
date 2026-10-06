// build_share_dashboard.js: Creates share.html, share_mobile.py, and share_on_phone.bat
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Fetching offline QRCodeJS library...");
  const qrJs = await (await fetch('https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js')).text();

  const shareHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Share ME-IXL Mobile App</title>
  <style>
    :root {
      --primary: #2563eb;
      --bg: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0b1120;
        --card: #172033;
        --border: #293548;
        --text: #f8fafc;
        --muted: #94a3b8;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1.5rem;
    }
    .container {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 2.25rem;
      max-width: 580px;
      width: 100%;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 {
      font-size: 1.6rem;
      font-weight: 800;
      margin-bottom: 0.35rem;
      color: var(--primary);
    }
    p.subtitle {
      color: var(--muted);
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
    }
    .qr-wrapper {
      background: #ffffff;
      padding: 1.25rem;
      border-radius: 16px;
      display: inline-block;
      margin-bottom: 1.25rem;
      border: 2px solid var(--border);
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    }
    #qrcode img, #qrcode canvas {
      margin: 0 auto;
      display: block;
    }
    .url-box {
      background: var(--bg);
      border: 1.5px dashed var(--border);
      border-radius: 12px;
      padding: 0.85rem 1rem;
      font-family: monospace;
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      word-break: break-all;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .copy-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      flex-shrink: 0;
      transition: opacity 0.15s;
    }
    .copy-btn:active { opacity: 0.8; }
    .methods-grid {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
      border-top: 1px solid var(--border);
      padding-top: 1.5rem;
    }
    .method-card {
      background: var(--bg);
      border-radius: 12px;
      padding: 1rem;
      border: 1px solid var(--border);
    }
    .method-title {
      font-weight: 800;
      font-size: 0.92rem;
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .method-desc {
      font-size: 0.82rem;
      color: var(--muted);
      line-height: 1.5;
    }
    ol, ul {
      padding-left: 1.2rem;
      margin-top: 0.4rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📱 Open App on Your Phone</h1>
    <p class="subtitle">Scan the QR code below using your iPhone or Android camera to open the Exam 1 mobile app immediately!</p>

    <div class="qr-wrapper">
      <div id="qrcode"></div>
    </div>

    <div class="url-box">
      <span id="target-url">Loading URL...</span>
      <button class="copy-btn" onclick="copyUrl()">Copy Link</button>
    </div>

    <div class="methods-grid">
      <div class="method-card">
        <div class="method-title">💬 Method 1: Share via Text Message (No Server Needed!)</div>
        <div class="method-desc">
          You can text the <strong>mobile.html</strong> file directly to friends as a text/iMessage/WhatsApp attachment.
          <ul style="margin-top: 0.3rem;">
            <li>Recipients simply tap the file in their chat to open it.</li>
            <li>Zero internet or hosting required — the file contains all 85 problems and solutions!</li>
          </ul>
        </div>
      </div>

      <div class="method-card">
        <div class="method-title">📲 Method 2: Save to Phone Home Screen (Offline Web App)</div>
        <div class="method-desc">
          Once the page is open on your phone:
          <ol style="margin-top: 0.3rem;">
            <li><strong>iPhone (Safari):</strong> Tap the <strong>Share button ⎋</strong> at bottom &rarr; scroll down &rarr; tap <strong>"Add to Home Screen" ⊞</strong>.</li>
            <li><strong>Android (Chrome):</strong> Tap the <strong>Menu ⋮</strong> (top right) &rarr; tap <strong>"Add to Home screen"</strong>.</li>
          </ol>
          The app will now live on your phone home screen like a native app and work 100% offline!
        </div>
      </div>
    </div>
  </div>

  <script>
    ${qrJs}

    const urlParams = new URLSearchParams(window.location.search);
    const hostIp = urlParams.get('ip') || window.location.hostname || '127.0.0.1';
    const port = urlParams.get('port') || window.location.port || '8080';
    const mobileUrl = "http://" + hostIp + ":" + port + "/mobile.html";

    document.getElementById("target-url").innerText = mobileUrl;

    new QRCode(document.getElementById("qrcode"), {
      text: mobileUrl,
      width: 200,
      height: 200,
      colorDark: "#0f172a",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

    function copyUrl() {
      navigator.clipboard.writeText(mobileUrl);
      const btn = document.querySelector(".copy-btn");
      btn.innerText = "Copied! ✓";
      setTimeout(() => btn.innerText = "Copy Link", 2000);
    }
  </script>
</body>
</html>
`;

  fs.writeFileSync('share.html', shareHtml, 'utf8');
  console.log("Created share.html! Size:", shareHtml.length);

  // Create share_mobile.py
  const sharePy = `#!/usr/bin/env python3
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
    print(f"\\n[*] Detected Wi-Fi / Hotspot IP: {lan_ip}")
    print(f"[*] Phone Direct Link:")
    print(f"    --> {mobile_url}")
    print(f"\\n[*] Opening QR Code Dashboard on your computer...")
    print(f"    --> {share_url}")
    print("\\n[+] Point your iPhone or Android camera at the QR code to open!")
    print("[+] Press Ctrl+C to stop the server when finished.\\n" + "=" * 65)

    threading.Timer(0.8, lambda: webbrowser.open(share_url)).start()

    server = HTTPServer(('0.0.0.0', port), SimpleHTTPRequestHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\\nServer stopped. Happy studying!")

if __name__ == "__main__":
    main()
`;

  fs.writeFileSync('share_mobile.py', sharePy, 'utf8');
  console.log("Created share_mobile.py!");

  // Create share_on_phone.bat
  const shareBat = `@echo off
title ME-IXL Mobile Sharing Server
cls
echo ========================================================
echo   ME-IXL: Analysis in ME - Mobile Sharing Server
echo ========================================================
echo Starting local Wi-Fi / Hotspot server and QR code dashboard...
python share_mobile.py
pause
`;

  fs.writeFileSync('share_on_phone.bat', shareBat, 'utf8');
  console.log("Created share_on_phone.bat!");
}

main().catch(err => {
  console.error("Error building share dashboard:", err);
  process.exit(1);
});
