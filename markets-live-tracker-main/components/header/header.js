export function run() {
    const now = new Date();
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    const timeStr = now.toLocaleTimeString('en-GB');
    const utcStr = now.toISOString().slice(11, 19);

    const clock = document.getElementById('mainClock');
    if (clock) {
        clock.innerHTML = `${dateStr} <span style="color:var(--accent); margin: 0 10px;">|</span> ${timeStr} <span style="color:var(--accent); margin: 0 10px;">|</span> UTC: ${utcStr}`;
    }
}