import Game from "./Game";
import { getMaterial, MaterialTypes } from "./Materials";
import rand from "./util/rand";
import Vec2 from "./Vec2";

export default class Physics {
  constructor(public game: Game) {}

  public update() {
    let x = this.game.canvas.width;
    let y = 0;
    while (x > 0) {
      y = 0;
      while (y < this.game.canvas.height) {
        let pos = new Vec2(x, y);
        //@ts-ignore
        let mat = this.game.getPixel(...pos.toArray());
        let materialProps = getMaterial(mat);

        if (materialProps.fallSpeed) {
          if (y < this.game.canvas.height - 1 && !this.game.getPixel(pos.x, pos.y + 1)) {
            let t = this;
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

        y++;
      }
      x--;
    }
  }
}
