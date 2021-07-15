import Renderer from "./Renderer";
import { ctx, getSize } from "GameCanvas";

function Game() {
  this.renderer = new Renderer(this);
  this.ctx = ctx;
  this.size = getSize();
  
  this.pixels = {};
  let posX = 0;
  let posY = 0;
  while(true) {
    posX++;
    while(true) {
      posY++;
      this.pixels[`${posX},${posY}`] = 1;
      if(posY >= this.size.w) break;
    }
    posY = 0;
    if(posX >= this.size.h) break;
  }
  
  this.tick = function() {
    this.renderer.update();
  }
  this.ticker = setInterval(this.tick.bind(this), 1)
}

export default Game;