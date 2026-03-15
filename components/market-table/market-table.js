const EXCHANGES = [
    { name: "NZX", city: "Wellington", tz: "Pacific/Auckland", open: "10:00", close: "16:45", url: "https://www.nzx.com" },
    { name: "ASX", city: "Sydney", tz: "Australia/Sydney", open: "10:00", close: "16:00", url: "https://www2.asx.com.au" },
    { name: "JPX", city: "Tokyo", tz: "Asia/Tokyo", open: "09:00", close: "15:00", url: "https://www.jpx.co.jp" },
    { name: "KRX", city: "Seoul", tz: "Asia/Seoul", open: "09:00", close: "15:30", url: "https://global.krx.co.kr" },
    { name: "HKEX", city: "Hong Kong", tz: "Asia/Hong_Kong", open: "09:30", close: "16:00", url: "https://www.hkex.com.hk" },
    { name: "SGX", city: "Singapore", tz: "Asia/Singapore", open: "09:00", close: "17:00", url: "https://www.sgx.com" },
    { name: "DIFC", city: "Dubai", tz: "Asia/Dubai", open: "10:00", close: "16:00", url: "https://www.difc.ae" },
    { name: "MOEX", city: "Moscow", tz: "Europe/Moscow", open: "10:00", close: "18:50", url: "https://www.moex.com" },
    { name: "JSE", city: "Johannesburg", tz: "Africa/Johannesburg", open: "09:00", close: "17:00", url: "https://www.jse.co.za" },
    { name: "BIST", city: "Istanbul", tz: "Europe/Istanbul", open: "10:00", close: "18:00", url: "https://www.borsaistanbul.com" },
    { name: "FSE", city: "Frankfurt", tz: "Europe/Berlin", open: "09:00", close: "17:30", url: "https://www.boerse-frankfurt.de" },
    { name: "Euronext", city: "Paris", tz: "Europe/Paris", open: "09:00", close: "17:30", url: "https://www.euronext.com" },
    { name: "LSE", city: "London", tz: "Europe/London", open: "08:00", close: "16:30", url: "https://www.londonstockexchange.com" },
    { name: "B3", city: "São Paulo", tz: "America/Sao_Paulo", open: "10:00", close: "17:55", url: "https://www.b3.com.br" },
    { name: "NYSE", city: "New York", tz: "America/New_York", open: "09:30", close: "16:00", url: "https://www.nyse.com" },
    { name: "NASDAQ", city: "New York", tz: "America/New_York", open: "09:30", close: "16:00", url: "https://www.nasdaq.com" },
    { name: "TSX", city: "Toronto", tz: "America/Toronto", open: "09:30", close: "16:00", url: "https://www.tsx.com" }
];

export function run() {
    const now = new Date();
    const filter = document.getElementById('marketSearch')?.value.toLowerCase() || "";
    let html = '';

    EXCHANGES.forEach(ex => {
        if (!ex.name.toLowerCase().includes(filter) && !ex.city.toLowerCase().includes(filter)) return;

        const mTime = new Date(now.toLocaleString("en-US", { timeZone: ex.tz }));
        const diffHours = Math.round((mTime - now) / 3600000);
        const diffStr = diffHours >= 0 ? `+${diffHours}` : `${diffHours}`;

        const curMins = mTime.getHours() * 60 + mTime.getMinutes();
        const [oH, oM] = ex.open.split(':').map(Number);
        const [cH, cM] = ex.close.split(':').map(Number);
        const openTotal = oH * 60 + oM;
        const closeTotal = cH * 60 + cM;
        
        const isWeekend = mTime.getDay() === 0 || mTime.getDay() === 6;
        const isOpen = !isWeekend && curMins >= openTotal && curMins < closeTotal;

        let toOpen = "--", toClose = "--";
        if (!isOpen && !isWeekend) {
            let d = openTotal - curMins;
            if (d < 0) d += 1440;
            toOpen = `${Math.floor(d/60)}h ${d%60}m`;
        } else if (isOpen) {
            let d = closeTotal - curMins;
            toClose = `${Math.floor(d/60)}h ${d%60}m`;
        }

        html += `
            <tr>
                <td class="col-exch">
                    <a href="${ex.url}" target="_blank" style="color:#fff; text-decoration:none"><strong>${ex.name}</strong></a><br>
                    <span style="font-size:0.8em; opacity:0.6">${ex.city}</span>
                </td>
                <td class="col-hours">${ex.open}-${ex.close}</td>
                <td class="col-sess">${isWeekend ? 'Wknd' : (isOpen ? 'Main' : 'Clsd')}</td>
                <td class="col-mtime">
                    ${mTime.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit', second:'2-digit'})}
                    <span class="offset-tag">${diffStr}h</span>
                </td>
                <td class="col-ytime">${now.toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'})}</td>
                <td class="col-status"><span class="${isOpen ? 'status-open' : 'status-closed'}">${isOpen ? 'OPEN' : 'CLOSED'}</span></td>
                <td class="col-open">${toOpen}</td>
                <td class="col-close">${toClose}</td>
            </tr>`;
    });

    const body = document.getElementById('marketBody');
    if (body) body.innerHTML = html;
}