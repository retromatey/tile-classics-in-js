import Base from "./base.js";

export default abstract class Paddle extends Base {
    get leftEdge(): number { return this._centerX - (this._width * 0.5); }
    get rightEdge(): number { return this._centerX + (this._width * 0.5); }
    get topEdge(): number { return this._centerY - (this._height * 0.5); }
    get bottomEdge(): number { return this._centerY + (this._height * 0.5); }

    protected _centerX: number = 0;
    protected _centerY: number = 0;
    protected readonly _width: number = 10;
    protected readonly _height: number = 100;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this.resetPosition();
    }

    public abstract resetPosition(): void;
    // public resetPosition() {
    //     this._centerX = this._width * 0.5;
    //     this._centerY = this.canvas.height * 0.5;
    // }

    public update(mouseY: number) {
        this._centerY = mouseY;
        const leftEdge = this._centerX - (this._width * 0.5);
        const rightEdge = this._centerX + (this._width * 0.5);

        if (this.topEdge < 0) {
            this._centerY = this._height * 0.5;

        } else if (this.bottomEdge > this.canvas.height) {
            this._centerY = this.canvas.height - (this._height * 0.5);
        }
    }

    public draw() {
        const topLeftX = this._centerX - (this._width * 0.5);
        const topLeftY = this._centerY - (this._height * 0.5);
        this.colorRect(topLeftX, topLeftY, this._width, this._height, 'white');
    }

    public getPaddleSpin(y: number) {
        const pCenter = this._height * 0.5;
        const hitY = Math.abs(y - (this.topEdge + pCenter));
        // return Math.ceil(hitX / (pCenter / 3));
        const spin = hitY / (pCenter / 3.5);
        return spin <= 0.75 ? 1 : spin;
    }

    public getPaddleDirection(y: number, speedY: number) {
        const directionY = speedY < 0 ? -1 : 1;

        const pCenter = this._height * 0.5;
        const hitY = y - (this.topEdge + pCenter);
        const directionHit = hitY < 0 ? -1 : 1;

        const spinThreshold = this.getPaddleSpin(y) * directionHit;

        let result = directionY;
        if (directionY === -1 && spinThreshold <= -2) {
            result = -1;
        } else if (directionY === -1 && spinThreshold >= 2) {
            result = 1;
        } else if (directionY === 1 && spinThreshold >= 2) {
            result = 1;
        } else if (directionY === 1 && spinThreshold <= -2) {
            result = -1;
        }
        console.log(`spinThreshold: ${spinThreshold}, hitX: ${hitY}, directionX: ${directionY}, we are going: ${result}`);
        return result;
    }
}