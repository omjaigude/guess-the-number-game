let targetNumber, tries, maxChoiceTries = 2, currentChoiceTries = 0, winCount = 0;
let gameMode = 'type'; // default mode
let maxRange = 100;    // default range

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

function startGame() {
  maxRange = parseInt(document.getElementById('rangeSelect').value);
  gameMode = document.getElementById('modeSelect').value;

  targetNumber = getRandomInt(maxRange);
  tries = 0;
  currentChoiceTries = 0;

  document.getElementById('message').textContent = '';
  document.getElementById('guessInput').value = '';
  document.getElementById('triesCount').textContent = '0';
  document.getElementById('popup').style.display = 'none';
  document.getElementById('guessInput').disabled = false;

  toggleMode();

  if (gameMode === 'choice') {
    generateChoiceButtons();
  }
}

function submitGuess() {
  const guessInput = document.getElementById('guessInput');
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > maxRange) {
    document.getElementById('message').textContent = `Please enter a number between 1 and ${maxRange}`;
    return;
  }

  tries++;
  document.getElementById('triesCount').textContent = tries;

  if (guess === targetNumber) {
    winCount++;
    document.getElementById('winCount').textContent = winCount;
    showPopup(`🎉 You guessed the number successfully in ${tries} tries!`);
    saveHistory(guess, tries);
    document.getElementById('guessInput').disabled = true;
  } else {
    document.getElementById('message').textContent = guess > targetNumber ? 'Too high!' : 'Too low!';
  }
}

function toggleMode() {
  gameMode = document.getElementById('modeSelect').value;
  const typeInput = document.getElementById('typeInput');
  const choiceButtons = document.getElementById('choiceButtons');

  if (gameMode === 'type') {
    typeInput.style.display = 'block';
    choiceButtons.style.display = 'none';
  } else {
    typeInput.style.display = 'none';
    choiceButtons.style.display = 'flex';
  }
}

function generateChoiceButtons() {
  const container = document.getElementById('choiceButtons');
  container.innerHTML = '';

  let options = new Set([targetNumber]);
  while (options.size < 4) {
    options.add(getRandomInt(maxRange));
  }

  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);
  shuffled.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.disabled = false;
    btn.onclick = () => handleChoice(option);
    container.appendChild(btn);
  });

  currentChoiceTries = 0;
  document.getElementById('triesCount').textContent = '0';
  document.getElementById('message').textContent = '';
  document.getElementById('popup').style.display = 'none';
}

function handleChoice(choice) {
  currentChoiceTries++;
  document.getElementById('triesCount').textContent = currentChoiceTries;

  if (choice === targetNumber) {
    winCount++;
    document.getElementById('winCount').textContent = winCount;
    showPopup(`🎉 You guessed the number successfully in ${currentChoiceTries} tries!`);
    saveHistory(choice, currentChoiceTries);
    disableChoiceButtons();
  } else {
    if (currentChoiceTries >= maxChoiceTries) {
      document.getElementById('message').textContent = `😞 Out of tries! The number was ${targetNumber}.`;
      disableChoiceButtons();
    } else {
      document.getElementById('message').textContent = '❌ Wrong guess! Try again.';
    }
  }
}

function disableChoiceButtons() {
  const buttons = document.getElementById('choiceButtons').querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);
}

function showPopup(message) {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.style.display = 'block';
}

function saveHistory(guess, tries) {
  const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
  history.push({ guess, tries, date: new Date().toLocaleString() });
  localStorage.setItem('gameHistory', JSON.stringify(history));
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  const history = JSON.parse(localStorage.getItem('gameHistory') || '[]');
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  history.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `Game ${index + 1}: Guessed ${item.guess} in ${item.tries} tries on ${item.date}`;
    historyList.appendChild(li);
  });
}

window.onload = () => {
  updateHistoryDisplay();
  startGame();
};
// All your existing game code remains the same above...

// --- DARK/LIGHT MODE TOGGLE CODE ---

// Check saved theme or system preference on load
window.onload = () => {
  loadTheme();
  updateHistoryDisplay();
  startGame();
};

function toggleTheme() {
  const body = document.body;
  if (body.classList.contains('light-mode')) {
    body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  } else {
    // If no saved theme, detect system preference
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) {
      document.body.classList.add('light-mode');
    }
  }
}

// -------------------
// Place all your existing game functions (startGame, submitGuess, toggleMode, etc.) below this line or above window.onload
