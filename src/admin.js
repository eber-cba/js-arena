// ═══════════════════════════════════════════════════════════════
// JS_ARENA — ADMIN DASHBOARD (Panel del Profesor)
// Real-time monitoring of all students via Firebase
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import { 
  getDatabase, ref, onValue, query, orderByChild, limitToLast 
} from 'firebase/database';

// Same Firebase config as main app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ── State ──────────────────────────────────────────────────
let onlinePlayers = [];
let rankingPlayers = [];
let activityFeed = [];
let connectionStatus = 'connecting';

// ── Styles ─────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  :root {
    --neon-cyan: #00f5ff;
    --neon-green: #39ff14;
    --neon-magenta: #ff00ff;
    --neon-orange: #ff6a00;
    --neon-red: #ff0040;
    --neon-yellow: #ffd700;
    --neon-purple: #b000ff;
    --neon-blue: #0080ff;
    --bg-deepest: #000000;
    --bg-deep: #050510;
    --bg-dark: #0a0a1a;
    --bg-card: rgba(10, 10, 30, 0.85);
    --text-primary: #e0e0ff;
    --text-secondary: rgba(224, 224, 255, 0.6);
    --text-dim: rgba(224, 224, 255, 0.3);
    --border-subtle: rgba(0, 245, 255, 0.1);
    --border-active: rgba(0, 245, 255, 0.4);
    --font-mono: 'JetBrains Mono', monospace;
    --font-display: 'Orbitron', sans-serif;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    font-family: var(--font-mono);
    background: var(--bg-deepest);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg-deep); }
  ::-webkit-scrollbar-thumb { background: var(--neon-cyan); border-radius: 3px; }

  .admin-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
  }

  /* Header */
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-subtle);
  }

  .admin-logo {
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 900;
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-magenta));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .admin-subtitle {
    font-size: 0.7rem;
    color: var(--text-dim);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .connection-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .connection-badge.connected {
    background: rgba(57, 255, 20, 0.1);
    border: 1px solid rgba(57, 255, 20, 0.3);
    color: var(--neon-green);
  }

  .connection-badge.offline {
    background: rgba(255, 0, 64, 0.1);
    border: 1px solid rgba(255, 0, 64, 0.3);
    color: var(--neon-red);
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--neon-green);
    box-shadow: 0 0 8px var(--neon-green);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* Stats Bar */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-box {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
  }

  .stat-box:hover {
    border-color: var(--border-active);
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.1);
  }

  .stat-icon { font-size: 1.8rem; margin-bottom: 8px; }
  
  .stat-number {
    font-family: var(--font-display);
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--neon-cyan);
    text-shadow: 0 0 15px rgba(0, 245, 255, 0.3);
  }

  .stat-label {
    font-size: 0.65rem;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 4px;
  }

  /* Main Grid */
  .admin-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 24px;
  }

  @media (max-width: 1024px) {
    .admin-grid { grid-template-columns: 1fr; }
  }

  /* Panels */
  .panel {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(0, 245, 255, 0.03);
    border-bottom: 1px solid var(--border-subtle);
  }

  .panel-title {
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--neon-cyan);
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .panel-badge {
    font-family: var(--font-display);
    font-size: 0.65rem;
    padding: 3px 10px;
    border-radius: 10px;
    font-weight: 700;
  }

  .panel-body { padding: 16px; }

  /* Player Cards */
  .player-card {
    display: grid;
    grid-template-columns: 40px 1fr auto auto;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 6px;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .player-card:hover {
    background: rgba(0, 245, 255, 0.05);
    border-color: var(--border-subtle);
  }

  .player-card.playing {
    background: rgba(57, 255, 20, 0.03);
    border-color: rgba(57, 255, 20, 0.15);
    animation: playing-glow 3s ease-in-out infinite;
  }

  @keyframes playing-glow {
    0%, 100% { box-shadow: none; }
    50% { box-shadow: 0 0 15px rgba(57, 255, 20, 0.08); }
  }

  .player-avatar {
    font-size: 1.5rem;
    text-align: center;
  }

  .player-name {
    font-weight: 600;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .player-status {
    font-size: 0.65rem;
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .player-status.active { color: var(--neon-green); }
  .player-status.idle { color: var(--text-dim); }

  .player-mission {
    font-size: 0.6rem;
    color: var(--neon-yellow);
    background: rgba(255, 215, 0, 0.08);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(255, 215, 0, 0.15);
  }

  .player-score {
    text-align: right;
  }

  .player-score-value {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--neon-yellow);
  }

  .player-level {
    font-size: 0.6rem;
    color: var(--text-dim);
  }

  /* Progress Bar */
  .mini-progress {
    width: 100%;
    height: 4px;
    background: rgba(0, 245, 255, 0.1);
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
  }

  .mini-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--neon-cyan), var(--neon-blue));
    transition: width 0.5s ease;
  }

  /* Ranking */
  .rank-row {
    display: grid;
    grid-template-columns: 35px 1fr auto auto;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 4px;
    transition: all 0.2s ease;
  }

  .rank-row.top-1 { background: rgba(255, 215, 0, 0.08); border: 1px solid rgba(255, 215, 0, 0.2); }
  .rank-row.top-2 { background: rgba(192, 192, 192, 0.08); border: 1px solid rgba(192, 192, 192, 0.2); }
  .rank-row.top-3 { background: rgba(205, 127, 50, 0.08); border: 1px solid rgba(205, 127, 50, 0.2); }

  .rank-number {
    font-family: var(--font-display);
    font-weight: 900;
    font-size: 1rem;
    text-align: center;
  }

  .top-1 .rank-number { color: var(--neon-yellow); }
  .top-2 .rank-number { color: #c0c0c0; }
  .top-3 .rank-number { color: #cd7f32; }

  /* Activity Feed */
  .feed-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(0, 245, 255, 0.05);
    animation: feed-in 0.4s ease;
  }

  @keyframes feed-in {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .feed-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }

  .feed-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .feed-text strong { color: var(--neon-cyan); }

  .feed-time {
    font-size: 0.6rem;
    color: var(--text-dim);
    margin-top: 2px;
  }

  /* Clock */
  .clock {
    font-family: var(--font-display);
    font-size: 1.2rem;
    color: var(--text-dim);
    letter-spacing: 2px;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-dim);
    font-size: 0.8rem;
  }

  .empty-state .empty-icon {
    font-size: 3rem;
    margin-bottom: 12px;
    opacity: 0.3;
  }

  /* Scanlines */
  .scanlines {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 1000;
    background: repeating-linear-gradient(
      to bottom, transparent, transparent 2px,
      rgba(0, 0, 0, 0.06) 2px, rgba(0, 0, 0, 0.06) 4px
    );
  }
`;
document.head.appendChild(style);

// ── Render ─────────────────────────────────────────────────
const adminApp = document.getElementById('admin-app');

function render() {
  const totalOnline = onlinePlayers.length;
  const playing = onlinePlayers.filter(p => p.status === 'jugando').length;
  const inMenu = onlinePlayers.filter(p => p.status === 'menú').length;
  const avgScore = rankingPlayers.length > 0 
    ? Math.round(rankingPlayers.reduce((s, p) => s + (p.score || 0), 0) / rankingPlayers.length) 
    : 0;
  const topScore = rankingPlayers.length > 0 ? rankingPlayers[0]?.score || 0 : 0;
  const medals = ['', '🥇', '🥈', '🥉'];

  adminApp.innerHTML = `
    <div class="scanlines"></div>
    <div class="admin-container">
      <!-- Header -->
      <div class="admin-header">
        <div>
          <div class="admin-logo">🎓 JS_ARENA</div>
          <div class="admin-subtitle">Panel del Profesor — Vista en Vivo</div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="clock" id="clock">${new Date().toLocaleTimeString('es-AR')}</div>
          <div class="connection-badge ${connectionStatus === 'connected' ? 'connected' : 'offline'}">
            <span class="live-dot"></span>
            ${connectionStatus === 'connected' ? 'EN VIVO' : 'CONECTANDO...'}
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-box">
          <div class="stat-icon">👥</div>
          <div class="stat-number">${totalOnline}</div>
          <div class="stat-label">Conectados</div>
        </div>
        <div class="stat-box">
          <div class="stat-icon">🎮</div>
          <div class="stat-number" style="color: var(--neon-green);">${playing}</div>
          <div class="stat-label">Jugando</div>
        </div>
        <div class="stat-box">
          <div class="stat-icon">📋</div>
          <div class="stat-number" style="color: var(--neon-blue);">${inMenu}</div>
          <div class="stat-label">En Menú</div>
        </div>
        <div class="stat-box">
          <div class="stat-icon">⭐</div>
          <div class="stat-number" style="color: var(--neon-yellow);">${avgScore}</div>
          <div class="stat-label">Promedio Score</div>
        </div>
        <div class="stat-box">
          <div class="stat-icon">🏆</div>
          <div class="stat-number" style="color: var(--neon-orange);">${topScore}</div>
          <div class="stat-label">Mejor Score</div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="admin-grid">
        <!-- Left: Online Players -->
        <div>
          <!-- Players currently playing -->
          <div class="panel" style="margin-bottom: 24px;">
            <div class="panel-header">
              <div class="panel-title">🎮 Alumnos Conectados</div>
              <div class="panel-badge" style="background: rgba(57, 255, 20, 0.1); border: 1px solid rgba(57, 255, 20, 0.2); color: var(--neon-green);">
                ${totalOnline} online
              </div>
            </div>
            <div class="panel-body">
              ${totalOnline === 0 ? `
                <div class="empty-state">
                  <div class="empty-icon">📡</div>
                  <div>Esperando que los alumnos se conecten...</div>
                  <div style="margin-top: 8px; font-size: 0.7rem;">Comparte el link de la app para que entren</div>
                </div>
              ` : onlinePlayers.map(p => `
                <div class="player-card ${p.status === 'jugando' ? 'playing' : ''}">
                  <div class="player-avatar">${p.avatar || '🧑‍💻'}</div>
                  <div>
                    <div class="player-name">${p.name}</div>
                    <div class="player-status ${p.status === 'jugando' ? 'active' : 'idle'}">
                      ${p.status === 'jugando' ? '🟢 Jugando' : p.status === 'menú' ? '🔵 En menú' : '⚫ Inactivo'}
                    </div>
                    ${p.currentMission ? `<div class="player-mission">🎯 ${p.currentMission}</div>` : ''}
                    <div class="mini-progress">
                      <div class="mini-progress-fill" style="width: ${(p.missionsCompleted || 0) / 10 * 100}%;"></div>
                    </div>
                  </div>
                  <div class="player-score">
                    <div class="player-score-value">${p.score || 0}</div>
                    <div class="player-level">Lv.${p.level || 1}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Ranking + Feed -->
        <div>
          <!-- Ranking -->
          <div class="panel" style="margin-bottom: 24px;">
            <div class="panel-header">
              <div class="panel-title">🏆 Ranking en Vivo</div>
              <div class="panel-badge" style="background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255, 215, 0, 0.2); color: var(--neon-yellow);">
                TOP ${Math.min(rankingPlayers.length, 10)}
              </div>
            </div>
            <div class="panel-body" style="max-height: 400px; overflow-y: auto;">
              ${rankingPlayers.length === 0 ? `
                <div class="empty-state">
                  <div class="empty-icon">🏅</div>
                  <div>Sin datos de ranking aún</div>
                </div>
              ` : rankingPlayers.slice(0, 15).map((p, i) => `
                <div class="rank-row ${i < 3 ? 'top-' + (i + 1) : ''}">
                  <div class="rank-number">${medals[i + 1] || (i + 1)}</div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.8rem;">${p.name || 'Anónimo'}</div>
                    <div style="font-size: 0.6rem; color: var(--text-dim);">Lv.${p.level || 1} · ${p.missionsCompleted || 0}/10 misiones</div>
                  </div>
                  <div style="font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; color: var(--neon-yellow);">
                    ${p.score || 0}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Activity Feed -->
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">📡 Actividad en Vivo</div>
              <div class="panel-badge" style="background: rgba(0, 245, 255, 0.1); border: 1px solid rgba(0, 245, 255, 0.2); color: var(--neon-cyan);">
                FEED
              </div>
            </div>
            <div class="panel-body" style="max-height: 300px; overflow-y: auto;">
              ${activityFeed.length === 0 ? `
                <div class="empty-state">
                  <div class="empty-icon">📡</div>
                  <div>Sin actividad reciente</div>
                </div>
              ` : activityFeed.slice(0, 20).map(item => {
                const icons = {
                  'mission_start': '🚀',
                  'mission_complete': '🏆',
                  'top_rank': '🥇',
                  'connected': '🟢',
                  'disconnected': '🔴'
                };
                return `
                  <div class="feed-item">
                    <div class="feed-icon">${icons[item.type] || '📌'}</div>
                    <div>
                      <div class="feed-text">
                        <strong>${item.playerName || 'Sistema'}</strong> 
                        ${item.type === 'mission_start' ? `empezó "${item.mission}"` :
                          item.type === 'mission_complete' ? `completó "${item.mission}" — ${item.score} pts` :
                          item.type === 'top_rank' ? `alcanzó el puesto #${item.rank}` :
                          item.type === 'connected' ? 'se conectó' :
                          'realizó una acción'}
                      </div>
                      <div class="feed-time">${item.timestamp ? new Date(item.timestamp).toLocaleTimeString('es-AR') : 'ahora'}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Firebase Listeners ─────────────────────────────────────

// Connection test
const connRef = ref(db, '.info/connected');
onValue(connRef, (snap) => {
  connectionStatus = snap.val() ? 'connected' : 'offline';
  render();
});

// Online players
const onlineRef = ref(db, 'online');
onValue(onlineRef, (snap) => {
  onlinePlayers = [];
  snap.forEach((child) => {
    onlinePlayers.push({ id: child.key, ...child.val() });
  });
  // Sort: playing first, then by score
  onlinePlayers.sort((a, b) => {
    if (a.status === 'jugando' && b.status !== 'jugando') return -1;
    if (a.status !== 'jugando' && b.status === 'jugando') return 1;
    return (b.score || 0) - (a.score || 0);
  });
  render();
});

// Ranking (persistent scores)
const playersRef = query(ref(db, 'players'), orderByChild('score'), limitToLast(20));
onValue(playersRef, (snap) => {
  rankingPlayers = [];
  snap.forEach((child) => {
    rankingPlayers.push({ id: child.key, ...child.val() });
  });
  rankingPlayers.sort((a, b) => (b.score || 0) - (a.score || 0));
  render();
});

// Activity feed
const feedRef = query(ref(db, 'feed'), orderByChild('timestamp'), limitToLast(20));
onValue(feedRef, (snap) => {
  activityFeed = [];
  snap.forEach((child) => {
    activityFeed.push(child.val());
  });
  activityFeed.reverse();
  render();
});

// ── Clock update ───────────────────────────────────────────
setInterval(() => {
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('es-AR');
}, 1000);

// ── Initial render ─────────────────────────────────────────
render();

console.log('%c JS_ARENA — Panel del Profesor ', 'background: #0a0a1a; color: #ffd700; font-size: 16px; font-weight: bold; padding: 8px; border: 1px solid #ffd700;');
