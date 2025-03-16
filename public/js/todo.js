$(document).ready(function () {
    loadTodos();   // sayfa yüklendiğinde todo görevlerini getiriyor
  });
  

  //görevlerin yüklenmesi ve listelenmesi
  async function loadTodos(filter = 'all') {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    const todoList = $('#todoList');
    todoList.empty();
  
    todos.forEach(todo => {
      if (filter === 'all' || (filter === 'done' && todo.done) || (filter === 'todo' && !todo.done)) {
        const item = `
          <li class="list-group-item ${todo.done ? 'done' : ''}">
            <span>${todo.title}</span>
            <div>
              <button class="btn btn-sm btn-success me-1" onclick="toggleDone(${todo.id})">${todo.done ? 'Undo' : 'Done'}</button>
              <button class="btn btn-sm btn-warning me-1" onclick="editTodo(${todo.id}, '${todo.title}')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
          </li>`;
        todoList.append(item);
      }
    });
  }
   //görev ekleme
  async function addTodo() {
    const title = $('#todoInput').val().trim();
    if (!title) return alert('Please enter a task!');
  
    try {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, done: false })
      });
      $('#todoInput').val('');
      loadTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add task. Please try again.');
    }
  }
   //görev durumunu değiştirme
  async function toggleDone(id) {
    try {
      const response = await fetch(`/api/todos/${id}`);
      const todo = await response.json();
      await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, done: !todo.done })
      });
      loadTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
      alert('Failed to update task. Please try again.');
    }
  }
  //görev editleme
  async function editTodo(id, currentTitle) {
    const newTitle = prompt('Edit task:', currentTitle);
    if (!newTitle || newTitle.trim() === currentTitle) return;
  
    try {
      const response = await fetch(`/api/todos/${id}`);
      const todo = await response.json();
      await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...todo, title: newTitle.trim() })
      });
      loadTodos();
    } catch (error) {
      console.error('Error editing todo:', error);
      alert('Failed to edit task. Please try again.');
    }
  }
  //görev silme
  async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
  
    try {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      alert('Failed to delete task. Please try again.');
    }
  }
  //tamamlanan görevleri silme
  async function deleteDoneTasks() {
    if (!confirm('Delete all done tasks?')) return;
    const response = await fetch('/api/todos');
    const todos = await response.json();
  
    try {
      const doneTodos = todos.filter(todo => todo.done);
      for (const todo of doneTodos) {
        await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
      }
      loadTodos();
    } catch (error) {
      console.error('Error deleting done tasks:', error);
      alert('Failed to delete done tasks. Please try again.');
    }
  }
   //tüm görevleri silme
  async function deleteAllTasks() {
    if (!confirm('Delete all tasks?')) return;
    const response = await fetch('/api/todos');
    const todos = await response.json();
  
    try {
      for (const todo of todos) {
        await fetch(`/api/todos/${todo.id}`, { method: 'DELETE' });
      }
      loadTodos();
    } catch (error) {
      console.error('Error deleting all tasks:', error);
      alert('Failed to delete all tasks. Please try again.');
    }
  }
  
  function filterTodos(filter) {
    loadTodos(filter);
  }
  