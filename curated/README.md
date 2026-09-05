# Curated bank — Shaan's hand-picked 21st.dev components

Not the 7,949-component corpus. This is the shortlist Shaan personally picked, with his
verbatim reaction next to every one, grouped into apples-to-apples **types** so A/B calls are
between like and like (five line charts against each other, not a line chart against a login).

## Files

| File | What |
|---|---|
| `picks.jsonl` | one row per component: url, author, slug, `feedback` (Shaan verbatim), `targets[]`, `signal` (love/good/maybe/meh), `type`, `form` (mobile/desktop/either), store pointers |
| `libraries.jsonl` | authors + libraries Shaan rated, with his reusability % where he gave one, `adopt` flag |
| `votes.json` | written by the board: per-type `winner`, per-url `verdict` keep/drop + `note` |
| `add.mjs` | add URLs with feedback; `--fill` harvests preview/bundle/source for anything missing |
| `serve.mjs` + `board.html` | the viewer, port 8812 |

Assets live in the existing stores, nothing is duplicated:
- preview/bundle/meta → `../21st/harvest/<author>__<slug>/` (variants: `<author>__<slug>--<demo>/`)
- real TSX source → `../21st-source-harvest/source/<author>__<slug>/code.tsx` (when cdn.21st.dev still serves it)
- legacy source → `SISO_Knowledge/design-system/library/21st-dev/<author>-<slug>/`

## Use

```bash
node registry/curated/serve.mjs                       # → http://127.0.0.1:8812/
node registry/curated/add.mjs URL URL --fb "verbatim" --target operator-dashboard --signal love
node registry/curated/add.mjs --stdin --fb "..." < urls.txt
node registry/curated/add.mjs --fill                  # backfill assets for every pick
```

`targets` vocabulary so far: operator, operator-dashboard, operator-login, operator-onboarding,
operator-gamification, operator-vps, operator-search, oracle-chat, oracle-orb, models-app, landing, bank.
Standing rule from Shaan (2026-09-04): *everything is fair game for the operator dashboard unless he said otherwise.*

`type` is `<family>/<kind>` and is assigned by reading the preview + code, not the 21st tag.
`form` is what the preview shows: a mobile card can be fitted to desktop, a desktop layout cannot go the other way.

## Source availability (2026-09-04)

112 picks · 112 with preview · 99 with real source · 13 gated (newer uploads 404 on cdn.21st.dev;
the sanctioned path is `npx shadcn add "https://21st.dev/r/<author>/<slug>?api_key=$API_KEY_21ST"`
which needs a paid key — bundle.html is still readable for all of them).

## Scout layer (`scout/`)

The corpus already had two rating systems, neither of which says "is this good enough for the bank":
`pipeline/rubric.mjs` judges rendered panels against the Oracle DNA; `registry/21st/score.mjs` ranks
for a landing-page profile. `scout/RUBRIC.md` adds the missing axis: **bank-fit**, 5 axes × 0-5,
calibrated on the 112 picks.

```bash
python3 scout/build-lanes.py       # partition corpus into lanes + render contact sheets (30 previews/jpg)
# fan out one scout per lane with scout/BRIEF.md → scout/ratings/<lane>.jsonl
node scout/merge.mjs               # → scout/candidates.jsonl, drops anything already picked
# review under the "scout candidates" chip on :8812, keep/drop/note as usual
node scout/promote.mjs             # kept candidates → picks.jsonl via add.mjs
```

## For other agents (`query.mjs` + `presets.json`)

```bash
node registry/curated/query.mjs "<text>" --preset operator [--json]
node registry/curated/query.mjs --surface gamification --preset operator
node registry/curated/query.mjs --type chart/line --preset all --min-score 21
```
`brief.mjs` calls this as layer 1b, so any agent that runs the normal brief gets the bank for free.
Presets map a project to Shaan's targets, the DNA file, named surfaces (groups of types), and his
standing rules. Add a preset per project; do not fork the bank.
