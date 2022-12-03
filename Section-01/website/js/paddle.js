import Base from "./base.js";
export default class Paddle extends Base {
    constructor(canvas, context) {
        super(canvas, context);
        this._centerX = 0;
        this._centerY = 0;
        this._width = 100;
        this._height = 10;
        this.resetPosition();
    }
    get leftX() { return this._centerX - (this._width * 0.5); }
    get rightX() { return this._centerX + (this._width * 0.5); }
    get topY() { return this._centerY - (this._height * 0.5); }
    get bottomY() { return this._centerY + (this._height * 0.5); }
    get height() { return this._height; }
    resetPosition() {
        this._centerX = this.canvas.width * 0.5;
        // this._centerY = this.canvas.height - (this._height * 0.5);
        this._centerY = this.canvas.height - 40;
    }
    update(mouseX) {
        this._centerX = mouseX;
        if (this.leftX < 0) {
            this._centerX = this._width * 0.5;
        }
        else if (this.rightX > this.canvas.width) {
            this._centerX = this.canvas.width - (this._width * 0.5);
        }
    }
    draw() {
        const topLeftX = this._centerX - (this._width * 0.5);
        const topLeftY = this._centerY - (this._height * 0.5);
        this.colorRect(topLeftX, topLeftY, this._width, this._height, 'white');
    }
    getPaddleSpin(x) {
        const pCenter = this._width * 0.5;
        const hitX = Math.abs(x - (this.leftX + pCenter));
        return hitX / (pCenter / 3.5);
    }
    getPaddleDirection(x, speedX) {
        const directionX = speedX < 0 ? -1 : 1;
        const pCenter = this._width * 0.5;
        const hitX = x - (this.leftX + pCenter);
        const directionHit = hitX < 0 ? -1 : 1;
        const spinThreshold = this.getPaddleSpin(x) * directionHit;
        let result = directionX;
        if (directionX === -1 && spinThreshold <= -2) {
            result = -1;
        }
        else if (directionX === -1 && spinThreshold >= 2) {
            result = 1;
        }
        else if (directionX === 1 && spinThreshold >= 2) {
            result = 1;
        }
        else if (directionX === 1 && spinThreshold <= -2) {
            result = -1;
        }
        this.logDebug('Paddle', `spinThreshold: ${spinThreshold}, hitX: ${hitX}, directionX: ${directionX}, we are going: ${result}`);
        return result;
    }
    collisionLeft(x, y, directionX) {
        if (directionX > 0) {
            return this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;
        }
        return false;
    }
    collisionRight(x, y, directionX) {
        if (directionX < 0) {
            return this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;
        }
        return false;
    }
    collisionTop(x, y, directionY) {
        if (directionY > 0) {
            return this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;
        }
        return false;
    }
}
//# sourceMappingURL=paddle.js.map