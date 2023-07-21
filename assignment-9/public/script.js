document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todoList');
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
  
    // Function to create a task list item
    function createTaskItem(task) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span>${task.text}</span>
        <button class="tick-button">&#10003;</button>
        <button class="remove-button">&#10005;</button>
      `;
      if (task.completed) {
        listItem.classList.add('completed');
      }
      listItem.dataset.id = task.id;
      return listItem;
    }
  
    // Function to update a task item on the server
    async function updateTaskOnServer(task) {
      try {
        await axios.put(`/api/tasks/${task.id}`, { completed: task.completed });
      } catch (error) {
        console.error('Error updating task on the server:', error);
      }
    }
  
    // Function to delete a task item on the server
    async function deleteTaskOnServer(task) {
      try {
        await axios.delete(`/api/tasks/${task.id}`);
      } catch (error) {
        console.error('Error deleting task on the server:', error);
      }
    }
  
    // Fetch tasks from the server on page load
    async function fetchTasks() {
      try {
        const response = await axios.get('/api/tasks');
        const tasks = response.data;
        tasks.forEach((task) => {
          const listItem = createTaskItem(task);
          todoList.appendChild(listItem);
        });
      } catch (error) {
        console.error('Error fetching tasks from the server:', error);
      }
    }
  
    todoList.addEventListener('click', (event) => {
      const listItem = event.target.closest('li');
      if (!listItem) return;
  
      if (event.target.matches('.tick-button')) {
        listItem.classList.toggle('completed');
        const taskId = parseInt(listItem.dataset.id);
        const completed = listItem.classList.contains('completed');
        updateTaskOnServer({ id: taskId, completed });
      } else if (event.target.matches('.remove-button')) {
        const taskId = parseInt(listItem.dataset.id);
        deleteTaskOnServer({ id: taskId });
        listItem.remove();
      }
    });
  
    taskForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const taskText = taskInput.value.trim();
  
      if (taskText !== '') {
        try {
          const response = await axios.post('/api/tasks', { text: taskText });
          const task = response.data;
          const listItem = createTaskItem(task);
          todoList.appendChild(listItem);
          taskInput.value = '';
        } catch (error) {
          console.error('Error adding task on the server:', error);
        }
      }
    });
  
    // Fetch tasks from the server on page load
    fetchTasks();
  });
  