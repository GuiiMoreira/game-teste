import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.add.text(this.scale.width / 2, 150, 'RUA DE PIXEL', {
      fontSize: '48px',
      color: '#f3f3ff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, 230, 'WASD mover · Shift correr · Space pular · J/K atacar', {
      fontSize: '18px',
      color: '#d2d5ff'
    }).setOrigin(0.5);

    const start = this.add.text(this.scale.width / 2, 320, 'PRESSIONE ENTER PARA INICIAR', {
      fontSize: '24px',
      color: '#ffd166'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: start,
      alpha: 0.25,
      yoyo: true,
      repeat: -1,
      duration: 650
    });

    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });
  }
}
