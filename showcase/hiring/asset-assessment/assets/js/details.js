/*
  Asset details screen (one component in the live app, two modes):
    BIS_DETAILS.render({ mode: 'view', asset })     -> existing asset
    BIS_DETAILS.render({ mode: 'new',  cat })       -> Add New (empty, most sections disabled)
  Markup and class names follow the live DOM (captured 2026-10-13/14).
  Removed for the assessment: QR Label, Duplicate, Assign Asset (view), "attached to",
  Location + sub-location access, Location Contact Name, Make Available Offline,
  Qualified Personnel, Attached Assets, Linked Sub Assets, Documents, Tasks,
  Scheduled Forms, On Demand Forms.
  Behaviour: controls work like the live app; anything that would open another page shows a
  3-second toast saying what the live app does instead.
*/
window.BIS_DETAILS = (function () {
  const D = window.BIS_DATA, UI = window.BIS_UI, CHEVRON = window.BIS_SHELL.CHEVRON, esc = UI.esc;

  // Live copy (info-icon popovers / tooltip), verbatim
  const COPY = {
    statusInfo: 'Status options can be added or updated by administrators with access to the Assets module settings (Admin>Assets>Gear icon).',
    typeInfo: 'Type options can be added or updated by administrators with access to the Assets module settings (Admin>Assets>Gear icon).',
    recipientInfo: 'This scheduled form was completed by an email recipient.',
    moveIntro: 'Move this asset to another asset category (excluding the Location asset category).',
    deactivate: 'Are you sure you want to deactivate this asset?',
  };
  const EDITABLE = ['status', 'type', 'colour', 'photo', 'name', 'mileage', 'unit', 'mainContact', 'address', 'workPhone', 'description'];
  const today = () => { const d = new Date(); return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`; };

  // ---------- Gauge (geometry measured from the live d3 chart) ----------
  // f: 0 = far left (red), 1 = far right (green)
  function gaugeSvg(W, f) {
    const H = 0.45 * W, R = 0.36 * W, r = 0.9 * R, tx = (W - 2 * R) / 2, ty = 0.0225 * W;
    const pt = (rad, deg) => { const a = Math.PI * (1 - deg / 180); return [rad * Math.cos(a), -rad * Math.sin(a)]; };
    const arc = (d0, d1, fill) => {
      const [x0, y0] = pt(R, d0), [x1, y1] = pt(R, d1), [x2, y2] = pt(r, d1), [x3, y3] = pt(r, d0);
      return `<g class="arc"><path d="M${x0},${y0}A${R},${R},0,0,1,${x1},${y1}L${x2},${y2}A${r},${r},0,0,0,${x3},${y3}Z" style="fill: ${fill};"></path></g>`;
    };
    const zone = f < 1 / 3 ? '#bf3d3d' : f < 2 / 3 ? '#eed9a4' : '#acdba5';
    const theta = Math.PI * (1 - f), dx = Math.cos(theta), dy = -Math.sin(theta);
    const cy = -0.0375 * R, L = 0.55 * R, w = 0.075 * R;
    const tip = [dx * L, cy + dy * L], b1 = [-dy * w, cy + dx * w], b2 = [dy * w, cy - dx * w];
    return `<svg width="${W}" height="${H}" aria-hidden="true"><g transform="translate(${tx}, ${ty})">
      <g class="doughnut" transform="translate(${R}, ${R})">${arc(0, 60, 'rgb(191, 61, 61)')}${arc(60, 120, 'rgb(238, 217, 164)')}${arc(120, 180, 'rgb(172, 219, 165)')}</g>
      <g class="needle" transform="translate(${R}, ${R})"><path d="M ${b1[0]} ${b1[1]} L ${tip[0]} ${tip[1]} L ${b2[0]} ${b2[1]}" fill="#5b5b5b"></path><circle cx="0" cy="${cy}" r="${w}" fill="${zone}"></circle></g>
    </g></svg>`;
  }
  const gaugeFraction = n => n === 0 ? 0.816 : n === 1 ? 0.5 : n === 2 ? 0.3 : n === 3 ? 0.25 : 0.184;

  // ---------- Pieces ----------
  const statusSelect = () => `
    <div class="status-option col-11">
      <div class="mr-2" id="status-dot" style="width: 20px; height: 20px; border-radius: 10px; min-width: 20px;"></div>
      <div class="optionWidth css-1q2f5fd-container" id="equipmentdetails-select-type-text">
        <div class="css-1dwmyhk-control" data-control><div class="css-1gnqmcz"><div data-value-slot></div></div>
          <div class="css-l8ppft"><span class="css-akwnqi-indicatorSeparator"></span><div class="css-d7eoi-indicatorContainer" aria-hidden="true">${CHEVRON}</div></div></div>
      </div>
      <button type="button" class="ml-2 buttonStyle btn btn-light btn-sm" data-popover="${esc(COPY.statusInfo)}" aria-label="About status options"><i class="fad fa-info-circle cursor-pointer"></i></button>
    </div>`;

  const input = (label, field, value = '') => `
    <div class="align-items-center py-2 form-group">
      <label class="font-weight-bold form-label" for="fields-${field}">${label}</label>
      <input placeholder="" autocomplete="off" id="fields-${field}" data-field="${field}" class="form-control" value="${esc(value)}">
    </div>`;

  const typeSelect = () => `
    <div class="align-items-center py-2 form-group">
      <label class="font-weight-bold form-label" id="type-label">Type<i class="fad fa-info-circle ml-2 cursor-pointer" data-popover="${esc(COPY.typeInfo)}" aria-label="About type options" role="img"></i></label>
      <div class="css-t7ynxi-container" id="type-select"><div class="css-1dpobrn-control" data-control><div class="css-jai0xx"><div data-value-slot></div></div>
        <div class="css-1wy0on6"><span class="css-akwnqi-indicatorSeparator"></span><div class="css-d7eoi-indicatorContainer" aria-hidden="true">${CHEVRON}</div></div></div></div>
    </div>`;

  const mileage = d => `
    <div class="align-items-center py-2 form-group">
      <label class="font-weight-bold form-label" for="fields-mileage">Mileage</label>
      <div class="row">
        <div class="col-8"><input placeholder="" autocomplete="off" id="fields-mileage" data-field="mileage" class="form-control" value="${esc(d.mileage)}"></div>
        <div class="col-4"><select id="fields-unit" data-field="unit" class="form-control" aria-label="Mileage unit"><option value="km"${d.unit === 'km' ? ' selected' : ''}>km</option><option value="mi"${d.unit === 'mi' ? ' selected' : ''}>mi</option></select></div>
      </div>
    </div>`;

  const pendingCard = a => {
    if (!a || !a.pending.length) {
      return `<div class="row"><div class="text-center mt-5 col-12" id="gaugechart-no-pending-forms-sentence"><span>No pending forms available</span></div></div>`;
    }
    return `<div id="gaugechart-form-id-table-header-loop-wrapper" class="gauge-card-main-container">${a.pending.map((f, i) => `
      <div class="works__row mb-3 row" style="background-color: rgb(191, 61, 61);">
        <div class="p-0 col-lg-1"><div class="icon"><i class="fad fa-file-contract file__text" aria-hidden="true"></i></div></div>
        <div class="p-0 col-lg-11"><div class="content__box"><div class="gauge-contents"><div class="row">
          <div class="details__content col-lg-8"><h4 class="daily_check">${esc(f.title)}</h4><small class="text-dark font-weight-bold">Form ID: ${f.formId}</small><p class="date__name"></p></div>
          <div class="col-lg-4"><div class="btn__grp d-flex justify-content-center">
            <button type="button" class="mr-1 my-2 btn btn-info" data-toast="Preview opens a read-only copy of &quot;${esc(f.title)}&quot; in a new tab.">Preview</button>
            <button type="button" class="ml-2 my-2 btn btn-success" data-toast="Resume opens &quot;${esc(f.title)}&quot; so you can keep filling it in.">Resume</button>
          </div></div>
        </div></div></div></div>
      </div>`).join('')}</div>`;
  };

  // Accordion section. disabled = Add New state ("<Title>- disabled", italic grey, not clickable)
  const accordion = (key, title, body, { open = false, disabled = false, wrapCls = 'margin-b15 margin-lr-n15 px-4 mt-5 accordion', hrCls = 'margin-lr-n15 mt-1' } = {}) => `
    <div class="${disabled ? wrapCls.replace('margin-b15', 'margin-b15 disabled-background') : wrapCls}" data-acc="${key}">
      <div class="row"><div class="col">
        <div ${disabled ? 'disabled=""' : `role="button" tabindex="0" aria-expanded="${open}"`} class="${disabled ? '' : 'cursor-pointer'} align-items-center row" data-acc-toggle="${disabled ? '' : key}">
          <div class="col"><h4 class="font-weight-bold">${title}${disabled ? '- disabled' : ''}</h4></div>
          <div class="text-right col"><i class="fad ${open ? 'fa-angle-up' : 'fa-angle-down'} fa-2x" aria-hidden="true"></i></div>
        </div>
        <hr class="${hrCls}">
      </div></div>
      <div class="collapse${open ? ' show' : ''}">${body}</div>
    </div>`;

  const dateFilters = (prefix, lg) => `
    <div class="d-flex justify-content-around my-1 col-lg-auto ${lg} col-12">
      ${['From', 'To'].map(l => `<div class="datepicker-wrapper"><div class="react-datepicker-wrapper"><div class="react-datepicker__input-container"><div class="floating-label mb-0 px-2 input-group"><input placeholder=" " id="${prefix}-${l.toLowerCase()}-place-holder" class="form-control height-33 floating-input" value="" aria-label="${l} date"><label class="fl-label">${l}</label><div class="input-group-append"><span class="input-group-text"><i class="fad fa-calendar"></i></span></div></div></div></div></div>`).join('')}
    </div>`;

  const th = (label, cls) => `<th class="${cls}"><span class="cursor-pointer">${label}<i class="fa fa-sort margin-l3"></i></span></th>`;

  const pendingRows = (a, q = '') => {
    const rows = (a ? a.pending : []).filter(f => !q || f.title.toLowerCase().includes(q.toLowerCase()));
    if (!rows.length) return `<tr><td colspan="9" class="text-center borderless">No pending forms found</td></tr>`;
    return rows.map(f => {
      const resend = f.sentTo !== '-'
        ? `<button ${f.sentTo === 'Anonymous' ? 'disabled=""' : ''} type="button" class="m-1 btn btn-info" data-toast="Resend emails &quot;${esc(f.title)}&quot; to ${esc(f.sentTo)} again."><span class="d-none d-lg-inline mr-2">Resend</span><i class="fad fa-share-square"></i></button>` : '';
      return `<tr>
        <td class="width-20 pl-4"><span class="text-break">${esc(f.title)}</span><br><span class="text-danger">${esc(f.stage)} &nbsp;</span></td>
        <td class="width-10 d-none d-xl-table-cell"><span class="text-break">${f.formId}</span></td>
        <td class="width-10 d-none d-xl-table-cell"><span class="text-break">${esc(f.sentTo)}</span></td>
        <td class="width-10 d-none d-xl-table-cell text-center"><span class="text-break">${esc(f.by)}</span></td>
        <td class="width-10 d-none d-xl-table-cell"><span>${f.dateSent}</span></td>
        <td class="width-10 text-center d-none d-xl-table-cell"><span>-</span></td>
        <td class="width-10 d-none d-xl-table-cell"><span>-</span></td>
        <td class="width-40 text-right action-cell pr-4">
          <span class="show-elements-hover">${resend}<button type="button" class="m-1 btn btn-primary" data-toast="Reassign lets you choose a different user to complete &quot;${esc(f.title)}&quot;."><span class="d-none d-lg-inline mr-2">Reassign</span><i class="fad fa-link"></i></button></span>
          <span class="margin-l3"><button type="button" class="hover-btn btn btn-light btn-sm" data-more><span class="hidden-xs hidden-sm btn-labels mr-2">More</span><i class="fad fa-ellipsis-h-alt fa-sm"></i></button></span>
          <button type="button" class="m-1 btn btn-danger" data-toast="Discard asks you to confirm, then removes &quot;${esc(f.title)}&quot; from Pending Forms."><span class="d-none d-lg-inline mr-2">Discard</span><i class="fad fa-trash"></i></button>
          <button type="button" class="m-1 btn btn-success" data-toast="Open loads &quot;${esc(f.title)}&quot; at its current stage (${esc(f.stage)})."><span class="d-none d-lg-inline mr-2">Open</span><i class="fad fa-folder-open"></i></button>
        </td></tr>`;
    }).join('');
  };

  const pendingSection = (a, disabled) => accordion('pending', 'Pending Forms', `
      <div class="my-3 align-items-center row">
        <div class="my-1 col-lg-auto col-sm-6 col-12"><div class="floating-label mb-0 form-group"><input placeholder=" " type="text" class="height-33 floating-input form-control" value="" data-table-search="pending" aria-label="Search pending forms"><label class="fl-label">Search</label></div></div>
        ${dateFilters('pendingforms', 'col-sm-6')}
        <div class="text-center my-1 col-lg-auto col-12">
          <button type="button" class="mr-2 btn btn-danger" data-table-reset="pending"><span class="d-none d-sm-inline mr-2">Reset</span><i class="fad fa-trash-undo"></i></button>
          <button disabled="" type="button" class="btn btn-success" data-table-go="pending"><span class="d-none d-sm-inline mr-2">Search</span><i class="fad fa-search"></i></button>
        </div>
      </div>
      <div class="row"><div class="margin-b20 px-0 mt-3 col-12">
        <table class="tableHead-holder table table-hover"><thead><tr>
          ${th('Title', 'width-20 pl-4')}${th('Form ID', 'width-10 d-none d-xl-table-cell')}${th('Sent To', 'width-10 d-none d-xl-table-cell')}${th('By', 'width-10 d-none d-xl-table-cell text-center')}${th('Date Sent', 'width-10 d-none d-xl-table-cell')}${th('Last Updated', 'width-10 text-center d-none d-xl-table-cell')}${th('Status', 'width-10 d-none d-xl-table-cell')}
          <th class="width-40 text-right action-cell pr-4">Action</th>
        </tr></thead><tbody data-tbody="pending">${pendingRows(a)}</tbody></table>
      </div></div>`, { disabled });

  const completedRows = (a, q = '') => {
    const rows = (a ? a.completed : []).filter(f => !q || f.title.toLowerCase().includes(q.toLowerCase()));
    if (!rows.length) return `<tr><td colspan="9" class="text-center borderless">No completed forms found</td></tr>`;
    return rows.map(f => `<tr>
      <td class="width-10 pl-4"><div class="d-flex align-items-center"><div><a href="#" data-toast="Opens the completed &quot;${esc(f.title)}&quot; form in a new tab.">${esc(f.title)}</a></div></div></td>
      <td class="width-10 d-none d-lg-table-cell"><span class="text-break">${esc(f.by)}</span></td>
      <td class="width-10 text-center d-none d-lg-table-cell"><span class="text-break">${esc(f.completedBy)}</span></td>
      <td class="width-10 d-none d-xl-table-cell"><span>${f.date}</span></td>
      <td class="width-10 d-none d-xl-table-cell"><span class="text-break">${f.formId}</span></td>
      <td class="width-10 d-none d-xl-table-cell"><span>${f.expiry}</span></td>
      <td class="width-10 d-none d-xl-table-cell"><span>${f.status}</span></td>
      <td class="width-10 d-none d-xl-table-cell"><span class="text-break">-</span></td>
      <td class="width-30 d-none d-xl-table-cell"><div class="d-flex align-items-center justify-content-end">
        <button type="button" class="mr-2 btn btn-primary" data-toast="Reuse starts a new &quot;${esc(f.title)}&quot; pre-filled with these answers."><span class="d-none d-sm-inline mr-2">Reuse</span><i class="fad fa-sync"></i></button>
        <a href="#" class="mr-2 btn btn-info" data-toast="View opens the completed &quot;${esc(f.title)}&quot; as a PDF in a new tab."><span class="d-none d-sm-inline mr-2">View</span><i class="fad fa-eye"></i></a>
      </div></td>
      <td class="width-20 cursor-pointer text-center action-cell pr-4"><div class="d-flex align-items-center justify-content-end"><div class="checkbox-size form-check"><input type="checkbox" class="form-check-input position-static" aria-label="Select ${esc(f.title)}"></div></div></td>
    </tr>`).join('');
  };

  const completedSection = (a, disabled) => accordion('completed', 'Completed Forms', `
      <div class="row"><div class="col"><div class="margin-b15">
        <div class="my-3 align-items-center row">
          <div class="col-lg-auto col-12"><div class="align-items-center row">
            <div class="my-1 col-lg-auto col-md-6 col-12"><div class="floating-label mb-0 form-group"><input placeholder=" " type="text" class="height-33 floating-input form-control form-control-lg" value="" data-table-search="completed" aria-label="Search completed forms"><label class="fl-label">Search</label></div></div>
            ${dateFilters('completed', 'col-md-6')}
            <div class="text-center my-1 col-lg-auto col-12"><button disabled="" type="button" class="btn btn-success" data-table-go="completed"><span class="d-none d-sm-inline mr-2">Search</span><i class="fad fa-search"></i></button></div>
          </div></div>
          <div class="text-center my-1 col-lg-auto col-6"><div class="mt-2 form-group"><select class="height-33 form-control form-control-lg" aria-label="Form title"><option value="0">All</option></select></div></div>
          <div class="text-center my-1 col-lg-auto col-6"><div class="mt-2 form-group"><select class="height-33 form-control form-control-lg" aria-label="How many"><option value="0">--Select--</option><option value="10">Last 10</option><option value="50">Last 50</option><option value="100">Last 100</option></select></div></div>
          <div class="text-center my-1 col-lg-auto col-12"><button type="button" class="mr-2 btn btn-danger" data-table-reset="completed"><span class="d-none d-sm-inline mr-2">Reset All</span><i class="fad fa-trash-undo"></i></button></div>
        </div>
        <div class="row"><div class="margin-b20 px-0 mt-3 col-12">
          <table class="tableHead-holder table table-hover"><thead><tr>
            ${th('Title', 'width-10 pl-4')}${th('By', 'width-10 d-none d-lg-table-cell')}${th('Completed By', 'width-10 d-none d-lg-table-cell text-center')}${th('Completion Date', 'width-10 d-none d-xl-table-cell')}${th('Form ID', 'width-10 d-none d-xl-table-cell')}${th('Expiry Date', 'width-10 d-none d-xl-table-cell')}${th('Status', 'width-10 d-none d-xl-table-cell')}
            <th class="width-10 d-none d-xl-table-cell">Recipient Name<i class="fad fa-info-circle cursor-pointer text-muted ml-2" data-bs-tip="${esc(COPY.recipientInfo)}" role="img" aria-label="About recipient name"></i></th>
            <th class="width-30 d-none d-xl-table-cell text-center">Action</th><th class="width-20 text-center action-cell pr-4"></th>
          </tr></thead><tbody data-tbody="completed">${completedRows(a)}</tbody></table>
        </div></div>
      </div></div></div>`, { disabled });

  const notesList = (a, q = '') => {
    const notes = (a ? a.notes : []).filter(n => !q || (n.text + ' ' + n.by).toLowerCase().includes(q.toLowerCase()));
    return notes.length ? notes.map(n => `<div><strong>${esc(n.by)}</strong> <span class="text-muted">${n.date}</span><br>${esc(n.text)}</div>`).join('<hr>') : 'No notes found';
  };
  const notesSection = (a, disabled) => accordion('notes', 'Notes', `
      <div class="align-items-center row">
        <div class="col-lg-10 col-8"><div class="form-group"><textarea name="notes" placeholder="Notes" rows="3" id="form-notes" class="form-control form-control-lg" aria-label="New note"></textarea></div></div>
        <div class="text-right col-lg-2 col-4">
          <button type="button" class="m-1 btn btn-danger" id="notes-clear"><span class="d-none d-sm-inline mr-2">Clear</span><i class="fad fa-trash-undo"></i></button>
          <button disabled="" type="button" class="m-1 btn btn-success" id="notes-save-button"><span class="d-none d-sm-inline mr-2">Save</span><i class="fad fa-save"></i></button>
        </div>
      </div>
      <div class="row"><div class="col-6"><div class="location-search"><div class="input-group">
        <input type="text" class="form-control form-control-lg" placeholder="Search for notes" value="" id="notes-search" aria-label="Search for notes">
        <div class="input-group-append"><span class="location-search-btn input-group-text"><i class="fad fa-search"></i></span></div>
      </div></div></div></div>
      <div class="notes-container"><div class="commenthistoryblock mt-3"><div class="taskhistory well width-100" id="notes-list">${notesList(a)}</div></div></div>`, { disabled });

  // ---------- Page ----------
  let args, resizeBound = false, docBound = false;
  function render(opts) {
    args = opts;
    const { mode, cat } = opts;
    const isNew = mode === 'new';
    const a = isNew ? null : D.byId(opts.asset.id) || opts.asset;   // re-read so Reset/Save show stored values
    const catId = a ? a.cat : (D.categories.some(c => c.id === cat) ? cat : D.categories[0].id);
    const catName = (D.categories.find(c => c.id === catId) || D.categories[0]).name;
    const listHref = `asset-list.html?cat=${catId}${a && a.inactive ? '&show=deactivated' : ''}`;

    // Working copy of the editable fields; Reset/Save appear only while it differs from `original`
    const original = {};
    EDITABLE.forEach(k => { original[k] = a ? (a[k] ?? '') : ''; });
    if (!original.unit) original.unit = 'km';
    const draft = { ...original };

    let headerStyle = '';
    if (isNew) headerStyle = 'color: rgb(0, 0, 0); background-color: rgb(142, 142, 142);';
    else if (a.colour) headerStyle = `color: ${D.textOn(a.colour) === 'black' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'}; background-color: ${a.colour};`;

    const actions = isNew
      ? `<button id="equipmentdetailsheader-assign-asset-button-2" disabled="" type="button" class="m-1 btn btn-primary"><span class="d-none d-sm-inline mr-2">Assign Asset</span><i class="fad fa-link"></i></button>`
      : `<button id="equipmentdetailsheader-move-asset-button" type="button" class="m-1 btn btn-info"><span class="d-none d-sm-inline mr-2">Move</span><i class="fad fa-arrows-alt-h"></i></button>
         <button id="equipmentdetailsheader-delete-button" type="button" class="m-1 btn btn-danger"><span class="d-none d-sm-inline mr-2">Deactivate</span><i class="fad fa-trash"></i></button>`;

    const html = `
  <div id="headerRow" class="justify-content-between py-3 align-items-center text-center text-sm-left m-0 mb-0 pb-0 shadow-none row" style="${headerStyle}">
    <div class="col-sm-auto col-12"><h1 class="text-break">${isNew ? ' ' : esc(a.name) + ' '}<small class="d-block d-sm-inline ${isNew ? 'pl-0' : ''}">${esc(D.portal.name)}</small></h1></div>
    <div class="col-sm-auto col-12"><a id="header-back-button" href="${listHref}" class="float-sm-right btn btn-light"><span class="d-none d-sm-inline">Back <i class="fad fa-backward"></i></span><span class="d-inline d-sm-none d-md-none"><i class="fad fa-backward"></i></span></a></div>
  </div>
  <div class="container-fluid"><div class="fade equipmentContainer equipmentContainer show">
    <div class="margin-b15 mt-10">
      <div id="equipmentdetails-asset-attached-to-button" class="align-items-center row">
        <div class="d-flex flex-wrap textBreak align-items-center text-center col-sm-7 col-12">
          <a href="asset-list.html">Assets&nbsp;</a><div><span>&gt;&nbsp;</span><a href="${listHref}">${esc(catName)}&nbsp;</a></div><span>&gt; ${a ? esc(a.name) : ''}</span>
        </div>
        <div class="d-flex flex-wrap textBreak align-items-center justify-content-center justify-content-lg-end col-sm-5 col-12"></div>
      </div>
      <div class="row"><div class="col-xl-7 col-12"></div><div class="text-center text-lg-right col-xl-5 col-12">${actions}</div></div>
      <hr class="margin-lr-n15">
      <div class="mt-4 row">
        <div class="col-xl-7 col-12"><div class="row">
          <div class="col-md-6 col-12">
            <div class="img-fluid" id="asset-image" style="background-image: url('${draft.photo || 'assets/img/no-image.png'}'); height: 300px; border-radius: 10px; border: 0.5px solid rgb(223, 223, 223); background-size: contain; background-repeat: no-repeat; width: 100%; background-position: center center;">
              <div class="image-button-container row">
                ${statusSelect()}
                <div class="image-button col-12"><button type="button" class="btn btn-light" id="select-image-button"><span class="d-none d-sm-inline mr-2">Select Image</span><i class="fas fa-file-image"></i></button>
                  <div class="form-file" style="display: none;"><input accept=".jpeg, .jpg, .png, .webp" id="documentUpload" type="file" class="form-control-file"></div></div>
              </div>
            </div>
            <div class="align-items-center py-2 mt-2 form-group"><label class="font-weight-bold form-label" for="fields-name">Name</label><input autocomplete="off" id="fields-name" data-field="name" class="undefined form-control" value="${esc(draft.name)}"></div>
            <div class="align-items-center py-2 form-group"><label class="font-weight-bold form-label" id="colour-label">Colour</label>
              <div class="colour-picker height-33 " id="colour-picker" role="button" tabindex="0" aria-labelledby="colour-label"><div id="colour-hex">${esc(draft.colour)}</div><div><div class="current-colour" id="colour-swatch"></div></div></div>
            </div>
          </div>
          <div class="col-md-6 col-12" style="margin-top: -0.3rem;">
            ${typeSelect()}
            ${mileage(draft)}
            ${input('Main Contact', 'mainContact', draft.mainContact)}
            ${input('Address', 'address', draft.address)}
            ${input('Work Phone', 'workPhone', draft.workPhone)}
          </div>
        </div></div>
        <div class="col-xl-5 col-12"><div id="gaugechart-expired-header" class="guage-card card">
          <div class="guage-background">
            <div class="row">
              <div class="col"><div class="guage-count"><span class="font-weight-bold">Forms Pending</span><span class="pending-form-count">${a ? a.pending.length : 0}</span></div></div>
              <div class="col"><div class="guage-count"><span class="font-weight-bold">Tasks Pending</span><span class="task-count cursor-pointer" role="button" tabindex="0" id="tasks-count">${a ? (a.tasks || 0) : 0}</span></div></div>
            </div>
            <div id="equipment-gauge-chart" style="width: 100%;"></div>
          </div>
          <div class="p-4"><h2 class="mb-2">Pending</h2>${pendingCard(a)}</div>
        </div></div>
      </div>
    </div>

    <div class="row"><div class="col-lg-6 col-12">
      ${accordion('description', 'Description', `<div class="row"><div class="col"><div class="form-group"><textarea name="description" placeholder="Please enter a description" rows="5" id="form-description" data-field="description" class="form-control form-control-lg" aria-label="Description">${esc(draft.description)}</textarea></div></div></div>`,
        { open: true, wrapCls: 'margin-b15 margin-left-n15 pl-4 mt-5 accordion', hrCls: 'margin-left-n15 mt-1' })}
    </div></div>
    ${pendingSection(a, isNew)}
    ${completedSection(a, isNew)}
    ${notesSection(a, isNew)}

    <div class="row"><div class="col-sm-12 col-12">
      <span class="sticky-submit p-4" id="sticky-submit" style="display: none;">
        <span class="p-4"><button id="details-reset-button" type="button" class="btn btn-danger"><span class="d-none pr-2 d-sm-inline-block">Reset</span><i class="fad fa-undo-alt"></i></button></span>
        <span class="p-4"><button id="details-save-button" type="button" class="btn btn-success"><span class="d-none pr-2 d-sm-inline-block">Save</span><i class="fad fa-save"></i></button></span>
      </span>
    </div></div>
  </div></div>`;

    window.BIS_SHELL.mount(html);
    const $ = s => document.querySelector(s);

    // ----- dirty tracking: Reset / Save only show once something has changed -----
    const sticky = $('#sticky-submit');
    const refreshDirty = () => { sticky.style.display = EDITABLE.some(k => (draft[k] ?? '') !== (original[k] ?? '')) ? '' : 'none'; };
    const set = (k, v) => { draft[k] = v; refreshDirty(); };

    // ----- Status (react-select + colour dot) -----
    const dot = $('#status-dot');
    const paintDot = () => { const c = D.statuses[draft.status]; dot.style.backgroundColor = c || 'transparent'; dot.style.display = c ? '' : 'none'; };
    UI.select($('#equipmentdetails-select-type-text'), {
      placeholder: 'Select...', ariaLabel: 'Status', menuClass: 'menu-compact',
      getOptions: () => [{ value: '', label: '--Select Status--' }, ...Object.keys(D.statuses).map(s => ({ value: s, label: s }))],
      getValue: () => draft.status, setValue: v => set('status', v), onChange: paintDot,
      valueClass: 'css-nisxib-singleValue', placeholderClass: 'css-14el2xx-placeholder',
    });
    paintDot();

    // ----- Type (react-select) -----
    UI.select($('#type-select'), {
      placeholder: '--Select--', ariaLabel: 'Type', menuClass: 'menu-compact',
      getOptions: () => [{ value: '', label: '--Select--' }, ...D.types[catId].map(t => ({ value: t, label: t }))],
      getValue: () => draft.type, setValue: v => set('type', v),
      valueClass: 'css-h6kogi-singleValue', placeholderClass: 'css-14el2xx-placeholder proto-type-placeholder',
    });

    // ----- Colour (react-color SketchPicker) -----
    const paintColour = () => { $('#colour-hex').textContent = draft.colour || ''; $('#colour-swatch').style.backgroundColor = draft.colour || ''; };
    const openPicker = () => UI.colourPicker($('#colour-picker'), draft.colour, hex => { set('colour', hex); paintColour(); });
    $('#colour-picker').addEventListener('click', openPicker);
    $('#colour-picker').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(); } });
    paintColour();

    // ----- Select Image (real file picker; image is shrunk so it fits in browser storage) -----
    const file = $('#documentUpload');
    $('#select-image-button').addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const f = file.files[0]; if (!f) return;
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 800 / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = img.width * scale; c.height = img.height * scale;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        set('photo', c.toDataURL('image/jpeg', 0.82));
        $('#asset-image').style.backgroundImage = `url('${draft.photo}')`;
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(f);
    });

    // ----- Text fields -----
    document.querySelectorAll('[data-field]').forEach(el => {
      const ev = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(ev, () => set(el.dataset.field, el.value));
    });

    // ----- Reset / Save -----
    $('#details-reset-button').addEventListener('click', () => render(args));
    $('#details-save-button').addEventListener('click', () => {
      if (isNew) {
        if (!draft.name.trim()) { UI.toast('Enter a name before saving.', 'warning'); $('#fields-name').focus(); return; }
        const id = D.create({ ...draft, cat: catId, inactive: false });
        UI.flash(`${draft.name} was created in ${catName}.`);
        location.href = `asset-view.html?id=${id}`;
        return;
      }
      D.update(a.id, { ...draft });
      render(args);
      UI.toast('Asset saved.', 'success');
    });

    // ----- Gauge sizes to its card, like the live d3 chart -----
    const g = $('#equipment-gauge-chart');
    const drawGauge = () => { const el = document.getElementById('equipment-gauge-chart'); if (el) el.innerHTML = gaugeSvg(el.clientWidth, gaugeFraction(a ? a.pending.length : 0)); };
    drawGauge();
    if (!resizeBound) { addEventListener('resize', drawGauge); resizeBound = true; }

    // ----- Accordions -----
    document.querySelectorAll('[data-acc-toggle]').forEach(h => {
      if (!h.dataset.accToggle) return;
      const toggle = () => {
        const wrap = h.closest('[data-acc]'), body = wrap.querySelector(':scope > .collapse'), icon = h.querySelector('i');
        const open = body.classList.toggle('show');
        h.setAttribute('aria-expanded', String(open));
        icon.classList.toggle('fa-angle-up', open); icon.classList.toggle('fa-angle-down', !open);
      };
      h.addEventListener('click', toggle);
      h.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });

    // ----- Toasts for actions that open other pages / dialogs in the live app (bound once) -----
    if (!docBound) {
      docBound = true;
      document.addEventListener('click', e => {
        const t = e.target.closest('[data-toast]');
        if (t && !t.disabled) { e.preventDefault(); UI.toast(t.getAttribute('data-toast')); }
        // Pending forms: "More" reveals Resend / Reassign (live behaviour)
        const m = e.target.closest('[data-more]');
        if (m) { m.closest('td').querySelector('.show-elements-hover').className = 'show-elements'; m.parentElement.innerHTML = ''; }
      });
    }
    $('#tasks-count').addEventListener('click', () => UI.toast("Opens this asset's pending tasks."));


    // ----- Table search / reset (pending + completed) -----
    const rowsFor = { pending: pendingRows, completed: completedRows };
    document.querySelectorAll('[data-table-search]').forEach(inp => {
      const key = inp.dataset.tableSearch, go = document.querySelector(`[data-table-go="${key}"]`);
      const run = () => { document.querySelector(`[data-tbody="${key}"]`).innerHTML = rowsFor[key](a, inp.value); };
      inp.addEventListener('input', () => { go.disabled = !inp.value.trim(); });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
      go.addEventListener('click', run);
      document.querySelector(`[data-table-reset="${key}"]`).addEventListener('click', () => { inp.value = ''; go.disabled = true; run(); });
    });

    // ----- Notes -----
    const note = $('#form-notes'), noteSave = $('#notes-save-button'), noteSearch = $('#notes-search');
    note.addEventListener('input', () => { noteSave.disabled = !note.value.trim(); });
    $('#notes-clear').addEventListener('click', () => { note.value = ''; noteSave.disabled = true; });
    noteSave.addEventListener('click', () => {
      if (!a) return;
      D.update(a.id, { notes: [{ by: 'You', date: today(), text: note.value.trim() }, ...a.notes] });
      note.value = ''; noteSave.disabled = true;
      $('#notes-list').innerHTML = notesList(D.byId(a.id), noteSearch.value);
      UI.toast('Note saved.', 'success');
    });
    noteSearch.addEventListener('input', () => { $('#notes-list').innerHTML = notesList(a, noteSearch.value); });

    // ----- Move (live: react-bootstrap modal with a category picker) -----
    if (!isNew) {
      $('#equipmentdetailsheader-move-asset-button').addEventListener('click', () => {
        let target = '';
        UI.modal({
          title: 'Move Asset',
          okHtml: 'Ok&nbsp;<i class="fad fad fa-arrows-alt-h"></i>',
          body: `<span></span><div class="row"><div class="col-12"><span>${esc(COPY.moveIntro)}</span></div></div>
            <div class="mt-2 row"><div class="col-12"><div class="css-t7ynxi-container" id="move-select"><div class="css-1dpobrn-control" data-control><div class="css-jai0xx"><div data-value-slot></div></div>
              <div class="css-1wy0on6"><span class="css-akwnqi-indicatorSeparator"></span><div class="css-d7eoi-indicatorContainer" aria-hidden="true">${CHEVRON}</div></div></div></div></div></div>`,
          onMount: (m, enableOk) => UI.select(m.querySelector('#move-select'), {
            placeholder: '--Select--', ariaLabel: 'Move to category', menuClass: 'menu-compact',
            getOptions: () => D.categories.filter(c => c.id !== a.cat).map(c => ({ value: c.id, label: c.name })),
            getValue: () => target, setValue: v => { target = v; enableOk(!!v); },
            valueClass: 'css-h6kogi-singleValue', placeholderClass: 'css-14el2xx-placeholder proto-type-placeholder',
          }),
          onOk: () => {
            const to = D.categories.find(c => c.id === target);
            D.update(a.id, { cat: target, type: D.types[target].includes(a.type) ? a.type : '' });
            render(args);
            UI.toast(`${a.name} was moved to ${to.name}.`, 'success');
          },
        });
      });

      // ----- Deactivate (live: SweetAlert2 warning) -----
      $('#equipmentdetailsheader-delete-button').addEventListener('click', async () => {
        if (a.inactive) { UI.toast('This asset is already deactivated.', 'info'); return; }
        if (!(await UI.confirm({ text: COPY.deactivate }))) return;
        D.update(a.id, { inactive: true });
        UI.flash(`${a.name} was deactivated. It's now in the Deactivated tab.`);
        location.href = `asset-list.html?cat=${a.cat}&show=deactivated`;
      });
    }

    UI.popovers();
    UI.showFlash();
  }

  return { render };
})();
