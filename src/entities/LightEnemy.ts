import { Enemy } from './Enemy';

export class LightEnemy extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy-light');
    this.hp = 35;
    this.maxHp = 35;
    this.moveSpeed = 95;
  }
}
