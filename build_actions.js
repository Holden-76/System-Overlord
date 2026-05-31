const fs = require('fs');

const missingCode = fs.readFileSync('c:/Users/Holde/Downloads/System-Overlord/missing_actions.js', 'utf8');
let actionsCode = missingCode.replace(/\bstate\./g, 'Store.state.');

// Remove render block
actionsCode = actionsCode.replace(/function render\(\)\s*\{[\s\S]*?(?=\/\* ===|$)/g, '');

// Remove gameLoop block
actionsCode = actionsCode.replace(/function gameLoop\(ts\)\s*\{[\s\S]*?(?=\/\* ===|$)/g, '');

// Remove window.switchCenter and window.switchTab if they exist (they shouldn't be in missing_actions but just in case)
actionsCode = actionsCode.replace(/window\.switchCenter\s*=\s*function\([^)]*\)\s*\{[\s\S]*?(?=window\.|function|$)/g, '');

// Now we convert `window.xxx = function` to `export function xxx`
actionsCode = actionsCode.replace(/window\.([a-zA-Z0-9_]+)\s*=\s*(async\s+)?function/g, 'export $2function $1');

// Add the header
const header = `import { Store } from './state.js';
import { calcHardwareStats } from './engine.js';
import { updateDOM, updateClass, updateStyle, updateProp, logMsg, showToast, render, els } from './ui.js';
import { getGridMultiplier } from './grid.js';

let comboTimer = 0;
let activeEvent = null;
let eventCountdown = 0;
let breachActive = false, breachTimer = 0, breachClicked = 0, breachTarget = 0, _breachNetId = null, breachNodes = [];
const eventTemplates = [];

export function getExtractBoost() { return 1.0; }
export function getThreatMult() { return [1, 1.5, 3.0, 7.5, 15.0][Store.state.threatLevel-1] || 1; }
export function calculateTrust() {}
export function checkAchievements() {}
export function calcCostMulti(base, amt, mult) { return Math.floor(base * (Math.pow(mult, amt) - 1) / (mult - 1)); }
export function findHwItem() { return null; }
export function countInstalledType() { return 0; }
export function renderHardwarePanel() {}
export function adminGive(type, amt) { Store.state[type] += amt; }
export function getBotnetMult() { return 1.0; }
export function getOpsBoost() { return 1.0; }
export function hasProject() { return false; }
export function hasAchievement() { return false; }
export function spawnFloat(x,y,msg,col) { if(window.spawnFloat) window.spawnFloat(x,y,msg,col); }
export function clearEvent() { activeEvent = null; const el=document.getElementById('event-slot'); if(el) el.innerHTML = ''; }
export function triggerHackingMinigame() {}
export function renderProjects() {}
export function renderPrestigeShop() {}
export function renderEpochShop() {}
export function calcFragmentGain() { return 10; }
export function updatePrestigeEpochDisplay() {}
export function showMilestone() {}
export function updateAIPanel() {}
export function renderLeaderboard() {}
export function fetchOnlineLeaderboard() {}

// =======================
// EXTRACTED ACTIONS
// =======================
`;

fs.writeFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v4.0.0/js/actions.js', header + actionsCode, 'utf8');
console.log("actions.js correctly generated");
