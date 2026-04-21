import { gameEngine } from '../core/GameEngine.js';
import { soundEngine } from '../core/SoundEngine.js';

// ═══════════════════════════════════════════════════════════════
// MINIGAMES SYSTEM
// ═══════════════════════════════════════════════════════════════

export const Minigames = {
  // ── Misión 1: Escaneo de Nodos (Índices y Length) ──────────
  m1_indices: {
    init: (container) => {
      container.innerHTML = `
        <div class="minigame-container">
          <div class="instruction">El array <code style="color:var(--neon-green)">servidores</code> tiene 5 nodos. Hackea el último nodo accediendo por su índice exacto (un número) o calculándolo dinámicamente usando una propiedad del arreglo (ej: nombre.propiedad-1).</div>
          <div class="server-rack" id="m1-rack">
            ${[0, 1, 2, 3, 4].map(i => `<div class="server-node" data-index="${i}">S${i+1} [NODE ${i}]</div>`).join('')}
          </div>
          <div class="terminal-input-area" style="background: rgba(0,0,0,0.5); padding: 20px; border-radius: 8px; display:inline-flex; border: 1px solid var(--neon-cyan);">
            <span class="prompt" style="color:var(--neon-green)">root@system:~$</span>
            <span class="cmd-text" style="color:#aaa; margin-left: 10px;">servidores[</span>
            <input type="text" id="m1-input" placeholder="tu código..." autocomplete="off">
            <span class="cmd-text" style="color:#aaa">]</span>
            <button id="m1-btn" class="hack-btn" style="margin-left: 15px;">EJECUTAR</button>
          </div>
        </div>
      `;

      // Estilos inline pro-tempore para el minijuego
      const style = document.createElement('style');
      style.innerHTML = `
        .server-rack { display: flex; gap: 15px; justify-content: center; margin: 30px 0; }
        .server-node { width: 80px; height: 100px; background: rgba(0, 245, 255, 0.1); border: 1px solid var(--neon-cyan); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-direction: column; font-size: 0.8rem; font-family: monospace; color: var(--neon-cyan); transition: all 0.3s; }
        .server-node.hacked { background: var(--neon-cyan); color: #000; box-shadow: 0 0 20px var(--neon-cyan); transform: scale(1.1); font-weight: bold;}
        .server-node.error { background: var(--danger); border-color: var(--danger); box-shadow: 0 0 20px var(--danger); }
        .terminal-input-area { align-items: center; justify-content: center; font-family: monospace; font-size: 1.2rem; margin-top: 20px;}
        .terminal-input-area input { background: transparent; border: none; border-bottom: 2px solid var(--neon-yellow); color: var(--neon-yellow); width: 180px; font-size: 1.3rem; text-align: center; font-family: monospace; outline: none; transition: border 0.3s;}
        .terminal-input-area input:focus { border-color: var(--neon-green);}
        .hack-btn { background: var(--neon-cyan); border: none; border-radius: 4px; color: #000; font-weight: 800; padding: 10px 20px; cursor: pointer; transition: all 0.2s;}
        .hack-btn:hover { background: #fff; box-shadow: 0 0 15px var(--neon-cyan); transform: scale(1.05);}
        .hack-btn:active { transform: scale(0.95);}
      `;
      container.appendChild(style);

      // Bucle de Inestabilidad (M1)
      let nodeCount = 5;
      let m1Interval = setInterval(() => {
        const rack = document.getElementById('m1-rack');
        if (!rack) { clearInterval(m1Interval); return; }
        
        nodeCount = Math.floor(Math.random() * 5) + 3; // 3 to 7 nodes
        rack.innerHTML = Array.from({length: nodeCount}, (_, i) => 
          `<div class="server-node" data-index="${i}" style="animation: popIn 0.2s">NODE ${i}</div>`
        ).join('');
      }, 1500);

      const btn = document.getElementById('m1-btn');
      const input = document.getElementById('m1-input');

      btn.onclick = () => {
        clearInterval(m1Interval); // Congelar al evaluar
        const val = input.value.trim().toLowerCase().replace(/\s+/g, '');
        
        // Bloquear hardcodeo
        if (/^\[?\d+\]?$/.test(val) || val === '4') {
          soundEngine.play('error');
          input.value = '';
          input.placeholder = "¡Error! Nodos cambiaron. Usa length.";
          gameEngine.completeMinigameStage(false);
          return;
        }

        const isCorrect = val.includes('length-1');
        
        if (isCorrect) {
          const nodes = document.querySelectorAll('#m1-rack .server-node');
          const lastNode = nodes[nodes.length - 1];
          if (lastNode) lastNode.classList.add('hacked');
          setTimeout(() => gameEngine.completeMinigameStage(true, 5), 1000);
        } else {
          input.value = '';
          gameEngine.completeMinigameStage(false);
        }
      };
    },
    destroy: () => {}
  },

  // ── Añadir las otras misiones aquí a medida que se implementan... ──────────
  m2_escuadron: {
    init: (container) => {
      container.innerHTML = `
        <div class="minigame-container">
          <div class="instruction">El escuadrón necesita refuerzos. Inyecta a "Spiderman" al final de la formación y a "Batman" como vanguardia al inicio.</div>
          <div class="squad-rack" id="m2-rack">
            <div class="squad-member">Ironman</div>
            <div class="squad-member">Superman</div>
            <div class="squad-member">Hawkeye</div>
          </div>
          
          <div class="action-panel">
            <div class="action-row">
               <span>escuadron.</span><input type="text" id="m2-cmd1" placeholder="metodo('Vengador')">
               <button id="m2-btn1" class="hack-btn">EJECUTAR</button>
            </div>
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.innerHTML = `
        .squad-rack { display: flex; gap: 10px; justify-content: center; margin: 30px 0; min-height: 50px; align-items: center; }
        .squad-member { padding: 10px 20px; background: rgba(176, 0, 255, 0.2); border: 1px solid #b000ff; border-radius: 4px; color: #fff; font-family: monospace; transform-origin: center; animation: popIn 0.3s ease-out; }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0;} 100% { transform: scale(1); opacity: 1;} }
        .action-panel { display: flex; flex-direction: column; align-items: center; gap: 15px; margin-top: 20px;}
        .action-row { display: flex; align-items: center; gap: 5px; font-family: monospace; font-size: 1.1rem;}
        .action-row input { background: transparent; border: none; border-bottom: 2px solid #b000ff; color: #fff; width: 220px; font-size: 1.1rem; text-align: center; }
      `;
      container.appendChild(style);

      const rack = document.getElementById('m2-rack');
      const input1 = document.getElementById('m2-cmd1');
      const btn1 = document.getElementById('m2-btn1');

      let stage = 1;

      btn1.onclick = () => {
        const val = input1.value.trim().toLowerCase().replace(/'|"/g, '');
        
        if (stage === 1) {
          if (val === 'push(spiderman)') {
            const el = document.createElement('div');
            el.className = 'squad-member';
            el.textContent = 'Spiderman';
            rack.appendChild(el);
            soundEngine.play('correct');
            stage = 2;
            input1.value = '';
            input1.placeholder = "metodo('Heroe')";
            document.querySelector('.instruction').innerHTML = 'Bien! Ahora inyecta a "Batman" en la vanguardia (inicio).';
          } else {
             gameEngine.completeMinigameStage(false);
          }
        } else if (stage === 2) {
          if (val === 'unshift(batman)') {
            const el = document.createElement('div');
            el.className = 'squad-member';
            el.textContent = 'Batman';
            rack.insertBefore(el, rack.firstChild);
            soundEngine.play('levelup');
            setTimeout(() => gameEngine.completeMinigameStage(true, 10), 1000);
          } else {
             gameEngine.completeMinigameStage(false);
          }
        }
      };
    },
    destroy: () => {}
  },

  m3_padron: {
    init: (container) => {
      container.innerHTML = `
        <div class="minigame-container">
          <div class="instruction">Lee el input, envialo al "Array en RAM" y observa cómo se dibuja en el DOM. Ingresa 3 invitados para completar.</div>
          
          <div style="display:flex; gap: 20px; align-items: start; margin-top:20px;">
            <div class="m3-panel">
              <h4>1. INPUT</h4>
              <input type="text" id="m3-input" placeholder="Nombre...">
              <button id="m3-add" class="hack-btn">AGREGAR</button>
            </div>
            
            <div class="m3-panel">
              <h4>2. ARRAY (RAM)</h4>
              <div id="m3-ram" class="code-block" style="min-height:50px;">[]</div>
            </div>

            <div class="m3-panel">
              <h4>3. DOM (UL)</h4>
              <ul id="m3-dom" style="text-align: left; background: rgba(0,0,0,0.5); padding: 10px; border: 1px solid var(--neon-cyan); border-radius:4px; min-height:50px; font-family: monospace;">
              </ul>
            </div>
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.innerHTML = `
        .m3-panel { flex: 1; border: 1px solid var(--border-subtle); padding: 15px; border-radius: 8px; background: rgba(0, 245, 255, 0.05); }
        .m3-panel h4 { font-family: var(--font-display); font-size: 0.8rem; margin-top: 0; color: var(--neon-cyan); }
        .m3-panel input { width: 100%; border: none; border-bottom: 2px solid var(--primary); background: transparent; color: white; margin-bottom: 15px; outline: none;}
      `;
      container.appendChild(style);

      const arr = [];
      const ramDisplay = document.getElementById('m3-ram');
      const domDisplay = document.getElementById('m3-dom');
      const input = document.getElementById('m3-input');
      const btn = document.getElementById('m3-add');

      btn.onclick = () => {
        const val = input.value.trim();
        if(!val) return;
        
        soundEngine.play('keypress');
        // Push into array
        arr.push(val);
        input.value = '';

        // Update RAM
        ramDisplay.innerHTML = '[' + arr.map(a => `<span style="color:#ffd700">"${a}"</span>`).join(', ') + ']';

        // Update DOM
        domDisplay.innerHTML = '';
        arr.forEach(a => {
          const li = document.createElement('li');
          li.textContent = a;
          domDisplay.appendChild(li);
        });

        if (arr.length >= 3) {
          soundEngine.play('levelup');
          setTimeout(() => gameEngine.completeMinigameStage(true, 15), 800);
        }
      };
    }, 
    destroy: () => {} 
  },

  m4_aniquilacion: {
    init: (container) => {
      container.innerHTML = `
        <div class="minigame-container">
          <div class="instruction">Localiza primero la posición exacta del target con un buscador de índice (<code>t => t === 43</code>) y luego destrúyelo extrayéndolo de la memoria.</div>
          <div class="tallas-grid" id="m4-grid">
            <div class="talla-box">41</div>
            <div class="talla-box">42</div>
            <div class="talla-box" id="talla-target" style="border-color: var(--danger); box-shadow: 0 0 10px var(--danger);">43 🐛</div>
            <div class="talla-box">44</div>
            <div class="talla-box">45</div>
          </div>
          
          <div class="action-panel">
            <div class="action-row">
               <span>const index = tallas.</span><input type="text" id="m4-cmd1" placeholder="metodo(t => t === 43)">
               <button id="m4-btn1" class="hack-btn">ESCANEAR</button>
            </div>
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.innerHTML = `
        .tallas-grid { display: flex; gap: 10px; justify-content: center; margin: 30px 0; }
        .talla-box { padding: 15px 20px; font-weight: bold; background: rgba(0,0,0,0.5); border: 2px solid var(--border-subtle); border-radius: 8px; font-family: monospace; font-size: 1.2rem; transition: all 0.3s;}
        .talla-box.targeted { background: rgba(255, 0, 64, 0.2); box-shadow: 0 0 20px var(--danger); }
        .talla-box.destroyed { transform: scale(0); opacity: 0; }
      `;
      container.appendChild(style);

      let stage = 1;
      const btn = document.getElementById('m4-btn1');
      const input = document.getElementById('m4-cmd1');

      // Mouse Hacker Mechanic: Evade cursor
      btn.addEventListener('mouseover', () => {
         const moveX = (Math.random() - 0.5) * 300;
         const moveY = (Math.random() - 0.5) * 150;
         gsap.to(btn, { x: moveX, y: moveY, duration: 0.15, ease: 'power1.out' });
      });

      // Permite usar "Enter" para evitar el mouse
      input.addEventListener('keydown', (e) => {
         if (e.key === 'Enter') btn.click();
      });

      btn.onclick = () => {
        const val = input.value.replace(/\s+/g,'').toLowerCase();
        
        if (stage === 1) {
          if (val === 'findindex(t=>t===43)' || val === 'findindex(talla=>talla===43)') {
            document.getElementById('talla-target').classList.add('targeted');
            soundEngine.play('correct');
            stage = 2;
            input.value = '';
            input.placeholder = "metodo(index, 1)";
            document.querySelector('.action-row span').textContent = 'tallas.';
            btn.textContent = 'CORTAR';
            // Resetea pos del botón
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
          } else {
             gameEngine.completeMinigameStage(false);
          }
        } else if (stage === 2) {
          if (val === 'splice(index,1)') {
            document.getElementById('talla-target').classList.add('destroyed');
            soundEngine.play('error'); // usar como sfx explosión
            setTimeout(() => gameEngine.completeMinigameStage(true, 10), 1000);
          } else {
             gameEngine.completeMinigameStage(false);
          }
        }
      };
    },
    destroy: () => {}
  },
  m5_infiltracion: {
    init: (container) => {
      container.innerHTML = `
        <div class="minigame-container">
          <div class="instruction">Desencripta el ID verdadero. Accede a la propiedad correcta del primer objeto.</div>
          <div style="display:flex; justify-content:center; gap: 30px; margin-top:20px; align-items: center;">
            <div class="card-obj" id="m5-card">
              <div class="card-chip"></div>
              <div class="card-content">
                <div class="card-secret" id="m5-secret">ENTIDAD BLOQUEADA</div>
              </div>
            </div>
            <div class="action-panel" style="width: 300px;">
              <code style="display:block; text-align:left; color: #aaa; margin-bottom:10px;">
                const invitados = [<br>
                &nbsp;&nbsp;{ id: 431, nombre: "Johnny" }<br>
                ];
              </code>
              <div class="action-row">
                 <span>invitados[0].</span><input type="text" id="m5-cmd" placeholder="propiedad" style="width:100px;">
              </div>
              <button id="m5-btn" class="hack-btn" style="margin-top:15px; width: 100%;">DESENCRIPTAR</button>
            </div>
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.innerHTML = `
        .card-obj { width: 180px; height: 260px; background: linear-gradient(135deg, #111, #222); border: 2px solid #555; border-radius: 12px; position: relative; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow: 0 10px 30px rgba(0,0,0,0.8); transition: all 0.5s; }
        .card-obj.unlocked { border-color: var(--neon-green); box-shadow: 0 0 30px var(--neon-green); background: linear-gradient(135deg, #1a331a, #2a552a); }
        .card-chip { width: 40px; height: 30px; background: #DAA520; position: absolute; top: 20px; left: 20px; border-radius: 4px; border: 1px solid #B8860B; }
        .card-secret { font-family: monospace; font-size: 0.8rem; color: var(--danger); text-align: center; }
        .card-obj.unlocked .card-secret { color: var(--neon-green); font-size: 1.2rem; font-weight: bold; }
      `;
      container.appendChild(style);

      document.getElementById('m5-btn').onclick = () => {
        const val = document.getElementById('m5-cmd').value.toLowerCase().trim();
        if (val === 'id') {
          const card = document.getElementById('m5-card');
          card.classList.add('unlocked');
          document.getElementById('m5-secret').innerHTML = 'ID: 431<br><br>ACCESO CONCEDIDO';
          soundEngine.play('levelup');
          setTimeout(() => gameEngine.completeMinigameStage(true, 15), 1500);
        } else {
          gameEngine.completeMinigameStage(false);
        }
      };
    },
    destroy: () => {}
  },

  m6_exterminio: {
    init: (container) => {
      container.innerHTML = `
        <div class="minigame-container">
          <div class="instruction">¡Sobrecarga de procesos! Usa los botones ❌ para invocar el algoritmo de exterminio deteniendo a los servicios zombies.</div>
          
          <div style="display:flex; justify-content: space-between; margin-top:20px; gap: 20px;">
            <div class="m6-panel">
               <h4>PROCESOS ACTIVOS</h4>
               <ul id="m6-list" class="service-list"></ul>
            </div>
            <div class="m6-panel">
               <h4>LOG DEL SERVIDOR</h4>
               <div id="m6-log" class="code-block" style="font-size:0.75rem; min-height: 200px; max-height: 200px; overflow-y:auto;text-align:left;">
                 -- SISTEMA ESTABLE --
               </div>
            </div>
          </div>
        </div>
      `;

      const style = document.createElement('style');
      style.innerHTML = `
        .m6-panel { flex: 1; border: 1px solid var(--border-subtle); padding: 15px; border-radius: 8px; background: rgba(0, 245, 255, 0.05); }
        .m6-panel h4 { font-family: var(--font-display); font-size: 0.8rem; margin-top: 0; color: var(--neon-cyan); }
        .service-list { list-style: none; padding: 0; margin: 0; text-align: left;}
        .service-list li { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 5px; background: rgba(255,0,0,0.1); border: 1px solid var(--danger); border-radius: 4px; font-family: monospace; animation: pulseRed 1s infinite alternate;}
        .kill-btn { background: var(--danger); color: white; border: none; border-radius: 4px; cursor: pointer; padding: 4px 8px; font-weight: bold;}
        .kill-btn:hover { background: white; color: var(--danger);}
        @keyframes pulseRed { from { box-shadow: inset 0 0 5px var(--danger); } to { box-shadow: inset 0 0 15px var(--danger); } }
      `;
      container.appendChild(style);

      const log = document.getElementById('m6-log');
      const list = document.getElementById('m6-list');
      
      let servicios = [
        { id: 1, nombre: "ZOMBIE_Agua.exe" },
        { id: 2, nombre: "ZOMBIE_Luz.exe" },
        { id: 3, nombre: "ZOMBIE_Gas.exe" }
      ];

      const render = () => {
        list.innerHTML = '';
        if (servicios.length === 0) {
          list.innerHTML = '<div style="color:var(--neon-green); font-weight:bold; text-align:center;">SERVICIOS PURGADOS</div>';
          log.innerHTML += '<br><span style="color:var(--neon-green)">-- AMENAZA NEUTRALIZADA --</span>';
          soundEngine.play('levelup');
          setTimeout(() => gameEngine.completeMinigameStage(true, 25), 1500);
          return;
        }

        servicios.forEach(s => {
          const li = document.createElement('li');
          li.innerHTML = `<span>[ID:${s.id}] ${s.nombre}</span> <button class="kill-btn" data-id="${s.id}">❌</button>`;
          list.appendChild(li);
        });

        document.querySelectorAll('.kill-btn').forEach(btn => {
          btn.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            soundEngine.play('keypress');
            
            // Simular el log del findIndex y splice
            const idx = servicios.findIndex(srv => srv.id === id);
            log.innerHTML += `<br><span style="color:#aaa">> findIndex(s => s.id === ${id}) -> index ${idx}</span>`;
            if (idx !== -1) {
              servicios.splice(idx, 1);
              log.innerHTML += `<br><span style="color:var(--neon-orange)">> splice(${idx}, 1) ejecutado</span>`;
              render();
            }
          };
        });
      };

      render();
    },
    destroy: () => {}
  }
};
