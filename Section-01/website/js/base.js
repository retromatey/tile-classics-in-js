export default class Base {
    constructor(canvas, context) {
        this._canvas = canvas;
        this._context = context;
    }
    get canvas() { return this._canvas; }
    get context() { return this._context; }
    static get debugEnabled() { return this._debugEnabled; }
    static set debugEnabled(value) { this._debugEnabled = value; }
    static get pause() { return this._pause; }
    static set pause(value) { this._pause = value; }
    static get stepForward() { return this._stepForward; }
    static set stepForward(value) { this._stepForward = value; }
    static get stepBackward() { return this._stepBackward; }
    static set stepBackward(value) { this._stepBackward = value; }
    colorRect(topLeftX, topLeftY, rectWidth, rectHeight, fillColor) {
        this.context.fillStyle = fillColor;
        this.context.fillRect(topLeftX, topLeftY, rectWidth, rectHeight);
    }
    strokeRect(topLeftX, topLeftY, rectWidth, rectHeight, strokeColor, lineWidth) {
        this.context.strokeStyle = strokeColor;
        this.context.lineWidth = lineWidth;
        this.context.strokeRect(topLeftX, topLeftY, rectWidth, rectHeight);
    }
    colorCircle(centerX, centerY, radius, fillColor) {
        this.context.fillStyle = fillColor;
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        this.context.fill();
    }
    colorText(x, y, fillColor, text) {
        this.context.fillStyle = fillColor;
        this.context.fillText(text, x, y);
    }
    logDebug(className, message) {
        if (Base.debugEnabled) {
            console.log(`**TIMESTAMP** - ${className} - ${message}`);
        }
    }
    updateDebugStepForward(step, alwaysRun) {
        if (Base.debugEnabled && Base.pause && Base.stepForward) {
            step();
            Base.stepForward = false;
        }
        alwaysRun();
    }
    updateDebugStepBackward(callback) {
        if (Base.debugEnabled && Base.pause && Base.stepBackward) {
            callback();
            Base.stepBackward = false;
        }
    }
    drawDebug(callback) {
        if (Base.debugEnabled) {
            callback();
        }
    }
}
Base._debugEnabled = false;
Base._pause = false;
Base._stepForward = false;
Base._stepBackward = false;
//# sourceMappingURL=base.js.map