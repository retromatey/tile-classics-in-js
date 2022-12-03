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
    get speedY() { return this._speedY; }
    get speedX() { return this._speedX; }
    get centerX() { return this._centerX; }
    get centerY() { return this._centerY; }
    get rightX() { return this._centerX + this._radius; }
    get leftX() { return this._centerX - this._radius; }
    get topY() { return this._centerY - this._radius; }
    get bottomY() { return this._centerY + this._radius; }
    get radius() { return this._radius; }
    resetPosition(centerX = 200, centerY = 200) {
        this._spinX = 1;
        this._speedY = this._maxSpeedY;
        this._speedX = this._maxSpeedX;
        this._centerX = centerX;
        this._centerY = centerY;
    }
    update(paddle, bricks) {
        if (this.leftX <= 0) {
            this._centerX = this._radius;
            this._speedX *= -1;
        }
        else if (this.rightX >= this.canvas.width) {
            this._centerX = this.canvas.width - this._radius;
            this._speedX *= -1;
        }
        else if (this.topY <= 0) {
            this._centerY = this._radius;
            this._speedY *= -1;
        }
        else if (this.bottomY > paddle.topY - 20) {
            let paddleCollision = false;
            if (paddle.collisionLeft(this.rightX, this.centerY, this._speedX)) {
                this.logDebug('ball', 'Left paddle collision');
                paddleCollision = true;
            }
            else if (paddle.collisionRight(this.leftX, this.centerY, this._speedX)) {
                this.logDebug('ball', 'Right paddle collision');
                paddleCollision = true;
            }
            else if (paddle.collisionTop(this.centerX, this.bottomY, this._speedY)) {
                this.logDebug('ball', 'Top paddle collision');
                paddleCollision = true;
            }
            if (paddleCollision) {
                this._speedY *= -1;
                this._spinX = paddle.getPaddleSpin(this._centerX);
                this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeedX : this._maxSpeedX;
            }
        }
        else if (this.topY < bricks.bottomRowY + 20) {
            let brickCollision = false;
            for (let i = 0; i < bricks.rows; i++) {
                for (let j = 0; j < bricks.columns; j++) {
                    const brick = bricks.brickArray[i][j];
                    if (brick.alive) {
                        if (brick.collisionLeft(this.rightX, this.centerY, this._speedX)) {
                            this.logDebug('ball', 'Left brick collision');
                            brickCollision = true;
                            this._speedX = -this._maxSpeedX;
                        }
                        else if (brick.collisionRight(this.leftX, this.centerY, this._speedX)) {
                            this.logDebug('ball', 'Right brick collision');
                            brickCollision = true;
                            this._speedX = this._maxSpeedX;
                        }
                        else if (brick.collisionTop(this.centerX, this.bottomY, this._speedY)) {
                            this.logDebug('ball', 'Top brick collision');
                            brickCollision = true;
                            this._speedY = -this._maxSpeedY;
                        }
                        else if (brick.collisionBottom(this.centerX, this.topY, this._speedY)) {
                            this.logDebug('ball', 'Bottom brick collision');
                            brickCollision = true;
                            this._speedY = this._maxSpeedY;
                        }
                    }
                    if (brickCollision) {
                        break;
                    }
                }
                if (brickCollision) {
                    break;
                }
            }
        }
        this._centerX += this._speedX * this._spinX;
        this._centerY += this._speedY;
    }
    draw() {
        this.colorCircle(this._centerX, this._centerY, this._radius, 'white');
        this.drawDebug(() => {
            this.drawBoundingBox();
        });
    }
    canvasBottomCollision() {
        return this.bottomY > this.canvas.height;
    }
    drawBoundingBox() {
        const boundX = this.centerX - this._radius;
        const boundY = this.centerY - this._radius;
        const length = this._radius * 2;
        const boundingColor = 'red';
        // bounding box
        this.context.strokeStyle = boundingColor;
        this.context.lineWidth = 1;
        this.context.strokeRect(boundX, boundY, length, length);
        // x,y coordinate
        this.context.fillStyle = boundingColor;
        this.context.fillRect(this.centerX, this.centerY, 1, 1);
    }
}
//# sourceMappingURL=ball.js.map