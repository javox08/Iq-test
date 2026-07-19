/*
 * Banco de tests ("base de datos" de preguntas).
 * Cada test tiene un banco (pool) mucho más grande que el número de preguntas que
 * se muestran: en cada intento se barajan y se eligen `pick` preguntas, de modo que
 * el test va cambiando entre una vez y otra.
 *
 * Tipos:
 *   - 'quiz'  -> preguntas con una respuesta correcta (index `correct`) y `explanation`.
 *   - 'scale' -> afirmaciones tipo Likert que puntúan dimensiones psicológicas.
 *
 * Todos los tests son de carácter recreativo/orientativo, NO clínico.
 */
(function () {
  'use strict';

  const LIKERT_ACUERDO = [
    'Totalmente en desacuerdo',
    'En desacuerdo',
    'Neutral',
    'De acuerdo',
    'Totalmente de acuerdo'
  ];

  const LIKERT_FRECUENCIA = [
    'Nunca',
    'Casi nunca',
    'A veces',
    'A menudo',
    'Muy a menudo'
  ];

  const TESTS = {

    /* ================= TEST DE CI (quiz) ================= */
    iq: {
      id: 'iq',
      title: 'Coeficiente Intelectual',
      icon: '🧠',
      tag: 'Cognitivo',
      description: 'Lógica, matemáticas, patrones y razonamiento verbal. Incluye preguntas difíciles.',
      type: 'quiz',
      timeLimit: 720,
      pick: 25,
      scoring: 'iq',
      pool: [
        // ---- LÓGICA ----
        { category: 'Lógica', text: 'Completa la secuencia: 2, 4, 8, 16, ?', options: ['24', '30', '32', '20'], correct: 2, explanation: 'Cada número se multiplica por 2, así que sigue el 32.' },
        { category: 'Lógica', text: 'Todos los Bloops son Razzles. Todos los Razzles son Lazzles. ¿Todos los Bloops son necesariamente Lazzles?', options: ['Sí, siempre', 'No, nunca', 'Solo a veces', 'No hay información suficiente'], correct: 0, explanation: 'Por transitividad: si Bloops⊆Razzles y Razzles⊆Lazzles, entonces Bloops⊆Lazzles.' },
        { category: 'Lógica', text: 'Ana es más alta que Bruno. Carla es más baja que Bruno. ¿Quién es el más bajo de los tres?', options: ['Ana', 'Bruno', 'Carla', 'No se puede saber'], correct: 2, explanation: 'El orden es Carla < Bruno < Ana, así que Carla es la más baja.' },
        { category: 'Lógica', text: '¿Qué número no pertenece al grupo? 3, 5, 7, 10, 11', options: ['3', '7', '10', '11'], correct: 2, explanation: '3, 5, 7 y 11 son impares (y primos); 10 es el único par.' },
        { category: 'Lógica', text: 'Si hoy es miércoles, ¿qué día será dentro de 100 días?', options: ['Jueves', 'Viernes', 'Sábado', 'Domingo'], correct: 1, explanation: '100 ÷ 7 deja resto 2; dos días después del miércoles es viernes.' },
        { category: 'Lógica', text: 'Algunos gatos son negros y todos los negros son rápidos. ¿Qué es seguro?', options: ['Todos los gatos son rápidos', 'Algunos gatos son rápidos', 'Ningún gato es rápido', 'Todos los rápidos son gatos'], correct: 1, explanation: 'Solo se sabe que los gatos negros son rápidos, luego "algunos gatos son rápidos".' },
        { category: 'Lógica', text: 'Un reloj marca las 3:15. ¿Qué ángulo forman las agujas (aprox.)?', options: ['0°', '7,5°', '30°', '45°'], correct: 1, explanation: 'A las 3:15 el minutero está en el 3 y la aguja horaria un cuarto pasada: se separan 7,5°.' },
        { category: 'Lógica', text: 'Guante es a mano como zapato es a...', options: ['Calcetín', 'Pie', 'Suela', 'Cordón'], correct: 1, explanation: 'El guante cubre la mano igual que el zapato cubre el pie.' },
        { category: 'Lógica', text: 'Si todos los A son B y ningún B es C, ¿qué es cierto?', options: ['Todos los A son C', 'Ningún A es C', 'Algún A es C', 'No se puede saber'], correct: 1, explanation: 'Si A está dentro de B y B no toca a C, entonces A tampoco toca a C.' },
        { category: 'Lógica', text: 'En una carrera adelantas al que va segundo. ¿En qué posición vas ahora?', options: ['Primero', 'Segundo', 'Tercero', 'Último'], correct: 1, explanation: 'Al adelantar al segundo ocupas su lugar: quedas segundo, no primero.' },
        { category: 'Lógica', text: 'El padre de Ana tiene cinco hijas: Lala, Lele, Lili, Lolo y... ¿cómo se llama la quinta?', options: ['Lulu', 'Ana', 'Lala', 'No se sabe'], correct: 1, explanation: 'El enunciado empieza "El padre de Ana...": la quinta hija es Ana.' },
        { category: 'Lógica', text: 'Un caracol sube 3 m de día y resbala 2 m de noche en un pozo de 5 m. ¿En cuántos días sale?', options: ['3 días', '4 días', '5 días', '6 días'], correct: 0, explanation: 'Cada día neto sube 1 m, pero el tercer día trepa 3 m desde los 2 m y alcanza los 5 m.' },
        { category: 'Lógica', text: 'Antonio es mayor que Bruno pero menor que Carlos. ¿Quién es el mayor?', options: ['Antonio', 'Bruno', 'Carlos', 'Iguales'], correct: 2, explanation: 'Carlos es mayor que Antonio, que a su vez es mayor que Bruno: Carlos es el mayor.' },

        // ---- MATEMÁTICAS ----
        { category: 'Matemáticas', text: '¿Cuánto es 15 × 3 − 8?', options: ['31', '37', '45', '52'], correct: 1, explanation: 'Primero 15 × 3 = 45; luego 45 − 8 = 37.' },
        { category: 'Matemáticas', text: 'Completa la serie de Fibonacci: 1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13', '14'], correct: 2, explanation: 'Cada término es la suma de los dos anteriores: 5 + 8 = 13.' },
        { category: 'Matemáticas', text: 'Una camiseta cuesta 80€ tras un descuento del 20%. ¿Cuál era el precio original?', options: ['90€', '96€', '100€', '110€'], correct: 2, explanation: '80 € es el 80% del original: 80 ÷ 0,8 = 100 €.' },
        { category: 'Matemáticas', text: '¿Cuánto es 7² − 6²?', options: ['1', '7', '13', '49'], correct: 2, explanation: '49 − 36 = 13.' },
        { category: 'Matemáticas', text: 'Un tren recorre 60 km en 45 minutos. ¿Cuál es su velocidad en km/h?', options: ['60 km/h', '75 km/h', '80 km/h', '90 km/h'], correct: 2, explanation: '45 min = 0,75 h; 60 ÷ 0,75 = 80 km/h.' },
        { category: 'Matemáticas', text: 'Si 3 obreros construyen un muro en 6 horas, ¿cuánto tardarán 6 obreros al mismo ritmo?', options: ['2 horas', '3 horas', '4 horas', '12 horas'], correct: 1, explanation: 'Al doblar los obreros, el tiempo se reduce a la mitad: 3 horas.' },
        { category: 'Matemáticas', text: '¿Cuál es el 25% de 240?', options: ['48', '60', '72', '80'], correct: 1, explanation: '240 ÷ 4 = 60.' },
        { category: 'Matemáticas', text: 'Serie: 100, 50, 25, 12,5, ?', options: ['6', '6,25', '8', '5'], correct: 1, explanation: 'Cada término es la mitad del anterior: 12,5 ÷ 2 = 6,25.' },
        { category: 'Matemáticas', text: '¿Cuánto es la mitad de 2 elevado a 10?', options: ['256', '512', '1024', '500'], correct: 1, explanation: '2¹⁰ = 1024; su mitad es 512.' },
        { category: 'Matemáticas', text: 'Un producto sube un 10% y luego baja un 10%. ¿Cómo queda respecto al precio inicial?', options: ['Igual', '1% menos', '1% más', '10% menos'], correct: 1, explanation: '1,1 × 0,9 = 0,99: queda un 1% por debajo del precio inicial.' },
        { category: 'Matemáticas', text: 'Si 5 máquinas hacen 5 piezas en 5 minutos, ¿cuánto tardan 100 máquinas en hacer 100 piezas?', options: ['5 minutos', '100 minutos', '20 minutos', '1 minuto'], correct: 0, explanation: 'Cada máquina tarda 5 min por pieza; 100 máquinas hacen 100 piezas también en 5 minutos.' },
        { category: 'Matemáticas', text: 'La suma de tres números consecutivos es 72. ¿Cuál es el mayor?', options: ['24', '25', '23', '26'], correct: 1, explanation: '3n = 72 → n = 24; los números son 23, 24 y 25, así que el mayor es 25.' },
        { category: 'Matemáticas', text: 'Un reloj se atrasa 5 minutos cada hora. Tras 12 horas, ¿cuánto se ha atrasado?', options: ['30 min', '45 min', '60 min', '12 min'], correct: 2, explanation: '5 min × 12 h = 60 minutos de atraso.' },

        // ---- PATRONES ----
        { category: 'Patrones', text: 'Completa la secuencia de letras: A, C, E, G, ?', options: ['H', 'I', 'J', 'F'], correct: 1, explanation: 'Se avanza saltando una letra: A, C, E, G, I.' },
        { category: 'Patrones', text: 'Completa la serie numérica: 2, 6, 12, 20, 30, ?', options: ['36', '40', '42', '44'], correct: 2, explanation: 'Las diferencias crecen 4, 6, 8, 10, 12: 30 + 12 = 42.' },
        { category: 'Patrones', text: 'Sigue el patrón: Círculo, Cuadrado, Triángulo, Círculo, Cuadrado, ?', options: ['Círculo', 'Cuadrado', 'Triángulo', 'Rombo'], correct: 2, explanation: 'El ciclo de tres figuras se repite; toca el triángulo.' },
        { category: 'Patrones', text: 'Completa la secuencia: 1, 4, 9, 16, 25, ?', options: ['30', '32', '36', '49'], correct: 2, explanation: 'Son cuadrados: 1², 2², 3², 4², 5² y 6² = 36.' },
        { category: 'Patrones', text: 'Completa la secuencia de letras: Z, Y, X, W, ?', options: ['U', 'V', 'T', 'S'], correct: 1, explanation: 'El abecedario va hacia atrás: X, W, V.' },
        { category: 'Patrones', text: 'Serie: 3, 6, 5, 10, 9, 18, ?', options: ['16', '17', '20', '27'], correct: 1, explanation: 'Se alterna ×2 y −1: tras 18 viene 18 − 1 = 17.' },
        { category: 'Patrones', text: '¿Qué número sigue? 1, 2, 4, 7, 11, ?', options: ['14', '15', '16', '18'], correct: 2, explanation: 'Se suma 1, 2, 3, 4, 5: 11 + 5 = 16.' },
        { category: 'Patrones', text: 'Completa: AZ, BY, CX, ?', options: ['DV', 'DW', 'EW', 'DX'], correct: 1, explanation: 'La primera letra avanza (A, B, C, D) y la segunda retrocede (Z, Y, X, W).' },
        { category: 'Patrones', text: 'Completa la serie: 2, 3, 5, 7, 11, ?', options: ['12', '13', '14', '15'], correct: 1, explanation: 'Es la serie de números primos: el siguiente es 13.' },
        { category: 'Patrones', text: 'Completa la serie: 1, 8, 27, 64, ?', options: ['100', '125', '81', '216'], correct: 1, explanation: 'Son cubos: 1³, 2³, 3³, 4³ y 5³ = 125.' },
        { category: 'Patrones', text: 'Completa la serie: 100, 96, 88, 76, 60, ?', options: ['40', '44', '48', '36'], correct: 0, explanation: 'Se resta 4, 8, 12, 16, 20: 60 − 20 = 40.' },
        { category: 'Patrones', text: 'Completa la serie: 3, 9, 27, 81, ?', options: ['162', '243', '216', '324'], correct: 1, explanation: 'Cada término se multiplica por 3: 81 × 3 = 243.' },
        { category: 'Patrones', text: 'Serie difícil: 1, 4, 27, 256, ?', options: ['625', '3125', '1024', '512'], correct: 1, explanation: 'El patrón es n elevado a n: 1¹, 2², 3³, 4⁴ y 5⁵ = 3125.' },

        // ---- VERBAL ----
        { category: 'Verbal', text: 'Perro es a Cachorro como Gato es a...', options: ['Felino', 'Gatito', 'Maullido', 'Ratón'], correct: 1, explanation: 'El gatito es la cría del gato, como el cachorro lo es del perro.' },
        { category: 'Verbal', text: '¿Cuál es el antónimo de "efímero"?', options: ['Fugaz', 'Breve', 'Duradero', 'Instantáneo'], correct: 2, explanation: 'Efímero significa breve; su contrario es duradero.' },
        { category: 'Verbal', text: 'Libro es a Leer como Comida es a...', options: ['Cocinar', 'Comer', 'Cortar', 'Servir'], correct: 1, explanation: 'La acción propia de la comida es comerla, como la del libro es leerlo.' },
        { category: 'Verbal', text: '¿Cuál es el sinónimo de "locuaz"?', options: ['Callado', 'Tímido', 'Hablador', 'Sereno'], correct: 2, explanation: 'Locuaz significa que habla mucho: hablador.' },
        { category: 'Verbal', text: 'Médico es a Hospital como Profesor es a...', options: ['Libro', 'Escuela', 'Alumno', 'Pizarra'], correct: 1, explanation: 'El profesor trabaja en la escuela como el médico en el hospital.' },
        { category: 'Verbal', text: '¿Qué palabra no encaja con las demás?', options: ['Rosa', 'Tulipán', 'Roble', 'Margarita'], correct: 2, explanation: 'Rosa, tulipán y margarita son flores; el roble es un árbol.' },
        { category: 'Verbal', text: '¿Cuál es el antónimo de "prudente"?', options: ['Cauto', 'Sensato', 'Temerario', 'Discreto'], correct: 2, explanation: 'Prudente es cauteloso; lo opuesto es temerario.' },
        { category: 'Verbal', text: 'Pintor es a Pincel como Escritor es a...', options: ['Papel', 'Pluma', 'Novela', 'Idea'], correct: 1, explanation: 'La herramienta del escritor es la pluma, como el pincel lo es del pintor.' },
        { category: 'Verbal', text: '¿Cuál es el antónimo de "generoso"?', options: ['Amable', 'Tacaño', 'Dadivoso', 'Espléndido'], correct: 1, explanation: 'Generoso es dar con facilidad; su contrario es tacaño.' },
        { category: 'Verbal', text: 'Cachorro es a Perro como Potro es a...', options: ['Vaca', 'Caballo', 'Oveja', 'Cerdo'], correct: 1, explanation: 'El potro es la cría del caballo, como el cachorro lo es del perro.' },
        { category: 'Verbal', text: '¿Cuál es el sinónimo de "meticuloso"?', options: ['Descuidado', 'Minucioso', 'Rápido', 'Torpe'], correct: 1, explanation: 'Meticuloso significa que cuida los detalles: minucioso.' },
        { category: 'Verbal', text: '¿Qué palabra no pertenece al grupo?', options: ['Alegre', 'Contento', 'Triste', 'Dichoso'], correct: 2, explanation: 'Alegre, contento y dichoso expresan felicidad; triste es lo contrario.' },
        { category: 'Verbal', text: 'Reloj es a Tiempo como Termómetro es a...', options: ['Calor', 'Temperatura', 'Fiebre', 'Grados'], correct: 1, explanation: 'El termómetro mide la temperatura, como el reloj mide el tiempo.' }
      ]
    },

    /* ============ PERSONALIDAD BIG FIVE (scale) ============ */
    bigfive: {
      id: 'bigfive',
      title: 'Personalidad (Big Five)',
      icon: '🎭',
      tag: 'Personalidad',
      description: 'Los 5 grandes rasgos: apertura, responsabilidad, extraversión, amabilidad y estabilidad.',
      type: 'scale',
      timeLimit: 480,
      pick: 25,
      likert: LIKERT_ACUERDO,
      dimensions: {
        O: 'Apertura',
        C: 'Responsabilidad',
        E: 'Extraversión',
        A: 'Amabilidad',
        S: 'Estabilidad emocional'
      },
      pool: [
        { text: 'Disfruto explorando ideas nuevas y abstractas.', dim: 'O' },
        { text: 'Tengo una imaginación muy activa.', dim: 'O' },
        { text: 'Me atraen las experiencias artísticas y creativas.', dim: 'O' },
        { text: 'Prefiero la rutina antes que la novedad.', dim: 'O', reverse: true },
        { text: 'Rara vez pienso en conceptos filosóficos o teóricos.', dim: 'O', reverse: true },
        { text: 'Me gusta probar comidas y actividades que no conozco.', dim: 'O' },
        { text: 'Soy organizado/a y mantengo mis cosas en orden.', dim: 'C' },
        { text: 'Cumplo con mis tareas a tiempo.', dim: 'C' },
        { text: 'Presto atención a los detalles.', dim: 'C' },
        { text: 'A menudo dejo las cosas para el último momento.', dim: 'C', reverse: true },
        { text: 'Me cuesta mantener la disciplina con mis objetivos.', dim: 'C', reverse: true },
        { text: 'Planifico las cosas antes de actuar.', dim: 'C' },
        { text: 'Me siento con energía cuando estoy rodeado/a de gente.', dim: 'E' },
        { text: 'Me resulta fácil iniciar conversaciones con desconocidos.', dim: 'E' },
        { text: 'Prefiero pasar tiempo a solas antes que en grupos grandes.', dim: 'E', reverse: true },
        { text: 'Suelo tomar la iniciativa en situaciones sociales.', dim: 'E' },
        { text: 'En una fiesta prefiero escuchar antes que ser el centro de atención.', dim: 'E', reverse: true },
        { text: 'Disfruto conociendo gente nueva.', dim: 'E' },
        { text: 'Me preocupo sinceramente por el bienestar de los demás.', dim: 'A' },
        { text: 'Confío en las buenas intenciones de la gente.', dim: 'A' },
        { text: 'Tiendo a ser crítico/a y poco tolerante con los demás.', dim: 'A', reverse: true },
        { text: 'Me resulta fácil perdonar.', dim: 'A' },
        { text: 'Antepongo mis intereses a los de los demás.', dim: 'A', reverse: true },
        { text: 'Ayudo a los demás sin esperar nada a cambio.', dim: 'A' },
        { text: 'Me preocupo con facilidad por muchas cosas.', dim: 'S', reverse: true },
        { text: 'Suelo mantener la calma bajo presión.', dim: 'S' },
        { text: 'Mis emociones cambian con frecuencia.', dim: 'S', reverse: true },
        { text: 'Rara vez me siento triste o desanimado/a.', dim: 'S' },
        { text: 'Me estreso con facilidad.', dim: 'S', reverse: true },
        { text: 'Me recupero rápido de los contratiempos.', dim: 'S' }
      ]
    },

    /* ========== INTELIGENCIA EMOCIONAL (scale) ========== */
    eq: {
      id: 'eq',
      title: 'Inteligencia Emocional',
      icon: '💗',
      tag: 'Emocional',
      description: 'Autoconciencia, autorregulación, motivación, empatía y habilidades sociales.',
      type: 'scale',
      timeLimit: 420,
      pick: 20,
      likert: LIKERT_ACUERDO,
      dimensions: {
        AC: 'Autoconciencia',
        AR: 'Autorregulación',
        MO: 'Motivación',
        EM: 'Empatía',
        HS: 'Habilidades sociales'
      },
      pool: [
        { text: 'Reconozco mis emociones en el momento en que las siento.', dim: 'AC' },
        { text: 'Sé identificar qué situaciones me alteran.', dim: 'AC' },
        { text: 'Me cuesta entender por qué reacciono como lo hago.', dim: 'AC', reverse: true },
        { text: 'Soy consciente de cómo mi estado de ánimo afecta a mi comportamiento.', dim: 'AC' },
        { text: 'Consigo calmarme cuando estoy enfadado/a.', dim: 'AR' },
        { text: 'Pienso antes de actuar cuando siento una emoción intensa.', dim: 'AR' },
        { text: 'Pierdo el control con facilidad.', dim: 'AR', reverse: true },
        { text: 'Puedo posponer una recompensa para lograr un objetivo mayor.', dim: 'AR' },
        { text: 'Me mantengo optimista incluso ante las dificultades.', dim: 'MO' },
        { text: 'Persisto en mis metas aunque encuentre obstáculos.', dim: 'MO' },
        { text: 'Me desanimo con facilidad cuando algo sale mal.', dim: 'MO', reverse: true },
        { text: 'Disfruto superándome a mí mismo/a.', dim: 'MO' },
        { text: 'Percibo cómo se sienten los demás aunque no lo digan.', dim: 'EM' },
        { text: 'Me pongo con facilidad en el lugar de otra persona.', dim: 'EM' },
        { text: 'Me cuesta entender los sentimientos ajenos.', dim: 'EM', reverse: true },
        { text: 'Me doy cuenta cuando alguien necesita apoyo.', dim: 'EM' },
        { text: 'Se me da bien resolver conflictos entre personas.', dim: 'HS' },
        { text: 'Comunico mis ideas de forma clara y convincente.', dim: 'HS' },
        { text: 'Me resulta difícil trabajar en equipo.', dim: 'HS', reverse: true },
        { text: 'Construyo y mantengo relaciones con facilidad.', dim: 'HS' }
      ]
    },

    /* ========== ESTILO DE APRENDIZAJE VARK (scale) ========== */
    vark: {
      id: 'vark',
      title: 'Estilo de Aprendizaje',
      icon: '📚',
      tag: 'Aprendizaje',
      description: '¿Aprendes mejor viendo, escuchando, leyendo o haciendo? (modelo VARK)',
      type: 'scale',
      timeLimit: 300,
      pick: 12,
      likert: LIKERT_ACUERDO,
      dimensions: {
        V: 'Visual',
        A: 'Auditivo',
        L: 'Lectura/Escritura',
        K: 'Kinestésico'
      },
      pool: [
        { text: 'Aprendo mejor con diagramas, gráficos y mapas.', dim: 'V' },
        { text: 'Recuerdo mejor la información cuando la veo en esquemas o colores.', dim: 'V' },
        { text: 'Me ayuda visualizar las cosas en mi mente.', dim: 'V' },
        { text: 'Aprendo mejor escuchando explicaciones.', dim: 'A' },
        { text: 'Recuerdo lo que oigo mejor que lo que leo.', dim: 'A' },
        { text: 'Me ayuda repetir la información en voz alta.', dim: 'A' },
        { text: 'Aprendo mejor leyendo textos y tomando notas.', dim: 'L' },
        { text: 'Prefiero instrucciones escritas antes que habladas.', dim: 'L' },
        { text: 'Hacer listas y resúmenes me ayuda a estudiar.', dim: 'L' },
        { text: 'Aprendo mejor haciendo y practicando.', dim: 'K' },
        { text: 'Me cuesta estar quieto/a mucho rato mientras estudio.', dim: 'K' },
        { text: 'Recuerdo mejor lo que hago con las manos.', dim: 'K' }
      ]
    },

    /* ======= GESTIÓN DEL ESTRÉS Y BIENESTAR (scale) ======= */
    estres: {
      id: 'estres',
      title: 'Estrés y Bienestar',
      icon: '🧘',
      tag: 'Bienestar',
      description: 'Cómo has percibido tu estrés y control durante el último mes.',
      type: 'scale',
      timeLimit: 300,
      pick: 10,
      likert: LIKERT_FRECUENCIA,
      invertHeadline: true,
      disclaimer: 'Este cuestionario es una autorreflexión orientativa, NO un diagnóstico. Si te sientes desbordado/a, hablar con un profesional de la salud o alguien de confianza puede ayudarte mucho.',
      dimensions: {
        ES: 'Nivel de estrés percibido'
      },
      pool: [
        { text: 'Me he sentido nervioso/a o estresado/a.', dim: 'ES' },
        { text: 'He sentido que no podía controlar las cosas importantes de mi vida.', dim: 'ES' },
        { text: 'Me he sentido capaz de manejar mis problemas personales.', dim: 'ES', reverse: true },
        { text: 'He sentido que las cosas me iban bien.', dim: 'ES', reverse: true },
        { text: 'Me he sentido incapaz de afrontar todo lo que tenía que hacer.', dim: 'ES' },
        { text: 'He podido controlar las dificultades de mi vida.', dim: 'ES', reverse: true },
        { text: 'He sentido que tenía las cosas bajo control.', dim: 'ES', reverse: true },
        { text: 'Me he sentido irritado/a por cosas fuera de mi control.', dim: 'ES' },
        { text: 'He sentido que las dificultades se acumulaban demasiado.', dim: 'ES' },
        { text: 'He dormido bien y me he sentido descansado/a.', dim: 'ES', reverse: true }
      ]
    },

    /* ========== ATENCIÓN Y CONCENTRACIÓN (quiz) ========== */
    atencion: {
      id: 'atencion',
      title: 'Atención y Concentración',
      icon: '🎯',
      tag: 'Cognitivo',
      description: 'Preguntas rápidas de foco, detalle y velocidad. ¡Contrarreloj!',
      type: 'quiz',
      timeLimit: 240,
      pick: 10,
      scoring: 'percent',
      pool: [
        { category: 'Atención', text: '¿Cuántas veces aparece la letra «a» en: «Ana canta una canción»?', options: ['4', '5', '6', '7'], correct: 2, explanation: 'Ana(2) + canta(2) + una(1) + canción(1) = 6.' },
        { category: 'Atención', text: '¿Cuál no encaja? 121, 144, 169, 150, 196', options: ['121', '150', '169', '196'], correct: 1, explanation: '121, 144, 169 y 196 son cuadrados perfectos; 150 no lo es.' },
        { category: 'Atención', text: '¿Cuántos «7» hay en la serie? 7 1 7 4 7 9 2 7 5 7', options: ['4', '5', '6', '3'], correct: 1, explanation: 'Aparece cinco veces (posiciones 1, 3, 5, 8 y 10).' },
        { category: 'Atención', text: 'Si la palabra ROJO está escrita en tinta azul, ¿de qué color es la tinta?', options: ['Rojo', 'Azul', 'Verde', 'Negro'], correct: 1, explanation: 'La pregunta es por el color de la tinta, que es azul.' },
        { category: 'Atención', text: '¿Cuál es el siguiente? 3, 6, 9, 12, ?', options: ['13', '14', '15', '18'], correct: 2, explanation: 'Van de 3 en 3: sigue el 15.' },
        { category: 'Atención', text: '¿Cuál de estas palabras está escrita incorrectamente?', options: ['Aeropuerto', 'Aereopuerto', 'Almohada', 'Zanahoria'], correct: 1, explanation: 'Se escribe "aeropuerto", sin la segunda "e".' },
        { category: 'Atención', text: 'En la secuencia B, D, F, H, ¿qué letra sigue?', options: ['I', 'J', 'K', 'G'], correct: 1, explanation: 'Se salta una letra cada vez: sigue la J.' },
        { category: 'Atención', text: '¿Cuántas vocales tiene la palabra «MURCIÉLAGO»?', options: ['4', '5', '6', '3'], correct: 1, explanation: 'u, i, é, a, o: cinco vocales.' },
        { category: 'Atención', text: 'Rápido: 8 × 7 = ?', options: ['54', '56', '63', '48'], correct: 1, explanation: '8 × 7 = 56.' },
        { category: 'Atención', text: '¿Qué número falta? 2, 4, __, 8, 10', options: ['5', '6', '7', '3'], correct: 1, explanation: 'Van de 2 en 2: falta el 6.' },
        { category: 'Atención', text: '¿Cuál es el mayor? 0,7 · 0,68 · 0,702 · 0,79', options: ['0,7', '0,68', '0,702', '0,79'], correct: 3, explanation: '0,79 es el mayor de los cuatro.' },
        { category: 'Atención', text: 'Lee con atención: «Todos menos Juan aprobaron». ¿Quién NO aprobó?', options: ['Todos', 'Juan', 'Nadie', 'No se sabe'], correct: 1, explanation: '"Todos menos Juan" indica que Juan es el único que no aprobó.' },
        { category: 'Atención', text: '¿Cuántas letras «e» hay en «excelente experiencia»?', options: ['6', '7', '8', '5'], correct: 1, explanation: 'excelente(4) + experiencia(3) = 7.' },
        { category: 'Atención', text: 'Serie: 1, 2, 4, 7, 11, ?', options: ['14', '15', '16', '18'], correct: 2, explanation: 'Se suma 1, 2, 3, 4, 5: 11 + 5 = 16.' },
        { category: 'Atención', text: '¿Cuál es distinto? gato, perro, león, mesa, caballo', options: ['gato', 'león', 'mesa', 'caballo'], correct: 2, explanation: 'Todos son animales excepto la mesa.' }
      ]
    }

  };

  // Orden en que se muestran en la portada (el CI va primero).
  const TEST_ORDER = ['iq', 'bigfive', 'eq', 'vark', 'estres', 'atencion'];

  window.APP_DATA = { TESTS, TEST_ORDER };
})();
