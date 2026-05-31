const fs = require('fs');
let html = fs.readFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.2.0/system_overlord_v3_2_0.html', 'utf8');

// Replace all non-ASCII characters that might be lingering
html = html.replace(//g, ''); // Remove the literal replacement character if it got pasted
html = html.replace(//g, ''); // The literal black diamond question mark

// Fix the network domination log
html = html.replace(/showToast\(`Network DOMINATED/g, 'showToast(`Network DOMINATED');

fs.writeFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.2.0/system_overlord_v3_2_0.html', html, 'utf8');
