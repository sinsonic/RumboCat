// controls.js

export function handleKeyDown(e, keys, player, bullets, shoot, switchWeapon, weaponElement) {
    keys[e.key] = true;

    if (e.code === 'Space') {
        const newBullets = shoot(player);
        bullets.push(...newBullets);
    }

    if (e.key === '1') {
        const weaponName = switchWeapon('rifle');
        if (weaponName) weaponElement.textContent = weaponName;
    }

    if (e.key === '2') {
        const weaponName = switchWeapon('shotgun');
        if (weaponName) weaponElement.textContent = weaponName;
    }
}

export function handleKeyUp(e, keys) {
    keys[e.key] = false;
}

export function updatePlayerMovement(keys, player, maze, COLS, ROWS, CELL_SIZE) {
    let dx = 0;
    let dy = 0;
    
    if (keys['ArrowLeft']) dx -= 1;
    if (keys['ArrowRight']) dx += 1;
    if (keys['ArrowUp']) dy -= 1;
    if (keys['ArrowDown']) dy += 1;

    player.move(dx, dy, maze, COLS, ROWS, CELL_SIZE);
}
