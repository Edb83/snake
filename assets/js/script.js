const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const tile = 10;

function draw() {

};

setInterval(draw, 10);

// Initial snake array
let snake = [];
snake[0] = {
    x: 0,
    y: 0
};
snake[1] = {
    x: 1,
    y: 0
};
snake[2] = {
    x: 2,
    y: 0
};

// Current snake head coordinates

let currentHeadX = snake[0].x;
let currentHeadY = snake[0].y;

/* Movement
    * removes last object in array
    * creates new object based on currentHeadX and Y coordinates (this is the new snake head)
*/


let check = function() {
    console.log(`Length: ${snake.length}`)
    let i;
    for (i = 0; i < snake.length; i++) {
        console.log(`x: ${snake[i].x} y: ${snake[i].y}`);
    };
};

let direction;

let snakeUp = function() {
    direction = "up";
    snake.pop();
    snake.unshift({x: currentHeadX, y: --currentHeadY});
    }

let snakeDown = function() {
    direction = "down";
    snake.pop();
    snake.unshift({x: currentHeadX, y: ++currentHeadY});
    
};

let snakeLeft = function() {
    direction = "left";
    snake.pop();
    snake.unshift({x: --currentHeadX, y: currentHeadY});
    
};

let snakeRight = function() {
    direction = "right";
    snake.pop();
    snake.unshift({x: ++currentHeadX, y: currentHeadY});
    
};

let advanceSnake = function() {
    if (direction==="up") {
        snakeUp();
       
    } else if (direction==="down") {
        snakeDown();
        
    } else if (direction==="left") {
        snakeLeft();
        
    } else if(direction==="right") {
        snakeRight();
        };
    check();
};




// let snakeUpEat = function() {
//     snake.unshift({x: currentHeadX, y: --currentHeadY});
//     check();
// }

// let snakeDownEat = function() {
//     snake.unshift({x: currentHeadX, y: ++currentHeadY});
//     check();
// }

// let snakeLeftEat = function() {
//     snake.unshift({x: --currentHeadX, y: currentHeadY});
//     check();
// }

// let snakeRightEat = function() {
//     snake.unshift({x: ++currentHeadX, y: currentHeadY});
//     check();
// }