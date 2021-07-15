import _ from "./util/_"

let GameCanvas = _("canvas");
let ctx = GameCanvas.getContext("2d");

let canvasSize = {
  w: 0,
  h: 0
}
function getSize() {
  return canvasSize;
}
function updateSizing() {
  canvasSize.w = GameCanvas.width = window.innerWidth;
  canvasSize.h = GameCanvas.height = window.innerHeight;
}
updateSizing();

export { GameCanvas, ctx, getSize };