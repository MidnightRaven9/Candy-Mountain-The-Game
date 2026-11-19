class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;

    // Title
    const title = this.add.text(centerX, 80, 'SHIFT MOUNTAIN', {
      font: 'bold 32px Courier',
      color: '#ffd700',
      align: 'center'
    }).setOrigin(0.5);

    // Subtitle / theme
    this.add.text(centerX, 120, 'A Gear-Shift Racer', {
      font: '16px Courier',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, 140, 'Theme: SHIFT • Game Off 2026', {
      font: '12px Courier',
      color: '#888',
      align: 'center'
    }).setOrigin(0.5);

    // Start instruction - listen for SHIFT key globally
    const startHint = this.add.text(centerX, height - 80, 'PRESS SHIFT TO START', {
      font: 'bold 20px Courier',
      color: '#0f0',
      align: 'center'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown_SHIFT', () => this.scene.start('GameScene'));

    // Video nod / credits
    this.add.text(centerX, height - 160, 'Inspired by: Charlie The Unicorn', {
      font: '12px Courier',
      color: '#888',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(centerX, height - 140, 'Two obnoxious blue companions...', {
      font: '10px Courier',
      color: '#666',
      align: 'center'
    }).setOrigin(0.5);
  }
}