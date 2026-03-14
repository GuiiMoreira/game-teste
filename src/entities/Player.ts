import Phaser from 'phaser';
import { PlayerAttacks, type AttackData } from '../combat/AttackData';
import { StateMachine } from '../systems/StateMachine';
import type { InputManager } from '../systems/InputManager';

export type PlayerState =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'fall'
  | 'attack'
  | 'hurt'
  | 'knockedDown'
  | 'getUp';

export class Player extends Phaser.Physics.Arcade.Sprite {
  readonly id = 'player';
  readonly state = new StateMachine<PlayerState>('idle');
  hp = 100;
  readonly maxHp = 100;
  private facing = 1;
  private comboStep = 0;
  private comboUntil = 0;
  private attackLockedUntil = 0;
  private invulnerableUntil = 0;
  private isAirborne = false;
  private verticalVelocity = 0;
  private airHeight = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.playAnimationForState('idle');
  }

  getFacing(): number {
    return this.facing;
  }

  getCurrentAirHeight(): number {
    return this.airHeight;
  }

  update(input: InputManager, now: number): AttackData | null {
    this.setDepth(this.y + this.airHeight);

    if (this.state.is('hurt') || this.state.is('knockedDown') || this.state.is('getUp')) {
      this.syncAnimation();
      return null;
    }

    if (now < this.attackLockedUntil) {
      this.updateJumpPhysics();
      this.syncAnimation();
      return null;
    }

    const attack = this.readAttackInput(input, now);
    if (attack) {
      return attack;
    }

    this.updateMovement(input);
    this.updateJumpPhysics();
    this.syncAnimation();

    return null;
  }

  takeDamage(amount: number, knockbackX: number): void {
    const now = this.scene.time.now;
    if (now < this.invulnerableUntil) return;
    if (this.state.is('knockedDown') || this.state.is('getUp')) return;

    this.hp = Math.max(0, this.hp - amount);
    this.state.setState('hurt');
    this.playAnimationForState('hurt');
    this.scene.sound.play('sfx-hit', { volume: 0.35 });
    this.setTintFill(0xff6666);
    this.setVelocityX(knockbackX);
    this.invulnerableUntil = now + 260;

    if (this.hp === 0) {
      this.state.setState('knockedDown');
      this.playAnimationForState('dead');
      this.setVelocity(0, 0);
      return;
    }

    this.scene.time.delayedCall(160, () => {
      this.clearTint();
      if (this.active) {
        this.state.setState('idle');
        this.playAnimationForState('idle');
      }
    });
  }

  private readAttackInput(input: InputManager, now: number): AttackData | null {
    if (input.justPressedPunch()) {
      this.comboStep = now <= this.comboUntil ? (this.comboStep + 1) % 3 : 0;
      this.comboUntil = now + 550;
      const attack = this.comboStep === 2 ? PlayerAttacks.kick3 : this.comboStep === 1 ? PlayerAttacks.punch2 : PlayerAttacks.punch1;
      return this.startAttack(attack, now);
    }

    if (input.justPressedKick()) {
      return this.startAttack(this.isAirborne ? PlayerAttacks.airKick : PlayerAttacks.kick3, now);
    }

    return null;
  }

  private startAttack(attack: AttackData, now: number): AttackData {
    this.state.setState('attack');
    this.playAnimationForState('attack');
    this.scene.sound.play('sfx-attack', { volume: 0.4 });
    this.setVelocity(0, 0);
    this.attackLockedUntil = now + attack.startupMs + attack.activeMs + attack.recoveryMs;
    this.setTint(0xf5d742);
    this.scene.time.delayedCall(attack.startupMs + attack.activeMs, () => this.clearTint());
    this.scene.time.delayedCall(attack.startupMs + attack.activeMs + attack.recoveryMs, () => {
      if (this.active && this.state.is('attack')) {
        this.state.setState('idle');
        this.playAnimationForState('idle');
      }
    });
    return attack;
  }

  private updateMovement(input: InputManager): void {
    const moveX = input.axisX;
    const moveY = input.axisY;
    const speed = input.isRunning ? 210 : 130;

    if (moveX !== 0) {
      this.facing = Math.sign(moveX);
      this.setFlipX(this.facing < 0);
    }

    this.setVelocity(moveX * speed, moveY * 95);

    if (input.justPressedJump() && !this.isAirborne) {
      this.isAirborne = true;
      this.verticalVelocity = 330;
      this.state.setState('jump');
      return;
    }

    if (this.isAirborne) {
      this.state.setState(this.verticalVelocity > 0 ? 'jump' : 'fall');
      return;
    }

    if (moveX === 0 && moveY === 0) {
      this.state.setState('idle');
      return;
    }

    this.state.setState(input.isRunning ? 'run' : 'walk');
  }

  private updateJumpPhysics(): void {
    if (!this.isAirborne) return;

    const dt = this.scene.game.loop.delta / 1000;
    this.verticalVelocity -= 680 * dt;
    this.airHeight += this.verticalVelocity * dt;

    if (this.airHeight <= 0) {
      this.airHeight = 0;
      this.verticalVelocity = 0;
      this.isAirborne = false;
      if (this.state.is('jump') || this.state.is('fall')) {
        this.state.setState('idle');
      }
    }

    this.setScale(1, 1 - Math.min(0.35, this.airHeight / 500));
  }


  private syncAnimation(): void {
    if (this.state.is('attack') || this.state.is('hurt') || this.state.is('knockedDown')) {
      return;
    }

    if (this.state.is('walk') || this.state.is('run')) {
      this.playAnimationForState('walk');
      return;
    }

    this.playAnimationForState('idle');
  }

  private playAnimationForState(state: 'idle' | 'walk' | 'attack' | 'hurt' | 'dead'): void {
    const key = `player-${state}`;
    if (this.anims.currentAnim?.key !== key) {
      this.anims.play(key, true);
    }
  }

}
