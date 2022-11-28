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
    get leftEdge() { return this._centerX - (this._width * 0.5); }
    get rightEdge() { return this._centerX + (this._width * 0.5); }
    get topEdge() { return this._centerY - (this._height * 0.5); }
    get bottomEdge() { return this._centerY + (this._height * 0.5); }
    resetPosition() {
        this._centerX = this.canvas.width * 0.5;
        this._centerY = this.canvas.height - (this._height * 0.5);
    }
    update(mouseX) {
        this._centerX = mouseX;
        const leftEdge = this._centerX - (this._width * 0.5);
        const rightEdge = this._centerX + (this._width * 0.5);
        if (leftEdge < 0) {
            this._centerX = this._width * 0.5;
        }
        else if (rightEdge > this.canvas.width) {
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
        const hitX = Math.abs(x - (this.leftEdge + pCenter));
        // return Math.ceil(hitX / (pCenter / 3));
        const spin = hitX / (pCenter / 3.5);
        return spin <= 0.75 ? 1 : spin;
    }
    getPaddleDirection(x, speedX) {
        const directionX = speedX < 0 ? -1 : 1;
        const pCenter = this._width * 0.5;
        const hitX = x - (this.leftEdge + pCenter);
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
        console.log(`spinThreshold: ${spinThreshold}, hitX: ${hitX}, directionX: ${directionX}, we are going: ${result}`);
        return result;
    }
}
//# sourceMappingURL=paddle.js.map