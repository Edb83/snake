"use strict";

// GLOBAL VARIABLES

// Declarations
let snake;
let food;
let tile; // the base unit of measurement used (e.g. snake/food parts are tile * tile)

// Audio
// https://howlerjs.com/
const eatAudio = new Howl({
  src: ["assets/audio/eat.wav"],
  volume: 0.1,
});
const gameOverAudio = new Howl({
  src: ["assets/audio/gameover.wav"],
});
const clickAudio = new Howl({
  src: ["assets/audio/click.wav"],
  onplayerror: function(error) {
      alert("Error:", error);
  }
});

// DOM Elements
const mainButton = document.getElementById("main-button");
const playButton = document.getElementById("play-button");
const resumeButton = document.getElementById("resume-button");
const scoresButton = document.getElementById("scores-button");
const optionsButton = document.getElementById("options-button");

const wallsCheckBox = document.getElementById("walls-checkbox");
const audioCheckBox = document.getElementById("audio-checkbox");
const slowRadioButton = document.getElementById("slow-radio");
const mediumRadioButton = document.getElementById("medium-radio");
const fastRadioButton = document.getElementById("fast-radio");

const canvas = document.getElementById("canvas");

// Controls
const left = -1; // directions have been converted to numbers so that conditional statements can be negated mathematically
const right = 1;
const up = -2;
const down = 2;
const hammertime = new Hammer.Manager(document.querySelector("body"), {
  prevent_default: true,
  touchAction: "none",
});

// Gameplay
const slow = 200;
const medium = 140; // milliseconds per game update (higher is slower). Game was built on 140ms refresh rate
const fast = 80;

// Canvas
const ctx = canvas.getContext("2d");
const numberOfTilesPerAxis = 20; // this can be changed but the game is built on a base-20 tileset. Must be an integer
const heightOfScoreBoardInTiles = 2; // this can be changed but the game was built expecting height of 2 tiles
const canvasWidthToLineWidthRatio = 150; // used to scale width of outer border walls according to window size (higher is thinner walls)
const fontRatio = 0.058; // used by scoreBoard to scale size of text according to window size (higher is bigger text)

// Spark
const tileToSparkGravityRatio = 0.009; // used to scale gravity of sparks according to window size (higher is increased gravity)
const dynmicSparkGravityMultiplier = 2; // used to increase upper range of random gravity assigned to individual sparks on creation
const dynamicOutputMultiplier = 2; // used to increase upper range of random velocity assigned to individual sparks on creation
const initialTileToSparkDRatio = 0.1; // the velocity of sparks at the start of each game
const tileToSparkDRatioIncrement = 0.0025; // the increment to spark velocity each time food is eaten
const sparkTimeToLive = 100; // reduced on hitting floor
const maxSparksPerEat = 150; // capped to prevent lag issues
const sparkArray = [];

// Colors
const scoreBoardColor = "#001440"; // dark blue
const scoreBoardTextColor = "#FFF"; // white
const gameBoardColor = "#001440"; // dark blue
const wallsOnColor = "#FF3333"; // red
const wallsOffColor = "#339933"; // green
const snakeColor = "#DF00FE"; // purple
const snakeStrokeColor = "#001440"; // dark blue
const foodStrokeColor = "#000"; // black
const colorArray = [
  // Food color is picked at random from this array & sparks have the same color as food eaten
  // RGB used so that alpha can be adjusted with each spark's time to live
  // https://colorswall.com/palette/360/
  "rgba(255, 53, 94, 1)", // Red
  "rgba(253, 91, 120, 1)", // Watermelon
  "rgba(255, 96, 55, 1)", // Orange
  "rgba(255, 153, 102, 1)", // Tangerine
  "rgba(255, 153, 51, 1)", // Carrot
  "rgba(255, 204, 51, 1)", // Sun
  "rgba(255, 255, 102, 1)", // Lemon
  "rgba(204, 255, 0, 1)", // Lime
  "rgba(102, 255, 102, 1)", // Green
  "rgba(170, 240, 209, 1)", // Mint
  "rgba(80, 191, 230, 1)", // Blue
];

// FUNCTIONS

// Random number generator
// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
const randomNumber = (min, max) => Math.random() * (max - min) + min;

// Time convertor
// https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript/37096923
const convertSecondsToHms = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};

// Spark calculator for direction and gravity (depending on window/tile size)
const dynamicOutput = (ratio) => tile * ratio;


// EVENT HANDLERS

// Keydown
// https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
const keyboardHandler = (e) => {
  if (e.keyCode === 38 && game.moveIsValid(up)) {
    snake.direction = up;
  } else if (e.keyCode === 40 && game.moveIsValid(down)) {
    snake.direction = down;
  } else if (e.keyCode === 37 && game.moveIsValid(left)) {
    snake.direction = left;
  } else if (e.keyCode === 39 && game.moveIsValid(right)) {
    snake.direction = right;
  }

  if (e.keyCode === 32 && game.state === "PLAY") {
    game.changeState("PAUSE");
    game.stop();
  } else if (e.keyCode === 32 && game.state === "PAUSE") {
    game.play();
  }

  if (e.keyCode === 32 && game.state === "GAMEOVER") {
      newGame();
  }
};

// Hammertime touch gestures
// https://hammerjs.github.io/
hammertime.on(`panleft panright panup pandown twofingertap`, (e) => {
  if (e.type === `panleft` && game.moveIsValid(left)) {
    snake.direction = left;
  } else if (e.type === `panup` && game.moveIsValid(up)) {
    snake.direction = up;
  } else if (e.type === `panright` && game.moveIsValid(right)) {
    snake.direction = right;
  } else if (e.type === `pandown` && game.moveIsValid(down)) {
    snake.direction = down;
  }
  if (e.type == "twofingertap" && game.state === "PLAY") {
    game.changeState("PAUSE");
    game.stop();
  } else if (e.type == "twofingertap" && game.state === "PAUSE") {
    game.play();
  }
});


// GAME INITIALISATION

const newSnake = () => {
  snake = new Snake(15 * tile, 15 * tile, snakeColor, left);
};

const newFood = () => {
  food = new Food(colorArray[Math.floor(Math.random() * colorArray.length)]); // picks random color from colorArray)
};

const newGame = () => {
  gameBoard.checkOrientation(); // could refactor?
  gameBoard.setCanvasSize();
  gameBoard.setTileSize();
  scoreBoard.getCurrentHighScore();
  game.loadDefaultSettings();
  newSnake();
  newFood();
  game.play();
  stopWatch.reset();
  stopWatch.start();
  hammertime.add(
    new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 20 })
  );
  hammertime.add(
    new Hammer.Tap({ event: "twofingertap", taps: 1, pointers: 2 })
  );
  hammertime.get("pan").set({ enable: true });
  hammertime.get("twofingertap").set({ enable: true });
};


// GAME LOOP

const gameLoop = () => {
  if (game.state === "PLAY") {
    game.checkSnakeCollision();
    game.checkAteFood();
    game.update();
    snake.update();
    snake.getLastMove();
    scoreBoard.updateHighScore();
  } else {
    game.stop();
  }
};


// ANIMATION LOOP

const animateLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameBoard.draw();
  scoreBoard.draw();
  food.draw();
  snake.draw();
  sparkArray.forEach((spark, index) => {
    spark.update();
    if (spark.ttl === 0) {
      sparkArray.splice(index, 1);
    }
  });

  if (game.state === "PLAY") {
    // this conditional allows for a single frame to be displayed rather than looping through
    requestAnimationFrame(animateLoop);
  } else {
    return;
  }
};


// OBJECTS

// Game board
let gameBoard = {
  orientationPortrait: undefined,
  tileToSparkDRatio: undefined,
  checkOrientation() {
    if (window.innerWidth <= window.innerHeight) {
      this.orientationPortrait = true;
    } else {
      this.orientationPortrait = false;
    }
  },
  setCanvasSize() {
    let canvasHeightToWidthRatio =
      numberOfTilesPerAxis / (numberOfTilesPerAxis + heightOfScoreBoardInTiles);

    let innerHTMLHeightToWidthRatio = window.innerHeight / window.innerWidth;

    if (this.orientationPortrait) {
      canvas.height = window.innerWidth;
    } else {
      canvas.height = window.innerHeight;
    }
    while (
      canvas.height % (numberOfTilesPerAxis + heightOfScoreBoardInTiles) >
      0
    ) {
      canvas.height--;
    }
    canvas.width = Math.ceil(canvas.height * canvasHeightToWidthRatio);
    // this fixes an issue with near square innerHTML height/width by reducing the height of the canvas accordingly
    if (
      innerHTMLHeightToWidthRatio >= 1 &&
      innerHTMLHeightToWidthRatio <= 1.1
    ) {
      canvas.height *= canvasHeightToWidthRatio;
    }
  },
  setTileSize() {
    tile = canvas.width / numberOfTilesPerAxis;
  },
  recalculateAssets() {
    if (game.state === "PLAY" || stats.gamesPlayedThisSession > 0) {
      let formerTileSize = tile;
      let formerFoodCoordinates = food;
      let formerSnakeCoordinates = snake;
      let formerSnakeArray = snake.array;
      let formerSparkArray = sparkArray;

      gameBoard.checkOrientation();
      gameBoard.setCanvasSize();
      gameBoard.setTileSize();

      food.x = (formerFoodCoordinates.x / formerTileSize) * tile;
      food.y = (formerFoodCoordinates.y / formerTileSize) * tile;

      snake.x = (formerSnakeCoordinates.x / formerTileSize) * tile;
      snake.y = (formerSnakeCoordinates.y / formerTileSize) * tile;

      let i;
      for (i = 0; i < formerSnakeArray.length; i++) {
        snake.array[i].x = (formerSnakeArray[i].x / formerTileSize) * tile;
        snake.array[i].y = (formerSnakeArray[i].y / formerTileSize) * tile;
      }
      for (i = 0; i < formerSparkArray.length; i++) {
        sparkArray[i].x = (formerSparkArray[i].x / formerTileSize) * tile;
        sparkArray[i].y = (formerSparkArray[i].y / formerTileSize) * tile;
      }
      if (game.state !== "PLAY") {
        animateLoop();
      }
    }
  },
  draw() {
    // Score background
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = scoreBoardColor;
    ctx.fillRect(0, 0, canvas.width, tile * heightOfScoreBoardInTiles);

    // GameBoard Background
    ctx.fillStyle = gameBoardColor;
    ctx.fillRect(
      0,
      tile * heightOfScoreBoardInTiles,
      canvas.width,
      canvas.height
    );

    // Walls
    if (game.wallsEnabled) {
      ctx.strokeStyle = wallsOnColor;
    } else {
      ctx.strokeStyle = wallsOffColor;
    }
    ctx.lineWidth = canvas.width / canvasWidthToLineWidthRatio;
    ctx.strokeRect(
      ctx.lineWidth / 2,
      ctx.lineWidth / 2,
      canvas.width - ctx.lineWidth,
      heightOfScoreBoardInTiles * tile
    );
    ctx.strokeRect(
      ctx.lineWidth / 2,
      tile * heightOfScoreBoardInTiles + ctx.lineWidth / 2,
      canvas.width - ctx.lineWidth,
      canvas.height - heightOfScoreBoardInTiles * tile - ctx.lineWidth
    );

    ctx.closePath();
    ctx.restore();
  },
};

// Snake
class Snake {
  constructor(x, y, color, direction) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.direction = direction;
    this.array = [
      { x: this.x, y: this.y },
      { x: this.x + tile, y: this.y },
      { x: this.x + tile * 2, y: this.y },
    ];
  }

  get newHead() {
    if (this.direction === left) {
      return { x: this.x - tile, y: this.y };
    }
    if (this.direction === up) {
      return { x: this.x, y: this.y - tile };
    }
    if (this.direction === right) {
      return { x: this.x + tile, y: this.y };
    }
    if (this.direction === down) {
      return { x: this.x, y: this.y + tile };
    }
  }

  getLastMove() {
    // extra conditionals needed for when snake crosses wall to prevent eating self
    if (
      this.array[0].x - this.array[1].x === -tile ||
      this.array[0].x - this.array[1].x > tile
    ) {
      game.lastMove = left;
    } else if (
      this.array[0].x > this.array[1].x ||
      this.array[0].x - this.array[1].x < -tile
    ) {
      game.lastMove = right;
    } else if (
      this.array[0].y - this.array[1].y === -tile ||
      this.array[0].y - this.array[1].y > tile
    ) {
      game.lastMove = up;
    } else if (
      this.array[0].y > this.array[1].y ||
      this.array[0].y - this.array[1].y < -tile
    ) {
      game.lastMove = down;
    }
  }

  update() {
    this.x = this.newHead.x;
    this.y = this.newHead.y;
  }

  draw() {
    for (let i = 0; i < this.array.length; i++) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = tile / 2;
      ctx.fillRect(this.array[i].x, this.array[i].y, tile, tile); // fills tiles occupied by snake array's coordinates
      ctx.restore();
      ctx.strokeStyle = snakeStrokeColor;
      ctx.strokeRect(this.array[i].x, this.array[i].y, tile, tile);
    }
  }
}

// Food
class Food {
  constructor(color) {
    this.x = Math.floor(Math.random() * numberOfTilesPerAxis) * tile;
    this.y =
      Math.floor(
        Math.random() * numberOfTilesPerAxis + heightOfScoreBoardInTiles
      ) * tile;
    this.color = color;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      this.x + (tile - 3) / 2,
      this.y + (tile - 3) / 2,
      tile / 2,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = this.color;

    ctx.shadowColor = this.color;
    ctx.strokeStyle = foodStrokeColor;
    ctx.shadowBlur = tile / 2;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

// Spark
class Spark {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = randomNumber(tile / 10, tile / 4); // convert to global variable?
    this.color = food.color;
    this.gravity = randomNumber(
      dynamicOutput(tileToSparkGravityRatio),
      dynamicOutput(tileToSparkGravityRatio) * dynmicSparkGravityMultiplier
    );
    this.friction = randomNumber(0.4, 0.6); // convert to global variable?
    this.ttl = sparkTimeToLive;
    this.opacity = 1;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle =
      this.color.substring(0, this.color.length - 2) + this.opacity + ")";
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.radius * 0.75;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

Spark.prototype.update = function () {
  this.draw();

  if (
    this.x + this.dx > canvas.width - this.radius ||
    this.x + this.dx < this.radius
  ) {
    this.dx = -this.dx * this.friction;
  }
  this.x += this.dx;

  if (this.y + this.dy > canvas.height - this.radius) {
    this.dy = -this.dy * this.friction;
    this.dx = this.dx * (this.friction + 0.35); // ensures sparks stop rolling but prevents them stopping too soon
    this.ttl -= 1;
    this.opacity -= 1 / this.ttl;
  } else {
    this.dy += this.gravity;
  }
  this.y += this.dy;
};

const populateSparkArray = () => {
  for (let i = 0; i < snake.array.length && i < maxSparksPerEat; i++) {
    // spawns sparks equal to snake length
    let dx;
    let dy;
    let x = snake.array[0].x + tile / 2;
    let y = snake.array[0].y + tile / 2;
    if (snake.direction === up) {
      dx = randomNumber(
        -dynamicOutput(gameBoard.tileToSparkDRatio),
        dynamicOutput(gameBoard.tileToSparkDRatio)
      );
      dy = randomNumber(
        -dynamicOutput(gameBoard.tileToSparkDRatio),
        -dynamicOutput(gameBoard.tileToSparkDRatio) * dynamicOutputMultiplier
      );
    }
    if (snake.direction === down) {
      dx = randomNumber(
        -dynamicOutput(gameBoard.tileToSparkDRatio),
        dynamicOutput(gameBoard.tileToSparkDRatio)
      );
      dy = randomNumber(
        dynamicOutput(gameBoard.tileToSparkDRatio),
        dynamicOutput(gameBoard.tileToSparkDRatio) * dynamicOutputMultiplier
      );
    }
    if (snake.direction === left) {
      dx = randomNumber(
        -dynamicOutput(gameBoard.tileToSparkDRatio) * dynamicOutputMultiplier,
        -dynamicOutput(gameBoard.tileToSparkDRatio)
      );
      dy = randomNumber(
        -dynamicOutput(gameBoard.tileToSparkDRatio),
        dynamicOutput(gameBoard.tileToSparkDRatio)
      );
    }
    if (snake.direction === right) {
      dx = randomNumber(
        dynamicOutput(gameBoard.tileToSparkDRatio),
        dynamicOutput(gameBoard.tileToSparkDRatio) * dynamicOutputMultiplier
      );
      dy = randomNumber(
        -dynamicOutput(gameBoard.tileToSparkDRatio),
        dynamicOutput(gameBoard.tileToSparkDRatio)
      );
    }

    sparkArray.push(new Spark(x, y, dx, dy));
  }
};

// Game
let game = {
  collisionDetected: undefined,
  ateFood: undefined,
  lastMove: undefined,
  state: undefined,
  wallsEnabled: undefined,
  audio: undefined,
  speed: undefined,
  refreshInterval: undefined,
  changeState(state) {
    this.state = state;
    this.setElementStyle(state);
    this.checkSettings();
  },
  setElementStyle(state) {
    const optionsToDisable = [
      wallsCheckBox,
      slowRadioButton,
      mediumRadioButton,
      fastRadioButton,
    ];
    if (state === "PLAY") {
      document
        .querySelectorAll(
          ".menu-heading-container, .menu-content-container, #menu-buttons-container, button"
        )
        .forEach((el) => el.classList.add("hidden"));
      canvas.classList.remove("hidden", "paused-effect");
    }
    if (state === "PAUSE") {
      document
        .querySelectorAll(
          "#options-heading, #options-container, #menu-buttons-container, #resume-button"
        )
        .forEach((el) => el.classList.remove("hidden"));
      optionsToDisable.forEach((el) => (el.disabled = true));
      canvas.classList.add("paused-effect");
    }
    if (state === "GAMEOVER") {
      document
        .querySelectorAll(
          ".menu-heading-container, .menu-content-container, button"
        )
        .forEach((el) => el.classList.add("hidden"));
      document
        .querySelectorAll(
          "#scores-heading, #scores-container, #session-scores-container, #menu-buttons-container, #play-button, #options-button, #main-button"
        )
        .forEach((el) => el.classList.remove("hidden"));
      canvas.classList.add("paused-effect");
    }
    if (state === "OPTIONS") {
      document
        .querySelectorAll(
          ".menu-heading-container, .menu-content-container, button"
        )
        .forEach((el) => el.classList.add("hidden"));
      document
        .querySelectorAll(
          "#options-heading, #options-container, #play-button, #scores-button, #main-button"
        )
        .forEach((el) => el.classList.remove("hidden"));
      optionsToDisable.forEach((el) => (el.disabled = false));
      canvas.classList.add("paused-effect");
    }
    if (state === "MAIN") {
      document
        .querySelectorAll(
          ".menu-heading-container, .menu-content-container, button"
        )
        .forEach((el) => el.classList.add("hidden"));
      document
        .querySelectorAll(
          "#instructions-heading, #instructions-container, #play-button, #scores-button, #options-button"
        )
        .forEach((el) => el.classList.remove("hidden"));
      canvas.classList.add("paused-effect");
    }
  },
  loadDefaultSettings() {
    this.collisionDetected = false;
    this.ateFood = false;
    sparkArray.length = 0;
    scoreBoard.previousScore = scoreBoard.currentScore;
    scoreBoard.currentScore = 0;
    gameBoard.tileToSparkDRatio = initialTileToSparkDRatio;
  },
  checkSettings() {
    if (wallsCheckBox.checked) {
      this.wallsEnabled = true;
    } else {
      this.wallsEnabled = false;
    }

    if (audioCheckBox.checked) {
      this.audio = true;
    } else {
      this.audio = false;
    }
    if (slowRadioButton.checked) {
      this.speed = slow;
    } else if (mediumRadioButton.checked) {
      this.speed = medium;
    } else if (fastRadioButton.checked) {
      this.speed = fast;
    }
  },
  play() {
    this.changeState("PLAY");
    this.refreshInterval = setInterval(() => {
      gameLoop();
    }, this.speed);
    animateLoop();
    stopWatch.start();
  },
  stop() {
    clearInterval(this.refreshInterval);
    stopWatch.stop();
  },
  checkSnakeCollision() {
    for (let i = 0; i < snake.array.length; i++) {
      if (
        snake.newHead.x === snake.array[i].x &&
        snake.newHead.y === snake.array[i].y
      ) {
        this.collisionDetected = true;
      }
      if (snake.newHead.x > canvas.width - tile && snake.direction === right) {
        if (this.wallsEnabled) {
          this.collisionDetected = true;
        } else {
          snake.x = -tile;
        }
      }

      if (snake.newHead.x < 0 && snake.direction === left) {
        if (this.wallsEnabled) {
          this.collisionDetected = true;
        } else {
          snake.x = canvas.width;
        }
      }

      if (snake.newHead.y > canvas.height - tile && snake.direction === down) {
        if (this.wallsEnabled) {
          this.collisionDetected = true;
        } else {
          snake.y = (heightOfScoreBoardInTiles - 1) * tile;
        }
      }

      if (
        snake.newHead.y < heightOfScoreBoardInTiles * tile &&
        snake.direction === up
      ) {
        if (this.wallsEnabled) {
          this.collisionDetected = true;
        } else {
          snake.y = canvas.height;
        }
      }
    }
  },
  checkAteFood() {
    for (let i = 0; i < snake.array.length; i++) {
      if (food.x === snake.array[i].x && food.y === snake.array[i].y) {
        newFood(); // if food is within snake body, spawns new food
      }
    }
    if (snake.newHead.x === food.x && snake.newHead.y === food.y) {
      this.ateFood = true;
    } else {
      this.ateFood = false;
    }
  },
  moveIsValid(newDir) {
    if (this.lastMove === -newDir && snake.direction !== newDir) {
      return false;
    } else if (this.lastMove === newDir && snake.direction !== -newDir) {
      return false;
    } else {
      return true;
    }
  },
  update() {
    if (this.collisionDetected) {
      if (this.audio) {
        gameOverAudio.play();
      }
      stats.updateGamesPlayed();
      stats.updateGameTimeInSeconds();
      stats.updatePointsAllTime();
      scoreBoard.update();
      scoreBoard.print();
      this.changeState("GAMEOVER");
    } else if (this.ateFood) {
      if (this.audio) {
        eatAudio.play();
      }
      snake.array.unshift(snake.newHead);
      populateSparkArray();
      newFood();
      scoreBoard.currentScore++;
      gameBoard.tileToSparkDRatio += tileToSparkDRatioIncrement;
    } else {
      snake.array.unshift(snake.newHead);
      snake.array.pop();
    }
  },
};

// Stopwatch
const stopWatch = {
  timer: undefined,
  elapsed: 0,
  tick() {
    this.elapsed++;
  },
  start() {
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  },
  stop() {
    clearInterval(this.timer);
    this.timer = null;
  },
  reset() {
    this.stop();
    this.elapsed = 0;
  },
};

// Stats
let stats = {
  gamesPlayedThisSession: 0,
  gamesPlayedAllTime: parseInt(localStorage.getItem("games")) || 0,
  gameTimeInSeconds: 0,
  gameTimeAllTime: parseInt(localStorage.getItem("time")) || 0,
  pointsAllTime: parseInt(localStorage.getItem("points")) || 0,
  updateGamesPlayed() {
    this.gamesPlayedThisSession++;
    this.gamesPlayedAllTime++;
    localStorage.setItem("games", this.gamesPlayedAllTime);
  },
  updateGameTimeInSeconds() {
    this.gameTimeInSeconds = stopWatch.elapsed;
    this.gameTimeAllTime += this.gameTimeInSeconds;
    localStorage.setItem("time", this.gameTimeAllTime);
  },
  updatePointsAllTime() {
    this.pointsAllTime += scoreBoard.currentScore;
    localStorage.setItem("points", this.pointsAllTime);
  },
  resetLocalStorage() {
    localStorage.removeItem("highScore");
    localStorage.removeItem("time");
    localStorage.removeItem("games");
    localStorage.removeItem("points");
    scoreBoard.highScore = 0;
    this.gameTimeAllTime = 0;
    this.gamesPlayedAllTime = 0;
    this.pointsAllTime = 0;
  },
};


// EVENT LISTENERS

document.addEventListener("keydown", keyboardHandler);
window.addEventListener("resize", gameBoard.recalculateAssets);
window.addEventListener("orientationchange", gameBoard.recalculateAssets);
window.addEventListener("blur", function () {
  if (game.state === "PLAY") {
    game.changeState("PAUSE");
    game.stop();
  }
});
playButton.addEventListener("click", function () {
  newGame();
});
resumeButton.addEventListener("click", function () {
  game.play();
});
scoresButton.addEventListener("click", function () {
  game.changeState("GAMEOVER");
});
mainButton.addEventListener("click", function () {
  game.changeState("MAIN");
});
optionsButton.addEventListener("click", function () {
  game.changeState("OPTIONS");
});
document
  .querySelectorAll("#main-button, #scores-button, #options-button")
  .forEach((el) =>
    el.addEventListener("click", function () {
      clickAudio.play();
    })
  );
