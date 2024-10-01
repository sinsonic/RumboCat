// joystick.js

export class CustomJoystick {
    constructor(container, player, maze, COLS, ROWS, CELL_SIZE, size = 150) {
        this.container = container;
        this.player = player;
        this.maze = maze;
        this.COLS = COLS;
        this.ROWS = ROWS;
        this.CELL_SIZE = CELL_SIZE;
        this.size = size;
        this.radius = size / 2;

        this.centerX = this.radius;
        this.centerY = this.radius;

        this.joystickOuter = this.createJoystickElement(true);
        this.joystickInner = this.createJoystickElement(false);
        this.container.appendChild(this.joystickOuter);
        this.joystickOuter.appendChild(this.joystickInner);

        this.isDragging = false;

        this.initEvents();
    }

    createJoystickElement(isOuter) {
        const joystick = document.createElement('div');
        joystick.style.position = 'absolute';
        joystick.style.width = isOuter ? `${this.size}px` : `${this.size / 2}px`;
        joystick.style.height = isOuter ? `${this.size}px` : `${this.size / 2}px`;
        joystick.style.borderRadius = '50%';
        joystick.style.background = isOuter ? 'rgba(129, 133, 137, 0.2)' : 'rgba(129, 133, 137, 0.5)';
        joystick.style.border = isOuter ? '2px solid rgba(255, 255, 255, 0.8)' : 'none';
        joystick.style.left = isOuter ? '0' : '50%';
        joystick.style.top = isOuter ? '0' : '50%';
        joystick.style.transform = isOuter ? 'none' : 'translate(-50%, -50%)';
        joystick.style.touchAction = 'none';
        return joystick;
    }

    initEvents() {
        this.joystickOuter.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));

        this.joystickOuter.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));
    }

    startDrag(event) {
        event.preventDefault();
        this.isDragging = true;
    }

    drag(event) {
        if (!this.isDragging) return;
        event.preventDefault();

        const rect = this.joystickOuter.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;
        const dx = x - this.centerX;
        const dy = y - this.centerY;

        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), this.radius);
        const angle = Math.atan2(dy, dx);

        const newX = this.centerX + Math.cos(angle) * distance;
        const newY = this.centerY + Math.sin(angle) * distance;

        this.joystickInner.style.left = `${newX}px`;
        this.joystickInner.style.top = `${newY}px`;

        // Normalize direction
        const normalizedDx = Math.cos(angle) * (distance / this.radius);
        const normalizedDy = Math.sin(angle) * (distance / this.radius);

        // Move the player based on the joystick movement
        this.player.move(normalizedDx, normalizedDy, this.maze, this.COLS, this.ROWS, this.CELL_SIZE);
    }

    stopDrag(event) {
        event.preventDefault();
        this.isDragging = false;
        this.joystickInner.style.left = '50%';
        this.joystickInner.style.top = '50%';
    }
}

export class ShootButton {
    constructor(container, shootFunction, switchWeaponFunction, options = {}) {
        this.container = container;
        this.shootFunction = shootFunction;
        this.switchWeaponFunction = switchWeaponFunction;
        
        // Default options
        const defaultOptions = {
            shootSize: 100,
            shootColor: 'rgba(255, 0, 0, 0.5)',
            shootBorderColor: 'rgba(255, 0, 0, 0.8)',
            rifleSize: 80,
            rifleColor: 'rgba(0, 0, 255, 0.5)',
            rifleBorderColor: 'rgba(0, 0, 255, 0.8)',
            shotgunSize: 80,
            shotgunColor: 'rgba(0, 255, 0, 0.5)',
            shotgunBorderColor: 'rgba(0, 255, 0, 0.8)',
            fontSize: 18,
            spacing: 10
        };

        // Merge default options with provided options
        this.options = { ...defaultOptions, ...options };

        this.button = this.createButtonElement('SHOOT', this.options.shootSize, this.options.shootColor, this.options.shootBorderColor, this.shoot.bind(this));
        this.rifleButton = this.createButtonElement('Rifle', this.options.rifleSize, this.options.rifleColor, this.options.rifleBorderColor, () => this.switchWeapon('rifle'));
        this.shotgunButton = this.createButtonElement('Shotgun', this.options.shotgunSize, this.options.shotgunColor, this.options.shotgunBorderColor, () => this.switchWeapon('shotgun'));

        this.container.appendChild(this.rifleButton);
        this.container.appendChild(this.shotgunButton);
        this.container.appendChild(this.button);

        this.positionButtons();
    }

    createButtonElement(text, size, color, borderColor, clickHandler) {
        const button = document.createElement('div');
        button.style.width = `${size}px`;
        button.style.height = `${size}px`;
        button.style.background = color;
        button.style.border = `2px solid ${borderColor}`;
        button.style.borderRadius = '50%';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.fontSize = `${this.options.fontSize}px`;
        button.style.color = 'white';
        button.style.userSelect = 'none';
        button.style.touchAction = 'none';
        button.style.position = 'absolute';
        button.textContent = text;

        button.addEventListener('mousedown', clickHandler);
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            clickHandler();
        });

        return button;
    }

    positionButtons() {
        const { shootSize, rifleSize, shotgunSize, spacing } = this.options;
        this.button.style.bottom = '0px';
        this.button.style.right = '0px';
        this.shotgunButton.style.bottom = `${shootSize + spacing}px`;
        this.shotgunButton.style.right = '0px';
        this.rifleButton.style.bottom = `${shootSize + shotgunSize + 2 * spacing}px`;
        this.rifleButton.style.right = '0px';
    }

    shoot(event) {
        if (event) event.preventDefault();
        this.shootFunction();
    }

    switchWeapon(weaponName) {
        this.switchWeaponFunction(weaponName);
    }
}

export function initializeCustomControls(player, maze, COLS, ROWS, CELL_SIZE, shootFunction, switchWeaponFunction) {
    const joystickContainer = document.getElementById('joystickContainer');
    const shootButtonContainer = document.getElementById('shootButtonContainer');
    new CustomJoystick(joystickContainer, player, maze, COLS, ROWS, CELL_SIZE);
    new ShootButton(shootButtonContainer, shootFunction, switchWeaponFunction, {
        shootSize: 100,
        shootColor: 'rgba(255, 0, 0, 0.5)',
        shootBorderColor: 'rgba(255, 0, 0, 0.8)',
        rifleSize: 60,
        rifleColor: 'rgba(0, 0, 255, 0.6)',
        rifleBorderColor: 'rgba(0, 0, 255, 0.9)',
        shotgunSize: 60,
        shotgunColor: 'rgba(0, 128, 0, 0.6)',
        shotgunBorderColor: 'rgba(0, 128, 0, 0.9)',
        fontSize: 16,
        spacing: 15
    });
}