import config from "./config";
import _ from "./util/_";
import { GameCanvas, ctx } from "./GameCanvas";
import { disableBodyScroll } from "body-scroll-lock";

disableBodyScroll(_("scroll-lock"), {
  _allowTouchMove: el => el.id == GameCanvas.id
});