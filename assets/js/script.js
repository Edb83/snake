// INITIAL GAME STATE

// Game board
const gameBoard = document.getElementById("gameBoard");
gameBoard.width = 450;
gameBoard.height = Math.ceil(gameBoard.width * 1.15);
const ctx = gameBoard.getContext("2d");
const tile = gameBoard.width / 20; // the tile represents the smallest unit of measurement for the gameBoard

// Global variables
let score = 0;
let scoreBoard = [];
let direction = "left";
const gameSpeed = 130; // lower is faster
let lastKey = 0; // used to store time since last keydown
const safeDelay = 130; // refresh rate speed to prevent snake eating its neck when multiple keys pressed
let snake = [];
let food = {};
let eat = document.getElementById("eatSound");
let gameover = document.getElementById("gameoverSound");

// Keydown event listener
document.addEventListener("keydown", keyboardHandler);

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

// Game
let game = {
  initialise: function () {
    mainLoop();
    snake = [];
    newSnake();
    newFood();
    score = 0;
    direction = "left";
  },
  start: function () {
    update();
  },
};

// Update

function update() {
  let game = setInterval(gameFate, gameSpeed);

  function gameFate() {
    let failState = function () {
      clearInterval(game);
      gameover.play();
      if (scoreBoard.includes(score)) {
        return;
      } else {
        scoreBoard.push(score);
        scoreBoard.sort((a, b) => b - a);
      }
    };

    let currentHeadX = snake[0].x;
    let currentHeadY = snake[0].y;

    // Move the snake head according to keydown event listener - will provide coordinates of the new snake head
    if (direction === "up") {
      currentHeadY = currentHeadY - tile; // Y coordinate of head reduced by tile length
    } else if (direction === "down") {
      currentHeadY = currentHeadY + tile; // Y coordinate of head increased by tile length
    } else if (direction === "left") {
      currentHeadX = currentHeadX - tile; // X coordinate of head reduced by tile length
    } else if (direction === "right") {
      currentHeadX = currentHeadX + tile; // X coordinate of head increased by tile length
    }

    let newHead = {
      x: currentHeadX,
      y: currentHeadY,
    };
    collisionCheck.wall(newHead, failState);
    collisionCheck.snake(failState);
    collisionCheck.foodSpawn();
    collisionCheck.food(newHead);

  }
}

let collisionCheck = {
  wall: function (newHead, failState) {
    if (
      newHead.x > gameBoard.width - tile ||
      newHead.x < 0 ||
      newHead.y > gameBoard.height - tile ||
      newHead.y < 3 * tile
    ) {
      failState();
    }
  },
  snake: function (failState) {
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
        failState();
      }
    }
  },
  foodSpawn: function () {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === food.x && snake[i].y === food.y) {
        newFood();
      }
    }
  },
  food: function (newHead) {
    if (newHead.x === food.x && newHead.y === food.y) {
      newFood();
      snake.unshift(newHead);
      score++;
      eat.play();
      // else remove last object in snake array (snake does not grow)
    } else {
      snake.unshift(newHead);
      snake.pop(); // removes last object (tail end) in snake array
    }
  },
};

// Draw game

let draw = {
  clearGameBoard: function () {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height); // clears any tiles filled on each draw to prevent trail
  },

  background: function () {
    ctx.fillStyle = "#8788CC";
    ctx.fillRect(0, tile * 3, gameBoard.width, gameBoard.height);
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
  },
};

// Loop to callback, with conditions for stopping on collision
let mainLoop = function () {
  draw.clearGameBoard();
  draw.background();
  draw.scoreBackground();
  draw.score();
  draw.highScore();
  draw.snake();
  draw.food();
  requestAnimationFrame(mainLoop);
};

// Initialise loop by callback
requestAnimationFrame(mainLoop);
