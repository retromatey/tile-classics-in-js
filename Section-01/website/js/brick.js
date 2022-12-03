import Base from "./base.js";
export default class Brick extends Base {
    constructor(canvas, context) {
        super(canvas, context);
        this._centerX = 0;
        this._centerY = 0;
        this._width = 0;
        this._height = 0;
        this._alive = true;
    }
    get leftX() { return this._centerX - this.width * 0.5; }
    get topY() { return this._centerY - this.height * 0.5; }
    get rightX() { return this._centerX + this.width * 0.5; }
    get bottomY() { return this._centerY + this.height * 0.5; }
    get centerX() { return this._centerX; }
    set centerX(value) { this._centerX = value; }
    get centerY() { return this._centerY; }
    set centerY(value) { this._centerY = value; }
    get width() { return this._width; }
    set width(value) { this._width = value; }
    get height() { return this._height; }
    set height(value) { this._height = value; }
    get alive() { return this._alive; }
    set alive(value) { this._alive = value; }
    draw() {
        if (this.alive) {
            this.colorRect(this.leftX, this.topY, this.width, this.height, 'blue');
            this.strokeRect(this.leftX, this.topY, this.width, this.height, 'black', 2);
        }
    }
    update() {
        if (this.alive) {
            // update stuff...
        }
    }
    collisionLeft(x, y, directionX) {
        if (this.alive && directionX > 0) {
            const collision = this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;
            if (collision) {
                this.alive = false;
                return true;
            }
        }
        return false;
    }
    collisionRight(x, y, directionX) {
        if (this.alive && directionX < 0) {
            const collision = this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;
            if (collision) {
                this.alive = false;
                return true;
            }
        }
        return false;
    }
    collisionTop(x, y, directionY) {
        if (this.alive && directionY > 0) {
            const collision = this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;
            if (collision) {
                this.alive = false;
                return true;
            }
        }
        return false;
    }
    collisionBottom(x, y, directionY) {
        if (this.alive && directionY < 0) {
            const collision = this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;
            if (collision) {
                this.alive = false;
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=brick.js.map