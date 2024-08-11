function addTask(columnId) {
    const input = document.getElementById(`new-task-${columnId}`);
    const taskText = input.value.trim();
    if (taskText !== "") {
        const taskList = document.getElementById(`${columnId}-tasks`);
        const task = document.createElement("div");
        task.className = "task";
        task.draggable = true;
        task.ondragstart = drag;
        task.id = `task-${new Date().getTime()}`;
        task.innerHTML = `${taskText} <span onclick="deleteTask(this)">×</span>`;
        taskList.appendChild(task);
        input.value = "";
        saveTasks();
    }
}

function deleteTask(element) {
    const task = element.parentElement;
    task.remove();
    saveTasks();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event, columnId) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const task = document.getElementById(taskId);
    document.getElementById(`${columnId}-tasks`).appendChild(task);
    saveTasks();
}

function saveTasks() {
    const columns = ['todo', 'in-progress', 'done'];
    const tasks = {};

    columns.forEach(column => {
        const taskList = document.getElementById(`${column}-tasks`);
        tasks[column] = [];
        taskList.querySelectorAll('.task').forEach(task => {
            tasks[column].push(task.innerText.slice(0, -2)); // Remove the delete "×"
        });
    });

    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('kanban-tasks'));

    if (tasks) {
        Object.keys(tasks).forEach(column => {
            tasks[column].forEach(taskText => {
                const taskList = document.getElementById(`${column}-tasks`);
                const task = document.createElement("div");
                task.className = "task";
                task.draggable = true;
                task.ondragstart = drag;
                task.id = `task-${new Date().getTime()}`;
                task.innerHTML = `${taskText} <span onclick="deleteTask(this)">×</span>`;
                taskList.appendChild(task);
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    document.querySelectorAll(".task-list").forEach(taskList => {
        taskList.ondrop = event => drop(event, taskList.id.split('-')[0]);
        taskList.ondragover = allowDrop;
    });
});