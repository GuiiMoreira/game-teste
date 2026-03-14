import { Enemy } from './Enemy';

export class HeavyEnemy extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-heavy');
    this.hp = 70;
    this.maxHp = 70;
    this.moveSpeed = 55;
  }
}
