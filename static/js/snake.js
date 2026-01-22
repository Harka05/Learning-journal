document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startGame");
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const highScoreEl = document.getElementById("highScore");
  const noteEl = document.getElementById("note");
  const saveBtn = document.getElementById("save");
  const scoreList = document.getElementById("score-list");
  const gestureInfo = document.querySelector(".gesture-info");

  let snake = [{ x: 150, y: 150 }];
  let food = { x: 60, y: 60 };
  let dx = 10, dy = 0;
  let score = 0;
  let game;
  let isGameOver = false;

  // ------------------------
  // FETCH HISTORY FROM SERVER
  // ------------------------
  function fetchHistory() {
    fetch("/api/snake")
      .then(res => res.json())
      .then(data => {
        highScoreEl.textContent = data.highScore || 0;
        updateScoreList(data.games || []);
      })
      .catch(err => {
        console.error("Failed to fetch snake history:", err);
        highScoreEl.textContent = 0;
        scoreList.innerHTML = "<li>No history available</li>";
      });
  }

  fetchHistory(); // initial load

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4ade80";
    snake.forEach(p => ctx.fillRect(p.x, p.y, 10, 10));
    ctx.fillStyle = "#f87171";
    ctx.fillRect(food.x, food.y, 10, 10);
  }

  function move() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (hitWall(head) || hitSelf(head)) { endGame(); return; }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      food = randomFood();
    } else { snake.pop(); }

    draw();
  }

  function randomFood() {
    return { x: Math.floor(Math.random() * 32) * 10, y: Math.floor(Math.random() * 32) * 10 };
  }

  function hitWall(h) { return h.x < 0 || h.y < 0 || h.x >= canvas.width || h.y >= canvas.height; }
  function hitSelf(h) { return snake.some(p => p.x === h.x && p.y === h.y); }

  function endGame() {
    clearInterval(game);
    isGameOver = true;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "20px Inter";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = "14px Inter";
    ctx.fillText("Add note and press Save", canvas.width / 2, canvas.height / 2 + 10);
    saveBtn.disabled = false;
  }

  function start() {
    snake = [{ x: 150, y: 150 }];
    dx = 10; dy = 0;
    score = 0; isGameOver = false;
    scoreEl.textContent = 0;
    noteEl.value = "";
    food = randomFood();
    saveBtn.disabled = true;
    gestureInfo.style.display = "block"; // show gesture info
    draw();
    clearInterval(game);
    game = setInterval(move, 100);
  }

  startBtn.addEventListener("click", () => {
    gestureInfo.style.display = "none"; // hide info after start
    start();
  });

  saveBtn.addEventListener("click", () => {
    if (!isGameOver) return;

    // POST score to server
    fetch("/api/snake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score,
        note: noteEl.value,
        date: new Date().toLocaleString()
      })
    })
      .then(() => fetchHistory()) // refresh history after saving
      .then(() => start());
  });

  // Keyboard controls
  document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dy === 0) [dx, dy] = [0, -10];
    if (e.key === "ArrowDown" && dy === 0) [dx, dy] = [0, 10];
    if (e.key === "ArrowLeft" && dx === 0) [dx, dy] = [-10, 0];
    if (e.key === "ArrowRight" && dx === 0) [dx, dy] = [10, 0];
  });

  // Mobile swipe gestures
  let touchStartX = 0, touchStartY = 0;
  canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    touchStartX = t.clientX; touchStartY = t.clientY;
  }, { passive: false });

  canvas.addEventListener("touchmove", e => { e.preventDefault(); }, { passive: false });

  canvas.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    const dxSwipe = t.clientX - touchStartX;
    const dySwipe = t.clientY - touchStartY;
    if (Math.abs(dxSwipe) > Math.abs(dySwipe)) {
      if (dxSwipe > 0 && dx === 0) [dx, dy] = [10, 0];
      if (dxSwipe < 0 && dx === 0) [dx, dy] = [-10, 0];
    } else {
      if (dySwipe > 0 && dy === 0) [dx, dy] = [0, 10];
      if (dySwipe < 0 && dy === 0) [dx, dy] = [0, -10];
    }
  }, { passive: false });

  function updateScoreList(games) {
    scoreList.innerHTML = "";
    games.slice().reverse().forEach(g => {
      if (g.score > 0) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>Score:</strong> ${g.score}<br><strong>Note:</strong> ${g.note || "-"}<br><small>${g.date}</small>`;
        scoreList.appendChild(li);
      }
    });
  }

});
