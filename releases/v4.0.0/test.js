const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        console.log(`[PAGE CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', err => {
        console.log(`[PAGE ERROR] ${err.toString()}`);
    });
    
    await page.goto('http://127.0.0.1:8080/');
    await new Promise(r => setTimeout(r, 2000)); // wait for boot
    await browser.close();
})();
