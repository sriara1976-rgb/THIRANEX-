document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // MODULE 1: TASK 3 - TASK MANAGER CODE
    // ==========================================
    let state = {
        todos: JSON.parse(localStorage.getItem('portfolio_todos')) || [],
        currentFilter: 'all'
    };

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = {
        all: document.getElementById('filter-all'),
        active: document.getElementById('filter-active'),
        completed: document.getElementById('filter-completed')
    };

    function saveToLocalStorage() {
        localStorage.setItem('portfolio_todos', JSON.stringify(state.todos));
    }

    function renderTodos() {
        if (!todoList) return;
        todoList.innerHTML = '';
        
        const filteredTodos = state.todos.filter(todo => {
            if (state.currentFilter === 'active') return !todo.completed;
            if (state.currentFilter === 'completed') return todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            todoList.innerHTML = `<li class="todo-item" style="color: var(--text-secondary);">No tasks found matching this filter.</li>`;
            return;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', todo.id);

            li.innerHTML = `
                <div class="todo-item-left">
                    <input type="checkbox" id="check-${todo.id}" ${todo.completed ? 'checked' : ''} aria-label="Mark task as complete">
                    <span id="text-${todo.id}">${escapeHTML(todo.text)}</span>
                </div>
                <div class="todo-actions">
                    <button class="edit-btn" aria-label="Edit task text">Edit</button>
                    <button class="delete-btn" aria-label="Delete task item">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    if (todoForm) {
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = todoInput.value.trim();
            if (!text) return;

            state.todos.push({
                id: Date.now().toString(),
                text: text,
                completed: false
            });
            saveToLocalStorage();
            renderTodos();
            todoInput.value = '';
            todoInput.focus();
        });
    }

    if (todoList) {
        todoList.addEventListener('click', (e) => {
            const target = e.target;
            const todoItem = target.closest('.todo-item');
            if (!todoItem) return;
            
            const id = todoItem.getAttribute('data-id');
            const todoIndex = state.todos.findIndex(item => item.id === id);
            if (todoIndex === -1) return;

            if (target.type === 'checkbox') {
                state.todos[todoIndex].completed = target.checked;
                saveToLocalStorage();
                renderTodos();
            }

            if (target.classList.contains('edit-btn')) {
                const currentText = state.todos[todoIndex].text;
                const newText = prompt("Update your task details:", currentText);
                if (newText !== null && newText.trim() !== "") {
                    state.todos[todoIndex].text = newText.trim();
                    saveToLocalStorage();
                    renderTodos();
                }
            }

            if (target.classList.contains('delete-btn')) {
                state.todos.splice(todoIndex, 1);
                saveToLocalStorage();
                renderTodos();
            }
        });
    }

    Object.keys(filterButtons).forEach(filterType => {
        if (filterButtons[filterType]) {
            filterButtons[filterType].addEventListener('click', () => {
                state.currentFilter = filterType;
                Object.keys(filterButtons).forEach(type => {
                    if (filterButtons[type]) {
                        filterButtons[type].classList.toggle('active', type === filterType);
                        filterButtons[type].setAttribute('aria-pressed', type === filterType ? 'true' : 'false');
                    }
                });
                renderTodos();
            });
        }
    });

    renderTodos();


    // ==========================================
    // MODULE 2: TASK 4 - REAL-TIME WEATHER API
    // ==========================================
    const weatherForm = document.getElementById('weather-form');
    const weatherInput = document.getElementById('weather-input');
    const weatherDisplay = document.getElementById('weather-display');

    if (weatherForm) {
        weatherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const city = weatherInput.value.trim();
            if (!city) return;

            // Render safe loading visual state
            weatherDisplay.innerHTML = `<p class="weather-message">Fetching real-time weather metrics for "${escapeHTML(city)}"...</p>`;

            // Core Asynchronous Architecture Implementation with catch-all handlers
            try {
                // Requesting secure clean JSON payload output from the REST Endpoint
                const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
                
                // Network pipeline stability verification validation
                if (!response.ok) {
                    throw new Error("Target destination city could not be located. Please check spelling.");
                }

                const data = await response.json();
                renderWeather(data, city);

            } catch (error) {
                // Catching and displaying full network exceptions to safe UI views
                weatherDisplay.innerHTML = `
                    <div class="weather-error" role="alert">
                        Error: ${escapeHTML(error.message || "Failed to retrieve connection metrics from API service.")}
                    </div>
                `;
            }
        });
    }

    // Dynamic Object Parsing Renderer implementation strategy
    function renderWeather(data, searchCity) {
        // Parsing highly nested layout data structures returned from standard JSON payload securely
        const currentCondition = data.current_condition[0];
        const nearestArea = data.nearest_area[0];
        
        const tempC = currentCondition.temp_C;
        const humidity = currentCondition.humidity;
        const windSpeed = currentCondition.windspeedKmph;
        const description = currentCondition.weatherDesc[0].value;
        
        const resolvedCity = nearestArea.areaName[0].value;
        const resolvedCountry = nearestArea.country[0].value;

        weatherDisplay.innerHTML = `
            <div class="weather-card">
                <h3>${escapeHTML(resolvedCity)}, ${escapeHTML(resolvedCountry)}</h3>
                <p class="weather-desc">${escapeHTML(description)}</p>
                
                <div class="weather-metrics-grid">
                    <div class="metric-item">
                        <div class="metric-label">Temperature</div>
                        <div class="metric-value">${escapeHTML(tempC)}°C</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Humidity</div>
                        <div class="metric-value">${escapeHTML(humidity)}%</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-label">Wind Speed</div>
                        <div class="metric-value">${escapeHTML(windSpeed)} km/h</div>
                    </div>
                </div>
            </div>
        `;
    }
});
