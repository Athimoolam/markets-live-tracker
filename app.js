/**
 * Component Loader: Fetches HTML/CSS/JS for specific dashboard sections
 */
async function loadComponent(name, anchorId) {
    const path = `./components/${name}`;
    
    // 1. Inject HTML
    const html = await fetch(`${path}/${name}.html`).then(res => res.text());
    document.getElementById(anchorId).innerHTML = html;

    // 2. Inject CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${path}/${name}.css`;
    document.head.appendChild(link);

    // 3. Import and return JS Module
    return await import(`${path}/${name}.js`);
}

async function init() {
    // Initialize component instances
    const header = await loadComponent('header', 'header-anchor');
    const table = await loadComponent('market-table', 'table-anchor');

    // Create empty sidebar shells as per original design
    document.getElementById('left-sidebar-anchor').innerHTML = '<div class="sidebar-inner"></div>';
    document.getElementById('right-sidebar-anchor').innerHTML = '<div class="sidebar-inner"></div>';

    /**
     * Main Refresh Loop
     */
    function tick() {
        header.run();
        table.run();
    }

    setInterval(tick, 1000);
    tick();

    // Attach search listener after DOM injection
    document.getElementById('marketSearch').addEventListener('keyup', () => table.run());
}

init();