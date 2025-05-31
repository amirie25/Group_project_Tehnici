let borderWidth = 0
let borderHeight = 0

function setup() {
    createCanvas(windowWidth, windowHeight)
    borderWidth = windowWidth
    borderHeight = windowHeight
}

function draw() {
    background("#ffdfff")
    piecesPlayer1();
}

function piecesPlayer1() {
    fill("#ff8ef1");
    quad(40, 50, 60, 50, 160, 170, 140, 170);
    quad(140, 50, 160, 50, 60, 170, 40, 170);
}