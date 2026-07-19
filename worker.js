/*
 * Punto de entrada del Worker (modo "Workers con activos estáticos").
 *
 * Cloudflare Workers NO usa la carpeta `functions/` de Pages automáticamente,
 * así que aquí enrutamos a mano:
 *   - /api/send-report  -> función que envía el informe por correo (Resend)
 *   - cualquier otra ruta -> se sirve el archivo estático correspondiente
 */
import { onRequest } from './functions/api/send-report.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/send-report') {
      return onRequest({ request, env, ctx });
    }

    // Todo lo demás: HTML, CSS, JS, etc. desde los activos estáticos.
    return env.ASSETS.fetch(request);
  }
};
