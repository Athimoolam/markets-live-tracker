const CITIES = [
    { name: "Sydney", tz: "Australia/Sydney" },
    { name: "Tokyo", tz: "Asia/Tokyo" },
    { name: "Singapore", tz: "Asia/singapore" },
    { name: "Chennai", tz: "Asia/Kolkata" },
    { name: "Dubai", tz: "Asia/Dubai" },
    { name: "Stockholm", tz: "Europe/stockholm" },
    { name: "London", tz: "Europe/London" },
    { name: "New York", tz: "America/New_York" },
    { name: "Denver", tz: "America/denver" },
    { name: "San Francisco", tz: "America/Los_Angeles" }
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
    const grid = document.getElementById('matrixClockGridleft');
    if (grid) grid.innerHTML = html;
}