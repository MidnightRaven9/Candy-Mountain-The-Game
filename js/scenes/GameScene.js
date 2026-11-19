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

  preload() {
    this.load.image('charlie', SPRITE_DATA.charlie);
    this.load.image('buddyBlue', SPRITE_DATA.buddyBlue);
    this.load.image('buddyPink', SPRITE_DATA.buddyPink);
  }

  create() {
    const { width, height } = this.scale;
    const floorY = height - 34;
    const ceilY = 34;
    const spriteLoaded = this.textures.exists('charlie');
    TextureFactory.createTextures(this);
    TextureFactory.ensureCreatures(this);
    if (window.gameStatus) {
      window.gameStatus('Play · ' + (spriteLoaded ? 'sprite OK' : 'FALLBACK art'));
    }

    // Full-bleed painted sky and rainbow backdrop.
    this.add.image(width / 2, height / 2, 'sky').setOrigin(0.5);

    // Candy Mountain is visible far ahead at the end of the run.
    this.add.image(width - 22, floorY + 1, 'mountain').setOrigin(0.5, 1).setScale(1.08).setAlpha(0.96);

    // Ground (visual strip + invisible solid floor).
    this.add.tileSprite(width / 2, floorY + 20, width, 40, 'ground');
    const groundBody = this.physics.add.staticSprite(width / 2, floorY + 20, 'ground');
    groundBody.body.setSize(width, 40);
    groundBody.setVisible(false);
    groundBody.refreshBody();

    // Invisible ceiling prevents gear 2 from running off the top.
    const ceilingBody = this.physics.add.staticSprite(width / 2, ceilY - 40, 'ground');
    ceilingBody.setVisible(false);
    ceilingBody.body.setSize(width, 80);
    ceilingBody.refreshBody();
    this.ground = this.physics.add.staticGroup();
    this.ground.add(groundBody).add(ceilingBody);

    // Charlie: friendly white parody unicorn with rainbow-toned mane.
    this.player = this.physics.add.sprite(132, 338, 'charlie');
    this.player.setOrigin(0.5);
    this.player.setScale(165 / this.player.height);
    this.player.setCollideWorldBounds(false);
    this.player.setGravityY(520);
    const pw = this.player.width;
    const ph = this.player.height;
    this.player.body.setSize(pw * 0.72, ph * 0.34);
    this.player.body.setOffset(pw * 0.12, ph * 0.62);
    this.player.setDepth(20);

    // The two obnoxious companions from the video—floating buddies.
    this.companion1 = this.add.sprite(width * 0.38, height * 0.24, 'buddyBlue').setDepth(12).setAlpha(0.96);
    this.companion1.setScale(92 / this.companion1.height);
    this.companion2 = this.add.sprite(width * 0.74, height * 0.56, 'buddyPink').setDepth(12).setAlpha(0.96);
    this.companion2.setScale(88 / this.companion2.height);
    this.buddyBase = [
      { s: this.companion1, y: this.companion1.y, phase: 0 },
      { s: this.companion2, y: this.companion2.y, phase: 2.1 }
    ];

    // Obstacles.
    this.obstacles = this.physics.add.group();

    // HUD.
    const hudStyle = {
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      stroke: '#121a32',
      strokeThickness: 4
    };
    this.gearDisplay = this.add.text(14, 12, 'GEAR: 1', Object.assign({
      fontSize: 24, color: '#ffd84d'
    }, hudStyle)).setScrollFactor(0).setDepth(100);

    this.distanceText = this.add.text(14, 42, 'DIST: 0 m', Object.assign({
      fontSize: 19, color: '#ffffff'
    }, hudStyle)).setScrollFactor(0).setDepth(100);

    this.goalText = this.add.text(width - 14, 12, 'GOAL: ' + this.targetDistance + ' m', Object.assign({
      fontSize: 17, color: '#ffffff'
    }, hudStyle)).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Collisions.
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, this.obstacles, this.onPlayerHit, null, this);

    // Input: SHIFT cycles 1 -> 2 -> 3 -> 4 -> 1.
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

    // Tap/click also shifts gear.
    this.input.on('pointerdown', () => {
      if (this.isGameOver) return;
      if (this.time.now - this.time.lastShift < this.gearCooldown) return;
      this.time.lastShift = this.time.now;
      this.shiftGear();
    });

    this.nextObstacleAt = 1600;

    // Clouds drifting across the painted sky.
    this.clouds = [];
    for (let i = 0; i < 7; i++) {
      const c = this.add.image(Phaser.Math.Between(0, width), Phaser.Math.Between(24, 185), 'cloud');
      c.setAlpha(Phaser.Math.FloatBetween(0.55, 0.9));
      c.setScale(Phaser.Math.FloatBetween(0.65, 1.35));
      this.clouds.push({ c, speed: Phaser.Math.Between(6, 18) });
    }
  }

  shiftGear() {
    // 1 -> 2 -> 3 -> 4 -> 1
    this.gear = this.gear % 4 + 1;
    this.gearDisplay.setText('GEAR: ' + this.gear);
    this.gearDisplay.setColor(this.gear === 4 ? '#ff5c5c' : this.gear === 2 ? '#8ce7ff' : '#ffd84d');

    // Reset slow-time when leaving gear 3.
    this.slowMoActive = false;
    this.physics.world.timeScale = 1;

    switch (this.gear) {
      case 1:
        this.player.setGravityY(520);
        this.cameras.main.flash(0x87ceff, 70, 0.08);
        break;
      case 2:
        this.player.setGravityY(-520);
        this.cameras.main.flash(0xffffff, 120, 0.25);
        break;
      case 3:
        this.slowMoActive = true;
        this.physics.world.timeScale = 0.45;
        this.player.setGravityY(520);
        this.cameras.main.flash(0xb8e8ff, 120, 0.3);
        this.time.delayedCall(3000, () => {
          if (this.gear === 3) {
            this.physics.world.timeScale = 1;
            this.gear = 1;
            this.gearDisplay.setText('GEAR: 1');
            this.gearDisplay.setColor('#ffd84d');
          }
        });
        break;
      case 4:
        this.nitroActive = true;
        this.player.setGravityY(520);
        this.cameras.main.flash(0xff9f43, 120, 0.25);
        this.time.delayedCall(2500, () => {
          if (this.gear === 4) {
            this.nitroActive = false;
            this.gear = 1;
            this.gearDisplay.setText('GEAR: 1');
            this.gearDisplay.setColor('#ffd84d');
          }
        });
        break;
    }
  }

  spawnObstacle() {
    const { width, height } = this.scale;
    const x = width + 60;
    const lane = Phaser.Math.Between(0, 1); // 0 = low, 1 = high
    let kind = Phaser.Math.Between(0, 1) === 0 ? 'cane' : 'lollipop';
    if (lane === 1) kind = Phaser.Math.Between(0, 1) === 0 ? 'rainbow' : 'cane';

    const y = lane === 0 ? height - 34 - 22 : 82;
    const obstacle = this.obstacles.create(x, y, kind);
    obstacle.setVelocityX(-this.baseSpeed);
    obstacle.setImmovable(true);
    obstacle.body.setAllowGravity(false);
    if (kind === 'cane') obstacle.body.setSize(13, 40);
    if (kind === 'lollipop') obstacle.body.setSize(20, 36);
    if (kind === 'rainbow') obstacle.body.setSize(63, 21);
    obstacle.setDepth(15);

    this.nextObstacleAt = this.time.now + Phaser.Math.Between(850, 1450);
  }

  onPlayerHit() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.cameras.main.shake(180, 0.012);
    this.physics.pause();

    this.add.rectangle(400, 250, 800, 500, 0x101a3a, 0.78).setDepth(80);
    this.add.text(400, 166, 'CRASHED!', {
      fontFamily: 'Courier New', fontSize: 48, fontStyle: 'bold', color: '#ff5c5c',
      stroke: '#2a143d', strokeThickness: 7
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);

    const quips = ['Better luck next time.', 'The buddies laughed.', 'The candy was already taken.', 'They almost got your organs.'];
    this.add.text(400, 235, quips[Phaser.Math.Between(0, quips.length - 1)], {
      fontFamily: 'Courier New', fontSize: 22, color: '#ffffff', stroke: '#2a143d', strokeThickness: 5
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);

    this.showRestartButton(false);
  }

  showRestartButton(toMenu) {
    const btn = this.add.text(400, 330, toMenu ? 'PRESS SHIFT FOR MENU' : 'PRESS SHIFT TO TRY AGAIN', {
      fontFamily: 'Courier New', fontSize: 22, fontStyle: 'bold', color: '#ffd84d',
      stroke: '#2a143d', strokeThickness: 5
    }).setOrigin(0.5).setScrollFactor(0).setDepth(82).setInteractive({ useHandCursor: true });

    const restart = () => toMenu ? this.scene.start('MenuScene') : this.restartGame();
    btn.on('pointerdown', restart);
    this.addShiftKey(() => {
      if (this.isGameOver) restart();
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
    this.cameras.main.flash(0xffd84d, 500, 0.45);

    this.add.rectangle(400, 250, 800, 500, 0x102b3a, 0.72).setDepth(80);
    this.add.text(400, 140, 'YOU REACHED', {
      fontFamily: 'Courier New', fontSize: 36, fontStyle: 'bold', color: '#ffd84d',
      stroke: '#241538', strokeThickness: 7
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);
    this.add.text(400, 192, 'CANDY MOUNTAIN!', {
      fontFamily: 'Courier New', fontSize: 44, fontStyle: 'bold', color: '#ff5ca8',
      stroke: '#241538', strokeThickness: 8
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);
    this.add.text(400, 258, '…but the buddies came for your organs.', {
      fontFamily: 'Courier New', fontSize: 20, color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);
    this.add.text(400, 296, 'Final gear: ' + this.gear + '  •  Distance: ' + Math.floor(this.distance) + ' m', {
      fontFamily: 'Courier New', fontSize: 18, color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);

    this.showRestartButton(true);
  }

  update(time, delta) {
    if (this.isGameOver) return;

    this._badgeClock = (this._badgeClock || 0) + delta;
    if (this._badgeClock > 500) {
      this._badgeClock = 0;
      if (window.gameStatus) {
        window.gameStatus('Play · ' + Math.floor(this.distance) + 'm · G' + this.gear);
      }
    }

    const dt = Math.min(delta / 1000, 0.05);
    const travel = (this.nitroActive ? this.baseSpeed * 1.8 : this.baseSpeed) * dt;
    this.distance += travel / 24;
    this.distanceText.setText('DIST: ' + Math.floor(this.distance) + ' m');

    this.clouds.forEach(({ c, speed }) => {
      c.x -= speed * dt;
      if (c.x < -60) {
        c.x = this.scale.width + Phaser.Math.Between(0, 80);
        c.y = Phaser.Math.Between(20, 185);
      }
    });

    this.buddyBase.forEach(({ s, y, phase }) => {
      s.y = y + Math.sin(time / 430 + phase) * 18;
      s.x -= dt * 12;
      if (s.x < -60) s.x = this.scale.width + 60;
    });

    if (this.time.now >= this.nextObstacleAt) this.spawnObstacle();

    this.obstacles.getChildren().forEach((o) => {
      if (o.x < -80) o.destroy();
    });

    if (this.distance >= this.targetDistance) this.win();
  }
}
