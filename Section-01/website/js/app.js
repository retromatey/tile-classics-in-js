import Game from "./game.js";
window.onload = () => {
    const canvas = document.getElementById('GameCanvas');
    const context = canvas.getContext('2d');
    const game = new Game(canvas, context);
    game.run();
};
//# sourceMappingURL=app.js.map