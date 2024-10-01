// food.js

// Load the food image
const foodImage = new Image();
foodImage.src = './food.png';  // Make sure this path is correct

// Adjust this value to change the size of the food image
const FOOD_SIZE_RATIO = 0.8;  // Currently set to 50% of CELL_SIZE

export function spawnFood(maze, COLS, ROWS, CELL_SIZE) {
    let x, y;
    do {
        x = Math.floor(Math.random() * COLS) * CELL_SIZE + CELL_SIZE / 2;
        y = Math.floor(Math.random() * ROWS) * CELL_SIZE + CELL_SIZE / 2;
    } while (maze[Math.floor(y / CELL_SIZE)] && maze[Math.floor(y / CELL_SIZE)][Math.floor(x / CELL_SIZE)] === 1);
    
    const foodSize = CELL_SIZE * FOOD_SIZE_RATIO;
    return { x, y, width: foodSize, height: foodSize };
}

export function drawFood(ctx, food) {
    if (foodImage.complete) {
        food.forEach(item => {
            ctx.drawImage(foodImage, item.x - item.width / 2, item.y - item.height / 2, item.width, item.height);
        });
    } else {
        // Fallback to drawing circles if the image hasn't loaded
        food.forEach(item => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.width / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'green';
            ctx.fill();
            ctx.closePath();
        });
    }
}

export function checkFoodCollection(player, food, score) {
    for (let i = food.length - 1; i >= 0; i--) {
        const dx = player.x - food[i].x;
        const dy = player.y - food[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.radius + food[i].width / 2) {
            food.splice(i, 1);
            score++;
        }
    }
    return score;
}