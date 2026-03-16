/**
 * RIGHT SIDEBAR COMPONENT - LIVE CRYPTO
 */

let isConnected = false;
let socket = null;

function initCryptoStream() {
    // CRITICAL: Prevent app.js loop from opening multiple connections
    if (isConnected || (socket && socket.readyState === WebSocket.CONNECTING)) return;

    const wsUrl = "wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker/bnbusdt@ticker";
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        isConnected = true;
        console.log("✅ Sidebar: WebSocket Connected");
    };

    socket.onmessage = (event) => {
        const rawData = JSON.parse(event.data);
        const data = rawData.data;
        const symbol = data.s;
        const price = parseFloat(data.c).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (symbol === "BTCUSDT") {
            const el = document.getElementById('btcPrice');
            if (el) el.innerText = "$" + price;
        } else if (symbol === "ETHUSDT") {
            const el = document.getElementById('ethPrice');
            if (el) el.innerText = "$" + price;
        } else if (symbol === "BNBUSDT") { // Handle BNB
            const el = document.getElementById('bnbPrice');
            if (el) el.innerText = "$" + price;
        }
    };

    socket.onclose = () => {
        isConnected = false;
        console.warn("⚠️ Sidebar: Connection closed. Retrying...");
        setTimeout(initCryptoStream, 5000);
    };

    socket.onerror = (err) => {
        console.error("WebSocket Error:", err);
    };
}

// Start the stream as soon as the module is loaded by app.js
initCryptoStream();

/**
 * The run() function is called every 1s by app.js.
 * We leave it empty because the WebSocket updates the DOM automatically 
 * based on events, not a timer.
 */
export function run() {
    // No code needed here for price updates.
    // WebSocket handles it in real-time.
}