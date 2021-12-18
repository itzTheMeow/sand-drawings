import config from "./config";
import Game from "./Game";
import { MaterialTypes } from "./Materials";
import _ from "./util/_";

export function initToolbar(game: Game) {
  let tools = [
    ...document.querySelectorAll("#toolbar img"),
  ] as HTMLImageElement[];
  let sizes: HTMLCanvasElement[] = [];

  game.pen.sizes.forEach((s, i) => {
    let selector = document.createElement("canvas");
    selector.width = selector.height = config.toolSize;
    _("sizes").appendChild(selector);
    sizes.push(selector);

    let selctx = selector.getContext("2d");
    selctx.beginPath();
    selctx.arc(
      config.toolSize / 2,
      config.toolSize / 2,
      Math.max(1, s * config.dotScale),
      0,
      Math.PI * 2
    );
    selctx.closePath();
    selctx.fillStyle = config.dotColor;
    selctx.fill();
  });

  function resetBar(el: number) {
    tools.map((t) => t.classList.remove("selected"));
    tools[el].classList.add("selected");
  }
  function resetSizes(el: number) {
    sizes.map((t) => t.classList.remove("selected"));
    sizes[el].classList.add("selected");
  }

  // Pencil
  tools[0].onclick = function (e) {
    game.pen.material = game.pen.selectedMat;
    resetBar(0);
  };
  // Eraser
  tools[1].onclick = function (e) {
    game.pen.material = MaterialTypes.air;
    resetBar(1);
  };
  // Settings
  tools[2].onclick = function (e) {};

  sizes.forEach((s, i) => {
    s.onclick = function () {
      game.pen.selsize = i;
      resetSizes(i);
    };
  });

  resetBar(0);
  resetSizes(game.pen.selsize);

  window.addEventListener("wheel", (e) => {
    let down = e.deltaY >= 0;
    let sz = down
      ? Math.max(0, game.pen.selsize - 1)
      : Math.min(game.pen.sizes.length - 1, game.pen.selsize + 1);
    game.pen.selsize = sz;
    resetSizes(sz);
  });
}
