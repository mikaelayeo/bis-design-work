/*
  Sample data for the Assets mockups.
  All names, IDs, phone numbers and addresses are fictional.
  Statuses, types and colours are admin-configurable in the real product,
  so the values here are examples, not part of the design system.
*/
window.BIS_DATA = (function () {
  const portal = { name: 'BIS QAQC Test Environment' };

  const categories = [
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'heavy', name: 'Heavy Equipment' },
    { id: 'safety', name: 'Safety Equipment' },
  ];

  // Status dot colours are set per portal by an admin. These mirror the live QAQC portal.
  const statuses = {
    'Active': 'rgb(18, 255, 0)',
    'Out of Service': 'rgb(255, 0, 0)',
    'Needs Inspection': 'rgb(255, 193, 7)',
    'In Repair': 'rgb(255, 140, 0)',
  };

  const types = {
    vehicles: ['Truck', 'SUV', 'Van', 'Car'],
    heavy: ['Excavator', 'Backhoe', 'Boom Lift', 'Forklift', 'Skid Steer'],
    safety: ['Gas Detector', 'AED', 'Fire Extinguisher', 'Fall Protection', 'Eyewash Station'],
  };

  const DEFAULT_HEADER = 'rgb(84, 119, 180)'; // card header when no colour is set

  const p = (title, formId, stage, sentTo, by, dateSent) => ({ title, formId, stage, sentTo, by, dateSent });
  const c = (title, by, completedBy, date, formId, expiry = '-', status = 'Completed') => ({ title, by, completedBy, date, formId, expiry, status });

  const assets = [
    // ---------- Vehicles ----------
    { id: 'v14', cat: 'vehicles', name: 'Ford F-150 #14', type: 'Truck', status: 'Active', colour: '#1f6fb2',
      mileage: '48210', unit: 'km', mainContact: 'Marcus Lee', address: 'Yard 2, 4120 Industrial Ave NW, Edmonton, AB', workPhone: '(780) 555-0142',
      description: 'Crew truck for the Westgate site. Tow package, ladder rack, first aid kit under rear seat.',
      pending: [p('Pre-Trip Vehicle Inspection', '1081204417', 'Stage 1 - Driver', 'Marcus Lee', 'Dana Whitfield', '2026/10/09')],
      completed: [c('Pre-Trip Vehicle Inspection', 'Dana Whitfield', 'Marcus Lee', '2026/10/02', '1080977312'), c('Monthly Vehicle Inspection', 'Dana Whitfield', 'Marcus Lee', '2026/09/30', '1080861145', '2026/10/30')],
      notes: [{ by: 'Dana Whitfield', date: '2026/09/30', text: 'Front tires at 4/32. Booked for replacement Oct 16.' }] },
    { id: 'v22', cat: 'vehicles', name: 'Ram 1500 #22', type: 'Truck', status: 'Out of Service', colour: '#fd17ff', tasks: 4,
      mileage: '3000', unit: 'km', mainContact: 'Priya Singh', address: '1234 Hemingway Street, Calgary, AB', workPhone: '(403) 555-0187',
      description: 'Out of service after a cracked windshield on Hwy 2. Waiting on glass replacement.',
      pending: [
        p('Car Mileage Form', '1077669756', 'Stage 1 - Anonymous', 'Anonymous', 'Anonymous', '2026/07/29'),
        p('Vehicle Mileage After 1000 km', '1077153772', 'Car User - Priya Singh', '-', 'Priya Singh', '2026/04/29'),
        p('Vehicle Mileage Inspection Form', '1077153738', 'Supervisor Review - Jordan Patel', 'Jordan Patel', 'Priya Singh', '2026/04/29'),
        p('Vehicle Mileage Inspection Form', '1076881072', 'Stage 1 - Driver', 'Priya Singh', 'Jordan Patel', '2026/04/12'),
      ],
      completed: [c('Vehicle Mileage Form', 'Priya Singh', 'Priya Singh', '2026/04/29', '1077153779'), c('Vehicle Mileage Form', 'Priya Singh', 'Priya Singh', '2026/04/29', '1077153769'), c('Incident Report - Vehicle', 'Jordan Patel', 'Priya Singh', '2026/10/06', '1081022203')],
      notes: [] },
    { id: 'v09', cat: 'vehicles', name: 'Toyota Tacoma #09', type: 'Truck', status: 'Needs Inspection', colour: '#a9e92f', tasks: 1,
      mileage: '102877', unit: 'km', mainContact: 'Sam Okafor', address: 'Yard 1, 88 Riverbend Rd, Red Deer, AB', workPhone: '(403) 555-0119',
      description: '', pending: [p('Monthly Vehicle Inspection', '1081190020', 'Stage 1 - Driver', 'Sam Okafor', 'Dana Whitfield', '2026/10/01'), p('Pre-Trip Vehicle Inspection', '1081203381', 'Stage 1 - Driver', 'Sam Okafor', 'Dana Whitfield', '2026/10/09')],
      completed: [c('Monthly Vehicle Inspection', 'Dana Whitfield', 'Sam Okafor', '2026/09/02', '1080402981', '2026/10/02')], notes: [] },
    { id: 'v31', cat: 'vehicles', name: 'Ford Transit Van #31', type: 'Van', status: 'Active', colour: null,
      mileage: '61540', unit: 'km', mainContact: 'Luis Romero', address: 'Yard 2, 4120 Industrial Ave NW, Edmonton, AB', workPhone: '(780) 555-0163',
      description: 'Tool van. Carries the confined-space kit and tripod.', pending: [],
      completed: [c('Pre-Trip Vehicle Inspection', 'Dana Whitfield', 'Luis Romero', '2026/10/08', '1081150067')], notes: [] },
    { id: 'v05', cat: 'vehicles', name: 'Toyota RAV4 #05', type: 'SUV', status: 'Active', colour: '#7b1fa2',
      mileage: '23412', unit: 'mi', mainContact: 'Dana Whitfield', address: 'Head Office, 200 7 Ave SW, Calgary, AB', workPhone: '(403) 555-0100',
      description: 'Safety coordinator pool vehicle.', pending: [], completed: [], notes: [] },
    { id: 'v18', cat: 'vehicles', name: 'Chevrolet Silverado 2500HD #18', type: 'Truck', status: 'In Repair', colour: '#c62828',
      mileage: '134002', unit: 'km', mainContact: 'Jordan Patel', address: 'Fleet Services, 5510 76 Ave, Edmonton, AB', workPhone: '(780) 555-0171',
      description: 'Transmission service. ETA back on site Oct 20.', pending: [p('Return-to-Service Checklist', '1081211108', 'Mechanic Sign-off - Fleet Services', 'Jordan Patel', 'Dana Whitfield', '2026/10/10')],
      completed: [], notes: [] },
    { id: 'v03', cat: 'vehicles', name: 'Ford Escape #03', type: 'SUV', status: 'Out of Service', colour: null, inactive: true,
      mileage: '211554', unit: 'km', mainContact: '', address: '', workPhone: '', description: 'Sold at auction, Aug 2026.', pending: [], completed: [], notes: [] },

    // ---------- Heavy Equipment ----------
    { id: 'h01', cat: 'heavy', name: 'CAT 320 Excavator', type: 'Excavator', status: 'Active', colour: '#f9a825',
      mileage: '', unit: 'km', mainContact: 'Marcus Lee', address: 'Westgate Site, 17 Westgate Blvd, Edmonton, AB', workPhone: '(780) 555-0142',
      description: 'Operator must hold a valid excavator ticket. Daily walk-around required before start.',
      pending: [p('Daily Equipment Inspection', '1081209945', 'Stage 1 - Operator', 'Marcus Lee', 'Dana Whitfield', '2026/10/10')],
      completed: [c('Daily Equipment Inspection', 'Dana Whitfield', 'Marcus Lee', '2026/10/09', '1081188820'), c('Daily Equipment Inspection', 'Dana Whitfield', 'Marcus Lee', '2026/10/08', '1081150991')], notes: [] },
    { id: 'h02', cat: 'heavy', name: 'John Deere 310SL Backhoe', type: 'Backhoe', status: 'Needs Inspection', colour: '#2e7d32',
      mileage: '', unit: 'km', mainContact: 'Luis Romero', address: 'Yard 1, 88 Riverbend Rd, Red Deer, AB', workPhone: '(403) 555-0163',
      description: '', pending: [p('Annual Equipment Inspection', '1081002210', 'Third-party Inspector', 'Northline Inspections', 'Dana Whitfield', '2026/09/15')], completed: [], notes: [] },
    { id: 'h03', cat: 'heavy', name: 'Genie S-65 Boom Lift', type: 'Boom Lift', status: 'Active', colour: '#ef6c00',
      mileage: '', unit: 'km', mainContact: 'Sam Okafor', address: 'Westgate Site, 17 Westgate Blvd, Edmonton, AB', workPhone: '(403) 555-0119',
      description: 'Fall protection required in basket. Rental from SkyReach, return Nov 30.', pending: [], completed: [c('Aerial Lift Pre-Use Checklist', 'Dana Whitfield', 'Sam Okafor', '2026/10/09', '1081191134')], notes: [] },
    { id: 'h04', cat: 'heavy', name: 'Toyota 8FGU25 Forklift', type: 'Forklift', status: 'Out of Service', colour: '#d32f2f', tasks: 2,
      mileage: '', unit: 'km', mainContact: 'Jordan Patel', address: 'Warehouse B, 5510 76 Ave, Edmonton, AB', workPhone: '(780) 555-0171',
      description: 'Hydraulic leak at mast. Tagged out.', pending: [p('Forklift Pre-Use Checklist', '1081205566', 'Stage 1 - Operator', 'Jordan Patel', 'Dana Whitfield', '2026/10/09'), p('Equipment Lockout Record', '1081205570', 'Supervisor Review - Dana Whitfield', 'Dana Whitfield', 'Jordan Patel', '2026/10/09')], completed: [], notes: [] },
    { id: 'h05', cat: 'heavy', name: 'Bobcat S650 Skid Steer', type: 'Skid Steer', status: 'Active', colour: null,
      mileage: '', unit: 'km', mainContact: 'Marcus Lee', address: 'Westgate Site, 17 Westgate Blvd, Edmonton, AB', workPhone: '(780) 555-0142',
      description: '', pending: [], completed: [], notes: [] },
    { id: 'h06', cat: 'heavy', name: 'Kubota KX040 Mini Excavator', type: 'Excavator', status: 'Out of Service', colour: '#f9a825', inactive: true,
      mileage: '', unit: 'km', mainContact: '', address: '', workPhone: '', description: 'Lease ended, returned to dealer.', pending: [], completed: [], notes: [] },

    // ---------- Safety Equipment ----------
    { id: 's07', cat: 'safety', name: 'MSA Altair 4XR #G-07', type: 'Gas Detector', status: 'Active', colour: '#00838f',
      mileage: '', unit: 'km', mainContact: 'Priya Singh', address: 'Westgate Site, 17 Westgate Blvd, Edmonton, AB', workPhone: '(403) 555-0187',
      description: 'Four-gas monitor. Bump test before each use, full calibration every 180 days.',
      pending: [p('Gas Detector Bump Test', '1081210032', 'Stage 1 - User', 'Priya Singh', 'Dana Whitfield', '2026/10/10')],
      completed: [c('Gas Detector Calibration', 'Dana Whitfield', 'Priya Singh', '2026/07/14', '1078811902', '2027/01/10')], notes: [] },
    { id: 's11', cat: 'safety', name: 'AED - Site Office', type: 'AED', status: 'Needs Inspection', colour: '#c62828',
      mileage: '', unit: 'km', mainContact: 'Dana Whitfield', address: 'Westgate Site Trailer, 17 Westgate Blvd, Edmonton, AB', workPhone: '(403) 555-0100',
      description: 'Pads expire 2027/03. Battery indicator checked monthly.', pending: [p('AED Monthly Inspection', '1081190117', 'Stage 1 - First Aider', 'Dana Whitfield', 'Dana Whitfield', '2026/10/01')], completed: [], notes: [] },
    { id: 's03', cat: 'safety', name: 'Fire Extinguisher - Bay 3', type: 'Fire Extinguisher', status: 'Active', colour: '#e53935',
      mileage: '', unit: 'km', mainContact: 'Luis Romero', address: 'Warehouse B, 5510 76 Ave, Edmonton, AB', workPhone: '(780) 555-0163',
      description: '10 lb ABC.', pending: [], completed: [c('Fire Extinguisher Monthly Check', 'Dana Whitfield', 'Luis Romero', '2026/10/01', '1081190155', '2026/11/01')], notes: [] },
    { id: 's12', cat: 'safety', name: '3M DBI-SALA Harness H-12', type: 'Fall Protection', status: 'Out of Service', colour: '#6d4c41',
      mileage: '', unit: 'km', mainContact: 'Sam Okafor', address: 'Westgate Site, 17 Westgate Blvd, Edmonton, AB', workPhone: '(403) 555-0119',
      description: 'Frayed webbing on left leg strap. Do not use.', pending: [], completed: [c('Harness Inspection', 'Dana Whitfield', 'Sam Okafor', '2026/10/03', '1081022877')], notes: [] },
    { id: 's20', cat: 'safety', name: 'Eyewash Station - Shop', type: 'Eyewash Station', status: 'Active', colour: null,
      mileage: '', unit: 'km', mainContact: 'Luis Romero', address: 'Warehouse B, 5510 76 Ave, Edmonton, AB', workPhone: '(780) 555-0163',
      description: '', pending: [], completed: [], notes: [] },
    { id: 's02', cat: 'safety', name: 'BW Clip Gas Detector #G-02', type: 'Gas Detector', status: 'Out of Service', colour: '#00838f', inactive: true,
      mileage: '', unit: 'km', mainContact: '', address: '', workPhone: '', description: 'End of life, disposed.', pending: [], completed: [], notes: [] },
  ];

  // Extra identifying fields, used by "Search By" on the asset list.
  const extra = {
    v14: ['Ford', 'F-150 XLT', '1FTFW1E58PFA14214', ''],
    v22: ['Ram', '1500 Big Horn', '1C6SRFFT4NN220022', ''],
    v09: ['Toyota', 'Tacoma SR5', '3TMCZ5AN2LM090912', ''],
    v31: ['Ford', 'Transit 250', '1FTBR1Y86MKA31031', ''],
    v05: ['Toyota', 'RAV4 LE', '2T3F1RFV8MW050505', ''],
    v18: ['Chevrolet', 'Silverado 2500HD', '1GC4YNEY3MF180018', ''],
    v03: ['Ford', 'Escape SE', '1FMCU9GD3JUA03003', ''],
    h01: ['Caterpillar', '320 GC', 'CAT0320GKZEP01142', '4210'],
    h02: ['John Deere', '310SL', '1T0310SLCLF390218', '6875'],
    h03: ['Genie', 'S-65 XC', 'S60XCH-21877', '1320'],
    h04: ['Toyota', '8FGU25', '8FGU25-71204', '9402'],
    h05: ['Bobcat', 'S650', 'B3BU12345', '2288'],
    h06: ['Kubota', 'KX040-4', 'KX040-4-30781', '7710'],
    s07: ['MSA', 'Altair 4XR', '23048GX0707', ''],
    s11: ['Philips', 'HeartStart FRx', 'B21H-04411', ''],
    s03: ['Amerex', 'B500 10 lb ABC', 'AMX-500-30303', ''],
    s12: ['3M DBI-SALA', 'ExoFit NEX', '1113125-H12', ''],
    s20: ['Bradley', 'S19-224', 'BR-S19224-2020', ''],
    s02: ['BW Technologies', 'GasAlert Clip', 'BWC2-H0202', ''],
  };
  assets.forEach(a => { const [manufacturer, model, serial, hours] = extra[a.id] || []; Object.assign(a, { manufacturer, model, serial, hours }); });

  // Uploaded asset photos (most assets have none, like in the live product)
  const photos = {
    v14: 'assets/img/photos/ford-f150-14.webp',
    v09: 'assets/img/photos/toyota-tacoma-09.webp',
    v18: 'assets/img/photos/chevrolet-silverado-18.webp',
  };
  assets.forEach(a => { a.photo = photos[a.id] || null; });

  // "Search By" options, in the live app's order. Location / Current Site are left out
  // because locations are out of scope for this assessment.
  const searchFields = [
    { id: 'name', label: 'Name' },
    { id: 'type', label: 'Type' },
    { id: 'serial', label: 'Serial Number' },
    { id: 'manufacturer', label: 'Manufacturer' },
    { id: 'model', label: 'Model' },
    { id: 'hours', label: 'Hours' },
  ];

  const byId = id => assets.find(a => a.id === id);

  // Card/header text: black on light colours, white on dark (matches live behaviour).
  function textOn(colour) {
    const hex = (colour || '').replace('#', '');
    if (hex.length !== 6) return 'white';
    const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16));
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? 'black' : 'white';
  }

  // ---------- Prototype persistence ----------
  // Moves, deactivations, edits, notes and new assets are kept in localStorage so every open tab
  // (list, view, add) sees the same data. "Reset sample data" on the landing page clears it.
  const STORE = 'bis-asset-proto-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } };
  let state = load();
  state.edits = state.edits || {}; state.created = state.created || [];
  state.created.forEach(a => { if (!byId(a.id)) assets.push(Object.assign({ pending: [], completed: [], notes: [] }, a)); });
  Object.entries(state.edits).forEach(([id, patch]) => { const a = byId(id); if (a) Object.assign(a, patch); });
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { console.warn('Could not save prototype data', e); } };

  function update(id, patch) {
    const a = byId(id); if (!a) return;
    Object.assign(a, patch);
    state.edits[id] = Object.assign(state.edits[id] || {}, patch);
    save();
  }
  function create(fields) {
    const id = 'n' + Date.now().toString(36);
    const a = Object.assign({ id, pending: [], completed: [], notes: [], tasks: 0, manufacturer: '', model: '', serial: '', hours: '' }, fields);
    assets.push(a); state.created.push(a); save();
    return id;
  }
  function resetStore() { try { localStorage.removeItem(STORE); } catch (e) {} }
  // Re-run a callback when another tab changes the data
  function onExternalChange(fn) { addEventListener('storage', e => { if (e.key === STORE) fn(); }); }

  return { portal, categories, statuses, types, assets, searchFields, byId, textOn, DEFAULT_HEADER, update, create, resetStore, onExternalChange };
})();
