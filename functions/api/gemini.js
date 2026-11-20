// Cloudflare Pages Function, served at POST /api/gemini.
// Keeps the Gemini API key on the server. Set two variables in the Cloudflare dashboard
// (Workers & Pages > this project > Settings > Variables and Secrets):
//   GEMINI_API_KEY  (as an encrypted secret)
//   GEMINI_MODEL    a current Flash model name from https://ai.google.dev/gemini-api/docs/models
// Request:  { system: string, user: string }
// Response: { json: <parsed object> }  or  { error: string }
const reply = (body, status) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

export async function onRequestPost({ request, env }) {
  const key = env.GEMINI_API_KEY, model = env.GEMINI_MODEL;
  if (!key || !model) return reply({ error: 'Set GEMINI_API_KEY and GEMINI_MODEL' }, 500);
  let body;
  try { body = await request.json(); } catch (e) { return reply({ error: 'Send JSON' }, 400); }
  const system = String(body.system || ''), user = String(body.user || '');
  if (!user || user.length > 4000 || system.length > 8000) return reply({ error: 'Bad input' }, 400);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 0, responseMimeType: 'application/json' }
      })
    });
    const data = await r.json();
    if (!r.ok) return reply({ error: (data.error && data.error.message) || 'Model error' }, 502);
    const text = ((data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || []).map(p => p.text || '').join('');
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    return reply({ json: JSON.parse(clean) }, 200);
  } catch (e) {
    return reply({ error: String((e && e.message) || e) }, 502);
  }
}

// Anything other than POST gets a clear answer instead of the site's 404 page.
export const onRequest = () => reply({ error: 'POST only' }, 405);
