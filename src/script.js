import config from "./config";
import GameCanvas from "./GameCanvas";

let ctx = GameCanvas.getContext("2d");
ctx.fillColor = config.background;
ctx.fillRect(0, 0, 10, 10)