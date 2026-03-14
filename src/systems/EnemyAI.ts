import type { Enemy } from '../entities/Enemy';
import type { Player } from '../entities/Player';

export class EnemyAI {
  update(enemy: Enemy, player: Player, now: number): boolean {
    if (!enemy.active || enemy.state.is('dead') || enemy.state.is('hurt')) {
      return false;
    }

    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 52) {
      enemy.state.setState('chase');
      const speed = enemy.moveSpeed;
      enemy.setVelocity((dx / dist) * speed, (dy / dist) * speed);
      enemy.setFlipX(dx < 0);
      return false;
    }

    enemy.setVelocity(0, 0);
    enemy.state.setState('attack');

    if (now >= enemy.attackCooldownUntil) {
      enemy.attackCooldownUntil = now + 850;
      return true;
    }

    return false;
  }
}
