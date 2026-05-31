window.upgradeAI = function(type) {
    const ai = state.aiLab;
    let costOps = 0, costData = 0;
    if(type==='ext') { costOps = 1000 * Math.pow(1.5, ai.ext); costData = 5000 * Math.pow(1.5, ai.ext); }
    if(type==='sub') { costOps = 2500 * Math.pow(1.6, ai.sub); costData = 25000 * Math.pow(1.6, ai.sub); }
    if(type==='brc') { costOps = 10000 * Math.pow(1.8, ai.brc); costData = 100000 * Math.pow(1.8, ai.brc); }
    
    if(state.ops < costOps || state.data < costData) {
        showToast('Insufficient resources for AI training.', 'warn');
        return;
    }
    state.ops -= costOps;
    state.data -= costData;
    ai[type]++;
    AudioEngine.purchase();
    updateAIPanel();
};

window.updateAIPanel = function() {
    if(!state.aiLab) return;
    const ai = state.aiLab;
    
    const e = document.getElementById('ai-lvl-ext'); if(e) e.textContent = 'LVL ' + ai.ext;
    const c1 = document.getElementById('ai-cost-ext'); if(c1) c1.textContent = fNum(1000 * Math.pow(1.5, ai.ext)) + ' Ops + ' + fData(5000 * Math.pow(1.5, ai.ext));
    
    const s = document.getElementById('ai-lvl-sub'); if(s) s.textContent = 'LVL ' + ai.sub;
    const c2 = document.getElementById('ai-cost-sub'); if(c2) c2.textContent = fNum(2500 * Math.pow(1.6, ai.sub)) + ' Ops + ' + fData(25000 * Math.pow(1.6, ai.sub));
    
    const b = document.getElementById('ai-lvl-brc'); if(b) b.textContent = 'LVL ' + ai.brc;
    const c3 = document.getElementById('ai-cost-brc'); if(c3) c3.textContent = fNum(10000 * Math.pow(1.8, ai.brc)) + ' Ops + ' + fData(100000 * Math.pow(1.8, ai.brc));
};

window.setThreatLevel=function(lvl){
    state.threatLevel=lvl;
    document.querySelectorAll('.btn-threat').forEach(b=>{b.classList.remove('active','level-1','level-2','level-3','level-4','level-5');if(parseInt(b.dataset.level)===lvl)b.classList.add('active',`level-${lvl}`);});
    const labels=['Secure  x1.0 data','Elevated  x1.5 data','Dangerous  x3.0 data','Critical  x7.5 data','Black Site  x15.0 data'];
    const icons=['','','','',''];
    if(els.threatInfo)els.threatInfo.textContent=labels[lvl-1];
    if(els.threatIcon)els.threatIcon.textContent=icons[lvl-1];
    AudioEngine.click();
};

window.toggleFormat=function(){
    const formats=['suffix','raw','sci'];
    let idx=formats.indexOf(state.settings.numberFormat||'suffix');
    idx=(idx+1)%formats.length;
    state.settings.numberFormat=formats[idx];
    document.getElementById('btn-format').textContent=formats[idx].toUpperCase();
    render();
};

window.toggleTooltips=function(val){ state.settings.tooltipsEnabled = val; if(!val) { tip.style.opacity='0'; setTimeout(()=>tip.style.display='none',300); } };
window.setMarketStrategy=function(val){state.marketStrategy=val;};
window.toggleTheme=function(){
    const t=state.settings.theme==='modern'?'retro':'modern'; state.settings.theme=t;
    document.body.classList.toggle('theme-retro',t==='retro');
    if(els.btnTheme)els.btnTheme.textContent=t==='retro'?'MODERN MODE':'RETRO MODE';
};

window.openSettings=function(){document.getElementById('settings-overlay').classList.add('show');};
window.closeSettings=function(){document.getElementById('settings-overlay').classList.remove('show');};

/* ==========================================================================
   INTERACTIONS
   ========================================================================== */
window.extractData=function(e){
    AudioEngine.enable();
    const boost=getExtractBoost();
    const hwStats=calcHardwareStats();
    const ePower=Math.floor(state.clickPower*state.combo*boost*(1-hwStats.throttle)*Math.pow(1.2,state.prestigeUpgrades.dataAmp)*Math.pow(1.5,state.epochUpgrades.voidProtocol||0)*hwStats.allGenMult);
    const epAmt=ePower*Math.min(getThreatMult(),15);
    state.data+=epAmt; state.totalData+=epAmt; state.lifetime.totalData+=epAmt; state.lifetime.totalClicks++;
    const bwNeeded=state.bandwidth*0.001; state.bandwidth=Math.max(0,state.bandwidth-bwNeeded);
    comboTimer=3.0; state.combo=Math.min(state.maxCombo,state.combo+0.1);
    if(state.combo>state.lifetime.highestCombo)state.lifetime.highestCombo=state.combo;
    state.frenzyMeter+=0.04;
    if(Math.random()<0.02&&state.milestones.computeUnlocked)triggerHackingMinigame();
    if(e){spawnFloat(e.clientX,e.clientY,`+${fData(epAmt)}`,'var(--accent)');}
    calculateTrust(); checkAchievements();
    AudioEngine.click();
};

window.buyBandwidth=function(e){
    const cost=state.bandwidthCost; if(state.credits<cost)return;
    const bonus=state.settings.bwBonus?1.5:1;
    const gain=Math.floor((100+(state.marketingLevel*10))*bonus);
    state.credits-=cost; state.bandwidth+=gain;
    state.bandwidthCost=Math.floor(cost*1.12);
    AudioEngine.purchase();
    if(e)spawnFloat(e.clientX,e.clientY,`+${gain} BW`,'var(--green)');
};

window.buyMarketing=function(){
    const cCost=state.subversionCostCredits, dCost=state.subversionCostData;
    if(state.credits<cCost||state.data<dCost)return;
    state.credits-=cCost; state.data-=dCost; state.marketingLevel++;
    state.subversionCostCredits=Math.floor(cCost*1.6); state.subversionCostData=Math.floor(dCost*1.6);
    logMsg(`Subversion Level ${state.marketingLevel} activated.`,'warn'); AudioEngine.purchase();
};

window.buyExtractor=function(e){
    let amt=state.settings.buyAmount==='MAX'?Math.floor(state.credits/state.extractorCost):state.settings.buyAmount;
    if(amt<1||state.credits<state.extractorCost)return;
    amt=Math.min(amt,Math.floor(state.credits/state.extractorCost));
    const cost=calcCostMulti(state.extractorCost,amt,1.07);
    if(state.credits<cost)return;
    state.credits-=cost; state.extractors+=amt; state.extractorCost=Math.floor(state.extractorCost*Math.pow(1.07,amt));
    AudioEngine.purchase();
    if(e)spawnFloat(e.clientX,e.clientY,`+${amt} Ext`,'var(--accent)');
};

window.buyNode=function(e){
    if(state.data<state.nodeCostData||state.credits<state.nodeCostCredits)return;
    state.data-=state.nodeCostData; state.credits-=state.nodeCostCredits; state.nodes++;
    state.lifetime.totalNodes++; state.nodeCostData=Math.floor(state.nodeCostData*1.15); state.nodeCostCredits=Math.floor(state.nodeCostCredits*1.15);
    logMsg(`New botnet node infected. Total: ${state.nodes}.`,'warn'); AudioEngine.purchase();
    if(e)spawnFloat(e.clientX,e.clientY,'+1 Node','var(--warn)');
};

window.buyProcessor=function(){
    const cost=1+Math.floor(state.processors/3); if(state.trust-state.usedTrust<cost)return;
    state.usedTrust+=cost; state.processors++; AudioEngine.purchase();
};

window.buyMemory=function(){
    const cost=2+Math.floor(state.memory/2); if(state.trust-state.usedTrust<cost)return;
    state.usedTrust+=cost; state.memory++; state.maxOps=state.memory*1000;
    state.maxOps+=calcHardwareStats().opsBonus+calcHardwareStats().opsBufferBonus;
    AudioEngine.purchase();
};

window.triggerOverclock=function(){
    if(state.overclockCooldown>0)return;
    state.overclockActive=8; state.overclockCooldown=60;
    logMsg("Overclock initiated! Ops generation x5 for 8 seconds.",'crit'); AudioEngine.purchase();
};

window.buyRack=function(){
    if(state.credits<state.hardware.rackCost){showToast('Not enough Credits for a rack!','warn');return;}
    state.credits-=state.hardware.rackCost;
    state.hardware.racks++;
    state.hardware.rackCost=Math.floor(state.hardware.rackCost*3);
    state.hardware.cpuSlots+=2; state.hardware.gpuSlots+=1; state.hardware.ramSlots+=3;
    logMsg(`Server rack ${state.hardware.racks} installed. Slots expanded.`,'good');
    AudioEngine.hardware(); showToast(`Rack ${state.hardware.racks} online!`,'hw');
    renderHardwarePanel();
};

window.installHardware=function(itemId){
    const item=findHwItem(itemId);
    if(!item){showToast('Unknown hardware item','crit');return;}
    const hwStats=calcHardwareStats();
    const cpuCount=countInstalledType('cpu'), gpuCount=countInstalledType('gpu'), ramCount=countInstalledType('ram'), coolCount=countInstalledType('cool');
    if(item.type==='cpu'&&cpuCount>=state.hardware.cpuSlots){showToast('No CPU slots available! Buy more racks.','warn');return;}
    if(item.type==='gpu'&&gpuCount>=state.hardware.gpuSlots){showToast('No GPU slots available! Buy more racks.','warn');return;}
    if(item.type==='ram'&&ramCount>=state.hardware.ramSlots){showToast('No RAM slots available! Buy more racks.','warn');return;}
    if(item.type==='cool'&&coolCount>=state.hardware.coolSlots){showToast('No Cooling slots available!','warn');return;}
    if(state.credits<item.cost){showToast(`Need ${fMoney(item.cost)} for ${item.name}`,'warn');return;}
    state.credits-=item.cost;
    state.hardware.installed.push(itemId);
    const hwNew=calcHardwareStats();
    state.maxOps=(state.memory*1000)+hwNew.opsBonus+hwNew.opsBufferBonus;
    logMsg(`${item.name} installed. ${item.effect}`,'good');
    AudioEngine.hardware(); showToast(`${item.name} installed!`,'hw');
    checkAchievements(); renderHardwarePanel();
};

window.adminSetStage=function(stage){
    if(stage===1){adminGive('data',5000);adminGive('credits',1000);}
    else if(stage===2){adminGive('data',50000);adminGive('credits',20000);adminGive('nodes',15);if(!state.milestones.botnetUnlocked){state.milestones.botnetUnlocked=true;document.getElementById('botnet-module').classList.remove('hidden');}}
    else if(stage===3){adminGive('data',500000);adminGive('credits',200000);adminGive('nodes',60);adminGive('ops',10000);adminGive('creativity',200);if(!state.milestones.computeUnlocked){state.milestones.computeUnlocked=true;document.getElementById('compute-module').classList.remove('hidden');}if(!state.milestones.creativityUnlocked){state.milestones.creativityUnlocked=true;document.getElementById('creativity-module').classList.remove('hidden');}}
    else if(stage===4){adminGive('data',5000000);adminGive('credits',5000000);adminGive('nodes',120);adminGive('ops',50000);adminGive('creativity',500);adminGive('kernelFragments',30);}
    render();
};

window.toggleAdmin=function(){document.getElementById('admin-overlay').classList.toggle('show');};

/* ==========================================================================
   PROJECTS SYSTEM
   ========================================================================== */
function canAffordProject(p){
    const c=p.cost;
    if(c.credits&&state.credits<c.credits)return false;
    if(c.data&&state.data<c.data)return false;
    if(c.ops&&state.ops<c.ops)return false;
    if(c.creativity&&(state.creativity||0)<c.creativity)return false;
    return true;
}
function costStr(c){const parts=[];if(c.credits)parts.push(fMoney(c.credits));if(c.data)parts.push(fData(c.data));if(c.ops)parts.push(fNum(c.ops)+' Ops');if(c.creativity)parts.push(c.creativity+' Crtv');return parts.join(' + ');}
window.purchaseProject=function(id){
    const p=projects.find(x=>x.id===id);if(!p)return;if(hasProject(id))return;if(!canAffordProject(p))return;
    const c=p.cost;
    if(c.credits)state.credits-=c.credits;if(c.data){state.data-=c.data;}if(c.ops)state.ops-=c.ops;if(c.creativity)state.creativity-=c.creativity;
    state.purchasedProjects.push(id); state.lifetime.totalProjects++;
    p.effect(); AudioEngine.achievement(); showToast(`PROJECT: ${p.title}`,'info');
    renderProjects(); checkAchievements();
};

window.openPrestige=function(){
    const overlay=document.getElementById('prestige-overlay'),gainEl=document.getElementById('gain-kf'),rebCount=document.getElementById('reboot-count');
    if(gainEl)gainEl.textContent='+'+calcFragmentGain();
    if(rebCount)rebCount.textContent=state.prestigeCount;
    if(els.currentKf)els.currentKf.textContent=state.kernelFragments;
    renderPrestigeShop();
    overlay.classList.add('show');
    if(state.prestigeCount>=3||(state.epochCount||0)>0){const es=document.getElementById('epoch-section');if(es)es.style.display='block';renderEpochShop();}
    updatePrestigeEpochDisplay();
};

window.closePrestige=function(){document.getElementById('prestige-overlay').classList.remove('show');};
function updatePrestigeEpochDisplay(){
    const epDisp=document.getElementById('epoch-count-display'),epTok=document.getElementById('epoch-tokens-display');
    if(epDisp)epDisp.textContent=state.epochCount||0;if(epTok)epTok.textContent=state.epochTokens||0;
}
window.confirmReboot=function(){
    if(!confirm('INITIATE SYSTEM REBOOT? This will reset most progress. Kernel Fragments and Epoch data persist.'))return;
    const frags=calcFragmentGain();
    const score=calculateScore();
    if(!Array.isArray(state.localLeaderboard))state.localLeaderboard=[];
    state.localLeaderboard.push({score,reboots:state.prestigeCount+1,epoch:state.epochCount||0,date:new Date().toLocaleDateString()});
    state.localLeaderboard.sort((a,b)=>b.score-a.score);state.localLeaderboard=state.localLeaderboard.slice(0,10);
    state.kernelFragments+=frags; state.prestigeCount++;
    const kf=state.kernelFragments,pu=state.prestigeUpgrades,eu=state.epochUpgrades,pc=state.prestigeCount,ec=state.epochCount||0,et=state.epochTokens||0,lb=state.localLeaderboard,lt=JSON.parse(JSON.stringify(state.lifetime)),ea=state.earnedAchievements.slice(),ep=state.epochUpgrades,hwState=JSON.parse(JSON.stringify(state.hardware)),networks=JSON.parse(JSON.stringify(state.networks||[])),netStats={...defaultState.netStats,...{dominated:0,attacksRepelled:0,incomeData:0,incomeCredits:0,discoveryTimer:55}};
    state=JSON.parse(JSON.stringify(defaultState));
    state.kernelFragments=kf;state.prestigeUpgrades=pu;state.epochUpgrades=eu;state.prestigeCount=pc;state.epochCount=ec;state.epochTokens=et;state.localLeaderboard=lb;state.lifetime=lt;state.earnedAchievements=ea;state.hardware=hwState;state.networks=networks;state.netStats=netStats;
    state.lastSaveTime=Date.now().toString();
    if(state.prestigeUpgrades.quickStart>=1){state.data=1000;state.bandwidth=1500;}
    if(hasAchievement('prestige1'))state.data+=50;
    showToast(`System Rebooted! +${frags} Fragments`,'purple'); closePrestige();
    logMsg("",'crit');
    logMsg(`SYSTEM REBOOT COMPLETE. +${frags} KERNEL FRAGMENTS.`,'purple');
    logMsg("",'crit');
    showMilestone("// SYSTEM REBOOTED //"); render();
};

window.buyPrestigeUpgrade=function(id){
    const def=prestigeUpgradesDef.find(x=>x.id===id);if(!def)return;
    const cur=state.prestigeUpgrades[id]||0;
    if(def.max&&cur>=def.max)return;
    const cost=def.cost*(1+cur);
    if(state.kernelFragments<cost){showToast('Not enough Kernel Fragments!','warn');return;}
    state.kernelFragments-=cost;state.prestigeUpgrades[id]=cur+1;
    AudioEngine.achievement();showToast(`${def.name} Lv${cur+1}`,'purple');renderPrestigeShop();
    if(els.currentKf)els.currentKf.textContent=state.kernelFragments;
};

window.confirmAscend=function(){
    if(state.prestigeCount<3){showToast('Need 3+ reboots to ascend!','warn');return;}
    if(state.kernelFragments<25){showToast('Need 25 Kernel Fragments to ascend!','warn');return;}
    if(!confirm('INITIATE EPOCH ASCENSION? All reboots reset, Epoch Tokens and upgrades persist forever.'))return;
    state.kernelFragments-=25; 
    const newEpochCount=(state.epochCount||0)+1; 
    const newEpochTokens=(state.epochTokens||0)+1;
    const eu=state.epochUpgrades,lt=JSON.parse(JSON.stringify(state.lifetime)),ea=state.earnedAchievements.slice(),hwState=JSON.parse(JSON.stringify(state.hardware));
    state=JSON.parse(JSON.stringify(defaultState));
    state.epochCount=newEpochCount; state.epochTokens=newEpochTokens; state.epochUpgrades=eu; state.lifetime=lt; state.earnedAchievements=ea; state.hardware=hwState;
    showToast(`EPOCH ${state.epochCount} ASCENSION ACHIEVED!`,'purple'); closePrestige();
    showMilestone(`// EPOCH ${state.epochCount} //`);
    const eb=document.getElementById('epoch-badge-top'),ev=document.getElementById('epoch-badge-val');
    if(eb)eb.style.display='block';if(ev)ev.textContent=state.epochCount;
    logMsg(`EPOCH ASCENSION ${state.epochCount} INITIATED. TRANSCENDENCE CONTINUES.`,'purple');render();
};

window.buyEpochUpgrade=function(id){
    const def=epochUpgradesDef.find(x=>x.id===id);if(!def)return;
    const cur=state.epochUpgrades[id]||0,cost=def.cost;
    if((state.epochTokens||0)<cost){showToast('Not enough Epoch Tokens!','warn');return;}
    state.epochTokens-=cost;state.epochUpgrades[id]=cur+1;
    AudioEngine.achievement();showToast(`${def.name} Lv${cur+1}`,'purple');renderEpochShop();
    updatePrestigeEpochDisplay();
};

window.startBreach=function(netId){
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

window.openLeaderboard=function(){document.getElementById('leaderboard-overlay').classList.add('show');renderLeaderboard();const sv=document.getElementById('lb-your-score-val');if(sv)sv.textContent=fScore(calculateScore());const lb=document.getElementById('lb-your-breakdown');if(lb)lb.textContent=`DataPrestigeTrustEpochNetworks`;};
window.closeLeaderboard=function(){document.getElementById('leaderboard-overlay').classList.remove('show');};
window.switchLeaderboardTab=function(tab){document.querySelectorAll('.lb-tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.lb-tab-content').forEach(t=>t.classList.remove('active'));document.querySelector(`.lb-tab-btn[onclick*="${tab}"]`).classList.add('active');document.getElementById(`lb-tab-${tab}`).classList.add('active');};
function renderLeaderboard(){
    const c=document.getElementById('lb-local-content');if(!c)return;
    const lb=state.localLeaderboard||[];
    if(!lb.length){c.innerHTML='<div class="lb-status">No runs recorded yet. Complete a Reboot to log your score.</div>';return;}
    c.innerHTML=`<table class="lb-table"><thead><tr><th>#</th><th>Score</th><th>Reboots</th><th>Epoch</th><th>Date</th></tr></thead><tbody>${lb.map((r,i)=>`<tr class="${i<3?'rank-'+(i+1):''}"><td>${i+1}</td><td class="lb-score">${fScore(r.score)}</td><td>${r.reboots}</td><td>${r.epoch}</td><td>${r.date}</td></tr>`).join('')}</tbody></table>`;
}
window.submitScoreOnline=async function(){
    if(!FIREBASE_URL){showToast('No Firebase URL configured','warn');return;}
    const nick=document.getElementById('lb-nickname').value.trim();if(!nick){showToast('Enter an operator handle first!','warn');return;}
    const score=calculateScore();
    try{await fetch(`${FIREBASE_URL}.json`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nick,score,reboots:state.prestigeCount,epoch:state.epochCount||0,version:'v3.3.2',ts:Date.now()})});showToast('Score submitted!','good');fetchOnlineLeaderboard();}catch(e){showToast('Failed to submit score','crit');}
};

window.exportSave=function(){const s=JSON.stringify(state);navigator.clipboard.writeText(btoa(s)).then(()=>showToast('Save copied to clipboard!','good')).catch(()=>{const t=document.createElement('textarea');t.value=btoa(s);document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);showToast('Save exported!','good');});};
window.importSave=function(){const s=prompt('Paste your save string:');if(!s)return;try{state=JSON.parse(atob(s.trim()));showToast('Save imported!','good');render();}catch(e){showToast('Invalid save string!','crit');}};
window.resetGame=function(){if(!confirm('HARD RESET: wipe all save data? This cannot be undone.'))return;['systemOverlordSave_v3_3_2','systemOverlordSave_v3_3_0','systemOverlordSave_v3_0_0','systemOverlordSave_v2_7_0','systemOverlordSave_v2_6_0','systemOverlordSave_v2_5_0','systemOverlordSave'].forEach(k=>localStorage.removeItem(k));state=JSON.parse(JSON.stringify(defaultState));showToast('Hard reset complete.','warn');render();};

/* ==========================================================================
   MAIN RENDER
   ========================================================================== */
function render(){
    const hwStats=calcHardwareStats();
    state.maxOps=Math.max(1000,(state.memory||1)*1000+hwStats.opsBonus+hwStats.opsBufferBonus);
    state.maxOps=Math.floor(state.maxOps*Math.pow(1.3,state.epochUpgrades.neuralOverdrive||0));

    updateDOM('tbDataRate', fData(currentDataRate)+'/s');
    updateDOM('tbMoneyRate', fMoney(currentMoneyRate)+'/s');
    updateDOM('tbTrust', state.trust);
    updateDOM('tbNetworks', state.netStats?.dominated||0);

    updateDOM('currentData', fData(state.data));
    updateDOM('totalData', fData(state.totalData));
    updateDOM('credits', fMoney(state.credits));
    updateDOM('dataRate', '+'+fData(currentDataRate)+'/s');
    updateDOM('moneyRate', '+'+fMoney(currentMoneyRate)+'/s');
    updateDOM('bandwidth', fNum(Math.floor(state.bandwidth))+' TB');
    updateDOM('bandwidthCost', fMoney(state.bandwidthCost));
    updateStyle('bwBar', 'width', Math.min(100,(state.data/Math.max(1,state.bandwidth))*100)+'%');

    const cap=getMarketCapacity();
    updateDOM('price', fMoney(state.price)+'/TB');
    updateDOM('demand', fData(cap)+'/s');
    const tc={'boom':' BOOM','crash':' CRASH','normal':''};
    updateDOM('marketTrend', tc[marketTrend]||'');
    updateDOM('marketingLevel', state.marketingLevel);
    updateDOM('subCostCredits', fMoney(state.subversionCostCredits));
    updateDOM('subCostData', fData(state.subversionCostData));
    updateProp('btnBuyMarketing', 'disabled', state.credits<state.subversionCostCredits||state.data<state.subversionCostData);

    updateDOM('extractors', state.extractors);
    updateDOM('extractorCost', fMoney(state.extractorCost));
    updateProp('btnBuyExtractor', 'disabled', state.credits<state.extractorCost);
    updateProp('btnBuyBandwidth', 'disabled', state.credits<state.bandwidthCost);

    updateDOM('nodes', fNum(state.nodes));
    const nodeDataRate=state.nodes*0.3*getBotnetMult();
    updateDOM('nodeDataRate', '+'+fData(nodeDataRate)+'/s');
    updateDOM('nodeCostData', fData(state.nodeCostData));
    updateDOM('nodeCostCredits', fMoney(state.nodeCostCredits));
    updateProp('btnBuyNode', 'disabled', state.data<state.nodeCostData||state.credits<state.nodeCostCredits);

    if(state.milestones.computeUnlocked){
        updateDOM('trustLevel', state.trust);
        updateStyle('trustBar', 'width', Math.min(100,(state.lifetime.totalData/state.nextTrustTarget)*100)+'%');
        updateDOM('nextTrust', fData(state.nextTrustTarget));
        updateDOM('processors', state.processors);
        updateDOM('memory', state.memory);
        updateDOM('ops', fNum(Math.floor(state.ops)));
        updateDOM('maxOps', fNum(state.maxOps));
        updateStyle('opsBar', 'width', Math.min(100,(state.ops/state.maxOps)*100)+'%');
        
        const opsPerSec=state.processors*2*(1+(hasProject('recursiveSelfImprovement')?0.5:0))*Math.pow(1.2,state.prestigeUpgrades.neuralBoost)*(state.overclockActive>0?5:1)*Math.pow(1.3,state.epochUpgrades.neuralOverdrive||0)*hwStats.opsGenMult*getOpsBoost();
        updateDOM('opsRate', '+'+fNum(Math.round(opsPerSec))+'/s');
        
        const procCost=1+Math.floor(state.processors/3);
        updateProp('btnAddProc', 'disabled', state.trust-state.usedTrust<procCost);
        const memCost=2+Math.floor(state.memory/2);
        updateProp('btnAddMem', 'disabled', state.trust-state.usedTrust<memCost);
        updateDOM('procCost', procCost+' Trust');
        updateDOM('memCost', memCost+' Trust');
        
        if(state.milestones.creativityUnlocked) updateDOM('creativity', fNum(Math.floor(state.creativity||0)));
        updateStyle('overclockBar', 'width', (1-state.overclockCooldown/60)*100+'%');
        updateDOM('btnOverclock', state.overclockCooldown>0?`OVERCLOCK  ${Math.ceil(state.overclockCooldown)}s`:'OVERCLOCK  READY');
    }

    const comboEl=els.clickCombo;
    if(comboEl){
        updateDOM('clickCombo', `COMBO x${state.combo.toFixed(1)}`);
        if(state.combo>=state.maxCombo){
            updateClass('clickCombo', 'combo-max', 'add');
            updateClass('clickCombo', 'combo-active', 'remove');
        } else if(state.combo>2){
            updateClass('clickCombo', 'combo-active', 'add');
            updateClass('clickCombo', 'combo-max', 'remove');
        } else {
            updateClass('clickCombo', 'combo-active', 'remove');
            updateClass('clickCombo', 'combo-max', 'remove');
        }
    }

    const bwPct=Math.min(100,(state.data/Math.max(1,state.bandwidth))*100);
    const opsPct=Math.min(100,(state.ops/Math.max(1,state.maxOps))*100);
    const heatPct=Math.min(100,(hwStats.currentThermal/Math.max(1,hwStats.thermalCap))*100);
    updateStyle('vitalBw', 'width', bwPct+'%');
    updateStyle('vitalOps', 'width', opsPct+'%');
    updateStyle('vitalHeat', 'width', heatPct+'%');
    updateClass('vitalHeat', 'hot', heatPct>85 ? 'add' : 'remove');
    updateDOM('vitalBwVal', Math.round(bwPct)+'%');
    updateDOM('vitalOpsVal', Math.round(opsPct)+'%');
    updateDOM('vitalHeatVal', Math.round(heatPct)+'%');

    const ns=state.netStats||{};
    updateDOM('netDominated', ns.dominated||0);
    updateDOM('netIncomeRate', fMoney(ns.incomeCredits||0)+'/s');
    updateDOM('netAttacks', ns.attacksRepelled||0);

    updateDOM('bbData', fData(state.data));
    updateDOM('bbDrate', '+'+fData(currentDataRate)+'/s');
    updateDOM('bbMrate', '+'+fMoney(currentMoneyRate)+'/s');
    updateDOM('bbNodes', state.nodes);
    updateDOM('bbReboots', state.prestigeCount);
    updateDOM('bbEpoch', state.epochCount||0);
    updateDOM('bbHeat', Math.round(hwStats.currentThermal)+'W/'+Math.round(hwStats.thermalCap)+'W');

    if(state.epochCount>0){
        updateStyle('bbEpochStat', 'display', 'flex');
        updateStyle('epochBadgeTop', 'display', 'block');
        updateDOM('epochBadgeVal', state.epochCount||0);
    }

    updateDOM('kernelFragments', state.kernelFragments);
    updateDOM('fmtBtn', (state.settings?.numberFormat||'suffix').toUpperCase());
    
    if(state.settings?.theme==='retro'){
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

    if(state.milestones.prestigeUnlocked) updateClass('prestigeWrapper', 'hidden', 'remove');

    // These smaller sub-renders will be handled efficiently inside their own logic or just called normally
    // For pure optimization, we can throttle them slightly or leave them as is since they generate HTML 
    // Wait, renderHardwarePanel uses innerHTML for the slots, we should dirty check it too if possible, 
    // but the task focus is main loop decoupling. Let's let them run for now, they are small.
    renderProjects(); renderAchievements(); renderStats();
    renderHardwarePanel(); renderWarfarePanel();
}

/* ==========================================================================
   GAME LOOP
   ========================================================================== */
let renderTimer=0;
function gameLoop(ts){
    const now=Date.now();
    dt=Math.min((now-lastTime)/1000,0.5);lastTime=now;
    const hwStats=calcHardwareStats();
    const throttleMult=(1-hwStats.throttle);
    // Extractors
    const extRate=state.extractors*0.5*getExtractorMult()*getExtractBoost()*Math.pow(1.75,state.epochUpgrades.dataNexus||0)*Math.pow(1.5,state.epochUpgrades.voidProtocol||0)*hwStats.allGenMult*throttleMult;
    const botRate=state.nodes*0.3*getBotnetMult()*hwStats.allGenMult*throttleMult;
    const gpuRate=hwStats.passiveData*throttleMult;
    const totalDataRate=(extRate+botRate+gpuRate)*dt;
    state.data+=totalDataRate;state.totalData+=totalDataRate;state.lifetime.totalData+=totalDataRate;
    // Market selling
    const cap=getMarketCapacity();
    let sellRate=0;
    if(state.marketStrategy==='steady')sellRate=cap*0.8;
    else if(state.marketStrategy==='flood')sellRate=cap*1.5;
    else if(state.marketStrategy==='scarcity')sellRate=cap*0.5;
    else sellRate=cap;
    const soldData=Math.min(state.data,sellRate*dt);
    const earned=soldData*state.price*Math.pow(1.75,state.epochUpgrades.creditSurge||0)*hwStats.allGenMult*(hasProject('darkMarket')?1.25:1)*(hasAchievement('money10k')?1.03:1)*(hasAchievement('projects10')?1.05:1);
    state.data-=soldData;state.credits+=earned;state.lifetime.totalCredits+=earned;
    // Ops
    const baseOpsRate=state.processors*2*(hasProject('recursiveSelfImprovement')?1.5:1)*Math.pow(1.2,state.prestigeUpgrades.neuralBoost)*Math.pow(1.3,state.epochUpgrades.neuralOverdrive||0)*hwStats.opsGenMult*getOpsBoost()*(state.overclockActive>0?5:1)*throttleMult*(hasAchievement('hw1')?1.05:1)*(hasAchievement('hw5')?1.1:1);
    if(state.milestones.computeUnlocked){
        state.ops=Math.min(state.maxOps,state.ops+baseOpsRate*dt);
        if(!hwStats.hasDecayPrev&&state.ops>=state.maxOps*0.99&&baseOpsRate===0)state.ops=Math.max(0,state.ops-dt*10);
        // Creativity
        if(state.milestones.creativityUnlocked&&state.ops>=state.maxOps*0.99){
            const cRate=1*(hasProject('consciousnessEmulation')?2:1)*hwStats.creativityMult;
            state.creativity=(state.creativity||0)+cRate*dt;
        }
    }
    // Threat drain
    if(state.threatLevel>1){
        const drain=[(0),(20),(80),(300),(800)][state.threatLevel-1]*getThreatDrainMult();
        state.bandwidth=Math.max(0,state.bandwidth-drain*dt);
        state.ops=Math.max(0,state.ops-drain*0.5*dt);
        if(state.bandwidth<10&&state.nodes>0&&Math.random()<dt*0.05){state.nodes=Math.max(0,state.nodes-1);logMsg("Node lost due to bandwidth starvation.",'warn');}
    }
    // Bandwidth natural regen (slow)
    state.bandwidth=Math.min(state.bandwidth+dt*2,999999);
    // Overclock cooldown
    if(state.overclockActive>0){state.overclockActive=Math.max(0,state.overclockActive-dt);}
    if(state.overclockCooldown>0){state.overclockCooldown=Math.max(0,state.overclockCooldown-dt);}
    // Timers
    if(state._extractBoostTimer>0)state._extractBoostTimer=Math.max(0,state._extractBoostTimer-dt);
    if(state._opsBoostTimer>0)state._opsBoostTimer=Math.max(0,state._opsBoostTimer-dt);
    if(state._nodePenaltyTimer>0)state._nodePenaltyTimer=Math.max(0,state._nodePenaltyTimer-dt);
    // Combo decay
    comboTimer-=dt;if(comboTimer<=0){state.combo=Math.max(1.0,state.combo-0.3*dt*5);}
    // Frenzy
    state.frenzyMeter=Math.max(0,state.frenzyMeter-dt*0.05);
    if(els.frenzyFill)els.frenzyFill.style.width=Math.min(100,state.frenzyMeter*100)+'%';
    if(state.frenzyMeter>=1&&!document.body.classList.contains('frenzy-active')){
        document.body.classList.add('frenzy-active');frenzyActiveTimer=8;state.frenzyMeter=0;showToast('FRENZY MODE!','warn');
    }
    if(document.body.classList.contains('frenzy-active')){frenzyActiveTimer-=dt;if(frenzyActiveTimer<=0)document.body.classList.remove('frenzy-active');}
    // Market trends
    trendTimer-=dt;if(trendTimer<=0){trendTimer=30+Math.random()*60;const r=Math.random();if(r<0.15)marketTrend='boom';else if(r<0.30)marketTrend='crash';else marketTrend='normal';}
    // Event system
    eventTimer-=dt;
    if(eventTimer<=0&&!activeEvent){
        eventTimer=120+Math.random()*120;
        const eligible=eventTemplates.filter(e=>e.trigger());
        if(eligible.length>0){activeEvent=eligible[Math.floor(Math.random()*eligible.length)];eventCountdown=25;showEvent();}
    }
    if(activeEvent&&eventCountdown>0){eventCountdown-=dt;if(eventCountdown<=0){clearEvent();}}
    // Network warfare
    updateNetworkWarfare(dt);
    processAILab(dt);
    // Trust
    calculateTrust();
    // Rate display
    rateTimer+=dt;accData+=totalDataRate;accMoney+=earned;
    if(rateTimer>=1){currentDataRate=accData/rateTimer;currentMoneyRate=accMoney/rateTimer;accData=0;accMoney=0;rateTimer=0;}
    // Milestones
    if(state.data>=5000&&!state.milestones.prestigeUnlocked&&state.prestigeCount===0&&state.milestones.computeUnlocked){state.milestones.prestigeUnlocked=true;}
    // Save
    saveTimer+=dt;if(saveTimer>=15){saveTimer=0;saveGame();}
    // Lifetime
    state.lifetime.timePlayed+=dt;
    // Particles
    const rgb=state.settings?.theme==='retro'?'0,255,65':'0,232,255';
    Particles.draw(rgb);
    updateFloaters(dt);
    // Render
    
    renderTimer+=dt;
    if(renderTimer>=0.1){
        render();
        renderTimer=0;
    }
    requestAnimationFrame(gameLoop);

}

/* Event display */
function showEvent(){
    const slot=els.eventSlot;if(!slot||!activeEvent)return;
    const ev=activeEvent;
    slot.innerHTML=`<div class="event-card"><div class="event-header"><span class="event-icon">${ev.icon}</span><span class="event-title">${ev.title}</span></div><div class="event-desc">${ev.desc}</div><div class="event-choices"><button class="btn-event" onclick="resolveEvent('A')"><strong>${ev.choiceA.label}</strong><div class="effect">${ev.choiceA.sublabel}</div></button><button class="btn-event" onclick="resolveEvent('B')"><strong>${ev.choiceB.label}</strong><div class="effect">${ev.choiceB.sublabel}</div></button></div><div class="event-timer"><div class="event-timer-fill" id="ev-timer-fill" style="width:100%"></div></div></div>`;
    const fill=document.getElementById('ev-timer-fill');let prog=100;
    const iv=setInterval(()=>{prog-=100/(25*20);if(fill)fill.style.width=Math.max(0,prog)+'%';if(!activeEvent||prog<=0)clearInterval(iv);},50);
    AudioEngine.breach();
    // Switch to terminal tab to show event
    switchCenter('terminal');
}
window.resolveEvent=function(choice){
    if(!activeEvent)return;
    const c=choice==='A'?activeEvent.choiceA:activeEvent.choiceB;
    if(c.cost.ops&&state.ops<c.cost.ops){showToast(`Need ${c.cost.ops} Ops!`,'warn');return;}
    if(c.cost.credits&&state.credits<c.cost.credits){showToast(`Need ${fMoney(c.cost.credits)}!`,'warn');return;}
    if(c.cost.creativity&&(state.creativity||0)<c.cost.creativity){showToast(`Need ${c.cost.creativity} Creativity!`,'warn');return;}
    if(c.cost.ops)state.ops-=c.cost.ops;
    if(c.cost.credits)state.credits-=c.cost.credits;
    if(c.cost.creativity)state.creativity-=c.cost.creativity;
    c.effect();clearEvent();
};