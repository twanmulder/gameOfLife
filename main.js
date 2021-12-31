import { xmur3, mulberry32, createDistribution, randomIndex } from "./util.js";

let initSeed = Math.floor(Math.random() * 100);
const params = new URLSearchParams(window.location.search);
if (params.has("seed")) {
  initSeed = params.get("seed");
}

const initSetup = {
  seedInput: initSeed.toString(),
  gridSize: 400,
  canvasOffset: 100,
};

const generateSetup = () => {
  // initial values
  let setup = {
    ...initSetup,
  };

  // set random float number
  const seed = xmur3(setup.seedInput);
  const randomFloat = mulberry32(seed());
  setup.randomFloat = randomFloat();

  // get random size
  const sizes = [
    { name: "sm", cellSize: 10 },
    { name: "md", cellSize: 20 },
    { name: "lg", cellSize: 25 },
    { name: "xl", cellSize: 40 },
  ];
  const sizeWeights = [0.5, 0.25, 0.125, 0.125];
  const sizeDistribution = createDistribution(sizes, sizeWeights, 10);
  const sizeRandomIndex = randomIndex(sizeDistribution, setup.randomFloat);
  setup.sizeName = sizes[sizeRandomIndex].name;
  setup.cellSize = sizes[sizeRandomIndex].cellSize;

  // get random color palette
  const palettes = [
    {
      name: "Flashy",
      cellAliveColor: ["#01f5d4", "#f15bb5", "#00bbf9", "#fee440"],
      cellDeadColor: "#9b5de5",
    },
    {
      name: "Bubble Gum",
      cellAliveColor: ["#ffb400", "#f6511d", "#00a6ed", "#0d2c53"],
      cellDeadColor: "#dc77d2",
    },
    {
      name: "Greytones",
      cellAliveColor: ["#111", "#222", "#444", "#666", "#888", "#aaa", "#ccc", "#eee"],
      cellDeadColor: "#FEFEFE",
    },
    {
      name: "Lava",
      cellAliveColor: ["#d62827", "#f77f00", "#fcbf48", "#ebe2b7"],
      cellDeadColor: "#003049",
    },
    {
      name: "Mystic Violet",
      cellAliveColor: ["#03052e", "#22017c", "#0d00a4"],
      cellDeadColor: "#02010a",
    },
    {
      name: "Tango Matisse",
      cellAliveColor: ["#fec600", "#74bfb8", "#3ca5d9", "#2364aa"],
      cellDeadColor: "#ea7316",
    },
    {
      name: "White Mandy",
      cellAliveColor: ["#ee7e92", "#5dd8db", "#fb9a87", "#fbede6"],
      cellDeadColor: "#ffffff",
    },
  ];
  const paletteWeights = [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2];
  const paletteDistribution = createDistribution(palettes, paletteWeights, 14);
  const paletteRandomIndex = randomIndex(paletteDistribution, setup.randomFloat);
  setup.paletteName = palettes[paletteRandomIndex].name;
  setup.cellAliveColor = palettes[paletteRandomIndex].cellAliveColor;
  setup.cellDeadColor = palettes[paletteRandomIndex].cellDeadColor;

  // get random delay
  const delays = [
    { name: "slow", delay: 100 },
    { name: "medium", delay: 75 },
    { name: "fast", delay: 50 },
  ];
  const delayWeights = [0.333, 0.333, 0.333];
  const delayDistribution = createDistribution(delays, delayWeights, 10);
  const delayRandomIndex = randomIndex(delayDistribution, setup.randomFloat);
  setup.delayName = delays[delayRandomIndex].name;
  setup.delay = delays[delayRandomIndex].delay;

  // get if rectangles should have a shadow or not
  const shadows = [false, true];
  const shadowWeights = [0.75, 0.25];
  const shadowDistribution = createDistribution(shadows, shadowWeights, 10);
  const shadowRandomIndex = randomIndex(shadowDistribution, setup.randomFloat);
  setup.shadow = shadows[shadowRandomIndex];

  // get if it should be circles or squares
  const shapes = ["circle", "overlapping-circle", "square"];
  const shapeWeights = [0.25, 0.25, 0.5];
  const shapeDistribution = createDistribution(shapes, shapeWeights, 10);
  const shapeRandomIndex = randomIndex(shapeDistribution, setup.randomFloat);
  setup.shape = shapes[shapeRandomIndex];

  return setup;
};

const setup = generateSetup();
document.getElementById("seed").value = setup.seedInput;
document.getElementById("setup").innerHTML = JSON.stringify(setup, null, 4);

// add handler for random button
document.getElementById("random").onclick = () => {
  window.location.href = window.location.href.split("?")[0];
};

class Cell {
  static width = setup.cellSize;
  static height = setup.cellSize;

  constructor(context, gridX, gridY) {
    this.context = context;

    // Store the position of this cell in the grid
    this.gridX = gridX;
    this.gridY = gridY;

    // Make random cells alive
    const seed = xmur3(`${setup.randomFloat}${this.gridY}${this.gridX}`);
    const randomFloat = mulberry32(seed());
    this.randomFloat = randomFloat();
    this.alive = this.randomFloat > 0.5;

    // Set alive color
    this.aliveColor = setup.cellAliveColor[~~(this.randomFloat * setup.cellAliveColor.length)];
  }

  draw() {
    // Show if shadow if its in setup
    if (setup.shadow) {
      this.context.shadowColor = this.aliveColor;
      this.context.shadowBlur = setup.cellSize;
    }

    // Set fill & stroke color of the cell
    this.context.fillStyle = this.alive ? this.aliveColor : setup.cellDeadColor;
    this.context.strokeStyle = this.alive ? this.aliveColor : setup.cellDeadColor;

    // Draw shape depending on setup
    if (setup.shape === "overlapping-circle") {
      this.context.beginPath();
      this.context.arc(
        this.gridX * Cell.width + setup.canvasOffset + Cell.width / 2,
        this.gridY * Cell.height + setup.canvasOffset + Cell.height / 2,
        Cell.width / 1.5,
        0,
        2 * Math.PI
      );
      if (this.randomFloat > 0.5) {
        this.context.stroke();
      } else {
        this.context.fill();
      }
    } else if (setup.shape === "circle") {
      this.context.beginPath();
      this.context.arc(
        this.gridX * Cell.width + setup.canvasOffset + Cell.width / 2,
        this.gridY * Cell.height + setup.canvasOffset + Cell.height / 2,
        Cell.width / 2,
        0,
        2 * Math.PI,
        false
      );
      this.context.fill();
    } else if (setup.shape === "square") {
      this.context.fillRect(
        this.gridX * Cell.width + setup.canvasOffset,
        this.gridY * Cell.height + setup.canvasOffset,
        Cell.width,
        Cell.height
      );
    }
  }
}

class GameWorld {
  static numColumns = setup.gridSize / setup.cellSize;
  static numRows = setup.gridSize / setup.cellSize;

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.style.backgroundColor = setup.cellDeadColor;
    this.canvas.style.boxShadow = `0 25px 50px -12px ${setup.cellDeadColor}, 0 25px 50px -12px rgb(0 0 0 / 0.25)`;
    this.context = this.canvas.getContext("2d");
    this.gameObjects = [];

    this.createGrid();

    // Request an animation frame for the first time
    // The gameLoop() function will be called as a callback of this request
    window.requestAnimationFrame(() => this.gameLoop());
  }

  createGrid() {
    for (let y = 0; y < GameWorld.numRows; y++) {
      for (let x = 0; x < GameWorld.numColumns; x++) {
        this.gameObjects.push(new Cell(this.context, x, y));
      }
    }
  }

  isAlive(x, y) {
    if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows) {
      return false;
    }

    return this.gameObjects[this.gridToIndex(x, y)].alive ? 1 : 0;
  }

  gridToIndex(x, y) {
    return x + y * GameWorld.numColumns;
  }

  checkSurrounding() {
    // Loop over all cells
    for (let x = 0; x < GameWorld.numColumns; x++) {
      for (let y = 0; y < GameWorld.numRows; y++) {
        // Count the nearby population
        let numAlive =
          this.isAlive(x - 1, y - 1) +
          this.isAlive(x, y - 1) +
          this.isAlive(x + 1, y - 1) +
          this.isAlive(x - 1, y) +
          this.isAlive(x + 1, y) +
          this.isAlive(x - 1, y + 1) +
          this.isAlive(x, y + 1) +
          this.isAlive(x + 1, y + 1);
        let centerIndex = this.gridToIndex(x, y);

        if (numAlive == 2) {
          // Do nothing
          this.gameObjects[centerIndex].nextAlive = this.gameObjects[centerIndex].alive;
        } else if (numAlive == 3) {
          // Make alive
          this.gameObjects[centerIndex].nextAlive = true;
        } else {
          // Make dead
          this.gameObjects[centerIndex].nextAlive = false;
        }
      }
    }

    // Apply the new state to the cells
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
    }
  }

  gameLoop() {
    // Check the surrounding of each cell
    this.checkSurrounding();

    // Clear the screen
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all the gameobjects
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw();
    }

    // The loop function has reached it's end, keep requesting new frames
    setTimeout(() => {
      window.requestAnimationFrame(() => this.gameLoop());
    }, setup.delay);
  }
}

window.onload = () => {
  // The page has loaded, start the game
  let gameWorld = new GameWorld("canvas");
};
