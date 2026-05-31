
import { Store, saveGame } from './state.js';
import { render } from './ui.js';
import { getGridMultiplier } from './grid.js';
import { getForgeOpsRate } from './forge.js';
import { getDysonEnergyDelta } from './dyson.js';

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
    const totalDataRate=(extRate+botRate)*Store.dt*getGridMultiplier();
    Store.state.data+=totalDataRate;Store.state.totalData+=totalDataRate;
    Store.state.ops += getForgeOpsRate() * Store.dt;
    Store.state.dyson.stellarEnergy += getDysonEnergyDelta() * Store.dt;
    
    // Throttled Render Loop
    Store.renderTimer+=Store.dt;
    if(Store.renderTimer>=0.1){
        render();
        Store.renderTimer=0;
    }
    requestAnimationFrame(gameLoop);
}
