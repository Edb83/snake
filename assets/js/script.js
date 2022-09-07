"use strict";

// GLOBAL VARIABLES

// Declarations
let snake;
let food;
let tile; // the base unit of measurement used (e.g. snake/food parts are tile * tile)

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
const sparkTimeToLive = 100; // ttl reduced on hitting floor
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
const snakeHeadCollisionColor = "#FF3333"; // red
const foodStrokeColor = "#000"; // black
const colorArray = [
  // Food color is picked at random from this array
  // Sparks have the same color as the food eaten
  // RGB used so that alpha can be adjusted according to each spark's time to live
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

// Controls
// directions have been converted to numbers so that conditional statements can be negated mathematically
const left = -1;
const right = 1;
const up = -2;
const down = 2;
// gesture recognition is applied to all DOM elements in the body and any default click/tapping behaviour suspended
const hammertime = new Hammer.Manager(document.querySelector("body"), {
  prevent_default: true,
  touchAction: "none",
});

// Gameplay
// milliseconds per game update (higher is slower). Game was built on 140ms refresh rate
const slow = 200;
const medium = 140;
const fast = 80;

// Audio
// https://howlerjs.com/
const eatAudio = new Howl({
  src: ["assets/audio/eat.webm", "assets/audio/eat.mp3"],
  volume: 0.075,
});
const gameOverAudio = new Howl({
  src: ["assets/audio/gameover.webm", "assets/audio/gameover.mp3"],
});
const clickAudio = new Howl({
  src: ["assets/audio/click.webm", "assets/audio/click.mp3"],
});

// FUNCTIONS

// Random number generator
// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
const randomNumber = (min, max) => Math.random() * (max - min) + min;

// Time convertor
// https://stackoverflow.com/questions/37096367/how-to-convert-seconds-to-minutes-and-hours-in-javascript/37096923
const convertSecondsToHms = (d) => {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);
  let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};

// Gravity and velocity calculator for sparks (depending on window/tile size)
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
  gameBoard.checkOrientation();
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

const animate = () => {
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

  // this conditional loops the animation rather than displaying a single frame
  if (game.state === "PLAY") {
    requestAnimationFrame(animate);
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

    if (this.orientationPortrait) {
      canvas.height = window.innerWidth;
    } else {
      canvas.height = window.innerHeight;
    }
    // check that the canvas height is divisible by the total number of tiles along the y axis (including scoreboard)
    while (
      canvas.height % (numberOfTilesPerAxis + heightOfScoreBoardInTiles) >
      0
    ) {
      // if not, reduce the canvas height until it is
      canvas.height--;
    }
    canvas.width = Math.ceil(canvas.height * canvasHeightToWidthRatio);
  },
  setTileSize() {
    tile = canvas.width / numberOfTilesPerAxis;
  },
  recalculateAssets() {
    // if true, then we know that there are assets which can be resized
    if (game.state === "PLAY" || stats.gamesPlayedThisSession > 0) {
      // record their current positions
      let formerTileSize = tile;
      let formerFoodCoordinates = food;
      let formerSnakeCoordinates = snake;
      let formerSnakeArray = snake.array;
      let formerSparkArray = sparkArray;

      // run the necessary functions to find new possible board dimensions
      gameBoard.checkOrientation();
      gameBoard.setCanvasSize();
      gameBoard.setTileSize();

      // multiply everything up to fit the new board dimensions
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

      // and if the game is paused/finished, draw everything in background or it will disappear
      if (game.state !== "PLAY") {
        animate();
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
    // this could be anything but a 3-tile snake works well
    this.array = [
      { x: this.x, y: this.y },
      { x: this.x + tile, y: this.y },
      { x: this.x + tile * 2, y: this.y },
    ];
  }
  // finds the coordinates of the new snake.array[0] depending on direction, to check collisions
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
      if (game.collisionDetected) {
        // changes the colour of the snake head on collision
        ctx.save();
        ctx.fillStyle = snakeHeadCollisionColor;
        ctx.shadowColor = snakeHeadCollisionColor;
        ctx.fillRect(this.array[0].x, this.array[0].y, tile, tile);
        ctx.restore();
      }
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
    this.radius = randomNumber(tile / 10, tile / 4);
    this.color = food.color;
    this.gravity = randomNumber(
      dynamicOutput(tileToSparkGravityRatio),
      dynamicOutput(tileToSparkGravityRatio) * dynmicSparkGravityMultiplier
    );
    this.friction = randomNumber(0.4, 0.6);
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
  // spawns sparks equal to snake length
  for (let i = 0; i < snake.array.length && i < maxSparksPerEat; i++) {
    let dx;
    let dy;
    let x = snake.array[0].x + tile / 2;
    let y = snake.array[0].y + tile / 2;
    // these conditionals look the same but are all different
    // they determine the random properties of each spark generated:
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
    // add to the spark array
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
    //   to simplify the DOM manipulation, data variables have been added to the various elements in index.html
    document
      .querySelectorAll(`[data-hide-on-state~=${state}]`)
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll(`[data-show-on-state~=${state}]`)
      .forEach((el) => el.classList.remove("hidden"));
    document
      .querySelectorAll(`[data-blur-on-state~=${state}]`)
      .forEach((el) => el.classList.add("paused-effect"));
    document
      .querySelectorAll(`[data-unblur-on-state~=${state}]`)
      .forEach((el) => el.classList.remove("paused-effect"));
    document
      .querySelectorAll(`[data-disable-on-state~=${state}]`)
      .forEach((el) => (el.disabled = true));
    document
      .querySelectorAll(`[data-enable-on-state~=${state}]`)
      .forEach((el) => (el.disabled = false));
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
    this.wallsEnabled = wallsCheckBox.checked;
    this.audio = audioCheckBox.checked;
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
    animate();
    stopWatch.start();
  },
  pause() {
    if (this.state == "PLAY") {
      this.changeState("PAUSE");
      this.stop();
    }
  },
  stop() {
    clearInterval(this.refreshInterval);
    stopWatch.stop();
  },
  checkSnakeCollision() {
    //   uses the predicted new position of the snake head to check for collisions
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
        newFood(); // if food is within snake body, spawn new food
      }
    }
    if (snake.newHead.x === food.x && snake.newHead.y === food.y) {
      this.ateFood = true;
    } else {
      this.ateFood = false;
    }
  },
  // this is passed into the event handlers to prevent the snake going back on itself
  moveIsValid(newDir) {
    if (this.lastMove !== -newDir) {
      return true;
    } else {
      return false;
    }
  },
  update() {
    //   collision:
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
      //   eats food:
    } else if (this.ateFood) {
      if (this.audio) {
        eatAudio.play();
      }
      snake.array.unshift(snake.newHead);
      populateSparkArray();
      newFood();
      scoreBoard.currentScore++;
      gameBoard.tileToSparkDRatio += tileToSparkDRatioIncrement;
      //   regular state of play:
    } else {
      snake.array.unshift(snake.newHead);
      snake.array.pop();
    }
  },
  handleEvent(event) {
    // click events
    switch (event.target) {
      case playButton:
        newGame();
        break;
      case resumeButton:
        this.play();
        break;
      case scoresButton:
        this.changeState('GAMEOVER');
        break;
      case mainButton:
        this.changeState('MAIN');
        break;
      case optionsButton:
        this.changeState('OPTIONS');
        break;
    }
    // focus or orientation events leading to pause
    if (event.type === "blur" || event.type === "orientationchange") {
        this.pause();
    }
  },
};

// Stopwatch
// https://code-boxx.com/simple-javascript-stopwatch/
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
    this.elapsed = -1; // prevents rapid pause/resume from cranking up the game time
  },
};

// Stats
let stats = {
  gamesPlayedThisSession: 0,
  gamesPlayedAllTime: parseInt(localStorage.getItem("games")) || 0,
  gameTimeInSeconds: 0,
  gameTimeAllTime: parseInt(localStorage.getItem("time")) || 0,
  highScore: parseInt(localStorage.getItem("highScore")) || 0,
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
    this.highScore = 0;
    this.gameTimeAllTime = 0;
    this.gamesPlayedAllTime = 0;
    this.pointsAllTime = 0;
  },
};

// EVENT LISTENERS

// Keyboard
document.addEventListener("keydown", keyboardHandler);

// Window
window.addEventListener("resize", gameBoard.recalculateAssets);
window.addEventListener("orientationchange", gameBoard.recalculateAssets);

const pauseEvents = ["blur", "orientationchange"];
pauseEvents.forEach(event => {
  window.addEventListener(event, game)
});

// Clicks
document.querySelectorAll('.button').forEach(el => {
  el.addEventListener("click", game)
});

document
  .querySelectorAll("#main-button, #scores-button, #options-button")
  .forEach((el) =>
    el.addEventListener("click", function () {
      if (game.audio) {
        clickAudio.play();
      }
    })
  );
