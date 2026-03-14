import Phaser from 'phaser';

export interface Hurtbox {
  ownerId: string;
  rect: Phaser.Geom.Rectangle;
}
