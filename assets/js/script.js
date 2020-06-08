const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const tile = 10; // the tile represents the smallest unit of measurement for the gameBoard.

// Initial gamestate

// Initial snake array
let snake = [];
snake[0] = {
    x: 19 * tile,
    y: 19 * tile
};
snake[1] = {
    x: 20 * tile,
    y: 19 * tile
};
snake[2] = {
    x: 21 * tile,
    y: 19 * tile
};

// returns random integer for either x or y coordinate. Works for square gameBoard and currently set to 40 * tile(10) = 400.
// if gameBoard is not square then separate functions would be needed for x and y
function Random() {
    return Math.floor(Math.random() * 40) * tile
}

let food = {
    x: Random(),
    y: Random()
};

let score = 0;

// Keydown event handler

let direction = "left";

document.addEventListener("keydown", keyDownHandler);

function keyDownHandler(event) {
    if(event.keyCode == 38 && direction != "down") {
        direction = "up"
    } else if (event.keyCode == 40 && direction != "up") {
        direction = "down"
    } else if (event.keyCode == 37 && direction != "right") {
        direction = "left"
    } else if (event.keyCode == 39 && direction != "left") {
        direction = "right"
    };
};

// Active gamestate
function draw() {
    ctx.clearRect(0,0,gameBoard.clientWidth, gameBoard.height) // Clears any tiles filled on each draw to prevent trail

    ctx.fillStyle = "green";
    ctx.fillRect(food.x, food.y, tile, tile);

    ctx.fillStyle = "red";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile); // Fills tiles occupied by snake array's coordinates
    };

    let currentHeadX = snake[0].x; // current position of snake head coordinates. Will supply newHead coordinates on each draw
    let currentHeadY = snake[0].y;

    if (direction === "up") {
        currentHeadY = currentHeadY - tile;
    } else if (direction === "down") {
        currentHeadY = currentHeadY + tile;
    } else if (direction === "left") {
        currentHeadX = currentHeadX - tile;
    } else if (direction === "right") {
        currentHeadX = currentHeadX + tile;
    };
       
    let newHead = {
        x: currentHeadX,
        y: currentHeadY
    };

    // if snake newHead has same coordinates as food, then clear food and add newHead WITHOUT removing last object in snake array
    if (newHead.x === food.x && newHead.y === food.y) {
        food = {
            x: Random(),
            y: Random()
        };
        snake.unshift(newHead);
        score ++;
        console.log(`Score: ${score}`);
    // else remove last object in snake array (snake does not grow)
    } else {
        snake.unshift(newHead);
        // snake.pop(); // removes last object (tail end) in snake array
    };
    // if food spawns inside snake array, spawns new food
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            console.log("GET NEW FOOD");
            food = {
            x: Random(),
            y: Random()
        };
        }; 
    };

    // Detects whether newHead has same coordinates as existing objects in snake array. Stops game if true
    for (let i = 1; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            console.log("ATE SELF");
            clearInterval(game);
        }; 
    };
    // Detects whether newHead has coordinates outside of gameBoard (x). Stops game if true
    if (newHead.x > gameBoard.width - tile || newHead.x < 0) {
        console.log("HIT X WALL");
        clearInterval(game);
    // Detects whether newHead has coordinates outside of gameBoard (y). Stops game if true
    } else if (newHead.y > gameBoard.height - tile || newHead.y < 0) {
        console.log("HIT Y WALL");
        clearInterval(game);
    };
};

let game = setInterval(draw, 100); // time between each draw, effectively the speed of the snake