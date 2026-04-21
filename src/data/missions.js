// ═══════════════════════════════════════════════════════════════
// JS_ARENA — MISIONES INTERACTIVAS
// 6 misiones basadas estrictamente en los métodos básicos de clase
// ═══════════════════════════════════════════════════════════════

export const missions = [
  {
    id: 'm1_indices',
    name: 'Escaneo de Nodos',
    icon: '🔍',
    methods: ['indices', 'length'],
    difficulty: 1,
    stars: '⭐',
    description: 'Accede a los puertos exactos del servidor usando índices y la propiedad length.',
    narrative: {
      intro: 'Operador, el sistema tiene nodos alienados en memoria que comienzan desde cero. Localiza el nodo inicial (0) y el último nodo usando length. El sistema de defensa nos bloquea si fallamos.',
      success: 'Acceso a los nodos concedido. Escaneo completado.',
      fail: 'Acceso denegado. Posición incorrecta del servidor.'
    },
    unlockCondition: null, 
    color: '#00f5ff'
  },
  {
    id: 'm2_escuadron',
    name: 'Escuadrón Táctico',
    icon: '🦸‍♂️',
    methods: ['push', 'unshift'],
    difficulty: 1,
    stars: '⭐',
    description: 'Añade refuerzos al escuadrón. Usa push para el flanco trasero y unshift para la vanguardia.',
    narrative: {
      intro: 'El equipo actual ["Ironman", "Superman", "Hawkeye"] requiere refuerzos inminentes. Inyecta a Spiderman al final y a Batman al inicio del frente de combate.',
      success: 'Refuerzos en posición. El perímetro está asegurado.',
      fail: 'Tácticas de refuerzo fallidas. Hemos perdido terreno.'
    },
    unlockCondition: 'm1_indices',
    color: '#b000ff'
  },
  {
    id: 'm3_padron',
    name: 'Padrón Seguro',
    icon: '🎟️',
    methods: ['Variables', 'push', 'DOM'],
    difficulty: 2,
    stars: '⭐⭐',
    description: 'Construye el enlace entre memoria e interfaz usando el renderizado DOM.',
    narrative: {
      intro: 'Nuestra red de invitados está offline. Intercepta los datos del input, envíalos al Array de memoria RAM y observa cómo actualizamos el DOM en tiempo real.',
      success: 'Sincronización DOM completada. Lista de invitados encriptada exitosamente.',
      fail: 'Protocolo de registro abortado. Entidades no reconocidas.'
    },
    unlockCondition: 'm2_escuadron',
    color: '#ff00ff'
  },
  {
    id: 'm4_aniquilacion',
    name: 'Aniquilación Selectiva',
    icon: '🔪',
    methods: ['findIndex', 'splice'],
    difficulty: 2,
    stars: '⭐⭐',
    description: 'Ubica el paquete Talla-43 con tu radar (findIndex) y córtalo con láser (splice).',
    narrative: {
      intro: 'Alarma: Datos inútiles en las tallas bloquean el flujo. Fija el target con findIndex(43) y destrúyelo quirúrgicamente con splice. No afectes a contenedores sanos.',
      success: 'Amenaza neutralizada quirúrgicamente. Flujo reestablecido.',
      fail: 'Has atacado al sector equivocado. Base de datos corrompida.'
    },
    unlockCondition: 'm3_padron',
    color: '#ff6a00'
  },
  {
    id: 'm5_infiltracion',
    name: 'Infiltración de Entidades',
    icon: '📇',
    methods: ['Objetos', 'Propiedades'],
    difficulty: 3,
    stars: '⭐⭐⭐',
    description: 'Desencripta objetos complejos. Los simples strings son para el pasado, manipula IDs.',
    narrative: {
      intro: 'Las llaves están envueltas en objetos ({ id, nombre }). Debes extraer la propiedad correcta para burlar la seguridad interna del firewall base.',
      success: 'Datos del objeto extraídos con éxito. Identidades expuestas.',
      fail: 'Extracción fallida. No has apuntado a la propiedad correcta.'
    },
    unlockCondition: 'm4_aniquilacion',
    color: '#39ff14'
  },
  {
    id: 'm6_exterminio',
    name: 'Gestor de Exterminio',
    icon: '💀',
    methods: ['Borrado Total de Servicios'],
    difficulty: 3,
    stars: '⭐⭐⭐',
    description: 'Sobrevive a los procesos zombies usando los algoritmos de exterminio en tiempo real.',
    narrative: {
      intro: 'Sobrecarga de Servidor! Tienes una lista de servicios descontrolada. Presiona los botones dinámicos para borrarlos usando el código avanzado (findIndex y splice dinámico).',
      success: 'Recursos del servidor salvados. Excelente, operador senior.',
      fail: 'Sobrecarga de CPU crítica. El sistema ha colapsado.'
    },
    unlockCondition: 'm5_infiltracion',
    color: '#ffd700'
  }
];

export function getMissionById(id) {
  return missions.find(m => m.id === id);
}

export function isMissionUnlocked(missionId, completedMissions) {
  const mission = getMissionById(missionId);
  if (!mission) return false;
  if (!mission.unlockCondition) return true;
  return completedMissions.includes(mission.unlockCondition);
}
