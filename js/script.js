const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const filterBtn = document.getElementById('filterBtn');
const todoBody = document.getElementById('todoBody');

let todos = JSON.parse(localStorage.getItem('todos_v1') || '[]');

function saveTodos(){ localStorage.setItem('todos_v1', JSON.stringify(todos)) }

function renderTodos(filteredTodos = todos){
  todoBody.innerHTML = '';
  const list = filteredTodos.length ? filteredTodos : [];
  if(list.length === 0){ todoBody.innerHTML = '<tr><td colspan="4" class="no-tasks">No task found</td></tr>'; return; }
  list.forEach((todo, index)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(todo.text)}</td>
      <td>${escapeHtml(todo.date)}</td>
      <td>${todo.completed ? '✅' : '⏳'}</td>
      <td class="row-actions">
        <button class="btn-small btn-done" data-index="${index}">Done</button>
        <button class="btn-small btn-delete" data-index="${index}">Delete</button>
      </td>
    `;
    todoBody.appendChild(tr);
  });
}

function addTodo(){
  const text = todoInput.value.trim();
  const date = dateInput.value;
  if(!text || !date){ alert('Please fill in both todo and date fields.'); return; }
  const confirmAdd = confirm(`Apakah kamu yakin memasukkan input to-do untuk tanggal ${date}?`);
  if(!confirmAdd) return;
  todos.push({ text, date, completed:false });
  saveTodos();
  todoInput.value=''; dateInput.value='';
  renderTodos();
}

function deleteTodo(index){
  todos.splice(index,1);
  saveTodos();
  renderTodos();
}

function toggleComplete(index){
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteAll(){
  if(todos.length===0) return;
  if(confirm('Apakah kamu yakin ingin menghapus semua to-do?')){
    todos = []; saveTodos(); renderTodos();
  }
}

function filterTodos(){
  const today = new Date().toISOString().split('T')[0];
  const filtered = todos.filter(t => t.date === today);
  renderTodos(filtered);
}

addBtn.addEventListener('click', addTodo);
deleteAllBtn.addEventListener('click', deleteAll);
filterBtn.addEventListener('click', filterTodos);

document.addEventListener('click', (e)=>{
  if(e.target.matches('.btn-delete')) deleteTodo(Number(e.target.dataset.index));
  if(e.target.matches('.btn-done')) toggleComplete(Number(e.target.dataset.index));
});

function escapeHtml(str){ return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') }

renderTodos();