# Batería de Tests Psicológicos

Web con varios tests recreativos y cronómetro, lista para desplegar en **Cloudflare Pages**.
Al terminar puedes recibir un **informe por correo** (o descargarlo).

## Tests incluidos

| Test | Tipo | Mide |
|------|------|------|
| 🎭 Personalidad (Big Five) | Escala | Apertura, responsabilidad, extraversión, amabilidad, estabilidad |
| 💗 Inteligencia Emocional | Escala | Autoconciencia, autorregulación, motivación, empatía, habilidades sociales |
| 📚 Estilo de Aprendizaje (VARK) | Escala | Visual, auditivo, lectura/escritura, kinestésico |
| 🧘 Estrés y Bienestar | Escala | Nivel de estrés percibido |
| 🎯 Atención y Concentración | Quiz | Foco, detalle y velocidad (contrarreloj) |
| 🧠 Coeficiente Intelectual | Quiz | Lógica, matemáticas, patrones, razonamiento verbal |

- **Banco de preguntas que cambia:** cada test tiene un banco (pool) más grande que el
  número de preguntas mostradas. En cada intento se **barajan las preguntas y las opciones**
  y se elige un subconjunto, así que casi nunca sale igual dos veces.
- **Cronómetro** por test; si se agota, se envía automáticamente.
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
- **El tiempo afecta al resultado** (basado en la investigación sobre velocidad mental):
  - En tests de capacidad (CI, atención) la rapidez suma un bonus acotado, siempre
    multiplicado por los aciertos: CI = `55 + aciertos·80 + (bonus ≤10)·rapidez·aciertos`
    (Jensen 2006; Deary, Der & Ford 2001; Sheppard & Vernon 2008; bonus por rapidez tipo WAIS).
  - En tests de personalidad el tiempo NO altera el perfil; se muestra como indicador de
    calidad (respuestas <2 s/ítem = posible respuesta poco reflexiva, Huang et al. 2012).
  - Ajusta los pesos en la constante `SPEED` de `script.js`.
