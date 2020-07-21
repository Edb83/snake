// Global variables
let gameState = "MENU";
let highScore = parseInt(localStorage.getItem("top")) || 0; // all time high score (since reset)
let currentHighScore; // highest score since window refresh
let currentScore; // score this game
const scoreBoardArray = []; // top five scores since window refresh
let sparkArray = [];

let direction;
const gameSpeed = 125; // fed into setInterval for game updates (ie game speed) 
let lastKey = 0; // used to store time since last keydown
const safeDelay = 130; // used to add minimum interval between key presses to prevent snake eating its neck (milliseconds)
let myInterval = null; // used to prevent interval recorded by setInterval from increasing each time a new game is loaded

let snake;
let food;

let collisionDetected;
let ateFood;

const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameoverSound");

// Random number generator
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Color array
// Randomiser: colorArray[Math.floor(Math.random() * colorArray.length)]
const colorArray = [
  "rgba(128,255,0,1)",
  "rgba(252,243,64,1)",
  "rgba(251,51,219,1)",
  "rgba(3,16,234,1)",
];

// Keydown event listener
function keyboardHandler(event) {
  if (Date.now() - lastKey > safeDelay) { // checks time since last key press to prevent multiple presses causing snake to eat its neck
    if (event.keyCode == 38 && direction !== "down") {
      direction = "up";
    } else if (event.keyCode == 40 && direction !== "up") {
      direction = "down";
    } else if (event.keyCode == 37 && direction !== "right") {
      direction = "left";
    } else if (event.keyCode == 39 && direction !== "left") {
      direction = "right";
    }
  }
  lastKey = Date.now();
}

// GAME INITIALISATION
const gameBoard = document.getElementById("gameBoard");
gameBoard.width = 500;
gameBoard.height = Math.ceil(gameBoard.width * 1.15);
document.addEventListener("keydown", keyboardHandler);

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const ctx = gameBoard.getContext("2d");
const tile = gameBoard.width / 20; // the tile represents the smallest unit of measurement for the gameBoard

let newSnake = function () {
  snake = new Snake(15 * tile, 15 * tile, "rgba(251,51,219,1)");
};

let newFood = function () {
  food = new Food("rgba(128,255,0,1)");
};

let newGame = function () {
  // resets all variables for a fresh game, preserving setInterval of gameLoop
  collisionDetected = false;
  ateFood = false;
  sparkArray = [];
  direction = "left";
  scoreBoard.getCurrentHighScore();
  currentScore = 0;
  newSnake();
  newFood();
  if (myInterval === null) {
    myInterval = setInterval(function () {
      gameLoop();
    }, gameSpeed);
  }
  changeState("PLAY");
  animate();
};

// Game area object
let gameArea = {
    draw: function () {

    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, tile * 3, gameBoard.width, gameBoard.height);

    // Score background
    ctx.fillStyle = "#001437";
    ctx.fillRect(0, 0, gameBoard.width, tile * 3);
    }
}

// Scoreboard object
let scoreBoard = {
  update: function () {
    if (scoreBoardArray.includes(currentScore) || currentScore === 0) {
      return;
    } else {
      scoreBoardArray.push(currentScore);
      scoreBoardArray.sort((a, b) => b - a);
    }
  },
  resetArray: function () {
    scoreBoardArray = [];
  },
  getCurrentHighScore: function () {
    currentHighScore = parseInt(localStorage.getItem("top"));
  },
  updateHighScore: function () {
    if (currentScore > parseInt(highScore)) {
      localStorage.setItem("top", currentScore);
      highScore = currentScore;
    } else {
      return;
    }
  },
  resetHighScore: function () {
    localStorage.removeItem("top");
    highScore = 0;
  },
  draw: function () {
    ctx.fillStyle = "#fff";
    ctx.font = "25px Orbitron";
    ctx.fillText(currentScore, tile, tile * 2);
    ctx.fillText(`High score: ${highScore}`, gameBoard.width * 0.35, tile * 2);
  },
  print: function () {
    let highScoreAward = document.getElementById("highScoreAward");
    highScoreAward.innerHTML = "";
    if (currentScore > currentHighScore) {
      highScoreAward.innerHTML = `Congratulations!</br>You beat your previous high score by ${
        currentScore - currentHighScore
      }!`;
    }
    let scoreOl = document.querySelector("ol");
    scoreOl.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      let scoreLi = document.createElement("li");
      scoreLi.textContent = scoreBoardArray[i];
      scoreOl.appendChild(scoreLi);
    }
  },
};

// Game loop with conditions for which functions are called depending on game state
let gameLoop = function () {
  if (gameState === "PLAY") {
    snake.checkCollision();
    snake.checkAteFood();
    snake.advance();
    snake.update();
    scoreBoard.updateHighScore();
  } else {
    return;
  }
};

// Game state selection
function changeState(state) {
  gameState = state;
  showScreen(state);
}

function makeVisible(screen) {
  screen.style.visibility = "visible";
}

function makeHidden(screen) {
  screen.style.visibility = "hidden";
}

function showScreen(state) {
  if (state === "PLAY") {
    makeHidden(startScreen);
    makeHidden(gameOverScreen);
  }
  if (state === "GAMEOVER") {
    makeVisible(gameOverScreen);
  }
}

// Snake constructor
class Snake {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.array = [{ x: this.x, y: this.y }];
  }

  get newHead() {
    if (direction === "left") {
      return { x: this.x - tile, y: this.y };
    }
    if (direction === "up") {
      return { x: this.x, y: this.y - tile };
    }
    if (direction === "right") {
      return { x: this.x + tile, y: this.y };
    }
    if (direction === "down") {
      return { x: this.x, y: this.y + tile };
    }
  }
  update() {
    this.x = this.newHead.x;
    this.y = this.newHead.y;
  }
  checkCollision() {
    for (let i = 0; i < this.array.length; i++) {
      if (
        this.newHead.x === this.array[i].x &&
        this.newHead.y === this.array[i].y
      ) {
        collisionDetected = true;
      }
      if (this.newHead.x > gameBoard.width - tile && direction === "right") {
        // collisionDetected = true;
        this.x = -tile;
      }

      if (this.newHead.x < 0 && direction === "left") {
        // collisionDetected = true;
        this.x = gameBoard.width;
      }

      if (this.newHead.y > gameBoard.height - tile && direction === "down") {
        // collisionDetected = true;
        this.y = 2 * tile;
      }

      if (this.newHead.y < 3 * tile && direction === "up") {
        // collisionDetected = true;
        this.y = gameBoard.height
      }
    }
  }
  checkAteFood() {
    for (let i = 0; i < this.array.length; i++) {
      if (food.x === this.array[i].x && food.y === this.array[i].y) {
        newFood(); // if food is within snake body, spawns new food
      }
    }
    if (this.newHead.x === food.x && this.newHead.y === food.y) {
      ateFood = true;
    } else {
      ateFood = false;
    }
  }
  advance() {
    if (collisionDetected === true) {
      gameOverSound.play();
      scoreBoard.update();
      scoreBoard.print();
      changeState("GAMEOVER");
      return;
    } else if (ateFood === true) {
      newFood();
      this.array.unshift(this.newHead);
      currentScore++;
      eatSound.play();
      populateSparkArray();
    } else {
      this.array.unshift(this.newHead);
      this.array.pop();
    }
  }
  draw() {
    for (let i = 0; i < snake.array.length; i++) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(snake.array[i].x, snake.array[i].y, tile, tile); // fills tiles occupied by snake array's coordinates

      ctx.restore();
      ctx.strokeStyle = "#000";
      ctx.strokeRect(snake.array[i].x, snake.array[i].y, tile, tile);
    }
  }
}

// Food constructor
class Food {
  constructor(color) {
    this.x = Math.floor(Math.random() * 20) * tile;
    this.y = Math.floor(Math.random() * 20 + 3) * tile;
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
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

// Spark constructor
class Spark {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.gravity = randomNumber(0.2, 0.4);
    this.friction = randomNumber(0.4, 0.6);
    this.ttl = 25;
    this.opacity = 1;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle =
      this.color.substring(0, this.color.length - 2) + this.opacity + ")";
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
}

Spark.prototype.update = function () {
  this.draw();

  if (this.x + this.radius > gameBoard.width || this.x - this.radius < 0) {
    this.dx = -this.dx;
  }
  this.x += this.dx;

  if (this.y + this.radius > gameBoard.height) {
    this.dy = -this.dy * this.friction;
    this.ttl -= 1;
    this.opacity -= 1 / this.ttl;
  } else {
    this.dy += this.gravity;
  }
  this.y += this.dy;
};

// Spark array
function populateSparkArray() {
  for (let i = 0; i < snake.array.length && i < 150; i++) {
    let dx;
    let dy;
    let x = snake.array[0].x + tile / 2;
    let y = snake.array[0].y + tile / 2;
    if (direction === "up") {
      dx = randomNumber(-2, 2);
      dy = randomNumber(-5, -2);
    }
    if (direction === "down") {
      dx = randomNumber(-2, 2);
      dy = randomNumber(2, 5);
    }
    if (direction === "left") {
      dx = randomNumber(-4, -1);
      dy = randomNumber(-3, 3);
    }
    if (direction === "right") {
      dx = randomNumber(1, 4);
      dy = randomNumber(-3, 3);
    }
    let radius = randomNumber(2, 5);
    sparkArray.push(new Spark(x, y, dx, dy, radius));
  }
}

// Animation loop
function animate() {
  if (gameState === "PLAY") {
    requestAnimationFrame(animate);

    gameArea.draw();
    food.draw();
    scoreBoard.draw();
    snake.draw();

    sparkArray.forEach((spark, index) => {
      spark.update();
      if (spark.ttl === 0) {
        sparkArray.splice(index, 1);
      }
    });
  } else {
    return;
  }
}