
import { Store, fData, fMoney, fNum } from './state.js';
import { calcHardwareStats } from './engine.js';

export const els={};
export const DOM_STATE={};

export function cacheDom(){
    const ids=['currentData','totalData','dataRate','moneyRate','bandwidth','credits','price','demand','tb-data-rate','tb-money-rate'];
    ids.forEach(id=>{const key=id.replace(/-([a-z])/g,(m,c)=>c.toUpperCase());els[key]=document.getElementById(id);});
}

export function updateDOM(key, val, isHTML=false){
    if(!els[key])return;
    if(DOM_STATE[key]===val)return;
    DOM_STATE[key]=val;
    if(isHTML) els[key].innerHTML=val;
    else els[key].textContent=val;
}

export function logMsg(msg,type='') { console.log(`[LOG] ${msg}`); }
export function showToast(msg,type='info') { console.log(`[TOAST] ${msg}`); }

export function render(){
    const hwStats=calcHardwareStats();
    updateDOM('currentData', fData(Store.state.data));
    updateDOM('credits', fMoney(Store.state.credits));
}
