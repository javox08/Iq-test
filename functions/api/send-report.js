/*
 * Cloudflare Pages Function: /api/send-report
 *
 * Envía el informe de tests por correo usando Resend (https://resend.com).
 *
 * Variables de entorno (Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY  (obligatoria) -> tu API key de Resend (empieza por "re_").
 *   REPORT_FROM     (opcional)    -> remitente verificado, p.ej. "Tests <informe@tudominio.com>".
 *                                    Si no la pones, se usa el remitente de pruebas de Resend.
 *
 * Sin RESEND_API_KEY la función responde 501 y el frontend ofrece descargar el informe.
 */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return json({ ok: false, error: 'Método no permitido.' }, 405);
  }

  let payload;
  try {
    payload = await request.json();
  } catch (_) {
    return json({ ok: false, error: 'Cuerpo de la petición no válido.' }, 400);
  }

  const email = ((payload && payload.email) || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: 'Correo destinatario no válido.' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'Envío de correo no configurado.' }, 501);
  }

  // El HTML se genera en el cliente; si no llegó, montamos uno mínimo.
  const html = typeof payload.html === 'string' && payload.html.length > 0
    ? payload.html
    : `<h1>Informe de tests</h1><p>${escapeHtml((payload && payload.playerName) || '')}</p>`;

  const from = env.REPORT_FROM || 'Tests <onboarding@resend.dev>';
  const subject = payload.playerName
    ? `Informe de tests · ${payload.playerName}`
    : 'Tu informe de tests';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to: [email], subject, html })
    });

    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json()).message || ''; } catch (_) {}
      return json({ ok: false, error: 'El proveedor rechazó el envío. ' + detail }, 502);
    }

    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: 'Error al contactar con el proveedor de correo.' }, 500);
  }
}
