// implement_mixed_units_practice.js: Adds varied questions practice across selected units to desktop & mobile
const fs = require('fs');

console.log("Adding Mixed Unit Practice feature...");

// 1. Update app.js
let appCode = fs.readFileSync('app.js', 'utf8');

// In APP_STATE, add mixedPractice state
const appStateRegex = /const APP_STATE = \{[\s\S]*?examMode: \{[\s\S]*?\}\s*\};/;
const appStateMatch = appCode.match(appStateRegex);
if (!appStateMatch) throw new Error("Could not find APP_STATE in app.js");

let updatedAppState = appStateMatch[0].replace(
  'examMode: {',
  `mixedPractice: {
    active: false,
    selectedUnits: ["unit-1", "unit-2", "unit-3", "unit-4", "unit-5", "unit-6", "unit-7", "unit-8"],
    deck: [],
    lastProblemId: null,
    lastUnitId: null
  },
  examMode: {`
);

appCode = appCode.replace(appStateMatch[0], updatedAppState);

// Add Mixed Practice Logic Functions right above loadSkillProblem
const mixedFunctionsCode = `
/* ==========================================================================
   Mixed Units Practice Engine (Varied Topics from Selected Units)
   ========================================================================== */

function getMixedUnitsPool() {
  const units = APP_STATE.mixedPractice.selectedUnits || [];
  return EXPANDED_QUESTION_BANK.filter(q => units.includes(q.unitId));
}

function renderMixedUnitPills() {
  const containers = [
    document.getElementById("unit-pills-selector"),
    document.getElementById("modal-unit-pills-selector")
  ];
  
  const selected = new Set(APP_STATE.mixedPractice.selectedUnits || []);
  const pool = getMixedUnitsPool();
  
  // Update badge counters if present
  const countBadge = document.getElementById("mixed-units-count-badge");
  if (countBadge) {
    countBadge.innerText = selected.size + " of " + CURRICULUM.length + " Units (" + pool.length + " Problems)";
  }

  containers.forEach(container => {
    if (!container) return;
    container.innerHTML = "";

    CURRICULUM.forEach(u => {
      const isSel = selected.has(u.id);
      const unitNum = u.id.replace('unit-', '');
      const count = EXPANDED_QUESTION_BANK.filter(q => q.unitId === u.id).length;
      
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "unit-toggle-pill " + (isSel ? "active" : "");
      pill.setAttribute("data-unit", u.id);
      pill.onclick = () => toggleMixedUnit(u.id);
      
      pill.innerHTML = 
        '<span class="pill-check">' + (isSel ? "✓" : "+") + '</span>' +
        '<strong>Unit ' + unitNum + ':</strong> ' +
        '<span style="opacity: 0.9;">' + u.title.split(':')[1]?.trim() + '</span>' +
        '<span class="pill-count">(' + count + ')</span>';

      container.appendChild(pill);
    });
  });
}

function toggleMixedUnit(unitId) {
  const list = APP_STATE.mixedPractice.selectedUnits;
  const idx = list.indexOf(unitId);
  if (idx === -1) {
    list.push(unitId);
  } else {
    list.splice(idx, 1);
  }
  list.sort();
  APP_STATE.mixedPractice.deck = []; // Clear deck so next draws reflect new pool
  saveMixedUnitsPref();
  renderMixedUnitPills();
  updateMixedPracticeBannerUI();
}

function selectAllMixedUnits(selectAll) {
  if (selectAll) {
    APP_STATE.mixedPractice.selectedUnits = CURRICULUM.map(u => u.id);
  } else {
    APP_STATE.mixedPractice.selectedUnits = [];
  }
  APP_STATE.mixedPractice.deck = [];
  saveMixedUnitsPref();
  renderMixedUnitPills();
  updateMixedPracticeBannerUI();
}

function saveMixedUnitsPref() {
  try {
    localStorage.setItem("me_ixl_selected_units", JSON.stringify(APP_STATE.mixedPractice.selectedUnits));
  } catch (e) {}
}

function launchMixedPractice() {
  if (!APP_STATE.mixedPractice.selectedUnits || APP_STATE.mixedPractice.selectedUnits.length === 0) {
    alert("Please select at least one unit to practice!");
    return;
  }
  APP_STATE.mixedPractice.active = true;
  APP_STATE.mixedPractice.deck = [];
  switchView('practice-view');
  loadNextProblem();
}

function getNextMixedProblem() {
  const units = APP_STATE.mixedPractice.selectedUnits;
  if (!units || units.length === 0) {
    return getProblemForSkill(APP_STATE.currentSkillId);
  }

  if (!APP_STATE.mixedPractice.deck || APP_STATE.mixedPractice.deck.length === 0) {
    // Build an interleaved round-robin deck across all selected units to guarantee topic variety
    const byUnit = {};
    units.forEach(u => {
      byUnit[u] = EXPANDED_QUESTION_BANK.filter(q => q.unitId === u).sort(() => 0.5 - Math.random());
    });

    const interleaved = [];
    let added = true;
    const unitOrder = [...units].sort(() => 0.5 - Math.random());
    while (added) {
      added = false;
      for (const u of unitOrder) {
        if (byUnit[u] && byUnit[u].length > 0) {
          interleaved.push(byUnit[u].pop().id);
          added = true;
        }
      }
    }

    // Ensure the first question does not immediately repeat the last played question
    if (APP_STATE.mixedPractice.lastProblemId && interleaved[0] === APP_STATE.mixedPractice.lastProblemId && interleaved.length > 1) {
      const swap = 1 + Math.floor(Math.random() * (interleaved.length - 1));
      const temp = interleaved[0];
      interleaved[0] = interleaved[swap];
      interleaved[swap] = temp;
    }

    APP_STATE.mixedPractice.deck = interleaved;
  }

  const nextId = APP_STATE.mixedPractice.deck.shift();
  APP_STATE.mixedPractice.lastProblemId = nextId;
  const raw = EXPANDED_QUESTION_BANK.find(q => q.id === nextId) || EXPANDED_QUESTION_BANK[0];
  APP_STATE.mixedPractice.lastUnitId = raw.unitId;
  return formatProblem(raw);
}

function updateMixedPracticeBannerUI() {
  const banner = document.getElementById("practice-mode-banner");
  if (!banner) return;
  if (APP_STATE.mixedPractice && APP_STATE.mixedPractice.active) {
    banner.style.display = "flex";
    const uCount = APP_STATE.mixedPractice.selectedUnits.length;
    const uNums = APP_STATE.mixedPractice.selectedUnits.map(u => u.replace('unit-', '')).join(', ');
    const pool = getMixedUnitsPool();
    const titleEl = document.getElementById("practice-mode-title");
    if (titleEl) titleEl.innerText = "🎯 Mixed Units Practice (" + uCount + " Units Active)";
    const descEl = document.getElementById("practice-mode-desc");
    if (descEl) descEl.innerText = "Interleaving varied problems across Units " + uNums + " • " + pool.length + " questions in pool";
  } else {
    banner.style.display = "none";
  }
}

function openMixedUnitsModal() {
  const modal = document.getElementById("mixed-units-modal");
  if (modal) {
    renderMixedUnitPills();
    modal.style.display = "flex";
  }
}

function closeMixedUnitsModal(andReload) {
  const modal = document.getElementById("mixed-units-modal");
  if (modal) modal.style.display = "none";
  if (andReload && APP_STATE.mixedPractice.active) {
    loadNextProblem();
  }
}

`;

appCode = appCode.replace('function loadSkillProblem(skillId) {', mixedFunctionsCode + '\nfunction loadSkillProblem(skillId) {\n  APP_STATE.mixedPractice.active = false;');

// In loadSpecificProblem, ensure mixedPractice is deactivated
appCode = appCode.replace('function loadSpecificProblem(problemId) {', 'function loadSpecificProblem(problemId) {\n  APP_STATE.mixedPractice.active = false;');

// In loadNextProblem, check if mixed practice is active
appCode = appCode.replace(
  'function loadNextProblem() {\n  const prob = getProblemForSkill(APP_STATE.currentSkillId);',
  `function loadNextProblem() {
  let prob;
  if (APP_STATE.mixedPractice && APP_STATE.mixedPractice.active) {
    prob = getNextMixedProblem();
  } else {
    prob = getProblemForSkill(APP_STATE.currentSkillId);
  }`
);

// In displayProblem, update tag and show mixed banner
appCode = appCode.replace(
  'const skillTag = document.getElementById("current-skill-tag");\n  if (skillTag) skillTag.innerText = prob.unitTag;',
  `const skillTag = document.getElementById("current-skill-tag");
  if (skillTag) {
    if (APP_STATE.mixedPractice && APP_STATE.mixedPractice.active) {
      skillTag.innerText = "🎯 MIXED • " + prob.unitTag;
    } else {
      skillTag.innerText = prob.unitTag;
    }
  }
  updateMixedPracticeBannerUI();`
);

// In loadSavedState, load selected units preference
appCode = appCode.replace(
  'loadSavedState() {',
  `loadSavedState() {
  try {
    const savedUnits = localStorage.getItem("me_ixl_selected_units");
    if (savedUnits) {
      const parsed = JSON.parse(savedUnits);
      if (Array.isArray(parsed) && parsed.length > 0) {
        APP_STATE.mixedPractice.selectedUnits = parsed;
      }
    }
  } catch (e) {}`
);

// In DOMContentLoaded, call renderMixedUnitPills()
appCode = appCode.replace(
  'renderSkillsGrid();',
  'renderSkillsGrid();\n  renderMixedUnitPills();'
);

fs.writeFileSync('app.js', appCode, 'utf8');
console.log("Successfully updated app.js with Mixed Units Practice engine!");

// 2. Update index.html with styles, Mixed Units Banner in skills-view, Practice Arena banner, and modal
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Add CSS for unit toggle pills and mixed mode banner
const newCss = `
    /* Unit Toggle Pills for Mixed Practice */
    .unit-toggle-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 600;
      border: 1.5px solid var(--border-color);
      background: var(--bg-card);
      color: var(--text-muted);
      cursor: pointer;
      user-select: none;
      transition: all 0.15s ease;
    }
    .unit-toggle-pill:hover {
      border-color: var(--primary-light);
      color: var(--text-main);
    }
    .unit-toggle-pill.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.25);
    }
    .unit-toggle-pill .pill-check {
      font-weight: 800;
      font-size: 0.85rem;
    }
    .unit-toggle-pill .pill-count {
      opacity: 0.75;
      font-size: 0.75rem;
    }

    /* Modal for Changing Units in Practice Arena */
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1000;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }
    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      box-shadow: var(--shadow-lg);
      max-width: 650px;
      width: 100%;
      padding: 1.75rem;
      animation: fadeIn 0.2s ease-out;
    }
`;

indexHtml = indexHtml.replace('</style>', newCss + '\n  </style>');

// Add Mixed Units Banner inside skills-view right above unit-grid
const skillsBannerHtml = `
      <!-- Mixed Units Practice Selector Banner -->
      <div class="card" id="mixed-practice-banner" style="margin-bottom: 1.5rem; padding: 1.25rem 1.5rem; background: linear-gradient(135deg, rgba(37,99,235,0.06), rgba(59,130,246,0.12)); border: 1.5px solid var(--primary-light);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 1.25rem;">🎯</span>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">Mixed Unit Practice Mode</h3>
              <span class="badge badge-primary" id="mixed-units-count-badge">8 Units</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin-top: 0.2rem;">
              Practice varied questions interleaved across your selected units instead of repeating a single topic.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-outline text-xs" style="padding: 0.35rem 0.65rem;" onclick="selectAllMixedUnits(true)">Select All</button>
            <button class="btn btn-outline text-xs" style="padding: 0.35rem 0.65rem;" onclick="selectAllMixedUnits(false)">Clear</button>
            <button class="btn btn-primary text-sm" style="padding: 0.45rem 1rem;" onclick="launchMixedPractice()">⚡ Start Mixed Practice</button>
          </div>
        </div>

        <!-- Unit Selector Pills -->
        <div class="unit-pills-selector" id="unit-pills-selector" style="display: flex; flex-wrap: wrap; gap: 0.5rem;"></div>
      </div>
`;

indexHtml = indexHtml.replace(
  '<div class="grid-layout" id="unit-grid"></div>',
  skillsBannerHtml + '\n      <div class="grid-layout" id="unit-grid"></div>'
);

// Add Active Mixed Practice Banner in practice-view right above problem-box
const practiceBannerHtml = `
        <!-- Active Mixed Practice Banner -->
        <div id="practice-mode-banner" class="card" style="display: none; padding: 0.85rem 1.25rem; margin-bottom: 1rem; border-left: 4px solid var(--primary); background: var(--bg-subtle); justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.2rem;">🎯</span>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--primary);" id="practice-mode-title">Mixed Units Practice Active</div>
              <div style="font-size: 0.82rem; color: var(--text-muted);" id="practice-mode-desc">Varied questions across selected units</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-outline text-xs" onclick="openMixedUnitsModal()" style="padding: 0.35rem 0.65rem;">⚙️ Select Units</button>
            <button class="btn btn-outline text-xs" onclick="switchView('skills-view')" style="padding: 0.35rem 0.65rem;">📚 Single Skill Mode</button>
          </div>
        </div>
`;

indexHtml = indexHtml.replace(
  '<div class="practice-main">\n          <div class="problem-box">',
  '<div class="practice-main">\n' + practiceBannerHtml + '          <div class="problem-box">'
);

// Add Modal at end of body in index.html
const modalHtml = `
  <!-- Mixed Units Selector Modal -->
  <div class="modal-overlay" id="mixed-units-modal" onclick="if(event.target === this) closeMixedUnitsModal(false)">
    <div class="modal-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-size: 1.3rem;">🎯</span>
          <h3 style="font-size: 1.2rem; font-weight: 800;">Select Units for Mixed Practice</h3>
        </div>
        <button class="icon-btn" onclick="closeMixedUnitsModal(false)">✕</button>
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
        Toggle which units to include. Questions will interleave and vary across your active selection.
      </p>
      
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
        <button class="btn btn-outline text-xs" onclick="selectAllMixedUnits(true)">Select All</button>
        <button class="btn btn-outline text-xs" onclick="selectAllMixedUnits(false)">Clear All</button>
      </div>

      <div id="modal-unit-pills-selector" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;"></div>

      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button class="btn btn-outline" onclick="closeMixedUnitsModal(false)">Cancel</button>
        <button class="btn btn-primary" onclick="launchMixedPractice(); closeMixedUnitsModal(false);">⚡ Apply & Continue</button>
      </div>
    </div>
  </div>
`;

indexHtml = indexHtml.replace('</body>', modalHtml + '\n</body>');

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log("Successfully updated index.html with Mixed Practice controls!");

// 3. Update generate_mobile_app.js so mobile.html also has Mixed Unit Practice
let mobileGen = fs.readFileSync('generate_mobile_app.js', 'utf8');

// In mobile generate script, add CSS for mobile unit toggle pills
const mobilePillCss = `
    /* Mobile Unit Toggle Pills */
    .m-unit-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 600;
      border: 1.5px solid var(--border);
      background: var(--bg-card);
      color: var(--text-muted);
      cursor: pointer;
      user-select: none;
      transition: all 0.15s ease;
    }
    .m-unit-pill.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
    }
`;

mobileGen = mobileGen.replace('/* Navigation Dock */', mobilePillCss + '\n    /* Navigation Dock */');

// Add Mixed Units Banner to mobile view-skills
const mobileSkillsBanner = `
    <!-- Mobile Mixed Practice Selector Card -->
    <div class="card" style="background: linear-gradient(135deg, rgba(37,99,235,0.06), rgba(59,130,246,0.12)); border: 1.5px solid var(--primary-light); padding: 1rem; margin-bottom: 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span>🎯</span>
          <strong style="font-size: 0.95rem; color: var(--primary);">Mixed Unit Practice</strong>
        </div>
        <div style="display: flex; gap: 0.3rem;">
          <button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="selectAllMixedUnits(true)">All</button>
          <button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="selectAllMixedUnits(false)">Clear</button>
        </div>
      </div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">
        Practice varied, interleaved problems across your selected units.
      </p>
      <div id="m-unit-pills-selector" style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.85rem;"></div>
      <button class="btn btn-primary btn-block" onclick="launchMixedPractice()">⚡ Start Mixed Practice</button>
    </div>
`;

mobileGen = mobileGen.replace(
  '<main id="view-skills" class="mobile-view">\n    <div class="card">',
  '<main id="view-skills" class="mobile-view">\n' + mobileSkillsBanner + '    <div class="card">'
);

// Add Mixed Practice Status Strip in mobile view-practice
const mobilePracticeStrip = `
    <!-- Mobile Mixed Mode Active Strip -->
    <div id="m-practice-mode-strip" style="display: none; padding: 0.5rem 0.85rem; background: var(--bg-subtle); border-left: 3px solid var(--primary); border-radius: var(--radius-sm); margin-bottom: 0.75rem; justify-content: space-between; align-items: center;">
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary);" id="m-practice-mode-title">🎯 Mixed: 8 Units Active</div>
      <button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="switchMobileView('skills')">Change Units</button>
    </div>
`;

mobileGen = mobileGen.replace(
  '<main id="view-practice" class="mobile-view active">\n    <div class="arena-status">',
  '<main id="view-practice" class="mobile-view active">\n' + mobilePracticeStrip + '    <div class="arena-status">'
);

// Add mobile JavaScript engine for mixed units
const mobileEngineLogic = `
function renderMobileUnitPills() {
  const container = document.getElementById("m-unit-pills-selector");
  if (!container) return;
  container.innerHTML = "";
  const selected = new Set(APP_STATE.mixedPractice.selectedUnits || []);

  CURRICULUM.forEach(u => {
    const isSel = selected.has(u.id);
    const unitNum = u.id.replace('unit-', '');
    const count = EXPANDED_QUESTION_BANK.filter(q => q.unitId === u.id).length;

    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "m-unit-pill " + (isSel ? "active" : "");
    pill.onclick = () => toggleMixedUnit(u.id);
    pill.innerHTML = (isSel ? "✓" : "+") + " <strong>Unit " + unitNum + "</strong> (" + count + ")";
    container.appendChild(pill);
  });
}

function toggleMixedUnit(unitId) {
  const list = APP_STATE.mixedPractice.selectedUnits;
  const idx = list.indexOf(unitId);
  if (idx === -1) list.push(unitId);
  else list.splice(idx, 1);
  list.sort();
  APP_STATE.mixedPractice.deck = [];
  try { localStorage.setItem("me_ixl_selected_units", JSON.stringify(list)); } catch (e) {}
  renderMobileUnitPills();
  updateMobileMixedStrip();
}

function selectAllMixedUnits(selectAll) {
  if (selectAll) APP_STATE.mixedPractice.selectedUnits = CURRICULUM.map(u => u.id);
  else APP_STATE.mixedPractice.selectedUnits = [];
  APP_STATE.mixedPractice.deck = [];
  try { localStorage.setItem("me_ixl_selected_units", JSON.stringify(APP_STATE.mixedPractice.selectedUnits)); } catch (e) {}
  renderMobileUnitPills();
  updateMobileMixedStrip();
}

function launchMixedPractice() {
  if (!APP_STATE.mixedPractice.selectedUnits || APP_STATE.mixedPractice.selectedUnits.length === 0) {
    alert("Please select at least one unit to practice!");
    return;
  }
  APP_STATE.mixedPractice.active = true;
  APP_STATE.mixedPractice.deck = [];
  switchMobileView('practice');
  loadNextProblem();
}

function getNextMixedProblem() {
  const units = APP_STATE.mixedPractice.selectedUnits;
  if (!units || units.length === 0) return getProblemForSkill(APP_STATE.currentSkillId);

  if (!APP_STATE.mixedPractice.deck || APP_STATE.mixedPractice.deck.length === 0) {
    const byUnit = {};
    units.forEach(u => {
      byUnit[u] = EXPANDED_QUESTION_BANK.filter(q => q.unitId === u).sort(() => 0.5 - Math.random());
    });
    const interleaved = [];
    let added = true;
    const unitOrder = [...units].sort(() => 0.5 - Math.random());
    while (added) {
      added = false;
      for (const u of unitOrder) {
        if (byUnit[u] && byUnit[u].length > 0) {
          interleaved.push(byUnit[u].pop().id);
          added = true;
        }
      }
    }
    if (APP_STATE.mixedPractice.lastProblemId && interleaved[0] === APP_STATE.mixedPractice.lastProblemId && interleaved.length > 1) {
      const swap = 1 + Math.floor(Math.random() * (interleaved.length - 1));
      const temp = interleaved[0];
      interleaved[0] = interleaved[swap];
      interleaved[swap] = temp;
    }
    APP_STATE.mixedPractice.deck = interleaved;
  }

  const nextId = APP_STATE.mixedPractice.deck.shift();
  APP_STATE.mixedPractice.lastProblemId = nextId;
  const raw = EXPANDED_QUESTION_BANK.find(q => q.id === nextId) || EXPANDED_QUESTION_BANK[0];
  APP_STATE.mixedPractice.lastUnitId = raw.unitId;
  return formatProblem(raw);
}

function updateMobileMixedStrip() {
  const strip = document.getElementById("m-practice-mode-strip");
  if (!strip) return;
  if (APP_STATE.mixedPractice && APP_STATE.mixedPractice.active) {
    strip.style.display = "flex";
    const uCount = APP_STATE.mixedPractice.selectedUnits.length;
    const uNums = APP_STATE.mixedPractice.selectedUnits.map(u => u.replace('unit-', '')).join(', ');
    const title = document.getElementById("m-practice-mode-title");
    if (title) title.innerText = "🎯 Mixed: Units " + uNums + " (" + uCount + " Units Active)";
  } else {
    strip.style.display = "none";
  }
}
`;

mobileGen = mobileGen.replace('function startRandomPractice()', mobileEngineLogic + '\nfunction startRandomPractice()');

// In mobile loadSkillProblem, deactivate mixedPractice
mobileGen = mobileGen.replace('function loadSkillProblem(skillId) {', 'function loadSkillProblem(skillId) {\n  APP_STATE.mixedPractice.active = false;');

// In mobile loadNextProblem, support mixed practice
mobileGen = mobileGen.replace(
  'function loadNextProblem() {\n  const prob = getProblemForSkill(APP_STATE.currentSkillId);',
  `function loadNextProblem() {
  let prob;
  if (APP_STATE.mixedPractice && APP_STATE.mixedPractice.active) {
    prob = getNextMixedProblem();
  } else {
    prob = getProblemForSkill(APP_STATE.currentSkillId);
  }`
);

// In mobile displayProblem, update tag and strip
mobileGen = mobileGen.replace(
  'document.getElementById("m-unit-tag").innerText = prob.unitTag || "Unit 1";',
  `const mTag = document.getElementById("m-unit-tag");
  if (mTag) {
    if (APP_STATE.mixedPractice && APP_STATE.mixedPractice.active) {
      mTag.innerText = "🎯 " + (prob.unitTag || prob.unitId);
    } else {
      mTag.innerText = prob.unitTag || "Unit 1";
    }
  }
  updateMobileMixedStrip();`
);

// In mobile DOMContentLoaded, render pills
mobileGen = mobileGen.replace('renderSkillsList();', 'renderSkillsList();\n  renderMobileUnitPills();');

fs.writeFileSync('generate_mobile_app.js', mobileGen, 'utf8');
console.log("Successfully updated generate_mobile_app.js with mobile mixed practice support!");

console.log("Rebuilding mobile.html...");
require('child_process').execSync('node generate_mobile_app.js', { stdio: 'inherit' });

console.log("Mixed Units Practice setup completed!");
