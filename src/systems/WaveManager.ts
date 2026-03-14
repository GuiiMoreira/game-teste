import Phaser from 'phaser';
import { HeavyEnemy } from '../entities/HeavyEnemy';
import { LightEnemy } from '../entities/LightEnemy';
import type { Enemy } from '../entities/Enemy';
import { WAVES, type WaveConfig } from '../config/Waves';

export interface WaveProgress {
  current: number;
  total: number;
}

export class WaveManager {
  private waveIndex = -1;
  private pendingSpawns = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly enemies: Phaser.GameObjects.Group,
    private readonly onWaveChanged: (value: WaveProgress) => void,
    private readonly onCompleted: () => void
  ) {}

  spawnNextWave(): void {
    if (this.pendingSpawns > 0) {
      return;
    }

    this.waveIndex += 1;

    if (this.waveIndex >= WAVES.length) {
      this.onCompleted();
      return;
    }

    const current = WAVES[this.waveIndex];
    const centerX = this.scene.scale.width / 2;
    const lightCount = this.pickCount(current.composition.lights.min, current.composition.lights.max);
    const heavyCount = this.pickCount(current.composition.heavies.min, current.composition.heavies.max);
    const totalToSpawn = lightCount + heavyCount;

    this.onWaveChanged({ current: this.waveIndex + 1, total: WAVES.length });

    if (totalToSpawn === 0) {
      return;
    }

    const queue: Array<() => void> = [
      ...Array.from({ length: lightCount }, () => () => {
        const enemy = new LightEnemy(this.scene, centerX + Phaser.Math.Between(-240, 240), Phaser.Math.Between(170, 420));
        this.applyWaveMultipliers(enemy, current);
        this.enemies.add(enemy);
      }),
      ...Array.from({ length: heavyCount }, () => () => {
        const enemy = new HeavyEnemy(this.scene, centerX + Phaser.Math.Between(-260, 260), Phaser.Math.Between(170, 420));
        this.applyWaveMultipliers(enemy, current);
        this.enemies.add(enemy);
      })
    ];

    Phaser.Utils.Array.Shuffle(queue);
    this.pendingSpawns = queue.length;

    queue.forEach((spawnEnemy, index) => {
      this.scene.time.delayedCall(current.spawnDelayMs * index, () => {
        spawnEnemy();
        this.pendingSpawns -= 1;
      });
    });
  }

  hasActiveEnemies(): boolean {
    return this.pendingSpawns > 0 || this.enemies.getChildren().some((obj) => (obj as Enemy).active);
  }

  getWaveNumber(): number {
    return this.waveIndex + 1;
  }

  getTotalWaves(): number {
    return WAVES.length;
  }

  private applyWaveMultipliers(enemy: Enemy, wave: WaveConfig): void {
    const hpMultiplier = wave.multipliers?.hp ?? 1;
    const damageMultiplier = wave.multipliers?.damage ?? 1;

    enemy.maxHp = Math.max(1, Math.round(enemy.maxHp * hpMultiplier));
    enemy.hp = enemy.maxHp;
    enemy.damage = Math.max(1, Math.round(enemy.damage * damageMultiplier));
  }

  private pickCount(min: number, max: number): number {
    if (max <= min) return min;
    return Phaser.Math.Between(min, max);
  }
}
