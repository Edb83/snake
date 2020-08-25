"use strict";

// Global variables
let gameState = "MENU"; // MOVE TO GAME OBJECT?

const sparkArray = [];

let direction; // MOVE TO GAME OBJECT?

let lastKey; // used to store time since last keydown
const gameSpeed = 140; // MOVE TO GAME OBJECT?
const safeDelay = 140; // used to add minimum interval between key presses to prevent snake eating its neck (milliseconds). Risk vs Responsiveness
let gameRefreshInterval; // MOVE TO GAME OBJECT?

let snake;
let food;

let wallsEnabled; // MOVE TO GAME OBJECT?
let gameAudio; // MOVE TO GAME OBJECT?

const eatSound = document.getElementById("eat-sound");
const gameOverSound = document.getElementById("gameover-sound");
const wallsCheckBox = document.querySelector("#walls-checkbox");
const audioCheckBox = document.querySelector("#audio-checkbox");

// Random number generator
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Time convertor
function convertSecondsToMs(d) {
  d = Number(d);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return mDisplay + sDisplay;
}

// Color array
const colorArray = [
  "rgba(128,255,0,1)", // green
  "rgba(252,243,64,1)", // yellow
  "rgba(255,191,0,1)", // orange
  "rgba(226,0,0,1)", // red
  "rgba(125,249,255,1)", // blue
  "rgba(254,1,154,1)", // pink
];

// Keydown event listener
function keyboardHandler(e) {
  //   if (Date.now() - lastKey > safeDelay) {
  // checks time since last key press to prevent multiple presses causing snake to eat its neck
  if (e.keyCode === 38 && game.moveIsValid(-2)) {
    direction = -2;
  } else if (e.keyCode === 40 && game.moveIsValid(2)) {
    direction = 2;
  } else if (e.keyCode === 37 && game.moveIsValid(-1)) {
    direction = -1;
  } else if (e.keyCode === 39 && game.moveIsValid(1)) {
    direction = 1;
  }
  //   }
  //   lastKey = Date.now();
  if (e.keyCode == 32 && gameState === "PLAY") {
    game.changeState("PAUSE");
    game.stop();
  } else if (e.keyCode == 32 && gameState === "PAUSE") {
    game.changeState("PLAY");
    game.play();
    animate();
  }
}

document.addEventListener("keydown", keyboardHandler);

// Hammertime event listener
let hammertime = new Hammer.Manager(document.querySelector("body"));

hammertime.add(
  new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 })
);
hammertime.add(new Hammer.Tap({ event: "doubletap", taps: 2 }));
hammertime.get("pan");
hammertime.get("doubletap");
hammertime.on(`panleft panright panup pandown doubletap`, function (e) {
//   if (Date.now() - lastKey > safeDelay) {
    if (e.type === `panleft` && game.moveIsValid(-1)) {
      direction = -1;
    } else if (e.type === `panup` && game.moveIsValid(-2)) {
      direction = -2;
    } else if (e.type === `panright` && game.moveIsValid(1)) {
      direction = 1;
    } else if (e.type === `pandown` && game.moveIsValid(2)) {
      direction = 2;
    }
//   }
//   lastKey = Date.now();
  if (e.type == "doubletap" && gameState === "PLAY") {
    game.changeState("PAUSE");
    game.stop();
  } else if (e.type == "doubletap" && gameState === "PAUSE") {
    game.changeState("PLAY");
    game.play();
    animate();
  }
});

// GAME INITIALISATION
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const scoresScreen = document.getElementById("scores-screen");
const optionsScreen = document.getElementById("options-screen");

const canvasHeightToWidthRatio = 20 / 23; // ie 20 wide, 23 high to account for score area

let orientationPortrait;
let tile;
let tileToSparkDRatio;

const canvasWidthToLineWidthRatio = 150; // used in gameBoard object
const tileToSparkGravityRatio = 0.009; // used in spark object
const fontRatio = 0.058; // used in scoreBoard object

let newSnake = function () {
  snake = new Snake(15 * tile, 15 * tile, "rgba(223,0,254,1)");
};

let newFood = function () {
  food = new Food(colorArray[Math.floor(Math.random() * colorArray.length)]); // picks random color from colorArray
};

let newGame = function () {
  gameBoard.checkOrientation(); // could refactor?
  gameBoard.setCanvasSize();
  gameBoard.setTileSize();
  scoreBoard.getCurrentHighScore();
  game.loadDefaultSettings();

  newSnake();
  newFood();
  game.changeState("PLAY");
  animate();
  game.startTime = Date.now();

  game.play();
};

// Game area object
let gameBoard = {
  checkOrientation() {
    if (window.innerWidth <= window.innerHeight) {
      orientationPortrait = true;
    } else {
      orientationPortrait = false;
    }
  },
  setCanvasSize() {
    if (orientationPortrait) {
      canvas.height = window.innerWidth;
    } else {
      canvas.height = window.innerHeight;
    }
    while (canvas.height % 23 > 0) {
      canvas.height--;
    }
    canvas.width = Math.ceil(canvas.height * canvasHeightToWidthRatio);
  },
  setTileSize() {
    tile = canvas.width / 20;
  },
  recalculateAssets() {
    if (gameState === "PLAY" || stats.gamesPlayedThisSession > 0) {
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
      if (gameState !== "PLAY") {
        animate();
      }
    }
  },
  draw() {
    // Score background
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = "#001437";
    ctx.fillRect(0, 0, canvas.width, tile * 3);

    // GameBoard Background
    ctx.fillStyle = "#001437";
    ctx.fillRect(0, tile * 3, canvas.width, canvas.height);

    // Walls
    if (wallsEnabled) {
      ctx.strokeStyle = "red";
    } else {
      ctx.strokeStyle = "green";
    }
    ctx.lineWidth = canvas.width / canvasWidthToLineWidthRatio;
    ctx.strokeRect(
      ctx.lineWidth / 2,
      ctx.lineWidth / 2,
      canvas.width - ctx.lineWidth,
      3 * tile
    );
    ctx.strokeRect(
      ctx.lineWidth / 2,
      tile * 3 + ctx.lineWidth / 2,
      canvas.width - ctx.lineWidth,
      canvas.height - 3 * tile - ctx.lineWidth
    );

    ctx.closePath();
    ctx.restore();
  },
};

// Window resize and orientationchange event listeners
window.addEventListener("resize", gameBoard.recalculateAssets);
window.addEventListener("orientationchange", gameBoard.recalculateAssets);

// Stats object

let stats = {
  gamesPlayedThisSession: 0,
  gamesPlayedAllTime: parseInt(localStorage.getItem("games")) || 0,
  gameTimeInSeconds: 0,
  updateGamesPlayed() {
    this.gamesPlayedThisSession++;
    this.gamesPlayedAllTime += 1;
    localStorage.setItem("games", this.gamesPlayedAllTime);
  },
  updateGameTimeInSeconds() {
    this.gameTimeInSeconds = Math.round((Date.now() - game.startTime) / 1000);
  },
};

// Scoreboard object

let scoreBoard = {
  array: [],
  previousScore: undefined,
  currentScore: undefined,
  currentHighScore: undefined,
  highScore: parseInt(localStorage.getItem("top")) || 0,
  update() {
    if (this.array.includes(this.currentScore) || this.currentScore === 0) {
      return;
    } else {
      this.array.push(this.currentScore);
      this.array.sort((a, b) => b - a);
    }
  },
  getCurrentHighScore() {
    this.currentHighScore = parseInt(localStorage.getItem("top"));
  },
  updateHighScore() {
    if (this.currentScore > parseInt(this.highScore)) {
      localStorage.setItem("top", this.currentScore);
      this.highScore = this.currentScore;
    } else {
      return;
    }
  },
  resetArray() {
    this.array.length = 0;
    this.currentScore = 0;
    score = 0;
    this.print();
  },
  resetHighScore() {
    localStorage.removeItem("top");
    this.highScore = 0;
    if (stats.gamesPlayedThisSession > 0) {
      animate();
    }
  },
  getFont() {
    let fontSize = canvas.width * fontRatio;
    return (fontSize | 0) + "px Orbitron";
  },
  draw() {
    ctx.fillStyle = "#fff";
    ctx.font = this.getFont();
    ctx.fillText(this.currentScore, tile, tile * 2);
    ctx.fillText(
      `High score: ${this.highScore}`,
      canvas.width * 0.45,
      tile * 2
    );
  },
  print() {
    let scoreAwardText = document.getElementById("score-award-text");

    scoreAwardText.innerHTML = "";
    // arrow function needed to prevent invalid reference to this.currentScore (thanks to robinz_alumni for tip)
    let scoreRange = (min, max) => {
      if (this.currentScore >= min && this.currentScore < max + 1) {
        return true;
      }
    };

    if (isNaN(this.currentHighScore) && this.currentScore !== 0) {
      scoreAwardText.innerHTML = `You're off the mark, so to speak. `;
    }

    if (this.currentScore > this.currentHighScore) {
      scoreAwardText.innerHTML = `Signs of improvement. You beat your previous high score by ${
        this.currentScore - this.currentHighScore
      }.</br>`;
    }

    if (this.currentScore === 0) {
      scoreAwardText.innerHTML = `Oof.`;
    }

    if (scoreRange(1, 4) && this.currentScore < this.currentHighScore) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `${this.currentScore} is a fine score. `
      );
    }

    if (scoreRange(5, 9)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Lamentably, the Universal High Scores feature has yet to be implemented. `
      );
    }

    if (scoreRange(10, 19)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Double digits. Your job here is done. `
      );
    }

    if (scoreRange(20, 29)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Attempt #${stats.gamesPlayedAllTime} and you got ${this.currentScore}. Speaks for itself. `
      );
    }

    if (scoreRange(30, 39)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `FYI this is Cyber <span style="text-decoration: underline;">Snake</span>, not Cyber Slow Worm. `
      );
    }

    if (scoreRange(40, 49)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `It only took you ${convertSecondsToMs(
          stats.gameTimeInSeconds
        )} to disappoint me this time. `
      );
    }

    if (scoreRange(50, 59)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Maybe getting to 50 was good enough for you. `
      );
    }

    if (scoreRange(60, 69)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `${convertSecondsToMs(stats.gameTimeInSeconds)} to score ${
          this.currentScore
        }? What a triumph. `
      );
    }

    if (scoreRange(70, 79)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `"I was distracted by the pretty colors!", I hear you wail. `
      );
    }

    if (scoreRange(80, 89)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Next time, have a vague strategy. `
      );
    }

    if (scoreRange(90, 99)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Did you consider persevering and making it to 100? `
      );
    }

    if (
      this.currentScore >= 100 &&
      this.currentScore < 125 &&
      (this.currentHighScore < 100 || isNaN(this.currentHighScore))
    ) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `That's quite the milestone you've hit.<br>And it only took you ${stats.gamesPlayedAllTime} attempts! `
      );
    } else if (scoreRange(100, 124)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `The Nanite Narwhal would be proud. `
      );
    }
    if (scoreRange(125, 149)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `That was actually pretty good. `
      );
    }

    if (scoreRange(150, 199)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `The Digital Mongoose has been informed of your progress. `
      );
    }

    if (scoreRange(200, 299)) {
      scoreAwardText.insertAdjacentHTML("beforeend", `Definitely cheating. `);
    }

    if (scoreRange(300, 396)) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Assuming you're not cheating, I'm impressed by your commitment and sorry that you have wasted your time. `
      );
    }

    if (this.currentScore == 397) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Congratulations.<br>You have completed the tutorial of Cyber Snake.<br>In Level 001 the food is invisible. You have 3 lives remaining.<br>Good luck. `
      );
    }

    if (this.currentScore > 397) {
      scoreAwardText.insertAdjacentHTML("beforeend", `Is that even possible? `);
    }

    if (this.currentScore === this.previousScore && this.currentScore !== 0) {
      scoreAwardText.innerHTML = `Oops you did it again. `;
    }

    if (
      this.currentScore > this.currentHighScore &&
      this.currentScore - this.currentHighScore <= 5 &&
      stats.gameTimeInSeconds > 300
    ) {
      scoreAwardText.innerHTML = `${convertSecondsToMs(
        stats.gameTimeInSeconds
      )} to add a measly ${
        this.currentScore - this.currentHighScore
      } to your PB.<br> Yikes.`;
    }

    if (this.currentScore > this.previousScore && this.previousScore === 0) {
      scoreAwardText.innerHTML = `Well, anything was an improvement on last time. Extra credit for testing the walls out though. `;
    }

    if (this.previousScore - this.currentScore > 50) {
      scoreAwardText.insertAdjacentHTML(
        "beforeend",
        `Try to remember what you did on your previous attemps. That was better. `
      );
    }

    let scoreOl = document.querySelector("ol");
    scoreOl.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      let newScoreLi = document.createElement("li");
      newScoreLi.textContent = this.array[i];
      scoreOl.appendChild(newScoreLi);
    }
    let scoreLi = document.querySelectorAll("li");
    for (let i = 0; i < scoreLi.length; i++) {
      if (
        scoreLi[i].textContent == this.currentScore &&
        this.currentScore != 0
      ) {
        scoreLi[i].classList.add("special-menu-text");
      }
    }
  },
};

// Snake constructor
class Snake {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.array = [
      { x: this.x, y: this.y },
      { x: this.x + tile, y: this.y },
      { x: this.x + tile * 2, y: this.y },
    ];
  }

  get newHead() {
    if (direction === -1) {
      return { x: this.x - tile, y: this.y };
    }
    if (direction === -2) {
      return { x: this.x, y: this.y - tile };
    }
    if (direction === 1) {
      return { x: this.x + tile, y: this.y };
    }
    if (direction === 2) {
      return { x: this.x, y: this.y + tile };
    }
  }

  lastMove() {
    if (this.array[0].x < this.array[1].x) {
      game.lastMove = -1;
    } else if (this.array[0].x > this.array[1].x) {
      game.lastMove = 1;
    } else if (this.array[0].y < this.array[1].y) {
      game.lastMove = -2;
    } else if (this.array[0].y > this.array[1].y) {
      game.lastMove = 2;
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
      ctx.strokeStyle = "#001437";
      ctx.strokeRect(this.array[i].x, this.array[i].y, tile, tile);
    }
  }
}

// Food constructor
class Food {
  constructor(color) {
    this.x = Math.floor(Math.random() * 20) * tile;
    this.y = Math.floor(Math.random() * 20 + 3) * tile; // taking account of the score area
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
    ctx.strokeStyle = "#000";
    ctx.shadowBlur = tile / 2;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
}

function dynamicSparkGravity() {
  return tile * tileToSparkGravityRatio;
}

// Spark constructor
class Spark {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = randomNumber(tile / 10, tile / 4);
    this.color = food.color;
    this.gravity = randomNumber(
      dynamicSparkGravity(),
      dynamicSparkGravity() * 2
    );
    this.friction = randomNumber(0.4, 0.6);
    this.ttl = 25; // time to live ticks
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

function dynamicSparkD() {
  return tile * tileToSparkDRatio;
}

// Spark array
function populateSparkArray() {
  for (let i = 0; i < snake.array.length && i < 150; i++) {
    let dx;
    let dy;
    let x = snake.array[0].x + tile / 2;
    let y = snake.array[0].y + tile / 2;
    if (direction === -2) {
      dx = randomNumber(-dynamicSparkD(), dynamicSparkD());
      dy = randomNumber(-dynamicSparkD(), -dynamicSparkD() / 2);
    }
    if (direction === 2) {
      dx = randomNumber(-dynamicSparkD(), dynamicSparkD());
      dy = randomNumber(dynamicSparkD(), dynamicSparkD() * 2);
    }
    if (direction === -1) {
      dx = randomNumber(-dynamicSparkD() * 2, -dynamicSparkD());
      dy = randomNumber(-dynamicSparkD(), dynamicSparkD());
    }
    if (direction === 1) {
      dx = randomNumber(dynamicSparkD(), dynamicSparkD() * 2);
      dy = randomNumber(-dynamicSparkD(), dynamicSparkD());
    }

    sparkArray.push(new Spark(x, y, dx, dy));
  }
}

// Game loop with conditions for which functions are called depending on game state
let gameLoop = function () {
  if (gameState === "PLAY") {

    game.checkSnakeCollision();
    game.checkAteFood();
    game.update();
    snake.update();
    snake.lastMove();
    scoreBoard.updateHighScore();
  } else {
    game.stop();
  }
};

let game = {
  collisionDetected: false,
  ateFood: false,
  lastMove: "",
  startTime: 0,
  changeState(state) {
    gameState = state;
    this.showScreen(state);
  },
  makeVisible(screen) {
    screen.style.visibility = "visible";
  },
  makeHidden(screen) {
    screen.style.visibility = "hidden";
  },
  showScreen(state) {
    if (state === "PLAY") {
      this.makeHidden(startScreen);
      this.makeHidden(scoresScreen);
    }
    if (state === "GAMEOVER") {
      this.makeHidden(optionsScreen);
      this.makeVisible(scoresScreen);
    }
    if (state === "OPTIONS") {
      this.makeHidden(startScreen);
      this.makeHidden(scoresScreen);
      this.makeVisible(optionsScreen);
    }
    if (state === "MENU") {
      this.makeHidden(scoresScreen);
      this.makeHidden(optionsScreen);
      this.makeVisible(startScreen);
    }
  },
  loadDefaultSettings() {
    this.collisionDetected = false;
    this.AteFood = false;
    sparkArray.length = 0;
    direction = -1;
    lastKey = 0;
    scoreBoard.previousScore = scoreBoard.currentScore;
    scoreBoard.currentScore = 0;
    tileToSparkDRatio = 0.1;

    if (wallsCheckBox.checked) {
      wallsEnabled = true;
    } else {
      wallsEnabled = false;
    }

    if (audioCheckBox.checked) {
      gameAudio = true;
    } else {
      gameAudio = false;
    }
  },
  toggleWalls() {
    wallsEnabled = !wallsEnabled;
  },
  play() {
    gameRefreshInterval = setInterval(function () {
      gameLoop();
    }, gameSpeed);
  },
  stop() {
    clearInterval(gameRefreshInterval);
  },
  checkSnakeCollision() {
    for (let i = 0; i < snake.array.length; i++) {
      if (
        snake.newHead.x === snake.array[i].x &&
        snake.newHead.y === snake.array[i].y
      ) {
        this.collisionDetected = true;
      }
      if (snake.newHead.x > canvas.width - tile && direction === 1) {
        if (wallsEnabled) {
          this.collisionDetected = true;
        } else {
          snake.x = -tile;
        }
      }

      if (snake.newHead.x < 0 && direction === -1) {
        if (wallsEnabled) {
          this.collisionDetected = true;
        } else {
          snake.x = canvas.width;
        }
      }

      if (snake.newHead.y > canvas.height - tile && direction === 2) {
        if (wallsEnabled) {
          this.collisionDetected = true;
        } else {
          snake.y = 2 * tile;
        }
      }

      if (snake.newHead.y < 3 * tile && direction === -2) {
        if (wallsEnabled) {
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
    if (this.lastMove === -newDir && direction !== newDir) {
      return false;
    }
    else if (this.lastMove === newDir && direction !== -newDir) {
      return false;
    } else {
      return true;
    }
  },
  update() {
    if (this.collisionDetected) {
      stats.updateGamesPlayed();
      stats.updateGameTimeInSeconds();
      scoreBoard.update();
      scoreBoard.print();
      game.changeState("GAMEOVER");
      if (gameAudio) {
        gameOverSound.play();
      }
    } else if (this.AteFood) {
      snake.array.unshift(snake.newHead);
      populateSparkArray();
      newFood();
      scoreBoard.currentScore++;
      tileToSparkDRatio += 0.0025;
      if (gameAudio) {
        eatSound.play();
      }
    } else {
      snake.array.unshift(snake.newHead);
      snake.array.pop();
    }
  },
};

// Animation loop
function animate() {
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

  if (gameState === "PLAY") {
    requestAnimationFrame(animate);
  } else {
    return;
  }
}
