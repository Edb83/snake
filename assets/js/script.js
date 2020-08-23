// Global variables
let gameState = "MENU"; // MOVE TO GAME OBJECT?

let gamesPlayedThisSession = 0; // MOVE TO STATS OBJECT?
let gamesPlayedAllTime = parseInt(localStorage.getItem("games")) || 0;

let previousScore; // MOVE TO SCOREBOARD OBJECT?
let currentScore; // MOVE TO SCOREBOARD OBJECT?
let currentHighScore; // MOVE TO SCOREBOARD OBJECT?
let highScore = parseInt(localStorage.getItem("top")) || 0; // all time high score (since reset)

let gameStartTime; // MOVE TO STATS OBJECT?
let gameTimeInSeconds; // MOVE TO STATS OBJECT?

const sparkArray = [];

let direction; // MOVE TO SNAKE OBJECT?

let lastKey; // used to store time since last keydown
const gameSpeed = 140; // MOVE TO GAME OBJECT?
const safeDelay = 140; // used to add minimum interval between key presses to prevent snake eating its neck (milliseconds). Risk vs Responsiveness
let gameRefreshInterval; // MOVE TO GAME OBJECT?

let snake;
let food;
let collisionDetected; // MOVE TO GAME OBJECT?
let ateFood; // MOVE TO GAME OBJECT?

let walls; // MOVE TO GAME OBJECT?
let gameAudio; // MOVE TO GAME OBJECT?

const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameoverSound");
const wallsCheckBox = document.querySelector("#wallsCheckBox");
const audioCheckBox = document.querySelector("#audioCheckBox");

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
  if (Date.now() - lastKey > safeDelay) {
    // checks time since last key press to prevent multiple presses causing snake to eat its neck
    if (e.keyCode === 38 && direction !== "DOWN") {
      direction = "UP";
    } else if (e.keyCode === 40 && direction !== "UP") {
      direction = "DOWN";
    } else if (e.keyCode === 37 && direction !== "RIGHT") {
      direction = "LEFT";
    } else if (e.keyCode === 39 && direction !== "LEFT") {
      direction = "RIGHT";
    }
  }
  lastKey = Date.now();
  if (e.keyCode == 32 && gameState === "PLAY") {
    game.changeState("PAUSE");
    clearInterval(gameRefreshInterval);
  } else if (e.keyCode == 32 && gameState === "PAUSE") {
    game.changeState("PLAY");
    game.play();
    animate();
  }
}

document.addEventListener("keydown", keyboardHandler);

// Hammertime event listener
let hammertime = new Hammer.Manager(document.querySelector("body"));

hammertime.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL }));
hammertime.add(new Hammer.Tap({ event: "doubletap", taps: 2 }));
hammertime.get("pan");
hammertime.get("doubletap");
hammertime.on(`panleft panright panup pandown doubletap`, function (e) {
  if (Date.now() - lastKey > safeDelay) {
    if (e.type === `panleft` && direction !== "RIGHT") {
      direction = "LEFT";
    } else if (e.type === `panup` && direction !== "DOWN") {
      direction = "UP";
    } else if (e.type === `panright` && direction !== "LEFT") {
      direction = "RIGHT";
    } else if (e.type === `pandown` && direction !== "UP") {
      direction = "DOWN";
    }
  }
  lastKey = Date.now();
  if (e.type == "doubletap" && gameState === "PLAY") {
    game.changeState("PAUSE");
    clearInterval(gameRefreshInterval);
  } else if (e.type == "doubletap" && gameState === "PAUSE") {
    game.changeState("PLAY");
    game.play();
    animate();
  }
});

// function recalculateGameAssets() {
//   let formerFoodCoordinates = food;
//   let formerSnakeCoordinates = snake;
//   let formerSnakeArray = snake.array;
//   let formerSparkArray = sparkArray;
//   let formerTileSize = tile;

//   gameArea.checkOrientation(); // could refactor?
//   gameArea.setGameBoardSize();
//   gameArea.setTileSize();

//   food.x = (formerFoodCoordinates.x / formerTileSize) * tile;
//   food.y = (formerFoodCoordinates.y / formerTileSize) * tile;

//   snake.x = (formerSnakeCoordinates.x / formerTileSize) * tile;
//   snake.y = (formerSnakeCoordinates.y / formerTileSize) * tile;

//   let i;
//   for (i = 0; i < formerSnakeArray.length; i++) {
//     snake.array[i].x = (formerSnakeArray[i].x / formerTileSize) * tile;
//     snake.array[i].y = (formerSnakeArray[i].y / formerTileSize) * tile;
//   }
//   for (i = 0; i < formerSparkArray.length; i++) {
//     sparkArray[i].x = (formerSparkArray[i].x / formerTileSize) * tile;
//     sparkArray[i].y = (formerSparkArray[i].y / formerTileSize) * tile;
//   }
//   if (gameState !== "PLAY") {
//     animate();
//   }
// }

// GAME INITIALISATION
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const scoresScreen = document.getElementById("scoresScreen");
const optionsScreen = document.getElementById("optionsScreen");

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

  stats.updateGamesPlayed();
  gameStartTime = Date.now();

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
    if (walls) {
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
  updateGamesPlayed() {
    gamesPlayedThisSession++;
    gamesPlayedAllTime += 1;
    localStorage.setItem("games", gamesPlayedAllTime);
  },
};

// Scoreboard object

let scoreBoard = {
  array: [],
  update() {
    if (this.array.includes(currentScore) || currentScore === 0) {
      return;
    } else {
      this.array.push(currentScore);
      this.array.sort((a, b) => b - a);
    }
  },
  getCurrentHighScore() {
    currentHighScore = parseInt(localStorage.getItem("top"));
  },
  updateHighScore() {
    if (currentScore > parseInt(highScore)) {
      localStorage.setItem("top", currentScore);
      highScore = currentScore;
    } else {
      return;
    }
  },
  resetArray() {
    this.array.length = 0;
    currentScore = 0;
    score = 0;
    this.print();
  },
  resetHighScore() {
    localStorage.removeItem("top");
    highScore = 0;
    if (gamesPlayedThisSession > 0) {
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
    ctx.fillText(currentScore, tile, tile * 2);
    ctx.fillText(`High score: ${highScore}`, canvas.width * 0.45, tile * 2);
  },
  print() {
    let highScoreAward = document.getElementById("highScoreAward");
    highScoreAward.innerHTML = "";

    if (isNaN(currentHighScore) && currentScore !== 0) {
      highScoreAward.innerHTML = `You're off the mark, so to speak. `;
    }

    if (currentScore > currentHighScore) {
      highScoreAward.innerHTML = `Signs of improvement. You beat your previous high score by ${
        currentScore - currentHighScore
      }.</br>`;
    }

    if (currentScore === 0) {
      highScoreAward.innerHTML = `Whoops!`;
    }

    if (
      currentScore >= 1 &&
      currentScore < 10 &&
      currentScore < currentHighScore
    ) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `${currentScore}... Great.`
      );
    }

    if (currentScore >= 10 && currentScore < 20) {
      highScoreAward.insertAdjacentHTML("beforeend", `Double digits, is it?`);
    }

    if (currentScore >= 20 && currentScore < 30) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `Attempt #${gamesPlayedAllTime} and you got ${currentScore}. Speaks for itself.`
      );
    }

    if (currentScore >= 30 && currentScore < 40) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `Was it worth it, just to get ${currentScore}?`
      );
    }

    if (currentScore >= 40 && currentScore < 50) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `The Nanite Narwhal would be proud.`
      );
    }

    if (currentScore >= 50 && currentScore < 60) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `Maybe getting to 50 was good enough for you.`
      );
    }

    if (currentScore >= 60 && currentScore < 70) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `FYI this is Cyber <em>Snake</em>, not Cyber Slow Worm.`
      );
    }

    if (currentScore >= 70 && currentScore < 80) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `Don't tell me. You were distracted by the pretty colors.`
      );
    }

    if (currentScore >= 80 && currentScore < 90) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `Next time, have a vague strategy.`
      );
    }

    if (currentScore >= 90 && currentScore < 100) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `It would have been better if you got to 100.`
      );
    }

    if (
      currentScore >= 100 &&
      currentScore < 125 &&
      (currentHighScore < 100 || isNaN(currentHighScore))
    ) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `That's quite the milestone you've hit.<br>And it only took you ${gamesPlayedAllTime} attempts!`
      );
    } else if (currentScore >= 100 && currentScore < 125) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `It only took you ${convertSecondsToMs(
          gameTimeInSeconds
        )} to disappoint me on this occasion.`
      );
    }
    if (currentScore >= 125 && currentScore < 150) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `That was actually pretty good.`
      );
    }

    if (currentScore >= 150 && currentScore < 200) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `The Digital Mongoose has been informed of your progress.`
      );
    }

    if (currentScore >= 200 && currentScore < 300) {
      highScoreAward.insertAdjacentHTML("beforeend", `Definitely cheating.`);
    }

    if (currentScore >= 300 && currentScore < 397) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `Assuming you're not cheating, I'm impressed by your commitment and sorry that you have wasted your time.`
      );
    }

    if (currentScore == 397) {
      highScoreAward.insertAdjacentHTML(
        "beforeend",
        `Congratulations.<br>You have completed the tutorial of Cyber Snake.<br>In Level 001 the food is invisible. You have 3 lives remaining.<br>Good luck.`
      );
    }

    if (currentScore > 397) {
      highScoreAward.insertAdjacentHTML("beforeend", `Is that even possible?`);
    }

    if (currentScore === previousScore && currentScore !== 0) {
      highScoreAward.innerHTML = `Oops you did it again.`;
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
      if (scoreLi[i].textContent == currentScore && currentScore != 0) {
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
    if (direction === "LEFT") {
      return { x: this.x - tile, y: this.y };
    }
    if (direction === "UP") {
      return { x: this.x, y: this.y - tile };
    }
    if (direction === "RIGHT") {
      return { x: this.x + tile, y: this.y };
    }
    if (direction === "DOWN") {
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
      if (this.newHead.x > canvas.width - tile && direction === "RIGHT") {
        if (walls === true) {
          collisionDetected = true;
        } else {
          this.x = -tile;
        }
      }

      if (this.newHead.x < 0 && direction === "LEFT") {
        if (walls === true) {
          collisionDetected = true;
        } else {
          this.x = canvas.width;
        }
      }

      if (this.newHead.y > canvas.height - tile && direction === "DOWN") {
        if (walls === true) {
          collisionDetected = true;
        } else {
          this.y = 2 * tile;
        }
      }

      if (this.newHead.y < 3 * tile && direction === "UP") {
        if (walls === true) {
          collisionDetected = true;
        } else {
          this.y = canvas.height;
        }
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
    if (collisionDetected) {
      if (gameAudio) {
        gameOverSound.play();
      }

      gameTimeInSeconds = Math.round((Date.now() - gameStartTime) / 1000);
      scoreBoard.update();
      scoreBoard.print();
      game.changeState("GAMEOVER");
    } else if (ateFood) {
      this.array.unshift(this.newHead);
      populateSparkArray();
      newFood();
      currentScore++;
      tileToSparkDRatio += 0.0025;

      if (gameAudio) {
        eatSound.play();
      }
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
      ctx.shadowBlur = tile / 2;
      ctx.fillRect(snake.array[i].x, snake.array[i].y, tile, tile); // fills tiles occupied by snake array's coordinates

      ctx.restore();
      ctx.strokeStyle = "#001437";
      ctx.strokeRect(snake.array[i].x, snake.array[i].y, tile, tile);
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
    if (direction === "UP") {
      dx = randomNumber(-dynamicSparkD(), dynamicSparkD());
      dy = randomNumber(-dynamicSparkD(), -dynamicSparkD() / 2);
    }
    if (direction === "DOWN") {
      dx = randomNumber(-dynamicSparkD(), dynamicSparkD());
      dy = randomNumber(dynamicSparkD(), dynamicSparkD() * 2);
    }
    if (direction === "LEFT") {
      dx = randomNumber(-dynamicSparkD() * 2, -dynamicSparkD());
      dy = randomNumber(-dynamicSparkD(), dynamicSparkD());
    }
    if (direction === "RIGHT") {
      dx = randomNumber(dynamicSparkD(), dynamicSparkD() * 2);
      dy = randomNumber(-dynamicSparkD(), dynamicSparkD());
    }

    sparkArray.push(new Spark(x, y, dx, dy));
  }
}

// Game loop with conditions for which functions are called depending on game state
let gameLoop = function () {
  if (gameState === "PLAY") {
    snake.checkCollision();
    snake.checkAteFood();
    snake.advance();
    snake.update();
    scoreBoard.updateHighScore();
  } else {
    clearInterval(gameRefreshInterval);
    return;
  }
};

let game = {
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
    collisionDetected = false;
    ateFood = false;
    sparkArray.length = 0;
    direction = "LEFT";
    lastKey = 0;
    previousScore = currentScore;
    currentScore = 0;
    tileToSparkDRatio = 0.1;

    if (wallsCheckBox.checked) {
      walls = true;
    } else {
      walls = false;
    }

    if (audioCheckBox.checked) {
      gameAudio = true;
    } else {
      gameAudio = false;
    }
  },
  toggleWalls() {
    walls = !walls;
  },
  play() {
    gameRefreshInterval = setInterval(function () {
      gameLoop();
    }, gameSpeed);
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
