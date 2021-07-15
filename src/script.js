import config from "./config";
import _ from "./util/_";
import { GameCanvas, ctx, getSize } from "./GameCanvas";
import { disableBodyScroll } from "body-scroll-lock";

disableBodyScroll(_("scroll-lock"));

let size = getSize();
ctx.fillStyle = config.background;
ctx.fillRect(0, 0, size.w, size.h);
