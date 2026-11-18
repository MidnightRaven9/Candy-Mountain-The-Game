/** Phaser 3 Game Configuration for Game Off 2026 */
export const PHASER_CONFIG = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: [MenuScene, GameScene, GameOverScene],
  backgroundColor: '#87CEEB', // sky blue
  pixelArt: true,
  roundPixels: true
};