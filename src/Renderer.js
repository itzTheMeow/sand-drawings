import { getMaterial } from "./Materials";

function Renderer(game) {
  this.renderPixel = function(x, y, type) {
    ctx.fillStyle = getMaterial(type).color;
    ctx.fillRect(x, y, 1, 1);
  }
  
  this.update = function() {
    ctx.fillStyle = config.background;
    ctx.fillRect(0, 0, game.size.w, game.size.h);
    
    Object.keys(game.pixels).forEach(p => {
      let pixel = {
        x: Number(p.split(",")[0]),
        y: Number(p.split(",")[0]),
        mat: game.pixels[p]
      };
      if(pixel.mat != 0) {
        this.renderPixel(pixel.x, pixel.y, pixel.mat);
      }
    })
  }
  this.update();
}
export default Renderer;