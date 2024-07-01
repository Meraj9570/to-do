const modal = document.getElementById('modal');
const navToggle = document.getElementById('navToggle');
const navModal = document.getElementById('navModal');
const navCloseBtn = document.getElementById('navCloseBtn');
const completeBtn = document.getElementById('completeBtn');
const completeModalCloseBtn = document.getElementById('completeModalClose');
const pendingBtn = document.getElementById('pendingBtn');
const pendingModalCloseBtn = document.getElementById('pendingModalClose');
const newTaskBtn = document.getElementById('new-task-btn');
const taskList = document.querySelector('ul');
let editingTask = null; 

document.addEventListener('DOMContentLoaded', loadTasks);

navToggle.addEventListener('click', () => {
    navModal.classList.add('navModal-active');
});
navCloseBtn.addEventListener('click', () => {
    navModal.classList.remove('navModal-active');
});

completeModalCloseBtn.addEventListener('click', () => {
    completeModal.classList.remove('completeModal-active');

});

completeBtn.addEventListener('click', () => {
    const completeModal = document.getElementById('completeModal');
    const completedList = document.getElementById('completed-tasks-list');
    completeModal.classList.add('completeModal-active');
    navModal.classList.remove('navModal-active');
    completedList.innerHTML = `
            ${loadCompletedTasks()}
    `;
});

function loadCompletedTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    let completedTasksHTML = '';
    if (tasks) {
        tasks.forEach(task => {
            console.log(task.completed)

            if (task.completed) {
                completedTasksHTML += `<li class="text-green-500">${task.text}</li>`;
            }
        });
    }
    if(completedTasksHTML == ''){
        return "No task has been completed";
    }
    return completedTasksHTML;
}


pendingModalCloseBtn.addEventListener('click', () => {
    pendingModal.classList.remove('pendingModal-active');

});

pendingBtn.addEventListener('click', () => {
    const pendingModal = document.getElementById('pendingModal');
    const pendingList = document.getElementById('pending-tasks-list');
    pendingModal.classList.add('pendingModal-active');
    navModal.classList.remove('navModal-active');
    pendingList.innerHTML = `
            ${loadPendingTasks()}
    `;
});

function loadPendingTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    let pendingTasksHTML = '';
    if (tasks) {
        tasks.forEach(task => {

            if (task.completed == false) {
                pendingTasksHTML += `<li class="text-red-500">${task.text}</li>`;
            }
        });
    }
    if(pendingTasksHTML == ''){
        return "No task has been pending";
    }
    return pendingTasksHTML;
}


function showModal(title, buttonText, taskText = '') {
    modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg w-80 p-6">
            <h2 class="text-lg font-semibold mb-4">${title}</h2>
            <input id="task-input" type="text" class="w-full p-2 border border-gray-300 rounded mb-4" placeholder="Enter task" value="${taskText}">
            <div class="flex justify-end">
                <button id="cancel-btn" class="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-400">Cancel</button>
                <button type="submit" id="action-btn" class="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600">${buttonText}</button>
            </div>
        </div>
    `;
    modal.classList.add('modal-active');

    const cancelBtn = document.getElementById('cancel-btn');
    const actionBtn = document.getElementById('action-btn');
    const taskInput = document.getElementById('task-input');

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('modal-active');
        taskInput.value = '';
        editingTask = null;
    });

    actionBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            if (editingTask) {
                // Update existing task
                editingTask.querySelector('span').textContent = taskText;
                editingTask.querySelector('span').classList.remove('completed');
                saveTasks();
            } else {
                // Add new task
                const li = document.createElement('li');
                li.className = 'flex items-center justify-between py-2';
                li.innerHTML = `
                    <label class="flex items-center">
                        <input type="checkbox" name="task" class="text-purple-500">
                        <span class="ml-2">${taskText}</span>
                    </label>
                    <div class="flex items-center">
                        <button class="text-gray-500 hover:text-green-500 edit-btn px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                            </svg>
                        </button>
                        <button class="text-gray-500 hover:text-red-500 remove-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                            </svg>
                        </button>
                    </div>
                `;
                taskList.appendChild(li);
                saveTasks();
            }

            modal.classList.remove('modal-active');
            taskInput.value = '';
            editingTask = null;
        }
    });
}

newTaskBtn.addEventListener('click', () => {
    showModal('Add New Task', 'Add');
});

taskList.addEventListener('click', (event) => {
    const editBtn = event.target.closest('.edit-btn');
    const removeBtn = event.target.closest('.remove-btn');

    if (editBtn) {
        const li = editBtn.closest('li');
        const taskText = li.querySelector('span').textContent;
        editingTask = li;
        showModal('Edit Task', 'Save', taskText);
    }

    if (removeBtn) {
        const li = removeBtn.closest('li');
        li.remove();
        saveTasks();
    }

    const checkbox = event.target.closest('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
        const span = checkbox.parentElement.querySelector('span');
        span.classList.add('line-through');
    } else if (checkbox) {
        const span = checkbox.parentElement.querySelector('span');
        span.classList.remove('line-through');
    }
    saveTasks();
});

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        const taskText = li.querySelector('span').textContent;
        const isCompleted = li.querySelector('input[type="checkbox"]').checked;
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'flex items-center justify-between py-2';
            li.innerHTML = `
                <label class="flex items-center">
                    <input type="checkbox" name="task" class="text-purple-500" ${task.completed ? 'checked' : ''}>
                    <span class="ml-2 ${task.completed ? 'line-through' : ''}">${task.text}</span>
                </label>
                <div class="flex items-center">
                    <button class="text-gray-500 hover:text-green-500 edit-btn px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                        </svg>
                    </button>
                    <button class="text-gray-500 hover:text-red-500 remove-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
}
