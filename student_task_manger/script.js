
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("searchInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filters = document.querySelectorAll(".filter");

// Save tasks in Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask(title) {
    tasks.push({
        id: Date.now(),
        title: title,
        completed: false
    });

    saveTasks();
    displayTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks();
}

// Mark a task completed or pending
function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    displayTasks();
}

// Search and filter tasks
function displayTasks() {
    const search = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    taskList.replaceChildren();

    taskCount.textContent =
        `${tasks.length} tasks | ${tasks.filter(t => t.completed).length} completed`;

    if (filteredTasks.length === 0) {
        const message = document.createElement("li");
        message.className = "empty";
        message.textContent = "No tasks found.";
        taskList.appendChild(message);
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.completed ? "task completed" : "task";

        const title = document.createElement("span");
        title.textContent = task.title;

        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.onclick = () => toggleTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id);

        li.append(title, completeBtn, deleteBtn);
        taskList.appendChild(li);
    });
}

// Handle Add Task form
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    addTask(title);
    taskInput.value = "";
    taskInput.focus();
});

// Handle search
searchInput.addEventListener("input", displayTasks);

// Handle All, Pending and Completed filters
filters.forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = this.dataset.filter;

        filters.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        displayTasks();
    });
});

// Load saved tasks when the page opens
displayTasks();