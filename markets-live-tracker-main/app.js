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

    // Restore original Sidebar Labels
    //    document.getElementById('left-sidebar-anchor').innerHTML = `
    //        <div class="sidebar-inner"><div class="widget-title">Market Analysis</div></div>`;
    //document.getElementById('right-sidebar-anchor').innerHTML = `
    //    <div class="sidebar-inner"><div class="widget-title">Economic Calendar</div></div>`;
    const leftsidebar = await loadComponent('left-side-bar', 'left-sidebar-anchor');
    const rightsidebar = await loadComponent('right-side-bar', 'right-sidebar-anchor');

    function tick() {
        header.run();
        table.run();
        leftsidebar.run();
        rightsidebar.run();
    }

    setInterval(tick, 1000);
    tick();

    // Re-attach Search Listener
    const searchInput = document.getElementById('marketSearch');
    if (searchInput) searchInput.addEventListener('keyup', () => table.run());
}
init();

window.toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
};