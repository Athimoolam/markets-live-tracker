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
        // 1. Get the Time String for the city
        const timeStr = now.toLocaleTimeString('en-GB', { 
            timeZone: c.tz, 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // 2. Calculate Time Difference (Offset)
        // We compare the numerical hour of the city vs. the local numerical hour
        const cityDate = new Date(now.toLocaleString('en-US', { timeZone: c.tz }));
        const localDate = new Date();
        
        // Calculate difference in hours (handling half-hour zones like Mumbai)
        const diffInMs = cityDate - localDate;
        const diffInHours = Math.round(diffInMs / (1000 * 60 * 60) * 2) / 2;

        // Format the offset string
        let offsetStr = "";
        if (diffInHours === 0) {
            offsetStr = "Local";
        } else {
            offsetStr = (diffInHours > 0 ? "+" : "") + diffInHours + "h";
        }

        // 3. Build the HTML
        html += `
            <div class="matrix-card">
                <div class="matrix-header">
                    <span class="matrix-city">${c.name}</span>
                    <span class="matrix-offset">${offsetStr}</span>
                </div>
                <div class="matrix-time">${timeStr}</div>
            </div>`;
    });

    const grid = document.getElementById('matrixClockGridleft');
    if (grid) grid.innerHTML = html;
}