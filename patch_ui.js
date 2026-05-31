const fs = require('fs');

function patchJS(path) {
    let content = fs.readFileSync(path, 'utf8');

    // Replace existing flawed switchCenter if it exists
    const oldSwitchCenter = /window\.switchCenter\s*=\s*function\(tabId\)\s*\{[\s\S]*?\n\};\n?/g;
    content = content.replace(oldSwitchCenter, '');

    const newFns = `
window.switchTab = function(tab) {
    document.querySelectorAll('.tab-btn-sm').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content-sm').forEach(t => t.classList.remove('active'));
    
    const btn = document.getElementById('tab-btn-' + tab);
    const content = document.getElementById('tab-' + tab);
    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');
    
    if (tab === 'projects') {
        const b = document.getElementById('badge-projects');
        if (b) b.classList.remove('show');
    }
    if (tab === 'achievements') {
        const b = document.getElementById('badge-achievements');
        if (b) b.classList.remove('show');
        if (window.Store && window.Store.state) window.Store.state._unseenAchievements = 0;
    }
};

window.switchCenter = function(tabId) {
    document.querySelectorAll('.ct-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    document.querySelectorAll('.center-tab').forEach(t => t.classList.remove('active'));
    
    const panel = document.getElementById('ct-' + tabId);
    if (panel) {
        panel.classList.add('active');
        // Handle special flex displays if needed, though .active in css should handle it
        panel.style.display = (tabId === 'terminal' || tabId === 'meta') ? 'flex' : 'block';
    }
    
    // Find button by matching the text content or onclick
    const btn = Array.from(document.querySelectorAll('.center-tab')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId));
    if (btn) btn.classList.add('active');
    
    if (tabId === 'darknet' && window.renderGrid) window.renderGrid();
    else if (tabId === 'forge' && window.updateForgeUI) window.updateForgeUI();
    else if (tabId === 'singularity' && window.updateDysonUI) window.updateDysonUI();
    else if (tabId === 'network' && window.renderNetworkMap) window.renderNetworkMap();
    else if (tabId === 'warfare') {
        if (window.renderWarfarePanel) window.renderWarfarePanel();
        const b = document.getElementById('badge-warfare');
        if (b) b.classList.remove('show');
    }
};
`;

    // Append to bottom
    content += newFns;
    fs.writeFileSync(path, content, 'utf8');
    console.log("Patched UI routing in " + path);
}

patchJS('c:/Users/Holde/Downloads/System-Overlord/v4-workspace/js/main.js');
patchJS('c:/Users/Holde/Downloads/System-Overlord/releases/v4.0.0/js/main.js');

// Also make sure ct-network has .active by default in index.html
function patchHTML(path) {
    let html = fs.readFileSync(path, 'utf8');
    if (!html.includes('class="ct-panel active" id="ct-network"')) {
        html = html.replace('<div class="ct-panel" id="ct-network">', '<div class="ct-panel active" id="ct-network" style="display:block">');
        fs.writeFileSync(path, html, 'utf8');
        console.log("Patched default active tab in " + path);
    }
}
patchHTML('c:/Users/Holde/Downloads/System-Overlord/v4-workspace/index.html');
patchHTML('c:/Users/Holde/Downloads/System-Overlord/releases/v4.0.0/index.html');

