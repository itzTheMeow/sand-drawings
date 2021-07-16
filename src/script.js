import config from "./config";
import _ from "./util/_";
import { disableBodyScroll } from "body-scroll-lock";
import Game from "./Game";

window.Engine = new Game();

disableBodyScroll(_("scroll-lock"));
