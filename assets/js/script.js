// Global variables
let gameState = "MENU";
let score = "";
let scoreBoard = [];
let direction;
const gameSpeed = 150; // lower is faster
let lastKey = 0; // used to store time since last keydown
const safeDelay = 130; // refresh rate speed to prevent snake eating its neck when multiple keys pressed

let food;
let eat = document.getElementById("eatSound");
let gameover = document.getElementById("gameoverSound");
let music = document.getElementById("music");
let myInterval = null; // used to prevent interval recorded by setInterval from increasing each time a new game is loaded

let newHead;
let collisionDetected = false;
let ateFood = false;

let gravity = 0.2;
let friction = 0.4;

// Initialise Game

const gameBoard = document.getElementById("gameBoard");
gameBoard.width = 500;
gameBoard.height = Math.ceil(gameBoard.width * 1.15);
document.addEventListener("keydown", keyboardHandler);

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const ctx = gameBoard.getContext("2d");
const tile = gameBoard.width / 20; // the tile represents the smallest unit of measurement for the gameBoard

let snake = [];
snake[0] = {
  x: 15 * tile,
  y: 19 * tile,
};
snake[1] = {
  x: 16 * tile,
  y: 19 * tile,
};
snake[2] = {
  x: 17 * tile,
  y: 19 * tile,
};

// Keydown event listener

function keyboardHandler(event) {
  if (Date.now() - lastKey > safeDelay) {
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

// Get coordinates of new food
let newFood = function () {
  food = {
    x: Math.floor(Math.random() * 20) * tile,
    y: Math.floor(Math.random() * 20 + 3) * tile,
  };
};

let colorArray = [
    "red",
    "orange",
    "yellow"
]

// Starting coordinates of snake
let newSnake = function () {
  snake[0] = {
    x: 15 * tile,
    y: 19 * tile,
  };
  snake[1] = {
    x: 16 * tile,
    y: 19 * tile,
  };
  snake[2] = {
    x: 17 * tile,
    y: 19 * tile,
  };
};

let newGame = function () {
  // resets all variables for a fresh game, preserving setInterval of gameLoop
  collisionDetected = false;
  snake = [];
  sparkArray = [];
  direction = "left";
  score = 0;
  newSnake();
  newFood();
  if (myInterval === null) {
    myInterval = setInterval(function () {
      gameLoop();
    }, gameSpeed);
  }
  changeState("PLAY");
  //   music.play();
  animate();
};

// Game HUD
let gameHud = {
  showScoreBoard: function () {
    let scoreOl = document.querySelector("ol");
    scoreOl.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      let scoreLi = document.createElement("li");
      scoreLi.textContent = scoreBoard[i];
      scoreOl.appendChild(scoreLi);
    }
  },
};

// Update

function findNewHead() {
  let newHeadX = snake[0].x;
  let newHeadY = snake[0].y;

  // Move the snake head according to keydown event listener - will provide coordinates of the new snake head
  if (direction === "up") {
    newHeadY = newHeadY - tile; // Y coordinate of head reduced by tile length
  } else if (direction === "down") {
    newHeadY = newHeadY + tile; // Y coordinate of head increased by tile length
  } else if (direction === "left") {
    newHeadX = newHeadX - tile; // X coordinate of head reduced by tile length
  } else if (direction === "right") {
    newHeadX = newHeadX + tile; // X coordinate of head increased by tile length
  }

  newHead = {
    x: newHeadX,
    y: newHeadY,
  };
}

function checkCollision() {
  for (let i = 0; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      collisionDetected = true;
    }
    if (newHead.x > gameBoard.width - tile && direction === "right") {
      collisionDetected = true;
    }

    if (newHead.x < 0 && direction === "left") {
      collisionDetected = true;
    }

    if (newHead.y > gameBoard.height - tile && direction === "down") {
      collisionDetected = true;
    }

    if (newHead.y < 3 * tile && direction === "up") {
      collisionDetected = true;
    }
  }
}

function checkAteFood() {
  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      newFood();
    }
  }
  if (newHead.x === food.x && newHead.y === food.y) {
    ateFood = true;
  } else {
    ateFood = false;
  }
}
function advanceSnake() {
  if (collisionDetected === true) {
    gameover.play();
    updateScoreBoard();
    gameHud.showScoreBoard();
    changeState("GAMEOVER");
    return;
  } else if (ateFood === true) {
    newFood();
    snake.unshift(newHead);
    score++;
    eat.play();
    populateSparkArray();
  } else {
    snake.unshift(newHead);
    snake.pop();
  }
}

function updateScoreBoard() {
  if (scoreBoard.includes(score) || score === 0) {
    return;
  } else {
    scoreBoard.push(score);
    scoreBoard.sort((a, b) => b - a); // sorts in descending order once added to scoreboard
  }
}

// Game loop with conditions for which functions are called depending on game state
let gameLoop = function () {
  if (gameState === "PLAY") {
    findNewHead();
    checkCollision();
    checkAteFood();
    advanceSnake();
  }
  if (gameState === "MENU") {
    // NEED TO REPOPULATE
  } else {
    // NEED TO REPOPULATE
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

// Creating the spark
class Spark {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

Spark.prototype.update = function () {
  this.draw();

  if (this.x + this.radius > gameBoard.width || this.x - this.radius < 0) {
    this.dx = -this.dx;
  }
  this.x += this.dx;

  if (this.y + this.radius > gameBoard.height) {
    this.dy = -this.dy * friction;
  this.radius -= 1
  } else {
    this.dy += gravity;
  }
  this.y += this.dy;
};

let sparkArray = [];
function populateSparkArray() {
  for (let i = 0; i < snake.length; i++) {
    let x = snake[0].x + tile / 2;
    let y = snake[0].y + tile / 2;
    let dx = Math.random() - 0.3 * 3;
    let dy = Math.random() - 1 * 2;
    let radius = 5;
    if (sparkArray.length > 250) {
      sparkArray.shift(0, sparkArray.length);
    } else {
      sparkArray.push(new Spark(x, y, dx, dy, radius));
    }
  }
}

// Animation
function animate() {
  if (gameState === "PLAY") {
    requestAnimationFrame(animate);

    // Clear gameBoard
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height); // clears any tiles filled on each draw to prevent trail

    // Background
    if (gameState === "MENU") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    } else {
      ctx.fillStyle = "#eaeaea";
      ctx.fillRect(0, tile * 3, gameBoard.width, gameBoard.height);
    }
    // Score background
    ctx.fillStyle = "#5a0b70ed";
    ctx.fillRect(0, 0, gameBoard.width, tile * 3);
    // Score text
    ctx.fillStyle = "#fff";
    ctx.font = "25px Impact";
    ctx.fillText(score, tile, tile * 2);
    // Highscore text
    ctx.fillStyle = "#fff";
    ctx.font = "25px Impact";
    if (scoreBoard.length > 0 && Math.max(...scoreBoard) > score) {
      ctx.fillText(
        `High score: ${Math.max(...scoreBoard)}`,
        gameBoard.width * 0.675,
        tile * 2
      );
    } else {
      ctx.fillText(`High score: ${score}`, gameBoard.width * 0.675, tile * 2);
    }
    // Food
    ctx.beginPath();
    ctx.arc(
      food.x + (tile - 3) / 2,
      food.y + (tile - 3) / 2,
      tile / 2,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "#ff8d28";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
    // Snake
    ctx.fillStyle = "#fff";
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i].x, snake[i].y, tile, tile); // fills tiles occupied by snake array's coordinates
      ctx.strokeStyle = "#000";
      ctx.strokeRect(snake[i].x, snake[i].y, tile, tile);
    }
    if (collisionDetected === true) {
      ctx.fillStyle = "#e4232a";
      ctx.fillRect(snake[0].x, snake[0].y, tile, tile);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(snake[0].x, snake[0].y, tile, tile);
    }

    sparkArray.forEach((spark, index) => {
      spark.update();
      if (spark.radius === 0) {
          sparkArray.splice(index, 1)
      }
    });
  } else {
    return;
  }
}
