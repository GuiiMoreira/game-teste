import Phaser from 'phaser';
import type { AttackData } from './AttackData';

export interface ActiveHitbox {
  ownerId: string;
  rect: Phaser.Geom.Rectangle;
  attack: AttackData;
  expireAt: number;
}
