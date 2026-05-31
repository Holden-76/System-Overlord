
import { Store } from './state.js';

let canvas, ctx;
let offsetX = 0, offsetY = 0;
let isDragging = false, lastX = 0, lastY = 0;
const HEX_SIZE = 45;

// Mulberry32 deterministic seeded RNG
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function initGrid() {
    canvas = document.getElementById('grid-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    function resize() {
        if(canvas.parentElement && canvas.parentElement.style.display !== 'none') {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
            renderGrid();
        }
    }
    window.addEventListener('resize', resize);
    // Initial size might be 0 if hidden, so we'll rely on renderGrid to set it if needed
    
    canvas.addEventListener('mousedown', e => {
        if(e.button !== 0) return;
        isDragging = true;
        lastX = e.clientX; lastY = e.clientY;
        document.getElementById('grid-context-menu').style.display = 'none';
    });
    
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        offsetX += e.clientX - lastX;
        offsetY += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        renderGrid();
    });
    
    window.addEventListener('mouseup', () => isDragging = false);
    
    canvas.addEventListener('click', e => {
        if(Math.abs(e.clientX - lastX) > 5 || Math.abs(e.clientY - lastY) > 5) return; // panning
        
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left - canvas.width/2 - offsetX;
        const my = e.clientY - rect.top - canvas.height/2 - offsetY;
        
        // Pixel to axial (flat topped hex)
        const q = (Math.sqrt(3)/3 * mx - 1/3 * my) / HEX_SIZE;
        const r = (2/3 * my) / HEX_SIZE;
        const hq = Math.round(q);
        const hr = Math.round(r);
        const hs = Math.round(-q-r);
        
        let rq = hq, rr = hr, rs = hs;
        const qDiff = Math.abs(rq - q);
        const rDiff = Math.abs(rr - r);
        const sDiff = Math.abs(rs - (-q-r));
        if(qDiff > rDiff && qDiff > sDiff) rq = -rr-rs;
        else if(rDiff > sDiff) rr = -rq-rs;
        
        handleHexClick(rq, rr, e.clientX - rect.left, e.clientY - rect.top);
    });

    // Expose window hooks for context menu
    window.scanHex = function(q, r) {
        if(Store.state.ops < 500) {
            console.log("Not enough Ops.");
            return; 
        }
        Store.state.ops -= 500;
        
        const seed = Store.state.darknet.seed + q * 374761393 + r * 668265263;
        const rng = mulberry32(seed);
        const rand = rng();
        let type = 'empty';
        if(rand < 0.15) type = 'hostile';
        else if(rand < 0.35) type = 'controlled';
        
        Store.state.darknet.hexes[`${q},${r}`] = { type };
        document.getElementById('grid-context-menu').style.display = 'none';
        renderGrid();
    };

    window.attackHex = function(q, r) {
        if(Store.state.ops < 2000) return;
        Store.state.ops -= 2000;
        Store.state.darknet.hexes[`${q},${r}`].type = 'controlled';
        document.getElementById('grid-context-menu').style.display = 'none';
        renderGrid();
    };
    
    // Auto-discover center hex
    if(!Store.state.darknet.hexes['0,0']) {
        Store.state.darknet.hexes['0,0'] = { type: 'controlled' };
    }
}

function handleHexClick(q, r, cx, cy) {
    const key = `${q},${r}`;
    const darknet = Store.state.darknet;
    if(!darknet.hexes[key]) {
        showContextMenu(q, r, cx, cy, 'unscanned');
    } else {
        showContextMenu(q, r, cx, cy, darknet.hexes[key].type);
    }
}

function showContextMenu(q, r, cx, cy, type) {
    const menu = document.getElementById('grid-context-menu');
    menu.style.display = 'block';
    menu.style.left = cx + 'px';
    menu.style.top = cy + 'px';
    
    let html = `<div style="font-size:10px;color:var(--text-dim);margin-bottom:8px;font-family:var(--font-mono)">SECTOR [${q}, ${r}]</div>`;
    
    if(type === 'unscanned') {
        html += `<button class="context-btn" onclick="scanHex(${q},${r})">DECRYPT (500 OPS)</button>`;
    } else if(type === 'hostile') {
        html += `<div style="color:var(--danger);font-size:12px;margin-bottom:6px">HOSTILE NODE</div>`;
        html += `<button class="context-btn danger" onclick="attackHex(${q},${r})">BREACH (2000 OPS)</button>`;
    } else if(type === 'empty') {
        html += `<div style="color:var(--text-dim);font-size:12px;">Void Sector</div>`;
    } else if(type === 'controlled') {
        html += `<div style="color:var(--green);font-size:12px;">Dominated Territory</div>`;
    }
    
    menu.innerHTML = html;
}

export function getGridMultiplier() {
    if(!Store.state.darknet) return 1.0;
    let controlledCount = Object.values(Store.state.darknet.hexes).filter(h => h.type === 'controlled').length;
    return 1.0 + (controlledCount * 0.05); // +5% global data per hex
}

export function renderGrid() {
    if(!canvas || canvas.parentElement.style.display === 'none') return;
    
    if(canvas.width === 0 || canvas.width !== canvas.parentElement.clientWidth) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }
    
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    
    const cx = w/2 + offsetX;
    const cy = h/2 + offsetY;
    
    const cols = Math.ceil(w / (HEX_SIZE * 1.5)) + 1;
    const rows = Math.ceil(h / (HEX_SIZE * Math.sqrt(3))) + 1;
    
    ctx.lineWidth = 1.5;
    
    for(let r = -rows; r <= rows; r++) {
        for(let q = -cols; q <= cols; q++) {
            const x = HEX_SIZE * (3/2 * q);
            const y = HEX_SIZE * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
            
            // Map pixel to axial
            const mapQ = Math.round((Math.sqrt(3)/3 * (x - offsetX) - 1/3 * (y - offsetY)) / HEX_SIZE);
            const mapR = Math.round((2/3 * (y - offsetY)) / HEX_SIZE);
            
            drawHex(cx + x, cy + y, mapQ, mapR);
        }
    }
    
    const overlay = document.getElementById('grid-multiplier-val');
    if(overlay) {
        overlay.textContent = `x${getGridMultiplier().toFixed(2)}`;
    }
}

function drawHex(x, y, q, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = 2 * Math.PI / 6 * i;
        const hx = x + HEX_SIZE * Math.cos(angle);
        const hy = y + HEX_SIZE * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    
    const key = `${q},${r}`;
    const hex = Store.state.darknet?.hexes[key];
    
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.fillStyle = 'transparent';
    
    if(hex) {
        if(hex.type === 'hostile') { 
            ctx.fillStyle = 'rgba(255,51,102,0.05)'; 
            ctx.strokeStyle = 'rgba(255,51,102,0.3)'; 
        } else if(hex.type === 'controlled') { 
            ctx.fillStyle = 'rgba(0,255,136,0.05)'; 
            ctx.strokeStyle = 'rgba(0,255,136,0.4)'; 
        } else if(hex.type === 'empty') { 
            ctx.fillStyle = 'rgba(255,255,255,0.01)'; 
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        }
    }
    
    ctx.fill();
    ctx.stroke();
    
    if(hex) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = '10px "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${q},${r}`, x, y);
    }
}
