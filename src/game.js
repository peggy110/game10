// src/game.js
// HTML5 Canvas 射擊遊戲主程式

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.player = { x: this.width / 2 - 20, y: this.height - 40, w: 40, h: 20, speed: 5 };
    this.bullets = [];
    this.enemies = [];
    this.score = 0;
    this.left = false;
    this.right = false;
    this.shooting = false;
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => this.keyDown(e));
    document.addEventListener('keyup', (e) => this.keyUp(e));
    this.spawnEnemy();
    requestAnimationFrame(() => this.loop());
  }

  keyDown(e) {
    if (e.code === 'ArrowLeft') this.left = true;
    if (e.code === 'ArrowRight') this.right = true;
    if (e.code === 'Space') this.shooting = true;
  }

  keyUp(e) {
    if (e.code === 'ArrowLeft') this.left = false;
    if (e.code === 'ArrowRight') this.right = false;
    if (e.code === 'Space') this.shooting = false;
  }

  spawnEnemy() {
    const x = Math.random() * (this.width - 40);
    this.enemies.push({ x, y: 0, w: 40, h: 20, speed: 2 });
    setTimeout(() => this.spawnEnemy(), 1000);
  }

  shoot() {
    this.bullets.push({ x: this.player.x + this.player.w / 2 - 2, y: this.player.y, w: 4, h: 10, speed: 7 });
  }

  update() {
    // 玩家移動
    if (this.left) this.player.x -= this.player.speed;
    if (this.right) this.player.x += this.player.speed;
    this.player.x = Math.max(0, Math.min(this.width - this.player.w, this.player.x));
    // 子彈發射
    if (this.shooting && this.bullets.length < 5) {
      this.shoot();
      this.shooting = false;
    }
    // 更新子彈
    this.bullets.forEach(b => b.y -= b.speed);
    this.bullets = this.bullets.filter(b => b.y > -b.h);
    // 更新敵人
    this.enemies.forEach(e => e.y += e.speed);
    this.enemies = this.enemies.filter(e => e.y < this.height + e.h);
    // 碰撞檢查
    this.bullets.forEach((b, bi) => {
      this.enemies.forEach((e, ei) => {
        if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
          this.bullets.splice(bi, 1);
          this.enemies.splice(ei, 1);
          this.score++;
        }
      });
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    // 畫玩家
    this.ctx.fillStyle = '#09f';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.w, this.player.h);
    // 畫子彈
    this.ctx.fillStyle = '#ff0';
    this.bullets.forEach(b => this.ctx.fillRect(b.x, b.y, b.w, b.h));
    // 畫敵人
    this.ctx.fillStyle = '#f44';
    this.enemies.forEach(e => this.ctx.fillRect(e.x, e.y, e.w, e.h));
    // 畫分數
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText('Score: ' + this.score, 10, 30);
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}
