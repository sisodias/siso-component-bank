# Scout brief — find bank-worthy comps in one lane of the 21st corpus

You are scouting ONE lane of Shaan's 7,949-component 21st.dev harvest for components that belong
in his personal curated bank. Read `scout/RUBRIC.md` first, then `picks.jsonl` (his 112 picks with
verbatim reactions) so you know his taste from evidence, not guesswork.

## Inputs
- `scout/lane-<lane>.jsonl` — one row per component: id, url, name, desc, tags, usage, sheet, cell
- `scout/sheets/<lane>-NN.jpg` — contact sheets, 30 previews each, labelled `sheet.cell  id`
- `../21st/harvest/<id>/preview.webp` — full preview when a thumbnail isn't enough
- `../21st/harvest/<id>/bundle.html` — compiled code; grep for deps/classes, don't read whole
- `../21st-source-harvest/source/<id>/code.tsx` — real source when present (about 65%)

## Method
1. Look at every contact sheet for your lane, in order. Note every cell that could plausibly score ≥14.
2. For each candidate open the full preview. For anything that might reach ≥19 also open the source
   (or grep the bundle for `three`, `shader`, `gsap`, `@react-three`, `canvas` to judge robbability).
3. Score every candidate on the five axes. Be stingy: his 112 picks are the bar, most comps are 8-13.
4. Assign `type` and `form`.

## Output — write ONLY this file
`scout/ratings/<lane>.jsonl`, one JSON object per candidate scored ≥14:
{"id","url","type","form","craft","mechanism","product_fit","robbability","taste_match","bank_score","why":"one line in plain words","ab_against":"<slug of an existing pick of the same type or null>"}

Then a `RETURN` block (≤200 words): STATUS / lane / sheets viewed / candidates ≥19 / candidates 14-18 / EVIDENCE (3 ids you are most confident about and why).

## Do not
- Do not edit picks.jsonl, votes.json, or anything outside `scout/ratings/`.
- Do not read `catalog.json` or `classification.json` (hundreds of thousands of tokens).
- Do not rate landing-page comps highly because they are pretty; product-fit is a hard axis.
