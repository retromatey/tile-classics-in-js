import Base from "./base.js";
import Paddle from "./paddle.js";

export default class Ball extends Base {
    get centerX(): number { return this._centerX; }
    get centerY(): number { return this._centerY; }
    get ballRightEdge() { return this._centerX + this._radius; }
    get ballLeftEdge() { return this._centerX - this._radius; }
    get ballTopEdge() { return this._centerY - this._radius; }
    get ballBottomEdge() { return this._centerY + this._radius; }
    
    private _speedX: number = 0;
    private _speedY: number = 0;
    private _centerX: number = 0;
    private _centerY: number = 0;
    private _spinX: number = 1;
    private readonly _radius: number = 10;
    private readonly _maxSpeedY: number = 10;
    private readonly _maxSpeedX: number = 7;
    
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this.resetPosition();
    }

    public resetPosition() {
        this._spinX = 1;
        this._speedY = this._maxSpeedY;
        this._speedX = this._maxSpeedX;
        this._centerX = 200;
        this._centerY = 200;
    }
    
    public update(paddle: Paddle) {      
        this._centerX += this._speedX * this._spinX;
        this._centerY += this._speedY;
        
        if (this.ballLeftEdge < 0) {
            this._centerX = this._radius;
            this._speedX *= -1;
            
        } else if (this.ballRightEdge > this.canvas.width) {
            this._centerX = this.canvas.width - this._radius;
            this._speedX *= -1;
            
        } else if (this.ballTopEdge < 0) {
            this._centerY = this._radius;
            this._speedY *= -1;           
            
        } else if ( this.paddleCollision(paddle) ||
                    this.paddleCollisionRight(paddle) ||
                    this.paddleCollisionLeft(paddle) ) { 
            this._speedY *= -1;
            this._spinX = paddle.getPaddleSpin(this._centerX);          
            this._speedX = paddle.getPaddleDirection(this._centerX, this._speedX) < 0 ? -this._maxSpeedX : this._maxSpeedX;
            
            if (this.paddleCollision(paddle)) {
                this._centerY = paddle.topEdge - this._radius;     
                
            } else if (this.paddleCollisionRight(paddle)) {
                this._centerX = paddle.rightEdge + this._radius;

            } else if (this.paddleCollisionLeft(paddle)) {
                this._centerX = paddle.leftEdge - this._radius;
            }
        }
    }
    
    public draw() {
        this.colorCircle(this._centerX, this._centerY, this._radius, 'white');
    }

    public canvasBottomCollision(): boolean {
        return this.ballBottomEdge > this.canvas.height;
    }

    private paddleCollision(paddle: Paddle): boolean {        
        return this.ballBottomEdge > paddle.topEdge && 
               this.ballBottomEdge < paddle.bottomEdge &&
               this.centerX > paddle.leftEdge && 
               this.centerX < paddle.rightEdge;
    }
    
    private paddleCollisionRight(paddle: Paddle) {        
        return this.ballLeftEdge > paddle.leftEdge && 
               this.ballLeftEdge < paddle.rightEdge &&
               this.centerY < paddle.bottomEdge && 
               this.centerY > paddle.topEdge;
    }

    private paddleCollisionLeft(paddle: Paddle) {
        return this.ballRightEdge > paddle.leftEdge && 
               this.ballRightEdge < paddle.rightEdge &&
               this.centerY < paddle.bottomEdge && 
               this.centerY > paddle.topEdge;
    }
}