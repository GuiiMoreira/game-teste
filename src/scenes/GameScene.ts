import Phaser from 'phaser';
import { CombatSystem } from '../combat/CombatSystem';
import { Player } from '../entities/Player';
import type { Enemy } from '../entities/Enemy';
import { EnemyAI } from '../systems/EnemyAI';
import { InputManager } from '../systems/InputManager';
import { WaveManager } from '../systems/WaveManager';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputManager!: InputManager;
  private enemies!: Phaser.GameObjects.Group;
  private combat = new CombatSystem();
  private enemyAI = new EnemyAI();
  private waveManager!: WaveManager;
  private gameEnded = false;
  private readonly onUiRestart = (): void => {
    this.scene.restart();
  };

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.gameEnded = false;
    this.add.image(this.scale.width / 2, 390, 'bg-floor');

    this.add.rectangle(this.scale.width / 2, 370, 940, 310, 0x222036).setStrokeStyle(2, 0x56547a);

    this.player = new Player(this, 150, 300);
    this.inputManager = new InputManager(this);
    this.enemies = this.add.group();

    this.waveManager = new WaveManager(
      this,
      this.enemies,
      (wave) => this.events.emit('hud:wave', wave),
      () => this.finishGame(true)
    );

    this.waveManager.spawnNextWave();
    this.events.emit('hud:health', 1);

    this.events.on('ui:restart', this.onUiRestart);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.events.off('ui:restart', this.onUiRestart);
    });
  }

  update(_time: number, _delta: number): void {
    if (this.gameEnded) return;

    const now = this.time.now;
    const attack = this.player.update(this.inputManager, now);
    if (attack) {
      this.combat.registerPlayerAttack(this, this.player, this.enemies, attack);
    }

    this.enemies.getChildren().forEach((obj) => {
      const enemy = obj as Enemy;
      const performedAttack = this.enemyAI.update(enemy, this.player, now);
      if (performedAttack) {
        this.combat.tryEnemyAttack(enemy, this.player);
      }
      enemy.setDepth(enemy.y);
    });

    this.events.emit('hud:health', this.player.hp / this.player.maxHp);

    if (this.player.hp <= 0) {
      this.finishGame(false);
      return;
    }

    if (!this.waveManager.hasActiveEnemies()) {
      this.waveManager.spawnNextWave();
    }
  }

  private finishGame(won: boolean): void {
    if (this.gameEnded) return;
    this.gameEnded = true;
    this.events.emit('hud:finish', won);
  }
}
