export async function getCryptoPrices() {
    try {
        const response = await fetch('https://api.binance.com/api/3/ticker/price?symbols=["BTCUSDT","ETHUSDT"]');
        const data = await response.json();
        return {
            btc: parseFloat(data.find(i => i.symbol === "BTCUSDT").price).toLocaleString(),
            eth: parseFloat(data.find(i => i.symbol === "ETHUSDT").price).toLocaleString()
        };
    } catch (error) {
        console.error("Price Fetch Error:", error);
        return { btc: "Loading...", eth: "Loading..." };
    }
}