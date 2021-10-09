import _ from "./util/_";
import { disableBodyScroll } from "body-scroll-lock";
import Game from "./Game";

(window as any).Engine = new Game();

disableBodyScroll(_("scroll-lock"));
