let size = 5;
let cellSize;
let board = [];

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
