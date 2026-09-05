# Bank-fit rubric (v1, 2026-09-04)

Two existing rating systems already exist and this one is deliberately neither:
- `pipeline/rubric.mjs` grades a *rendered panel* against the Oracle DNA (warmth/playful/clarity/craft/coherence). That is a tenant judge, run after a comp is adapted.
- `registry/21st/score.mjs` ranks the catalog for a *landing-page profile* (true type × completeness × need).

This rubric answers a different question: **would Shaan pull this into his personal bank?** It is calibrated against his 112 picks and his verbatim reactions (`picks.jsonl`).

## Axes (0-5 each)

| axis | 5 | 0 | evidence from his picks |
|---|---|---|---|
| **craft** | hand-tuned, coherent, restrained motion, no AI-default look | template slop, stock shadcn with nothing added, heavy pills, generic gradients | "just clean", "feels really nice even to reverse engineer", "bit slop" |
| **mechanism** | the component *does* something real: state, interaction, animation that carries meaning | static decoration, hero/landing filler | "the way this component works", "does it actually work? It does. Banging", "looks good, not really functional" |
| **product-fit** | belongs in a dense operator/model app: dashboards, charts, chat, gamification, calendars, notifications, auth | landing-page hero/pricing/testimonial/footer/marquee | he skipped every landing comp except one bento card |
| **robbability** | source is clean, deps are normal (motion, recharts, radix, lucide), drop-in | three.js/shaders/heavy runtime, tangled demo-only code, no source | "remember it being heavy, so many renders and shaders" |
| **taste-match** | matches what he keeps reacting to: clean, dark or warm-neutral, tasteful motion, gamified dopamine, Apple-ish | neon, brutalist, 8-bit, retro, over-engineered 3D | "sexy", "dopamine", "over-engineering, shouldn't put that there" |

**bank_score** = craft + mechanism + product-fit + robbability + taste-match (0-25).
- **≥19** candidate for the bank, surface to Shaan
- **14-18** shortlist, keep in lane file only
- **<14** ignore

Also record `type` (`family/kind`, same vocabulary as picks.jsonl, invent a new kind only when nothing fits) and `form` (mobile/desktop/either). Same type = eligible for A/B against his existing pick.

## What the corpus already has

- 75 official 21st tags per component (`classification.json`) — a facet index, not a rating.
- `usage_count` — installs. Median is 0, p95 is 194. Weak popularity prior, not taste.
- Legacy store `classification.json` — category/subcategory/visual_style/interactions/complexity/use_cases from an earlier classifier run over 3,507 comps. Useful for the type field, silent on quality.

None of those say "is this good". This rubric is the first quality axis.
