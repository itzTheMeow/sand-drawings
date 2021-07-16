function Pen(game) {
  this.size = 5;

  this.isDrawing = false;
  this.startDrawing = function () {
    this.isDrawing = true;
  };
  this.stopDrawing = function () {
    this.isDrawing = false;
  };
  game.canvas.onmousedown = this.startDrawing;
  game.canvas.onmouseup = this.stopDrawing;
  game.canvas.ontouchstart = this.startDrawing;
  game.canvas.ontouchend = this.stopDrawing;

  this.update = function () {
    if (this.isDrawing) game.pixels["10,10"] = 1;
  };
}

export default Pen;
