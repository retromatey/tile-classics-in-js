import Base from "./base.js";
import Paddle from "./paddle.js";

export default class Ball extends Base {    
    private _speedX: number = 0;
    private _speedY: number = 0;
    private _centerX: number = 0;
    private _centerY: number = 0;
    private _spinX: number = 1;
    private readonly _radius: number = 10;
    private readonly _maxSpeed: number = 7;
    
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this.resetPosition();
    }

    public resetPosition() {
        this._spinX = 1;
        this._speedY = this._maxSpeed;
        this._speedX = this._maxSpeed;
        this._centerX = 200;
        this._centerY = 200;
    }
    
    public update(paddle: Paddle) {      
        this._centerX += this._speedX * this._spinX;
        this._centerY += this._speedY;

        const canvasWidth = this.canvas.width;
        const ballRightEdge = this._centerX + this._radius;
        const ballLeftEdge = this._centerX - this._radius;
        const ballTopEdge = this._centerY - this._radius;
        
        if (ballLeftEdge < 0) {
            this._centerX = this._radius;
            this._speedX *= -1;
            
        } else if (ballRightEdge > canvasWidth) {
            this._centerX = canvasWidth - this._radius;
            this._speedX *= -1;
            
        } else if (ballTopEdge < 0) {
            this._centerY = this._radius;
            this._speedY *= -1;           
            
        } else if ( this.paddleCollision(paddle) ||
                    this.paddleCollisionRight(paddle) ||
                    this.paddleCollisionLeft(paddle) ) {
            this._centerY = paddle.topEdge - this._radius;     
            this._speedY *= -1;
            this._spinX = paddle.getPaddleSpin(this._centerX);          
            this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeed : this._maxSpeed;
        }
    }
    
    public draw() {
        this.colorCircle(this._centerX, this._centerY, this._radius, 'white');
    }

    public canvasBottomCollision(): boolean {
        const ballBottomEdge = this._centerY + this._radius;
        return ballBottomEdge > this.canvas.height;
    }

    private paddleCollision(paddle: Paddle): boolean {
        const ballRightEdge = this._centerX + this._radius;
        const ballLeftEdge = this._centerX - this._radius;
        const ballBottomEdge = this._centerY + this._radius;
        
        return ballBottomEdge > paddle.topEdge && 
               ballLeftEdge > paddle.leftEdge && 
               ballRightEdge < paddle.rightEdge;
    }
    
    private paddleCollisionRight(paddle: Paddle) {
        const ballLeftEdge = this._centerX - this._radius;
        const ballBottomEdge = this._centerY + this._radius;
        
        return ballLeftEdge > paddle.leftEdge && ballLeftEdge < paddle.rightEdge &&
               ballBottomEdge < paddle.bottomEdge && ballBottomEdge > paddle.topEdge;
    }

    private paddleCollisionLeft(paddle: Paddle) {
        const ballRightEdge = this._centerX + this._radius;
        const ballBottomEdge = this._centerY + this._radius;

        return ballRightEdge > paddle.leftEdge && ballRightEdge < paddle.rightEdge &&
               ballBottomEdge < paddle.bottomEdge && ballBottomEdge > paddle.topEdge;
    }
}