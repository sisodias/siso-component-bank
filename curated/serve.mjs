#!/usr/bin/env node
// Curated bank viewer. Zero deps. PORT (default 8812).
//   node registry/curated/serve.mjs  → http://127.0.0.1:8812/
// Routes: /            board.html
//         /api/picks   picks.jsonl as JSON array
//         /api/libs    libraries.jsonl as JSON array
//         /api/votes   GET/POST votes.json  ({ "<type>": { winner: url, note, at } , "<url>": { verdict, note, at } })
//         /harvest/<id>/<file>   preview.webp / bundle.html / demo.tsx from ../21st/harvest
//         /source/<id>/code.tsx  from ../21st-source-harvest/source
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, extname, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
const HERE = dirname(fileURLToPath(import.meta.url))
const HARVEST = join(HERE, '..', '21st', 'harvest')
const SOURCE = join(HERE, '..', '21st-source-harvest', 'source')
const VOTES = join(HERE, 'votes.json')
const PORT = Number(process.env.PORT || 8812)
const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.tsx': 'text/plain; charset=utf-8', '.mp4': 'video/mp4' }
const jsonl = async f => (await readFile(join(HERE, f), 'utf8')).split('\n').filter(Boolean).map(l => JSON.parse(l))
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' }); res.end(body) }
const serveFile = async (res, root, rel) => {
  const safe = normalize(rel).replace(/^(\.\.[/\\])+/, '')
  const file = join(root, safe)
  if (!file.startsWith(root) || !existsSync(file)) return send(res, 404, 'not found', 'text/plain')
  send(res, 200, await readFile(file), MIME[extname(file)] || 'application/octet-stream')
}
createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const p = decodeURIComponent(url.pathname)
  try {
    if (p === '/api/picks') return send(res, 200, JSON.stringify(await jsonl('picks.jsonl')))
    if (p === '/api/candidates') return send(res, 200, JSON.stringify(existsSync(join(HERE, 'scout', 'candidates.jsonl')) ? await jsonl('scout/candidates.jsonl') : []))
    if (p === '/api/libs') return send(res, 200, JSON.stringify(await jsonl('libraries.jsonl')))
    if (p === '/api/votes') {
      if (req.method === 'POST') { let b = ''; for await (const c of req) b += c; JSON.parse(b); await writeFile(VOTES, b); return send(res, 200, '{"ok":true}') }
      return send(res, 200, existsSync(VOTES) ? await readFile(VOTES, 'utf8') : '{}')
    }
    if (p.startsWith('/harvest/')) return serveFile(res, HARVEST, p.slice(9))
    if (p.startsWith('/source/')) return serveFile(res, SOURCE, p.slice(8))
    if (p === '/' || p === '/board.html') return send(res, 200, await readFile(join(HERE, 'board.html')), MIME['.html'])
    send(res, 404, 'not found', 'text/plain')
  } catch (e) { send(res, 500, String(e), 'text/plain') }
}).listen(PORT, '127.0.0.1', () => console.log(`curated bank → http://127.0.0.1:${PORT}/`))
