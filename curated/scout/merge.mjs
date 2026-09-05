#!/usr/bin/env node
// Merge scout/ratings/*.jsonl → scout/candidates.jsonl (deduped, sorted by bank_score desc),
// dropping anything already in picks.jsonl. Re-runnable.
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const picks = (await readFile(join(HERE, '..', 'picks.jsonl'), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l))
const have = new Set(picks.map(p => p.harvest_id).filter(Boolean))
const byId = new Map()
for (const f of (await readdir(join(HERE, 'ratings'))).filter(f => f.endsWith('.jsonl'))) {
  for (const line of (await readFile(join(HERE, 'ratings', f), 'utf8')).split('\n')) {
    if (!line.trim()) continue
    let r; try { r = JSON.parse(line) } catch { continue }
    if (!r.id || have.has(r.id)) continue
    r.lane = f.replace('.jsonl', '')
    r.bank_score ??= ['craft', 'mechanism', 'product_fit', 'robbability', 'taste_match'].reduce((n, k) => n + (+r[k] || 0), 0)
    const prev = byId.get(r.id)
    if (!prev || r.bank_score > prev.bank_score) byId.set(r.id, r)
  }
}
const out = [...byId.values()].sort((a, b) => b.bank_score - a.bank_score)
await writeFile(join(HERE, 'candidates.jsonl'), out.map(r => JSON.stringify(r)).join('\n') + '\n')
const tier = t => out.filter(r => t(r.bank_score)).length
console.log(`candidates ${out.length} · ≥19: ${tier(s => s >= 19)} · 14-18: ${tier(s => s >= 14 && s < 19)} · lanes: ${[...new Set(out.map(r => r.lane))].join(',')}`)
