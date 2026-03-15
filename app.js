async function loadComponent(name, anchorId) {
    const path = `./components/${name}`;
    const html = await fetch(`${path}/${name}.html`).then(res => res.text());
    document.getElementById(anchorId).innerHTML = html;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = `${path}/${name}.css`;
    document.head.appendChild(link);
    return await import(`${path}/${name}.js`);
}

async function init() {
    const header = await loadComponent('header', 'header-anchor');
    const table = await loadComponent('market-table', 'table-anchor');

    // Manually setting Sidebar Content as in your version
    document.getElementById('left-sidebar-anchor').innerHTML = `
        <div class="sidebar-inner"><div class="widget-title">Market Analysis</div></div>`;
    document.getElementById('right-sidebar-anchor').innerHTML = `
        <div class="sidebar-inner"><div class="widget-title">Economic Calendar</div></div>`;

    function tick() {
        header.run();
        table.run();
    }
    setInterval(tick, 1000);
    tick();
    document.getElementById('marketSearch').addEventListener('keyup', () => table.run());
}
init();