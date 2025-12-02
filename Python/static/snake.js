const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;

let snake = [{ x: 160, y: 160 }];
let dx = gridSize;
let dy = 0;
let foodX, foodY;
let score = 0;

const reflections = ["Peace", "Focus", "Calm", "Balance", "Strength"];

function randomGrid() {
    return Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function placeFood() {
    foodX = randomGrid();
    foodY = randomGrid();
}

function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = "#5f37ff";
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#2e026d";
    ctx.fillRect(foodX, foodY, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Edge wrapping
    if (head.x < 0) head.x = canvasSize - gridSize;
    if (head.x >= canvasSize) head.x = 0;
    if (head.y < 0) head.y = canvasSize - gridSize;
    if (head.y >= canvasSize) head.y = 0;

    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score++;
        document.getElementById("score").textContent = score;
        document.getElementById("reflection").textContent =
            reflections[Math.floor(Math.random() * reflections.length)];

        if (score % 3 === 0) fetchQuote();
        placeFood();
    } else {
        snake.pop();
    }
}

function drawGame() {
    ctx.fillStyle = "#f9f9ff"; // background matches theme
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    drawFood();
    drawSnake();
    moveSnake();
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -gridSize; }
    if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = gridSize; }
    if (e.key === "ArrowLeft" && dx === 0) { dx = -gridSize; dy = 0; }
    if (e.key === "ArrowRight" && dx === 0) { dx = gridSize; dy = 0; }
});

function fetchQuote() {
    fetch("https://zenquotes.io/api/random")
        .then(res => res.json())
        .then(data => {
            document.getElementById("quote").textContent =
                `"${data[0].q}" - ${data[0].a}`;
        });
}

document.getElementById("saveBtn").onclick = () => {
    fetch("/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score })
    });
};

document.getElementById("favoriteBtn").onclick = () => {
    const text = document.getElementById("quote").textContent;
    fetch("/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote: text })
    });
};

placeFood();
setInterval(drawGame, 150);
