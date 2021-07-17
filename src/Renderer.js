import { getMaterial } from "./Materials";
import config from "./config";
import { hexToRgb } from "./util/HEX2RGB";

function Renderer(game) {
  this.imgData = game.ctx.createImageData(game.canvas.width, game.canvas.height);
  this.pixData = this.imgData.data;

  this.renderPixel = function (x, y, type) {
    let color = hexToRgb(getMaterial(type).color);
    let i = x * 4 + y * (game.canvas.height * 4);

    this.pixData[i] = color[0]; // red
    this.pixData[i + 1] = color[1]; // green
    this.pixData[i + 2] = color[2]; // blue
    this.pixData[i + 3] = 255; // blue
  };
  this.clear = function () {
    for (let i = 0; i < this.imgData.data.length; i++) {
      this.imgData.data[i + 3] = 0;
    }
  };
  this.finishFrame = function () {
    game.ctx.putImageData(this.imgData, 0, 0);
  };

  this.update = function () {
    Object.keys(game.pixels).forEach((p) => {
      let pixel = {
        x: Number(p.split(",")[0]),
        y: Number(p.split(",")[0]),
        mat: game.pixels[p],
      };
      this.renderPixel(pixel.x, pixel.y, pixel.mat);
    });
    this.finishFrame();
    requestAnimationFrame(this.update.bind(this));
  };
  this.startRender = function () {
    requestAnimationFrame(this.update.bind(this));
  };
}
export default Renderer;
