function initializeTasks(taskInput, addTaskButton, taskListUl) {
    let tasks = JSON.parse(localStorage.getItem('tasks_v4')) || [];

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks_v4', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskListUl.innerHTML = '';
        if (tasks.length === 0) {
            const li = document.createElement('li');
            li.textContent = "No tasks yet!";
            li.style.textAlign = "center"; 
            li.style.color = "#888";
            taskListUl.appendChild(li);
            return;
        }
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            const taskSpan = document.createElement('span');
            taskSpan.textContent = task.text;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-btn' + (task.completed ? ' completed-task' : '');
            toggleButton.innerHTML = task.completed ? '&#x21B6;' : '&#x2714;'; 
            toggleButton.title = task.completed ? 'Mark Incomplete' : 'Mark Complete';
            toggleButton.onclick = () => {
                tasks[index].completed = !tasks[index].completed;
                saveTasksToLocalStorage();
                renderTasks();
            };

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '&#x1F5D1;'; 
            deleteButton.title = 'Delete Task';
            deleteButton.onclick = () => {
                tasks.splice(index, 1);
                saveTasksToLocalStorage();
                renderTasks();
            };

            actionsDiv.appendChild(toggleButton);
            actionsDiv.appendChild(deleteButton);
            li.appendChild(taskSpan);
            li.appendChild(actionsDiv);
            taskListUl.appendChild(li);
        });
    }

    if (addTaskButton) {
        addTaskButton.onclick = () => {
            const text = taskInput.value.trim();
            if (text) {
                tasks.push({ text: text, completed: false });
                taskInput.value = ''; 
                saveTasksToLocalStorage();
                renderTasks();
            } else {
                alert('Please enter a task.'); 
            }
        };
    }

    if (taskInput) {
        taskInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                if (addTaskButton) addTaskButton.click();
            }
        };
    }
    renderTasks();
}