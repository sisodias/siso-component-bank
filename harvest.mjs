#!/usr/bin/env node
// 21st.dev harvester — enumerate the whole catalog and cache it locally.
//
// Uses only free, unauthenticated endpoints:
//   sitemap.xml + profiles -> every component page (7,538 union, 2026-08-19;
//                             the sitemap alone misses ~1,894 of them)
//   the component page     -> metadata + demoCode + CDN urls (Next flight payload)
//   cdn .../bundle.N.html  -> the COMPILED component (minified but complete:
//                             every Tailwind class string and all logic intact)
//   cdn .../code.demo.tsx  -> the demo's real TSX source
//   cdn .../preview.webp   -> preview image, via the CDN resizer (3.3x smaller)
//
// This deliberately avoids `21st get` (metered 2/day on free tier) and the
// /r/<user>/<slug>.json registry endpoint (now 403 authentication_required).
//
// Usage:
//   node harvest.mjs --limit 50            # try a slice first
//   node harvest.mjs --all                 # full sweep
//   node harvest.mjs --all --no-previews   # metadata + code only
//
// Idempotent: skips anything already on disk. Safe to re-run / resume.

import { mkdir, writeFile, readFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, 'harvest')
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; siso-ui-base harvester)' }

const args = process.argv.slice(2)
const LIMIT = args.includes('--limit') ? Number(args[args.indexOf('--limit') + 1]) : (args.includes('--all') ? Infinity : 25)
const PREVIEWS = !args.includes('--no-previews')
const CONC = Number(process.env.CONC || 6)

const exists = p => access(p).then(() => true, () => false)
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function fetchText(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA })
      if (r.status === 429) { await sleep(2000 * (i + 1)); continue }
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return await r.text()
    } catch (e) {
      if (i === tries - 1) throw e
      await sleep(600 * (i + 1))
    }
  }
}

async function fetchBuf(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return Buffer.from(await r.arrayBuffer())
    } catch (e) {
      if (i === tries - 1) throw e
      await sleep(600 * (i + 1))
    }
  }
}

// --- catalogue enumeration -----------------------------------------------
// The sitemap is NOT complete: measured 2026-08-19, author profile pages list
// 1,894 components it never mentions (86.7% of them live). So enumerate from
// the UNION of both surfaces. urls-union.json is the cached result of
// profile-sweep.mjs; re-run that to refresh.
export async function componentUrls() {
  const xml = await fetchText('https://21st.dev/sitemap.xml')
  const fromSitemap = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(m => m[1])
    .filter(u => u.includes('/components/') && u.split('/')[3]?.startsWith('@'))

  let union = fromSitemap
  try {
    const cached = JSON.parse(await readFile(join(HERE, 'urls-union.json'), 'utf8'))
    if (Array.isArray(cached.union) && cached.union.length >= fromSitemap.length) {
      union = [...new Set([...cached.union, ...fromSitemap])]
    }
  } catch {
    console.warn('  no urls-union.json — sitemap only (run: node profile-sweep.mjs)')
  }
  return union
}

// The page embeds a Next flight payload with escaped slashes; pull the CDN
// urls out of a window after each key rather than parsing the whole payload.
function cdnAfter(html, key, ext) {
  const out = []
  for (const m of html.matchAll(new RegExp(key, 'g'))) {
    const seg = html.slice(m.index, m.index + 500).replaceAll('\\/', '/')
    const u = seg.match(new RegExp(`https://cdn\\.21st\\.dev/[^"\\\\\\s]+?\\.${ext}`))
    if (u) out.push(u[0])
  }
  return [...new Set(out)]
}

function unescapeFlight(s) {
  return s.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\u003c/g, '<')
          .replace(/\\u003e/g, '>').replace(/\\u0026/g, '&').replace(/\\\\/g, '\\')
}

function demoCode(html) {
  const i = html.indexOf('\\"demoCode\\":\\"')
  if (i < 0) return null
  const start = i + '\\"demoCode\\":\\"'.length
  const end = html.indexOf('\\",\\"', start)
  return end < 0 ? null : unescapeFlight(html.slice(start, end))
}

function meta(html, url) {
  const pick = k => {
    const m = html.match(new RegExp(`\\\\"${k}\\\\":\\\\"([^"\\\\]{0,400}?)\\\\"`))
    return m ? unescapeFlight(m[1]) : null
  }
  const [, , , author, , slug] = url.split('/')
  return {
    url, author: author.replace('@', ''), slug,
    name: pick('component_slug') || slug,
    description: pick('description'),
    installCommand: `npx shadcn@latest add "https://21st.dev/r/${author.replace('@','')}/${slug}?api_key=$API_KEY_21ST"`,
  }
}

// 640px through Cloudflare's transform path — measured 3.3x smaller.
const small = u => `https://cdn.21st.dev/cdn-cgi/image/fit=scale-down,width=640,quality=75,format=auto/${u}`

export async function harvestOne(url) {
  const [, , , rawAuthor, , slug] = url.split('/')
  const id = `${rawAuthor.replace('@', '')}__${slug}`
  const dir = join(OUT, id)
  if (await exists(join(dir, 'meta.json'))) return { id, skipped: true }

  const html = await fetchText(url)

  // 21st serves deleted components as HTTP 200 with a noindex soft-404 body,
  // so the status code alone is not enough to tell live from dead.
  if (html.includes('NEXT_HTTP_ERROR_FALLBACK;404') || html.includes('content="noindex"')) {
    return { id, dead: true }
  }

  await mkdir(dir, { recursive: true })

  const m = meta(html, url)
  const bundles = cdnAfter(html, 'bundle_html_url', 'html')
  const demos = cdnAfter(html, 'demo_code', 'tsx')
  const previews = cdnAfter(html, 'preview_url', '(?:webp|png|jpg|jpeg|avif)')

  const got = []
  if (bundles[0]) {
    // The compiled component. `"code"` in the payload is gated (empty string),
    // but this bundle is public and holds the real implementation.
    await writeFile(join(dir, 'bundle.html'), await fetchText(bundles[0]))
    got.push('bundle')
  }
  if (demos[0]) {
    await writeFile(join(dir, 'demo.tsx'), await fetchText(demos[0]))
    got.push('demo.tsx')
  } else {
    const dc = demoCode(html)
    if (dc) { await writeFile(join(dir, 'demo.tsx'), dc); got.push('demo.tsx(inline)') }
  }
  if (PREVIEWS && previews[0]) {
    try {
      await writeFile(join(dir, 'preview.webp'), await fetchBuf(small(previews[0])))
      got.push('preview')
    } catch {}
  }

  await writeFile(join(dir, 'meta.json'),
    JSON.stringify({ ...m, id, bundleUrl: bundles[0] ?? null, previewUrl: previews[0] ?? null, harvested: got }, null, 2))
  return { id, got }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const all = await componentUrls()
  const urls = all.slice(0, LIMIT === Infinity ? all.length : LIMIT)
  console.log(`catalogue: ${all.length} components (sitemap+profiles union) · harvesting ${urls.length} · concurrency ${CONC}`)

  let done = 0, skipped = 0, failed = 0, dead = 0
  const queue = [...urls]
  await Promise.all(Array.from({ length: CONC }, async () => {
    while (queue.length) {
      const u = queue.shift()
      try {
        const r = await harvestOne(u)
        if (r.skipped) skipped++
        else if (r.dead) dead++
        else done++
      } catch (e) {
        failed++
        console.error(`  fail ${u.split('/').pop()}: ${String(e).slice(0, 70)}`)
      }
      const n = done + skipped + failed + dead
      if (n % 25 === 0) console.log(`  ${n}/${urls.length}  new ${done} · skip ${skipped} · dead ${dead} · fail ${failed}`)
    }
  }))
  console.log(`\ndone: ${done} new, ${skipped} already had, ${dead} dead (soft-404), ${failed} failed → ${OUT}`)
}

if (import.meta.url === `file://${process.argv[1]}`) main()
