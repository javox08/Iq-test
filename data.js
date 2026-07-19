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
      pick: 10,
      likert: LIKERT_FRECUENCIA,
      single: true,
      highIsGood: false,
      headlineLabel: 'Nivel de estrés percibido',
      disclaimer: 'Este cuestionario es una autorreflexión orientativa, NO un diagnóstico. Si te sientes desbordado/a, hablar con un profesional de la salud o alguien de confianza puede ayudarte mucho.',
      tierLabels: { alto: 'Estrés alto', medio: 'Estrés moderado', bajo: 'Estrés bajo' },
      levelMessages: {
        alto: 'Tu nivel de estrés percibido es alto. Cuidarte, descansar y, si lo necesitas, hablar con un profesional o alguien de confianza puede marcar la diferencia.',
        medio: 'Tienes un nivel de estrés moderado. Buenos hábitos de sueño, ejercicio y pausas pueden ayudarte a mantenerlo a raya.',
        bajo: '¡Buen trabajo! Percibes un nivel de estrés bajo y sensación de control sobre tu vida.'
      },
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
      scoreLabel: 'Puntuación de concentración',
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
    },

    /* ========== RAZONAMIENTO NUMÉRICO (quiz) ========== */
    numerico: {
      id: 'numerico',
      title: 'Razonamiento Numérico',
      icon: '🔢',
      tag: 'Cognitivo',
      description: 'Series, cálculo y lógica con números.',
      type: 'quiz',
      timeLimit: 480,
      pick: 12,
      scoring: 'percent',
      scoreLabel: 'Puntuación numérica',
      pool: [
        { category: 'Numérico', text: '¿Qué número sigue? 3, 6, 9, 12, ?', options: ['13', '15', '18', '21'], correct: 1, explanation: 'Van de 3 en 3: sigue el 15.' },
        { category: 'Numérico', text: 'Serie: 5, 10, 20, 40, ?', options: ['60', '70', '80', '100'], correct: 2, explanation: 'Cada término se multiplica por 2: 40 × 2 = 80.' },
        { category: 'Numérico', text: '¿Cuánto es 12 × 12?', options: ['124', '132', '144', '154'], correct: 2, explanation: '12 × 12 = 144.' },
        { category: 'Numérico', text: 'Si un lápiz cuesta 0,50 €, ¿cuánto cuestan 6?', options: ['2,50 €', '3 €', '3,50 €', '6 €'], correct: 1, explanation: '0,50 × 6 = 3 €.' },
        { category: 'Numérico', text: '¿Cuál es par y múltiplo de 5? 12, 15, 20, 27', options: ['12', '15', '20', '27'], correct: 2, explanation: '20 es par y acaba en 0, así que es múltiplo de 5.' },
        { category: 'Numérico', text: '1000 ÷ 8 = ?', options: ['120', '125', '128', '150'], correct: 1, explanation: '1000 ÷ 8 = 125.' },
        { category: 'Numérico', text: 'Serie: 2, 4, 8, 16, 32, ?', options: ['48', '56', '64', '72'], correct: 2, explanation: 'Se duplica cada vez: 32 × 2 = 64.' },
        { category: 'Numérico', text: '¿Cuánto es el 10% de 350?', options: ['30', '35', '40', '45'], correct: 1, explanation: '350 ÷ 10 = 35.' },
        { category: 'Numérico', text: 'Serie: 7, 14, 28, 56, ?', options: ['96', '102', '112', '128'], correct: 2, explanation: 'Se multiplica por 2: 56 × 2 = 112.' },
        { category: 'Numérico', text: 'Si 4 kg de manzanas cuestan 8 €, ¿cuánto cuesta 1 kg?', options: ['1 €', '2 €', '3 €', '4 €'], correct: 1, explanation: '8 € ÷ 4 kg = 2 € por kilo.' },
        { category: 'Numérico', text: 'Serie: 1, 3, 6, 10, 15, ?', options: ['18', '20', '21', '25'], correct: 2, explanation: 'Se suma 2, 3, 4, 5, 6: 15 + 6 = 21.' },
        { category: 'Numérico', text: '¿Cuánto es 9²?', options: ['72', '81', '90', '99'], correct: 1, explanation: '9 × 9 = 81.' },
        { category: 'Numérico', text: '¿Cuántos minutos hay en 2,5 horas?', options: ['120', '140', '150', '160'], correct: 2, explanation: '2,5 × 60 = 150 minutos.' },
        { category: 'Numérico', text: 'Serie: 81, 27, 9, 3, ?', options: ['0', '1', '2', '3'], correct: 1, explanation: 'Se divide entre 3: 3 ÷ 3 = 1.' },
        { category: 'Numérico', text: 'El doble de 45 más 10 = ?', options: ['90', '95', '100', '110'], correct: 2, explanation: '45 × 2 = 90; 90 + 10 = 100.' },
        { category: 'Numérico', text: '¿Qué número al cuadrado da 64?', options: ['6', '7', '8', '9'], correct: 2, explanation: '8 × 8 = 64.' },
        { category: 'Numérico', text: '¿Cuánto es 3/4 de 100?', options: ['65', '70', '75', '80'], correct: 2, explanation: '100 × 3 ÷ 4 = 75.' },
        { category: 'Numérico', text: 'Serie: 100, 90, 81, 73, ?', options: ['64', '66', '68', '70'], correct: 1, explanation: 'Se resta 10, 9, 8, 7: 73 − 7 = 66.' }
      ]
    },

    /* ========== RAZONAMIENTO LÓGICO (quiz) ========== */
    logico: {
      id: 'logico',
      title: 'Razonamiento Lógico',
      icon: '🧩',
      tag: 'Cognitivo',
      description: 'Acertijos y deducciones. Piensa antes de responder.',
      type: 'quiz',
      timeLimit: 540,
      pick: 12,
      scoring: 'percent',
      scoreLabel: 'Puntuación lógica',
      pool: [
        { category: 'Lógico', text: 'Si A es mayor que B y B es mayor que C, ¿quién es el menor?', options: ['A', 'B', 'C', 'Iguales'], correct: 2, explanation: 'El orden es A > B > C, así que C es el menor.' },
        { category: 'Lógico', text: 'En un cajón a oscuras hay calcetines negros y blancos. ¿Cuántos sacas como mínimo para tener un par del mismo color?', options: ['2', '3', '4', '5'], correct: 1, explanation: 'Con 3 calcetines y solo 2 colores, al menos dos coinciden.' },
        { category: 'Lógico', text: 'Si mañana es domingo, ¿qué día fue ayer?', options: ['Jueves', 'Viernes', 'Sábado', 'Domingo'], correct: 1, explanation: 'Si mañana es domingo, hoy es sábado y ayer fue viernes.' },
        { category: 'Lógico', text: 'Un ladrillo pesa 1 kg más medio ladrillo. ¿Cuánto pesa el ladrillo?', options: ['1 kg', '1,5 kg', '2 kg', '3 kg'], correct: 2, explanation: 'L = 1 + L/2 → L/2 = 1 → L = 2 kg.' },
        { category: 'Lógico', text: 'Pedro tiene el doble de años que Ana. Juntos suman 30. ¿Cuántos tiene Ana?', options: ['8', '10', '12', '15'], correct: 1, explanation: 'Ana + 2·Ana = 30 → 3·Ana = 30 → Ana = 10.' },
        { category: 'Lógico', text: 'Si algunos X son Y y todos los Y son Z, ¿algunos X son Z?', options: ['Sí', 'No', 'Nunca', 'No se puede saber'], correct: 0, explanation: 'Los X que son Y también son Z, así que sí.' },
        { category: 'Lógico', text: '¿Cuál es el intruso? Manzana, Pera, Zanahoria, Plátano', options: ['Manzana', 'Pera', 'Zanahoria', 'Plátano'], correct: 2, explanation: 'Las demás son frutas; la zanahoria es una verdura.' },
        { category: 'Lógico', text: 'Si hoy es lunes, ¿qué día será pasado mañana?', options: ['Martes', 'Miércoles', 'Jueves', 'Domingo'], correct: 1, explanation: 'Pasado mañana son dos días: martes y miércoles.' },
        { category: 'Lógico', text: 'Tres gatos cazan 3 ratones en 3 minutos. ¿Cuánto tardan 100 gatos en cazar 100 ratones?', options: ['3 minutos', '100 minutos', '33 minutos', '1 minuto'], correct: 0, explanation: 'Cada gato caza 1 ratón en 3 min; 100 gatos cazan 100 ratones también en 3 min.' },
        { category: 'Lógico', text: '¿Cuántos meses del año tienen 28 días?', options: ['1', '2', '7', '12'], correct: 3, explanation: 'Todos los meses tienen al menos 28 días.' },
        { category: 'Lógico', text: 'Empiezas mirando al norte y giras 180°. ¿Hacia dónde miras?', options: ['Norte', 'Sur', 'Este', 'Oeste'], correct: 1, explanation: 'Media vuelta desde el norte te deja mirando al sur.' },
        { category: 'Lógico', text: 'Un granjero tiene 17 ovejas y todas menos 9 se escapan. ¿Cuántas quedan?', options: ['8', '9', '17', '0'], correct: 1, explanation: '"Todas menos 9" son las que quedan: 9.' },
        { category: 'Lógico', text: '¿Qué pesa más: un kilo de plomo o un kilo de plumas?', options: ['El plomo', 'Las plumas', 'Pesan igual', 'Depende'], correct: 2, explanation: 'Un kilo pesa un kilo, sea de lo que sea.' },
        { category: 'Lógico', text: 'Si todos los perros ladran y Toby ladra, ¿es Toby necesariamente un perro?', options: ['Sí, seguro', 'No necesariamente', 'Nunca', 'Imposible'], correct: 1, explanation: 'Que ladre no implica que sea perro: otros animales también pueden ladrar.' }
      ]
    },

    /* ========== CULTURA GENERAL (quiz) ========== */
    cultura: {
      id: 'cultura',
      title: 'Cultura General',
      icon: '🌍',
      tag: 'Conocimiento',
      description: 'Geografía, ciencia, historia y arte. ¿Cuánto sabes?',
      type: 'quiz',
      timeLimit: 480,
      pick: 15,
      scoring: 'percent',
      scoreLabel: 'Cultura general',
      pool: [
        { category: 'Geografía', text: '¿Cuál es la capital de Francia?', options: ['Madrid', 'París', 'Roma', 'Berlín'], correct: 1, explanation: 'La capital de Francia es París.' },
        { category: 'Ciencia', text: '¿Cuántos planetas tiene el sistema solar?', options: ['7', '8', '9', '10'], correct: 1, explanation: 'Desde 2006 son 8 (Plutón pasó a planeta enano).' },
        { category: 'Arte', text: '¿Quién pintó la Mona Lisa?', options: ['Picasso', 'Van Gogh', 'Leonardo da Vinci', 'Miguel Ángel'], correct: 2, explanation: 'La pintó Leonardo da Vinci.' },
        { category: 'Geografía', text: '¿Cuál es el océano más grande?', options: ['Atlántico', 'Índico', 'Pacífico', 'Ártico'], correct: 2, explanation: 'El océano Pacífico es el más extenso.' },
        { category: 'Geografía', text: '¿En qué continente está Egipto?', options: ['Asia', 'África', 'Europa', 'Oceanía'], correct: 1, explanation: 'Egipto está en el noreste de África.' },
        { category: 'Ciencia', text: '¿Qué metal es líquido a temperatura ambiente?', options: ['Hierro', 'Mercurio', 'Oro', 'Plomo'], correct: 1, explanation: 'El mercurio es líquido a temperatura ambiente.' },
        { category: 'Ciencia', text: '¿Cuántos lados tiene un hexágono?', options: ['5', '6', '7', '8'], correct: 1, explanation: 'Un hexágono tiene 6 lados.' },
        { category: 'Arte', text: '¿Quién escribió "Don Quijote de la Mancha"?', options: ['Lope de Vega', 'Cervantes', 'Quevedo', 'Góngora'], correct: 1, explanation: 'Lo escribió Miguel de Cervantes.' },
        { category: 'Ciencia', text: '¿Cuál es el planeta más cercano al Sol?', options: ['Mercurio', 'Venus', 'Tierra', 'Marte'], correct: 0, explanation: 'Mercurio es el planeta más próximo al Sol.' },
        { category: 'Ciencia', text: '¿Qué gas necesitamos respirar para vivir?', options: ['Nitrógeno', 'Oxígeno', 'Dióxido de carbono', 'Hidrógeno'], correct: 1, explanation: 'Necesitamos el oxígeno para vivir.' },
        { category: 'Geografía', text: '¿En qué país está la Torre Eiffel?', options: ['Italia', 'Francia', 'España', 'Reino Unido'], correct: 1, explanation: 'La Torre Eiffel está en París, Francia.' },
        { category: 'Ciencia', text: '¿Quién desarrolló la teoría de la relatividad?', options: ['Newton', 'Einstein', 'Galileo', 'Darwin'], correct: 1, explanation: 'Albert Einstein desarrolló la teoría de la relatividad.' },
        { category: 'Ciencia', text: '¿Cuál es el animal terrestre más grande?', options: ['Elefante', 'Rinoceronte', 'Jirafa', 'Hipopótamo'], correct: 0, explanation: 'El elefante africano es el mayor animal terrestre.' },
        { category: 'Historia', text: '¿En qué año llegó el ser humano a la Luna?', options: ['1959', '1969', '1979', '1985'], correct: 1, explanation: 'El Apolo 11 alunizó en 1969.' },
        { category: 'Ciencia', text: '¿Cuál es el hueso más largo del cuerpo humano?', options: ['Fémur', 'Tibia', 'Húmero', 'Radio'], correct: 0, explanation: 'El fémur, en el muslo, es el hueso más largo.' },
        { category: 'Arte', text: '¿Qué instrumento tiene 88 teclas?', options: ['Guitarra', 'Piano', 'Violín', 'Arpa'], correct: 1, explanation: 'El piano estándar tiene 88 teclas.' },
        { category: 'Geografía', text: '¿Cuál es la capital de Japón?', options: ['Pekín', 'Seúl', 'Tokio', 'Bangkok'], correct: 2, explanation: 'La capital de Japón es Tokio.' },
        { category: 'Ciencia', text: '¿Cuántas patas tiene una araña?', options: ['6', '8', '10', '12'], correct: 1, explanation: 'Las arañas tienen 8 patas.' },
        { category: 'Ciencia', text: '¿Qué órgano bombea la sangre?', options: ['Pulmón', 'Corazón', 'Hígado', 'Riñón'], correct: 1, explanation: 'El corazón bombea la sangre por el cuerpo.' },
        { category: 'Geografía', text: '¿Cuál es la moneda de Japón?', options: ['Yuan', 'Yen', 'Won', 'Rupia'], correct: 1, explanation: 'La moneda de Japón es el yen.' },
        { category: 'Historia', text: '¿Quién fue el primer presidente de Estados Unidos?', options: ['Lincoln', 'Washington', 'Jefferson', 'Roosevelt'], correct: 1, explanation: 'George Washington fue el primer presidente de EE. UU.' },
        { category: 'Ciencia', text: '¿Cuál es el símbolo químico del agua?', options: ['O2', 'CO2', 'H2O', 'NaCl'], correct: 2, explanation: 'El agua es H₂O: dos hidrógenos y un oxígeno.' }
      ]
    },

    /* ========== RESILIENCIA (scale, sin tiempo) ========== */
    resiliencia: {
      id: 'resiliencia',
      title: 'Resiliencia',
      icon: '🌱',
      tag: 'Bienestar',
      description: 'Tu capacidad de recuperarte y salir adelante tras los momentos difíciles.',
      type: 'scale',
      pick: 12,
      likert: LIKERT_ACUERDO,
      single: true,
      highIsGood: true,
      headlineLabel: 'Nivel de resiliencia',
      disclaimer: 'Esto es una autorreflexión orientativa sobre tus fortalezas, NO un diagnóstico ni una medida de trauma. Si estás pasando por algo duro, apoyarte en personas de confianza o en un profesional puede ayudarte mucho.',
      tierLabels: { alto: 'Muy resiliente', medio: 'Resiliencia media', bajo: 'Resiliencia en desarrollo' },
      levelMessages: {
        alto: 'Tienes una gran capacidad para recuperarte de las dificultades y salir fortalecido/a. ¡Sigue cuidando esa fortaleza!',
        medio: 'Tienes una base sólida de resiliencia. Cuidar tus hábitos y tu red de apoyo puede reforzarla aún más.',
        bajo: 'Ahora mismo los golpes te cuestan más de superar, y eso es humano. Apoyarte en los demás y pedir ayuda cuando lo necesites es un signo de fortaleza, no de debilidad.'
      },
      dimensions: { RES: 'Resiliencia' },
      pool: [
        { text: 'Suelo recuperarme rápido después de momentos difíciles.', dim: 'RES' },
        { text: 'Me cuesta superar los momentos duros.', dim: 'RES', reverse: true },
        { text: 'Afronto el estrés sin que me afecte demasiado tiempo.', dim: 'RES' },
        { text: 'Cuando algo malo pasa, tardo mucho en volver a la normalidad.', dim: 'RES', reverse: true },
        { text: 'Suelo salir fortalecido/a de las experiencias difíciles.', dim: 'RES' },
        { text: 'Los contratiempos me hunden con facilidad.', dim: 'RES', reverse: true },
        { text: 'Confío en mi capacidad para superar los problemas.', dim: 'RES' },
        { text: 'Me adapto bien a los cambios inesperados.', dim: 'RES' },
        { text: 'Pido ayuda cuando la necesito.', dim: 'RES' },
        { text: 'Mantengo la esperanza incluso en situaciones complicadas.', dim: 'RES' },
        { text: 'Aprendo de las dificultades en lugar de rendirme.', dim: 'RES' },
        { text: 'Me siento superado/a cuando se acumulan los problemas.', dim: 'RES', reverse: true }
      ]
    },

    /* ========== AUTOESTIMA (scale, sin tiempo) ========== */
    autoestima: {
      id: 'autoestima',
      title: 'Autoestima',
      icon: '🌟',
      tag: 'Personalidad',
      description: 'Cómo de bien te valoras y te tratas a ti mismo/a.',
      type: 'scale',
      pick: 10,
      likert: LIKERT_ACUERDO,
      single: true,
      highIsGood: true,
      headlineLabel: 'Nivel de autoestima',
      disclaimer: 'Autorreflexión orientativa, no un diagnóstico. La autoestima se puede trabajar y mejorar con el tiempo.',
      tierLabels: { alto: 'Autoestima alta', medio: 'Autoestima media', bajo: 'Autoestima baja' },
      levelMessages: {
        alto: 'Te valoras de forma positiva y te tratas con respeto. Es una gran base para tu bienestar.',
        medio: 'Tu autoestima es equilibrada; en algunos aspectos podrías ser un poco más amable contigo mismo/a.',
        bajo: 'Ahora mismo eres duro/a contigo mismo/a. Recuerda que tu valor no depende de tus logros; hablar con alguien de confianza puede ayudarte.'
      },
      dimensions: { AUT: 'Autoestima' },
      pool: [
        { text: 'En general, estoy satisfecho/a conmigo mismo/a.', dim: 'AUT' },
        { text: 'A veces pienso que no valgo para nada.', dim: 'AUT', reverse: true },
        { text: 'Creo que tengo varias buenas cualidades.', dim: 'AUT' },
        { text: 'Soy capaz de hacer las cosas tan bien como la mayoría.', dim: 'AUT' },
        { text: 'Siento que no tengo mucho de lo que estar orgulloso/a.', dim: 'AUT', reverse: true },
        { text: 'Tengo una actitud positiva hacia mí mismo/a.', dim: 'AUT' },
        { text: 'Me gustaría tenerme más respeto a mí mismo/a.', dim: 'AUT', reverse: true },
        { text: 'A veces me siento inútil.', dim: 'AUT', reverse: true },
        { text: 'Creo que soy una persona valiosa.', dim: 'AUT' },
        { text: 'En conjunto, me inclino a pensar que soy un/a fracasado/a.', dim: 'AUT', reverse: true }
      ]
    },

    /* ========== OPTIMISMO (scale, sin tiempo) ========== */
    optimismo: {
      id: 'optimismo',
      title: 'Optimismo',
      icon: '☀️',
      tag: 'Personalidad',
      description: '¿Ves el vaso medio lleno o medio vacío?',
      type: 'scale',
      pick: 10,
      likert: LIKERT_ACUERDO,
      single: true,
      highIsGood: true,
      headlineLabel: 'Nivel de optimismo',
      tierLabels: { alto: 'Optimista', medio: 'Equilibrado/a', bajo: 'Tiende al pesimismo' },
      levelMessages: {
        alto: 'Sueles esperar lo mejor y ver el lado positivo. El optimismo se asocia con mayor bienestar.',
        medio: 'Tienes una visión equilibrada: ni te engañas ni te hundes. Un punto realista muy sano.',
        bajo: 'Tiendes a esperar que las cosas salgan mal. Entrenar la mirada a lo positivo (pequeñas cosas buenas del día) puede ayudarte.'
      },
      dimensions: { OPT: 'Optimismo' },
      pool: [
        { text: 'En tiempos de incertidumbre, suelo esperar lo mejor.', dim: 'OPT' },
        { text: 'Si algo puede salirme mal, me saldrá mal.', dim: 'OPT', reverse: true },
        { text: 'Casi siempre soy optimista sobre mi futuro.', dim: 'OPT' },
        { text: 'Rara vez espero que las cosas salgan a mi favor.', dim: 'OPT', reverse: true },
        { text: 'Cuento con que me pasen cosas buenas.', dim: 'OPT' },
        { text: 'Casi nunca espero que las cosas vayan como quiero.', dim: 'OPT', reverse: true },
        { text: 'Creo que lo bueno pesa más que lo malo en mi vida.', dim: 'OPT' },
        { text: 'Pocas veces confío en que el futuro será bueno.', dim: 'OPT', reverse: true },
        { text: 'Espero con ilusión lo que está por venir.', dim: 'OPT' },
        { text: 'Tiendo a ver el lado positivo de las cosas.', dim: 'OPT' }
      ]
    },

    /* ========== ESTILO DE COMUNICACIÓN (scale, sin tiempo) ========== */
    comunicacion: {
      id: 'comunicacion',
      title: 'Estilo de Comunicación',
      icon: '💬',
      tag: 'Personalidad',
      description: '¿Eres asertivo, pasivo o agresivo al comunicarte?',
      type: 'scale',
      pick: 15,
      likert: LIKERT_ACUERDO,
      headlineLabel: 'Estilo dominante',
      dominantVerb: 'Tu estilo de comunicación es sobre todo',
      dimensions: { AS: 'Asertivo', PA: 'Pasivo', AG: 'Agresivo' },
      pool: [
        { text: 'Expreso mis opiniones con claridad y respeto.', dim: 'AS' },
        { text: 'Sé decir "no" sin sentirme culpable.', dim: 'AS' },
        { text: 'Defiendo mis derechos sin pisar los de los demás.', dim: 'AS' },
        { text: 'Pido lo que necesito de forma directa.', dim: 'AS' },
        { text: 'Escucho a los demás aunque no esté de acuerdo.', dim: 'AS' },
        { text: 'Evito los conflictos aunque me perjudiquen.', dim: 'PA' },
        { text: 'Me cuesta expresar lo que realmente pienso.', dim: 'PA' },
        { text: 'Suelo ceder para no molestar a nadie.', dim: 'PA' },
        { text: 'Guardo mis opiniones por miedo a la reacción de otros.', dim: 'PA' },
        { text: 'Me disculpo incluso cuando no es culpa mía.', dim: 'PA' },
        { text: 'Alzo la voz cuando algo me molesta.', dim: 'AG' },
        { text: 'Intento imponer mi punto de vista a los demás.', dim: 'AG' },
        { text: 'Interrumpo cuando no estoy de acuerdo.', dim: 'AG' },
        { text: 'Me cuesta controlar el tono cuando discuto.', dim: 'AG' },
        { text: 'Priorizo ganar la discusión antes que entender al otro.', dim: 'AG' }
      ]
    },

    /* ========== ESTILO DE APEGO (scale, sin tiempo) ========== */
    apego: {
      id: 'apego',
      title: 'Estilo de Apego',
      icon: '🔗',
      tag: 'Relaciones',
      description: 'Cómo te vinculas emocionalmente en tus relaciones.',
      type: 'scale',
      pick: 15,
      likert: LIKERT_ACUERDO,
      headlineLabel: 'Estilo de apego',
      dominantVerb: 'Tu estilo de apego tiende a ser',
      disclaimer: 'Autorreflexión orientativa sobre cómo te relacionas, no un diagnóstico. El estilo de apego puede cambiar con las experiencias y el trabajo personal.',
      dimensions: { SEG: 'Seguro', ANS: 'Ansioso', EVI: 'Evitativo' },
      pool: [
        { text: 'Me resulta fácil confiar en las personas cercanas.', dim: 'SEG' },
        { text: 'Me siento cómodo/a dependiendo de otros y que dependan de mí.', dim: 'SEG' },
        { text: 'No me preocupa demasiado que me abandonen.', dim: 'SEG' },
        { text: 'Puedo pedir ayuda y apoyo con naturalidad.', dim: 'SEG' },
        { text: 'Mantengo mi independencia dentro de una relación.', dim: 'SEG' },
        { text: 'Me preocupa que quien quiero no me quiera lo suficiente.', dim: 'ANS' },
        { text: 'Necesito mucha confirmación de que me aprecian.', dim: 'ANS' },
        { text: 'Me angustia que las personas cercanas se alejen.', dim: 'ANS' },
        { text: 'Le doy muchas vueltas a mis relaciones.', dim: 'ANS' },
        { text: 'Me cuesta estar tranquilo/a si no recibo respuesta pronto.', dim: 'ANS' },
        { text: 'Prefiero no depender emocionalmente de nadie.', dim: 'EVI' },
        { text: 'Me incomoda que otros se acerquen demasiado.', dim: 'EVI' },
        { text: 'Me cuesta abrirme y mostrar mis sentimientos.', dim: 'EVI' },
        { text: 'Valoro mi independencia por encima de la intimidad.', dim: 'EVI' },
        { text: 'Cuando algo va mal, prefiero resolverlo solo/a.', dim: 'EVI' }
      ]
    }

  };

  // Orden en que se muestran en la portada (el CI va primero).
  const TEST_ORDER = [
    'iq', 'numerico', 'logico', 'atencion', 'cultura',
    'bigfive', 'eq', 'apego', 'comunicacion',
    'autoestima', 'optimismo', 'resiliencia', 'vark', 'estres'
  ];

  window.APP_DATA = { TESTS, TEST_ORDER };
})();
