export class FogOfWar {
    constructor(canvas, visibleRadius) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.visibleRadius = visibleRadius;
    }

    create(playerX, playerY) {
        this.ctx.globalCompositeOperation = 'destination-in';
        const gradient = this.ctx.createRadialGradient(playerX, playerY, 0, playerX, playerY, this.visibleRadius);
        gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalCompositeOperation = 'source-over';
    }
}