// generate_mobile_app.js: Builds mobile.html with mobile-first UI, all 85 problems, and 53 formulas
const fs = require('fs');
const path = require('path');

const bankCode = fs.readFileSync('problem_bank.js', 'utf8');
const appCode = fs.readFileSync('app.js', 'utf8');

// Extract CURRICULUM and FORMULA_SECTIONS from app.js
const curriculumMatch = appCode.match(/const CURRICULUM = (\[[\s\S]*?\]);\s*const APP_STATE/);
if (!curriculumMatch) throw new Error("Could not find CURRICULUM in app.js");
const curriculumCode = curriculumMatch[1];

const formulaMatch = appCode.match(/const FORMULA_SECTIONS = (\[[\s\S]*?\]);\s*function renderFormulaSheet/);
if (!formulaMatch) throw new Error("Could not find FORMULA_SECTIONS in app.js");
const formulaCode = formulaMatch[1];

console.log("Extracted CURRICULUM and FORMULA_SECTIONS successfully.");

const mobileHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>ME-IXL: Analysis in ME (Exam 1 Mobile)</title>
  
  <!-- Mobile Web App & PWA Capabilities -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="ME Exam 1">
  <meta name="theme-color" content="#1e3a8a">
  <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><text x='50' y='65' font-size='50' text-anchor='middle' fill='white'>ME</text></svg>">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%232563eb'/><text x='50' y='65' font-size='50' text-anchor='middle' fill='white'>ME</text></svg>">

  <!-- KaTeX Math Renderer -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

  <!-- Confetti Celebration -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>

  <style>
    :root {
      --primary: #2563eb;
      --primary-light: #60a5fa;
      --primary-dark: #1d4ed8;
      --bg-app: #f8fafc;
      --bg-card: #ffffff;
      --bg-subtle: #f1f5f9;
      --border: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --success: #16a34a;
      --success-bg: rgba(22, 163, 74, 0.1);
      --danger: #dc2626;
      --danger-bg: rgba(220, 38, 38, 0.1);
      --warning: #d97706;
      --warning-bg: rgba(217, 119, 6, 0.1);
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.06);
      --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
      --radius: 16px;
      --radius-sm: 10px;
      --nav-height: 64px;
      --header-height: 58px;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    [data-theme="dark"] {
      --primary: #3b82f6;
      --primary-light: #93c5fd;
      --primary-dark: #1d4ed8;
      --bg-app: #0b1120;
      --bg-card: #172033;
      --bg-subtle: #0f172a;
      --border: #293548;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --success: #22c55e;
      --success-bg: rgba(34, 197, 94, 0.15);
      --danger: #ef4444;
      --danger-bg: rgba(239, 68, 68, 0.15);
      --warning: #f59e0b;
      --warning-bg: rgba(245, 158, 11, 0.15);
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
      --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.4);
      --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.5);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: var(--font-sans);
      background-color: var(--bg-app);
      color: var(--text-main);
      padding-top: calc(var(--header-height) + env(safe-area-inset-top));
      padding-bottom: calc(var(--nav-height) + 16px + env(safe-area-inset-bottom));
      min-height: 100vh;
      line-height: 1.5;
      font-size: 16px;
      user-select: none;
      -webkit-user-select: none;
    }

    /* Top Sticky Header */
    .app-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: calc(var(--header-height) + env(safe-area-inset-top));
      padding-top: env(safe-area-inset-top);
      background-color: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 1rem;
      padding-right: 1rem;
      z-index: 100;
      transition: background-color 0.2s, border-color 0.2s;
    }

    [data-theme="dark"] .app-header {
      background-color: rgba(23, 32, 51, 0.92);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 0.95rem;
      box-shadow: 0 2px 4px rgba(37,99,235,0.3);
    }

    .brand-title {
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: -0.3px;
    }

    .brand-subtitle {
      font-size: 0.7rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background-color: var(--bg-card);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.15s, transform 0.1s;
    }

    .icon-btn:active {
      transform: scale(0.92);
    }

    /* Fixed Bottom Navigation Dock */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: calc(var(--nav-height) + env(safe-area-inset-bottom));
      padding-bottom: env(safe-area-inset-bottom);
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 100;
      transition: background-color 0.2s, border-color 0.2s;
    }

    [data-theme="dark"] .bottom-nav {
      background-color: rgba(23, 32, 51, 0.95);
    }

    .nav-tab {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      transition: color 0.15s, transform 0.1s;
    }

    .nav-tab:active {
      transform: scale(0.92);
    }

    .nav-tab.active {
      color: var(--primary);
    }

    .nav-tab svg {
      width: 22px;
      height: 22px;
      transition: transform 0.15s;
    }

    .nav-tab.active svg {
      transform: translateY(-2px);
    }

    .nav-label {
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: -0.1px;
    }

    /* Mobile Views */
    .mobile-view {
      display: none;
      padding: 1rem;
      max-width: 640px;
      margin: 0 auto;
    }

    .mobile-view.active {
      display: block;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cards */
    .card {
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.15rem;
      box-shadow: var(--shadow-sm);
      margin-bottom: 1rem;
      transition: background-color 0.2s, border-color 0.2s;
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-primary { background: rgba(37,99,235,0.1); color: var(--primary); }
    .badge-success { background: var(--success-bg); color: var(--success); }
    .badge-warning { background: var(--warning-bg); color: var(--warning); }
    .badge-danger { background: var(--danger-bg); color: var(--danger); }

    /* Arena Header Status */
    .arena-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .timer-badge {
      font-family: monospace;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 8px;
      background: var(--bg-subtle);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .smartscore-pill {
      font-weight: 800;
      font-size: 0.85rem;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    /* Question Statement */
    .question-prompt {
      font-size: 1.05rem;
      line-height: 1.6;
      margin-bottom: 1.25rem;
      font-weight: 500;
      user-select: text;
      -webkit-user-select: text;
    }

    /* Answers Container */
    .answers-container {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-bottom: 1.25rem;
    }

    .option-btn {
      width: 100%;
      min-height: 54px;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-sm);
      border: 1.5px solid var(--border);
      background-color: var(--bg-card);
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 0.85rem;
      text-align: left;
      font-size: 0.98rem;
      cursor: pointer;
      transition: border-color 0.15s, background-color 0.15s, transform 0.08s;
      user-select: text;
      -webkit-user-select: text;
    }

    .option-btn:active {
      transform: scale(0.985);
    }

    .option-btn.selected {
      border-color: var(--primary);
      background-color: rgba(37,99,235,0.06);
      box-shadow: 0 0 0 1px var(--primary);
    }

    .option-btn.eliminated {
      opacity: 0.45;
      text-decoration: line-through;
      border-style: dashed;
      pointer-events: none;
    }

    .option-btn.correct-highlight {
      border-color: var(--success);
      background-color: var(--success-bg);
      font-weight: 600;
    }

    .option-badge {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background-color: var(--bg-subtle);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.82rem;
      color: var(--primary);
      flex-shrink: 0;
    }

    .option-btn.selected .option-badge {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .option-text {
      flex: 1;
      overflow-x: auto;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.8rem 1.25rem;
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s, transform 0.08s, opacity 0.15s;
    }

    .btn:active {
      transform: scale(0.97);
    }

    .btn-block {
      width: 100%;
    }

    .btn-primary {
      background-color: var(--primary);
      color: white;
      box-shadow: 0 2px 4px rgba(37,99,235,0.3);
    }

    .btn-outline {
      background-color: var(--bg-card);
      border: 1.5px solid var(--border);
      color: var(--text-main);
    }

    .btn-stuck {
      background-color: rgba(217, 119, 6, 0.1);
      color: var(--warning);
      border: 1px solid rgba(217, 119, 6, 0.3);
    }

    /* Feedback Banner */
    .feedback-banner {
      display: none;
      padding: 1.15rem;
      border-radius: var(--radius);
      margin-bottom: 1.25rem;
      animation: fadeIn 0.25s ease-out;
    }

    .feedback-banner.correct {
      background-color: var(--success-bg);
      border: 1.5px solid var(--success);
    }

    .feedback-banner.incorrect {
      background-color: var(--danger-bg);
      border: 1.5px solid var(--danger);
    }

    .feedback-banner.retry {
      background-color: rgba(37,99,235,0.08);
      border: 1.5px solid var(--primary-light);
    }

    .feedback-title {
      font-size: 1.05rem;
      font-weight: 800;
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .feedback-desc {
      font-size: 0.9rem;
      margin-bottom: 0.85rem;
      line-height: 1.5;
    }

    .feedback-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Walkthrough Derivation */
    .walkthrough-box {
      display: none;
      background-color: var(--bg-card);
      border: 2px solid var(--warning);
      border-radius: var(--radius);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      animation: fadeIn 0.3s ease;
      user-select: text;
      -webkit-user-select: text;
    }

    .walkthrough-box.visible {
      display: block;
    }

    .walkthrough-header {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--warning);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
    }

    .walkthrough-step {
      margin-bottom: 1rem;
      padding-left: 0.85rem;
      border-left: 3px solid var(--primary);
    }

    .step-title {
      font-weight: 800;
      font-size: 0.92rem;
      color: var(--primary);
      margin-bottom: 0.3rem;
    }

    .step-body {
      font-size: 0.9rem;
      line-height: 1.7;
      white-space: pre-line;
      overflow-x: auto;
    }

    .exam-tip-box {
      background-color: var(--bg-subtle);
      border-radius: var(--radius-sm);
      padding: 0.85rem;
      border-left: 3px solid var(--warning);
      font-size: 0.85rem;
      margin-top: 0.85rem;
    }

    .exam-tip-title {
      font-weight: 800;
      color: var(--warning);
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    /* Mobile Scratchpad Floating & Drawer */
    .scratchpad-fab {
      position: fixed;
      right: 1rem;
      bottom: calc(var(--nav-height) + 1rem + env(safe-area-inset-bottom));
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      border: none;
      box-shadow: 0 4px 10px rgba(37,99,235,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 90;
      transition: transform 0.15s;
    }

    .scratchpad-fab:active {
      transform: scale(0.9);
    }

    .scratchpad-sheet {
      display: none;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--bg-card);
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border-top: 1px solid var(--border);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
      z-index: 150;
      padding: 1rem;
      padding-bottom: calc(1rem + env(safe-area-inset-bottom));
      animation: slideUp 0.25s ease-out;
    }

    .scratchpad-sheet.active {
      display: block;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    .scratchpad-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .scratchpad-canvas-wrapper {
      width: 100%;
      height: 280px;
      border-radius: 12px;
      border: 1.5px solid var(--border);
      background-color: var(--bg-app);
      overflow: hidden;
      touch-action: none;
    }

    #mobile-scratch-canvas {
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
    }

    /* Modal / Bottom Sheet for Share */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 200;
      align-items: flex-end;
      justify-content: center;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-sheet {
      background: var(--bg-card);
      width: 100%;
      max-width: 500px;
      border-top-left-radius: 24px;
      border-top-right-radius: 24px;
      padding: 1.5rem;
      padding-bottom: calc(1.5rem + env(safe-area-inset-bottom));
      box-shadow: var(--shadow-lg);
      animation: slideUp 0.25s ease-out;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .modal-title {
      font-size: 1.2rem;
      font-weight: 800;
    }

    /* Skills Grid on Mobile */
    .unit-accordion {
      margin-bottom: 0.75rem;
    }

    .unit-header-btn {
      width: 100%;
      padding: 1rem;
      border-radius: var(--radius-sm);
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      text-align: left;
    }

    .skill-item {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    /* Mock Exam */
    .duration-chips {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      margin-bottom: 1.25rem;
      -webkit-overflow-scrolling: touch;
    }

    .duration-chip {
      padding: 0.5rem 0.85rem;
      border-radius: 20px;
      border: 1px solid var(--border);
      background-color: var(--bg-card);
      color: var(--text-main);
      font-size: 0.85rem;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
    }

    .duration-chip.active {
      background-color: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .exam-nav-pills {
      display: flex;
      gap: 0.4rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    .exam-pill {
      min-width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      font-size: 0.82rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
    }

    .exam-pill.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .exam-pill.answered {
      border-color: var(--success);
      color: var(--success);
    }

    /* Search & Filter Bar */
    .search-bar {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      border: 1.5px solid var(--border);
      background-color: var(--bg-card);
      color: var(--text-main);
      font-size: 0.95rem;
      margin-bottom: 0.85rem;
    }

    .search-bar:focus {
      outline: none;
      border-color: var(--primary);
    }

    /* Formula Cards */
    .formula-card {
      padding: 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background-color: var(--bg-card);
      margin-bottom: 0.75rem;
    }

    .formula-name {
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--primary);
      margin-bottom: 0.4rem;
    }

    .formula-math {
      overflow-x: auto;
      padding: 0.35rem 0;
      font-size: 1.05rem;
    }

    .formula-note {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
      font-style: italic;
    }
  </style>
</head>
<body>

  <!-- Top Sticky Header -->
  <header class="app-header">
    <div class="brand">
      <div class="brand-icon">ME</div>
      <div>
        <div class="brand-title">ME-IXL</div>
        <div class="brand-subtitle">Exam 1 Prep</div>
      </div>
    </div>

    <div class="header-actions">
      <button class="icon-btn" onclick="sessionStorage.setItem('prefer_desktop','true'); window.location.href='index.html';" title="Switch to Full Desktop View">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </button>
      <button class="icon-btn" id="m-sound-btn" onclick="toggleSound()" title="Toggle Sound">
        <svg id="m-sound-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
        </svg>
      </button>
      <button class="icon-btn" id="m-theme-btn" onclick="toggleTheme()" title="Toggle Dark/Light Mode">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </button>
      <button class="icon-btn" onclick="openShareModal()" title="Share App">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
      </button>
    </div>
  </header>

  <!-- VIEW 1: Practice Arena -->
  <main id="view-practice" class="mobile-view active">
    <div class="arena-status">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="badge badge-primary" id="m-unit-tag">Unit 1</span>
        <span class="badge badge-warning" id="m-difficulty-badge">Standard</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <div class="timer-badge" id="m-problem-timer">⏱️ 0:00</div>
        <div class="smartscore-pill" id="m-smartscore">⭐ 0</div>
      </div>
    </div>

    <div class="card">
      <h3 style="font-size: 0.85rem; color: var(--text-muted); font-weight: 700; margin-bottom: 0.5rem;" id="m-skill-title">Cubic Critical Numbers</h3>
      <div class="question-prompt" id="m-question-prompt">
        Loading problem...
      </div>

      <div class="answers-container" id="m-answers-container">
        <!-- Options injected here -->
      </div>

      <div class="feedback-banner" id="m-feedback-banner">
        <div class="feedback-title" id="m-feedback-title"></div>
        <div class="feedback-desc" id="m-feedback-desc"></div>
        <div class="feedback-actions" id="m-feedback-actions"></div>
      </div>

      <div style="display: flex; gap: 0.6rem; margin-top: 1rem;">
        <button class="btn btn-primary btn-block" id="m-submit-btn" onclick="submitAnswer()">Submit Answer</button>
        <button class="btn btn-outline" id="m-skip-btn" onclick="skipProblem()" title="Skip Problem">Skip →</button>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem;">
        <button class="btn btn-stuck" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" id="m-stuck-btn" onclick="showWalkthroughRequested()">Stuck? Walkthrough</button>
        <button class="btn btn-outline" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="toggleScratchpad()">✏️ Scratchpad</button>
      </div>
    </div>

    <!-- Walkthrough Box -->
    <div class="walkthrough-box" id="m-walkthrough-box">
      <div class="walkthrough-header">
        📖 Step-by-Step Mathematical Derivation
      </div>
      <div id="m-walkthrough-content"></div>
      <div class="exam-tip-box" id="m-exam-tip-box" style="display: none;">
        <div class="exam-tip-title">⚡ Key Exam Strategy:</div>
        <div id="m-exam-tip-content"></div>
      </div>
    </div>
  </main>

  <!-- VIEW 2: Skills & Units Grid -->
  <main id="view-skills" class="mobile-view">
    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 1.3rem; font-weight: 800;">Course Skills</h2>
        <p style="font-size: 0.8rem; color: var(--text-muted);">23 skills across 7 exam units</p>
      </div>
      <button class="btn btn-outline" style="padding: 0.4rem 0.75rem; font-size: 0.8rem;" onclick="startRandomPractice()">Quick Practice Any</button>
    </div>

    <div id="m-skills-container"></div>
  </main>

  <!-- VIEW 3: Mock Exam Simulation -->
  <main id="view-exam" class="mobile-view">
    <div class="card" id="m-exam-setup-card">
      <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.35rem;">Exam 1 Simulation</h2>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">10 distinct questions covering all 7 course units.</p>

      <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.5rem;">Select Time Allowed:</div>
      <div class="duration-chips">
        <button class="duration-chip active" data-mins="45" onclick="setMobileExamDuration(45)">🎯 45 min</button>
        <button class="duration-chip" data-mins="30" onclick="setMobileExamDuration(30)">⏱️ 30 min</button>
        <button class="duration-chip" data-mins="15" onclick="setMobileExamDuration(15)">⚡ 15 min</button>
        <button class="duration-chip" data-mins="60" onclick="setMobileExamDuration(60)">🕒 60 min</button>
        <button class="duration-chip" data-mins="0" onclick="setMobileExamDuration(0)">♾️ Untimed</button>
      </div>

      <button class="btn btn-primary btn-block" onclick="startMobileExam()">Begin Exam 1 Simulation →</button>
    </div>

    <!-- Active Exam Container -->
    <div id="m-exam-active-card" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <div class="timer-badge" id="m-exam-countdown" style="font-size: 1rem;">45:00</div>
        <button class="btn btn-outline" style="padding: 0.35rem 0.7rem; font-size: 0.8rem;" id="m-exam-pause-btn" onclick="toggleExamPause()">⏸️ Pause</button>
      </div>

      <div class="exam-nav-pills" id="m-exam-pills">
        <!-- 1..10 Pills -->
      </div>

      <div class="card" id="m-exam-question-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 800; color: var(--primary);" id="m-exam-q-num">QUESTION 1 OF 10</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;" id="m-exam-q-tag">Unit 1</span>
        </div>
        <div class="question-prompt" id="m-exam-prompt"></div>
        <div class="answers-container" id="m-exam-answers"></div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <button class="btn btn-outline" id="m-exam-prev-btn" onclick="prevMobileExamQ()">← Prev</button>
          <button class="btn btn-primary" id="m-exam-next-btn" onclick="nextMobileExamQ()">Next →</button>
        </div>
      </div>

      <button class="btn btn-primary btn-block" style="background-color: var(--success); margin-top: 0.5rem;" onclick="finishMobileExam()">Submit Exam & View Report</button>
    </div>

    <!-- Exam Results Container -->
    <div id="m-exam-results-card" style="display: none;">
      <!-- Diagnostic Results injected here -->
    </div>
  </main>

  <!-- VIEW 4: Expanded Problem Bank -->
  <main id="view-bank" class="mobile-view">
    <div style="margin-bottom: 1rem;">
      <h2 style="font-size: 1.3rem; font-weight: 800;">Problem Bank</h2>
      <p style="font-size: 0.8rem; color: var(--text-muted);">85 problems with step-by-step proofs</p>
    </div>

    <input type="text" class="search-bar" id="m-bank-search" placeholder="🔍 Search problems (e.g. Taylor, Lagrange, Fourier)..." oninput="filterMobileBank()">

    <div id="m-bank-container"></div>
  </main>

  <!-- VIEW 5: Formula Cheat Sheet -->
  <main id="view-formulas" class="mobile-view">
    <div style="margin-bottom: 1rem;">
      <h2 style="font-size: 1.3rem; font-weight: 800;">Formula Cheat Sheet</h2>
      <p style="font-size: 0.8rem; color: var(--text-muted);">53 high-yield exam formulas</p>
    </div>

    <input type="text" class="search-bar" id="m-formula-search" placeholder="🔍 Search formulas (e.g. Euler, Vieta, Parseval)..." oninput="filterMobileFormulas()">

    <div id="m-formulas-container"></div>
  </main>

  <!-- Scratchpad Floating Action Button & Bottom Sheet -->
  <button class="scratchpad-fab" onclick="toggleScratchpad()" title="Open Scratchpad">✏️</button>

  <div class="scratchpad-sheet" id="m-scratchpad-sheet">
    <div class="scratchpad-header">
      <div style="font-weight: 800; font-size: 1rem;">✏️ Touch Scratchpad</div>
      <div style="display: flex; gap: 0.4rem;">
        <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" id="m-pen-btn" onclick="setMobileScratch('pen')">Pen</button>
        <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" id="m-eraser-btn" onclick="setMobileScratch('eraser')">Eraser</button>
        <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="clearMobileScratch()">Clear</button>
        <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick="toggleScratchpad()">✕</button>
      </div>
    </div>
    <div class="scratchpad-canvas-wrapper">
      <canvas id="mobile-scratch-canvas"></canvas>
    </div>
  </div>

  <!-- Share & Install Modal Sheet -->
  <div class="modal-overlay" id="m-share-modal" onclick="closeShareModal(event)">
    <div class="modal-sheet" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div class="modal-title">📱 Share & Use on Phone</div>
        <button class="icon-btn" onclick="closeShareModal()">✕</button>
      </div>

      <div style="font-size: 0.95rem; margin-bottom: 1.25rem; color: var(--text-muted);">
        You do <strong>not</strong> need internet hosting to share or use this app! Choose any method below:
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
        <button class="btn btn-primary btn-block" onclick="triggerNativeShare()">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          Share via Text / AirDrop / WhatsApp
        </button>

        <button class="btn btn-outline btn-block" onclick="downloadAppFile()">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download mobile.html File to Phone
        </button>
      </div>

      <div class="card" style="padding: 1rem; background-color: var(--bg-subtle); margin-bottom: 0;">
        <div style="font-weight: 800; font-size: 0.85rem; margin-bottom: 0.4rem; color: var(--primary);">📲 Save to Home Screen (100% Offline App):</div>
        <ul style="font-size: 0.8rem; line-height: 1.5; padding-left: 1.2rem; color: var(--text-muted);">
          <li><strong>iPhone (Safari):</strong> Tap Share icon ⎋ at bottom &rarr; scroll & tap <strong>"Add to Home Screen" ⊞</strong>.</li>
          <li><strong>Android (Chrome):</strong> Tap Menu ⋮ at top right &rarr; tap <strong>"Add to Home screen"</strong>.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Bottom Navigation Dock -->
  <nav class="bottom-nav">
    <button class="nav-tab active" id="tab-practice" onclick="switchMobileView('practice')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      <span class="nav-label">Practice</span>
    </button>
    <button class="nav-tab" id="tab-skills" onclick="switchMobileView('skills')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
      <span class="nav-label">Skills</span>
    </button>
    <button class="nav-tab" id="tab-exam" onclick="switchMobileView('exam')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      <span class="nav-label">Mock Exam</span>
    </button>
    <button class="nav-tab" id="tab-bank" onclick="switchMobileView('bank')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
      <span class="nav-label">Bank</span>
    </button>
    <button class="nav-tab" id="tab-formulas" onclick="switchMobileView('formulas')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
      <span class="nav-label">Formulas</span>
    </button>
  </nav>

  <!-- Embedded Problem Bank & Application Logic -->
  <script>
${bankCode}

const CURRICULUM = ${curriculumCode};

const FORMULA_SECTIONS = ${formulaCode};

/* Mobile Application Engine State */
const APP_STATE = {
  currentSkillId: "s1_2",
  currentProblem: null,
  selectedOptionIndex: null,
  answered: false,
  isRetry: false,
  eliminatedIndices: [],
  smartScores: {},
  streak: 0,
  totalSolved: 0,
  soundEnabled: true,
  skillQueues: {},
  lastProblemIdBySkill: {},
  problemTimer: {
    seconds: 0,
    running: false,
    interval: null
  },
  problemTimes: {},
  totalPracticeSeconds: 0,
  examMode: {
    active: false,
    timer: null,
    durationMinutes: 45,
    isUntimed: false,
    secondsLeft: 2700,
    elapsedSeconds: 0,
    isPaused: false,
    questions: [],
    currentIndex: 0,
    userAnswers: []
  }
};

/* Format and Shuffling */
function formatProblem(base) {
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }
  const shuffledOptions = indices.map(i => base.options[i]);
  const newCorrectIndex = indices.indexOf(base.correctIndex);

  let skillName = base.skillId;
  let unitTag = base.unitId;
  CURRICULUM.forEach(u => {
    if (u.id === base.unitId) {
      unitTag = u.title.split(':')[0];
      const sk = u.skills.find(s => s.id === base.skillId);
      if (sk) skillName = sk.name;
    }
  });

  return {
    ...base,
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
    skillName: skillName,
    unitTag: unitTag
  };
}

function getProblemForSkill(skillId) {
  if (!APP_STATE.skillQueues[skillId] || APP_STATE.skillQueues[skillId].length === 0) {
    const matching = EXPANDED_QUESTION_BANK.filter(q => q.skillId === skillId);
    if (matching.length === 0) return formatProblem(EXPANDED_QUESTION_BANK[0]);
    const shuffled = [...matching];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const lastId = APP_STATE.lastProblemIdBySkill[skillId];
    if (shuffled.length > 1 && shuffled[0].id === lastId) {
      const temp = shuffled[0];
      shuffled[0] = shuffled[shuffled.length - 1];
      shuffled[shuffled.length - 1] = temp;
    }
    APP_STATE.skillQueues[skillId] = shuffled;
  }
  const base = APP_STATE.skillQueues[skillId].shift();
  APP_STATE.lastProblemIdBySkill[skillId] = base.id;
  return formatProblem(base);
}

/* Audio Synthesis */
function playSuccessChime() {
  if (!APP_STATE.soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
}

function playIncorrectSound() {
  if (!APP_STATE.soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

function toggleSound() {
  APP_STATE.soundEnabled = !APP_STATE.soundEnabled;
  try { localStorage.setItem("me_ixl_sound", APP_STATE.soundEnabled ? "1" : "0"); } catch (e) {}
  updateSoundUI();
}

function updateSoundUI() {
  const btn = document.getElementById("m-sound-btn");
  if (!btn) return;
  btn.title = APP_STATE.soundEnabled ? "Sound: On" : "Sound: Off";
  btn.innerHTML = APP_STATE.soundEnabled
    ? '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>'
    : '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>';
}

function toggleTheme() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  const next = isDark ? "light" : "dark";
  if (next === "dark") document.body.setAttribute("data-theme", "dark");
  else document.body.removeAttribute("data-theme");
  try { localStorage.setItem("me_ixl_theme", next); } catch (e) {}
  updateThemeUI();
}

function updateThemeUI() {
  const btn = document.getElementById("m-theme-btn");
  if (!btn) return;
  const isDark = document.body.getAttribute("data-theme") === "dark";
  btn.innerHTML = isDark
    ? '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
    : '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
}

/* Problem Stopwatch */
function startProblemTimer() {
  if (APP_STATE.problemTimer.interval) clearInterval(APP_STATE.problemTimer.interval);
  APP_STATE.problemTimer.seconds = 0;
  APP_STATE.problemTimer.running = true;
  updateProblemTimerUI();
  APP_STATE.problemTimer.interval = setInterval(() => {
    if (APP_STATE.problemTimer.running) {
      APP_STATE.problemTimer.seconds++;
      updateProblemTimerUI();
    }
  }, 1000);
}

function updateProblemTimerUI() {
  const el = document.getElementById("m-problem-timer");
  if (!el) return;
  const s = APP_STATE.problemTimer.seconds;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  el.innerText = '⏱️ ' + m + ':' + (rem < 10 ? '0' : '') + rem;
}

function stopProblemTimer() {
  APP_STATE.problemTimer.running = false;
  if (APP_STATE.problemTimer.interval) clearInterval(APP_STATE.problemTimer.interval);
  return APP_STATE.problemTimer.seconds;
}

/* KaTeX Render Helper */
function renderMath(targetElement, retries = 3) {
  const mathRenderer = (typeof window !== "undefined" && window.renderMathInElement) 
    ? window.renderMathInElement 
    : (typeof renderMathInElement === "function" ? renderMathInElement : null);

  if (mathRenderer) {
    const el = targetElement || document.body;
    try {
      mathRenderer(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\\\[", right: "\\\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\\\(", right: "\\\\)", display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX render warning:", e);
    }
  } else if (retries > 0 && typeof setTimeout === "function") {
    setTimeout(() => renderMath(targetElement, retries - 1), 100);
  }
}

/* Practice Arena Rendering */
function displayProblem(prob) {
  APP_STATE.currentProblem = prob;
  APP_STATE.answered = false;
  APP_STATE.isRetry = false;
  APP_STATE.eliminatedIndices = [];
  APP_STATE.selectedOptionIndex = null;

  startProblemTimer();

  document.getElementById("m-unit-tag").innerText = prob.unitTag || "Unit 1";
  document.getElementById("m-difficulty-badge").innerText = prob.difficulty || "Standard";
  document.getElementById("m-skill-title").innerText = prob.skillName || prob.title;
  document.getElementById("m-question-prompt").innerHTML = prob.prompt;

  const score = APP_STATE.smartScores[APP_STATE.currentSkillId] || 0;
  document.getElementById("m-smartscore").innerText = "⭐ " + score;

  const container = document.getElementById("m-answers-container");
  container.innerHTML = "";
  prob.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.id = "m-opt-" + idx;
    btn.innerHTML = 
      '<div class="option-badge">' + String.fromCharCode(65 + idx) + '</div>' +
      '<div class="option-text">' + opt + '</div>';
    btn.onclick = () => selectOption(idx);
    container.appendChild(btn);
  });

  const banner = document.getElementById("m-feedback-banner");
  banner.className = "feedback-banner";
  banner.style.display = "none";

  const box = document.getElementById("m-walkthrough-box");
  box.className = "walkthrough-box";
  box.style.display = "none";

  const submitBtn = document.getElementById("m-submit-btn");
  submitBtn.style.display = "block";
  submitBtn.disabled = false;
  submitBtn.innerText = "Submit Answer";

  const skipBtn = document.getElementById("m-skip-btn");
  skipBtn.style.display = "block";

  const stuckBtn = document.getElementById("m-stuck-btn");
  stuckBtn.style.display = "inline-flex";

  renderMath(document.getElementById("view-practice"));
}

function selectOption(idx) {
  if (APP_STATE.answered) return;
  if (APP_STATE.eliminatedIndices.includes(idx)) return;
  APP_STATE.selectedOptionIndex = idx;
  const btns = document.querySelectorAll(".option-btn");
  btns.forEach((b, i) => {
    if (i === idx) b.classList.add("selected");
    else b.classList.remove("selected");
  });
}

function submitAnswer() {
  if (APP_STATE.answered) return;
  if (APP_STATE.selectedOptionIndex === null) {
    alert("Please tap an answer option before submitting!");
    return;
  }

  const elapsed = stopProblemTimer();
  APP_STATE.answered = true;
  APP_STATE.totalSolved++;
  const prob = APP_STATE.currentProblem;
  const isCorrect = (APP_STATE.selectedOptionIndex === prob.correctIndex);

  const banner = document.getElementById("m-feedback-banner");
  const title = document.getElementById("m-feedback-title");
  const desc = document.getElementById("m-feedback-desc");
  const actions = document.getElementById("m-feedback-actions");

  let score = APP_STATE.smartScores[APP_STATE.currentSkillId] || 0;

  if (isCorrect) {
    APP_STATE.streak++;
    let points = APP_STATE.isRetry ? 5 : 10;
    score = Math.min(100, score + points);
    APP_STATE.smartScores[APP_STATE.currentSkillId] = score;
    document.getElementById("m-smartscore").innerText = "⭐ " + score;

    banner.className = "feedback-banner correct";
    banner.style.display = "block";
    title.innerHTML = "🎉 Correct! Outstanding!";
    desc.innerHTML = (APP_STATE.isRetry ? "Solved on 2nd attempt (+5 pts). " : "Solved correctly (+10 pts). ") + "Time: " + elapsed + "s.";

    actions.innerHTML = 
      '<button class="btn btn-outline" style="font-size: 0.85rem;" onclick="viewSolutionRequested()">📖 Review Proof</button>' +
      '<button class="btn btn-primary" style="font-size: 0.85rem;" onclick="loadNextProblem()">Next Problem →</button>';

    const correctBtn = document.getElementById("m-opt-" + prob.correctIndex);
    if (correctBtn) correctBtn.classList.add("correct-highlight");

    playSuccessChime();
    if (typeof confetti === "function") confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });

    document.getElementById("m-submit-btn").style.display = "none";
    document.getElementById("m-skip-btn").style.display = "none";
    document.getElementById("m-stuck-btn").style.display = "none";

  } else {
    APP_STATE.streak = 0;
    score = Math.max(0, score - 5);
    APP_STATE.smartScores[APP_STATE.currentSkillId] = score;
    document.getElementById("m-smartscore").innerText = "⭐ " + score;

    const wrongIdx = APP_STATE.selectedOptionIndex;
    APP_STATE.eliminatedIndices.push(wrongIdx);
    const wrongBtn = document.getElementById("m-opt-" + wrongIdx);
    if (wrongBtn) {
      wrongBtn.classList.remove("selected");
      wrongBtn.classList.add("eliminated");
    }

    banner.className = "feedback-banner incorrect";
    banner.style.display = "block";
    title.innerHTML = "❌ Option " + String.fromCharCode(65 + wrongIdx) + " is Incorrect";
    desc.innerHTML = "Would you like to retry for partial credit, or view the step-by-step solution?";

    actions.innerHTML = 
      '<button class="btn btn-outline" style="border-color: var(--primary); color: var(--primary); font-size: 0.85rem;" onclick="retryQuestion()">🔄 Retry Question</button>' +
      '<button class="btn btn-stuck" style="font-size: 0.85rem;" onclick="viewSolutionRequested()">📖 View Solution</button>' +
      '<button class="btn btn-outline" style="font-size: 0.85rem;" onclick="loadNextProblem()">Next →</button>';

    playIncorrectSound();

    document.getElementById("m-submit-btn").style.display = "none";
    document.getElementById("m-skip-btn").style.display = "none";
    document.getElementById("m-stuck-btn").style.display = "none";
  }

  saveMobileState();
}

function retryQuestion() {
  APP_STATE.answered = false;
  APP_STATE.isRetry = true;
  APP_STATE.selectedOptionIndex = null;

  APP_STATE.problemTimer.running = true;
  APP_STATE.problemTimer.interval = setInterval(() => {
    if (APP_STATE.problemTimer.running) {
      APP_STATE.problemTimer.seconds++;
      updateProblemTimerUI();
    }
  }, 1000);

  const banner = document.getElementById("m-feedback-banner");
  banner.className = "feedback-banner retry";
  banner.style.display = "block";
  document.getElementById("m-feedback-title").innerHTML = "💡 Second Chance";
  document.getElementById("m-feedback-desc").innerHTML = "Incorrect option is eliminated. Select another choice and tap Submit!";
  document.getElementById("m-feedback-actions").innerHTML = '<button class="btn btn-stuck" style="font-size: 0.8rem;" onclick="viewSolutionRequested()">View Solution if Stuck</button>';

  const submitBtn = document.getElementById("m-submit-btn");
  submitBtn.style.display = "block";
  submitBtn.disabled = false;
  submitBtn.innerText = "Submit 2nd Attempt";

  document.getElementById("m-skip-btn").style.display = "block";
}

function renderWalkthrough() {
  const prob = APP_STATE.currentProblem;
  const content = document.getElementById("m-walkthrough-content");
  content.innerHTML = "";
  prob.walkthrough.forEach((step, idx) => {
    const div = document.createElement("div");
    div.className = "walkthrough-step";
    div.innerHTML = 
      '<div class="step-title">Step ' + (idx + 1) + ': ' + step.title + '</div>' +
      '<div class="step-body">' + step.body + '</div>';
    content.appendChild(div);
  });

  const tipBox = document.getElementById("m-exam-tip-box");
  const tipContent = document.getElementById("m-exam-tip-content");
  if (prob.examTip) {
    tipBox.style.display = "block";
    tipContent.innerHTML = prob.examTip;
  } else {
    tipBox.style.display = "none";
  }

  const box = document.getElementById("m-walkthrough-box");
  renderMath(box);
}

function viewSolutionRequested() {
  renderWalkthrough();
  const box = document.getElementById("m-walkthrough-box");
  box.classList.add("visible");
  box.style.display = "block";
  box.scrollIntoView({ behavior: 'smooth' });
}

function showWalkthroughRequested() {
  if (confirm("Viewing the full walkthrough before submitting will not earn SmartScore points. Continue?")) {
    stopProblemTimer();
    APP_STATE.answered = true;
    renderWalkthrough();
    const box = document.getElementById("m-walkthrough-box");
    box.classList.add("visible");
    box.style.display = "block";
    box.scrollIntoView({ behavior: 'smooth' });

    const correctBtn = document.getElementById("m-opt-" + APP_STATE.currentProblem.correctIndex);
    if (correctBtn) correctBtn.classList.add("correct-highlight");

    const banner = document.getElementById("m-feedback-banner");
    banner.className = "feedback-banner retry";
    banner.style.display = "block";
    document.getElementById("m-feedback-title").innerHTML = "📖 Walkthrough Unlocked";
    document.getElementById("m-feedback-desc").innerHTML = "Study the full mathematical steps below, then move to the next question.";
    document.getElementById("m-feedback-actions").innerHTML = '<button class="btn btn-primary btn-block" onclick="loadNextProblem()">Next Problem →</button>';

    document.getElementById("m-submit-btn").style.display = "none";
    document.getElementById("m-skip-btn").style.display = "none";
    document.getElementById("m-stuck-btn").style.display = "none";
  }
}

function loadNextProblem() {
  const prob = getProblemForSkill(APP_STATE.currentSkillId);
  displayProblem(prob);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function skipProblem() {
  loadNextProblem();
}

function loadSpecificProblem(probId) {
  const base = EXPANDED_QUESTION_BANK.find(q => q.id === probId);
  if (!base) return;
  APP_STATE.currentSkillId = base.skillId;
  switchMobileView('practice');
  displayProblem(formatProblem(base));
}

/* Skills View Rendering */
function renderMobileSkills() {
  const container = document.getElementById("m-skills-container");
  container.innerHTML = "";
  CURRICULUM.forEach(u => {
    const card = document.createElement("div");
    card.className = "card";
    let skillsHtml = "";
    u.skills.forEach(sk => {
      const score = APP_STATE.smartScores[sk.id] || 0;
      skillsHtml += 
        '<div class="skill-item">' +
          '<div>' +
            '<div style="font-size: 0.9rem; font-weight: 700;">' + sk.name + '</div>' +
            '<div style="font-size: 0.72rem; color: var(--text-muted);">' + sk.ref + ' • SmartScore: <strong>' + score + '/100</strong></div>' +
          '</div>' +
          '<button class="btn btn-primary" style="padding: 0.35rem 0.7rem; font-size: 0.78rem;" onclick="startSkillPractice(\\'' + sk.id + '\\')">Practice</button>' +
        '</div>';
    });
    card.innerHTML = 
      '<div style="font-size: 0.95rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem;">' + u.title + '</div>' +
      '<div style="border-radius: var(--radius-sm); border: 1px solid var(--border); overflow: hidden;">' +
        skillsHtml +
      '</div>';
    container.appendChild(card);
  });
}

function startSkillPractice(skillId) {
  APP_STATE.currentSkillId = skillId;
  switchMobileView('practice');
  displayProblem(getProblemForSkill(skillId));
}

function startRandomPractice() {
  const allSkills = [];
  CURRICULUM.forEach(u => u.skills.forEach(s => allSkills.push(s.id)));
  const randSkill = allSkills[Math.floor(Math.random() * allSkills.length)];
  startSkillPractice(randSkill);
}

/* Mock Exam Simulation */
function setMobileExamDuration(mins) {
  APP_STATE.examMode.durationMinutes = mins;
  APP_STATE.examMode.isUntimed = (mins === 0);
  document.querySelectorAll(".duration-chip").forEach(chip => {
    const chipMins = parseInt(chip.getAttribute("data-mins"), 10);
    if (chipMins === mins) chip.classList.add("active");
    else chip.classList.remove("active");
  });
}

function startMobileExam() {
  // Select 10 balanced questions spanning all 7 units
  const selected = [];
  const unitGroups = {};
  EXPANDED_QUESTION_BANK.forEach(q => {
    if (!unitGroups[q.unitId]) unitGroups[q.unitId] = [];
    unitGroups[q.unitId].push(q);
  });

  // Pick 1 from each of the 7 units
  Object.keys(unitGroups).forEach(uId => {
    const list = unitGroups[uId];
    const picked = list[Math.floor(Math.random() * list.length)];
    selected.push(formatProblem(picked));
  });

  // Pick 3 more distinct questions
  const remaining = EXPANDED_QUESTION_BANK.filter(q => !selected.some(s => s.id === q.id));
  for (let i = 0; i < 3 && remaining.length > 0; i++) {
    const idx = Math.floor(Math.random() * remaining.length);
    selected.push(formatProblem(remaining.splice(idx, 1)[0]));
  }

  APP_STATE.examMode.active = true;
  APP_STATE.examMode.questions = selected;
  APP_STATE.examMode.currentIndex = 0;
  APP_STATE.examMode.userAnswers = new Array(selected.length).fill(undefined);
  APP_STATE.examMode.isPaused = false;
  APP_STATE.examMode.elapsedSeconds = 0;
  APP_STATE.examMode.secondsLeft = APP_STATE.examMode.durationMinutes * 60;

  document.getElementById("m-exam-setup-card").style.display = "none";
  document.getElementById("m-exam-results-card").style.display = "none";
  document.getElementById("m-exam-active-card").style.display = "block";

  if (APP_STATE.examMode.timer) clearInterval(APP_STATE.examMode.timer);
  if (!APP_STATE.examMode.isUntimed) {
    APP_STATE.examMode.timer = setInterval(() => {
      if (!APP_STATE.examMode.isPaused) {
        APP_STATE.examMode.secondsLeft--;
        APP_STATE.examMode.elapsedSeconds++;
        updateMobileExamTimer();
        if (APP_STATE.examMode.secondsLeft <= 0) {
          clearInterval(APP_STATE.examMode.timer);
          alert("Time is up! Submitting your exam now.");
          finishMobileExam();
        }
      }
    }, 1000);
  } else {
    APP_STATE.examMode.timer = setInterval(() => {
      if (!APP_STATE.examMode.isPaused) {
        APP_STATE.examMode.elapsedSeconds++;
        updateMobileExamTimer();
      }
    }, 1000);
  }

  renderMobileExamQuestion();
}

function updateMobileExamTimer() {
  const el = document.getElementById("m-exam-countdown");
  if (!el) return;
  if (APP_STATE.examMode.isUntimed) {
    const s = APP_STATE.examMode.elapsedSeconds;
    el.innerText = '⏱️ Untimed (' + Math.floor(s/60) + ':' + (s%60 < 10 ? '0' : '') + (s%60) + ')';
  } else {
    const s = APP_STATE.examMode.secondsLeft;
    el.innerText = '⏱️ ' + Math.floor(s/60) + ':' + (s%60 < 10 ? '0' : '') + (s%60);
    if (s <= 300) el.style.color = "var(--danger)";
    else el.style.color = "var(--text-main)";
  }
}

function toggleExamPause() {
  if (!APP_STATE.examMode.active) return;
  APP_STATE.examMode.isPaused = !APP_STATE.examMode.isPaused;
  const btn = document.getElementById("m-exam-pause-btn");
  if (btn) btn.innerText = APP_STATE.examMode.isPaused ? "▶️ Resume" : "⏸️ Pause";
  document.getElementById("m-exam-question-card").style.opacity = APP_STATE.examMode.isPaused ? "0.3" : "1";
  document.getElementById("m-exam-question-card").style.pointerEvents = APP_STATE.examMode.isPaused ? "none" : "auto";
}

function renderMobileExamQuestion() {
  const idx = APP_STATE.examMode.currentIndex;
  const q = APP_STATE.examMode.questions[idx];
  const total = APP_STATE.examMode.questions.length;

  // Render pills
  const pillsContainer = document.getElementById("m-exam-pills");
  pillsContainer.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const pill = document.createElement("button");
    pill.className = "exam-pill" + (i === idx ? " active" : "") + (APP_STATE.examMode.userAnswers[i] !== undefined ? " answered" : "");
    pill.innerText = i + 1;
    pill.onclick = () => { APP_STATE.examMode.currentIndex = i; renderMobileExamQuestion(); };
    pillsContainer.appendChild(pill);
  }

  document.getElementById("m-exam-q-num").innerText = "QUESTION " + (idx + 1) + " OF " + total;
  document.getElementById("m-exam-q-tag").innerText = q.unitTag || q.unitId;
  document.getElementById("m-exam-prompt").innerHTML = q.prompt;

  const answersContainer = document.getElementById("m-exam-answers");
  answersContainer.innerHTML = "";
  q.options.forEach((opt, oIdx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (APP_STATE.examMode.userAnswers[idx] === oIdx ? " selected" : "");
    btn.innerHTML = 
      '<div class="option-badge">' + String.fromCharCode(65 + oIdx) + '</div>' +
      '<div class="option-text">' + opt + '</div>';
    btn.onclick = () => {
      APP_STATE.examMode.userAnswers[idx] = oIdx;
      renderMobileExamQuestion();
    };
    answersContainer.appendChild(btn);
  });

  document.getElementById("m-exam-prev-btn").disabled = (idx === 0);
  document.getElementById("m-exam-next-btn").disabled = (idx === total - 1);

  renderMath(document.getElementById("m-exam-question-card"));
}

function prevMobileExamQ() {
  if (APP_STATE.examMode.currentIndex > 0) {
    APP_STATE.examMode.currentIndex--;
    renderMobileExamQuestion();
  }
}

function nextMobileExamQ() {
  if (APP_STATE.examMode.currentIndex < APP_STATE.examMode.questions.length - 1) {
    APP_STATE.examMode.currentIndex++;
    renderMobileExamQuestion();
  }
}

function finishMobileExam() {
  if (APP_STATE.examMode.timer) clearInterval(APP_STATE.examMode.timer);
  APP_STATE.examMode.active = false;

  let correctCount = 0;
  const breakdown = [];
  APP_STATE.examMode.questions.forEach((q, idx) => {
    const userAns = APP_STATE.examMode.userAnswers[idx];
    const isCorrect = (userAns === q.correctIndex);
    if (isCorrect) correctCount++;

    let walkthroughHtml = "";
    q.walkthrough.forEach(step => {
      walkthroughHtml += 
        '<div style="margin-bottom: 0.6rem; padding-left: 0.6rem; border-left: 3px solid var(--primary);">' +
          '<div style="font-weight: 700; color: var(--primary); font-size: 0.85rem;">' + step.title + '</div>' +
          '<div class="step-body" style="font-size: 0.82rem; line-height: 1.6;">' + step.body + '</div>' +
        '</div>';
    });
    if (q.examTip) {
      walkthroughHtml += '<div class="exam-tip-box" style="font-size: 0.8rem;"><strong>Strategy:</strong> ' + q.examTip + '</div>';
    }

    breakdown.push({
      num: idx + 1,
      name: q.title,
      unit: q.unitId.toUpperCase(),
      isCorrect: isCorrect,
      correctAnswer: q.options[q.correctIndex],
      userAnswer: userAns !== undefined ? q.options[userAns] : "Not answered",
      walkthroughHtml: walkthroughHtml
    });
  });

  const total = APP_STATE.examMode.questions.length;
  const pct = Math.round((correctCount / total) * 100);

  document.getElementById("m-exam-active-card").style.display = "none";
  const resultsCard = document.getElementById("m-exam-results-card");
  resultsCard.style.display = "block";

  resultsCard.innerHTML = 
    '<div class="card" style="text-align: center; padding: 1.5rem;">' +
      '<h2 style="font-size: 2rem; font-weight: 900; color: var(--primary); margin-bottom: 0.25rem;">' + pct + '%</h2>' +
      '<div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.5rem;">' + (pct >= 80 ? '🎉 Ready for Exam 1!' : '📚 Keep Reviewing!') + '</div>' +
      '<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">You answered <strong>' + correctCount + ' of ' + total + '</strong> questions correctly.</p>' +
      '<button class="btn btn-primary btn-block" onclick="startMobileExam()">Retake Exam Simulation</button>' +
    '</div>' +

    '<h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.75rem;">Question Breakdown & Solutions</h3>' +
    '<div style="display: flex; flex-direction: column; gap: 0.6rem;">' +
      breakdown.map(b => 
        '<div class="card" style="margin-bottom: 0; padding: 0.9rem; border-left: 4px solid ' + (b.isCorrect ? 'var(--success)' : 'var(--danger)') + ';">' +
          '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">' +
            '<span style="font-size: 0.85rem; font-weight: 800;">Q' + b.num + ': ' + b.name + '</span>' +
            '<span class="badge ' + (b.isCorrect ? 'badge-success' : 'badge-danger') + '">' + (b.isCorrect ? 'Correct' : 'Missed') + '</span>' +
          '</div>' +
          '<div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">Your Answer: ' + b.userAnswer + '<br>Correct: ' + b.correctAnswer + '</div>' +
          '<details style="cursor: pointer;">' +
            '<summary style="font-size: 0.8rem; font-weight: 700; color: var(--primary); padding: 0.2rem 0;">📖 View Step-by-Step Proof</summary>' +
            '<div style="margin-top: 0.5rem; padding: 0.75rem; background: var(--bg-subtle); border-radius: 8px;">' +
              b.walkthroughHtml +
            '</div>' +
          '</details>' +
        '</div>'
      ).join('') +
    '</div>';

  renderMath(resultsCard);
}

/* Problem Bank Filtering & Display */
function filterMobileBank() {
  const query = (document.getElementById("m-bank-search")?.value || "").toLowerCase().trim();
  const container = document.getElementById("m-bank-container");
  container.innerHTML = "";

  const filtered = EXPANDED_QUESTION_BANK.filter(q => 
    !query || 
    q.title.toLowerCase().includes(query) || 
    q.prompt.toLowerCase().includes(query) ||
    q.unitId.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div class="card" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching problems found.</div>';
    return;
  }

  filtered.slice(0, 35).forEach(q => {
    const card = document.createElement("div");
    card.className = "card";

    let stepsHtml = "";
    q.walkthrough.forEach(s => {
      stepsHtml += 
        '<div style="margin-bottom: 0.6rem; padding-left: 0.6rem; border-left: 3px solid var(--primary);">' +
          '<div style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">' + s.title + '</div>' +
          '<div class="step-body" style="font-size: 0.82rem; line-height: 1.6;">' + s.body + '</div>' +
        '</div>';
    });

    card.innerHTML = 
      '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">' +
        '<span class="badge badge-primary">' + q.unitId.toUpperCase() + '</span>' +
        '<button class="btn btn-primary" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" onclick="loadSpecificProblem(\\'' + q.id + '\\')">Practice in Arena →</button>' +
      '</div>' +
      '<div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.4rem;">' + q.title + '</div>' +
      '<div style="font-size: 0.88rem; line-height: 1.5; margin-bottom: 0.75rem;">' + q.prompt + '</div>' +
      '<details style="cursor: pointer;">' +
        '<summary style="font-size: 0.82rem; font-weight: 700; color: var(--primary);">📖 Show Verified Derivation (' + q.walkthrough.length + ' Steps)</summary>' +
        '<div style="margin-top: 0.6rem; padding: 0.75rem; background: var(--bg-subtle); border-radius: 8px;">' +
          stepsHtml +
        '</div>' +
      '</details>';
    container.appendChild(card);
  });

  renderMath(container);
}

/* Formula Sheet */
function filterMobileFormulas() {
  const query = (document.getElementById("m-formula-search")?.value || "").toLowerCase().trim();
  const container = document.getElementById("m-formulas-container");
  container.innerHTML = "";

  FORMULA_SECTIONS.forEach(sec => {
    const matchingFormulas = sec.formulas.filter(f => 
      !query || 
      f.name.toLowerCase().includes(query) || 
      (f.note && f.note.toLowerCase().includes(query))
    );

    if (matchingFormulas.length === 0) return;

    const div = document.createElement("div");
    div.style.marginBottom = "1.25rem";
    div.innerHTML = '<h3 style="font-size: 1.05rem; font-weight: 800; color: var(--primary); margin-bottom: 0.6rem;">' + sec.title + '</h3>' +
      matchingFormulas.map(f => 
        '<div class="formula-card">' +
          '<div class="formula-name">' + f.name + '</div>' +
          '<div class="formula-math">' + f.formula + '</div>' +
          (f.note ? '<div class="formula-note">💡 ' + f.note + '</div>' : '') +
        '</div>'
      ).join('');
    container.appendChild(div);
  });

  renderMath(container);
}

/* View Switcher */
function switchMobileView(viewName) {
  document.querySelectorAll(".mobile-view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));

  const viewEl = document.getElementById("view-" + viewName);
  if (viewEl) viewEl.classList.add("active");
  const tabEl = document.getElementById("tab-" + viewName);
  if (tabEl) tabEl.classList.add("active");

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewName === "skills") renderMobileSkills();
  else if (viewName === "bank") filterMobileBank();
  else if (viewName === "formulas") filterMobileFormulas();

  renderMath(viewEl || document.body);
}

/* Touch Scratchpad */
let scratchCanvas, scratchCtx, scratchDrawing = false, scratchMode = 'pen';
function initMobileScratch() {
  scratchCanvas = document.getElementById("mobile-scratch-canvas");
  if (!scratchCanvas) return;
  const rect = scratchCanvas.getBoundingClientRect();
  scratchCanvas.width = rect.width * (window.devicePixelRatio || 1);
  scratchCanvas.height = rect.height * (window.devicePixelRatio || 1);
  scratchCtx = scratchCanvas.getContext("2d");
  scratchCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const getPos = (e) => {
    const r = scratchCanvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };

  const start = (e) => {
    e.preventDefault();
    scratchDrawing = true;
    const pos = getPos(e);
    scratchCtx.beginPath();
    scratchCtx.moveTo(pos.x, pos.y);
  };

  const move = (e) => {
    if (!scratchDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    scratchCtx.lineWidth = scratchMode === 'eraser' ? 22 : 2.5;
    scratchCtx.lineCap = 'round';
    scratchCtx.lineJoin = 'round';
    if (scratchMode === 'eraser') {
      scratchCtx.globalCompositeOperation = 'destination-out';
    } else {
      scratchCtx.globalCompositeOperation = 'source-over';
      const isDark = document.body.getAttribute("data-theme") === "dark";
      scratchCtx.strokeStyle = isDark ? '#93c5fd' : '#2563eb';
    }
    scratchCtx.lineTo(pos.x, pos.y);
    scratchCtx.stroke();
  };

  const stop = () => { scratchDrawing = false; };

  scratchCanvas.addEventListener('touchstart', start, { passive: false });
  scratchCanvas.addEventListener('touchmove', move, { passive: false });
  scratchCanvas.addEventListener('touchend', stop);

  scratchCanvas.addEventListener('mousedown', start);
  scratchCanvas.addEventListener('mousemove', move);
  scratchCanvas.addEventListener('mouseup', stop);
}

function toggleScratchpad() {
  const sheet = document.getElementById("m-scratchpad-sheet");
  const isActive = sheet.classList.toggle("active");
  if (isActive && !scratchCtx) {
    setTimeout(initMobileScratch, 50);
  }
}

function setMobileScratch(mode) {
  scratchMode = mode;
  document.getElementById("m-pen-btn").style.background = mode === 'pen' ? 'var(--primary)' : 'var(--bg-card)';
  document.getElementById("m-pen-btn").style.color = mode === 'pen' ? 'white' : 'var(--text-main)';
  document.getElementById("m-eraser-btn").style.background = mode === 'eraser' ? 'var(--primary)' : 'var(--bg-card)';
  document.getElementById("m-eraser-btn").style.color = mode === 'eraser' ? 'white' : 'var(--text-main)';
}

function clearMobileScratch() {
  if (!scratchCanvas || !scratchCtx) return;
  scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
}

/* Share & Install Handlers */
function openShareModal() {
  document.getElementById("m-share-modal").classList.add("active");
}

function closeShareModal(e) {
  if (!e || e.target === document.getElementById("m-share-modal") || !e.target.closest('.modal-sheet')) {
    document.getElementById("m-share-modal").classList.remove("active");
  }
}

function triggerNativeShare() {
  if (navigator.share) {
    navigator.share({
      title: 'ME-IXL: Exam 1 Mastery Mobile App',
      text: 'Here is the ME-IXL Exam 1 study platform! Includes 85 problems with step-by-step proofs & formula sheet.',
      url: window.location.href
    }).catch(() => {});
  } else {
    // Copy URL or alert
    navigator.clipboard.writeText(window.location.href);
    alert("App link copied to clipboard! Paste it into a text message or chat.");
  }
}

function downloadAppFile() {
  // Generates standalone blob for direct download
  const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ME_Exam1_Mobile_App.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* State Persistence */
function saveMobileState() {
  try {
    localStorage.setItem("ME_IXL_MOBILE_STATE", JSON.stringify({
      smartScores: APP_STATE.smartScores,
      totalSolved: APP_STATE.totalSolved,
      streak: APP_STATE.streak
    }));
  } catch (e) {}
}

function loadMobileState() {
  try {
    const savedTheme = localStorage.getItem("me_ixl_theme");
    if (savedTheme === "dark") document.body.setAttribute("data-theme", "dark");
    const savedSound = localStorage.getItem("me_ixl_sound");
    if (savedSound !== null) APP_STATE.soundEnabled = (savedSound === "1");
    updateThemeUI();
    updateSoundUI();

    const saved = localStorage.getItem("ME_IXL_MOBILE_STATE");
    if (saved) {
      const parsed = JSON.parse(saved);
      APP_STATE.smartScores = parsed.smartScores || {};
      APP_STATE.totalSolved = parsed.totalSolved || 0;
      APP_STATE.streak = parsed.streak || 0;
    }
  } catch (e) {}
}

/* On Load */
window.addEventListener("DOMContentLoaded", () => {
  loadMobileState();
  const initProb = getProblemForSkill("s1_2");
  displayProblem(initProb);
});
  </script>
</body>
</html>
`;

fs.writeFileSync('mobile.html', mobileHtml, 'utf8');
console.log("Successfully generated mobile.html! File size:", mobileHtml.length);
