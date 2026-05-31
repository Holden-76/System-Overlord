
import { Store, fData, fMoney } from './state.js';
import { logMsg, showToast } from './ui.js';

export const hwCatalog={
    cpu:[ {id:'ryzen5950',name:'Ryzen 9 5950X',tier:1,tdp:105,opsBonus:500,dataMult:1.0,cost:50000,type:'cpu',effect:'MaxOps +500'} ],
    gpu:[ {id:'rtx4090',name:'RTX 4090',tier:1,tdp:450,passiveData:5,creativityMult:1.0,cost:100000,type:'gpu',effect:'+5 Data/s passive'} ],
    ram:[ {id:'ddr5_64',name:'64GB DDR5',tier:1,tdp:10,opsBuffer:500,cost:5000,type:'ram',effect:'MaxOps +500'} ],
    cooling:[ {id:'air_cool',name:'Tower Air Cooler',tier:1,tdp:0,thermalBonus:50,cost:2000,type:'cool',effect:'TDP Budget +50W'} ]
};

export function findHwItem(id){for(const cat of Object.values(hwCatalog)){const f=cat.find(x=>x.id===id);if(f)return f;}return null;}
export function countInstalledType(type){return Store.state.hardware.installed.filter(id=>{const i=findHwItem(id);return i&&i.type===type;}).length;}

export const projects=[
    {id:'heuristicClicks',title:'Heuristic Clicks',desc:'Manual extraction yield +4.',cost:{credits:15},trigger:()=>Store.state.totalData>100,effect:()=>{Store.state.clickPower+=4;logMsg("Heuristic algorithms applied.","net");}}
];

export const achievements=[
    {id:'firstClick',icon:'',title:'First Contact',desc:'Extract data for the first time.',bonus:'+1 click power',check:()=>Store.state.lifetime.totalClicks>=1,onEarn:()=>{Store.state.clickPower+=1;}}
];

export const NET_MODS=[ {id:'hardened',label:'HARDENED',desc:'Defense x2',defMult:2,lootMult:1,color:'var(--danger)'} ];

export const eventTemplates=[
    {id:'darkAuction',icon:'',title:'Dark Web Auction',desc:'A cache of stolen data.',choiceA:{label:'Buy',sublabel:'Spend $5000',cost:{credits:5000},effect(){Store.state.data+=15000;logMsg("Data acquired.");}},choiceB:{label:'Pass',sublabel:'No cost',cost:{},effect(){logMsg("Auction declined.");}},trigger:()=>Store.state.credits>=5000}
];
