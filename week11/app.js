class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false; // 객체가 파괴되었는지 여부
    this.type = ""; // 객체 타입 (영웅/적)
    this.width = 0; // 객체의 폭
    this.height = 0; // 객체의 높이
    this.img = undefined; // 객체의 이미지
  }

  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }

  draw(ctx) {
    //캔버스에 이미지 그리기
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //
  }
}

class Hero extends GameObject {
  constructor(x, y, w, h) {
    super(x, y);
    (this.width = w), (this.height = h);
    this.type = "Hero";
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    this.life = 3;
    this.points = 0;
  }

  fire(xoffset = 0) {
    if (this.canFire()) {
      gameObjects.push(new Laser(this.x + 45 + xoffset, this.y - 10)); // 레이저 발사
      this.cooldown = 500; // 쿨다운 500ms
      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
          clearInterval(id); //쿨다운 완료 후 타이머 종료
        }
      }, 100);
    }
  }
  canFire() {
    return this.cooldown === 0; // 쿨다운이 끝났는지 확인
  }

  decrementLife() {
    this.life--;
    if (this.life === 0) {
      this.dead = true;
    }
  }

  incrementPoints() {
    this.points += 100;
  }
}

class Laser extends GameObject {
  constructor(x, y) {
    super(x, y);
    (this.width = 9), (this.height = 33);
    this.type = "Laser";
    this.img = laserImg;
    let id = setInterval(() => {
      if (this.y > 0) {
        this.y -= 15; // 레이저가 위로 이동
      } else {
        this.dead = true; // 화면 상단에 도달하면 제거
        clearInterval(id);
      }
    }, 100);
  }
}

class Enemy extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 98;
    this.height = 50;
    this.type = "Enemy";
    // 적 캐릭터의 자동 이동 (Y축 방향)
    let id = setInterval(() => {
      if (this.y < canvas.height - this.height) {
        this.y += 5; // 아래로 이동
      } else {
        console.log("Stopped at", this.y);
        clearInterval(id); // 화면 끝에 도달하면 정지
      }
    }, 300);
  }
}

class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }
  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }
  clear() {
    this.listeners = {};
  }
}

function createHero() {
  hero = new Hero(
    canvas.width / 2 - 45,
    canvas.height - canvas.height / 4,
    99,
    75
  );
  hero.img = heroImg;
  gameObjects.push(hero);
}

function sideHero2() {
  hero2 = new Hero(
    canvas.width / 2 + 45,
    canvas.height - canvas.height / 4 + 10,
    40,
    30
  );
  hero2.img = heroImg;
  gameObjects.push(hero2);
}
function sideHero3() {
  hero3 = new Hero(
    canvas.width / 2 - 75,
    canvas.height - canvas.height / 4 + 10,
    40,
    30
  );
  hero3.img = heroImg;
  gameObjects.push(hero3);
}

function createEnemies() {
  const MONSTER_TOTAL = 5;
  const MONSTER_WIDTH = MONSTER_TOTAL * 98;
  const START_X = (canvas.width - MONSTER_WIDTH) / 2;
  const STOP_X = START_X + MONSTER_WIDTH;

  for (let x = START_X; x < STOP_X; x += 98) {
    for (let y = 0; y < 50 * 5; y += 50) {
      const enemy = new Enemy(x, y);
      enemy.img = enemyImg;
      gameObjects.push(enemy);
    }
  }
}

function createEnemies2(ctx, canvas, enemyImg) {
  const MAX_ROWS = 5; // 역 피라미드 최대 줄 수

  for (let row = 0; row < MAX_ROWS; row++) {
    // 각 행의 이미지 개수와 중앙 정렬 시작 위치
    const numEnemies = MAX_ROWS - row;
    const START_X = (canvas.width - numEnemies * enemyImg.width) / 2;
    const y = row * enemyImg.height;

    // 각 행에 이미지 배치
    for (let i = 0; i < numEnemies; i++) {
      const x = START_X + i * enemyImg.width;
      ctx.drawImage(enemyImg, x, y);
    }
  }
}

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

function initGame() {
  gameObjects = [];
  createEnemies();
  createHero();
  sideHero2();
  sideHero3();

  eventEmitter.on(Messages.KEY_EVENT_UP, () => {
    hero.y -= 5;
    hero2.y -= 5;
    hero3.y -= 5;
  });
  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 5;
    hero2.y += 5;
    hero3.y += 5;
  });
  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 5;
    hero2.x -= 5;
    hero3.x -= 5;
  });
  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 5;
    hero2.x += 5;
    hero3.x += 5;
  });

  eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
    if (hero.canFire()) {
      hero.fire();
    }
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    // first: 레이저 객체, second: 적 객체
    first.dead = true; // 레이저 제거
    second.img = explosionImg; // 적 이미지를 폭발 이미지로 교체

    // 500ms 후에 적 객체를 제거
    setTimeout(() => {
      second.dead = true; // 적 제거
    }, 500);
  });

  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
    hero.incrementPoints();
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
    enemy.dead = true;
    hero.decrementLife();
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true;
    second.dead = true;
    hero.incrementPoints();
    if (isEnemiesDead()) {
      eventEmitter.emit(Messages.GAME_END_WIN);
    }
  });
  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
    console.log("Collision with enemy: ", enemy);
    enemy.dead = true;
    hero.decrementLife();
    if (isHeroDead()) {
      eventEmitter.emit(Messages.GAME_END_LOSS);
      return; // loss before victory
    }
    if (isEnemiesDead()) {
      eventEmitter.emit(Messages.GAME_END_WIN);
    }
  });
  eventEmitter.on(Messages.GAME_END_WIN, () => {
    endGame(true);
  });
  eventEmitter.on(Messages.GAME_END_LOSS, () => {
    endGame(false);
  });
  eventEmitter.on(Messages.KEY_EVENT_ENTER, () => {
    resetGame();
  });
}

function drawGameObjects(ctx) {
  gameObjects.forEach((go) => go.draw(ctx));
}

function updateGameObjects() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy");
  const lasers = gameObjects.filter((go) => go.type === "Laser");

  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      }
    });
  });

  enemies.forEach((enemy) => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  });

  gameObjects = gameObjects.filter((go) => !go.dead);
}

function intersectRect(r1, r2) {
  return !(
    (
      r2.left > r1.right || // r2가 r1의 오른쪽에 있음
      r2.right < r1.left || // r2가 r1의 왼쪽에 있음
      r2.top > r1.bottom || // r2가 r1의 아래에 있음
      r2.bottom < r1.top
    ) // r2가 r1의 위에 있음
  );
}

function drawLife() {
  const START_POS = canvas.width - 180;
  for (let i = 0; i < hero.life; i++) {
    ctx.drawImage(lifeImg, START_POS + 45 * (i + 1), canvas.height - 37);
  }
}
function drawPoints() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "left";
  drawText("Points: " + hero.points, 10, canvas.height - 20);
}
function drawText(message, x, y) {
  ctx.fillText(message, x, y);
}

function isHeroDead() {
  return hero.life <= 0;
}
function isEnemiesDead() {
  const enemies = gameObjects.filter((go) => go.type === "Enemy" && !go.dead);
  return enemies.length === 0;
}
function displayMessage(message, color = "red") {
  ctx.font = "30px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}
function endGame(win) {
  clearInterval(gameLoopId);
  // 게임 화면이 겹칠 수 있으니, 200ms 지연
  console.log("Game ended. Win status:", win);
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (win) {
      displayMessage(
        "Victory!!! Pew Pew... - Press [Enter] to start a new game Captain Pew Pew",
        "green"
      );
    } else {
      displayMessage(
        "You died !!! Press [Enter] to start a new game Captain Pew Pew"
      );
    }
  }, 200);
}
async function resetGame() {
  if (gameLoopId) {
    clearInterval(gameLoopId); // 게임 루프 중지, 중복 실행 방지
    eventEmitter.clear(); // 모든 이벤트 리스너 제거, 이전 게임 세션 충돌 방지
    initGame(); // 게임 초기 상태 실행

    const backImg = await loadTexture("assets/starBackground.png");
    gameLoopId = startGameLoopId(backImg);
  }
}

function startGameLoopId(backImg) {
  const bgPattern = ctx.createPattern(backImg, "repeat");
  return setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGameObjects(ctx);
    drawPoints();
    drawLife();
    updateGameObjects();
    hero2.fire(-28);
    hero3.fire(-28);
  }, 100);
}

const Messages = {
  KEY_EVENT_UP: "KEY_EVENT_UP",
  KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
  KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
  KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
  KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
  COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
  COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
  GAME_END_LOSS: "GAME_END_LOSS",
  GAME_END_WIN: "GAME_END_WIN",
  KEY_EVENT_ENTER: "KEY_EVENT_ENTER",
};

let heroImg,
  enemyImg,
  laserImg,
  lifeImg,
  explosionImg,
  canvas,
  ctx,
  gameObjects = [],
  hero,
  hero2,
  hero3,
  eventEmitter = new EventEmitter();

let gameLoopId = null;

window.onload = async () => {
  // 배경색 설정
  explosionImg = await loadTexture("assets/laserGreenShot.png");
  const backImg = await loadTexture("assets/starBackground.png");
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  heroImg = await loadTexture("assets/player.png");
  enemyImg = await loadTexture("assets/enemyShip.png");
  laserImg = await loadTexture("assets/laserRed.png");
  lifeImg = await loadTexture("assets/life.png");

  initGame();

  gameLoopId = startGameLoopId(backImg);

  let onKeyDown = function (e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
      case 37: // 왼쪽 화살표
      case 39: // 오른쪽 화살표
      case 38: // 위쪽 화살표
      case 40: // 아래쪽 화살표
      case 32: // 스페이스바
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", (evt) => {
    if (evt.key === "ArrowUp") {
      eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
      eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
      eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
      eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (evt.keyCode === 32) {
      eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    } else if (evt.key === "Enter") {
      eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
  });
};
