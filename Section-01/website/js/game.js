import Ball from "./ball.js";
import Base from "./base.js";
import Paddle from "./paddle.js";
export default class Game extends Base {
    constructor(canvas, context) {
        super(canvas, context);
        this._timer = 0;
        this._fps = 60;
        this._interval = 1000 / this._fps;
        this._mouseX = 0;
        this._lastTime = 0;
        this._ball = new Ball(this.canvas, this.context);
        this._paddle = new Paddle(this.canvas, this.context);
        this.initEventListeners();
    }
    initEventListeners() {
        this.canvas.addEventListener('mousemove', event => {
            const rect = this.canvas.getBoundingClientRect();
            const root = document.documentElement;
            this._mouseX = event.clientX - rect.left - root.scrollLeft;
        });
    }
    update(deltaTime) {
        if (this._timer > this._interval) {
            this._timer = 0;
            // update stuff...
            this._paddle.update(this._mouseX);
            this._ball.update(this._paddle);
            if (this._ball.canvasBottomCollision()) {
                this._ball.resetPosition();
            }
        }
        else {
            this._timer += deltaTime;
        }
    }
    draw() {
        this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black');
        this._paddle.draw();
        this._ball.draw();
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
//# sourceMappingURL=game.js.map