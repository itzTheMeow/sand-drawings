import { getMaterial } from "./Materials";
import config from "./config";

function Renderer(game) {
  this.renderPixel = function (x, y, type) {
    game.ctx.fillStyle = getMaterial(type).color;
    game.ctx.fillRect(x, y, 1, 1);
  };

  this.update = function () {
    game.ctx.fillStyle = config.background;
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    Object.keys(game.pixels).forEach((p) => {
      let pixel = {
        x: Number(p.split(",")[0]),
        y: Number(p.split(",")[0]),
        mat: game.pixels[p],
      };
      this.renderPixel(pixel.x, pixel.y, pixel.mat);
    });
    requestAnimationFrame(this.update.bind(this));
  };
  this.startRender = function () {
    requestAnimationFrame(this.update.bind(this));
  };
}
export default Renderer;
