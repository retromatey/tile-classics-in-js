﻿export default class Base {
    protected get canvas(): HTMLCanvasElement { return this._canvas; }
    protected get context(): CanvasRenderingContext2D { return this._context; }
    protected get debugEnabled(): boolean { return this._debugEnabled; }
    protected set debugEnabled(value: boolean) { this._debugEnabled = value; }

    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;
    
    private _debugEnabled: boolean = false;
    
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this._canvas = canvas;
        this._context = context;
    }
    
    protected colorRect(topLeftX: number, topLeftY: number, rectWidth: number, rectHeight: number, fillColor: string) {
        this.context.fillStyle = fillColor;
        this.context.fillRect(topLeftX, topLeftY, rectWidth, rectHeight);
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
}