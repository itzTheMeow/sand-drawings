function Pen(game) {
  this.size = 5;
  
  this.isDrawing = false;
  this.startDrawing = function() {
    this.isDrawing = true;
  }
  this.stopDrawing = function() {
    this.isDrawing = false;
  }
  game.canvas.onmousedown = game.canvas.ontouchstart = this.startDrawing;
  game.canvas.onmouseup = game.canvas.ontouchstop = this.stopDrawing;
  
  this.update = function() {
    if(this.isDrawing) game.pixels["1,1"] = 1;
  }
}

export default Pen;