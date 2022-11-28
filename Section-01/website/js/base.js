export default class Base {
    constructor(canvas, context) {
        this._canvas = canvas;
        this._context = context;
    }
    get canvas() { return this._canvas; }
    get context() { return this._context; }
    colorRect(topLeftX, topLeftY, rectWidth, rectHeight, fillColor) {
        this.context.fillStyle = fillColor;
        this.context.fillRect(topLeftX, topLeftY, rectWidth, rectHeight);
    }
    colorCircle(centerX, centerY, radius, fillColor) {
        this.context.fillStyle = fillColor;
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        this.context.fill();
    }
}
//# sourceMappingURL=base.js.map