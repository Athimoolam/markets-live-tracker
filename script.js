/**
 * GRID-TRACER V4 LOGIC ENGINE
 * Final Version for GitHub Commit
 */

const EXCHANGES = [
    { name: "ASX", city: "Sydney", open: "10:00", close: "16:00", tz: "Australia/Sydney", group: "ASIA-PACIFIC" },
    { name: "TSE", city: "Tokyo", open: "09:00", close: "15:00", tz: "Asia/Tokyo", group: "ASIA-PACIFIC" },
    { name: "SGX", city: "Singapore", open: "09:00", close: "17:00", tz: "Asia/Singapore", group: "ASIA-PACIFIC" },
    { name: "SSE", city: "Shanghai", open: "09:30", close: "15:00", tz: "Asia/Shanghai", group: "ASIA-PACIFIC" },
    { name: "HKEX", city: "Hong Kong", open: "09:30", close: "16:00", tz: "Asia/Hong_Kong", group: "ASIA-PACIFIC" },
    { name: "NSE", city: "Delhi", open: "09:15", close: "15:30", tz: "Asia/Kolkata", group: "ASIA-PACIFIC" },
    { name: "BSE", city: "Mumbai", open: "09:15", close: "15:30", tz: "Asia/Kolkata", group: "ASIA-PACIFIC" },
    { name: "DFM", city: "Dubai", open: "10:00", close: "16:00", tz: "Asia/Dubai", group: "ASIA-PACIFIC" },
    { name: "Nasdaq HEL", city: "Helsinki", open: "10:00", close: "18:30", tz: "Europe/Helsinki", group: "EMEA & NORDICS" },
    { name: "DAX", city: "Frankfurt", open: "08:00", close: "20:00", tz: "Europe/Berlin", group: "EMEA & NORDICS" },
    { name: "Euronext PAR", city: "Paris", open: "09:00", close: "17:30", tz: "Europe/Paris", group: "EMEA & NORDICS" },
    { name: "Nasdaq STO", city: "Stockholm", open: "09:00", close: "17:30", tz: "Europe/Stockholm", group: "EMEA & NORDICS" },
    { name: "Nasdaq CPH", city: "Copenhagen", open: "09:00", close: "17:00", tz: "Europe/Copenhagen", group: "EMEA & NORDICS" },
    { name: "Oslo Børs", city: "Oslo", open: "09:00", close: "16:30", tz: "Europe/Oslo", group: "EMEA & NORDICS" },
    { name: "LSE", city: "London", open: "08:00", close: "16:30", tz: "Europe/London", group: "EMEA & NORDICS" },
    { name: "Nasdaq ICE", city: "Iceland", open: "09:30", close: "15:30", tz: "Atlantic/Reykjavik", group: "EMEA & NORDICS" },
    { name: "NYSE/NASDAQ", city: "New York", open: "09:30", close: "16:00", tz: "America/New_York", group: "AMERICAS & CRYPTO" },
    { name: "Binance", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO" },
    { name: "Coinbase", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO" },
    { name: "Kraken", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO" },
    { name: "Bybit", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO" }
];

/**
 * Translates exchange hours into user's local timezone
 */
function getTranslatedHours(openStr, closeStr, targetTz) {
    if (!openStr) return "24/7";
    const now = new Date();
    const mNow = new Date(now.toLocaleString("en-US", {timeZone: targetTz}));
    const [oH, oM] = openStr.split(':').map(Number);
    const [cH, cM] = closeStr.split(':').map(Number);
    const mOpen = new Date(mNow); mOpen.setHours(oH, oM, 0, 0);
    const mClose = new Date(mNow); mClose.setHours(cH, cM, 0, 0);
    const diff = now.getTime() - mNow.getTime();
    const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${f.format(new Date(mOpen.getTime()+diff))}–${f.format(new Date(mClose.getTime()+diff))}`;
}

/**
 * Main render function. Updates the central clock (with Date) and calculates table row values.
 */
function updateTable() {
    const now = new Date();
    const searchVal = document.getElementById('marketSearch').value.toLowerCase();
    
    // FORMAT CENTRAL CLOCK: Day, Month Date | Time | UTC
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    const timeStr = now.toLocaleTimeString('en-GB'); // 24h format
    const utcStr = now.toISOString().slice(11, 19);

    document.getElementById('mainClock').innerHTML = 
        `${dateStr} <span style="color:var(--accent); margin: 0 10px;">|</span> ${timeStr} <span style="color:var(--accent); margin: 0 10px;">|</span> UTC: ${utcStr}`;

    let html = '', lastGroup = '';

    EXCHANGES.forEach(ex => {
        if (searchVal && !ex.name.toLowerCase().includes(searchVal) && !ex.city.toLowerCase().includes(searchVal)) return;

        if (ex.group !== lastGroup) { 
            html += `<tr class="subheader"><td colspan="8">${ex.group}</td></tr>`; 
            lastGroup = ex.group; 
        }
        
        let statusText = 'CLOSED', statusCls = 'status-closed', toOpen = '—', toClose = '—', mTimeStr = 'Global', sessionStr = '24h';
        let translatedHours = getTranslatedHours(ex.open, ex.close, ex.tz);

        if (!ex.isCrypto) {
            const timeOptions = { timeZone: ex.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            
            const exchangeDate = new Date(now.toLocaleString("en-US", {timeZone: ex.tz}));
            const diffHours = Math.round((exchangeDate - now) / 3600000);
            const diffStr = diffHours >= 0 ? `+${diffHours}h` : `${diffHours}h`;

            // Time only + High Visibility Offset for table space
            mTimeStr = `${now.toLocaleString("en-US", timeOptions)} <span class="offset-tag">${diffStr}</span>`;
            
            const mDate = new Date(now.toLocaleString("en-US", {timeZone: ex.tz}));
            const curMin = mDate.getHours() * 60 + mDate.getMinutes();
            const [oH, oM] = ex.open.split(':').map(Number);
            const [cH, cM] = ex.close.split(':').map(Number);
            const openMin = oH * 60 + oM;
            const closeMin = cH * 60 + cM;

            const totalMins = closeMin - openMin;
            const sessionDisplay = `${Math.floor(totalMins/60)}h ${totalMins%60}m`;

            if (mDate.getDay() !== 0 && mDate.getDay() !== 6) { 
                if (curMin >= openMin && curMin < closeMin) {
                    statusText = 'OPEN'; statusCls = 'status-open';
                    let elapsed = curMin - openMin;
                    sessionStr = `${Math.floor(elapsed/60)}h ${elapsed%60}m`;
                    let rem = closeMin - curMin;
                    toClose = `${Math.floor(rem/60)}h ${rem%60}m`;
                } else {
                    sessionStr = sessionDisplay;
                    let rem = openMin - curMin; if (rem < 0) rem += 1440;
                    toOpen = `${Math.floor(rem/60)}h ${rem%60}m`;
                }
            } else { 
                statusText = 'WKND'; 
                sessionStr = sessionDisplay; 
            }
        }

        html += `<tr>
            <td class="col-exch"><b>${ex.name}</b><span class="city-label">${ex.city}</span></td>
            <td class="col-hours" style="font-size:0.85em; opacity:0.6">${ex.open ? ex.open+'–'+ex.close : '24h'}</td>
            <td class="col-sess" style="color:var(--link); font-weight:bold;">${sessionStr}</td>
            <td class="col-mtime market-time-cell">${mTimeStr}</td>
            <td class="col-ytime" style="color:#a0d0ff; font-weight:bold">${translatedHours}</td>
            <td class="col-status ${statusCls}">${statusText}</td>
            <td class="col-open" style="color:#ffcc00">${toOpen}</td>
            <td class="col-close" style="color:var(--green)">${toClose}</td>
        </tr>`;
    });
    document.getElementById('marketBody').innerHTML = html;
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

setInterval(updateTable, 1000);
updateTable();