const fs = require('fs');
const html = fs.readFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.2.0/system_overlord_v3_2_0.html', 'utf8');
const lines = html.split('\n');

// Find and replace the UI overlap flex issue
for(let i=0; i<lines.length; i++) {
    if (lines[i].includes('id="ct-terminal"') && lines[i].includes('display:flex;')) {
        lines[i] = lines[i].replace('style="display:flex;flex-direction:column;gap:10px"', 'style="flex-direction:column;gap:10px"');
        console.log("Fixed inline display:flex on ct-terminal");
    }
    if (lines[i].includes('id="ct-network"') && lines[i].includes('class="ct-panel active"')) {
        lines[i] = lines[i].replace('class="ct-panel active"', 'class="ct-panel"');
        console.log("Fixed default active class on ct-network");
    }
}

// Find the achievements array and completely rewrite it
let achStart = -1, achEnd = -1;
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes("const achievements=[")) achStart = i;
    if(achStart !== -1 && i > achStart && lines[i].includes("];")) { achEnd = i; break; }
}

if(achStart !== -1 && achEnd !== -1) {
    const freshAch = `const achievements=[
    {id:'firstClick',icon:'⚡',title:'First Contact',desc:'Extract data for the first time.',bonus:'+1 click power',check:()=>state.lifetime.totalClicks>=1,onEarn:()=>{state.clickPower+=1;}},
    {id:'click100',icon:'⚡',title:'Speed Demon',desc:'Reach 100 total clicks.',bonus:'+2 click power',check:()=>state.lifetime.totalClicks>=100,onEarn:()=>{state.clickPower+=2;}},
    {id:'data10k',icon:'💾',title:'Data Hoarder',desc:'Accumulate 10 PB total.',bonus:'+5% demand',check:()=>state.lifetime.totalData>=10000,onEarn:()=>{}},
    {id:'data1m',icon:'💽',title:'Exabyte Era',desc:'Accumulate 1 EB across all runs.',bonus:'+10% demand',check:()=>state.lifetime.totalData>=1000000,onEarn:()=>{}},
    {id:'money10k',icon:'💰',title:'War Chest',desc:'Earn $10,000 total.',bonus:'+3% income',check:()=>state.lifetime.totalCredits>=10000,onEarn:()=>{}},
    {id:'combo5',icon:'🔥',title:'Combo Master',desc:'Reach a 5.0x combo.',bonus:'+0.5 max combo',check:()=>state.lifetime.highestCombo>=5.0,onEarn:()=>{state.maxCombo+=0.5;}},
    {id:'combo10',icon:'🔥',title:'Combo Legend',desc:'Reach a 10.0x combo.',bonus:'+1.0 max combo',check:()=>state.lifetime.highestCombo>=10.0,onEarn:()=>{state.maxCombo+=1.0;}},
    {id:'nodes25',icon:'🕸',title:'Web Weaver',desc:'Own 25 botnet nodes.',bonus:'Node cost -5%',check:()=>state.lifetime.totalNodes>=25,onEarn:()=>{}},
    {id:'nodes100',icon:'🌍',title:'Global Pandemic',desc:'Own 100 botnet nodes.',bonus:'Node cost -10%',check:()=>state.lifetime.totalNodes>=100,onEarn:()=>{}},
    {id:'projects10',icon:'🔬',title:'Researcher',desc:'Purchase 10 projects.',bonus:'+5% all income',check:()=>state.lifetime.totalProjects>=10,onEarn:()=>{}},
    {id:'prestige1',icon:'✨',title:'Born Again',desc:'Complete your first reboot.',bonus:'Start bonus +50 data',check:()=>state.prestigeCount>=1,onEarn:()=>{}},
    {id:'prestige5',icon:'♻',title:'Eternal Return',desc:'Complete 5 reboots.',bonus:'+5% fragment gain',check:()=>state.prestigeCount>=5,onEarn:()=>{}},
    {id:'net1',icon:'☠',title:'First Blood',desc:'Dominate your first network.',bonus:'+10% network loot',check:()=>state.lifetime.networksBreached>=1,onEarn:()=>{}},
    {id:'net10',icon:'⚔',title:'Network Warlord',desc:'Dominate 10 networks.',bonus:'+25% network loot',check:()=>state.lifetime.networksBreached>=10,onEarn:()=>{}},
    {id:'hw1',icon:'🖥',title:'Hardware Hacker',desc:'Install your first hardware component.',bonus:'+5% Ops gen',check:()=>state.hardware.installed.length>=1,onEarn:()=>{}},
    {id:'hw5',icon:'🔋',title:'Silicon Overlord',desc:'Install 5 hardware components.',bonus:'+10% Ops gen',check:()=>state.hardware.installed.length>=5,onEarn:()=>{}},
];`;
    lines.splice(achStart, achEnd - achStart + 1, freshAch);
    console.log("Achievements rewritten");
}

let fileString = lines.join('\n');

// Threat labels
fileString = fileString.replace(/const icons=\['\?\?','\?','\?','\?\?','\?'\];/, "const icons=['🛡','⚠','⚠','🔥','☢'];");

// Map marker gibberish
// Look for ctx.fillText('',nx,ny+r+22);
fileString = fileString.replace(/ctx\.fillText\('[^']*',nx,ny\+r\+22\);/, "ctx.fillText('✓',nx,ny+r+22);");

// DOMINATED badge
fileString = fileString.replace(/ DOMINATED/g, "✓ DOMINATED");

// HW Checkmark
fileString = fileString.replace(/\$\{installed\?' ':'\s*'\}/g, "${installed?'✓ ':''}");

// Arrows / Energy
fileString = fileString.replace(/ A Loot:/g, " → Loot:");
fileString = fileString.replace(/ A '\+item\.tdp\+'W TDP'/g, " ⚡ '+item.tdp+'W TDP'");

// Log msg gibberish
fileString = fileString.replace(/logMsg\(" \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \? \?","crit"\);/g, 'logMsg("=======================================","crit");');

fs.writeFileSync('c:/Users/Holde/Downloads/System-Overlord/releases/v3.2.0/system_overlord_v3_2_0.html', fileString, 'utf8');
