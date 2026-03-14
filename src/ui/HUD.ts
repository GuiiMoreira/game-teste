import Phaser from 'phaser';
import { HealthBar } from './HealthBar';

export class HUD {
  readonly healthBar: HealthBar;
  readonly waveText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.healthBar = new HealthBar(scene, 24, 28);
    this.waveText = scene.add.text(24, 48, 'Wave 1', { fontSize: '16px', color: '#ffffff' });
  }

  setWave(value: number): void {
    this.waveText.setText(`Wave ${value}`);
  }
}
