import Phaser from 'phaser';

export class HealthBar {
  private readonly bg: Phaser.GameObjects.Rectangle;
  private readonly fill: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, width = 240, height = 22) {
    this.bg = scene.add.rectangle(x, y, width, height, 0x2a2a3f).setOrigin(0, 0.5);
    this.fill = scene.add.rectangle(x + 2, y, width - 4, height - 4, 0x4ee86e).setOrigin(0, 0.5);
  }

  setPercent(value: number): void {
    const p = Phaser.Math.Clamp(value, 0, 1);
    this.fill.setScale(p, 1);
    this.fill.fillColor = p < 0.3 ? 0xe45757 : p < 0.55 ? 0xe8c14e : 0x4ee86e;
  }
}
