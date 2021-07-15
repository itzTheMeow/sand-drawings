import Renderer from "./Renderer";
import Pen from "./Pen";
import { GameCanvas, ctx, getSize } from "./GameCanvas";

function Game() {
  this.pen = new Pen(this);
  this.renderer = new Renderer(this);
  this.canvas = GameCanvas;
  this.ctx = ctx;
  
  this.size = getSize();
  this.pixels = {};
  let posX = 0;
  let posY = 0;
  while(true) {
    posX++;
    while(true) {
      posY++;
      this.pixels[`${posX},${posY}`] = 0;
      if(posY >= this.size.w) break;
    }
    posY = 0;
    if(posX >= this.size.h) break;
  }
  
  this.tick = function() {
    this.pen.update();
    this.renderer.update();
  }
  this.ticker = setInterval(this.tick.bind(this), 1)
}

export default Game;