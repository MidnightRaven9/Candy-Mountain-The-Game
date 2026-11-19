class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gear = 1;
    this.gearCooldown = 200;
    this.distance = 0;
    this.targetDistance = 500; // meters to reach Candy Mountain
    this.baseSpeed = 240;
    this.slowMoActive = false;
    this.nitroActive = false;
    this.isGameOver = false;
  }

  create() {
    const { width, height } = this.scale;
    const floorY = height - 34;
    const ceilY = 34;

    // ---- Generate all textures procedurally ----
    this.makeTextures();

    // ---- Sky gradient background ----
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Decorative distant mountain (the goal!) pinned to far-right world side
    const mountainStripe = this.add.image(width - 30, floorY - 60, 'mountain');
    mountainStripe.setOrigin(0.5, 1);
    mountainStripe.setScrollFactor(0);
    mountainStripe.setAlpha(0.55);

    // ---- Ground (visual + solid floor) ----
    this.ground = this.physics.add.staticGroup();
    const groundSeg = this.add.image(width / 2, floorY + 20, 'ground');
    const groundBody = this.physics.add.staticSprite(width / 2, floorY + 20, 'ground');
    groundBody.body.setSize(width, 40); // invisible solid floor body
    groundBody.setVisible(false);
    groundBody.refreshBody();
    this.ground.add(groundBody);

    // Invisible ceiling so gear 2 (reverse gravity) doesn't fly out of bounds
    const ceilingBody = this.physics.add.staticSprite(width / 2, ceilY - 40, 'ground');
    ceilingBody.setVisible(false);
    ceilingBody.body.setSize(width, 80);
    ceilingBody.refreshBody();
    this.ground.add(ceilingBody);

    // ---- Charlie the Unicorn (player) ----
    this.player = this.physics.add.sprite(90, floorY - 24, 'unicorn');
    this.player.setCollideWorldBounds(false);
    this.player.setGravityY(520);
    this.player.body.setSize(34, 38);

    // ---- Two obnoxious companions (from the video) — drift decoratively ----
    this.companion1 = this.add.sprite(width * 0.35, height * 0.22, 'buddy');
    this.companion2 = this.add.sprite(width * 0.72, height * 0.55, 'buddy');
    this.companion1.setAlpha(0.9);
    this.companion2.setAlpha(0.9);
    this.buddyBase = [
      { s: this.companion1, y: this.companion1.y, phase: 0 },
      { s: this.companion2, y: this.companion2.y, phase: 2.1 }
    ];

    // ---- Obstacles ----
    this.obstacles = this.physics.add.group();

    // ---- UI ----
    this.gearDisplay = this.add.text(12, 10, 'GEAR: 1', {
      fontFamily: 'Courier New', fontSize: 22, fontStyle: 'bold', color: '#ffd700'
    }).setScrollFactor(0);

    this.distanceText = this.add.text(12, 36, 'DIST: 0 m', {
      fontFamily: 'Courier New', fontSize: 18, color: '#ffffff'
    }).setScrollFactor(0);

    this.goalText = this.add.text(width - 12, 10, 'GOAL: ' + this.targetDistance + ' m', {
      fontFamily: 'Courier New', fontSize: 16, color: '#ffffff'
    }).setOrigin(1, 0).setScrollFactor(0);

    // ---- Collisions ----
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.obstacles, this.onPlayerHit, null, this);

    // ---- Input: SHIFT cycles 1 -> 2 -> 3 -> 4 -> 1 ----
    this.time.lastShift = 0;
    this.addShiftKey = (cb) => {
      this.input.keyboard.on('keydown_SHIFT', cb);
      this.input.keyboard.on('keydown-SHIFT', cb);
    };
    this.addShiftKey(() => {
      if (this.isGameOver) return;
      if (this.time.now - this.time.lastShift < this.gearCooldown) return;
      this.time.lastShift = this.time.now;
      this.shiftGear();
    });
    // Touch: tapping anywhere also shifts gear (handy on phones)
    this.input.on('pointerdown', () => {
      if (this.isGameOver) return;
      if (this.time.now - this.time.lastShift < this.gearCooldown) return;
      this.time.lastShift = this.time.now;
      this.shiftGear();
    });

    // ---- Obstacle spawner ----
    this.nextObstacleAt = 600;

    // Background clouds drifting
    this.clouds = [];
    for (let i = 0; i < 6; i++) {
      const c = this.add.image(Phaser.Math.Between(0, width), Phaser.Math.Between(20, height * 0.4), 'cloud');
      c.setAlpha(0.85);
      this.clouds.push({ c, speed: Phaser.Math.Between(6, 18) });
    }
  }

  makeTextures() {
    const g = this.add.graphics();

    // Unicorn (Charlie): gold body, blue mane, horn, eye
    g.fillStyle(0xffd700);
    g.fillRoundedRect(0, 8, 42, 22, 8);
    g.fillCircle(38, 4, 12);
    g.fillStyle(0x00bfff);
    g.fillRoundedRect(4, 8, 14, 8, 3);
    g.fillTriangle(44, -12, 36, 6, 50, 6);
    g.fillStyle(0xffffff);
    g.fillCircle(42, 2, 2.5);
    g.generateTexture('unicorn', 56, 40);

    // Blue buddy companion
    g.clear();
    g.fillStyle(0x1e90ff);
    g.fillRoundedRect(4, 8, 28, 20, 6);
    g.fillCircle(26, 4, 8);
    g.fillTriangle(30, -6, 22, 6, 36, 6);
    g.fillStyle(0xffffff);
    g.fillCircle(29, 2, 2);
    g.generateTexture('buddy', 44, 34);

    // Ground
    g.clear();
    g.fillStyle(0x2e8b2e);
    g.fillRect(0, 0, 64, 40);
    g.fillStyle(0x3cb371);
    g.fillRect(0, 0, 64, 8);
    g.generateTexture('ground', 64, 40);

    // Cloud
    g.clear();
    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(14, 10, 12);
    g.fillCircle(30, 6, 14);
    g.fillCircle(46, 10, 12);
    g.fillRect(8, 10, 46, 12);
    g.generateTexture('cloud', 64, 30);

    // Candy cane (top lane hazard)
    g.clear();
    g.fillStyle(0xffffff);
    g.fillRoundedRect(4, 0, 12, 44, 6);
    g.fillStyle(0xff0000);
    g.fillRect(4, 8, 12, 8);
    g.fillRect(4, 24, 12, 8);
    g.generateTexture('cane', 22, 46);

    // Lollipop spike (bottom lane hazard)
    g.clear();
    g.fillStyle(0xff69b4);
    g.fillCircle(12, 10, 12);
    g.fillStyle(0xffffff);
    g.fillCircle(12, 10, 5);
    g.fillStyle(0xff1493);
    g.fillCircle(12, 10, 2);
    g.fillStyle(0xc2b280);
    g.fillRect(10, 20, 4, 22);
    g.generateTexture('lollipop', 26, 44);

    // Rainbow bridge fragment (floating top hazard)
    g.clear();
    const rainbow = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x8b00ff];
    rainbow.forEach((c, i) => {
      g.fillStyle(c);
      g.fillRect(0, i * 5, 64, 5);
    });
    g.generateTexture('rainbow', 64, 30);

    // Distant Candy Mountain silhouette
    g.clear();
    g.fillStyle(0xff8c00);
    g.fillTriangle(70, 90, 10, 140, 130, 140);
    g.fillTriangle(45, 90, -30, 140, 110, 140);
    g.fillStyle(0xff1493);
    g.fillTriangle(70, 90, 50, 116, 92, 116);
    g.generateTexture('mountain', 160, 150);

    g.destroy();
  }

  shiftGear() {
    // 1 -> 2 -> 3 -> 4 -> 1
    this.gear = this.gear % 4 + 1;
    this.gearDisplay.setText('GEAR: ' + this.gear);
    this.gearDisplay.setColor(this.gear === 4 ? '#ff4500' : '#ffd700');

    // Reset time-slow if leaving gear 3
    this.slowMoActive = false;
    this.physics.world.timeScale = 1;

    switch (this.gear) {
      case 1:
        // Normal gravity (falls to floor)
        this.player.setGravityY(520);
        break;
      case 2:
        // Reverse gravity (falls toward the sky)
        this.player.setGravityY(-520);
        this.cameras.main.flash(0xffffff, 120, 0.25);
        break;
      case 3:
        // Slow time for everything (auto-returns to 1 after 3s)
        this.slowMoActive = true;
        this.physics.world.timeScale = 0.45;
        this.player.setGravityY(520);
        this.cameras.main.flash(0x87ceff, 120, 0.3);
        this.time.delayedCall(3000, () => {
          if (this.gear === 3) {
            this.physics.world.timeScale = 1;
            this.gear = 1;
            this.gearDisplay.setText('GEAR: 1');
            this.gearDisplay.setColor('#ffd700');
          }
        });
        break;
      case 4:
        // Nitro boost (faster distance accrual; auto-returns after 2.5s)
        this.nitroActive = true;
        this.player.setGravityY(520);
        this.time.delayedCall(2500, () => {
          if (this.gear === 4) {
            this.nitroActive = false;
            this.gear = 1;
            this.gearDisplay.setText('GEAR: 1');
            this.gearDisplay.setColor('#ffd700');
          }
        });
        break;
    }
  }

  spawnObstacle() {
    const { width, height } = this.scale;
    const x = width + 60;
    // Obstacles sit in a lane: bottom (sitting on the ground) or top (floating high)
    const lane = Phaser.Math.Between(0, 1); // 0 = bottom, 1 = top
    let kind;
    if (lane === 0) {
      kind = Phaser.Math.Between(0, 1) === 0 ? 'cane' : 'lollipop';
    } else {
      kind = Phaser.Math.Between(0, 1) === 0 ? 'rainbow' : 'cane';
    }
    const y = lane === 0 ? height - 34 - 22 : 90;
    const obstacle = this.obstacles.create(x, y, kind);
    obstacle.setVelocityX(-this.baseSpeed);
    obstacle.setImmovable(true);
    obstacle.body.setAllowGravity(false);
    // Match body to texture roughly
    if (kind === 'cane') obstacle.body.setSize(14, 42);
    if (kind === 'lollipop') obstacle.body.setSize(18, 34);
    if (kind === 'rainbow') obstacle.body.setSize(58, 26);

    this.nextObstacleAt = this.time.now + Phaser.Math.Between(900, 1600);
  }

  onPlayerHit(player, obstacle) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.cameras.main.shake(180, 0.012);
    this.physics.pause();

    // Freeze everything
    this.add.text(400, 210, 'CRASHED!', {
      fontFamily: 'Courier New', fontSize: 40, fontStyle: 'bold', color: '#f00'
    }).setOrigin(0.5).setScrollFactor(0);

    const quips = [
      'Better luck next time.',
      'The companions laughed.',
      'Candy was already taken.',
      'They almost got your organs.'
    ];
    this.add.text(400, 260, quips[Phaser.Math.Between(0, quips.length - 1)], {
      fontFamily: 'Courier New', fontSize: 20, color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);

    this.showRestartButton();
  }

  showRestartButton() {
    const btn = this.add.text(400, 330, 'PRESS SHIFT TO TRY AGAIN', {
      fontFamily: 'Courier New', fontSize: 20, fontStyle: 'bold', color: '#ffd700'
    }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.restartGame());
    this.addShiftKey(() => {
      if (this.isGameOver) this.restartGame();
    });
  }

  restartGame() {
    this.scene.stop('GameScene');
    this.scene.start('GameScene');
  }

  win() {
    this.isGameOver = true;
    this.physics.pause();
    this.cameras.main.stopFollow();
    this.cameras.main.flash(0xffff00, 400, 0.4);

    this.add.text(400, 180, 'YOU REACHED', {
      fontFamily: 'Courier New', fontSize: 34, fontStyle: 'bold', color: '#ffd700'
    }).setOrigin(0.5).setScrollFactor(0);
    this.add.text(400, 225, 'CANDY MOUNTAIN!', {
      fontFamily: 'Courier New', fontSize: 40, fontStyle: 'bold', color: '#ff69b4'
    }).setOrigin(0.5).setScrollFactor(0);
    this.add.text(400, 285, 'But the companions came for your organs...', {
      fontFamily: 'Courier New', fontSize: 17, color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);
    this.add.text(400, 315, `Final gear: ${this.gear}  -  Distance: ${Math.floor(this.distance)} m`, {
      fontFamily: 'Courier New', fontSize: 18, color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0);

    const btn = this.add.text(400, 375, 'PRESS SHIFT TO PLAY AGAIN', {
      fontFamily: 'Courier New', fontSize: 20, fontStyle: 'bold', color: '#ffd700'
    }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.scene.start('MenuScene'));
    this.addShiftKey(() => {
      if (this.isGameOver) this.scene.start('MenuScene');
    });
  }

  update(time, delta) {
    if (this.isGameOver) return;

    const dt = Math.min(delta / 1000, 0.05);

    // Advance distance — faster in gear 4 (nitro)
    const travel = (this.nitroActive ? this.baseSpeed * 1.8 : this.baseSpeed) * dt;
    this.distance += travel / 24; // ~10 m per second at base speed
    this.distanceText.setText('DIST: ' + Math.floor(this.distance) + ' m');

    // Scroll background clouds
    this.clouds.forEach(({ c, speed }) => {
      c.x -= speed * dt;
      if (c.x < -60) {
        c.x = this.scale.width + Phaser.Math.Between(0, 80);
        c.y = Phaser.Math.Between(20, this.scale.height * 0.4);
      }
    });

    // Companions bob gently
    this.buddyBase.forEach(({ s, y, phase }) => {
      s.y = y + Math.sin(time / 450 + phase) * 18;
      s.x -= dt * 12;
      if (s.x < -60) s.x = this.scale.width + 60;
    });

    // Spawn obstacles on schedule
    if (this.time.now >= this.nextObstacleAt) {
      this.spawnObstacle();
    }

    // Remove obstacles that have scrolled off the left edge
    this.obstacles.getChildren().forEach((o) => {
      if (o.x < -80) {
        o.destroy();
      }
    });

    // Win condition: reach the mountain
    if (this.distance >= this.targetDistance) {
      this.win();
    }
  }
}
