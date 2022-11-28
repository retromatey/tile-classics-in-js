import Paddle from "./paddle.js";

export default class PaddlePlayer extends Paddle {

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
    }

    resetPosition(): void {
        this._centerX = this._width * 0.5;
        this._centerY = this.canvas.height * 0.5;
    }
}