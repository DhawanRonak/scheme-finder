// node eval/run_eval.mjs            -> rule tests + keyword reader scores (offline)
// GEMINI_API_KEY=... GEMINI_MODEL=... node eval/run_eval.mjs --model  -> also scores the live model
import { createRequire } from 'module'; import assert from 'assert'; const require = createRequire(import.meta.url);
const F = require('../engine.js'), SCHEMES = require('../schemes.js'), PERSONAS = require('./personas.js');

// 1) Rule tests: hand-worked cases. If a rule changes, these must be updated on purpose.
const status = (p, id) => F.evaluate(p, SCHEMES).find(r => r.scheme.id === id).status;
const farmer = { age: 34, occupation: 'farmer', owns_farmland: true, annual_income: 120000, income_tax_payer: false, has_bank_account: true, epfo_member: false };
assert.equal(status(farmer, 'pmkisan'), 'likely'); assert.equal(status(farmer, 'pmjjby'), 'eligible'); assert.equal(status(farmer, 'apy'), 'likely');
assert.equal(status(farmer, 'pmsym'), 'likely'); assert.equal(status(farmer, 'ignoaps'), 'no'); assert.equal(status(farmer, 'svanidhi'), 'no');
assert.equal(status({ age: 72 }, 'pmjay'), 'eligible'); assert.equal(status({ age: 72 }, 'pmjjby'), 'no'); assert.equal(status({ age: 72 }, 'pmsby'), 'no');
assert.equal(status({ age: 45 }, 'pmjay'), 'unknown'); assert.equal(status({ age: 45, bpl: true }, 'pmjay'), 'likely'); assert.equal(status({ age: 45, bpl: false }, 'pmjay'), 'no');
assert.equal(status({ category: 'sc', post_matric_student: true, annual_income: 300000 }, 'pms_sc'), 'no');
assert.equal(status({ age: 41, income_tax_payer: false, has_bank_account: true }, 'apy'), 'no');
assert.equal(status({}, 'pmkisan'), 'unknown');
const q = F.nextQuestion({}, SCHEMES); assert.equal(q.field, 'age'); // age settles the most schemes for an empty profile
assert.equal(F.nextQuestion(farmer, SCHEMES, []) === null || typeof F.nextQuestion(farmer, SCHEMES, []).field === 'string', true);

// Regression coverage: unsafe input, OR paths, boundaries, skips and cautious display.
assert.deepEqual(F.clean({age:true,annual_income:'  '}), {});
for (const age of [-1, 121, 2.5, Infinity, 'NaN']) assert.deepEqual(F.clean({age}), {});
assert.deepEqual(F.clean({age:'0',annual_income:0,has_bank_account:false}), {age:0,annual_income:0,has_bank_account:false});
assert.equal(status({age:-1,has_bank_account:true}, 'pmjjby'), 'unknown');
for (const age of [18,50]) assert.equal(status({age,has_bank_account:true}, 'pmjjby'), 'eligible');
for (const age of [17,51]) assert.equal(status({age,has_bank_account:true}, 'pmjjby'), 'no');
assert.equal(status({age:72,bpl:false}, 'pmjay'), 'eligible');
assert.notEqual(F.nextQuestion({},SCHEMES,['age']).field,'age');
assert.equal(F.nextQuestion({},SCHEMES,Object.keys(F.FIELDS)), null);
assert.equal(F.resultStatus(F.evaluate({age:72},SCHEMES).find(r=>r.scheme.id==='pmjay')), 'maybe');
assert.equal(F.resultStatus({status:'eligible',scheme:{verified_on:'2026-11-22'}}), 'eligible');
assert.equal(F.resultStatus({status:'no',scheme:{}}), 'no');
assert.equal(F.heuristicParse('I am a 24 year old woman. My husband is a labourer.').occupation, undefined);
assert.equal(F.heuristicParse('I do not own land. No BPL card.').owns_farmland, false);
assert.equal(F.heuristicParse('I do not own land. No BPL card.').bpl, false);
assert.equal(F.heuristicParse('\u092e\u0948\u0902 \u0969\u096a \u0938\u093e\u0932 \u0915\u093e \u0915\u093f\u0938\u093e\u0928 \u0939\u0942\u0901').age,34);
for(const s of SCHEMES){assert.ok(s.docs.length);assert.match(s.url,/^https:\/\//);assert.ok(s.paths.length);}
console.log('Rule and regression tests: all passed');

// 2) Reading accuracy by language
async function viaModel(text) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: F.EXTRACT_SYSTEM }] }, contents: [{ role: 'user', parts: [{ text }] }], generationConfig: { temperature: 0, responseMimeType: 'application/json' } }) });
  const d = await r.json(); if (!r.ok) throw new Error(d.error?.message);
  return JSON.parse(d.candidates[0].content.parts.map(p => p.text || '').join('').replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, ''));
}
async function score(name, fn) {
  const by = {};
  for (const p of PERSONAS) {
    const out = F.clean(await fn(p.text)), b = (by[p.lang] = by[p.lang] || { stated: 0, right: 0, wrong: 0, missed: 0, invented: 0, wrongResult: 0, n: 0 });
    b.n++;
    for (const k in p.gold) { b.stated++; if (!(k in out)) b.missed++; else if (out[k] === p.gold[k]) b.right++; else b.wrong++; }
    for (const k in out) if (!(k in p.gold)) b.invented++;
    // Does the reading error change any scheme result in the unsafe direction (says yes when the truth is not yes)?
    const g = F.evaluate(p.gold, SCHEMES), o = F.evaluate(out, SCHEMES);
    if (o.some(r => ['eligible', 'likely'].includes(r.status) && !['eligible', 'likely'].includes(g.find(x => x.scheme.id === r.scheme.id).status))) b.wrongResult++;
  }
  console.log(`\n${name}`);
  console.log('  lang      fields right | missed | wrong | invented | people shown a scheme they may not qualify for');
  for (const [l, b] of Object.entries(by)) console.log(`  ${l.padEnd(9)} ${(b.right / b.stated * 100).toFixed(0).padStart(4)}%        | ${String(b.missed).padStart(4)}   | ${String(b.wrong).padStart(3)}   | ${String(b.invented).padStart(4)}     | ${b.wrongResult} of ${b.n}`);
}
await score('Keyword reader (offline baseline)', async t => F.heuristicParse(t));
if (process.argv.includes('--model')) await score('Live model: ' + process.env.GEMINI_MODEL, viaModel);
await import('./server_eval.mjs');
