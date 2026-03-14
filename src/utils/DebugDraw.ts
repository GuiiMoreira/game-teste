import Phaser from 'phaser';

export function drawDebugRect(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color = 0xff00ff): void {
  const g = scene.add.graphics();
  g.lineStyle(1, color, 1);
  g.strokeRect(x, y, width, height);
  scene.time.delayedCall(120, () => g.destroy());
}
