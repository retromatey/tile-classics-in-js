import Ball from "./ball.js";
import Base from "./base.js";
import Paddle from "./paddle.js";
import PaddlePlayer from "./paddlePlayer.js";
import PaddleComputer from "./paddleComputer.js";

export default class Game extends Base {
    private _lastTime: number;
    private _timer: number = 0;
    private readonly _fps: number = 60;
    private readonly _interval: number = 1000/this._fps;

    private _ball: Ball;
    private _paddlePlayer: PaddlePlayer;
    private _paddleComputer: PaddleComputer;
    
    private _playerScore: number = 0;
    private _computerScore: number = 0;
    private _gameOver: boolean = false;
    private _maxScore: number = 5;

    private _mouseY: number = 0;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        super(canvas, context);
        this._lastTime = 0;
        this._ball = new Ball(this.canvas, this.context);
        this._paddlePlayer = new PaddlePlayer(this.canvas, this.context);
        this._paddleComputer = new PaddleComputer(this.canvas, this.context);
        this._paddleComputer.setPosition(this._ball);
        this.initEventListeners();
    }

    private initEventListeners() {
        this.canvas.addEventListener('mousemove', event => {
            const rect = this.canvas.getBoundingClientRect();
            const root = document.documentElement;

            this._mouseY = event.clientY - rect.top - root.scrollTop;
        });
    }

    private update(deltaTime: number) {

        if (this._timer > this._interval) {
            this._timer = 0;

            this._paddlePlayer.update(this._mouseY);
            this._paddleComputer.setPosition(this._ball);            
            this._ball.update(this._paddlePlayer, this._paddleComputer);

            if (this._ball.canvasSideCollision()) {
                const direction = this._ball.canvasSideCollisionDirection();
                
                if (direction > 0) {
                    this._computerScore += 1;
                    
                } else {
                    this._playerScore += 1;
                }
                
                if (this._playerScore === this._maxScore || this._computerScore === this._maxScore) {
                    this._gameOver = true;
                }
                
                this._ball.resetPosition(direction);
                this._paddleComputer.resetPosition();
                this._paddleComputer.setPosition(this._ball);
            }

        } else {
            this._timer += deltaTime;
        }
    }

    private draw() {
        this.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black');
        this.drawField();
        this.drawScore();

        this._paddlePlayer.draw();
        this._paddleComputer.draw();
        
        if (!this._gameOver) {
            this._ball.draw();
            
        } else {
            this.drawGameOver();
        }
    }
    
    private drawGameOver() {
        this.context.fillStyle = 'red';
        this.context.font = '60px sans-serif';
        this.context.fillText('GAME OVER', (this.canvas.width * 0.5) - (185), this.canvas.height * 0.5 - 30);
    }
    
    private drawScore() {
        this.context.fillStyle = 'white';
        this.context.font = '30px sans-serif';
        this.context.fillText(`${this._playerScore}`, this.canvas.width * 0.5 * 0.5, 50);
        this.context.fillText(`${this._computerScore}`, this.canvas.width * 0.5 + (this.canvas.width * 0.5 * 0.5), 50);
    }
    
    private drawField() {
        const height = 25;
        const gap = 5;
        const width = 4;
        let startX = this.canvas.width * 0.5;
        let startY = 0;
        
        for (let i = 0; i < (this.canvas.height + height + gap); i += (height+gap)) {
            this.colorRect(startX - width * 0.5, startY, width, height, 'white');
            startY = i;
        }
    }

    public run(timestamp: number = 0) {
        const deltaTime = timestamp - this._lastTime;
        this._lastTime = timestamp;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        
        if (!this._gameOver) {
            this.update(deltaTime);
        }
        
        requestAnimationFrame(t => this.run(t));
    }
}