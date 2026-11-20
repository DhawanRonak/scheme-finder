# Scheme Finder

**Government schemes you may qualify for, from one sentence in your own language.**

> Independent concept prototype for a product-management case study. Not affiliated with any company; all data is made up.

**Live demo:** _add your `pages.dev` link here after deploying_  
**Product spec:** [PRD.md](PRD.md)

## The problem

People describe their situation in English, Hindi or Hinglish. A model reads that into a few profile facts, which the person can correct. Fixed, auditable rules then decide eligibility for 15 central schemes, and every result shows why. The product asks at most five follow-up questions, always choosing the one that settles the most undecided schemes.

## What the prototype does

- Free-text input in three languages, with editable "what we understood" facts.
- Four result states: you qualify, likely (with things to confirm), need one more detail, not for you, each with the rule-by-rule reason.
- Follow-up question picker that maximises schemes settled per question.

## Run it

No build step and no dependencies. Open `index.html` in a browser.

Tests need Node 18 or later:

```
node eval/run_eval.mjs
```

To also score the live model:

```
GEMINI_API_KEY=... GEMINI_MODEL=... node eval/run_eval.mjs --model
```

## Deploy (Cloudflare Pages, free)

1. In the [Cloudflare dashboard](https://dash.cloudflare.com), go to **Workers & Pages → Create → Pages → Connect to Git** and pick this repository.
2. Build settings: framework preset **None**, build command `exit 0`, build output directory `/`. Save and deploy.
3. You get a link like `scheme-finder.pages.dev`. Every push to `main` redeploys automatically.
4. To switch on the live model, open the project's **Settings → Variables and Secrets** and add:
   - `GEMINI_API_KEY`, from [Google AI Studio](https://aistudio.google.com/apikey). Turn on **Encrypt** so it is stored as a secret.
   - `GEMINI_MODEL`, a current Flash model name from the [models page](https://ai.google.dev/gemini-api/docs/models).

   Then redeploy (**Deployments → … → Retry deployment**). The server function in `functions/api/gemini.js` reads them; the key never reaches the browser.

Without the key the prototype still works, using a simple offline keyword reader, and says so on screen. Never put the key in any file in this repository.

Then paste the live link at the top of this README.

## Files

| File | What it is |
|---|---|
| `engine.js` | Rules engine, question picker and offline keyword reader (pure functions) |
| `schemes.js` | The 15 scheme rules, stored as data |
| `index.html` | The prototype |
| `functions/api/gemini.js` | Cloudflare Pages Function that calls the Gemini API |
| `eval/run_eval.mjs` | Rule tests and reading accuracy by language |
| `eval/personas.js` | 18 test sentences with the facts a careful reader would extract |
| `PRD.md` | Product requirements: problem, hypotheses, requirements, metrics, evaluation plan, risks |
| `base.css` | Shared styles |

## What is real and what is not

- **The scheme rules were written from memory and are not yet verified** against official pages. Each scheme shows "rules not yet verified" until `verified_on` is set in `schemes.js`.
- The 18 test sentences were written by the author. Replace them with real ones from user conversations before quoting accuracy.

## Author

Ronak Dhawan · product management portfolio
