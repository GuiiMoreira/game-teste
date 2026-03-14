export interface EnemyCompositionRange {
  min: number;
  max: number;
}

export interface WaveMultipliers {
  hp?: number;
  damage?: number;
}

export interface WaveConfig {
  spawnDelayMs: number;
  composition: {
    lights: EnemyCompositionRange;
    heavies: EnemyCompositionRange;
  };
  multipliers?: WaveMultipliers;
}

export const WAVES: WaveConfig[] = [
  {
    spawnDelayMs: 0,
    composition: {
      lights: { min: 2, max: 2 },
      heavies: { min: 0, max: 0 }
    }
  },
  {
    spawnDelayMs: 250,
    composition: {
      lights: { min: 2, max: 3 },
      heavies: { min: 1, max: 1 }
    },
    multipliers: {
      hp: 1.1
    }
  },
  {
    spawnDelayMs: 300,
    composition: {
      lights: { min: 3, max: 4 },
      heavies: { min: 1, max: 2 }
    },
    multipliers: {
      hp: 1.25,
      damage: 1.15
    }
  }
];
