import * as PIXI from 'pixi.js';
import endGame from './endGame';
import main from './main';
import mainTitle from './mainTitle';

export default function game() {
  if (document.querySelector('canvas')) {
    document.querySelector('canvas').remove();
  }
  if (document.querySelector('div')) {
    document.querySelectorAll('div').forEach((div) => div.remove());
  }

  let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = new PIXI.Loader(),
    resources = loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

  let gameApp = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0xaaaaaa,
  });

  document.body.appendChild(gameApp.view);

  loader
    .add('../img/sprites/spaceSprites.json')
    .add('bgBack', '../img/nebula.png')
    .add('bgRocks', '../img/Rocks.png')
    .add('bgGround', '../img/Ground.png')
    .add('bgGroundFront', '../img/GroundFront.png')
    .add('rocket', '../img/sprites/shot.png')
    .add('../img/Explosion1/explosion.json')
    .load(setup);

  let ship,
    sprites,
    enemy,
    enemies = [],
    rocket,
    rockets = [],
    explosion,
    ticker,
    gameScene,
    id = 0,
    state,
    bgBack,
    bgRocks,
    bgGround,
    bgGroundFront,
    bgX = 0,
    bgSpeed = 2,
    deltaY = 0;

  function setup() {
    gameScene = new Container();
    gameApp.stage.addChild(gameScene);

    bgBack = createBg(resources['bgBack'].texture);
    bgRocks = createBg(resources['bgRocks'].texture);
    bgGround = createBg(resources['bgGround'].texture);
    bgGroundFront = createBg(resources['bgGroundFront'].texture);

    sprites = resources['../img/sprites/spaceSprites.json'].textures;

    ship = new Sprite(sprites['Ship5.png']);
    ship.width = 100;
    ship.height = 60;
    ship.x = 55;
    ship.y = 300;
    ship.anchor.set(0.5);
    gameScene.addChild(ship);

    addEnemy(sprites);

    state = play;
    ticker = new PIXI.Ticker();
    ticker.add(gameLoop);
    ticker.start();
    ticker.autoStart = false;
  }

  function createBg(texture) {
    let tiling = new PIXI.TilingSprite(texture, 800, 600);
    tiling.position.set(-1, 0);
    gameScene.addChild(tiling);

    return tiling;
  }

  function updateBg() {
    bgX = bgX - bgSpeed;
    bgRocks.tilePosition.x = bgX * 0.3;
    bgGround.tilePosition.x = bgX * 1.2;
    bgGroundFront.tilePosition.x = bgX * 1.8;
  }

  function addEnemy(sprites) {
    let enemySprites = ['Ship1.png', 'Ship3.png', 'Ship6.png'];

    const intId = setInterval(() => {
      let randomEnemy = enemySprites[Math.floor(Math.random() * 3)];
      enemy = new Sprite(sprites[randomEnemy]);
      enemy.moveR = Math.random() * (2.0 - 1.1) + 1.1;
      enemy.deltaY = Math.random() * (0.3 - 0.1) + 0.1;
      enemy.anchor.set(0.5);
      enemy.x = 800 + enemy.width / 2 + 5;
      enemy.y =
        Math.random() *
          (600 - enemy.height / 2 - 175 - (170 + enemy.height / 2)) +
        (170 + enemy.height / 2);
      enemy.id = id;
      enemy.changer = Math.random() < 0.5 ? -1 : 1;
      id++;
      gameScene.addChild(enemy);
      enemies.push(enemy);
    }, 2000);
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    enemies.forEach((enemy) => {
      enemy.deltaY += 0.02;
      enemy.x -= 1.3;
      enemy.y += Math.sin(enemy.deltaY * enemy.changer) * enemy.moveR;
      if (rectsIntersect(ship, enemy)) {
        gameScene.removeChild(ship);
        gameScene.removeChild(rocket);
        explodeObject(ship);
        state = end;
      }
    });
    enemies = enemies.filter((enemy) => enemy.x > 0 - enemy.width / 2);
    rockets.forEach((rocket, i) => {
      rocket.x += 4;
      enemies.forEach((en, i) => {
        if (rectsIntersect(rocket, en)) {
          gameScene.removeChild(rocket);
          gameScene.removeChild(en);
          explodeObject(en);
          enemies.splice(i, 1);
          rockets = rockets.filter((rckt) => rckt != rocket);
        }
        if (rocket.x > 820) {
          gameScene.removeChild(rocket);
          rockets = rockets.filter((rckt) => rckt != rocket);
        }
      });
    });
    updateBg();
    moveShip(delta);
  }

  function end() {
    setTimeout(() => {
      endGame();
      PIXI.utils.clearTextureCache();
      setTimeout(() => {
        main(gameApp);
      }, 2000);
    }, 1500);
  }

  function explodeObject(obj) {
    let sheet = resources['../img/Explosion1/explosion.json'].spritesheet;
    explosion = new PIXI.AnimatedSprite(sheet.animations['Explosion1']);
    explosion.anchor.set(0.5);
    explosion.x = obj.x;
    explosion.y = obj.y;
    if (obj == ship) {
      explosion.scale.set(2, 2);
      explosion.animationSpeed = 0.2;
    } else {
      explosion.scale.set(1, 1);
      explosion.animationSpeed = 0.4;
    }
    explosion.loop = false;
    explosion.play();
    gameScene.addChild(explosion);
    if (obj == ship) {
      explosion.onComplete = () => {
        ship.destroy();
        ticker.stop(gameLoop);
        ticker.remove(gameLoop)
      };
    }
  }

  let velY = 0;
  let velX = 0;
  let speed = 3;
  let friction = 0.94;
  let keys = [];

  document.body.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
  });

  document.body.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
  });

  function moveShip(delta) {
    if (keys[38]) {
      if (velY > -speed) {
        velY--;
      }
    }

    if (keys[40]) {
      if (velY < speed) {
        velY++;
      }
    }
    if (keys[39]) {
      if (velX < speed) {
        velX++;
      }
    }
    if (keys[37]) {
      if (velX > -speed) {
        velX--;
      }
    }

    velY *= friction;
    ship.y += velY;

    velX *= friction;
    ship.x += velX;

    if (ship.x >= 740) {
      ship.x = 740;
    } else if (ship.x <= 60) {
      ship.x = 60;
    }

    if (ship.y > 565) {
      ship.y = 565;
    } else if (ship.y <= 35) {
      ship.y = 35;
    }
  }

  function rectsIntersect(a, b) {
    let aBox = a.getBounds();
    let bBox = b.getBounds();

    return (
      aBox.x + aBox.width > bBox.x + 15 &&
      aBox.x < bBox.x + bBox.width - 15 &&
      aBox.y + aBox.height > bBox.y + 10 &&
      aBox.y < bBox.y + bBox.height - 10
    );
  }

  function shootRocket() {
    let rocketTexture = TextureCache['../img/sprites/shot.png'];
    rocket = new Sprite(rocketTexture);
    rocket.x = ship.x + ship.width / 2 + rocket.width / 2;
    rocket.y = ship.y + 7;
    rocket.scale.set(2, 2);
    rocket.anchor.set(0.5);
    rockets.push(rocket);
    gameScene.addChild(rocket);
  }

  document.body.addEventListener('keydown', (e) => {
    if (e.keyCode === 32) {
     state != end && shootRocket();
    }
  });
}
