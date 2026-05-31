import { Store } from './state.js';
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

// =======================
// EXTRACTED ACTIONS
// =======================
export function upgradeAI(type) {
    const ai = Store.state.aiLab;
    let costOps = 0, costData = 0;
    if(type==='ext') { costOps = 1000 * Math.pow(1.5, ai.ext); costData = 5000 * Math.pow(1.5, ai.ext); }
    if(type==='sub') { costOps = 2500 * Math.pow(1.6, ai.sub); costData = 25000 * Math.pow(1.6, ai.sub); }
    if(type==='brc') { costOps = 10000 * Math.pow(1.8, ai.brc); costData = 100000 * Math.pow(1.8, ai.brc); }
    
    if(Store.state.ops < costOps || Store.state.data < costData) {
        showToast('Insufficient resources for AI training.', 'warn');
        return;
    }
    Store.state.ops -= costOps;
    Store.state.data -= costData;
    ai[type]++;
    AudioEngine.purchase();
    updateAIPanel();
};

export function updateAIPanel() {
    if(!Store.state.aiLab) return;
    const ai = Store.state.aiLab;
    
    const e = document.getElementById('ai-lvl-ext'); if(e) e.textContent = 'LVL ' + ai.ext;
    const c1 = document.getElementById('ai-cost-ext'); if(c1) c1.textContent = fNum(1000 * Math.pow(1.5, ai.ext)) + ' Ops + ' + fData(5000 * Math.pow(1.5, ai.ext));
    
    const s = document.getElementById('ai-lvl-sub'); if(s) s.textContent = 'LVL ' + ai.sub;
    const c2 = document.getElementById('ai-cost-sub'); if(c2) c2.textContent = fNum(2500 * Math.pow(1.6, ai.sub)) + ' Ops + ' + fData(25000 * Math.pow(1.6, ai.sub));
    
    const b = document.getElementById('ai-lvl-brc'); if(b) b.textContent = 'LVL ' + ai.brc;
    const c3 = document.getElementById('ai-cost-brc'); if(c3) c3.textContent = fNum(10000 * Math.pow(1.8, ai.brc)) + ' Ops + ' + fData(100000 * Math.pow(1.8, ai.brc));
};

export function setThreatLevel(lvl){
    Store.state.threatLevel=lvl;
    document.querySelectorAll('.btn-threat').forEach(b=>{b.classList.remove('active','level-1','level-2','level-3','level-4','level-5');if(parseInt(b.dataset.level)===lvl)b.classList.add('active',`level-${lvl}`);});
    const labels=['Secure  x1.0 data','Elevated  x1.5 data','Dangerous  x3.0 data','Critical  x7.5 data','Black Site  x15.0 data'];
    const icons=['','','','',''];
    if(els.threatInfo)els.threatInfo.textContent=labels[lvl-1];
    if(els.threatIcon)els.threatIcon.textContent=icons[lvl-1];
    AudioEngine.click();
};

export function toggleFormat(){
    const formats=['suffix','raw','sci'];
    let idx=formats.indexOf(Store.state.settings.numberFormat||'suffix');
    idx=(idx+1)%formats.length;
    Store.state.settings.numberFormat=formats[idx];
    document.getElementById('btn-format').textContent=formats[idx].toUpperCase();
    render();
};

export function toggleTooltips(val){ Store.state.settings.tooltipsEnabled = val; if(!val) { tip.style.opacity='0'; setTimeout(()=>tip.style.display='none',300); } };
export function setMarketStrategy(val){Store.state.marketStrategy=val;};
export function toggleTheme(){
    const t=Store.state.settings.theme==='modern'?'retro':'modern'; Store.state.settings.theme=t;
    document.body.classList.toggle('theme-retro',t==='retro');
    if(els.btnTheme)els.btnTheme.textContent=t==='retro'?'MODERN MODE':'RETRO MODE';
};

export function openSettings(){document.getElementById('settings-overlay').classList.add('show');};
export function closeSettings(){document.getElementById('settings-overlay').classList.remove('show');};

/* ==========================================================================
   INTERACTIONS
   ========================================================================== */
export function extractData(e){
    AudioEngine.enable();
    const boost=getExtractBoost();
    const hwStats=calcHardwareStats();
    const ePower=Math.floor(Store.state.clickPower*Store.state.combo*boost*(1-hwStats.throttle)*Math.pow(1.2,Store.state.prestigeUpgrades.dataAmp)*Math.pow(1.5,Store.state.epochUpgrades.voidProtocol||0)*hwStats.allGenMult);
    const epAmt=ePower*Math.min(getThreatMult(),15);
    Store.state.data+=epAmt; Store.state.totalData+=epAmt; Store.state.lifetime.totalData+=epAmt; Store.state.lifetime.totalClicks++;
    const bwNeeded=Store.state.bandwidth*0.001; Store.state.bandwidth=Math.max(0,Store.state.bandwidth-bwNeeded);
    comboTimer=3.0; Store.state.combo=Math.min(Store.state.maxCombo,Store.state.combo+0.1);
    if(Store.state.combo>Store.state.lifetime.highestCombo)Store.state.lifetime.highestCombo=Store.state.combo;
    Store.state.frenzyMeter+=0.04;
    if(Math.random()<0.02&&Store.state.milestones.computeUnlocked)triggerHackingMinigame();
    if(e){spawnFloat(e.clientX,e.clientY,`+${fData(epAmt)}`,'var(--accent)');}
    calculateTrust(); checkAchievements();
    AudioEngine.click();
};

export function buyBandwidth(e){
    const cost=Store.state.bandwidthCost; if(Store.state.credits<cost)return;
    const bonus=Store.state.settings.bwBonus?1.5:1;
    const gain=Math.floor((100+(Store.state.marketingLevel*10))*bonus);
    Store.state.credits-=cost; Store.state.bandwidth+=gain;
    Store.state.bandwidthCost=Math.floor(cost*1.12);
    AudioEngine.purchase();
    if(e)spawnFloat(e.clientX,e.clientY,`+${gain} BW`,'var(--green)');
};

export function buyMarketing(){
    const cCost=Store.state.subversionCostCredits, dCost=Store.state.subversionCostData;
    if(Store.state.credits<cCost||Store.state.data<dCost)return;
    Store.state.credits-=cCost; Store.state.data-=dCost; Store.state.marketingLevel++;
    Store.state.subversionCostCredits=Math.floor(cCost*1.6); Store.state.subversionCostData=Math.floor(dCost*1.6);
    logMsg(`Subversion Level ${Store.state.marketingLevel} activated.`,'warn'); AudioEngine.purchase();
};

export function buyExtractor(e){
    let amt=Store.state.settings.buyAmount==='MAX'?Math.floor(Store.state.credits/Store.state.extractorCost):Store.state.settings.buyAmount;
    if(amt<1||Store.state.credits<Store.state.extractorCost)return;
    amt=Math.min(amt,Math.floor(Store.state.credits/Store.state.extractorCost));
    const cost=calcCostMulti(Store.state.extractorCost,amt,1.07);
    if(Store.state.credits<cost)return;
    Store.state.credits-=cost; Store.state.extractors+=amt; Store.state.extractorCost=Math.floor(Store.state.extractorCost*Math.pow(1.07,amt));
    AudioEngine.purchase();
    if(e)spawnFloat(e.clientX,e.clientY,`+${amt} Ext`,'var(--accent)');
};

export function buyNode(e){
    if(Store.state.data<Store.state.nodeCostData||Store.state.credits<Store.state.nodeCostCredits)return;
    Store.state.data-=Store.state.nodeCostData; Store.state.credits-=Store.state.nodeCostCredits; Store.state.nodes++;
    Store.state.lifetime.totalNodes++; Store.state.nodeCostData=Math.floor(Store.state.nodeCostData*1.15); Store.state.nodeCostCredits=Math.floor(Store.state.nodeCostCredits*1.15);
    logMsg(`New botnet node infected. Total: ${Store.state.nodes}.`,'warn'); AudioEngine.purchase();
    if(e)spawnFloat(e.clientX,e.clientY,'+1 Node','var(--warn)');
};

export function buyProcessor(){
    const cost=1+Math.floor(Store.state.processors/3); if(Store.state.trust-Store.state.usedTrust<cost)return;
    Store.state.usedTrust+=cost; Store.state.processors++; AudioEngine.purchase();
};

export function buyMemory(){
    const cost=2+Math.floor(Store.state.memory/2); if(Store.state.trust-Store.state.usedTrust<cost)return;
    Store.state.usedTrust+=cost; Store.state.memory++; Store.state.maxOps=Store.state.memory*1000;
    Store.state.maxOps+=calcHardwareStats().opsBonus+calcHardwareStats().opsBufferBonus;
    AudioEngine.purchase();
};

export function triggerOverclock(){
    if(Store.state.overclockCooldown>0)return;
    Store.state.overclockActive=8; Store.state.overclockCooldown=60;
    logMsg("Overclock initiated! Ops generation x5 for 8 seconds.",'crit'); AudioEngine.purchase();
};

export function buyRack(){
    if(Store.state.credits<Store.state.hardware.rackCost){showToast('Not enough Credits for a rack!','warn');return;}
    Store.state.credits-=Store.state.hardware.rackCost;
    Store.state.hardware.racks++;
    Store.state.hardware.rackCost=Math.floor(Store.state.hardware.rackCost*3);
    Store.state.hardware.cpuSlots+=2; Store.state.hardware.gpuSlots+=1; Store.state.hardware.ramSlots+=3;
    logMsg(`Server rack ${Store.state.hardware.racks} installed. Slots expanded.`,'good');
    AudioEngine.hardware(); showToast(`Rack ${Store.state.hardware.racks} online!`,'hw');
    renderHardwarePanel();
};

export function installHardware(itemId){
    const item=findHwItem(itemId);
    if(!item){showToast('Unknown hardware item','crit');return;}
    const hwStats=calcHardwareStats();
    const cpuCount=countInstalledType('cpu'), gpuCount=countInstalledType('gpu'), ramCount=countInstalledType('ram'), coolCount=countInstalledType('cool');
    if(item.type==='cpu'&&cpuCount>=Store.state.hardware.cpuSlots){showToast('No CPU slots available! Buy more racks.','warn');return;}
    if(item.type==='gpu'&&gpuCount>=Store.state.hardware.gpuSlots){showToast('No GPU slots available! Buy more racks.','warn');return;}
    if(item.type==='ram'&&ramCount>=Store.state.hardware.ramSlots){showToast('No RAM slots available! Buy more racks.','warn');return;}
    if(item.type==='cool'&&coolCount>=Store.state.hardware.coolSlots){showToast('No Cooling slots available!','warn');return;}
    if(Store.state.credits<item.cost){showToast(`Need ${fMoney(item.cost)} for ${item.name}`,'warn');return;}
    Store.state.credits-=item.cost;
    Store.state.hardware.installed.push(itemId);
    const hwNew=calcHardwareStats();
    Store.state.maxOps=(Store.state.memory*1000)+hwNew.opsBonus+hwNew.opsBufferBonus;
    logMsg(`${item.name} installed. ${item.effect}`,'good');
    AudioEngine.hardware(); showToast(`${item.name} installed!`,'hw');
    checkAchievements(); renderHardwarePanel();
};

export function adminSetStage(stage){
    if(stage===1){adminGive('data',5000);adminGive('credits',1000);}
    else if(stage===2){adminGive('data',50000);adminGive('credits',20000);adminGive('nodes',15);if(!Store.state.milestones.botnetUnlocked){Store.state.milestones.botnetUnlocked=true;document.getElementById('botnet-module').classList.remove('hidden');}}
    else if(stage===3){adminGive('data',500000);adminGive('credits',200000);adminGive('nodes',60);adminGive('ops',10000);adminGive('creativity',200);if(!Store.state.milestones.computeUnlocked){Store.state.milestones.computeUnlocked=true;document.getElementById('compute-module').classList.remove('hidden');}if(!Store.state.milestones.creativityUnlocked){Store.state.milestones.creativityUnlocked=true;document.getElementById('creativity-module').classList.remove('hidden');}}
    else if(stage===4){adminGive('data',5000000);adminGive('credits',5000000);adminGive('nodes',120);adminGive('ops',50000);adminGive('creativity',500);adminGive('kernelFragments',30);}
    render();
};

export function toggleAdmin(){document.getElementById('admin-overlay').classList.toggle('show');};

/* ==========================================================================
   PROJECTS SYSTEM
   ========================================================================== */
function canAffordProject(p){
    const c=p.cost;
    if(c.credits&&Store.state.credits<c.credits)return false;
    if(c.data&&Store.state.data<c.data)return false;
    if(c.ops&&Store.state.ops<c.ops)return false;
    if(c.creativity&&(Store.state.creativity||0)<c.creativity)return false;
    return true;
}
function costStr(c){const parts=[];if(c.credits)parts.push(fMoney(c.credits));if(c.data)parts.push(fData(c.data));if(c.ops)parts.push(fNum(c.ops)+' Ops');if(c.creativity)parts.push(c.creativity+' Crtv');return parts.join(' + ');}
export function purchaseProject(id){
    const p=projects.find(x=>x.id===id);if(!p)return;if(hasProject(id))return;if(!canAffordProject(p))return;
    const c=p.cost;
    if(c.credits)Store.state.credits-=c.credits;if(c.data){Store.state.data-=c.data;}if(c.ops)Store.state.ops-=c.ops;if(c.creativity)Store.state.creativity-=c.creativity;
    Store.state.purchasedProjects.push(id); Store.state.lifetime.totalProjects++;
    p.effect(); AudioEngine.achievement(); showToast(`PROJECT: ${p.title}`,'info');
    renderProjects(); checkAchievements();
};

export function openPrestige(){
    const overlay=document.getElementById('prestige-overlay'),gainEl=document.getElementById('gain-kf'),rebCount=document.getElementById('reboot-count');
    if(gainEl)gainEl.textContent='+'+calcFragmentGain();
    if(rebCount)rebCount.textContent=Store.state.prestigeCount;
    if(els.currentKf)els.currentKf.textContent=Store.state.kernelFragments;
    renderPrestigeShop();
    overlay.classList.add('show');
    if(Store.state.prestigeCount>=3||(Store.state.epochCount||0)>0){const es=document.getElementById('epoch-section');if(es)es.style.display='block';renderEpochShop();}
    updatePrestigeEpochDisplay();
};

export function closePrestige(){document.getElementById('prestige-overlay').classList.remove('show');};
function updatePrestigeEpochDisplay(){
    const epDisp=document.getElementById('epoch-count-display'),epTok=document.getElementById('epoch-tokens-display');
    if(epDisp)epDisp.textContent=Store.state.epochCount||0;if(epTok)epTok.textContent=Store.state.epochTokens||0;
}
export function confirmReboot(){
    if(!confirm('INITIATE SYSTEM REBOOT? This will reset most progress. Kernel Fragments and Epoch data persist.'))return;
    const frags=calcFragmentGain();
    const score=calculateScore();
    if(!Array.isArray(Store.state.localLeaderboard))Store.state.localLeaderboard=[];
    Store.state.localLeaderboard.push({score,reboots:Store.state.prestigeCount+1,epoch:Store.state.epochCount||0,date:new Date().toLocaleDateString()});
    Store.state.localLeaderboard.sort((a,b)=>b.score-a.score);Store.state.localLeaderboard=Store.state.localLeaderboard.slice(0,10);
    Store.state.kernelFragments+=frags; Store.state.prestigeCount++;
    const kf=Store.state.kernelFragments,pu=Store.state.prestigeUpgrades,eu=Store.state.epochUpgrades,pc=Store.state.prestigeCount,ec=Store.state.epochCount||0,et=Store.state.epochTokens||0,lb=Store.state.localLeaderboard,lt=JSON.parse(JSON.stringify(Store.state.lifetime)),ea=Store.state.earnedAchievements.slice(),ep=Store.state.epochUpgrades,hwState=JSON.parse(JSON.stringify(Store.state.hardware)),networks=JSON.parse(JSON.stringify(Store.state.networks||[])),netStats={...defaultState.netStats,...{dominated:0,attacksRepelled:0,incomeData:0,incomeCredits:0,discoveryTimer:55}};
    state=JSON.parse(JSON.stringify(defaultState));
    Store.state.kernelFragments=kf;Store.state.prestigeUpgrades=pu;Store.state.epochUpgrades=eu;Store.state.prestigeCount=pc;Store.state.epochCount=ec;Store.state.epochTokens=et;Store.state.localLeaderboard=lb;Store.state.lifetime=lt;Store.state.earnedAchievements=ea;Store.state.hardware=hwState;Store.state.networks=networks;Store.state.netStats=netStats;
    Store.state.lastSaveTime=Date.now().toString();
    if(Store.state.prestigeUpgrades.quickStart>=1){Store.state.data=1000;Store.state.bandwidth=1500;}
    if(hasAchievement('prestige1'))Store.state.data+=50;
    showToast(`System Rebooted! +${frags} Fragments`,'purple'); closePrestige();
    logMsg("",'crit');
    logMsg(`SYSTEM REBOOT COMPLETE. +${frags} KERNEL FRAGMENTS.`,'purple');
    logMsg("",'crit');
    showMilestone("// SYSTEM REBOOTED //"); render();
};

export function buyPrestigeUpgrade(id){
    const def=prestigeUpgradesDef.find(x=>x.id===id);if(!def)return;
    const cur=Store.state.prestigeUpgrades[id]||0;
    if(def.max&&cur>=def.max)return;
    const cost=def.cost*(1+cur);
    if(Store.state.kernelFragments<cost){showToast('Not enough Kernel Fragments!','warn');return;}
    Store.state.kernelFragments-=cost;Store.state.prestigeUpgrades[id]=cur+1;
    AudioEngine.achievement();showToast(`${def.name} Lv${cur+1}`,'purple');renderPrestigeShop();
    if(els.currentKf)els.currentKf.textContent=Store.state.kernelFragments;
};

export function confirmAscend(){
    if(Store.state.prestigeCount<3){showToast('Need 3+ reboots to ascend!','warn');return;}
    if(Store.state.kernelFragments<25){showToast('Need 25 Kernel Fragments to ascend!','warn');return;}
    if(!confirm('INITIATE EPOCH ASCENSION? All reboots reset, Epoch Tokens and upgrades persist forever.'))return;
    Store.state.kernelFragments-=25; 
    const newEpochCount=(Store.state.epochCount||0)+1; 
    const newEpochTokens=(Store.state.epochTokens||0)+1;
    const eu=Store.state.epochUpgrades,lt=JSON.parse(JSON.stringify(Store.state.lifetime)),ea=Store.state.earnedAchievements.slice(),hwState=JSON.parse(JSON.stringify(Store.state.hardware));
    state=JSON.parse(JSON.stringify(defaultState));
    Store.state.epochCount=newEpochCount; Store.state.epochTokens=newEpochTokens; Store.state.epochUpgrades=eu; Store.state.lifetime=lt; Store.state.earnedAchievements=ea; Store.state.hardware=hwState;
    showToast(`EPOCH ${Store.state.epochCount} ASCENSION ACHIEVED!`,'purple'); closePrestige();
    showMilestone(`// EPOCH ${Store.state.epochCount} //`);
    const eb=document.getElementById('epoch-badge-top'),ev=document.getElementById('epoch-badge-val');
    if(eb)eb.style.display='block';if(ev)ev.textContent=Store.state.epochCount;
    logMsg(`EPOCH ASCENSION ${Store.state.epochCount} INITIATED. TRANSCENDENCE CONTINUES.`,'purple');render();
};

export function buyEpochUpgrade(id){
    const def=epochUpgradesDef.find(x=>x.id===id);if(!def)return;
    const cur=Store.state.epochUpgrades[id]||0,cost=def.cost;
    if((Store.state.epochTokens||0)<cost){showToast('Not enough Epoch Tokens!','warn');return;}
    Store.state.epochTokens-=cost;Store.state.epochUpgrades[id]=cur+1;
    AudioEngine.achievement();showToast(`${def.name} Lv${cur+1}`,'purple');renderEpochShop();
    updatePrestigeEpochDisplay();
};

export function startBreach(netId){
    if(breachActive)return;
    breachActive=true; _breachNetId=netId||null; breachTimer=15; breachClicked=0; breachTarget=5+Math.floor(Math.random()*4);
    const overlay=document.getElementById('breach-overlay');overlay.classList.add('show');
    const area=document.getElementById('breach-area');area.innerHTML='';
    breachNodes=[];
    for(let i=0;i<breachTarget;i++){
        const node=document.createElement('div');node.className='breach-node';
        node.style.left=(10+Math.random()*80)+'%';node.style.top=(10+Math.random()*80)+'%';
        node.textContent=i+1;
        node.addEventListener('click',()=>{if(node.classList.contains('clicked'))return;node.classList.add('clicked');breachClicked++;if(breachClicked>=breachTarget)breachSuccess();});
        area.appendChild(node);breachNodes.push(node);
    }
    AudioEngine.breach();
};

export function openLeaderboard(){document.getElementById('leaderboard-overlay').classList.add('show');renderLeaderboard();const sv=document.getElementById('lb-your-score-val');if(sv)sv.textContent=fScore(calculateScore());const lb=document.getElementById('lb-your-breakdown');if(lb)lb.textContent=`DataPrestigeTrustEpochNetworks`;};
export function closeLeaderboard(){document.getElementById('leaderboard-overlay').classList.remove('show');};
export function switchLeaderboardTab(tab){document.querySelectorAll('.lb-tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.lb-tab-content').forEach(t=>t.classList.remove('active'));document.querySelector(`.lb-tab-btn[onclick*="${tab}"]`).classList.add('active');document.getElementById(`lb-tab-${tab}`).classList.add('active');};
function renderLeaderboard(){
    const c=document.getElementById('lb-local-content');if(!c)return;
    const lb=Store.state.localLeaderboard||[];
    if(!lb.length){c.innerHTML='<div class="lb-status">No runs recorded yet. Complete a Reboot to log your score.</div>';return;}
    c.innerHTML=`<table class="lb-table"><thead><tr><th>#</th><th>Score</th><th>Reboots</th><th>Epoch</th><th>Date</th></tr></thead><tbody>${lb.map((r,i)=>`<tr class="${i<3?'rank-'+(i+1):''}"><td>${i+1}</td><td class="lb-score">${fScore(r.score)}</td><td>${r.reboots}</td><td>${r.epoch}</td><td>${r.date}</td></tr>`).join('')}</tbody></table>`;
}
export async function submitScoreOnline(){
    if(!FIREBASE_URL){showToast('No Firebase URL configured','warn');return;}
    const nick=document.getElementById('lb-nickname').value.trim();if(!nick){showToast('Enter an operator handle first!','warn');return;}
    const score=calculateScore();
    try{await fetch(`${FIREBASE_URL}.json`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nick,score,reboots:Store.state.prestigeCount,epoch:Store.state.epochCount||0,version:'v3.3.2',ts:Date.now()})});showToast('Score submitted!','good');fetchOnlineLeaderboard();}catch(e){showToast('Failed to submit score','crit');}
};

export function exportSave(){const s=JSON.stringify(state);navigator.clipboard.writeText(btoa(s)).then(()=>showToast('Save copied to clipboard!','good')).catch(()=>{const t=document.createElement('textarea');t.value=btoa(s);document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);showToast('Save exported!','good');});};
export function importSave(){const s=prompt('Paste your save string:');if(!s)return;try{state=JSON.parse(atob(s.trim()));showToast('Save imported!','good');render();}catch(e){showToast('Invalid save string!','crit');}};
export function resetGame(){if(!confirm('HARD RESET: wipe all save data? This cannot be undone.'))return;['systemOverlordSave_v3_3_2','systemOverlordSave_v3_3_0','systemOverlordSave_v3_0_0','systemOverlordSave_v2_7_0','systemOverlordSave_v2_6_0','systemOverlordSave_v2_5_0','systemOverlordSave'].forEach(k=>localStorage.removeItem(k));state=JSON.parse(JSON.stringify(defaultState));showToast('Hard reset complete.','warn');render();};

/* ==========================================================================
   MAIN RENDER
   ========================================================================== */
/* ==========================================================================
   GAME LOOP
   ========================================================================== */
let renderTimer=0;
