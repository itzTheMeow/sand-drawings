import Game from "./Game";
import { getMaterial, MaterialTypes } from "./Materials";
import Vec2 from "./Vec2";
import pointAlongLine from "./util/pointAlongLine";
import _ from "./util/_";

export default class Pen {
  public sizes = [1, 5, 10, 25, 50];
  public selsize = 1;
  public material: MaterialTypes = MaterialTypes.sand;
  public selectedMat: MaterialTypes = MaterialTypes.sand;

  public isDrawing = false;
  public lastMousePos?: Vec2;
  public mousePos: Vec2 = new Vec2(0, 0);

  constructor(public game: Game) {
    game.canvas.onmousedown = game.canvas.ontouchstart =
      this.startDrawing.bind(this);
    game.canvas.onmousemove = game.canvas.ontouchmove = this.drawAt.bind(this);
    game.canvas.onmouseup = game.canvas.ontouchend =
      this.stopDrawing.bind(this);
    game.canvas.onmouseleave = function () {
      this.mousePos.set(0, 0);
      this.stopDrawing();
    }.bind(this);
  }

  get size() {
    return this.sizes[this.selsize];
  }

  public startDrawing(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    this.drawAt(e);
    let sound = getMaterial(this.material).sound;
    if (sound) sound.play("draw");
  }
  public drawAt(e: MouseEvent | TouchEvent) {
    if (window.TouchEvent && e instanceof TouchEvent) {
      this.mousePos.set(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
    } else if (e instanceof MouseEvent) {
      this.mousePos.set(e.offsetX, e.offsetY);
    }
    this.update();
  }
  public stopDrawing() {
    this.isDrawing = false;
    this.lastMousePos = undefined;
    let sound = getMaterial(this.material).sound;
    if (sound) sound.stop();
  }

  public penUpdater = setInterval(this.updatePenElement.bind(this), 1);
  public updatePenElement() {
    let penElement = _("pen");
    if (this.mousePos.x && this.mousePos.y) {
      penElement.style.display = "block";
      penElement.style.backgroundColor = getMaterial(this.material).color;
      penElement.style.width = penElement.style.height = this.size + "px";
      penElement.style.left = this.mousePos.x - this.size / 2 + "px";
      penElement.style.top = this.mousePos.y - this.size / 2 + "px";
    } else penElement.style.display = "none";
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
    let t = this;
    new Array(this.size).fill(0).forEach((_, x) => {
      new Array(this.size).fill(0).forEach((_, y) => {
        let pixs = t.game.pixels[Math.round(pos.x + x - t.size / 2)];
        let pix = Math.round(pos.y + y - t.size / 2);
        if (!pixs || pixs[pix] == undefined) return;
        pixs[pix] = t.material;
      });
    });
  }
}
