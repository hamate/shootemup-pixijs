import * as PIXI from 'pixi.js';
import mainTitle from './mainTitle';

export default function intro(app, introScene) {
  new PIXI.Loader().add('../img/intro.jpeg').load();

  introScene = new PIXI.Container();
  app.stage.addChild(introScene);

  let bgIntro = PIXI.Sprite.from('../img/intro.jpeg');
  bgIntro.position.set(0, 0);
  introScene.addChild(bgIntro);

  mainTitle()
  // const mainTitle = document.createElement('div');
  // const glitch = document.createElement('div');
  // const glow = document.createElement('div');
  // const scanlines = document.createElement('div');
  // document.body.appendChild(mainTitle);
  // mainTitle.className = 'main-title';
  // glitch.className = 'glitch';
  // glitch.setAttribute('data-text', "Shoot'em Up");
  // glitch.innerText = `Shoot'em Up`;
  // glow.className = 'glow';
  // glow.innerText = `Shoot'em Up`;
  // scanlines.className = 'scanlines';
  // mainTitle.appendChild(glitch);
  // mainTitle.appendChild(glow);
  // mainTitle.appendChild(scanlines);
  // mainTitle.style.zIndex = '2';
}
