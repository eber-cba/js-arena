// ═══════════════════════════════════════════════════════════════
// JS_ARENA — BANCO DE PREGUNTAS
// 10 preguntas por misión, 5 tipos de pregunta
// Tipos: multiple_choice, complete_code, detect_error, predict_output, order_steps
// ═══════════════════════════════════════════════════════════════

export const questionBank = {
  // ─── MISIÓN 1: Protocolo Génesis (push, pop) ──────────────
  genesis: [
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué método se usa para agregar un elemento al FINAL de un array?',
      options: ['push', 'pop', 'shift', 'unshift'],
      correct: 0,
      hint: 'Piensa en "empujar" algo al final de una fila.',
      explanation: 'push() agrega uno o más elementos al final del array y devuelve la nueva longitud.',
      xp: 10
    },
    {
      type: 'complete_code',
      difficulty: 1,
      question: 'Completa el código para agregar "banana" al array:',
      code: 'const frutas = ["manzana"]\nfrutas.____("banana")',
      blank: '____',
      correct: 'push',
      hint: 'El método para añadir al final empieza con "p".',
      explanation: 'push("banana") agrega "banana" al final del array frutas.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué devuelve este código?',
      code: 'const nums = [1, 2, 3]\nconst resultado = nums.push(4)\nconsole.log(resultado)',
      correct: '4',
      acceptableAnswers: ['4'],
      hint: 'push() devuelve la NUEVA LONGITUD del array.',
      explanation: 'push() devuelve la nueva longitud del array. Después de agregar 4, el array tiene [1,2,3,4], o sea longitud 4.',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: '¿Qué línea tiene el error?',
      code: 'const colores = ["rojo", "azul"]\ncolores.push["verde"]\nconsole.log(colores)',
      errorLine: 1,
      errorExplanation: 'push es un MÉTODO, se llama con paréntesis (), no con corchetes [].',
      correct: 1,
      hint: 'Fíjate cómo se están llamando los métodos.',
      explanation: 'La línea correcta sería: colores.push("verde"). Los métodos se invocan con paréntesis.',
      xp: 20
    },
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué hace el método pop()?',
      options: [
        'Elimina el ÚLTIMO elemento y lo devuelve',
        'Elimina el PRIMER elemento',
        'Agrega un elemento al final',
        'Agrega un elemento al inicio'
      ],
      correct: 0,
      hint: 'Es lo opuesto a push.',
      explanation: 'pop() elimina el último elemento del array y devuelve ese elemento.',
      xp: 10
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué muestra la consola?',
      code: 'const stack = ["a", "b", "c"]\nconst ultimo = stack.pop()\nconsole.log(ultimo)',
      correct: 'c',
      acceptableAnswers: ['c', '"c"', "'c'"],
      hint: 'pop() devuelve el elemento que elimina.',
      explanation: 'pop() elimina "c" (el último) y lo devuelve. Por eso ultimo vale "c".',
      xp: 20
    },
    {
      type: 'complete_code',
      difficulty: 1,
      question: 'Completa para eliminar el último elemento:',
      code: 'const tareas = ["estudiar", "comer", "dormir"]\nconst eliminada = tareas.____()',
      blank: '____',
      correct: 'pop',
      hint: 'El opuesto de push, 3 letras.',
      explanation: 'pop() sin argumentos elimina y devuelve el último elemento del array.',
      xp: 15
    },
    {
      type: 'order_steps',
      difficulty: 2,
      question: 'Ordena los pasos para crear un array y agregar 3 elementos:',
      steps: [
        'const arr = []',
        'arr.push("primero")',
        'arr.push("segundo")',
        'arr.push("tercero")'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'Primero se crea el array vacío, luego se agregan en orden.',
      explanation: 'Primero creamos el array vacío, luego usamos push para agregar elementos uno a uno.',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: 'Después de ejecutar este código:\nconst arr = [1,2,3]\narr.push(4)\narr.pop()\n\n¿Cómo queda arr?',
      options: ['[1, 2, 3]', '[1, 2, 3, 4]', '[1, 2]', '[1, 2, 4]'],
      correct: 0,
      hint: 'Primero se agrega 4, luego se quita el último.',
      explanation: 'push(4) da [1,2,3,4], luego pop() quita 4, quedando [1,2,3].',
      xp: 15
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: '¿Qué está mal en este código?',
      code: 'const items = [10, 20, 30]\nconst primero = items.pop(0)\nconsole.log(primero)',
      errorLine: 1,
      correct: 1,
      hint: 'pop() no acepta argumentos.',
      explanation: 'pop() NO recibe argumentos. Siempre elimina el último elemento. Para eliminar por índice se usa splice().',
      xp: 20
    }
  ],

  // ─── MISIÓN 2: Cambio Cuántico (shift, unshift) ──────────
  quantum_shift: [
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué método elimina el PRIMER elemento de un array?',
      options: ['shift', 'pop', 'push', 'splice'],
      correct: 0,
      hint: 'Imagina que "desplazas" todos los elementos una posición.',
      explanation: 'shift() elimina el primer elemento del array y desplaza todos los demás.',
      xp: 10
    },
    {
      type: 'complete_code',
      difficulty: 1,
      question: 'Agrega "urgente" al INICIO del array:',
      code: 'const cola = ["tarea1", "tarea2"]\ncola.____("urgente")',
      blank: '____',
      correct: 'unshift',
      hint: 'Es lo opuesto de shift. "Un" + "shift".',
      explanation: 'unshift() agrega elementos al inicio del array, desplazando los existentes.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué imprime este código?',
      code: 'const fila = ["Ana", "Bob", "Carlos"]\nconst primero = fila.shift()\nconsole.log(primero)\nconsole.log(fila.length)',
      correct: 'Ana\n2',
      acceptableAnswers: ['Ana 2', 'Ana\n2', '"Ana" 2', 'Ana, 2'],
      hint: 'shift devuelve el primer elemento. El array se acorta.',
      explanation: 'shift() elimina y devuelve "Ana". El array queda ["Bob","Carlos"], longitud 2.',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: 'Encuentra el error:',
      code: 'const data = [1, 2, 3]\ndata.Unshift(0)\nconsole.log(data)',
      errorLine: 1,
      correct: 1,
      hint: 'JavaScript es sensible a mayúsculas y minúsculas.',
      explanation: 'Los métodos en JS son case-sensitive. Es unshift (minúscula), no Unshift.',
      xp: 20
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Cuál es la diferencia entre shift y pop?',
      options: [
        'shift elimina del inicio, pop del final',
        'shift elimina del final, pop del inicio',
        'Ambos eliminan del final',
        'shift agrega, pop elimina'
      ],
      correct: 0,
      hint: 'shift = inicio, pop = final.',
      explanation: 'shift() trabaja con el PRIMER elemento, pop() con el ÚLTIMO.',
      xp: 15
    },
    {
      type: 'order_steps',
      difficulty: 2,
      question: 'Ordena para simular una cola (FIFO): agregar al final, sacar del inicio:',
      steps: [
        'const cola = []',
        'cola.push("cliente1")',
        'cola.push("cliente2")',
        'cola.shift()'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'FIFO: First In, First Out. Entra por el final, sale por el inicio.',
      explanation: 'Una cola FIFO usa push para agregar y shift para remover el primero que llegó.',
      xp: 25
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué devuelve unshift?',
      code: 'const arr = [2, 3]\nconst resultado = arr.unshift(0, 1)\nconsole.log(resultado)',
      correct: '4',
      acceptableAnswers: ['4'],
      hint: 'Similar a push, devuelve la nueva longitud.',
      explanation: 'unshift() devuelve la nueva longitud. El array queda [0,1,2,3], longitud 4.',
      xp: 20
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Elimina el primer elemento del array:',
      code: 'const mensajes = ["leído", "nuevo1", "nuevo2"]\nconst leido = mensajes.____()',
      blank: '____',
      correct: 'shift',
      hint: 'Piensa en "desplazar" los elementos.',
      explanation: 'shift() elimina el primer elemento "leído" y mueve los demás al inicio.',
      xp: 15
    },
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué hace unshift()?',
      options: [
        'Agrega elementos al INICIO del array',
        'Elimina el primer elemento',
        'Agrega elementos al final',
        'Invierte el array'
      ],
      correct: 0,
      hint: '"Un-shift" = deshacer el shift.',
      explanation: 'unshift() es lo opuesto a shift(). Agrega elementos al inicio del array.',
      xp: 10
    },
    {
      type: 'detect_error',
      difficulty: 3,
      question: 'Este código intenta rotar un array. ¿Qué falla?',
      code: 'const arr = [1, 2, 3, 4]\nconst primero = arr.shift()\narr.push(primero)\n// Esperamos: [2, 3, 4, 1]',
      errorLine: -1,
      correct: -1,
      hint: 'A veces no hay error. Lee con cuidado.',
      explanation: '¡No hay error! El código es correcto. shift saca 1, push lo agrega al final: [2,3,4,1].',
      xp: 25
    }
  ],

  // ─── MISIÓN 3: Red Neuronal (map) ────────────────────────
  neural_mapper: [
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué hace el método map()?',
      options: [
        'Crea un NUEVO array transformando cada elemento',
        'Modifica el array original',
        'Filtra elementos del array',
        'Busca un elemento específico'
      ],
      correct: 0,
      hint: 'Map = mapear/transformar. Crea algo NUEVO.',
      explanation: 'map() crea un nuevo array aplicando una función a cada elemento del original, sin modificarlo.',
      xp: 10
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Duplica cada número del array:',
      code: 'const nums = [1, 2, 3, 4]\nconst dobles = nums.____(n => n * 2)',
      blank: '____',
      correct: 'map',
      hint: 'Necesitas TRANSFORMAR cada elemento.',
      explanation: 'map(n => n * 2) transforma cada número multiplicándolo por 2: [2, 4, 6, 8].',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué devuelve este código?',
      code: 'const nombres = ["ana", "bob"]\nconst mayus = nombres.map(n => n.toUpperCase())\nconsole.log(mayus)',
      correct: '["ANA", "BOB"]',
      acceptableAnswers: ['["ANA","BOB"]', '["ANA", "BOB"]', 'ANA,BOB', "['ANA', 'BOB']"],
      hint: 'toUpperCase convierte a mayúsculas.',
      explanation: 'map aplica toUpperCase a cada nombre, creando ["ANA", "BOB"].',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: 'Encuentra el error en este uso de map:',
      code: 'const precios = [10, 20, 30]\nconst conIva = precios.map(p => {\n  p * 1.21\n})\nconsole.log(conIva)',
      errorLine: 2,
      correct: 2,
      hint: 'Cuando usas llaves {} en una arrow function, necesitas algo especial.',
      explanation: 'Con llaves {} se necesita return explícito: return p * 1.21. Sin return, map devuelve [undefined, undefined, undefined].',
      xp: 20
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿map() modifica el array original?',
      options: [
        'No, crea un nuevo array',
        'Sí, modifica el original',
        'Depende del callback',
        'Solo si el array tiene objetos'
      ],
      correct: 0,
      hint: 'map es un método "inmutable".',
      explanation: 'map() NUNCA modifica el array original. Siempre devuelve un nuevo array.',
      xp: 15
    },
    {
      type: 'order_steps',
      difficulty: 2,
      question: 'Ordena los pasos para obtener las longitudes de cada palabra:',
      steps: [
        'const palabras = ["hola", "mundo", "js"]',
        'const longitudes = palabras.map(p => p.length)',
        'console.log(longitudes)',
        '// Resultado: [4, 5, 2]'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'Primero declara, luego mapea, luego muestra.',
      explanation: 'map(p => p.length) transforma cada palabra en su longitud.',
      xp: 25
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué imprime este código?',
      code: 'const nums = [1, 2, 3]\nconst result = nums.map((n, i) => n + i)\nconsole.log(result)',
      correct: '[1, 3, 5]',
      acceptableAnswers: ['[1,3,5]', '[1, 3, 5]', '1,3,5'],
      hint: 'El segundo parámetro "i" es el índice (0, 1, 2...).',
      explanation: 'map recibe (elemento, índice). Entonces: 1+0=1, 2+1=3, 3+2=5.',
      xp: 25
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Extrae solo los nombres de los objetos:',
      code: 'const users = [{nombre: "Ana", edad: 25}, {nombre: "Bob", edad: 30}]\nconst nombres = users.map(u => u.____)',
      blank: '____',
      correct: 'nombre',
      hint: 'Accede a la propiedad que contiene el nombre.',
      explanation: 'map(u => u.nombre) extrae la propiedad nombre de cada objeto: ["Ana", "Bob"].',
      xp: 15
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Qué recibe el callback de map como parámetros?',
      options: [
        'elemento, índice, array completo',
        'solo el elemento',
        'índice, elemento',
        'elemento, array completo'
      ],
      correct: 0,
      hint: 'Son 3 parámetros posibles.',
      explanation: 'El callback de map recibe: (elemento, índice, arrayOriginal). Normalmente solo usamos el primero.',
      xp: 15
    },
    {
      type: 'detect_error',
      difficulty: 3,
      question: '¿Cuál es el problema aquí?',
      code: 'const nums = [1, 2, 3]\nnums.map(n => console.log(n * 2))\n// Esperamos obtener [2, 4, 6]',
      errorLine: 1,
      correct: 1,
      hint: 'map devuelve un nuevo array, ¿pero qué devuelve console.log?',
      explanation: 'console.log() devuelve undefined. El resultado de este map sería [undefined, undefined, undefined]. Debería ser: const result = nums.map(n => n * 2).',
      xp: 25
    }
  ],

  // ─── MISIÓN 4: Purga de Datos (filter) ───────────────────
  data_purge: [
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué hace filter()?',
      options: [
        'Crea un nuevo array con los elementos que pasan una condición',
        'Transforma cada elemento',
        'Encuentra un solo elemento',
        'Ordena el array'
      ],
      correct: 0,
      hint: 'Filtra = quédate solo con lo que cumple la condición.',
      explanation: 'filter() crea un nuevo array con todos los elementos que devuelvan true en la condición.',
      xp: 10
    },
    {
      type: 'complete_code',
      difficulty: 1,
      question: 'Filtra solo los números mayores a 10:',
      code: 'const nums = [5, 12, 8, 130, 44]\nconst grandes = nums.____(n => n > 10)',
      blank: '____',
      correct: 'filter',
      hint: 'Necesitas filtrar, no transformar.',
      explanation: 'filter(n => n > 10) devuelve [12, 130, 44] — solo los mayores a 10.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué resultado obtenemos?',
      code: 'const palabras = ["sol", "a", "luna", "yo", "nube"]\nconst largas = palabras.filter(p => p.length > 2)\nconsole.log(largas)',
      correct: '["sol", "luna", "nube"]',
      acceptableAnswers: ['["sol","luna","nube"]', '["sol", "luna", "nube"]', 'sol,luna,nube', "['sol', 'luna', 'nube']"],
      hint: 'Solo las palabras con más de 2 caracteres.',
      explanation: 'filter(p => p.length > 2) mantiene palabras con más de 2 letras: "sol"(3), "luna"(4), "nube"(4).',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: 'Este código debería filtrar pares. ¿Qué está mal?',
      code: 'const nums = [1, 2, 3, 4, 5, 6]\nconst pares = nums.filter(n => n % 2)\nconsole.log(pares)',
      errorLine: 1,
      correct: 1,
      hint: 'n % 2 devuelve 0 para pares y 1 para impares. ¿Qué es truthy?',
      explanation: 'n % 2 es truthy para IMPARES (1,3,5). Para filtrar pares debería ser: n % 2 === 0.',
      xp: 20
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿filter() modifica el array original?',
      options: [
        'No, devuelve un nuevo array',
        'Sí, elimina los que no cumplen',
        'Depende de la condición',
        'Sí, siempre'
      ],
      correct: 0,
      hint: 'Como map, filter es inmutable.',
      explanation: 'filter() es inmutable: el array original no se toca. Devuelve uno nuevo.',
      xp: 10
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué imprime este código?',
      code: 'const data = [0, 1, "", "hola", null, true, undefined]\nconst validos = data.filter(Boolean)\nconsole.log(validos.length)',
      correct: '3',
      acceptableAnswers: ['3'],
      hint: 'Boolean() convierte a true/false. Los valores falsy se eliminan.',
      explanation: 'filter(Boolean) elimina todos los valores falsy (0, "", null, undefined). Quedan: [1, "hola", true] = 3 elementos.',
      xp: 25
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Filtra usuarios mayores de 18 años:',
      code: 'const users = [\n  {nombre: "Ana", edad: 17},\n  {nombre: "Bob", edad: 22},\n  {nombre: "Cat", edad: 15}\n]\nconst adultos = users.filter(u => u.____ >= 18)',
      blank: '____',
      correct: 'edad',
      hint: 'Accede a la propiedad de edad.',
      explanation: 'filter(u => u.edad >= 18) devuelve solo los usuarios con edad mayor o igual a 18.',
      xp: 15
    },
    {
      type: 'order_steps',
      difficulty: 2,
      question: 'Ordena para filtrar y luego transformar un array:',
      steps: [
        'const nums = [1, 2, 3, 4, 5, 6]',
        'const pares = nums.filter(n => n % 2 === 0)',
        'const dobles = pares.map(n => n * 2)',
        'console.log(dobles) // [4, 8, 12]'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'Primero filtra, luego transforma.',
      explanation: 'Se puede encadenar filter y map: primero filtramos pares [2,4,6], luego duplicamos [4,8,12].',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Qué devuelve filter si ningún elemento cumple la condición?',
      options: [
        'Un array vacío []',
        'undefined',
        'null',
        'false'
      ],
      correct: 0,
      hint: 'filter siempre devuelve un array.',
      explanation: 'filter() SIEMPRE devuelve un array. Si nada cumple la condición, devuelve [].',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué muestra?',
      code: 'const nums = [10, 20, 30, 40]\nconst result = nums.filter(n => n > 25).length\nconsole.log(result)',
      correct: '2',
      acceptableAnswers: ['2'],
      hint: 'filter devuelve [30, 40]. ¿Cuántos elementos son?',
      explanation: 'filter(n => n > 25) devuelve [30, 40], y .length es 2.',
      xp: 20
    }
  ],

  // ─── MISIÓN 5: Bloqueo de Objetivo (find, indexOf, findIndex) ──
  target_lock: [
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué devuelve find()?',
      options: [
        'El PRIMER elemento que cumple la condición',
        'Todos los elementos que cumplen',
        'El índice del elemento',
        'true o false'
      ],
      correct: 0,
      hint: 'find = encontrar UNO solo.',
      explanation: 'find() devuelve el primer elemento que cumple la condición, o undefined si no encuentra ninguno.',
      xp: 10
    },
    {
      type: 'complete_code',
      difficulty: 1,
      question: 'Encuentra el primer número mayor a 15:',
      code: 'const nums = [3, 10, 18, 25]\nconst encontrado = nums.____(n => n > 15)',
      blank: '____',
      correct: 'find',
      hint: 'No queremos filtrar todos, queremos ENCONTRAR el primero.',
      explanation: 'find(n => n > 15) devuelve 18 — el primer número mayor a 15.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué imprime?',
      code: 'const frutas = ["mango", "kiwi", "pera"]\nconst idx = frutas.indexOf("kiwi")\nconsole.log(idx)',
      correct: '1',
      acceptableAnswers: ['1'],
      hint: 'indexOf devuelve la posición (empezando en 0).',
      explanation: 'indexOf("kiwi") devuelve 1 porque "kiwi" está en la posición 1 (arrays empiezan en 0).',
      xp: 20
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Qué devuelve indexOf si el elemento NO existe?',
      options: ['-1', 'undefined', 'null', 'false'],
      correct: 0,
      hint: 'Un valor numérico especial.',
      explanation: 'indexOf() devuelve -1 cuando no encuentra el elemento en el array.',
      xp: 10
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: '¿Cuál es el problema?',
      code: 'const users = [{id: 1}, {id: 2}, {id: 3}]\nconst user = users.indexOf(u => u.id === 2)\nconsole.log(user)',
      errorLine: 1,
      correct: 1,
      hint: 'indexOf busca por valor exacto, no acepta callbacks.',
      explanation: 'indexOf no acepta funciones callback. Para buscar con condición, usa findIndex() o find().',
      xp: 20
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Encuentra el ÍNDICE del primer usuario admin:',
      code: 'const users = [\n  {name: "Ana", role: "user"},\n  {name: "Bob", role: "admin"}\n]\nconst idx = users.____(u => u.role === "admin")',
      blank: '____',
      correct: 'findIndex',
      hint: 'Necesitas el índice, no el elemento. find + Index.',
      explanation: 'findIndex() devuelve el índice del primer elemento que cumple la condición. Devuelve 1.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué imprime?',
      code: 'const nums = [5, 10, 15, 20]\nconst result = nums.find(n => n > 100)\nconsole.log(result)',
      correct: 'undefined',
      acceptableAnswers: ['undefined'],
      hint: '¿Hay algún número mayor a 100?',
      explanation: 'No hay ningún número mayor a 100, así que find() devuelve undefined.',
      xp: 20
    },
    {
      type: 'order_steps',
      difficulty: 2,
      question: 'Ordena para buscar un usuario y mostrar su nombre:',
      steps: [
        'const users = [{id: 1, name: "Ana"}, {id: 2, name: "Bob"}]',
        'const user = users.find(u => u.id === 2)',
        'if (user) {',
        '  console.log(user.name) // "Bob"',
        '}'
      ],
      correctOrder: [0, 1, 2, 3, 4],
      hint: 'Busca el usuario, verifica que existe, luego accede al nombre.',
      explanation: 'Siempre verifica que find() devolvió algo (no undefined) antes de acceder a propiedades.',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Cuál es la diferencia entre find() y filter()?',
      options: [
        'find devuelve el PRIMERO, filter devuelve TODOS',
        'find devuelve todos, filter devuelve el primero',
        'Son lo mismo',
        'find modifica el array, filter no'
      ],
      correct: 0,
      hint: 'find para UNO, filter para VARIOS.',
      explanation: 'find() para cuando encuentra el primero. filter() recorre todo y devuelve todos los que cumplen.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué muestra la consola?',
      code: 'const arr = ["a", "b", "c", "b"]\nconsole.log(arr.indexOf("b"))\nconsole.log(arr.lastIndexOf("b"))',
      correct: '1\n3',
      acceptableAnswers: ['1 3', '1\n3', '1, 3'],
      hint: 'indexOf busca desde el inicio, lastIndexOf desde el final.',
      explanation: 'indexOf("b") = 1 (primera aparición). lastIndexOf("b") = 3 (última aparición).',
      xp: 25
    }
  ],

  // ─── MISIÓN 6: Escaneo Firewall (includes, some, every) ──
  firewall_scan: [
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué devuelve includes()?',
      options: ['true o false', 'El elemento encontrado', 'El índice', 'Un nuevo array'],
      correct: 0,
      hint: '¿El array INCLUYE este elemento? Sí o no.',
      explanation: 'includes() devuelve true si el array contiene el elemento, false si no.',
      xp: 10
    },
    {
      type: 'complete_code',
      difficulty: 1,
      question: 'Verifica si el array contiene "admin":',
      code: 'const roles = ["user", "editor", "admin"]\nconst tieneAdmin = roles.____("admin")',
      blank: '____',
      correct: 'includes',
      hint: '¿El array incluye este valor?',
      explanation: 'includes("admin") devuelve true porque "admin" está en el array.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué imprime?',
      code: 'const nums = [1, 2, 3, 4, 5]\nconst todosMayor0 = nums.every(n => n > 0)\nconst algunMayor4 = nums.some(n => n > 4)\nconsole.log(todosMayor0, algunMayor4)',
      correct: 'true true',
      acceptableAnswers: ['true true', 'true, true'],
      hint: 'every = ¿TODOS cumplen? some = ¿ALGUNO cumple?',
      explanation: 'every(n > 0) = true (todos son mayores a 0). some(n > 4) = true (el 5 cumple).',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: 'Encuentra el error conceptual:',
      code: 'const edades = [18, 22, 15, 30]\nif (edades.some(e => e >= 18)) {\n  console.log("Todos son mayores de edad")\n}',
      errorLine: 1,
      correct: 1,
      hint: 'some verifica si ALGUNO cumple. ¿Es eso lo que queremos?',
      explanation: 'some() verifica si AL MENOS UNO cumple. Para verificar que TODOS cumplan, se debe usar every().',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Cuándo devuelve every() true?',
      options: [
        'Cuando TODOS los elementos cumplen la condición',
        'Cuando al menos uno cumple',
        'Cuando ninguno cumple',
        'Siempre devuelve true'
      ],
      correct: 0,
      hint: 'every = cada uno, todos.',
      explanation: 'every() devuelve true solo si TODOS los elementos pasan la prueba del callback.',
      xp: 10
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Verifica si ALGÚN precio es mayor a $1000:',
      code: 'const precios = [250, 800, 1200, 50]\nconst hayCaros = precios.____(p => p > 1000)',
      blank: '____',
      correct: 'some',
      hint: '¿Al menos UNO cumple?',
      explanation: 'some(p => p > 1000) devuelve true porque 1200 > 1000.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué imprime?',
      code: 'const arr = []\nconsole.log(arr.every(x => x > 0))\nconsole.log(arr.some(x => x > 0))',
      correct: 'true\nfalse',
      acceptableAnswers: ['true false', 'true\nfalse', 'true, false'],
      hint: 'Array vacío: every devuelve true (vacuamente verdadero), some devuelve false.',
      explanation: 'Con arrays vacíos: every() = true (ninguno lo viola), some() = false (ninguno lo cumple). Es lógica formal.',
      xp: 30
    },
    {
      type: 'order_steps',
      difficulty: 3,
      question: 'Ordena para verificar seguridad de un sistema:',
      steps: [
        'const passwords = ["abc123", "Str0ng!P@ss", "hello"]',
        'const todasSeguras = passwords.every(p => p.length >= 8)',
        'const algunaCorta = passwords.some(p => p.length < 6)',
        'console.log("¿Sistema seguro?", todasSeguras && !algunaCorta)'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'Declara, verifica con every, verifica con some, muestra resultado.',
      explanation: 'Se combina every y some para verificar múltiples condiciones de seguridad.',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: 'includes() busca con:',
      options: [
        'Igualdad estricta (===)',
        'Igualdad débil (==)',
        'Una función callback',
        'Expresiones regulares'
      ],
      correct: 0,
      hint: 'No acepta funciones como some o every.',
      explanation: 'includes() compara con === (estricta). No acepta callback. Para búsquedas complejas usa some().',
      xp: 15
    },
    {
      type: 'detect_error',
      difficulty: 3,
      question: '¿Qué problema tiene este código?',
      code: 'const users = [{name: "Ana"}, {name: "Bob"}]\nconst tieneAna = users.includes({name: "Ana"})\nconsole.log(tieneAna) // Espera: true',
      errorLine: 1,
      correct: 1,
      hint: 'includes usa ===. ¿Dos objetos son === si tienen los mismos valores?',
      explanation: 'includes usa ===. Dos objetos diferentes nunca son === aunque tengan mismos valores. Usa some(): users.some(u => u.name === "Ana").',
      xp: 25
    }
  ],

  // ─── MISIÓN 7: El Compresor (reduce) ─────────────────────
  the_reducer: [
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Qué hace reduce()?',
      options: [
        'Reduce un array a un SOLO valor acumulando resultados',
        'Reduce el tamaño del array',
        'Elimina elementos duplicados',
        'Comprime los datos'
      ],
      correct: 0,
      hint: 'Reduce todo el array a un resultado único.',
      explanation: 'reduce() recorre el array acumulando un resultado. Transforma [1,2,3] en un solo valor.',
      xp: 15
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Suma todos los números:',
      code: 'const nums = [1, 2, 3, 4]\nconst suma = nums.____(( acc, n) => acc + n, 0)',
      blank: '____',
      correct: 'reduce',
      hint: 'Necesitas REDUCIR el array a una suma.',
      explanation: 'reduce((acc, n) => acc + n, 0) acumula: 0+1=1, 1+2=3, 3+3=6, 6+4=10.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué devuelve?',
      code: 'const nums = [1, 2, 3, 4, 5]\nconst result = nums.reduce((acc, n) => acc + n, 0)\nconsole.log(result)',
      correct: '15',
      acceptableAnswers: ['15'],
      hint: 'Suma acumulativa: 0+1+2+3+4+5.',
      explanation: 'reduce suma todo: 0→1→3→6→10→15.',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 3,
      question: 'Este reduce debería multiplicar todos los números. ¿Qué falla?',
      code: 'const nums = [2, 3, 4]\nconst producto = nums.reduce((acc, n) => acc * n, 0)\nconsole.log(producto)',
      errorLine: 1,
      correct: 1,
      hint: 'El valor inicial es 0. ¿Qué pasa al multiplicar por 0?',
      explanation: 'El valor inicial es 0. Cualquier número × 0 = 0. Debería ser 1: reduce((acc, n) => acc * n, 1).',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Qué es el "acumulador" en reduce?',
      options: [
        'El valor que se va construyendo en cada iteración',
        'El array original',
        'El índice actual',
        'La función callback'
      ],
      correct: 0,
      hint: 'Acumula el resultado paso a paso.',
      explanation: 'El acumulador (acc) empieza con el valor inicial y se actualiza en cada paso con el return del callback.',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué imprime?',
      code: 'const words = ["Hola", " ", "mundo"]\nconst frase = words.reduce((acc, w) => acc + w)\nconsole.log(frase)',
      correct: 'Hola mundo',
      acceptableAnswers: ['Hola mundo'],
      hint: 'Sin valor inicial, el primer elemento es el acumulador.',
      explanation: 'Sin valor inicial, reduce usa el primer elemento. Concatena: "Hola" + " " + "mundo" = "Hola mundo".',
      xp: 25
    },
    {
      type: 'complete_code',
      difficulty: 3,
      question: 'Cuenta cuántos elementos son mayores a 10:',
      code: 'const nums = [5, 12, 8, 130, 44]\nconst count = nums.reduce((acc, n) => n > 10 ? acc + ____ : acc, 0)',
      blank: '____',
      correct: '1',
      hint: 'Si cumple la condición, suma 1 al contador.',
      explanation: 'Cuando n > 10, sumamos 1 al acumulador. Funciona como un contador.',
      xp: 20
    },
    {
      type: 'order_steps',
      difficulty: 3,
      question: 'Ordena para usar reduce y encontrar el máximo:',
      steps: [
        'const nums = [3, 7, 2, 9, 4]',
        'const max = nums.reduce((acc, n) => {',
        '  return n > acc ? n : acc',
        '}, nums[0])',
        'console.log(max) // 9'
      ],
      correctOrder: [0, 1, 2, 3, 4],
      hint: 'Si n es mayor que el acumulador, n se vuelve el nuevo máximo.',
      explanation: 'reduce compara cada elemento con el acumulador (máximo actual). 3→7→7→9→9.',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 3,
      question: '¿Qué pasa si no pasas valor inicial a reduce?',
      options: [
        'Usa el primer elemento como acumulador y empieza desde el segundo',
        'Error de sintaxis',
        'El acumulador empieza en 0',
        'El acumulador empieza en undefined'
      ],
      correct: 0,
      hint: 'El primer elemento toma un rol especial.',
      explanation: 'Sin valor inicial, el primer elemento es el acumulador y la iteración empieza en el índice 1.',
      xp: 20
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué resultado obtenemos?',
      code: 'const data = ["a", "b", "a", "c", "b", "a"]\nconst count = data.reduce((acc, val) => {\n  acc[val] = (acc[val] || 0) + 1\n  return acc\n}, {})\nconsole.log(count)',
      correct: '{a: 3, b: 2, c: 1}',
      acceptableAnswers: ['{a: 3, b: 2, c: 1}', '{"a":3,"b":2,"c":1}', '{a:3,b:2,c:1}'],
      hint: 'El acumulador es un objeto {}. Cuenta ocurrencias.',
      explanation: 'reduce acumula en un objeto, contando cada letra: a aparece 3 veces, b 2 veces, c 1 vez.',
      xp: 30
    }
  ],

  // ─── MISIÓN 8: Corte Quirúrgico (slice, splice) ──────────
  slice_dice: [
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Cuál es la diferencia PRINCIPAL entre slice y splice?',
      options: [
        'slice NO modifica el original, splice SÍ lo modifica',
        'slice modifica el original, splice no',
        'Son sinónimos',
        'slice solo funciona con strings'
      ],
      correct: 0,
      hint: 'Uno es inmutable, el otro muta.',
      explanation: 'slice() es inmutable (devuelve copia). splice() MUTA el array original.',
      xp: 15
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Extrae los elementos del índice 1 al 3 (sin incluir el 3):',
      code: 'const arr = ["a", "b", "c", "d", "e"]\nconst sub = arr.____(1, 3)',
      blank: '____',
      correct: 'slice',
      hint: 'Necesitas una copia parcial sin modificar el original.',
      explanation: 'slice(1, 3) devuelve ["b", "c"] — desde índice 1 hasta 3 (sin incluirlo).',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué imprime?',
      code: 'const colores = ["rojo", "verde", "azul", "amarillo"]\nconst sub = colores.slice(1, 3)\nconsole.log(sub)',
      correct: '["verde", "azul"]',
      acceptableAnswers: ['["verde","azul"]', '["verde", "azul"]', 'verde,azul', "['verde', 'azul']"],
      hint: 'slice(inicio, fin) — fin NO incluido.',
      explanation: 'slice(1, 3) extrae desde índice 1 ("verde") hasta 3 sin incluirlo ("azul").',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 3,
      question: '¿Qué problema tiene este código?',
      code: 'const arr = [1, 2, 3, 4, 5]\nconst copia = arr.slice()\ncopia.splice(0, 2)\nconsole.log(arr) // Espera: [1, 2, 3, 4, 5]',
      errorLine: -1,
      correct: -1,
      hint: '¿slice() sin argumentos qué hace?',
      explanation: '¡No hay error! slice() sin argumentos copia todo el array. splice modifica la copia, no el original.',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: 'splice(2, 1) en [a, b, c, d] hace:',
      options: [
        'Elimina 1 elemento desde el índice 2 (elimina "c")',
        'Elimina 2 elementos desde el índice 1',
        'Agrega 1 elemento en el índice 2',
        'No hace nada'
      ],
      correct: 0,
      hint: 'splice(inicio, cuántos_eliminar).',
      explanation: 'splice(2, 1) = desde índice 2, eliminar 1 elemento. Elimina "c", queda ["a","b","d"].',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué imprime?',
      code: 'const arr = [1, 2, 3, 4, 5]\nconst removed = arr.splice(1, 2, "a", "b")\nconsole.log(arr)\nconsole.log(removed)',
      correct: '[1, "a", "b", 4, 5]\n[2, 3]',
      acceptableAnswers: ['[1,"a","b",4,5] [2,3]', '[1, "a", "b", 4, 5]\n[2, 3]'],
      hint: 'splice puede eliminar Y agregar a la vez.',
      explanation: 'splice(1, 2, "a", "b"): en índice 1, elimina 2, inserta "a" y "b". Devuelve los eliminados [2,3].',
      xp: 25
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Elimina 2 elementos desde el índice 1:',
      code: 'const datos = ["x", "basura1", "basura2", "y"]\ndatos.____(1, 2)',
      blank: '____',
      correct: 'splice',
      hint: 'Necesitas MODIFICAR el array eliminando elementos.',
      explanation: 'splice(1, 2) elimina 2 elementos desde el índice 1. Queda ["x", "y"].',
      xp: 15
    },
    {
      type: 'order_steps',
      difficulty: 3,
      question: 'Ordena para insertar un elemento en medio de un array:',
      steps: [
        'const arr = [1, 2, 4, 5]',
        '// Queremos insertar 3 en su posición correcta',
        'arr.splice(2, 0, 3)',
        'console.log(arr) // [1, 2, 3, 4, 5]'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'splice(posición, 0, elemento) inserta sin eliminar.',
      explanation: 'splice(2, 0, 3): en índice 2, eliminar 0, insertar 3. Resultado: [1,2,3,4,5].',
      xp: 25
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué devuelve slice con índices negativos?',
      code: 'const arr = [1, 2, 3, 4, 5]\nconsole.log(arr.slice(-2))',
      correct: '[4, 5]',
      acceptableAnswers: ['[4,5]', '[4, 5]', '4,5'],
      hint: 'Índices negativos cuentan desde el final.',
      explanation: 'slice(-2) extrae los últimos 2 elementos: [4, 5].',
      xp: 20
    },
    {
      type: 'multiple_choice',
      difficulty: 3,
      question: '¿Qué devuelve splice()?',
      options: [
        'Un array con los elementos ELIMINADOS',
        'El array modificado',
        'La longitud nueva',
        'undefined'
      ],
      correct: 0,
      hint: 'Devuelve lo que sacó.',
      explanation: 'splice() devuelve un array con los elementos que eliminó. Si no eliminó nada, devuelve [].',
      xp: 15
    }
  ],

  // ─── MISIÓN 9: Protocolo de Orden (sort, reverse) ────────
  sort_protocol: [
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Cómo ordena sort() por defecto?',
      options: [
        'Como strings (orden léxico/alfabético)',
        'Numéricamente de menor a mayor',
        'Numéricamente de mayor a menor',
        'Aleatoriamente'
      ],
      correct: 0,
      hint: '¿Qué pasa si ordenas [10, 9, 80] con sort()?',
      explanation: 'sort() sin argumentos convierte todo a string y ordena alfabéticamente. [10, 80, 9] ← "10" < "80" < "9".',
      xp: 15
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '⚠️ Pregunta trampa. ¿Qué imprime?',
      code: 'const nums = [10, 9, 80, 1, 100]\nnums.sort()\nconsole.log(nums)',
      correct: '[1, 10, 100, 80, 9]',
      acceptableAnswers: ['[1,10,100,80,9]', '[1, 10, 100, 80, 9]', '1,10,100,80,9'],
      hint: 'sort() sin callback ordena como STRINGS.',
      explanation: 'Sin comparador, sort convierte a strings: "1"<"10"<"100"<"80"<"9" (orden alfabético).',
      xp: 30
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Ordena números de menor a mayor correctamente:',
      code: 'const nums = [40, 1, 5, 200]\nnums.sort((a, b) => a ____ b)',
      blank: '____',
      correct: '-',
      hint: 'Si a-b es negativo, a va primero.',
      explanation: 'sort((a,b) => a - b) ordena numéricamente de menor a mayor. Resultado: [1, 5, 40, 200].',
      xp: 15
    },
    {
      type: 'detect_error',
      difficulty: 2,
      question: '¿Qué está mal?',
      code: 'const arr = [3, 1, 2]\nconst ordenado = arr.sort((a, b) => a - b)\nconsole.log(arr === ordenado) // true\n// El programador piensa que arr no cambió',
      errorLine: 1,
      correct: 1,
      hint: 'sort() modifica el array original.',
      explanation: 'sort() MUTA el array original. arr y ordenado apuntan al mismo array. Para no mutar: [...arr].sort().',
      xp: 20
    },
    {
      type: 'multiple_choice',
      difficulty: 1,
      question: '¿Qué hace reverse()?',
      options: [
        'Invierte el orden del array',
        'Ordena de mayor a menor',
        'Ordena alfabéticamente al revés',
        'Crea una copia invertida'
      ],
      correct: 0,
      hint: 'Simplemente da vuelta el array.',
      explanation: 'reverse() invierte el orden: [1,2,3] → [3,2,1]. También modifica el original.',
      xp: 10
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué imprime?',
      code: 'const arr = ["c", "a", "b"]\narr.sort()\narr.reverse()\nconsole.log(arr)',
      correct: '["c", "b", "a"]',
      acceptableAnswers: ['["c","b","a"]', '["c", "b", "a"]', 'c,b,a', "['c', 'b', 'a']"],
      hint: 'Primero ordena, luego invierte.',
      explanation: 'sort() → ["a","b","c"], reverse() → ["c","b","a"].',
      xp: 20
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Ordena usuarios por edad de mayor a menor:',
      code: 'const users = [{name:"Ana",age:25},{name:"Bob",age:30},{name:"Cat",age:20}]\nusers.sort((a, b) => b.____ - a.____)',
      blank: '____',
      correct: 'age',
      hint: 'Compara la propiedad de edad.',
      explanation: 'sort((a,b) => b.age - a.age) ordena de mayor a menor por edad: Bob(30), Ana(25), Cat(20).',
      xp: 15
    },
    {
      type: 'order_steps',
      difficulty: 3,
      question: 'Ordena para obtener los 3 precios más altos:',
      steps: [
        'const precios = [99, 250, 15, 800, 50, 1200]',
        'const ordenados = [...precios].sort((a, b) => b - a)',
        'const top3 = ordenados.slice(0, 3)',
        'console.log(top3) // [1200, 800, 250]'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'Ordena de mayor a menor, luego toma los 3 primeros.',
      explanation: 'Spread para no mutar, sort descendente, slice para tomar los 3 primeros.',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 3,
      question: '¿sort() devuelve un nuevo array?',
      options: [
        'No, modifica y devuelve el MISMO array',
        'Sí, devuelve uno nuevo',
        'Depende del callback',
        'No devuelve nada'
      ],
      correct: 0,
      hint: 'sort muta el original.',
      explanation: 'sort() modifica el array original Y devuelve una referencia al mismo. No crea copia.',
      xp: 15
    },
    {
      type: 'detect_error',
      difficulty: 3,
      question: '¿Qué problema hay?',
      code: 'const strs = ["banana", "Apple", "cherry"]\nstrs.sort()\nconsole.log(strs)\n// Espera: ["Apple", "banana", "cherry"]',
      errorLine: -1,
      correct: -1,
      hint: 'El orden por defecto es case-sensitive.',
      explanation: 'No hay error técnico, pero sí un gotcha: sort por defecto pone mayúsculas antes que minúsculas (A=65 < b=98). El resultado es correcto.',
      xp: 25
    }
  ],

  // ─── MISIÓN 10: Ruptura Dimensional (flat, flatMap) ──────
  dimension_break: [
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿Qué hace flat()?',
      options: [
        'Aplana arrays anidados en uno solo',
        'Aplasta los valores a 0',
        'Elimina duplicados',
        'Convierte a string'
      ],
      correct: 0,
      hint: 'Flat = plano. Hace el array "plano".',
      explanation: 'flat() toma arrays anidados y los "aplana" en un solo nivel.',
      xp: 10
    },
    {
      type: 'predict_output',
      difficulty: 2,
      question: '¿Qué imprime?',
      code: 'const arr = [1, [2, 3], [4, [5, 6]]]\nconsole.log(arr.flat())',
      correct: '[1, 2, 3, 4, [5, 6]]',
      acceptableAnswers: ['[1,2,3,4,[5,6]]', '[1, 2, 3, 4, [5, 6]]'],
      hint: 'flat() sin argumentos aplana UN nivel.',
      explanation: 'flat() aplana solo 1 nivel por defecto. [5,6] sigue anidado porque estaba a 2 niveles.',
      xp: 20
    },
    {
      type: 'complete_code',
      difficulty: 2,
      question: 'Aplana completamente el array:',
      code: 'const arr = [1, [2, [3, [4]]]]\nconst plano = arr.flat(____)',
      blank: '____',
      correct: 'Infinity',
      hint: 'Necesitas aplanar TODOS los niveles. ¿Qué valor es "infinito"?',
      explanation: 'flat(Infinity) aplana todos los niveles de anidación: [1, 2, 3, 4].',
      xp: 20
    },
    {
      type: 'detect_error',
      difficulty: 3,
      question: '¿Qué está mal aquí?',
      code: 'const frases = ["hola mundo", "chau gente"]\nconst palabras = frases.flat()\nconsole.log(palabras)\n// Espera: ["hola", "mundo", "chau", "gente"]',
      errorLine: 1,
      correct: 1,
      hint: 'flat aplana arrays. ¿Los strings son arrays?',
      explanation: 'flat() aplana ARRAYS anidados, no separa strings. Para separar palabras: frases.flatMap(f => f.split(" ")).',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 3,
      question: '¿Qué es flatMap() equivalente a?',
      options: [
        'map() seguido de flat(1)',
        'flat() seguido de map()',
        'filter() + map()',
        'reduce() + flat()'
      ],
      correct: 0,
      hint: 'flat + Map = primero mapea, luego aplana.',
      explanation: 'flatMap() es equivalente a arr.map(...).flat(1). Mapea y luego aplana 1 nivel.',
      xp: 20
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué resultado da?',
      code: 'const arr = [1, 2, 3]\nconst result = arr.flatMap(n => [n, n * 2])\nconsole.log(result)',
      correct: '[1, 2, 2, 4, 3, 6]',
      acceptableAnswers: ['[1,2,2,4,3,6]', '[1, 2, 2, 4, 3, 6]', '1,2,2,4,3,6'],
      hint: 'Cada número se convierte en [n, n*2], y luego se aplana.',
      explanation: 'map da [[1,2],[2,4],[3,6]], flat(1) lo aplana a [1,2,2,4,3,6].',
      xp: 25
    },
    {
      type: 'complete_code',
      difficulty: 3,
      question: 'Separa cada frase en palabras usando flatMap:',
      code: 'const frases = ["hola mundo", "chau gente"]\nconst palabras = frases.____(f => f.split(" "))',
      blank: '____',
      correct: 'flatMap',
      hint: 'map + split daría arrays anidados. Necesitas aplanar a la vez.',
      explanation: 'flatMap mapea cada frase a un array de palabras y aplana: ["hola","mundo","chau","gente"].',
      xp: 20
    },
    {
      type: 'order_steps',
      difficulty: 3,
      question: 'Ordena para aplanar y filtrar en un solo paso:',
      steps: [
        'const data = [[1, 2], [3, 4], [5, 6]]',
        'const result = data.flat()',
        'const pares = result.filter(n => n % 2 === 0)',
        'console.log(pares) // [2, 4, 6]'
      ],
      correctOrder: [0, 1, 2, 3],
      hint: 'Primero aplana, luego filtra.',
      explanation: 'flat() da [1,2,3,4,5,6], filter mantiene pares: [2,4,6].',
      xp: 25
    },
    {
      type: 'predict_output',
      difficulty: 3,
      question: '¿Qué imprime?',
      code: 'const arr = [1, 2, , 4, , 5]\nconsole.log(arr.flat())',
      correct: '[1, 2, 4, 5]',
      acceptableAnswers: ['[1,2,4,5]', '[1, 2, 4, 5]', '1,2,4,5'],
      hint: 'flat() tiene un efecto secundario útil con huecos.',
      explanation: 'flat() también elimina "huecos" (empty slots) del array. Las posiciones vacías desaparecen.',
      xp: 25
    },
    {
      type: 'multiple_choice',
      difficulty: 2,
      question: '¿flat() modifica el array original?',
      options: [
        'No, devuelve un nuevo array',
        'Sí, modifica el original',
        'Depende del nivel',
        'Solo con Infinity'
      ],
      correct: 0,
      hint: 'flat es inmutable como map y filter.',
      explanation: 'flat() es inmutable. Siempre devuelve un nuevo array sin modificar el original.',
      xp: 10
    }
  ]
};

// Función para obtener preguntas de una misión con mezcla aleatoria
export function getQuestionsForMission(missionId, count = 10) {
  const questions = questionBank[missionId];
  if (!questions) return [];
  
  // Shuffle y tomar 'count' preguntas
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Función para obtener preguntas por dificultad
export function getQuestionsByDifficulty(missionId, difficulty) {
  const questions = questionBank[missionId];
  if (!questions) return [];
  return questions.filter(q => q.difficulty <= difficulty);
}
