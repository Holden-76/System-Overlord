
import { Store, fNum, fBig } from './state.js';

let canvas, ctx;
let angleX = 0;
let angleY = 0;
const BASE_ENERGY_POTENTIAL = 1e12; // Base total star output
const K_CONSTANT = 0.005; // Diminishing returns curve

// Golden Ratio for Icosahedron
const phi = (1 + Math.sqrt(5)) / 2;
const a = 1.0;
const b = phi;

// The 12 vertices of an icosahedron
const RAW_VERTICES = [
    [-a,  b,  0], [ a,  b,  0], [-a, -b,  0], [ a, -b,  0],
    [ 0, -a,  b], [ 0,  a,  b], [ 0, -a, -b], [ 0,  a, -b],
    [ b,  0, -a], [ b,  0,  a], [-b,  0, -a], [-b,  0,  a]
];

// Normalize so radius is roughly 1
const len = Math.sqrt(a*a + b*b);
const VERTICES = RAW_VERTICES.map(v => [v[0]/len, v[1]/len, v[2]/len]);

// Precalculate edges (distance logic: exact edge distance is approx 1.05 for normalized icosahedron)
const EDGES = [];
for(let i=0; i<VERTICES.length; i++) {
    for(let j=i+1; j<VERTICES.length; j++) {
        const dx = VERTICES[i][0] - VERTICES[j][0];
        const dy = VERTICES[i][1] - VERTICES[j][1];
        const dz = VERTICES[i][2] - VERTICES[j][2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if(Math.abs(dist - 1.05146) < 0.01) {
            EDGES.push([i, j]);
        }
    }
}

export function initDyson() {
    if(!Store.state.dyson) {
        Store.state.dyson = { satellites: 0, stellarEnergy: 0, cost: 1e9 };
    }
    
    canvas = document.getElementById('dyson-canvas');
    if(!canvas) return;
    ctx = canvas.getContext('2d', { alpha: false });
    
    window.addEventListener('resize', resize);
    resize();
    
    window.buySatellite = function() {
        const cost = Store.state.dyson.cost;
        if(Store.state.ops >= cost) {
            Store.state.ops -= cost;
            Store.state.dyson.satellites++;
            Store.state.dyson.cost *= 1.15; // Price scales 15%
            updateDysonUI();
        }
    };

    // Tie render loop directly into the requestAnimationFrame from main via a local loop
    // so we don't pollute engine.js with canvas logic
    function renderLoop() {
        if(document.getElementById('ct-singularity').style.display !== 'none') {
            renderDyson();
        }
        requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
}

function resize() {
    if(canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
}

export function updateDysonUI() {
    if(!canvas) return;
    const sats = Store.state.dyson.satellites;
    document.getElementById('dyson-satellites').textContent = fNum(sats);
    document.getElementById('dyson-sat-cost').textContent = fNum(Store.state.dyson.cost) + ' OPS';
    
    const efficiency = getCaptureEfficiency() * 100;
    document.getElementById('dyson-capture-rate').textContent = efficiency.toFixed(4) + '%';
    
    document.getElementById('dyson-energy-val').textContent = fBig(Math.floor(Store.state.dyson.stellarEnergy));
}

// Exponential Diminishing Returns: 1 - e^(-kx)
function getCaptureEfficiency() {
    const x = Store.state.dyson.satellites;
    return 1 - Math.exp(-K_CONSTANT * x);
}

export function getDysonEnergyDelta() {
    if(!Store.state.dyson) return 0;
    return BASE_ENERGY_POTENTIAL * getCaptureEfficiency();
}

function renderDyson() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#010101';
    ctx.fillRect(0, 0, w, h);
    
    // Draw star glow at center
    const cx = w/2, cy = h/2;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
    gradient.addColorStop(0, 'rgba(255, 204, 0, 0.2)');
    gradient.addColorStop(0.5, 'rgba(255, 102, 0, 0.05)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Star core
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI*2);
    ctx.fillStyle = '#ffcc00';
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 50;
    ctx.fill();
    ctx.shadowBlur = 0; // reset
    
    // 3D Math Setup
    angleY += 0.005;
    angleX += 0.003;
    
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    
    const projected = [];
    const scale = Math.min(w, h) * 0.35; // Sphere size
    const zOff = 3.5; // Camera Z
    const fov = 800; // FOV scalar
    
    for(let i=0; i<VERTICES.length; i++) {
        const v = VERTICES[i];
        
        // Rotate Y
        const x1 = v[0]*cosY - v[2]*sinY;
        const z1 = v[0]*sinY + v[2]*cosY;
        const y1 = v[1];
        
        // Rotate X
        const x2 = x1;
        const y2 = y1*cosX - z1*sinX;
        const z2 = y1*sinX + z1*cosX;
        
        // Project to 2D
        const z = z2 + zOff;
        const px = cx + (x2 / z) * fov * scale;
        const py = cy + (y2 / z) * fov * scale;
        
        projected.push({ x: px, y: py, z: z2 });
    }
    
    // Draw Wireframe Edges
    ctx.lineWidth = 1;
    for(let i=0; i<EDGES.length; i++) {
        const p1 = projected[EDGES[i][0]];
        const p2 = projected[EDGES[i][1]];
        
        // Simple depth fading
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.05, 0.4 - (avgZ * 0.3)); 
        
        ctx.strokeStyle = `rgba(0, 232, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }
    
    // Draw Satellites (Dots on vertices for performance, scaling up with count)
    const sats = Store.state.dyson.satellites;
    if(sats > 0) {
        const nodesToLight = Math.min(12, Math.ceil(sats / 10));
        ctx.fillStyle = '#00e8ff';
        for(let i=0; i<nodesToLight; i++) {
            const p = projected[i];
            if(p.z > 0) continue; // cull backface roughly
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2 + Math.log10(sats)*0.5, 0, Math.PI*2);
            ctx.fill();
        }
    }
    
    // Update UI every few frames
    if(Math.random() < 0.1) updateDysonUI();
}
