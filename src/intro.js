import * as PIXI from "pixi.js";
import mainTitle from "./mainTitle";

export default function intro(app, introScene) {
  introScene = new PIXI.Container();
  app.stage.addChild(introScene);

  let bgIntro = PIXI.Sprite.from("../img/intro.jpeg");
  bgIntro.position.set(0, 0);
  introScene.addChild(bgIntro);

  mainTitle();
}
