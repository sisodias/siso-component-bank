#!/usr/bin/env node
// Curated component bank — add 21st.dev URLs with Shaan's feedback.
//
//   node registry/curated/add.mjs <url>... [--fb "verbatim feedback"] [--target operator,bank] [--signal love|good|maybe|meh]
//   node registry/curated/add.mjs --fill          # harvest preview/bundle/source for every pick that lacks them
//   node registry/curated/add.mjs --stdin < urls  # one url per line, same flags apply to all
//
// Stores: picks.jsonl (one row per component, append-only, last row per url wins),
//         ../21st/harvest/<id>/          preview.webp + bundle.html + meta.json  (via harvest.mjs)
//         ../21st-source-harvest/source/<id>/code.tsx   real TSX when cdn.21st.dev still serves it
import { readFile, writeFile, appendFile, mkdir, access, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { harvestOne } from '../21st/harvest.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const HARVEST = join(HERE, '..', '21st', 'harvest')
const SOURCE = join(HERE, '..', '21st-source-harvest', 'source')
const LEGACY = new URL('../legacy', import.meta.url).pathname
const PICKS = join(HERE, 'picks.jsonl')
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; siso-ui-base curated)' }
const exists = p => access(p).then(() => true, () => false)
const sleep = ms => new Promise(r => setTimeout(r, ms))

const argv = process.argv.slice(2)
const flag = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d }
const FB = flag('--fb', '')
const TARGETS = (flag('--target', 'bank')).split(',').map(s => s.trim()).filter(Boolean)
const SIGNAL = flag('--signal', 'good')
const FILL = argv.includes('--fill')
let urls = argv.filter(a => a.startsWith('https://21st.dev/'))
if (argv.includes('--stdin')) {
  let s = ''; for await (const c of process.stdin) s += c
  urls.push(...s.split(/\s+/).filter(u => u.startsWith('https://21st.dev/')))
}

export function parseUrl(u) {
  const clean = u.trim().replace(/[\s\-–]+$/, '').replace(/\/$/, '')
  const m = clean.match(/^https:\/\/21st\.dev\/@([^/]+)\/components\/(.+)$/)
  if (!m) return null
  const [, author, path] = m
  const parts = path.split('/')
  return { url: clean, author, path, slug: parts[parts.length - 1], baseSlug: parts[0], parts }
}

async function readPicks() {
  if (!(await exists(PICKS))) return []
  const byUrl = new Map()
  for (const line of (await readFile(PICKS, 'utf8')).split('\n')) {
    if (!line.trim()) continue
    const r = JSON.parse(line); byUrl.set(r.url.toLowerCase(), r)
  }
  return [...byUrl.values()]
}

// resolve a pick against the three stores. harvest ids are author__slug; a variant
// url (dialog/edit-profile-dialog) may be stored under either segment.
async function resolve(p) {
  const out = { harvest_id: null, source_harvest: null, legacy_id: null }
  if (p.parts.length > 1 && await exists(join(HARVEST, `${p.author}__${p.baseSlug}--${p.slug}`, 'meta.json'))) out.harvest_id = `${p.author}__${p.baseSlug}--${p.slug}`
  for (const s of [...p.parts].reverse()) {
    if (out.harvest_id) break
    if (await exists(join(HARVEST, `${p.author}__${s}`, 'meta.json'))) { out.harvest_id = `${p.author}__${s}`; break }
  }
  if (out.harvest_id) {
    const sid = out.harvest_id.split('--')[0]
    const c = join(SOURCE, sid, 'code.tsx')
    if (await exists(c) && (await readFile(c, 'utf8')).length > 200) out.source_harvest = `${sid}/code.tsx`
  }
  for (const s of [...p.parts].reverse()) {
    if (await exists(join(LEGACY, `${p.author.toLowerCase()}-${s}`))) { out.legacy_id = `${p.author.toLowerCase()}-${s}`; break }
  }
  out.has_source = !!(out.source_harvest || out.legacy_id)
  out.preview = out.harvest_id ? `registry/21st/harvest/${out.harvest_id}/preview.webp` : null
  return out
}

// Source recipe (proven 2026-08-29): the page embeds r2://components-code-private/<a>/<s>/code.<v>.tsx;
// cdn.21st.dev/<a>/<s>/code.<v>.tsx serves clean TSX for older components, 404 for gated ones.
async function fetchSource(p, harvestId) {
  const dir = join(SOURCE, harvestId)
  const target = join(dir, 'code.tsx')
  if (await exists(target) && (await readFile(target, 'utf8')).length > 200) return 'had'
  const page = await fetch(p.url, { headers: UA })
  if (!page.ok) return `page ${page.status}`
  const html = (await page.text()).replaceAll('\\/', '/').replaceAll('\\u002f', '/').replaceAll('\\u002F', '/')
  const refs = [...html.matchAll(/r2:\/\/components-code-private\/[^"\\\s]+\/code\.[^"\\\s]+\.tsx/g)].map(m => m[0])
  const ref = [...new Set(refs)][0]
  if (!ref) return 'no-ref'
  const m = ref.match(/^r2:\/\/components-code-private\/([^/]+)\/([^/]+)\/(code\.[^/]+\.tsx)$/)
  if (!m) return 'bad-ref'
  const codeUrl = `https://cdn.21st.dev/${m[1]}/${m[2]}/${m[3]}`
  await sleep(1100)
  const r = await fetch(codeUrl, { headers: UA })
  if (!r.ok) return `gated ${r.status}`
  const code = await r.text()
  if (!/import|export|function|const /.test(code)) return 'not-source'
  await mkdir(dir, { recursive: true })
  await writeFile(target, code)
  await writeFile(join(dir, 'source-meta.json'), JSON.stringify({ upstreamUrl: p.url, codeUrl, retrievedAt: new Date().toISOString(), via: 'curated/add.mjs' }, null, 2))
  return 'retrieved'
}

// Variant urls (author/components/<slug>/<demo>) share the parent component's page; harvest.mjs
// keeps only the default demo's bundle/preview. Store the demo's own assets under author__slug--demo.
async function harvestVariant(p) {
  const id = `${p.author}__${p.baseSlug}--${p.slug}`
  const dir = join(HARVEST, id)
  if (await exists(join(dir, 'meta.json'))) return { id, skipped: true }
  const r = await fetch(p.url, { headers: UA })
  if (!r.ok) throw new Error(`page ${r.status}`)
  const html = (await r.text()).replaceAll('\\/', '/').replaceAll('\\u002f', '/').replaceAll('\\u002F', '/')
  const find = re => [...new Set([...html.matchAll(re)].map(m => m[0]))].filter(u => u.includes(`/${p.slug}/`))
  const bundle = find(/https:\/\/cdn\.21st\.dev\/[^"\s\\]+\/bundle\.[0-9]+\.html/g)[0]
  const preview = find(/https:\/\/cdn\.21st\.dev\/[^"\s\\]+\/preview\.[0-9]+\.(?:png|webp)/g).filter(u => !u.includes('cdn-cgi'))[0]
  const video = find(/https:\/\/cdn\.21st\.dev\/[^"\s\\]+\/video\.[0-9]+\.mp4/g)[0]
  // older demos use unversioned assets: <author>/<slug>/<demo>/preview.png?v=1 and code.demo.tsx?v=1
  const legacyPreview = find(/https:\/\/cdn\.21st\.dev\/[^"\s\\]+\/preview\.png\?v=\d+/g).filter(u => !u.includes('cdn-cgi'))[0]
  const demoTsx = find(/https:\/\/cdn\.21st\.dev\/[^"\s\\]+\/code\.demo\.tsx(?:\?v=\d+)?/g)[0]
  // some pages list only code.demo.tsx; the sibling preview.png?v=1 still resolves
  const previewUrl = preview || legacyPreview || (demoTsx ? demoTsx.replace(/code\.demo\.tsx.*$/, 'preview.png?v=1') : null)
  if (!bundle && !previewUrl && !demoTsx) return { id, dead: true }
  await mkdir(dir, { recursive: true })
  const got = []
  if (previewUrl) {
    const small = `https://cdn.21st.dev/cdn-cgi/image/fit=scale-down,width=640,quality=75,format=auto/${previewUrl}`
    let pr = await fetch(small, { headers: UA })
    if (!pr.ok) pr = await fetch(previewUrl, { headers: UA })
    if (pr.ok) { await writeFile(join(dir, 'preview.webp'), Buffer.from(await pr.arrayBuffer())); got.push('preview') }
  }
  if (bundle) { await sleep(300); const br = await fetch(bundle, { headers: UA }); if (br.ok) { await writeFile(join(dir, 'bundle.html'), await br.text()); got.push('bundle') } }
  if (demoTsx) { await sleep(300); const dr = await fetch(demoTsx, { headers: UA }); if (dr.ok) { await writeFile(join(dir, 'demo.tsx'), await dr.text()); got.push('demo.tsx') } }
  await writeFile(join(dir, 'meta.json'), JSON.stringify({ url: p.url, author: p.author, slug: p.slug, name: p.slug, parent: `${p.author}__${p.baseSlug}`, variant: true, id, bundleUrl: bundle ?? null, previewUrl: previewUrl ?? null, demoUrl: demoTsx ?? null, video_url: video ?? null, harvested: got, installCommand: `npx shadcn@latest add "https://21st.dev/r/${p.author}/${p.baseSlug}?api_key=$API_KEY_21ST"` }, null, 2))
  return { id, got }
}

async function fill(p, row) {
  const log = []
  if (p.parts.length > 1 && (!row.harvest_id || !row.harvest_id.includes('--'))) {
    try { const r = await harvestVariant(p); log.push(r.dead ? 'variant:dead' : r.skipped ? 'variant:had' : `variant:${r.got.join('+')}`) } catch (e) { log.push(`variant:fail ${String(e).slice(0, 60)}`) }
    Object.assign(row, await resolve(p))
  }
  if (!row.harvest_id) {
    try {
      const r = await harvestOne(p.url)
      log.push(r.dead ? 'harvest:dead' : r.skipped ? 'harvest:had' : 'harvest:new')
    } catch (e) { log.push(`harvest:fail ${String(e).slice(0, 60)}`) }
    Object.assign(row, await resolve(p))
  }
  if (row.harvest_id && !row.has_source) {
    try { log.push('source:' + await fetchSource(p, row.harvest_id.split('--')[0])) } catch (e) { log.push(`source:fail ${String(e).slice(0, 60)}`) }
    Object.assign(row, await resolve(p))
  }
  return log
}

async function main() {
  const picks = await readPicks()
  const byUrl = new Map(picks.map(r => [r.url.toLowerCase(), r]))
  const today = new Date().toISOString().slice(0, 10)
  let n = picks.length
  const rows = []
  if (FILL) rows.push(...picks)
  for (const u of urls) {
    const p = parseUrl(u)
    if (!p) { console.error(`skip (not a component url): ${u}`); continue }
    const prev = byUrl.get(p.url.toLowerCase())
    const row = prev ? { ...prev } : { n: ++n, url: p.url, author: p.author, slug: p.slug, path: p.path, session: today }
    if (FB) row.feedback = prev?.feedback && prev.feedback !== FB ? `${prev.feedback} || ${today}: ${FB}` : FB
    if (!prev || flag('--target')) row.targets = TARGETS
    if (!prev || flag('--signal')) row.signal = SIGNAL
    row.feedback ??= ''
    if (!rows.includes(row)) rows.push(row)
  }
  for (const row of rows) {
    const p = parseUrl(row.url)
    Object.assign(row, await resolve(p))
    const needsVariant = p.parts.length > 1 && !(row.harvest_id || '').includes('--')
    if (!row.harvest_id || !row.has_source || needsVariant) {
      const log = await fill(p, row)
      if (log.length) console.log(`${row.path.padEnd(48)} ${log.join(' ')}`)
    }
    byUrl.set(row.url.toLowerCase(), row)
  }
  const all = [...byUrl.values()].sort((a, b) => a.n - b.n)
  await writeFile(PICKS, all.map(r => JSON.stringify(r)).join('\n') + '\n')
  const withPrev = all.filter(r => r.harvest_id).length, withSrc = all.filter(r => r.has_source).length
  console.log(`picks: ${all.length} · preview ${withPrev} · source ${withSrc} · no-source ${all.length - withSrc}`)
}
if (import.meta.url === `file://${process.argv[1]}`) main()
