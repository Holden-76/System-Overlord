const fs = require('fs');
const html = fs.readFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v4.0.0/index.html', 'utf8');
const regex = /onclick="([^"]+)"/g;
const matches = [];
let match;
while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]);
}
const unique = [...new Set(matches)];
console.log(unique.join('\n'));
