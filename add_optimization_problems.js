// add_optimization_problems.js
const fs = require('fs');

const newOptimizationProblems = [
  {
    "id": "q2_opt_beam_strength",
    "unitId": "unit-2",
    "skillId": "s2_5",
    "difficulty": "Standard",
    "title": "Maximum Strength Rectangular Beam from a Cylindrical Log",
    "prompt": "A timber beam of rectangular cross-section with width $w$ and depth $d$ is cut from a cylindrical tree log of circular diameter $D$. The bending strength $S$ of a rectangular beam is proportional to the width and the square of the depth, namely $S = k w d^2$, where $k$ is an empirical material constant. Find the optimal ratio of depth to width, $d/w$, and the dimensions $w$ and $d$ that maximize the beam's bending strength.",
    "options": [
      "Width $w = D/2$, depth $d = D\\sqrt{3}/2$, with ratio $d/w = \\sqrt{3} \\approx 1.732$",
      "Width $w = D/\\sqrt{2}$, depth $d = D/\\sqrt{2}$, with ratio $d/w = 1.000$ (square cross-section)",
      "Width $w = D/\\sqrt{3}$, depth $d = D\\sqrt{2/3}$, with ratio $d/w = \\sqrt{2} \\approx 1.414$",
      "Width $w = 2D/3$, depth $d = D/3$, with ratio $d/w = 0.500$"
    ],
    "correctIndex": 2,
    "walkthrough": [
      {
        "title": "Step 1: Constraint & Objective Function",
        "body": "The beam's rectangular cross-section fits inside the circle of diameter $D$:\n\\[ w^2 + d^2 = D^2 \\implies d^2 = D^2 - w^2 \\]\nSubstitute $d^2$ directly into the bending strength formula:\n\\[ S(w) = k w (D^2 - w^2) = k (D^2 w - w^3) \\]"
      },
      {
        "title": "Step 2: Differentiate with Respect to Width",
        "body": "Set the first derivative to zero for a critical point:\n\\[ \\frac{dS}{dw} = k (D^2 - 3w^2) = 0 \\implies 3w^2 = D^2 \\implies w = \\frac{D}{\\sqrt{3}} \\]\nCheck the second derivative:\n\\[ \\frac{d^2S}{dw^2} = -6kw < 0 \\quad (\\text{strictly concave for } w > 0, \\text{ confirming an absolute maximum}) \\]"
      },
      {
        "title": "Step 3: Depth and Aspect Ratio",
        "body": "Substitute $w = D/\\sqrt{3}$ into $d^2 = D^2 - w^2$:\n\\[ d^2 = D^2 - \\frac{D^2}{3} = \\frac{2D^2}{3} \\implies d = D\\sqrt{\\frac{2}{3}} \\]\nThe optimal ratio of depth to width is:\n\\[ \\frac{d}{w} = \\frac{D\\sqrt{2/3}}{D/\\sqrt{3}} = \\sqrt{\\frac{2/3}{1/3}} = \\sqrt{2} \\approx 1.414 \\]"
      }
    ],
    "examTip": "Bending strength depends on the elastic section modulus $Z = \\frac{w d^2}{6}$, which is quadratic in depth. Therefore, making the beam deeper ($d/w = \\sqrt{2}$) yields much higher strength than a square beam ($d/w = 1$) cut from the same tree trunk!"
  },
  {
    "id": "q2_opt_beam_stiffness",
    "unitId": "unit-2",
    "skillId": "s2_5",
    "difficulty": "Standard",
    "title": "Maximum Flexural Stiffness Beam Cut from a Circular Log",
    "prompt": "A rectangular wooden beam of width $w$ and depth $d$ is milled from a circular tree trunk of diameter $D$. The beam's resistance to elastic deflection (flexural stiffness) is governed by its area moment of inertia $I = \\frac{1}{12} w d^3$. Find the dimensions $w$ and $d$ in terms of $D$, and the depth-to-width ratio $d/w$, that maximize the flexural stiffness of the beam.",
    "options": [
      "Width $w = \\frac{D}{2}$, depth $d = \\frac{\\sqrt{3}D}{2}$, ratio $\\frac{d}{w} = \\sqrt{3} \\approx 1.732$",
      "Width $w = \\frac{D}{\\sqrt{3}}$, depth $d = D\\sqrt{\\frac{2}{3}}$, ratio $\\frac{d}{w} = \\sqrt{2} \\approx 1.414$",
      "Width $w = \\frac{D}{\\sqrt{2}}$, depth $d = \\frac{D}{\\sqrt{2}}$, ratio $\\frac{d}{w} = 1.000$",
      "Width $w = \\frac{D}{4}$, depth $d = \\frac{\\sqrt{15}D}{4}$, ratio $\\frac{d}{w} = \\sqrt{15} \\approx 3.873$"
    ],
    "correctIndex": 0,
    "walkthrough": [
      {
        "title": "Step 1: Constraint & Objective Formulation",
        "body": "The circular log provides the constraint $w^2 + d^2 = D^2$.\nWe wish to maximize $I(w, d) = \\frac{1}{12} w d^3$, which is equivalent to maximizing $f(w, d) = w d^3$ subject to $g(w, d) = w^2 + d^2 = D^2$."
      },
      {
        "title": "Step 2: Lagrange Multiplier Gradient Condition",
        "body": "Using $\\nabla f = \\lambda \\nabla g$:\n\\[ \\nabla f = \\langle d^3, 3wd^2 \\rangle, \\quad \\nabla g = \\langle 2w, 2d \\rangle \\]\nEquating components:\n\\[ d^3 = 2\\lambda w \\implies \\lambda = \\frac{d^3}{2w} \\]\n\\[ 3wd^2 = 2\\lambda d \\implies \\lambda = \\frac{3wd}{2} \\]\nEquating the two expressions for $\\lambda$:\n\\[ \\frac{d^3}{2w} = \\frac{3wd}{2} \\implies d^2 = 3w^2 \\implies \\frac{d}{w} = \\sqrt{3} \\approx 1.732 \\]"
      },
      {
        "title": "Step 3: Determining the Dimensions",
        "body": "Substitute $d^2 = 3w^2$ into $w^2 + d^2 = D^2$:\n\\[ w^2 + 3w^2 = D^2 \\implies 4w^2 = D^2 \\implies w = \\frac{D}{2} \\]\n\\[ d = \\sqrt{3} w = \\frac{\\sqrt{3}D}{2} \\]\nThus, maximum flexural stiffness requires width $w = D/2$, depth $d = D\\sqrt{3}/2$, with aspect ratio $d/w = \\sqrt{3} \\approx 1.732$."
      }
    ],
    "examTip": "Contrast this with bending strength ($S \\propto w d^2$, ratio $\\sqrt{2}$): because deflection depends cubically on depth ($I \\propto w d^3$), stiffness favors an even deeper and narrower beam with aspect ratio $\\sqrt{3} \\approx 1.732$!"
  },
  {
    "id": "q2_opt_truss_weight",
    "unitId": "unit-2",
    "skillId": "s2_5",
    "difficulty": "Exam Challenge",
    "title": "Minimum Weight Symmetric Two-Bar Pin-Jointed Truss",
    "prompt": "A symmetric two-bar pin-jointed truss spans a horizontal distance $2L$ between two rigid wall supports at the same elevation. A single vertical downward load $P$ is applied at the central apex node located at height $h$ below the support level. The length of each strut is $S = \\sqrt{L^2 + h^2}$. The allowable compressive stress in each strut is $\\sigma_{allow}$. The total volume (and hence total weight) of the two struts is $V(h) = 2 A S = \\frac{P(L^2 + h^2)}{\\sigma_{allow} h}$. Find the optimal height $h^*$ and member inclination angle $\\theta$ with respect to the horizontal that minimizes the total material weight of the truss.",
    "options": [
      "Height $h^* = \\frac{L}{\\sqrt{3}}$, angle $\\theta = 30^\\circ$",
      "Height $h^* = L$, angle $\\theta = 45^\\circ$",
      "Height $h^* = L\\sqrt{3}$, angle $\\theta = 60^\\circ$",
      "Height $h^* = \\frac{L}{2}$, angle $\\theta = 26.6^\\circ$"
    ],
    "correctIndex": 1,
    "walkthrough": [
      {
        "title": "Step 1: Statics & Strut Sizing",
        "body": "Let $\\theta$ be the angle each bar makes below the horizontal, so $\\sin\\theta = \\frac{h}{\\sqrt{L^2+h^2}}$.\nVertical equilibrium at the loaded joint:\n\\[ 2 F \\sin\\theta = P \\implies F = \\frac{P}{2\\sin\\theta} = \\frac{P\\sqrt{L^2+h^2}}{2h} \\]\nThe minimum required cross-sectional area per strut is $A = \\frac{F}{\\sigma_{allow}} = \\frac{P\\sqrt{L^2+h^2}}{2\\sigma_{allow} h}$."
      },
      {
        "title": "Step 2: Total Truss Volume Formulation",
        "body": "The combined volume of both struts, each of length $S = \\sqrt{L^2+h^2}$, is:\n\\[ V(h) = 2 A S = 2\\left(\\frac{P\\sqrt{L^2+h^2}}{2\\sigma_{allow} h}\\right)\\sqrt{L^2+h^2} = \\frac{P(L^2 + h^2)}{\\sigma_{allow} h} = \\frac{P}{\\sigma_{allow}}\\left(\\frac{L^2}{h} + h\\right) \\]"
      },
      {
        "title": "Step 3: Minimization & Optimal Geometry",
        "body": "Differentiating with respect to height $h$:\n\\[ \\frac{dV}{dh} = \\frac{P}{\\sigma_{allow}}\\left(-\\frac{L^2}{h^2} + 1\\right) = 0 \\implies h^2 = L^2 \\implies h^* = L \\]\nThe second derivative is $\\frac{d^2V}{dh^2} = \\frac{2PL^2}{\\sigma_{allow} h^3} > 0$, guaranteeing a minimum.\nAt $h^* = L$, $\\tan\\theta = \\frac{h^*}{L} = \\frac{L}{L} = 1 \\implies \\theta = 45^\\circ$."
      }
    ],
    "examTip": "This classic structural mechanics problem demonstrates the trade-off: a shallow truss ($h \\to 0$) experiences huge compressive forces, while a deep truss ($h \\to \\infty$) requires excessively long bars. The optimal balance occurs exactly at $h = L$ ($\theta = 45^\\circ$)!"
  },
  {
    "id": "q2_opt_snell_fermat",
    "unitId": "unit-2",
    "skillId": "s2_5",
    "difficulty": "Exam Challenge",
    "title": "Fermat's Principle of Least Time & Derivation of Snell's Law",
    "prompt": "A wave travels from point $A(0, a)$ in Medium 1 (propagation speed $v_1$) to point $B(d, -b)$ in Medium 2 (propagation speed $v_2$), crossing the horizontal interface $y=0$ at point $P(x, 0)$ where $0 \\le x \\le d$. Fermat's Principle states that the actual path taken minimizes the total travel time $T(x)$. Express $T(x)$ in terms of $x$, take its derivative $dT/dx = 0$, and identify the fundamental physical law that results.",
    "options": [
      "Conservation of momentum: $v_1 \\cos\\theta_1 = v_2 \\cos\\theta_2$",
      "Brewster's angle criterion: $\\tan\\theta_1 \\tan\\theta_2 = v_1 / v_2$",
      "Doppler frequency shift: $\\frac{\\lambda_1}{v_1} = \\frac{\\lambda_2}{v_2}$",
      "Snell's Law of Refraction: $\\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2}$"
    ],
    "correctIndex": 3,
    "walkthrough": [
      {
        "title": "Step 1: Path Geometry & Travel Time Expression",
        "body": "The straight-line path from $A(0, a)$ to interface crossing point $P(x, 0)$ has length $s_1 = \\sqrt{x^2 + a^2}$.\nThe path from $P(x, 0)$ to $B(d, -b)$ has length $s_2 = \\sqrt{(d - x)^2 + b^2}$.\nTotal transit time $T(x)$ is:\n\\[ T(x) = \\frac{s_1}{v_1} + \\frac{s_2}{v_2} = \\frac{\\sqrt{x^2 + a^2}}{v_1} + \\frac{\\sqrt{(d - x)^2 + b^2}}{v_2} \\]"
      },
      {
        "title": "Step 2: Stationary Time Condition",
        "body": "Differentiating with respect to $x$:\n\\[ \\frac{dT}{dx} = \\frac{1}{v_1} \\frac{x}{\\sqrt{x^2 + a^2}} + \\frac{1}{v_2} \\frac{-(d - x)}{\\sqrt{(d - x)^2 + b^2}} = 0 \\]\n\\[ \\implies \\frac{1}{v_1}\\frac{x}{\\sqrt{x^2 + a^2}} = \\frac{1}{v_2}\\frac{d - x}{\\sqrt{(d - x)^2 + b^2}} \\]"
      },
      {
        "title": "Step 3: Geometric Identification of Angles",
        "body": "From the right triangles formed by the interface normal at $P$:\n\\[ \\sin\\theta_1 = \\frac{x}{\\sqrt{x^2 + a^2}}, \\quad \\sin\\theta_2 = \\frac{d - x}{\\sqrt{(d - x)^2 + b^2}} \\]\nSubstituting these trigonometric identities yields:\n\\[ \\frac{\\sin\\theta_1}{v_1} = \\frac{\\sin\\theta_2}{v_2} \\iff n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2 \\]\nwhich is Snell's Law of Refraction!"
      }
    ],
    "examTip": "Calculus reveals why light bends at interfaces: light always takes the path of least time, not the path of least distance! The stationarity condition $dT/dx = 0$ directly produces Snell's Law."
  },
  {
    "id": "q2_opt_pipe_diameter",
    "unitId": "unit-2",
    "skillId": "s2_5",
    "difficulty": "Standard",
    "title": "Economic Pipe Diameter Balancing Capital Cost & Pumping Power",
    "prompt": "In pipeline design, increasing pipe inner diameter $D$ increases pipe manufacturing and excavation capital cost $C_{cap}(D) = a D$, but drastically decreases fluid friction pressure drop and annual pumping electrical cost $C_{pump}(D) = \\frac{b}{D^5}$ (by the Darcy-Weisbach / Hagen-Poiseuille relations). The total life-cycle annual cost is $C(D) = a D + \\frac{b}{D^5}$, where $a, b > 0$. Find the optimal economic diameter $D^*$ that minimizes total annual cost.",
    "options": [
      "$D^* = \\left(\\frac{5b}{a}\\right)^{1/6}$",
      "$D^* = \\left(\\frac{b}{5a}\\right)^{1/5}$",
      "$D^* = \\left(\\frac{a}{5b}\\right)^{1/6}$",
      "$D^* = \\left(\\frac{5b}{a}\\right)^{1/4}$"
    ],
    "correctIndex": 0,
    "walkthrough": [
      {
        "title": "Step 1: Cost Objective Function",
        "body": "The total cost function is:\n\\[ C(D) = a D + b D^{-5} \\quad (D > 0) \\]"
      },
      {
        "title": "Step 2: First Derivative & Critical Diameter",
        "body": "Differentiating with respect to diameter $D$:\n\\[ \\frac{dC}{dD} = a - 5b D^{-6} = a - \\frac{5b}{D^6} = 0 \\]\nSolving for $D^6$:\n\\[ D^6 = \\frac{5b}{a} \\implies D^* = \\left(\\frac{5b}{a}\\right)^{1/6} \\]"
      },
      {
        "title": "Step 3: Verification of Minimum",
        "body": "Checking the second derivative:\n\\[ \\frac{d^2C}{dD^2} = (-6)(-5b) D^{-7} = \\frac{30b}{D^7} > 0 \\quad (\\text{for all } D > 0) \\]\nBecause the second derivative is strictly positive, $D^*$ represents the unique global cost minimum."
      }
    ],
    "examTip": "In engineering economics, when an objective has opposing terms of powers $D^1$ and $D^{-n}$, the optimal scale is always of the form $D^* = (n b / a)^{1/(n+1)}$. Here $n=5$, producing exponent $1/6$!"
  },
  {
    "id": "q2_opt_critical_insulation",
    "unitId": "unit-2",
    "skillId": "s2_6",
    "difficulty": "Standard",
    "title": "Critical Radius of Thermal Insulation on a Cylindrical Pipe",
    "prompt": "A circular pipe of outer radius $r_i$ carrying hot fluid is wrapped with insulation of thermal conductivity $k$ and outer radius $r \\ge r_i$. Heat dissipates into ambient air with convection coefficient $h$. Per unit length, the total thermal resistance is $R_{tot}(r) = R_{cond} + R_{conv} = \\frac{\\ln(r/r_i)}{2\\pi k} + \\frac{1}{2\\pi r h}$. Find the critical insulation radius $r_{cr}$ where total thermal resistance is stationary, and determine whether heat transfer is maximized or minimized at this radius.",
    "options": [
      "$r_{cr} = \\frac{h}{k}$; thermal resistance is maximized (heat transfer is minimized)",
      "$r_{cr} = \\frac{2k}{h}$; thermal resistance is minimized (heat transfer is maximized)",
      "$r_{cr} = \\frac{k}{h}$; thermal resistance is minimized (heat transfer is maximized)",
      "$r_{cr} = \\sqrt{\\frac{k}{h}}$; thermal resistance is stationary with an inflection point"
    ],
    "correctIndex": 2,
    "walkthrough": [
      {
        "title": "Step 1: Thermal Resistance Function",
        "body": "The total thermal resistance per unit length of pipe is:\n\\[ R_{tot}(r) = \\frac{1}{2\\pi}\\left[ \\frac{\\ln(r) - \\ln(r_i)}{k} + \\frac{1}{h r} \\right] \\]"
      },
      {
        "title": "Step 2: Differentiating to Find Critical Radius",
        "body": "Differentiating with respect to outer radius $r$:\n\\[ \\frac{dR_{tot}}{dr} = \\frac{1}{2\\pi}\\left[ \\frac{1}{k r} - \\frac{1}{h r^2} \\right] = 0 \\]\nMultiplying inside the brackets by $k h r^2$:\n\\[ h r - k = 0 \\implies r_{cr} = \\frac{k}{h} \\]"
      },
      {
        "title": "Step 3: Second Derivative & Heat Transfer Interpretation",
        "body": "Computing the second derivative:\n\\[ \\frac{d^2R_{tot}}{dr^2} = \\frac{1}{2\\pi}\\left[ -\\frac{1}{k r^2} + \\frac{2}{h r^3} \\right] \\]\nEvaluating at $r_{cr} = k/h$:\n\\[ \\left.\\frac{d^2R_{tot}}{dr^2}\\right|_{r=k/h} = \\frac{1}{2\\pi}\\left[ -\\frac{h^2}{k^3} + \\frac{2h^2}{k^3} \\right] = \\frac{h^2}{2\\pi k^3} > 0 \\]\nSince $\\frac{d^2R_{tot}}{dr^2} > 0$, thermal resistance $R_{tot}$ reaches a local MINIMUM at $r_{cr} = k/h$.\nBecause heat loss is $Q = \\Delta T / R_{tot}$, minimizing resistance MAXIMIZES heat transfer!"
      }
    ],
    "examTip": "A vital ME heat transfer concept: for cylinders, adding insulation with radius $r < r_{cr} = k/h$ actually increases heat loss because increasing the convective surface area dominates over adding conduction resistance!"
  },
  {
    "id": "q2_opt_lamp_illuminance",
    "unitId": "unit-2",
    "skillId": "s2_6",
    "difficulty": "Standard",
    "title": "Optimal Lamp Height for Maximum Peripheral Illuminance",
    "prompt": "A point light source of luminous intensity $I$ hangs at height $h > 0$ directly above the center of a circular table of radius $R$. By Lambert's cosine law and the inverse square law, the illuminance at a point on the perimeter of the table is $E(h) = \\frac{I \\cos\\theta}{d^2}$, where $d = \\sqrt{R^2 + h^2}$ is the distance to the edge and $\\cos\\theta = \\frac{h}{d} = \\frac{h}{\\sqrt{R^2 + h^2}}$. Thus $E(h) = \\frac{I h}{(R^2 + h^2)^{3/2}}$. What height $h^*$ maximizes illuminance at the edge of the table?",
    "options": [
      "$h^* = R$",
      "$h^* = \\frac{R}{\\sqrt{2}} \\approx 0.707 R$",
      "$h^* = R\\sqrt{2} \\approx 1.414 R$",
      "$h^* = \\frac{R}{2} = 0.500 R$"
    ],
    "correctIndex": 1,
    "walkthrough": [
      {
        "title": "Step 1: Illuminance Function Setup",
        "body": "The illuminance expression is:\n\\[ E(h) = I h (R^2 + h^2)^{-3/2} \\quad (h > 0) \\]"
      },
      {
        "title": "Step 2: Differentiating Using the Product Rule",
        "body": "Differentiating with respect to $h$:\n\\[ \\frac{dE}{dh} = I \\left[ 1 \\cdot (R^2 + h^2)^{-3/2} + h \\left(-\\frac{3}{2}\\right)(R^2 + h^2)^{-5/2}(2h) \\right] \\]\nFactor out $(R^2 + h^2)^{-5/2}$:\n\\[ \\frac{dE}{dh} = I (R^2 + h^2)^{-5/2} \\left[ (R^2 + h^2) - 3h^2 \\right] = I (R^2 + h^2)^{-5/2} (R^2 - 2h^2) \\]"
      },
      {
        "title": "Step 3: Finding the Optimal Height",
        "body": "Setting $\\frac{dE}{dh} = 0$:\n\\[ R^2 - 2h^2 = 0 \\implies 2h^2 = R^2 \\implies h^* = \\frac{R}{\\sqrt{2}} \\approx 0.707 R \\]\nFor $h < R/\\sqrt{2}$, $dE/dh > 0$; for $h > R/\\sqrt{2}$, $dE/dh < 0$. Therefore, $h^* = R/\\sqrt{2}$ yields the global maximum illuminance."
      }
    ],
    "examTip": "At $h = 0$, the light hits horizontally so $\\cos\\theta = 0 \\implies E = 0$. At $h \\to \\infty$, distance is infinite so $E \\to 0$. The peak is exactly at $h^* = R/\\sqrt{2} \\approx 0.707 R$!"
  },
  {
    "id": "q2_opt_elliptic_paraboloid_dist",
    "unitId": "unit-2",
    "skillId": "s2_6",
    "difficulty": "Exam Challenge",
    "title": "Shortest Distance from a Point to an Elliptic Paraboloid",
    "prompt": "Use the method of Lagrange multipliers to find the shortest distance from the point $(0, 0, 4)$ to the elliptic paraboloid $z = 2x^2 + y^2$.",
    "options": [
      "Shortest distance is $d = 4$, occurring at $(0, 0, 0)$",
      "Shortest distance is $d = \\sqrt{7} \\approx 2.646$, occurring at $(0, \\pm\\sqrt{3}, 3)$",
      "Shortest distance is $d = \\frac{\\sqrt{31}}{4} \\approx 1.392$, occurring at $\\left(\\pm\\sqrt{\\frac{15}{8}}, 0, \\frac{15}{4}\\right)$",
      "Shortest distance is $d = \\frac{\\sqrt{15}}{2} \\approx 1.936$, occurring at $(\\pm 1, \\pm 1, 3)$"
    ],
    "correctIndex": 2,
    "walkthrough": [
      {
        "title": "Step 1: Formulate the Objective & Constraint",
        "body": "Minimize squared distance from $(0, 0, 4)$:\n\\[ f(x, y, z) = x^2 + y^2 + (z - 4)^2 \\]\nsubject to the surface constraint:\n\\[ g(x, y, z) = 2x^2 + y^2 - z = 0 \\]"
      },
      {
        "title": "Step 2: Lagrange Multiplier Equations",
        "body": "Equating gradients $\\nabla f = \\lambda \\nabla g$:\n\\[ \\langle 2x, 2y, 2(z - 4) \\rangle = \\lambda \\langle 4x, 2y, -1 \\rangle \\]\nThis gives three scalar equations:\n1) $2x = 4\\lambda x \\implies 2x(1 - 2\\lambda) = 0$\n2) $2y = 2\\lambda y \\implies 2y(1 - \\lambda) = 0$\n3) $2(z - 4) = -\\lambda$"
      },
      {
        "title": "Step 3: Solve Cases and Compare Distances",
        "body": "Case 1: $x = 0, y = 0 \\implies z = 0$. At $(0,0,0)$, $f = 0^2 + 0^2 + (0-4)^2 = 16 \\implies d = 4$.\nCase 2: $y \\neq 0 \\implies \\lambda = 1$. Then $x = 0$, and eq 3 gives $2(z - 4) = -1 \\implies z = 7/2$. Constraint gives $y^2 = 7/2$. Squared distance is $f = 0 + 7/2 + (7/2-4)^2 = 7/2 + 1/4 = 15/4 \\implies d = \\sqrt{15}/2 \\approx 1.936$.\nCase 3: $x \\neq 0 \\implies \\lambda = 1/2$. Then $y = 0$, and eq 3 gives $2(z - 4) = -1/2 \\implies z = 15/4$. Constraint gives $2x^2 = 15/4 \\implies x^2 = 15/8$. Squared distance is $f = 15/8 + 0 + (15/4-4)^2 = 15/8 + 1/16 = 31/16 \\implies d = \\frac{\\sqrt{31}}{4} \\approx 1.392$.\nComparing all cases, $1.392 < 1.936 < 4$, so the shortest distance is $d = \\sqrt{31}/4 \\approx 1.392$."
      }
    ],
    "examTip": "Because the coefficient of $x^2$ (2) is larger than that of $y^2$ (1), the surface curves upward more steeply in the $x$-direction, reaching closest to $(0,0,4)$ along the $xz$-plane where $y = 0$!"
  },
  {
    "id": "q2_opt_cobb_douglas_budget",
    "unitId": "unit-2",
    "skillId": "s2_6",
    "difficulty": "Standard",
    "title": "Constrained Resource Allocation: Cobb-Douglas Production Function",
    "prompt": "An engineering manufacturing plant's output is modeled by the Cobb-Douglas production function $P(K, L) = 100 K^{0.4} L^{0.6}$, where $K$ is capital units (costing \\$20 per unit) and $L$ is labor units (costing \\$30 per unit). The total budget is fixed at \\$1,200, so $20K + 30L = 1200$. Use Lagrange multipliers to determine the optimal capital $K^*$ and labor $L^*$ that maximize production output, and compute the maximum production $P_{\\max}$.",
    "options": [
      "$K^* = 24$, $L^* = 24$, with $P_{\\max} = 2,400$",
      "$K^* = 30$, $L^* = 20$, with $P_{\\max} = 2,150$",
      "$K^* = 20$, $L^* = 26.7$, with $P_{\\max} = 1,980$",
      "$K^* = 40$, $L^* = 13.3$, with $P_{\\max} = 1,600$"
    ],
    "correctIndex": 0,
    "walkthrough": [
      {
        "title": "Step 1: Gradients & Lagrange Multipliers",
        "body": "Objective: $P(K, L) = 100 K^{0.4} L^{0.6}$, subject to $g(K, L) = 20K + 30L = 1200$.\n\\[ \\nabla P = \\left\\langle 40 K^{-0.6} L^{0.6}, 60 K^{0.4} L^{-0.4} \\right\\rangle, \\quad \\nabla g = \\langle 20, 30 \\rangle \\]\nEquating $\\nabla P = \\lambda \\nabla g$:\n\\[ 40 K^{-0.6} L^{0.6} = 20\\lambda \\implies \\lambda = 2 K^{-0.6} L^{0.6} \\]\n\\[ 60 K^{0.4} L^{-0.4} = 30\\lambda \\implies \\lambda = 2 K^{0.4} L^{-0.4} \\]"
      },
      {
        "title": "Step 2: Relate Factors of Production",
        "body": "Equating the two expressions for $\\lambda$:\n\\[ 2 K^{-0.6} L^{0.6} = 2 K^{0.4} L^{-0.4} \\implies \\frac{L^{0.6}}{L^{-0.4}} = \\frac{K^{0.4}}{K^{-0.6}} \\implies L = K \\]"
      },
      {
        "title": "Step 3: Solve for Optimal Inputs and Maximum Output",
        "body": "Substitute $L = K$ into the budget equation $20K + 30L = 1200$:\n\\[ 20K + 30K = 50K = 1200 \\implies K^* = 24, \\quad L^* = 24 \\]\nCompute maximum production output:\n\\[ P_{\\max} = 100 (24)^{0.4} (24)^{0.6} = 100 (24)^{1.0} = 2,400 \\]"
      }
    ],
    "examTip": "For Cobb-Douglas $P = A K^a L^b$ with budget $p_K K + p_L L = B$, the expenditure on $K$ is always fraction $\\frac{a}{a+b}$ of the budget: $20K = \\frac{0.4}{1.0}(1200) = 480 \\implies K = 24$!"
  },
  {
    "id": "q2_opt_paraboloid_plane_dual",
    "unitId": "unit-2",
    "skillId": "s2_6",
    "difficulty": "Exam Challenge",
    "title": "Dual Lagrange Multipliers: Extreme Heights on Paraboloid-Plane Intersection",
    "prompt": "Find the maximum and minimum $z$-coordinates (highest and lowest points) along the curve of intersection formed by the circular paraboloid $z = x^2 + y^2$ and the tilted plane $x + y + z = 1$.",
    "options": [
      "$z_{\\min} = 0$, $z_{\\max} = 4$",
      "$z_{\\min} = 2 - \\sqrt{3} \\approx 0.268$, $z_{\\max} = 2 + \\sqrt{3} \\approx 3.732$",
      "$z_{\\min} = 1 - \\frac{1}{\\sqrt{2}} \\approx 0.293$, $z_{\\max} = 1 + \\frac{1}{\\sqrt{2}} \\approx 1.707$",
      "$z_{\\min} = \\frac{1}{2}$, $z_{\\max} = 2$"
    ],
    "correctIndex": 1,
    "walkthrough": [
      {
        "title": "Step 1: Two Constraints Lagrange Multipliers",
        "body": "We seek to extremize $f(x, y, z) = z$ subject to two constraints:\n\\[ g(x, y, z) = x^2 + y^2 - z = 0, \\quad h(x, y, z) = x + y + z - 1 = 0 \\]\nUsing two multipliers $\\nabla f = \\lambda \\nabla g + \\mu \\nabla h$:\n\\[ \\langle 0, 0, 1 \\rangle = \\lambda \\langle 2x, 2y, -1 \\rangle + \\mu \\langle 1, 1, 1 \\rangle \\]\nThis gives:\n\\[ 2\\lambda x + \\mu = 0, \\quad 2\\lambda y + \\mu = 0, \\quad -\\lambda + \\mu = 1 \\]"
      },
      {
        "title": "Step 2: Symmetry Condition",
        "body": "Subtracting the first two equations gives $2\\lambda (x - y) = 0$.\nIf $\\lambda = 0$, then $\\mu = 0$, which contradicts $-\\lambda + \\mu = 1$.\nTherefore, $\\lambda \\neq 0$, which requires $x = y$."
      },
      {
        "title": "Step 3: Solve the Resulting Quadratic in $z$",
        "body": "Substitute $y = x$ into both equations:\nPlane: $2x + z = 1 \\implies x = \\frac{1 - z}{2}$\nParaboloid: $z = 2x^2$\nSubstitute $x$ into paraboloid:\n\\[ z = 2\\left(\\frac{1 - z}{2}\\right)^2 = \\frac{(1 - z)^2}{2} = \\frac{z^2 - 2z + 1}{2} \\]\n\\[ 2z = z^2 - 2z + 1 \\implies z^2 - 4z + 1 = 0 \\]\nApplying the quadratic formula:\n\\[ z = \\frac{4 \\pm \\sqrt{16 - 4}}{2} = 2 \\pm \\sqrt{3} \\]\nThus:\n\\[ z_{\\min} = 2 - \\sqrt{3} \\approx 0.268, \\quad z_{\\max} = 2 + \\sqrt{3} \\approx 3.732 \\]"
      }
    ],
    "examTip": "Whenever both constraints are symmetric in $x$ and $y$, the Lagrange system immediately forces $x = y$, which eliminates two variables and leaves a single quadratic equation for $z$!"
  }
];

// Load existing problem_bank.js
let content = fs.readFileSync('problem_bank.js', 'utf8').trim();

// Verify no duplicate IDs
newOptimizationProblems.forEach(p => {
  if (content.includes(`"id": "${p.id}"`)) {
    console.log(`Problem ${p.id} already exists in bank!`);
  }
});

// Find the last "];"
const lastBracket = content.lastIndexOf('];');
if (lastBracket === -1) {
  throw new Error("Could not find closing '];' in problem_bank.js");
}

const beforeLast = content.substring(0, lastBracket).trimEnd();
// Check if beforeLast ends with comma
const needsComma = !beforeLast.endsWith(',');

const jsonString = newOptimizationProblems.map(p => '  ' + JSON.stringify(p, null, 2).split('\n').join('\n  ')).join(',\n');

const newBankCode = beforeLast + (needsComma ? ',\n' : '\n') + jsonString + '\n];\n';
fs.writeFileSync('problem_bank.js', newBankCode, 'utf8');

console.log(`Successfully appended ${newOptimizationProblems.length} new optimization problems to problem_bank.js!`);
