import { Game } from "./Game";

const game = new Game();
game.init().then(() => game.run());
