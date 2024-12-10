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
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
      this.fire(true);
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
        laser = new ChargedLaser(this.x + 45 - 4, this.y - 10); // 차지된 상태에서는 강화된 레이저
      } else if (this !== hero) {
        laser = new Laser(this.x + 45 - 28, this.y - 10);
      } else {
        laser = new Laser(this.x + 45, this.y - 10);
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

  // 체력 감소 메서드
  decrementLife(damage) {
    this.life -= damage;
    if (this.life <= 0) {
      this.life = 0;
      this.dead = true;
      console.log("Hero is dead");
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
    this.width = 18;
    this.height = 66;
    this.img = chargedLaserImg;
    this.speed = 30;
    this.damage = 10;
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
    this.width = 180;
    this.height = 230;
    this.type = "Boss";
    this.maxLife = 200;
    this.life = this.maxLife;
    this.img = bossImg; // 보스 이미지
    this.speed1 = 10; // 보스 등장 이동 속도
    this.speed2 = 5; // 보스 패턴 이동 속도
    this.isMovingToCenter = true; // 중앙으로 내려가는 상태 확인
    this.isMovingLeftRight = false; // 좌우로 이동하는 상태 확인
    this.moveDirection = "right"; // 초기 좌우 이동 방향

    // 보스를 화면 상단 밖에서 시작
    this.y = -this.height;

    // 보스가 중앙 상단으로부터 내려오기
    this.moveInterval = setInterval(() => {
      if (this.isMovingToCenter) {
        // 중앙으로 내려가기 (y축)
        if (this.y < (canvas.height * 1) / 4 - (this.height * 2) / 3) {
          this.y += this.speed1; // 아래로 이동
        } else {
          this.isMovingToCenter = false; // 중앙에 도달하면 좌우 이동으로 변경
          this.isMovingLeftRight = true;
        }
      } else if (this.isMovingLeftRight) {
        // 중앙에 도달하면 좌우로 이동
        if (this.moveDirection === "right") {
          this.x += this.speed2; // 오른쪽으로 이동
          if (this.x > canvas.width - this.width) {
            this.moveDirection = "left"; // 오른쪽 끝에 도달하면 왼쪽으로 이동
          }
        } else if (this.moveDirection === "left") {
          this.x -= this.speed2; // 왼쪽으로 이동
          if (this.x < 0) {
            this.moveDirection = "right"; // 왼쪽 끝에 도달하면 오른쪽으로 이동
          }
        }
      }
    }, 100);

    // 보스 공격
    this.attackInterval = setInterval(() => {
      if (this.life > 0 && !hero.dead) {
        this.attack();
      } else {
        clearInterval(this.attackInterval);
      }
    }, 2000);
  }

  attack() {
    let attack = new BossAttack(
      this.x + this.width / 2,
      this.y + this.height,
      hero
    );
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

  // 보스의 HP를 게이지 형태로 화면 상단에 표시
  drawHPBar(ctx) {
    const barWidth = 1000; // HP 바의 너비
    const barHeight = 16; // HP 바의 높이

    // HP 바 배경 (빈 바)
    ctx.fillStyle = "gray";
    ctx.fillRect(canvas.width / 2 - barWidth / 2, 30, barWidth, barHeight);

    // HP 바 (현재 체력)
    const currentHPWidth = (this.life / this.maxLife) * barWidth;
    ctx.fillStyle = "red"; // HP 바 색상
    ctx.fillRect(
      canvas.width / 2 - barWidth / 2,
      30,
      currentHPWidth,
      barHeight
    );
  }

  // 보스의 이미지를 그리고 HP 바를 화면 상단에 표시
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y + 40, this.width, this.height);
    this.drawHPBar(ctx); // 보스의 HP 바를 화면 상단에 표시
  }
}

class BossAttack extends GameObject {
  constructor(x, y, hero) {
    super(x, y);
    this.width = 15;
    this.height = 35;
    this.type = "BossAttack";
    this.img = bossAttackImg;
    this.damage = 1;

    const deltaX = hero.x - this.x;
    const deltaY = hero.y - this.y;

    const angle = Math.atan2(deltaY, deltaX);
    this.speedX = Math.cos(angle) * 15;
    this.speedY = Math.sin(angle) * 10;

    // 공격은 아래로 이동
    let id = setInterval(() => {
      if (this.y < canvas.height) {
        this.x += this.speedX;
        this.y += this.speedY;
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
    hero.y -= 10;
    hero2.y -= 10;
    hero3.y -= 10;
  });
  eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
    hero.y += 10;
    hero2.y += 10;
    hero3.y += 10;
  });
  eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
    hero.x -= 10;
    hero2.x -= 10;
    hero3.x -= 10;
  });
  eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
    hero.x += 10;
    hero2.x += 10;
    hero3.x += 10;
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
    console.log(`second: ${second.type}`);
    first.dead = true;
    second.dead = true;
    hero.incrementPoints();

    // 적들을 모두 처치했지만 보스가 아직 등장하지 않았다면
    if (isEnemiesDead() && !gameObjects.some((obj) => obj.type === "Boss")) {
      const boss = new Boss(100, 0, 150, 100);
      gameObjects.push(boss);
      console.log("보스 등장!");
    }
  });

  eventEmitter.on(Messages.COLLISION_BOSS_LASER, (_, { first, second }) => {
    // console.log(`first: ${first.type}`);
    // console.log(`second: ${second.type}`);

    if (second.type === "Boss") {
      second.life -= first.damage;
      console.log(`보스 타격: ${second.life}`);
      if (second.life <= 0) {
        second.dead = true;
        eventEmitter.emit(Messages.GAME_END_WIN);
        console.log("보스 처치 완료!");
      }

      first.dead = true;
    }
  });

  eventEmitter.on(
    Messages.COLLISION_BOSS_ATTACK_HERO,
    (_, { first, second }) => {
      // first는 BossAttack, second는 hero
      second.decrementLife(first.damage);

      console.log(`히어로 체력 ${second.life}`);

      if (isHeroDead()) {
        eventEmitter.emit(Messages.GAME_END_LOSS);
      }

      first.dead = true;
    }
  );

  eventEmitter.on(
    Messages.COLLISION_BOSS_ATTACK_HERO,
    (_, { first, second }) => {
      console.log("Collision with BossAttack: ", first);

      // first는 BossAttack, second는 hero
      second.decrementLife(first.damage);

      if (isHeroDead()) {
        eventEmitter.emit(Messages.GAME_END_LOSS);
      }

      first.dead = true;
    }
  );

  eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, { enemy }) => {
    console.log("Collision with enemy: ", enemy);
    enemy.dead = true;
    hero.decrementLife();

    if (isHeroDead()) {
      eventEmitter.emit(Messages.GAME_END_LOSS);
      return;
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
  const bosses = gameObjects.filter((go) => go.type === "Boss");
  const bossAttacks = gameObjects.filter((go) => go.type === "BossAttack");

  // 레이저와 적들의 충돌 처리
  lasers.forEach((l) => {
    enemies.forEach((m) => {
      if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
          first: l,
          second: m,
        });
      }
    });

    // 레이저와 보스의 충돌 처리
    bosses.forEach((boss) => {
      if (intersectRect(l.rectFromGameObject(), boss.rectFromGameObject())) {
        eventEmitter.emit(Messages.COLLISION_BOSS_LASER, {
          first: l,
          second: boss,
        });
      }
    });
  });

  // BossAttack과 Hero의 충돌 처리
  bossAttacks.forEach((attack) => {
    if (intersectRect(attack.rectFromGameObject(), hero.rectFromGameObject())) {
      // BossAttack과 Hero가 충돌한 경우
      eventEmitter.emit(Messages.COLLISION_BOSS_ATTACK_HERO, {
        first: attack, // BossAttack
        second: hero, // Hero
      });
    }
  });

  // 적과 영웅의 충돌 처리
  enemies.forEach((enemy) => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, enemy.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, { enemy });
    }
  });

  // 보스와 영웅의 충돌 처리
  bosses.forEach((boss) => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, boss.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_BOSS_HERO, { boss });
    }
  });

  // 죽은 객체 제거
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
    const boss = new Boss(canvas.width / 2, 0);
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
        "보스 콘푸라이트를 물리쳤다!! [엔터]를 눌러 새 게임을 시작할 수 있어요",
        "green"
      );
    } else {
      displayMessage("당신은 죽었습니다. [엔터]를 눌러 새 게임을 시작하세요.");
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
  COLLISION_BOSS_HERO: "COLLISION_BOSS_HERO",
  COLLISION_BOSS_LASER: "COLLISION_BOSS_LASER",
  COLLISION_BOSS_ATTACK_HERO: "COLLISION_BOSS_ATTACK_HERO",
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
  bossImg,
  bossAttackImg,
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
  bossImg = await loadTexture("assets/boss.png");
  bossAttackImg = await loadTexture("assets/bossAttack.png");

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
