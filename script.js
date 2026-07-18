(() => {
  'use strict';

  const TOTAL_TIME = 600; // 10 minutos en segundos

  const QUESTIONS = [
    // ---- LÓGICA ----
    {
      category: 'Lógica',
      text: 'Completa la secuencia: 2, 4, 8, 16, ?',
      options: ['24', '30', '32', '20'],
      correct: 2
    },
    {
      category: 'Lógica',
      text: 'Todos los Bloops son Razzles. Todos los Razzles son Lazzles. ¿Todos los Bloops son necesariamente Lazzles?',
      options: ['Sí, siempre', 'No, nunca', 'Solo a veces', 'No hay información suficiente'],
      correct: 0
    },
    {
      category: 'Lógica',
      text: 'Ana es más alta que Bruno. Carla es más baja que Bruno. ¿Quién es el más bajo de los tres?',
      options: ['Ana', 'Bruno', 'Carla', 'No se puede saber'],
      correct: 2
    },
    {
      category: 'Lógica',
      text: '¿Qué número no pertenece al grupo? 3, 5, 7, 10, 11',
      options: ['3', '7', '10', '11'],
      correct: 2
    },
    {
      category: 'Lógica',
      text: 'Si hoy es miércoles, ¿qué día será dentro de 100 días?',
      options: ['Jueves', 'Viernes', 'Sábado', 'Domingo'],
      correct: 1
    },

    // ---- MATEMÁTICAS ----
    {
      category: 'Matemáticas',
      text: '¿Cuánto es 15 × 3 − 8?',
      options: ['31', '37', '45', '52'],
      correct: 1
    },
    {
      category: 'Matemáticas',
      text: 'Completa la serie de Fibonacci: 1, 1, 2, 3, 5, 8, ?',
      options: ['11', '12', '13', '14'],
      correct: 2
    },
    {
      category: 'Matemáticas',
      text: 'Una camiseta cuesta 80€ tras un descuento del 20%. ¿Cuál era el precio original?',
      options: ['90€', '96€', '100€', '110€'],
      correct: 2
    },
    {
      category: 'Matemáticas',
      text: '¿Cuánto es 7² − 6²?',
      options: ['1', '7', '13', '49'],
      correct: 2
    },
    {
      category: 'Matemáticas',
      text: 'Un tren recorre 60 km en 45 minutos. ¿Cuál es su velocidad en km/h?',
      options: ['60 km/h', '75 km/h', '80 km/h', '90 km/h'],
      correct: 2
    },

    // ---- PATRONES ----
    {
      category: 'Patrones',
      text: 'Completa la secuencia de letras: A, C, E, G, ?',
      options: ['H', 'I', 'J', 'F'],
      correct: 1
    },
    {
      category: 'Patrones',
      text: 'Completa la serie numérica: 2, 6, 12, 20, 30, ?',
      options: ['36', '40', '42', '44'],
      correct: 2
    },
    {
      category: 'Patrones',
      text: 'Sigue el patrón de figuras: Círculo, Cuadrado, Triángulo, Círculo, Cuadrado, ?',
      options: ['Círculo', 'Cuadrado', 'Triángulo', 'Rombo'],
      correct: 2
    },
    {
      category: 'Patrones',
      text: 'Completa la secuencia: 1, 4, 9, 16, 25, ?',
      options: ['30', '32', '36', '49'],
      correct: 2
    },
    {
      category: 'Patrones',
      text: 'Completa la secuencia de letras: Z, Y, X, W, ?',
      options: ['U', 'V', 'T', 'S'],
      correct: 1
    },

    // ---- VERBAL ----
    {
      category: 'Verbal',
      text: 'Perro es a Cachorro como Gato es a...',
      options: ['Felino', 'Gatito', 'Maullido', 'Ratón'],
      correct: 1
    },
    {
      category: 'Verbal',
      text: '¿Cuál es el antónimo de "efímero"?',
      options: ['Fugaz', 'Breve', 'Duradero', 'Instantáneo'],
      correct: 2
    },
    {
      category: 'Verbal',
      text: 'Libro es a Leer como Comida es a...',
      options: ['Cocinar', 'Comer', 'Cortar', 'Servir'],
      correct: 1
    },
    {
      category: 'Verbal',
      text: '¿Cuál es el sinónimo de "locuaz"?',
      options: ['Callado', 'Tímido', 'Hablador', 'Sereno'],
      correct: 2
    },
    {
      category: 'Verbal',
      text: 'Médico es a Hospital como Profesor es a...',
      options: ['Libro', 'Escuela', 'Alumno', 'Pizarra'],
      correct: 1
    }
  ];

  const state = {
    current: 0,
    answers: new Array(QUESTIONS.length).fill(null),
    timeLeft: TOTAL_TIME,
    timerId: null,
    startedAt: null,
    finished: false,
    playerName: ''
  };

  const $ = (id) => document.getElementById(id);

  const screens = {
    start: $('screen-start'),
    quiz: $('screen-quiz'),
    result: $('screen-result')
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    screens[name].classList.add('active');
  }

  function formatTime(totalSeconds) {
    const s = Math.max(0, totalSeconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // ---------- INICIO ----------

  $('btn-start').addEventListener('click', () => {
    state.playerName = $('player-name').value.trim();
    state.current = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    state.timeLeft = TOTAL_TIME;
    state.finished = false;
    state.startedAt = Date.now();

    showScreen('quiz');
    renderQuestion();
    startTimer();
  });

  // ---------- TEMPORIZADOR ----------

  function startTimer() {
    clearInterval(state.timerId);
    updateTimerDisplay();
    state.timerId = setInterval(() => {
      state.timeLeft--;
      updateTimerDisplay();
      if (state.timeLeft <= 0) {
        finishQuiz();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const el = $('timer');
    el.textContent = formatTime(state.timeLeft);
    el.classList.toggle('warning', state.timeLeft <= 60 && state.timeLeft > 20);
    el.classList.toggle('danger', state.timeLeft <= 20);
  }

  // ---------- RENDER PREGUNTA ----------

  function renderQuestion() {
    const q = QUESTIONS[state.current];
    $('q-category').textContent = q.category;
    $('q-text').textContent = q.text;

    const optionsWrap = $('q-options');
    optionsWrap.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.type = 'button';
      if (state.answers[state.current] === idx) btn.classList.add('selected');
      btn.innerHTML = `<span class="option-letter">${letters[idx]}</span><span>${optText}</span>`;
      btn.addEventListener('click', () => selectAnswer(idx));
      optionsWrap.appendChild(btn);
    });

    $('progress-text').textContent = `Pregunta ${state.current + 1} / ${QUESTIONS.length}`;
    $('progress-fill').style.width = `${((state.current + 1) / QUESTIONS.length) * 100}%`;

    $('btn-prev').disabled = state.current === 0;
    $('btn-prev').style.opacity = state.current === 0 ? '0.4' : '1';

    const isLast = state.current === QUESTIONS.length - 1;
    $('btn-next').classList.toggle('hidden', isLast);
    $('btn-finish').classList.toggle('hidden', !isLast);
  }

  function selectAnswer(idx) {
    state.answers[state.current] = idx;
    renderQuestion();
  }

  $('btn-next').addEventListener('click', () => {
    if (state.current < QUESTIONS.length - 1) {
      state.current++;
      renderQuestion();
    }
  });

  $('btn-prev').addEventListener('click', () => {
    if (state.current > 0) {
      state.current--;
      renderQuestion();
    }
  });

  $('btn-finish').addEventListener('click', () => {
    finishQuiz();
  });

  // ---------- FINALIZAR Y RESULTADOS ----------

  function finishQuiz() {
    if (state.finished) return;
    state.finished = true;
    clearInterval(state.timerId);

    const timeUsed = TOTAL_TIME - Math.max(0, state.timeLeft);
    const correctCount = state.answers.reduce(
      (acc, ans, i) => acc + (ans === QUESTIONS[i].correct ? 1 : 0),
      0
    );
    const percent = correctCount / QUESTIONS.length;

    // Estimación de CI: mapeo lineal centrado en 100 (rango aprox. 55-145)
    let iq = Math.round(55 + percent * 90);
    iq = Math.max(55, Math.min(145, iq));

    renderResults({ correctCount, percent, timeUsed, iq });
    showScreen('result');
  }

  function iqTier(iq) {
    if (iq < 85) return { label: 'Por debajo del promedio', level: 'low' };
    if (iq < 95) return { label: 'Promedio bajo', level: 'mid-low' };
    if (iq < 105) return { label: 'Promedio', level: 'mid' };
    if (iq < 115) return { label: 'Promedio alto', level: 'mid-high' };
    if (iq < 130) return { label: 'Superior', level: 'high' };
    return { label: 'Muy superior', level: 'high' };
  }

  function renderResults({ correctCount, percent, timeUsed, iq }) {
    $('result-name').textContent = state.playerName
      ? `Resultados de ${state.playerName}`
      : 'Estos son tus resultados';

    const tier = iqTier(iq);
    $('iq-score').textContent = iq;
    $('iq-tier').textContent = tier.label;
    $('iq-tier').className = `iq-tier tier-${tier.level}`;

    $('stat-correct').textContent = `${correctCount}/${QUESTIONS.length}`;
    $('stat-time').textContent = formatTime(timeUsed);
    $('stat-percent').textContent = `${Math.round(percent * 100)}%`;

    // Desglose por categoría
    const categories = {};
    QUESTIONS.forEach((q, i) => {
      if (!categories[q.category]) categories[q.category] = { correct: 0, total: 0 };
      categories[q.category].total++;
      if (state.answers[i] === q.correct) categories[q.category].correct++;
    });

    const breakdownWrap = $('category-breakdown');
    breakdownWrap.innerHTML = '';
    Object.entries(categories).forEach(([cat, data]) => {
      const pct = Math.round((data.correct / data.total) * 100);
      const row = document.createElement('div');
      row.className = 'breakdown-item';
      row.innerHTML = `
        <span class="breakdown-label">${cat}</span>
        <span class="breakdown-bar"><span class="breakdown-fill" style="width:${pct}%"></span></span>
        <span class="breakdown-score">${data.correct}/${data.total}</span>
      `;
      breakdownWrap.appendChild(row);
    });

    // Revisión de respuestas (oculta por defecto)
    const reviewWrap = $('review-wrap');
    reviewWrap.innerHTML = '';
    reviewWrap.classList.add('hidden');
    $('btn-review').textContent = 'Ver respuestas';

    const letters = ['A', 'B', 'C', 'D'];
    QUESTIONS.forEach((q, i) => {
      const userIdx = state.answers[i];
      const item = document.createElement('div');
      item.className = 'review-item';
      const userText = userIdx === null ? 'Sin responder' : `${letters[userIdx]}) ${q.options[userIdx]}`;
      const correctText = `${letters[q.correct]}) ${q.options[q.correct]}`;
      const isCorrect = userIdx === q.correct;
      item.innerHTML = `
        <div class="review-q">${i + 1}. ${q.text}</div>
        <div class="review-answer ${isCorrect ? 'review-correct' : 'review-wrong'}">Tu respuesta: ${userText}</div>
        ${isCorrect ? '' : `<div class="review-answer review-correct">Respuesta correcta: ${correctText}</div>`}
      `;
      reviewWrap.appendChild(item);
    });
  }

  $('btn-review').addEventListener('click', () => {
    const wrap = $('review-wrap');
    const willShow = wrap.classList.contains('hidden');
    wrap.classList.toggle('hidden');
    $('btn-review').textContent = willShow ? 'Ocultar respuestas' : 'Ver respuestas';
  });

  $('btn-restart').addEventListener('click', () => {
    $('player-name').value = '';
    showScreen('start');
  });

})();
