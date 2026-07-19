(() => {
  'use strict';

  const { TESTS, TEST_ORDER } = window.APP_DATA;
  const $ = (id) => document.getElementById(id);

  const screens = {
    hub: $('screen-hub'),
    intro: $('screen-intro'),
    quiz: $('screen-quiz'),
    result: $('screen-result')
  };

  // Resultados acumulados de la sesión (para el informe "de todo").
  const session = {
    playerName: '',
    results: {} // testId -> objeto de resultado
  };

  // Estado del test en curso.
  let run = null;

  /* ---------------- utilidades ---------------- */

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatTime(totalSeconds) {
    const s = Math.max(0, Math.round(totalSeconds));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  /*
   * Ajuste por tiempo, basado en la investigación sobre velocidad mental:
   * - En tests de CAPACIDAD (CI, atención) la velocidad de respuesta correlaciona
   *   con la inteligencia (r ≈ 0,3-0,4): Jensen (2006) "Clocking the Mind";
   *   Deary, Der & Ford (2001); Sheppard & Vernon (2008). Los tests reales tipo
   *   Wechsler (WAIS) dan bonus por rapidez. Aquí el tiempo aporta un bonus
   *   acotado, SIEMPRE multiplicado por el acierto (rápido pero mal no puntúa).
   * - En tests de PERSONALIDAD el tiempo NO cambia el resultado (no hay base
   *   científica); se usa como indicador de calidad: responder a <2 s por ítem
   *   sugiere respuesta poco reflexiva (Huang et al., 2012).
   */
  const SPEED = {
    fullCreditRatio: 0.4,      // usar <=40% del tiempo = crédito máximo de velocidad
    iqBonusMax: 15,            // puntos de CI que puede aportar la rapidez (techo 160)
    concentrationBonusMax: 15, // el test de atención es de velocidad: pesa más
    carelessSecondsPerItem: 2  // <2 s/ítem en escalas = posible respuesta poco reflexiva
  };

  // Interruptor del envío por correo. Se pone en true cuando haya un dominio
  // verificado en Resend (avisar al usuario). Con false solo se ofrece descargar.
  const EMAIL_ENABLED = false;

  // Factor de velocidad 0..1 (1 = muy rápido, 0 = usó todo el tiempo).
  function speedFactor(timeUsed, timeLimit) {
    const ratio = Math.min(1, Math.max(0, timeUsed / timeLimit));
    return Math.min(1, Math.max(0, (1 - ratio) / (1 - SPEED.fullCreditRatio)));
  }

  function speedLabel(speed) {
    if (speed >= 0.8) return '⚡ Muy rápido';
    if (speed >= 0.5) return '🚀 Rápido';
    if (speed >= 0.25) return '⏱️ Ritmo medio';
    return '🐢 Pausado';
  }

  // Un test es cronometrado si define timeLimit. Los tests de personalidad no lo
  // definen: se hacen a tu ritmo, sin cuenta atrás.
  function isTimed(t) {
    return typeof t.timeLimit === 'number';
  }

  /* ---------------- PORTADA / HUB ---------------- */

  function renderHub() {
    const grid = $('test-grid');
    grid.innerHTML = '';

    TEST_ORDER.forEach((id) => {
      const t = TESTS[id];
      const done = session.results[id];
      const card = document.createElement('button');
      card.className = 'test-card' + (done ? ' done' : '');
      card.type = 'button';
      card.innerHTML = `
        <div class="test-card-icon">${t.icon}</div>
        <div class="test-card-body">
          <span class="test-card-tag">${esc(t.tag)}</span>
          <h3 class="test-card-title">${esc(t.title)}</h3>
          <p class="test-card-desc">${esc(t.description)}</p>
        </div>
        <div class="test-card-foot">
          <span class="test-card-meta">${t.pick} preguntas · ${isTimed(t) ? Math.round(t.timeLimit / 60) + ' min' : 'a tu ritmo'}</span>
          ${done
            ? `<span class="test-card-done">✔ ${esc(done.headline)}</span>`
            : `<span class="test-card-go">Empezar →</span>`}
        </div>`;
      card.addEventListener('click', () => openIntro(id));
      grid.appendChild(card);
    });

    renderReportBar();
  }

  function renderReportBar() {
    const n = Object.keys(session.results).length;
    const bar = $('report-bar');
    bar.classList.toggle('hidden', n === 0);
    $('report-count').textContent =
      n === 1 ? '1 test completado' : `${n} tests completados`;
  }

  /* ---------------- INTRO DE UN TEST ---------------- */

  function openIntro(testId) {
    const t = TESTS[testId];
    run = { testId };

    const timed = isTimed(t);
    $('intro-icon').textContent = t.icon;
    $('intro-title').textContent = t.title;
    $('intro-desc').textContent = t.description;
    $('intro-count').textContent = t.pick;
    $('intro-type').textContent = t.type === 'quiz' ? 'Quiz' : 'Escala';

    // Caja de tiempo solo en tests cronometrados.
    $('intro-time-item').classList.toggle('hidden', !timed);
    $('intro-stats').style.gridTemplateColumns = `repeat(${timed ? 3 : 2}, 1fr)`;
    if (timed) $('intro-time').textContent = formatTime(t.timeLimit);

    const rules = $('intro-rules');
    rules.innerHTML = '';
    const items = t.type === 'quiz'
      ? [
          `Tienes <strong>${Math.round(t.timeLimit / 60)} minutos</strong> en total.`,
          'Si el tiempo se agota, el test se envía automáticamente.',
          'Cada pregunta tiene una única respuesta correcta.',
          'Cuanto más rápido y acertado, mejor puntuación.'
        ]
      : [
          'Sin límite de tiempo: ve a tu ritmo.',
          'No hay respuestas correctas ni incorrectas.',
          'Responde con sinceridad según lo que sueles sentir o hacer.',
          'Puedes volver a preguntas anteriores antes de finalizar.'
        ];
    items.forEach((txt) => {
      const li = document.createElement('li');
      li.innerHTML = txt;
      rules.appendChild(li);
    });

    const disc = $('intro-disclaimer');
    disc.textContent = t.disclaimer || '';
    disc.classList.toggle('hidden', !t.disclaimer);

    $('player-name').value = session.playerName;
    showScreen('intro');
  }

  /* ---------------- ARRANQUE DEL TEST ---------------- */

  function startRun() {
    const t = TESTS[run.testId];
    session.playerName = $('player-name').value.trim();

    // Barajar el banco y elegir las preguntas de este intento.
    let questions = shuffle(t.pool).slice(0, Math.min(t.pick, t.pool.length));

    // En los quiz, barajamos también las opciones y recalculamos la correcta.
    if (t.type === 'quiz') {
      questions = questions.map((q) => {
        const opts = q.options.map((text, idx) => ({ text, correct: idx === q.correct }));
        const shuffled = shuffle(opts);
        return {
          category: q.category,
          text: q.text,
          options: shuffled.map((o) => o.text),
          correct: shuffled.findIndex((o) => o.correct),
          explanation: q.explanation || ''
        };
      });
    }

    const timed = isTimed(t);
    run = {
      testId: t.id,
      test: t,
      questions,
      answers: new Array(questions.length).fill(null),
      current: 0,
      timeLeft: timed ? t.timeLimit : 0,
      timerId: null,
      finished: false
    };

    // El reloj solo aparece y corre en los tests cronometrados.
    $('timer').classList.toggle('hidden', !timed);

    showScreen('quiz');
    renderQuestion();
    if (timed) startTimer();
  }

  /* ---------------- TEMPORIZADOR ---------------- */

  function startTimer() {
    clearInterval(run.timerId);
    updateTimerDisplay();
    run.timerId = setInterval(() => {
      run.timeLeft--;
      updateTimerDisplay();
      if (run.timeLeft <= 0) finishRun();
    }, 1000);
  }

  function updateTimerDisplay() {
    const el = $('timer');
    el.textContent = formatTime(run.timeLeft);
    el.classList.toggle('warning', run.timeLeft <= 60 && run.timeLeft > 20);
    el.classList.toggle('danger', run.timeLeft <= 20);
  }

  /* ---------------- RENDER PREGUNTA ---------------- */

  function renderQuestion() {
    const t = run.test;
    const q = run.questions[run.current];
    const isQuiz = t.type === 'quiz';

    $('q-category').textContent = isQuiz ? q.category : t.tag;
    $('q-text').textContent = q.text;

    const wrap = $('q-options');
    wrap.innerHTML = '';
    const opts = isQuiz ? q.options : t.likert;
    const letters = ['A', 'B', 'C', 'D', 'E'];

    opts.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.type = 'button';
      if (run.answers[run.current] === idx) btn.classList.add('selected');
      const mark = isQuiz ? letters[idx] : (idx + 1);
      btn.innerHTML = `<span class="option-letter">${mark}</span><span>${esc(optText)}</span>`;
      btn.addEventListener('click', () => selectAnswer(idx));
      wrap.appendChild(btn);
    });

    $('progress-text').textContent = `Pregunta ${run.current + 1} / ${run.questions.length}`;
    $('progress-fill').style.width = `${((run.current + 1) / run.questions.length) * 100}%`;

    $('btn-prev').disabled = run.current === 0;
    $('btn-prev').style.opacity = run.current === 0 ? '0.4' : '1';

    const isLast = run.current === run.questions.length - 1;
    $('btn-next').classList.toggle('hidden', isLast);
    $('btn-finish').classList.toggle('hidden', !isLast);
  }

  function selectAnswer(idx) {
    run.answers[run.current] = idx;
    // Avance automático suave (salvo en la última).
    const isLast = run.current === run.questions.length - 1;
    renderQuestion();
    if (!isLast) {
      setTimeout(() => {
        if (run && !run.finished) {
          run.current++;
          renderQuestion();
        }
      }, 220);
    }
  }

  $('btn-next').addEventListener('click', () => {
    if (run.current < run.questions.length - 1) { run.current++; renderQuestion(); }
  });
  $('btn-prev').addEventListener('click', () => {
    if (run.current > 0) { run.current--; renderQuestion(); }
  });
  $('btn-finish').addEventListener('click', finishRun);

  /* ---------------- CÁLCULO DE RESULTADOS ---------------- */

  // Bandas de clasificación de la escala Wechsler (media 100, desviación 15).
  function iqTier(iq) {
    if (iq < 70) return { label: 'Muy bajo', level: 'low' };
    if (iq < 85) return { label: 'Límite', level: 'low' };
    if (iq < 90) return { label: 'Promedio bajo', level: 'mid-low' };
    if (iq < 110) return { label: 'Promedio', level: 'mid' };
    if (iq < 120) return { label: 'Promedio alto', level: 'mid-high' };
    if (iq < 130) return { label: 'Superior', level: 'mid-high' };
    if (iq < 145) return { label: 'Muy superior', level: 'high' };
    if (iq < 160) return { label: 'Superdotado', level: 'high' };
    return { label: 'Superdotado excepcional', level: 'high' };
  }

  function computeQuiz(t, questions, answers, timeUsed) {
    const correctCount = answers.reduce(
      (acc, ans, i) => acc + (ans === questions[i].correct ? 1 : 0), 0);
    const percent = correctCount / questions.length;

    // Desglose por categoría.
    const cats = {};
    questions.forEach((q, i) => {
      const c = q.category;
      if (!cats[c]) cats[c] = { correct: 0, total: 0 };
      cats[c].total++;
      if (answers[i] === q.correct) cats[c].correct++;
    });
    const breakdown = Object.entries(cats).map(([label, d]) => ({
      label, value: `${d.correct}/${d.total}`, pct: Math.round((d.correct / d.total) * 100)
    }));

    // Componente de velocidad (0..1). La rapidez solo puntúa multiplicada por el
    // acierto, de modo que responder rápido pero mal no aporta nada.
    const speed = speedFactor(timeUsed, t.timeLimit);

    let headline, headlineLabel, tier, message, speedInfo;
    if (t.scoring === 'iq') {
      // Acierto -> 40..145 (componente "potencia"); velocidad -> hasta +15 (bonus).
      // Rango 40-160 = escala Wechsler (media 100, desviación 15).
      const baseIQ = 40 + percent * 105;
      const bonus = SPEED.iqBonusMax * speed * percent;
      const bonusPts = Math.round(bonus);
      let iq = Math.round(baseIQ + bonus);
      iq = Math.max(40, Math.min(160, iq));
      headline = String(iq);
      headlineLabel = 'Estimación de CI';
      tier = iqTier(iq);
      message = `Has acertado ${correctCount} de ${questions.length}. La rapidez te ha sumado +${bonusPts} puntos de CI (la velocidad mental correlaciona con la inteligencia en la investigación). Estimación orientativa (escala 40-160).`;
      speedInfo = {
        label: speedLabel(speed),
        detail: `${formatTime(timeUsed)} de ${formatTime(t.timeLimit)} · +${bonusPts} pts por velocidad`
      };
    } else {
      // Quiz cronometrado (atención, numérico, lógico, cultura):
      // base 0..85 por acierto + hasta +15 por velocidad.
      const bonus = SPEED.concentrationBonusMax * speed * percent;
      const bonusPts = Math.round(bonus);
      const pts = Math.max(0, Math.min(100, Math.round(percent * 85 + bonus)));
      headline = String(pts);
      headlineLabel = t.scoreLabel || 'Puntuación';
      if (pts >= 85) tier = { label: 'Excelente', level: 'high' };
      else if (pts >= 65) tier = { label: 'Muy bien', level: 'mid-high' };
      else if (pts >= 40) tier = { label: 'Bien', level: 'mid-low' };
      else tier = { label: 'A mejorar', level: 'low' };
      message = `Has acertado ${correctCount} de ${questions.length} contrarreloj. La velocidad suma +${bonusPts} puntos.`;
      speedInfo = {
        label: speedLabel(speed),
        detail: `${formatTime(timeUsed)} de ${formatTime(t.timeLimit)} · +${bonusPts} pts por velocidad`
      };
    }

    // Revisión de respuestas.
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const review = questions.map((q, i) => {
      const u = answers[i];
      return {
        text: q.text,
        userText: u === null ? 'Sin responder' : `${letters[u]}) ${q.options[u]}`,
        correctText: `${letters[q.correct]}) ${q.options[q.correct]}`,
        isCorrect: u === q.correct,
        explanation: q.explanation || ''
      };
    });

    return {
      testId: t.id, title: t.title, icon: t.icon, type: 'quiz',
      headline, headlineLabel, tier, speedInfo,
      stats: [
        { label: 'Aciertos', value: `${correctCount}/${questions.length}` },
        { label: 'Tiempo usado', value: formatTime(timeUsed) },
        { label: 'Precisión', value: `${Math.round(percent * 100)}%` }
      ],
      breakdownTitle: 'Resultado por categoría',
      breakdown, message, review, timeUsed
    };
  }

  function computeScale(t, questions, answers) {
    const dims = {};
    Object.keys(t.dimensions).forEach((k) => (dims[k] = { sum: 0, n: 0 }));
    let answered = 0;

    questions.forEach((q, i) => {
      const sel = answers[i];
      if (sel === null) return;
      answered++;
      let v = sel + 1; // 1..5
      if (q.reverse) v = 6 - v;
      dims[q.dim].sum += v;
      dims[q.dim].n += 1;
    });

    const dimResults = Object.keys(t.dimensions).map((k) => {
      const d = dims[k];
      const pct = d.n ? Math.round(((d.sum - d.n) / (4 * d.n)) * 100) : 0;
      return { key: k, label: t.dimensions[k], pct };
    });

    const breakdown = dimResults.map((d) => ({
      label: d.label, value: `${d.pct}%`, pct: d.pct
    }));

    let headline, headlineLabel, tier, message;
    const isSingle = t.single || Object.keys(t.dimensions).length === 1;

    if (isSingle) {
      // Una sola dimensión: nivel Bajo/Moderado/Alto. `highIsGood` decide el color.
      const pct = dimResults[0].pct;
      const lvl = pct >= 66 ? 'alto' : (pct >= 40 ? 'medio' : 'bajo');
      headline = lvl === 'alto' ? 'Alto' : (lvl === 'medio' ? 'Moderado' : 'Bajo');
      headlineLabel = t.headlineLabel || dimResults[0].label;
      const good = !!t.highIsGood;
      const level = lvl === 'medio' ? 'mid-low' : (((lvl === 'alto') === good) ? 'high' : 'low');
      const tl = t.tierLabels || {};
      tier = { label: tl[lvl] || `${headlineLabel}: ${headline.toLowerCase()}`, level };
      message = (t.levelMessages && t.levelMessages[lvl]) || '';
    } else {
      // Varias dimensiones: se muestra la dominante.
      const top = dimResults.slice().sort((a, b) => b.pct - a.pct)[0];
      headline = top.label;
      headlineLabel = t.headlineLabel
        || (t.id === 'vark' ? 'Estilo dominante' : t.id === 'eq' ? 'Fortaleza principal' : 'Rasgo dominante');
      tier = { label: `${top.pct}% · el más marcado`, level: 'mid' };
      const verb = t.dominantVerb
        || (t.id === 'vark' ? 'Aprendes mejor de forma' : t.id === 'eq' ? 'Tu mayor fortaleza emocional es la' : 'Tu rasgo más marcado es la');
      message = `${verb} ${top.label.toLowerCase()}. Mira el desglose para ver tu perfil completo.`;
    }

    // Los tests de escala no tienen cronómetro: el tiempo no influye.
    return {
      testId: t.id, title: t.title, icon: t.icon, type: 'scale',
      headline, headlineLabel, tier, speedInfo: null,
      stats: [
        { label: 'Respondidas', value: `${answered}/${questions.length}` }
      ],
      breakdownTitle: 'Tu perfil',
      breakdown, message, review: null
    };
  }

  function finishRun() {
    if (!run || run.finished) return;
    run.finished = true;
    clearInterval(run.timerId);

    const t = run.test;
    const result = t.type === 'quiz'
      ? computeQuiz(t, run.questions, run.answers, t.timeLimit - Math.max(0, run.timeLeft))
      : computeScale(t, run.questions, run.answers);

    session.results[t.id] = result;
    renderResult(result);
    showScreen('result');
  }

  /* ---------------- RENDER RESULTADO ---------------- */

  function renderResult(r) {
    const t = TESTS[r.testId];
    $('result-icon').textContent = r.icon;
    $('result-title').textContent = r.title;
    $('result-name').textContent = session.playerName
      ? `Resultados de ${session.playerName}` : 'Estos son tus resultados';

    $('result-headline').textContent = r.headline;
    $('result-headline-label').textContent = r.headlineLabel;
    $('result-tier').textContent = r.tier.label;
    $('result-tier').className = `iq-tier tier-${r.tier.level}`;

    const speedEl = $('result-speed');
    if (r.speedInfo) {
      speedEl.classList.remove('hidden');
      speedEl.innerHTML = `<strong>${esc(r.speedInfo.label)}</strong> · ${esc(r.speedInfo.detail)}`;
    } else {
      speedEl.classList.add('hidden');
    }

    const stats = $('result-stats');
    stats.innerHTML = '';
    stats.style.gridTemplateColumns = `repeat(${r.stats.length}, 1fr)`;
    r.stats.forEach((s) => {
      const div = document.createElement('div');
      div.className = 'info-item';
      div.innerHTML = `<span class="info-num">${esc(s.value)}</span><span class="info-label">${esc(s.label)}</span>`;
      stats.appendChild(div);
    });

    $('breakdown-title').textContent = r.breakdownTitle;
    const bd = $('category-breakdown');
    bd.innerHTML = '';
    r.breakdown.forEach((b) => {
      const row = document.createElement('div');
      row.className = 'breakdown-item';
      row.innerHTML = `
        <span class="breakdown-label">${esc(b.label)}</span>
        <span class="breakdown-bar"><span class="breakdown-fill" style="width:${b.pct}%"></span></span>
        <span class="breakdown-score">${esc(b.value)}</span>`;
      bd.appendChild(row);
    });

    $('result-message').textContent = r.message || '';

    // La nota de metodología del tiempo solo aplica a tests cronometrados.
    $('method-box').classList.toggle('hidden', !isTimed(t));

    const disc = $('result-disclaimer');
    disc.textContent = t.disclaimer
      ? t.disclaimer
      : 'Resultado orientativo con fines de entretenimiento, no es un diagnóstico ni una medición certificada.';

    // Revisión (solo quiz).
    const reviewBtn = $('btn-review');
    const reviewWrap = $('review-wrap');
    reviewWrap.innerHTML = '';
    reviewWrap.classList.add('hidden');
    reviewBtn.textContent = 'Ver respuestas';
    if (r.review) {
      reviewBtn.classList.remove('hidden');
      r.review.forEach((rv, i) => {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.innerHTML = `
          <div class="review-q">${i + 1}. ${esc(rv.text)}</div>
          <div class="review-answer ${rv.isCorrect ? 'review-correct' : 'review-wrong'}">Tu respuesta: ${esc(rv.userText)}</div>
          ${rv.isCorrect ? '' : `<div class="review-answer review-correct">Correcta: ${esc(rv.correctText)}</div>`}
          ${!rv.isCorrect && rv.explanation ? `<div class="review-why">💡 ${esc(rv.explanation)}</div>` : ''}`;
        reviewWrap.appendChild(item);
      });
    } else {
      reviewBtn.classList.add('hidden');
    }
  }

  $('btn-review').addEventListener('click', () => {
    const wrap = $('review-wrap');
    const willShow = wrap.classList.contains('hidden');
    wrap.classList.toggle('hidden');
    $('btn-review').textContent = willShow ? 'Ocultar respuestas' : 'Ver respuestas';
  });

  /* ---------------- INFORME / CORREO ---------------- */

  function buildReportPayload() {
    return {
      playerName: session.playerName || '',
      date: new Date().toLocaleString('es-ES'),
      results: Object.values(session.results).map((r) => ({
        title: r.title,
        icon: r.icon,
        headline: r.headline,
        headlineLabel: r.headlineLabel,
        tier: r.tier.label,
        stats: r.stats,
        breakdown: r.breakdown,
        message: r.message,
        speed: r.speedInfo || null
      }))
    };
  }

  function reportToHtml(payload) {
    const blocks = payload.results.map((r) => `
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin:0 0 16px;">
        <h2 style="margin:0 0 4px;font-size:18px;">${r.icon} ${esc(r.title)}</h2>
        <p style="margin:0 0 10px;color:#6b7280;font-size:13px;">${esc(r.headlineLabel)}:
          <strong style="color:#111827;font-size:16px;">${esc(r.headline)}</strong> — ${esc(r.tier)}</p>
        ${r.speed ? `<p style="margin:0 0 8px;font-size:12px;color:#6b7280;">${esc(r.speed.label)} · ${esc(r.speed.detail)}</p>` : ''}
        <p style="margin:0 0 10px;font-size:14px;">${esc(r.message || '')}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          ${r.breakdown.map((b) => `
            <tr>
              <td style="padding:4px 8px;color:#374151;">${esc(b.label)}</td>
              <td style="padding:4px 8px;width:55%;">
                <div style="background:#e5e7eb;border-radius:6px;height:8px;">
                  <div style="background:#7c5cff;height:8px;border-radius:6px;width:${b.pct}%;"></div>
                </div>
              </td>
              <td style="padding:4px 8px;text-align:right;font-weight:bold;">${esc(b.value)}</td>
            </tr>`).join('')}
        </table>
      </div>`).join('');

    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe de tests</title></head>
      <body style="font-family:Arial,Helvetica,sans-serif;background:#f9fafb;color:#111827;margin:0;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;">
          <h1 style="margin:0 0 4px;">🧠 Informe de tests</h1>
          <p style="margin:0 0 20px;color:#6b7280;">
            ${payload.playerName ? esc(payload.playerName) + ' · ' : ''}${esc(payload.date)}
          </p>
          ${blocks || '<p>No hay tests completados.</p>'}
          <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;">
            ⚠️ Resultados recreativos y orientativos. No constituyen un diagnóstico ni una
            evaluación psicológica profesional.
          </p>
        </div>
      </body></html>`;
  }

  function openReport() {
    const summary = $('report-summary');
    summary.innerHTML = '';
    Object.values(session.results).forEach((r) => {
      const row = document.createElement('div');
      row.className = 'report-row';
      row.innerHTML = `
        <span class="report-row-icon">${r.icon}</span>
        <span class="report-row-title">${esc(r.title)}</span>
        <span class="report-row-score">${esc(r.headline)}</span>`;
      summary.appendChild(row);
    });
    // El envío por correo se muestra solo si está habilitado (requiere dominio
    // verificado en Resend); mientras tanto queda la descarga del informe.
    $('report-email-block').classList.toggle('hidden', !EMAIL_ENABLED);

    $('report-status').textContent = '';
    $('report-status').className = 'report-status';
    $('report-modal').classList.remove('hidden');
  }

  function closeReport() {
    $('report-modal').classList.add('hidden');
  }

  function downloadReport() {
    const html = reportToHtml(buildReportPayload());
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'informe-tests.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function sendEmail() {
    const email = $('report-email-input').value.trim();
    const status = $('report-status');
    const btn = $('btn-send-email');

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      status.textContent = 'Introduce un correo válido.';
      status.className = 'report-status error';
      return;
    }

    btn.disabled = true;
    status.textContent = 'Enviando…';
    status.className = 'report-status';

    const payload = buildReportPayload();
    payload.email = email;
    payload.html = reportToHtml(payload);

    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let data = {};
      try { data = await res.json(); } catch (_) {}

      if (res.ok && data.ok) {
        status.textContent = '✔ Informe enviado a ' + email;
        status.className = 'report-status ok';
      } else if (res.status === 501) {
        status.textContent = 'El envío por correo no está configurado en el servidor. Usa «Descargar informe».';
        status.className = 'report-status error';
      } else {
        status.textContent = (data.error || 'No se pudo enviar el correo.') + ' Puedes descargar el informe.';
        status.className = 'report-status error';
      }
    } catch (e) {
      status.textContent = 'No hay conexión con el servidor de correo. Descarga el informe como alternativa.';
      status.className = 'report-status error';
    } finally {
      btn.disabled = false;
    }
  }

  /* ---------------- EVENTOS ---------------- */

  $('btn-intro-back').addEventListener('click', () => { showScreen('hub'); renderHub(); });
  $('btn-start').addEventListener('click', startRun);
  $('btn-retry').addEventListener('click', () => openIntro(run.testId));
  $('btn-result-home').addEventListener('click', () => { showScreen('hub'); renderHub(); });
  $('btn-open-report').addEventListener('click', openReport);
  $('btn-report-close').addEventListener('click', closeReport);
  $('btn-download-report').addEventListener('click', downloadReport);
  $('btn-send-email').addEventListener('click', sendEmail);
  $('report-modal').addEventListener('click', (e) => {
    if (e.target === $('report-modal')) closeReport();
  });

  /* ---------------- INICIO ---------------- */
  renderHub();

})();
