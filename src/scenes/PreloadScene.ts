import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    const progress = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Carregando... 0%', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progress.setText(`Carregando... ${Math.round(value * 100)}%`);
    });

    this.createRectTexture('player', 28, 48, 0x4ba8ff);
    this.createRectTexture('enemy-light', 26, 44, 0xff7a7a);
    this.createRectTexture('enemy-heavy', 38, 58, 0xffb347);
    this.createRectTexture('bg-floor', 960, 320, 0x2d2b47);
  }

  create(): void {
    this.scene.start('MenuScene');
  }

  private createRectTexture(key: string, width: number, height: number, color: number): void {
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(color, 1);
    gfx.fillRect(0, 0, width, height);
    gfx.generateTexture(key, width, height);
    gfx.destroy();
  }
}
