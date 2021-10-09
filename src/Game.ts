import Renderer from "./Renderer";
import Pen from "./Pen";
import _ from "./util/_";
import { MaterialTypes } from "./Materials";

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

  public fillPixels(type: MaterialTypes) {
    let posX = 0;
    let posY = 0;
    while (posX < this.canvas.width + 10) {
      this.pixels[posX] = new Array(this.canvas.height);
      posY = 0;
      while (posY < this.canvas.height + 1) {
        this.pixels[posX][posY] = type;
        posY++;
      }
      posX++;
    }
  }

  public ticker = setInterval(this.tick.bind(this), 1);
  public tick() {
    this.pen.update();
  }
}
