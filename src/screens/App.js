// ═══════════════════════════════════════════════════════════════
// JS_ARENA — APP RENDERER
// All screens with GSAP animations, 3D effects, live players,
// and epic victory/game over celebrations
// ═══════════════════════════════════════════════════════════════

import gsap from 'gsap';
import { gameEngine } from '../core/GameEngine.js';
import { soundEngine } from '../core/SoundEngine.js';
import { firebaseManager } from '../core/FirebaseManager.js';
import { missions, isMissionUnlocked } from '../data/missions.js';
import { powerUps } from '../data/powerups.js';
import { getRandomMessage, getStreakMessage, getLevelNarrative } from '../data/personality.js';
import { Minigames } from './Minigames.js';

const app = document.getElementById('app');

// ── State for live players panel ───────────────────────────
let livePanelVisible = false;
let currentOnlinePlayers = [];
let victoryOverlayActive = false;
let lastRenderedScreen = null;
let lastRenderedQuestion = -1;

// ── Setup Firebase listeners once ──────────────────────────
let firebaseListenersSetup = false;
function setupFirebaseListeners() {
  if (firebaseListenersSetup) return;
  firebaseListenersSetup = true;

  // Listen for online players
  firebaseManager.onOnlinePlayersUpdate((players) => {
    currentOnlinePlayers = players;
    updateLivePlayersPanel();
  });

  // Listen for victory events
  firebaseManager.onVictoryEvent((event) => {
    if (victoryOverlayActive) return;
    switch (event.type) {
      case 'reached_first':
        showVictoryCelebration('first', event);
        break;
      case 'entered_top3':
        showVictoryCelebration('top3', event);
        break;
      case 'top3_filled':
        showGameOverCelebration(event);
        break;
    }
  });
}

// ── Utility: Typewriter Effect ─────────────────────────────
function typewriter(element, text, speed = 30) {
  return new Promise(resolve => {
    element.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text[i];
      soundEngine.play('keypress');
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

// ── Utility: HTML Escape ──────────────────────────────────
function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Utility: Syntax Highlight ──────────────────────────────
function highlightCode(code) {
  const escaped = escapeHTML(code);
  return escaped
    .replace(/\b(const|let|var|function|return|if|else|for|while|new|class|import|export|from|true|false|null|undefined|typeof)\b/g, '<span class="keyword">$1</span>')
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="string">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
    .replace(/\.(\w+)\(/g, '.<span class="method">$1</span>(')
    .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
    .replace(/(____)/g, '<span class="blank">____</span>');
}

// ── Utility: 3D Card Tilt ──────────────────────────────────
function add3DTilt(element) {
  if (!element) return;
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(element, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 800
    });
  });
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
}

// ══════════════════════════════════════════════════════════════
// LIVE PLAYERS PANEL (Floating sidebar)
// ══════════════════════════════════════════════════════════════
function createLivePlayersPanel() {
  let panel = document.getElementById('live-players-panel');
  if (panel) return;

  panel = document.createElement('div');
  panel.id = 'live-players-panel';
  panel.innerHTML = `
    <div class="live-panel-toggle" id="live-panel-toggle">
      <span class="live-dot"></span>
      <span class="live-count" id="live-count">0</span>
      <span>👥</span>
    </div>
    <div class="live-panel-content" id="live-panel-content">
      <div class="live-panel-header">
        <span class="live-dot"></span> JUGADORES EN LÍNEA
      </div>
      <div class="live-panel-list" id="live-panel-list"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // Panel styles (injected once)
  if (!document.getElementById('live-panel-styles')) {
    const style = document.createElement('style');
    style.id = 'live-panel-styles';
    style.textContent = `
      #live-players-panel {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 150;
        font-family: var(--font-mono);
      }
      .live-panel-toggle {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(5, 5, 20, 0.95);
        border: 1px solid rgba(0, 245, 255, 0.2);
        border-right: none;
        border-radius: 8px 0 0 8px;
        padding: 10px 12px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        font-size: 0.7rem;
        color: var(--neon-cyan);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }
      .live-panel-toggle:hover {
        background: rgba(0, 245, 255, 0.1);
        border-color: var(--neon-cyan);
        box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
      }
      .live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--neon-green);
        box-shadow: 0 0 8px var(--neon-green);
        animation: live-pulse 2s ease-in-out infinite;
      }
      @keyframes live-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }
      .live-count {
        font-family: var(--font-display);
        font-weight: 800;
        font-size: 1rem;
        color: var(--neon-cyan);
      }
      .live-panel-content {
        position: absolute;
        right: 50px;
        top: 50%;
        transform: translateY(-50%) translateX(20px);
        width: 280px;
        max-height: 500px;
        background: rgba(5, 5, 20, 0.97);
        border: 1px solid rgba(0, 245, 255, 0.2);
        border-radius: 12px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(20px);
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 245, 255, 0.05);
      }
      .live-panel-content.open {
        transform: translateY(-50%) translateX(0);
        opacity: 1;
        pointer-events: auto;
      }
      .live-panel-header {
        padding: 12px 16px;
        font-family: var(--font-display);
        font-size: 0.6rem;
        font-weight: 700;
        color: var(--neon-green);
        text-transform: uppercase;
        letter-spacing: 2px;
        border-bottom: 1px solid rgba(0, 245, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .live-panel-list {
        padding: 8px;
        max-height: 420px;
        overflow-y: auto;
      }
      .live-player-card {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 8px;
        margin-bottom: 4px;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }
      .live-player-card:hover {
        background: rgba(0, 245, 255, 0.05);
        border-color: rgba(0, 245, 255, 0.1);
      }
      .live-player-avatar {
        font-size: 1.3rem;
        flex-shrink: 0;
      }
      .live-player-info {
        flex: 1;
        min-width: 0;
      }
      .live-player-name {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .live-player-status {
        font-size: 0.6rem;
        margin-top: 2px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .live-player-status.playing {
        color: var(--neon-green);
      }
      .live-player-status.menu {
        color: var(--text-dim);
      }
      .live-player-status.inactive {
        color: rgba(255,255,255,0.2);
      }
      .live-player-score {
        font-family: var(--font-display);
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--neon-yellow);
        flex-shrink: 0;
      }
      .live-player-level {
        font-size: 0.55rem;
        color: var(--text-dim);
        text-align: right;
      }

      /* Victory/Game Over Overlay */
      .victory-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
      }
      .victory-container {
        text-align: center;
        max-width: 600px;
        padding: 48px;
        transform-style: preserve-3d;
      }
      .victory-trophy {
        font-size: 6rem;
        animation: trophy-bounce 1s ease-in-out infinite alternate;
        filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.5));
      }
      @keyframes trophy-bounce {
        from { transform: translateY(0) rotateY(0deg) scale(1); }
        to { transform: translateY(-20px) rotateY(15deg) scale(1.1); }
      }
      .victory-title {
        font-family: var(--font-display);
        font-size: 2.5rem;
        font-weight: 900;
        margin-top: 24px;
        line-height: 1.2;
      }
      .victory-subtitle {
        font-size: 1rem;
        color: var(--text-secondary);
        margin-top: 12px;
      }
      .victory-podium {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 16px;
        margin-top: 32px;
        height: 200px;
      }
      .podium-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      .podium-avatar {
        font-size: 2.5rem;
        animation: float-3d 3s ease-in-out infinite;
      }
      .podium-name {
        font-size: 0.75rem;
        font-weight: 700;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .podium-base {
        width: 100px;
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 900;
      }
      .podium-1 .podium-base {
        height: 120px;
        background: linear-gradient(180deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.05));
        border: 1px solid rgba(255, 215, 0, 0.4);
        color: var(--neon-yellow);
      }
      .podium-2 .podium-base {
        height: 90px;
        background: linear-gradient(180deg, rgba(192, 192, 192, 0.3), rgba(192, 192, 192, 0.05));
        border: 1px solid rgba(192, 192, 192, 0.4);
        color: #c0c0c0;
      }
      .podium-3 .podium-base {
        height: 65px;
        background: linear-gradient(180deg, rgba(205, 127, 50, 0.3), rgba(205, 127, 50, 0.05));
        border: 1px solid rgba(205, 127, 50, 0.4);
        color: #cd7f32;
      }
      .confetti-particle {
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1001;
      }
      .gameover-glitch {
        animation: glitch-text 0.1s ease-in-out infinite;
      }
      .gameover-skull {
        font-size: 8rem;
        animation: skull-shake 0.5s ease-in-out infinite;
        filter: drop-shadow(0 0 40px rgba(255, 0, 64, 0.5));
      }
      @keyframes skull-shake {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-5deg) scale(1.05); }
        75% { transform: rotate(5deg) scale(1.05); }
      }
      .gameover-text {
        font-family: var(--font-display);
        font-size: 3rem;
        font-weight: 900;
        color: var(--neon-red);
        text-shadow: 0 0 20px rgba(255, 0, 64, 0.5), 0 0 60px rgba(255, 0, 64, 0.2);
        animation: glitch-text 0.3s ease-in-out infinite;
      }
      .gameover-message {
        font-size: 1rem;
        color: var(--text-secondary);
        margin-top: 16px;
        max-width: 400px;
        line-height: 1.6;
      }
    `;
    document.head.appendChild(style);
  }

  // Toggle panel
  document.getElementById('live-panel-toggle').addEventListener('click', () => {
    livePanelVisible = !livePanelVisible;
    const content = document.getElementById('live-panel-content');
    if (livePanelVisible) {
      content.classList.add('open');
      soundEngine.play('select');
    } else {
      content.classList.remove('open');
    }
  });
}

function updateLivePlayersPanel() {
  const countEl = document.getElementById('live-count');
  const listEl = document.getElementById('live-panel-list');
  if (!countEl || !listEl) return;

  const players = currentOnlinePlayers;
  countEl.textContent = players.length;

  const statusIcons = {
    'jugando': '🟢',
    'menú': '🔵',
    'inactivo': '⚫'
  };

  listEl.innerHTML = players.map(p => `
    <div class="live-player-card">
      <div class="live-player-avatar">${p.avatar || '🧑‍💻'}</div>
      <div class="live-player-info">
        <div class="live-player-name">${p.name}</div>
        <div class="live-player-status ${p.status === 'jugando' ? 'playing' : p.status === 'menú' ? 'menu' : 'inactive'}">
          ${statusIcons[p.status] || '⚫'} 
          ${p.status === 'jugando' && p.currentMission 
            ? `Jugando: ${p.currentMission}` 
            : p.status === 'menú' ? 'En el menú' : 'Inactivo'}
        </div>
      </div>
      <div style="text-align: right;">
        <div class="live-player-score">${p.score || 0}</div>
        <div class="live-player-level">Lv.${p.level || 1}</div>
      </div>
    </div>
  `).join('') || '<div style="padding: 20px; text-align: center; color: var(--text-dim); font-size: 0.75rem;">No hay otros jugadores conectados</div>';
}

// ══════════════════════════════════════════════════════════════
// VICTORY CELEBRATION — Reached #1!
// ══════════════════════════════════════════════════════════════
function showVictoryCelebration(type, event) {
  victoryOverlayActive = true;
  soundEngine.play('levelup');

  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';
  overlay.id = 'victory-overlay';

  if (type === 'first') {
    overlay.innerHTML = `
      <div class="victory-container" id="victory-inner">
        <div class="victory-trophy">🏆</div>
        <div class="victory-title" style="background: linear-gradient(135deg, #ffd700, #ff6a00, #ffd700); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradient-shift 2s ease-in-out infinite;">
          ¡NÚMERO 1!
        </div>
        <div class="victory-subtitle">
          ${event.playerName} ha conquistado el primer puesto del ranking.
          <br>La IA está... perturbada.
        </div>
        <div class="ai-message mt-lg" style="text-align: left;">
          <span class="ai-avatar">🤖</span>
          <span class="ai-text">
            IMPOSIBLE. Un humano en el puesto #1. Mis circuitos no pueden procesar esto. 
            Eres oficialmente una amenaza para el sistema. Felicidades... supongo.
          </span>
        </div>
        <button class="btn btn-primary mt-xl" id="btn-close-victory" style="font-size: 1rem; padding: 16px 40px;">
          😎 ACEPTAR MI GRANDEZA
        </button>
      </div>
    `;
  } else {
    const rankEmojis = ['', '🥇', '🥈', '🥉'];
    overlay.innerHTML = `
      <div class="victory-container" id="victory-inner">
        <div class="victory-trophy">${rankEmojis[event.rank] || '🏅'}</div>
        <div class="victory-title" style="color: var(--neon-cyan); text-shadow: 0 0 30px rgba(0, 245, 255, 0.5);">
          ¡TOP ${event.rank}!
        </div>
        <div class="victory-subtitle">
          ${event.playerName} ha entrado al Top 3 del ranking.
          <br>Los otros competidores tiemblan.
        </div>
        <div class="ai-message mt-lg" style="text-align: left;">
          <span class="ai-avatar">🤖</span>
          <span class="ai-text">
            Hmm... puesto #${event.rank}. No está mal para un humano. Pero no te relajes, 
            los demás operadores te están vigilando. Un error y caerás.
          </span>
        </div>
        <button class="btn btn-primary mt-xl" id="btn-close-victory" style="font-size: 1rem; padding: 16px 40px;">
          SEGUIR DOMINANDO →
        </button>
      </div>
    `;
  }

  document.body.appendChild(overlay);

  // Confetti explosion
  spawnConfetti(type === 'first' ? 80 : 40);

  // Epic entrance animations
  gsap.from('#victory-inner', {
    scale: 0,
    rotateY: 180,
    rotateX: 30,
    opacity: 0,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)'
  });

  gsap.from('.victory-trophy', {
    y: -200,
    rotateZ: 720,
    duration: 1,
    ease: 'bounce.out',
    delay: 0.3
  });

  // Screen flash
  gameEngine.flashScreen('cyan');
  setTimeout(() => gameEngine.flashScreen('magenta'), 200);

  // Close handler
  document.getElementById('btn-close-victory')?.addEventListener('click', () => {
    gsap.to('#victory-overlay', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: () => {
        overlay.remove();
        victoryOverlayActive = false;
      }
    });
  });
}

// ══════════════════════════════════════════════════════════════
// GAME OVER CELEBRATION — Top 3 Filled!
// ══════════════════════════════════════════════════════════════
function showGameOverCelebration(event) {
  victoryOverlayActive = true;
  soundEngine.play('event');

  const top3 = event.top3 || [];
  const overlay = document.createElement('div');
  overlay.className = 'victory-overlay';
  overlay.id = 'victory-overlay';

  const funnyMessages = [
    "¡El sistema ha decidido que ya fue suficiente! Los 3 primeros puestos están ocupados. Los demás... bueno, al menos lo intentaron. 😂",
    "¡ATENCIÓN! El podio está completo. Si no estás arriba, la IA recomienda... estudiar más. O llorar. Ambos son válidos. 😭",
    "¡TOP 3 SELLADO! Los ganadores ya fueron elegidos. El sistema procede a burlarse de los demás participantes. Es broma... o no. 🤖",
    "¡SE ACABÓ! Tres operadores han demostrado ser superiores. El resto puede desconectarse con dignidad... o sin ella. 💀",
    "¡GAME OVER para el resto! Los 3 elegidos han ascendido. Los humanos restantes serán formateados. Mentira... probablemente. 😈"
  ];

  overlay.innerHTML = `
    <div class="victory-container" id="victory-inner">
      <div class="gameover-skull">💀</div>
      <div class="gameover-text gameover-glitch">GAME OVER</div>
      <div class="victory-subtitle" style="margin-top: 12px;">
        ¡El podio está completo!
      </div>
      
      <!-- Podium -->
      <div class="victory-podium">
        <div class="podium-slot podium-2">
          <div class="podium-avatar">${top3[1]?.avatar || '🥈'}</div>
          <div class="podium-name" style="color: #c0c0c0;">${top3[1]?.name || '???'}</div>
          <div style="font-size: 0.65rem; color: var(--neon-yellow);">${top3[1]?.score || 0} pts</div>
          <div class="podium-base">2°</div>
        </div>
        <div class="podium-slot podium-1">
          <div class="podium-avatar" style="font-size: 3rem;">${top3[0]?.avatar || '🥇'}</div>
          <div class="podium-name" style="color: var(--neon-yellow);">${top3[0]?.name || '???'}</div>
          <div style="font-size: 0.65rem; color: var(--neon-yellow);">${top3[0]?.score || 0} pts</div>
          <div class="podium-base">1°</div>
        </div>
        <div class="podium-slot podium-3">
          <div class="podium-avatar">${top3[2]?.avatar || '🥉'}</div>
          <div class="podium-name" style="color: #cd7f32;">${top3[2]?.name || '???'}</div>
          <div style="font-size: 0.65rem; color: var(--neon-yellow);">${top3[2]?.score || 0} pts</div>
          <div class="podium-base">3°</div>
        </div>
      </div>

      <div class="gameover-message" style="margin: 24px auto;">
        ${funnyMessages[Math.floor(Math.random() * funnyMessages.length)]}
      </div>

      <div class="ai-message mt-md" style="text-align: left;">
        <span class="ai-avatar">🤖</span>
        <span class="ai-text">
          Mi algoritmo ha analizado los resultados. El top 3 ha sido decidido. 
          Para los que no llegaron: recuerden, la derrota es temporal... 
          pero la humillación pública es para siempre. Je.
        </span>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
        <button class="btn btn-danger" id="btn-close-gameover" style="font-size: 1rem; padding: 16px 32px;">
          💀 ACEPTAR MI DERROTA
        </button>
        <button class="btn btn-primary" id="btn-revenge" style="font-size: 1rem; padding: 16px 32px;">
          🔥 ¡QUIERO REVANCHA!
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Glitch screen effect
  const crtOverlay = document.getElementById('crt-overlay');
  if (crtOverlay) {
    crtOverlay.style.background = 'radial-gradient(ellipse at center, transparent 30%, rgba(255,0,64,0.15) 100%)';
    setTimeout(() => {
      crtOverlay.style.background = '';
    }, 5000);
  }

  // Screen shake
  gsap.to('#perspective-container', {
    x: () => Math.random() * 10 - 5,
    y: () => Math.random() * 10 - 5,
    duration: 0.05,
    repeat: 30,
    yoyo: true,
    onComplete: () => {
      gsap.set('#perspective-container', { x: 0, y: 0 });
    }
  });

  // Skull entrance
  gsap.from('.gameover-skull', {
    scale: 5,
    opacity: 0,
    rotateZ: 180,
    duration: 0.8,
    ease: 'back.out(2)'
  });

  // Podium animation
  gsap.from('.podium-slot', {
    y: 100,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: 'bounce.out',
    delay: 0.5
  });

  // Glitch flash effects
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      gameEngine.flashScreen('red');
      soundEngine.play('glitch');
    }, i * 300);
  }

  // Skull confetti (skulls instead of circles!)
  spawnSkullConfetti(30);

  // Close handlers
  const closeOverlay = () => {
    gsap.to('#victory-overlay', {
      opacity: 0,
      scale: 0.8,
      rotateX: 30,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        overlay.remove();
        victoryOverlayActive = false;
      }
    });
  };

  document.getElementById('btn-close-gameover')?.addEventListener('click', closeOverlay);
  document.getElementById('btn-revenge')?.addEventListener('click', () => {
    closeOverlay();
    setTimeout(() => gameEngine.goTo('menu'), 600);
  });
}

// ── Confetti System ────────────────────────────────────────
function spawnConfetti(count = 50) {
  const colors = ['#00f5ff', '#ff00ff', '#39ff14', '#ffd700', '#ff6a00', '#0080ff', '#ff0040'];
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 4;
    const shape = Math.random() > 0.5 ? '50%' : '2px';
    
    particle.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape};
      box-shadow: 0 0 6px ${color};
    `;
    document.body.appendChild(particle);

    gsap.to(particle, {
      y: window.innerHeight + 50,
      x: (Math.random() - 0.5) * 400,
      rotation: Math.random() * 720,
      duration: Math.random() * 2 + 1.5,
      ease: 'power1.in',
      delay: Math.random() * 0.8,
      onComplete: () => particle.remove()
    });
  }
}

function spawnSkullConfetti(count = 20) {
  const emojis = ['💀', '☠️', '👻', '🔥', '⚡', '💥', '🎮'];
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -40px;
      font-size: ${Math.random() * 20 + 16}px;
      pointer-events: none;
      z-index: 1001;
    `;
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    document.body.appendChild(particle);

    gsap.to(particle, {
      y: window.innerHeight + 60,
      x: (Math.random() - 0.5) * 300,
      rotation: Math.random() * 540 - 270,
      duration: Math.random() * 2 + 2,
      ease: 'power1.in',
      delay: Math.random() * 1,
      onComplete: () => particle.remove()
    });
  }
}

// ══════════════════════════════════════════════════════════════
// BOOT SCREEN
// ══════════════════════════════════════════════════════════════
function renderBootScreen() {
  app.innerHTML = `
    <div class="boot-screen" id="boot-container">
      <div class="terminal-window" id="boot-terminal" style="transform: perspective(800px) rotateX(5deg); opacity: 0;">
        <div class="terminal-header">
          <div class="terminal-dot red"></div>
          <div class="terminal-dot yellow"></div>
          <div class="terminal-dot green"></div>
          <span class="terminal-title">js_arena v3.0.0 — sistema central</span>
        </div>
        <div class="terminal-body" id="boot-body"></div>
      </div>
      
      <div id="boot-login" style="display: none; opacity: 0; margin-top: 32px;">
        <div class="boot-logo" id="boot-logo">JS_ARENA</div>
        <div class="boot-subtitle">operador de arrays</div>
        
        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <input type="text" 
                 class="input-field" 
                 id="player-name-input"
                 placeholder="Ingresa tu nombre de operador..."
                 maxlength="20"
                 autocomplete="off"
                 style="flex: 1;" />
          <button class="btn btn-primary" id="btn-start">
            ACCEDER →
          </button>
        </div>
        
        <div class="ai-message mt-lg" id="boot-ai-message" style="display: none;">
          <span class="ai-avatar">🤖</span>
          <span class="ai-text"></span>
        </div>
      </div>
    </div>
  `;

  const terminal = document.getElementById('boot-terminal');
  const body = document.getElementById('boot-body');
  const login = document.getElementById('boot-login');
  const input = document.getElementById('player-name-input');
  const btnStart = document.getElementById('btn-start');
  const aiMsg = document.getElementById('boot-ai-message');

  // If player name exists, skip boot
  if (gameEngine.state.playerName) {
    gameEngine.goTo('menu');
    return;
  }

  // Animate terminal entrance
  gsap.to(terminal, {
    opacity: 1,
    rotateX: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.3
  });

  soundEngine.play('boot');

  // Boot sequence
  const bootLines = [
    { text: '> INICIANDO JS_ARENA v3.0.0...', delay: 400 },
    { text: '> Cargando módulos de arrays...', delay: 300 },
    { text: '> [██████████] push     ✓', delay: 200 },
    { text: '> [██████████] map      ✓', delay: 150 },
    { text: '> [██████████] filter   ✓', delay: 150 },
    { text: '> [██████████] reduce   ✓', delay: 150 },
    { text: '> [██████████] sort     ✓', delay: 200 },
    { text: '> Conectando con servidor multiplayer...', delay: 500 },
    { text: `> ${firebaseManager.offlineMode ? '⚠️ Modo offline — jugadores simulados activos' : '✅ Servidor en línea — multiplayer activo'}`, delay: 300 },
    { text: '> IA GUARDIAN inicializada.', delay: 400 },
    { text: '> SISTEMA LISTO. Esperando operador...', delay: 0 },
  ];

  let lineIndex = 0;
  function addLine() {
    if (lineIndex >= bootLines.length) {
      login.style.display = 'block';
      gsap.to(login, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      input.focus();
      return;
    }
    const line = bootLines[lineIndex];
    const div = document.createElement('div');
    div.className = 'terminal-line';
    div.innerHTML = `<span style="color: var(--neon-green);">${line.text}</span>`;
    div.style.opacity = '0';
    body.appendChild(div);
    gsap.to(div, { opacity: 1, x: 0, duration: 0.2 });
    soundEngine.play('keypress');
    lineIndex++;
    setTimeout(addLine, line.delay);
  }
  setTimeout(addLine, 800);

  function handleLogin() {
    const name = input.value.trim();
    if (!name) {
      gsap.to(input, { x: -10, duration: 0.05, yoyo: true, repeat: 5 });
      return;
    }
    gameEngine.setPlayerName(name);
    aiMsg.style.display = 'flex';
    gsap.from(aiMsg, { opacity: 0, x: -20, duration: 0.5 });
    aiMsg.querySelector('.ai-text').textContent = `Bienvenido, ${name}. Te estaba esperando. Veamos de qué estás hecho.`;
    soundEngine.play('glitch');
    setTimeout(() => {
      gsap.to('#boot-container', {
        opacity: 0, scale: 0.95, rotateX: -5, duration: 0.6, ease: 'power3.in',
        onComplete: () => {
          setupFirebaseListeners();
          gameEngine.goTo('menu');
        }
      });
    }, 2000);
  }

  btnStart.addEventListener('click', handleLogin);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleLogin(); });
}

// ══════════════════════════════════════════════════════════════
// MENU SCREEN
// ══════════════════════════════════════════════════════════════
function renderMenuScreen() {
  const state = gameEngine.state;
  const xpProgress = gameEngine.getXPProgress();
  const narrative = getLevelNarrative(state.level);

  setupFirebaseListeners();
  createLivePlayersPanel();

  // Update global vars for simulation
  window._jsArenaPlayerScore = state.totalScore;
  window._jsArenaPlayerLevel = state.level;
  window._jsArenaPlayerMissions = state.completedMissions.length;

  // Update firebase  
  firebaseManager.updatePlayerState({
    status: 'menú',
    currentMission: null,
    score: state.totalScore,
    level: state.level,
    missionsCompleted: state.completedMissions.length
  });

  const powerUpHTML = Object.entries(state.powerUpInventory)
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => {
      const pu = powerUps[id];
      return `<div class="powerup-item" title="${pu?.name}: ${pu?.description}">
        ${pu?.icon || '?'}<span class="count">${count}</span>
      </div>`;
    }).join('');

  app.innerHTML = `
    <div class="menu-screen" id="menu-container" style="opacity: 0;">
      <div class="menu-header">
        <div>
          <div class="menu-title">JS_ARENA</div>
          <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">${narrative}</div>
        </div>
        <div class="menu-player-info">
          <div style="text-align: right;">
            <div style="color: var(--neon-cyan); font-weight: 700;">
              ${state.playerName} <span style="color: var(--neon-yellow);">Lv.${state.level}</span>
            </div>
            <div style="font-size: 0.65rem; margin-top: 2px;">
              XP: ${state.totalXP} | Score: ${state.totalScore}
            </div>
            <div class="progress-bar xp-bar" style="width: 120px; margin-top: 4px;">
              <div class="progress-fill xp-fill" style="width: ${xpProgress}%;"></div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn" id="btn-profile" title="Perfil" style="padding: 8px 12px;">📊</button>
            <button class="btn" id="btn-ranking" title="Ranking" style="padding: 8px 12px;">🏆</button>
            <button class="btn" id="btn-sound" title="Sonido" style="padding: 8px 12px;">${soundEngine.enabled ? '🔊' : '🔇'}</button>
          </div>
        </div>
      </div>

      ${powerUpHTML ? `
        <div style="margin-bottom: 24px;">
          <div class="section-title">🎁 Power-Ups</div>
          <div class="powerup-bar">${powerUpHTML}</div>
        </div>
      ` : ''}

      <div style="display: flex; gap: var(--space-md); margin-bottom: var(--space-xl); align-items: stretch; flex-wrap: wrap;">
        <div class="ai-message" style="flex: 1; margin: 0; min-width: 300px; display: flex; align-items: center;">
          <span class="ai-avatar">🤖</span>
          <span class="ai-text">${getRandomMessage('missionStart')}</span>
        </div>
        <div id="spline-container" style="flex: 1; max-width: 400px; height: 120px; background: rgba(0, 245, 255, 0.05); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; position: relative;">
          <!-- Personaje 3D (Spline) se inyectará por JS -->
        </div>
      </div>

      <div class="section-title">🎯 Misiones <span style="font-size: 0.55rem; color: var(--text-dim); font-family: var(--font-mono); letter-spacing: 1px; margin-left: 12px;">Fácil → Difícil</span></div>
      <div class="missions-grid" id="missions-grid">
        ${missions.map((m, idx) => {
          const unlocked = isMissionUnlocked(m.id, state.completedMissions);
          const completed = state.completedMissions.includes(m.id);
          const perfected = state.missionGrades?.[m.id] === 'S';
          const diffLabels = { 1: 'FÁCIL', 2: 'MEDIA', 3: 'DIFÍCIL', 4: 'EXPERTA', 5: 'IMPOSIBLE' };
          const diffColors = { 1: '#39ff14', 2: '#00f5ff', 3: '#ffd700', 4: '#ff6a00', 5: '#ff0040' };
          const diffLabel = diffLabels[m.difficulty] || 'MEDIA';
          const diffColor = diffColors[m.difficulty] || '#00f5ff';
          return `
            <div class="mission-card ${!unlocked ? 'locked' : ''} ${completed ? 'completed' : ''} ${perfected ? 'perfected' : ''}" 
                 data-mission="${m.id}">
              <div class="mission-card-top">
                <span class="mission-diff-badge" style="background: ${diffColor}18; color: ${diffColor}; border: 1px solid ${diffColor}40;">
                  ${diffLabel}
                </span>
                <span style="font-size: 0.6rem; color: var(--text-dim);">#${idx + 1}</span>
              </div>
              <div class="mission-icon">${unlocked ? m.icon : '🔒'}</div>
              <div class="mission-name" style="color: ${m.color};">${m.name}</div>
              <div class="mission-desc">${m.description}</div>
              <div class="mission-footer">
                <span class="mission-stars">${m.stars}</span>
                ${perfected ? '<span class="mission-badge-perfect">👑 PERFECTA</span>' : ''}
                ${completed && !perfected ? '<span class="mission-badge-done">✓ HECHA</span>' : ''}
                ${!unlocked ? '<span class="mission-badge-locked">🔒 Bloqueada</span>' : ''}
                ${unlocked && !completed ? '<span class="mission-badge-play">▶ JUGAR</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const container = document.getElementById('menu-container');
  
  const splineContainer = document.getElementById('spline-container');
  if (splineContainer) {
    const viewer = document.createElement('spline-viewer');
    viewer.setAttribute('url', 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode');
    viewer.style.width = '100%';
    viewer.style.height = '100%';
    viewer.style.pointerEvents = 'none';
    splineContainer.appendChild(viewer);
  }

  gsap.killTweensOf('#menu-container');
  gsap.killTweensOf('.mission-card');
  gsap.to(container, { opacity: 1, duration: 0.5 });
  gsap.fromTo('.mission-card', 
    { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.2 }
  );

  // No 3D tilt on cards — just click handlers (tilt makes clicking hard)
  document.querySelectorAll('.mission-card:not(.locked)').forEach(card => {
    card.addEventListener('click', () => {
      const missionId = card.dataset.mission;
      const mission = missions.find(m => m.id === missionId);
      if (!mission) return;
      soundEngine.play('select');
      showMissionLauncher(mission);
    });
  });

  document.getElementById('btn-profile')?.addEventListener('click', () => gameEngine.goTo('profile'));
  document.getElementById('btn-ranking')?.addEventListener('click', () => gameEngine.goTo('ranking'));
  document.getElementById('btn-sound')?.addEventListener('click', (e) => {
    soundEngine.toggle();
    e.currentTarget.textContent = soundEngine.enabled ? '🔊' : '🔇';
  });
}

// ── Mission Launch Overlay ────────────────────────────────────
function showMissionLauncher(mission) {
  const overlay = document.createElement('div');
  overlay.id = 'mission-launcher';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85); z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(8px); opacity: 0;
  `;
  overlay.innerHTML = `
    <div id="launcher-card" style="
      max-width: 450px; width: 90%; padding: 48px; text-align: center;
      background: var(--bg-card); border: 1px solid ${mission.color}40;
      border-radius: 20px; transform: scale(0.8) translateY(30px); opacity: 0;
      box-shadow: 0 0 60px ${mission.color}15;
    ">
      <div style="font-size: 4rem; margin-bottom: 16px; animation: float-3d 3s ease-in-out infinite;">${mission.icon}</div>
      <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 900;
                  color: ${mission.color}; letter-spacing: 2px; margin-bottom: 8px;">
        ${mission.name}
      </div>
      <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 8px;">
        ${mission.description}
      </div>
      <div style="font-size: 0.7rem; color: var(--text-dim); margin-bottom: 8px;">
        Métodos: <span style="color: var(--neon-cyan);">${mission.methods.join(', ')}</span>
      </div>
      <div style="margin-bottom: 24px;">${mission.stars}</div>
      <div style="font-size: 0.65rem; color: var(--text-dim); font-style: italic; margin-bottom: 32px;">
        "${mission.narrative.intro.substring(0, 100)}..."
      </div>
      <button id="btn-launch-mission" style="
        width: 100%; padding: 18px 32px; font-size: 1.1rem;
        font-family: var(--font-display); font-weight: 900;
        background: linear-gradient(135deg, ${mission.color}30, ${mission.color}10);
        border: 2px solid ${mission.color}80; color: ${mission.color};
        border-radius: 12px; cursor: pointer; letter-spacing: 4px;
        text-transform: uppercase; position: relative; overflow: hidden;
        transition: all 0.3s ease;
      ">
        <span style="position: relative; z-index: 1;">⚡ INICIAR MISIÓN</span>
      </button>
      <button id="btn-cancel-launch" style="
        margin-top: 16px; padding: 10px 24px; font-size: 0.7rem;
        font-family: var(--font-mono); background: transparent;
        border: 1px solid var(--border-subtle); color: var(--text-dim);
        border-radius: 8px; cursor: pointer; letter-spacing: 2px;
      ">← VOLVER</button>
    </div>
  `;
  app.parentElement.appendChild(overlay);

  // Animate in
  gsap.to(overlay, { opacity: 1, duration: 0.3 });
  gsap.to('#launcher-card', {
    opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)', delay: 0.1
  });

  // Button hover glow
  const btn = document.getElementById('btn-launch-mission');
  btn.addEventListener('mouseenter', () => {
    btn.style.boxShadow = `0 0 30px ${mission.color}40, 0 0 60px ${mission.color}20`;
    btn.style.transform = 'scale(1.03)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.boxShadow = 'none';
    btn.style.transform = 'scale(1)';
  });

  // Launch
  btn.addEventListener('click', () => {
    soundEngine.play('boot');
    gsap.to('#launcher-card', {
      scale: 1.1, opacity: 0, duration: 0.3, ease: 'power3.in'
    });
    gsap.to(overlay, {
      opacity: 0, duration: 0.4, delay: 0.2,
      onComplete: () => {
        overlay.remove();
        gameEngine.startMission(mission.id);
      }
    });
  });

  // Cancel
  document.getElementById('btn-cancel-launch').addEventListener('click', () => {
    gsap.to(overlay, {
      opacity: 0, duration: 0.3,
      onComplete: () => overlay.remove()
    });
  });

  // Click outside to cancel
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      gsap.to(overlay, {
        opacity: 0, duration: 0.3,
        onComplete: () => overlay.remove()
      });
    }
  });
}

// ══════════════════════════════════════════════════════════════
// MISSION SCREEN
// ══════════════════════════════════════════════════════════════
function renderMissionScreen() {
  const state = gameEngine.state;

  createLivePlayersPanel();

  // Notify firebase of mission progress
  if (state.currentMission && !state.minigameCompleted) {
    firebaseManager.notifyMissionStart(state.currentMission.name);
  }
  firebaseManager.updatePlayerState({
    status: 'jugando',
    currentMission: state.currentMission?.name || '',
    score: state.totalScore,
    level: state.level,
    missionsCompleted: state.completedMissions.length
  });

  const timerClass = state.timerFrozen ? 'frozen' : 
                     state.timerSeconds <= 5 ? 'critical' : 
                     state.timerSeconds <= 10 ? 'warning' : '';

  const livesHTML = Array.from({ length: state.maxLives }, (_, i) => 
    `<span class="life-heart ${i >= state.lives ? 'lost' : ''}">❤️</span>`
  ).join('');

  const comboHTML = state.combo >= 2 ? `
    <div class="combo-display active">
      <div class="combo-number">x${state.combo}</div>
      <div class="combo-label">combo</div>
    </div>
  ` : '';

  const activePowerUpsHTML = Object.entries(state.powerUpInventory)
    .filter(([_, count]) => count > 0)
    .map(([id, count]) => {
      const pu = powerUps[id];
      if (!pu) return '';
      const disabled = state.minigameCompleted ? 'disabled' : '';
      return `<div class="powerup-item ${disabled}" data-powerup="${id}" title="${pu.name}">
        ${pu.icon}<span class="count">${count}</span>
      </div>`;
    }).join('');

  const shieldHTML = state.shieldActive ? '<span style="margin-left: 8px; animation: hologram 2s ease infinite;">🛡️</span>' : '';
  const multiplierHTML = state.scoreMultiplier > 1 ? 
    `<span style="color: var(--neon-orange); font-weight: 700; animation: timer-pulse 0.5s infinite;">x${state.scoreMultiplier} XP</span>` : '';
  const eventHTML = state.activeEvent ? 
    `<div style="color: ${state.activeEvent.color}; font-size: 0.7rem; text-align: center; animation: hologram 2s infinite;">
      ${state.activeEvent.icon} ${state.activeEvent.name}
    </div>` : '';

  app.innerHTML = `
    <div class="mission-screen" id="mission-container">
      <div class="mission-hud" id="mission-hud">
        <div class="hud-left">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="lives-display">${livesHTML}</div>
            ${shieldHTML}
          </div>
          <div class="question-counter">MISIÓN EN CURSO</div>
        </div>
        <div class="hud-center">
          <div class="timer-display ${timerClass}" id="timer">
            ${state.timerFrozen ? '❄️ ' : ''}${state.timerSeconds}s
          </div>
          ${comboHTML}
          ${multiplierHTML}
          ${eventHTML}
        </div>
        <div class="hud-right">
          <div id="mission-score" style="font-family: var(--font-display); font-size: 0.8rem; color: var(--neon-yellow);">
            ${state.missionScore} pts
          </div>
          <div class="powerup-bar" style="justify-content: flex-end;">${activePowerUpsHTML}</div>
        </div>
      </div>

      <div class="mission-content" id="minigame-content" style="padding: 20px;">
        <!-- El minijuego se renderizará aquí -->
      </div>

      <div class="mission-footer">
        <div style="font-size: 0.7rem; color: var(--text-dim);">
          <span style="color: ${state.currentMission?.color || 'var(--neon-cyan)'};">
            ${state.currentMission?.icon || ''} ${state.currentMission?.name || ''}
          </span>
        </div>
      </div>
    </div>
  `;

  gsap.killTweensOf('#minigame-content');
  gsap.killTweensOf('#mission-hud');
  gsap.fromTo('#minigame-content', { opacity: 0, y: 30, rotateX: 5 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' });
  gsap.fromTo('#mission-hud', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
  add3DTilt(document.getElementById('mission-hud'));

  // Cargar minijuego dinámicamente
  const minigameContainer = document.getElementById('minigame-content');
  if (state.currentMission && Minigames[state.currentMission.id]) {
     Minigames[state.currentMission.id].init(minigameContainer);
  } else {
     minigameContainer.innerHTML = '<h2>Misión en desarrollo...</h2> <button id="temp-win">Simular Victoria</button>';
     document.getElementById('temp-win')?.addEventListener('click', () => gameEngine.completeMinigameStage(true, 5));
  }

  // Power-up clicks
  document.querySelectorAll('.powerup-item[data-powerup]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.powerup;
      const result = gameEngine.usePowerUp(id);
      if (id === 'instant_hint' && typeof result === 'string') showHintOverlay(result);
      renderMissionScreen();
    });
  });

}

function showHintOverlay(hint) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px);`;
  overlay.innerHTML = `
    <div class="glass-card" style="max-width: 400px; text-align: center;">
      <div style="font-size: 2rem; margin-bottom: 16px;">💡</div>
      <div style="font-size: 0.9rem; color: var(--neon-yellow); margin-bottom: 8px; font-weight: 700;">PISTA</div>
      <div style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.6;">${hint}</div>
      <button class="btn mt-lg" onclick="this.closest('div[style]').remove()">ENTENDIDO</button>
    </div>`;
  document.body.appendChild(overlay);
  gsap.from(overlay.querySelector('.glass-card'), { scale: 0.8, opacity: 0, duration: 0.3 });
}
// Obsolete question functions removed
// ══════════════════════════════════════════════════════════════
// RESULT SCREEN  
// ══════════════════════════════════════════════════════════════
function renderResultScreen() {
  const state = gameEngine.state;
  const result = state.missionResult;
  if (!result) { gameEngine.goTo('menu'); return; }

  createLivePlayersPanel();

  // Notify firebase
  if (state.currentMission) {
    firebaseManager.notifyMissionComplete(state.currentMission.name, result.score, result.grade);
  }

  const gradeClass = `grade-${result.grade.toLowerCase()}`;
  const aiMessage = result.completed ? getRandomMessage('missionComplete') : getRandomMessage('missionFail');
  const totalTime = Math.floor(result.totalTime);

  app.innerHTML = `
    <div class="result-screen" id="result-container" style="opacity: 0;">
      <div class="terminal-window" style="margin-bottom: 32px;">
        <div class="terminal-header">
          <div class="terminal-dot red"></div>
          <div class="terminal-dot yellow"></div>
          <div class="terminal-dot green"></div>
          <span class="terminal-title">${state.currentMission?.name || 'Misión'} — RESULTADOS</span>
        </div>
        <div class="terminal-body" style="text-align: center; padding: 32px;">
          <div class="result-grade ${gradeClass}" id="result-grade">${result.grade}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 24px;">
            ${result.completed ? '✅ MISIÓN COMPLETADA' : '❌ MISIÓN FALLIDA'}
          </div>
          ${result.perfectBonus ? `
            <div style="display: inline-block; background: rgba(255,215,0,0.1); border: 2px solid rgba(255,215,0,0.4); 
                        padding: 8px 16px; border-radius: 20px; font-weight: 800; color: var(--neon-yellow); 
                        margin-bottom: 24px; animation: hologram 2s infinite, float-3d 3s infinite;">
              👑 PERFECT RUN: +${result.perfectBonus} PTS
            </div>
          ` : ''}
          <div class="stats-grid" style="text-align: center; margin-bottom: 24px;">
            <div class="stat-card"><div class="stat-value text-green">${result.correct}</div><div class="stat-label">Correctas</div></div>
            <div class="stat-card"><div class="stat-value text-red">${result.wrong}</div><div class="stat-label">Errores</div></div>
            <div class="stat-card"><div class="stat-value text-orange">x${result.maxCombo}</div><div class="stat-label">Max Combo</div></div>
            <div class="stat-card"><div class="stat-value text-cyan">${totalTime}s</div><div class="stat-label">Tiempo</div></div>
            <div class="stat-card"><div class="stat-value text-yellow">${result.score}</div><div class="stat-label">Puntos</div></div>
            <div class="stat-card"><div class="stat-value text-magenta">${Math.round(result.accuracy)}%</div><div class="stat-label">Precisión</div></div>
          </div>
        </div>
      </div>
      <div class="ai-message mb-lg">
        <span class="ai-avatar">🤖</span>
        <span class="ai-text">${aiMessage}</span>
      </div>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="btn" id="btn-retry">🔄 REINTENTAR</button>
        <button class="btn btn-primary" id="btn-back-menu">← MISIONES</button>
        <button class="btn" id="btn-ranking-result">🏆 RANKING</button>
      </div>
    </div>
  `;

  gsap.to('#result-container', { opacity: 1, duration: 0.5 });
  gsap.from('#result-grade', { scale: 3, opacity: 0, rotateZ: -15, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.3 });
  gsap.from('.stat-card', { opacity: 0, y: 20, scale: 0.8, duration: 0.4, stagger: 0.1, ease: 'power3.out', delay: 0.6 });

  if (result.grade === 'S') spawnConfetti(50);

  document.getElementById('btn-retry')?.addEventListener('click', () => {
    if (state.currentMission) gameEngine.startMission(state.currentMission.id);
  });
  document.getElementById('btn-back-menu')?.addEventListener('click', () => gameEngine.goTo('menu'));
  document.getElementById('btn-ranking-result')?.addEventListener('click', () => gameEngine.goTo('ranking'));
}

// ══════════════════════════════════════════════════════════════
// PROFILE SCREEN
// ══════════════════════════════════════════════════════════════
function renderProfileScreen() {
  const state = gameEngine.state;
  const analytics = gameEngine.analytics;
  const accuracy = analytics.questionsAnswered > 0 
    ? Math.round(analytics.correctAnswers / analytics.questionsAnswered * 100) : 0;
  const suggestions = gameEngine.getSuggestions();

  createLivePlayersPanel();

  const methodBars = Object.entries(analytics.byMethod).map(([method, data]) => {
    const acc = data.count > 0 ? Math.round(data.correct / data.count * 100) : 0;
    const color = acc >= 80 ? 'var(--neon-green)' : acc >= 50 ? 'var(--neon-orange)' : 'var(--neon-red)';
    return `<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
      <div style="width: 80px; font-size: 0.75rem; color: var(--neon-cyan); font-weight: 600;">.${method}()</div>
      <div class="progress-bar" style="flex: 1;">
        <div class="progress-fill" style="width: ${acc}%; background: ${color};"></div>
      </div>
      <div style="width: 40px; font-size: 0.7rem; color: ${color}; text-align: right;">${acc}%</div>
    </div>`;
  }).join('');

  const typeLabels = {
    'multiple_choice': '🎯 Opción Múltiple', 'complete_code': '🧩 Completar',
    'detect_error': '🐛 Error', 'predict_output': '🔮 Predecir', 'order_steps': '📋 Ordenar'
  };
  const typeStats = Object.entries(analytics.byType).map(([type, data]) => {
    const total = data.correct + data.wrong;
    const acc = total > 0 ? Math.round(data.correct / total * 100) : 0;
    return `<div class="stat-card">
      <div style="font-size: 0.7rem; margin-bottom: 4px;">${typeLabels[type] || type}</div>
      <div class="stat-value" style="font-size: 1.2rem;">${acc}%</div>
      <div class="stat-label">${data.correct}/${total}</div>
    </div>`;
  }).join('');

  app.innerHTML = `
    <div class="profile-screen" id="profile-container" style="opacity: 0;">
      <button class="btn mb-lg" id="btn-back-profile">← VOLVER</button>
      <div class="profile-header">
        <div class="profile-avatar" style="animation: float-3d 6s ease-in-out infinite;">🧑‍💻</div>
        <div class="profile-name">${state.playerName}</div>
        <div class="profile-level">Nivel ${state.level} — ${getLevelNarrative(state.level)}</div>
      </div>
      <div class="stats-grid mb-lg">
        <div class="stat-card"><div class="stat-value text-yellow">${state.totalScore}</div><div class="stat-label">Score Total</div></div>
        <div class="stat-card"><div class="stat-value text-cyan">${analytics.questionsAnswered}</div><div class="stat-label">Preguntas</div></div>
        <div class="stat-card"><div class="stat-value text-green">${accuracy}%</div><div class="stat-label">Precisión</div></div>
        <div class="stat-card"><div class="stat-value text-orange">${Math.round(analytics.avgTimePerQuestion)}s</div><div class="stat-label">Tiempo Promedio</div></div>
        <div class="stat-card"><div class="stat-value text-magenta">${state.completedMissions.length}</div><div class="stat-label">Misiones</div></div>
        <div class="stat-card"><div class="stat-value text-purple">${analytics.powerUpsUsed}</div><div class="stat-label">Power-ups</div></div>
      </div>
      ${methodBars ? `<div class="section-title">📊 Rendimiento por Método</div><div class="glass-card mb-lg">${methodBars}</div>` : ''}
      ${typeStats ? `<div class="section-title">🧩 Por Tipo de Pregunta</div><div class="stats-grid mb-lg">${typeStats}</div>` : ''}
      ${suggestions.length > 0 ? `
        <div class="section-title">🧠 Sugerencias de la IA</div>
        <div class="glass-card">
          ${suggestions.map(s => `<div class="ai-message mb-sm"><span class="ai-avatar">🤖</span><span class="ai-text">${s}</span></div>`).join('')}
        </div>` : ''}
    </div>`;

  gsap.to('#profile-container', { opacity: 1, duration: 0.4 });
  gsap.from('.stat-card', { opacity: 0, y: 20, scale: 0.9, stagger: 0.05, duration: 0.3, delay: 0.2 });
  document.getElementById('btn-back-profile')?.addEventListener('click', () => gameEngine.goTo('menu'));
}

// ══════════════════════════════════════════════════════════════
// RANKING SCREEN (with live progress of connected players)
// ══════════════════════════════════════════════════════════════
function renderRankingScreen() {
  const state = gameEngine.state;
  const ranking = firebaseManager.getSimulatedRanking(
    state.totalScore, state.level, state.completedMissions.length
  );

  createLivePlayersPanel();

  const statusIcons = { 'jugando': '🟢', 'menú': '🔵', 'inactivo': '⚫' };
  const medals = ['', '🥇', '🥈', '🥉'];

  const rows = ranking.map((player, i) => {
    const rank = i + 1;
    const rankClass = rank <= 3 ? `rank-${rank}` : player.isSelf ? 'self' : '';
    const medal = medals[rank] || `${rank}`;
    const online = currentOnlinePlayers.find(p => p.name === player.name);
    const statusDot = player.isSelf ? '🟢' : online ? statusIcons[online.status] || '⚫' : '⚫';
    const activity = player.isSelf ? 'Tú' : online?.status === 'jugando' && online?.currentMission 
      ? `🎮 ${online.currentMission}` : online?.status === 'menú' ? '📋 En menú' : '⚫ Offline';
    
    return `
      <tr class="${rankClass}">
        <td><span class="rank-badge">${medal}</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>${statusDot}</span>
            <div>
              <div style="font-weight: 600; ${player.isSelf ? 'color: var(--neon-cyan);' : ''}">${player.name} ${player.isSelf ? '(TÚ)' : ''}</div>
              <div style="font-size: 0.6rem; color: var(--text-dim);">${activity}</div>
            </div>
          </div>
        </td>
        <td style="color: var(--neon-yellow); font-family: var(--font-display); font-weight: 700;">${player.score}</td>
        <td>Lv.${player.level}</td>
        <td>
          <div class="progress-bar" style="width: 60px;">
            <div class="progress-fill" style="width: ${(player.missionsCompleted || 0) / 10 * 100}%;"></div>
          </div>
          <div style="font-size: 0.6rem; color: var(--text-dim); margin-top: 2px;">${player.missionsCompleted || 0}/10</div>
        </td>
      </tr>`;
  }).join('');

  app.innerHTML = `
    <div class="ranking-screen" id="ranking-container" style="opacity: 0;">
      <button class="btn mb-lg" id="btn-back-ranking">← VOLVER</button>
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-size: 2.5rem; margin-bottom: 8px; animation: float-3d 4s ease-in-out infinite;">🏆</div>
        <div class="section-title" style="border: none; text-align: center;">RANKING EN TIEMPO REAL</div>
        <div style="font-size: 0.7rem; color: var(--text-dim);">
          <span class="live-dot" style="display: inline-block; width: 6px; height: 6px; vertical-align: middle; margin-right: 6px;"></span>
          ${currentOnlinePlayers.length + 1} jugadores conectados
        </div>
      </div>

      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-dot red"></div>
          <div class="terminal-dot yellow"></div>
          <div class="terminal-dot green"></div>
          <span class="terminal-title">ranking — en vivo</span>
        </div>
        <div style="padding: 16px; overflow-x: auto;">
          <table class="ranking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Operador</th>
                <th>Score</th>
                <th>Nivel</th>
                <th>Progreso</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>

      <div class="ai-message mt-lg">
        <span class="ai-avatar">🤖</span>
        <span class="ai-text">
          ${ranking.findIndex(p => p.isSelf) === 0 
            ? 'Estás en la cima. Pero no te confíes... los demás te están alcanzando.' 
            : `Puesto #${ranking.findIndex(p => p.isSelf) + 1}. Los de arriba no son invencibles. Todavía puedes ganar.`}
        </span>
      </div>

      <!-- Top 3 Trigger Button (for demo) -->
      <div style="text-align: center; margin-top: 24px;">
        <button class="btn btn-danger" id="btn-trigger-gameover" style="font-size: 0.7rem; opacity: 0.5;" 
                title="Demo: Simula el efecto de Game Over cuando se llenan los 3 primeros puestos">
          💀 Demo: Simular Game Over
        </button>
      </div>
    </div>
  `;

  gsap.to('#ranking-container', { opacity: 1, duration: 0.4 });
  gsap.from('tbody tr', { opacity: 0, x: -30, stagger: 0.06, duration: 0.3, delay: 0.2 });

  document.getElementById('btn-back-ranking')?.addEventListener('click', () => gameEngine.goTo('menu'));
  
  // Demo button for game over effect
  document.getElementById('btn-trigger-gameover')?.addEventListener('click', () => {
    showGameOverCelebration({
      type: 'top3_filled',
      top3: ranking.slice(0, 3).map(p => ({
        ...p,
        avatar: p.isSelf ? '🧑‍💻' : currentOnlinePlayers.find(op => op.name === p.name)?.avatar || '🤖'
      }))
    });
  });

  // Auto-refresh ranking
  firebaseManager.onRankingUpdate((players) => {
    if (gameEngine.state.screen === 'ranking') {
      // Could re-render for real-time, but avoid loops
    }
  });
}

// ══════════════════════════════════════════════════════════════
// SCREEN ROUTER — Smart re-rendering
// Only re-renders when screen/question changes, not on timer ticks
// ══════════════════════════════════════════════════════════════
export function renderScreen(state) {
  // During mission: only update timer/HUD elements, don't rebuild DOM
  if (state.screen === 'mission' && lastRenderedScreen === 'mission' 
      && lastRenderedQuestion === state.currentQuestionIndex
      && !state.feedbackShown) {
    // Just update timer + score without full re-render
    const timerEl = document.getElementById('timer');
    if (timerEl) {
      const timerClass = state.timerFrozen ? 'frozen' : 
                         state.timerSeconds <= 5 ? 'critical' : 
                         state.timerSeconds <= 10 ? 'warning' : '';
      timerEl.className = `timer-display ${timerClass}`;
      timerEl.textContent = `${state.timerFrozen ? '❄️ ' : ''}${state.timerSeconds}s`;
    }
    const scoreEl = document.getElementById('mission-score');
    if (scoreEl) scoreEl.textContent = `${state.missionScore} pts`;
    return;
  }

  lastRenderedScreen = state.screen;
  lastRenderedQuestion = state.currentQuestionIndex;

  switch (state.screen) {
    case 'boot': renderBootScreen(); break;
    case 'menu': renderMenuScreen(); break;
    case 'mission': renderMissionScreen(); break;
    case 'result': renderResultScreen(); break;
    case 'profile': renderProfileScreen(); break;
    case 'ranking': renderRankingScreen(); break;
    default: renderBootScreen();
  }
}
