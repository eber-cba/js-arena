// ═══════════════════════════════════════════════════════════════
// JS_ARENA — GAME ENGINE
// Central state machine + all game logic managers
// ═══════════════════════════════════════════════════════════════

import { missions, getMissionById, isMissionUnlocked } from '../data/missions.js';
import { powerUps, getRandomPowerUp, getStarterPowerUps } from '../data/powerups.js';
import { rollForEvent } from '../data/events.js';
import { getRandomMessage, getStreakMessage, getLevelNarrative } from '../data/personality.js';
import { soundEngine } from './SoundEngine.js';
import { firebaseManager } from './FirebaseManager.js';

// ── Storage Helpers ────────────────────────────────────────
function saveToStorage(key, data) {
  try { localStorage.setItem(`jsarena_${key}`, JSON.stringify(data)); } catch (e) {}
}
function loadFromStorage(key, fallback = null) {
  try {
    const data = localStorage.getItem(`jsarena_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) { return fallback; }
}

// ── Game Engine ────────────────────────────────────────────
class GameEngine {
  constructor() {
    this.state = {
      screen: 'boot', // boot, menu, mission, result, challenge, profile, ranking
      playerName: '',
      level: 1,
      totalXP: 0,
      xpToNextLevel: 100,
      totalScore: 0,
      completedMissions: [],
      missionGrades: {},
      currentMission: null,
      missionState: null, // holds minigame specific state
      minigameCompleted: false,
      feedbackShown: false,
      lives: 3,
      maxLives: 3,
      combo: 0,
      maxCombo: 0,
      missionScore: 0,
      missionCorrect: 0,
      missionWrong: 0,
      missionStartTime: 0,
      timerSeconds: 30,
      timerRunning: false,
      timerFrozen: false,
      powerUpInventory: {},
      activePowerUps: [],
      activeEvent: null,
      eventQuestionsRemaining: 0,
      scoreMultiplier: 1,
      shieldActive: false,
      secondChanceUsed: false,
      difficulty: 1, // 1-4
    };

    // Analytics
    this.analytics = loadFromStorage('analytics', {
      totalTime: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      byMethod: {},
      byType: {},
      avgTimePerQuestion: 0,
      streakHistory: [],
      sessionsPlayed: 0,
      powerUpsUsed: 0,
      achievements: []
    });

    this.listeners = new Set();
    this.timerInterval = null;
    this.rivalCheckInterval = null;
    this.questionStartTime = 0;
  }

  // ── State Management ─────────────────────────────────────
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit() {
    this.listeners.forEach(cb => cb({ ...this.state }));
  }

  update(partial) {
    Object.assign(this.state, partial);
    this.emit();
  }

  // ── Initialization ───────────────────────────────────────
  init() {
    // Load saved state
    const saved = loadFromStorage('gameState');
    if (saved) {
      this.state.playerName = saved.playerName || '';
      this.state.level = saved.level || 1;
      this.state.totalXP = saved.totalXP || 0;
      this.state.totalScore = saved.totalScore || 0;
      this.state.completedMissions = saved.completedMissions || [];
      this.state.powerUpInventory = saved.powerUpInventory || getStarterPowerUps();
      this.state.difficulty = saved.difficulty || 1;
    } else {
      this.state.powerUpInventory = getStarterPowerUps();
    }

    this.state.xpToNextLevel = this.calcXPForLevel(this.state.level + 1);
    
    // Initialize Firebase
    firebaseManager.init();
    
    // Start rival notifications
    this.startRivalChecks();
  }

  save() {
    saveToStorage('gameState', {
      playerName: this.state.playerName,
      level: this.state.level,
      totalXP: this.state.totalXP,
      totalScore: this.state.totalScore,
      completedMissions: this.state.completedMissions,
      powerUpInventory: this.state.powerUpInventory,
      difficulty: this.state.difficulty
    });
    saveToStorage('analytics', this.analytics);
  }

  // ── Screen Navigation ────────────────────────────────────
  goTo(screen) {
    this.stopTimer();
    this.update({ screen, answerSubmitted: false, feedbackShown: false, currentAnswer: null });
    soundEngine.play('whoosh');
  }

  // ── Player Setup ─────────────────────────────────────────
  setPlayerName(name) {
    this.state.playerName = name.trim();
    firebaseManager.setPlayer(this.state.playerName);
    this.save();
  }

  // ── Mission Start ────────────────────────────────────────
  startMission(missionId) {
    const mission = getMissionById(missionId);
    if (!mission) return;
    if (!isMissionUnlocked(missionId, this.state.completedMissions)) return;

    this.update({
      screen: 'mission',
      currentMission: mission,
      missionState: null,
      minigameCompleted: false,
      feedbackShown: false,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      missionScore: 0,
      missionCorrect: 0,
      missionWrong: 0,
      missionStartTime: Date.now(),
      timerSeconds: this.getTimerForDifficulty(),
      timerFrozen: false,
      activeEvent: null,
      eventQuestionsRemaining: 0,
      scoreMultiplier: 1,
      shieldActive: false,
      secondChanceUsed: false
    });

    this.questionStartTime = Date.now();
    this.startTimer();
    soundEngine.play('boot');
  }

  // ── Timer ────────────────────────────────────────────────
  getTimerForDifficulty() {
    const base = [45, 35, 25, 20];
    return base[Math.min(this.state.difficulty - 1, 3)] || 30;
  }

  startTimer() {
    this.stopTimer();
    this.state.timerRunning = true;
    this.timerInterval = setInterval(() => {
      if (this.state.timerFrozen) return;
      
      const newTime = this.state.timerSeconds - 1;
      if (newTime <= 0) {
        this.handleTimeout();
      } else {
        if (newTime <= 5) soundEngine.play('tick');
        this.update({ timerSeconds: newTime });
      }
    }, 1000);
  }

  stopTimer() {
    this.state.timerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleTimeout() {
    this.stopTimer();
    this.handleWrongAnswer(true);
  }

  // ── Answer Handling / Minigame Updates ──────────────────
  updateMinigameState(newState) {
    this.update({ missionState: { ...this.state.missionState, ...newState } });
  }

  completeMinigameStage(isCorrect, timeSpent = 0) {
    if (this.state.minigameCompleted) return;

    this.stopTimer();

    if (isCorrect) {
      this.update({ minigameCompleted: true, feedbackShown: true });
      this.handleCorrectAnswer(timeSpent);
      setTimeout(() => this.endMission(true), 1500);
    } else {
      this.handleWrongAnswer(false);
    }
  }

  handleCorrectAnswer(timeSpent) {
    const newCombo = this.state.combo + 1;
    const maxCombo = Math.max(this.state.maxCombo, newCombo);
    
    let xp = 100;
    const timeBonus = Math.max(0, Math.floor((this.getTimerForDifficulty() - timeSpent) * 5));
    const comboMultiplier = 1 + (newCombo - 1) * 0.1;
    let totalXP = Math.floor((xp + timeBonus) * comboMultiplier * this.state.scoreMultiplier);
    
    if (this.state.activeEvent?.effect === 'triple_next_xp') {
      totalXP *= 3;
      this.update({ activeEvent: null });
    }

    const newTotalXP = this.state.totalXP + totalXP;
    const newScore = this.state.totalScore + totalXP;
    const missionScore = this.state.missionScore + totalXP;

    let newLevel = this.state.level;
    let xpToNext = this.state.xpToNextLevel;
    if (newTotalXP >= xpToNext) {
      newLevel++;
      xpToNext = this.calcXPForLevel(newLevel + 1);
      soundEngine.play('levelup');
    }

    this.update({
      combo: newCombo,
      maxCombo,
      missionScore,
      missionCorrect: this.state.missionCorrect + 1,
      totalXP: newTotalXP,
      totalScore: newScore,
      level: newLevel,
      xpToNextLevel: xpToNext,
      feedbackShown: true
    });

    soundEngine.play('correct');
    if (newCombo >= 3) soundEngine.play('combo');
    this.flashScreen('green');
    firebaseManager.updateScore(newScore, newLevel, this.state.completedMissions.length);
  }

  handleWrongAnswer(isTimeout) {
    let newLives = this.state.lives;

    if (this.state.shieldActive) {
      this.update({ shieldActive: false, combo: 0 });
      soundEngine.play('powerup');
      this.startTimer(); // continue minigame
      return;
    }

    if (this.state.activeEvent?.effect === 'next_error_fatal') {
      newLives = 0;
    } else {
      newLives = this.state.lives - 1;
    }

    this.update({
      combo: 0,
      lives: newLives,
      missionWrong: this.state.missionWrong + 1,
      feedbackShown: true
    });

    soundEngine.play('error');
    this.flashScreen('red');

    if (newLives <= 0) {
      setTimeout(() => this.endMission(false), 2000);
    } else {
      // Small penalty pause before continuing
      this.stopTimer();
      setTimeout(() => this.startTimer(), 1000);
    }
  }

  // ── End Mission ──────────────────────────────────────────
  endMission(completed) {
    this.stopTimer();
    this.update({ minigameCompleted: true });
    
    const totalTime = (Date.now() - this.state.missionStartTime) / 1000;
    const accuracy = this.state.missionCorrect / 
      (this.state.missionCorrect + this.state.missionWrong) * 100 || 0;

    // Calculate grade
    let grade = 'F';
    let perfectBonus = 0;

    if (accuracy === 100 && this.state.missionWrong === 0) {
      grade = 'S';
      perfectBonus = 500; // Perfect run bonus
    }
    else if (accuracy >= 90) grade = 'A';
    else if (accuracy >= 70) grade = 'B';
    else if (accuracy >= 50) grade = 'C';
    else if (completed) grade = 'D';

    if (completed) {
      this.state.totalScore += perfectBonus;
      this.state.missionScore += perfectBonus;
    }

    // Mark mission complete
    if (completed && this.state.currentMission) {
      const mId = this.state.currentMission.id;
      if (!this.state.completedMissions.includes(mId)) {
        this.state.completedMissions.push(mId);
      }
      
      // Update highest grade for this mission
      const currGrade = this.state.missionGrades[mId];
      if (!currGrade || grade === 'S' || (grade === 'A' && currGrade !== 'S')) {
        this.state.missionGrades[mId] = grade;
      }

      // Award random power-up on completion
      const reward = getRandomPowerUp();
      if (reward) {
        const inv = { ...this.state.powerUpInventory };
        inv[reward.id] = (inv[reward.id] || 0) + 1;
        this.state.powerUpInventory = inv;
      }
    }

    // Update difficulty
    this.updateDifficulty(accuracy);

    // Save & emit
    this.save();
    
    this.update({
      screen: 'result',
      missionResult: {
        completed,
        grade,
        accuracy,
        totalTime,
        correct: this.state.missionCorrect,
        wrong: this.state.missionWrong,
        maxCombo: this.state.maxCombo,
        score: this.state.missionScore,
        perfectBonus: perfectBonus
      }
    });

    // Post to Firebase
    if (this.state.currentMission) {
      firebaseManager.postMissionComplete(
        this.state.currentMission.id,
        this.state.missionScore,
        totalTime
      );
    }

    soundEngine.play(completed ? 'levelup' : 'error');
  }

  // ── Power-Ups ────────────────────────────────────────────
  usePowerUp(powerUpId) {
    const inv = { ...this.state.powerUpInventory };
    if (!inv[powerUpId] || inv[powerUpId] <= 0) return false;
    
    inv[powerUpId]--;
    this.state.powerUpInventory = inv;
    this.analytics.powerUpsUsed++;

    switch (powerUpId) {
      case 'freeze_time':
        this.update({ timerFrozen: true, powerUpInventory: inv });
        setTimeout(() => {
          this.update({ timerFrozen: false });
        }, powerUps.freeze_time.duration);
        break;
      
      case 'instant_hint':
        this.update({ powerUpInventory: inv });
        return this.getCurrentHint();
      
      case 'second_chance':
        this.update({ 
          answerSubmitted: false, 
          feedbackShown: false, 
          currentAnswer: null, 
          secondChanceUsed: true,
          powerUpInventory: inv 
        });
        this.questionStartTime = Date.now();
        this.update({ timerSeconds: this.getTimerForDifficulty() });
        this.startTimer();
        break;
      
      case 'error_shield':
        this.update({ shieldActive: true, powerUpInventory: inv });
        break;
      
      case 'mission_skip':
        this.update({ 
          missionCorrect: this.state.missionCorrect + 1, 
          powerUpInventory: inv 
        });
        this.nextQuestion();
        break;
      
      case 'double_xp':
        this.update({ scoreMultiplier: 2, powerUpInventory: inv });
        setTimeout(() => {
          this.update({ scoreMultiplier: 1 });
        }, powerUps.double_xp.duration);
        break;
      
      case 'code_scanner':
        this.update({ powerUpInventory: inv });
        return this.getEliminatedOption();
    }

    soundEngine.play('powerup');
    this.save();
    return true;
  }

  getCurrentHint() {
    const q = this.state.currentQuestions[this.state.currentQuestionIndex];
    return q?.hint || 'Sin pista disponible.';
  }

  getEliminatedOption() {
    const q = this.state.currentQuestions[this.state.currentQuestionIndex];
    if (q?.type !== 'multiple_choice') return -1;
    // Return a wrong option index
    const wrongOptions = q.options
      .map((_, i) => i)
      .filter(i => i !== q.correct);
    return wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
  }

  // ── Dynamic Events ───────────────────────────────────────
  triggerEvent(event) {
    soundEngine.play('event');
    
    switch (event.effect) {
      case 'free_powerup':
        const reward = getRandomPowerUp();
        if (reward) {
          const inv = { ...this.state.powerUpInventory };
          inv[reward.id] = (inv[reward.id] || 0) + 1;
          this.update({ powerUpInventory: inv });
        }
        break;
      
      case 'add_time':
        this.update({ timerSeconds: this.state.timerSeconds + (event.extraTime / 1000) });
        break;
      
      case 'score_multiplier':
        this.update({ scoreMultiplier: event.multiplier });
        setTimeout(() => this.update({ scoreMultiplier: 1 }), event.duration);
        break;
      
      default:
        const questionsRemaining = event.durationType === 'questions' ? event.duration : 0;
        this.update({ 
          activeEvent: event,
          eventQuestionsRemaining: questionsRemaining
        });
        
        if (event.durationType === 'time' && event.duration > 0) {
          setTimeout(() => {
            if (this.state.activeEvent?.id === event.id) {
              this.update({ activeEvent: null });
            }
          }, event.duration);
        }
        break;
    }

    // Show event banner
    this.showEventBanner(event);
  }

  showEventBanner(event) {
    const banner = document.getElementById('event-banner');
    if (banner) {
      banner.innerHTML = `${event.icon} ${event.name} — ${event.description}`;
      banner.style.borderColor = event.color;
      banner.style.color = event.color;
      banner.classList.remove('hidden');
      banner.classList.add('visible');
      
      setTimeout(() => {
        banner.classList.remove('visible');
        banner.classList.add('hidden');
      }, 3500);
    }
  }

  // ── Difficulty Engine ────────────────────────────────────
  updateDifficulty(accuracy) {
    if (accuracy >= 80 && this.state.difficulty < 4) {
      this.state.difficulty++;
    } else if (accuracy < 40 && this.state.difficulty > 1) {
      this.state.difficulty--;
    }
  }

  // ── XP / Leveling ───────────────────────────────────────
  calcXPForLevel(lvl) {
    return Math.floor(100 * Math.pow(1.5, lvl - 1));
  }

  getXPProgress() {
    const prevLevelXP = this.calcXPForLevel(this.state.level);
    const current = this.state.totalXP - prevLevelXP;
    const needed = this.state.xpToNextLevel - prevLevelXP;
    return Math.min(100, Math.max(0, (current / needed) * 100));
  }

  // ── Analytics Tracking ───────────────────────────────────
  trackAnswer(question, correct, timeSpent) {
    this.analytics.questionsAnswered++;
    if (correct) this.analytics.correctAnswers++;
    else this.analytics.wrongAnswers++;
    
    this.analytics.avgTimePerQuestion = 
      (this.analytics.avgTimePerQuestion * (this.analytics.questionsAnswered - 1) + timeSpent) 
      / this.analytics.questionsAnswered;

    // Track by method
    const mission = this.state.currentMission;
    if (mission) {
      mission.methods.forEach(method => {
        if (!this.analytics.byMethod[method]) {
          this.analytics.byMethod[method] = { correct: 0, wrong: 0, totalTime: 0, count: 0 };
        }
        const m = this.analytics.byMethod[method];
        if (correct) m.correct++;
        else m.wrong++;
        m.totalTime += timeSpent;
        m.count++;
      });
    }

    // Track by question type
    if (!this.analytics.byType[question.type]) {
      this.analytics.byType[question.type] = { correct: 0, wrong: 0 };
    }
    if (correct) this.analytics.byType[question.type].correct++;
    else this.analytics.byType[question.type].wrong++;

    this.save();
  }

  getWeakMethods() {
    const methods = Object.entries(this.analytics.byMethod)
      .map(([method, data]) => ({
        method,
        accuracy: data.count > 0 ? (data.correct / data.count * 100) : 0,
        count: data.count
      }))
      .filter(m => m.count >= 3)
      .sort((a, b) => a.accuracy - b.accuracy);
    
    return methods.slice(0, 3);
  }

  getSuggestions() {
    const weak = this.getWeakMethods();
    if (weak.length === 0) return ['¡Sigue practicando para generar estadísticas!'];
    
    return weak.map(m => 
      `Practica más "${m.method}" — tu tasa es del ${Math.round(m.accuracy)}%`
    );
  }

  // ── Rival Notifications ──────────────────────────────────
  startRivalChecks() {
    this.rivalCheckInterval = setInterval(() => {
      if (this.state.screen !== 'mission') return;
      if (Math.random() > 0.3) return; // 30% chance per check
      
      const notif = firebaseManager.simulateRivalNotification(this.state.totalScore);
      if (notif) {
        this.showNotification(`⚡ ${notif.rivalName} ${notif.action}`, 'rival');
      }
    }, 20000);
  }

  showNotification(text, type = 'default') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = text;
    container.appendChild(notif);
    
    setTimeout(() => notif.remove(), 4500);
  }

  // ── Screen Flash ─────────────────────────────────────────
  flashScreen(color) {
    const flash = document.getElementById('screen-flash');
    if (!flash) return;
    flash.className = `screen-flash flash-${color}`;
    setTimeout(() => { flash.className = 'screen-flash'; }, 300);
  }

  // ── Cleanup ──────────────────────────────────────────────
  destroy() {
    this.stopTimer();
    if (this.rivalCheckInterval) clearInterval(this.rivalCheckInterval);
    firebaseManager.cleanup();
  }
}

export const gameEngine = new GameEngine();
export default gameEngine;
