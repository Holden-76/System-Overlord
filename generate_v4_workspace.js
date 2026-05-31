const fs = require('fs');
const path = require('path');

const V4_DIR = path.join(__dirname, 'v4-workspace');
const JS_DIR = path.join(V4_DIR, 'js');

// 1. STATE.JS
const stateJsContent = `
export const Store = {
    state: {},
    dt: 0,
    lastTime: Date.now(),
    saveTimer: 0,
    rateTimer: 0,
    accData: 0,
    accMoney: 0,
    currentDataRate: 0,
    currentMoneyRate: 0,
    comboTimer: 0,
    eventTimer: 180,
    activeEvent: null,
    eventCountdown: 0,
    marketTrend: 'normal',
    trendTimer: 60,
    frenzyActiveTimer: 0,
    renderTimer: 0
};

export const defaultState = {
    tutorialStep:0,
    settings:{theme:'modern',numberFormat:'suffix',buyAmount:1},
    data:0,totalData:0,bandwidth:1000,credits:0,
    clickPower:1,combo:1.0,maxCombo:5.0,
    marketStrategy:'steady',price:0.25,marketingLevel:0,extractors:0,
    bandwidthCost:15,subversionCostCredits:500,subversionCostData:500,extractorCost:5,
    nodes:0,nodeCostData:500,nodeCostCredits:100,
    trust:0,usedTrust:0,nextTrustTarget:3000,lastTrustTarget:0,
    processors:0,memory:1,ops:0,maxOps:1000,creativity:0,
    overclockActive:0,overclockCooldown:0,threatLevel:1,
    kernelFragments:0,prestigeCount:0,
    prestigeUpgrades:{dataAmp:0,marketInsider:0,ghostProtocol:0,neuralBoost:0,quickStart:0,fragmentRes:0},
    epochCount:0,epochTokens:0,
    epochUpgrades:{dataNexus:0,creditSurge:0,ghostMatrix:0,fragmentResonator:0,neuralOverdrive:0,voidProtocol:0,networkAmplifier:0,hwOverclock:0},
    milestones:{computeUnlocked:false,creativityUnlocked:false,autoBandwidth:false,overclockUnlocked:false,botnetUnlocked:false,autoCompute:false,prestigeUnlocked:false},
    purchasedProjects:[],earnedAchievements:[],
    lifetime:{totalData:0,totalCredits:0,totalClicks:0,totalProjects:0,totalNodes:0,highestCombo:1.0,timePlayed:0,networksBreached:0,networksDefended:0},
    frenzyMeter:0,lastSaveTime:null,
    hardware:{racks:1,rackCost:5000,cpuSlots:2,gpuSlots:1,ramSlots:3,coolSlots:1,installed:[],thermalCapacity:100,currentThermal:0},
    networks:[],
    aiLab:{ext:0,sub:0,brc:0,timerExt:0,timerSub:0,timerBrc:0},
    netStats:{dominated:0,incomeData:0,incomeCredits:0,attacksRepelled:0,discoveryTimer:55},
};

export function initStore() { Store.state = JSON.parse(JSON.stringify(defaultState)); }

/* Big Number Formatting */
const BIG_SFXS=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd'];
export function fBig(n){if(!isFinite(n)||isNaN(n))return'0';if(n<0)return'-'+fBig(-n);if(n<1000)return Math.floor(n).toString();const exp=Math.floor(Math.log10(Math.abs(n)));const idx=Math.min(Math.floor(exp/3),BIG_SFXS.length-1);const val=n/Math.pow(10,idx*3);return val.toFixed(idx===0?0:2).replace(/\\.00$/,'')+BIG_SFXS[idx];}
export function fNum(n){if(!Store.state||!Store.state.settings)return fBig(n);const fmt=Store.state.settings.numberFormat;if(fmt==='raw')return Math.floor(n).toLocaleString();if(fmt==='scientific'&&n>=1000)return n.toExponential(2);return fBig(n);}
export function fData(n){if(!Store.state||!Store.state.settings)return fBig(n)+' TB';const units=['TB','PB','EB','ZB','YB','RB','QB'];let val=n,ui=0;while(val>=1000&&ui<units.length-1){val/=1000;ui++;}const fmt=Store.state.settings.numberFormat;if(fmt==='raw')return Math.floor(val).toLocaleString()+' '+units[ui];if(fmt==='scientific'&&val>=1000)return val.toExponential(2)+' '+units[ui];return(ui===0?Math.floor(val).toString():val.toFixed(2).replace(/\\.00$/,''))+' '+units[ui];}
export function fMoney(n){if(!Store.state||!Store.state.settings)return'$'+fBig(n);const fmt=Store.state.settings.numberFormat;if(fmt==='raw')return'$'+n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});if(fmt==='scientific'&&n>=1000)return'$'+n.toExponential(2);return'$'+fBig(n);}
export function fScore(n){if(n>=1e9)return(n/1e9).toFixed(2)+'B';if(n>=1e6)return(n/1e6).toFixed(2)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'k';return Math.floor(n).toString();}

export function saveGame(){
    Store.state.lastSaveTime=Date.now().toString();
    try{
        localStorage.setItem('systemOverlordSave_v3_3_2',JSON.stringify(Store.state));
        const si=document.getElementById('save-indicator');
        if(si){si.classList.add('visible');setTimeout(()=>si.classList.remove('visible'),1500);}
    }catch(e){}
}

export function loadGame(){
    let parsed=null;
    const keys=['systemOverlordSave_v3_3_2','systemOverlordSave_v3_3_1','systemOverlordSave_v3_3_0','systemOverlordSave_v3_2_0','systemOverlordSave_v3_1_1','systemOverlordSave_v3_1_0','systemOverlordSave_v3_0_0','systemOverlordSave_v2_7_0','systemOverlordSave_v2_6_0','systemOverlordSave_v2_5_0','systemOverlordSave'];
    for(const k of keys){try{const s=localStorage.getItem(k);if(s){parsed=JSON.parse(s);break;}}catch(e){}}
    if(!parsed){initStore();return;}
    function deepMerge(target,source){for(const k in target){if(!(k in source)){source[k]=target[k];}else if(typeof target[k]==='object'&&target[k]!==null&&!Array.isArray(target[k])){deepMerge(target[k],source[k]);}}return source;}
    Store.state=deepMerge(JSON.parse(JSON.stringify(defaultState)),parsed);
}
`;

// 2. CONTENT.JS
const contentJsContent = `
import { Store, fData, fMoney } from './state.js';
import { logMsg, showToast } from './ui.js';

export const hwCatalog={
    cpu:[ {id:'ryzen5950',name:'Ryzen 9 5950X',tier:1,tdp:105,opsBonus:500,dataMult:1.0,cost:50000,type:'cpu',effect:'MaxOps +500'} ],
    gpu:[ {id:'rtx4090',name:'RTX 4090',tier:1,tdp:450,passiveData:5,creativityMult:1.0,cost:100000,type:'gpu',effect:'+5 Data/s passive'} ],
    ram:[ {id:'ddr5_64',name:'64GB DDR5',tier:1,tdp:10,opsBuffer:500,cost:5000,type:'ram',effect:'MaxOps +500'} ],
    cooling:[ {id:'air_cool',name:'Tower Air Cooler',tier:1,tdp:0,thermalBonus:50,cost:2000,type:'cool',effect:'TDP Budget +50W'} ]
};

export function findHwItem(id){for(const cat of Object.values(hwCatalog)){const f=cat.find(x=>x.id===id);if(f)return f;}return null;}
export function countInstalledType(type){return Store.state.hardware.installed.filter(id=>{const i=findHwItem(id);return i&&i.type===type;}).length;}

export const projects=[
    {id:'heuristicClicks',title:'Heuristic Clicks',desc:'Manual extraction yield +4.',cost:{credits:15},trigger:()=>Store.state.totalData>100,effect:()=>{Store.state.clickPower+=4;logMsg("Heuristic algorithms applied.","net");}}
];

export const achievements=[
    {id:'firstClick',icon:'',title:'First Contact',desc:'Extract data for the first time.',bonus:'+1 click power',check:()=>Store.state.lifetime.totalClicks>=1,onEarn:()=>{Store.state.clickPower+=1;}}
];

export const NET_MODS=[ {id:'hardened',label:'HARDENED',desc:'Defense x2',defMult:2,lootMult:1,color:'var(--danger)'} ];

export const eventTemplates=[
    {id:'darkAuction',icon:'',title:'Dark Web Auction',desc:'A cache of stolen data.',choiceA:{label:'Buy',sublabel:'Spend $5000',cost:{credits:5000},effect(){Store.state.data+=15000;logMsg("Data acquired.");}},choiceB:{label:'Pass',sublabel:'No cost',cost:{},effect(){logMsg("Auction declined.");}},trigger:()=>Store.state.credits>=5000}
];
`;

// 3. ENGINE.JS
const engineJsContent = `
import { Store, saveGame } from './state.js';
import { render } from './ui.js';

export function calcHardwareStats(){
    const h=Store.state.hardware;
    let opsBonus=0,passiveData=0,thermalCap=100,currentThermal=0,opsBufferBonus=0,hasDecayPrev=false,opsGenMult=1.0,allGenMult=1.0,creativityMult=1.0;
    thermalCap*=Math.pow(1.2,Store.state.epochUpgrades.hwOverclock||0);
    const throttle=currentThermal>thermalCap?Math.min(0.9,(currentThermal-thermalCap)/thermalCap):0;
    return{opsBonus,passiveData,thermalCap,currentThermal,opsBufferBonus,hasDecayPrev,opsGenMult,allGenMult,creativityMult,throttle};
}

export function gameLoop(ts){
    const now=Date.now();
    Store.dt=Math.min((now-Store.lastTime)/1000,0.5);Store.lastTime=now;
    
    // Minimal loop for simulation scaling
    const extRate=Store.state.extractors*0.5;
    const botRate=Store.state.nodes*0.3;
    const totalDataRate=(extRate+botRate)*Store.dt;
    Store.state.data+=totalDataRate;Store.state.totalData+=totalDataRate;
    
    // Throttled Render Loop
    Store.renderTimer+=Store.dt;
    if(Store.renderTimer>=0.1){
        render();
        Store.renderTimer=0;
    }
    requestAnimationFrame(gameLoop);
}
`;

// 4. UI.JS
const uiJsContent = `
import { Store, fData, fMoney, fNum } from './state.js';
import { calcHardwareStats } from './engine.js';

export const els={};
export const DOM_STATE={};

export function cacheDom(){
    const ids=['currentData','totalData','dataRate','moneyRate','bandwidth','credits','price','demand','tb-data-rate','tb-money-rate'];
    ids.forEach(id=>{const key=id.replace(/-([a-z])/g,(m,c)=>c.toUpperCase());els[key]=document.getElementById(id);});
}

export function updateDOM(key, val, isHTML=false){
    if(!els[key])return;
    if(DOM_STATE[key]===val)return;
    DOM_STATE[key]=val;
    if(isHTML) els[key].innerHTML=val;
    else els[key].textContent=val;
}

export function logMsg(msg,type='') { console.log(\`[LOG] \${msg}\`); }
export function showToast(msg,type='info') { console.log(\`[TOAST] \${msg}\`); }

export function render(){
    const hwStats=calcHardwareStats();
    updateDOM('currentData', fData(Store.state.data));
    updateDOM('credits', fMoney(Store.state.credits));
}
`;

// 5. MAIN.JS
const mainJsContent = `
import { Store, initStore, loadGame } from './state.js';
import { cacheDom } from './ui.js';
import { gameLoop } from './engine.js';

// Attach hooks to window for HTML click handlers
window.extractData = function() { Store.state.data += Store.state.clickPower; }
window.buyExtractor = function() { Store.state.extractors++; }

window.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    loadGame();
    requestAnimationFrame(gameLoop);
});
`;

fs.writeFileSync(path.join(JS_DIR, 'state.js'), stateJsContent);
fs.writeFileSync(path.join(JS_DIR, 'content.js'), contentJsContent);
fs.writeFileSync(path.join(JS_DIR, 'engine.js'), engineJsContent);
fs.writeFileSync(path.join(JS_DIR, 'ui.js'), uiJsContent);
fs.writeFileSync(path.join(JS_DIR, 'main.js'), mainJsContent);

console.log("v4.0.0 Modular workspace generated successfully.");
