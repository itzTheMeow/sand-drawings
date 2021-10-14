import Game from "./Game";
import { getMaterial, MaterialTypes } from "./Materials";
import rand from "./util/rand";
import Vec2 from "./Vec2";

export default class Physics {
  constructor(public game: Game) {}

  public update() {
    let t = this;
    this.game.pixels.forEach((p, x) => {
      let lastIndex = 0;
      let pa = new Array(p.length).fill(0).map((_, i) => p[p.length - 1 - i]);
      pa.filter((a) => a != MaterialTypes.air).forEach((mat, yo) => {
        yo = pa.indexOf(mat, lastIndex);
        lastIndex = yo + 1;
        let y = t.game.canvas.height - (yo + 1);
        let pos = new Vec2(x, y);

        let materialProps = getMaterial(mat);

        if (materialProps.fallSpeed) {
          if (y < t.game.canvas.height - 1 && !t.game.getPixel(pos.x, pos.y + 1)) {
            let newPos = pos.duplicate().add(0, materialProps.fallSpeed);
            let posDet = rand(1, 12);
            if (posDet < 2) {
              newPos.sub(1, 0);
            } else if (posDet > 11) {
              newPos.add(1, 0);
            }
            if (t.game.getPixel(newPos.x, newPos.y)) {
              return;
            }
            t.game.setPixel(pos.x, pos.y, MaterialTypes.air);
            t.game.setPixel(newPos.x, newPos.y, mat);
          }
        }
      });
    });
  }
}
