export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gear = 1;
    this.gearChangedAt = 0;
    this.gearCooldown = 150; // ms between shifts
    this.distance = 0;
    this.speed = 150; // pixels per second base
    this.isGameOver = false;
    this.betrayed = false;
    this.playerCreated = false;
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // Create player Charlie the Unicorn as a simple shape
    this.player = this.physics.add.sprite(centerX, height - 100, null);
    this.player.body.setSize(30, 40);
    this.player.body.setOffset(5, 10);
    this.player.color = 0xffd700; // gold - Charlie's coat
    this.player.maneColor = 0x00bfff; // deep sky blue mane

    // Draw Charlie as a simple silhouette
    const graphics = this.add.graphics();
    graphics.fillStyle(this.player.color);
    graphics.fillRoundedRect(0, 0, 30, 40, 4);
    graphics.fillStyle(this.player.maneColor);
    graphics.fillRoundedRect(5, 0, 20, 15, 2);
    graphics.fillStyle(0xffffff);
    graphics.fillRect(8, 3, 4, 4); // eye

    // Two blue companions (the obnoxious ones from the video)
    this.companion1 = this.physics.add.sprite(centerX - 40, height - 180, null);
    this.companion1.body.setSize(25, 30);
    this.companion1.body.setOffset(3, 5);
    this.drawCompanion(this.companion1, 0x00bfff, true); // blue

    this.companion2 = this.physics.add.sprite(centerX + 40, height - 150, null);
    this.companion2.body.setSize(25, 30);
    this.companion2.body.setOffset(3, 5);
    this.drawCompanion(this.companion2, 0x00bfff, false); // blue

    // Ground - endless scrolling using tiled blocks
    this.ground = this.physics.add.staticGroup();
    this.groundSegments = [];
    for (let i = 0; i < 8; i++) {
      const seg = this.ground.create(i * 120 + 60, height - 30, null);
      seg.body.setSize(100, 20);
      seg.body.setOffset(10, 10);
      // Draw ground block
      const g = this.add.graphics();
      g.fillStyle(0x228B22); // forest green
      g.fillRoundedRect(0, 0, 100, 20, 3);
      seg.graphics = g;
      this.groundSegments.push(seg);
    }
    // Position them initially
    this.alignGroundSegments();

    // Obstacles group - all drawn procedurally
    this.obstacles = this.physics.add.group();

    // UI
    this.gearDisplay = this.add.text(30, 30, 'GEAR: 1', {
      font: 'bold 24px Courier',
      color: '#ffd700'
    });

    this.distanceText = this.add.text(30, 70, 'DIST: 0 m', {
      font: '20px Courier',
      color: '#fff'
    });

    // Input: SHIFT to shift gears
    this.time.lastShift = 0;
    this.input.keyboard.on('keydown_SHIFT', (event) => {
      if (this.isGameOver) return;
      const now = this.time.now;
      if (now - this.time.lastShift > this.gearCooldown) {
        this.shiftGear();
        this.time.lastShift = now;
      }
    });

    // Camera follow
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, width, height * 3); // world bounds tall

    // Background: gradient sky
    this.background = this.add.graphics();
    this.background.fillStyle(0x87CEEB);
    this.background.fillRect(0, 0, width, height);

    // Clouds (background)
    this.clouds = this.add.group();
    for (let i = 0; i < 8; i++) {
      const cloud = this.clouds.create(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(30, height / 3)
      );
      this.drawCloud(cloud);
      cloud.setVelocityY(Phaser.Math.Between(10, 30));
    }

    // Start game loop
    this.time.addEvent({
      delay: 50,
      callback: this.updateLoop,
      callbackScope: this,
      loop: true
    });
  }

  drawCompanion(sprite, color, isLeft) {
    const g = this.add.graphics();
    g.fillStyle(color);
    // Body
    g.fillRoundedRect(0, 0, 25, 30, 4);
    // Ear
    g.fillStyle(color);
    g.fillTriangle(12, -5, 5, 5, 19, 5);
    // Eye
    g.fillStyle(0xffffff);
    g.fillRect(8, 8, 3, 3);
    sprite.graphics = g;
    // Direction
    sprite.velocityX = isLeft ? -50 : 50;
  }

  drawCloud(cloud) {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.6);
    // Cloud shape - three puffs
    g.fillCircle(0, 0, 20);
    g.fillCircle(35, 0, 20);
    g.fillCircle(70, 0, 18);
    // Connecting arches
    g.fillStyle(0xffffff, 0.6);
    g.beginPath();
    g.arc(20, 5, 15, Math.PI, 0);
    g.arc(50, 5, 15, Math.PI, 0);
    g.strokePath();
    cloud.graphics = g;
  }

  alignGroundSegments() {
    this.groundSegments.forEach((seg, i) => {
      seg.x = i * 120 + 60;
    });
  }

  shiftGear() {
    // Cycle gears: 1 → 2 → 3 → 4 → 1 (wrap at 4 for simplicity)
    this.gear = this.gear % 4 + 1;
    this.gearDisplay.setText(`GEAR: ${this.gear}`);

    // Apply gear effects immediately
    switch (this.gear) {
      case 1:
        // Normal: standard gravity
        this.physics.world.gravity.y = 300;
        this.player.body.setDrag(50, 0);
        break;
      case 2:
        // Reverse gravity!
        this.physics.world.gravity.y = -300;
        this.player.body.setDrag(50, 0);
        // Flip player upside down visually
        this.player.setFlippedX(!this.player.flippedX);
        break;
      case 3:
        // Slow time: visual flash + slow motion feel
        this.cameras.main.flash(0xffffff, 80, 0.2);
        // Reduce speed temporarily
        this.speed = this.speed * 0.5;
        this.time.delayedCall(2000, () => {
          this.speed = 150;
        });
        break;
      case 4:
        // Remove brakes: ice physics - player keeps sliding
        this.player.body.setDrag(0, 0);
        // Auto-revert to gear 1 after 1.5 seconds
        this.time.delayedCall(1500, () => {
          this.gear = 1;
          this.gearDisplay.setText('GEAR: 1');
          this.physics.world.gravity.y = 300;
        });
        break;
    }
  }

  updateLoop() {
    if (this.isGameOver) return;

    const delta = this.game.loop.delta / 1000; // seconds
    this.distance += this.speed * delta;
    this.distanceText.setText(`DIST: ${Math.floor(this.distance)} m`);

    // Move player forward automatically at current speed
    this.player.setVelocityX(this.speed);
    this.player.setVelocityY(0);

    // Update and move ground segments
    this.groundSegments.forEach((seg, i) => {
      seg.x -= this.speed * 0.4 * delta;
      // Wrap around
      if (seg.x < -60) {
        seg.x = this.groundSegments.length * 120 + 60;
      }
    });

    // Move companions
    this.companion1.x -= (50 + this.gear * 20) * delta;
    this.companion2.x += (50 + this.gear * 20) * delta;

    // Wrap companions
    if (this.companion1.x < -60) this.companion1.x = this.game.config.width + 60;
    if (this.companion2.x > this.game.config.width + 60) this.companion2.x = -60;

    // Spawn obstacles periodically
    this.spawnObstacle();

    // Check collisions with ground
    this.physics.collide(this.player, this.ground, this.onPlayerHit, null, this);

    // Check collisions with obstacles
    this.physics.collide(this.player, this.obstacles, this.onPlayerHit, null, this);

    // World scrolling reset
    this.resetWorld();

    // Check win condition (reach top / mountain)
    if (this.player.y < 50) {
      this.win();
    }
  }

  spawnObstacle() {
    // Spawn every 1.5-2.5 seconds
    if (this.game.loop.time - (this.lastObstacle || 0) > Phaser.Math.Between(1500, 2500)) {
      const obstacleType = Phaser.Math.Between(1, 3);
      const x = this.game.config.width + 40;
      let obstacle;

      switch (obstacleType) {
        case 1:
          // Candy cane obstacle
          obstacle = this.obstacles.create(x, 50, null);
          obstacle.body.setSize(30, 50);
          obstacle.body.setOffset(5, 10);
          const g1 = this.add.graphics();
          g1.fillStyle(0xff0000);
          g1.fillRoundedRect(0, 0, 30, 50, 5);
          g1.fillStyle(0xffffff);
          g1.fillRect(8, 15, 4, 8); // stripe
          obstacle.graphics = g1;
          break;
        case 2:
          // Lollipop spike
          obstacle = this.obstacles.create(x, 200, null);
          obstacle.body.setSize(20, 40);
          obstacle.body.setOffset(5, 10);
          const g2 = this.add.graphics();
          g2.fillStyle(0xff69b4);
          g2.fillRoundedRect(0, 0, 20, 40, 3);
          g2.fillStyle(0xffffff);
          g2.fillCircle(10, 10, 10); // candy top
          obstacle.graphics = g2;
          break;
        case 3:
          // Rainbow bridge fragment
          obstacle = this.obstacles.create(x, 350, null);
          obstacle.body.setSize(40, 30);
          obstacle.body.setOffset(10, 10);
          const g3 = this.add.graphics();
          g3.fillStyle(0xffffff);
          for (let i = 0; i < 7; i++) {
            g3.fillStyle(Phaser.Math.Between(0) > 0.5 ? 0xff0000 : 0x0000ff);
            g3.fillCircle(10 + i * 8, 15, 6);
          }
          g3.fillStyle(0xffd700);
          g3.fillRect(0, 20, 40, 10);
          obstacle.graphics = g3;
          break;
      }

      if (obstacle) {
        obstacle.setVelocityX(-this.speed * 0.7);
        obstacle.lastY = obstacle.y;
      }

      this.lastObstacle = this.game.loop.time;
    }
  }

  resetWorld() {
    // Reset any objects that scroll too far
    if (this.player.x > this.game.config.width + 100) {
      this.player.x = -100;
      this.player.y = this.game.config.height - 100;
    }
  }

  onPlayerHit(player, object) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.cameras.main.shake(200, 0.01);

    const messages = [
      'CRASHED! Better luck next time.',
      'Ouch! That looked painful.',
      'Maybe stick to running, not shifting.',
      'The companions laughed as you fell.'
    ];

    this.gameOver(messages[Math.floor(Math.random() * messages.length)]);
  }

  gameOver(message) {
    this.physics.pause();
    this.add.text(
      this.game.config.width / 2, this.game.config.height / 2 - 40,
      message, { font: 'bold 24px Courier', color: '#f00' }
    ).setOrigin(0.5);

    const finalDist = this.add.text(
      this.game.config.width / 2, this.game.config.height / 2,
      `Distance: ${Math.floor(this.distance)} m`, {
        font: '18px Courier',
        color: '#fff'
      }
    ).setOrigin(0.5);

    const restartBtn = this.add.text(
      this.game.config.width / 2, this.game.config.height / 2 + 80,
      'PRESS SHIFT TO RESTART', { font: 'bold 20px Courier', color: '#ffd700' }
    ).setOrigin(0.5).setInteractive();

    restartBtn.on('pointerdown', () => this.restart());
    restartBtn.on('keyup', (event) => {
      if (event.key === 'Shift') this.restart();
    });
  }

  restart() {
    this.scene.stop('GameScene');
    this.scene.start('GameScene');
  }

  win() {
    this.physics.pause();
    this.cameras.main.stopFollow();

    const winText = this.add.text(
      this.game.config.width / 2, this.game.config.height / 2 - 40,
      'YOU REACHED CANDY MOUNTAIN!', {
        font: 'bold 28px Courier',
        color: '#0f0'
      }
    ).setOrigin(0.5);

    const finalDist = this.add.text(
      this.game.config.width / 2, this.game.config.height / 2,
      `Distance traveled: ${Math.floor(this.distance)} m`, {
        font: '18px Courier',
        color: '#fff'
      }
    ).setOrigin(0.5);

    const gear = this.add.text(
      this.game.config.width / 2, this.game.config.height / 2 + 40,
      `Final gear: ${this.gearDisplay.text}`, {
        font: '18px Courier',
        color: '#ffd700'
      }
    ).setOrigin(0.5);

    const playAgain = this.add.text(
      this.game.config.width / 2, this.game.config.height / 2 + 80,
      'PRESS SHIFT TO PLAY AGAIN', { font: 'bold 20px Courier', color: '#fff' }
    ).setOrigin(0.5).setInteractive();

    playAgain.on('pointerdown', () => this.playAgain());
    playAgain.on('keyup', (event) => {
      if (event.key === 'Shift') this.playAgain();
    });
  }

  playAgain() {
    this.scene.stop('GameScene');
    this.scene.start('MenuScene');
  }
}