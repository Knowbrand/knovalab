/* ==========================================================================
   quote.js — the Contact / Quote form: builds the service chips and detail
   panels, validates, and posts to the Google Apps Script endpoint.
   Behaviour is unchanged from the original page; only the navbar code was
   removed (the shared /js/main.js handles that now).

   To add or rename a service: edit G (groups) and P (detail panels) below.
   Pre-select a service from a link with /quote/?service=signage|menus|hardware|web|social
   ========================================================================== */

(() => {
  'use strict';

  const CFG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbzIO-gQ--Fc0feb6gLnRRQct91q-CUdlYlQhW63AUCY48XshSsM1piT1ZliCjq4CEWPMA/exec',
    minMs: 3000                                  // forms submitted faster than this are treated as bots
  };

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const f  = $('#quote-form');
  const t0 = Date.now();
  let busy = false;

  /* ---------- Small field builders for the detail panels ---------- */
  const sel = (n, l, o, w) => `<div class="fld${w ? ' w' : ''}"><label class="l">${l}</label><select name="${n}"><option value="">Select</option>${o.map(x => `<option>${x}</option>`).join('')}</select></div>`;
  const inp = (n, l, p, ty) => `<div class="fld"><label class="l">${l}</label><input name="${n}" ${ty ? `type="${ty}"` : ''} maxlength="200" placeholder="${p || ''}"></div>`;
  const chk = (n, l, o) => `<div class="fld w"><label class="l">${l}</label><input type="hidden" name="${n}"><div class="grid">${o.map(x => `<label class="cc"><input type="checkbox" data-agg="${n}" value="${x}"><span class="ck">✓</span><span>${x}</span></label>`).join('')}</div></div>`;

  const TY = ['Samsung Tizen', 'Android / Android TV', 'LG webOS', 'Other / Not sure'];

  /* ---------- Detail panels: shown when a matching service is ticked ---------- */
  const P = {
    web:      ['Website details', sel('webPages', 'Approx. number of pages', ['1', '2–5', '6–10', '10+']) + sel('webContent', 'Is your content & images ready?', ['Yes', 'Partly', 'No'])],
    redesign: ['Website redesign', inp('redesignUrl', 'Current website URL', 'https://', 'url') + inp('redesignReason', 'Main reason for redesign', 'What needs to improve?')],
    ecom:     ['E-commerce', inp('ecomProducts', 'Approx. number of products', 'e.g. 50') + inp('ecomPayment', 'Preferred payment method', 'e.g. Razorpay, UPI')],
    maint:    ['Maintenance', inp('maintPlatform', 'Existing platform', 'WordPress, Shopify, custom…') + inp('maintSupport', 'Support required', 'Updates, fixes, content…')],
    signage:  ['Digital Signage — CMS & players', sel('sgScreens', 'How many screens will the CMS manage?', ['1', '2–5', '6–10', '11–25', '25+']) + sel('sgLocations', 'Number of locations', ['Single location', '2–5 locations', '6+ locations']) + chk('sgTypes', 'Screen / player type', TY) + sel('sgOwned', 'Do you already own the screens?', ['Yes, all', 'Some', 'No, need hardware'])],
    menu:     ['Digital Menu System', sel('mnScreens', 'How many menu screens?', ['1', '2–3', '4–6', '7+']) + sel('mnTables', 'How many tables?', ['No table service', '1–10', '11–25', '26–50', '50+']) + sel('mnService', 'Service type', ['Dine-in', 'Takeaway / counter', 'Both', 'Food court / multi-outlet']) + sel('mnItems', 'Approx. menu items', ['Under 30', '30–100', '100+']) + chk('mnTypes', 'Screen / player type', TY)],
    hw:       ['Display hardware & kiosks', chk('hwTypes', 'Hardware needed', ['Wall-mounted display', 'Elevator display', 'Floor-standing display', 'Touch kiosk', 'Shelf-order kiosk', 'LCD video wall']) + sel('hwQty', 'Quantity', ['1', '2–5', '6–10', '10+']) + sel('hwSize', 'Preferred screen size', ['Under 32"', '32"–43"', '46"–55"', '55"+'])],
    social:   ['Social media', chk('smPlatforms', 'Platforms', ['Instagram', 'Facebook', 'LinkedIn', 'YouTube', 'Threads', 'Other']) + sel('smPosts', 'Posts per month', ['8–12', '12–20', '20–30', '30+']) + inp('smHandles', 'Existing page / handle links', 'https://instagram.com/…')],
    sure:     ['No problem', `<p class="note" style="grid-column:1/-1">Tell us your goal in the description below and we'll recommend the right solution.</p>`]
  };

  /* ---------- Service groups: [label, panel key ('' = no extra panel)] ---------- */
  const G = [
    ['Websites', [['Business Website', 'web'], ['Landing Page', 'web'], ['Website Redesign', 'redesign'], ['E-Commerce Website', 'ecom'], ['School or Institute Website', 'web'], ['Booking Website', 'web'], ['Website Maintenance', 'maint'], ['SEO Setup', ''], ['Branding & Visual Design', '']]],
    ['Digital Systems', [['On-Prem Digital Signage (CMS + Players)', 'signage'], ['Digital Menu System', 'menu'], ['Display Hardware & Kiosk Sourcing', 'hw']]],
    ['Social Media', [['Social Media Management', 'social'], ['Content & Creatives (posts, reels)', 'social'], ['Paid Ads Management', 'social']]],
    ['Other', [['Custom Development', ''], ['Not Sure Yet', 'sure']]]
  ];

  const KEY = {};

  $('#svc').innerHTML = G.map(([g, l]) =>
    `<h3 class="grp">${g}</h3><div class="grid">${l.map(([n, k]) => { KEY[n] = k; return `<label class="cc"><input type="checkbox" name="services" value="${n}"><span class="ck">✓</span><span>${n}</span></label>`; }).join('')}</div>`
  ).join('');

  $('#panels').innerHTML = Object.entries(P).map(([k, [h, b]]) =>
    `<div class="panel" data-k="${k}"><h4>${h}</h4><div class="fg">${b}</div></div>`
  ).join('');

  const radios = (id, name, list) => $(id).innerHTML = list.map(v =>
    `<label class="cc rd"><input type="radio" name="${name}" value="${v}"><span class="ck" style="border-radius:50%">✓</span><span>${v}</span></label>`
  ).join('');

  radios('#budget', 'budgetRange', ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹3,00,000', '₹3,00,000+', 'Need guidance']);
  radios('#timeline', 'projectTimeline', ['As soon as possible', 'Within 2 weeks', 'Within 1 month', 'Within 2–3 months', 'Just exploring']);

  $('#industry').insertAdjacentHTML('beforeend',
    ['Restaurant or Café', 'Retail & Showroom', 'Hotel & Hospitality', 'Salon, Beauty & Wellness', 'Clinic & Healthcare', 'School & Education', 'Corporate Office', 'Real Estate', 'Fitness & Gym', 'Events & Venues', 'Startup', 'E-Commerce', 'Non-Profit', 'Personal Brand', 'Other']
      .map(x => `<option>${x}</option>`).join(''));

  /* ---------- State helpers ---------- */
  const sv = () => $$('input[name="services"]:checked', f).map(i => i.value);
  const digits = () => $('#phone').value.replace(/\D/g, '');
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Show/hide panels, aggregate checkbox groups, update counter + progress bar */
  function sync() {
    const s = sv();
    const keys = new Set(s.map(n => KEY[n]).filter(Boolean));

    $$('.panel').forEach(p => {
      const on = keys.has(p.dataset.k);
      p.classList.toggle('on', on);
      $$('input,select', p).forEach(i => i.disabled = !on);   // hidden panels aren't submitted
    });

    $$('input[type=hidden][name]', f).forEach(h => {
      const group = $$(`[data-agg="${h.name}"]`);
      if (group.length) h.value = group.filter(i => i.checked).map(i => i.value).join(', ');
    });

    $('#cnt').textContent = s.length + ' selected';
    $('#selSv').value = s.join(', ');
    $('#otherInd').hidden = $('#industry').value !== 'Other';

    const steps = [
      s.length,
      $('input[name="budgetRange"]:checked'),
      $('#industry').value,
      $('#fullName').value.trim(),
      EMAIL.test($('#email').value.trim()),
      digits().length >= 7,
      $('#desc').value.trim().length >= 20,
      $('#consent').checked
    ];
    const pc = Math.round(steps.filter(Boolean).length / steps.length * 100);
    $('#pt').textContent = pc + '% complete';
    $('#pb').style.width = pc + '%';
    $('#dc').textContent = $('#desc').value.length + ' / 2000';
  }

  const setE = (id, m) => { const e = $('#e-' + id); if (e) e.textContent = m || ''; };

  /* Returns the first invalid element (to scroll to), or null if everything is fine */
  function validate() {
    const bad = [];
    const check = (ok, id, m, el) => { setE(id, ok ? '' : m); if (!ok) bad.push(el); };

    check(sv().length > 0, 'svc', 'Select at least one service.', $('#svc'));
    check(!!$('input[name="budgetRange"]:checked'), 'budget', 'Choose a budget range.', $('#budget'));
    check(!!$('#industry').value, 'industry', 'Select your industry.', $('#industry'));
    check($('#fullName').value.trim().length > 1, 'fullName', 'Enter your full name.', $('#fullName'));
    check(EMAIL.test($('#email').value.trim()), 'email', 'Enter a valid email address.', $('#email'));
    check(digits().length >= 7 && digits().length <= 15, 'phone', 'Enter a valid phone number (7–15 digits).', $('#phone'));
    check($('#desc').value.trim().length >= 20, 'desc', 'Please write at least 20 characters.', $('#desc'));
    check($('#consent').checked, 'consent', 'Please agree so we can respond.', $('#consent'));

    return bad[0] || null;
  }

  /* Reference like KQ-20261018-AB3K */
  function ref() {
    const d = new Date();
    const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return `KQ-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-` +
      [...crypto.getRandomValues(new Uint8Array(4))].map(n => c[n % c.length]).join('');
  }

  f.addEventListener('input', sync);
  f.addEventListener('change', sync);

  /* ---------- Submit ---------- */
  f.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy) return;

    const bad = validate();
    const st = $('#stat');

    if (bad) {
      st.textContent = 'Please correct the highlighted fields.';
      bad.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Bot checks: filled honeypot, or submitted too quickly
    if (f.elements.company_website_confirm.value || Date.now() - t0 < CFG.minMs) {
      st.textContent = 'Please wait a moment and try again.';
      return;
    }

    $$('input[type=text],input[type=email],input[type=url],input[type=tel],textarea', f).forEach(i => i.value = i.value.trim());

    $('#sid').value = ref();
    $('#sdt').value = new Date().toISOString();
    $('#fullPhone').value = ($('#cc').value || '') + digits();

    const data = Object.fromEntries(new FormData(f));
    data.services = sv();
    data.selectedServices = sv().join(', ');

    busy = true;
    $('#go').disabled = true;
    $('#go').textContent = 'Submitting…';
    st.textContent = '';

    try {
      const r = await fetch(CFG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
        redirect: 'follow'
      });
      if (!r.ok) throw 0;

      let j = {};
      try { j = await r.json(); } catch (_) { j = { success: true }; }
      if (j.success === false) throw 0;

      f.hidden = true;
      $('#head').hidden = true;
      $('#ref').textContent = data.submissionId;
      $('#done').classList.add('on');
      $('#done').focus();
      $('#done').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (_) {
      st.textContent = 'We could not send your request. Please try again or email business@knovalab.in.';
    } finally {
      busy = false;
      $('#go').disabled = false;
      $('#go').textContent = 'Request My Custom Quote';
    }
  });

  /* ---------- Clear form ---------- */
  $('#clr').onclick = () => {
    if (confirm('Clear all entered details?')) {
      f.reset();
      $$('.err').forEach(e => e.textContent = '');
      sync();
    }
  };

  /* ---------- Pre-select a service from /quote/?service=... ---------- */
  const want = {
    signage:  'On-Prem Digital Signage (CMS + Players)',
    menus:    'Digital Menu System',
    hardware: 'Display Hardware & Kiosk Sourcing',
    web:      'Business Website',
    social:   'Social Media Management'
  }[new URLSearchParams(location.search).get('service')];

  if (want) {
    const c = $$('input[name="services"]').find(i => i.value === want);
    if (c) c.checked = true;
  }

  sync();
})();
