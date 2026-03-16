/**
 * RIGHT SIDEBAR - FINAL INTEGRATED VERSION
 */

const symbols = [
    'btcusdt', 'ethusdt', // Base Cryptos
    'paxgusdt',           // Gold
    'eurusdt', 'gbpusdt', // Forex Direct
    'usdtsek', 'usdtdkk', 'usdtinr', 'usdtaed' // Forex Bridges
];

export function run() {
    // We only need to start the socket once. 
    // If it's already open, we don't start a new one.
    if (window.priceSocket) return;
    
    const streamUrl = `wss://stream.binance.com:9443/stream?streams=${symbols.map(s => s + '@ticker').join('/')}`;
    window.priceSocket = new WebSocket(streamUrl);

    window.priceSocket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const data = msg.data;
        const s = data.s; 
        const p = parseFloat(data.c); 

        // 1. Update Market Leaders
        if (s === 'BTCUSDT') document.getElementById('btcPrice').innerText = "$" + p.toLocaleString();
        if (s === 'ETHUSDT') document.getElementById('ethPrice').innerText = "$" + p.toLocaleString();

        // 2. Update Commodities
        if (s === 'PAXGUSDT') document.getElementById('paxgPrice').innerText = "$" + p.toFixed(2);

        // 3. Update Forex Direct
        if (s === 'EURUSDT') document.getElementById('eurPrice').innerText = p.toFixed(4);
        if (s === 'GBPUSDT') document.getElementById('gbpPrice').innerText = p.toFixed(4);

        // 4. Update Forex Bridges
        if (s === 'USDTSEK') document.getElementById('sekPrice').innerText = p.toFixed(2);
        if (s === 'USDTDKK') document.getElementById('dkkPrice').innerText = p.toFixed(2);
        if (s === 'USDTINR') document.getElementById('inrPrice').innerText = p.toFixed(2);
        if (s === 'USDTAED') document.getElementById('aedPrice').innerText = p.toFixed(2);

        // Calculate Cross Rates
        calculateCrossRates();
    };
}

function calculateCrossRates() {
    const inr = parseFloat(document.getElementById('inrPrice')?.innerText) || 0;
    const dkk = parseFloat(document.getElementById('dkkPrice')?.innerText) || 0;
    const gbp = parseFloat(document.getElementById('gbpPrice')?.innerText) || 0;

    if (inr > 0) {
        if (dkk > 0) {
            const inrDkk = (1 / inr) * dkk;
            const el = document.getElementById('inrdkkPrice');
            if (el) el.innerText = inrDkk.toFixed(4);
        }
        if (gbp > 0) {
            const inrGbp = (1 / inr) / gbp;
            const el = document.getElementById('inrgbpPrice');
            if (el) el.innerText = inrGbp.toFixed(6);
        }
    }
}