#!/usr/bin/env node
// The agent-facing query surface over the harvested corpus.
//
// An agent asked to "build a pricing page" should not grep 7,949 folders or
// pull a 700KB catalogue into its context. It runs one command, gets back a
// handful of ranked candidates with local preview paths, and looks at those.
//
//   node find.mjs pricing                     # by tag or free text
//   node find.mjs hero --limit 5
//   node find.mjs card --tag testimonials     # intersect two tags
//   node find.mjs --tags                      # list the 75-tag vocabulary
//   node find.mjs pricing --json              # machine-readable for agents
//
// Ranking: classification confidence (page > api > local) dominates, damped by
// how many tags a component carries, with usage_count (real installs) breaking
// ties. Installs alone are misleading — a 2,000-install shadcn primitive that
// the semantic search loosely tagged will otherwise outrank a purpose-built
// component that is exactly what was asked for.

import { readFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const flag = (n, d) => args.includes(n) ? args[args.indexOf(n) + 1] : d
const JSON_OUT = args.includes('--json')
const LIMIT = Number(flag('--limit', 12))
const ALSO = flag('--tag', null)
const query = args.filter(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--limit' && args[args.indexOf(a) - 1] !== '--tag').join(' ').trim()

const cls = JSON.parse(await readFile(join(HERE, 'classification.json'), 'utf8'))

if (args.includes('--tags')) {
  const counts = cls.tagCounts
  for (const t of cls.taxonomy) console.log(String(counts[t] ?? 0).padStart(5), t)
  process.exit(0)
}
if (!query) { console.error('usage: node find.mjs <tag|text> [--tag other] [--limit n] [--json]'); process.exit(1) }

// load harvested metadata
const meta = new Map()
for (const d of (await readdir(join(HERE, 'harvest'))).filter(x => x.includes('__'))) {
  try {
    const m = JSON.parse(await readFile(join(HERE, 'harvest', d, 'meta.json'), 'utf8'))
    meta.set(m.url, { ...m, dir: d })
  } catch {}
}

const RANK = { page: 3, api: 2, local: 1 }
const norm = s => s.toLowerCase().replace(/[-_\s]+/g, ' ').trim()
const q = norm(query)

// exact tag match if the query names one, else free-text over slug/name/description
const isTag = cls.taxonomy.includes(query) || cls.taxonomy.includes(q.replace(/ /g, '-'))
const tagName = isTag ? (cls.taxonomy.includes(query) ? query : q.replace(/ /g, '-')) : null

const rows = []
for (const [url, tags] of Object.entries(cls.componentToTags)) {
  const m = meta.get(url)
  if (!m) continue
  const names = tags.map(t => t.tag)
  if (ALSO && !names.includes(ALSO)) continue

  let hit = false, conf = 0
  if (tagName) {
    const t = tags.find(x => x.tag === tagName)
    if (t) { hit = true; conf = RANK[t.source] ?? 1 }
  } else {
    const hay = norm(`${m.slug} ${m.name || ''} ${m.description || ''}`)
    if (hay.includes(q)) { hit = true; conf = names.length ? 2 : 1 }
  }
  if (!hit) continue

  rows.push({
    id: m.id,
    name: m.name,
    author: m.author,
    slug: m.slug,
    description: (m.description || '').slice(0, 140),
    tags: names,
    installs: m.usage_count ?? null,
    confidence: conf,
    url,
    preview: join('registry/21st/harvest', m.dir, m.preview || 'preview.webp'),
    bundle: join('registry/21st/harvest', m.dir, 'bundle.html'),
    install: m.installCommand,
  })
}

// Rank on confidence FIRST, then popularity. Sorting by installs alone put
// originui/calendar top of "pricing-section": the semantic API had loosely
// tagged it, and 2,028 installs then buried genuinely-relevant results.
// A component carrying many tags is also a weaker signal for any one of them —
// originui/dialog holds 27 — so spread damps the score.
const score = r => {
  const spread = 1 / Math.sqrt(Math.max(1, r.tags.length))
  return r.confidence * 1000 * spread + Math.log10(1 + (r.installs ?? 0))
}
rows.sort((a, b) => score(b) - score(a))
const out = rows.slice(0, LIMIT)

if (JSON_OUT) {
  console.log(JSON.stringify({ query, matched: rows.length, returned: out.length, results: out }, null, 2))
} else {
  console.log(`${rows.length} match "${query}"${ALSO ? ` + ${ALSO}` : ''} — top ${out.length}\n`)
  for (const r of out) {
    console.log(`${r.installs != null ? String(r.installs).padStart(6) : '     ·'}  ${r.author}/${r.slug}`)
    console.log(`        ${r.description || '(no description)'}`)
    console.log(`        tags: ${r.tags.join(', ')}`)
    console.log(`        ${r.preview}`)
    console.log()
  }
}
