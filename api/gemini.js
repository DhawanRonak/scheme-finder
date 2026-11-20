// Vercel serverless function: keeps the API key on the server.
// Set env vars in Vercel: GEMINI_API_KEY (required), GEMINI_MODEL (required: pick a current
// Flash model from https://ai.google.dev/gemini-api/docs/models ; names change often).
// POST { system: string, user: string }  ->  { json: <parsed object> } | { error }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const key = process.env.GEMINI_API_KEY, model = process.env.GEMINI_MODEL;
  if (!key || !model) return res.status(500).json({ error: 'Set GEMINI_API_KEY and GEMINI_MODEL' });
  const { system = '', user = '' } = req.body || {};
  if (!user || user.length > 4000) return res.status(400).json({ error: 'Bad input' });
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 0, responseMimeType: 'application/json' }
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data.error?.message || 'Model error' });
    const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    return res.status(200).json({ json: JSON.parse(clean) });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
}
