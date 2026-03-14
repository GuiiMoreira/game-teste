import Phaser from 'phaser';
import type { AttackData } from './AttackData';
import type { Player } from '../entities/Player';
import type { Enemy } from '../entities/Enemy';
import { drawDebugRect } from '../utils/DebugDraw';

const DEBUG_HIT_RECTS = false;
const HITSTOP_MS = 45;
const IMPACT_FLASH_MS = 80;

export class CombatSystem {
  private readonly recentHitByAttack = new Set<string>();

  registerPlayerAttack(scene: Phaser.Scene, player: Player, enemies: Phaser.GameObjects.Group, attack: AttackData): void {
    this.recentHitByAttack.clear();

    scene.time.delayedCall(attack.startupMs, () => {
      if (!player.active) return;

      const x = player.getFacing() > 0 ? player.x + 22 : player.x - attack.range - 22;
      const y = player.y - player.getCurrentAirHeight() - attack.height / 2;
      const hitRect = new Phaser.Geom.Rectangle(x, y, attack.range, attack.height);

      if (DEBUG_HIT_RECTS) {
        drawDebugRect(scene, hitRect.x, hitRect.y, hitRect.width, hitRect.height, 0xff00ff);
      }

      enemies.getChildren().forEach((obj) => {
        const enemy = obj as Enemy;
        if (!enemy.active) return;

        const enemyRect = enemy.getBounds();
        const tag = `${attack.name}:${enemy.id}`;
        if (Phaser.Geom.Intersects.RectangleToRectangle(hitRect, enemyRect) && !this.recentHitByAttack.has(tag)) {
          this.recentHitByAttack.add(tag);
          const direction = player.getFacing();
          enemy.takeDamage(attack.damage, attack.knockbackX * direction, attack.knockbackY);
          this.applyHitstop(scene, HITSTOP_MS);
          this.flashImpact(enemy, IMPACT_FLASH_MS);
        }
      });
    });
  }


  private applyHitstop(scene: Phaser.Scene, durationMs: number): void {
    scene.physics.world.pause();
    scene.time.delayedCall(durationMs, () => {
      if (!scene.sys.isActive()) return;
      scene.physics.world.resume();
    });
  }

  private flashImpact(target: Enemy, durationMs: number): void {
    target.setTintFill(0xffffff);
    target.scene.time.delayedCall(durationMs, () => {
      if (target.active) target.clearTint();
    });
  }

  tryEnemyAttack(enemy: Enemy, player: Player): void {
    if (!enemy.active || enemy.state.is('dead')) return;

    const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);
    if (dist > 60) return;

    const knockback = enemy.x < player.x ? 110 : -110;
    player.takeDamage(enemy.damage, knockback);
  }
}
