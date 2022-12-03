import Base from "./base.js";

export default class Paddle extends Base {
    public get leftX(): number { return this._centerX - (this._width * 0.5); }
    public get rightX(): number { return this._centerX + (this._width * 0.5); }
    public get topY(): number { return this._centerY - (this._height * 0.5); }
    public get bottomY(): number { return this._centerY + (this._height * 0.5); }
    public get height(): number { return this._height; }
    
    private _centerX: number = 0;
    private _centerY: number = 0;
    private readonly _width: number = 100;
    private readonly _height: number = 10;
    
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this.resetPosition();
    }
    
    public resetPosition() {               
        this._centerX = this.canvas.width * 0.5;
        // this._centerY = this.canvas.height - (this._height * 0.5);
        this._centerY = this.canvas.height - 40;
    }

    public update(mouseX: number) {        
        this._centerX = mouseX;

        if (this.leftX < 0) {
            this._centerX = this._width * 0.5;

        } else if (this.rightX > this.canvas.width) {
            this._centerX = this.canvas.width - (this._width * 0.5);
        }
    }
    
    public draw() {
        const topLeftX = this._centerX - (this._width * 0.5);
        const topLeftY = this._centerY - (this._height * 0.5);
        this.colorRect(topLeftX, topLeftY, this._width, this._height, 'white');
    }
    
    public getPaddleSpin(x: number) {
        const pCenter = this._width * 0.5;
        const hitX = Math.abs(x - (this.leftX + pCenter));
        return hitX / (pCenter / 3.5);
    }
    
    public getPaddleDirection(x: number, speedX: number) {
        const directionX = speedX < 0 ? -1 : 1;
        
        const pCenter = this._width * 0.5;
        const hitX = x - (this.leftX + pCenter);
        const directionHit = hitX < 0 ? -1 : 1;
        
        const spinThreshold = this.getPaddleSpin(x) * directionHit;
        
        let result = directionX;
        if (directionX === -1 && spinThreshold <= -2) {
            result = -1;
        } else if (directionX === -1 && spinThreshold >= 2) {
            result = 1;
        } else if (directionX === 1 && spinThreshold >= 2) {
            result = 1;            
        } else if (directionX === 1 && spinThreshold <= -2) {
            result = -1;
        }
        
        this.logDebug('Paddle', `spinThreshold: ${spinThreshold}, hitX: ${hitX}, directionX: ${directionX}, we are going: ${result}`);
        
        return result;
    }

    public collisionLeft(x: number, y: number, directionX: number) {

        if (directionX > 0) {
            return this.bottomY >= y && y >= this.topY &&
                   this.leftX <= x && x <= this.rightX;
        }

        return false;
    }

    public collisionRight(x: number, y: number, directionX: number) {

        if (directionX < 0) {
            return this.bottomY >= y && y >= this.topY &&
                   this.leftX <= x && x <= this.rightX;
        }

        return false;
    }

    public collisionTop(x: number, y: number, directionY: number) {

        if (directionY > 0) {
            return this.bottomY >= y && y >= this.topY &&
                   this.leftX <= x && x <= this.rightX;
        }

        return false;
    }
}