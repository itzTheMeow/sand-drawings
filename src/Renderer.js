import { getMaterial } from "./Materials";
import config from "./config";
import { hexToRgb } from "./util/HEX2RGB";

let renderCache = {};

function Renderer(game) {
  this.imgData = game.ctx.createImageData(game.canvas.width, game.canvas.height);
  this.pixData = this.imgData.data;

  this.renderPixel = function (x, y, type) {
    let color = renderCache[type] || (renderCache[type] = hexToRgb(getMaterial(type).color));
    let i = (this.imgData.width * (y - 1) + x) * 4;

    this.pixData[i] = color[0]; // red
    this.pixData[i + 1] = color[1]; // green
    this.pixData[i + 2] = color[2]; // blue
    this.pixData[i + 3] = 255; // alpha
  };
  this.finishFrame = function () {
    game.ctx.putImageData(this.imgData, 0, 0);
  };

  this.update = function () {
    let x = 0;
    let y = 0;
    while (x < game.canvas.width - 1) {
      y = game.canvas.height;
      while (y >= 0) {
        let mat = game.pixels[x][y];
        this.renderPixel(x, y, mat);

        /*if (y == 0 || y == game.canvas.height) {
          if (y == 0) this.remove_obj(x, y);
          y--;
          stop();
          continue;
        }*/

        y--;
      }
      x++;
    }
    this.finishFrame();
    requestAnimationFrame(this.update.bind(this));
  };
  this.startRender = function () {
    requestAnimationFrame(this.update.bind(this));
  };
}
export default Renderer;
