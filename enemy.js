export class Enemy {
    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.radius = cellSize / 3;
        this.speed = 0.5;

        // Load the enemy image
        this.image = new Image();
        this.image.src = './enemy.png';  // Make sure this path is correct
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    move(playerX, playerY, maze, COLS, ROWS, CELL_SIZE) {
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        const newX = this.x + Math.cos(angle) * this.speed;
        const newY = this.y + Math.sin(angle) * this.speed;
        const cellCol = Math.floor(newX / CELL_SIZE);
        const cellRow = Math.floor(newY / CELL_SIZE);

        if (cellCol >= 0 && cellCol < COLS && cellRow >= 0 && cellRow < ROWS && 
            maze[cellRow] && maze[cellRow][cellCol] === 0) {
            this.x = newX;
            this.y = newY;
        }
    }

    draw(ctx) {
        if (this.imageLoaded) {
            // Draw the enemy image
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 3, this.radius * 3);
        } else {
            // Fallback to drawing a red circle if the image is not loaded
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();
        }
    }

    collidesWith(x, y, radius) {
        return Math.hypot(this.x - x, this.y - y) < this.radius + radius;
    }

    static spawn(COLS, ROWS, CELL_SIZE, maze) {
        let x, y;
        do {
            x = Math.floor(Math.random() * COLS) * CELL_SIZE + CELL_SIZE / 2;
            y = Math.floor(Math.random() * ROWS) * CELL_SIZE + CELL_SIZE / 2;
        } while (maze[Math.floor(y / CELL_SIZE)] && maze[Math.floor(y / CELL_SIZE)][Math.floor(x / CELL_SIZE)] === 1);
        
        return new Enemy(x, y, CELL_SIZE);
    }
}