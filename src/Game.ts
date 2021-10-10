import Renderer from "./Renderer";
import Pen from "./Pen";
import _ from "./util/_";
import { MaterialTypes } from "./Materials";
import Vec2 from "./Vec2";

export default class Game {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public pixels: number[][] = [];

  public pen: Pen;
  public renderer: Renderer;
  constructor() {
    this.canvas = _("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = window.innerWidth + 2;
    this.canvas.height = window.innerHeight;

    this.fillPixels(MaterialTypes.air);

    this.pen = new Pen(this);
    this.renderer = new Renderer(this);

    this.renderer.startRender();
  }

  public getPixel(pos: Vec2) {
    return this.pixels[pos.x][pos.y];
  }
  public setPixel(pos: Vec2, type: MaterialTypes) {
    this.pixels[pos.x][pos.y] = type;
  }

  public fillPixels(type: MaterialTypes) {
    let posX = 0;
    while (posX < this.canvas.width + 10) {
      this.pixels[posX] = new Array(this.canvas.height).fill(type);
      posX++;
    }
  }

  public ticker = setInterval(this.tick.bind(this), 1);
  public tick() {
    this.pen.update();
  }
}
