import Renderer from "./Renderer";
import Pen from "./Pen";
import _ from "./util/_";

function Game() {
  this.canvas = _("canvas");
  this.ctx = this.canvas.getContext("2d");

  this.canvas.width = window.innerWidth + 2;
  this.canvas.height = window.innerHeight;

  this.pixels = [];
  this.fillPixels = function (type) {
    let posX = 0;
    let posY = 0;
    while (posX < this.canvas.width + 10) {
      this.pixels[posX] = new Array(this.canvas.height);
      posY = 0;
      while (posY < this.canvas.height + 1) {
        this.pixels[posX][posY] = type;
        posY++;
      }
      posX++;
    }
  };
  this.fillPixels(0);

  this.pen = new Pen(this);
  this.renderer = new Renderer(this);

  this.tick = function () {
    this.pen.update();
  };
  this.ticker = setInterval(this.tick.bind(this), 1);
  this.renderer.startRender();
}

export default Game;
