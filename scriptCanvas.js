let size = 5;
let cellSize;
let board = [];
let currentPlayer = 1;
let currentColors = ["#ffffff", "#cccccc"];
let xColor = "black";
let oColor = "red";

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