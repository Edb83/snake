// Global variables
let gameState = "MENU";
let score = "";
let scoreBoard = [];
let direction;
const gameSpeed = 150; // lower is faster
let lastKey = 0; // used to store time since last keydown
const safeDelay = 130; // refresh rate speed to prevent snake eating its neck when multiple keys pressed
let snake;
let food;
let eat = document.getElementById("eatSound");
let gameover = document.getElementById("gameoverSound");
let myInterval = null; // used to prevent interval recorded by setInterval from increasing each time a new game is loaded

let newHead;
let collisionDetected = false;
let ateFood = false;

// Initialise Game

const gameBoard = document.getElementById("gameBoard");
gameBoard.width = 500;
gameBoard.height = Math.ceil(gameBoard.width * 1.15);
document.addEventListener("keydown", keyboardHandler);

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");

const ctx = gameBoard.getContext("2d");
const tile = gameBoard.width / 20; // the tile represents the smallest unit of measurement for the gameBoard

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
    y: newHeadY
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
  } else {
    snake.unshift(newHead);
    snake.pop();
  }
}

function updateScoreBoard() {
  if (scoreBoard.includes(score)) {
    return;
  } else {
    scoreBoard.push(score);
    scoreBoard.sort((a, b) => b - a); // sorts in descending order once added to scoreboard
  }
}

// Draw game

let draw = {
  clearGameBoard: function () {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height); // clears any tiles filled on each draw to prevent trail
  },

  background: function () {
    if (gameState === "MENU") {
      ctx.fillStyle = "#8788CC";
      ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    } else {
      ctx.fillStyle = "#8788CC";
      ctx.fillRect(0, tile * 3, gameBoard.width, gameBoard.height);
    }
  },

  scoreBackground: function () {
    ctx.fillStyle = "#2C2C42";
    ctx.fillRect(0, 0, gameBoard.width, tile * 3);
  },

  score: function () {
    ctx.fillStyle = "white";
    ctx.font = "25px Verdana";
    ctx.fillText(score, tile, tile * 2);
  },

  highScore: function () {
    ctx.fillStyle = "white";
    ctx.font = "25px Verdana";
    if (scoreBoard.length > 0 && Math.max(...scoreBoard) > score) {
      ctx.fillText(
        `Best: ${Math.max(...scoreBoard)}`,
        gameBoard.width * 0.7,
        tile * 2
      );
    } else {
      ctx.fillText(`Best: ${score}`, gameBoard.width * 0.7, tile * 2);
    }
  },

  food: function () {
    ctx.beginPath();
    ctx.arc(
      food.x + (tile - 3) / 2,
      food.y + (tile - 3) / 2,
      tile / 2,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "#AE00C2";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
  },

  snake: function () {
    ctx.fillStyle = "#181942";
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i].x, snake[i].y, tile, tile); // fills tiles occupied by snake array's coordinates
      ctx.strokeStyle = "white";
      ctx.strokeRect(snake[i].x, snake[i].y, tile, tile);
    }
    if (collisionDetected === true) {
        ctx.fillStyle = "red";
        ctx.fillRect(snake[0].x, snake[0].y, tile, tile);
        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[0].x, snake[0].y, tile, tile);
    }
  }
};

// Game loop with conditions for which functions are called depending on game state
let gameLoop = function () {
  if (gameState === "PLAY") {
    findNewHead();
    checkCollision();
    checkAteFood();
    advanceSnake();
    draw.clearGameBoard();
    draw.background();
    draw.scoreBackground();
    draw.score();
    draw.highScore();
    draw.food();
    draw.snake();
  }
  if (gameState === "MENU") {
    draw.background();
  } else {
    draw.background();
    draw.scoreBackground();
    draw.score();
    draw.highScore();
    draw.snake();
    draw.food();
  }
};

gameLoop();

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
