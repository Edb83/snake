"use strict";

// GLOBAL VARIABLES

// Declarations
let snake;
let food;
let tile;
let eatWav;
let gameOverWav;

// Gameplay
const gameSpeed = 140; // milliseconds per game update

// Controls
const left = -1; // directions have been converted to numbers so that conditional statements can be negated to find the opposite direction
const right = 1;
const up = -2;
const down = 2;
const hammertime = new Hammer.Manager(document.querySelector("body")); // new instance of hammer.js touch gesture manager. Configured in EVENT LISTENERS

// DOM Elements
const mainScreen = document.getElementById("main-screen");
const scoresScreen = document.getElementById("scores-screen");
const scoresContainer = document.getElementById("session-scores-container");
const optionsScreen = document.getElementById("options-screen");
const resumeButton = document.getElementById("resume-button");
const optionsToHide = document.getElementById("options-to-hide");
const canvas = document.getElementById("canvas");
const wallsCheckBox = document.getElementById("walls-checkbox");
const audioCheckBox = document.getElementById("audio-checkbox");

// Canvas
const ctx = canvas.getContext("2d");
const numberOfTilesPerAxis = 20; // this can be changed but the game is built on a base-20 tileset
const heightOfScoreBoardInTiles = 2; // this can be changed but the game was build expecting height of 2 tiles
const canvasWidthToLineWidthRatio = 150; // used to scale width of outer border walls according to window size (higher is thinner walls)
const fontRatio = 0.058; // used by scoreBoard to scale size of text according to window size (higher is bigger text)

// Spark
const tileToSparkGravityRatio = 0.009; // used to scale gravity of sparks according to window size (higher is more increased gravity)
const dynmicSparkGravityMultiplier = 2; // used to increase upper range of random gravity assigned to individual sparks on creation
const dynamicSparkDMultiplier = 2; // used to increase upper range of random velocity assigned to individual sparks on creation
const initialTileToSparkDRatio = 0.1; // the velocity of sparks at the start of each game
const tileToSparkDRatioIncrement = 0.0025; // the increment to spark velocity each time food is eaten
const sparkTimeToLive = 100;
const maxSparksPerEat = 150;
const sparkArray = [];

// Colors
const scoreBoardColor = "#001437"; // dark blue
const gameBoardColor = "#001437"; // dark blue
const wallsOnColor = "#FF0000"; // red
const wallsOffColor = "#008000"; // green
const snakeColor = "#DF00FE"; // psychedelic purple
const snakeStrokeColor = "#001437"; // dark blue
const foodStrokeColor = "#000"; // white
const colorArray = [
  // Food color is picked at random from this array
  // RGB used so that alpha can be adjusted with each spark's time to live
  "rgba(128,255,0,1)", // green
  "rgba(252,243,64,1)", // yellow
  "rgba(255,191,0,1)", // orange
  "rgba(226,0,0,1)", // red
  "rgba(125,249,255,1)", // blue
  "rgba(254,1,154,1)", // pink
];

// FUNCTIONS
// Sound constructor
class sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = () => {
            this.sound.play();
        };
        this.stop = () => {
            this.sound.pause();
        };
    }
}

// Random number generator
const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
}

// Time convertor
const convertSecondsToHms = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}

// Spark gravity calculator (depending on window/tile size)
const dynamicSparkGravity = () => 
  tile * tileToSparkGravityRatio;

const dynamicSparkD =() => 
  tile * gameBoard.tileToSparkDRatio;

// EVENT HANDLERS

// Keydown
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

  if (e.keyCode == 32 && game.state === "PLAY") {
    game.changeState("PAUSE");
    game.stop();
  } else if (e.keyCode == 32 && game.state === "PAUSE") {
    game.changeState("PLAY");
    game.play();
    animateLoop();
  }
}

// Hammertime touch gestures
hammertime.add(
  new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 20 })
);
hammertime.add(new Hammer.Tap({ event: "doubletap", taps: 2 }));
hammertime.get("pan");
hammertime.get("doubletap");
hammertime.on(`panleft panright panup pandown doubletap`, e => {
  if (e.type === `panleft` && game.moveIsValid(left)) {
    snake.direction = left;
  } else if (e.type === `panup` && game.moveIsValid(up)) {
    snake.direction = up;
  } else if (e.type === `panright` && game.moveIsValid(right)) {
    snake.direction = right;
  } else if (e.type === `pandown` && game.moveIsValid(down)) {
    snake.direction = down;
  }
  if (e.type == "doubletap" && game.state === "PLAY") {
    game.changeState("PAUSE");
    game.stop();
  } else if (e.type == "doubletap" && game.state === "PAUSE") {
    game.changeState("PLAY");
    game.play();
    animateLoop();
  }
});

// GAME INITIALISATION

const newSnake = () => {
  snake = new Snake(15 * tile, 15 * tile, snakeColor, left);
}

const newFood = () => {
  food = new Food(colorArray[Math.floor(Math.random() * colorArray.length)]); // picks random color from colorArray)
}

const newGame = () => {
  eatWav = new sound("assets/audio/eat.wav");
  gameOverWav = new sound("assets/audio/gameover.wav");
  gameBoard.checkOrientation(); // could refactor?
  gameBoard.setCanvasSize();
  gameBoard.setTileSize();
  scoreBoard.getCurrentHighScore();
  game.loadDefaultSettings();
  newSnake();
  newFood();
  game.changeState("PLAY");
  animateLoop();
  game.startTime = Date.now();
  game.play();
}

// GAME LOOP

const gameLoop = () => {
  if (game.state === "PLAY") {
    game.checkSnakeCollision();
    game.checkAteFood();
    game.update();
    snake.update();
    snake.lastMove();
    scoreBoard.updateHighScore();
  } else {
    game.stop();
  }
}

// ANIMATION LOOP

const animateLoop = () => {
  gameBoard.draw();
  food.draw();
  scoreBoard.draw();
  snake.draw();
  sparkArray.forEach((spark, index) => {
    spark.update();
    if (spark.ttl === 0) {
      sparkArray.splice(index, 1);
    }
  });

  if (game.state === "PLAY") {
    requestAnimationFrame(animateLoop);
  } else {
    return;
  }
}

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
      numberOfTilesPerAxis / (numberOfTilesPerAxis + heightOfScoreBoardInTiles); // 3 to account for score area
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

  lastMove() {
    if (this.array[0].x < this.array[1].x) {
      game.lastMove = left;
    } else if (this.array[0].x > this.array[1].x) {
      game.lastMove = right;
    } else if (this.array[0].y < this.array[1].y) {
      game.lastMove = up;
    } else if (this.array[0].y > this.array[1].y) {
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
      dynamicSparkGravity(),
      dynamicSparkGravity() * dynmicSparkGravityMultiplier
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
    ctx.shadowBlur = this.radius / 2;
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
      dx = randomNumber(-dynamicSparkD(), dynamicSparkD());
      dy = randomNumber(
        -dynamicSparkD(),
        -dynamicSparkD() * dynamicSparkDMultiplier
      );
    }
    if (snake.direction === down) {
      dx = randomNumber(-dynamicSparkD(), dynamicSparkD());
      dy = randomNumber(
        dynamicSparkD(),
        dynamicSparkD() * dynamicSparkDMultiplier
      );
    }
    if (snake.direction === left) {
      dx = randomNumber(
        -dynamicSparkD() * dynamicSparkDMultiplier,
        -dynamicSparkD()
      );
      dy = randomNumber(-dynamicSparkD(), dynamicSparkD());
    }
    if (snake.direction === right) {
      dx = randomNumber(
        dynamicSparkD(),
        dynamicSparkD() * dynamicSparkDMultiplier
      );
      dy = randomNumber(-dynamicSparkD(), dynamicSparkD());
    }

    sparkArray.push(new Spark(x, y, dx, dy));
  }
}

// Game
let game = {
  collisionDetected: undefined,
  ateFood: undefined,
  lastMove: undefined,
  startTime: undefined,
  state: undefined,
  wallsEnabled: undefined,
  audio: undefined,
  refreshInterval: undefined,
  changeState(state) {
    this.state = state;
    this.showScreen(state);
    this.checkSettings();
  },
  makeVisible(screen) {
    screen.style.display = "inline-block";
  },
  makeHidden(screen) {
    screen.style.display = "none";
  },
  showScreen(state) {
    if (state === "PLAY") {
      this.makeHidden(mainScreen);
      this.makeHidden(scoresScreen);
      this.makeHidden(scoresContainer);
      this.makeHidden(optionsScreen);
    }
    if (state === "PAUSE") {
      optionsScreen.classList.add("transparent-background");
      this.makeHidden(optionsToHide);
      this.makeVisible(resumeButton);
      this.makeVisible(optionsScreen);
    }
    if (state === "GAMEOVER") {
      this.makeHidden(optionsScreen);
      this.makeHidden(mainScreen);
      this.makeVisible(scoresScreen);
    }
    if (state === "GAMEOVER" && stats.gamesPlayedThisSession > 0) {
      this.makeVisible(scoresContainer);
    }
    if (state === "OPTIONS") {
      optionsScreen.classList.remove("transparent-background");
      this.makeVisible(optionsToHide);
      this.makeHidden(resumeButton);
      this.makeHidden(mainScreen);
      this.makeHidden(scoresScreen);
      this.makeHidden(scoresContainer);
      this.makeVisible(optionsScreen);
    }
    if (state === "MAIN") {
      this.makeHidden(scoresScreen);
      this.makeHidden(scoresContainer);
      this.makeHidden(optionsScreen);
      this.makeHidden(optionsScreen);
      this.makeVisible(mainScreen);
    }
  },
  loadDefaultSettings() {
    this.collisionDetected = false;
    this.AteFood = false;
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
  },
  play() {
    this.refreshInterval = setInterval(() => {
      gameLoop();
    }, gameSpeed);
  },
  stop() {
    clearInterval(this.refreshInterval);
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
      this.AteFood = true;
    } else {
      this.AteFood = false;
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
        gameOverWav.play();
      }
      stats.updateGamesPlayed();
      stats.updateGameTimeInSeconds();
      stats.updatePointsAllTime();
      scoreBoard.update();
      scoreBoard.print();
      this.changeState("GAMEOVER");
    } else if (this.AteFood) {
      if (this.audio) {
        eatWav.play();
      }
      snake.array.unshift(snake.newHead);
      populateSparkArray();
      newFood();
      scoreBoard.currentScore++;
      gameBoard.tileToSparkDRatio += tileToSparkDRatioIncrement; // convert to global variable?
    } else {
      snake.array.unshift(snake.newHead);
      snake.array.pop();
    }
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
    this.gamesPlayedAllTime += 1;
    localStorage.setItem("games", this.gamesPlayedAllTime);
  },
  updateGameTimeInSeconds() {
    this.gameTimeInSeconds = Math.round((Date.now() - game.startTime) / 1000);
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