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
        this._maxSpeedY = 10;
        this._maxSpeedX = 7;
        this.resetPosition();
    }
    get centerX() { return this._centerX; }
    get centerY() { return this._centerY; }
    get ballRightEdge() { return this._centerX + this._radius; }
    get ballLeftEdge() { return this._centerX - this._radius; }
    get ballTopEdge() { return this._centerY - this._radius; }
    get ballBottomEdge() { return this._centerY + this._radius; }
    resetPosition() {
        this._spinX = 1;
        this._speedY = this._maxSpeedY;
        this._speedX = this._maxSpeedX;
        this._centerX = 200;
        this._centerY = 200;
    }
    update(paddle) {
        this._centerX += this._speedX * this._spinX;
        this._centerY += this._speedY;
        if (this.ballLeftEdge < 0) {
            this._centerX = this._radius;
            this._speedX *= -1;
        }
        else if (this.ballRightEdge > this.canvas.width) {
            this._centerX = this.canvas.width - this._radius;
            this._speedX *= -1;
        }
        else if (this.ballTopEdge < 0) {
            this._centerY = this._radius;
            this._speedY *= -1;
        }
        else if (this.paddleCollision(paddle) ||
            this.paddleCollisionRight(paddle) ||
            this.paddleCollisionLeft(paddle)) {
            this._speedY *= -1;
            this._spinX = paddle.getPaddleSpin(this._centerX);
            this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeedX : this._maxSpeedX;
            if (this.paddleCollision(paddle)) {
                this._centerY = paddle.topEdge - this._radius;
            }
            else if (this.paddleCollisionRight(paddle)) {
                this._centerX = paddle.rightEdge + this._radius;
            }
            else if (this.paddleCollisionLeft(paddle)) {
                this._centerX = paddle.leftEdge - this._radius;
            }
        }
    }
    draw() {
        this.colorCircle(this._centerX, this._centerY, this._radius, 'white');
    }
    canvasBottomCollision() {
        return this.ballBottomEdge > this.canvas.height;
    }
    paddleCollision(paddle) {
        return this.ballBottomEdge > paddle.topEdge &&
            this.ballBottomEdge < paddle.bottomEdge &&
            this.centerX > paddle.leftEdge &&
            this.centerX < paddle.rightEdge;
    }
    paddleCollisionRight(paddle) {
        return this.ballLeftEdge > paddle.leftEdge &&
            this.ballLeftEdge < paddle.rightEdge &&
            this.centerY < paddle.bottomEdge &&
            this.centerY > paddle.topEdge;
    }
    paddleCollisionLeft(paddle) {
        return this.ballRightEdge > paddle.leftEdge &&
            this.ballRightEdge < paddle.rightEdge &&
            this.centerY < paddle.bottomEdge &&
            this.centerY > paddle.topEdge;
    }
}
//# sourceMappingURL=ball.js.map