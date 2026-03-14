export interface AttackData {
  name: string;
  damage: number;
  startupMs: number;
  activeMs: number;
  recoveryMs: number;
  knockbackX: number;
  knockbackY: number;
  range: number;
  height: number;
}

export const PlayerAttacks: Record<string, AttackData> = {
  punch1: { name: 'punch1', damage: 8, startupMs: 60, activeMs: 120, recoveryMs: 120, knockbackX: 85, knockbackY: 0, range: 48, height: 24 },
  punch2: { name: 'punch2', damage: 10, startupMs: 70, activeMs: 120, recoveryMs: 140, knockbackX: 95, knockbackY: 0, range: 52, height: 24 },
  kick3: { name: 'kick3', damage: 14, startupMs: 90, activeMs: 160, recoveryMs: 180, knockbackX: 130, knockbackY: 0, range: 62, height: 26 },
  airKick: { name: 'airKick', damage: 12, startupMs: 50, activeMs: 130, recoveryMs: 140, knockbackX: 100, knockbackY: -40, range: 52, height: 24 }
};
