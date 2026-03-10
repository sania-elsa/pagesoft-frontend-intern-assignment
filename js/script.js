document.addEventListener('DOMContentLoaded', () => {

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    renderTasks();

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        todoInput.value = "";
        renderTasks();
    });

    function renderTasks() {
        todoList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = "todo-item";

            li.innerHTML = `
                ${task.text}
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;

            todoList.appendChild(li);
        });
    }

    window.deleteTask = function (id) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

});