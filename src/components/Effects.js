// ═══════════════════════════════════════════════════════════════
// JS_ARENA — MATRIX RAIN + 3D PARTICLES
// Canvas background effects
// ═══════════════════════════════════════════════════════════════

export class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.columns = [];
    this.fontSize = 14;
    this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF{}[]();=>';
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const colCount = Math.floor(this.canvas.width / this.fontSize);
    this.columns = new Array(colCount).fill(0).map(() => Math.random() * this.canvas.height / this.fontSize);
  }

  start() {
    this.running = true;
    this.draw();
  }

  stop() {
    this.running = false;
  }

  draw() {
    if (!this.running) return;
    
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#00f5ff15';
    this.ctx.font = `${this.fontSize}px monospace`;
    
    for (let i = 0; i < this.columns.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.columns[i] * this.fontSize;
      
      // Random brightness
      const brightness = Math.random();
      if (brightness > 0.98) {
        this.ctx.fillStyle = '#00f5ff80';
      } else if (brightness > 0.95) {
        this.ctx.fillStyle = '#00f5ff40';
      } else {
        this.ctx.fillStyle = '#00f5ff12';
      }
      
      this.ctx.fillText(char, x, y);
      
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.columns[i] = 0;
      }
      this.columns[i]++;
    }
    
    requestAnimationFrame(() => this.draw());
  }
}

export class Particles3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.mouse = { x: 0, y: 0 };
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles();
  }

  initParticles() {
    this.particles = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * 400,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: `hsla(${180 + Math.random() * 40}, 100%, 60%, ${Math.random() * 0.3 + 0.1})`
      });
    }
  }

  start() {
    this.running = true;
    this.draw();
  }

  stop() {
    this.running = false;
  }

  draw() {
    if (!this.running) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Sort by Z for depth
    const sorted = [...this.particles].sort((a, b) => b.z - a.z);
    
    for (const p of sorted) {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
      
      // Mouse influence
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.vx -= dx * 0.00005;
        p.vy -= dy * 0.00005;
      }
      
      // Wrap
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      if (p.z < 0) p.z = 400;
      if (p.z > 400) p.z = 0;
      
      // Perspective projection
      const perspective = 400 / (400 + p.z);
      const projX = p.x * perspective + (1 - perspective) * this.canvas.width / 2;
      const projY = p.y * perspective + (1 - perspective) * this.canvas.height / 2;
      const projSize = p.size * perspective;
      
      this.ctx.beginPath();
      this.ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
    
    // Draw connections
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i], b = sorted[j];
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
        if (dist < 180) {
          const alpha = (1 - dist / 180) * 0.12;
          this.ctx.beginPath();
          const pA = 400 / (400 + a.z);
          const pB = 400 / (400 + b.z);
          this.ctx.moveTo(
            a.x * pA + (1 - pA) * this.canvas.width / 2,
            a.y * pA + (1 - pA) * this.canvas.height / 2
          );
          this.ctx.lineTo(
            b.x * pB + (1 - pB) * this.canvas.width / 2,
            b.y * pB + (1 - pB) * this.canvas.height / 2
          );
          this.ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(() => this.draw());
  }
}
