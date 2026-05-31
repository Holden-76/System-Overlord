
import { Store, initStore, loadGame } from './state.js';
import { cacheDom } from './ui.js';
import { gameLoop } from './engine.js';
import { initGrid, renderGrid } from './grid.js';
import { initForge, updateForgeUI } from './forge.js';
import { initDyson, updateDysonUI } from './dyson.js';
import { initTerminal } from './terminal.js';

import * as Actions from './actions.js';
Object.assign(window, Actions);
window.addEventListener('DOMContentLoaded', () => {
    cacheDom();
    loadGame();
    initGrid();
    initForge();
    initDyson();
    initTerminal();
    window.bootSequence();
    requestAnimationFrame(gameLoop);
});







/* ==========================================================================
   AUDIO ENGINE & LEGACY SYSTEMS HOTFIX
   ========================================================================== */
window.AudioEngine = (() => {
    let ctx = null, muted = false, enabled = false;
    function getCtx() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    function beep(freq, dur, vol, type='sine', fadeOut=true) {
        if (muted || !enabled) return;
        try { const c=getCtx(),g=c.createGain(),o=c.createOscillator(); o.type=type; o.frequency.setValueAtTime(freq,c.currentTime); g.gain.setValueAtTime(vol,c.currentTime); if(fadeOut) g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+dur); o.connect(g); g.connect(c.destination); o.start(c.currentTime); o.stop(c.currentTime+dur); } catch(e) {}
    }
    return {
        enable(){enabled=true;}, toggle(){muted=!muted;return muted;}, isMuted(){return muted;},
        click(){beep(880,0.08,0.08,'square');}, hover(){beep(660,0.05,0.04,'sine');},
        purchase(){beep(440,0.12,0.1,'sine');setTimeout(()=>beep(660,0.1,0.08,'sine'),80);},
        error(){beep(220,0.2,0.12,'sawtooth');},
        achievement(){[440,554,659,880].forEach((f,i)=>setTimeout(()=>beep(f,0.18,0.1,'sine'),i*80));},
        tick(){beep(1200,0.03,0.03,'square');}, breach(){[330,440,330,220].forEach((f,i)=>setTimeout(()=>beep(f,0.1,0.1,'sawtooth'),i*60));},
        network(){beep(550,0.15,0.08,'triangle');setTimeout(()=>beep(880,0.12,0.06,'triangle'),100);},
        hardware(){beep(330,0.2,0.1,'square');setTimeout(()=>beep(440,0.15,0.08,'sine'),120);},
    };
})();

window.Particles = (() => {
    const canvas = document.getElementById('particle-canvas');
    if(!canvas) return { draw:()=>{} };
    const c = canvas.getContext('2d');
    const COUNT = 55;
    let particles = [], mx = -9999, my = -9999;
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
    function resize() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    function mkP(x, y, pop=false) {
        return { x:x!==undefined?x:Math.random()*canvas.width, y:y!==undefined?y:Math.random()*canvas.height, vx:(Math.random()-0.5)*(pop?3:0.35), vy:(Math.random()-0.5)*(pop?3:0.35), size:Math.random()*1.6+0.4, opacity:Math.random()*0.35+0.06 };
    }
    for (let i=0;i<COUNT;i++) particles.push(mkP());
    window.addEventListener('mousedown', e => {
        if (e.target.closest('button,.overlay-panel,.toast')) return;
        for (let i=0;i<particles.length;i++) {
            const p=particles[i]; const dx=p.x-e.clientX,dy=p.y-e.clientY;
            if (dx*dx+dy*dy<400) { particles[i]=mkP(e.clientX,e.clientY,true); if(window.Store&&window.Store.state){let a=Math.floor(window.Store.state.clickPower||1);window.Store.state.data+=a;window.Store.state.totalData+=a;window.Store.state.lifetime.totalData+=a;window.spawnFloat(e.clientX,e.clientY,`+${a}`,'var(--accent)');window.AudioEngine.click();} break; }
        }
    });
    function draw(rgb) {
        c.clearRect(0,0,canvas.width,canvas.height);
        for (let i=0;i<particles.length;i++) {
            const p=particles[i]; const dx=p.x-mx,dy=p.y-my,ds=dx*dx+dy*dy;
            if(ds<12000){const f=(12000-ds)/12000;p.vx+=(dx/Math.sqrt(ds))*f*0.4;p.vy+=(dy/Math.sqrt(ds))*f*0.4;}
            p.vx*=0.98;p.vy*=0.98;
            if(Math.abs(p.vx)<0.08)p.vx+=(Math.random()-0.5)*0.08;
            if(Math.abs(p.vy)<0.08)p.vy+=(Math.random()-0.5)*0.08;
            p.x+=p.vx;p.y+=p.vy;
            if(p.x<0||p.x>canvas.width)p.vx*=-1;
            if(p.y<0||p.y>canvas.height)p.vy*=-1;
            for(let j=i+1;j<particles.length;j++){const q=particles[j],dx2=p.x-q.x,dy2=p.y-q.y,dist=Math.sqrt(dx2*dx2+dy2*dy2);if(dist<130){c.beginPath();c.strokeStyle=`rgba(${rgb},${(1-dist/130)*0.09})`;c.lineWidth=0.5;c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}}
            c.beginPath();c.arc(p.x,p.y,p.size,0,Math.PI*2);c.fillStyle=`rgba(${rgb},${p.opacity})`;c.fill();
        }
    }
    return { draw };
})();

(()=>{
    const cv=document.getElementById('bg-canvas');
    if(!cv) return;
    const c=cv.getContext('2d');
    function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
    window.addEventListener('resize',()=>{resize();draw();});resize();
    function drawHex(cx,cy,r,col){c.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);i===0?c.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):c.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}c.closePath();c.strokeStyle=col;c.lineWidth=0.5;c.stroke();}
    function draw(){c.clearRect(0,0,cv.width,cv.height);const r=38,w=r*2,h=Math.sqrt(3)*r,cols=Math.ceil(cv.width/w)+2,rows=Math.ceil(cv.height/h)+2;for(let row=-1;row<rows;row++)for(let col=-1;col<cols;col++){const x=col*w*0.75,y=row*h+(col%2)*h*0.5;drawHex(x,y,r,'rgba(0,232,255,0.03)');}}
    draw();
})();

let floaters=[];
window.spawnFloat = function(x,y,text,color='var(--accent)'){const el=document.createElement('div');el.className='floating-text';el.textContent=text;el.style.color=color;document.body.appendChild(el);floaters.push({el,x:x-10+Math.random()*20,y:y-10,vx:(Math.random()-0.5)*55,vy:-140-Math.random()*50,life:1.0,maxLife:1.0});}
window.updateFloaters = function(dt){for(let i=floaters.length-1;i>=0;i--){const f=floaters[i];f.vy+=280*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.life-=dt;if(f.life<=0){f.el.remove();floaters.splice(i,1);}else{f.el.style.left=f.x+'px';f.el.style.top=f.y+'px';f.el.style.opacity=f.life/f.maxLife;f.el.style.transform=`scale(${1+(1-f.life/f.maxLife)*0.4})`;}}};

import { logMsg } from './ui.js';
window.skipBoot=function(){
    const bs=document.getElementById('boot-screen');
    if(!bs) return;
    bs.classList.add('fade-out');
    setTimeout(()=>{
        bs.style.display='none';
        const mainUI = document.getElementById('main-ui');
        if(mainUI) mainUI.classList.add('visible');
        if(window.AudioEngine) window.AudioEngine.enable();
        logMsg('System Overlord v4.0.0 THE SINGULARITY OS','crit');
        logMsg('Extract data. Dominate networks. Transcend reality.','purple');
    },900);
};
window.bootSequence=function(){
    const lines=document.querySelectorAll('#boot-text .line');let i=0;
    function next(){if(i>=lines.length){setTimeout(()=>window.skipBoot(),800);return;}lines[i].classList.add('visible');i++;setTimeout(next,220);}
    setTimeout(next,400);
    document.addEventListener('keydown',e=>{if(e.code==='Space')window.skipBoot();},{once:true});
};

window.switchTab = function(tab) {
    document.querySelectorAll('.tab-btn-sm').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content-sm').forEach(t => t.classList.remove('active'));
    
    const btn = document.getElementById('tab-btn-' + tab);
    const content = document.getElementById('tab-' + tab);
    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');
    
    if (tab === 'projects') {
        const b = document.getElementById('badge-projects');
        if (b) b.classList.remove('show');
    }
    if (tab === 'achievements') {
        const b = document.getElementById('badge-achievements');
        if (b) b.classList.remove('show');
        if (window.Store && window.Store.state) window.Store.state._unseenAchievements = 0;
    }
};

window.switchCenter = function(tabId) {
    document.querySelectorAll('.ct-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });
    document.querySelectorAll('.center-tab').forEach(t => t.classList.remove('active'));
    
    const panel = document.getElementById('ct-' + tabId);
    if (panel) {
        panel.classList.add('active');
        // Handle special flex displays if needed, though .active in css should handle it
        panel.style.display = (tabId === 'terminal' || tabId === 'meta') ? 'flex' : 'block';
    }
    
    // Find button by matching the text content or onclick
    const btn = Array.from(document.querySelectorAll('.center-tab')).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(tabId));
    if (btn) btn.classList.add('active');
    
    if (tabId === 'darknet' && window.renderGrid) window.renderGrid();
    else if (tabId === 'forge' && window.updateForgeUI) window.updateForgeUI();
    else if (tabId === 'singularity' && window.updateDysonUI) window.updateDysonUI();
    else if (tabId === 'network' && window.renderNetworkMap) window.renderNetworkMap();
    else if (tabId === 'warfare') {
        if (window.renderWarfarePanel) window.renderWarfarePanel();
        const b = document.getElementById('badge-warfare');
        if (b) b.classList.remove('show');
    }
};
