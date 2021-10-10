import Renderer from "./Renderer";
import Pen from "./Pen";
import _ from "./util/_";
import { MaterialTypes } from "./Materials";
import Physics from "./Physics";

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

    this.canvas.width = window.innerWidth + 2;
    this.canvas.height = window.innerHeight;

    this.fillPixels(MaterialTypes.air);

    this.pen = new Pen(this);
    this.renderer = new Renderer(this);
    this.phys = new Physics(this);

    this.renderer.startRender();
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

  public fillPixels(type: MaterialTypes) {
    let posX = 0;
    while (posX < this.canvas.width) {
      this.pixels[posX] = new Array(this.canvas.height).fill(type);
      posX++;
    }
  }

  public ticker = setInterval(this.tick.bind(this), 1);
  public tick() {
    this.phys.update();
    this.pen.update();
  }
}
