import { getMaterial, MaterialTypes } from "./Materials";
import config from "./config";
import { hexToRgb } from "./util/HEX2RGB";
import Game from "./Game";

let renderCache = {};

export default class Renderer {
  public imgData: ImageData;
  public pixData: Uint8ClampedArray;

  constructor(public game: Game) {
    this.imgData = game.ctx.createImageData(game.canvas.width, game.canvas.height);
    this.pixData = this.imgData.data;
  }

  public renderPixel(x: number, y: number, type: MaterialTypes) {
    let color = renderCache[type] || (renderCache[type] = hexToRgb(getMaterial(type).color));
    let i = (this.imgData.width * (y - 1) + x) * 4;

    this.pixData[i] = color[0]; // red
    this.pixData[i + 1] = color[1]; // green
    this.pixData[i + 2] = color[2]; // blue
    this.pixData[i + 3] = 255; // alpha
  }
  public finishFrame() {
    this.game.ctx.putImageData(this.imgData, 0, 0);
  }

  public update() {
    let x = 0;
    let y = 0;
    while (x < this.game.canvas.width - 1) {
      y = this.game.canvas.height;
      while (y >= 0) {
        let mat = this.game.pixels[x][y];
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
  }
  public startRender() {
    requestAnimationFrame(this.update.bind(this));
  }
}
