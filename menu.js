// menu.js
export class Menu {
    constructor() {
        this.lastScore = 0;
        this.isVisible = true;
        this.createMenuElement();
    }

    createMenuElement() {
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'gameMenu';
        this.menuElement.style.position = 'absolute';
        this.menuElement.style.top = '50%';
        this.menuElement.style.left = '50%';
        this.menuElement.style.transform = 'translate(-50%, -50%)';
        this.menuElement.style.background = 'rgba(0, 0, 0, 0.8)';
        this.menuElement.style.padding = '20px';
        this.menuElement.style.borderRadius = '10px';
        this.menuElement.style.textAlign = 'center';
        this.menuElement.style.color = 'white';

        // Create and add the logo
        const logoElement = document.createElement('img');
        logoElement.src = './rumbologo.png';  // Make sure this path is correct
        logoElement.style.width = '200px';  // Adjust size as needed
        logoElement.style.marginBottom = '20px';
        this.menuElement.appendChild(logoElement);

        const titleElement = document.createElement('h1');
        
        this.menuElement.appendChild(titleElement);

        this.scoreElement = document.createElement('p');
        this.updateScore(0);
        this.menuElement.appendChild(this.scoreElement);

        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Start Game';
        this.startButton.style.padding = '10px 20px';
        this.startButton.style.fontSize = '18px';
        this.startButton.style.cursor = 'pointer';
        this.menuElement.appendChild(this.startButton);

        document.body.appendChild(this.menuElement);
    }

    updateScore(score) {
        this.lastScore = score;
        this.scoreElement.textContent = `Last Score: ${this.lastScore}`;
    }

    show() {
        this.isVisible = true;
        this.menuElement.style.display = 'block';
    }

    hide() {
        this.isVisible = false;
        this.menuElement.style.display = 'none';
    }

    onStartGame(callback) {
        this.startButton.addEventListener('click', () => {
            this.hide();
            callback();
        });
    }
}