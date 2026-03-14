import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  private enterPressed = false;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.enterPressed = false;
    this.drawMenu();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.drawMenu, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.drawMenu, this);
    });

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.enterPressed = true;
      this.drawMenu();
      this.sound.play('sfx-start', { volume: 0.45 });
      this.time.delayedCall(220, () => {
        this.scene.start('GameScene');
        this.scene.launch('UIScene');
      });
    });
  }

  private drawMenu(): void {
    this.children.removeAll(true);

    const width = this.scale.width;
    const height = this.scale.height;
    const sidePadding = Math.max(24, width * 0.06);

    this.add.rectangle(width / 2, height / 2, width, height, 0x0f1126, 0.92).setDepth(-2);

    this.add
      .text(width / 2, height * 0.16, 'RUA DE PIXEL', {
        fontSize: `${Math.max(34, Math.round(width * 0.05))}px`,
        color: '#f3f3ff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.27, 'WASD mover · Shift correr · Space pular · J/K atacar', {
        fontSize: `${Math.max(14, Math.round(width * 0.02))}px`,
        color: '#d2d5ff',
        align: 'center',
        wordWrap: { width: width - sidePadding * 2 }
      })
      .setOrigin(0.5);

    const quickTips = [
      'DICAS RÁPIDAS',
      '• J = combo rápido | K = golpe forte',
      '• Ataque e recue para evitar cerco',
      '• Se cair, reposicione ao levantar',
      '• Reiniciar durante partida: tecla R'
    ].join('\n');

    this.add
      .text(width / 2, height * 0.51, quickTips, {
        fontSize: `${Math.max(13, Math.round(width * 0.018))}px`,
        color: '#e7ebff',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: width - sidePadding * 2 }
      })
      .setOrigin(0.5);

    const startText = this.enterPressed ? 'ENTRADA CONFIRMADA ✓' : 'PRESSIONE ENTER PARA INICIAR';
    const start = this.add
      .text(width / 2, height * 0.83, startText, {
        fontSize: `${Math.max(18, Math.round(width * 0.028))}px`,
        color: this.enterPressed ? '#7dff9f' : '#ffd166',
        fontStyle: this.enterPressed ? 'bold' : 'normal'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.9, 'No fim da partida use [R] para reiniciar rapidamente.', {
        fontSize: `${Math.max(12, Math.round(width * 0.016))}px`,
        color: '#b9bee8',
        align: 'center'
      })
      .setOrigin(0.5);

    this.tweens.killAll();
    this.tweens.add({
      targets: start,
      alpha: this.enterPressed ? 0.55 : 0.25,
      scale: this.enterPressed ? 1.04 : 1,
      yoyo: true,
      repeat: -1,
      duration: this.enterPressed ? 240 : 650
    });
  }
}
