const fs = require('fs');
let html = fs.readFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.2.0/system_overlord_v3_2_0.html', 'utf8');

// 1. Delete duplicate tooltip listeners
html = html.replace(/function initTooltips\(\)\{[\s\S]*?\}\s*window\.addEventListener\('DOMContentLoaded',\(\)=>\{[\s\S]*?initTooltips\(\);/, "window.addEventListener('DOMContentLoaded',()=>{\n");

// 2. Enhance global tooltip listeners
const globalTipOld = `document.addEventListener('mouseover',e=>{const t=e.target.closest('[data-tip]');if(t && state.settings.tooltipsEnabled !== false){tip.textContent=t.dataset.tip;tip.style.opacity='1';}});
document.addEventListener('mouseout',e=>{if(e.target.closest('[data-tip]'))tip.style.opacity='0';});
document.addEventListener('mousemove',e=>{tip.style.left=(e.clientX+12)+'px';tip.style.top=(e.clientY-28)+'px';});`;

const globalTipNew = `document.addEventListener('mouseover',e=>{const t=e.target.closest('[data-tip]');if(t && state.settings?.tooltipsEnabled !== false){tip.innerHTML=t.dataset.tip;tip.style.display='block';setTimeout(()=>tip.style.opacity='1',10);}});
document.addEventListener('mouseout',e=>{const t=e.target.closest('[data-tip]');if(t){tip.style.opacity='0';setTimeout(()=>tip.style.display='none',300);}});
document.addEventListener('mousemove',e=>{let x=e.clientX+12,y=e.clientY-28;if(x+tip.offsetWidth>window.innerWidth)x=e.clientX-tip.offsetWidth-12;tip.style.left=x+'px';tip.style.top=y+'px';});`;

html = html.replace(globalTipOld, globalTipNew);

// 3. Fix toggleTooltips to immediately hide
html = html.replace(/window\.toggleTooltips=function\(val\)\{\s*state\.settings\.tooltipsEnabled = val;\s*\};/, "window.toggleTooltips=function(val){ state.settings.tooltipsEnabled = val; if(!val) { tip.style.opacity='0'; setTimeout(()=>tip.style.display='none',300); } };");

// 4. Ensure toggle HTML has 'for' attribute and proper pointer events
html = html.replace(/<label class="toggle-switch">/g, '<label class="toggle-switch" style="cursor:pointer;">');

const toggleCSSOld = `.toggle-switch input {\n            opacity: 0;\n            width: 0;\n            height: 0;\n        }`;
const toggleCSSNew = `.toggle-switch input {\n            position: absolute;\n            opacity: 0;\n            width: 100%;\n            height: 100%;\n            cursor: pointer;\n            z-index: 2;\n            margin: 0;\n        }`;
html = html.replace(toggleCSSOld, toggleCSSNew);

html = html.replace(/pointer-events: none;/g, 'pointer-events: none;'); // Make sure scanlines has it.

// 5. Explicitly fix the ct-network / ct-terminal overlap JUST in case.
html = html.replace(/#ct-terminal \{ display: flex;/, '#ct-terminal { display: none;'); // remove default flex from CSS
html = html.replace(/#ct-terminal\.active \{ display: flex; \}/, '#ct-terminal.active { display: flex !important; }');
html = html.replace(/\.ct-panel\.active \{ display: block; \}/, '.ct-panel.active { display: block !important; }');
html = html.replace(/\.ct-panel \{([^}]*)\}/, '.ct-panel {$1 display: none !important;}'); // Make sure panels are strictly hidden unless active.

fs.writeFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.2.0/system_overlord_v3_2_0.html', html, 'utf8');
