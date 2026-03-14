import Phaser from 'phaser';
import type { AttackData } from './AttackData';
import type { Player } from '../entities/Player';
import type { Enemy } from '../entities/Enemy';

export class CombatSystem {
  private readonly recentHitByAttack = new Set<string>();

  registerPlayerAttack(scene: Phaser.Scene, player: Player, enemies: Phaser.GameObjects.Group, attack: AttackData): void {
    this.recentHitByAttack.clear();

    scene.time.delayedCall(attack.startupMs, () => {
      if (!player.active) return;

      const x = player.getFacing() > 0 ? player.x + 22 : player.x - attack.range - 22;
      const y = player.y - player.getCurrentAirHeight() - attack.height / 2;
      const hitRect = new Phaser.Geom.Rectangle(x, y, attack.range, attack.height);

      enemies.getChildren().forEach((obj) => {
        const enemy = obj as Enemy;
        if (!enemy.active) return;

        const enemyRect = enemy.getBounds();
        const tag = `${attack.name}:${enemy.id}`;
        if (Phaser.Geom.Intersects.RectangleToRectangle(hitRect, enemyRect) && !this.recentHitByAttack.has(tag)) {
          this.recentHitByAttack.add(tag);
          const direction = player.getFacing();
          enemy.takeDamage(attack.damage, attack.knockbackX * direction, attack.knockbackY);
        }
      });
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
