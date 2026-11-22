# PRD: Scheme Finder — government schemes you qualify for, in your own words

Author: Ronak Dhawan · Status: concept, pre-research · Last updated: 16 Nov 2026
Product area this maps to: Search and AI assistants in India. Independent concept, no company or government branding.

## 1. Problem
India has thousands of central and state welfare schemes, and people who qualify often do not know it. The government's own portal, myScheme, lists 4,000+ schemes and offers a filter-based eligibility check and a chatbot. That solves the catalogue problem. Two gaps remain:
1. **Discovery happens elsewhere.** People ask a search box, an assistant, a relative or a shop owner, in spoken Hindi or Hinglish, not through a 15-field form.
2. **An AI answer here must not be wrong.** Telling someone they qualify when they do not costs them a wasted trip, a day's wage and trust. A fluent model that guesses is worse than no answer.

Sources: https://www.myscheme.gov.in/about · https://en.vikaspedia.in/viewcontent/e-governance/digital-india/myscheme-national-platform · https://www.myscheme.gov.in/faqs

## 2. Who it is for
- Primary: a first-generation smartphone user, more comfortable speaking or typing Hinglish than filling forms, asking for themselves or a parent.
- Secondary: the helper (a student, shop owner or volunteer) who looks things up for others.

## 3. Hypotheses (to be tested)
- H1. People describe their situation in one or two sentences that already contain three or more eligibility facts.
- H2. People tolerate at most about five follow-up questions if each one visibly unlocks a result.
- H3. A reason next to every result ("aged 18 to 40: yes") raises trust more than a confidence score.
- H4. Reading accuracy is lower for Hinglish and Hindi than for English, and the errors that matter are invented facts, not missed ones.

## 4. Product principle
**The model reads; rules decide.** The model's only job is to turn a sentence into profile fields. Eligibility comes from fixed rules stored as data, so every tick and cross can be traced, tested and corrected by a non-engineer. If the model is unsure it must leave the field empty, and the product asks.

## 5. Flow
1. Select English, Hindi or Hinglish. A skippable four-step tour appears on first visit and is reopenable from the header.
2. Start a conversation for yourself or a family member, or load a realistic farmer example. An optional description reader fills facts; structured answers work without AI.
3. Answer one question at a time, prioritised by missing checks across undecided schemes. Skip questions and revisit later. There is no five-question hard stop.
4. Review and correct saved facts. Refresh restores profile, draft, language and conversation from localStorage. Reset clears saved work.
5. Three visible states: Eligible (all checks match, no unresolved conditions, verified rules), Maybe (missing facts, extra conditions or unverified rules), Not eligible (a stored check fails). Reasons distinguish missing facts from other conditions. Negative cards are collapsible.
6. Every card includes benefit, reasons, documents, official link and verification status. Keep a check-the-official-page note beside results. Source details remain in English; conversation and controls are translated.

## 6. Requirements
P0
- Free-text input in English, Hindi, Hinglish; editable facts.
- Deterministic rules engine with four internal states, three visible result states and reasons (`engine.js`, `schemes.js`).
- Follow-up picker prioritising fields affecting the most undecided schemes; one answer is not guaranteed to settle them.
- "Rules verified on" date per scheme; unverified rules are labelled.
- Only label a result Eligible when rules are verified and every condition is checked. Use Maybe for missing facts, unchecked conditions or unverified rules. Household income and tax facts cannot establish individual income or tax eligibility.
P1
- Voice input and read-aloud. State schemes. "Ask for someone else" mode.
P2
- Document checklist with where to get each document; nearest help centre.

## 7. Success metrics
- North star: people per week who reach at least one "You qualify" or "Likely" result and open the official link.
- Guardrail 1: share of sessions where a reading error shows a scheme the person may not qualify for. Target under 1%.
- Guardrail 2: invented facts per 100 sessions (facts removed with ×).
- Efficiency: follow-up questions per session; drop-off per question.

## 8. Evaluation plan (in `eval/`)
- **Rule tests.** Hand-worked cases assert the engine's output. They fail on purpose when a rule changes.
- **Reading accuracy by language.** 18 sentences (6 English, 6 Hinglish, 6 Hindi) with the facts a careful person would read. Scored per language: fields right, missed, wrong, invented, and the number of people who would be shown a scheme they may not qualify for. Runs for the keyword baseline offline and for the live model with `--model`.
- **Next step.** Replace the starter sentences with real ones from 8–10 conversations, and have a second person write the gold facts.

## 9. Known limits of this version
- The 15 scheme rules were written from memory of public guidelines and are **not yet verified** against official pages. Verify each before any demo to users.
- Central schemes only. No state schemes, no application tracking.
- Income and category are self-reported.

## 10. Risks
- Stale rules. Mitigation: verified-on date, an owner per scheme, monthly re-check.
- False hope. Mitigation: "Likely" state, official link, no promise language.
- Sensitive data (caste, income). Mitigation: answers and drafts stay in localStorage on this device, with a saved status and Reset. Optional descriptions go to the server-side reader and Gemini; direct answers stay local. Never request identity or account numbers.
- Scam look-alikes. Mitigation: only official government links; never collect Aadhaar or bank details.

## 11. Research script (15 minutes)
1. Tell me about the last time you or your family tried to get a government benefit. What happened?
2. (Hand over the prototype.) Describe yourself the way you would to a helpful person at a counter.
3. Were the facts it understood right? Which question annoyed you?
4. Which result do you believe least? What would make you believe it?
