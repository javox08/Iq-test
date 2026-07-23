# Batería de Tests Psicológicos

Web con varios tests recreativos y cronómetro, lista para desplegar en **Cloudflare Pages**.
Al terminar puedes recibir un **informe por correo** (o descargarlo).

## Tests incluidos

**Cognitivos / conocimiento (cronometrados — el tiempo puntúa):**

| Test | Tipo | Mide |
|------|------|------|
| 🧠 Coeficiente Intelectual | Quiz | Lógica, matemáticas, patrones y verbal (25 preguntas, 12 min) |
| 🔢 Razonamiento Numérico | Quiz | Series, cálculo y lógica con números |
| 🧩 Razonamiento Lógico | Quiz | Acertijos y deducciones |
| 🎯 Atención y Concentración | Quiz | Foco, detalle y velocidad |
| 🌍 Cultura General | Quiz | Geografía, ciencia, historia y arte |

**Personalidad / bienestar (sin cronómetro — a tu ritmo):**

| Test | Tipo | Mide |
|------|------|------|
| 🎭 Personalidad (Big Five) | Escala | Apertura, responsabilidad, extraversión, amabilidad, estabilidad |
| 💗 Inteligencia Emocional | Escala | Autoconciencia, autorregulación, motivación, empatía, habilidades sociales |
| 🔗 Estilo de Apego | Escala | Seguro, ansioso, evitativo |
| 💬 Estilo de Comunicación | Escala | Asertivo, pasivo, agresivo |
| 🌟 Autoestima | Escala | Nivel de autoestima |
| ☀️ Optimismo | Escala | Optimismo vs. pesimismo |
| 🌱 Resiliencia | Escala | Capacidad de recuperación (enfoque en fortalezas, no en trauma) |
| 📚 Estilo de Aprendizaje (VARK) | Escala | Visual, auditivo, lectura/escritura, kinestésico |
| 🧘 Estrés y Bienestar | Escala | Nivel de estrés percibido |

> Los tests de escala **no tienen cronómetro** (el tiempo no cambia el resultado: se hacen a
> tu ritmo). Solo los tests de capacidad son cronometrados, porque ahí la velocidad sí puntúa.
> El apartado de "trauma" se trata como **Resiliencia** (en positivo), no como una medida
> clínica de trauma.

- **Banco de preguntas que cambia:** cada test tiene un banco (pool) más grande que el
  número de preguntas mostradas. En cada intento se **barajan las preguntas y las opciones**
  y se elige un subconjunto, así que casi nunca sale igual dos veces.
- **Cronómetro** solo en los tests de capacidad; si se agota, se envía automáticamente.
- **Informe** que agrupa todos los tests hechos en la sesión, enviable por correo o descargable.

> ⚠️ Todos los tests son **recreativos y orientativos**. No son instrumentos clínicos ni
> sustituyen una evaluación psicológica profesional.

## Estructura

```
index.html                  Pantallas (portada, intro, test, resultado, modal informe)
style.css                   Estilos
data.js                     "Base de datos": definición y banco de preguntas de cada test
script.js                   Motor: baraja, cronómetro, puntuación, informe
functions/api/send-report.js   Handler que envía el correo por Resend
worker.js                   Punto de entrada del Worker: enruta /api/send-report y sirve lo estático
wrangler.jsonc              Configuración de Cloudflare Workers (assets + script)
```

## Probar en local (sin correo)

No necesita dependencias:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

El botón de enviar correo dará un aviso de "no configurado" (normal en local, porque no
se ejecuta la función serverless); el botón **Descargar informe** funciona siempre.

Para probar también la función de correo en local usa Wrangler:

```bash
npm i -g wrangler
wrangler pages dev .
```

## Desplegar en Cloudflare Workers (recomendado, ya configurado)

El repo incluye `wrangler.jsonc` y `worker.js`, así que sirve como **Worker con activos
estáticos** y además atiende `/api/send-report`.

1. Sube el repo a GitHub (ya lo está).
2. Cloudflare → **Workers & Pages → Create → Workers → Import a repository** y elige el repo.
3. No hace falta build command. Cloudflare usará `wrangler.jsonc` (que ya trae `main: worker.js`).
4. Deploy. Tu web quedará en `https://<nombre>.<subdominio>.workers.dev`.

> Importante: en modo Workers, la carpeta `functions/` **no** se enruta sola (eso es de
> Cloudflare *Pages*). Por eso `worker.js` la llama a mano. Si tu `wrangler.jsonc` solo
> tuviera `assets` sin `main`, el endpoint del correo no existiría.

## Configurar el envío de correo (Resend)

> El envío por correo está **desactivado** de momento (constante `EMAIL_ENABLED = false`
> en `script.js`): en el informe solo se ofrece descargar. Para reactivarlo hace falta un
> dominio verificado en Resend; luego pon `EMAIL_ENABLED = true`.

El correo se envía con [Resend](https://resend.com) (tiene plan gratuito).

1. Crea una cuenta en Resend y genera una **API key** (empieza por `re_`).
2. En Cloudflare → tu Worker → **Settings → Variables and Secrets** (Variables y secretos),
   añade:
   - `RESEND_API_KEY` = tu API key (márcala como *Secret*).
   - `REPORT_FROM` *(opcional)* = remitente, p.ej. `Tests <informe@tudominio.com>`.
     Para un dominio propio debes verificarlo en Resend. Sin esta variable se usa el
     remitente de pruebas `onboarding@resend.dev` (con él Resend solo deja enviar a tu
     propio correo de la cuenta, útil para probar).
3. Vuelve a desplegar (o **Retry deployment**) para que tome las variables.

Si `RESEND_API_KEY` no está configurada, la web sigue funcionando: el envío por correo
avisa de que no está disponible y el usuario puede **descargar** el informe.

## (Alternativa) Desplegar como Cloudflare Pages

También funciona como Pages: **Create → Pages → Connect to Git**, framework *None*, build
vacío, output `/`. En ese modo la carpeta `functions/` se enruta sola y `worker.js`/
`wrangler.jsonc` se ignoran. Las variables van en **Settings → Environment variables**.

## Personalizar

- **Añadir/editar preguntas o tests:** edita `data.js`. Cada test define `type`
  (`quiz` o `scale`), `timeLimit` (segundos), `pick` (cuántas preguntas mostrar) y su `pool`.
- **Cambiar cuántas preguntas salen:** ajusta `pick` (debe ser ≤ tamaño del `pool`).
- **Tiempo de un test:** ajusta `timeLimit`.
- **Escala de CI 40–160** (escala Wechsler: media 100, desviación 15), con las bandas de
  clasificación oficiales hasta "Superdotado excepcional" (≥160). Por encima de 160 se sale
  de lo que miden los tests estándar.
- **El tiempo afecta al resultado** (basado en la investigación sobre velocidad mental):
  - En tests de capacidad (CI, atención) la rapidez suma un bonus acotado, siempre
    multiplicado por los aciertos: CI = `40 + aciertos·105 + (bonus ≤15)·rapidez·aciertos`
    (Jensen 2006; Deary, Der & Ford 2001; Sheppard & Vernon 2008; bonus por rapidez tipo WAIS).
  - En tests de personalidad el tiempo NO altera el perfil; se muestra como indicador de
    calidad (respuestas <2 s/ítem = posible respuesta poco reflexiva, Huang et al. 2012).
  - Ajusta los pesos en la constante `SPEED` de `script.js`.
- **Explicaciones**: en los tests tipo quiz, al ver las respuestas se muestra el porqué de
  cada fallo (campo `explanation` de cada pregunta en `data.js`).
- **Precisión tipo test real**:
  - Todos los quizzes etiquetan cada pregunta con `difficulty` (1–3) y definen un `mix`:
    cada intento sirve la **misma proporción de fáciles/difíciles** (muestreo estratificado),
    y **acertar preguntas difíciles puntúa más** (puntuación ponderada por dificultad).
  - Las escalas multidimensión usan **muestreo equilibrado por dimensión** (mismo número de
    ítems por rasgo en cada intento), para que los perfiles sean comparables y fiables.
- **Banco ampliado**: el CI tiene 86 preguntas y muestra 25 (12 min); el resto de quizzes
  también tienen bancos mayores que su `pick` para que roten en cada intento.
- **Optimizado para conversión**: CTA directo al test de CI en la portada, botón de
  "siguiente test" al terminar (encadena la batería) y metadatos Open Graph para compartir.
- **Diseño responsive (móvil, tablet y PC)**: la portada usa varias columnas en pantallas
  anchas (1 en móvil, 2 en tablet, hasta 4 en PC) mientras las pantallas de test se mantienen
  centradas y legibles.
- **Sin caché obsoleta**: `worker.js` sirve los archivos con `Cache-Control: no-cache`, así
  que tras un despliegue el navegador siempre carga la versión nueva (antes podían "salir
  siempre las mismas preguntas" por servir JS antiguo desde caché).
