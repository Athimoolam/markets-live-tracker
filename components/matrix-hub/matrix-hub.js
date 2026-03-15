const CITIES = [
    { name: "New York", tz: "America/New_York" },
    { name: "London", tz: "Europe/London" },
    { name: "Tokyo", tz: "Asia/Tokyo" },
    { name: "Sydney", tz: "Australia/Sydney" },
    { name: "Dubai", tz: "Asia/Dubai" },
    { name: "Frankfurt", tz: "Europe/Berlin" }
];

export function run() {
    const now = new Date();
    let html = '';
    CITIES.forEach(c => {
        const timeStr = now.toLocaleTimeString('en-GB', { timeZone: c.tz, hour: '2-digit', minute: '2-digit' });
        html += `
            <div class="matrix-card">
                <span class="matrix-city">${c.name}</span>
                <div class="matrix-time">${timeStr}</div>
            </div>`;
    });
    const grid = document.getElementById('matrixClockGrid');
    if (grid) grid.innerHTML = html;
}