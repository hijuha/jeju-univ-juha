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
    this.width = w;
    this.height = h;
    this.type = "Hero";
    this.speed = { x: 0, y: 0 };
    this.cooldown = 0;
    this.life = 3;
    this.points = 0;
    this.chargeTime = 0;
    this.isCharging = false;
    this.isCharged = false;
  }

  async startCharging() {
    console.log("차징 시작");
    this.isCharging = true;
    this.chargeTime = 0;
    this.isCharged = false;

    const chargeDuration = 3000; // 차징 시간 3초
    const chargeInterval = setInterval(() => {
      this.chargeTime += 100;
      if (this.chargeTime >= chargeDuration) {
        this.isCharged = true;
        clearInterval(chargeInterval);
        console.log(`차징 완료! ${this.isCharged}`);
      }
    }, 100);
  }

  releaseCharge() {
    console.log(this.isCharged);
    if (this.isCharged) {
      this.fire(true); // 차지된 상태에서는 강화된 레이저 발사
      this.isCharging = false;
      this.isCharged = false;
      console.log("차지된 공격 발사!");
    } else {
      console.log("차징이 완료되지 않았습니다");
    }
  }

  fire(charge = false) {
    if (this.canFire()) {
      let laser;
      if (charge && this === hero && this.isCharged) {
        laser = new ChargedLaser(this.x + 45, this.y - 10); // 차지된 상태에서는 강화된 레이저
      } else {
        laser = new Laser(this.x + 45, this.y - 10); // 기본 레이저
      }
      gameObjects.push(laser);
      this.cooldown = 500; // 쿨다운 500ms

      let id = setInterval(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 100;
        } else {
          clearInterval(id);
        }
      }, 100);
    }
  }

  canFire() {
    return this.cooldown === 0;
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
    this.width = 9;
    this.height = 33;
    this.type = "Laser";
    this.img = laserImg; // 기본 레이저 이미지
    this.speed = 15; // 기본 속도
    this.damage = 1; // 기본 데미지

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

class ChargedLaser extends Laser {
  constructor(x, y) {
    super(x, y);
    this.width = 18; // 강화된 레이저는 더 큰 크기
    this.height = 66; // 강화된 레이저는 더 큰 크기
    this.img = chargedLaserImg; // 강화된 레이저 이미지
    this.speed = 30; // 강화된 레이저는 더 빠르게 이동
    this.damage = 5; // 강화된 레이저는 더 큰 데미지
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
        // console.log("Stopped at", this.y);
        clearInterval(id); // 화면 끝에 도달하면 정지
      }
    }, 300);
  }
}

class Boss extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 100;
    this.height = 100;
    this.type = "Boss";
    this.life = 200; // 보스의 체력
    this.img = bossImg; // 보스 이미지
    this.speed = 5; // 보스 이동 속도

    // 보스가 Hero를 향해 이동
    this.moveInterval = setInterval(() => {
      if (this.x < hero.x) {
        this.x += this.speed; // Hero를 향해 오른쪽으로 이동
      } else if (this.x > hero.x) {
        this.x -= this.speed; // Hero를 향해 왼쪽으로 이동
      }

      if (this.y < hero.y) {
        this.y += this.speed; // Hero를 향해 아래로 이동
      } else if (this.y > hero.y) {
        this.y -= this.speed; // Hero를 향해 위로 이동
      }
    }, 100);

    // 보스 공격
    this.attackInterval = setInterval(() => {
      this.attack();
    }, 2000); // 2초마다 공격
  }

  attack() {
    let attack = new BossAttack(this.x + this.width / 2, this.y + this.height);
    gameObjects.push(attack);
  }

  decrementLife(damage) {
    this.life -= damage;
    if (this.life <= 0) {
      this.dead = true;
      clearInterval(this.moveInterval); // 보스가 죽으면 이동 멈춤
      clearInterval(this.attackInterval); // 보스가 죽으면 공격 멈춤
    }
  }
}

class BossAttack extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.width = 20;
    this.height = 30;
    this.type = "BossAttack";
    this.img = bossAttackImg; // 보스 공격 이미지
    this.speed = 10; // 공격 속도
    this.damage = 10; // 공격 데미지

    // 공격은 아래로 이동
    let id = setInterval(() => {
      if (this.y < canvas.height) {
        this.y += this.speed; // 공격이 아래로 이동
      } else {
        this.dead = true; // 화면 아래로 내려가면 제거
        clearInterval(id);
      }
    }, 100);
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

function checkForBoss() {
  if (isEnemiesDead() && !gameObjects.some((obj) => obj.type === "Boss")) {
    // 모든 적이 죽고 보스가 아직 게임에 등장하지 않았다면 보스 등장
    const boss = new Boss(canvas.width / 2, 0); // 화면 상단 중앙에 보스 등장
    gameObjects.push(boss);
  }
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
  chargedLaserImg,
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
  chargedLaserImg = await loadTexture("assets/laserGreen.png");

  initGame();

  gameLoopId = startGameLoopId(backImg);

  let onKeyDown = function (e) {
    // console.log(e.keyCode);
    switch (e.keyCode) {
      case 37: // 왼쪽 화살표
      case 39: // 오른쪽 화살표
      case 38: // 위쪽 화살표
      case 40: // 아래쪽 화살표
      case 32: // 스페이스바
        e.preventDefault();
        break;

      case 67: // 'C' 버튼 (keyCode: 67)
        // C 버튼을 누르면 차지 시작
        if (!hero.isCharging) {
          // 차징 중이 아닐 때만 시작
          hero.startCharging();
        }
        break;

      default:
        break;
    }
  };

  let onKeyUp = function (e) {
    if (e.keyCode === 67) {
      setTimeout(() => {
        hero.releaseCharge();
      }, 500);
    }

    // 화살표 키나 스페이스바, Enter 키 등에 대한 eventEmitter 처리
    if (e.key === "ArrowUp") {
      eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (e.key === "ArrowDown") {
      eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (e.key === "ArrowLeft") {
      eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (e.key === "ArrowRight") {
      eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (e.keyCode === 32) {
      // 스페이스바
      eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    } else if (e.key === "Enter") {
      eventEmitter.emit(Messages.KEY_EVENT_ENTER);
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
};
