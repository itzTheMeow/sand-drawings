import Game from "./Game";
import { MaterialTypes } from "./Materials";
import Vec2 from "./Vec2";

export default class Pen {
  public size = 5;
  public material: MaterialTypes = MaterialTypes.sand;

  public isDrawing = false;
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
  }

  public update() {
    if (this.isDrawing) {
      for (var x = this.mousePos.x; x < this.mousePos.x + this.size; x++) {
        for (var y = this.mousePos.y; y < this.mousePos.y + this.size; y++) {
          (this.game.pixels[Math.round(x - this.size / 2)] || {})[Math.round(y - this.size / 2)] =
            this.material;
        }
      }
    }
  }
}
