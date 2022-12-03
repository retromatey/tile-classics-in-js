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
            if (this.paddleCollision(paddle) ||
                this.paddleCollisionRight(paddle) ||
                this.paddleCollisionLeft(paddle)) {
                if (this.paddleCollision(paddle)) {
                    this.logDebug('Ball', 'Paddle collision top');
                    this._speedY *= -1;
                    this._spinX = paddle.getPaddleSpin(this._centerX);
                    this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeedX : this._maxSpeedX;
                    this._centerY = paddle.topY - this._radius;
                }
                else if (this.paddleCollisionRight(paddle)) {
                    this.logDebug('Ball', 'Paddle collision right');
                    this._speedY *= -1;
                    this._spinX = paddle.getPaddleSpin(this._centerX);
                    this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeedX : this._maxSpeedX;
                    this._centerX = paddle.rightX + this._radius;
                }
                else if (this.paddleCollisionLeft(paddle)) {
                    this.logDebug('Ball', 'Paddle collision left');
                    this._speedY *= -1;
                    this._spinX = paddle.getPaddleSpin(this._centerX);
                    this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeedX : this._maxSpeedX;
                    this._centerX = paddle.leftX - this._radius;
                }
                else {
                    this.logDebug('Ball', 'Paddle collision ????');
                    this._speedY *= -1;
                    this._spinX = paddle.getPaddleSpin(this._centerX);
                    this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeedX : this._maxSpeedX;
                }
            }
        }
        else if (this.topY < bricks.bottomRowY + 20) {
            // let brick = this.brickCollisionBottom(bricks);
            //
            // if (brick !== null) {
            //     this._speedY = this._maxSpeedY;
            //     this._centerY = brick.bottomY + this._radius;
            //
            // } else {
            //     brick = this.brickCollisionTop(bricks);
            //    
            //     if (brick !== null) {
            //         this._speedY = -this._maxSpeedY;
            //         this._centerY = brick.topY - this._radius;
            //        
            //     } else {
            //         brick = this.brickCollisionLeft(bricks);
            //
            //         if (brick !== null) {
            //             this._speedX = -this._maxSpeedX;
            //             this._centerX = brick.leftX - this._radius;
            //
            //         } else {
            //             brick = this.brickCollisionRight(bricks);
            //
            //             if (brick !== null) {
            //                 this._speedX = this._maxSpeedX;
            //                 this._centerX = brick.rightX + this._radius;
            //             }
            //         }
            //     }
            // }
            let collision = false;
            for (let i = 0; i < bricks.rows; i++) {
                for (let j = 0; j < bricks.columns; j++) {
                    const brick = bricks.brickArray[i][j];
                    if (brick.alive) {
                        if (brick.collisionLeft(this.rightX, this.centerY, this._speedX)) {
                            this.logDebug('ball', 'Left brick collision');
                            collision = true;
                            this._speedX = -this._maxSpeedX;
                        }
                        else if (brick.collisionRight(this.leftX, this.centerY, this._speedX)) {
                            this.logDebug('ball', 'Right brick collision');
                            collision = true;
                            this._speedX = this._maxSpeedX;
                        }
                        else if (brick.collisionTop(this.centerX, this.bottomY, this._speedY)) {
                            this.logDebug('ball', 'Top brick collision');
                            collision = true;
                            this._speedY = -this._maxSpeedY;
                        }
                        else if (brick.collisionBottom(this.centerX, this.topY, this._speedY)) {
                            this.logDebug('ball', 'Bottom brick collision');
                            collision = true;
                            this._speedY = this._maxSpeedY;
                        }
                    }
                    if (collision) {
                        break;
                    }
                }
                if (collision) {
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
    paddleCollision(paddle) {
        this.logDebug("Ball", "Paddle top collision check");
        this.logDebug("Ball", `${this._speedY > 0}`);
        this.logDebug("Ball", `${this.bottomY >= paddle.topY}`);
        this.logDebug("Ball", `${this.bottomY < paddle.bottomY}`);
        this.logDebug("Ball", `${this.centerX >= paddle.leftX}`);
        this.logDebug("Ball", `${this.centerX <= paddle.rightX}`);
        this.logDebug("Ball", "\n");
        if (this._speedY > 0) {
            return this.bottomY >= paddle.topY &&
                this.bottomY < paddle.bottomY &&
                this.centerX >= paddle.leftX &&
                this.centerX <= paddle.rightX;
        }
        return false;
    }
    paddleCollisionRight(paddle) {
        if (this._speedX < 0) {
            return this.leftX > paddle.leftX &&
                this.leftX <= paddle.rightX &&
                this.centerY <= paddle.bottomY &&
                this.centerY >= paddle.topY;
        }
        return false;
    }
    paddleCollisionLeft(paddle) {
        this.logDebug("Ball", "Paddle left collision check");
        this.logDebug("Ball", `${this._speedX > 0}`);
        this.logDebug("Ball", `${this.rightX >= paddle.leftX}`);
        this.logDebug("Ball", `${this.rightX < paddle.rightX}`);
        this.logDebug("Ball", `${this.centerY <= paddle.bottomY}`);
        this.logDebug("Ball", `${this.centerY >= paddle.topY}`);
        this.logDebug("Ball", "\n");
        if (this._speedX > 0) {
            return this.rightX >= paddle.leftX &&
                this.rightX < paddle.rightX &&
                this.centerY <= paddle.bottomY &&
                this.centerY >= paddle.topY;
        }
        return false;
    }
    brickCollisionBottom(bricks) {
        if (this._speedY < 0) {
            const rowLength = bricks.brickArray.length;
            const columnLength = bricks.brickArray[0].length;
            for (let i = 0; i < rowLength; i++) {
                for (let j = 0; j < columnLength; j++) {
                    const brick = bricks.brickArray[i][j];
                    if (brick.alive) {
                        const collision = this.topY < brick.bottomY &&
                            this.topY > brick.topY &&
                            this.centerX > brick.leftX &&
                            this.centerX < brick.rightX;
                        if (collision) {
                            brick.alive = false;
                            return brick;
                        }
                    }
                }
            }
        }
        return null;
    }
    brickCollisionTop(bricks) {
        if (this._speedY > 0) {
            const rowLength = bricks.brickArray.length;
            const columnLength = bricks.brickArray[0].length;
            for (let i = 0; i < rowLength; i++) {
                for (let j = 0; j < columnLength; j++) {
                    const brick = bricks.brickArray[i][j];
                    if (brick.alive) {
                        const collision = this.bottomY > brick.topY &&
                            this.bottomY < brick.bottomY &&
                            this.centerX > brick.leftX &&
                            this.centerX < brick.rightX;
                        if (collision) {
                            brick.alive = false;
                            return brick;
                        }
                    }
                }
            }
        }
        return null;
    }
    brickCollisionLeft(bricks) {
        if (this._speedX > 0) {
            const rowLength = bricks.brickArray.length;
            const columnLength = bricks.brickArray[0].length;
            for (let i = 0; i < rowLength; i++) {
                for (let j = 0; j < columnLength; j++) {
                    const brick = bricks.brickArray[i][j];
                    if (brick.alive) {
                        const collision = this.centerY < brick.bottomY &&
                            this.centerY > brick.topY &&
                            this.rightX > brick.leftX &&
                            this.rightX < brick.rightX;
                        if (collision) {
                            brick.alive = false;
                            return brick;
                        }
                    }
                }
            }
        }
        return null;
    }
    brickCollisionRight(bricks) {
        if (this._speedX < 0) {
            const rowLength = bricks.brickArray.length;
            const columnLength = bricks.brickArray[0].length;
            for (let i = 0; i < rowLength; i++) {
                for (let j = 0; j < columnLength; j++) {
                    const brick = bricks.brickArray[i][j];
                    if (brick.alive) {
                        const collision = this.centerY < brick.bottomY &&
                            this.centerY > brick.topY &&
                            this.leftX > brick.leftX &&
                            this.leftX < brick.rightX;
                        if (collision) {
                            brick.alive = false;
                            return brick;
                        }
                    }
                }
            }
        }
        return null;
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