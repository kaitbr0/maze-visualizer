const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const numCellsAcross = 20;
const numCellsVert = 20;
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / numCellsAcross;
const unitLengthY = height / numCellsVert;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Borders
const borders = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

World.add(world, borders);

// Maze Data Structures
const grid = Array(numCellsVert)
  .fill(null)
  .map(() => {
    return Array(numCellsAcross).fill(false);
  });

const verticalWalls = Array(numCellsVert)
  .fill(null)
  .map(() => {
    return Array(numCellsAcross - 1).fill(false);
  });

const horizontalWalls = Array(numCellsVert - 1)
  .fill(null)
  .map(() => {
    return Array(numCellsAcross).fill(false);
  });

/*
vertical lines (columns) between rows is 1 less (3 rows, 2 columns)
|__|__|__|
|__|__|__|
|__|__|__|
horizontal lines (rows) between rows is 1 less (2 rows, 3 columns)
*/

//Maze Builder Algorithm
const startRow = Math.floor(Math.random() * numCellsVert);
const startColumn = Math.floor(Math.random() * numCellsAcross);

function shuffleNeighbors(arr) {
  let counter = arr.length;
  while (counter > 0) {
    const idx = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[idx];
    arr[idx] = temp;
  }
  return arr;
}
function mazeBuilder(row, column) {
  if (grid[row][column]) {
    return;
  }
  grid[row][column] = true;

  const neighbors = shuffleNeighbors([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    if (
      nextRow < 0 ||
      nextRow >= numCellsVert ||
      nextColumn < 0 ||
      nextColumn >= numCellsAcross
    ) {
      continue;
    }

    if (grid[nextRow][nextColumn]) {
      continue;
    }

    if (direction === "left") {
      verticalWalls[row][column - 1] = true;
    } else if (direction === "right") {
      verticalWalls[row][column] = true;
    }
    if (direction === "up") {
      horizontalWalls[row - 1][column] = true;
    } else if (direction === "down") {
      horizontalWalls[row][column] = true;
    }
    mazeBuilder(nextRow, nextColumn);
  }
}

mazeBuilder(startRow, startColumn);

const colors = {
  0: "red",
  1: "red",
  2: "red",
  3: "red",
  4: "red",
  5: "red",
  6: "orange",
  7: "orange",
  8: "orange",
  9: "orange",
  10: "orange",
  11: "yellow",
  12: "yellow",
  13: "yellow",
  14: "yellow",
  15: "yellow",
  16: "green",
  17: "green",
  18: "green",
  19: "green",
  20: "green",
  21: "blue",
  22: "blue",
  23: "blue",
  24: "blue",
  25: "blue",
  26: "purple",
  27: "purple",
  28: "purple",
  29: "purple",
  30: "purple",
  31: "pink",
  32: "pink",
  33: "pink",
  34: "pink",
  35: "pink",
  36: "pink",
  37: "pink",
};

horizontalWalls.forEach((row, rowIdx) => {
  row.forEach((open, columnIdx) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIdx * unitLengthX + unitLengthX / 2,
      rowIdx * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: colors[rowIdx + columnIdx],
        },
      }
    );
    World.add(world, wall);
  });
});

verticalWalls.forEach((row, rowIdx) => {
  row.forEach((open, columnIdx) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIdx * unitLengthX + unitLengthX,
      rowIdx * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: colors[rowIdx + columnIdx],
        },
      }
    );
    World.add(world, wall);
  });
});

const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  { label: "goal", isStatic: true, render: { fillStyle: "green" } }
);
World.add(world, goal);

const ballRadius = Math.min(unitLengthX, unitLengthY);
const ball = Bodies.circle(
  unitLengthX / 2,
  unitLengthY / 2,
  ballRadius * 0.24,
  {
    label: "ball",
  }
);
World.add(world, ball);

const maxVelocity = 8;
document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  if (event.code === "KeyI") {
    Body.setVelocity(ball, { x, y: y - 4 });
  }
  if (event.code === "KeyK") {
    Body.setVelocity(ball, { x, y: Math.min(y + 4, maxVelocity) });
  }
  if (event.code === "KeyJ") {
    Body.setVelocity(ball, { x: x - 4, y });
  }
  if (event.code === "KeyL") {
    Body.setVelocity(ball, { x: Math.min(x + 4, maxVelocity), y });
  }
});

// Win Collision
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      console.log("user won");
      document.querySelector(".winner").classList.remove("hidden");
      engine.world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
