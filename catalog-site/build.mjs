#!/usr/bin/env node
// Builds the SISO Component Catalog static site from the 21st harvest corpus.
// Reads only; writes exclusively into catalog-site/dist/.
//
// Run: /opt/homebrew/opt/node@24/bin/node build.mjs

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, statSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS = process.env.BANK_ROOT || join(HERE, '..');   // repo root: meta/, previews/, source/
const HARVEST = join(CORPUS, 'harvest');
const DIST = join(HERE, 'dist');
const PREVIEW_OUT = join(DIST, 'p');

const PREVIEW_NAMES = ['preview.webp', 'preview.png', 'preview.jpg', 'preview.gif'];

function log(...a) { console.log('[build]', ...a); }

// ---------------------------------------------------------------- taxonomy
const classification = JSON.parse(readFileSync(join(CORPUS, 'classification.json'), 'utf8'));
const taxonomy = classification.taxonomy;
const tagIndex = new Map(taxonomy.map((t, i) => [t, i]));
const componentToTags = classification.componentToTags;

// Group the flat 75-tag taxonomy into browsable sections. Any tag not listed
// here lands in "Other" so the grouping never silently drops a tag.
const GROUPS = [
  ['Layout & Page Sections', ['hero', 'footer', 'sidebar', 'grid', 'dashboard', 'features', 'cta', 'pricing-section', 'faq', 'testimonials', 'team', 'clients', 'announcement', 'comparison', 'onboarding', 'steps', 'timeline']],
  ['Navigation', ['navigation-menu', 'menu', 'dock', 'tabs', 'pagination', 'link', 'breadcrumb', 'search']],
  ['Forms & Input', ['form', 'input', 'textarea', 'select', 'checkbox', 'radio-group', 'toggle', 'slider', 'date-picker', 'calendar', 'upload-download', 'sign-in', 'sign-up']],
  ['Data Display', ['table', 'list', 'card', 'stat', 'number', 'data-visualization', 'file-tree', 'map', 'globe', 'profile', 'avatar', 'badge', 'chip']],
  ['Overlays & Feedback', ['modal', 'popover', 'tooltip', 'dropdown', 'toast', 'notification', 'alert', 'progress', 'spinner', 'empty-state', 'accordion']],
  ['Media & Motion', ['image', 'gallery', 'carousel', 'video', 'marquee', 'background', 'cursor', 'scroll-area', 'border', 'icon', 'text']],
  ['AI & Utilities', ['ai-chat', 'hook', 'button']],
];

const grouped = new Set(GROUPS.flatMap(([, tags]) => tags));
const ungrouped = taxonomy.filter((t) => !grouped.has(t));
if (ungrouped.length) GROUPS.push(['Other', ungrouped]);
// Drop group entries that aren't real taxonomy tags (e.g. 'breadcrumb' placeholder).
const groups = GROUPS
  .map(([name, tags]) => [name, tags.filter((t) => tagIndex.has(t))])
  .filter(([, tags]) => tags.length);

// ---------------------------------------------------------------- components
mkdirSync(PREVIEW_OUT, { recursive: true });

const dirs = readdirSync(HARVEST).filter((d) => {
  try { return statSync(join(HARVEST, d)).isDirectory(); } catch { return false; }
});
log(`scanning ${dirs.length} harvest dirs`);

const components = [];
let previewBytes = 0;
let missingPreview = 0;
let missingMeta = 0;

for (const dir of dirs) {
  const dirPath = join(HARVEST, dir);
  const metaPath = join(dirPath, 'meta.json');
  if (!existsSync(metaPath)) { missingMeta++; continue; }

  let meta;
  try { meta = JSON.parse(readFileSync(metaPath, 'utf8')); }
  catch { missingMeta++; continue; }

  const previewName = PREVIEW_NAMES.find((n) => existsSync(join(dirPath, n)));
  if (!previewName) { missingPreview++; continue; }

  const ext = previewName.slice('preview.'.length);
  const outName = `${dir}.${ext}`;
  const src = join(dirPath, previewName);
  copyFileSync(src, join(PREVIEW_OUT, outName));
  previewBytes += statSync(src).size;

  // classification is keyed by the canonical 21st.dev url
  const rawTags = (meta.url && componentToTags[meta.url]) || [];
  const tagIds = [...new Set(rawTags.map((t) => tagIndex.get(t.tag)).filter((i) => i !== undefined))];

  components.push({
    i: dir,                                     // corpus dir id (also preview basename)
    n: meta.name || meta.slug || dir,           // display name
    a: meta.author || '',                       // author
    d: meta.description || '',                  // description
    u: meta.url || '',                          // upstream url
    t: tagIds,                                  // tag indices into taxonomy
    e: ext,                                     // preview extension
    b: existsSync(join(dirPath, 'bundle.html')) ? 1 : 0,
    s: existsSync(join(dirPath, 'demo.tsx')) ? 1 : 0,
    c: typeof meta.usage_count === 'number' ? meta.usage_count : null,
    v: meta.video_url || '',
    m: meta.installCommand || '',
  });
}

components.sort((a, b) => (b.c ?? -1) - (a.c ?? -1) || a.n.localeCompare(b.n));

const index = {
  generated: new Date().toISOString(),
  corpusPath: HARVEST,
  taxonomy,
  groups,
  total: components.length,
  components,
};

writeFileSync(join(DIST, 'index.json'), JSON.stringify(index));
copyFileSync(join(HERE, 'src', 'index.html'), join(DIST, 'index.html'));

const idxBytes = statSync(join(DIST, 'index.json')).size;
log(`indexed ${components.length} components`);
log(`previews copied: ${components.length}, ${(previewBytes / 1e6).toFixed(1)} MB`);
log(`index.json: ${(idxBytes / 1e6).toFixed(2)} MB`);
if (missingMeta) log(`skipped (no/bad meta.json): ${missingMeta}`);
if (missingPreview) log(`skipped (no preview): ${missingPreview}`);

// tag coverage sanity
const tagged = components.filter((c) => c.t.length).length;
log(`tagged: ${tagged}, untagged: ${components.length - tagged}`);
