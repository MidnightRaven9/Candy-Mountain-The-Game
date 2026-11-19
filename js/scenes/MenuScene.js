class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('charlie', 'assets/charlie-unicorn.png');
    this.load.image('buddyBlue', 'assets/buddy-blue.png');
    this.load.image('buddyPink', 'assets/buddy-pink.png');
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    if (window.gameStatus) window.gameStatus('Menu');

    TextureFactory.createTextures(this);

    // Full-bleed painted sunset / rainbow / mountains.
    this.add.image(centerX, height / 2, 'sky');

    // Candy Mountain rises from behind the title.
    this.add.image(centerX + 115, height + 40, 'mountain').setOrigin(0.5, 1).setScale(1.55).setAlpha(0.96);

    // Running parody unicorn toward Candy Mountain.
    const charlie = this.add.image(258, height - 112, 'charlie').setDepth(20);
    charlie.setScale(170 / charlie.height);
    const blue = this.add.image(width - 150, height - 120, 'buddyBlue').setDepth(18);
    blue.setScale(96 / blue.height);
    const pink = this.add.image(width - 78, height - 208, 'buddyPink').setDepth(17);
    pink.setScale(84 / pink.height);

    // Title block with strong contrast over sky.
    this.add.text(centerX, 46, 'CANDY MOUNTAIN', {
      fontFamily: 'Courier New',
      fontSize: 56,
      fontStyle: 'bold',
      color: '#ffd84d',
      stroke: '#571633',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, 92, 'THE GAME  •  GAME OFF 2026', {
      fontFamily: 'Courier New',
      fontSize: 19,
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#1d2b4d',
      strokeThickness: 4
    }).setOrigin(0.5);

    // SHIFT theme callout.
    this.add.text(centerX, 134, 'SHIFT GEARS  •  SHIFT GRAVITY  •  SHIFT SPEED', {
      fontFamily: 'Courier New',
      fontSize: 15,
      fontStyle: 'bold',
      color: '#ffd6f3',
      stroke: '#571633',
      strokeThickness: 3
    }).setOrigin(0.5);

    const startHint = this.add.text(centerX, height - 44, 'TAP OR PRESS SHIFT TO RUN', {
      fontFamily: 'Courier New',
      fontSize: 23,
      fontStyle: 'bold',
      color: '#9df2ff',
      stroke: '#123047',
      strokeThickness: 5
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const startGame = () => this.scene.start('GameScene');
    this.input.keyboard.on('keydown-SHIFT', startGame);
    this.input.keyboard.on('keydown_SHIFT', startGame);
    this.input.on('pointerdown', startGame);
    startHint.on('pointerdown', startGame);

    // Small parody credits.
    this.add.text(centerX, height - 22, 'Inspired by Charlie The Unicorn (parody) • An original artwork fan homage', {
      fontFamily: 'Courier New',
      fontSize: 11,
      color: '#ead7ff'
    }).setOrigin(0.5);
  }
}
