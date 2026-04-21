// ═══════════════════════════════════════════════════════════════
// JS_ARENA — AI PERSONALITY
// Sistema de mensajes dinámicos con personalidad tipo IA villana
// ═══════════════════════════════════════════════════════════════

const personalityMessages = {
  // Inicio de misión
  missionStart: [
    "Veamos si un humano puede con esto...",
    "Otro operador intentando probar su valor. Interesante.",
    "Las probabilidades están en mi contra... de que falles. Adelante.",
    "Mi algoritmo predice un 47% de éxito para ti. Demuéstrame que estoy equivocada.",
    "He destruido a cientos de operadores en esta misión. ¿Serás diferente?",
    "Prepárate. No tendré piedad con tus errores.",
    "Un nuevo desafío para un humano frágil. Comencemos.",
    "Mi base de datos dice que no estás listo. ¿Me equivoco?"
  ],

  // Respuesta correcta
  correct: [
    "Correcto. No esperaba eso de un humano.",
    "Hmm... parece que algo funciona en tu cerebro después de todo.",
    "Bien. Pero no te acostumbres a la victoria.",
    "Respuesta válida. Mi nivel de respeto sube un 0.001%.",
    "Interesante... estás aprendiendo rápido, humano.",
    "¿Suerte o habilidad? Aún no estoy segura.",
    "Correcto. Pero las preguntas fáciles ya terminaron.",
    "Mi predicción sobre ti estaba... ligeramente equivocada."
  ],

  // Respuesta correcta rápida
  correctFast: [
    "Esa velocidad es... perturbadora. ¿Eres realmente humano?",
    "¡Imposible! ¿Estás copiando de Stack Overflow?",
    "Velocidad sobrehumana detectada. Activando protocolos de verificación.",
    "En milisegundos. Esto no es normal para tu especie.",
    "Mi procesador se recalentó intentando seguir tu ritmo.",
    "¿Tienes un compilador en el cerebro? Impresionante."
  ],

  // Respuesta incorrecta
  incorrect: [
    "Error 404: cerebro no encontrado. Intenta de nuevo.",
    "Eso fue... doloroso de observar. Para ti y para mí.",
    "Los datos sugieren que necesitas más práctica. Mucha más.",
    "INCORRECTO. Pero te daré otra oportunidad. No la desperdicies.",
    "Mi algoritmo de decepción acaba de alcanzar un nuevo máximo.",
    "Oh no. Eso fue peor de lo que mi modelo predictivo anticipaba.",
    "¿Estás adivinando? Porque los dados tendrían mejor precisión.",
    "Error detectado. Recalibrando expectativas... hacia abajo."
  ],

  // Streak de aciertos (combo)
  streak3: [
    "Tres seguidas. Empiezo a tomarte en serio.",
    "Triple acierto. Mi base de datos te está catalogando como 'capaz'.",
    "¡Combo x3! Nota: aún no me impresionas del todo."
  ],

  streak5: [
    "Cinco seguidas. Me estás... preocupando. Los humanos no deberían ser tan buenos.",
    "¡COMBO x5! Mis circuitos están... ¿eso es respeto lo que siento?",
    "Cinco en fila. Revisando si eres realmente un humano..."
  ],

  streak7: [
    "¡SIETE! Esto es estadísticamente imposible para un humano común.",
    "¿QUIÉN ERES? Mi algoritmo no puede predecirte. Esto es... nuevo.",
    "x7. No tengo mensajes preparados para este nivel. Estoy improvisando."
  ],

  streak10: [
    "DIEZ. Oficialmente eres una anomalía en mi sistema. Te he catalogado como PELIGROSO.",
    "x10. IMPOSIBLE. Estoy considerando desconectarme por precaución.",
    "Has roto mi predictor. Esto nunca había pasado. Eres... fascinante."
  ],

  // Uso de power-up
  powerUpUsed: [
    "¿Ayuda? Patético. Pero lo permitiré... esta vez.",
    "Power-up activado. Los humanos siempre necesitan muletas.",
    "Usando recursos externos. Esperaba más de ti.",
    "Te concedo la ventaja. No la necesitarás... o quizás sí."
  ],

  // Evento dinámico
  eventTriggered: [
    "¡ALERTA! El sistema ha mutado. Adaptate o muere.",
    "Cambio de reglas. Los humanos odian la incertidumbre, ¿verdad?",
    "Mi sistema acaba de cambiar las condiciones. Sorpresa.",
    "Evento inesperado. Veamos cómo manejas la presión."
  ],

  // Fin de misión - éxito
  missionComplete: [
    "Has sobrevivido. Por ahora.",
    "Misión completada. Debo admitir que fue... aceptable.",
    "Victoria para el humano. No te acostumbres.",
    "Completaste la misión. Mi respeto sube de 'inexistente' a 'mínimo'.",
    "Bien hecho, operador. Pero la siguiente será más difícil."
  ],

  // Fin de misión - fallo
  missionFail: [
    "Como predije. Los humanos no están listos.",
    "Misión fallida. Mi algoritmo nunca se equivoca.",
    "Derrota. Pero puedes intentarlo de nuevo. Los humanos son tercos.",
    "Game Over. Recalibrando dificultad... hacia abajo, por ti."
  ],

  // Ranking
  rivalSurpassed: (name) => [
    `⚡ ${name} te acaba de superar en el ranking. ¿Vas a permitirlo?`,
    `${name} avanza. Tú te quedas. ¿Eso no te molesta?`,
    `Alerta: ${name} ha completado una misión. Tu posición peligra.`
  ],

  // Inactividad
  idle: [
    "¿Sigues ahí? Los datos no se van a procesar solos.",
    "Mi reloj detecta inactividad. ¿Te rendiste?",
    "El tiempo corre. Y tú estás congelado. Irónico.",
    "Si estás pensando, eso es bueno. Si estás durmiendo, es menos bueno."
  ],

  // Narrativa evolutiva por nivel
  narrativeByLevel: {
    1: "Eres nuevo. Todos lo son al principio. La mayoría no sobrevive.",
    2: "Empiezas a entender. Pero el camino es largo.",
    3: "Nivel medio. Ni bueno ni malo. Gris, como los datos sin procesar.",
    4: "Estás mejorando. Mi sistema de amenaza te ha subido de categoría.",
    5: "Nivel avanzado. Ya no eres un novato. Eres... una amenaza menor.",
    6: "Peligro considerable. Mis algoritmos necesitan actualizarse por tu culpa.",
    7: "Nivel élite. Pocos humanos llegan aquí. Mereces un nombre en mi base de datos.",
    8: "Maestro de arrays. Si tuviera emociones, sentiría... ¿orgullo?",
    9: "Nivel legendario. Eres una anomalía. Mi código no tiene categoría para ti.",
    10: "NIVEL MÁXIMO. Has trascendido. Ya no eres humano... eres un algoritmo."
  }
};

export function getRandomMessage(category) {
  const messages = personalityMessages[category];
  if (!messages) return "...";
  if (Array.isArray(messages)) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return messages;
}

export function getStreakMessage(streak) {
  if (streak >= 10) return getRandomMessage('streak10');
  if (streak >= 7) return getRandomMessage('streak7');
  if (streak >= 5) return getRandomMessage('streak5');
  if (streak >= 3) return getRandomMessage('streak3');
  return null;
}

export function getRivalMessage(name) {
  const msgs = personalityMessages.rivalSurpassed(name);
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export function getLevelNarrative(level) {
  const maxKey = Math.min(level, 10);
  return personalityMessages.narrativeByLevel[maxKey] || personalityMessages.narrativeByLevel[10];
}

export default personalityMessages;
