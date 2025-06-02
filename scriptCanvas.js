let size = 5;
let cellSize;
let board = [];
let currentPlayer = 1;
let xColor = "black";
let oColor = "red";
let selectedCell = null;
let winningMessage = "";
let currentColors = ["#ffffff", "#cccccc"];
let playerNames = ["Player X", "Player O"];
let gameMode = "human";


function setup() {
  createCanvas(800, 400);
  cellSize = min(width, height) / size;
  resetBoard();

  let resetBtn = createButton("Reset Game");
  resetBtn.position(7, 535);
  resetBtn.mousePressed(() => {
    resetBoard();
    winningMessage = "";
    loop();
  });
}

function draw() {
  background(240);
  drawBoard();
  drawPieces();

   fill(0);
  textSize(20);
  textAlign(LEFT);
  text(`Turn: Player ${currentPlayer === 1 ? "X" : "O"}`, 10, height - 10);

  if (winningMessage) {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill("blue");
    text(winningMessage, width / 2, height / 2);
    noLoop();
  }
}

function resetBoard() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
}

function drawBoard() {
  strokeWeight(2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let colorIndex = (i + j) % 2;
      fill(colorIndex === 0 ? "#ffffff" : "#cccccc");
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

function mousePressed() {
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

function moveLine(from, to) {

  if (checkWin(currentPlayer)) {
    winningMessage = `Player ${currentPlayer === 1 ? "X" : "O"} won!`;
    noLoop();
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

function resetBoard() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  currentPlayer = 1;
  selectedCell = null;
  winningMessage = "";
  loop();
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
      currentColors = ["#fff59d", "#fbc02d"];
      xColor = "#f57f17";
      oColor = "#ff6f00";
      break;
    case "autumn":
      currentColors = ["#ffe0b2", "#ff8a65"];
      xColor = "#e65100";
      oColor = "#bf360c";
      break;
    default:
      currentColors = ["#ffffff", "#cccccc"];
      xColor = "black";
      oColor = "red";
  }

  redraw();
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
    noLoop();
  }
}

function dummyAI() {
  let options = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isOnEdge(r, c) && (board[r][c] === 0 || board[r][c] === 2)) {
        options.push({ row: r, col: c });
      }
    }
  }

  while (options.length > 0) {
    let selected = options.splice(floor(random(options.length)), 1)[0];
    let targets = getEdgeTargets(selected);
    if (targets.length > 0) {
      let target = random(targets);
      moveLine(selected, target);
      if (checkWin(2)) {
        winningMessage = "Dummy wins!";
        noLoop();
      }
      currentPlayer = 1;
      break;
    }
  }
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
        winningMessage = `${playerNames[currentPlayer - 1]} won!`;
        noLoop();
        return;
      }

      currentPlayer = currentPlayer === 1 ? 2 : 1;
      selectedCell = null;

      if (gameMode === "dummy" && currentPlayer === 2) {
        setTimeout(dummyAI, 500);
      }
    } else {
      selectedCell = null;
    }
  }
}

function getEdgeTargets(cell) {
  let targets = [];
  if (cell.col === 0) targets.push({ row: cell.row, col: size - 1 });
  if (cell.col === size - 1) targets.push({ row: cell.row, col: 0 });
  if (cell.row === 0) targets.push({ row: size - 1, col: cell.col });
  if (cell.row === size - 1) targets.push({ row: 0, col: cell.col });
  return targets;
}

function smartyAI() {

    let winningMove = findCriticalMove(2);
  if (winningMove) {
    moveLine(winningMove.from, winningMove.to);
    if (checkWin(2)) {
      winningMessage = "Smarty wins!";
      noLoop();
    }
    currentPlayer = 1;
    return;
  }

  let blockingMove = findCriticalMove(1);
  if (blockingMove) {
    moveLine(blockingMove.from, blockingMove.to);
    currentPlayer = 1;
    return;
  }

    dummyAI();
}

function findMoveInLine(line, index, lineType, player) {
  let count = line.filter(v => v === player).length;
  let emptyIndices = line.reduce((acc, v, i) => v === 0 ? acc.concat(i) : acc, []);

  if (count === size - 1 && emptyIndices.length === 1) {
    let emptyIndex = emptyIndices[0];
    let from, to;

    if (lineType === 'row') {
      if (isOnEdge(index, 0) && (board[index][0] === 0 || board[index][0] === player))
        from = { row: index, col: 0 };
      else if (isOnEdge(index, size - 1) && (board[index][size - 1] === 0 || board[index][size - 1] === player))
        from = { row: index, col: size - 1 };
      else return null;

      to = { row: index, col: emptyIndex };

    } else if (lineType === 'col') {
      if (isOnEdge(0, index) && (board[0][index] === 0 || board[0][index] === player))
        from = { row: 0, col: index };
      else if (isOnEdge(size - 1, index) && (board[size - 1][index] === 0 || board[size - 1][index] === player))
        from = { row: size - 1, col: index };
      else return null;

      to = { row: emptyIndex, col: index };

    } else if (lineType === 'diag1') {
      if (isOnEdge(0, 0) && (board[0][0] === 0 || board[0][0] === player))
        from = { row: 0, col: 0 };
      else if (isOnEdge(size - 1, size - 1) && (board[size - 1][size - 1] === 0 || board[size - 1][size - 1] === player))
        from = { row: size - 1, col: size - 1 };
      else return null;

      to = { row: emptyIndex, col: emptyIndex };

    } else if (lineType === 'diag2') {
      if (isOnEdge(0, size - 1) && (board[0][size - 1] === 0 || board[0][size - 1] === player))
        from = { row: 0, col: size - 1 };
      else if (isOnEdge(size - 1, 0) && (board[size - 1][0] === 0 || board[size - 1][0] === player))
        from = { row: size - 1, col: 0 };
      else return null;

      to = { row: emptyIndex, col: size - 1 - emptyIndex };
    }

    if (from && to) return { from, to };
  }
  return null;
}

function findCriticalMove(player) {
  for (let i = 0; i < size; i++) {
    let move = findMoveInLine(getRow(i), i, 'row', player);
    if (move) return move;

    move = findMoveInLine(getCol(i), i, 'col', player);
    if (move) return move;
  }

  let move = findMoveInLine(getDiagonal(1), null, 'diag1', player);
  if (move) return move;

  move = findMoveInLine(getDiagonal(2), null, 'diag2', player);
  if (move) return move;

  return null;
}

function getRow(r) {
  return board[r];
}

function getCol(c) {
  return board.map(row => row[c]);
}

function getDiagonal(type) {
  if (type === 1) return board.map((row, i) => row[i]);
  else return board.map((row, i) => row[size - 1 - i]);
}