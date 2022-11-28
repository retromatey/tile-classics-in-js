import Game from "./game.js";

window.onload = () => {
    const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const game = new Game(canvas, context);
    game.run();
};