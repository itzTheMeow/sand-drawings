import { getMaterial, MaterialTypes } from "./Materials";
import { hexToRgb } from "./util/HEX2RGB";
import Game from "./Game";
import config from "./config";

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

  public initFont() {
    this.game.ctx.font = "Pixeloid 16px";
    this.game.ctx.fillStyle = config.foreground;
  }
  private statStart = [2, 4];
  private statPad = 12;
  private statTop: number;
  public addStat(text: string) {
    this.statTop += this.statPad;
    let ctx = this.game.ctx;
    this.initFont();
    ctx.textAlign = "left";
    ctx.fillText(text, this.statStart[1], this.statTop);
  }

  public startedFrame: number;
  public frameLatency: number = 0;
  public fps: number = 0;
  public startFrame() {
    this.statTop = this.statStart[0];
    this.startedFrame = Date.now();
    this.fps++;
    setTimeout(() => this.fps--, 1000);
    this.pixData.fill(0);
    this.game.ctx.fillStyle = config.background;
    this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
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
    let ctx = this.game.ctx;
    this.tempCtx.putImageData(this.imgData, 0, 0);
    ctx.drawImage(this.tempCan, 0, 0);
    this.frameLatency = Date.now() - this.startedFrame;

    this.addStat(`FPS: ${this.fps}`);
    this.addStat(`LAT: ${this.frameLatency}ms`);
    this.addStat(`PXL: ${this.game.pixelAmount.toLocaleString()}`);
    this.addStat(`SIZ: ${this.game.canvas.width}x${this.game.canvas.height}`);
    this.initFont();
    ctx.textAlign = "right";
    if (this.game.canvas.width > 700)
      ctx.fillText("Try a smaller screen resolution!", this.game.canvas.width - 6, 12);
  }

  public update() {
    let t = this;
    setTimeout(function () {
      t.startFrame();
      t.game.pixels.forEach((p, x) => {
        p.forEach((pp, y) => {
          if (p && pp) t.renderPixel(x, y + 1, t.game.getPixel(x, y));
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
