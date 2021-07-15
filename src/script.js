import config from "./config";
import { GameCanvas, ctx, getSize } from "./GameCanvas";
import { disableBodyScroll } from "body-scroll-lock";

disableBodyScroll();

let size = getSize();
ctx.fillStyle = config.background;
ctx.fillRect(0, 0, size.w, size.h);
