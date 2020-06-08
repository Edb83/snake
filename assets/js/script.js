const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const tile = 10;

// Initial gamestate
let direction = "left";
let food = {
    x: 15 * tile,
    y: 19 * tile
};

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

// Active gamestate
function draw() {
    ctx.clearRect(0,0,gameBoard.clientWidth, gameBoard.height) // Clears any tiles filled on each draw to prevent trail
    ctx.fillStyle = "red";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile); // Fills tiles occupied by snake array's coordinates
    };
    let currentHeadX = snake[0].x; // current position of snake head coordinates. Will supply new coordinate on each draw or change in direction
    let currentHeadY = snake[0].y;

    ctx.fillStyle = "green";
    ctx.fillRect(food.x, food.y, tile, tile);


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

    // if snake currentHead has same coordinates as food, then clear food and add newHead WITHOUT removing last object in snake array
    //
    // ISSUE: currentHeadX and Y are one tile ahead due to newHead. Current resolution is to use snake[0].x and y
    //
    if (snake[0].x === food.x && snake[0].y === food.y) {
    console.log("ATE FOOD");
    food = "";
    snake.unshift(newHead);
    // else remove last object in snake array (snake does not grow)
    } else {
        snake.unshift(newHead);
        snake.pop(); // removes last object (tail end) in snake array
    };

    // Detects whether currentHead has same coordinates as existing objects in snake array. Stops game if true
    // See above issue
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            console.log("ATE SELF");
            clearInterval(game);
        }; 
    };
    // Detects whether currentHeadX has coordinates outside of gameBoard. Stops game if true
    // See above issue
    if (snake[0].x > gameBoard.width || snake[0].x < -10) {
        console.log("HIT X WALL"); 
        clearInterval(game);
    // Detects whether currentHeadY has coordinates outside of gameBoard. Stops game if true
    // See above issue
    } else if (snake[0].y > gameBoard.height || snake[0].y < 0) {
        console.log("HIT Y WALL"); 
        clearInterval(game);
    };
};

let game = setInterval(draw, 1000); // time between each draw, effectively the speed of the snake

