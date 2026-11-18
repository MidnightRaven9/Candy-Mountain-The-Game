export class GameOverScene extends Phaser.Scene {
  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;

    this.add.text(centerX, height / 2 - 40, 'GAME OVER', {
      font: 'bold 32px Courier',
      color: '#f00'
    }).setOrigin(0.5);

    const reason = this.registry.get('deathReason') || 'You crashed.';
    this.add.text(centerX, height / 2, reason, {
      font: '18px Courier',
      color: '#fff'
    }).setOrigin(0.5);

    const restartBtn = this.add.text(centerX, height / 2 + 80, 'PRESS SHIFT TO TRY AGAIN', {
      font: 'bold 20px Courier',
      color: '#ffd700'
    }).setOrigin(0.5).setInteractive();

    restartBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    restartBtn.on('keyup', (event) => {
      if (event.key === 'Shift') this.scene.start('MenuScene');
    });
  }
}