import "./style.css";
import { Game } from "./game/Game.js";

const container = document.querySelector("#app");

const game = new Game(container);
game.start();
