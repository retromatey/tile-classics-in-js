import Base from "./base.js";
import Brick from "./brick.js";
export default class Bricks extends Base {
    constructor(canvas, context) {
        super(canvas, context);
        this._distanceFromTop = 0;
        this._brickWidth = 0;
        this._brickHeight = 0;
        this._brickRows = 0;
        this._brickColumns = 0;
        this._brickArray = [];
        this.reset();
    }
    get brickArray() { return this._brickArray; }
    reset() {
        this._distanceFromTop = 50;
        this._brickRows = 5;
        this._brickColumns = 10;
        this._brickHeight = 20;
        this._brickWidth = this.canvas.width / this._brickColumns;
        this._brickArray = [];
        for (let i = 0; i < this._brickRows; i++) {
            this._brickArray[i] = [];
            for (let j = 0; j < this._brickColumns; j++) {
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
        for (let i = 0; i < this._brickRows; i++) {
            for (let j = 0; j < this._brickColumns; j++) {
                const brick = this._brickArray[i][j];
                brick.draw();
            }
        }
    }
    update() {
    }
}
//# sourceMappingURL=bricks.js.map