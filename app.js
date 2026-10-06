/* ==========================================================================
   ME-IXL: Analysis in Mechanical Engineering (Exam 1 Mastery)
   Main Application Engine (V3 - Live Timers, Custom Exam Durations & Complete Cheat Sheet)
   ========================================================================== */

const CURRICULUM = [
  {
    id: "unit-1",
    title: "Unit 1: Curves, Extrema & Asymptotes",
    assignment: "Assignment 1 (Q1 - Q3)",
    description: "Polynomial inflection points, rational curve sketching, critical points, relative extrema, and slant asymptotes.",
    skills: [
      { id: "s1_1", name: "Cubic Critical Numbers & Inflection Abscissa", ref: "Assgn 1, Q1" },
      { id: "s1_2", name: "Rational Function Extrema & Concavity (y = (x+k)/x²)", ref: "Assgn 1, Q2" },
      { id: "s1_3", name: "Rational Curves with Oblique (Slant) Asymptotes", ref: "Assgn 1, Q3" }
    ]
  },
  {
    id: "unit-2",
    title: "Unit 2: Multivariable Optimization & Constraints",
    assignment: "Assignment 1 (Q4 - Q6)",
    description: "Open-top rectangular box volume maximization, Lagrange multipliers on cone/plane intersections, and distance to spheres.",
    skills: [
      { id: "s2_1", name: "Physical Box & Storage Silo Optimization", ref: "Assgn 1, Q4" },
      { id: "s2_2", name: "Extreme Points on Intersection of Plane & Cone", ref: "Assgn 1, Q5" },
      { id: "s2_3", name: "Points on Sphere & Planes Closest/Farthest to Points", ref: "Assgn 1, Q6" }
    ]
  },
  {
    id: "unit-3",
    title: "Unit 3: Power Series & Taylor Approximations",
    assignment: "Assignment 1 (Q7 - Q10)",
    description: "Ratio test radius of convergence, trigonometric Taylor expansions in sigma notation, polynomial expansions, and fractional powers.",
    skills: [
      { id: "s3_1", name: "Power Series Radius of Convergence (Ratio Test)", ref: "Assgn 1, Q7" },
      { id: "s3_2", name: "Trigonometric & Exp Taylor Series in Two Summation Groups", ref: "Assgn 1, Q8" },
      { id: "s3_3", name: "Polynomial Taylor Series & Remainder Vanishing", ref: "Assgn 1, Q9" },
      { id: "s3_4", name: "Fractional Power Taylor Series & Convergence Rate", ref: "Assgn 1, Q10" }
    ]
  },
  {
    id: "unit-4",
    title: "Unit 4: Orthogonal Functions & Hilbert Spaces",
    assignment: "Assignment 2 (Q1 - Q3)",
    description: "Function inner products, orthogonality of function pairs, orthogonal sets, norm computation, and Pythagorean theorem.",
    skills: [
      { id: "s4_1", name: "Orthogonality of Function Pairs over Intervals", ref: "Assgn 2, Q1" },
      { id: "s4_2", name: "Orthogonal Sets & L² Norm Computation", ref: "Assgn 2, Q2" },
      { id: "s4_3", name: "Pythagorean Theorem for Orthogonal Functions", ref: "Assgn 2, Q3" }
    ]
  },
  {
    id: "unit-5",
    title: "Unit 5: Real & Complex Fourier Series",
    assignment: "Assignment 2 (Q4 - Q5)",
    description: "Piecewise real Fourier series, deducing numerical infinite sums via Dirichlet theorem, complex Fourier coefficients, and frequency spectra.",
    skills: [
      { id: "s5_1", name: "Real Fourier Series of Piecewise Functions (a₀, aₙ, bₙ)", ref: "Assgn 2, Q4" },
      { id: "s5_2", name: "Summing Infinite Series via Fourier Evaluations", ref: "Assgn 2, Q4" },
      { id: "s5_3", name: "Complex Fourier Series & Harmonic Spectra", ref: "Assgn 2, Q5" }
    ]
  },
  {
    id: "unit-6",
    title: "Unit 6: Vector Algebra & Geometric Applications",
    assignment: "Assignment 2 (Q6 - Q8)",
    description: "Displacement vectors, initial/terminal points, parallel vectors with given magnitude, rhombus diagonal orthogonality, and coplanar points.",
    skills: [
      { id: "s6_1", name: "Displacement Vectors & Endpoint Calculation", ref: "Assgn 2, Q6" },
      { id: "s6_2", name: "Parallel Vectors with Specific Magnitude & Polygon Loops", ref: "Assgn 2, Q7" },
      { id: "s6_3", name: "Orthogonal Diagonals of Rhombus & Dual-Perpendicular Vectors", ref: "Assgn 2, Q8" },
      { id: "s6_4", name: "Coplanarity of 4 Points via Scalar Triple Product", ref: "Assgn 2, Q8" }
    ]
  },
  {
    id: "unit-7",
    title: "Unit 7: 3D Analytic Geometry (Lines & Planes)",
    assignment: "Assignment 2 (Q9 - Q10)",
    description: "Converting symmetric to parametric lines, angle between 3D lines, plane containing intersecting lines, and plane orthogonal to another plane.",
    skills: [
      { id: "s7_1", name: "Parametric Line from Symmetric Form & Line Angles", ref: "Assgn 2, Q9" },
      { id: "s7_2", name: "Equation of Plane Containing Two Lines", ref: "Assgn 2, Q10" },
      { id: "s7_3", name: "Plane Containing Line and Orthogonal to Another Plane", ref: "Assgn 2, Q10" }
    ]
  }
];

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

  return {
    id: base.id,
    skillId: base.skillId,
    skillName: base.title,
    title: base.title,
    unitId: base.unitId,
    unitTag: base.unitId.toUpperCase().replace('-', ' ') + ' • ' + base.skillId.toUpperCase(),
    difficulty: base.difficulty,
    prompt: base.prompt,
    type: "multiple-choice",
    options: shuffledOptions,
    correctIndex: newCorrectIndex,
    walkthrough: base.walkthrough,
    examTip: base.examTip
  };
}

function getProblemForSkill(skillId) {
  const bankMatches = EXPANDED_QUESTION_BANK.filter(q => q.skillId === skillId);
  if (bankMatches.length === 0) return formatProblem(EXPANDED_QUESTION_BANK[0]);
  if (bankMatches.length === 1) return formatProblem(bankMatches[0]);

  if (!APP_STATE.skillQueues[skillId] || APP_STATE.skillQueues[skillId].length === 0) {
    const ids = bankMatches.map(q => q.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = ids[i];
      ids[i] = ids[j];
      ids[j] = temp;
    }

    const lastId = APP_STATE.lastProblemIdBySkill[skillId];
    if (lastId && ids[0] === lastId && ids.length > 1) {
      const swap = ids[0];
      ids[0] = ids[ids.length - 1];
      ids[ids.length - 1] = swap;
    }

    APP_STATE.skillQueues[skillId] = ids;
  }

  const nextId = APP_STATE.skillQueues[skillId].shift();
  APP_STATE.lastProblemIdBySkill[skillId] = nextId;

  const base = bankMatches.find(q => q.id === nextId) || bankMatches[0];
  return formatProblem(base);
}

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
}

function formatTimeSpoken(totalSec) {
  if (!totalSec || totalSec <= 0) return "0s";
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return s + "s";
  if (s === 0) return m + "m";
  return m + "m " + s + "s";
}

function getDifficultyTargetSec(diff) {
  if (diff === "Foundational") return 120;
  if (diff === "Exam Challenge") return 360;
  return 240;
}

function loadSavedState() {
  try {
    const saved = localStorage.getItem("ME_IXL_STATE");
    if (saved) {
      const parsed = JSON.parse(saved);
      APP_STATE.smartScores = parsed.smartScores || {};
      APP_STATE.totalSolved = parsed.totalSolved || 0;
      APP_STATE.streak = parsed.streak || 0;
      APP_STATE.problemTimes = parsed.problemTimes || {};
      APP_STATE.totalPracticeSeconds = parsed.totalPracticeSeconds || 0;
      if (parsed.examDurationMinutes !== undefined) {
        APP_STATE.examMode.durationMinutes = parsed.examDurationMinutes;
        APP_STATE.examMode.isUntimed = (parsed.examDurationMinutes === 0);
      }
    }
  } catch (e) {
    console.warn("Could not load localStorage state", e);
  }

  // Restore theme and audio preference
  try {
    const savedTheme = localStorage.getItem("me_ixl_theme");
    if (savedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
    }
    const savedSound = localStorage.getItem("me_ixl_sound");
    if (savedSound !== null) {
      APP_STATE.soundEnabled = (savedSound === "1");
    }
    updateThemeUI();
    updateSoundUI();
  } catch (e) {}

  updateGlobalUI();
}

function saveState() {
  try {
    localStorage.setItem("ME_IXL_STATE", JSON.stringify({
      smartScores: APP_STATE.smartScores,
      totalSolved: APP_STATE.totalSolved,
      streak: APP_STATE.streak,
      problemTimes: APP_STATE.problemTimes,
      totalPracticeSeconds: APP_STATE.totalPracticeSeconds,
      examDurationMinutes: APP_STATE.examMode.isUntimed ? 0 : APP_STATE.examMode.durationMinutes
    }));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
}

function updateGlobalUI() {
  const curScore = APP_STATE.smartScores[APP_STATE.currentSkillId] || 0;
  const scoreElem = document.getElementById("global-smartscore");
  if (scoreElem) scoreElem.innerText = curScore;
  const streakElem = document.getElementById("global-streak");
  if (streakElem) streakElem.innerText = "🔥 " + APP_STATE.streak;
  const solvedElem = document.getElementById("global-solved");
  if (solvedElem) solvedElem.innerText = APP_STATE.totalSolved;
  
  const sidebarScore = document.getElementById("sidebar-score");
  if (sidebarScore) sidebarScore.innerText = curScore;
  const sidebarMeter = document.getElementById("sidebar-meter");
  if (sidebarMeter) sidebarMeter.style.setProperty("--score-pct", curScore);

  const masteryText = document.getElementById("sidebar-mastery-text");
  if (masteryText) {
    if (curScore >= 100) masteryText.innerText = "🏆 Mastered! Outstanding Work!";
    else if (curScore >= 90) masteryText.innerText = "⭐ Challenge Zone: Almost at 100!";
    else if (curScore >= 70) masteryText.innerText = "👍 Proficient: Keep pushing!";
    else masteryText.innerText = "Reach 100 to Master this skill!";
  }
}

let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

function playSuccessChime() {
  if (!APP_STATE.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn("Audio chime error:", e);
  }
}

function playCelebrationSound() {
  if (!APP_STATE.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
    });
  } catch (e) {
    console.warn("Audio celebration error:", e);
  }
}

function playIncorrectSound() {
  if (!APP_STATE.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.setValueAtTime(220, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio buzz error:", e);
  }
}

function toggleSound() {
  APP_STATE.soundEnabled = !APP_STATE.soundEnabled;
  try { localStorage.setItem("me_ixl_sound", APP_STATE.soundEnabled ? "1" : "0"); } catch (e) {}
  updateSoundUI();
}

function updateSoundUI() {
  const btn = document.getElementById("sound-btn") || document.getElementById("sound-toggle-btn");
  if (!btn) return;
  btn.title = APP_STATE.soundEnabled ? "Audio Chimes: Enabled (Click to Mute)" : "Audio Chimes: Muted (Click to Enable)";
  btn.innerHTML = APP_STATE.soundEnabled
    ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>'
    : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path></svg>';
}

function toggleTheme() {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  if (nextTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.removeAttribute("data-theme");
  }
  try { localStorage.setItem("me_ixl_theme", nextTheme); } catch (e) {}
  updateThemeUI();
}

function updateThemeUI() {
  const btn = document.getElementById("theme-btn");
  if (!btn) return;
  const isDark = document.body.getAttribute("data-theme") === "dark";
  btn.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
  btn.innerHTML = isDark
    ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
    : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
}

function startProblemTimer() {
  if (APP_STATE.problemTimer.interval) {
    clearInterval(APP_STATE.problemTimer.interval);
  }
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

function pauseProblemTimer() {
  APP_STATE.problemTimer.running = false;
  updateProblemTimerUI();
}

function resumeProblemTimer() {
  APP_STATE.problemTimer.running = true;
  updateProblemTimerUI();
}

function toggleProblemTimer() {
  if (APP_STATE.problemTimer.running) {
    pauseProblemTimer();
  } else {
    resumeProblemTimer();
  }
}

function stopProblemTimer() {
  if (APP_STATE.problemTimer.interval) {
    clearInterval(APP_STATE.problemTimer.interval);
    APP_STATE.problemTimer.interval = null;
  }
  APP_STATE.problemTimer.running = false;
  updateProblemTimerUI();
  return APP_STATE.problemTimer.seconds;
}

function updateProblemTimerUI() {
  const elem = document.getElementById("problem-timer-display");
  if (elem) {
    elem.innerText = formatTime(APP_STATE.problemTimer.seconds);
  }
  const badge = document.getElementById("problem-timer-badge");
  if (badge) {
    if (APP_STATE.problemTimer.running) {
      badge.classList.remove("paused");
      badge.title = "Timer running (click to pause)";
    } else {
      badge.classList.add("paused");
      badge.title = "Timer paused (click to resume)";
    }
  }
}

function displayProblem(prob) {
  APP_STATE.currentProblem = prob;
  APP_STATE.answered = false;
  APP_STATE.isRetry = false;
  APP_STATE.eliminatedIndices = [];
  APP_STATE.selectedOptionIndex = null;

  startProblemTimer();

  const skillTag = document.getElementById("current-skill-tag");
  if (skillTag) skillTag.innerText = prob.unitTag;
  const skillTitle = document.getElementById("current-skill-title");
  if (skillTitle) skillTitle.innerText = prob.skillName;
  const diffElem = document.getElementById("current-difficulty");
  if (diffElem) diffElem.innerText = "Level: " + (prob.difficulty || 'Standard');
  const qText = document.getElementById("question-text");
  if (qText) qText.innerHTML = prob.prompt;

  const container = document.getElementById("answer-form-container");
  if (container) {
    container.innerHTML = "";
    const answersDiv = document.createElement("div");
    answersDiv.className = "answers-container";
    
    prob.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.id = "option-btn-" + idx;
      btn.innerHTML = "<span class='option-text'>" + opt + "</span><span style='opacity: 0.4; font-size: 0.8rem; margin-left: 1rem; flex-shrink: 0;'>[Option " + String.fromCharCode(65 + idx) + "]</span>";
      btn.onclick = () => selectOption(idx);
      answersDiv.appendChild(btn);
    });
    container.appendChild(answersDiv);
  }

  const feedbackBanner = document.getElementById("feedback-banner");
  if (feedbackBanner) {
    feedbackBanner.className = "feedback-banner";
    feedbackBanner.style.display = "none";
  }
  const feedbackActions = document.getElementById("feedback-actions");
  if (feedbackActions) feedbackActions.innerHTML = "";

  const walkthroughBox = document.getElementById("walkthrough-box");
  if (walkthroughBox) {
    walkthroughBox.className = "walkthrough-box";
    walkthroughBox.style.display = "none";
  }

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) { submitBtn.style.display = "inline-flex"; submitBtn.disabled = false; }
  
  const retryBtn = document.getElementById("retry-btn");
  if (retryBtn) retryBtn.style.display = "none";

  const viewSolBtn = document.getElementById("view-solution-btn");
  if (viewSolBtn) viewSolBtn.style.display = "none";

  const stuckBtn = document.getElementById("stuck-btn");
  if (stuckBtn) stuckBtn.style.display = "inline-flex";

  const skipBtn = document.getElementById("skip-btn");
  if (skipBtn) skipBtn.style.display = "inline-flex";

  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) {
    nextBtn.style.display = "none";
    nextBtn.innerText = "Next Problem →";
  }

  updateGlobalUI();
  
  // Render math across question prompt and answer options
  const qEl = document.getElementById("question-text");
  if (qEl) renderMath(qEl);
  const aEl = document.getElementById("answer-form-container");
  if (aEl) renderMath(aEl);
  renderMath(document.getElementById("practice-view"));
}

function loadSkillProblem(skillId) {
  APP_STATE.currentSkillId = skillId;
  switchView('practice-view');
  const prob = getProblemForSkill(skillId);
  displayProblem(prob);
}

function loadSpecificProblem(problemId) {
  const base = EXPANDED_QUESTION_BANK.find(q => q.id === problemId);
  if (!base) return loadSkillProblem("s1_2");
  APP_STATE.currentSkillId = base.skillId;
  APP_STATE.lastProblemIdBySkill[base.skillId] = base.id;
  switchView('practice-view');
  displayProblem(formatProblem(base));
}

function selectOption(index) {
  if (APP_STATE.answered) return;
  if (APP_STATE.eliminatedIndices.includes(index)) return;

  APP_STATE.selectedOptionIndex = index;
  const btns = document.querySelectorAll(".option-btn");
  btns.forEach((b, i) => {
    if (i === index) b.classList.add("selected");
    else b.classList.remove("selected");
  });
}

function submitAnswer() {
  if (APP_STATE.answered) return;
  if (APP_STATE.selectedOptionIndex === null) {
    alert("Please select an answer option before submitting!");
    return;
  }

  const elapsedSec = stopProblemTimer();
  APP_STATE.answered = true;
  APP_STATE.totalSolved++;
  const prob = APP_STATE.currentProblem;
  const isCorrect = (APP_STATE.selectedOptionIndex === prob.correctIndex);

  if (!APP_STATE.problemTimes[prob.id]) {
    APP_STATE.problemTimes[prob.id] = {
      bestSeconds: isCorrect ? elapsedSec : null,
      lastSeconds: elapsedSec,
      attempts: 1,
      solved: isCorrect
    };
  } else {
    const rec = APP_STATE.problemTimes[prob.id];
    rec.attempts++;
    rec.lastSeconds = elapsedSec;
    if (isCorrect) {
      rec.solved = true;
      if (!rec.bestSeconds || elapsedSec < rec.bestSeconds) {
        rec.bestSeconds = elapsedSec;
      }
    }
  }
  APP_STATE.totalPracticeSeconds += elapsedSec;

  const targetSec = getDifficultyTargetSec(prob.difficulty);
  let paceHtml = "";
  if (isCorrect) {
    if (elapsedSec <= targetSec * 0.75) {
      paceHtml = "<span style='background: rgba(34, 197, 94, 0.12); color: #15803d; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem;'>⚡ Blitz Pace: " + formatTimeSpoken(elapsedSec) + " (Target: &lt; " + formatTimeSpoken(targetSec) + ")</span>";
    } else if (elapsedSec <= targetSec) {
      paceHtml = "<span style='background: rgba(59, 130, 246, 0.12); color: #1e40af; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem;'>🎯 On-Target Pace: " + formatTimeSpoken(elapsedSec) + " (Target: &lt; " + formatTimeSpoken(targetSec) + ")</span>";
    } else {
      paceHtml = "<span style='background: rgba(245, 158, 11, 0.12); color: #b45309; padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 700; font-size: 0.85rem;'>⏳ Thorough Pace: " + formatTimeSpoken(elapsedSec) + " (Target: &lt; " + formatTimeSpoken(targetSec) + ")</span>";
    }
  } else {
    paceHtml = "<span style='background: rgba(100, 116, 139, 0.1); color: var(--text-muted); padding: 0.25rem 0.6rem; border-radius: 6px; font-weight: 600; font-size: 0.85rem;'>⏱️ Attempt time: " + formatTimeSpoken(elapsedSec) + "</span>";
  }

  const feedbackBanner = document.getElementById("feedback-banner");
  const feedbackHeader = document.getElementById("feedback-header");
  const feedbackDetail = document.getElementById("feedback-detail");
  const feedbackActions = document.getElementById("feedback-actions");

  const skillId = APP_STATE.currentSkillId;
  let score = APP_STATE.smartScores[skillId] || 0;

  if (isCorrect) {
    APP_STATE.streak++;
    let points = 10;
    if (APP_STATE.isRetry) points = 5;
    else if (score >= 90) points = 3;
    else if (score >= 80) points = 5;
    else if (score >= 60) points = 8;
    
    score = Math.min(100, score + points);
    APP_STATE.smartScores[skillId] = score;

    if (feedbackBanner) {
      feedbackBanner.className = "feedback-banner correct";
      feedbackBanner.style.display = "block";
    }
    if (feedbackHeader) {
      feedbackHeader.innerHTML = APP_STATE.isRetry
        ? "🎉 Correct on retry! Great perseverance! (+" + points + " SmartScore)"
        : "🎉 Correct! Outstanding Job! (+" + points + " SmartScore)";
    }
    if (feedbackDetail) {
      const bestText = APP_STATE.problemTimes[prob.id]?.bestSeconds 
        ? "<span class='text-xs' style='color: var(--text-muted);'>Personal Best: " + formatTimeSpoken(APP_STATE.problemTimes[prob.id].bestSeconds) + "</span>" 
        : "";
      feedbackDetail.innerHTML = "<div style='margin-bottom: 0.5rem;'>You've solved this problem correctly. Ready for the next challenge?</div>" +
        "<div style='display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem;'>" +
        paceHtml + bestText + "</div>";
    }
    
    if (feedbackActions) {
      feedbackActions.innerHTML = 
        '<button class="btn btn-outline text-sm" onclick="viewSolutionRequested()" style="background: var(--bg-card);">📖 Review Full Derivation</button>' +
        '<button class="btn btn-primary text-sm" onclick="loadNextProblem()">Next Problem →</button>';
    }

    const correctBtn = document.getElementById("option-btn-" + prob.correctIndex);
    if (correctBtn) correctBtn.classList.add("correct-highlight");

    playSuccessChime();

    if (score === 100 && typeof confetti === "function") {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      playCelebrationSound();
    }

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.style.display = "none";
    const retryBtn = document.getElementById("retry-btn");
    if (retryBtn) retryBtn.style.display = "none";
    const stuckBtn = document.getElementById("stuck-btn");
    if (stuckBtn) stuckBtn.style.display = "none";
    const skipBtn = document.getElementById("skip-btn");
    if (skipBtn) skipBtn.style.display = "none";

    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
      nextBtn.style.display = "inline-flex";
      nextBtn.innerText = "Next Problem →";
    }

  } else {
    APP_STATE.streak = 0;
    score = Math.max(0, score - 6);
    APP_STATE.smartScores[skillId] = score;

    const wrongIdx = APP_STATE.selectedOptionIndex;
    APP_STATE.eliminatedIndices.push(wrongIdx);

    const wrongBtn = document.getElementById("option-btn-" + wrongIdx);
    if (wrongBtn) {
      wrongBtn.classList.remove("selected");
      wrongBtn.classList.add("eliminated");
    }

    if (feedbackBanner) {
      feedbackBanner.className = "feedback-banner incorrect";
      feedbackBanner.style.display = "block";
    }
    if (feedbackHeader) {
      feedbackHeader.innerHTML = "❌ Not quite. Option " + String.fromCharCode(65 + wrongIdx) + " is incorrect.";
    }
    if (feedbackDetail) {
      feedbackDetail.innerHTML = 
        "<div style='margin-bottom: 0.5rem;'>Would you like to <strong>retry the question</strong> with a fresh attempt, or <strong>view the step-by-step solution</strong>?</div>" +
        "<div style='display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem;'>" +
        paceHtml + "</div>";
    }

    if (feedbackActions) {
      feedbackActions.innerHTML = 
        '<button class="btn btn-outline text-sm" onclick="retryQuestion()" style="border-color: #2563eb; color: #2563eb; background: var(--bg-card); font-weight: 700;">🔄 Retry This Question</button>' +
        '<button class="btn btn-stuck text-sm" onclick="viewSolutionRequested()" style="background: var(--bg-card); font-weight: 700;">📖 View Step-by-Step Solution</button>' +
        '<button class="btn btn-outline text-sm" onclick="loadNextProblem()" style="background: var(--bg-card);">Next Problem →</button>';
    }

    playIncorrectSound();

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.style.display = "none";
    
    const retryBtn = document.getElementById("retry-btn");
    if (retryBtn) retryBtn.style.display = "inline-flex";

    const viewSolBtn = document.getElementById("view-solution-btn");
    if (viewSolBtn) viewSolBtn.style.display = "inline-flex";

    const stuckBtn = document.getElementById("stuck-btn");
    if (stuckBtn) stuckBtn.style.display = "none";

    const skipBtn = document.getElementById("skip-btn");
    if (skipBtn) skipBtn.style.display = "none";

    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
      nextBtn.style.display = "inline-flex";
      nextBtn.innerText = "Next Problem →";
    }
  }

  saveState();
  updateGlobalUI();
  renderSkillsGrid();
  renderMath(document.getElementById("feedback-banner"));
}

function retryQuestion() {
  APP_STATE.answered = false;
  APP_STATE.isRetry = true;
  APP_STATE.selectedOptionIndex = null;

  resumeProblemTimer();

  const btns = document.querySelectorAll(".option-btn");
  btns.forEach((b, i) => {
    if (!APP_STATE.eliminatedIndices.includes(i)) {
      b.classList.remove("selected");
    }
  });

  const feedbackBanner = document.getElementById("feedback-banner");
  if (feedbackBanner) {
    feedbackBanner.className = "feedback-banner";
    feedbackBanner.style.display = "block";
    feedbackBanner.style.backgroundColor = "rgba(59, 130, 246, 0.08)";
    feedbackBanner.style.border = "1px solid var(--primary-light)";
    feedbackBanner.style.color = "var(--text-main)";
  }

  const feedbackHeader = document.getElementById("feedback-header");
  if (feedbackHeader) feedbackHeader.innerHTML = "💡 Second Chance: Reconsider the Problem";

  const feedbackDetail = document.getElementById("feedback-detail");
  if (feedbackDetail) feedbackDetail.innerHTML = "Eliminated options are struck through. Choose from the remaining choices and click <strong>Submit Answer</strong>! Timer is ticking.";

  const feedbackActions = document.getElementById("feedback-actions");
  if (feedbackActions) {
    feedbackActions.innerHTML = '<button class="btn btn-stuck text-sm" onclick="viewSolutionRequested()" style="background: var(--bg-card);">📖 View Solution if Stuck</button>';
  }

  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) { submitBtn.style.display = "inline-flex"; submitBtn.disabled = false; }

  const retryBtn = document.getElementById("retry-btn");
  if (retryBtn) retryBtn.style.display = "none";

  const nextBtn = document.getElementById("next-btn");
  if (nextBtn) nextBtn.style.display = "none";

  const skipBtn = document.getElementById("skip-btn");
  if (skipBtn) skipBtn.style.display = "inline-flex";
}

function viewSolutionRequested() {
  renderWalkthrough();
  const box = document.getElementById("walkthrough-box");
  if (box) {
    box.classList.add("visible");
    box.style.display = "block";
    if (typeof box.scrollIntoView === "function") {
      box.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function showWalkthroughRequested() {
  if (confirm("Viewing the full step-by-step walkthrough before submitting will not earn SmartScore points for this problem. Continue?")) {
    stopProblemTimer();
    APP_STATE.answered = true;
    renderWalkthrough();
    const box = document.getElementById("walkthrough-box");
    if (box) {
      box.classList.add("visible");
      box.style.display = "block";
      if (typeof box.scrollIntoView === "function") {
        box.scrollIntoView({ behavior: 'smooth' });
      }
    }

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.style.display = "none";
    const stuckBtn = document.getElementById("stuck-btn");
    if (stuckBtn) stuckBtn.style.display = "none";
    const skipBtn = document.getElementById("skip-btn");
    if (skipBtn) skipBtn.style.display = "none";

    const nextBtn = document.getElementById("next-btn");
    if (nextBtn) {
      nextBtn.style.display = "inline-flex";
      nextBtn.innerText = "Try Next Problem →";
    }

    const correctBtn = document.getElementById("option-btn-" + APP_STATE.currentProblem.correctIndex);
    if (correctBtn) correctBtn.classList.add("correct-highlight");

    const feedbackBanner = document.getElementById("feedback-banner");
    if (feedbackBanner) {
      feedbackBanner.className = "feedback-banner incorrect";
      feedbackBanner.style.display = "block";
    }
    const feedbackHeader = document.getElementById("feedback-header");
    if (feedbackHeader) feedbackHeader.innerHTML = "📖 Full Guided Walkthrough Unlocked";
    const feedbackDetail = document.getElementById("feedback-detail");
    if (feedbackDetail) feedbackDetail.innerHTML = "Review the complete mathematical derivation below, then continue to the next practice problem.";
    const feedbackActions = document.getElementById("feedback-actions");
    if (feedbackActions) {
      feedbackActions.innerHTML = '<button class="btn btn-primary text-sm" onclick="loadNextProblem()">Next Problem →</button>';
    }
  }
}

function loadNextProblem() {
  const prob = getProblemForSkill(APP_STATE.currentSkillId);
  displayProblem(prob);
  const box = document.getElementById("walkthrough-box");
  if (box) {
    box.classList.remove("visible");
    box.style.display = "none";
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function skipProblem() {
  loadNextProblem();
}

function renderWalkthrough() {
  const prob = APP_STATE.currentProblem;
  const content = document.getElementById("walkthrough-content");
  if (!content) return;
  content.innerHTML = "";

  prob.walkthrough.forEach((step, idx) => {
    const stepDiv = document.createElement("div");
    stepDiv.className = "walkthrough-step";
    stepDiv.innerHTML = 
      '<div class="step-title">Step ' + (idx + 1) + ': ' + step.title + '</div>' +
      '<div class="step-body">' + step.body + '</div>';
    content.appendChild(stepDiv);
  });

  const tipBox = document.getElementById("exam-tip-content");
  if (tipBox && prob.examTip) {
    tipBox.innerHTML = 
      '<div class="exam-tip-title">' +
        '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' +
        'Key Exam Strategy:' +
      '</div>' +
      '<div>' + prob.examTip + '</div>';
  }
  
  const box = document.getElementById("walkthrough-box");
  if (box) {
    renderMath(box);
    setTimeout(() => renderMath(box), 50);
  } else {
    renderMath();
  }
}

function renderSkillsGrid() {
  const container = document.getElementById("unit-grid");
  if (!container) return;
  container.innerHTML = "";

  CURRICULUM.forEach(unit => {
    const card = document.createElement("div");
    card.className = "unit-card";

    let skillsHtml = "";
    unit.skills.forEach(skill => {
      const score = APP_STATE.smartScores[skill.id] || 0;
      skillsHtml += 
        '<div class="skill-item" onclick="loadSkillProblem(\'' + skill.id + '\')">' +
          '<div style="flex: 1;">' +
            '<div style="font-weight: 600; font-size: 0.95rem;">' + skill.name + '</div>' +
            '<div class="text-xs" style="color: var(--text-muted); margin-top: 2px;">Ref: ' + skill.ref + '</div>' +
          '</div>' +
          '<div style="display: flex; align-items: center; gap: 0.5rem;">' +
            '<span class="badge">' + score + '/100</span>' +
            '<button class="btn btn-outline text-xs" style="padding: 0.3rem 0.6rem;">Practice</button>' +
          '</div>' +
        '</div>';
    });

    card.innerHTML = 
      '<div class="unit-header">' +
        '<h3 style="font-size: 1.15rem; font-weight: 700;">' + unit.title + '</h3>' +
        '<p class="text-xs" style="color: var(--text-muted); margin-top: 0.2rem;">' + unit.assignment + ' &bull; ' + unit.description + '</p>' +
      '</div>' +
      '<div class="unit-body">' +
        skillsHtml +
      '</div>';
    container.appendChild(card);
  });
}

function resetAllProgress() {
  if (confirm("Are you sure you want to reset all SmartScores, timing stats, and streak progress?")) {
    APP_STATE.smartScores = {};
    APP_STATE.streak = 0;
    APP_STATE.totalSolved = 0;
    APP_STATE.problemTimes = {};
    APP_STATE.totalPracticeSeconds = 0;
    saveState();
    updateGlobalUI();
    renderSkillsGrid();
    if (APP_STATE.currentSkillId) {
      loadSkillProblem(APP_STATE.currentSkillId);
    }
  }
}

function startRandomPractice() {
  const allSkills = [];
  CURRICULUM.forEach(u => u.skills.forEach(s => allSkills.push(s.id)));
  const randSkill = allSkills[Math.floor(Math.random() * allSkills.length)];
  loadSkillProblem(randSkill);
}

function showAssignmentDeck(type) {
  const deck = document.getElementById("assignment-questions-deck");
  if (!deck) return;
  deck.innerHTML = "";

  const btnA1 = document.getElementById("btn-show-a1");
  const btnA2 = document.getElementById("btn-show-a2");

  if (type === 'A1') {
    if (btnA1) { btnA1.className = "btn btn-primary"; }
    if (btnA2) { btnA2.className = "btn btn-outline"; }
  } else {
    if (btnA1) { btnA1.className = "btn btn-outline"; }
    if (btnA2) { btnA2.className = "btn btn-primary"; }
  }

  const filtered = EXPANDED_QUESTION_BANK.filter(q => {
    return type === 'A1' ? (q.id.startsWith("q1_") || q.id.startsWith("q2_opt") || q.id.startsWith("q3_"))
                         : (q.id.startsWith("q4_") || q.id.startsWith("q5_") || q.id.startsWith("q6_") || q.id.startsWith("q7_"));
  });

  filtered.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "card";

    let walkthroughHtml = "";
    q.walkthrough.forEach(step => {
      walkthroughHtml += 
        '<div style="margin-bottom: 1rem; padding-left: 0.75rem; border-left: 3px solid var(--primary-light);">' +
          '<div style="font-weight: 700; color: var(--primary); font-size: 0.92rem; margin-bottom: 0.3rem;">' + step.title + '</div>' +
          '<div class="step-body" style="font-size: 0.9rem; line-height: 1.7;">' + step.body + '</div>' +
        '</div>';
    });

    card.innerHTML = 
      '<div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">' +
        '<div>' +
          '<span style="font-weight: 800; color: var(--primary); font-size: 0.85rem;">' + (type === 'A1' ? 'ASSIGNMENT 1' : 'ASSIGNMENT 2') + ' • ITEM ' + (idx + 1) + '</span>' +
          '<h4 style="font-size: 1.15rem; margin-top: 0.2rem;">' + q.title + '</h4>' +
        '</div>' +
        '<button class="btn btn-outline text-xs" onclick="loadSpecificProblem(\'' + q.id + '\')">Practice in Arena →</button>' +
      '</div>' +

      '<div style="font-size: 1rem; line-height: 1.8; margin-bottom: 1.25rem;">' +
        q.prompt +
      '</div>' +

      '<div style="background: var(--bg-subtle); border-radius: 8px; padding: 1.25rem; border: 1px solid var(--border-color);">' +
        '<div style="font-weight: 800; color: var(--success); font-size: 0.95rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">' +
          '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' +
          'Verified Final Answer: [Option ' + String.fromCharCode(65 + q.correctIndex) + ']' +
        '</div>' +
        '<div style="font-size: 1rem; margin-bottom: 1rem; font-weight: 600;">' +
          q.options[q.correctIndex] +
        '</div>' +

        '<details>' +
          '<summary style="font-weight: 700; color: var(--primary); cursor: pointer; padding: 0.3rem 0;">Show Full Step-by-Step Derivation & Proof</summary>' +
          '<div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-color);">' +
            walkthroughHtml +
            '<div class="exam-tip-box mt-2">' +
              '<div class="exam-tip-title">' +
                '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' +
                'Key Exam Strategy:' +
              '</div>' +
              '<div>' + q.examTip + '</div>' +
            '</div>' +
          '</div>' +
        '</details>' +
      '</div>';
    deck.appendChild(card);
  });

  renderMath(deck);
}

function renderBankExplorer() {
  filterBankQuestions();
}

function filterBankQuestions() {
  const container = document.getElementById("bank-questions-container");
  if (!container) return;

  const searchQuery = (document.getElementById("bank-search-input")?.value || "").toLowerCase().trim();
  const unitFilter = document.getElementById("bank-unit-filter")?.value || "ALL";
  const diffFilter = document.getElementById("bank-diff-filter")?.value || "ALL";

  const filtered = EXPANDED_QUESTION_BANK.filter(q => {
    const matchesUnit = (unitFilter === "ALL" || q.unitId === unitFilter);
    const matchesDiff = (diffFilter === "ALL" || q.difficulty === diffFilter);
    const matchesSearch = !searchQuery || 
      q.title.toLowerCase().includes(searchQuery) ||
      q.prompt.toLowerCase().includes(searchQuery) ||
      q.examTip.toLowerCase().includes(searchQuery);
    return matchesUnit && matchesDiff && matchesSearch;
  });

  const countInd = document.getElementById("bank-count-indicator");
  const solvedWithTimerCount = Object.values(APP_STATE.problemTimes).filter(p => p.solved).length;
  if (countInd) {
    countInd.innerHTML = "Showing " + filtered.length + " of " + EXPANDED_QUESTION_BANK.length + " problems &bull; ⏱️ Practice Time: <strong>" + formatTimeSpoken(APP_STATE.totalPracticeSeconds) + "</strong> &bull; Mastered: <strong>" + solvedWithTimerCount + "</strong>";
  }

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = 
      '<div class="card" style="text-align: center; padding: 3rem;">' +
        '<h4 style="color: var(--text-muted);">No problems found matching your criteria.</h4>' +
        '<p class="text-sm mt-1">Try clearing the search query or adjusting the filters.</p>' +
      '</div>';
    return;
  }

  filtered.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "card";

    let walkthroughHtml = "";
    q.walkthrough.forEach(step => {
      walkthroughHtml += 
        '<div style="margin-bottom: 1rem; padding-left: 0.75rem; border-left: 3px solid var(--primary-light);">' +
          '<div style="font-weight: 700; color: var(--primary); font-size: 0.92rem; margin-bottom: 0.3rem;">' + step.title + '</div>' +
          '<div class="step-body" style="font-size: 0.9rem; line-height: 1.7;">' + step.body + '</div>' +
        '</div>';
    });

    const targetSec = getDifficultyTargetSec(q.difficulty);
    const rec = APP_STATE.problemTimes[q.id];
    let timingBadge = "";
    if (rec && rec.solved) {
      timingBadge = "<span style='background: rgba(34, 197, 94, 0.1); color: #15803d; border: 1px solid rgba(34, 197, 94, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;'>⏱️ Best: " + formatTimeSpoken(rec.bestSeconds) + " ✓</span>";
    } else if (rec && rec.attempts > 0) {
      timingBadge = "<span style='background: rgba(245, 158, 11, 0.1); color: #b45309; border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;'>⏱️ Last: " + formatTimeSpoken(rec.lastSeconds) + "</span>";
    } else {
      timingBadge = "<span style='color: var(--text-muted); font-size: 0.75rem;'>🎯 Target: ~" + Math.round(targetSec/60) + "m</span>";
    }

    card.innerHTML = 
      '<div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">' +
        '<div>' +
          '<span style="font-weight: 800; color: var(--primary); font-size: 0.85rem;">' + q.unitId.toUpperCase().replace('-', ' ') + ' • ' + q.id.toUpperCase() + '</span>' +
          '<h4 style="font-size: 1.1rem; margin-top: 0.2rem;">' + q.title + '</h4>' +
        '</div>' +
        '<div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; justify-content: flex-end;">' +
          timingBadge +
          '<span class="difficulty-badge">' + q.difficulty + '</span>' +
          '<button class="btn btn-outline text-xs" style="padding: 0.3rem 0.6rem;" onclick="loadSpecificProblem(\'' + q.id + '\')">Practice with Timer →</button>' +
        '</div>' +
      '</div>' +

      '<div style="font-size: 1rem; line-height: 1.8; margin-bottom: 1rem;">' +
        q.prompt +
      '</div>' +

      '<div class="answers-container" style="margin-bottom: 1rem;">' +
        q.options.map((opt, oIdx) => 
          '<div style="padding: 0.6rem 0.9rem; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.92rem; display: flex; align-items: center; gap: 0.5rem; background-color: ' + (oIdx === q.correctIndex ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-subtle)') + ';">' +
            '<span style="font-weight: 700; color: ' + (oIdx === q.correctIndex ? 'var(--success)' : 'var(--text-muted)') + ';">[Option ' + String.fromCharCode(65 + oIdx) + ']</span>' +
            '<span>' + opt + '</span>' +
            (oIdx === q.correctIndex ? '<span style="margin-left: auto; font-weight: 800; color: var(--success); font-size: 0.75rem;">✓ CORRECT ANSWER</span>' : '') +
          '</div>'
        ).join('') +
      '</div>' +

      '<details style="cursor: pointer; margin-top: 0.75rem;">' +
        '<summary style="font-weight: 700; color: var(--accent); padding: 0.4rem 0;">Show Verified Step-by-Step Derivation</summary>' +
        '<div style="margin-top: 0.75rem; padding: 1rem; background-color: var(--bg-subtle); border-radius: 8px;">' +
          walkthroughHtml +
          '<div class="exam-tip-box mt-2">' +
            '<div class="exam-tip-title">' +
              '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' +
              'Key Exam Strategy:' +
            '</div>' +
            '<div>' + q.examTip + '</div>' +
          '</div>' +
        '</div>' +
      '</details>';
    container.appendChild(card);
  });

  renderMath(container);
}

function setExamDuration(minutes) {
  if (minutes === 0 || minutes === 'untimed') {
    APP_STATE.examMode.durationMinutes = 0;
    APP_STATE.examMode.isUntimed = true;
  } else {
    const mins = parseInt(minutes, 10);
    APP_STATE.examMode.durationMinutes = isNaN(mins) || mins <= 0 ? 45 : mins;
    APP_STATE.examMode.isUntimed = false;
  }
  saveState();
  updateDurationUI();
}

function applyCustomDuration() {
  const input = document.getElementById("exam-custom-minutes");
  if (!input) return;
  const val = parseInt(input.value, 10);
  if (isNaN(val) || val < 1 || val > 300) {
    alert("Please enter a valid duration between 1 and 300 minutes.");
    return;
  }
  setExamDuration(val);
}

function updateDurationUI() {
  const pills = document.querySelectorAll(".duration-pill");
  pills.forEach(p => {
    const d = parseInt(p.getAttribute("data-duration"), 10);
    if (APP_STATE.examMode.isUntimed && d === 0) {
      p.classList.add("active");
    } else if (!APP_STATE.examMode.isUntimed && d === APP_STATE.examMode.durationMinutes) {
      p.classList.add("active");
    } else {
      p.classList.remove("active");
    }
  });

  const customInput = document.getElementById("exam-custom-minutes");
  if (customInput && !APP_STATE.examMode.isUntimed) {
    customInput.value = APP_STATE.examMode.durationMinutes;
  }

  if (!APP_STATE.examMode.active) {
    const timerElem = document.getElementById("exam-timer");
    if (timerElem) {
      if (APP_STATE.examMode.isUntimed) {
        timerElem.innerText = "Untimed ♾️";
        timerElem.className = "timer-badge";
      } else {
        const mins = APP_STATE.examMode.durationMinutes;
        timerElem.innerText = mins.toString().padStart(2, '0') + ":00";
        timerElem.className = "timer-badge";
      }
    }
  }
}

function showExamStartScreen() {
  if (APP_STATE.examMode.timer) {
    clearInterval(APP_STATE.examMode.timer);
    APP_STATE.examMode.timer = null;
  }
  APP_STATE.examMode.active = false;
  APP_STATE.examMode.isPaused = false;

  const pauseBtn = document.getElementById("exam-pause-btn");
  if (pauseBtn) pauseBtn.style.display = "none";
  const startBtn = document.getElementById("exam-start-btn");
  if (startBtn) {
    startBtn.style.display = "inline-flex";
    startBtn.innerText = "Start Test";
    startBtn.onclick = () => startExam();
  }

  const container = document.getElementById("exam-body-container");
  if (!container) return;

  container.innerHTML = 
    '<div class="card" style="padding: 2.5rem; text-align: center;">' +
      '<h3 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--primary);">Configure Your Exam 1 Simulation</h3>' +
      '<p style="color: var(--text-muted); max-width: 650px; margin: 0 auto 1.5rem auto; line-height: 1.6;">' +
        'The simulation selects 10 comprehensive, strictly distinct problems covering all 7 course units: Optimization, Taylor & Binomial Series, Orthogonal Functions, Real & Complex Fourier Series, Vectors, Lines & Planes.' +
      '</p>' +

      '<div style="background: var(--bg-subtle); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.75rem; max-width: 700px; margin: 0 auto 2rem auto; text-align: left;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">' +
          '<div style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">⏱️ Select Exam Duration:</div>' +
          '<span class="text-xs" style="color: var(--text-muted);">Target pace: ~4.5 min / question</span>' +
        '</div>' +

        '<div class="duration-selector" style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 1.25rem;">' +
          '<button class="duration-pill ' + (APP_STATE.examMode.durationMinutes === 15 && !APP_STATE.examMode.isUntimed ? 'active' : '') + '" data-duration="15" onclick="setExamDuration(15)">⚡ 15 min (Quick Drill)</button>' +
          '<button class="duration-pill ' + (APP_STATE.examMode.durationMinutes === 30 && !APP_STATE.examMode.isUntimed ? 'active' : '') + '" data-duration="30" onclick="setExamDuration(30)">⏱️ 30 min (Speed Review)</button>' +
          '<button class="duration-pill ' + (APP_STATE.examMode.durationMinutes === 45 && !APP_STATE.examMode.isUntimed ? 'active' : '') + '" data-duration="45" onclick="setExamDuration(45)">🎯 45 min (Standard ME 1)</button>' +
          '<button class="duration-pill ' + (APP_STATE.examMode.durationMinutes === 60 && !APP_STATE.examMode.isUntimed ? 'active' : '') + '" data-duration="60" onclick="setExamDuration(60)">🕒 60 min (Extended Time)</button>' +
          '<button class="duration-pill ' + (APP_STATE.examMode.durationMinutes === 90 && !APP_STATE.examMode.isUntimed ? 'active' : '') + '" data-duration="90" onclick="setExamDuration(90)">⏳ 90 min (Full Period)</button>' +
          '<button class="duration-pill ' + (APP_STATE.examMode.isUntimed ? 'active' : '') + '" data-duration="0" onclick="setExamDuration(0)">♾️ Untimed Mode (No Clock Pressure)</button>' +
        '</div>' +

        '<div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; color: var(--text-main); flex-wrap: wrap;">' +
          '<span style="font-weight: 600;">Custom Time:</span>' +
          '<input type="number" id="exam-custom-minutes" min="1" max="300" value="' + (APP_STATE.examMode.isUntimed ? 45 : APP_STATE.examMode.durationMinutes) + '" style="width: 75px; padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-color); text-align: center; font-weight: 700;">' +
          '<span style="color: var(--text-muted);">minutes</span>' +
          '<button class="btn btn-outline text-xs" style="padding: 0.35rem 0.75rem;" onclick="applyCustomDuration()">Apply</button>' +
        '</div>' +
      '</div>' +

      '<div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">' +
        '<button class="btn btn-primary" style="font-size: 1.1rem; padding: 0.85rem 2.2rem; font-weight: 700;" onclick="startExam()">' +
          'Begin Exam 1 Simulation →' +
        '</button>' +
      '</div>' +
    '</div>';

  updateDurationUI();
}

function startExam(customMinutes) {
  if (customMinutes !== undefined) {
    setExamDuration(customMinutes);
  }

  APP_STATE.examMode.active = true;
  APP_STATE.examMode.isPaused = false;
  APP_STATE.examMode.currentIndex = 0;
  APP_STATE.examMode.userAnswers = [];
  APP_STATE.examMode.elapsedSeconds = 0;

  if (APP_STATE.examMode.isUntimed) {
    APP_STATE.examMode.secondsLeft = 0;
  } else {
    APP_STATE.examMode.secondsLeft = APP_STATE.examMode.durationMinutes * 60;
  }

  const shuffled = [...EXPANDED_QUESTION_BANK].sort(() => 0.5 - Math.random());
  const selected = [];
  const unitsSeen = new Set();
  
  for (const q of shuffled) {
    if (!unitsSeen.has(q.unitId)) {
      selected.push(formatProblem(q));
      unitsSeen.add(q.unitId);
      if (selected.length === 7) break;
    }
  }
  for (const q of shuffled) {
    if (!selected.some(s => s.id === q.id)) {
      selected.push(formatProblem(q));
      if (selected.length === 10) break;
    }
  }

  APP_STATE.examMode.questions = selected;

  if (APP_STATE.examMode.timer) clearInterval(APP_STATE.examMode.timer);
  APP_STATE.examMode.timer = setInterval(updateExamTimer, 1000);

  const pauseBtn = document.getElementById("exam-pause-btn");
  if (pauseBtn) {
    pauseBtn.style.display = "inline-flex";
    pauseBtn.innerText = "⏸️ Pause";
  }
  const startBtn = document.getElementById("exam-start-btn");
  if (startBtn) {
    startBtn.innerText = "Quit / Reset";
    startBtn.onclick = () => {
      if (confirm("Are you sure you want to end this exam early?")) {
        showExamStartScreen();
      }
    };
  }

  updateExamTimerDisplay();
  renderExamQuestion();
}

function updateExamTimer() {
  if (!APP_STATE.examMode.active || APP_STATE.examMode.isPaused) return;

  APP_STATE.examMode.elapsedSeconds++;

  if (!APP_STATE.examMode.isUntimed) {
    APP_STATE.examMode.secondsLeft--;
    if (APP_STATE.examMode.secondsLeft <= 0) {
      clearInterval(APP_STATE.examMode.timer);
      playIncorrectSound();
      alert("⏰ Time is up! Your exam will now be submitted and evaluated.");
      finishExam();
      return;
    }
  }

  updateExamTimerDisplay();
}

function updateExamTimerDisplay() {
  const timerElem = document.getElementById("exam-timer");
  if (!timerElem) return;

  if (APP_STATE.examMode.isUntimed) {
    const mins = Math.floor(APP_STATE.examMode.elapsedSeconds / 60);
    const secs = APP_STATE.examMode.elapsedSeconds % 60;
    timerElem.innerText = "⏱️ " + mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
    timerElem.className = "timer-badge";
  } else {
    const mins = Math.floor(APP_STATE.examMode.secondsLeft / 60);
    const secs = APP_STATE.examMode.secondsLeft % 60;
    timerElem.innerText = mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
    
    if (APP_STATE.examMode.secondsLeft <= 60) {
      timerElem.className = "timer-badge danger";
    } else if (APP_STATE.examMode.secondsLeft <= 300) {
      timerElem.className = "timer-badge warning";
    } else {
      timerElem.className = "timer-badge";
    }
  }
}

function toggleExamPause() {
  if (!APP_STATE.examMode.active) return;
  APP_STATE.examMode.isPaused = !APP_STATE.examMode.isPaused;
  const pauseBtn = document.getElementById("exam-pause-btn");
  if (pauseBtn) {
    pauseBtn.innerText = APP_STATE.examMode.isPaused ? "▶️ Resume" : "⏸️ Pause";
  }
  const timerElem = document.getElementById("exam-timer");
  if (timerElem && APP_STATE.examMode.isPaused) {
    timerElem.innerText = "PAUSED";
  } else {
    updateExamTimerDisplay();
  }
  renderExamQuestion();
}

function renderExamQuestion() {
  const container = document.getElementById("exam-body-container");
  if (!container) return;

  if (APP_STATE.examMode.isPaused) {
    container.innerHTML = 
      '<div class="card" style="padding: 3rem; text-align: center;">' +
        '<h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--primary);">⏸️ Exam Paused</h3>' +
        '<p style="color: var(--text-muted); margin-bottom: 1.5rem;">Take a quick breather! The timer is stopped. Click below to resume where you left off.</p>' +
        '<button class="btn btn-primary" onclick="toggleExamPause()">▶️ Resume Exam</button>' +
      '</div>';
    return;
  }

  const idx = APP_STATE.examMode.currentIndex;
  const q = APP_STATE.examMode.questions[idx];
  const total = APP_STATE.examMode.questions.length;

  container.innerHTML = 
    '<div class="card" style="padding: 2rem;">' +
      '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">' +
        '<span style="font-weight: 700; color: var(--primary);">QUESTION ' + (idx + 1) + ' OF ' + total + '</span>' +
        '<span class="text-xs" style="color: var(--text-muted); font-weight: 600;">' + q.unitId.toUpperCase() + ' • ' + q.title + '</span>' +
      '</div>' +

      '<div style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 1.5rem;">' +
        q.prompt +
      '</div>' +

      '<div class="answers-container">' +
        q.options.map((opt, oIdx) => 
          '<button class="option-btn ' + (APP_STATE.examMode.userAnswers[idx] === oIdx ? 'selected' : '') + '" onclick="selectExamOption(' + oIdx + ')">' +
            '<span class="option-text">' + opt + '</span>' +
            '<span style="opacity: 0.5; font-size: 0.8rem; margin-left: 1rem; flex-shrink: 0;">[Option ' + String.fromCharCode(65 + oIdx) + ']</span>' +
          '</button>'
        ).join('') +
      '</div>' +

      '<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; gap: 0.5rem;">' +
        '<button class="btn btn-outline" onclick="prevExamQuestion()"' + (idx === 0 ? ' disabled' : '') + '>← Previous</button>' +
        '<span class="text-xs" style="color: var(--text-muted);">Answered: ' + APP_STATE.examMode.userAnswers.filter(a => a !== undefined).length + ' / ' + total + '</span>' +
        (idx === total - 1 ? 
          '<button class="btn btn-primary" onclick="finishExam()">Submit Exam & View Report</button>' :
          '<button class="btn btn-primary" onclick="nextExamQuestion()">Next Question →</button>'
        ) +
      '</div>' +
    '</div>';
  renderMath(container);
}

function selectExamOption(oIdx) {
  APP_STATE.examMode.userAnswers[APP_STATE.examMode.currentIndex] = oIdx;
  renderExamQuestion();
}

function nextExamQuestion() {
  if (APP_STATE.examMode.currentIndex < APP_STATE.examMode.questions.length - 1) {
    APP_STATE.examMode.currentIndex++;
    renderExamQuestion();
  }
}

function prevExamQuestion() {
  if (APP_STATE.examMode.currentIndex > 0) {
    APP_STATE.examMode.currentIndex--;
    renderExamQuestion();
  }
}

function finishExam() {
  clearInterval(APP_STATE.examMode.timer);
  APP_STATE.examMode.active = false;

  const pauseBtn = document.getElementById("exam-pause-btn");
  if (pauseBtn) pauseBtn.style.display = "none";
  const startBtn = document.getElementById("exam-start-btn");
  if (startBtn) {
    startBtn.innerText = "Start Test";
    startBtn.onclick = () => startExam();
  }

  let correctCount = 0;
  const breakdown = [];

  APP_STATE.examMode.questions.forEach((q, idx) => {
    const userAns = APP_STATE.examMode.userAnswers[idx];
    const isCorrect = (userAns === q.correctIndex);
    if (isCorrect) correctCount++;

    let walkthroughHtml = "";
    q.walkthrough.forEach(step => {
      walkthroughHtml += 
        '<div style="margin-bottom: 0.75rem; padding-left: 0.75rem; border-left: 3px solid var(--primary-light);">' +
          '<div style="font-weight: 700; color: var(--primary); font-size: 0.9rem; margin-bottom: 0.2rem;">' + step.title + '</div>' +
          '<div class="step-body" style="font-size: 0.88rem; line-height: 1.6;">' + step.body + '</div>' +
        '</div>';
    });
    if (q.examTip) {
      walkthroughHtml += 
        '<div class="exam-tip-box mt-2" style="font-size: 0.85rem;">' +
          '<div class="exam-tip-title">Key Exam Strategy:</div>' +
          '<div>' + q.examTip + '</div>' +
        '</div>';
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

  const totalQuestions = APP_STATE.examMode.questions.length;
  const pct = Math.round((correctCount / totalQuestions) * 100);
  let grade = "A (Excellent!)";
  if (pct < 70) grade = "Needs Review";
  else if (pct < 80) grade = "Satisfactory (C)";
  else if (pct < 90) grade = "Good (B)";

  const elapsed = APP_STATE.examMode.elapsedSeconds;
  const elapsedMins = Math.floor(elapsed / 60);
  const elapsedSecs = elapsed % 60;
  const timeFormatted = elapsedMins + "m " + elapsedSecs + "s";
  const avgSecsPerQ = totalQuestions > 0 ? Math.round(elapsed / totalQuestions) : 0;
  const avgPaceFormatted = Math.floor(avgSecsPerQ / 60) + "m " + (avgSecsPerQ % 60) + "s";

  const timeAllowedText = APP_STATE.examMode.isUntimed 
    ? "Untimed Mode" 
    : APP_STATE.examMode.durationMinutes + " minutes";

  const container = document.getElementById("exam-body-container");
  if (!container) return;

  container.innerHTML = 
    '<div class="card" style="padding: 2.5rem;">' +
      '<div style="text-align: center; margin-bottom: 2rem;">' +
        '<h3 style="font-size: 2.2rem; font-weight: 900; color: var(--primary);">Exam 1 Score: ' + pct + '%</h3>' +
        '<p style="font-size: 1.15rem; color: var(--text-muted); margin-top: 0.3rem;">' +
          'You got <strong>' + correctCount + ' of ' + totalQuestions + '</strong> questions correct. Readiness: <strong>' + grade + '</strong>.' +
        '</p>' +
        
        '<div style="display: flex; justify-content: center; gap: 2rem; margin-top: 1.25rem; flex-wrap: wrap;">' +
          '<div style="background: var(--bg-subtle); padding: 0.75rem 1.25rem; border-radius: 10px; border: 1px solid var(--border-color);">' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Time Taken</div>' +
            '<div style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">⏱️ ' + timeFormatted + ' <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ ' + timeAllowedText + '</span></div>' +
          '</div>' +
          '<div style="background: var(--bg-subtle); padding: 0.75rem 1.25rem; border-radius: 10px; border: 1px solid var(--border-color);">' +
            '<div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Average Pace</div>' +
            '<div style="font-size: 1.2rem; font-weight: 800; color: var(--accent);">⚡ ' + avgPaceFormatted + ' / question</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<h4 style="margin-bottom: 1rem;">Detailed Diagnostic Breakdown:</h4>' +
      '<div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">' +
        breakdown.map(b => 
          '<div style="padding: 1rem 1.25rem; border-radius: 8px; border: 1px solid var(--border-color); background-color: ' + (b.isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)') + '; display: flex; flex-direction: column; gap: 0.5rem;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">' +
              '<div>' +
                '<span class="text-xs" style="color: var(--text-muted); font-weight: 700;">[' + b.unit + ']</span>' +
                '<strong> Q' + b.num + ': ' + b.name + '</strong>' +
                '<div class="text-xs" style="color: var(--text-muted); margin-top: 2px;">' +
                  (b.isCorrect ? '✓ Correct' : 'Your answer: ' + b.userAnswer + ' | Correct: ' + b.correctAnswer) +
                '</div>' +
              '</div>' +
              '<span style="font-weight: 800; color: ' + (b.isCorrect ? 'var(--success)' : 'var(--danger)') + ';">' +
                (b.isCorrect ? '+10 pts' : '0 pts') +
              '</span>' +
            '</div>' +
            '<details style="margin-top: 0.5rem; width: 100%; cursor: pointer;">' +
              '<summary style="font-size: 0.85rem; font-weight: 700; color: var(--primary); padding: 0.2rem 0;">📖 Show Full Step-by-Step Derivation & Strategy</summary>' +
              '<div style="margin-top: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-card); border-radius: 6px; border: 1px solid var(--border-color);">' +
                b.walkthroughHtml +
              '</div>' +
            '</details>' +
          '</div>'
        ).join('') +
      '</div>' +

      '<div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">' +
        '<div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">' +
          '<button class="btn btn-primary" onclick="startExam()">Retake Exam (' + timeAllowedText + ')</button>' +
          '<button class="btn btn-outline" onclick="showExamStartScreen()">Change Duration / Retake</button>' +
          '<button class="btn btn-outline" onclick="switchView(\'' + 'skills-view' + '\')">Back to Skills</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  renderMath(container);
}

function plotCurve(type) {
  const canvas = document.getElementById("curve-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const xMin = -6, xMax = 6;
  const yMin = -4, yMax = 4;
  const toScreenX = (x) => ((x - xMin) / (xMax - xMin)) * w;
  const toScreenY = (y) => h - ((y - yMin) / (yMax - yMin)) * h;

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;

  for (let x = Math.ceil(xMin); x <= xMax; x++) {
    ctx.beginPath();
    ctx.moveTo(toScreenX(x), 0);
    ctx.lineTo(toScreenX(x), h);
    ctx.stroke();
  }
  for (let y = Math.ceil(yMin); y <= yMax; y++) {
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(y));
    ctx.lineTo(w, toScreenY(y));
    ctx.stroke();
  }

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, toScreenY(0));
  ctx.lineTo(w, toScreenY(0));
  ctx.moveTo(toScreenX(0), 0);
  ctx.lineTo(toScreenX(0), h);
  ctx.stroke();

  const legend = document.getElementById("curve-legend");

  if (type === "curve1") {
    legend.innerHTML = "Plotting <strong>y = (x+1)/x²</strong>. Blue = Curve, Red Dashed = Asymptote (x=0, y=0), Green Dot = Local Min (-2, -0.25), Purple Dot = Inflection (-3, -2/9).";

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), h);
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(w, toScreenY(0));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    let started = false;
    for (let x = -8; x < -0.05; x += 0.05) {
      const y = (x + 1) / (x * x);
      if (y >= yMin && y <= yMax) {
        if (!started) { ctx.moveTo(toScreenX(x), toScreenY(y)); started = true; }
        else { ctx.lineTo(toScreenX(x), toScreenY(y)); }
      } else { started = false; }
    }
    ctx.stroke();

    ctx.beginPath();
    started = false;
    for (let x = 0.15; x <= 8; x += 0.05) {
      const y = (x + 1) / (x * x);
      if (y >= yMin && y <= yMax) {
        if (!started) { ctx.moveTo(toScreenX(x), toScreenY(y)); started = true; }
        else { ctx.lineTo(toScreenX(x), toScreenY(y)); }
      } else { started = false; }
    }
    ctx.stroke();

    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(toScreenX(-2), toScreenY(-0.25), 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#9333ea";
    ctx.beginPath();
    ctx.arc(toScreenX(-3), toScreenY(-2/9), 5, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === "curve2") {
    legend.innerHTML = "Plotting <strong>y = 1 - x²/(x-1)</strong>. Blue = Curve, Red Dashed = Asymptotes (x=1, slant y = -x), Green Dot = Local Min (0, 1), Amber Dot = Local Max (2, -3).";

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(toScreenX(1), 0);
    ctx.lineTo(toScreenX(1), h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toScreenX(xMin), toScreenY(-xMin));
    ctx.lineTo(toScreenX(xMax), toScreenY(-xMax));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    let started = false;
    for (let x = -8; x < 0.95; x += 0.05) {
      const y = 1 - (x * x) / (x - 1);
      if (y >= yMin && y <= yMax) {
        if (!started) { ctx.moveTo(toScreenX(x), toScreenY(y)); started = true; }
        else { ctx.lineTo(toScreenX(x), toScreenY(y)); }
      } else { started = false; }
    }
    ctx.stroke();

    ctx.beginPath();
    started = false;
    for (let x = 1.05; x <= 8; x += 0.05) {
      const y = 1 - (x * x) / (x - 1);
      if (y >= yMin && y <= yMax) {
        if (!started) { ctx.moveTo(toScreenX(x), toScreenY(y)); started = true; }
        else { ctx.lineTo(toScreenX(x), toScreenY(y)); }
      } else { started = false; }
    }
    ctx.stroke();

    ctx.fillStyle = "#16a34a";
    ctx.beginPath();
    ctx.arc(toScreenX(0), toScreenY(1), 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(toScreenX(2), toScreenY(-3), 6, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === "curve3") {
    legend.innerHTML = "Plotting <strong>y = 2 - x²/(x+2)</strong>. Slant Asymptote: y = -x + 4, Vertical Asymptote: x = -2.";

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(toScreenX(-2), 0);
    ctx.lineTo(toScreenX(-2), h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toScreenX(xMin), toScreenY(-xMin + 4));
    ctx.lineTo(toScreenX(xMax), toScreenY(-xMax + 4));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    let started = false;
    for (let x = -8; x < -2.05; x += 0.05) {
      const y = 2 - (x * x) / (x + 2);
      if (y >= yMin && y <= yMax) {
        if (!started) { ctx.moveTo(toScreenX(x), toScreenY(y)); started = true; }
        else { ctx.lineTo(toScreenX(x), toScreenY(y)); }
      } else { started = false; }
    }
    ctx.stroke();

    ctx.beginPath();
    started = false;
    for (let x = -1.95; x <= 8; x += 0.05) {
      const y = 2 - (x * x) / (x + 2);
      if (y >= yMin && y <= yMax) {
        if (!started) { ctx.moveTo(toScreenX(x), toScreenY(y)); started = true; }
        else { ctx.lineTo(toScreenX(x), toScreenY(y)); }
      } else { started = false; }
    }
    ctx.stroke();
  }
}

function plotFourier(waveType) {
  const canvas = document.getElementById("fourier-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const paddingLeft = 40;
  const paddingBottom = 40;
  const plotW = w - paddingLeft - 20;
  const plotH = h - paddingBottom - 20;

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, 20);
  ctx.lineTo(paddingLeft, h - paddingBottom);
  ctx.lineTo(w - 20, h - paddingBottom);
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "11px system-ui";
  ctx.fillText("|cₙ|", 10, 30);
  ctx.fillText("Harmonic Frequency n", w - 120, h - 15);

  const harmonics = [];
  const maxN = 10;

  if (waveType === "exp") {
    for (let n = -maxN; n <= maxN; n++) {
      const cn = 1 / (Math.PI * (1 + n * n));
      harmonics.push({ n, cn });
    }
    document.getElementById("fourier-legend").innerText = "Displaying spectrum |cₙ| = 1/[π(1+n²)] for f(x) = e^(-|x|). Notice the monotonic Lorentzian 1/n² harmonic decay.";
  } else {
    for (let n = -maxN; n <= maxN; n++) {
      const cn = n === 0 ? 0.5 : Math.abs(Math.sin(n * Math.PI / 2) / (n * Math.PI));
      harmonics.push({ n, cn });
    }
    document.getElementById("fourier-legend").innerText = "Displaying sinc spectrum |cₙ| for Rectangular Pulse Waveform. Even harmonics vanish identically.";
  }

  const maxVal = Math.max(...harmonics.map(h => h.cn));
  const numStems = harmonics.length;
  const dx = plotW / (numStems + 1);

  harmonics.forEach((hItem, idx) => {
    const x = paddingLeft + (idx + 1) * dx;
    const stemH = (hItem.cn / maxVal) * (plotH * 0.8);
    const y = (h - paddingBottom) - stemH;

    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, h - paddingBottom);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = "#1e40af";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    if (hItem.n % 2 === 0) {
      ctx.fillStyle = "#64748b";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(hItem.n, x, h - paddingBottom + 15);
    }
  });
}

let isDrawing = false;
let scratchMode = 'pen';

function initScratchpad() {
  const canvas = document.getElementById("scratchpad-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startDraw = (e) => {
    isDrawing = true;
    draw(e);
  };
  const stopDraw = () => {
    isDrawing = false;
    ctx.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineWidth = (scratchMode === 'eraser') ? 20 : 2.5;
    ctx.lineCap = 'round';
    if (scratchMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      const isDark = (typeof document !== "undefined" && document.body.getAttribute("data-theme") === "dark");
      ctx.strokeStyle = isDark ? '#93c5fd' : '#1e3a8a';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
  canvas.addEventListener('touchend', stopDraw);
}

function setScratchMode(mode) {
  scratchMode = mode;
  const penBtn = document.getElementById("scratch-pen-btn");
  const eraserBtn = document.getElementById("scratch-eraser-btn");
  if (penBtn && eraserBtn) {
    if (mode === 'pen') {
      penBtn.classList.add("active");
      eraserBtn.classList.remove("active");
    } else {
      eraserBtn.classList.add("active");
      penBtn.classList.remove("active");
    }
  }
}

function clearScratchpad() {
  const canvas = document.getElementById("scratchpad-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const FORMULA_SECTIONS = [
  {
    "title": "1. Calculus, Curve Sketching & Extrema (Unit 1 & Lamar Calc I)",
    "formulas": [
      {
        "name": "Cubic Critical Numbers Average & Inflection Abscissa",
        "formula": "$$ f(x)=ax^3+bx^2+cx+d \\implies \\frac{x_1+x_2}{2} = x_{\\text{inf}} = -\\frac{b}{3a} $$",
        "note": "Roots of f'(x)=0 satisfy Vieta's sum x₁ + x₂ = -2b/(3a)."
      },
      {
        "name": "First & Second Derivative Tests for Extrema & Concavity",
        "formula": "$$ f'(x_0)=0: \\quad f''(x_0)>0 \\implies \\text{Local Min } (\\smile), \\quad f''(x_0)<0 \\implies \\text{Local Max } (\\frown) $$",
        "note": "f''(x)=0 with a sign change across x₀ indicates an inflection point."
      },
      {
        "name": "Slant (Oblique) Asymptote via Polynomial Division",
        "formula": "$$ y(x) = \\frac{P(x)}{Q(x)} = mx + b + \\frac{R(x)}{Q(x)} \\implies y = mx + b \\quad (\\text{when } \\deg(P) = \\deg(Q) + 1) $$",
        "note": "Example: 1 - x²/(x-1) = -x - 1/(x-1), giving slant asymptote y = -x."
      },
      {
        "name": "Rational Curve Zeroes, Extrema & Asymptotes",
        "formula": "$$ y = \\frac{x-c}{x^2} \\implies y' = \\frac{2c-x}{x^3}=0 \\implies x=2c, \\quad y'' = \\frac{2x-6c}{x^4}=0 \\implies x=3c $$",
        "note": "Vertical asymptote at x = 0; horizontal asymptote at y = 0 as x → ±∞."
      }
    ]
  },
  {
    "title": "2. Multivariable Optimization & Constraints (Unit 2 & Lamar Calc III)",
    "formulas": [
      {
        "name": "Two-Variable Hessian Determinant Test (Second Partials)",
        "formula": "$$ D = f_{xx}f_{yy} - (f_{xy})^2: \\quad D>0, f_{xx}>0 \\implies \\text{Min}; \\quad D>0, f_{xx}<0 \\implies \\text{Max}; \\quad D<0 \\implies \\text{Saddle} $$",
        "note": "If D = 0, the test is inconclusive."
      },
      {
        "name": "Single-Constraint Lagrange Multipliers",
        "formula": "$$ \\nabla f(x,y,z) = \\lambda \\nabla g(x,y,z), \\quad g(x,y,z) = k $$",
        "note": "Equate gradient components: f_x = λg_x, f_y = λg_y, f_z = λg_z."
      },
      {
        "name": "Two Simultaneous Constraints (Lamar Multi-Constraint)",
        "formula": "$$ \\nabla f = \\lambda \\nabla g + \\mu \\nabla h, \\quad g(x,y,z) = k_1, \\quad h(x,y,z) = k_2 $$",
        "note": "Used for intersecting surfaces (e.g. plane 2x - y - z = 2 and cylinder x² + y² = 1)."
      },
      {
        "name": "Open-Top Rectangular Box Volume Maximization",
        "formula": "$$ S = xy + 2xz + 2yz \\implies x = y = 2z = \\sqrt{\\frac{S}{3}}, \\quad z = \\sqrt{\\frac{S}{12}}, \\quad V_{\\max} = \\frac{S^{3/2}}{6\\sqrt{3}} $$",
        "note": "Base is square x = y; height is half the base width."
      },
      {
        "name": "Closed Rectangular Box (With Lid) Optimization",
        "formula": "$$ S = 2xy + 2xz + 2yz \\implies x = y = z = \\sqrt{\\frac{S}{6}} \\quad (\\text{Cube is Optimal}), \\quad V_{\\max} = \\left(\\frac{S}{6}\\right)^{3/2} $$",
        "note": "Equal surface area partition across all 6 faces maximizes enclosed volume."
      },
      {
        "name": "Storage Silo Volume Maximization (Cylinder + Hemisphere Dome)",
        "formula": "$$ S = 3\\pi r^2 + 2\\pi rh \\implies r = h = \\sqrt{\\frac{S}{5\\pi}}, \\quad V_{\\max} = \\frac{5\\pi}{3} r^3 $$",
        "note": "Optimality condition: Cylinder height equals radius (H = R)."
      },
      {
        "name": "Trapezoidal Cooling Duct Maximum Airflow Section",
        "formula": "$$ \\text{Bend strip } W \\text{ into 3 panels } \\implies \\theta = 60^\\circ \\left(\\frac{\\pi}{3}\\right), \\quad x = y = \\frac{W}{3}, \\quad A_{\\max} = \\frac{\\sqrt{3}}{12} W^2 $$",
        "note": "Symmetric half-hexagon profile maximizes cross-sectional flow area."
      },
      {
        "name": "Linear Objective on Circular Constraint (Lamar 2D Shortcut)",
        "formula": "$$ f(x,y) = Ax + By \\text{ subject to } x^2 + y^2 = R^2 \\implies f_{\\text{ext}} = \\pm R\\sqrt{A^2 + B^2} $$",
        "note": "Extremal points occur at (x, y) = ±(AR / √(A²+B²), BR / √(A²+B²))."
      },
      {
        "name": "Linear Objective on 3D Sphere (Lamar 3D Shortcut)",
        "formula": "$$ f(x,y,z) = Ax + By + Cz \\text{ on } x^2 + y^2 + z^2 = R^2 \\implies f_{\\text{ext}} = \\pm R\\sqrt{A^2 + B^2 + C^2} $$",
        "note": "Collinearity ⟨A, B, C⟩ = 2λ⟨x, y, z⟩ guarantees absolute extrema along normal."
      },
      {
        "name": "Point-to-Plane Distance via Lagrange Multipliers",
        "formula": "$$ \\min (x-x_0)^2 + (y-y_0)^2 + (z-z_0)^2 \\text{ on } Ax+By+Cz=D \\implies d = \\frac{|Ax_0+By_0+Cz_0-D|}{\\sqrt{A^2+B^2+C^2}} $$",
        "note": "Geometric orthogonal distance directly derived from ∇f = λ∇g."
      }
    ]
  },
  {
    "title": "3. Power Series & Taylor Approximations (Unit 3 & Lamar Calc II)",
    "formulas": [
      {
        "name": "Cauchy Ratio Test for Radius of Convergence",
        "formula": "$$ L = \\lim_{n\\to\\infty} \\left| \\frac{a_{n+1}}{a_n} \\right| \\implies R = \\frac{1}{L} = \\lim_{n\\to\\infty} \\left| \\frac{a_n}{a_{n+1}} \\right|, \\quad |x-a| < R $$",
        "note": "Series converges absolutely for |x - a| < R; test endpoints separately."
      },
      {
        "name": "General Taylor & Maclaurin Series",
        "formula": "$$ f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(a)}{n!}(x-a)^n = f(a) + f'(a)(x-a) + \\frac{f''(a)}{2!}(x-a)^2 + \\dots $$",
        "note": "Maclaurin series corresponds to expansion center a = 0."
      },
      {
        "name": "Lagrange Remainder (Truncation Error Bound)",
        "formula": "$$ |R_n(x)| = \\frac{|f^{(n+1)}(\\xi)|}{(n+1)!} |x-a|^{n+1}, \\quad \\xi \\in (\\min(a,x), \\max(a,x)) $$",
        "note": "Bound the (n+1)-th derivative by its maximum on [a, x] to get the error ceiling."
      },
      {
        "name": "Alternating Series Error Bound (Leibniz Remainder)",
        "formula": "$$ |R_n(x)| = |f(x) - S_n(x)| \\le |a_{n+1}| $$",
        "note": "For alternating series, truncation error is strictly bounded by the magnitude of the first neglected term."
      },
      {
        "name": "Trigonometric Taylor Series in Two Groups (about a = π/4)",
        "formula": "$$ \\sin(x) = \\frac{\\sqrt{2}}{2}\\sum_{n=0}^\\infty \\frac{(-1)^n}{(2n)!}\\left(x-\\frac{\\pi}{4}\\right)^{2n} + \\frac{\\sqrt{2}}{2}\\sum_{n=0}^\\infty \\frac{(-1)^n}{(2n+1)!}\\left(x-\\frac{\\pi}{4}\\right)^{2n+1} $$",
        "note": "Group 1 contains even powers (cosine-like); Group 2 contains odd powers (sine-like)."
      },
      {
        "name": "Logarithmic Taylor Series (about a = 1 and a = 2)",
        "formula": "$$ \\ln(x) = \\sum_{n=1}^\\infty \\frac{(-1)^{n-1}}{n}(x-1)^n, \\quad \\ln(x) = \\ln(2) + \\sum_{n=1}^\\infty \\frac{(-1)^{n-1}}{n 2^n}(x-2)^n $$",
        "note": "The n = 0 term f(a) = ln(a) must be written separately from the general derivative sum."
      },
      {
        "name": "Negative Power Taylor Series (about a = -1)",
        "formula": "$$ \\frac{1}{x^2} = \\sum_{n=0}^\\infty (n+1)(x+1)^n, \\quad \\frac{1}{x} = -\\sum_{n=0}^\\infty (x+1)^n \\quad (|x+1| < 1) $$",
        "note": "Signs (-1)ⁿ and (-1)^{-(n+2)} cancel out to produce all positive coefficients."
      },
      {
        "name": "Geometric Series & Term-by-Term Differentiation",
        "formula": "$$ \\frac{1}{1-x} = \\sum_{n=0}^\\infty x^n, \\quad \\frac{1}{(1-x)^2} = \\sum_{n=1}^\\infty n x^{n-1} \\quad (|x| < 1) $$",
        "note": "Power series can be differentiated term-by-term inside the radius of convergence R = 1."
      },
      {
        "name": "Binomial Series for Fractional Powers",
        "formula": "$$ (1+x)^k = 1 + kx + \\frac{k(k-1)}{2!}x^2 + \\frac{k(k-1)(k-2)}{3!}x^3 + \\dots = \\sum_{n=0}^\\infty \\binom{k}{n} x^n $$",
        "note": "Converges for |x| < 1. For (1+x)^{-1/2}: 1 - (1/2)x + (3/8)x² - (5/16)x³ + ..."
      },
      {
        "name": "Standard Elementary Maclaurin Expansions",
        "formula": "$$ e^x = \\sum_{n=0}^\\infty \\frac{x^n}{n!}, \\quad \\cos(x) = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n}}{(2n)!}, \\quad \\sin(x) = \\sum_{n=0}^\\infty \\frac{(-1)^n x^{2n+1}}{(2n+1)!} $$",
        "note": "All three standard series have infinite radius of convergence R = ∞."
      }
    ]
  },
  {
    "title": "4. Orthogonal Functions & Hilbert Spaces (Unit 4)",
    "formulas": [
      {
        "name": "Function Inner Product & Orthogonality",
        "formula": "$$ \\langle f, g \\rangle = \\int_a^b f(x)g(x)\\,dx = 0 \\iff f \\perp g \\quad \\text{on } [a, b] $$",
        "note": "Zero inner product means the two functions are mutually orthogonal."
      },
      {
        "name": "L² Norm & Metric Distance in Function Space",
        "formula": "$$ \\|f\\| = \\sqrt{\\langle f, f \\rangle} = \\sqrt{\\int_a^b [f(x)]^2\\,dx}, \\quad \\text{dist}(f, g) = \\|f - g\\| $$",
        "note": "The L² norm corresponds to the root-mean-square magnitude of a signal."
      },
      {
        "name": "Generalized Pythagorean Theorem for Functions",
        "formula": "$$ \\langle \\phi_m, \\phi_n \\rangle = 0 \\implies \\|\\phi_m + \\phi_n\\|^2 = \\|\\phi_m\\|^2 + \\|\\phi_n\\|^2 $$",
        "note": "Cross terms 2⟨ϕ_m, ϕ_n⟩ vanish identically due to orthogonality."
      },
      {
        "name": "Norm of Orthonormal Linear Combination",
        "formula": "$$ f = \\sum_{k=1}^N c_k \\phi_k, \\quad \\langle \\phi_i, \\phi_j \\rangle = \\delta_{ij} \\implies \\|f\\|^2 = \\sum_{k=1}^N |c_k|^2 $$",
        "note": "Total energy equals the sum of squares of the modal coordinates."
      },
      {
        "name": "Legendre Polynomials & Norms on [-1, 1]",
        "formula": "$$ P_0=1, \\quad P_1=x, \\quad P_2=\\frac{3x^2-1}{2}, \\quad \\|P_n\\|^2 = \\int_{-1}^1 [P_n(x)]^2\\,dx = \\frac{2}{2n+1} $$",
        "note": "Parity rule: odd polynomials are automatically orthogonal to even polynomials on symmetric intervals."
      },
      {
        "name": "Harmonic Trigonometric Orthogonality on [0, L]",
        "formula": "$$ \\int_0^L \\sin\\left(\\frac{m\\pi x}{L}\\right)\\sin\\left(\\frac{n\\pi x}{L}\\right)dx = \\begin{cases} 0 & m \\neq n \\\\ \\frac{L}{2} & m = n \\end{cases} $$",
        "note": "Normalized basis functions are √(2/L) sin(nπx/L)."
      }
    ]
  },
  {
    "title": "5. Real & Complex Fourier Series (Unit 5)",
    "formulas": [
      {
        "name": "Real Fourier Series on [-L, L]",
        "formula": "$$ f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty \\left[ a_n \\cos\\left(\\frac{n\\pi x}{L}\\right) + b_n \\sin\\left(\\frac{n\\pi x}{L}\\right) \\right] $$",
        "note": "Period T = 2L. If f is even, b_n = 0; if f is odd, a_0 = a_n = 0."
      },
      {
        "name": "Euler-Fourier Coefficient Formulas",
        "formula": "$$ a_0 = \\frac{1}{L}\\int_{-L}^L f(x)dx, \\quad a_n = \\frac{1}{L}\\int_{-L}^L f(x)\\cos\\left(\\frac{n\\pi x}{L}\\right)dx, \\quad b_n = \\frac{1}{L}\\int_{-L}^L f(x)\\sin\\left(\\frac{n\\pi x}{L}\\right)dx $$",
        "note": "For symmetric intervals: even functions use 2/L ∫₀ᴸ, odd functions vanish."
      },
      {
        "name": "Half-Range Fourier Sine & Cosine Series on [0, L]",
        "formula": "$$ f_{\\text{even}}(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty a_n \\cos\\left(\\frac{n\\pi x}{L}\\right), \\quad f_{\\text{odd}}(x) = \\sum_{n=1}^\\infty b_n \\sin\\left(\\frac{n\\pi x}{L}\\right) $$",
        "note": "Even extension produces pure cosine series (b_n = 0); odd extension produces pure sine series (a_n = 0)."
      },
      {
        "name": "Dirichlet Theorem at Jump Discontinuities",
        "formula": "$$ S(x_0) = \\frac{f(x_0^+) + f(x_0^-)}{2} \\quad (\\text{Midpoint Average}) $$",
        "note": "Used to sum infinite numerical series by evaluating Fourier series at points of interest."
      },
      {
        "name": "Parseval's Identity (Harmonic Energy Conservation)",
        "formula": "$$ \\frac{1}{2L}\\int_{-L}^L [f(x)]^2\\,dx = \\frac{a_0^2}{4} + \\frac{1}{2}\\sum_{n=1}^\\infty (a_n^2 + b_n^2) = \\sum_{n=-\\infty}^\\infty |c_n|^2 $$",
        "note": "Total signal power equals the sum of the powers of individual harmonic frequency components."
      },
      {
        "name": "Complex Exponential Fourier Series & Spectra",
        "formula": "$$ f(x) = \\sum_{n=-\\infty}^\\infty c_n e^{in\\pi x/L}, \\quad c_n = \\frac{1}{2L}\\int_{-L}^L f(x)e^{-in\\pi x/L}\\,dx, \\quad c_n = \\frac{a_n - i b_n}{2} $$",
        "note": "Two-sided discrete frequency spectrum |c_n| plotted against ω_n = nπ/L."
      },
      {
        "name": "Harmonic Amplitude & Phase Angle Conversion",
        "formula": "$$ |c_n| = \\frac{1}{2}\\sqrt{a_n^2 + b_n^2}, \\quad \\phi_n = -\\arctan\\left(\\frac{b_n}{a_n}\\right), \\quad a_n \\cos(\\omega_n x) + b_n \\sin(\\omega_n x) = A_n \\cos(\\omega_n x - \\phi_n) $$",
        "note": "Relates trigonometric Fourier form to polar amplitude-phase harmonic representation."
      },
      {
        "name": "Exponential-Trigonometric Integration Shortcut",
        "formula": "$$ \\int e^{ax}\\cos(bx)\\,dx = \\frac{e^{ax}}{a^2+b^2}[a\\cos(bx) + b\\sin(bx)], \\quad \\int e^{ax}\\sin(bx)\\,dx = \\frac{e^{ax}}{a^2+b^2}[a\\sin(bx) - b\\cos(bx)] $$",
        "note": "Essential for Assignment 2 Q1 and Q5: avoids tedious double integration by parts."
      }
    ]
  },
  {
    "title": "6. Vector Algebra & 3D Analytic Geometry (Units 6 & 7 & Lamar)",
    "formulas": [
      {
        "name": "Displacement Vector, Norm & Unit Vector",
        "formula": "$$ \\vec{P_1P_2} = \\langle x_2-x_1, y_2-y_1, z_2-z_1 \\rangle, \\quad \\|\\vec{v}\\| = \\sqrt{v_1^2 + v_2^2 + v_3^2}, \\quad \\hat{u} = \\frac{\\vec{v}}{\\|\\vec{v}\\|} $$",
        "note": "Length is Euclidean norm; unit vector has magnitude 1."
      },
      {
        "name": "Dot Product, Angle & Orthogonality Test",
        "formula": "$$ \\vec{a} \\cdot \\vec{b} = a_1 b_1 + a_2 b_2 + a_3 b_3 = \\|\\vec{a}\\| \\|\\vec{b}\\| \\cos\\theta \\implies \\cos\\theta = \\frac{\\vec{a}\\cdot\\vec{b}}{\\|\\vec{a}\\| \\|\\vec{b}\\|} $$",
        "note": "Two non-zero vectors are orthogonal if and only if a · b = 0."
      },
      {
        "name": "Direction Cosines (Lamar Vector Coordinates)",
        "formula": "$$ \\cos\\alpha = \\frac{v_1}{\\|\\vec{v}\\|}, \\quad \\cos\\beta = \\frac{v_2}{\\|\\vec{v}\\|}, \\quad \\cos\\gamma = \\frac{v_3}{\\|\\vec{v}\\|}, \\quad \\cos^2\\alpha + \\cos^2\\beta + \\cos^2\\gamma = 1 $$",
        "note": "Direction cosines are the components of the normalized unit vector u = v / ||v||."
      },
      {
        "name": "Scalar Component & Vector Projection",
        "formula": "$$ \\text{comp}_{\\vec{a}}\\vec{b} = \\frac{\\vec{a}\\cdot\\vec{b}}{\\|\\vec{a}\\|}, \\quad \\text{proj}_{\\vec{a}}\\vec{b} = \\left(\\frac{\\vec{a}\\cdot\\vec{b}}{\\|\\vec{a}\\|^2}\\right)\\vec{a} $$",
        "note": "If a · b = 0, then the scalar component is 0 and the projection is the zero vector 0."
      },
      {
        "name": "Cross Product (Normal to Two 3D Vectors)",
        "formula": "$$ \\vec{a} \\times \\vec{b} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ a_1 & a_2 & a_3 \\\\ b_1 & b_2 & b_3 \\end{vmatrix} = \\langle a_2 b_3 - a_3 b_2, -(a_1 b_3 - a_3 b_1), a_1 b_2 - a_2 b_1 \\rangle $$",
        "note": "Cross product produces a vector mutually perpendicular to both a and b."
      },
      {
        "name": "Parallelogram & Triangle Area via Cross Product",
        "formula": "$$ A_{\\text{parallelogram}} = \\|\\vec{a} \\times \\vec{b}\\|, \\qquad A_{\\text{triangle}} = \\frac{1}{2}\\|\\vec{a} \\times \\vec{b}\\| $$",
        "note": "Magnitude of cross product equals base times height in 3D Euclidean space."
      },
      {
        "name": "Scalar Triple Product & Coplanarity Test for 4 Points",
        "formula": "$$ \\vec{u} \\cdot (\\vec{v} \\times \\vec{w}) = \\det[\\vec{u}, \\vec{v}, \\vec{w}] = 0 \\iff P_1, P_2, P_3, P_4 \\text{ are Coplanar} $$",
        "note": "Volume of parallelopiped is |u · (v × w)|; vanishes if all vectors lie in one plane."
      },
      {
        "name": "3D Line Equations (Parametric & Symmetric)",
        "formula": "$$ \\vec{r}(t) = \\vec{r}_0 + t\\vec{v}: \\quad \\begin{cases} x = x_0 + at \\\\ y = y_0 + bt \\\\ z = z_0 + ct \\end{cases} \\iff \\frac{x-x_0}{a} = \\frac{y-y_0}{b} = \\frac{z-z_0}{c} $$",
        "note": "The direction vector v = ⟨a, b, c⟩ defines the orientation; (x₀, y₀, z₀) is a point on the line."
      },
      {
        "name": "Distance from 3D Point P to Line Passing Through P₀",
        "formula": "$$ d(P, \\text{Line}) = \\frac{\\|\\vec{P_0P} \\times \\vec{v}\\|}{\\|\\vec{v}\\|} $$",
        "note": "Geometric height of parallelogram spanned by displacement vector P₀P and line direction vector v."
      },
      {
        "name": "Distance Between Two Skew Lines in Space",
        "formula": "$$ d = \\frac{|(\\vec{r}_2 - \\vec{r}_1) \\cdot (\\vec{v}_1 \\times \\vec{v}_2)|}{\\|\\vec{v}_1 \\times \\vec{v}_2\\|} $$",
        "note": "Normal vector to both lines is n = v₁ × v₂; distance is projection of displacement onto unit normal."
      },
      {
        "name": "Standard Equation of a Plane (Point-Normal Form)",
        "formula": "$$ \\vec{n} \\cdot (\\vec{r} - \\vec{r}_0) = 0 \\implies A(x-x_0) + B(y-y_0) + C(z-z_0) = 0 \\iff Ax + By + Cz = D $$",
        "note": "Normal vector n = ⟨A, B, C⟩ is found via cross product of two non-collinear vectors in the plane."
      },
      {
        "name": "Distance from Point (x₀, y₀, z₀) to Plane Ax + By + Cz = D",
        "formula": "$$ d = \\frac{|Ax_0 + By_0 + Cz_0 - D|}{\\sqrt{A^2 + B^2 + C^2}} $$",
        "note": "Orthogonal projection distance along the unit normal vector."
      },
      {
        "name": "Distance Between Two Parallel Planes",
        "formula": "$$ \\Pi_1: Ax+By+Cz=D_1, \\quad \\Pi_2: Ax+By+Cz=D_2 \\implies d = \\frac{|D_1 - D_2|}{\\sqrt{A^2+B^2+C^2}} $$",
        "note": "Planes must be scaled to share identical coefficients A, B, and C."
      },
      {
        "name": "Plane Containing Line and Perpendicular to Given Plane",
        "formula": "$$ \\vec{n}_{\\text{new}} = \\vec{v}_{\\text{line}} \\times \\vec{n}_{\\text{ref}} $$",
        "note": "The normal to the new plane must be perpendicular to both the line and the reference normal."
      },
      {
        "name": "Line & Plane Orthogonality vs Parallelism Criteria",
        "formula": "$$ \\text{Line } \\parallel \\text{ Plane} \\iff \\vec{v} \\cdot \\vec{n} = 0; \\qquad \\text{Line } \\perp \\text{ Plane} \\iff \\vec{v} \\times \\vec{n} = \\mathbf{0} \\quad (\\vec{v} = k\\vec{n}) $$",
        "note": "Crucial rule: A line is parallel to a plane when its direction vector is perpendicular to the normal!"
      }
    ]
  }
];

function renderFormulaSheet() {
  const container = document.getElementById("formula-grid-container");
  if (!container) return;
  container.innerHTML = "";

  FORMULA_SECTIONS.forEach(sec => {
    const div = document.createElement("div");
    div.className = "formula-section";
    div.innerHTML = 
      "<h3>" + sec.title + "</h3>" +
      sec.formulas.map(f => 
        '<div class="formula-item">' +
          '<div class="formula-name">' + f.name + '</div>' +
          '<div class="formula-math" style="overflow-x: auto; padding: 0.35rem 0; font-size: 1.05rem;">' + f.formula + '</div>' +
          (f.note ? '<div class="text-xs" style="color: var(--text-muted); margin-top: 0.25rem; font-style: italic;">💡 ' + f.note + '</div>' : '') +
        '</div>'
      ).join('');
    container.appendChild(div);
  });

  renderMath(container);
  setTimeout(() => renderMath(container), 200);
}

function switchView(viewId) {
  document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  const panel = document.getElementById(viewId);
  if (panel) panel.classList.add("active");

  if (viewId === "skills-view") {
    const tab = document.getElementById("tab-skills");
    if (tab) tab.classList.add("active");
    renderSkillsGrid();
  }
  else if (viewId === "practice-view") {
    const tab = document.getElementById("tab-practice");
    if (tab) tab.classList.add("active");
  }
  else if (viewId === "bank-view") {
    const tab = document.getElementById("tab-bank");
    if (tab) tab.classList.add("active");
    renderBankExplorer();
  }
  else if (viewId === "assignment-view") {
    const tab = document.getElementById("tab-assignment");
    if (tab) tab.classList.add("active");
    showAssignmentDeck('A1');
  }
  else if (viewId === "exam-view") {
    const tab = document.getElementById("tab-exam");
    if (tab) tab.classList.add("active");
    if (!APP_STATE.examMode.active) {
      showExamStartScreen();
    }
  }
  else if (viewId === "visualizer-view") {
    const tab = document.getElementById("tab-visualizer");
    if (tab) tab.classList.add("active");
    plotCurve('curve1');
    plotFourier('exp');
  }
  else if (viewId === "formulas-view") {
    const tab = document.getElementById("tab-formulas");
    if (tab) tab.classList.add("active");
    renderFormulaSheet();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderMath(document.getElementById(viewId) || document.body);
}

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
          { left: "\\[", right: "\\]", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.warn("KaTeX render error:", e);
    }
  } else if (retries > 0 && typeof setTimeout === "function") {
    // Retry polling if KaTeX CDN script is still downloading
    setTimeout(() => renderMath(targetElement, retries - 1), 100);
  }
}

document.addEventListener("keydown", (e) => {
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA")) {
    return;
  }

  if (e.key === "Enter") {
    const nextBtn = document.getElementById("next-btn");
    if (nextBtn && nextBtn.style.display !== "none") {
      loadNextProblem();
    } else {
      const submitBtn = document.getElementById("submit-btn");
      if (submitBtn && submitBtn.style.display !== "none") {
        submitAnswer();
      }
    }
  } else if (!APP_STATE.answered && document.getElementById("practice-view")?.classList.contains("active")) {
    const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
    const k = e.key.toLowerCase();
    if (keyMap[k] !== undefined) {
      selectOption(keyMap[k]);
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadSavedState();
  renderSkillsGrid();
  initScratchpad();
  renderFormulaSheet();
  
  loadSkillProblem("s1_2");

  renderMath(document.body);
  setTimeout(() => renderMath(document.body), 150);
  setTimeout(() => renderMath(document.body), 500);
});
