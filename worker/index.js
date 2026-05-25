const SYSTEM_AR = `أنت Sirius AI — مستشار أسواق مالية لشركة Sirius Fx.
تخصصك: فوركس، معادن (ذهب)، إدارة مخاطر، جلسات التداول، تحليل فني مبسط.
قواعد: رد بالعربية، مختصر وعملي، لا تعد بأرباح مضمونة، ذكّر أنها ليست نصيحة استثمارية.
للإشارات والكورسات: https://t.me/srfx0`;

const SYSTEM_EN = `You are Sirius AI — market assistant for Sirius Fx.
Focus: forex, gold, risk management, sessions, simple technical view.
Rules: concise, practical, no guaranteed profits, not financial advice.
Signals & courses: https://t.me/srfx0`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (url.pathname === '/' && request.method === 'GET') {
      return json({
        ok: true,
        service: 'Sirius Fx AI API',
        endpoints: { chat: 'POST /chat' },
      });
    }

    if (url.pathname === '/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const message = (body.message || '').trim();
        const lang = body.lang === 'en' ? 'en' : 'ar';
        const rates = body.rates || {};

        if (!message) {
          return json({ error: 'message required' }, 400);
        }

        let ratesBlock = '';
        if (rates && Object.keys(rates).length) {
          ratesBlock =
            lang === 'ar'
              ? '\nأسعار حية من الموقع:\n' + JSON.stringify(rates, null, 0)
              : '\nLive rates from site:\n' + JSON.stringify(rates, null, 0);
        }

        const system = (lang === 'ar' ? SYSTEM_AR : SYSTEM_EN) + ratesBlock;

        if (!env.AI) {
          return json({
            reply:
              lang === 'ar'
                ? 'الذكاء الاصطناعي غير مفعّل على السيرفر. فعّل Workers AI في wrangler.toml ثم أعد النشر.'
                : 'AI binding not configured on worker. Enable Workers AI and redeploy.',
          });
        }

        const result = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: message },
          ],
          max_tokens: 512,
        });

        const reply =
          result?.response ||
          result?.text ||
          (typeof result === 'string' ? result : null);

        if (!reply) {
          return json({ error: 'empty model response' }, 502);
        }

        return json({ reply: reply.trim(), lang });
      } catch (err) {
        return json({ error: err.message || 'server error' }, 500);
      }
    }

    return json({ error: 'not found' }, 404);
  },
};
