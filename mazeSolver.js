const cols = 5;
const rows = 5;
const grid = new Array(cols);

const openSet = [];
const closedSet = [];
let start, end, w, h;

function Cell(i, j) {
  this.x = i;
  this.y = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.show = function () {
    fill(255);
    stroke(0);
    rect(this.x * w, this.y * h, w - 1, h - 1);
  };
}

function setup() {
  createCanvas(800, 800);
  background(255);
  console.log("A*");
  w = width / cols;
  h = height / rows;
  //2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j);
    }
  }
  console.log(grid);

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
}

openSet.push(start);

function draw() {
  if (openSet.length > 0) {
    //keep going
  } else {
    //no solution
  }
  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
}
