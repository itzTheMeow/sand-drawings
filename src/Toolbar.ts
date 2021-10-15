import Game from "./Game";
import { MaterialTypes } from "./Materials";

export function initToolbar(game: Game) {
  let tools = [...document.querySelectorAll("#toolbar img")] as HTMLImageElement[];
  function resetBar(el: number) {
    tools.map((t) => t.classList.remove("selected"));
    tools[el].classList.add("selected");
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

  resetBar(0);
}
