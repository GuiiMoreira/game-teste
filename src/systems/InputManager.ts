import Phaser from 'phaser';
import { Controls } from '../config/Controls';

export class InputManager {
  private readonly keys: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(scene: Phaser.Scene) {
    this.keys = scene.input.keyboard?.addKeys({
      left: Controls.moveLeft,
      right: Controls.moveRight,
      up: Controls.moveUp,
      down: Controls.moveDown,
      jump: Controls.jump,
      punch: Controls.punch,
      kick: Controls.kick,
      run: Controls.runModifier
    }) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  get axisX(): number {
    return Number(this.keys.right.isDown) - Number(this.keys.left.isDown);
  }

  get axisY(): number {
    return Number(this.keys.down.isDown) - Number(this.keys.up.isDown);
  }

  get isRunning(): boolean {
    return this.keys.run.isDown;
  }

  justPressedPunch(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.punch);
  }

  justPressedKick(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.kick);
  }

  justPressedJump(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.keys.jump);
  }
}
