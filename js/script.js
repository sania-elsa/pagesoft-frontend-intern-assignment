document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Digital Clock
    const clockElement = document.getElementById('clock');

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // 2. Dark/Light Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');

    // Check localStorage or System Preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkMode();
    } else {
        enableLightMode();
    }

    // Toggle Event Listener
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');

        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';

        themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    }

    function enableLightMode() {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');

        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';

        themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
    // 3. Footer Dynamic Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 4. Todo List Logic
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    let tasks = JSON.parse(localStorage.getItem('dashboard_tasks')) || [];
    renderTasks();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveAndRender();
        todoInput.value = '';
        todoInput.focus();
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('todo-checkbox')) {
            const taskId = e.target.getAttribute('data-id');
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                saveAndRender();
            }
        }

        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            const taskId = deleteBtn.getAttribute('data-id');
            tasks = tasks.filter(task => task.id !== taskId);
            saveAndRender();
        }
    });

    function saveAndRender() {
        localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        todoList.innerHTML = '';
        if (tasks.length === 0) {
            todoList.innerHTML = '<li style="text-align: center; color: var(--text-secondary); padding: 2rem 1rem;">No tasks found. Add a new task above!</li>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="todo-content">
                    <input type="checkbox" class="todo-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark task">
                    <span class="todo-text">${escapeHTML(task.text)}</span>
                </div>
                <button type="button" class="btn-delete" data-id="${task.id}" aria-label="Delete task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            `;
            todoList.appendChild(li);
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
    }
});