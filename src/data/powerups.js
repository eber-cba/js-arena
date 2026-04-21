// ═══════════════════════════════════════════════════════════════
// JS_ARENA — POWER-UPS
// Sistema de recompensas y power-ups
// ═══════════════════════════════════════════════════════════════

export const powerUps = {
  freeze_time: {
    id: 'freeze_time',
    name: 'Congelar Tiempo',
    icon: '⏳',
    description: 'Congela el temporizador por 15 segundos',
    rarity: 'common',
    rarityLabel: 'Común',
    color: '#0080ff',
    duration: 15000,
    effect: 'freeze_timer'
  },
  instant_hint: {
    id: 'instant_hint',
    name: 'Pista Instantánea',
    icon: '💡',
    description: 'Revela una pista sobre la respuesta correcta',
    rarity: 'common',
    rarityLabel: 'Común',
    color: '#ffd700',
    effect: 'show_hint'
  },
  second_chance: {
    id: 'second_chance',
    name: 'Segunda Oportunidad',
    icon: '🔁',
    description: 'Reintento sin penalización',
    rarity: 'rare',
    rarityLabel: 'Raro',
    color: '#39ff14',
    effect: 'retry'
  },
  error_shield: {
    id: 'error_shield',
    name: 'Escudo Anti-Error',
    icon: '🛡️',
    description: 'Absorbe 1 error sin perder vida',
    rarity: 'rare',
    rarityLabel: 'Raro',
    color: '#00f5ff',
    effect: 'shield'
  },
  mission_skip: {
    id: 'mission_skip',
    name: 'Salto de Pregunta',
    icon: '🚀',
    description: 'Salta una pregunta difícil (cuenta como correcta)',
    rarity: 'epic',
    rarityLabel: 'Épico',
    color: '#ff00ff',
    effect: 'skip_question'
  },
  double_xp: {
    id: 'double_xp',
    name: 'Doble XP',
    icon: '⚡',
    description: 'Doble experiencia por 60 segundos',
    rarity: 'rare',
    rarityLabel: 'Raro',
    color: '#ff6a00',
    duration: 60000,
    effect: 'double_xp'
  },
  code_scanner: {
    id: 'code_scanner',
    name: 'Escáner de Código',
    icon: '🔍',
    description: 'Resalta una opción incorrecta para descartarla',
    rarity: 'common',
    rarityLabel: 'Común',
    color: '#b000ff',
    effect: 'eliminate_wrong'
  }
};

export const rarityWeights = {
  common: 50,
  rare: 30,
  epic: 10
};

export function getRandomPowerUp() {
  const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  let selectedRarity = 'common';
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    random -= weight;
    if (random <= 0) {
      selectedRarity = rarity;
      break;
    }
  }
  
  const available = Object.values(powerUps).filter(p => p.rarity === selectedRarity);
  return available[Math.floor(Math.random() * available.length)];
}

export function getStarterPowerUps() {
  return {
    freeze_time: 2,
    instant_hint: 2,
    second_chance: 1,
    error_shield: 1,
    mission_skip: 0,
    double_xp: 1,
    code_scanner: 2
  };
}
