const fs = require('fs');

const missingPath = 'c:/Users/Holde/Downloads/System-Overlord/missing_actions.js';
const v4Path = 'c:/Users/Holde/Downloads/System-Overlord/releases/v4.0.0/js/';

let missingCode = fs.readFileSync(missingPath, 'utf8');
// Do a massive global replacement to adapt V3 state to V4 Store.state
missingCode = missingCode.replace(/\bstate\./g, 'Store.state.');

// Define some regex blocks to extract specific functions
function extractFunction(name, code) {
    const regex = new RegExp('function\\s+' + name + '\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?^\\})', 'm');
    const match = code.match(regex);
    if (match) return match[0];
    
    // Check window.name = function(...)
    const regex2 = new RegExp('window\\.' + name + '\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?^\\});?', 'm');
    const match2 = code.match(regex2);
    if (match2) return match2[0];
    
    return null;
}

// 1. ENGINE.JS
let engineContent = `
import { Store, saveGame } from './state.js';
import { render, logMsg, showToast, updateDOM, els } from './ui.js';
import { getGridMultiplier } from './grid.js';
import { getForgeOpsRate } from './forge.js';
import { getDysonEnergyDelta } from './dyson.js';

let lastTime = Date.now();
let dt = 0;
let comboTimer = 0;
let frenzyActiveTimer = 0;
let trendTimer = 0;
let eventTimer = 120;
let activeEvent = null;
let eventCountdown = 0;
let rateTimer = 0, accData = 0, accMoney = 0;
let currentDataRate = 0, currentMoneyRate = 0;
let marketTrend = 'normal';
let breachActive = false, breachTimer = 0, breachClicked = 0, breachTarget = 0, _breachNetId = null, breachNodes = [];
const eventTemplates = [];

// Helper missing globals
function getExtractorMult() { return 1.0; }
function getBotnetMult() { return 1.0; }
function getExtractBoost() { return 1.0; }
function getThreatMult() { return [1, 1.5, 3.0, 7.5, 15.0][Store.state.threatLevel-1] || 1; }
function getThreatDrainMult() { return 1.0; }
function getOpsBoost() { return 1.0; }
function getMarketCapacity() { return 1000 + (Store.state.marketingLevel * 500); }
function hasProject() { return false; }
function hasAchievement() { return false; }
function checkAchievements() { return false; }
function calculateTrust() { return false; }
function processAILab() { return false; }
function updateNetworkWarfare() { return false; }
function spawnFloat(x,y,msg,col) { if(window.spawnFloat) window.spawnFloat(x,y,msg,col); }
function clearEvent() { activeEvent = null; document.getElementById('event-slot').innerHTML = ''; }

export function calcHardwareStats(){
    const h=Store.state.hardware;
    let opsBonus=0,passiveData=0,thermalCap=100,currentThermal=0,opsBufferBonus=0,hasDecayPrev=false,opsGenMult=1.0,allGenMult=1.0,creativityMult=1.0;
    thermalCap*=Math.pow(1.2,Store.state.epochUpgrades.hwOverclock||0);
    const throttle=currentThermal>thermalCap?Math.min(0.9,(currentThermal-thermalCap)/thermalCap):0;
    return{opsBonus,passiveData,thermalCap,currentThermal,opsBufferBonus,hasDecayPrev,opsGenMult,allGenMult,creativityMult,throttle};
}

export ${extractFunction('gameLoop', missingCode).replace('Store.dt=', 'dt=').replace('Store.lastTime=', 'lastTime=').replace('const totalDataRate', 'let totalDataRate')}
`;
// Inject the V4 hooks into the new gameLoop
engineContent = engineContent.replace(
    'Store.state.data+=totalDataRate;Store.state.totalData+=totalDataRate;Store.state.lifetime.totalData+=totalDataRate;',
    'totalDataRate *= getGridMultiplier(); Store.state.data+=totalDataRate;Store.state.totalData+=totalDataRate;Store.state.lifetime.totalData+=totalDataRate;\n    Store.state.ops += getForgeOpsRate() * dt;\n    if(Store.state.dyson) Store.state.dyson.stellarEnergy += getDysonEnergyDelta() * dt;'
);

fs.writeFileSync(v4Path + 'engine.js', engineContent);


// 2. UI.JS
let uiContent = `
import { Store, fData, fMoney, fNum, defaultState } from './state.js';
import { calcHardwareStats } from './engine.js';

export const els={};
export const DOM_STATE={};

export function cacheDom(){
    const ids=['currentData','totalData','dataRate','moneyRate','bandwidth','credits','price','demand','tbDataRate','tbMoneyRate','tbTrust','tbNetworks','bandwidthCost','bwBar','marketTrend','marketingLevel','subCostCredits','subCostData','btnBuyMarketing','extractors','extractorCost','btnBuyExtractor','btnBuyBandwidth','nodes','nodeDataRate','nodeCostData','nodeCostCredits','btnBuyNode','trustLevel','trustBar','nextTrust','processors','memory','ops','maxOps','opsBar','opsRate','btnAddProc','btnAddMem','procCost','memCost','creativity','overclockBar','btnOverclock','clickCombo','vitalBw','vitalOps','vitalHeat','vitalBwVal','vitalOpsVal','vitalHeatVal','netDominated','netIncomeRate','netAttacks','bbData','bbDrate','bbMrate','bbNodes','bbReboots','bbEpoch','bbHeat','bbEpochStat','epochBadgeTop','epochBadgeVal','kernelFragments','fmtBtn','prestigeWrapper','eventSlot','frenzyFill'];
    ids.forEach(id=>{els[id]=document.getElementById(id);});
}

export function updateDOM(key, val, isHTML=false){
    if(!els[key])return;
    if(DOM_STATE[key]===val)return;
    DOM_STATE[key]=val;
    if(isHTML) els[key].innerHTML=val;
    else els[key].textContent=val;
}

export function updateProp(key, prop, val){
    if(!els[key])return;
    const sKey=key+'_'+prop;
    if(DOM_STATE[sKey]===val)return;
    DOM_STATE[sKey]=val;
    els[key][prop]=val;
}

export function updateStyle(key, prop, val){
    if(!els[key])return;
    const sKey=key+'_s_'+prop;
    if(DOM_STATE[sKey]===val)return;
    DOM_STATE[sKey]=val;
    els[key].style[prop]=val;
}

export function updateClass(key, className, action){
    if(!els[key])return;
    const sKey=key+'_c_'+className;
    const val=action==='add'?true:false;
    if(DOM_STATE[sKey]===val)return;
    DOM_STATE[sKey]=val;
    if(val) els[key].classList.add(className);
    else els[key].classList.remove(className);
}

export function logMsg(msg,type='') { 
    const c = document.getElementById('log-container');
    if(c) {
        const d = document.createElement('div');
        d.className = 'log-entry log-new ' + type;
        d.textContent = msg;
        c.appendChild(d);
        c.scrollTop = c.scrollHeight;
    }
}
export function showToast(msg,type='info') { console.log(\`[TOAST] \${msg}\`); }
function getMarketCapacity() { return 1000 + (Store.state.marketingLevel * 500); }
function getBotnetMult() { return 1.0; }
function getOpsBoost() { return 1.0; }
function hasProject() { return false; }
let currentDataRate=0, currentMoneyRate=0, marketTrend='normal';
function renderProjects(){}
function renderAchievements(){}
function renderStats(){}
function renderHardwarePanel(){}
function renderWarfarePanel(){}

${extractFunction('render', missingCode)}
`;

fs.writeFileSync(v4Path + 'ui.js', uiContent);

// 3. ACTIONS.JS
let actionsContent = `
import { Store } from './state.js';
import { calcHardwareStats } from './engine.js';
import { updateDOM, updateClass, updateStyle, updateProp, logMsg, showToast, render, els } from './ui.js';

let comboTimer = 0;
function getExtractBoost() { return 1.0; }
function getThreatMult() { return [1, 1.5, 3.0, 7.5, 15.0][Store.state.threatLevel-1] || 1; }
function calculateTrust() {}
function checkAchievements() {}
function calcCostMulti(base, amt, mult) { return Math.floor(base * (Math.pow(mult, amt) - 1) / (mult - 1)); }
function findHwItem() { return null; }
function countInstalledType() { return 0; }
function renderHardwarePanel() {}
function adminGive(type, amt) { Store.state[type] += amt; }

// We extract all handlers except switchCenter and render from missingCode
`;
const alreadyHandled = ['render', 'gameLoop', 'switchCenter', 'switchTab'];
for (let line of missingCode.split('\\n\\n')) {
    if (line.trim() === '') continue;
    let skip = false;
    for (let h of alreadyHandled) {
        if (line.includes('function ' + h) || line.includes('window.' + h)) { skip = true; break; }
    }
    if (!skip) actionsContent += '\\n' + line;
}

fs.writeFileSync(v4Path + 'actions.js', actionsContent);

console.log("Files generated.");
