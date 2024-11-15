function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

window.onload = async () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const heroImg = await loadTexture("assets/player.png");
  const enemyImg = await loadTexture("assets/enemyShip.png");
  const starBg = await loadTexture("assets/starBackground.png");

  // 별 배경
  const bgPattern = ctx.createPattern(starBg, "repeat");
  ctx.fillStyle = bgPattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawHero(ctx, canvas, heroImg);

  createEnemies2(ctx, canvas, enemyImg);
};

function drawHero(ctx, canvas, heroImg) {
  const mainShipSize = 60;
  const sideShipSize = 30;

  // 메인
  ctx.drawImage(
    heroImg,
    canvas.width / 2 - mainShipSize / 2,
    canvas.height - canvas.height / 4,
    mainShipSize,
    mainShipSize
  );

  // 왼쪽
  ctx.drawImage(
    heroImg,
    canvas.width / 2 - mainShipSize / 2 - sideShipSize * 1.5,
    canvas.height - canvas.height / 4 + mainShipSize / 2,
    sideShipSize,
    sideShipSize
  );

  // 오른쪽
  ctx.drawImage(
    heroImg,
    canvas.width / 2 + mainShipSize / 2 + sideShipSize / 2,
    canvas.height - canvas.height / 4 + mainShipSize / 2,
    sideShipSize,
    sideShipSize
  );
}

function createEnemies2(ctx, canvas, enemyImg) {
  const rows = 5;
  const startY = 0;
  const spacingX = enemyImg.width;
  const spacingY = enemyImg.height;

  for (let row = 0; row < rows; row++) {
    const enemyCount = rows - row;
    const rowWidth = enemyCount * spacingX;
    const startX = (canvas.width - rowWidth) / 2;

    for (let i = 0; i < enemyCount; i++) {
      const x = startX + i * spacingX;
      const y = startY + row * spacingY;
      ctx.drawImage(enemyImg, x, y);
    }
  }
}
