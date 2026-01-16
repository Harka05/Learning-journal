const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let snake = [{x: 150, y: 150}];
let food = {x: 60, y: 60};
let dx = 10, dy = 0;
let score = 0;
let game;

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const noteEl = document.getElementById("note");

/* FETCH HIGH SCORE */
fetch("/api/snake")
  .then(r => r.json())
  .then(d => highScoreEl.textContent = d.highScore);

function draw() {
  ctx.clearRect(0,0,300,300);

  ctx.fillStyle = "#4ade80";
  snake.forEach(p => ctx.fillRect(p.x, p.y, 10, 10));

  ctx.fillStyle = "#f87171";
  ctx.fillRect(food.x, food.y, 10, 10);
}

function move() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  if (hitWall(head) || hitSelf(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }

  draw();
}

function randomFood() {
  return {
    x: Math.floor(Math.random()*30)*10,
    y: Math.floor(Math.random()*30)*10
  };
}

function hitWall(h) {
  return h.x < 0 || h.y < 0 || h.x >= 300 || h.y >= 300;
}

function hitSelf(h) {
  return snake.some(p => p.x === h.x && p.y === h.y);
}

function endGame() {
  clearInterval(game);

  fetch("/api/snake", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      score,
      note: noteEl.value,
      date: new Date().toLocaleString()
    })
  });

  setTimeout(start, 300);
}

function start() {
  snake = [{x: 150, y: 150}];
  dx = 10; dy = 0;
  score = 0;
  scoreEl.textContent = 0;
  noteEl.value = "";
  food = randomFood();
  game = setInterval(move, 100);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") [dx,dy] = [0,-10];
  if (e.key === "ArrowDown") [dx,dy] = [0,10];
  if (e.key === "ArrowLeft") [dx,dy] = [-10,0];
  if (e.key === "ArrowRight") [dx,dy] = [10,0];
});

/* MOBILE CONTROLS */
document.querySelectorAll(".controls button").forEach(btn => {
  btn.onclick = () => {
    const d = btn.dataset.dir;
    if (d==="up") [dx,dy]=[0,-10];
    if (d==="down") [dx,dy]=[0,10];
    if (d==="left") [dx,dy]=[-10,0];
    if (d==="right") [dx,dy]=[10,0];
  };
});

start();
