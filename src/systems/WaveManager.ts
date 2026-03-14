import Phaser from 'phaser';
import { HeavyEnemy } from '../entities/HeavyEnemy';
import { LightEnemy } from '../entities/LightEnemy';
import type { Enemy } from '../entities/Enemy';

interface Wave {
  lights: number;
  heavies: number;
}

export class WaveManager {
  private readonly waves: Wave[] = [
    { lights: 2, heavies: 0 },
    { lights: 2, heavies: 1 },
    { lights: 3, heavies: 1 }
  ];

  private waveIndex = -1;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemies: Phaser.GameObjects.Group,
    private readonly onWaveChanged: (value: number) => void,
    private readonly onCompleted: () => void
  ) {}

  spawnNextWave(): void {
    this.waveIndex += 1;

    if (this.waveIndex >= this.waves.length) {
      this.onCompleted();
      return;
    }

    const current = this.waves[this.waveIndex];
    const centerX = this.scene.scale.width / 2;

    for (let i = 0; i < current.lights; i += 1) {
      const enemy = new LightEnemy(this.scene, centerX + Phaser.Math.Between(-240, 240), Phaser.Math.Between(170, 420));
      this.enemies.add(enemy);
    }

    for (let i = 0; i < current.heavies; i += 1) {
      const enemy = new HeavyEnemy(this.scene, centerX + Phaser.Math.Between(-260, 260), Phaser.Math.Between(170, 420));
      this.enemies.add(enemy);
    }

    this.onWaveChanged(this.waveIndex + 1);
  }

  hasActiveEnemies(): boolean {
    return this.enemies.getChildren().some((obj) => (obj as Enemy).active);
  }

  getWaveNumber(): number {
    return this.waveIndex + 1;
  }
}
