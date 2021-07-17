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
  game.canvas.onmousedown = this.startDrawing.bind(this);
  game.canvas.onmouseup = this.stopDrawing.bind(this);
  game.canvas.ontouchstart = this.startDrawing.bind(this);
  game.canvas.ontouchend = this.stopDrawing.bind(this);

  game.canvas.onmousemove = function (e) {
    this.mousePos = {
      x: e.offsetX,
      y: e.offsetY,
    };
    this.update();
  }.bind(this);
  game.canvas.ontouchmove = function (e) {
    this.mousePos = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    this.update();
  }.bind(this);

  this.update = function () {
    if (this.isDrawing) game.pixels[this.mousePos.x][this.mousePos.y] = 1;
  };
}

export default Pen;
