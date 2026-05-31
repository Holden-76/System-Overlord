
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
    darknet:{seed:Math.floor(Math.random()*1000000), hexes:{}},
    forge:{grid:Array(225).fill('empty'), tool:'bus'},
    dyson:{satellites:0, stellarEnergy:0, cost:1000000000},
    terminal:{script:'// Initialize Overlord Daemon...\n'},
    aiLab:{ext:0,sub:0,brc:0,timerExt:0,timerSub:0,timerBrc:0},
    netStats:{dominated:0,incomeData:0,incomeCredits:0,attacksRepelled:0,discoveryTimer:55},
};

export function initStore() { Store.state = JSON.parse(JSON.stringify(defaultState)); }

/* Big Number Formatting */
const BIG_SFXS=['','K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd'];
export function fBig(n){if(!isFinite(n)||isNaN(n))return'0';if(n<0)return'-'+fBig(-n);if(n<1000)return Math.floor(n).toString();const exp=Math.floor(Math.log10(Math.abs(n)));const idx=Math.min(Math.floor(exp/3),BIG_SFXS.length-1);const val=n/Math.pow(10,idx*3);return val.toFixed(idx===0?0:2).replace(/\.00$/,'')+BIG_SFXS[idx];}
export function fNum(n){if(!Store.state||!Store.state.settings)return fBig(n);const fmt=Store.state.settings.numberFormat;if(fmt==='raw')return Math.floor(n).toLocaleString();if(fmt==='scientific'&&n>=1000)return n.toExponential(2);return fBig(n);}
export function fData(n){if(!Store.state||!Store.state.settings)return fBig(n)+' TB';const units=['TB','PB','EB','ZB','YB','RB','QB'];let val=n,ui=0;while(val>=1000&&ui<units.length-1){val/=1000;ui++;}const fmt=Store.state.settings.numberFormat;if(fmt==='raw')return Math.floor(val).toLocaleString()+' '+units[ui];if(fmt==='scientific'&&val>=1000)return val.toExponential(2)+' '+units[ui];return(ui===0?Math.floor(val).toString():val.toFixed(2).replace(/\.00$/,''))+' '+units[ui];}
export function fMoney(n){if(!Store.state||!Store.state.settings)return'$'+fBig(n);const fmt=Store.state.settings.numberFormat;if(fmt==='raw')return'$'+n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});if(fmt==='scientific'&&n>=1000)return'$'+n.toExponential(2);return'$'+fBig(n);}
export function fScore(n){if(n>=1e9)return(n/1e9).toFixed(2)+'B';if(n>=1e6)return(n/1e6).toFixed(2)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'k';return Math.floor(n).toString();}

export function saveGame(){
    Store.state.lastSaveTime=Date.now().toString();
    try{
        localStorage.setItem('systemOverlordSave_v4_0_0',JSON.stringify(Store.state));
        const si=document.getElementById('save-indicator');
        if(si){si.classList.add('visible');setTimeout(()=>si.classList.remove('visible'),1500);}
    }catch(e){}
}

export function loadGame(){
    let parsed=null;
    const keys=['systemOverlordSave_v4_0_0','systemOverlordSave_v3_3_2','systemOverlordSave_v3_3_1','systemOverlordSave_v3_3_0','systemOverlordSave_v3_2_0','systemOverlordSave_v3_1_1','systemOverlordSave_v3_1_0','systemOverlordSave_v3_0_0','systemOverlordSave_v2_7_0','systemOverlordSave_v2_6_0','systemOverlordSave_v2_5_0','systemOverlordSave'];
    for(const k of keys){try{const s=localStorage.getItem(k);if(s){parsed=JSON.parse(s);break;}}catch(e){}}
    if(!parsed){initStore();return;}
    function deepMerge(target,source){for(const k in target){if(!(k in source)){source[k]=target[k];}else if(typeof target[k]==='object'&&target[k]!==null&&!Array.isArray(target[k])){deepMerge(target[k],source[k]);}}return source;}
    Store.state=deepMerge(JSON.parse(JSON.stringify(defaultState)),parsed);
}

window.Store = Store;
