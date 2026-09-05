#!/usr/bin/env node
// Promote scout candidates Shaan marked keep (votes.json verdict=keep on a candidate url) into picks.jsonl.
//   node scout/promote.mjs            # all kept candidates
//   node scout/promote.mjs <id>...    # specific ids regardless of vote
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const cands = (await readFile(join(HERE, 'candidates.jsonl'), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l))
let votes = {}; try { votes = JSON.parse(await readFile(join(HERE, '..', 'votes.json'), 'utf8')) } catch {}
const ids = process.argv.slice(2)
const chosen = cands.filter(c => ids.length ? ids.includes(c.id) : votes[c.url]?.verdict === 'keep')
for (const c of chosen) {
  const fb = votes[c.url]?.note ? `scout (${c.lane}, ${c.bank_score}/25): ${c.why} || Shaan: ${votes[c.url].note}` : `scout (${c.lane}, ${c.bank_score}/25): ${c.why}`
  const target = /^(chart|dashboard)\//.test(c.type || '') ? 'operator-dashboard' : 'operator'
  execFileSync('node', [join(HERE, '..', 'add.mjs'), c.url, '--fb', fb, '--target', target, '--signal', c.bank_score >= 21 ? 'love' : 'good'], { stdio: 'inherit' })
}
console.log(`promoted ${chosen.length}`)
