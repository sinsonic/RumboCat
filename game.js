// game.js
import { createMaze, drawMaze } from './map.js';
import { getCurrentWeapon, switchWeapon, shoot } from './weapons.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { FogOfWar } from './fogOfWar.js';
import { spawnFood, drawFood, checkFoodCollection } from './food.js';
import { handleKeyDown, handleKeyUp, updatePlayerMovement } from './controls.js';
import { initializeCustomControls } from './joystick.js';
import { Menu } from './menu.js';  // Import the new Menu class

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const weaponElement = document.getElementById('weapon');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CELL_SIZE = 40;
const ROWS = Math.floor(canvas.height / CELL_SIZE);
const COLS = Math.floor(canvas.width / CELL_SIZE);
const VISIBLE_RADIUS = 5 * CELL_SIZE;

let player, fogOfWar, enemies, food, bullets, score, keys, maze;
const menu = new Menu();

function initializeGame() {
    player = new Player(CELL_SIZE * 1.5, CELL_SIZE * 1.5, CELL_SIZE);
    fogOfWar = new FogOfWar(canvas, VISIBLE_RADIUS);
    enemies = [];
    food = [];
    bullets = [];
    score = 0;
    keys = {};
    maze = createMaze(ROWS, COLS);

    initializeCustomControls(player, maze, COLS, ROWS, CELL_SIZE, shootHandler, switchWeapon, {
        size: 80,
        shootButtonColor: 'orange',
        rifleButtonColor: 'purple',
        shotgunButtonColor: 'teal',
        spacing: 15,
        fontSize: 16
    });

    scoreElement.textContent = score;
    weaponElement.textContent = getCurrentWeapon();
}

function update() {
    if (menu.isVisible) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMaze(ctx, maze, ROWS, COLS, CELL_SIZE);
    updatePlayerMovement(keys, player, maze, COLS, ROWS, CELL_SIZE);
    player.draw(ctx);
    player.drawAimPointer(ctx);
    updateAndDrawBullets();
    updateAndDrawEnemies();
    drawFood(ctx, food);
    score = checkFoodCollection(player, food, score);
    scoreElement.textContent = score;
    fogOfWar.create(player.x, player.y);
    weaponElement.textContent = getCurrentWeapon();

    requestAnimationFrame(update);
}

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function updateAndDrawBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
        bullet.distance += Math.sqrt(bullet.dx * bullet.dx + bullet.dy * bullet.dy);

        const bulletCol = Math.floor(bullet.x / CELL_SIZE);
        const bulletRow = Math.floor(bullet.y / CELL_SIZE);

        if (bulletCol < 0 || bulletCol >= COLS || bulletRow < 0 || bulletRow >= ROWS || 
            (maze[bulletRow] && maze[bulletRow][bulletCol] === 1) || bullet.distance > bullet.range) {
            bullets.splice(i, 1);
        } else {
            drawCircle(bullet.x, bullet.y, bullet.radius, 'yellow');
        }
    }
}

function updateAndDrawEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.move(player.x, player.y, maze, COLS, ROWS, CELL_SIZE);
        enemy.draw(ctx);

        // Check collision with player
        if (enemy.collidesWith(player.x, player.y, player.radius)) {
            resetGame();
            return;
        }

        // Check collision with bullets
        for (let j = bullets.length - 1; j >= 0; j--) {
            let bullet = bullets[j];
            if (enemy.collidesWith(bullet.x, bullet.y, bullet.radius)) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 5;
                scoreElement.textContent = score;
                break;
            }
        }
    }
}

function resetGame() {
    menu.updateScore(score);
    menu.show();
    clearInterval(enemySpawnInterval);
    clearInterval(foodSpawnInterval);
    initializeGame();
}

function spawnEnemy() {
    enemies.push(Enemy.spawn(COLS, ROWS, CELL_SIZE, maze));
}

function shootHandler() {
    const newBullets = shoot(player);
    bullets.push(...newBullets);
}

let enemySpawnInterval;
let foodSpawnInterval;

menu.onStartGame(() => {
    initializeGame();
    menu.hide();
    update();
    enemySpawnInterval = setInterval(spawnEnemy, 3000);
    foodSpawnInterval = setInterval(() => food.push(spawnFood(maze, COLS, ROWS, CELL_SIZE)), 2000);
});

document.addEventListener('keydown', (e) => handleKeyDown(e, keys, player, bullets, shoot, switchWeapon, weaponElement));
document.addEventListener('keyup', (e) => handleKeyUp(e, keys));

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // You might want to adjust other game elements based on the new size
});

// Show the menu initially
menu.show();