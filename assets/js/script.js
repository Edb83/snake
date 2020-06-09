const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const tile = 10; // the tile represents the smallest unit of measurement for the gameBoard

// INITIAL GAME STATE

// Snake array
let snake = [];
snake[0] = {
  x: 19 * tile,
  y: 19 * tile,
};
snake[1] = {
  x: 20 * tile,
  y: 19 * tile,
};
snake[2] = {
  x: 21 * tile,
  y: 19 * tile,
};

// Random number generator
// returns random integer for either x or y coordinate. Works for square gameBoard and currently set to 40 * tile(10) = 400
// if gameBoard is not square then separate functions needed for x and y
function Random() {
  return Math.floor(Math.random() * 40) * tile;
};

// Food coordinates
let food = {
  x: Random(),
  y: Random(),
};

// Initial score and snake direction
let score = 0;
let direction = "left";
let gameSpeed = 125; // lower is faster
let lastKey = 0; // used to store time since last keydown
let safeDelay = 130; // refresh rate speed to prevent snake eating its neck when multiple keys pressed

// Keydown event listener
document.addEventListener("keydown", function () {
  if (Date.now() - lastKey > safeDelay) {
    if (event.keyCode == 38 && direction != "down") {
      direction = "up";
    } else if (event.keyCode == 40 && direction != "up") {
      direction = "down";
    } else if (event.keyCode == 37 && direction != "right") {
      direction = "left";
    } else if (event.keyCode == 39 && direction != "left") {
      direction = "right";
    };
    lastKey = Date.now();
  };
});

// ACTIVE GAMESTATE

function draw() {
  ctx.clearRect(0, 0, gameBoard.clientWidth, gameBoard.height); // clears any tiles filled on each draw to prevent trail

  // Draw the score
  ctx.fillStyle = "grey";
  ctx.font = "50px Verdana";
  ctx.fillText(score, 2 * tile, 5 * tile);

  // Draw the food
  ctx.beginPath();
  ctx.arc(food.x + (tile/2), food.y + (tile/2), tile/2, 0, 2 * Math.PI, false);
  ctx.strokeStyle = "red"
  ctx.stroke();
  ctx.fillStyle = "green";
  ctx.fill();

  // Draw the snake
  ctx.fillStyle = "red";
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, tile, tile); // fills tiles occupied by snake array's coordinates
  };

  // Current position of snake head coordinates. Will supply newHead coordinates on each draw
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
  };

  let newHead = {
    x: currentHeadX,
    y: currentHeadY,
  };

  // If snake newHead has same coordinates as food, then clear food and add newHead WITHOUT removing last object in snake array
  if (newHead.x === food.x && newHead.y === food.y) {
    food = {
      x: Random(),
      y: Random(),
    };
    snake.unshift(newHead);
    score++;
    // else remove last object in snake array (snake does not grow)
  } else {
    snake.unshift(newHead);
    snake.pop(); // removes last object (tail end) in snake array
  };

  // If food spawns inside snake array, spawns new food
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      food = {
        x: Random(),
        y: Random(),
      };
    };
  };

  // Checks whether snake newHead has same coordinates as existing objects in snake array. Stops game if true
  for (let i = 1; i < snake.length; i++) {
    if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
      clearInterval(game);
    }
  }
  // Checks whether snake newHead has coordinates outside of gameBoard. Stops game if true
  if (newHead.x > gameBoard.width - tile || newHead.x < 0 || newHead.y > gameBoard.height - tile || newHead.y < 0) {
    clearInterval(game);
  };
};

// Game speed
let game = setInterval(draw, gameSpeed); // number of milliseconds between each draw