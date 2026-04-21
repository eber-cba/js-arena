// ═══════════════════════════════════════════════════════════════
// JS_ARENA — MAIN ENTRY POINT
// Bootstrap + render loop
// ═══════════════════════════════════════════════════════════════

import './styles/main.css';
import { gameEngine } from './core/GameEngine.js';
import { soundEngine } from './core/SoundEngine.js';
import { MatrixRain, Particles3D } from './components/Effects.js';
import { renderScreen } from './screens/App.js';

// ── Initialize Effects ─────────────────────────────────────
const matrixCanvas = document.getElementById('matrix-canvas');
const particlesCanvas = document.getElementById('particles-canvas');

const matrixRain = new MatrixRain(matrixCanvas);
const particles3d = new Particles3D(particlesCanvas);

matrixRain.start();
particles3d.start();

// ── Initialize Game Engine ─────────────────────────────────
gameEngine.init();

// ── Subscribe to state changes ─────────────────────────────
gameEngine.subscribe((state) => {
  renderScreen(state);
});

// ── Initial render ─────────────────────────────────────────
renderScreen(gameEngine.state);

// ── Initialize Sound on first interaction ──────────────────
document.addEventListener('click', () => {
  soundEngine.init();
}, { once: true });

// ── Handle visibility change (pause timer) ─────────────────
document.addEventListener('visibilitychange', () => {
  if (document.hidden && gameEngine.state.screen === 'mission') {
    gameEngine.stopTimer();
  }
});

// ── Prevent accidental navigation ──────────────────────────
window.addEventListener('beforeunload', (e) => {
  if (gameEngine.state.screen === 'mission') {
    e.preventDefault();
    e.returnValue = '';
  }
});

// ── Easter Egg: Konami Code ────────────────────────────────
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
  if (e.keyCode === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      // Grant all power-ups
      const inv = { ...gameEngine.state.powerUpInventory };
      Object.keys(inv).forEach(k => inv[k] += 3);
      gameEngine.update({ powerUpInventory: inv });
      gameEngine.save();
      gameEngine.showNotification('🎮 KONAMI CODE → +3 de cada Power-Up!', 'rival');
      soundEngine.play('powerup');
    }
  } else {
    konamiIndex = 0;
  }
});

console.log('%c JS_ARENA v3.0.0 ', 'background: #0a0a1a; color: #00f5ff; font-size: 20px; font-weight: bold; padding: 10px; border: 1px solid #00f5ff;');
console.log('%c Un sistema educativo gamificado para aprender JavaScript ', 'color: #39ff14; font-size: 12px;');
