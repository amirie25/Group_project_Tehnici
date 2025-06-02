let size = 5;
let cellSize;
let board = [];
let currentPlayer = 1;
let currentColors = ["#ffffff", "#cccccc"];
let xColor = "black";
let oColor = "red";
let selectedCell = null;
let winningMessage = "";
let playerNames = ["Player X", "Player O"];
let gameMode = "human";
let timerDuration = 0;
let timerInterval;
let timerTimeLeft = 0;
let gamePaused = false;



function setup() {
    createCanvas(800, 400);
    cellSize = min(width, height) / size;
    resetBoard();
}

function draw() {
    background(240);
    drawBoard();
}

function resetBoard() {
    board = Array.from({ length: size }, () => Array(size).fill(0));
    currentPlayer = 1;
}

function drawBoard() {
    strokeWeight(2);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let colorIndex = (i + j) % 2;
            fill(currentColors[colorIndex]);
            stroke(0);
            rect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

function drawPieces() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let piece = board[i][j];
            if (piece === 1) drawX(j, i);
            if (piece === 2) drawO(j, i);
        }
    }
}

function drawX(col, row) {
    stroke(xColor);
    strokeWeight(4);
    let pad = cellSize * 0.2;
    line(col * cellSize + pad, row * cellSize + pad,
        (col + 1) * cellSize - pad, (row + 1) * cellSize - pad);
    line((col + 1) * cellSize - pad, row * cellSize + pad,
        col * cellSize + pad, (row + 1) * cellSize - pad);
}

function drawO(col, row) {
    stroke(oColor);
    strokeWeight(4);
    noFill();
    let centerX = col * cellSize + cellSize / 2;
    let centerY = row * cellSize + cellSize / 2;
    let radius = cellSize * 0.3;
    ellipse(centerX, centerY, radius * 2);
}

function draw() {
    background(240);
    drawBoard();
    drawPieces();
}

function mousePressed() {
    if (winningMessage) return;

    let col = floor(mouseX / cellSize);
    let row = floor(mouseY / cellSize);

    if (col < 0 || col >= size || row < 0 || row >= size) return;

    if (!selectedCell) {
        if (isOnEdge(row, col) && (board[row][col] === 0 || board[row][col] === currentPlayer)) {
            selectedCell = { row, col };
        }
    } else {
        let target = { row, col };
        if (isOnEdge(target.row, target.col) && isSameLineOrColumn(selectedCell, target)) {
            moveLine(selectedCell, target);

            if (checkWin(currentPlayer)) {
                winningMessage = `${currentPlayer === 1 ? "Player X" : "Player O"} won!`;
                noLoop();
                return;
            }

            currentPlayer = currentPlayer === 1 ? 2 : 1;
            selectedCell = null;
        } else {
            selectedCell = null;
        }
    }
}

function isOnEdge(row, col) {
    return row === 0 || row === size - 1 || col === 0 || col === size - 1;
}

function isSameLineOrColumn(a, b) {
    return a.row === b.row || a.col === b.col;
}

function moveLine(from, to) {
    if (from.row === to.row) {
        let row = board[from.row];
        if (from.col < to.col) {
            for (let i = from.col; i < to.col; i++) row[i] = row[i + 1];
        } else {
            for (let i = from.col; i > to.col; i--) row[i] = row[i - 1];
        }
        row[to.col] = currentPlayer;
    } else if (from.col === to.col) {
        if (from.row < to.row) {
            for (let i = from.row; i < to.row; i++) board[i][from.col] = board[i + 1][from.col];
        } else {
            for (let i = from.row; i > to.row; i--) board[i][from.col] = board[i - 1][from.col];
        }
        board[to.row][from.col] = currentPlayer;
    }
}

function checkWin(player) {
    for (let i = 0; i < size; i++) {
        if (board[i].every(cell => cell === player)) return true;
        if (board.map(row => row[i]).every(cell => cell === player)) return true;
    }
    if (board.every((row, i) => row[i] === player)) return true;
    if (board.every((row, i) => row[size - 1 - i] === player)) return true;
    return false;
}

function setNames() {
    let name1 = document.getElementById("player1Name").value.trim();
    let name2 = document.getElementById("player2Name").value.trim();

    playerNames[0] = name1 || "Player X";
    playerNames[1] = name2 || (gameMode === "dummy" ? "Dummy" : gameMode === "smarty" ? "Smarty" : "Player O");

    redraw();
}

function changeGameMode() {
    gameMode = document.getElementById("gameMode").value;
    playerNames[1] = gameMode === "dummy" ? "Dummy" : gameMode === "smarty" ? "Smarty" : "Player O";
    resetBoard();
}

function draw() {
    background(240);
    drawBoard();
    drawPieces();

    fill(0);
    textSize(20);
    textAlign(LEFT);
    text(`Turn: ${playerNames[currentPlayer - 1]}`, 10, height - 10);

    if (winningMessage) {
        textAlign(CENTER, CENTER);
        textSize(32);
        fill("blue");
        text(winningMessage, width / 2, height / 2);
    }
}

function startTimer() {
    let time = parseInt(document.getElementById("timerSelect").value);
    timerTimeLeft = time;
    timerDuration = time;
    gamePaused = false;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timerTimeLeft--;
        document.getElementById("timerDisplay").innerText = `Time: ${timerTimeLeft}s`;

        if (timerTimeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("timerDisplay").innerText = "Time's up!";
            gamePaused = true;
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    gamePaused = true;
    document.getElementById("timerDisplay").innerText = `Paused at: ${timerTimeLeft}s`;
}

function resetTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerTimeLeft = timerDuration;
    gamePaused = false;
    document.getElementById("timerDisplay").innerText = `Time: ${timerTimeLeft}s`;
    startTimer();
}

function applyTheme() {
    const theme = document.getElementById("theme").value;

    switch (theme) {
        case "winter":
            currentColors = ["#e0f7fa", "#b2ebf2"];
            xColor = "#0d47a1";
            oColor = "#004d40";
            break;
        case "spring":
            currentColors = ["#c8e6c9", "#81c784"];
            xColor = "#2e7d32";
            oColor = "#1b5e20";
            break;
        case "summer":
            currentColors = ["#fff9c4", "#fff176"];
            xColor = "#f57f17";
            oColor = "#ef6c00";
            break;
        case "autumn":
            currentColors = ["#ffe0b2", "#ffb74d"];
            xColor = "#bf360c";
            oColor = "#6d4c41";
            break;
        default:
            currentColors = ["#ffffff", "#cccccc"];
            xColor = "black";
            oColor = "red";
    }

    redraw();
}