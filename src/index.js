import * as PIXI from "pixi.js";

import intro from "./intro";
import main from "./main";
import game from "./game";
import "./styles/intro.scss";
import "./styles/main.scss";
import "./styles/space.scss";
import mainTitle from "./mainTitle";

let introScene = new PIXI.Container();

window.onload = () => {
  intro(app, introScene);
};

setTimeout(() => {
  main();
}, 2000);

let Application = PIXI.Application;

let app = new Application({
  width: 800,
  height: 600,
});

document.body.appendChild(app.view);
