import * as PIXI from 'pixi.js';
import game from './game';
import mainTitle from './mainTitle';

export default function main(gameApp) {
  if (document.querySelector('canvas') && !gameApp) {
    document.querySelector('canvas').remove();
  }
  if (document.querySelector('.end-title')) {
    document.querySelector('.end-title').remove();
  }
  if (document.querySelector('.control-panel')) return;
  console.log(gameApp)
  gameApp && gameApp.destroy(true)
  mainTitle();

  const panel = document.createElement('div');
  panel.className = 'control-panel';
  for (let i = 0; i < 4; i++) {
    let button = document.createElement('button');
    let span = document.createElement('span');
    span.innerHTML = `GAME${i + 1}`;
    span.className = 'cybr-btn__glitch';
    if (i < 3) {
      button.className = 'cybr-btn start-game-btn';
      button.innerHTML = `GAME${i + 1}`;
    } else {
      button.className = 'cybr-btn end-game-btn';
      button.innerHTML = `EXIT`;
    }
    button.appendChild(span);
    panel.appendChild(button);
  }
  document.body.appendChild(panel);
  panel.style.position = 'absolute';
  document.querySelector('.end-game-btn').addEventListener('click', () => {
    window.location.href = 'http://nasa.gov';
  });

  document.querySelectorAll('.start-game-btn').forEach((button) =>
    button.addEventListener('click', () => {
      game();
    })
  );

  const app = new PIXI.Application();
  document.body.appendChild(app.view);
  const loader = new PIXI.Loader()
  loader.add('../img/star.png').load()
  let mainScene = new PIXI.Container();
  app.stage.addChild(mainScene);
  const starTexture = PIXI.Texture.from('../img/star.png');
    console.log(app);
  const starAmount = 1000;
  let cameraZ = 0;
  const fov = 20;
  const baseSpeed = 0.025;
  let speed = 0;
  let warpSpeed = 0.2;
  const starStretch = 5;
  const starBaseSize = 0.05;

  const stars = [];
  for (let i = 0; i < starAmount; i++) {
    const star = {
      sprite: new PIXI.Sprite(starTexture),
      z: 0,
      x: 0,
      y: 0,
    };
    star.sprite.anchor.x = 0.5;
    star.sprite.anchor.y = 0.7;
    randomizeStar(star, true);
    mainScene.addChild(star.sprite);
    stars.push(star);
  }

  function randomizeStar(star, initial) {
    star.z = initial
      ? Math.random() * 2000
      : cameraZ + Math.random() * 1000 + 2000;

    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;
    star.x = Math.cos(deg) * distance;
    star.y = Math.sin(deg) * distance;
  }

  app.ticker.add((delta) => {
    speed += (warpSpeed - speed) / 20;
    cameraZ += delta * 10 * (speed + baseSpeed);
    for (let i = 0; i < starAmount; i++) {
      const star = stars[i];
      if (star.z < cameraZ) randomizeStar(star);

      const z = star.z - cameraZ;
      star.sprite.x =
        star.x * (fov / z) * app.renderer.screen.width +
        app.renderer.screen.width / 2;
      star.sprite.y =
        star.y * (fov / z) * app.renderer.screen.width +
        app.renderer.screen.height / 2;

      const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
      const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
      const distanceCenter = Math.sqrt(
        dxCenter * dxCenter + dyCenter * dyCenter
      );
      const distanceScale = Math.max(0, (2000 - z) / 2000);
      star.sprite.scale.x = distanceScale * starBaseSize;

      star.sprite.scale.y =
        distanceScale * starBaseSize +
        (distanceScale * speed * starStretch * distanceCenter) /
          app.renderer.screen.width;
      star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
    }
  });
}
