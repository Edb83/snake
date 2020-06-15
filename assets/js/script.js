// Background canvas
const backgroundCanvas = document.getElementById("backgroundCanvas");
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
let c = backgroundCanvas.getContext("2d");

// Game board

const gameBoard = document.getElementById("gameBoard");
gameBoard.width = 320;
gameBoard.height = Math.ceil(gameBoard.width * 1.15);
const ctx = gameBoard.getContext("2d");
const tile = gameBoard.width / 20; // the tile represents the smallest unit of measurement for the gameBoard

// Audio
// creates new <audio> elements to be accessed during the game
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  };
  this.stop = function () {
    this.sound.pause();
  };
}

let eat;
let gameover;

// INITIAL GAME STATE

// Snake array
let snake = [];
let food = {};

let collisionDetected = false;

// Global variables
let score = 0;
let scoreBoard = [];
let topFive = function() {
    scoreBoard.sort((a, b) => b - a);
    scoreBoard.slice(0,5);
};

let direction = "left";
const gameSpeed = 150; // lower is faster
let lastKey = 0; // used to store time since last keydown
const safeDelay = 125; // refresh rate speed to prevent snake eating its neck when multiple keys pressed

let moveUp = function() {
    if (direction != "down") {direction ="up"}
}
let moveDown = function() {
    if (direction != "up") {direction ="down"}
}
let moveLeft = function() {
    if (direction !="right") {direction ="left"}
}
let moveRight = function() {
    if (direction !="left") {direction ="right"}
}

// Keydown event listener
document.addEventListener("keydown", function () {
  if (Date.now() - lastKey > safeDelay) {
    if (event.keyCode == 38) {
      moveUp();
    } else if (event.keyCode == 40) {
      moveDown();
    } else if (event.keyCode == 37) {
      moveLeft();
    } else if (event.keyCode == 39) {
      moveRight();
    }
    lastKey = Date.now();
  }
});

let newFood = function () {
  food = {
    x: Math.floor(Math.random() * 20) * tile,
    y: Math.floor(Math.random() * 20 + 3) * tile,
  };
};

let newSnake = function() {
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
}

let gameHud = {
    showScoreBoard: function() {
        let scoreOl = document.querySelector('ol');
        scoreOl.innerHTML = "";
        for (let i = 0; i < scoreBoard.length; i ++) {
            let scoreLi = document.createElement('li');
            scoreLi.textContent = scoreBoard[i];
            scoreOl.appendChild(scoreLi);
        }
    }
};

// New game
let newGame = function() {
    mainLoop();
    snake = [];
    newSnake();
    newFood();
    collisionDetected = false;
    score = 0;
    direction = "left";
    update();
}

// ACTIVE GAMESTATE

function update() { 
    let game = setInterval(gameFate, gameSpeed);
    let eat = new sound("assets/audio/eat.wav");
    let gameover = new sound("assets/audio/gameover.wav");  

    function gameFate() {

    let failState = function() {
          
      clearInterval(game);
      collisionDetected = true;
      gameover.play();
      scoreBoard.push(score);
      topFive();
    }

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

    // If snake newHead has same coordinates as food, then clear food and add newHead WITHOUT removing last object in snake array
    if (newHead.x === food.x && newHead.y === food.y) {
      newFood();
      snake.unshift(newHead);
      score ++;
      
      eat.play();
      // else remove last object in snake array (snake does not grow)
    } else {
      snake.unshift(newHead);
      snake.pop(); // removes last object (tail end) in snake array
    }

    // If food spawns inside snake array, spawns new food
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === food.x && snake[i].y === food.y) {
        newFood();
      }
    }

    // Checks whether snake newHead has same coordinates as existing objects in snake array. Stops game if true
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
        failState();
      }
    }
    // Checks whether snake newHead has coordinates outside of gameBoard. Stops game if true
    if (newHead.x > gameBoard.width - tile ||
      newHead.x < 0 ||
      newHead.y > gameBoard.height - tile ||
      newHead.y < 3 * tile) {
          failState();
    };
  }
}

function draw() {
  
  // Draw the page background canvas - need to decide how to include this
  c.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height); // move to separate js file?
  c.fillStyle = "#34358F"; // move to separate js file?
  c.fillRect(0, 0, window.innerWidth, window.innerHeight); // move to separate js file?

  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height); // clears any tiles filled on each draw to prevent trail

  // Draw game board background
  ctx.fillStyle = "#8788CC";
  ctx.fillRect(0, tile * 3, gameBoard.width, gameBoard.height);

  // Draw the score area
  ctx.fillStyle = "#2C2C42";
  ctx.fillRect(0, 0, gameBoard.width, tile * 3);

  // Draw the score
  ctx.fillStyle = "white";
  ctx.font = "40px Verdana";
  ctx.fillText(score, tile, tile * 2.25);

  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  if(scoreBoard.length > 0 && (Math.max(...scoreBoard) > score)) {
  ctx.fillText(Math.max(...scoreBoard), gameBoard.width - 4 * tile, tile * 2.25)
  } else {
      ctx.fillText(score, gameBoard.width - 4 * tile, tile * 2.25)
  };

  // Draw the food
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

  // Draw the snake
  ctx.fillStyle = "#181942";
  for (let i = 0; i < snake.length; i++) { 
    ctx.fillRect(snake[i].x, snake[i].y, tile, tile); // fills tiles occupied by snake array's coordinates
    ctx.strokeStyle = "white";
    ctx.strokeRect(snake[i].x, snake[i].y, tile, tile);
  };
  if (collisionDetected === true) {
  ctx.fillStyle = "#C20A00";
  ctx.fillRect(snake[0].x, snake[0].y, tile, tile); // snake[0] represents the newHead position in draw function, so snake[1] used
  }
}

// Loop to callback, with conditions for stopping on collision
let mainLoop = function () {
    draw();
    requestAnimationFrame(mainLoop);
};

// Initialise loop by callback
requestAnimationFrame(mainLoop);


