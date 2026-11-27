const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageNames = ['keiyakusyo', 'keiyaku', 'mamosyou'];

// グローバルな game オブジェクト
const game = {
  counter: 0,
  enemys: [],
  image: {},
  isGameOver: true,
  score: 0,
  timer: null,
  enemyCountdown: 0,
};

// 複数画像読み込み
let imageLoadCounter = 0;
for (const imageName of imageNames) {
  const imagePath = `image/${imageName}.png`;
  game.image[imageName] = new Image();
  game.image[imageName].src = imagePath;
  game.image[imageName].onload = () => {
    imageLoadCounter += 1;
    if (imageLoadCounter === imageNames.length) {
      console.log('画像のロードが完了しました');
      init();
    }
  }
}

function init() {
  game.counter = 0;
  game.enemys = [];
  game.isGameOver = false;
  game.score = 0;
  game.enemyCountdown = 0;
  createMamosyou();
  game.timer = setInterval(ticker, 30);
}

function ticker() {
  //画面クリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 敵キャラクタの作成
  createEnemys();

  // キャラクタの移動
  moveMamosyou(); // 恐竜の移動
  moveEnemys(); // 敵キャラクタの移動

  // 描画
  drawMamosyou(); // 恐竜の描画
  drawEnemys(); // 敵キャラクタの描画
drawScore(); // スコアの描画

  // あたり判定
  hitCheck();

  // カウンタの更新
  game.enemyCountdown -= 1;
  game.score += 1;
  game.counter = (game.counter + 1) % 1000000;
}

function createMamosyou() {
  game.mamosyou = {
    x: game.image.mamosyou.width / 2,
    y: canvas.height - game.image.mamosyou.height / 2,
    moveY: 0,
    width: game.image.mamosyou.width,
    height: game.image.mamosyou.height,
    image: game.image.mamosyou
  }
}

function createKeiyaku(createX) {
  game.enemys.push({
    x: createX,
    y: canvas.height - game.image.keiyaku.height / 2,
    width: game.image.keiyaku.width,
    height: game.image.keiyaku.height,
    moveX: -10,
    image: game.image.keiyaku
  });
}

function createKeiyakusyo() {
  const keiyakusyoY = Math.random() * (300 - game.image.keiyakusyo.height) + 150;
  game.enemys.push({
    x: canvas.width + game.image.keiyakusyo.width / 2,
    y: keiyakusyoY,
    width: game.image.keiyakusyo.width,
    height: game.image.keiyakusyo.height,
    moveX: -15,
    image: game.image.keiyakusyo
  });
}

function moveMamosyou() {
  game.mamosyou.y += game.mamosyou.moveY;
  if (game.mamosyou.y >= canvas.height - game.mamosyou.height / 2) {
    game.mamosyou.y = canvas.height - game.mamosyou.height / 2;
    game.mamosyou.moveY = 0;
  } else {
    game.mamosyou.moveY += 3;
  }
}

function createEnemys() {
  if (game.enemyCountdown === 0) {
    game.enemyCountdown = 60 - Math.floor(game.score / 100);
    if (game.enemyCountdown <= 30) game.enemyCountdown = 30;
    switch (Math.floor(Math.random() * 3)) {
      case 0:
        createKeiyaku(canvas.width + game.image.keiyaku.width / 2);
        break;
      case 1:
        createKeiyaku(canvas.width + game.image.keiyaku.width / 2);
        createKeiyaku(canvas.width + game.image.keiyaku.width * 3 / 2);
        break;
      case 2:
        createKeiyakusyo();
        break;
    }
  }
}
function moveEnemys() {
  for (const enemy of game.enemys) {
    enemy.x += enemy.moveX;
  }
  // 画面の外に出たキャラクタを配列から削除
  game.enemys = game.enemys.filter(enemy => enemy.x > -enemy.width);
}

function drawMamosyou() {
  ctx.drawImage(game.image.mamosyou, game.mamosyou.x - game.mamosyou.width / 2, game.mamosyou.y - game.mamosyou.height / 2);
}

function drawEnemys() {
  for (const enemy of game.enemys) {
    ctx.drawImage(enemy.image, enemy.x - enemy.width / 2, enemy.y - enemy.height / 2);
  }
}

function drawScore() {
  ctx.font = '24px serif';
  ctx.fillText(`score: ${game.score}`, 0, 30);
}

function hitCheck() {
  for (const enemy of game.enemys) {
    if (
      Math.abs(game.mamosyou.x - enemy.x) < game.mamosyou.width * 0.8 / 2 + enemy.width / 2 &&
      Math.abs(game.mamosyou.y - enemy.y) < game.mamosyou.height * 0.5 / 2 + enemy.height / 2
    ) {
      game.isGameOver = true;
      ctx.font = 'bold 100px serif';
      ctx.fillText(`Game Over!`, 150, 200);
      clearInterval(game.timer);
    }
  }
}
document.onkeydown = (e) => {
  if(e.code === 'Space' && game.mamosyou.moveY == 0) {
    game.mamosyou.moveY = -41;
  }
  if (e.code === 'Enter' && game.isGameOver) {
    init();
  }
};