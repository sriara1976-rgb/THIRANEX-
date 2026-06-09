document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MODULAR FRONTEND ROUTER ENGINE
    // ==========================================
    const routes = {
        '/': {
            title: 'Home | Yashwant Sridhar Portfolio',
            render: () => `
                <section aria-labelledby="hero-heading">
                    <h1 id="hero-heading">Hi, I'm Yashwant Sridhar</h1>
                    <p>Welcome to my professional portfolio capstone project. I specialize in bridging the gap between business strategy, analytics, and technological execution.</p>
                </section>
                <hr>
                <section aria-labelledby="projects-heading">
                    <h2 id="projects-heading">Featured Engineering Projects</h2>
                    <div class="projects-grid">
                        <article class="project-card">
                            <div class="product-image-placeholder">📊</div>
                            <div class="product-details">
                                <h3>Business Analysis & Risk Management System</h3>
                                <p class="product-description">An end-to-end framework evaluating corporate investment risk paradigms and workflow automation matrices.</p>
                            </div>
                        </article>
                        <article class="project-card">
                            <div class="product-image-placeholder">📦</div>
                            <div class="product-details">
                                <h3>Supply Chain & Inventory Tracker</h3>
                                <p class="product-description">Optimized logistics structure designed to analyze operational efficiency and resource allocation values.</p>
                            </div>
                        </article>
                    </div>
                </section>
            `,
            init: () => {}
        },
        '/tasks': {
            title: 'Task Manager | App Module',
            render: () => `
                <section aria-labelledby="todo-heading">
                    <h2 id="todo-heading">Interactive Task Manager</h2>
                    <p>Mastering client-side state management, DOM manipulation, and localStorage persistence.</p>
                    <div class="todo-app">
                        <form id="todo-form" class="todo-input-group">
                            <input type="text" id="todo-input" placeholder="What needs to be done?" required autocomplete="off">
                            <button type="submit">Add Task</button>
                        </form>
                        <div class="todo-filters" role="group" aria-label="Filter tasks">
                            <button type="button" id="filter-all" class="filter-btn active">All</button>
                            <button type="button" id="filter-active" class="filter-btn">Active</button>
                            <button type="button" id="filter-completed" class="filter-btn">Completed</button>
                        </div>
                        <ul id="todo-list" class="todo-list" aria-live="polite"></ul>
                    </div>
                </section>
            `,
            init: () => initTaskManagerModule()
        },
        '/weather': {
            title: 'Weather Dashboard | Async REST API Module',
            render: () => `
                <section aria-labelledby="weather-heading">
                    <h2 id="weather-heading">Real-Time Weather Dashboard</h2>
                    <p>Fetching dynamic live structural metrics from public API endpoints safely using asynchronous calls.</p>
                    <div class="weather-app">
                        <form id="weather-form" class="weather-input-group">
                            <input type="text" id="weather-input" placeholder="Enter city name (e.g., New York, Tokyo)..." required>
                            <button type="submit">Get Weather</button>
                        </form>
                        <div id="weather-display" aria-live="polite">
                            <p class="weather-message">Search a target destination city to initialize live fetch streams.</p>
                        </div>
                    </div>
                </section>
            `,
            init: () => initWeatherModule()
        },
        '/shop': {
            title: 'E-Commerce Product Catalog | Capstone Storefront',
            render: () => `
                <section aria-labelledby="shop-heading" class="shop-container">
                    <h2 id="shop-heading">E-Commerce Product Catalog</h2>
                    <p>Demonstrating highly performance-optimized, modular client layout architectures with deep array manipulation algorithms.</p>
                    <div class="shop-controls">
                        <input type="text" id="shop-search" class="search-box" placeholder="Search catalog items..." aria-label="Search catalog products">
                        <div>Showing item cards dynamically</div>
                    </div>
                    <div id="catalog-container" class="catalog-grid"></div>
                </section>
            `,
            init: () => initProductCatalogModule()
        }
    };

    function router() {
        const path = window.location.pathname || '/';
        const route = routes[path] || routes['/'];
        
        document.title = route.title;
        document.getElementById('app-router-view').innerHTML = route.render();
        
        // Dynamic active state handler for nav layouts
        document.querySelectorAll('#nav-links a').forEach(link => {
            const linkPath = link.getAttribute('href');
            if(linkPath === path) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });

        route.init();
    }

    // Capture Link clicks for SPA seamless Client Routing instead of causing refresh
    window.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            window.history.pushState(null, null, e.target.href);
            router();
        }
    });

    window.addEventListener('popstate', router);

    // ==========================================
    // 2. MODULAR CONTROLLER: TASK MANAGER (Task 3)
    // ==========================================
    function initTaskManagerModule() {
        let todos = JSON.parse(localStorage.getItem('portfolio_todos')) || [];
        let currentFilter = 'all';

        const todoForm = document.getElementById('todo-form');
        const todoInput = document.getElementById('todo-input');
        const todoList = document.getElementById('todo-list');

        function renderTodos() {
            if (!todoList) return;
            todoList.innerHTML = '';
            const filtered = todos.filter(t => currentFilter === 'active' ? !t.completed : currentFilter === 'completed' ? t.completed : true);
            
            if(filtered.length === 0) {
                todoList.innerHTML = `<li class="todo-item" style="color:var(--text-secondary)">No items match filter rules.</li>`;
                return;
            }

            filtered.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div class="todo-item-left">
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} class="task-check">
                        <span>${escapeHTML(todo.text)}</span>
                    </div>
                    <button class="delete-btn task-del" data-id="${todo.id}">Delete</button>
                `;
                todoList.appendChild(li);

                li.querySelector('.task-check').addEventListener('change', () => {
                    todo.completed = !todo.completed;
                    localStorage.setItem('portfolio_todos', JSON.stringify(todos));
                    renderTodos();
                });

                li.querySelector('.task-del').addEventListener('click', () => {
                    todos = todos.filter(t => t.id !== todo.id);
                    localStorage.setItem('portfolio_todos', JSON.stringify(todos));
                    renderTodos();
                });
            });
        }

        if(todoForm) {
            todoForm.addEventListener('submit', e => {
                e.preventDefault();
                if(!todoInput.value.trim()) return;
                todos.push({ id: Date.now().toString(), text: todoInput.value.trim(), completed: false });
                localStorage.setItem('portfolio_todos', JSON.stringify(todos));
                todoInput.value = '';
                renderTodos();
            });
        }

        ['all', 'active', 'completed'].forEach(f => {
            const btn = document.getElementById(`filter-${f}`);
            if(btn) {
                btn.addEventListener('click', () => {
                    currentFilter = f;
                    ['all', 'active', 'completed'].forEach(x => document.getElementById(`filter-${x}`).classList.toggle('active', x === f));
                    renderTodos();
                });
            }
        });
        renderTodos();
    }

    // ==========================================
    // 3. MODULAR CONTROLLER: WEATHER ENGINE (Task 4)
    // ==========================================
    function initWeatherModule() {
        const f = document.getElementById('weather-form');
        const inp = document.getElementById('weather-input');
        const disp = document.getElementById('weather-display');

        if(f) {
            f.addEventListener('submit', async e => {
                e.preventDefault();
                const city = inp.value.trim();
                if(!city) return;
                disp.innerHTML = `<p class="weather-message">Processing active API stream links...</p>`;
                try {
                    const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
                    if(!res.ok) throw new Error("City not found.");
                    const data = await res.json();
                    const curr = data.current_condition[0];
                    const area = data.nearest_area[0];
                    disp.innerHTML = `
                        <div class="weather-card">
                            <h3>${escapeHTML(area.areaName[0].value)}, ${escapeHTML(area.country[0].value)}</h3>
                            <p class="weather-desc">${escapeHTML(curr.weatherDesc[0].value)}</p>
                            <div class="weather-metrics-grid">
                                <div class="metric-item"><div class="metric-label">Temp</div><div class="metric-value">${curr.temp_C}°C</div></div>
                                <div class="metric-item"><div class="metric-label">Humidity</div><div class="metric-value">${curr.humidity}%</div></div>
                                <div class="metric-item"><div class="metric-label">Wind</div><div class="metric-value">${curr.windspeedKmph} km/h</div></div>
                            </div>
                        </div>`;
                } catch (err) {
                    disp.innerHTML = `<div class="weather-error">Pipeline Error: ${escapeHTML(err.message)}</div>`;
                }
            });
        }
    }

    // ==========================================
    // 4. MODULAR CONTROLLER: CAPSTONE CATALOG (Task 5)
    // ==========================================
    function initProductCatalogModule() {
        // Optimized Data Object Array Architecture
        const products = [
            { id: 1, title: "Elite Analytics Engine", category: "Software", price: "$299.00", icon: "📈", desc: "Enterprise risk mitigation framework with built-in workflow visual structures." },
            { id: 2, title: "Automated Logix Hub", category: "Hardware", price: "$849.00", icon: "⚡", desc: "Next-gen automation module parsing structural metrics in real-time latency pipelines." },
            { id: 3, title: "Quantum Sync Node", category: "Networking", price: "$120.00", icon: "🌐", desc: "Ultra-secure node establishing decentralized cloud architecture links seamlessly." },
            { id: 4, title: "Matrix Ledger System", category: "Security", price: "$450.00", icon: "🔐", desc: "Cryptographic state verification framework neutralizing unauthorized injection parameters." }
        ];

        const container = document.getElementById('catalog-container');
        const searchInput = document.getElementById('shop-search');

        function renderCatalog(items) {
            if(!container) return;
            container.innerHTML = '';
            if(items.length === 0) {
                container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-secondary);">No products match your search entry query.</p>`;
                return;
            }

            items.forEach(prod => {
                const div = document.createElement('div');
                div.className = 'product-card';
                div.innerHTML = `
                    <div class="product-image-placeholder">${prod.icon}</div>
                    <div class="product-details">
                        <span class="product-category">${escapeHTML(prod.category)}</span>
                        <h3 class="product-title">${escapeHTML(prod.title)}</h3>
                        <p class="product-description">${escapeHTML(prod.desc)}</p>
                        <div class="product-footer">
                            <span class="product-price">${prod.price}</span>
                            <button class="add-cart-btn" onclick="alert('Item added to active session checkout basket!')">Buy Now</button>
                        </div>
                    </div>`;
                container.appendChild(div);
            });
        }

        if(searchInput) {
            searchInput.addEventListener('input', e => {
                const query = e.target.value.toLowerCase().trim();
                const filtered = products.filter(p => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
                renderCatalog(filtered);
            });
        }

        renderCatalog(products);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, t => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
    }

    // Intercept fresh page load executions to direct standard index configurations correctly
    router();
});
