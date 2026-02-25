const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
const rows = canvas.width / box;
let gameInterval;
let restartBtn;

let snake = [
    { x: 10 * box, y: 10 * box }
];

let direction = "RIGHT";

let food = randomFood();

function randomFood() {
    return {
        x: Math.floor(Math.random() * rows) * box, y: Math.floor(Math.random() * rows) * box
    };
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }
}

function gameLoop() {
    update();
    draw();
}

function startGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    food = randomFood();

    if (restartBtn) {
        restartBtn.remove();
    }

    gameInterval = setInterval(gameLoop, 100);
}

function update() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;

    const newHead = { x: headX, y: headY };

    if (headX === food.x && headY === food.y) {
        food = randomFood();
    } else {
        snake.pop();
    }

    if (collision(newHead)) {
        clearInterval(gameInterval);
        showRestartButton();
    }

    snake.unshift(newHead);
}

function collision(head) {
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height
    ) {
        return true;
    }

    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function draw() {
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function showRestartButton() {
    restartBtn = document.createElement("button");
    restartBtn.textContent = "Перезапустить игру";

    restartBtn.style.position = "absolute";
    restartBtn.style.top = "50%";
    restartBtn.style.left = "50%";
    restartBtn.style.transform = "translate(-50%, -50%)";
    restartBtn.style.padding = "15px 25px";
    restartBtn.style.fontSize = "18px";
    restartBtn.style.cursor = "pointer";

    document.body.appendChild(restartBtn);

    restartBtn.addEventListener("click", startGame);
}

startGame();