const cols = 40;
const rows = 40;
const grid = new Array(cols);
function removeFromArray(arr, el) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == el) {
      arr.splice(i, 1);
    }
  }
}
function heuristic(a, b) {
  let d = dist(a.i, a.j, b.i, b.j); //euclidean distance
  // let d = abs(a.i - b.i) + (a.j - b.j); //manhattan distance
  return d;
}
const openSet = [];
const closedSet = [];
let start, end, w, h;
let path;

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.wall = false;
  this.previous = undefined;
  if (random(1) < 0.3) {
    this.wall = true;
  }
  this.show = function (col) {
    if (this.wall) {
      fill(255, 0, 0);
      noStroke();
      ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
    } else if (col) {
      noStroke();
      fill(col);
      ellipse(this.i * h, this.j * w, h - 1, w - 1);
    }
  };
  this.addNeighbors = function (grid) {
    let i = this.i;
    let j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}

function setup() {
  createCanvas(600, 600);
  // background(255);

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
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  start = grid[0][0];
  start.wall = false;
  end = grid[cols - 1][rows - 1];
  end.wall = false;

  openSet.push(start);
}

function draw() {
  if (openSet.length > 0) {
    //keep going
    let lowestIdx = 0;

    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIdx].f) {
        lowestIdx = i;
      }
    }
    var current = openSet[lowestIdx];

    if (current === end) {
      //find the path

      //or else it's over! we found the path.
      path.push(current);
      noLoop();

      return path.length;
    }
    removeFromArray(openSet, current);
    closedSet.push(current);

    const neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + heuristic(neighbor, current);
        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbors[i]);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }
  } else {
    //no solution

    console.log("no solution");
    noLoop();
    return "No Solution";
  }
  background(255);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 229, 179));
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(65, 250, 160, 90));
  }
  path = [];
  let temp = current;

  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // for (let i = 0; i < path.length; i++) {
  //   path[i].show(color(0, 0, 255));
  // }
  noFill();
  stroke(0, 200, 200);
  strokeWeight(w / 4);
  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  endShape();
}
