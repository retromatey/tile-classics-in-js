"use strict";
class App {
    constructor() {
        this._timer = 0;
        this._fps = 60;
        this._interval = 1000 / this._fps;
        this._lastTime = 0;
        this._canvas = document.getElementById('GameCanvas');
        this._context = this._canvas.getContext('2d');
    }
    get canvas() { return this._canvas; }
    get context() { return this._context; }
    update(deltaTime) {
        if (this._timer > this._interval) {
            this._timer = 0;
            // update stuff...
        }
        else {
            this._timer += deltaTime;
        }
    }
    draw() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'white';
        this.context.beginPath();
        this.context.arc(100, 100, 10, 0, Math.PI * 2, true);
        this.context.fill();
    }
    run(timestamp = 0) {
        const deltaTime = timestamp - this._lastTime;
        this._lastTime = timestamp;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        this.update(deltaTime);
        requestAnimationFrame(t => this.run(t));
    }
}
window.onload = () => {
    const app = new App();
    app.run();
};
//# sourceMappingURL=app.js.map