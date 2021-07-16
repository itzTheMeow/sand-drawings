import Renderer from "./Renderer";
import Pen from "./Pen";
import _ from "./util/_";

function Game() {
  this.canvas = _("canvas");
  this.ctx = this.canvas.getContext("2d");

  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this.pixels = {};
  this.fillPixels = function (type) {
    let posX = 0;
    let posY = 0;
    while (true) {
      posX++;
      while (true) {
        posY++;
        this.pixels[`${posX},${posY}`] = type;
        if (posY >= this.canvas.width) break;
      }
      posY = 0;
      if (posX >= this.canvas.height) break;
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
