// verify_new_problems_and_mixed.js
// Exhaustive verification of all 33 new problems and the Mixed Question Section across Desktop & Mobile
const fs = require('fs');
const vm = require('vm');

console.log("================================================================================");
console.log("VERIFYING NEW PROBLEMS AND MIXED PRACTICE SYSTEM (DESKTOP & MOBILE)");
console.log("================================================================================\n");

// 1. Load problem_bank.js and app.js
let bankCode = fs.readFileSync('problem_bank.js', 'utf8')
  .replace('const EXPANDED_QUESTION_BANK =', 'var EXPANDED_QUESTION_BANK =');

let appCode = fs.readFileSync('app.js', 'utf8')
  .replace('const CURRICULUM =', 'var CURRICULUM =')
  .replace('const APP_STATE =', 'var APP_STATE =')
  .replace('const FORMULA_SECTIONS =', 'var FORMULA_SECTIONS =');

// Setup DOM mocks for Desktop
function createMockDesktopDOM() {
  const elements = {};
  function getEl(id) {
    if (!elements[id]) {
      elements[id] = {
        id,
        innerText: '',
        _innerHTML: '',
        get innerHTML() { return this._innerHTML; },
        set innerHTML(val) {
          this._innerHTML = val;
          if (val === '') this.children = [];
        },
        value: '',
        style: { display: '', setProperty: () => {} },
        classList: {
          _set: new Set(),
          add(c) { this._set.add(c); },
          remove(c) { this._set.delete(c); },
          contains(c) { return this._set.has(c); },
          toggle(c) { if (this._set.has(c)) { this._set.delete(c); return false; } else { this._set.add(c); return true; } }
        },
        children: [],
        appendChild(ch) {
          this.children.push(ch);
          this._innerHTML += (ch.innerHTML || '');
        },
        querySelectorAll: () => [],
        scrollIntoView: () => {},
        setAttribute: () => {},
        removeAttribute: () => {},
        getAttribute: () => null
      };
    }
    return elements[id];
  }

  const dom = {
    document: {
      getElementById: (id) => getEl(id),
      querySelectorAll: (sel) => [],
      createElement: (tag) => getEl('mock_' + Math.random()),
      body: getEl('body'),
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
      renderMathInElement: () => {},
      alert: (msg) => { dom._lastAlert = msg; },
      confirm: () => true
    },
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = v; }
    },
    alert: (msg) => { dom._lastAlert = msg; },
    console: console,
    setTimeout: (fn) => fn(),
    setInterval: () => 123,
    clearInterval: () => {}
  };
  return dom;
}

const desktopSandbox = createMockDesktopDOM();
const desktopCtx = vm.createContext(desktopSandbox);
vm.runInContext(bankCode, desktopCtx);
vm.runInContext(appCode, desktopCtx);

const bank = desktopCtx.EXPANDED_QUESTION_BANK;
const curriculum = desktopCtx.CURRICULUM;

console.log(`[BANK STATS] Total questions in bank: ${bank.length}`);
console.log(`[CURRICULUM STATS] Total units: ${curriculum.length}`);
let totalSkills = 0;
curriculum.forEach(u => totalSkills += u.skills.length);
console.log(`[CURRICULUM STATS] Total skills: ${totalSkills}`);

if (bank.length !== 128) throw new Error(`Expected 128 problems, got ${bank.length}`);
if (curriculum.length !== 8) throw new Error(`Expected 8 units, got ${curriculum.length}`);
if (totalSkills !== 35) throw new Error(`Expected 35 skills, got ${totalSkills}`);

console.log("✓ Core repository dimensions verified: 128 problems, 8 units, 35 skills.\n");

// -----------------------------------------------------------------------------
// PART 1: VERIFY ALL 43 RECENT ADVANCED PROBLEMS
// -----------------------------------------------------------------------------
console.log("--------------------------------------------------------------------------------");
console.log("PART 1: VERIFYING EACH OF THE 43 NEW ADVANCED PROBLEMS");
console.log("--------------------------------------------------------------------------------");

const newProblemIds = [
  // Unit 2: Advanced Engineering Optimization & Physical Extrema (10 problems)
  "q2_opt_beam_strength",
  "q2_opt_beam_stiffness",
  "q2_opt_truss_weight",
  "q2_opt_snell_fermat",
  "q2_opt_pipe_diameter",
  "q2_opt_critical_insulation",
  "q2_opt_lamp_illuminance",
  "q2_opt_elliptic_paraboloid_dist",
  "q2_opt_cobb_douglas_budget",
  "q2_opt_paraboloid_plane_dual",
  // Unit 2: Lagrange Multipliers Deep Dive (6 problems)
  "q2_lagrange_box",
  "q2_lagrange_linear_sphere",
  "q2_lagrange_point_plane_dist",
  "q2_lagrange_two_constraints",
  "q2_lagrange_ellipsoid_box",
  "q2_lagrange_cylinder_tank",
  // Unit 4: Inner Products, Projections & Orthogonal Sets (6 problems)
  "q4_inner_proj_decomp",
  "q4_gram_schmidt_poly",
  "q4_function_angle_cauchy",
  "q4_trig_orthogonality_gen",
  "q4_inner_prod_axioms",
  "q4_fourier_bessel_inequality",
  // Unit 6: Scalar & Vector Triple Products (5 problems)
  "q6_triple_vol_parallelepiped",
  "q6_triple_coplanar_test",
  "q6_triple_baccab_identity",
  "q6_triple_cyclic_invariance",
  "q6_triple_tetrahedron_vol",
  // Unit 7: Plane Definitions & Intersections (8 problems)
  "q7_plane_three_points",
  "q7_plane_line_and_point",
  "q7_plane_parallel_dist",
  "q7_plane_intersect_line",
  "q7_plane_dihedral_angle",
  "q7_line_plane_pierce",
  "q7_line_plane_parallel_check",
  "q7_point_to_plane_distance",
  // Unit 8: Vector Differential Calculus (8 problems)
  "q8_normal_level_surface",
  "q8_normal_explicit_surface",
  "q8_div_eval_solenoidal",
  "q8_div_param_solenoidal",
  "q8_curl_conservative_field",
  "q8_curl_vorticity_rotation",
  "q8_identities_div_curl",
  "q8_laplacian_harmonic"
];

console.log(`Verifying list of ${newProblemIds.length} new problem IDs...`);

newProblemIds.forEach((id, index) => {
  const prob = bank.find(q => q.id === id);
  if (!prob) throw new Error(`Missing problem in bank: ${id}`);

  // Schema checks
  if (!prob.title || prob.title.length < 5) throw new Error(`Invalid title for ${id}`);
  if (!prob.prompt || prob.prompt.length < 15) throw new Error(`Invalid prompt for ${id}`);
  if (!Array.isArray(prob.options) || prob.options.length !== 4) throw new Error(`Problem ${id} does not have exactly 4 options`);
  if (typeof prob.correctIndex !== 'number' || prob.correctIndex < 0 || prob.correctIndex > 3) throw new Error(`Invalid correctIndex for ${id}`);
  if (!Array.isArray(prob.walkthrough) || prob.walkthrough.length < 2) throw new Error(`Problem ${id} has insufficient walkthrough steps`);
  if (!prob.examTip || prob.examTip.length < 10) throw new Error(`Problem ${id} missing examTip`);

  // Verify unit and skill exist in curriculum
  const unit = curriculum.find(u => u.id === prob.unitId);
  if (!unit) throw new Error(`Problem ${id} references unknown unitId: ${prob.unitId}`);
  const skill = unit.skills.find(s => s.id === prob.skillId);
  if (!skill) throw new Error(`Problem ${id} references unknown skillId: ${prob.skillId} in unit ${prob.unitId}`);

  // Test loading into Practice Arena via loadSpecificProblem
  desktopCtx.loadSpecificProblem(prob.id);
  const currentProb = desktopCtx.APP_STATE.currentProblem;
  if (!currentProb || currentProb.id !== prob.id) {
    throw new Error(`loadSpecificProblem failed to set currentProblem for ${id}`);
  }
  if (!currentProb.options || currentProb.options.length !== 4) {
    throw new Error(`loadSpecificProblem options corrupted for ${id}`);
  }
  // Verify correct answer is preserved after option shuffle
  if (currentProb.options[currentProb.correctIndex] !== prob.options[prob.correctIndex]) {
    throw new Error(`Correct answer corrupted after shuffling in ${id}`);
  }

  // Test walkthrough rendering
  desktopCtx.viewSolutionRequested();
  const wtContent = desktopSandbox.document.getElementById("walkthrough-content").innerHTML;
  if (!wtContent || wtContent.length < 50) {
    throw new Error(`Walkthrough content failed to render for ${id}`);
  }

  // Test skill generator returns this problem or another from this skill
  const skillProb = desktopCtx.getProblemForSkill(prob.skillId);
  if (!skillProb || skillProb.skillId !== prob.skillId) {
    throw new Error(`getProblemForSkill failed for skill: ${prob.skillId}`);
  }

  console.log(`  [${index + 1}/${newProblemIds.length}] ✓ ${id} | Unit: ${prob.unitId} (${prob.skillId}) | Title: "${prob.title}" | Steps: ${prob.walkthrough.length}`);
});

console.log(`\n✓ All ${newProblemIds.length} new problems verified with 100% schema integrity, valid curriculum mapping, and successful interactive rendering!`);

// -----------------------------------------------------------------------------
// PART 2: VERIFY BANK EXPLORER DISPLAY & FILTERING FOR NEW PROBLEMS
// -----------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("PART 2: VERIFYING BANK EXPLORER FILTERS (DESKTOP & MOBILE)");
console.log("--------------------------------------------------------------------------------");

// Desktop Bank Explorer Filter by Unit 8
desktopSandbox.document.getElementById("bank-unit-filter").value = "unit-8";
desktopSandbox.document.getElementById("bank-search-input").value = "";
desktopCtx.filterBankQuestions();
const bankContainerDesktop = desktopSandbox.document.getElementById("bank-questions-container");
console.log("Desktop bank questions container children after filtering Unit 8:", bankContainerDesktop.children.length);
if (bankContainerDesktop.children.length !== 8) {
  throw new Error(`Expected 8 questions for Unit 8 in Desktop bank, got ${bankContainerDesktop.children.length}`);
}
console.log("✓ Desktop Bank Explorer: Unit 8 filter correctly displays all 8 Vector Differential Calculus problems.");

// Desktop Bank Explorer Filter by Unit 2
desktopSandbox.document.getElementById("bank-unit-filter").value = "unit-2";
desktopCtx.filterBankQuestions();
console.log("Desktop bank questions container children after filtering Unit 2:", bankContainerDesktop.children.length);
if (bankContainerDesktop.children.length !== 30) {
  throw new Error(`Expected 30 questions for Unit 2 in Desktop bank, got ${bankContainerDesktop.children.length}`);
}
console.log("✓ Desktop Bank Explorer: Unit 2 filter correctly displays all 30 Constrained Optimization problems (including all 16 optimization deep dive questions).");

// Desktop Bank Search by keyword "Lagrange"
desktopSandbox.document.getElementById("bank-unit-filter").value = "ALL";
desktopSandbox.document.getElementById("bank-search-input").value = "lagrange";
desktopCtx.filterBankQuestions();
console.log("Desktop bank questions container children after search 'lagrange':", bankContainerDesktop.children.length);
if (bankContainerDesktop.children.length < 6) {
  throw new Error(`Expected at least 6 Lagrange questions, got ${bankContainerDesktop.children.length}`);
}
console.log(`✓ Desktop Bank Explorer: Search 'lagrange' returned ${bankContainerDesktop.children.length} matching problems.`);

// Mobile Bank Filtering
const mobileHtml = fs.readFileSync('mobile.html', 'utf8');
const mobileScriptMatch = mobileHtml.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
const mobileScript = mobileScriptMatch[1]
  .replace('const EXPANDED_QUESTION_BANK =', 'var EXPANDED_QUESTION_BANK =')
  .replace('const CURRICULUM =', 'var CURRICULUM =')
  .replace('const FORMULA_SECTIONS =', 'var FORMULA_SECTIONS =')
  .replace('const APP_STATE =', 'var APP_STATE =');

const mobileSandbox = createMockDesktopDOM();
const mobileCtx = vm.createContext(mobileSandbox);
vm.runInContext(mobileScript, mobileCtx);

// Test Mobile Bank Filter by Unit 8
mobileSandbox.document.getElementById("m-bank-unit-filter").value = "unit-8";
mobileSandbox.document.getElementById("m-bank-search").value = "";
mobileCtx.filterMobileBank();
const mBankContainer = mobileSandbox.document.getElementById("m-bank-container");
console.log("Mobile bank questions container children after filtering Unit 8:", mBankContainer.children.length);
if (mBankContainer.children.length !== 8) {
  throw new Error(`Expected 8 questions for Unit 8 in Mobile bank, got ${mBankContainer.children.length}`);
}
console.log("✓ Mobile Bank Explorer: Unit 8 filter correctly displays all 8 Vector Differential Calculus problems.");

// Test Mobile Bank Filter by Unit 7
mobileSandbox.document.getElementById("m-bank-unit-filter").value = "unit-7";
mobileCtx.filterMobileBank();
console.log("Mobile bank questions container children after filtering Unit 7:", mBankContainer.children.length);
if (mBankContainer.children.length !== 21) {
  throw new Error(`Expected 21 questions for Unit 7 in Mobile bank, got ${mBankContainer.children.length}`);
}
console.log("✓ Mobile Bank Explorer: Unit 7 filter correctly displays all 21 3D Lines & Planes problems (including all 8 new plane intersection problems).");

// -----------------------------------------------------------------------------
// PART 3: VERIFY MIXED QUESTION PRACTICE SECTION (DESKTOP)
// -----------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("PART 3: VERIFYING MIXED UNIT PRACTICE SECTION (DESKTOP)");
console.log("--------------------------------------------------------------------------------");

// 1. Verify renderMixedUnitPills renders all 8 pills
desktopCtx.renderMixedUnitPills();
const pillsContainer = desktopSandbox.document.getElementById("unit-pills-selector");
console.log(`Rendered unit pills count: ${pillsContainer.children.length}`);
if (pillsContainer.children.length !== 8) {
  throw new Error(`Expected 8 unit pills rendered, got ${pillsContainer.children.length}`);
}
console.log("✓ All 8 unit pills rendered in Desktop selector.");

// 2. Test Select All & Clear All
desktopCtx.selectAllMixedUnits(false);
if (desktopCtx.APP_STATE.mixedPractice.selectedUnits.length !== 0) {
  throw new Error("Clear all did not empty selectedUnits");
}
console.log("✓ Clear All successfully emptied selectedUnits (0 units).");

desktopCtx.selectAllMixedUnits(true);
if (desktopCtx.APP_STATE.mixedPractice.selectedUnits.length !== 8) {
  throw new Error("Select All did not select all 8 units");
}
console.log("✓ Select All successfully selected all 8 units.");

// 3. Test Guard against 0 units selected
desktopCtx.selectAllMixedUnits(false);
desktopSandbox._lastAlert = null;
desktopCtx.launchMixedPractice();
if (desktopCtx.APP_STATE.mixedPractice.active) {
  throw new Error("Mixed practice should not activate with 0 units selected");
}
if (!desktopSandbox._lastAlert) {
  throw new Error("Expected alert warning when launching mixed practice with 0 units");
}
console.log("✓ Guard verified: launchMixedPractice rejects 0 selected units with user alert.");

// 4. Test Selective Unit Toggling (e.g. Unit 2, Unit 7, Unit 8)
desktopCtx.selectAllMixedUnits(false);
desktopCtx.toggleMixedUnit("unit-2");
desktopCtx.toggleMixedUnit("unit-7");
desktopCtx.toggleMixedUnit("unit-8");
const activeUnits = desktopCtx.APP_STATE.mixedPractice.selectedUnits;
console.log("Active selected units:", activeUnits.join(', '));
if (activeUnits.length !== 3 || !activeUnits.includes("unit-2") || !activeUnits.includes("unit-7") || !activeUnits.includes("unit-8")) {
  throw new Error(`Expected Units 2, 7, 8 selected, got ${activeUnits.join(', ')}`);
}

// 5. Test Launch Mixed Practice
desktopCtx.launchMixedPractice();
if (!desktopCtx.APP_STATE.mixedPractice.active) {
  throw new Error("Mixed practice should be active after launchMixedPractice");
}
console.log("✓ Mixed Practice launched successfully. Active state:", desktopCtx.APP_STATE.mixedPractice.active);

// 6. Test Question Dispatching: 30 consecutive questions
console.log("\nSimulating 30 consecutive questions in Mixed Practice with Units 2, 7, 8...");
const served = [];
for (let i = 0; i < 30; i++) {
  const prob = desktopCtx.getNextMixedProblem();
  served.push(prob);
}

// Verify every question is from selected units
const invalidUnits = served.filter(q => !["unit-2", "unit-7", "unit-8"].includes(q.unitId));
if (invalidUnits.length > 0) {
  throw new Error(`Found questions outside selected units: ${invalidUnits.map(q => q.id + ' (' + q.unitId + ')').join(', ')}`);
}
console.log("✓ 100% of served problems belong to selected units (Units 2, 7, 8).");

// Verify consecutive questions alternate units
let topicAlternationViolations = 0;
for (let i = 1; i < served.length; i++) {
  if (served[i].unitId === served[i - 1].unitId) {
    topicAlternationViolations++;
  }
}
console.log(`Topic alternation violations across 30 questions: ${topicAlternationViolations}`);
if (topicAlternationViolations > 0) {
  throw new Error(`Expected zero consecutive questions from the same unit, found ${topicAlternationViolations}`);
}
console.log("✓ 100% Topic Alternation verified: Consecutive questions strictly alternate between Unit 2, Unit 7, and Unit 8!");

// Verify consecutive questions are not duplicate IDs
let duplicateViolations = 0;
for (let i = 1; i < served.length; i++) {
  if (served[i].id === served[i - 1].id) {
    duplicateViolations++;
  }
}
if (duplicateViolations > 0) {
  throw new Error(`Found consecutive duplicate problem IDs: ${duplicateViolations}`);
}
console.log("✓ No-repeat verified: Zero consecutive duplicate questions.");

// Show distribution across selected units
const countsByUnit = { "unit-2": 0, "unit-7": 0, "unit-8": 0 };
served.forEach(q => countsByUnit[q.unitId]++);
console.log("Distribution across 30 questions:", countsByUnit);
if (countsByUnit["unit-2"] < 6 || countsByUnit["unit-7"] < 6 || countsByUnit["unit-8"] < 6) {
  throw new Error("Distribution across selected units is unbalanced");
}
console.log("✓ Balanced distribution verified across selected units.");

// 7. Test In-Arena UI Banner
desktopCtx.updateMixedPracticeBannerUI();
const arenaBanner = desktopSandbox.document.getElementById("practice-mode-banner");
if (arenaBanner.style.display !== "flex") {
  throw new Error("Mixed practice active banner not displayed in arena");
}
console.log("✓ Active Mixed Practice Banner properly displayed in Practice Arena.");

// 8. Test Single Skill Mode Override
desktopCtx.loadSkillProblem("s1_2");
if (desktopCtx.APP_STATE.mixedPractice.active) {
  throw new Error("Practicing a specific skill should deactivate mixed practice mode");
}
if (arenaBanner.style.display !== "none") {
  throw new Error("Active Mixed Practice Banner should be hidden in single skill mode");
}
console.log("✓ Single Skill Practice successfully deactivates mixed mode and hides mixed banner.");

// -----------------------------------------------------------------------------
// PART 4: VERIFY MIXED QUESTION PRACTICE SECTION (MOBILE)
// -----------------------------------------------------------------------------
console.log("\n--------------------------------------------------------------------------------");
console.log("PART 4: VERIFYING MIXED UNIT PRACTICE SECTION (MOBILE)");
console.log("--------------------------------------------------------------------------------");

// 1. Verify renderMobileUnitPills
mobileCtx.renderMobileUnitPills();
const mPills = mobileSandbox.document.getElementById("m-unit-pills-selector");
console.log(`Rendered mobile unit pills count: ${mPills.children.length}`);
if (mPills.children.length !== 8) {
  throw new Error(`Expected 8 mobile unit pills, got ${mPills.children.length}`);
}
console.log("✓ All 8 unit pills rendered in Mobile selector.");

// 2. Test Mobile Selection: Unit 4, Unit 5, Unit 8
mobileCtx.selectAllMixedUnits(false);
mobileCtx.toggleMixedUnit("unit-4");
mobileCtx.toggleMixedUnit("unit-5");
mobileCtx.toggleMixedUnit("unit-8");
console.log("Mobile active units:", mobileCtx.APP_STATE.mixedPractice.selectedUnits.join(', '));
if (mobileCtx.APP_STATE.mixedPractice.selectedUnits.length !== 3) {
  throw new Error("Mobile unit selection count mismatch");
}

// 3. Launch Mobile Mixed Practice
mobileCtx.launchMixedPractice();
if (!mobileCtx.APP_STATE.mixedPractice.active) {
  throw new Error("Mobile mixed practice not active after launch");
}
console.log("✓ Mobile Mixed Practice launched successfully.");

// 4. Test 20 questions on Mobile
console.log("Testing 20 consecutive questions on Mobile with Units 4, 5, 8...");
const mServed = [];
for (let i = 0; i < 20; i++) {
  mServed.push(mobileCtx.getNextMixedProblem());
}
const mInvalid = mServed.filter(q => !["unit-4", "unit-5", "unit-8"].includes(q.unitId));
if (mInvalid.length > 0) {
  throw new Error("Found problems outside selected units in mobile");
}
console.log("✓ 100% of mobile served problems belong to selected units (Units 4, 5, 8).");

let mAltViolations = 0;
for (let i = 1; i < mServed.length; i++) {
  if (mServed[i].unitId === mServed[i - 1].unitId) mAltViolations++;
}
if (mAltViolations > 0) {
  throw new Error(`Mobile consecutive unit alternation violation: ${mAltViolations}`);
}
console.log("✓ 100% Mobile Topic Alternation verified!");

// 5. Single skill override on Mobile
mobileCtx.startSkillPractice("s1_1");
if (mobileCtx.APP_STATE.mixedPractice.active) {
  throw new Error("startSkillPractice on mobile did not deactivate mixed mode");
}
console.log("✓ Mobile startSkillPractice cleanly exits mixed mode.");

console.log("\n================================================================================");
console.log("ALL VERIFICATIONS COMPLETED SUCCESSFULLY WITH 100% PASS RATE!");
console.log("================================================================================");
