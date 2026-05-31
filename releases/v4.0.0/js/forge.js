
import { Store, fNum } from './state.js';

const WIDTH = 15;
const HEIGHT = 15;
const CORE_IDX = Math.floor(HEIGHT/2) * WIDTH + Math.floor(WIDTH/2); // 112

const COSTS = {
    'bus': 10,
    'alu': 100,
    'cool': 50
};

export function initForge() {
    // Ensure core is set
    if(Store.state.forge.grid[CORE_IDX] !== 'core') {
        Store.state.forge.grid[CORE_IDX] = 'core';
    }
    
    const container = document.getElementById('forge-grid');
    if(!container) return;
    container.innerHTML = '';
    
    for(let i=0; i<225; i++) {
        const cell = document.createElement('div');
        cell.className = 'forge-cell';
        cell.id = 'fcell-' + i;
        cell.onclick = () => handleCellClick(i);
        container.appendChild(cell);
    }
    
    // Expose window functions for UI
    window.toggleForgeDrawer = function(id) {
        document.getElementById(id).classList.toggle('open');
    };
    
    window.selectForgeTool = function(tool) {
        Store.state.forge.tool = tool;
        document.querySelectorAll('.forge-tool-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('tool-btn-' + tool).classList.add('active');
    };
    
    updateForgeLogic();
}

function handleCellClick(idx) {
    if(idx === CORE_IDX) return; // Cannot modify core
    const tool = Store.state.forge.tool;
    const current = Store.state.forge.grid[idx];
    
    if(tool === 'demolish') {
        if(current !== 'empty') {
            Store.state.ops += Math.floor(COSTS[current] * 0.5); // 50% refund
            Store.state.forge.grid[idx] = 'empty';
        }
    } else {
        if(current === tool) return; // Already this tool
        if(Store.state.ops < COSTS[tool]) {
            console.log("Not enough Ops to build " + tool);
            return;
        }
        
        // If replacing existing, refund 50%
        if(current !== 'empty') {
            Store.state.ops += Math.floor(COSTS[current] * 0.5);
        }
        
        Store.state.ops -= COSTS[tool];
        Store.state.forge.grid[idx] = tool;
    }
    
    updateForgeLogic();
}

function updateForgeLogic() {
    const grid = Store.state.forge.grid;
    const activeCells = new Set();
    const q = [CORE_IDX];
    activeCells.add(CORE_IDX);
    
    // BFS to find connected components
    // Only buses and core propagate the signal. ALUs activate if adjacent to powered bus/core.
    let head = 0;
    while(head < q.length) {
        const curr = q[head++];
        const x = curr % WIDTH;
        const y = Math.floor(curr / WIDTH);
        
        const neighbors = [];
        if(x > 0) neighbors.push(curr - 1);
        if(x < WIDTH - 1) neighbors.push(curr + 1);
        if(y > 0) neighbors.push(curr - WIDTH);
        if(y < HEIGHT - 1) neighbors.push(curr + WIDTH);
        
        for(const n of neighbors) {
            if(!activeCells.has(n)) {
                const type = grid[n];
                if(type === 'bus') {
                    activeCells.add(n);
                    q.push(n);
                } else if(type === 'alu' || type === 'cool') {
                    activeCells.add(n);
                }
            }
        }
    }
    
    // Calculate thermal dynamics
    let heat = 0;
    let cooling = 0;
    let aluCount = 0;
    
    for(let i=0; i<225; i++) {
        const type = grid[i];
        const isActive = activeCells.has(i);
        
        // Update DOM classes
        const el = document.getElementById('fcell-'+i);
        if(el) {
            el.className = 'forge-cell ' + type + (isActive ? ' active' : '');
        }
        
        if(isActive) {
            if(type === 'alu') {
                heat += 15; // 15W per ALU
                aluCount++;
            } else if(type === 'cool') {
                cooling += 40; // 40W dissipation per Coolant
            }
        }
    }
    
    // Efficiency calculation
    let efficiency = 1.0;
    if(heat > cooling) {
        const excess = heat - cooling;
        efficiency = Math.max(0.1, 1.0 - (excess * 0.01)); // -1% per excess Watt, min 10%
    }
    
    const baseOps = aluCount * 10; // 10 Ops/s per active ALU
    const finalOps = baseOps * efficiency;
    
    // Store in a local exportable state
    Store.state.forge.heat = heat;
    Store.state.forge.cooling = cooling;
    Store.state.forge.efficiency = efficiency;
    Store.state.forge.output = finalOps;
    
    updateForgeUI();
}

export function updateForgeUI() {
    if(document.getElementById('ct-forge').style.display === 'none') return;
    
    const s = Store.state.forge;
    const effStr = Math.round((s.efficiency||1) * 100) + '%';
    
    const elOut = document.getElementById('forge-output-val');
    if(elOut) elOut.textContent = fNum(s.output||0) + ' Ops/s';
    
    const elHeat = document.getElementById('forge-heat-val');
    if(elHeat) elHeat.textContent = (s.heat||0) + ' W';
    
    const elCool = document.getElementById('forge-cool-val');
    if(elCool) elCool.textContent = (s.cooling||0) + ' W';
    
    const elEff = document.getElementById('forge-eff-val');
    if(elEff) {
        elEff.textContent = effStr;
        elEff.style.color = (s.efficiency||1) < 1.0 ? 'var(--warn)' : 'var(--green)';
    }
}

export function getForgeOpsRate() {
    return Store.state.forge.output || 0;
}
