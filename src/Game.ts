import Renderer from "./Renderer";
import Pen from "./Pen";
import _ from "./util/_";
import { MaterialTypes } from "./Materials";
import Physics from "./Physics";
import { initToolbar } from "./Toolbar";

export default class Game {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public pixels: number[][] = [];

  public pen: Pen;
  public renderer: Renderer;
  public phys: Physics;
  constructor() {
    this.canvas = _("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.ctx.imageSmoothingEnabled = false;

    this.canvas.width = window.innerWidth + 2;
    this.canvas.height = window.innerHeight;

    this.fillPixels(MaterialTypes.air);

    this.pen = new Pen(this);
    this.renderer = new Renderer(this);
    this.phys = new Physics(this);

    this.renderer.startRender();

    initToolbar(this);

    let oldSize = [window.innerWidth, window.innerHeight];
    setInterval(
      function () {
        let newSize = [window.innerWidth, window.innerHeight];
        if (oldSize[0] !== newSize[0] || oldSize[1] !== newSize[1]) {
          oldSize = newSize;
          this.resize();
        }
      }.bind(this),
      100
    );
  }

  public resize() {
    this.canvas.width = window.innerWidth + 2;
    this.canvas.height = window.innerHeight;
    this.fillPixels(MaterialTypes.air);
    this.renderer.initData();
  }

  get pixelAmount() {
    return this.pixels.map((p) => p.filter((p) => p != 0).length).reduce((a, b) => a + b);
  }
  public getPixel(x: number, y: number) {
    try {
      return this.pixels[x][y];
    } catch (e) {}
  }
  public setPixel(x: number, y: number, type: MaterialTypes) {
    try {
      this.pixels[x][y] = type;
    } catch (e) {}
  }

  public fillPixels(type: MaterialTypes, force = false) {
    let posX = 0;
    this.pixels = this.pixels.slice(0, this.canvas.width);
    while (posX < this.canvas.width) {
      let arr = new Array(this.canvas.height).fill(type);
      let px = this.pixels[posX] || [];
      if (!force && px.length) px.map((p, i) => (arr[i] = p));
      this.pixels[posX] = arr.slice(0, this.canvas.height);
      posX++;
    }
  }

  public ticker = setInterval(this.tick.bind(this), 1);
  public tick() {
    this.phys.update();
    this.pen.update();
  }
}
