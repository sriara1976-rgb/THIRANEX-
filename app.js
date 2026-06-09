document.addEventListener('DOMContentLoaded', () => {
    // 1. STATE MANAGEMENT OBJECT
    let state = {
        todos: JSON.parse(localStorage.getItem('portfolio_todos')) || [],
        currentFilter: 'all'
    };

    // DOM Elements Cache
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = {
        all: document.getElementById('filter-all'),
        active: document.getElementById('filter-active'),
        completed: document.getElementById('filter-completed')
    };

    // 2. DATA PERSISTENCE LAYER
    function saveToLocalStorage() {
        localStorage.setItem('portfolio_todos', JSON.stringify(state.todos));
    }

    // 3. RENDER CORE METHOD
    function render() {
        todoList.innerHTML = '';
        
        // Advanced Task Filtering Architecture
        const filteredTodos = state.todos.filter(todo => {
            if (state.currentFilter === 'active') return !todo.completed;
            if (state.currentFilter === 'completed') return todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            todoList.innerHTML = `<li class="todo-item" style="color: var(--text-secondary);">No tasks found matching this filter.</li>`;
            return;
        }

        // Generating dynamic DOM elements with WCAG accessibility attributes
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
                    <button class="edit-btn" aria-label="Edit task descriptive text">Edit</button>
                    <button class="delete-btn" aria-label="Delete task tracking row">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    // XSS Mitigation Security Helper
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // 4. CRUD OPERATIONS ARCHITECTURE

    // Create Action
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (!text) return;

        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };

        state.todos.push(newTodo);
        saveToLocalStorage();
        render();
        todoInput.value = '';
        todoInput.focus();
    });

    // Delegated Event Listeners (Update & Delete Strategy)
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        const todoItem = target.closest('.todo-item');
        if (!todoItem) return;
        
        const id = todoItem.getAttribute('data-id');
        const todoIndex = state.todos.findIndex(item => item.id === id);
        if (todoIndex === -1) return;

        // Toggle Update Action
        if (target.type === 'checkbox') {
            state.todos[todoIndex].completed = target.checked;
            saveToLocalStorage();
            render();
        }

        // Inline Update Text Edit Action
        if (target.classList.contains('edit-btn')) {
            const spanText = document.getElementById(`text-${id}`);
            const currentText = state.todos[todoIndex].text;
            const newText = prompt("Update your task details:", currentText);
            
            if (newText !== null && newText.trim() !== "") {
                state.todos[todoIndex].text = newText.trim();
                saveToLocalStorage();
                render();
            }
        }

        // Delete Action
        if (target.classList.contains('delete-btn')) {
            state.todos.splice(todoIndex, 1);
            saveToLocalStorage();
            render();
        }
    });

    // 5. FILTER STATE CONTROLLER LOGIC
    Object.keys(filterButtons).forEach(filterType => {
        filterButtons[filterType].addEventListener('click', () => {
            state.currentFilter = filterType;
            
            // Handle active styling states
            Object.keys(filterButtons).forEach(type => {
                const btn = filterButtons[type];
                if (type === filterType) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
            render();
        });
    });

    // Initialize UI on startup
    render();
});
