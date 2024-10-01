// food.js

export function spawnFood(maze, COLS, ROWS, CELL_SIZE) {
    let x, y;
    do {
        x = Math.floor(Math.random() * COLS) * CELL_SIZE + CELL_SIZE / 2;
        y = Math.floor(Math.random() * ROWS) * CELL_SIZE + CELL_SIZE / 2;
    } while (maze[Math.floor(y / CELL_SIZE)] && maze[Math.floor(y / CELL_SIZE)][Math.floor(x / CELL_SIZE)] === 1);
    
    return { x, y, radius: CELL_SIZE / 4 };
}

export function drawFood(ctx, food) {
    food.forEach(item => {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.closePath();
    });
}

export function checkFoodCollection(player, food, score) {
    for (let i = food.length - 1; i >= 0; i--) {
        if (Math.hypot(player.x - food[i].x, player.y - food[i].y) < player.radius + food[i].radius) {
            food.splice(i, 1);
            score++;
        }
    }
    return score;
}
