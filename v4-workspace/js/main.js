
import { Store, initStore, loadGame } from './state.js';
import { cacheDom } from './ui.js';
import { gameLoop } from './engine.js';
import { initGrid, renderGrid } from './grid.js';
import { initForge, updateForgeUI } from './forge.js';
import { initDyson, updateDysonUI } from './dyson.js';
import { initTerminal } from './terminal.js';

// Attach hooks to window for HTML click handlers
window.extractData = function() { Store.state.data += Store.state.clickPower; }
window.buyExtractor = function() { Store.state.extractors++; }

window.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    initGrid();
    initForge();
    initDyson();
    initTerminal();
    loadGame();
    requestAnimationFrame(gameLoop);
});



window.switchCenter = function(tabId) {
    document.querySelectorAll('.ct-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.center-tab').forEach(t => t.classList.remove('active'));
    
    const panel = document.getElementById('ct-'+tabId);
    if(panel) panel.style.display = 'flex';
    
    const btn = Array.from(document.querySelectorAll('.center-tab')).find(b => b.textContent.trim().toLowerCase() === tabId);
    if(btn) btn.classList.add('active');
    
    if(tabId === 'darknet') renderGrid();
    else if(tabId === 'forge') updateForgeUI();
    else if(tabId === 'singularity') updateDysonUI();
};


