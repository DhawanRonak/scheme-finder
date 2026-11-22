# Scheme Finder

Find government schemes for yourself or a family member through a guided conversation in English, Hindi or Hinglish.

## Features

- One question at a time, with skip, correction and revisit controls. Continue until available checks are answered or skipped.
- A realistic farmer example loads results immediately.
- A skippable four-step first-visit tour, reopenable from **How it works**.
- Eligible / Maybe / Not eligible cards with reasons, documents, verification status and official links. Missing facts and unchecked conditions stay explicit.
- Profile, conversation, language and description draft saved in localStorage. **Reset** clears saved work; tour completion is remembered separately.
- Optional AI description reader with a seven-second client timeout and offline fallback. Direct answers need no AI.
- Responsive layout, keyboard focus indicators, labeled inputs and reduced-motion support.

Conversation, controls, statuses and questions are translated. Scheme names, benefits, documents and detailed rule text remain in English, with a contextual note in Hindi/Hinglish mode.

## Run and test

Plain HTML, CSS and JavaScript; no build step or runtime dependencies. Node 18+ is needed for tests and the local server.

```sh
node eval/serve.mjs
```

Open http://127.0.0.1:4173. This development server deliberately returns an unavailable AI endpoint so the fallback can be exercised.

```sh
node eval/run_eval.mjs
```

Runs rule/input/parser regressions, API-function tests and the authored reading evaluation. The score table is diagnostic, not measured accuracy on real users. To score the live reader, set `GEMINI_API_KEY` and `GEMINI_MODEL` in the shell environment and run `node eval/run_eval.mjs --model`.

Manual browser checks: at 375px and 1280px, complete/skip/reopen the tour; try the example; switch languages; edit a fact; refresh; reset; submit an invalid age; skip all questions and revisit; submit a description with the endpoint unavailable. Check horizontal scrolling and JavaScript console errors.

Browser verification could not be completed in this environment: browser preview was unavailable and headless Chrome failed during GPU initialization. Local serving returned HTTP 200; source syntax and automated non-browser tests passed.

## Deploy to Cloudflare Pages

1. Connect this repository to a Cloudflare Pages project.
2. Use framework **None**, build command `exit 0`, output directory `/` (repository root).
3. Deploy. `functions/api/gemini.js` serves `POST /api/gemini`.
4. For AI reading, add `GEMINI_API_KEY` as an encrypted server secret and `GEMINI_MODEL` as your supported Gemini model identifier. Redeploy after setting them. Without these values, direct answers and offline reading still work.

Never put an API key in client JavaScript. On a static-only host the AI route is unavailable and the offline reader is used.

## Privacy and persistence

Answers and the description draft are stored in this browser on this device; someone using the same browser profile can reopen them. Reset clears saved work. Storage failure is reported and the app continues in memory. No Aadhaar, bank account number or document upload is requested. Submitting an optional description sends it to the server-side reader when available, which forwards it to Gemini. Direct answers are evaluated locally. No analytics or application submission is implemented.

## What is real and what is not

- The rules engine, guided questions, local persistence, document lists, official links and optional server-side AI integration are implemented.
- The 15 real scheme names have starter rules originally written from memory. **None has been verified against current official guidelines.** No verification dates have been invented. Matching unverified rules display **Maybe**. Results remind people to check the official page.
- Fixed checks can reject a profile against stored rules; this is not an official decision. The catalogue is incomplete, may be stale and has no state-specific discovery.
- Individual income/tax conditions cannot be established from household answers. Affected schemes require confirmation rather than treating household facts as personal eligibility facts.
- The offline reader may miss details or misunderstand unsupported phrasing. Correct any fact or use structured questions instead.
- The 18 evaluation descriptions are authored examples, not user research. There are no measured adoption or outcome claims.
- No application submission, live beneficiary lookup, identity verification, voice input or application tracking is provided.

## Files

`index.html`, `base.css`, `app.js`: interface and state. `engine.js`, `schemes.js`: Node-compatible pure rules and data. `functions/api/gemini.js`: secret-backed reader. `eval/`: tests, examples and local server. [PRD.md](PRD.md): product requirements.
