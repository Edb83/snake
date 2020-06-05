// Initial snake array
let snake = []
snake[0] = {
    x: 0,
    y: 0
}
snake[1] = {
    x: 1,
    y: 0
}
snake[2] = {
    x: 2,
    y: 0
}

// Current snake head coordinates
let currentHeadX = snake[0].x;
let currentHeadY = snake[0].y;


/* Movement
    * removes last object in array
    * creates new object based on currentHeadX and Y coordinates (this is the new snake head)
*/
let snakeUp = function() {

    snake.pop();
    snake.unshift({x: currentHeadX, y: --currentHeadY});
    console.log(snake);
}

let snakeDown = function() {
    snake.pop();
    snake.unshift({x: currentHeadX, y: ++currentHeadY});
    console.log(snake);
}

let snakeLeft = function() {
    snake.pop();
    snake.unshift({x: --currentHeadX, y: currentHeadY});
    console.log(snake);
}

let snakeRight = function() {
    snake.pop();
    snake.unshift({x: ++currentHeadX, y: currentHeadY});
    console.log(snake);
}
