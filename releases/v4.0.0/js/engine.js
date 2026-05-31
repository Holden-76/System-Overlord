
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
let saveTimer = 0;
let renderTimer = 0;
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

export function gameLoop(ts){
    const now=Date.now();
    dt=Math.min((now-lastTime)/1000,0.5);lastTime=now;
    const hwStats=calcHardwareStats();
    const throttleMult=(1-hwStats.throttle);
    // Extractors
    const extRate=Store.state.extractors*0.5*getExtractorMult()*getExtractBoost()*Math.pow(1.75,Store.state.epochUpgrades.dataNexus||0)*Math.pow(1.5,Store.state.epochUpgrades.voidProtocol||0)*hwStats.allGenMult*throttleMult;
    const botRate=Store.state.nodes*0.3*getBotnetMult()*hwStats.allGenMult*throttleMult;
    const gpuRate=hwStats.passiveData*throttleMult;
    let totalDataRate=(extRate+botRate+gpuRate)*dt;
    totalDataRate *= getGridMultiplier(); Store.state.data+=totalDataRate;Store.state.totalData+=totalDataRate;Store.state.lifetime.totalData+=totalDataRate;
    Store.state.ops += getForgeOpsRate() * dt;
    if(Store.state.dyson) Store.state.dyson.stellarEnergy += getDysonEnergyDelta() * dt;
    // Market selling
    const cap=getMarketCapacity();
    let sellRate=0;
    if(Store.state.marketStrategy==='steady')sellRate=cap*0.8;
    else if(Store.state.marketStrategy==='flood')sellRate=cap*1.5;
    else if(Store.state.marketStrategy==='scarcity')sellRate=cap*0.5;
    else sellRate=cap;
    const soldData=Math.min(Store.state.data,sellRate*dt);
    const earned=soldData*Store.state.price*Math.pow(1.75,Store.state.epochUpgrades.creditSurge||0)*hwStats.allGenMult*(hasProject('darkMarket')?1.25:1)*(hasAchievement('money10k')?1.03:1)*(hasAchievement('projects10')?1.05:1);
    Store.state.data-=soldData;Store.state.credits+=earned;Store.state.lifetime.totalCredits+=earned;
    // Ops
    const baseOpsRate=Store.state.processors*2*(hasProject('recursiveSelfImprovement')?1.5:1)*Math.pow(1.2,Store.state.prestigeUpgrades.neuralBoost)*Math.pow(1.3,Store.state.epochUpgrades.neuralOverdrive||0)*hwStats.opsGenMult*getOpsBoost()*(Store.state.overclockActive>0?5:1)*throttleMult*(hasAchievement('hw1')?1.05:1)*(hasAchievement('hw5')?1.1:1);
    if(Store.state.milestones.computeUnlocked){
        Store.state.ops=Math.min(Store.state.maxOps,Store.state.ops+baseOpsRate*dt);
        if(!hwStats.hasDecayPrev&&Store.state.ops>=Store.state.maxOps*0.99&&baseOpsRate===0)Store.state.ops=Math.max(0,Store.state.ops-dt*10);
        // Creativity
        if(Store.state.milestones.creativityUnlocked&&Store.state.ops>=Store.state.maxOps*0.99){
            const cRate=1*(hasProject('consciousnessEmulation')?2:1)*hwStats.creativityMult;
            Store.state.creativity=(Store.state.creativity||0)+cRate*dt;
        }
    }
    // Threat drain
    if(Store.state.threatLevel>1){
        const drain=[(0),(20),(80),(300),(800)][Store.state.threatLevel-1]*getThreatDrainMult();
        Store.state.bandwidth=Math.max(0,Store.state.bandwidth-drain*dt);
        Store.state.ops=Math.max(0,Store.state.ops-drain*0.5*dt);
        if(Store.state.bandwidth<10&&Store.state.nodes>0&&Math.random()<dt*0.05){Store.state.nodes=Math.max(0,Store.state.nodes-1);logMsg("Node lost due to bandwidth starvation.",'warn');}
    }
    // Bandwidth natural regen (slow)
    Store.state.bandwidth=Math.min(Store.state.bandwidth+dt*2,999999);
    // Overclock cooldown
    if(Store.state.overclockActive>0){Store.state.overclockActive=Math.max(0,Store.state.overclockActive-dt);}
    if(Store.state.overclockCooldown>0){Store.state.overclockCooldown=Math.max(0,Store.state.overclockCooldown-dt);}
    // Timers
    if(Store.state._extractBoostTimer>0)Store.state._extractBoostTimer=Math.max(0,Store.state._extractBoostTimer-dt);
    if(Store.state._opsBoostTimer>0)Store.state._opsBoostTimer=Math.max(0,Store.state._opsBoostTimer-dt);
    if(Store.state._nodePenaltyTimer>0)Store.state._nodePenaltyTimer=Math.max(0,Store.state._nodePenaltyTimer-dt);
    // Combo decay
    comboTimer-=dt;if(comboTimer<=0){Store.state.combo=Math.max(1.0,Store.state.combo-0.3*dt*5);}
    // Frenzy
    Store.state.frenzyMeter=Math.max(0,Store.state.frenzyMeter-dt*0.05);
    if(els.frenzyFill)els.frenzyFill.style.width=Math.min(100,Store.state.frenzyMeter*100)+'%';
    if(Store.state.frenzyMeter>=1&&!document.body.classList.contains('frenzy-active')){
        document.body.classList.add('frenzy-active');frenzyActiveTimer=8;Store.state.frenzyMeter=0;showToast('FRENZY MODE!','warn');
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
    if(Store.state.data>=5000&&!Store.state.milestones.prestigeUnlocked&&Store.state.prestigeCount===0&&Store.state.milestones.computeUnlocked){Store.state.milestones.prestigeUnlocked=true;}
    // Save
    saveTimer+=dt;if(saveTimer>=15){saveTimer=0;saveGame();}
    // Lifetime
    Store.state.lifetime.timePlayed+=dt;
    // Particles
    const rgb=Store.state.settings?.theme==='retro'?'0,255,65':'0,232,255';
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
