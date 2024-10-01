import { getCurrentWeapon } from './weapons.js';  // Import the function to get current weapon

export class Player {
    constructor(x, y, cellSize) {
        this.x = x;
        this.y = y;
        this.radius = cellSize / 3;
        this.speed = 3;
        this.dx = 0;
        this.dy = -1;
        this.aimLength = cellSize * 1.5;

        // Load the kitty image
        this.image = new Image();
        this.image.src = './kitty1.png';  // Set the path to your kitty1.png image

        // Load the weapon images
        this.weaponImages = {
            shotgun: new Image(),
            rifle: new Image()
        };
        this.weaponImages.shotgun.src = './shotgun.png';  // Set the path to shotgun.png
        this.weaponImages.rifle.src = './rifle.png';      // Set the path to rifle.png

        this.imageLoaded = false;
        this.weaponImages.shotgun.onload = this.weaponImages.rifle.onload = () => {
            this.imageLoaded = true;
        };

        this.image.onload = () => {
            this.imageLoaded = true;  // Set flag when image is fully loaded
        };
    }

    move(dx, dy, maze, COLS, ROWS, CELL_SIZE) {
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;

            const newX = this.x + dx * this.speed;
            const newY = this.y + dy * this.speed;
            const cellCol = Math.floor(newX / CELL_SIZE);
            const cellRow = Math.floor(newY / CELL_SIZE);

            // Ensure player stays within bounds and doesn't collide with walls
            if (cellCol >= 0 && cellCol < COLS && cellRow >= 0 && cellRow < ROWS && 
                maze[cellRow] && maze[cellRow][cellCol] === 0) {  // Only move if not colliding with a wall
                this.x = newX;
                this.y = newY;
            }

            // Ensure player stays within game boundaries
            this.x = Math.max(this.radius, Math.min(COLS * CELL_SIZE - this.radius, this.x));
            this.y = Math.max(this.radius, Math.min(ROWS * CELL_SIZE - this.radius, this.y));

            // Update player direction for aiming
            this.dx = dx;
            this.dy = dy;
        }
    }

    draw(ctx) {
        if (this.imageLoaded) {
            // Draw the kitty image instead of the circle
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 3, this.radius * 3);
        } else {
            // Fallback to drawing a blue circle if the image is not loaded
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        }
    }

    drawAimPointer(ctx) {
        const currentWeapon = getCurrentWeapon();  // Get the current weapon
        const weaponImage = this.weaponImages[currentWeapon.toLowerCase()];  // Get the correct weapon image

        if (weaponImage && this.imageLoaded) {
            // Calculate where to draw the weapon image
            const endX = this.x + this.dx * this.aimLength;
            const endY = this.y + this.dy * this.aimLength;

            // Draw the weapon image at the aim pointer position
            const angle = Math.atan2(this.dy, this.dx);
            ctx.save();
            ctx.translate(endX, endY);
            ctx.rotate(angle);  // Rotate the image to point in the player's direction
            ctx.drawImage(weaponImage, -80, -0, 40, 20);  // Adjust size and position as needed
            ctx.restore();
        }
    }

    reset(x, y) {
        // Reset player position and direction after game reset
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = -1;
    }
}
