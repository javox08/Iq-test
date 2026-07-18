# Test de CI

Web estática de un test de coeficiente intelectual con cronómetro: 20 preguntas de
lógica, matemáticas, patrones y razonamiento verbal, 10 minutos de límite, y una
pantalla final con puntuación, estimación de CI orientativa y desglose por categoría.

Es HTML/CSS/JS puro (sin frameworks ni proceso de build), lo que la hace directamente
desplegable en Cloudflare Pages.

## Estructura

- `index.html` — estructura de las 3 pantallas (inicio, test, resultados)
- `style.css` — estilos
- `script.js` — lógica del test, cronómetro, banco de preguntas y cálculo de resultados

## Probar en local

No requiere instalación de dependencias. Basta con servir la carpeta con cualquier
servidor estático, por ejemplo:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Desplegar en Cloudflare Pages

1. Sube este repositorio a GitHub (ya lo está).
2. En el dashboard de Cloudflare, ve a **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecciona el repositorio `Iq-test`.
4. En la configuración de build:
   - **Framework preset:** None
   - **Build command:** (déjalo vacío)
   - **Build output directory:** `/`
5. Deploy. Cloudflare te dará una URL tipo `iq-test.pages.dev`.

Cada push a la rama configurada como producción se desplegará automáticamente.

## Personalizar

- Cambiar el tiempo total: constante `TOTAL_TIME` (segundos) en `script.js`.
- Añadir/editar preguntas: array `QUESTIONS` en `script.js` (cada una con `category`,
  `text`, `options` y el índice `correct`).
- La fórmula de estimación de CI es orientativa (mapeo lineal 55–145 según % de
  aciertos) y está pensada con fines recreativos, no clínicos.
