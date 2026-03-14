import Phaser from 'phaser';
import { HUD } from '../ui/HUD';

export class UIScene extends Phaser.Scene {
  private hud!: HUD;
  private overlayText!: Phaser.GameObjects.Text;

  constructor() {
    super('UIScene');
  }

  create(): void {
    this.hud = new HUD(this);

    this.overlayText = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
      fontSize: '44px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(100).setVisible(false);

    const gameScene = this.scene.get('GameScene');

    gameScene.events.on('hud:health', (value: number) => {
      this.hud.healthBar.setPercent(value);
    });

    gameScene.events.on('hud:wave', (wave: number) => {
      this.hud.setWave(wave);
    });

    gameScene.events.on('hud:finish', (won: boolean) => {
      this.overlayText.setVisible(true);
      this.overlayText.setText(won ? 'VOCÊ VENCEU!\nPressione R para reiniciar' : 'GAME OVER\nPressione R para reiniciar');
    });

    this.input.keyboard?.on('keydown-R', () => {
      this.overlayText.setVisible(false);
      gameScene.events.emit('ui:restart');
    });
  }
}
