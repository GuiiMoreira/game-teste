import Phaser from 'phaser';
import { HUD } from '../ui/HUD';

export class UIScene extends Phaser.Scene {
  private hud!: HUD;
  private overlayText!: Phaser.GameObjects.Text;
  private gameFinished = false;

  constructor() {
    super('UIScene');
  }

  create(): void {
    this.gameFinished = false;
    this.hud = new HUD(this);

    this.overlayText = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
      fontSize: '44px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(100).setVisible(false);

    const gameScene = this.scene.get('GameScene');

    const onHealth = (value: number) => {
      this.hud.healthBar.setPercent(value);
    };

    const onWave = (wave: number) => {
      this.hud.setWave(wave);
    };

    const onFinish = (won: boolean) => {
      this.gameFinished = true;
      this.overlayText.setVisible(true);
      this.overlayText.setText(won ? 'VOCÊ VENCEU!\nPressione R para reiniciar' : 'GAME OVER\nPressione R para reiniciar');
    };

    gameScene.events.on('hud:health', onHealth);
    gameScene.events.on('hud:wave', onWave);
    gameScene.events.on('hud:finish', onFinish);

    this.input.keyboard?.on('keydown-R', () => {
      if (!this.gameFinished) return;

      this.gameFinished = false;
      this.overlayText.setVisible(false);
      this.overlayText.setText('');
      this.hud.healthBar.setPercent(1);
      this.hud.setWave(1);
      gameScene.events.emit('ui:restart');
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      gameScene.events.off('hud:health', onHealth);
      gameScene.events.off('hud:wave', onWave);
      gameScene.events.off('hud:finish', onFinish);
    });
  }
}
