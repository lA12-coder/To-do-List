document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.querySelector(".input");
  const addBtn = document.getElementById("addbtn");
  const ul = document.querySelector(".task-list ul");
  let tasks = [];
  let isEditing = false;
  let currentEditLi = null;
  let originalTask = "";

  // Utility: Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("Data", JSON.stringify(tasks));
  }

  // Utility: Render all tasks
  function renderTasks() {
    ul.innerHTML = "";
    tasks.forEach((task) => {
      ul.appendChild(createTaskElement(task));
    });
  }

  // Create a task <li> element
  function createTaskElement(task) {
    const li = document.createElement("li");
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task;
    li.appendChild(textSpan);

    const buttondiv = document.createElement("div");
    buttondiv.className = "button-div";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    const Img = document.createElement("img");
    Img.src = "/images/pencil_icon.png";
    Img.alt = "Edit";
    Img.width = 25;
    Img.height = 25;
    editBtn.appendChild(Img);
    buttondiv.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "delete-btn";
    buttondiv.appendChild(deleteBtn);

    li.appendChild(buttondiv);

    // Toggle checked
    li.addEventListener("click", function (event) {
      if (event.target === li && !isEditing) {
        li.classList.toggle("checked");
      }
    });

    // Edit handler
    editBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      if (isEditing) return;
      isEditing = true;
      currentEditLi = li;
      originalTask = textSpan.textContent;
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = originalTask;
      editInput.className = "edit-input";
      textSpan.style.display = "none";
      li.insertBefore(editInput, textSpan);
      editInput.focus();
      // Disable all buttons except edit input
      document
        .querySelectorAll("button")
        .forEach((btn) => (btn.disabled = true));
      editInput.disabled = false;
      // Save on Enter
      editInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") finishEdit(true);
      });
      // Cancel on blur
      editInput.addEventListener("blur", function () {
        finishEdit(false);
      });
    });

    // Delete handler
    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      if (isEditing) return;
      const idx = tasks.indexOf(textSpan.textContent);
      if (idx !== -1) {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
      }
    });

    return li;
  }

  // Add a new task
  function addTask(task) {
    if (!task || tasks.includes(task)) return;
    tasks.push(task);
    saveTasks();
    renderTasks();
    inputField.value = "";
  }

  // Finish editing
  function finishEdit(save) {
    if (finishEdit.called) return;
    finishEdit.called = true;
    if (!isEditing || !currentEditLi) {
      finishEdit.called = false;
      return;
    }
    const editInput = currentEditLi.querySelector(".edit-input");
    const textSpan = currentEditLi.querySelector(".task-text");
    let updated = false;
    if (save && editInput.value.trim() !== "") {
      const newValue = editInput.value.trim();
      if (!tasks.includes(newValue)) {
        const idx = tasks.indexOf(originalTask);
        if (idx !== -1) {
          tasks[idx] = newValue;
          updated = true;
        }
      }
    }
    textSpan.style.display = "";
    if (editInput && editInput.parentNode) editInput.remove();
    document
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
    isEditing = false;
    currentEditLi = null;
    originalTask = "";
    if (updated) {
      saveTasks();
    }
    renderTasks();
    setTimeout(() => {
      finishEdit.called = false;
    }, 0);
  }

  // Load tasks from localStorage
  function fetchData() {
    try {
      tasks = JSON.parse(localStorage.getItem("Data")) || [];
      if (!Array.isArray(tasks)) tasks = [];
    } catch (e) {
      tasks = [];
    }
    renderTasks();
  }
  fetchData();

  // Add button click
  function handleAddTask() {
    const value = inputField.value.trim();
    if (!value) {
      alert("Please enter a task!");
      return;
    }
    addTask(value);
  }
  addBtn.addEventListener("click", handleAddTask);
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") handleAddTask();
  });
});
