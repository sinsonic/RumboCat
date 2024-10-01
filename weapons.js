const weapons = {
    rifle: {
        name: 'Rifle',
        bulletSpeed: 10,
        bulletRadius: 5,
        bulletCount: 1,
        spread: 0,
        bulletRange: 5 * 40 / 2  // Full range
    },
    shotgun: {
        name: 'Shotgun',
        bulletSpeed: 8,
        bulletRadius: 3,
        bulletCount: 6,
        spread: Math.PI / 4, // 45 degrees in radians
        bulletRange: (5 * 40) / 4  // Half the visible radius (50%)
    }
};

let currentWeapon = 'rifle';

export function getCurrentWeapon() {
    return currentWeapon;
}

export function switchWeapon(weaponName) {
    if (weapons[weaponName]) {
        currentWeapon = weaponName;
        return weapons[weaponName].name;
    }
    return null;
}

export function shoot(player) {
    const weapon = weapons[currentWeapon];
    const bullets = [];

    for (let i = 0; i < weapon.bulletCount; i++) {
        let angle = Math.atan2(player.dy, player.dx);
        if (weapon.spread) {
            angle += (Math.random() - 0.5) * weapon.spread;
        }

        bullets.push({
            x: player.x,
            y: player.y,
            radius: weapon.bulletRadius,
            dx: Math.cos(angle) * weapon.bulletSpeed,
            dy: Math.sin(angle) * weapon.bulletSpeed,
            distance: 0,
            range: weapon.bulletRange  // Set the bullet range based on the weapon
        });
    }

    return bullets;
}
