function Pen(game) {
  this.size = 5;

  this.isDrawing = false;
  this.mousePos = { x: 0, y: 0 };
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
  game.canvas.onmousemove = function (e) {
    this.mousePos = {
      x: e.offsetX,
      y: e.offsetY,
    };
  };

  this.update = function () {
    if (this.isDrawing) game.pixels[`${this.mousePos.x},${this.mousePos.y}`] = 1;
  };
}

export default Pen;
