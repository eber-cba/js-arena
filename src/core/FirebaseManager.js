// ═══════════════════════════════════════════════════════════════
// JS_ARENA — FIREBASE MANAGER
// Real-time multiplayer with Firebase + Live Progress Tracking
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from 'firebase/app';
import { 
  getDatabase, ref, set, onValue, push, get, update, remove,
  serverTimestamp, query, orderByChild, limitToLast, onDisconnect 
} from 'firebase/database';

// Firebase config — JS-ARENA Real Project
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

class FirebaseManager {
  constructor() {
    this.app = null;
    this.db = null;
    this.playerId = null;
    this.playerName = '';
    this.listeners = [];
    this.connected = false;
    this.offlineMode = true; // Start in offline mode, switch if Firebase connects
    this.onlinePlayers = [];
    this.onlineCallbacks = new Set();
    this.feedCallbacks = new Set();
    this.rankingCallbacks = new Set();
    this.victoryCallbacks = new Set();

    // Simulated players for offline/demo mode
    this.simulatedPlayers = [
      { name: 'Carlos_Dev', score: 850, level: 7, missionsCompleted: 6, status: 'jugando', currentMission: 'Purga de Datos', avatar: '😎' },
      { name: 'Luna_Hacker', score: 1200, level: 9, missionsCompleted: 8, status: 'jugando', currentMission: 'El Compresor', avatar: '🦊' },
      { name: 'Max_Code', score: 600, level: 5, missionsCompleted: 4, status: 'menú', currentMission: null, avatar: '🤖' },
      { name: 'Sofia_JS', score: 950, level: 8, missionsCompleted: 7, status: 'jugando', currentMission: 'Corte Quirúrgico', avatar: '👩‍💻' },
      { name: 'Diego_Array', score: 400, level: 4, missionsCompleted: 3, status: 'inactivo', currentMission: null, avatar: '🧑‍🎓' },
      { name: 'Valeria_Bug', score: 1500, level: 10, missionsCompleted: 10, status: 'jugando', currentMission: 'Ruptura Dimensional', avatar: '🐱' },
      { name: 'Mateo_Loop', score: 300, level: 3, missionsCompleted: 2, status: 'menú', currentMission: null, avatar: '🎮' },
      { name: 'Ana_Filter', score: 750, level: 6, missionsCompleted: 5, status: 'jugando', currentMission: 'Escaneo Firewall', avatar: '🌟' },
      { name: 'Nico_Reduce', score: 1100, level: 8, missionsCompleted: 7, status: 'inactivo', currentMission: null, avatar: '⚡' },
      { name: 'Mia_Push', score: 200, level: 2, missionsCompleted: 1, status: 'jugando', currentMission: 'Cambio Cuántico', avatar: '🎵' }
    ];

    // Simulated activity timers
    this._simIntervals = [];
    this._previousTop3 = [];
  }

  async init() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.db = getDatabase(this.app);
      
      // Test actual connectivity — .info/connected starts false, becomes true when websocket connects
      const testRef = ref(this.db, '.info/connected');
      const connectPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          unsub();
          reject(new Error('Connection timeout'));
        }, 5000);
        
        const unsub = onValue(testRef, (snap) => {
          if (snap.val() === true) {
            clearTimeout(timeout);
            unsub();
            resolve(true);
          }
          // If false, keep listening (it starts as false before connecting)
        });
      });
      
      await connectPromise;
      this.connected = true;
      this.offlineMode = false;
      console.warn('[Firebase] ✅ Conectado al servidor en tiempo real');
    } catch (e) {
      console.warn('[Firebase] ⚠️ Modo offline activado:', e.message);
      this.offlineMode = true;
      this.connected = false;
      this.db = null;
      this._startSimulation();
    }
  }

  // ── Player Registration ──────────────────────────────────
  setPlayer(name) {
    this.playerName = name;
    this.playerId = 'player_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);

    if (this.connected && this.db) {
      const playerRef = ref(this.db, `online/${this.playerId}`);
      set(playerRef, {
        name: this.playerName,
        score: 0,
        level: 1,
        missionsCompleted: 0,
        status: 'menú',
        currentMission: null,
        avatar: '🧑‍💻',
        lastActive: serverTimestamp(),
        joinedAt: serverTimestamp()
      });
      // Remove on disconnect
      onDisconnect(playerRef).remove();

      // Also save to persistent ranking
      const rankRef = ref(this.db, `players/${this.playerId}`);
      set(rankRef, {
        name: this.playerName,
        score: 0,
        level: 1,
        missionsCompleted: 0,
        lastActive: serverTimestamp()
      });
    }
  }

  // ── Update Player State (real-time for others to see) ────
  async updatePlayerState(data) {
    if (this.connected && this.db && this.playerId) {
      try {
        const onlineRef = ref(this.db, `online/${this.playerId}`);
        await update(onlineRef, {
          ...data,
          lastActive: serverTimestamp()
        });
        // Also update persistent score
        if (data.score !== undefined) {
          const rankRef = ref(this.db, `players/${this.playerId}`);
          await update(rankRef, {
            score: data.score,
            level: data.level || 1,
            missionsCompleted: data.missionsCompleted || 0,
            lastActive: serverTimestamp()
          });
        }
      } catch (e) {
        console.warn('[Firebase] Update failed:', e);
      }
    }
  }

  // ── Start Mission (notify others) ───────────────────────
  async notifyMissionStart(missionName) {
    await this.updatePlayerState({ status: 'jugando', currentMission: missionName });
    await this._postFeed('mission_start', { mission: missionName });
  }

  // ── Complete Mission (notify others) ────────────────────
  async notifyMissionComplete(missionName, score, grade) {
    await this._postFeed('mission_complete', { mission: missionName, score, grade });
  }

  // ── Notify Top 3 Achievement ────────────────────────────
  async notifyTopRank(rank) {
    await this._postFeed('top_rank', { rank });
  }

  // ── Post to Activity Feed ───────────────────────────────
  async _postFeed(type, data) {
    if (this.connected && this.db) {
      try {
        const feedRef = ref(this.db, 'feed');
        await push(feedRef, {
          playerId: this.playerId,
          playerName: this.playerName,
          type,
          ...data,
          timestamp: serverTimestamp()
        });
      } catch (e) {
        console.warn('[Firebase] Feed post failed:', e);
      }
    }
  }

  // ── Listen to Online Players ────────────────────────────
  onOnlinePlayersUpdate(callback) {
    this.onlineCallbacks.add(callback);

    if (this.connected && this.db) {
      const onlineRef = ref(this.db, 'online');
      const unsubscribe = onValue(onlineRef, (snapshot) => {
        const players = [];
        snapshot.forEach((child) => {
          const data = child.val();
          if (child.key !== this.playerId) {
            players.push({ id: child.key, ...data });
          }
        });
        this.onlinePlayers = players;
        this.onlineCallbacks.forEach(cb => cb(players));
      });
      this.listeners.push(unsubscribe);
      return () => {
        this.onlineCallbacks.delete(callback);
        unsubscribe();
      };
    } else {
      // Offline: return simulated players
      callback(this._getSimulatedOnline());
      return () => this.onlineCallbacks.delete(callback);
    }
  }

  // ── Listen to Ranking Changes ───────────────────────────
  onRankingUpdate(callback) {
    this.rankingCallbacks.add(callback);

    if (this.connected && this.db) {
      const playersRef = query(
        ref(this.db, 'players'),
        orderByChild('score'),
        limitToLast(20)
      );
      const unsubscribe = onValue(playersRef, (snapshot) => {
        const players = [];
        snapshot.forEach((child) => {
          players.push({ id: child.key, ...child.val() });
        });
        players.sort((a, b) => (b.score || 0) - (a.score || 0));
        
        // Check for top 3 changes
        this._checkTop3Changes(players);
        
        this.rankingCallbacks.forEach(cb => cb(players));
      });
      this.listeners.push(unsubscribe);
      return () => {
        this.rankingCallbacks.delete(callback);
        unsubscribe();
      };
    } else {
      callback(this.getSimulatedRanking());
      return () => this.rankingCallbacks.delete(callback);
    }
  }

  // ── Listen to Activity Feed ─────────────────────────────
  onFeedUpdate(callback) {
    this.feedCallbacks.add(callback);

    if (this.connected && this.db) {
      const feedRef = query(
        ref(this.db, 'feed'),
        orderByChild('timestamp'),
        limitToLast(10)
      );
      const unsubscribe = onValue(feedRef, (snapshot) => {
        const items = [];
        snapshot.forEach((child) => {
          items.push(child.val());
        });
        this.feedCallbacks.forEach(cb => cb(items.reverse()));
      });
      this.listeners.push(unsubscribe);
      return unsubscribe;
    }
    return () => this.feedCallbacks.delete(callback);
  }

  // ── Register Victory Callback ───────────────────────────
  onVictoryEvent(callback) {
    this.victoryCallbacks.add(callback);
    return () => this.victoryCallbacks.delete(callback);
  }

  // ── Check Top 3 Changes ─────────────────────────────────
  _checkTop3Changes(ranking) {
    const currentTop3 = ranking.slice(0, 3).map(p => p.name || p.id);
    
    // Check if current player entered top 3
    const playerInTop3 = ranking.findIndex(p => 
      p.name === this.playerName || p.id === this.playerId
    );

    if (playerInTop3 >= 0 && playerInTop3 < 3) {
      const wasInTop3 = this._previousTop3.includes(this.playerName);
      if (!wasInTop3 && this._previousTop3.length > 0) {
        // Player just entered top 3!
        this.victoryCallbacks.forEach(cb => cb({
          type: 'entered_top3',
          rank: playerInTop3 + 1,
          playerName: this.playerName
        }));
      }

      if (playerInTop3 === 0) {
        const wasFirst = this._previousTop3[0] === this.playerName;
        if (!wasFirst && this._previousTop3.length > 0) {
          // Player just reached #1!
          this.victoryCallbacks.forEach(cb => cb({
            type: 'reached_first',
            playerName: this.playerName
          }));
        }
      }
    }

    // Check if all top 3 are filled (for game over effect)
    if (currentTop3.length >= 3 && this._previousTop3.length < 3) {
      this.victoryCallbacks.forEach(cb => cb({
        type: 'top3_filled',
        top3: ranking.slice(0, 3)
      }));
    }

    this._previousTop3 = currentTop3;
  }

  // ── Simulated Online Players (offline mode) ─────────────
  _getSimulatedOnline() {
    return this.simulatedPlayers.filter(p => p.status !== 'inactivo');
  }

  getSimulatedRanking(playerScore = 0, playerLevel = 1, playerMissions = 0) {
    const allPlayers = [
      ...this.simulatedPlayers.map(p => ({ ...p })),
      {
        name: this.playerName || 'Tú',
        score: playerScore,
        level: playerLevel,
        missionsCompleted: playerMissions,
        isSelf: true,
        avatar: '🧑‍💻'
      }
    ];
    return allPlayers.sort((a, b) => b.score - a.score);
  }

  // ── Simulate Real-Time Activity (offline mode) ──────────
  _startSimulation() {
    // Simulate players completing missions
    const interval1 = setInterval(() => {
      const activeIdx = Math.floor(Math.random() * this.simulatedPlayers.length);
      const player = this.simulatedPlayers[activeIdx];
      
      // Random activity
      const roll = Math.random();
      if (roll < 0.3) {
        // Score increase
        player.score += Math.floor(Math.random() * 50 + 10);
        player.status = 'jugando';
      } else if (roll < 0.5) {
        // Mission progress
        const missionNames = ['Protocolo Génesis', 'Cambio Cuántico', 'Red Neuronal', 
                              'Purga de Datos', 'Bloqueo de Objetivo', 'Escaneo Firewall',
                              'El Compresor', 'Corte Quirúrgico', 'Protocolo de Orden', 'Ruptura Dimensional'];
        player.currentMission = missionNames[Math.floor(Math.random() * missionNames.length)];
        player.status = 'jugando';
      } else if (roll < 0.65) {
        player.status = 'menú';
        player.currentMission = null;
      }

      // Notify callbacks
      this.onlineCallbacks.forEach(cb => cb(this._getSimulatedOnline()));
    }, 8000);

    // Simulate rival notifications during missions
    const interval2 = setInterval(() => {
      this.rankingCallbacks.forEach(cb => {
        cb(this.getSimulatedRanking(
          window._jsArenaPlayerScore || 0,
          window._jsArenaPlayerLevel || 1,
          window._jsArenaPlayerMissions || 0
        ));
      });
    }, 12000);

    this._simIntervals.push(interval1, interval2);
  }

  // ── Generate Rival Notification ─────────────────────────
  simulateRivalNotification(playerScore) {
    const rivals = this.simulatedPlayers.filter(p => 
      Math.abs(p.score - playerScore) < 400 && p.status === 'jugando'
    );
    if (rivals.length === 0) return null;
    
    const rival = rivals[Math.floor(Math.random() * rivals.length)];
    const actions = [
      `acaba de completar una misión`,
      `te superó en el ranking`,
      `logró un combo de x${Math.floor(Math.random() * 5 + 3)}`,
      `desbloqueó un logro secreto`,
      `alcanzó nivel ${rival.level + 1}`,
      `está jugando "${rival.currentMission || 'una misión'}"`,
      `obtuvo un power-up épico 🚀`
    ];
    
    return {
      rivalName: rival.name,
      avatar: rival.avatar,
      action: actions[Math.floor(Math.random() * actions.length)]
    };
  }

  // ── Update Score (called from GameEngine) ────────────────
  updateScore(score, level, missionsCompleted) {
    // Store for simulation ranking
    window._jsArenaPlayerScore = score;
    window._jsArenaPlayerLevel = level;
    window._jsArenaPlayerMissions = missionsCompleted;
    
    this.updatePlayerState({ score, level, missionsCompleted });
  }

  // ── Post Mission Complete (called from GameEngine) ──────
  postMissionComplete(missionId, score, time) {
    this.notifyMissionComplete(missionId, score, 'A');
    this.updatePlayerState({ status: 'menú', currentMission: null });
  }

  // ── Demo: Trigger Game Over (for testing) ───────────────
  triggerDemoGameOver() {
    const top3 = this.simulatedPlayers
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    this.victoryCallbacks.forEach(cb => cb({
      type: 'top3_filled',
      top3
    }));
  }

  // ── Cleanup ─────────────────────────────────────────────
  cleanup() {
    this.listeners.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    this.listeners = [];
    this._simIntervals.forEach(id => clearInterval(id));
    this._simIntervals = [];
    
    // Remove from online list
    if (this.connected && this.db && this.playerId) {
      const onlineRef = ref(this.db, `online/${this.playerId}`);
      remove(onlineRef);
    }
  }
}

export const firebaseManager = new FirebaseManager();
export default firebaseManager;
