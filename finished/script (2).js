'use strict';

/* ===== STATE ===== */
const TASKS_KEY = 'tasks';
const TIP_KEY = 'dailyTip';
let tasks = [];            // single source of truth: [{ id, title, completed }]
let currentFilter = 'all'; // 'all' | 'pending' | 'completed'

/* ===== DOM REFERENCES ===== */
const form = document.getElementById('taskForm');
const input = document.getElementById('taskInput');
const formError = document.getElementById('formError');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterButtons = document.querySelectorAll('.filter-btn');
const tipBox = document.getElementById('dailyTip');

/* ===== STORAGE: localStorage + JSON ===== */
function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  } catch (error) {
    return []; // corrupted data: start fresh
  }
}

/* ===== CORE LOGIC: change the data, then re-render ===== */
function addTask(title) {
  tasks.push({ id: Date.now(), title: title, completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function getVisibleTasks() {
  if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') return tasks.filter(t => t.completed);
  return tasks;
}

/* ===== RENDERING: the DOM mirrors the array ===== */
function renderTasks() {
  taskList.innerHTML = ''; // safe: clearing, not inserting data
  const visible = getVisibleTasks();

  visible.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'task completed' : 'task';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task complete');
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = task.title; // textContent: user text is never run as HTML

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '\u{1F5D1}';
    del.setAttribute('aria-label', 'Delete task');
    del.addEventListener('click', () => deleteTask(task.id));

    li.append(checkbox, title, del);
    taskList.appendChild(li);
  });

  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No tasks here yet.';
    taskList.appendChild(empty);
  }

  const pending = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${pending} pending of ${tasks.length} total`;
}

/* ===== EVENTS ===== */
form.addEventListener('submit', event => {
  event.preventDefault();                 // stop the page reload
  const title = input.value.trim();       // strip accidental spaces
  if (title === '') {
    formError.textContent = 'Please enter a task.';
    return;
  }
  if (title.length > 100) {
    formError.textContent = 'Keep it under 100 characters.';
    return;
  }
  formError.textContent = '';
  addTask(title);
  input.value = '';
  input.focus();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(b => b.classList.toggle('active', b === button));
    renderTasks();
  });
});

/* ===== API SPRINT: Daily Tip via fetch + async/await ===== */
const FALLBACK_TIPS = [
  'Write code for humans, not just machines.',
  'Commit small and commit often.',
  'Read the error message. Then read it again.',
  'Name things clearly. Future you will say thanks.',
  'Make it work, make it right, make it fast.'
];

function todayKey() {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
}

function readCachedTip() {
  try {
    const cached = JSON.parse(localStorage.getItem(TIP_KEY));
    return cached && cached.date === todayKey() ? cached.text : null;
  } catch (error) {
    return null;
  }
}

async function loadDailyTip() {
  const cached = readCachedTip();
  if (cached) {
    tipBox.textContent = cached;
    return;
  }
  try {
    const response = await fetch('https://dummyjson.com/quotes/random');
    if (!response.ok) throw new Error('Request failed: ' + response.status);
    const data = await response.json();
    const text = `${data.quote} \u2014 ${data.author}`;
    tipBox.textContent = text; // textContent, never innerHTML
    localStorage.setItem(TIP_KEY, JSON.stringify({ date: todayKey(), text: text }));
  } catch (error) {
    tipBox.textContent = FALLBACK_TIPS[new Date().getDate() % FALLBACK_TIPS.length];
  }
}

/* ===== INIT ===== */
tasks = loadTasks();
renderTasks();
loadDailyTip();
