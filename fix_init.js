const fs = require('fs');

function fixMain(path) {
    let content = fs.readFileSync(path, 'utf8');
    
    // Remove loadGame(); from its current location
    content = content.replace('    loadGame();\n', '');
    content = content.replace('    loadGame();\r\n', ''); // handle CRLF
    
    // Insert it immediately after cacheDom();
    content = content.replace('    cacheDom();', '    cacheDom();\n    loadGame();');
    
    fs.writeFileSync(path, content, 'utf8');
    console.log("Fixed init order in " + path);
}

fixMain('c:/Users/Holde/Downloads/System-Overlord/v4-workspace/js/main.js');
fixMain('c:/Users/Holde/Downloads/System-Overlord/releases/v4.0.0/js/main.js');
