// Time and Date
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('time').textContent = timeString;
  document.getElementById('date').textContent = dateString;
}

function updateGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12
    ? "Good Morning ☀️"
    : hour < 17
    ? "Good Afternoon 🌤️"
    : "Good Evening 🌙";
  document.getElementById('greeting').textContent = greeting;
}

async function updateWeather() {
  try {
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.23&current=temperature_2m,weathercode&forecast_days=1");
    const data = await res.json();
    const temp = data.current.temperature_2m;
    const code = data.current.weathercode;

    const codeMap = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
      51: "🌦️", 61: "🌧️", 71: "🌨️", 95: "⛈️"
    };

    document.getElementById("weather-info").textContent = `It is currently ${temp}°C in Delhi.`;
    document.getElementById("weather-icon").textContent = codeMap[code] || "🌥️";
    document.getElementById("weather-temp").textContent = `${temp}°`;
  } catch (err) {
    document.getElementById("weather-info").textContent = "Weather unavailable.";
  }
}

const quotes = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "In the middle of difficulty lies opportunity.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "I believe that you should gravitate to people who are doing productive and positive things with their lives.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It is during our darkest moments that we must focus to see the light.",
  "The only impossible journey is the one you never begin.",
  "In the middle of difficulty lies opportunity.",
  "Believe you can and you're halfway there."
];

function updateQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quote').textContent = randomQuote;
}

let todos = [];

function loadTodos() {
  todos = JSON.parse(localStorage.getItem('todos') || '[]');
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
    return;
  }

  todos.forEach((todo, index) => {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.innerHTML = `
      <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"></div>
      <input type="text" class="todo-text ${todo.completed ? 'completed' : ''}" value="${todo.text}" readonly>
      <button class="delete-btn">Delete</button>
    `;

    const checkbox = todoItem.querySelector('.todo-checkbox');
    const input = todoItem.querySelector('.todo-text');
    const deleteBtn = todoItem.querySelector('.delete-btn');

    checkbox.addEventListener('click', () => toggleTodo(index));
    input.addEventListener('click', () => editTodo(input, index));
    deleteBtn.addEventListener('click', () => deleteTodo(index));

    todoList.appendChild(todoItem);
  });
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    input.value = '';
  }
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function editTodo(input, index) {
  input.readOnly = false;
  input.focus();
  input.select();

  input.addEventListener('blur', function () {
    todos[index].text = input.value;
    saveTodos();
    renderTodos();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

document.getElementById('addTodoBtn').addEventListener('click', addTodo);
document.getElementById('todoInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    addTodo();
  }
});

function init() {
  if (!localStorage.getItem('todos')) {
    const initialTodos = [
      { text: "study Japanese", completed: false },
      { text: "Learn more on https://bonjour.fr/docs/overview", completed: false }
    ];
    localStorage.setItem('todos', JSON.stringify(initialTodos));
  }

  updateTime();
  updateGreeting();
  updateWeather();
  updateQuote();
  loadTodos();

  setInterval(updateTime, 1000);
  setInterval(updateGreeting, 3600000);
  setInterval(updateQuote, 30000);
}

init();
