class DebugUtil {
    private _debugEnabled: boolean = false;
    private _pause: boolean = false;
    private _stepForward: boolean = false;
    private _stepBackward: boolean = false;
    
    public get debugEnabled() { return this._debugEnabled; }
    public get pause(): boolean { return this._pause; }
    
    constructor() {
        this.initKeyboardEvents();
    }

    private initKeyboardEvents() {
        window.addEventListener('keydown', (event: KeyboardEvent) => {

            if (event.ctrlKey && event.altKey && event.key === 'd') {
                this._debugEnabled = !this.debugEnabled;
            }
            
            if (event.ctrlKey && event.altKey && event.key === 'p') {
                this._pause = !this._pause;
            }

            if (event.ctrlKey && event.altKey && event.key === 'ArrowRight') {
                this._stepForward = true;
            }

            if (event.ctrlKey && event.altKey && event.key === 'ArrowLeft') {
                this._stepBackward = true;
            }
        });
    }    
    
    public logDebug(className: string, message: string) {
        
        if (this.debugEnabled) {
            console.log(`**TIMESTAMP** - ${className} - ${message}`);
        }
    }
    
    public updateDebug(callback: (forward: boolean) => void) {
        
        if (this.debugEnabled && this.pause && this._stepForward) {
            callback(true);
            this._stepForward = false;
            
        } else if (this.debugEnabled && this.pause && this._stepBackward) {
            callback(false);
            this._stepBackward = false;
        }
    }
    
    public drawDebug(callback: () => void) {
        
        if (this.debugEnabled) {
            callback();
        }
    }
}

class DrawingUtil {
    private readonly context: CanvasRenderingContext2D;
    
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    colorRect(x: number, y: number, width: number, height: number, color: string) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
    
    colorArc(centerX: number, centerY: number, radius: number, color: string) {
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        this.context.fill();
    }
}

class MouseController {
    private _debugUtil: DebugUtil;
    private _drawingUtil: DrawingUtil;
    private _rootHTMLElement: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _playerPaddle: PlayerPaddle;
    private _computerPaddle: ComputerPaddle;

    constructor(debugUtil: DebugUtil, drawingUtil: DrawingUtil, canvas: HTMLCanvasElement, playerPaddle: PlayerPaddle, computerPaddle: ComputerPaddle) {
        this._debugUtil = debugUtil;
        this._drawingUtil = drawingUtil;
        this._rootHTMLElement = document.documentElement;
        this._canvas = canvas;
        this.initMouseListener();
        this._playerPaddle = playerPaddle;
        this._computerPaddle = computerPaddle;
    }
    
    initMouseListener() {
        window.addEventListener('mousemove', (event: MouseEvent) => {
            let domRect = this._canvas.getBoundingClientRect();
            let mouseX = event.clientX - domRect.left - this._rootHTMLElement.scrollLeft;
            let mouseY = event.clientY - domRect.top - this._rootHTMLElement.scrollTop;
            this._playerPaddle.setPosition(mouseY, this._canvas.height);
            // this._computerPaddle.setPosition(mouseY, this._canvas.height);

            this._debugUtil.logDebug('MouseController', `mouseX: ${mouseX}`);
            this._debugUtil.logDebug('MouseController', `mouseY: ${mouseY}`);
        });
    }
}

class PlayerPaddle {
    private _debugUtil: DebugUtil;
    private _drawingUtil: DrawingUtil;
    private readonly _leftX: number = 0;
    private _leftY: number = 0;
    private _width: number = 10;
    private _height: number = 100;

    public get rightEdge() {
        return this._leftX + this._width;
    }

    constructor(debugUtil: DebugUtil, drawingUtil: DrawingUtil, canvasWidth: number, canvasHeight: number) {
        this._debugUtil = debugUtil;
        this._drawingUtil = drawingUtil;
        this._leftX = 0;
        this._leftY = (canvasHeight * 0.5) - (this._height * 0.5);
    }

    public draw(context: CanvasRenderingContext2D) {
        this._drawingUtil.colorRect(this._leftX, this._leftY, this._width, this._height, 'white');
    }

    public update(canvasWidth: number, canvasHeight: number) {

    }

    public setPosition(mouseY: number, canvasHeight: number) {

        if (mouseY > (this._height * 0.5) && mouseY < (canvasHeight - this._height * 0.5)) {
            this._leftY = mouseY - (this._height * 0.5);

        } else if (mouseY < (this._height * 0.5)) {
            this._leftY = 0;

        } else if (mouseY > (canvasHeight - this._height * 0.5)) {
            this._leftY = canvasHeight - this._height;
        }
    }

    public lowerPaddleCollision(targetLeftEdge: number, targetY: number): boolean {
        const paddleRightEdge = this._leftX + this._width;
        const bottomEdge = this._leftY + this._height;
        const topEdge = bottomEdge - 15;

        return targetLeftEdge < paddleRightEdge && (targetY > topEdge && targetY < bottomEdge);
    }

    public upperPaddleCollision(targetLeftEdge: number, targetY: number): boolean {
        const paddleRightEdge = this._leftX + this._width;
        const topEdge = this._leftY;
        const bottomEdge = topEdge + 15;

        return targetLeftEdge < paddleRightEdge && (targetY > topEdge && targetY < bottomEdge);
    }

    public paddleCollision(targetLeftEdge: number, targetY: number): boolean {
        const paddleRightEdge = this._leftX + this._width;
        const topEdge = this._leftY;
        const bottomEdge = this._leftY + this._height;

        return targetLeftEdge < paddleRightEdge && (targetY > topEdge && targetY < bottomEdge);
    }

    public getSpin(ballLeftX: number, ballY: number, ballSpeedY: number): number {
        const paddleTopY = this._leftY;
        const paddleBottomY = this._leftY + this._height;

        const paddleCenter = this._height * 0.5;
        const hitY = ballY - (paddleTopY + paddleCenter);
        // const spin = Math.abs(hitY / (paddleCenter/3));
        // const spin = hitY / (paddleCenter/3);      
        // return spin;

        const spin = hitY / (paddleCenter/3);  
        
        if (ballSpeedY > 0 && spin < 0) {
            return spin * -1;
        }
        
        if (ballSpeedY < 0 && spin > 0) {
            return spin * -1;
        }
        
        return Math.abs(spin);
    }
}

class ComputerPaddle {
    private _debugUtil: DebugUtil;
    private _drawingUtil: DrawingUtil;
    private readonly _rightX: number = 0;
    private _rightY: number = 0;
    private _width: number = 10;
    private _height: number = 100;
    private _speedY: number = 20;

    public get leftEdge() {
        return this._rightX;
    }

    constructor(debugUtil: DebugUtil, drawingUtil: DrawingUtil, canvasWidth: number, canvasHeight: number) {
        this._debugUtil = debugUtil;
        this._drawingUtil = drawingUtil;
        this._rightX = canvasWidth - this._width;
        this._rightY = (canvasHeight * 0.5) - (this._height * 0.5);
    }

    public draw(context: CanvasRenderingContext2D) {
        this._drawingUtil.colorRect(this._rightX, this._rightY, this._width, this._height, 'white');
    }

    public update(canvasWidth: number, canvasHeight: number) {
    }
    
    public resetPosition(ballY: number, ballSpeedY: number, canvasHeight: number) {
        this._rightY = (canvasHeight * 0.5) - (this._height * 0.5);
        
        this.setPosition(ballY, ballSpeedY, canvasHeight);
    }

    public setPosition(ballY: number, ballSpeedY: number, canvasHeight: number) {
        const centerY = this._rightY + this._height * 0.5;

        const speedYPercentage = Math.random() * (0.90 - 0.75) + 0.75;
        
        if (ballY > centerY + 40) {
            this._speedY = 10;
            // this._rightY += this._speedY;
            this._rightY += ballSpeedY * speedYPercentage;

        } else if (ballY < centerY - 40) {
            this._speedY = 10 * -1;
            // this._rightY += this._speedY;
            this._rightY += ballSpeedY * speedYPercentage;

        } else {
            // this._rightY += this._speedY;
            this._rightY += ballSpeedY * speedYPercentage;
        }
    }

    public lowerPaddleCollision(targetRightEdge: number, targetY: number): boolean {
        const bottomEdge = this._rightY + this._height;
        const topEdge = bottomEdge - 15;

        return targetRightEdge > this.leftEdge && (targetY > topEdge && targetY < bottomEdge);
    }

    public upperPaddleCollision(targetRightEdge: number, targetY: number): boolean {
        const topEdge = this._rightY;
        const bottomEdge = topEdge + 15;

        return targetRightEdge > this.leftEdge && (targetY > topEdge && targetY < bottomEdge);
    }

    public paddleCollision(targetRightEdge: number, targetY: number): boolean {
        const topEdge = this._rightY;
        const bottomEdge = this._rightY + this._height;

        return targetRightEdge > this.leftEdge && (targetY > topEdge && targetY < bottomEdge);
    }

    public getSpin(ballRightX: number, ballY: number): number {        
        const paddleTopY = this._rightY;
        const paddleBottomY = this._rightY + this._height;

        const paddleCenter = this._height * 0.5;
        const hitY = ballY - (paddleTopY + paddleCenter);
        const spin = Math.abs(hitY / (paddleCenter/3));
        return spin;
    }
}

class Ball {
    private debugUtil: DebugUtil;
    private drawingUtil: DrawingUtil;
    private centerX: number = 0;
    private centerY: number = 0;
    private readonly radius: number = 0;
    private speedX: number = 0;
    private _speedY: number = 0;
    private readonly canvasWidth: number = 0;
    private readonly canvasHeight: number = 0;
    private spin: number = 1;
    
    public get leftEdge() {
        return this.centerX - this.radius;
    }

    public get rightEdge() {
        return this.centerX + this.radius;
    }
    
    public get y() {
        return this.centerY;
    }
    
    public get speedY() {
        return this._speedY;
    }
    
    constructor(debugUtil: DebugUtil, drawingUtil: DrawingUtil, canvasWidth: number, canvasHeight: number) {
        this.debugUtil = debugUtil;
        this.drawingUtil = drawingUtil;
        this.radius = 15;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.resetPosition()
    }
    
    draw(context: CanvasRenderingContext2D) {
        this.drawingUtil.colorArc(this.centerX, this.centerY, this.radius, 'white');

        this.debugUtil.drawDebug(() => {
            const boundX = this.centerX - this.radius;
            const boundY = this.centerY - this.radius;
            const length = this.radius * 2;
            const boundingColor = 'red';
            
            // bounding box
            context.strokeStyle = boundingColor;
            context.lineWidth = 1;
            context.strokeRect(boundX, boundY, length, length);
            
            // x,y coordinate
            context.fillStyle = boundingColor;
            context.fillRect(this.centerX, this.centerY, 1, 1);
        });
    }
    
    update() {
        this.centerX += this.speedX;
        this.centerY += this._speedY;
        
        const topEdge = this.centerY - this.radius;
        const bottomEdge = this.centerY + this.radius;
        
        if (bottomEdge > this.canvasHeight) {
            this.centerY = this.canvasHeight - this.radius;
            this._speedY = -10 * this.spin;

        } else if (topEdge < 0) {
            this.centerY = this.radius;
            this._speedY = 10 * this.spin;
        }

        this.debugUtil.updateDebug((forward) => {
            this.debugUtil.logDebug('Ball', `Center X is ${this.centerX}`);
            this.debugUtil.logDebug('Ball', `Center Y is ${this.centerY}`);
            this.debugUtil.logDebug('Ball', `speedX is ${this.speedX}`);
            this.debugUtil.logDebug('Ball', `speedY is ${this._speedY}`);
            this.debugUtil.logDebug('Ball', `Next X is ${this.centerX + this.speedX}`);
            this.debugUtil.logDebug('Ball', `Next Y is ${this.centerY + this._speedY}`);
            
            if (!forward) {
                this.centerX += -(this.speedX * 2);
                this.centerY += -(this._speedY * 2);
            }
        });
    }

    resetPosition(reverseX: boolean = false) {
        this.centerX = this.canvasWidth * 0.5;
        this.centerY = this.canvasHeight * 0.5;
        this.speedX = 10;
        this._speedY = 10;
        this.spin = 1;
        
        if (reverseX) {
            this.speedX *= -1;
        }
    }

    bounceUpperRight(newX: number) {
        this.centerX = newX + this.radius;
        this.speedX *= -1;
        this.spin = this._speedY < 0 ? 2.5 : 1;
        this._speedY *= this.spin;
    }

    bounceLowerRight(newX: number) {
        this.centerX = newX + this.radius;
        this.speedX *= -1;
        this.spin = this._speedY > 0 ? 2.5 : 1;
        this._speedY *= this.spin;
    }

    bounceRight(newX: number) {
        this.centerX = newX + this.radius;
        this.speedX *= -1;
    }

    bounceUpperLeft(newX: number) {
        this.centerX = newX - this.radius;
        this.speedX *= -1;
        this.spin = this._speedY < 0 ? 2.5 : 1;
        this._speedY *= this.spin;
    }

    bounceLowerLeft(newX: number) {
        this.centerX = newX - this.radius;
        this.speedX *= -1;
        this.spin = this._speedY > 0 ? 2.5 : 1;
        this._speedY *= this.spin;
    }

    bounceLeft(newX: number) {
        this.centerX = newX - this.radius;
        this.speedX *= -1;
    }
    
    leftWallCollision(): boolean {
        const leftEdge = this.centerX - this.radius;
        return leftEdge < 0;
    }

    rightWallCollision(): boolean {
        const rightEdge = this.centerX + this.radius;
        return rightEdge > this.canvasWidth;
    }

    bounceLeft2(newX: number, ballSpin: number) {
        this.centerX = newX - this.radius;
        this.speedX *= -1;
        this._speedY *= ballSpin;
    }

    bounceRight2(newX: number, ballSpin: number) {
        this.centerX = newX + this.radius;
        this.speedX *= -1;
        this._speedY *= ballSpin;
    }
}

class Game {
    private debugUtil: DebugUtil;
    private drawingUtil: DrawingUtil;
    private canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private ball: Ball;
    private playerPaddle: PlayerPaddle;
    private computerPaddle: ComputerPaddle;
    private mouseController: MouseController;

    private lastTime: number = 0;
    private timer: number = 0;
    private readonly fps: number = 60;
    private readonly interval: number = 1000/this.fps;
    
    constructor(debugUtil: DebugUtil, drawingUtil: DrawingUtil, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.debugUtil = debugUtil;
        this.drawingUtil = drawingUtil;
        this.canvas = canvas;      
        this.context = context;
        this.ball = new Ball(debugUtil, drawingUtil, canvas.width, canvas.height);
        this.playerPaddle = new PlayerPaddle(debugUtil, drawingUtil, canvas.width, canvas.height);
        this.computerPaddle = new ComputerPaddle(debugUtil, drawingUtil, canvas.width, canvas.height);
        this.mouseController = new MouseController(debugUtil, drawingUtil, canvas, this.playerPaddle, this.computerPaddle);
    }
    
    private drawBackground() {
        this.drawingUtil.colorRect(0, 0, this.canvas.width, this.canvas.height, 'black');
    }

    private draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.ball.draw(this.context);
        this.playerPaddle.draw(this.context);
        this.computerPaddle.draw(this.context);
    }
    
    private update(deltaTime: number) {
        
        if (this.timer > this.interval) {
            this.timer = 0;
            
            if (!this.debugUtil.pause) {
                this.ball.update();
                this.playerPaddle.update(this.canvas.width, this.canvas.height);
                this.computerPaddle.setPosition(this.ball.y, this.ball.speedY, this.canvas.height);
                
                if (this.playerPaddle.paddleCollision(this.ball.leftEdge, this.ball.y)) {
                    const ballSpin = this.playerPaddle.getSpin(this.ball.leftEdge, this.ball.y, this.ball.speedY);
                    this.ball.bounceRight2(this.playerPaddle.rightEdge, ballSpin);
                }

                if (this.computerPaddle.paddleCollision(this.ball.rightEdge, this.ball.y)) {
                    const ballSpin = this.computerPaddle.getSpin(this.ball.rightEdge, this.ball.y);
                    this.ball.bounceLeft2(this.computerPaddle.leftEdge, ballSpin);
                    
                }
                // if (this.playerPaddle.paddleCollision(this.ball.leftEdge, this.ball.y)) {
                //    
                //     if (this.playerPaddle.upperPaddleCollision(this.ball.leftEdge, this.ball.y)) {
                //         this.ball.bounceUpperRight(this.playerPaddle.rightEdge);
                //        
                //     } else if (this.playerPaddle.lowerPaddleCollision(this.ball.leftEdge, this.ball.y)) {
                //         this.ball.bounceLowerRight(this.playerPaddle.rightEdge);
                //        
                //     } else {
                //         this.ball.bounceRight(this.playerPaddle.rightEdge);
                //     }
                // }
                //
                // if (this.computerPaddle.paddleCollision(this.ball.rightEdge, this.ball.y)) {
                //
                //     if (this.computerPaddle.upperPaddleCollision(this.ball.rightEdge, this.ball.y)) {
                //         this.ball.bounceUpperLeft(this.computerPaddle.leftEdge);
                //
                //     } else if (this.computerPaddle.lowerPaddleCollision(this.ball.rightEdge, this.ball.y)) {
                //         this.ball.bounceLowerLeft(this.computerPaddle.leftEdge);
                //
                //     } else {
                //         this.ball.bounceLeft(this.computerPaddle.leftEdge);
                //     }
                // }
                
                if (this.ball.leftWallCollision()) {
                    this.ball.resetPosition();
                    this.computerPaddle.resetPosition(this.ball.y, this.ball.speedY, this.canvas.height);
                }
                
                if (this.ball.rightWallCollision()) {
                    this.ball.resetPosition(true);
                    this.computerPaddle.resetPosition(this.ball.y, this.ball.speedY, this.canvas.height);
                    // this.ball.bounceLeft(this.canvas.width - 20);
                }
                
            } else {
                this.debugUtil.updateDebug(() => {
                    this.ball.update();
                    this.playerPaddle.update(this.canvas.width, this.canvas.height);
                });
            }            
            
        } else {
            this.timer += deltaTime;
        }
    }
    
    private run(timeStamp: number = 0) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        this.update(deltaTime);
        requestAnimationFrame(t => this.run(t));
    }

    public startGame() {
        this.run();
    }
}

window.onload = () => {
    const canvas: HTMLCanvasElement = document.getElementById('GameCanvas') as HTMLCanvasElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!;
    
    const debugUtil = new DebugUtil();
    const drawingUtil = new DrawingUtil(context);
    const game = new Game(debugUtil, drawingUtil, canvas, context);
    game.startGame();
};

