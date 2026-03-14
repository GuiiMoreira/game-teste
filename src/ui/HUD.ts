import Phaser from 'phaser';
import { HealthBar } from './HealthBar';

export class HUD {
  readonly healthBar: HealthBar;
  readonly waveText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.healthBar = new HealthBar(scene, 24, 28);
    this.waveText = scene.add.text(24, 48, 'Onda 1/1', { fontSize: '16px', color: '#ffffff' });
  }

  setWave(current: number, total: number): void {
    this.waveText.setText(`Onda ${current}/${total}`);
  }
}
