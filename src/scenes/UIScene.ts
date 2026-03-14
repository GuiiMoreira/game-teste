import Phaser from 'phaser';
import { HUD } from '../ui/HUD';

interface WaveHudPayload {
  current: number;
  total: number;
}

export class UIScene extends Phaser.Scene {
  private hud!: HUD;
  private overlayText!: Phaser.GameObjects.Text;
  private gameFinished = false;
  private gameScene!: Phaser.Scene;
  private onHudHealth!: (value: number) => void;
  private onHudWave!: (wave: WaveHudPayload) => void;
  private onHudFinish!: (won: boolean) => void;
  private waveTotal = 1;
  private readonly onKeyDownR = (): void => {
    if (!this.gameFinished) return;

    this.gameFinished = false;
    this.overlayText.setVisible(false);
    this.overlayText.setText('');
    this.hud.healthBar.setPercent(1);
    this.hud.setWave(1, this.waveTotal);
    this.gameScene.events.emit('ui:restart');
  };

  constructor() {
    super('UIScene');
  }

  create(): void {
    this.gameFinished = false;
    this.waveTotal = 1;
    this.hud = new HUD(this);

    this.overlayText = this.add.text(this.scale.width / 2, this.scale.height / 2, '', {
      fontSize: '44px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5).setDepth(100).setVisible(false);

    this.gameScene = this.scene.get('GameScene');

    this.onHudHealth = (value: number) => {
      this.hud.healthBar.setPercent(value);
    };

    this.onHudWave = (wave: WaveHudPayload) => {
      this.waveTotal = wave.total;
      this.hud.setWave(wave.current, wave.total);
    };

    this.onHudFinish = (won: boolean) => {
      this.gameFinished = true;
      this.overlayText.setVisible(true);
      this.overlayText.setText(won ? 'VOCÊ VENCEU!\nPressione R para reiniciar' : 'GAME OVER\nPressione R para reiniciar');
    };

    this.gameScene.events.on('hud:health', this.onHudHealth);
    this.gameScene.events.on('hud:wave', this.onHudWave);
    this.gameScene.events.on('hud:finish', this.onHudFinish);

    this.input.keyboard?.on('keydown-R', this.onKeyDownR);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupListeners();
    });

    this.events.once(Phaser.Scenes.Events.DESTROY, () => {
      this.cleanupListeners();
    });
  }

  private cleanupListeners(): void {
    if (this.gameScene) {
      this.gameScene.events.off('hud:health', this.onHudHealth);
      this.gameScene.events.off('hud:wave', this.onHudWave);
      this.gameScene.events.off('hud:finish', this.onHudFinish);
    }

    this.input.keyboard?.off('keydown-R', this.onKeyDownR);
  }
}
