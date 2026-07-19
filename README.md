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
functions/api/send-report.js   Función serverless de Cloudflare que envía el correo (Resend)
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

## Desplegar en Cloudflare Pages

1. Sube el repo a GitHub (ya lo está).
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** y elige el repo.
3. Configuración de build:
   - **Framework preset:** None
   - **Build command:** *(vacío)*
   - **Build output directory:** `/`
4. Deploy. Cloudflare detecta la carpeta `functions/` y publica `/api/send-report`
   automáticamente.

## Configurar el envío de correo (Resend)

El correo se envía con [Resend](https://resend.com) (tiene plan gratuito).

1. Crea una cuenta en Resend y genera una **API key** (empieza por `re_`).
2. En Cloudflare Pages → tu proyecto → **Settings → Environment variables**, añade:
   - `RESEND_API_KEY` = tu API key.
   - `REPORT_FROM` *(opcional)* = remitente, p.ej. `Tests <informe@tudominio.com>`.
     Para usar un dominio propio debes verificarlo en Resend. Sin esta variable se usa
     el remitente de pruebas `onboarding@resend.dev` (útil para probar enviándote a ti mismo).
3. Vuelve a desplegar para que tome las variables.

Si `RESEND_API_KEY` no está configurada, la web sigue funcionando: el envío por correo
avisa de que no está disponible y el usuario puede **descargar** el informe.

## Personalizar

- **Añadir/editar preguntas o tests:** edita `data.js`. Cada test define `type`
  (`quiz` o `scale`), `timeLimit` (segundos), `pick` (cuántas preguntas mostrar) y su `pool`.
- **Cambiar cuántas preguntas salen:** ajusta `pick` (debe ser ≤ tamaño del `pool`).
- **Tiempo de un test:** ajusta `timeLimit`.
- La estimación de CI es un mapeo lineal orientativo (55–145 según % de aciertos).
