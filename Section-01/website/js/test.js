import Ball from "./ball.js";
import Base from "./base.js";
import Paddle from "./paddle.js";
import Bricks from "./bricks.js";
class Position {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }
}
class PaddlePosition extends Position {
    constructor(x, y) {
        super(x, y);
    }
}
class BallPosition extends Position {
    constructor(x, y) {
        super(x, y);
    }
}
export default class Test extends Base {
    constructor(canvas, context) {
        super(canvas, context);
        this._timer = 0;
        this._fps = 60;
        this._interval = 1000 / this._fps;
        this._mouseX = 0;
        this._mouseY = 0;
        this._currentPosition = 0;
        this._lastTime = 0;
        this._ball = new Ball(this.canvas, this.context);
        this._paddle = new Paddle(this.canvas, this.context);
        this._bricks = new Bricks(this.canvas, this.context);
        this.initEventListeners();
        this._paddlePositions = this.initPaddlePositions_rightCollisions();
        this._ballPositions = this.initBallPositions_leftCollisions();
        this._ball.resetPosition(200, 30);
        // this._ball.resetPosition(this._ballPositions[this._currentPosition].X, this._ballPositions[this._currentPosition].Y);
        Base.debugEnabled = true;
        Base.pause = true;
    }
    initPaddlePositions_topCollisionsFromRight() {
        const paddlePositions = [];
        for (let i = this._paddle.rightX; i >= this._paddle.leftX - 10; i--) {
            paddlePositions.push(new PaddlePosition(i, this._paddle.topY));
        }
        console.log(paddlePositions);
        return paddlePositions;
    }
    initBallPositions_topCollisionsFromRight() {
        const ballPositions = [];
        for (const paddlePosition of this._paddlePositions) {
            ballPositions.push(new BallPosition(paddlePosition.X + (-this._ball.speedX * 5) - this._ball.radius, paddlePosition.Y - (this._ball.speedY * 5) + this._ball.radius));
        }
        console.log(ballPositions);
        return ballPositions;
    }
    initPaddlePositions_rightCollisions() {
        const paddlePositions = [];
        for (let i = this._paddle.bottomY; i >= this._paddle.topY - 25; i--) {
            paddlePositions.push(new PaddlePosition(this._paddle.rightX, i));
        }
        console.log(paddlePositions);
        return paddlePositions;
    }
    initBallPositions_leftCollisions() {
        const ballPositions = [];
        for (const paddlePosition of this._paddlePositions) {
            ballPositions.push(new BallPosition(paddlePosition.X + (-this._ball.speedX * 5) + this._ball.radius, paddlePosition.Y - (this._ball.speedY * 5)));
        }
        console.log(ballPositions);
        return ballPositions;
    }
    initPaddlePositions_topCollisionsFromLeft() {
        const paddlePositions = [];
        for (let i = this._paddle.leftX; i <= this._paddle.rightX + 10; i++) {
            paddlePositions.push(new PaddlePosition(i, this._paddle.topY));
        }
        console.log(paddlePositions);
        return paddlePositions;
    }
    initBallPositions_topCollisionsFromLeft() {
        const ballPositions = [];
        for (const paddlePosition of this._paddlePositions) {
            ballPositions.push(new BallPosition(paddlePosition.X - (this._ball.speedX * 5) + this._ball.radius, paddlePosition.Y - (this._ball.speedY * 5) + this._ball.radius));
        }
        console.log(ballPositions);
        return ballPositions;
    }
    initPaddlePositions_leftCollisions() {
        const paddlePositions = [];
        for (let i = this._paddle.bottomY; i >= this._paddle.topY - 25; i--) {
            paddlePositions.push(new PaddlePosition(this._paddle.leftX, i));
        }
        console.log(paddlePositions);
        return paddlePositions;
    }
    initBallPositions_rightCollisions() {
        const ballPositions = [];
        for (const paddlePosition of this._paddlePositions) {
            ballPositions.push(new BallPosition(paddlePosition.X - (this._ball.speedX * 5) - this._ball.radius, paddlePosition.Y - (this._ball.speedY * 5)));
        }
        console.log(ballPositions);
        return ballPositions;
    }
    initEventListeners() {
        this.canvas.addEventListener('mousemove', event => {
            const rect = this.canvas.getBoundingClientRect();
            const root = document.documentElement;
            this._mouseX = event.clientX - rect.left - root.scrollLeft;
            this._mouseY = event.clientY - rect.top - root.scrollTop;
        });
        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.altKey && event.key === 'd') {
                Base.debugEnabled = !Base.debugEnabled;
            }
            if (event.ctrlKey && event.altKey && event.key === 'p') {
                Base.pause = !Base.pause;
            }
            if (event.ctrlKey && event.altKey && event.key === 'ArrowRight') {
                Base.stepForward = true;
            }
            if (event.ctrlKey && event.altKey && event.key === 'ArrowLeft') {
                Base.stepBackward = true;
            }
            if (event.ctrlKey && event.altKey && event.key === 'ArrowDown') {
                this._currentPosition += 1;
                this._ball.resetPosition(this._ballPositions[this._currentPosition].X, this._ballPositions[this._currentPosition].Y);
            }
        });
    }
    update(deltaTime) {
        if (!Base.pause) {
            if (this._timer > this._interval) {
                this._timer = 0;
                this._ball.update(this._paddle, this._bricks);
                // this._paddle.update(this._mouseX);
                this._bricks.update();
                if (this._ball.canvasBottomCollision()) {
                    this._currentPosition += 1;
                    this._ball.resetPosition(this._ballPositions[this._currentPosition].X, this._ballPositions[this._currentPosition].Y);
                }
            }
            else {
                this._timer += deltaTime;
            }
        }
        this.updateDebugStepForward(() => {
            this._ball.update(this._paddle, this._bricks);
            this._bricks.update();
            if (this._ball.canvasBottomCollision()) {
                this._currentPosition += 1;
                this._ball.resetPosition(this._ballPositions[this._currentPosition].X, this._ballPositions[this._currentPosition].Y);
            }
        }, () => {
            // this._paddle.update(this._mouseX);
        });
    }
    draw() {
        this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black');
        this._ball.draw();
        this._paddle.draw();
        this._bricks.draw();
        this.drawDebug(() => {
            this.drawStats();
        });
    }
    drawStats() {
        let startX = this._mouseX + 50;
        let startY = this._mouseY;
        const mousePosition = `Mouse (x,y): ${this._mouseX.toFixed(0)},${this._mouseY.toFixed(0)}`;
        const ballCenterPosition = `Ball Center (x,y): ${this._ball.centerX},${this._ball.centerY}`;
        const paddleCurrentTarget = `Current Paddle Target (x,y): ${this._paddlePositions[this._currentPosition].X},${this._paddlePositions[this._currentPosition].Y}`;
        const ballRightPosition = `Ball Right (x,y): ${this._ball.rightX},${this._ball.centerY}`;
        const ballBottomPosition = `Ball Bottom (x,y): ${this._ball.centerX},${this._ball.bottomY}`;
        const paddleYPositions = `Paddle Top Y: ${this._paddle.topY}, Paddle Bottom Y: ${this._paddle.bottomY}`;
        const paddleXPositions = `Paddle Left X: ${this._paddle.leftX}, Paddle Right X: ${this._paddle.rightX}`;
        this.colorText(startX, startY, 'yellow', mousePosition);
        startY += 22;
        this.colorText(startX, startY, 'yellow', ballCenterPosition);
        startY += 22;
        this.colorText(startX, startY, 'yellow', paddleCurrentTarget);
        startY += 22;
        // this.colorText(startX, startY, 'yellow', ballRightPosition);
        this.colorText(startX, startY, 'yellow', ballBottomPosition);
        startY += 22;
        this.colorText(startX, startY, 'yellow', paddleYPositions);
        startY += 22;
        this.colorText(startX, startY, 'yellow', paddleXPositions);
        startY += 22;
        this.colorText(startX, startY, 'yellow', `current position: ${this._currentPosition}`);
    }
    run(timestamp = 0) {
        const deltaTime = timestamp - this._lastTime;
        this._lastTime = timestamp;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(t => this.run(t));
    }
}
window.onload = () => {
    const canvas = document.getElementById('GameCanvas');
    const context = canvas.getContext('2d');
    const game = new Test(canvas, context);
    game.run();
};
//# sourceMappingURL=test.js.map