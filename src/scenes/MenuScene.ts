import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.drawMenu();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.drawMenu, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.drawMenu, this);
    });

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
  }

  private drawMenu(): void {
    this.children.removeAll(true);

    const width = this.scale.width;
    const height = this.scale.height;
    const sidePadding = Math.max(24, width * 0.06);

    this.add
      .rectangle(width / 2, height / 2, width, height, 0x0f1126, 0.92)
      .setDepth(-2);

    this.add
      .text(width / 2, height * 0.17, 'RUA DE PIXEL', {
        fontSize: `${Math.max(34, Math.round(width * 0.05))}px`,
        color: '#f3f3ff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        height * 0.29,
        'WASD mover · Shift correr · Space pular · J/K atacar',
        {
          fontSize: `${Math.max(14, Math.round(width * 0.02))}px`,
          color: '#d2d5ff',
          align: 'center',
          wordWrap: { width: width - sidePadding * 2 }
        }
      )
      .setOrigin(0.5);

    const howToPlay = [
      'COMO JOGAR',
      '1) Derrote os inimigos para sobreviver às ondas.',
      '2) Alterne entre ataques rápidos (J) e fortes (K).',
      '3) Corra e pule para se reposicionar e evitar dano.',
      '4) Fique de olho na vida e mantenha distância quando necessário.'
    ].join('\n');

    this.add
      .text(width / 2, height * 0.52, howToPlay, {
        fontSize: `${Math.max(13, Math.round(width * 0.018))}px`,
        color: '#e7ebff',
        align: 'center',
        lineSpacing: 6,
        wordWrap: { width: width - sidePadding * 2 }
      })
      .setOrigin(0.5);

    const start = this.add
      .text(width / 2, height * 0.86, 'PRESSIONE ENTER PARA INICIAR', {
        fontSize: `${Math.max(18, Math.round(width * 0.028))}px`,
        color: '#ffd166'
      })
      .setOrigin(0.5);

    this.tweens.killAll();
    this.tweens.add({
      targets: start,
      alpha: 0.25,
      yoyo: true,
      repeat: -1,
      duration: 650
    });
  }
}
