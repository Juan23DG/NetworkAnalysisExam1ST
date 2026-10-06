// test_katex_live.js: Verify all 85 problems and 53 formulas render with real KaTeX
const fs = require('fs');
const vm = require('vm');

async function main() {
  console.log("Fetching KaTeX 0.16.9 from CDN...");
  const katexJs = await (await fetch('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js')).text();
  
  // Set up sandbox with katex
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(katexJs, sandbox);
  const katex = sandbox.katex;
  console.log("KaTeX loaded successfully. Version:", katex.version);

  // Load problem bank
  const bankCode = fs.readFileSync('problem_bank.js', 'utf8') + '\nmodule.exports = EXPANDED_QUESTION_BANK;';
  const problemBank = eval(`(function() { ${bankCode} return EXPANDED_QUESTION_BANK; })()`);
  console.log(`Loaded ${problemBank.length} questions from problem_bank.js`);

  // Load app.js in sandbox to get FORMULA_SECTIONS
  const appCode = fs.readFileSync('app.js', 'utf8');
  const appSandbox = {
    document: { getElementById: () => null, addEventListener: () => {} },
    window: { addEventListener: () => {} },
    localStorage: { getItem: () => null, setItem: () => {} },
    setTimeout: () => {},
    setInterval: () => {}
  };
  vm.createContext(appSandbox);
  vm.runInContext(appCode.replace('const FORMULA_SECTIONS =', 'var FORMULA_SECTIONS ='), appSandbox);
  const formulaSections = appSandbox.FORMULA_SECTIONS;
  console.log(`Loaded ${formulaSections.length} formula sections.`);

  let totalMathSnippets = 0;
  let renderErrors = [];

  function extractAndTestMath(text, contextInfo) {
    if (!text || typeof text !== 'string') return;

    // KaTeX delimiters: $$, \[, $, \(
    // Match display math $$...$$ and \[...\]
    const displayRegex = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;
    // Match inline math $...$ and \(...\)
    const inlineRegex = /(\$[^$\n]+\$|\\\([\s\S]*?\\\))/g;

    // Helper to test a snippet
    function testSnippet(rawSnippet, isDisplay) {
      totalMathSnippets++;
      let mathContent = rawSnippet;
      if (rawSnippet.startsWith('$$') && rawSnippet.endsWith('$$')) {
        mathContent = rawSnippet.slice(2, -2);
      } else if (rawSnippet.startsWith('\\[') && rawSnippet.endsWith('\\]')) {
        mathContent = rawSnippet.slice(2, -2);
      } else if (rawSnippet.startsWith('$') && rawSnippet.endsWith('$')) {
        mathContent = rawSnippet.slice(1, -1);
      } else if (rawSnippet.startsWith('\\(') && rawSnippet.endsWith('\\)')) {
        mathContent = rawSnippet.slice(2, -2);
      }

      mathContent = mathContent.trim();
      if (!mathContent) return;

      try {
        katex.renderToString(mathContent, {
          displayMode: isDisplay,
          throwOnError: true
        });
      } catch (err) {
        renderErrors.push({
          context: contextInfo,
          math: rawSnippet,
          error: err.message
        });
      }
    }

    // Extract display
    let match;
    const cleanForInline = text.replace(displayRegex, (m) => {
      testSnippet(m, true);
      return ' ';
    });

    // Extract inline
    while ((match = inlineRegex.exec(cleanForInline)) !== null) {
      testSnippet(match[0], false);
    }
  }

  // 1. Test all formulas
  formulaSections.forEach((sec, sIdx) => {
    sec.formulas.forEach((f, fIdx) => {
      extractAndTestMath(f.formula, `Formula [${sec.title}] - ${f.name}`);
      extractAndTestMath(f.note, `Formula Note [${sec.title}] - ${f.name}`);
    });
  });

  // 2. Test all questions
  problemBank.forEach(q => {
    extractAndTestMath(q.prompt, `Question ${q.id} prompt`);
    q.options.forEach((opt, oIdx) => {
      extractAndTestMath(opt, `Question ${q.id} option ${oIdx} (${String.fromCharCode(65 + oIdx)})`);
    });
    if (q.walkthrough) {
      q.walkthrough.forEach((step, sIdx) => {
        extractAndTestMath(step.title, `Question ${q.id} walkthrough step ${sIdx + 1} title`);
        extractAndTestMath(step.body, `Question ${q.id} walkthrough step ${sIdx + 1} body`);
      });
    }
    if (q.examTip) {
      extractAndTestMath(q.examTip, `Question ${q.id} examTip`);
    }
  });

  console.log(`\n========================================`);
  console.log(`Tested ${totalMathSnippets} LaTeX math snippets.`);
  console.log(`Errors found: ${renderErrors.length}`);
  console.log(`========================================`);

  if (renderErrors.length > 0) {
    console.error("\nRendering errors encountered:");
    renderErrors.forEach((e, i) => {
      console.error(`\n--- Error ${i + 1} ---`);
      console.error(`Context: ${e.context}`);
      console.error(`Snippet: ${e.math}`);
      console.error(`Message: ${e.error}`);
    });
    process.exit(1);
  } else {
    console.log("✓ ALL LaTeX math snippets parsed and rendered cleanly by KaTeX with ZERO errors!");
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
