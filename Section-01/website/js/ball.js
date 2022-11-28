import Base from "./base.js";
export default class Ball extends Base {
    constructor(canvas, context) {
        super(canvas, context);
        this._speedX = 0;
        this._speedY = 0;
        this._centerX = 0;
        this._centerY = 0;
        this._spinX = 1;
        this._radius = 10;
        this._maxSpeed = 7;
        this.resetPosition();
    }
    resetPosition() {
        this._spinX = 1;
        this._speedY = this._maxSpeed;
        this._speedX = this._maxSpeed;
        this._centerX = 200;
        this._centerY = 200;
    }
    update(paddle) {
        this._centerX += this._speedX * this._spinX;
        this._centerY += this._speedY;
        const canvasWidth = this.canvas.width;
        const ballRightEdge = this._centerX + this._radius;
        const ballLeftEdge = this._centerX - this._radius;
        const ballTopEdge = this._centerY - this._radius;
        if (ballLeftEdge < 0) {
            this._centerX = this._radius;
            this._speedX *= -1;
        }
        else if (ballRightEdge > canvasWidth) {
            this._centerX = canvasWidth - this._radius;
            this._speedX *= -1;
        }
        else if (ballTopEdge < 0) {
            this._centerY = this._radius;
            this._speedY *= -1;
        }
        else if (this.paddleCollision(paddle) ||
            this.paddleCollisionRight(paddle) ||
            this.paddleCollisionLeft(paddle)) {
            this._centerY = paddle.topEdge - this._radius;
            this._speedY *= -1;
            this._spinX = paddle.getPaddleSpin(this._centerX);
            this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeed : this._maxSpeed;
        }
    }
    draw() {
        this.colorCircle(this._centerX, this._centerY, this._radius, 'white');
    }
    canvasBottomCollision() {
        const ballBottomEdge = this._centerY + this._radius;
        return ballBottomEdge > this.canvas.height;
    }
    paddleCollision(paddle) {
        const ballRightEdge = this._centerX + this._radius;
        const ballLeftEdge = this._centerX - this._radius;
        const ballBottomEdge = this._centerY + this._radius;
        return ballBottomEdge > paddle.topEdge &&
            ballLeftEdge > paddle.leftEdge &&
            ballRightEdge < paddle.rightEdge;
    }
    paddleCollisionRight(paddle) {
        const ballLeftEdge = this._centerX - this._radius;
        const ballBottomEdge = this._centerY + this._radius;
        return ballLeftEdge > paddle.leftEdge && ballLeftEdge < paddle.rightEdge &&
            ballBottomEdge < paddle.bottomEdge && ballBottomEdge > paddle.topEdge;
    }
    paddleCollisionLeft(paddle) {
        const ballRightEdge = this._centerX + this._radius;
        const ballBottomEdge = this._centerY + this._radius;
        return ballRightEdge > paddle.leftEdge && ballRightEdge < paddle.rightEdge &&
            ballBottomEdge < paddle.bottomEdge && ballBottomEdge > paddle.topEdge;
    }
}
//# sourceMappingURL=ball.js.map