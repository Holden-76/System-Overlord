
import { Store } from './state.js';

let daemonInterval = null;
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

export function initTerminal() {
    const input = document.getElementById('ide-input');
    if(!input) return;
    
    // Load saved script
    if(Store.state.terminal && Store.state.terminal.script) {
        input.value = Store.state.terminal.script;
    }
    
    // Auto-save script on edit
    input.addEventListener('input', () => {
        if(!Store.state.terminal) Store.state.terminal = {};
        Store.state.terminal.script = input.value;
    });

    window.runDaemon = function() {
        if(daemonInterval) clearInterval(daemonInterval);
        
        const code = input.value;
        document.getElementById('ide-console').innerHTML = '';
        overlordPrint('Compiling Daemon...', 'sys');
        
        try {
            // Compile user code into an async function
            const userFunc = new AsyncFunction('overlord', code);
            
            document.getElementById('daemon-status').textContent = '[RUNNING]';
            document.getElementById('daemon-status').style.color = 'var(--green)';
            overlordPrint('Daemon active on 1Hz loop.', 'sys');
            
            // Execute on 1Hz loop
            daemonInterval = setInterval(() => {
                userFunc(overlordAPI).catch(e => {
                    overlordPrint('ERROR: ' + e.message, 'error');
                    window.killDaemon();
                });
            }, 1000);
            
            // Initial call
            userFunc(overlordAPI).catch(e => {
                overlordPrint('ERROR: ' + e.message, 'error');
                window.killDaemon();
            });
            
        } catch(e) {
            overlordPrint('COMPILE ERROR: ' + e.message, 'error');
            document.getElementById('daemon-status').textContent = '[FAILED]';
            document.getElementById('daemon-status').style.color = 'var(--danger)';
        }
    };
    
    window.killDaemon = function() {
        if(daemonInterval) {
            clearInterval(daemonInterval);
            daemonInterval = null;
            overlordPrint('Process terminated by user.', 'sys');
        }
        document.getElementById('daemon-status').textContent = '[OFFLINE]';
        document.getElementById('daemon-status').style.color = 'var(--text-dim)';
    };
}

function overlordPrint(msg, type = 'normal') {
    const consoleEl = document.getElementById('ide-console');
    if(!consoleEl) return;
    
    const div = document.createElement('div');
    div.className = 'console-line ' + (type === 'normal' ? '' : type);
    
    const d = new Date();
    const time = `[${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}]`;
    
    div.textContent = `${time} ${msg}`;
    consoleEl.appendChild(div);
    
    // Auto scroll
    if(consoleEl.childNodes.length > 100) {
        consoleEl.removeChild(consoleEl.firstChild);
    }
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

// The secure API passed into the sandbox
const overlordAPI = {
    print: function(msg) {
        overlordPrint(msg);
    },
    getMetrics: function() {
        return {
            ops: Store.state.ops,
            data: Store.state.totalData,
            credits: Store.state.credits,
            stellarEnergy: Store.state.dyson ? Store.state.dyson.stellarEnergy : 0
        };
    },
    buyHardware: function(type) {
        // Simple hook to simulate a purchase, assuming window.buyItem exists
        // However, in our modular refactor we might not have exposed buyItem cleanly.
        // We can just print a warning if not fully bound.
        overlordPrint('Requested purchase: ' + type, 'sys');
    },
    scanNode: function(q, r) {
        if(typeof window.scanHex === 'function') {
            window.scanHex(q, r);
            overlordPrint(`Scanning sector ${q},${r}`, 'sys');
        } else {
            overlordPrint('Grid API offline.', 'error');
        }
    },
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
