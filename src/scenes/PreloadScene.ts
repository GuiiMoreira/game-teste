import Phaser from 'phaser';

type Palette = {
  base: number;
  accent: number;
  detail: number;
  shadow: number;
};

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

    this.createCharacterTextures('player', 28, 48, {
      base: 0x4ba8ff,
      accent: 0x0e2647,
      detail: 0xffe39f,
      shadow: 0x1c263d
    });

    this.createCharacterTextures('enemy-light', 26, 44, {
      base: 0xff7a7a,
      accent: 0x4d1212,
      detail: 0xffd4d4,
      shadow: 0x482424
    });

    this.createCharacterTextures('enemy-heavy', 38, 58, {
      base: 0xffb347,
      accent: 0x52360f,
      detail: 0xffefcc,
      shadow: 0x3f2d1a
    });

    this.createFloorTexture();

    this.load.audio('sfx-hit', this.createToneWavDataUri(220, 0.13, 'square', 0.35));
    this.load.audio('sfx-attack', this.createToneWavDataUri(520, 0.08, 'saw', 0.28));
    this.load.audio('sfx-start', this.createToneWavDataUri(760, 0.14, 'sine', 0.2));
  }

  create(): void {
    this.createCombatAnimations();
    this.scene.start('MenuScene');
  }

  private createCharacterTextures(key: string, width: number, height: number, palette: Palette): void {
    this.drawCharacterTexture(`${key}-idle-0`, width, height, 0, palette);
    this.drawCharacterTexture(`${key}-walk-0`, width, height, 1, palette);
    this.drawCharacterTexture(`${key}-walk-1`, width, height, 2, palette);
    this.drawCharacterTexture(`${key}-attack-0`, width, height, 3, palette);
    this.drawCharacterTexture(`${key}-hurt-0`, width, height, 4, palette);

    this.textures.renameTexture(`${key}-idle-0`, key);
    this.drawCharacterTexture(`${key}-idle-0`, width, height, 0, palette);
  }

  private drawCharacterTexture(key: string, width: number, height: number, frame: number, palette: Palette): void {
    const gfx = this.make.graphics({ x: 0, y: 0 });
    const sway = frame === 1 ? 2 : frame === 2 ? -2 : frame === 3 ? 1 : 0;
    const torsoY = 12 + (frame === 0 ? 0 : 1);

    gfx.clear();
    gfx.fillStyle(palette.shadow, 1);
    gfx.fillRect(7 + Math.abs(sway), height - 5, width - 14, 4);

    gfx.fillStyle(palette.base, 1);
    gfx.fillRect(8 + sway, torsoY, width - 16, 20);

    gfx.fillStyle(palette.detail, 1);
    gfx.fillRect(10 + sway, 4, width - 20, 10);

    gfx.fillStyle(palette.accent, 1);
    gfx.fillRect(6 + sway, 18, 4, frame === 3 ? 14 : 12);
    gfx.fillRect(width - 10 + sway, 18, 4, frame === 4 ? 14 : 12);

    const leftLegShift = frame === 1 ? -2 : frame === 2 ? 2 : 0;
    const rightLegShift = frame === 1 ? 2 : frame === 2 ? -2 : 0;

    gfx.fillRect(9 + leftLegShift, 32, 5, 14);
    gfx.fillRect(width - 14 + rightLegShift, 32, 5, 14);

    if (frame === 3) {
      gfx.fillStyle(0xffe066, 1);
      gfx.fillRect(width - 4, 16, 4, 4);
    }

    if (frame === 4) {
      gfx.fillStyle(0xffffff, 1);
      gfx.fillRect(width / 2 - 2, 2, 4, 4);
    }

    gfx.generateTexture(key, width, height);
    gfx.destroy();
  }

  private createFloorTexture(): void {
    const width = 960;
    const height = 320;
    const gfx = this.make.graphics({ x: 0, y: 0 });

    gfx.fillGradientStyle(0x32305f, 0x32305f, 0x1d1d35, 0x1d1d35, 1);
    gfx.fillRect(0, 0, width, height);

    gfx.lineStyle(2, 0x4c487f, 1);
    for (let y = 24; y < height; y += 24) {
      gfx.beginPath();
      gfx.moveTo(0, y);
      gfx.lineTo(width, y);
      gfx.strokePath();
    }

    gfx.lineStyle(1, 0x2f2c56, 1);
    for (let x = 18; x < width; x += 36) {
      gfx.beginPath();
      gfx.moveTo(x, 0);
      gfx.lineTo(x, height);
      gfx.strokePath();
    }

    gfx.generateTexture('bg-floor', width, height);
    gfx.destroy();
  }

  private createCombatAnimations(): void {
    this.createCharacterAnimations('player');
    this.createCharacterAnimations('enemy-light');
    this.createCharacterAnimations('enemy-heavy');
  }

  private createCharacterAnimations(key: string): void {
    this.createAnimationIfMissing(`${key}-idle`, [`${key}-idle-0`], 2);
    this.createAnimationIfMissing(`${key}-walk`, [`${key}-walk-0`, `${key}-idle-0`, `${key}-walk-1`, `${key}-idle-0`], 8);
    this.createAnimationIfMissing(`${key}-attack`, [`${key}-attack-0`, `${key}-attack-0`, `${key}-idle-0`], 10);
    this.createAnimationIfMissing(`${key}-hurt`, [`${key}-hurt-0`, `${key}-hurt-0`, `${key}-idle-0`], 12);
    this.createAnimationIfMissing(`${key}-dead`, [`${key}-hurt-0`], 1);
  }

  private createAnimationIfMissing(key: string, textureKeys: string[], frameRate: number): void {
    if (this.anims.exists(key)) {
      return;
    }

    this.anims.create({
      key,
      frameRate,
      repeat: textureKeys.length === 1 ? -1 : 0,
      frames: textureKeys.map((textureKey) => ({ key: textureKey }))
    });
  }

  private createToneWavDataUri(
    frequency: number,
    durationSeconds: number,
    wave: 'sine' | 'square' | 'saw',
    volume: number
  ): string {
    const sampleRate = 22050;
    const sampleCount = Math.floor(sampleRate * durationSeconds);
    const channelCount = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = channelCount * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = sampleCount * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeString = (offset: number, value: string): void => {
      for (let i = 0; i < value.length; i += 1) {
        view.setUint8(offset + i, value.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channelCount, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    for (let i = 0; i < sampleCount; i += 1) {
      const t = i / sampleRate;
      const phase = 2 * Math.PI * frequency * t;
      const raw = wave === 'square' ? Math.sign(Math.sin(phase)) : wave === 'saw' ? 2 * (frequency * t - Math.floor(0.5 + frequency * t)) : Math.sin(phase);
      const envelope = Math.max(0, 1 - i / sampleCount);
      const sample = Math.max(-1, Math.min(1, raw * volume * envelope));
      view.setInt16(44 + i * 2, sample * 32767, true);
    }

    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return `data:audio/wav;base64,${btoa(binary)}`;
  }
}
