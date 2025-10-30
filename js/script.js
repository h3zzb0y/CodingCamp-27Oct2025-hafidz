const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const filterBtn = document.getElementById('filterBtn');
const todoBody = document.getElementById('todoBody');

let todos = JSON.parse(localStorage.getItem('todos_v1') || '[]');

// Save todos to localStorage
function saveTodos(){ localStorage.setItem('todos_v1', JSON.stringify(todos)) }

// Add a new todo
function addTodo(){
  const text = todoInput.value.trim();
  const date = dateInput.value;
  if(!text || !date){ alert('Form atau Tanggal Tidak Boleh Kosong!'); return; }
  const confirmAdd = confirm(`Masukkan ${text} untuk tanggal ${date}?`);
  if(!confirmAdd) return;
  todos.push({ text, date, completed:false });
  saveTodos();
  todoInput.value=''; dateInput.value='';
  renderTodos();
}

// Render todos to the table
function renderTodos(filteredTodos = todos){
todoBody.innerHTML = '';
const list = filteredTodos.length ? filteredTodos : [];
if(list.length === 0){ todoBody.innerHTML = '<tr><td colspan="4" class="no-tasks">No task found</td></tr>'; return; }
list.forEach((todo, index)=>{
const tr = document.createElement('tr');
const textClass = todo.completed ? 'completed-task' : '';
tr.innerHTML = `
<td class="${textClass}">${escapeHtml(todo.text)}</td>
<td class="${textClass}">${escapeHtml(todo.date)}</td>
<td>${todo.completed ? 'Done' : 'Pending'}</td>
<td class="row-actions">
<button class="btn-small btn-done" data-index="${index}">Done</button>
<button class="btn-small btn-delete" data-index="${index}">Delete</button>
</td>
`;
todoBody.appendChild(tr);
});
}

// Delete a specific todo
function deleteTodo(index){
  todos.splice(index,1);
  saveTodos();
  renderTodos();
}

// Toggle todo completion status
function toggleComplete(index){
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// Delete all todos
function deleteAll(){
  if(todos.length===0) return;
  if(confirm('Apakah kamu yakin ingin menghapus semua to-do?')){
    todos = []; saveTodos(); renderTodos();
  }
}

// Filter todos based on status
function filterTodos(){
  const today = new Date().toISOString().split('T')[0];
  const filtered = todos.filter(t => t.date === today);
  renderTodos(filtered);
}

/// Event Listeners
addBtn.addEventListener('click', addTodo);
deleteAllBtn.addEventListener('click', deleteAll);
filterBtn.addEventListener('click', filterTodos);

document.addEventListener('click', (e)=>{
  if(e.target.matches('.btn-delete')) deleteTodo(Number(e.target.dataset.index));
  if(e.target.matches('.btn-done')) toggleComplete(Number(e.target.dataset.index));
});

function escapeHtml(str){ return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

renderTodos();