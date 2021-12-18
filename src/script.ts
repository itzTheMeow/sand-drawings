import _ from "./util/_";
import { disableBodyScroll } from "body-scroll-lock";
import Game from "./Game";

(window as any).Engine = new Game();

disableBodyScroll(_("scroll-lock"));
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("gesturechange", (e) => e.preventDefault());
document.addEventListener("gestureend", (e) => e.preventDefault());
