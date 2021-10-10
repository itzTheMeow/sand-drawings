import { getMaterial, MaterialTypes } from "./Materials";
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
    let t = this;
    this.game.pixels.forEach((p, x) => {
      p.forEach((pp, y) => {
        t.renderPixel(x, y + 1, t.game.getPixel(x, y));
      });
    });
    this.finishFrame();
    requestAnimationFrame(this.update.bind(this));
  }
  public startRender() {
    requestAnimationFrame(this.update.bind(this));
  }
}
