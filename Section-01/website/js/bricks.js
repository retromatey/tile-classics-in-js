import Base from "./base.js";
import Brick from "./brick.js";
export default class Bricks extends Base {
    constructor(canvas, context) {
        super(canvas, context);
        this._distanceFromTop = 0;
        this._brickWidth = 0;
        this._brickHeight = 0;
        this._rows = 0;
        this._columns = 0;
        this._brickArray = [];
        this._bottomRowY = 0;
        this.reset();
    }
    get rows() { return this._rows; }
    get columns() { return this._columns; }
    get brickArray() { return this._brickArray; }
    get bottomRowY() { return this._bottomRowY; }
    reset() {
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
    draw() {
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._columns; j++) {
                const brick = this._brickArray[i][j];
                brick.draw();
            }
        }
    }
    update() {
    }
}
//# sourceMappingURL=bricks.js.map