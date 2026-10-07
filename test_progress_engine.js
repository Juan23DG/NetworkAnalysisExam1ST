// test_progress_engine.js: Verifies the Unique Problems Solved progress engine on Desktop and Mobile
const fs = require('fs');
const vm = require('vm');

console.log("================================================================================");
console.log("TESTING UNIQUE PROBLEMS SOLVED PROGRESS ENGINE (DESKTOP & MOBILE)");
console.log("================================================================================\n");

// Helper to create a DOM mock
function createMockEnv(htmlContent) {
  const mockElements = {};
  function getOrCreateEl(id) {
    if (!mockElements[id]) {
      mockElements[id] = {
        id,
        innerText: '',
        innerHTML: '',
        style: { cssText: '', display: '', width: '', setProperty: () => {} },
        getAttribute: () => null,
        setAttribute: () => {},
        removeAttribute: () => {},
        classList: {
          _set: new Set(),
          add(...c) { c.forEach(x => this._set.add(x)); },
          remove(...c) { c.forEach(x => this._set.delete(x)); },
          contains(c) { return this._set.has(c); },
          toggle(c) { if (this._set.has(c)) { this._set.delete(c); return false; } else { this._set.add(c); return true; } }
        },
        children: [],
        appendChild(child) {
          this.children.push(child);
          this.innerHTML += child.innerHTML || '';
        },
        querySelectorAll: () => [],
        addEventListener: () => {},
        removeEventListener: () => {},
        getBoundingClientRect: () => ({ width: 360, height: 280, left: 0, top: 0 }),
        scrollIntoView: () => {}
      };
    }
    return mockElements[id];
  }

  const scriptMarkerStart = '<!-- Embedded problem bank and application engine for 100% standalone offline / file:/// compatibility -->';
  let scriptCode;
  if (htmlContent.includes(scriptMarkerStart)) {
    const afterMarker = htmlContent.substring(htmlContent.indexOf(scriptMarkerStart));
    const m = afterMarker.match(/<script>([\s\S]*?)<\/script>/);
    scriptCode = m ? m[1] : '';
  } else {
    const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/) || htmlContent.match(/<script>([\s\S]*?)<\/script>/);
    scriptCode = scriptMatch ? scriptMatch[1] : '';
  }
  if (!scriptCode) throw new Error("Could not find <script> block in HTML");

  const mockStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; }
  };

  const sandbox = {
    document: {
      getElementById: (id) => getOrCreateEl(id),
      querySelectorAll: () => [],
      createElement: (tag) => getOrCreateEl('mock_' + Math.random()),
      body: getOrCreateEl('body'),
      addEventListener: () => {}
    },
    window: {
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {},
      localStorage: mockStorage,
      devicePixelRatio: 2,
      AudioContext: class {
        constructor() { this.currentTime = 0; }
        createOscillator() { return { frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
        createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
      }
    },
    localStorage: mockStorage,
    sessionStorage: mockStorage,
    console: console,
    setTimeout: (fn) => fn(),
    setInterval: () => 123,
    clearInterval: () => {},
    alert: () => {},
    confirm: () => true
  };

  vm.createContext(sandbox);

  const executable = scriptCode
    .replace('const EXPANDED_QUESTION_BANK =', 'var EXPANDED_QUESTION_BANK =')
    .replace('const CURRICULUM =', 'var CURRICULUM =')
    .replace('const FORMULA_SECTIONS =', 'var FORMULA_SECTIONS =')
    .replace('const APP_STATE =', 'var APP_STATE =');

  vm.runInContext(executable, sandbox);
  return { sandbox, getOrCreateEl };
}

// -----------------------------------------------------------------------------
// PART 1: DESKTOP PROGRESS ENGINE
// -----------------------------------------------------------------------------
console.log("--- PART 1: Desktop (index.html) Progress Engine ---");
const desktopHtml = fs.readFileSync('index.html', 'utf8');
const desktop = createMockEnv(desktopHtml);
const dSandbox = desktop.sandbox;

// 1. Initial State
let overall = dSandbox.getOverallProgress();
console.log("Initial overall progress:", overall);
if (overall.total !== 140 || overall.solved !== 0 || overall.pct !== 0 || overall.isComplete !== false) {
  throw new Error("Initial overall progress should be 0 / 140 (0%)");
}
console.log("✓ Initial overall progress verified: 0 / 140 (0%).");

// 2. Skill Progress calculation
const s1_1_probs = dSandbox.getSkillProblems("s1_1");
console.log("Skill s1_1 total questions in bank:", s1_1_probs.length);
if (s1_1_probs.length !== 3) throw new Error("Expected 3 questions for s1_1");

let s1Prog = dSandbox.getSkillProgress("s1_1");
if (s1Prog.solved !== 0 || s1Prog.total !== 3 || s1Prog.isComplete !== false || s1Prog.unsolvedIds.length !== 3) {
  throw new Error("Initial s1_1 progress mismatch");
}
console.log("✓ Skill progress helper verified for s1_1: 0 / 3");

// 3. Unsolved Prioritization in Queue
console.log("\nTesting Unsolved Queue Prioritization for s1_1:");
dSandbox.APP_STATE.solvedProblemIds = ["q1_1_a"]; // mark 1 solved
dSandbox.APP_STATE.skillQueues = {}; // clear queue
const firstServed = dSandbox.getProblemForSkill("s1_1");
console.log("First question served with q1_1_a already solved:", firstServed.id);
if (firstServed.id === "q1_1_a") {
  throw new Error("Unsolved questions should be prioritized before solved questions!");
}
console.log("✓ Unsolved question correctly prioritized!");

// 4. Solving all questions in a skill
dSandbox.APP_STATE.solvedProblemIds = ["q1_1_a", "q1_1_b", "q1_1_c"];
s1Prog = dSandbox.getSkillProgress("s1_1");
console.log("Progress after solving all 3 questions:", s1Prog);
if (s1Prog.solved !== 3 || s1Prog.pct !== 100 || !s1Prog.isComplete || s1Prog.unsolvedIds.length !== 0) {
  throw new Error("Skill s1_1 should be 100% complete!");
}
console.log("✓ Topic Mastery verified: 3 / 3 (100% Complete)");

// 5. Unit Progress calculation
const u1Prog = dSandbox.getUnitProgress("unit-1");
console.log("Unit 1 progress with 3 questions solved:", u1Prog);
if (u1Prog.solved !== 3 || u1Prog.total !== 9 || u1Prog.pct !== 33 || u1Prog.isComplete !== false) {
  throw new Error("Unit 1 progress calculation mismatch");
}
console.log("✓ Unit progress calculation verified: 3 / 9 (33%)");

// 6. Interactive Answer Submission & Topic Completion Event
dSandbox.APP_STATE.solvedProblemIds = [];
dSandbox.APP_STATE.currentSkillId = "s1_1";
dSandbox.loadSkillProblem("s1_1");
const curProb = dSandbox.APP_STATE.currentProblem;
console.log("\nSimulating correct answer on current problem:", curProb.id);
dSandbox.selectOption(curProb.correctIndex);
dSandbox.submitAnswer();
if (!dSandbox.APP_STATE.solvedProblemIds.includes(curProb.id)) {
  throw new Error("Problem should be added to solvedProblemIds upon correct submission!");
}
console.log("✓ Correct answer registered in solvedProblemIds:", dSandbox.APP_STATE.solvedProblemIds);

// 7. State Persistence & Reloading
dSandbox.saveState();
const savedRaw = dSandbox.window.localStorage.getItem("ME_IXL_STATE");
if (!savedRaw) throw new Error("ME_IXL_STATE not found in localStorage");
const savedObj = JSON.parse(savedRaw);
if (!savedObj.solvedProblemIds || !savedObj.solvedProblemIds.includes(curProb.id)) {
  throw new Error("solvedProblemIds not persisted to localStorage");
}
console.log("✓ Desktop state persistence verified: solvedProblemIds saved to localStorage.");

// -----------------------------------------------------------------------------
// PART 2: MOBILE PROGRESS ENGINE
// -----------------------------------------------------------------------------
console.log("\n--- PART 2: Mobile (mobile.html) Progress Engine ---");
const mobileHtml = fs.readFileSync('mobile.html', 'utf8');
const mobile = createMockEnv(mobileHtml);
const mSandbox = mobile.sandbox;

// 1. Mobile Initial State
let mOverall = mSandbox.getOverallProgress();
console.log("Mobile initial overall progress:", mOverall);
if (mOverall.total !== 140 || mOverall.solved !== 0 || mOverall.pct !== 0 || mOverall.isComplete !== false) {
  throw new Error("Mobile initial overall progress should be 0 / 140");
}
console.log("✓ Mobile initial overall progress verified: 0 / 140 (0%).");

// 2. Mobile Queue prioritization
mSandbox.APP_STATE.solvedProblemIds = ["q1_2_a"];
mSandbox.APP_STATE.skillQueues = {};
const mFirstServed = mSandbox.getProblemForSkill("s1_2");
console.log("Mobile first served question with q1_2_a solved:", mFirstServed.id);
if (mFirstServed.id === "q1_2_a") {
  throw new Error("Mobile unsolved questions should be prioritized!");
}
console.log("✓ Mobile unsolved prioritization verified!");

// 3. Mobile Skill Progress & Mastery
const s1_2_probs = mSandbox.getSkillProblems("s1_2");
mSandbox.APP_STATE.solvedProblemIds = s1_2_probs.map(q => q.id);
const mS1_2Prog = mSandbox.getSkillProgress("s1_2");
console.log("Mobile s1_2 progress with all solved:", mS1_2Prog);
if (mS1_2Prog.solved !== s1_2_probs.length || mS1_2Prog.pct !== 100 || !mS1_2Prog.isComplete) {
  throw new Error("Mobile s1_2 should be 100% complete!");
}
console.log("✓ Mobile Topic Mastery verified!");

// 4. Mobile Interactive Answer Submission
mSandbox.APP_STATE.solvedProblemIds = [];
mSandbox.displayProblem(mSandbox.getProblemForSkill("s1_1"));
const mCurProb = mSandbox.APP_STATE.currentProblem;
mSandbox.selectOption(mCurProb.correctIndex);
mSandbox.submitAnswer();
if (!mSandbox.APP_STATE.solvedProblemIds.includes(mCurProb.id)) {
  throw new Error("Mobile problem should be added to solvedProblemIds upon correct submission!");
}
console.log("✓ Mobile correct answer registered in solvedProblemIds:", mSandbox.APP_STATE.solvedProblemIds);

// 5. Mobile State Persistence
mSandbox.saveMobileState();
const mSavedRaw = mSandbox.window.localStorage.getItem("ME_IXL_MOBILE_STATE");
if (!mSavedRaw) throw new Error("ME_IXL_MOBILE_STATE not found in localStorage");
const mSavedObj = JSON.parse(mSavedRaw);
if (!mSavedObj.solvedProblemIds || !mSavedObj.solvedProblemIds.includes(mCurProb.id)) {
  throw new Error("Mobile solvedProblemIds not persisted to localStorage");
}
console.log("✓ Mobile state persistence verified: solvedProblemIds saved to localStorage.");

// 6. Mobile Skills Grid Rendering
mSandbox.renderMobileSkills();
console.log("✓ Mobile Skills Grid rendered without errors.");

// 7. Mobile Bank Filtering
mSandbox.filterMobileBank();
console.log("✓ Mobile Bank filtering rendered without errors.");

console.log("\n================================================================================");
console.log("ALL PROGRESS ENGINE VERIFICATIONS PASSED WITH 100% SUCCESS!");
console.log("================================================================================\n");
