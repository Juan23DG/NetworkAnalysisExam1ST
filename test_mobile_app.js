// test_mobile_app.js: Validates mobile.html structure, question bank, and logic
const fs = require('fs');
const vm = require('vm');

console.log("=== TESTING MOBILE.HTML ===");

const mobileHtml = fs.readFileSync('mobile.html', 'utf8');

// 1. Check size and basic structure
console.log("File size:", mobileHtml.length, "bytes (~" + Math.round(mobileHtml.length / 1024) + " KB)");
if (mobileHtml.length < 200000) throw new Error("mobile.html seems too small, check embedding!");

// 2. Extract script block
const scriptMatch = mobileHtml.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
if (!scriptMatch) throw new Error("Could not find embedded <script> block in mobile.html");
const scriptCode = scriptMatch[1];

// 3. Mock DOM
const mockElements = {};
function getOrCreateEl(id) {
  if (!mockElements[id]) {
    mockElements[id] = {
      id,
      innerText: '',
      innerHTML: '',
      style: { display: '' },
      getAttribute: (k) => null,
      setAttribute: () => {},
      removeAttribute: () => {},
      classList: {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); },
        toggle(c) { if (this._set.has(c)) { this._set.delete(c); return false; } else { this._set.add(c); return true; } }
      },
      children: [],
      appendChild(child) {
        this.children.push(child);
        this.innerHTML += child.innerHTML || '';
      },
      querySelectorAll: () => [],
      getContext: () => ({
        clearRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        fill: () => {},
        scale: () => {}
      }),
      getBoundingClientRect: () => ({ width: 360, height: 280, left: 0, top: 0 }),
      scrollIntoView: () => {}
    };
  }
  return mockElements[id];
}

const sandbox = {
  document: {
    getElementById: (id) => getOrCreateEl(id),
    querySelectorAll: (sel) => [],
    createElement: (tag) => getOrCreateEl('mock_' + Math.random()),
    body: getOrCreateEl('body'),
    addEventListener: () => {}
  },
  window: {
    addEventListener: () => {},
    scrollTo: () => {},
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = v; }
    },
    devicePixelRatio: 2,
    AudioContext: class {
      constructor() { this.currentTime = 0; }
      createOscillator() { return { frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
      createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
    }
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; }
  },
  console: console,
  setTimeout: (fn) => fn(),
  setInterval: () => 123,
  clearInterval: () => {}
};

vm.createContext(sandbox);

// Convert top-level const to var for VM attachment
const executableScript = scriptCode
  .replace('const EXPANDED_QUESTION_BANK =', 'var EXPANDED_QUESTION_BANK =')
  .replace('const CURRICULUM =', 'var CURRICULUM =')
  .replace('const FORMULA_SECTIONS =', 'var FORMULA_SECTIONS =')
  .replace('const APP_STATE =', 'var APP_STATE =');

vm.runInContext(executableScript, sandbox);

console.log("✓ Script compiled and executed in sandbox successfully.");

// Check question bank
const bank = sandbox.EXPANDED_QUESTION_BANK;
console.log("Total problems in mobile bank:", bank.length);
if (bank.length !== 128) throw new Error(`Expected 128 problems, got ${bank.length}`);

// Check formulas
const formulas = sandbox.FORMULA_SECTIONS;
let totalFormulas = 0;
formulas.forEach(sec => totalFormulas += sec.formulas.length);
console.log("Total formulas in mobile sheet:", totalFormulas);
if (totalFormulas !== 76) throw new Error(`Expected 76 formulas, got ${totalFormulas}`);

// Test mobile functions
console.log("\n--- Testing Mobile Action Handlers ---");
sandbox.switchMobileView('practice');
console.log("✓ switchMobileView('practice') executed.");

sandbox.switchMobileView('skills');
console.log("✓ switchMobileView('skills') executed.");

sandbox.switchMobileView('exam');
console.log("✓ switchMobileView('exam') executed.");

sandbox.switchMobileView('bank');
console.log("✓ switchMobileView('bank') executed.");

sandbox.switchMobileView('formulas');
console.log("✓ switchMobileView('formulas') executed.");

sandbox.toggleSound();
console.log("✓ toggleSound() executed. Sound enabled:", sandbox.APP_STATE.soundEnabled);

sandbox.toggleTheme();
console.log("✓ toggleTheme() executed.");

// Test practice submission
sandbox.switchMobileView('practice');
sandbox.displayProblem(sandbox.getProblemForSkill("s1_1"));
console.log("✓ displayProblem executed. Current problem:", sandbox.APP_STATE.currentProblem.id);

// Submit incorrect answer
sandbox.selectOption((sandbox.APP_STATE.currentProblem.correctIndex + 1) % 4);
sandbox.submitAnswer();
console.log("✓ submitAnswer (incorrect) executed. Streak:", sandbox.APP_STATE.streak);

// Click view solution
sandbox.viewSolutionRequested();
console.log("✓ viewSolutionRequested executed.");

// Click retry
sandbox.retryQuestion();
console.log("✓ retryQuestion executed. Answered:", sandbox.APP_STATE.answered);

// Submit correct answer
sandbox.selectOption(sandbox.APP_STATE.currentProblem.correctIndex);
sandbox.submitAnswer();
console.log("✓ submitAnswer (correct) executed. Streak:", sandbox.APP_STATE.streak);

// Next problem
sandbox.loadNextProblem();
console.log("✓ loadNextProblem executed. New problem:", sandbox.APP_STATE.currentProblem.id);

// Test Mobile Mixed Practice
console.log("\n--- Testing Mobile Mixed Units Practice ---");
sandbox.selectAllMixedUnits(false);
sandbox.toggleMixedUnit("unit-2");
sandbox.toggleMixedUnit("unit-6");
sandbox.launchMixedPractice();
if (!sandbox.APP_STATE.mixedPractice.active) throw new Error("Mixed practice should be active");
console.log("✓ Mobile Mixed Practice launched with units:", sandbox.APP_STATE.mixedPractice.selectedUnits.join(', '));
sandbox.loadNextProblem();
const mProb = sandbox.APP_STATE.currentProblem;
if (!["unit-2", "unit-6"].includes(mProb.unitId)) {
  throw new Error(`Mobile mixed problem ${mProb.id} is from ${mProb.unitId}, not in selected units!`);
}
console.log("✓ Mobile Mixed Problem correctly served from:", mProb.unitId);

// Test Mobile Exam
console.log("\n--- Testing Mobile Mock Exam ---");
sandbox.setMobileExamDuration(30);
sandbox.startMobileExam();
console.log("✓ startMobileExam (30m) executed. Total exam questions:", sandbox.APP_STATE.examMode.questions.length);
if (sandbox.APP_STATE.examMode.questions.length !== 10) throw new Error("Exam questions should be 10");

sandbox.nextMobileExamQ();
sandbox.prevMobileExamQ();
sandbox.toggleExamPause();
sandbox.toggleExamPause();
sandbox.finishMobileExam();
console.log("✓ finishMobileExam executed.");

console.log("\n========================================");
console.log("ALL MOBILE TESTS PASSED WITH 100% SUCCESS!");
console.log("========================================");
