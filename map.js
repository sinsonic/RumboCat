export function createMaze(ROWS, COLS) {
    const maze = [];
    for (let row = 0; row < ROWS; row++) {
        maze[row] = [];
        for (let col = 0; col < COLS; col++) {
            maze[row][col] = Math.random() < 0.15 ? 1 : 0;
        }
    }

    // Ensure the starting area is clear
    if (maze[1] && maze[2]) {
        maze[1][1] = maze[1][2] = maze[2][1] = 0;
    }

    return maze;
}

export function drawMaze(ctx, maze, ROWS, COLS, CELL_SIZE) {
    ctx.fillStyle = '#666';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row] && maze[row][col] === 1) {
                ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}