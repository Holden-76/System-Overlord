const fs = require('fs');

const html = fs.readFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.3.2/system_overlord_v3_3_2.html', 'utf8');

// The giant script block is at the bottom of the HTML
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.log("No script block found!");
    process.exit(1);
}
const code = scriptMatch[1];

// We need to extract all top-level window.xxx = function(...) { ... }
// We can use a parser or just a regex if we assume closing braces are at the start of lines.
// For safety, let's extract them manually or by simple string parsing.

const lines = code.split('\n');
let insideFunc = false;
let currentFunc = [];
const missingFns = [];

const alreadyImplemented = ['switchCenter', 'switchTab', 'skipBoot', 'bootSequence'];

for (let line of lines) {
    if (!insideFunc) {
        let match = line.match(/^window\.([a-zA-Z0-9_]+)\s*=\s*function/);
        if (match) {
            if (!alreadyImplemented.includes(match[1])) {
                insideFunc = true;
                currentFunc.push(line);
            }
        }
    } else {
        currentFunc.push(line);
        // Naive heuristic: if line is exactly `};` (with optional spaces)
        if (line.trim() === '};') {
            missingFns.push(currentFunc.join('\n'));
            currentFunc = [];
            insideFunc = false;
        }
    }
}

fs.writeFileSync('c:/Users/Holde/Downloads/System-Overlord/missing_actions.js', missingFns.join('\n\n'));
console.log("Extracted " + missingFns.length + " missing functions.");
