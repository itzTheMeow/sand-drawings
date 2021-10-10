import Game from "./Game";
import { MaterialTypes } from "./Materials";
import Vec2 from "./Vec2";
import pointAlongLine from "./util/pointAlongLine";

export default class Pen {
  public size = 5;
  public material: MaterialTypes = MaterialTypes.sand;

  public isDrawing = false;
  public lastMousePos?: Vec2;
  public mousePos: Vec2 = new Vec2(0, 0);

  constructor(public game: Game) {
    game.canvas.onmousedown = game.canvas.ontouchstart = this.startDrawing.bind(this);
    game.canvas.onmousemove = game.canvas.ontouchmove = this.drawAt.bind(this);
    game.canvas.onmouseup = game.canvas.ontouchend = this.stopDrawing.bind(this);
  }

  public startDrawing(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    this.drawAt(e);
  }
  public drawAt(e: MouseEvent | TouchEvent) {
    if (window.TouchEvent && e instanceof TouchEvent) {
      this.mousePos.set(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    } else if (e instanceof MouseEvent) {
      this.mousePos.set(e.offsetX, e.offsetY);
    }
    this.update();
  }
  public stopDrawing() {
    this.isDrawing = false;
    this.lastMousePos = undefined;
  }

  public update() {
    if (this.isDrawing) {
      if (this.lastMousePos) {
        let points: Vec2[] = [];
        let pe = this;
        for (let i = 1; i <= 100; i++) {
          points.push(pointAlongLine(pe.lastMousePos, pe.mousePos, i));
        }
        points = points.map((p) => p.set(Math.round(p.x), Math.round(p.y)));
        points = [...new Set(points)];
        points.forEach((point) => {
          this.draw(point);
        });
      } else {
        this.draw(this.mousePos);
      }
      this.lastMousePos = this.mousePos.duplicate();
    }
  }

  public draw(pos: Vec2) {
    for (let x = pos.x; x < pos.x + this.size; x++) {
      for (let y = pos.y; y < pos.y + this.size; y++) {
        (this.game.pixels[Math.round(x - this.size / 2)] || {})[Math.round(y - this.size / 2)] =
          this.material;
      }
    }
  }
}
