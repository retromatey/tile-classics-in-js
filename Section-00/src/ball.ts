import Base from "./base.js";
import Paddle from "./paddle.js";
import PaddlePlayer from "./paddlePlayer.js";
import PaddleComputer from "./paddleComputer.js";

export default class Ball extends Base {
    get spinY(): number { return this._spinY; }
    get speedY(): number { return this._speedY; }
    get speedX(): number { return this._speedX; }
    get centerY(): number { return this._centerY; }
    get centerX(): number { return this._centerX; }
    
    private _speedX: number = 0;
    private _speedY: number = 0;
    private _centerX: number = 0;
    private _centerY: number = 0;
    private _spinY: number = 1;
    private readonly _radius: number = 10;
    private readonly _maxSpeed: number = 7;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this.resetPosition(-1);
    }

    public resetPosition(direction: number) {
        this._spinY = 1;
        this._speedY = this._maxSpeed;
        this._speedX = this._maxSpeed * direction;
        this._centerX = (this.canvas.width * 0.5) + (100 * direction);
        this._centerY = Math.floor(Math.random() * (190 - 100 + 1) + 100);
    }

    public update(paddlePlayer: PaddlePlayer, paddleComputer: PaddleComputer) {
        this._centerX += this._speedX;
        this._centerY += this._speedY * this._spinY;

        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const ballRightEdge = this._centerX + this._radius;
        const ballLeftEdge = this._centerX - this._radius;
        const ballTopEdge = this._centerY - this._radius;
        const ballBottomEdge = this._centerY + this._radius;

        if (ballBottomEdge > this.canvas.height) {
            this._speedY *= -1;
            this._centerY = this.canvas.height - this._radius;
            
        } else if (ballTopEdge < 0) {
            this._speedY *= -1;
            this._centerY = this._radius;
            
        } else if ( this.paddlePlayerCollision(paddlePlayer) ||
                    this.paddlePlayerCollisionTop(paddlePlayer) ||
                    this.paddlePlayerCollisionBottom(paddlePlayer) ) {
            this._spinY = paddlePlayer.getPaddleSpin(this._centerY);
            this._speedY = paddlePlayer.getPaddleDirection(this._centerY, this._speedY) < 0 ? -this._maxSpeed : this._maxSpeed;
            this._centerX = paddlePlayer.rightEdge + this._radius;
            this._speedX *= -1; 
            
        } else if ( this.paddleComputerCollision(paddleComputer) ||
            this.paddleComputerCollisionTop(paddleComputer) ||
            this.paddleComputerCollisionBottom(paddleComputer) ) {
            this._spinY = paddleComputer.getPaddleSpin(this._centerY);
            this._speedY = paddleComputer.getPaddleDirection(this._centerY, this._speedY) < 0 ? -this._maxSpeed : this._maxSpeed;
            this._centerX = paddleComputer.leftEdge - this._radius;
            this._speedX *= -1;
        }
    }

    public draw() {
        this.colorCircle(this._centerX, this._centerY, this._radius, 'white');
    }

    public canvasSideCollision(): boolean {
        const ballRightEdge = this._centerX + this._radius;
        const ballLeftEdge = this._centerX - this._radius;
        
        return ballRightEdge > this.canvas.width ||
               ballLeftEdge < 0;
    }

    public canvasSideCollisionDirection(): number {
        const ballRightEdge = this._centerX + this._radius;
        const ballLeftEdge = this._centerX - this._radius;

        if (ballRightEdge > this.canvas.width) {
            return -1;
            
        } else if (ballLeftEdge < 0) {
            return 1;
            
        } else {
            return 0;
        }
    }

    private paddlePlayerCollision(paddle: PaddlePlayer): boolean {
        const ballLeftEdge = this._centerX - this._radius;

        return ballLeftEdge < paddle.rightEdge &&
               this._centerY < paddle.bottomEdge &&
               this._centerY > paddle.topEdge;
    }

    private paddlePlayerCollisionTop(paddle: PaddlePlayer) {
        const ballLeftEdge = this._centerX - this._radius;        
        const ballBottomEdge = this._centerY + this._radius;

        return ballLeftEdge > paddle.leftEdge && ballLeftEdge < paddle.rightEdge &&
               ballBottomEdge < paddle.bottomEdge && ballBottomEdge > paddle.topEdge;
    }

    private paddlePlayerCollisionBottom(paddle: PaddlePlayer) {
        const ballLeftEdge = this._centerX - this._radius;
        const ballTopEdge = this._centerY - this._radius;

        return ballLeftEdge > paddle.leftEdge && ballLeftEdge < paddle.rightEdge &&
               ballTopEdge < paddle.bottomEdge && ballTopEdge > paddle.topEdge;
    }

    private paddleComputerCollision(paddle: PaddleComputer): boolean {
        const ballRightEdge = this._centerX + this._radius;

        return ballRightEdge > paddle.rightEdge &&
            this._centerY < paddle.bottomEdge &&
            this._centerY > paddle.topEdge;
    }

    private paddleComputerCollisionTop(paddle: PaddleComputer) {
        const ballRightEdge = this._centerX + this._radius;
        const ballBottomEdge = this._centerY + this._radius;

        return ballRightEdge > paddle.leftEdge && ballRightEdge < paddle.leftEdge &&
            ballBottomEdge < paddle.bottomEdge && ballBottomEdge > paddle.topEdge;
    }

    private paddleComputerCollisionBottom(paddle: PaddleComputer) {
        const ballRightEdge = this._centerX + this._radius;
        const ballTopEdge = this._centerY - this._radius;

        return ballRightEdge > paddle.leftEdge && ballRightEdge < paddle.leftEdge &&
            ballTopEdge < paddle.bottomEdge && ballTopEdge > paddle.topEdge;
    }
}