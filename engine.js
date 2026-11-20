// Scheme Finder engine. Pure functions. The model never decides eligibility: it only turns
// a person's words into profile fields. These rules do the deciding, and every result can be traced.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Finder = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const FIELDS = {
    age: { q: 'How old is the person the scheme is for?', type: 'number', label: 'Age' },
    gender: { q: 'Gender?', type: 'choice', options: ['female', 'male', 'other'], label: 'Gender' },
    occupation: { q: 'What work do they do?', type: 'choice', label: 'Work',
      options: ['farmer', 'street_vendor', 'artisan', 'unorganised_worker', 'student', 'salaried', 'self_employed', 'homemaker', 'unemployed', 'retired'] },
    annual_income: { q: 'Roughly what does the family earn in a year (₹)?', type: 'number', label: 'Family income / year' },
    income_tax_payer: { q: 'Does anyone in the family pay income tax?', type: 'bool', label: 'Pays income tax' },
    has_bank_account: { q: 'Do they have a bank or post office account?', type: 'bool', label: 'Bank account' },
    owns_farmland: { q: 'Does the family own farmland?', type: 'bool', label: 'Owns farmland' },
    category: { q: 'Social category?', type: 'choice', options: ['general', 'obc', 'sc', 'st'], label: 'Category' },
    has_pucca_house: { q: 'Does the family own a pucca (permanent) house?', type: 'bool', label: 'Owns pucca house' },
    has_lpg: { q: 'Is there an LPG gas connection at home?', type: 'bool', label: 'LPG at home' },
    pregnant_or_new_mother: { q: 'Is she pregnant or has she recently had a baby?', type: 'bool', label: 'Pregnant / new mother' },
    has_girl_child_under_10: { q: 'Is there a daughter under 10 in the family?', type: 'bool', label: 'Daughter under 10' },
    epfo_member: { q: 'Is PF or ESIC deducted from their pay?', type: 'bool', label: 'Has PF / ESIC' },
    bpl: { q: 'Does the family have a BPL or priority ration card?', type: 'bool', label: 'BPL / priority card' },
    post_matric_student: { q: 'Are they studying after class 10?', type: 'bool', label: 'Studying after class 10' }
  };
  const known = v => v !== undefined && v !== null && v !== '';
  function test(profile, [field, op, val]) {
    const v = profile[field];
    if (!known(v)) return null; // unknown
    switch (op) {
      case 'is': return v === val;
      case 'in': return val.includes(v);
      case 'gte': return Number(v) >= val;
      case 'lte': return Number(v) <= val;
      case 'between': return Number(v) >= val[0] && Number(v) <= val[1];
    }
    throw new Error('Unknown op ' + op);
  }
  const RANK = { eligible: 0, likely: 1, unknown: 2, no: 3 };
  function evalPath(profile, path) {
    const checks = path.when.map(c => ({ field: c[0], text: c[3], pass: test(profile, c) }));
    const failed = checks.filter(c => c.pass === false), open = checks.filter(c => c.pass === null);
    const status = failed.length ? 'no' : open.length ? 'unknown' : path.confirm.length ? 'likely' : 'eligible';
    return { status, checks, confirm: path.confirm, missing: open.map(c => c.field) };
  }
  function evalScheme(profile, s) {
    const paths = s.paths.map(p => evalPath(profile, p));
    const best = paths.slice().sort((a, b) => RANK[a.status] - RANK[b.status] || a.missing.length - b.missing.length)[0];
    return Object.assign({ scheme: s }, best);
  }
  function evaluate(profile, schemes) {
    return schemes.map(s => evalScheme(profile, s)).sort((a, b) => RANK[a.status] - RANK[b.status]);
  }
  // Pick the follow-up question that can settle the most undecided schemes.
  function nextQuestion(profile, schemes, skipped) {
    const votes = {};
    for (const r of evaluate(profile, schemes)) if (r.status === 'unknown') for (const f of new Set(r.missing)) votes[f] = (votes[f] || 0) + 1;
    const best = Object.entries(votes).filter(([f]) => !(skipped || []).includes(f)).sort((a, b) => b[1] - a[1])[0];
    return best ? { field: best[0], settles: best[1], ...FIELDS[best[0]] } : null;
  }

  // ---- Offline keyword reader (English, Hinglish, Hindi). A baseline for the eval, and a fallback
  // when the model is not connected. It only fills a field when it finds explicit evidence.
  function heuristicParse(text) {
    let t = ' ' + text.toLowerCase().replace(/,/g, '') + ' ';
    const p = {}, has = re => re.test(t);
    const girl = t.match(/(?:daughter|beti|बेटी)\D{0,12}(\d{1,2})\s*(?:years?|saal|साल)/);
    if (girl) { if (Number(girl[1]) < 10) p.has_girl_child_under_10 = true; t = t.replace(girl[0], ' '); }
    const age = t.match(/(\d{1,2})\s*(?:years?|yrs?|saal|साल|वर्ष)/) || t.match(/(?:i am|i'm|umar|उम्र)\D{0,12}(\d{1,2})\b/);
    if (age) p.age = Number(age[1]);
    const lakh = t.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|लाख)/);
    const monthA = t.match(/(\d{4,6})\s*(?:rs\.?|rupees|रुपये)?\s*(?:per month|a month|monthly)/), monthB = t.match(/(?:mahine|महीने)\D{0,18}(\d{4,6})/);
    if (lakh) p.annual_income = Math.round(Number(lakh[1]) * 100000); else if (monthA || monthB) p.annual_income = Number((monthA || monthB)[1]) * 12;
    if (has(/\b(woman|female|mahila|pregnant|wife)\b|महिला|गर्भवती/)) p.gender = 'female';
    if (has(/pregnant|garbhvati|गर्भवती/)) p.pregnant_or_new_mother = true;
    const occ = [['farmer', /\b(farmer|kisan|kheti)\b|किसान/], ['street_vendor', /\b(vendor|cart|thela|rehdi)\b|ठेले|रेहड़ी/],
      ['artisan', /\b(carpenter|tailor|potter|blacksmith|cobbler|darzi|badhai|kumhar|lohar)\b|बढ़ई|दर्ज़ी|कुम्हार|लोहार/],
      ['unorganised_worker', /\b(labourer|laborer|mazdoor|construction|domestic worker)\b|मज़दूर/], ['student', /\b(student|bsc|b\.a|college)\b|छात्र/],
      ['salaried', /\b(engineer|salaried|office job|naukri)\b/], ['retired', /\bretired\b/], ['homemaker', /\b(homemaker|housewife|ghar sambhal)/]];
    for (const [name, re] of occ) if (has(re)) { p.occupation = name; break; }
    if (has(/\b(acre|acres|bigha|zameen)\b|एकड़|खेत|ज़मीन/)) p.owns_farmland = true;
    if (has(/(no|don'?t have a?) bank account/)) p.has_bank_account = false; else if (has(/bank account|jan dhan|बैंक खाता/)) p.has_bank_account = true;
    if (has(/(don'?t|do not|no) (pay )?income tax|tax nahi/)) p.income_tax_payer = false; else if (has(/pay income tax/)) p.income_tax_payer = true;
    if (has(/\bno pf\b|pf nahi/)) p.epfo_member = false;
    if (has(/gas connection nahi|no (gas|lpg)|chulhe|चूल्हे/)) p.has_lpg = false;
    if (has(/kutcha|kachcha|कच्चा/)) p.has_pucca_house = false;
    if (has(/\bsc\b|scheduled caste|अनुसूचित जाति/)) p.category = 'sc';
    if (has(/\bbpl\b/)) p.bpl = true;
    if (p.occupation === 'student' && has(/bsc|b\.a|college|बी\.ए/)) p.post_matric_student = true;
    return p;
  }
  const EXTRACT_SYSTEM = 'You read what a person in India says about themselves, or about a family member they are asking for, in English, Hindi or Hinglish. '
    + 'Return only a JSON object using these optional keys: ' + Object.entries(FIELDS).map(([k, f]) => `${k} (${f.type === 'choice' ? f.options.join('|') : f.type === 'bool' ? 'true|false' : 'number'})`).join(', ')
    + '. annual_income is the family’s yearly income in rupees (convert monthly figures). Rules: include a key ONLY if the text clearly states it about the person the scheme is for. '
    + 'Never guess. Details about other relatives (for example a husband’s job) must not be used for occupation. If nothing is stated, return {}.';
  function clean(p) { // keep only valid keys and types from any reader
    const out = {};
    for (const k in FIELDS) {
      const v = p ? p[k] : undefined, f = FIELDS[k];
      if (!known(v)) continue;
      if (f.type === 'number' && isFinite(Number(v))) out[k] = Number(v);
      if (f.type === 'bool' && typeof v === 'boolean') out[k] = v;
      if (f.type === 'choice' && f.options.includes(v)) out[k] = v;
    }
    return out;
  }
  return { FIELDS, evaluate, nextQuestion, heuristicParse, EXTRACT_SYSTEM, clean };
});
