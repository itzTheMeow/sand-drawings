import { getMaterial, MaterialTypes } from "./Materials";
import { hexToRgb } from "./util/HEX2RGB";
import Game from "./Game";

let renderCache = {};

export default class Renderer {
  public imgData: ImageData;
  public pixData: Uint8ClampedArray;
  public tempCan: HTMLCanvasElement;
  public tempCtx: CanvasRenderingContext2D;

  constructor(public game: Game) {
    this.tempCan = document.createElement("canvas");
    this.tempCan.width = game.canvas.width;
    this.tempCan.height = game.canvas.height;
    this.tempCtx = this.tempCan.getContext("2d");

    this.imgData = this.tempCtx.createImageData(game.canvas.width, game.canvas.height);
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
    this.tempCtx.putImageData(this.imgData, 0, 0);
    this.game.ctx.drawImage(this.tempCan, 0, 0);
  }

  public update() {
    let t = this;
    setTimeout(function () {
      t.game.pixels.forEach((p, x) => {
        p.forEach((pp, y) => {
          t.renderPixel(x, y + 1, t.game.getPixel(x, y));
        });
      });
      t.finishFrame();
      requestAnimationFrame(t.update.bind(t));
    }, 0);
  }
  public startRender() {
    requestAnimationFrame(this.update.bind(this));
  }
}
