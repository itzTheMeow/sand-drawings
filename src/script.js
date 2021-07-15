import config from "./config";
import _ from "./util/_";
import { GameCanvas, ctx } from "./GameCanvas";
import { disableBodyScroll } from "body-scroll-lock";
import Game from "./Game";

window.Engine = new Game();

disableBodyScroll(_("scroll-lock"), {
  _allowTouchMove: el => el.id == GameCanvas.id
});