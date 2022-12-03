import Base from "./base.js";

export default class Brick extends Base {
    public get leftX(): number { return this._centerX - this.width * 0.5; }
    public get topY(): number { return this._centerY - this.height * 0.5; }
    public get rightX(): number { return this._centerX + this.width * 0.5; }
    public get bottomY(): number { return this._centerY + this.height * 0.5; }

    public get centerX(): number { return this._centerX; }
    public set centerX(value: number) { this._centerX = value; }

    public get centerY(): number { return this._centerY; }
    public set centerY(value: number) { this._centerY = value; }

    public get width(): number { return this._width; }
    public set width(value: number) { this._width = value; }

    public get height(): number { return this._height; }
    public set height(value: number) { this._height = value; }

    public get alive(): boolean { return this._alive; }
    public set alive(value: boolean) { this._alive = value; }

    private _centerX: number = 0;
    private _centerY: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _alive: boolean = true;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
    }

    public draw() {

        if (this.alive) {
            this.colorRect(this.leftX, this.topY, this.width, this.height, 'blue');
            this.strokeRect(this.leftX, this.topY, this.width, this.height, 'black', 2);
        }
    }

    public update() {

        if (this.alive) {
            // update stuff...
        }
    }
    
    public collisionLeft(x: number, y: number, directionX: number) {
        
        if (this.alive && directionX > 0) {
            const collision =
                this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;

            if (collision) {
                this.alive = false;
                return true;
            }
        }
        
        return false;
    }

    public collisionRight(x: number, y: number, directionX: number) {

        if (this.alive && directionX < 0) {
            const collision =
                this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;

            if (collision) {
                this.alive = false;
                return true;
            }
        }

        return false;
    }

    public collisionTop(x: number, y: number, directionY: number) {

        if (this.alive && directionY > 0) {
            const collision =
                this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;

            if (collision) {
                this.alive = false;
                return true;
            }
        }

        return false;
    }

    public collisionBottom(x: number, y: number, directionY: number) {

        if (this.alive && directionY < 0) {
            const collision =
                this.bottomY >= y && y >= this.topY &&
                this.leftX <= x && x <= this.rightX;

            if (collision) {
                this.alive = false;
                return true;
            }
        }

        return false;
    }
}