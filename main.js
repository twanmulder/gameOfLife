import { xmur3, mulberry32, createDistribution, randomIndex } from "./util.js";

const initSetup = {
  seedInput: "1",
  canvasSize: 400,
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
  const sizeRandomIndex = randomIndex(sizeDistribution, randomFloat());
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
      name: "Black & White",
      cellAliveColor: ["#111"],
      cellDeadColor: "#FEFEFE",
    },
    {
      name: "Greytones",
      cellAliveColor: ["#111", "#222", "#444", "#666", "#888", "#aaa", "#ccc", "#eee"],
      cellDeadColor: "#FEFEFE",
    },
  ];
  const paletteWeights = [0.25, 0.25, 0.25, 0.25];
  const paletteDistribution = createDistribution(palettes, paletteWeights, 10);
  const paletteRandomIndex = randomIndex(paletteDistribution, randomFloat());
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
  const delayRandomIndex = randomIndex(delayDistribution, randomFloat());
  setup.delayName = delays[delayRandomIndex].name;
  setup.delay = delays[delayRandomIndex].delay;

  return setup;
};

const setup = generateSetup();
document.getElementById("setup").innerHTML = JSON.stringify(setup, null, 4);

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
    this.alive = randomFloat() > 0.5;

    // Set alive color
    this.aliveColor = setup.cellAliveColor[~~(randomFloat() * setup.cellAliveColor.length)];
  }

  draw() {
    // Draw a simple square
    this.context.fillStyle = this.alive ? this.aliveColor : setup.cellDeadColor;
    this.context.fillRect(this.gridX * Cell.width, this.gridY * Cell.height, Cell.width, Cell.height);
  }
}

class GameWorld {
  static numColumns = setup.canvasSize / setup.cellSize;
  static numRows = setup.canvasSize / setup.cellSize;

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.style.backgroundColor = setup.cellDeadColor;
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
