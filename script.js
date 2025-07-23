// Function to add a new task
function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  const taskList = document.getElementById("taskList");
  const taskItem = document.createElement("li");
  taskItem.className = "task-item";

  taskItem.innerHTML = `
                <div class="task-content">
                    <span class="task-text">${taskText}</span>
                    <span class="task-status incomplete">Pending</span>
                </div>
                <div class="task-actions">
                    <button class="action-btn complete-btn" onclick="toggleComplete(this)">✓</button>
                    <button class="action-btn edit-btn" onclick="enableEditMode(this)">✏️</button>
                    <button class="action-btn delete-btn" onclick="deleteTask(this)">🗑️</button>
                </div>
            `;

  taskList.appendChild(taskItem);
  input.value = "";

  // Save tasks to localStorage
  saveTasks();
}

// Function to delete a task
function deleteTask(button) {
  const taskItem = button.closest(".task-item");
  taskItem.classList.add("fade-out");

  setTimeout(() => {
    taskItem.remove();
    saveTasks();
  }, 300);
}

// Function to enable edit mode for a task
function enableEditMode(button) {
  const taskItem = button.closest(".task-item");
  const taskContent = taskItem.querySelector(".task-content");
  const taskText = taskContent.querySelector(".task-text");
  const currentText = taskText.textContent;

  taskContent.innerHTML = `
                <input type="text" class="edit-input" value="${currentText}">
                <button class="save-btn" onclick="saveTaskEdit(this)">Save</button>
            `;

  // Focus the input field and select all text
  const editInput = taskContent.querySelector(".edit-input");
  editInput.focus();
  editInput.select();
}

// Function to save edited task
function saveTaskEdit(button) {
  const taskItem = button.closest(".task-item");
  const taskContent = taskItem.querySelector(".task-content");
  const editInput = taskContent.querySelector(".edit-input");
  const newText = editInput.value.trim();

  if (newText === "") {
    alert("Task cannot be empty");
    return;
  }

  taskContent.innerHTML = `
                <span class="task-text">${newText}</span>
            `;
  // Remove any duplicate actions divs that might exist
  const existingActions = taskItem.querySelectorAll(".task-actions");
  if (existingActions.length > 1) {
    existingActions[0].remove();
  }

  // Get the existing actions div instead of creating a new one
  const taskActions = taskItem.querySelector(".task-actions");
  taskActions.innerHTML = `
                <button class="action-btn edit-btn" onclick="enableEditMode(this)">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteTask(this)">🗑️</button>
            `;

  // Save tasks to localStorage
  saveTasks();
}

// Function to save tasks to localStorage
function toggleComplete(button) {
  const taskItem = button.closest(".task-item");
  const status = taskItem.querySelector(".task-status");

  if (status.classList.contains("incomplete")) {
    status.classList.remove("incomplete");
    status.classList.add("complete");
    status.textContent = "Completed";
    button.textContent = "↩️";
  } else {
    status.classList.remove("complete");
    status.classList.add("incomplete");
    status.textContent = "Pending";
    button.textContent = "✓";
  }
  saveTasks();
}

function saveTasks() {
  const taskList = document.getElementById("taskList");
  const tasks = [];

  taskList.querySelectorAll(".task-item").forEach((task) => {
    const text = task.querySelector(".task-text").textContent;
    const status = task
      .querySelector(".task-status")
      .classList.contains("complete")
      ? "complete"
      : "incomplete";
    tasks.push({ text, status });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);
    const taskList = document.getElementById("taskList");

    tasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.className = "task-item";

      const isComplete = task.status === "complete";

      taskItem.innerHTML = `
                        <div class="task-content">
                            <span class="task-text">${task.text}</span>
                            <span class="task-status ${
                              isComplete ? "complete" : "incomplete"
                            }">
                                ${isComplete ? "Completed" : "Pending"}
                            </span>
                        </div>
                        <div class="task-actions">
                            <button class="action-btn complete-btn" onclick="toggleComplete(this)">
                                ${isComplete ? "↩️" : "✓"}
                            </button>
                            <button class="action-btn edit-btn" onclick="enableEditMode(this)">✏️</button>
                            <button class="action-btn delete-btn" onclick="deleteTask(this)">🗑️</button>
                        </div>
                    `;

      taskList.appendChild(taskItem);
    });
  }
}

// Initialize the app when the page loads
window.onload = function () {
  loadTasks();

  // Add task when pressing Enter in the input field
  document
    .getElementById("taskInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        addTask();
      }
    });
};
