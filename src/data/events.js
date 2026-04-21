// ═══════════════════════════════════════════════════════════════
// JS_ARENA — DYNAMIC EVENTS
// Eventos aleatorios durante gameplay
// ═══════════════════════════════════════════════════════════════

export const dynamicEvents = [
  {
    id: 'critical_attack',
    name: '⚠️ ATAQUE CRÍTICO',
    description: 'El siguiente error significa GAME OVER de misión',
    icon: '⚠️',
    effect: 'next_error_fatal',
    duration: 1, // 1 pregunta
    durationType: 'questions',
    probability: 0.08,
    color: '#ff0040',
    bannerClass: 'event-critical'
  },
  {
    id: 'double_score',
    name: '🔥 DOBLE PUNTAJE',
    description: '¡Puntaje x2 por 30 segundos!',
    icon: '🔥',
    effect: 'score_multiplier',
    multiplier: 2,
    duration: 30000,
    durationType: 'time',
    probability: 0.15,
    color: '#ff6a00',
    bannerClass: 'event-bonus'
  },
  {
    id: 'massive_error',
    name: '💀 ERROR MASIVO',
    description: 'Código corrupto en pantalla. Concéntrate.',
    icon: '💀',
    effect: 'visual_corruption',
    duration: 15000,
    durationType: 'time',
    probability: 0.10,
    color: '#b000ff',
    bannerClass: 'event-corruption'
  },
  {
    id: 'speed_mode',
    name: '🌪️ MODO VELOCIDAD',
    description: 'Timer reducido a la mitad por 2 preguntas',
    icon: '🌪️',
    effect: 'half_timer',
    duration: 2,
    durationType: 'questions',
    probability: 0.10,
    color: '#00f5ff',
    bannerClass: 'event-speed'
  },
  {
    id: 'jackpot',
    name: '🎰 JACKPOT',
    description: '¡Power-up aleatorio gratis!',
    icon: '🎰',
    effect: 'free_powerup',
    duration: 0,
    durationType: 'instant',
    probability: 0.12,
    color: '#ffd700',
    bannerClass: 'event-jackpot'
  },
  {
    id: 'phantom_bug',
    name: '👻 BUG FANTASMA',
    description: 'Una opción falsa aparece para confundir',
    icon: '👻',
    effect: 'add_fake_option',
    duration: 1,
    durationType: 'questions',
    probability: 0.08,
    color: '#39ff14',
    bannerClass: 'event-phantom'
  },
  {
    id: 'triple_xp',
    name: '💎 XP TRIPLE',
    description: '¡XP x3 en la siguiente respuesta correcta!',
    icon: '💎',
    effect: 'triple_next_xp',
    duration: 1,
    durationType: 'questions',
    probability: 0.10,
    color: '#00ffaa',
    bannerClass: 'event-triple'
  },
  {
    id: 'time_warp',
    name: '⏰ DISTORSIÓN TEMPORAL',
    description: '+20 segundos extra al timer',
    icon: '⏰',
    effect: 'add_time',
    extraTime: 20000,
    duration: 0,
    durationType: 'instant',
    probability: 0.10,
    color: '#0080ff',
    bannerClass: 'event-timewarp'
  }
];

export function rollForEvent(currentQuestion, totalQuestions) {
  // No events on first or last question
  if (currentQuestion <= 1 || currentQuestion >= totalQuestions) return null;
  
  // Higher chance in the middle of the mission
  const midBonus = 1 - Math.abs(currentQuestion - totalQuestions / 2) / (totalQuestions / 2);
  
  for (const event of dynamicEvents) {
    const adjustedProb = event.probability * (1 + midBonus * 0.5);
    if (Math.random() < adjustedProb) {
      return { ...event };
    }
  }
  
  return null;
}
