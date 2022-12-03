import Base from "./base.js";
import Brick from "./brick.js";

export default class Bricks extends Base {
    public get rows(): number { return this._rows; }
    public get columns(): number { return this._columns; }
    public get brickArray(): Brick[][] { return this._brickArray; }
    public get bottomRowY(): number { return this._bottomRowY; }
    
    private _distanceFromTop: number = 0;
    private _brickWidth: number = 0;
    private _brickHeight: number = 0;
    private _rows: number = 0;
    private _columns: number = 0;
    private _brickArray: Brick[][] = [];
    private _bottomRowY: number = 0;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this.reset();
    }
    
    public reset() {
        this._distanceFromTop = 50;
        this._rows = 5;
        this._columns = 10;
        this._brickHeight = 20;
        this._brickWidth = this.canvas.width / this._columns;
        this._brickArray = [];
        
        this._bottomRowY = this._distanceFromTop + (this._rows * this._brickHeight);
        
        for (let i = 0; i < this._rows; i++) {
            this._brickArray[i] = [];

            for (let j = 0; j < this._columns; j++) {
                const brick = new Brick(this.canvas, this.context);
                brick.height = this._brickHeight;
                brick.width = this._brickWidth;
                brick.centerY = (i * this._brickHeight) + (this._brickHeight * 0.5) + this._distanceFromTop;
                brick.centerX = (j * this._brickWidth) + (this._brickWidth * 0.5);
                brick.alive = true;
                this._brickArray[i][j] = brick;                
            }
        }
    }
    
    public draw() {
        
        for (let i = 0; i < this._rows; i++) {
            
            for (let j = 0; j < this._columns; j++) {
                const brick = this._brickArray[i][j];
                brick.draw();
            }
        }
    }
    
    public update() {
        
    }
}