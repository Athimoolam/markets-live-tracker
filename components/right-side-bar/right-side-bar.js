/**
 * RIGHT SIDEBAR - COMPLETE HYBRID JS
 * Binance WebSocket + Forex REST API
 */

// 1. Config: Fast-moving symbols for WebSocket
const binanceSymbols = ['btcusdt', 'ethusdt', 'paxgusdt', 'eurusdt'];

export async function run() {
    // Start the live price stream
    startBinanceStream();
    
    // Fetch Forex data immediately on load
    fetchForexData();
    
    // Refresh Forex rates every 5 minutes (300,000ms)
    setInterval(fetchForexData, 300000); 
}

/**
 * Connects to Binance for real-time tickers
 */
function startBinanceStream() {
    // If a socket already exists, close it to prevent memory leaks
    if (window.priceSocket) {
        window.priceSocket.close();
    }

    const streamUrl = `wss://stream.binance.com:9443/stream?streams=${binanceSymbols.map(s => s + '@ticker').join('/')}`;
    window.priceSocket = new WebSocket(streamUrl);

    window.priceSocket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const data = msg.data;
        const symbol = data.s.toLowerCase();
        const price = parseFloat(data.c);

        // Update UI based on Binance data
        if (symbol === 'btcusdt')  updateUI('btcPrice', '$' + price.toLocaleString());
        if (symbol === 'ethusdt')  updateUI('ethPrice', '$' + price.toLocaleString());
        if (symbol === 'paxgusdt') updateUI('paxgPrice', price.toFixed(2));
        if (symbol === 'eurusdt')  updateUI('eurPrice', price.toFixed(4));
        
        // Recalculate cross-rates whenever a base price moves
        calculateCrossRates();
    };

    window.priceSocket.onerror = (err) => console.error("WebSocket Error:", err);
}

/**
 * Fetches stable global exchange rates
 */
async function fetchForexData() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data && data.rates) {
            const rates = data.rates;
            window.fxRates = rates; // Store for calculator

            // Update Global Forex UI
            updateUI('gbpPrice', (1 / rates.GBP).toFixed(4)); // GBP/USD format
            updateUI('sekPrice', rates.SEK.toFixed(2));
            updateUI('dkkPrice', rates.DKK.toFixed(2));
            updateUI('inrPrice', rates.INR.toFixed(2));
            updateUI('aedPrice', rates.AED.toFixed(2));

            // Initial calculation
            calculateCrossRates();
        }
    } catch (error) {
        console.error("Forex API Fetch Error:", error);
    }
}

/**
 * Handles the reversed INR math:
 * DKK to INR, GBP to INR, and SEK to INR
 */
function calculateCrossRates() {
    const rates = window.fxRates;
    if (!rates) return;

    // 1. DKK to INR (How many Rupees for 1 Krone)
    if (rates.DKK > 0 && rates.INR > 0) {
        const dkkInr = (1 / rates.DKK) * rates.INR;
        updateUI('inrdkkPrice', dkkInr.toFixed(2));
    }

    // 2. GBP to INR (How many Rupees for 1 Pound)
    if (rates.GBP > 0 && rates.INR > 0) {
        const gbpInr = (1 / rates.GBP) * rates.INR;
        updateUI('inrgbpPrice', gbpInr.toFixed(2));
    }

    // 3. NEW: SEK to INR (How many Rupees for 1 Swedish Krona)
    // Formula: (1 / USD-SEK) * USD-INR
    if (rates.SEK > 0 && rates.INR > 0) {
        const sekInr = (1 / rates.SEK) * rates.INR;
        updateUI('inrsekPrice', sekInr.toFixed(2));
    }
}

/**
 * Helper to update DOM elements safely
 */
function updateUI(id, val) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = val;
    }
}