#!/usr/bin/env node
// Agent-facing query over the curated bank. Curated picks (Shaan's words + votes) first,
// then scout candidates (rubric-rated), each with local preview/bundle/source paths.
//
//   node registry/curated/query.mjs "notifications" --preset operator --json
//   node registry/curated/query.mjs --type chart/line --preset operator
//   node registry/curated/query.mjs --surface gamification --preset operator
//   node registry/curated/query.mjs --presets            # list presets
//
// Presets map a project to the targets Shaan tagged (see presets.json). Default: operator.
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..', '..')
const args = process.argv.slice(2)
const flag = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
const JSON_OUT = args.includes('--json')
const PRESET = flag('--preset', 'operator')
const TYPE = flag('--type', null)
const SURFACE = flag('--surface', null)
const LIMIT = Number(flag('--limit', 12))
const MIN = Number(flag('--min-score', 19))
const q = args.filter((a, i) => !a.startsWith('--') && !['--preset', '--type', '--surface', '--limit', '--min-score'].includes(args[i - 1])).join(' ').toLowerCase().trim()

const jsonl = async f => existsSync(join(HERE, f)) ? (await readFile(join(HERE, f), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l)) : []
const presets = JSON.parse(await readFile(join(HERE, 'presets.json'), 'utf8'))
if (args.includes('--presets')) { console.log(JSON.stringify(presets, null, 2)); process.exit(0) }
const preset = presets[PRESET]
if (!preset) { console.error(`unknown preset ${PRESET}; known: ${Object.keys(presets).join(', ')}`); process.exit(1) }

const [picks, cands] = await Promise.all([jsonl('picks.jsonl'), jsonl('scout/candidates.jsonl')])
let votes = {}; try { votes = JSON.parse(await readFile(join(HERE, 'votes.json'), 'utf8')) } catch {}

const inPreset = p => PRESET === 'all' || (p.targets || []).some(t => preset.targets.some(pt => t === pt || t.startsWith(pt + '-')))
const surfaceTypes = SURFACE ? (preset.surfaces?.[SURFACE] || []) : null
const matchesType = t => !t ? false : TYPE ? t === TYPE || t.startsWith(TYPE) : surfaceTypes ? surfaceTypes.some(s => t === s || t.startsWith(s)) : true
const words = q.split(/\s+/).filter(w => w.length > 2)
const hay = r => [r.slug, r.id, r.type, r.feedback, r.why, r.author, ...(r.targets || [])].join(' ').toLowerCase()
// whole phrase first; otherwise any word (brief.mjs does the same: people phrase, the index is single tags)
const matchesText = r => !q || hay(r).includes(q) || words.some(w => hay(r).includes(w))
const paths = id => id ? ({
  preview: `registry/21st/harvest/${id}/preview.webp`,
  bundle: existsSync(join(ROOT, 'registry/21st/harvest', id, 'bundle.html')) ? `registry/21st/harvest/${id}/bundle.html` : null,
  source: existsSync(join(ROOT, 'registry/21st-source-harvest/source', id.split('--')[0], 'code.tsx')) ? `registry/21st-source-harvest/source/${id.split('--')[0]}/code.tsx` : null,
}) : {}
const sig = { love: 3, good: 2, maybe: 1, meh: 0 }

const curated = picks.filter(p => inPreset(p) && (TYPE || SURFACE ? matchesType(p.type) : true) && matchesText(p))
  .filter(p => votes[p.url]?.verdict !== 'drop')
  .map(p => ({ tier: 'curated', id: p.harvest_id, slug: p.slug, author: p.author, url: p.url, type: p.type, form: p.form,
    shaan_said: p.feedback, targets: p.targets, signal: p.signal,
    vote: votes[p.url]?.verdict || null, note: votes[p.url]?.note || null, winner_of_type: votes[p.type]?.winner === p.url,
    legacy_source: p.legacy_id ? `SISO_Knowledge/design-system/library/21st-dev/${p.legacy_id}` : null, ...paths(p.harvest_id) }))
  .sort((a, b) => (b.winner_of_type - a.winner_of_type) || ((b.vote === 'keep') - (a.vote === 'keep')) || (sig[b.signal] - sig[a.signal]))

const scout = cands.filter(c => c.bank_score >= MIN && (TYPE || SURFACE ? matchesType(c.type) : true) && matchesText(c))
  .filter(c => votes[c.url]?.verdict !== 'drop')
  .map(c => ({ tier: 'scout', id: c.id, slug: c.id.split('__').slice(1).join('__'), author: c.id.split('__')[0], url: c.url, type: c.type, form: c.form,
    bank_score: c.bank_score, why: c.why, ab_against: c.ab_against, vote: votes[c.url]?.verdict || null, note: votes[c.url]?.note || null, ...paths(c.id) }))
  .sort((a, b) => ((b.vote === 'keep') - (a.vote === 'keep')) || (b.bank_score - a.bank_score))

const out = { preset: PRESET, query: q || null, type: TYPE, surface: SURFACE, dna: preset.dna,
  rules: preset.rules, curated: curated.slice(0, LIMIT), scout: scout.slice(0, LIMIT),
  counts: { curated: curated.length, scout: scout.length } }
if (JSON_OUT) { console.log(JSON.stringify(out, null, 2)); process.exit(0) }
const line = '─'.repeat(72)
console.log(`${line}\nBANK  preset=${PRESET}${q ? `  q="${q}"` : ''}${TYPE ? `  type=${TYPE}` : ''}${SURFACE ? `  surface=${SURFACE}` : ''}\nDNA   ${preset.dna}\n${line}`)
console.log(`\nCURATED (${curated.length}) — Shaan picked these; his words are the spec`)
for (const c of out.curated) console.log(`  ${c.winner_of_type ? '★' : c.vote === 'keep' ? '✓' : ' '} ${c.signal.padEnd(5)} ${(c.type || '').padEnd(28)} ${c.author}/${c.slug}\n        "${c.shaan_said}"${c.note ? `\n        note: ${c.note}` : ''}\n        ${c.preview}${c.source ? `\n        ${c.source}` : c.legacy_source ? `\n        ${c.legacy_source}` : '\n        (no source; read bundle)'}`)
console.log(`\nSCOUT (${scout.length} ≥${MIN}/25) — rubric-rated, not yet blessed; A/B against the curated one named`)
for (const c of out.scout) console.log(`  ${c.vote === 'keep' ? '✓' : ' '} ${String(c.bank_score).padStart(2)}    ${(c.type || '').padEnd(28)} ${c.author}/${c.slug}${c.ab_against ? `  (vs ${c.ab_against})` : ''}\n        ${c.why}\n        ${c.preview}${c.source ? `\n        ${c.source}` : ''}`)
console.log(`\nRULES\n${preset.rules.map(r => '  - ' + r).join('\n')}`)
