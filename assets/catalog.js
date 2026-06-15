/* BIS Design Work — shared catalog renderer
   Drives showcase.html and studio.html from data/catalog.json.
   Layout: TOC + tabs + folder-aware card grid + drill-in breadcrumb. */

const CatalogHub = (() => {
  let DATA = null;
  let AUDIENCE = "showcase";
  let ROOT_LABEL = "Showcase";
  let SORT = "date"; // 'date' | 'name'

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const fmtDate = (d) => d || "—";

  const FOLDER_SVG = '<svg class="ic-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h3.6l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>';

  function catName(key) {
    const c = (DATA.categories || []).find(c => c.key === key);
    return c ? c.name : key;
  }

  // categories that actually have items for this audience, in catalog order
  function presentCategories(items) {
    const have = new Set(items.map(i => i.category));
    return (DATA.categories || []).filter(c => have.has(c.key)).map(c => c.key);
  }

  // the tabs to show for the current audience: the fixed configured set (shown even
  // when empty), unioned with any category that has items but isn't configured.
  function tabCategories(items) {
    const configured = DATA.config && DATA.config.tabs && DATA.config.tabs[AUDIENCE];
    const present = presentCategories(items);
    if (!configured) return present;
    const known = new Set((DATA.categories || []).map(c => c.key));
    const cats = configured.filter(k => known.has(k));
    present.forEach(k => { if (!cats.includes(k)) cats.push(k); });
    return cats;
  }

  function sortEntries(list) {
    const arr = list.slice();
    if (SORT === "name") {
      arr.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      arr.sort((a, b) => fmtDate(b.date).localeCompare(fmtDate(a.date)));
    }
    return arr;
  }

  function parseHash() {
    const raw = (location.hash || "").replace(/^#/, "");
    const [cat, folder] = raw.split("/");
    const dec = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
    return { cat: cat ? dec(cat) : null, folder: folder ? dec(folder) : null };
  }

  function go(cat, folder) {
    location.hash = folder ? `${cat}/${encodeURIComponent(folder)}` : (cat || "");
  }

  function badgeFor(it) {
    const label = it.ticket || it.tag;
    return label ? `<span class="badge${it.tag && !it.ticket ? " tag" : ""}">${esc(label)}</span>` : "";
  }

  function cardItem(it) {
    return `<a class="card" href="${esc(it.path)}" target="_blank" rel="noopener">
      ${badgeFor(it)}
      <span class="name">${esc(it.title)}</span>
      <span class="meta">${esc(fmtDate(it.date))}</span>
    </a>`;
  }

  function cardFolder(f) {
    const n = (f.children || []).length;
    return `<div class="card folder" data-folder="${esc(f.id)}" data-cat="${esc(f.category)}" role="button" tabindex="0">
      ${badgeFor(f)}
      <span class="name">${FOLDER_SVG}${esc(f.title)}</span>
      <span class="count">${n} item${n === 1 ? "" : "s"}</span>
      <span class="meta">${esc(fmtDate(f.date))}</span>
    </div>`;
  }

  function render() {
    const root = document.getElementById("catalog-root");
    const items = DATA.items.filter(i => i.audience === AUDIENCE);
    const cats = tabCategories(items);

    if (!cats.length) {
      root.innerHTML = `<p class="empty">Nothing here yet.</p>`;
      return;
    }

    let { cat, folder } = parseHash();
    if (!cats.includes(cat)) { cat = cats[0]; folder = null; }

    const inCat = items.filter(i => i.category === cat);
    const folders = inCat.filter(i => i.kind === "folder");
    const solos = inCat.filter(i => i.kind !== "folder");

    // active folder (only valid within current cat)
    const activeFolder = folder ? folders.find(f => f.id === folder) : null;

    // ---- tabs ----
    const tabs = cats.map(k =>
      `<button class="tab${k === cat ? " active" : ""}" data-cat="${k}">${esc(catName(k))}</button>`
    ).join("");

    // ---- breadcrumb ----
    let crumbs = `<a data-nav="${esc(cats[0])}">${esc(ROOT_LABEL)}</a>`;
    crumbs += ` <span class="sep">›</span> `;
    if (activeFolder) {
      crumbs += `<a data-nav="${esc(cat)}">${esc(catName(cat))}</a>`;
      crumbs += ` <span class="sep">›</span> <span class="here">${esc(activeFolder.title)}</span>`;
    } else {
      crumbs += `<span class="here">${esc(catName(cat))}</span>`;
    }

    // ---- TOC ----
    let toc = `<div class="toc-head">Contents</div>`;
    cats.forEach(k => {
      const ci = items.filter(i => i.category === k);
      const fs = ci.filter(i => i.kind === "folder");
      const ss = ci.filter(i => i.kind !== "folder");
      toc += `<div class="toc-group">
        <button class="toc-cat${k === cat ? " active" : ""}" data-cat="${k}">${esc(catName(k))}</button>`;
      sortEntries(fs).forEach(f => {
        toc += `<span class="toc-item" data-folder="${esc(f.id)}" data-cat="${esc(k)}"><span class="fld">${FOLDER_SVG}</span>${esc(f.title)}</span>`;
      });
      sortEntries(ss).forEach(s => {
        toc += `<a class="toc-item" href="${esc(s.path)}" target="_blank" rel="noopener">${esc(s.title)}</a>`;
      });
      toc += `</div>`;
    });

    // ---- grid ----
    let grid = "";
    if (activeFolder) {
      const kids = (activeFolder.children || []).map(c => ({
        kind: "item", title: c.title, path: c.path, date: c.date, ticket: c.ticket
      }));
      grid = sortEntries(kids).map(cardItem).join("") || `<p class="empty">Empty folder.</p>`;
    } else {
      if (folders.length) {
        grid += `<div class="group-label">Folders</div>`;
        grid += sortEntries(folders).map(cardFolder).join("");
      }
      if (solos.length) {
        if (folders.length) grid += `<div class="group-label">Files</div>`;
        grid += sortEntries(solos).map(cardItem).join("");
      }
      if (!folders.length && !solos.length) grid = `<p class="empty">Nothing in this tab yet.</p>`;
    }

    root.innerHTML = `
      <div class="tabs">${tabs}</div>
      <div class="subrow">
        <nav class="crumbs">${crumbs}</nav>
        <span class="sort">Sort
          <button data-sort="name" class="${SORT === "name" ? "active" : ""}">Name</button>
          <button data-sort="date" class="${SORT === "date" ? "active" : ""}">Date</button>
        </span>
      </div>
      <div class="catalog">
        <aside class="toc">${toc}</aside>
        <div class="grid">${grid}</div>
      </div>`;

    wire(root);
  }

  function wire(root) {
    root.querySelectorAll(".tab, .toc-cat, [data-nav]").forEach(el => {
      el.addEventListener("click", () => go(el.dataset.cat || el.dataset.nav, null));
    });
    root.querySelectorAll("[data-folder]").forEach(el => {
      const open = () => go(el.dataset.cat, el.dataset.folder);
      el.addEventListener("click", open);
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
    root.querySelectorAll("[data-sort]").forEach(el => {
      el.addEventListener("click", () => { SORT = el.dataset.sort; render(); });
    });
  }

  function applyLabels() {
    const label = (DATA.config && DATA.config.studioLabel) || "Studio";
    document.querySelectorAll("[data-studio-label]").forEach(el => { el.textContent = label; });
  }

  async function init(opts) {
    AUDIENCE = opts.audience;
    ROOT_LABEL = opts.rootLabel;
    DATA = await fetch("data/catalog.json", { cache: "no-store" }).then(r => r.json());
    applyLabels();
    window.addEventListener("hashchange", render);
    render();
  }

  return { init, applyLabels, _data: () => DATA };
})();
