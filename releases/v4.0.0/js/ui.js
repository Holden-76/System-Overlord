
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
export function showToast(msg,type='info') { console.log(`[TOAST] ${msg}`); }
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

export function render(){
    const hwStats=calcHardwareStats();
    Store.state.maxOps=Math.max(1000,(Store.state.memory||1)*1000+hwStats.opsBonus+hwStats.opsBufferBonus);
    Store.state.maxOps=Math.floor(Store.state.maxOps*Math.pow(1.3,Store.state.epochUpgrades.neuralOverdrive||0));

    updateDOM('tbDataRate', fData(currentDataRate)+'/s');
    updateDOM('tbMoneyRate', fMoney(currentMoneyRate)+'/s');
    updateDOM('tbTrust', Store.state.trust);
    updateDOM('tbNetworks', Store.state.netStats?.dominated||0);

    updateDOM('currentData', fData(Store.state.data));
    updateDOM('totalData', fData(Store.state.totalData));
    updateDOM('credits', fMoney(Store.state.credits));
    updateDOM('dataRate', '+'+fData(currentDataRate)+'/s');
    updateDOM('moneyRate', '+'+fMoney(currentMoneyRate)+'/s');
    updateDOM('bandwidth', fNum(Math.floor(Store.state.bandwidth))+' TB');
    updateDOM('bandwidthCost', fMoney(Store.state.bandwidthCost));
    updateStyle('bwBar', 'width', Math.min(100,(Store.state.data/Math.max(1,Store.state.bandwidth))*100)+'%');

    const cap=getMarketCapacity();
    updateDOM('price', fMoney(Store.state.price)+'/TB');
    updateDOM('demand', fData(cap)+'/s');
    const tc={'boom':' BOOM','crash':' CRASH','normal':''};
    updateDOM('marketTrend', tc[marketTrend]||'');
    updateDOM('marketingLevel', Store.state.marketingLevel);
    updateDOM('subCostCredits', fMoney(Store.state.subversionCostCredits));
    updateDOM('subCostData', fData(Store.state.subversionCostData));
    updateProp('btnBuyMarketing', 'disabled', Store.state.credits<Store.state.subversionCostCredits||Store.state.data<Store.state.subversionCostData);

    updateDOM('extractors', Store.state.extractors);
    updateDOM('extractorCost', fMoney(Store.state.extractorCost));
    updateProp('btnBuyExtractor', 'disabled', Store.state.credits<Store.state.extractorCost);
    updateProp('btnBuyBandwidth', 'disabled', Store.state.credits<Store.state.bandwidthCost);

    updateDOM('nodes', fNum(Store.state.nodes));
    const nodeDataRate=Store.state.nodes*0.3*getBotnetMult();
    updateDOM('nodeDataRate', '+'+fData(nodeDataRate)+'/s');
    updateDOM('nodeCostData', fData(Store.state.nodeCostData));
    updateDOM('nodeCostCredits', fMoney(Store.state.nodeCostCredits));
    updateProp('btnBuyNode', 'disabled', Store.state.data<Store.state.nodeCostData||Store.state.credits<Store.state.nodeCostCredits);

    if(Store.state.milestones.computeUnlocked){
        updateDOM('trustLevel', Store.state.trust);
        updateStyle('trustBar', 'width', Math.min(100,(Store.state.lifetime.totalData/Store.state.nextTrustTarget)*100)+'%');
        updateDOM('nextTrust', fData(Store.state.nextTrustTarget));
        updateDOM('processors', Store.state.processors);
        updateDOM('memory', Store.state.memory);
        updateDOM('ops', fNum(Math.floor(Store.state.ops)));
        updateDOM('maxOps', fNum(Store.state.maxOps));
        updateStyle('opsBar', 'width', Math.min(100,(Store.state.ops/Store.state.maxOps)*100)+'%');
        
        const opsPerSec=Store.state.processors*2*(1+(hasProject('recursiveSelfImprovement')?0.5:0))*Math.pow(1.2,Store.state.prestigeUpgrades.neuralBoost)*(Store.state.overclockActive>0?5:1)*Math.pow(1.3,Store.state.epochUpgrades.neuralOverdrive||0)*hwStats.opsGenMult*getOpsBoost();
        updateDOM('opsRate', '+'+fNum(Math.round(opsPerSec))+'/s');
        
        const procCost=1+Math.floor(Store.state.processors/3);
        updateProp('btnAddProc', 'disabled', Store.state.trust-Store.state.usedTrust<procCost);
        const memCost=2+Math.floor(Store.state.memory/2);
        updateProp('btnAddMem', 'disabled', Store.state.trust-Store.state.usedTrust<memCost);
        updateDOM('procCost', procCost+' Trust');
        updateDOM('memCost', memCost+' Trust');
        
        if(Store.state.milestones.creativityUnlocked) updateDOM('creativity', fNum(Math.floor(Store.state.creativity||0)));
        updateStyle('overclockBar', 'width', (1-Store.state.overclockCooldown/60)*100+'%');
        updateDOM('btnOverclock', Store.state.overclockCooldown>0?`OVERCLOCK  ${Math.ceil(Store.state.overclockCooldown)}s`:'OVERCLOCK  READY');
    }

    const comboEl=els.clickCombo;
    if(comboEl){
        updateDOM('clickCombo', `COMBO x${Store.state.combo.toFixed(1)}`);
        if(Store.state.combo>=Store.state.maxCombo){
            updateClass('clickCombo', 'combo-max', 'add');
            updateClass('clickCombo', 'combo-active', 'remove');
        } else if(Store.state.combo>2){
            updateClass('clickCombo', 'combo-active', 'add');
            updateClass('clickCombo', 'combo-max', 'remove');
        } else {
            updateClass('clickCombo', 'combo-active', 'remove');
            updateClass('clickCombo', 'combo-max', 'remove');
        }
    }

    const bwPct=Math.min(100,(Store.state.data/Math.max(1,Store.state.bandwidth))*100);
    const opsPct=Math.min(100,(Store.state.ops/Math.max(1,Store.state.maxOps))*100);
    const heatPct=Math.min(100,(hwStats.currentThermal/Math.max(1,hwStats.thermalCap))*100);
    updateStyle('vitalBw', 'width', bwPct+'%');
    updateStyle('vitalOps', 'width', opsPct+'%');
    updateStyle('vitalHeat', 'width', heatPct+'%');
    updateClass('vitalHeat', 'hot', heatPct>85 ? 'add' : 'remove');
    updateDOM('vitalBwVal', Math.round(bwPct)+'%');
    updateDOM('vitalOpsVal', Math.round(opsPct)+'%');
    updateDOM('vitalHeatVal', Math.round(heatPct)+'%');

    const ns=Store.state.netStats||{};
    updateDOM('netDominated', ns.dominated||0);
    updateDOM('netIncomeRate', fMoney(ns.incomeCredits||0)+'/s');
    updateDOM('netAttacks', ns.attacksRepelled||0);

    updateDOM('bbData', fData(Store.state.data));
    updateDOM('bbDrate', '+'+fData(currentDataRate)+'/s');
    updateDOM('bbMrate', '+'+fMoney(currentMoneyRate)+'/s');
    updateDOM('bbNodes', Store.state.nodes);
    updateDOM('bbReboots', Store.state.prestigeCount);
    updateDOM('bbEpoch', Store.state.epochCount||0);
    updateDOM('bbHeat', Math.round(hwStats.currentThermal)+'W/'+Math.round(hwStats.thermalCap)+'W');

    if(Store.state.epochCount>0){
        updateStyle('bbEpochStat', 'display', 'flex');
        updateStyle('epochBadgeTop', 'display', 'block');
        updateDOM('epochBadgeVal', Store.state.epochCount||0);
    }

    updateDOM('kernelFragments', Store.state.kernelFragments);
    updateDOM('fmtBtn', (Store.state.settings?.numberFormat||'suffix').toUpperCase());
    
    if(Store.state.settings?.theme==='retro'){
        if(DOM_STATE['body_retro']!=='add'){
            document.body.classList.add('theme-retro');
            DOM_STATE['body_retro']='add';
        }
    } else {
        if(DOM_STATE['body_retro']!=='remove'){
            document.body.classList.remove('theme-retro');
            DOM_STATE['body_retro']='remove';
        }
    }

    if(Store.state.milestones.prestigeUnlocked) updateClass('prestigeWrapper', 'hidden', 'remove');

    // These smaller sub-renders will be handled efficiently inside their own logic or just called normally
    // For pure optimization, we can throttle them slightly or leave them as is since they generate HTML 
    // Wait, renderHardwarePanel uses innerHTML for the slots, we should dirty check it too if possible, 
    // but the task focus is main loop decoupling. Let's let them run for now, they are small.
    renderProjects(); renderAchievements(); renderStats();
    renderHardwarePanel(); renderWarfarePanel();
}
