let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const ctx = document.getElementById('taskChart').getContext('2d');
let taskChart;

// --- Ukládání ---
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- Render úkolů ---
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name + (task.reminder ? ` ⏰ ${task.reminder}` : '');
        li.className = task.category + (task.completed ? ' completed' : '');
        li.onclick = () => toggleTask(task.id);
        taskList.appendChild(li);
    });
    updateChart(); // funkce z charts.js
}

// --- Přidání úkolu ---
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('task-name').value;
    const category = document.getElementById('task-category').value;
    const reminder = document.getElementById('task-reminder').value || null;

    const task = {
        id: Date.now(),
        name,
        category,
        completed: false,
        date: new Date().toISOString().split('T')[0],
        reminder
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskForm.reset();

    if (Notification.permission === "granted") {
        new Notification("Nový úkol přidán!", { body: name });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") new Notification("Nový úkol přidán!", { body: name });
        });
    }
});

// --- Přepnutí dokončení ---
function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? {...task, completed: !task.completed} : task);
    saveTasks();
    renderTasks();
}

// --- Kontrola připomenutí každou minutu ---
function checkReminders() {
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5); // HH:MM
    tasks.forEach(task => {
        if(task.reminder === timeStr && !task.completed) {
            alert(`Připomenutí: ${task.name}`);
        }
    });
}
setInterval(checkReminders, 60000);

// --- Inicializace ---
renderTasks();
