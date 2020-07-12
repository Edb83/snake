// Global variables
let gameState = "MENU";
let highScore = parseInt(localStorage.getItem("top")) || 0;
let currentHighScore;
let currentScore;
let scoreBoardArray = [];
let sparkArray = [];

let direction;
const gameSpeed = 150; // lower is faster
let lastKey = 0; // used to store time since last keydown
const safeDelay = 130; // refresh rate speed to prevent snake eating its neck when multiple keys pressed
let myInterval = null; // used to prevent interval recorded by setInterval from increasing each time a new game is loaded

let snake;
let food;

let newHead;
let collisionDetected;
let ateFood;

let eat = document.getElementById("eatSound");
let gameover = document.getElementById("gameoverSound");

// Random number generator
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Color array
let colorArray = [
  "rgba(128,255,0,1)",
  "rgba(252,243,64,1)",
  "rgba(251,51,219,1)",
  "rgba(3,16,234,1)",
];

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

// GAME INITIALISATION
const gameBoard = document.getElementById("gameBoard");
gameBoard.width = 500;
gameBoard.height = Math.ceil(gameBoard.width * 1.15);
document.addEventListener("keydown", keyboardHandler);

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const ctx = gameBoard.getContext("2d");
const tile = gameBoard.width / 20; // the tile represents the smallest unit of measurement for the gameBoard

// Create new snake [NEEDS TO BE CONVERTED TO SNAKE OBJECT]
let newSnake = function () {
  snake = [];
  snake[0] = {
    x: 17 * tile,
    y: 13 * tile,
  };
};

// Create new Food
let newFood = function () {
  food = new Food();
};

let newGame = function () {
  // resets all variables for a fresh game, preserving setInterval of gameLoop
  collisionDetected = false;
  ateFood = false;
  sparkArray = [];
  direction = "left";
  scoreBoard.getCurrentHighScore();
  currentScore = 0;
  newSnake(); // [NEEDS TO BE CONVERTED TO SNAKE OBJECT]
  newFood();
  if (myInterval === null) {
    myInterval = setInterval(function () {
      gameLoop();
    }, gameSpeed);
  }
  changeState("PLAY");
  animate();
};

// Snake updates [NEEDS TO BE CONVERTED TO SNAKE OBJECT]

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

// Collision detection [NEEDS TO BE CONVERTED TO SNAKE OBJECT]
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

// Food updates
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

// Snake updates [NEEDS TO BE CONVERTED TO SNAKE OBJECT]
function advanceSnake() {
  if (collisionDetected === true) {
    gameover.play();
    scoreBoard.update();
    scoreBoard.print();
    changeState("GAMEOVER");
    return;
  } else if (ateFood === true) {
    newFood();
    snake.unshift(newHead);
    currentScore++;
    eat.play();
    populateSparkArray();
  } else {
    snake.unshift(newHead);
    snake.pop();
  }
}

// Scoreboard
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
    ctx.fillText(`High score: ${highScore}`, gameBoard.width * 0.5, tile * 2);
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
    findNewHead();
    checkCollision();
    checkAteFood();
    advanceSnake();
    scoreBoard.updateHighScore();
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

// // Snake object
// class Snake {
//   constructor(x, y, dx, dy, color) {
//     this.x = x;
//     this.y = y;
//     this.dx = dx;
//     this.dy = dy;
//     this.color = color;
//   }

//   update() {
//     if (direction === "up") {
//       this.dy = -tile;
//       this.dx = 0;
//     }
//     if (direction === "down") {
//       this.dy = +tile;
//       this.dx = 0;
//     }
//     if (direction === "left") {
//       this.dy = 0;
//       this.dx = -tile;
//     }
//     if (direction === "right") {
//       this.dy = 0;
//       this.dx = +tile;
//     }
//     this.x += this.dx;
//     this.y += this.dy;

//     snakeArray.push(
//       new Snake(
//         this.x,
//         this.y,
//         this.dx,
//         this.dy,
//         colorArray[Math.floor(Math.random() * colorArray.length)]
//       )
//     );
//     // snakeArray.pop();
//   }

//   draw() {
//     for (let i = 0; i < snakeArray.length; i++) {
//       ctx.save();
//       ctx.fillStyle = snakeArray[i].color;
//       ctx.shadowColor = snakeArray[i].color;
//       ctx.shadowBlur = 10;
//       ctx.fillRect(snakeArray[i].x, snakeArray[i].y, tile, tile); // fills tiles occupied by snake array's coordinates
//       ctx.restore();
//       ctx.strokeStyle = "#000";
//       ctx.strokeRect(snakeArray[i].x, snakeArray[i].y, tile, tile);
//     }
//   }
// }

// let snake = new Snake(15 * tile, 15 * tile, 0, 0);
// let snakeArray = [snake];

// Food object
class Food {
  constructor(x, y, color) {
    this.x = Math.floor(Math.random() * 20) * tile;
    this.y = Math.floor(Math.random() * 20 + 3) * tile;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
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

// Spark object
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
    this.ttl = 100;
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
  for (let i = 0; i < snake.length && i < 150; i++) {
    let dx;
    let dy;
    let x = snake[0].x + tile / 2;
    let y = snake[0].y + tile / 2;
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

// Animation
function animate() {
  if (gameState === "PLAY") {
    requestAnimationFrame(animate);

    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, tile * 3, gameBoard.width, gameBoard.height);

    // Score background
    ctx.fillStyle = "#001437";
    ctx.fillRect(0, 0, gameBoard.width, tile * 3);

    // Reworked objects [ALL TO APPEAR LIKE THIS]
    food.draw();
    scoreBoard.draw();

    // Snake [NEEDS TO BE CONVERTED TO SNAKE OBJECT]
    for (let i = 0; i < snake.length; i++) {
      ctx.save();
      ctx.fillStyle = "#fb33db";
      ctx.shadowColor = "#fb33db";
      ctx.shadowBlur = 10;
      ctx.fillRect(snake[i].x, snake[i].y, tile, tile); // fills tiles occupied by snake array's coordinates

      ctx.restore();
      ctx.strokeStyle = "#000";
      ctx.strokeRect(snake[i].x, snake[i].y, tile, tile);
    }


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
