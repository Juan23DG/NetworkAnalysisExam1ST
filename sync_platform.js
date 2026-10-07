// sync_platform.js: Synchronizes index.html and mobile.html from problem_bank.js and app.js
const fs = require('fs');
const { execSync } = require('child_process');

console.log("================================================================================");
console.log("SYNCHRONIZING DESKTOP & MOBILE PLATFORMS");
console.log("================================================================================\n");

// 1. Read problem_bank.js and app.js
const bankCode = fs.readFileSync('problem_bank.js', 'utf8');
const appCode = fs.readFileSync('app.js', 'utf8');

// 2. Read index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// 3. Locate script section in index.html
const scriptMarkerStart = '<!-- Embedded problem bank and application engine for 100% standalone offline / file:/// compatibility -->';
const scriptStartIdx = indexHtml.indexOf(scriptMarkerStart);
if (scriptStartIdx === -1) {
  throw new Error("Could not find scriptMarkerStart in index.html");
}

const scriptTagOpenIdx = indexHtml.indexOf('<script>', scriptStartIdx);
if (scriptTagOpenIdx === -1) {
  throw new Error("Could not find <script> tag after marker in index.html");
}

const modalMarker = '<!-- Mixed Units Selector Modal -->';
const modalMarkerIdx = indexHtml.indexOf(modalMarker);
if (modalMarkerIdx === -1) {
  throw new Error("Could not find modalMarker in index.html");
}

const scriptTagCloseIdx = indexHtml.lastIndexOf('</script>', modalMarkerIdx);
if (scriptTagCloseIdx === -1) {
  throw new Error("Could not find </script> tag before modalMarker in index.html");
}

const htmlPrefix = indexHtml.substring(0, scriptTagOpenIdx + '<script>'.length);
const htmlSuffix = indexHtml.substring(scriptTagCloseIdx);

const newIndexHtml = htmlPrefix + '\n' + bankCode + '\n\n' + appCode + '\n' + htmlSuffix;
fs.writeFileSync('index.html', newIndexHtml, 'utf8');
console.log(`✓ Synchronized index.html (${newIndexHtml.length} bytes)`);

// 4. Generate mobile.html
console.log("\nRunning generate_mobile_app.js...");
const mobileOutput = execSync('node generate_mobile_app.js').toString();
console.log(mobileOutput.trim());

console.log("\n================================================================================");
console.log("PLATFORMS SYNCHRONIZED SUCCESSFULLY!");
console.log("================================================================================\n");
