// ═══════════════════════════════════════════════════════════════
// JS_ARENA — SOUND ENGINE
// Retro sound effects via Web Audio API
// ═══════════════════════════════════════════════════════════════

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.3;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended') this.ctx.resume();
  }

  play(type) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    switch (type) {
      case 'keypress': this._keypress(); break;
      case 'correct': this._correct(); break;
      case 'error': this._error(); break;
      case 'powerup': this._powerup(); break;
      case 'event': this._event(); break;
      case 'levelup': this._levelup(); break;
      case 'combo': this._combo(); break;
      case 'tick': this._tick(); break;
      case 'boot': this._boot(); break;
      case 'glitch': this._glitch(); break;
      case 'whoosh': this._whoosh(); break;
      case 'select': this._select(); break;
    }
  }

  _osc(type, freq, duration, startTime = 0) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = this.volume;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  _noise(duration) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = this.volume * 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  _keypress() {
    this._osc('square', 800 + Math.random() * 200, 0.05);
  }

  _correct() {
    this._osc('sine', 523, 0.1, 0);
    this._osc('sine', 659, 0.1, 0.1);
    this._osc('sine', 784, 0.15, 0.2);
  }

  _error() {
    this._osc('sawtooth', 200, 0.15, 0);
    this._osc('sawtooth', 150, 0.2, 0.1);
    this._noise(0.1);
  }

  _powerup() {
    for (let i = 0; i < 5; i++) {
      this._osc('sine', 400 + i * 150, 0.08, i * 0.06);
    }
  }

  _event() {
    this._osc('square', 440, 0.1, 0);
    this._osc('square', 880, 0.1, 0.15);
    this._osc('square', 440, 0.1, 0.3);
    this._osc('square', 880, 0.15, 0.45);
  }

  _levelup() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      this._osc('sine', freq, 0.15, i * 0.1);
      this._osc('square', freq, 0.1, i * 0.1);
    });
  }

  _combo() {
    this._osc('sine', 600, 0.08, 0);
    this._osc('sine', 900, 0.08, 0.05);
    this._osc('sine', 1200, 0.1, 0.1);
  }

  _tick() {
    this._osc('sine', 1000, 0.02);
  }

  _boot() {
    for (let i = 0; i < 8; i++) {
      this._osc('square', 100 + i * 50, 0.05, i * 0.08);
    }
    this._noise(0.3);
  }

  _glitch() {
    for (let i = 0; i < 3; i++) {
      this._osc('sawtooth', Math.random() * 1000 + 200, 0.03, i * 0.04);
    }
    this._noise(0.08);
  }

  _whoosh() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 200;
    osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.2);
    gain.gain.value = this.volume * 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  _select() {
    this._osc('sine', 700, 0.05, 0);
    this._osc('sine', 900, 0.05, 0.03);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
