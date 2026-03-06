/**
 * GRID-TRACER V4 LOGIC ENGINE
 * Final Version for GitHub Commit
 */

const EXCHANGES = [
    { name: "ASX", city: "Sydney", open: "10:00", close: "16:00", tz: "Australia/Sydney", group: "ASIA-PACIFIC", url: "https://www.asx.com.au/" },
    { name: "TSE", city: "Tokyo", open: "09:00", close: "15:00", tz: "Asia/Tokyo", group: "ASIA-PACIFIC", url: "https://www.jpx.co.jp/english/" },
    { name: "SGX", city: "Singapore", open: "09:00", close: "17:00", tz: "Asia/Singapore", group: "ASIA-PACIFIC", url: "https://www.sgx.com/" },
    { name: "SSE", city: "Shanghai", open: "09:30", close: "15:00", tz: "Asia/Shanghai", group: "ASIA-PACIFIC", url: "http://english.sse.com.cn/" },
    { name: "HKEX", city: "Hong Kong", open: "09:30", close: "16:00", tz: "Asia/Hong_Kong", group: "ASIA-PACIFIC", url: "https://www.hkex.com.hk/" },
    { name: "NSE", city: "Delhi", open: "09:15", close: "15:30", tz: "Asia/Kolkata", group: "ASIA-PACIFIC", url: "https://www.nseindia.com/" },
    { name: "BSE", city: "Mumbai", open: "09:15", close: "15:30", tz: "Asia/Kolkata", group: "ASIA-PACIFIC", url: "https://www.bseindia.com/" },
    { name: "DFM", city: "Dubai", open: "10:00", close: "16:00", tz: "Asia/Dubai", group: "ASIA-PACIFIC", url: "https://www.dfm.ae/" },
    { name: "Nasdaq HEL", city: "Helsinki", open: "10:00", close: "18:30", tz: "Europe/Helsinki", group: "EMEA & NORDICS", url: "https://www.nasdaqomxnordic.com/" },
    { name: "DAX", city: "Frankfurt", open: "08:00", close: "20:00", tz: "Europe/Berlin", group: "EMEA & NORDICS", url: "https://www.boerse-frankfurt.de/" },
    { name: "Euronext PAR", city: "Paris", open: "09:00", close: "17:30", tz: "Europe/Paris", group: "EMEA & NORDICS", url: "https://www.euronext.com/en/markets/paris" },
    { name: "Nasdaq STO", city: "Stockholm", open: "09:00", close: "17:30", tz: "Europe/Stockholm", group: "EMEA & NORDICS", url: "https://www.nasdaqomxnordic.com/" },
    { name: "Nasdaq CPH", city: "Copenhagen", open: "09:00", close: "17:00", tz: "Europe/Copenhagen", group: "EMEA & NORDICS", url: "https://www.nasdaqomxnordic.com/" },
    { name: "Oslo Børs", city: "Oslo", open: "09:00", close: "16:30", tz: "Europe/Oslo", group: "EMEA & NORDICS", url: "https://www.euronext.com/en/markets/oslo" },
    { name: "LSE", city: "London", open: "08:00", close: "16:30", tz: "Europe/London", group: "EMEA & NORDICS", url: "https://www.londonstockexchange.com/" },
    { name: "Nasdaq ICE", city: "Iceland", open: "09:30", close: "15:30", tz: "Atlantic/Reykjavik", group: "EMEA & NORDICS", url: "https://www.nasdaqomxnordic.com/" },
    { name: "NYSE/NASDAQ", city: "New York", open: "09:30", close: "16:00", tz: "America/New_York", group: "AMERICAS & CRYPTO", url: "https://www.nyse.com/" },
    { name: "Binance", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO", url: "https://www.binance.com/en/trade" },
    { name: "Coinbase", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO", url: "https://www.coinbase.com/trade" },
    { name: "Kraken", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO", url: "https://www.kraken.com/" },
    { name: "Bybit", city: "Global", isCrypto: true, group: "AMERICAS & CRYPTO", url: "https://www.bybit.com/" }
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
        // Move this line UP here (outside the if)
        const exchangeDate = new Date(now.toLocaleString("en-US", { timeZone: ex.tz }));

        let statusText = 'CLOSED', statusCls = 'status-closed', toOpen = '—', toClose = '—', mTimeStr = 'Global', sessionStr = '24h';
        let translatedHours = getTranslatedHours(ex.open, ex.close, ex.tz);

        if (!ex.isCrypto) {
            const timeOptions = { timeZone: ex.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
           
            const diffHours = (exchangeDate - now) / 3600000;
            const hours = Math.floor(diffHours);
            const minutes = Math.round((diffHours - hours) * 60);
            const sign = diffHours >= 0 ? '+' : '';
            let diffStr = `${sign}${hours}h`;
            if (minutes !== 0) diffStr += `${minutes}m`;

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
        else {
            statusText = 'OPEN';
            statusCls = 'always-open';
            translatedHours = '24/7';
            mTimeStr = 'Global';
            sessionStr = '24h';
            toOpen = '—';
            toClose = '—';
        }

        html += `<tr>
            <td class="col-exch">
                ${ex.url ? `<a href="${ex.url}" target="_blank" rel="noopener noreferrer"><b>${ex.name}</b></a>` : `<b>${ex.name}</b>`}
                <span class="city-label">${ex.city}</span>
            </td>
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

