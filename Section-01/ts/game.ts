import Ball from "./ball.js";
import Base from "./base.js";
import Paddle from "./paddle.js";
import Bricks from "./bricks.js";

export default class Game extends Base {
    private _lastTime: number;
    private _timer: number = 0;
    private readonly _fps: number = 60;
    private readonly _interval: number = 1000/this._fps;
    
    private _ball: Ball;
    private _paddle: Paddle;
    private _bricks: Bricks;
    
    private _mouseX: number = 0;
    private _mouseY: number = 0;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this._lastTime = 0;
        this._ball = new Ball(this.canvas, this.context);
        this._paddle = new Paddle(this.canvas, this.context);
        this._bricks = new Bricks(this.canvas, this.context);
        this.initEventListeners();
    }
    
    private initEventListeners() {
        this.canvas.addEventListener('mousemove', event => {
           const rect = this.canvas.getBoundingClientRect(); 
           const root = document.documentElement;

           this._mouseX = event.clientX - rect.left - root.scrollLeft;
           this._mouseY = event.clientY - rect.top - root.scrollTop;
        });

        window.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.altKey && event.key === 'd') {
                Base.debugEnabled = !Base.debugEnabled;
            }
            if (event.ctrlKey && event.altKey && event.key === 'p') {
                Base.pause = !Base.pause;
            }
            if (event.ctrlKey && event.altKey && event.key === 'ArrowRight') {
                Base.stepForward = true;
            }
            if (event.ctrlKey && event.altKey && event.key === 'ArrowLeft') {
                Base.stepBackward = true;
            }
        });
    }

    private update(deltaTime: number) {

        if (!Base.pause) {

            if (this._timer > this._interval) {
                this._timer = 0;

                this._ball.update(this._paddle, this._bricks);
                this._paddle.update(this._mouseX);
                this._bricks.update();

                if (this._ball.canvasBottomCollision()) {
                    this._ball.resetPosition();
                }

            } else {
                this._timer += deltaTime;
            }
        }
        
        this.updateDebugStepForward(() => {
            this._ball.update(this._paddle, this._bricks);
            this._bricks.update();

            if (this._ball.canvasBottomCollision()) {
                this._ball.resetPosition();
            }            
        }, () => {
            this._paddle.update(this._mouseX);
        });
    }

    private draw() {
        this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black');
        this._ball.draw();
        this._paddle.draw();
        this._bricks.draw();
        
        this.drawDebug(() => {
            this.drawMousePosition();
        });
    }
    
    private drawMousePosition() {
        this.colorText(this._mouseX, this._mouseY, 'yellow', `${this._mouseX.toFixed(0)},${this._mouseY.toFixed(0)}`);
    }

    public run(timestamp: number = 0) {
        const deltaTime = timestamp - this._lastTime;
        this._lastTime = timestamp;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.update(deltaTime);
        this.draw();
        requestAnimationFrame(t => this.run(t));
    }
}