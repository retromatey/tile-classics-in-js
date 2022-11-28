import Paddle from "./paddle.js";
import Ball from "./ball.js";

export default class PaddleComputer extends Paddle {

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
    }

    resetPosition(): void {
        this._centerX = this.canvas.width - this._width * 0.5;
        this._centerY = this.canvas.height * 0.5;
    }

    public setPosition(ball: Ball) {
        
        if (ball.speedX > 0 && ball.centerX > (this.canvas.width * 0.5) - 100) {            
            let speedYPercentage: number = Math.random() * (0.85 - 0.55) + 0.55;

            if (ball.centerY > this._centerY + 47) {
                this._centerY += Math.abs(ball.speedY * (ball.spinY));

            } else if (ball.centerY < this._centerY - 47) {
                this._centerY -= Math.abs(ball.speedY * (ball.spinY));

            } else {
                this._centerY += (ball.speedY * (ball.spinY*speedYPercentage));
            }

            this.update(this._centerY);
            
        } else {
            
            if (this._centerY < (this.canvas.height * 0.5) - 3) {
                this._centerY += 2;
                
            } else if (this._centerY > (this.canvas.height * 0.5) + 3) {
                this._centerY -= 2;              
            }
        }
    }
}