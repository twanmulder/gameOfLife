import { xmur3, mulberry32, createDistribution, randomIndex } from "./util.js";
import { PulsingEye, Octagon, Flower, Mahjong } from "./shapes.js";

let initSeed = Math.floor(Math.random() * 1000);
const params = new URLSearchParams(window.location.search);
if (params.has("seed")) {
  let paramsSeed = params.get("seed");

  if (paramsSeed.includes("-")) {
    paramsSeed = paramsSeed.replaceAll("-", " ");
    window.location.href = window.location.href.split("?")[0] + `?seed=${paramsSeed}`;
  }

  initSeed = paramsSeed;
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
    { name: "Small", cellSize: setup.gridSize / 40, probability: 0.125 },
    { name: "Medium", cellSize: setup.gridSize / 20, probability: 0.125 },
    { name: "Large", cellSize: setup.gridSize / 16, probability: 0.3 },
    { name: "Extra Large", cellSize: setup.gridSize / 10, probability: 0.4 },
  ];
  const sizeDistribution = createDistribution(sizes);
  const sizeRandomIndex = randomIndex(sizeDistribution, randomFloat());
  setup.sizeName = sizes[sizeRandomIndex].name;
  setup.cellSize = sizes[sizeRandomIndex].cellSize;
  setup.sizeProbability = sizes[sizeRandomIndex].probability;

  // get random color palette
  const palettes = [
    {
      name: "Flashy",
      cellAliveColor: ["#01f5d4", "#f15bb5", "#00bbf9", "#fee440"],
      cellDeadColor: "#9b5de5",
      probability: 0.125,
    },
    {
      name: "Bubble Gum",
      cellAliveColor: ["#ffb400", "#f6511d", "#00a6ed", "#0d2c53"],
      cellDeadColor: "#dc77d2",
      probability: 0.125,
    },
    {
      name: "Greytones",
      cellAliveColor: ["#111", "#222", "#444", "#666", "#888", "#aaa", "#ccc", "#eee"],
      cellDeadColor: "#FEFEFE",
      probability: 0.125,
    },
    {
      name: "Lava",
      cellAliveColor: ["#d62827", "#f77f00", "#fcbf48", "#ebe2b7"],
      cellDeadColor: "#003049",
      probability: 0.125,
    },
    {
      name: "Mystic Violet",
      cellAliveColor: ["#03052e", "#22017c", "#0d00a4"],
      cellDeadColor: "#02010a",
      probability: 0.125,
    },
    {
      name: "Tango Matisse",
      cellAliveColor: ["#fec600", "#74bfb8", "#3ca5d9", "#2364aa"],
      cellDeadColor: "#ea7316",
      probability: 0.125,
    },
    {
      name: "White Mandy",
      cellAliveColor: ["#ee7e92", "#5dd8db", "#fb9a87", "#fbede6"],
      cellDeadColor: "#ffffff",
      probability: 0.125,
    },
    {
      name: "Crimson Red",
      cellAliveColor: ["#670a14", "#9a0f1e", "#ce1429", "#ea3045"],
      cellDeadColor: "#33050a",
      probability: 0.125,
    },
  ];
  const paletteDistribution = createDistribution(palettes);
  const paletteRandomIndex = randomIndex(paletteDistribution, randomFloat());
  setup.paletteName = palettes[paletteRandomIndex].name;
  setup.paletteProbability = palettes[paletteRandomIndex].probability;
  setup.cellAliveColor = palettes[paletteRandomIndex].cellAliveColor;
  setup.cellDeadColor = palettes[paletteRandomIndex].cellDeadColor;

  // get random delay
  const delays = [
    { name: "Slow", delay: 100, probability: 0.2 },
    { name: "Medium", delay: 75, probability: 0.3 },
    { name: "Fast", delay: 50, probability: 0.4 },
    { name: "Turbo", delay: 30, probability: 0.1 },
  ];
  const delayDistribution = createDistribution(delays);
  const delayRandomIndex = randomIndex(delayDistribution, randomFloat());
  setup.delayName = delays[delayRandomIndex].name;
  setup.delayProbability = delays[delayRandomIndex].probability;
  setup.delay = delays[delayRandomIndex].delay;

  // get if rectangles should have a shadow or not
  const shadows = [
    { show: true, probability: 0.25 },
    { show: false, probability: 0.75 },
  ];
  const shadowDistribution = createDistribution(shadows);
  const shadowRandomIndex = randomIndex(shadowDistribution, randomFloat());
  setup.shadow = shadows[shadowRandomIndex].show;
  setup.shadowProbability = shadows[shadowRandomIndex].probability;

  // get if it should be circles or squares
  const shapes = [
    { name: "Circle", probability: 0.2 },
    { name: "Overlapping Circles", probability: 0.1 },
    { name: "Square", probability: 0.6 },
  ];
  const shapeDistribution = createDistribution(shapes);
  const shapeRandomIndex = randomIndex(shapeDistribution, randomFloat());
  setup.shape = shapes[shapeRandomIndex].name;
  setup.shapeProbability = shapes[shapeRandomIndex].probability;

  // Special render for Pulsing Eye
  if (setup.seedInput === "Pulsing Eye") {
    setup.sizeName = sizes[1].name;
    setup.cellSize = sizes[1].cellSize;
    setup.sizeProbability = sizes[1].probability;

    setup.paletteName = palettes[7].name;
    setup.paletteProbability = palettes[7].probability;
    setup.cellAliveColor = palettes[7].cellAliveColor;
    setup.cellDeadColor = palettes[7].cellDeadColor;

    setup.delayName = delays[1].name;
    setup.delayProbability = delays[1].probability;
    setup.delay = delays[1].delay;

    setup.shadow = shadows[1].show;
    setup.shadowProbability = shadows[1].probability;

    setup.shape = shapes[2].name;
    setup.shapeProbability = shapes[2].probability;
  }

  // Special render for Octagon
  if (setup.seedInput === "Octagon") {
    setup.sizeName = sizes[3].name;
    setup.cellSize = sizes[3].cellSize;
    setup.sizeProbability = sizes[3].probability;

    setup.paletteName = palettes[4].name;
    setup.paletteProbability = palettes[4].probability;
    setup.cellAliveColor = palettes[4].cellAliveColor;
    setup.cellDeadColor = palettes[4].cellDeadColor;

    setup.delayName = delays[2].name;
    setup.delayProbability = delays[2].probability;
    setup.delay = delays[2].delay;

    setup.shadow = shadows[1].show;
    setup.shadowProbability = shadows[1].probability;

    setup.shape = shapes[0].name;
    setup.shapeProbability = shapes[0].probability;
  }

  // Special render for Flower
  if (setup.seedInput === "Flower") {
    setup.sizeName = sizes[1].name;
    setup.cellSize = sizes[1].cellSize;
    setup.sizeProbability = sizes[1].probability;

    setup.paletteName = "Flower";
    setup.paletteProbability = 0.001;
    setup.cellAliveColor = ["#ffdef8", "#ebccff", "#a2c1fa", "#fbffd1"];
    setup.cellDeadColor = "#defce1";

    setup.delayName = delays[2].name;
    setup.delayProbability = delays[2].probability;
    setup.delay = delays[2].delay;

    setup.shadow = shadows[1].show;
    setup.shadowProbability = shadows[1].probability;

    setup.shape = shapes[0].name;
    setup.shapeProbability = shapes[0].probability;
  }

  // Special render for Flower
  if (setup.seedInput === "Mahjong") {
    setup.sizeName = sizes[1].name;
    setup.cellSize = sizes[1].cellSize;
    setup.sizeProbability = sizes[1].probability;

    setup.paletteName = "Mahjong";
    setup.paletteProbability = 0.001;
    setup.cellAliveColor = ["#5f8e40", "#f2fbde"];
    setup.cellDeadColor = "#036843";

    setup.delayName = delays[0].name;
    setup.delayProbability = delays[0].probability;
    setup.delay = delays[0].delay;

    setup.shadow = shadows[1].show;
    setup.shadowProbability = shadows[1].probability;

    setup.shape = shapes[0].name;
    setup.shapeProbability = shapes[0].probability;
  }

  return setup;
};

const setup = generateSetup();
document.getElementById("seed").value = setup.seedInput;

// Add traits to DOM
const container = document.getElementById("traits");
const traits = [
  {
    name: "size",
    value: setup.sizeName,
    probability: setup.sizeProbability,
  },
  {
    name: "speed",
    value: setup.delayName,
    probability: setup.delayProbability,
  },
  {
    name: "shadow",
    value: setup.shadow,
    probability: setup.shadowProbability,
  },
  {
    name: "shape",
    value: setup.shape,
    probability: setup.shapeProbability,
  },
];

traits.forEach((trait) => {
  const traitElement = document.createElement("div");
  traitElement.classList.add("trait");
  traitElement.innerHTML = `
    <div class="trait-name">${trait.name}</div>
    <div class="trait-value">${trait.value}</div>
    <div class="trait-probability">${trait.probability * 100}% have this trait</div>
  `;
  container.appendChild(traitElement);
});

// Add color palette to DOM
const palette = document.getElementById("palette");

const paletteColors = setup.cellAliveColor.map((color) => {
  const div = document.createElement("div");
  div.classList.add("color");
  div.style.backgroundColor = color;
  return div;
});

const deadColorDiv = document.createElement("div");
deadColorDiv.classList.add("color");
deadColorDiv.style.backgroundColor = setup.cellDeadColor;
paletteColors.unshift(deadColorDiv);

palette.append(...paletteColors);

// Add color palette name to DOM
const paletteName = document.getElementById("palette-name");
paletteName.innerHTML = setup.paletteName + `<span>(${setup.paletteProbability * 100}% have this palette)</span>`;

// add href to opensea seed in new tab
const openseaLink = document.getElementById("opensea-link");
openseaLink.href = `https://opensea.io/collection/game-of-life-nfts?search[query]=${setup.seedInput}`;

// Handle user entering seed
function generateNewSeedPage() {
  const seed = document.getElementById("seed").value;
  window.location.href = window.location.href.split("?")[0] + `?seed=${seed}`;
}

// add handler for generate button
document.getElementById("generate").onclick = () => {
  generateNewSeedPage();
};

// add handler when user presses enter
document.getElementById("seed").onkeyup = (e) => {
  if (e.keyCode === 13 || e.key === "Enter") {
    generateNewSeedPage();
  }
};

// add handler for random button
document.getElementById("random").onclick = () => {
  window.location.href = window.location.href.split("?")[0] + "?seed=" + Math.floor(Math.random() * 1000);
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

    // Special pattern 101
    if (setup.seedInput === "Pulsing Eye") {
      this.alive = PulsingEye[this.gridY][this.gridX] > 0.5;
    }

    if (setup.seedInput === "Octagon") {
      this.alive = Octagon[this.gridY][this.gridX] > 0.5;
      this.aliveColor = setup.cellAliveColor[2];
    }

    if (setup.seedInput === "Flower") {
      this.alive = Flower[this.gridY][this.gridX] > 0.5;
    }

    if (setup.seedInput === "Mahjong") {
      this.alive = Mahjong[this.gridY][this.gridX] > 0.5;
    }
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
    if (setup.shape === "Overlapping Circles") {
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
    } else if (setup.shape === "Circle") {
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
    } else if (setup.shape === "Square") {
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

    // Add background color
    this.context.fillStyle = setup.cellDeadColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

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

  // Save current state of canvas to png png on device
  setTimeout(() => {
    const img = gameWorld.canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = img;
    a.download = `game-of-life-#${setup.seedInput}.png`;
    document.body.appendChild(a);
    // a.click();
    a.remove();

    // setTimeout(() => {
    //   const nextSeed = parseInt(setup.seedInput) + 1;
    //   window.location.href = window.location.href.split("?")[0] + `?seed=${nextSeed}`;
    // }, 1000);
  }, 100);
};
