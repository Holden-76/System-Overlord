const fs = require('fs');
let html = fs.readFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.0.0/system_overlord_v3_0_0.html', 'utf8');

// 1. Version button
html = html.replace('<div id="topbar-ver">v3.0.0</div>', '<a href="https://github.com/Holden-76/System-Overlord" target="_blank" id="topbar-ver" data-tip="View Source Code & Releases on GitHub">v3.0.0</a>');

// 2. Settings Panel Expansion
const oldSettings = `<h2 class="overlay-h2">⚙ SETTINGS</h2>
            <div class="setting-row">
                <div class="setting-label">Theme<small>Modern or Retro CRT</small></div>
                <button class="tb-btn" onclick="toggleTheme()" id="btn-theme">RETRO MODE</button>
            </div>
            <div class="setting-row">
                <div class="setting-label">Number Format<small>Suffix, Raw, or Scientific</small></div>
                <button class="tb-btn" onclick="toggleFormat()" id="btn-format">SUFFIX</button>
            </div>
            <div class="setting-row">
                <div class="setting-label">Danger Zone</div>
                <button class="tb-btn" style="color:var(--danger);border-color:rgba(255,51,102,0.3)" onclick="resetGame()">HARD RESET</button>
            </div>`;

const newSettings = `<h2 class="overlay-h2">⚙ SETTINGS & CONFIGURATION</h2>
            <div class="setting-row">
                <div class="setting-label">Visual Theme<small>Modern Glassmorphism or Retro CRT</small></div>
                <button class="tb-btn" onclick="toggleTheme()" id="btn-theme">RETRO MODE</button>
            </div>
            <div class="setting-row">
                <div class="setting-label">Number Formatting<small>Suffix (K, M, B), Raw (1,000), or Scientific</small></div>
                <button class="tb-btn" onclick="toggleFormat()" id="btn-format">SUFFIX</button>
            </div>
            <div class="setting-row">
                <div class="setting-label">CRT Scanlines<small>Toggle the visual scanline overlay</small></div>
                <button class="tb-btn" onclick="document.getElementById('scanlines').style.display = document.getElementById('scanlines').style.display === 'none' ? 'block' : 'none'">TOGGLE</button>
            </div>
            <div class="setting-row">
                <div class="setting-label">Save Management<small>Export to clipboard or import</small></div>
                <div style="display:flex;gap:5px;">
                    <button class="tb-btn" onclick="exportSave()">EXPORT</button>
                    <button class="tb-btn" onclick="importSave()">IMPORT</button>
                </div>
            </div>
            <div class="setting-row">
                <div class="setting-label" style="color:var(--danger)">Danger Zone<small>Permanently wipe all local data</small></div>
                <button class="tb-btn" style="color:var(--danger);border-color:rgba(255,51,102,0.3)" onclick="resetGame()">HARD RESET</button>
            </div>`;

html = html.replace(oldSettings, newSettings);

// 3. Admin Panel Rework
const oldAdmin = `<h3 style="font-size:11px;color:#fff;margin-bottom:6px">Resource Injection</h3>
            <div class="admin-grid">
                <button class="admin-btn" onclick="adminGive('credits',1000000)">+1M Credits</button>
                <button class="admin-btn" onclick="adminGive('data',1000000)">+1M Data</button>
                <button class="admin-btn" onclick="adminGive('trust',100)">+100 Trust</button>
                <button class="admin-btn" onclick="adminGive('ops',100000)">+100k Ops</button>
                <button class="admin-btn" onclick="adminGive('creativity',500)">+500 Creativity</button>
                <button class="admin-btn" onclick="adminGive('nodes',50)">+50 Nodes</button>
                <button class="admin-btn" onclick="adminGive('kernelFragments',20)">+20 Fragments</button>
                <button class="admin-btn" onclick="setThreatLevel(1)">Reset Threat</button>
                <button class="admin-btn" style="border-color:rgba(255,184,0,0.3);color:var(--epoch)" onclick="state.epochTokens=(state.epochTokens||0)+5;showToast('+5 Epoch Tokens','info')">+5 Epoch Tokens</button>
                <button class="admin-btn" style="border-color:rgba(255,106,0,0.3);color:var(--hw)" onclick="adminGive('hwCredits',10000000)">+10M HW Credits</button>
            </div>
            <h3 style="font-size:11px;color:#fff;margin-bottom:6px">Stage Skips</h3>
            <div class="admin-grid" style="grid-template-columns:1fr">
                <button class="admin-btn" style="border-color:var(--accent);color:var(--accent)" onclick="adminSetStage(1)">Stage 1: Early Game</button>
                <button class="admin-btn" style="border-color:var(--warn);color:var(--warn)" onclick="adminSetStage(2)">Stage 2: Mid Game</button>
                <button class="admin-btn" style="border-color:var(--purple);color:var(--purple)" onclick="adminSetStage(3)">Stage 3: Late Game</button>
                <button class="admin-btn" style="border-color:var(--hw);color:var(--hw)" onclick="adminSetStage(4)">Stage 4: Hardware Era</button>
            </div>`;

const newAdmin = `<h3 style="font-size:11px;color:#fff;margin-bottom:6px">God Mode Direct Injection</h3>
            <div style="display:flex;gap:5px;margin-bottom:10px;">
                <input type="text" id="admin-give-amt" value="1000000" style="background:rgba(0,0,0,0.5);border:1px solid var(--border);color:var(--text);padding:5px;width:100px;font-family:var(--font-mono);font-size:11px;" placeholder="Amount">
                <select id="admin-give-type" style="background:rgba(0,0,0,0.5);border:1px solid var(--border);color:var(--text);padding:5px;font-family:var(--font-sans);font-size:11px;">
                    <option value="credits">Credits</option>
                    <option value="data">Data</option>
                    <option value="trust">Trust</option>
                    <option value="ops">Ops</option>
                    <option value="creativity">Creativity</option>
                    <option value="nodes">Botnet Nodes</option>
                    <option value="kernelFragments">Kernel Fragments</option>
                    <option value="hwCredits">Hardware Credits</option>
                    <option value="epochTokens">Epoch Tokens</option>
                </select>
                <button class="admin-btn" style="border-color:var(--green);color:var(--green);flex:1;" onclick="let a=parseFloat(document.getElementById('admin-give-amt').value); let t=document.getElementById('admin-give-type').value; if(t==='epochTokens'){state.epochTokens=(state.epochTokens||0)+a;}else{adminGive(t,a);} showToast('Injected '+a+' '+t,'good');">INJECT</button>
            </div>
            
            <h3 style="font-size:11px;color:#fff;margin-bottom:6px">System Overrides</h3>
            <div class="admin-grid" style="grid-template-columns:1fr 1fr">
                <button class="admin-btn" onclick="state.threatLevel=1;setThreatLevel(1);">Force Threat Level 1</button>
                <button class="admin-btn" onclick="state.threatLevel=5;setThreatLevel(5);">Force Threat Level 5</button>
                <button class="admin-btn" style="border-color:var(--purple);color:var(--purple)" onclick="state.ops=state.maxOps;updateUI();">Max Operations</button>
                <button class="admin-btn" style="border-color:var(--danger);color:var(--danger)" onclick="state.hardware.thermalHeat=0;updateUI();">Flush Thermal Heat</button>
            </div>

            <h3 style="font-size:11px;color:#fff;margin-top:10px;margin-bottom:6px">Stage Skips</h3>
            <div class="admin-grid" style="grid-template-columns:1fr 1fr">
                <button class="admin-btn" style="border-color:var(--accent);color:var(--accent)" onclick="adminSetStage(1)">Stage 1: Early Game</button>
                <button class="admin-btn" style="border-color:var(--warn);color:var(--warn)" onclick="adminSetStage(2)">Stage 2: Mid Game</button>
                <button class="admin-btn" style="border-color:var(--purple);color:var(--purple)" onclick="adminSetStage(3)">Stage 3: Late Game</button>
                <button class="admin-btn" style="border-color:var(--hw);color:var(--hw)" onclick="adminSetStage(4)">Stage 4: Hardware Era</button>
            </div>`;

html = html.replace(oldAdmin, newAdmin);

// Add missing tooltips to resources
html = html.replace('<div class="sr-title">RESOURCES</div>', '<div class="sr-title" data-tip="Your primary assets. Spend these to upgrade systems.">RESOURCES</div>');
html = html.replace('<span class="res-label">Data</span>', '<span class="res-label" data-tip="Raw data extracted from the network. Used for upgrades and sold for credits.">Data</span>');
html = html.replace('<span class="res-label">Credits</span>', '<span class="res-label" data-tip="Fiat currency generated by algorithmic trading of Data. Used for purchases.">Credits</span>');
html = html.replace('<span class="res-label">Total Mined</span>', '<span class="res-label" data-tip="Total lifetime data extracted across all reboots.">Total Mined</span>');
html = html.replace('<span class="res-label">Fragments</span>', '<span class="res-label" data-tip="Kernel Fragments. Persistent currency earned by rebooting the system.">Fragments</span>');

html = html.replace('<button id="btn-extract"', '<button id="btn-extract" data-tip="Manually extract raw data. Increases Frenzy meter."');
html = html.replace('<div class="threat-title"><span id="threat-icon">🟢</span> THREAT LEVEL</div>', '<div class="threat-title" data-tip="Higher threat levels multiply rewards but continuously drain your Ops and Bandwidth."><span id="threat-icon">🟢</span> THREAT LEVEL</div>');
html = html.replace('<div class="sr-title">SYSTEM VITALS</div>', '<div class="sr-title" data-tip="Critical system limits. Exceeding these causes massive penalties.">SYSTEM VITALS</div>');
html = html.replace('<div class="sr-title">NETWORK MARKET <span id="market-trend"></span></div>', '<div class="sr-title" data-tip="The global data exchange. Price fluctuates based on supply and capacity.">NETWORK MARKET <span id="market-trend"></span></div>');

// Fix styling for #topbar-ver link
if (!html.includes('#topbar-ver:hover')) {
    html = html.replace('#topbar-ver {', '#topbar-ver:hover { color: var(--text-bright); background: rgba(0,232,255,0.15); }\n        #topbar-ver {');
    html = html.replace('#topbar-ver {', '#topbar-ver {\n            text-decoration: none;\n            cursor: pointer;\n            transition: all 0.2s;\n');
}

fs.writeFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.0.0/system_overlord_v3_0_0.html', html, 'utf8');
