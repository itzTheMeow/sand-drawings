import Game from "./Game";
import { getMaterial, MaterialTypes } from "./Materials";
import rand from "./util/rand";
import Vec2 from "./Vec2";

export default class Physics {
  constructor(public game: Game) {}

  public update() {
    let t = this;
    this.game.pixels.forEach((p, x) => {
      let pa = [...p].reverse();
      [...p.filter((a) => a != MaterialTypes.air)].reverse().forEach((mat, yo) => {
        yo = pa.indexOf(mat);
        pa[yo] = 0;
        let y = t.game.canvas.height - (yo + 1);
        let pos = new Vec2(x, y);

        let materialProps = getMaterial(mat);

        if (materialProps.fallSpeed) {
          if (y < t.game.canvas.height - 1 && !t.game.getPixel(pos.x, pos.y + 1)) {
            function tryFall(tried: number) {
              let newPos = pos.duplicate().add(0, materialProps.fallSpeed);
              let posDet = rand(1, 12);
              if (posDet < 2) {
                newPos.sub(1, 0);
              } else if (posDet > 11) {
                newPos.add(1, 0);
              }
              if (t.game.getPixel(newPos.x, newPos.y)) {
                if (tried !== 3) tryFall(tried + 1);
                return;
              }
              t.game.setPixel(pos.x, pos.y, MaterialTypes.air);
              t.game.setPixel(newPos.x, newPos.y, mat);
            }
            tryFall(0);
          }
        }
      });
    });
  }
}
