export default class Base {
    protected get canvas(): HTMLCanvasElement { return this._canvas; }
    protected get context(): CanvasRenderingContext2D { return this._context; }
    
    protected static get debugEnabled(): boolean { return this._debugEnabled; }
    protected static set debugEnabled(value: boolean) { this._debugEnabled = value; }

    protected static get pause(): boolean { return this._pause; }
    protected static set pause(value: boolean) { this._pause = value; }

    protected static get stepForward(): boolean { return this._stepForward; }
    protected static set stepForward(value: boolean) { this._stepForward = value; }

    protected static get stepBackward(): boolean { return this._stepBackward; }
    protected static set stepBackward(value: boolean) { this._stepBackward = value; }

    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;
    
    private static _debugEnabled: boolean = false;
    private static _pause: boolean = false;
    private static _stepForward: boolean = false;
    private static _stepBackward: boolean = false;
    
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this._canvas = canvas;
        this._context = context;
    }

    protected colorRect(topLeftX: number, topLeftY: number, rectWidth: number, rectHeight: number, fillColor: string) {
        this.context.fillStyle = fillColor;
        this.context.fillRect(topLeftX, topLeftY, rectWidth, rectHeight);
    }

    protected strokeRect(topLeftX: number, topLeftY: number, rectWidth: number, rectHeight: number, strokeColor: string, lineWidth: number) {
        this.context.strokeStyle = strokeColor;
        this.context.lineWidth = lineWidth;
        this.context.strokeRect(topLeftX, topLeftY, rectWidth, rectHeight);
    }

    protected colorCircle(centerX: number, centerY: number, radius: number, fillColor: string) {
        this.context.fillStyle = fillColor;
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        this.context.fill();
    }
    
    protected colorText(x: number, y: number, fillColor: string, text: string) {
        this.context.fillStyle = fillColor;
        this.context.fillText(text, x, y);
    }

    protected logDebug(className: string, message: string) {
        if (Base.debugEnabled) {
            console.log(`**TIMESTAMP** - ${className} - ${message}`);
        }
    }

    protected updateDebugStepForward(step: () => void, alwaysRun: () => void) {

        if (Base.debugEnabled && Base.pause && Base.stepForward) {
            step();
            Base.stepForward = false;
        }
        
        alwaysRun();
    }

    protected updateDebugStepBackward(callback: () => void) {

        if (Base.debugEnabled && Base.pause && Base.stepBackward) {
            callback();
            Base.stepBackward = false;
        }
    }
    
    protected drawDebug(callback: () => void) {
        
        if (Base.debugEnabled) {
            callback();
        }
    }
}