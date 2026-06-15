// Auto-builds data/catalog.json from the showcase/ and studio/ folder trees.
//
// Rules:
//   - Audience  = top-level folder            (showcase | studio)
//   - Category  = the sub-folder under it     (wireframes, prototypes, docs, analysis, design-system)
//   - A .html directly in a category folder            -> solo card
//   - A sub-directory holding ONE index.html           -> solo card (title from the folder name)
//   - A sub-directory holding multiple .html files     -> folder card (drill-in), children = those files
//
// Curation is preserved: existing titles, dates, ticket numbers, and folder/child
// titles are kept by a stable key, so renames and promotions (moving a file from
// studio/ to showcase/) never lose your edits. New files get sensible defaults.
//
// Usage:  node scripts/build-catalog.mjs [outputPath]
//         (defaults to data/catalog.json; pass another path for a dry-run diff)

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = process.argv[2] || "data/catalog.json";
const AUDIENCES = ["showcase", "studio"];
const CATEGORY_ORDER = ["wireframes", "prototypes", "docs", "analysis", "design-system"];
const CATEGORY_NAMES = {
  wireframes: "Wireframes", prototypes: "Prototypes", docs: "Docs",
  analysis: "Analysis", "design-system": "Design System",
};
const TODAY = process.env.SYNC_DATE || new Date().toISOString().slice(0, 10);

const existing = readExisting();
const exItem = new Map();   // key: "<category>/<basename>"            -> item
const exFolder = new Map(); // key: "<category>/<folderId>"            -> folder
for (const it of existing.items || []) {
  if (it.kind === "folder") exFolder.set(`${it.category}/${it.id}`, it);
  else exItem.set(keyOf(it.category, it.path), it);
}

const items = [];
for (const audience of AUDIENCES) {
  const aDir = path.join(ROOT, audience);
  if (!isDir(aDir)) continue;
  for (const category of dirsIn(aDir)) {
    const cDir = path.join(aDir, category);
    const solos = [], folders = [];

    for (const entry of fs.readdirSync(cDir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;

      if (entry.isFile() && entry.name.endsWith(".html")) {
        if (entry.name.toLowerCase() === "index.html") continue; // category landing page, not a card
        const rel = posix(path.join(audience, category, entry.name));
        solos.push(makeItem({ audience, category, rel, name: entry.name }));
      } else if (entry.isDirectory()) {
        const htmls = walkHtml(path.join(cDir, entry.name)).sort();
        if (htmls.length === 0) continue;
        const onlyIndex = htmls.length === 1 && base(htmls[0]) === "index";
        if (onlyIndex) {
          const rel = posix(path.relative(ROOT, htmls[0]));
          solos.push(makeItem({ audience, category, rel, name: entry.name, titleFromFolder: true }));
        } else {
          folders.push(makeFolder({ audience, category, folderName: entry.name, htmls }));
        }
      }
    }

    folders.sort(byTitle);
    solos.sort(byTitle);
    items.push(...folders, ...solos);
  }
}

const out = {
  config: existing.config || {
    studioLabel: "Studio",
    tabs: {
      showcase: ["wireframes", "prototypes", "docs", "design-system"],
      studio: ["docs", "analysis", "presentations", "design-system"],
    },
  },
  categories: mergeCategories(existing.categories),
  items: orderItems(items),
};
fs.writeFileSync(path.join(ROOT, OUT), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${OUT}: ${out.items.length} entries (${items.filter(i=>i.kind==="folder").length} folders).`);

// ---------- helpers ----------
function readExisting() {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, "data/catalog.json"), "utf8")); }
  catch { return {}; }
}
function isDir(p) { try { return fs.statSync(p).isDirectory(); } catch { return false; } }
function dirsIn(p) { return fs.readdirSync(p, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); }
function base(p) { return decodeURIComponent(path.basename(p)).replace(/\.html$/i, ""); }
function keyOf(category, relpath) {
  const b = base(relpath);
  if (b.toLowerCase() === "index") return `${category}/${decodeURIComponent(path.basename(path.dirname(relpath)))}`;
  return `${category}/${b}`;
}
function posix(p) { return p.split(path.sep).join("/"); }
function byTitle(a, b) { return a.title.localeCompare(b.title); }
function encodePath(rel) { return rel.split("/").map(encodeURIComponent).join("/"); }

function walkHtml(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkHtml(full));
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
}
function ticketFrom(s) {
  const m = s.match(/tkt-?(\d+)/i);
  return m ? `TKT-${m[1]}` : null;
}
function prettify(name) {
  let s = name.replace(/\.html$/i, "").replace(/^tkt-?\d+[-_ ]*/i, "").replace(/[-_]+/g, " ").trim();
  if (!s) s = name.replace(/\.html$/i, "");
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function makeItem({ audience, category, rel, name, titleFromFolder }) {
  const prev = exItem.get(keyOf(category, rel));
  const ticket = ticketFrom(name) || (prev && prev.ticket) || null;
  // Title = the descriptive part of the filename (ticket prefix stripped by prettify);
  // the ticket itself shows as the badge. A real curated title is kept, but a title that
  // is just the bare ticket counts as auto-generated and gets recomputed (self-healing).
  const curated = prev && prev.title && prev.title !== ticket;
  const title = curated ? prev.title : prettify(name);
  const item = { kind: "item", audience, category, title, date: (prev && prev.date) || TODAY, path: encodePath(rel) };
  if (ticket) item.ticket = ticket;
  return item;
}
function makeFolder({ audience, category, folderName, htmls }) {
  const id = folderName;
  const prev = exFolder.get(`${category}/${id}`);
  const prevChild = new Map((prev && prev.children || []).map(c => [base(c.path), c]));
  const children = htmls.map(h => {
    const rel = posix(path.relative(ROOT, h));
    const pc = prevChild.get(base(h));
    return { title: (pc && pc.title) || prettify(path.basename(h)), path: encodePath(rel), date: (pc && pc.date) || TODAY };
  });
  const ticket = ticketFrom(folderName) || (prev && prev.ticket) || null;
  const folder = { kind: "folder", audience, category, id, title: (prev && prev.title) || prettify(folderName), date: (prev && prev.date) || TODAY, children };
  if (ticket) folder.ticket = ticket;
  return folder;
}
function mergeCategories(cats) {
  const known = cats && cats.length ? cats : CATEGORY_ORDER.map(k => ({ key: k, name: CATEGORY_NAMES[k] }));
  const seen = new Set(known.map(c => c.key));
  for (const it of items) if (!seen.has(it.category)) { known.push({ key: it.category, name: CATEGORY_NAMES[it.category] || prettify(it.category) }); seen.add(it.category); }
  return known;
}
function orderItems(list) {
  const ai = (a) => AUDIENCES.indexOf(a.audience);
  const ci = (a) => { const i = CATEGORY_ORDER.indexOf(a.category); return i === -1 ? 99 : i; };
  return list.slice().sort((a, b) => ai(a) - ai(b) || ci(a) - ci(b) || (a.kind === b.kind ? 0 : a.kind === "folder" ? -1 : 1) || byTitle(a, b));
}
