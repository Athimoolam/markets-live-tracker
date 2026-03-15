export function run() {
    const now = new Date();
    
    // Formatting: Weekday, Month Day
    const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const timeStr = now.toLocaleTimeString('en-GB'); // 24h Format
    const utcStr = now.toISOString().slice(11, 19);

    const clockEl = document.getElementById('mainClock');
    if (clockEl) {
        clockEl.innerHTML = `${dateStr} <span style="color:var(--accent); margin: 0 10px;">|</span> ${timeStr} <span style="color:var(--accent); margin: 0 10px;">|</span> UTC: ${utcStr}`;
    }
}