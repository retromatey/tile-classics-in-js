class App {
    public get canvas(): HTMLCanvasElement { return this._canvas; }
    public get context(): CanvasRenderingContext2D { return this._context; }
    
    private _lastTime: number;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;
    private _timer: number = 0;
    private readonly _fps: number = 60;
    private readonly _interval: number = 1000/this._fps;
    
    constructor() {
        this._lastTime = 0;
        this._canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        this._context = this._canvas.getContext('2d') as CanvasRenderingContext2D;
    }
    
    private update(deltaTime: number) {

        if (this._timer > this._interval) {
            this._timer = 0;
            
            // update stuff...
            
        } else {
            this._timer += deltaTime;
        }
    }
    
    private draw() {
        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = 'white';
        this.context.beginPath();
        this.context.arc(100, 100, 10, 0, Math.PI * 2, true);
        this.context.fill();
    }
    
    public run(timestamp: number = 0) {
        const deltaTime = timestamp - this._lastTime;
        this._lastTime = timestamp;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
        this.update(deltaTime);
        requestAnimationFrame(t => this.run(t));
    }
}

window.onload = () => {    
    const app = new App();
    app.run();
};