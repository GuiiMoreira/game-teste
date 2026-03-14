import Phaser from 'phaser';
import { StateMachine } from '../systems/StateMachine';

export type EnemyState = 'idle' | 'walk' | 'chase' | 'attack' | 'hurt' | 'down' | 'dead';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  readonly id: string;
  readonly state = new StateMachine<EnemyState>('idle');
  hp = 40;
  maxHp = 40;
  moveSpeed = 65;
  attackCooldownUntil = 0;
  damage = 8;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.id = `${texture}-${Phaser.Math.RND.uuid()}`;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDepth(y);
    this.playAnimationForState('idle');
  }

  setCombatState(state: 'idle' | 'walk' | 'attack'): void {
    this.state.setState(state);
    this.playAnimationForState(state);
  }

  takeDamage(amount: number, knockbackX: number, knockbackY: number): boolean {
    if (this.state.is('dead')) return false;

    this.hp -= amount;
    this.state.setState('hurt');
    this.playAnimationForState('hurt');
    this.scene.sound.play('sfx-hit', { volume: 0.3 });
    this.setTintFill(0xff7777);
    this.setVelocity(knockbackX, knockbackY);

    this.scene.time.delayedCall(120, () => this.clearTint());

    if (this.hp <= 0) {
      this.hp = 0;
      this.state.setState('dead');
      this.playAnimationForState('dead');
      this.setTint(0x333333);
      this.setVelocity(0, 0);
      this.disableBody(false, false);
      this.scene.time.delayedCall(450, () => this.destroy());
      return true;
    }

    this.scene.time.delayedCall(220, () => {
      if (this.active && !this.state.is('dead')) {
        this.setCombatState('idle');
      }
    });

    return false;
  }

  protected playAnimationForState(state: 'idle' | 'walk' | 'attack' | 'hurt' | 'dead'): void {
    const key = `${this.texture.key}-${state}`;
    if (this.scene.anims.exists(key) && this.anims.currentAnim?.key !== key) {
      this.anims.play(key, true);
    }
  }
}
