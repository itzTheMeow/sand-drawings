function Pen(game) {
  this.size = 5;

  this.isDrawing = false;
  this.mousePos = { x: 0, y: 0 };
  this.startDrawing = function (e) {
    this.isDrawing = true;
    if (e.touches)
      this.mousePos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    else
      this.mousePos = {
        x: e.offsetX,
        y: e.offsetY,
      };
    this.update();
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
    if (this.isDrawing) {
      for (var x = this.mousePos.x; x < this.mousePos.x + this.size; x++) {
        for (var y = this.mousePos.y; y < this.mousePos.y + this.size; y++) {
          (game.pixels[Math.round(x - this.size / 2)] || {})[Math.round(y - this.size / 2)] = 1;
        }
      }
    }
  };
}

export default Pen;
