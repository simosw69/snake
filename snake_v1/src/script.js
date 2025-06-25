const timerEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const startBtnEl = document.getElementById('start-btn');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let gameLoopId;
let timerId;
let sec = 0;
let min = 0;
let score = 0;

const gridSize = 40;
const tileCount = canvas.width / gridSize;

let snake = [{ x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) }];
let apple = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let velocity = { x: 1, y: 0 };
let length = 1;
let gameOver = false;


function startTimer() {
  timerId = setInterval(() => {
    sec++;
    if (sec == 60) {
      sec = 0;
      min++;
    }
    timerEl.textContent = min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

function updateScore() {
  scoreEl.textContent = score;
}

window.addEventListener('keydown', (e) => {
  switch (e.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      if (velocity.y !== 1) velocity = { x: 0, y: -1 };
      break;
    case 's':
    case 'arrowdown':
      if (velocity.y !== -1) velocity = { x: 0, y: 1 };
      break;
    case 'a':
    case 'arrowleft':
      if (velocity.x !== 1) velocity = { x: -1, y: 0 };
      break;
    case 'd':
    case 'arrowright':
      if (velocity.x !== -1) velocity = { x: 1, y: 0 };
      break;
  }
});

const img = new Image();
img.src = '../img/mela.webp';

function startGame() {
  startBtnEl.style.pointerEvents = 'none';
  startBtnEl.style.opacity = '0';
  newApple();
  startTimer();
  gameLoopId = setInterval(gameLoop, 200);
}

function newApple() {
  apple.x = Math.floor(Math.random() * tileCount);
  apple.y = Math.floor(Math.random() * tileCount);
  for (let part of snake) {
    if (apple.x == part.x && apple.y == part.y) {
      newApple();
      break;
    }
  }
}

function isColliding(head) {
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) return true;
  for (let part of snake) {
    if (head.x == part.x && head.y == part.y) return true;
  }
  return false;
}

function isAppleCaught(head) {
  return head.x == apple.x && head.y == apple.y;
}

function isWin() {
    if(snake.length == Math.pow(tileCount, 2)-1)
        return true;

    return false;
} 

function gameLoop() {
  if (gameOver) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
    clearInterval(timerId);
    clearInterval(gameLoopId);
    return;
  }

  if(isWin()) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText('Hai vinto!', canvas.width / 2, canvas.height / 2);
    clearInterval(timerId);
    clearInterval(gameLoopId);
    return;
  }

  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };
  if (isColliding(head)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (isAppleCaught(head)) {
    score += 10;
    length++;
    newApple();
    updateScore();
  }

  while (snake.length > length) snake.pop();

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);

  ctx.fillStyle = 'green';
  for (let part of snake) ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
}