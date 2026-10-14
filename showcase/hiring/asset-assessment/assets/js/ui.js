/*
  Shared prototype behaviour for the Assets mockups. Each piece mirrors what the live app uses
  (captured 2026-10-14):
    toast(msg)          SweetAlert2 toast, 3 s, explains what the live app would do next
    flash(msg)          toast shown on the NEXT page load (after a redirect)
    confirm(opts)       SweetAlert2 warning dialog (live: Deactivate)
    select(box, opts)   react-select (open / hover / keyboard / choose)
    tooltips(root)      react-tooltip type-dark on [data-tip]                  (live: asset list)
    popovers(root)      Bootstrap popover on hover for [data-popover]          (live: info icons)
                        Bootstrap tooltip on hover for [data-bs-tip]           (live: Recipient Name)
    colourPicker(...)   react-color SketchPicker
    modal(opts)         react-bootstrap modal, .modal-primary.modal-cs          (live: Move Asset)
*/
window.BIS_UI = (function () {
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---------- SweetAlert2 toast / confirm ----------
  const Toast = () => window.Swal && window.Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true,
    customClass: { popup: 'proto-swal-toast' },
  });
  function toast(message, icon = 'info') {
    const T = Toast();
    if (T) T.fire({ icon, title: message });
    else console.log('[toast]', message);
  }
  const FLASH = 'bis-asset-proto-flash';
  function flash(message, icon = 'success') { try { sessionStorage.setItem(FLASH, JSON.stringify({ message, icon })); } catch (e) {} }
  function showFlash() {
    try { const f = JSON.parse(sessionStorage.getItem(FLASH) || 'null'); sessionStorage.removeItem(FLASH); if (f) toast(f.message, f.icon); } catch (e) {}
  }
  function confirm({ title = 'Warning', text, confirmText = 'Confirm', cancelText = 'Cancel' }) {
    return window.Swal.fire({
      icon: 'warning', title, text, showDenyButton: true, reverseButtons: true,
      confirmButtonText: confirmText, denyButtonText: cancelText,
      customClass: { popup: 'sw-prompt-lg' },
    }).then(r => r.isConfirmed);
  }

  // ---------- react-select ----------
  // box: wrapper element; must contain the control (`[data-control]` or `.select__control`) and a `[data-value-slot]`.
  // opts: { getOptions, getValue, setValue, placeholder, valueClass, placeholderClass, menuClass, renderValue, onChange }
  const openMenus = new Set();
  function select(box, opts) {
    const ctl = box.querySelector('[data-control]') || box.querySelector('.select__control');
    const slot = box.querySelector('[data-value-slot]');
    let menu = null, focus = 0;
    Object.entries({ tabindex: '0', role: 'combobox', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', 'aria-label': opts.ariaLabel || opts.placeholder || 'Select' })
      .forEach(([k, v]) => ctl.setAttribute(k, v));
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';

    const paint = () => {
      const o = opts.getOptions().find(x => x.value === opts.getValue());
      const real = o && o.value !== '';
      slot.innerHTML = real ? (opts.renderValue ? opts.renderValue(o) : esc(o.label)) : esc(opts.placeholder || 'Select...');
      slot.className = real ? (opts.valueClass || 'select__single-value select__single-value-sm') : (opts.placeholderClass || 'select__placeholder css-14el2xx-placeholder');
    };
    const close = () => {
      if (!menu) return;
      menu.remove(); menu = null; openMenus.delete(close);
      removeEventListener('scroll', position, true); removeEventListener('resize', position);
      ctl.classList.remove('is-focused'); ctl.setAttribute('aria-expanded', 'false');
    };
    // Menu is portalled to <body> (react-select menuPortalTarget) so it always sits above cards,
    // images and modals, whatever stacking context the control lives in. Flips up if no room below.
    const position = () => {
      if (!menu) return;
      const r = ctl.getBoundingClientRect(), h = menu.offsetHeight, gap = 8;
      const below = r.bottom + gap + h <= innerHeight || r.top - gap - h < 0;
      Object.assign(menu.style, { position: 'fixed', left: r.left + 'px', width: r.width + 'px', margin: '0',
        top: (below ? r.bottom + gap : r.top - gap - h) + 'px' });
    };
    const render = () => {
      const list = opts.getOptions();
      menu.firstChild.innerHTML = list.map((o, i) =>
        `<div class="select__option${i === focus ? ' select__option--is-focused' : ''}${o.value === opts.getValue() ? ' select__option--is-selected' : ''}" role="option" aria-selected="${o.value === opts.getValue()}" data-i="${i}">${esc(o.label)}</div>`).join('');
      // keep the focused option visible by scrolling the menu list only (never the page)
      const lst = menu.firstChild, f = menu.querySelector('.select__option--is-focused');
      if (f) { if (f.offsetTop < lst.scrollTop) lst.scrollTop = f.offsetTop; else if (f.offsetTop + f.offsetHeight > lst.scrollTop + lst.clientHeight) lst.scrollTop = f.offsetTop + f.offsetHeight - lst.clientHeight; }
    };
    const open = () => {
      openMenus.forEach(c => c());
      const list = opts.getOptions();
      focus = Math.max(0, list.findIndex(o => o.value === opts.getValue()));
      menu = document.createElement('div');
      menu.className = 'select__menu' + (opts.menuClass ? ' ' + opts.menuClass : '');
      menu.innerHTML = '<div class="select__menu-list" role="listbox"></div>';
      Object.assign(menu.style, { position: 'fixed', top: '-9999px', left: '0' });   // never affects page height
      document.body.appendChild(menu); render(); position(); openMenus.add(close);
      addEventListener('scroll', position, true); addEventListener('resize', position);
      ctl.classList.add('is-focused'); ctl.setAttribute('aria-expanded', 'true');
      menu.addEventListener('mousemove', e => { const o = e.target.closest('[data-i]'); if (o && +o.dataset.i !== focus) { focus = +o.dataset.i; render(); } });
      menu.addEventListener('mousedown', e => { e.preventDefault(); const o = e.target.closest('[data-i]'); if (o) choose(+o.dataset.i); });
    };
    const choose = i => {
      const o = opts.getOptions()[i]; if (!o) return;
      const changed = o.value !== opts.getValue();
      opts.setValue(o.value); paint(); close();
      if (changed && opts.onChange) opts.onChange(o);
    };
    ctl.addEventListener('mousedown', e => { e.preventDefault(); ctl.focus(); menu ? close() : open(); });
    ctl.addEventListener('keydown', e => {
      const n = opts.getOptions().length;
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) e.preventDefault();
      if (!menu) { if (['ArrowDown', 'Enter', ' '].includes(e.key)) open(); return; }
      if (e.key === 'ArrowDown') { focus = (focus + 1) % n; render(); }
      else if (e.key === 'ArrowUp') { focus = (focus - 1 + n) % n; render(); }
      else if (e.key === 'Enter' || e.key === ' ') choose(focus);
      else if (e.key === 'Escape' || e.key === 'Tab') close();
    });
    ctl.addEventListener('blur', close);
    paint();
    return { paint, close };
  }

  // ---------- positioning helper ----------
  function place(tip, target, placement, gap) {
    const r = target.getBoundingClientRect(), t = tip.getBoundingClientRect();
    let x = r.left + r.width / 2 - t.width / 2, y = r.top - t.height - gap;
    if (placement === 'bottom') y = r.bottom + gap;
    if (placement === 'right') { x = r.right + gap; y = r.top + r.height / 2 - t.height / 2; }
    if (placement === 'left') { x = r.left - t.width - gap; y = r.top + r.height / 2 - t.height / 2; }
    const cx = Math.max(8, Math.min(x, innerWidth - t.width - 8));
    tip.style.position = 'fixed'; tip.style.left = cx + 'px'; tip.style.top = y + 'px';  // fixed: the app scrolls inside #layout-wrapper-sub, not the body
    return r.left + r.width / 2 - cx; // arrow offset for top/bottom
  }
  function hoverable(el, show, hide) {
    if (el.__hoverBound) return; el.__hoverBound = true;
    if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT)$/.test(el.tagName)) el.setAttribute('tabindex', '0');
    el.addEventListener('mouseenter', show); el.addEventListener('focus', show);
    el.addEventListener('mouseleave', hide); el.addEventListener('blur', hide);
  }

  // ---------- react-tooltip (type-dark) ----------
  let rtip;
  function tooltips(root = document) {
    if (!rtip) { rtip = document.createElement('div'); rtip.id = 'proto-rtip'; rtip.setAttribute('role', 'tooltip'); document.body.appendChild(rtip); }
    root.querySelectorAll('[data-tip]').forEach(el => hoverable(el, () => {
      const p = el.getAttribute('data-place') || 'top';
      rtip.textContent = el.getAttribute('data-tip');
      rtip.className = `__react_component_tooltip type-dark proto-tip place-${p}`;
      place(rtip, el, p, 10); rtip.classList.add('show'); el.setAttribute('aria-describedby', 'proto-rtip');
    }, () => rtip.classList.remove('show')));
  }

  // ---------- Bootstrap popover / tooltip on hover ----------
  let pop;
  function popovers(root = document) {
    const hide = () => { if (pop) { pop.remove(); pop = null; } };
    root.querySelectorAll('[data-popover]').forEach(el => hoverable(el, () => {
      hide();
      pop = document.createElement('div');
      pop.setAttribute('role', 'tooltip'); pop.id = 'proto-popover';
      pop.className = 'fade show popover bs-popover-bottom';
      pop.innerHTML = `<div class="arrow"></div><div class="popover-body"><span style="font-size: 15px;">${esc(el.getAttribute('data-popover'))}</span></div>`;
      document.body.appendChild(pop);
      const off = place(pop, el, 'bottom', 0);
      pop.querySelector('.arrow').style.left = (off - 8) + 'px';
      el.setAttribute('aria-describedby', 'proto-popover');
    }, hide));
    root.querySelectorAll('[data-bs-tip]').forEach(el => hoverable(el, () => {
      hide();
      pop = document.createElement('div');
      pop.setAttribute('role', 'tooltip'); pop.id = 'proto-popover';
      pop.className = 'fade show tooltip bs-tooltip-top';
      pop.innerHTML = `<div class="arrow"></div><div class="tooltip-inner">${esc(el.getAttribute('data-bs-tip'))}</div>`;
      document.body.appendChild(pop);
      const off = place(pop, el, 'top', 0);
      pop.querySelector('.arrow').style.left = (off - 4) + 'px';
      el.setAttribute('aria-describedby', 'proto-popover');
    }, hide));
  }

  // ---------- react-color SketchPicker ----------
  const PRESETS = ['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'];
  const hexToRgb = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  function rgbToHsv(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0;
    if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx]; }
  function hsvToRgb(h, s, v) { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5) * 255, f(3) * 255, f(1) * 255]; }

  function colourPicker(anchor, initialHex, onChange) {
    let [h, s, v] = rgbToHsv(...hexToRgb(/^#[0-9a-f]{6}$/i.test(initialHex || '') ? initialHex : '#ffffff'));
    const wrap = document.createElement('div');
    wrap.className = 'proto-sketch-wrap';
    wrap.innerHTML = `<div class="proto-sketch-cover"></div>
      <div class="proto-sketch sketch-picker" role="dialog" aria-label="Choose colour">
        <div class="sat"><div class="hue-bg"></div><div class="w"><div class="b"></div></div><div class="ptr"></div></div>
        <div class="row1"><div class="hue"><div class="ptr"></div></div><div class="preview"></div></div>
        <div class="fields">
          <div><input data-f="hex" spellcheck="false"><label>hex</label></div>
          <div><input data-f="r"><label>r</label></div><div><input data-f="g"><label>g</label></div><div><input data-f="b"><label>b</label></div>
        </div>
        <div class="presets">${PRESETS.map(c => `<button type="button" title="${c}" aria-label="${c}" style="background:${c}"></button>`).join('')}</div>
      </div>`;
    document.body.appendChild(wrap);
    // fixed, below the field, or above it when there is not enough room
    const r = anchor.getBoundingClientRect(), ph = wrap.querySelector('.proto-sketch').getBoundingClientRect().height;
    wrap.style.left = r.left + 'px';
    wrap.style.top = (r.bottom + ph + 8 > innerHeight ? Math.max(8, r.top - ph - 4) : r.bottom) + 'px';
    const q = s => wrap.querySelector(s);
    const sat = q('.sat'), hue = q('.hue');
    const sync = (fromInput) => {
      const rgb = hsvToRgb(h, s, v), hex = rgbToHex(...rgb);
      q('.hue-bg').style.cssText = `position:absolute;inset:0;background:hsl(${h},100%,50%)`;
      q('.sat .ptr').style.cssText = `left:${s * 100}%;top:${(1 - v) * 100}%`;
      q('.hue .ptr').style.left = (h / 360 * 100) + '%';
      q('.preview').style.background = hex;
      if (fromInput !== 'hex') q('[data-f=hex]').value = hex.slice(1).toUpperCase();
      ['r', 'g', 'b'].forEach((k, i) => { if (fromInput !== k) q(`[data-f=${k}]`).value = Math.round(rgb[i]); });
      onChange(hex);
    };
    const drag = (el, fn) => el.addEventListener('mousedown', e => {
      e.preventDefault(); const move = ev => { const b = el.getBoundingClientRect(); fn(Math.min(1, Math.max(0, (ev.clientX - b.left) / b.width)), Math.min(1, Math.max(0, (ev.clientY - b.top) / b.height))); sync(); };
      move(e); const up = () => { removeEventListener('mousemove', move); removeEventListener('mouseup', up); };
      addEventListener('mousemove', move); addEventListener('mouseup', up);
    });
    drag(sat, (x, y) => { s = x; v = 1 - y; });
    drag(hue, x => { h = x * 359.9; });
    q('.presets').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; [h, s, v] = rgbToHsv(...hexToRgb(b.title)); sync(); });
    q('.fields').addEventListener('input', e => {
      const f = e.target.dataset.f;
      if (f === 'hex') { const val = e.target.value.replace('#', ''); if (/^[0-9a-f]{6}$/i.test(val)) { [h, s, v] = rgbToHsv(...hexToRgb(val)); sync('hex'); } }
      else { const rgb = ['r', 'g', 'b'].map(k => Math.max(0, Math.min(255, +q(`[data-f=${k}]`).value || 0))); [h, s, v] = rgbToHsv(...rgb); sync(f); }
    });
    const close = () => { wrap.remove(); removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', onKey);
    q('.proto-sketch-cover').addEventListener('click', close);
    sync('init');
    q('[data-f=hex]').focus();
  }

  // ---------- react-bootstrap modal (.modal-primary.modal-cs) ----------
  function modal({ title, body, okHtml, okDisabled = true, onMount, onOk }) {
    const backdrop = document.createElement('div');
    backdrop.className = 'fade modal-backdrop show';
    const m = document.createElement('div');
    m.className = 'fade modal-primary modal-cs modal show proto-modal';
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'proto-modal-title');
    m.tabIndex = -1; m.style.display = 'block';
    m.innerHTML = `<div class="modal-dialog modal-md"><div class="modal-content">
        <div class="modal-header"><div class="ml-n2 text-white modal-title h4"><h2 id="proto-modal-title">${esc(title)}</h2></div><button type="button" class="close" data-close><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div>
        <div class="modal-body">${body}</div>
        <div class="modal-footer"><button type="button" class="btn btn-danger" data-close><i class="fad fa-times"></i>&nbsp;Cancel</button><button ${okDisabled ? 'disabled=""' : ''} type="button" class="btn btn-success" data-ok>${okHtml}</button></div>
      </div></div>`;
    document.body.append(backdrop, m);
    document.body.classList.add('modal-open');
    const close = () => { m.remove(); backdrop.remove(); document.body.classList.remove('modal-open'); removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    addEventListener('keydown', onKey);
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) close(); });
    const ok = m.querySelector('[data-ok]');
    ok.addEventListener('click', () => { if (!ok.disabled) { onOk(); close(); } });
    if (onMount) onMount(m, enabled => { ok.disabled = !enabled; });
    m.focus();
    return { close };
  }

  addEventListener('scroll', () => { if (pop) { pop.remove(); pop = null; } if (rtip) rtip.classList.remove('show'); }, true);

  return { toast, flash, showFlash, confirm, select, tooltips, popovers, colourPicker, modal, esc };
})();
