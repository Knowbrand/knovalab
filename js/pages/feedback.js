/* Knovalab — Client Feedback form
   Submissions are emailed to knovalab.inquiry@gmail.com via FormSubmit.co.
   FIRST-TIME SETUP: submit the live form once; FormSubmit emails a one-time
   activation link to that inbox. Click it, and every later feedback is delivered. */
(function () {
  'use strict';

  var ENDPOINT = 'https://formsubmit.co/ajax/knovalab.inquiry@gmail.com';

  var SERVICES = ['Website / Web design', 'CMS', 'Menu System', 'Social Media', 'Other'];
  var PROCEDURE = ['Great', 'Better', 'Can Improve', 'Bad'];
  var RECOMMEND = ['Yes', 'No'];
  var CREDIT = ['My name and company name', 'My name only', 'My company name only', 'Keep me anonymous'];
  var STAR_TEXT = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

  var $ = function (id) { return document.getElementById(id); };
  var form = $('feedback-form');
  if (!form) return;

  /* ---------- Render radio groups ---------- */
  function radios(containerId, name, items) {
    var box = $(containerId);
    box.innerHTML = items.map(function (v, i) {
      var id = name + '-' + i;
      return '<label class="fb-opt" for="' + id + '"><input type="radio" id="' + id +
        '" name="' + name + '" value="' + v + '"><span>' + v + '</span></label>';
    }).join('');
  }
  radios('svc', 'service', SERVICES);
  radios('proc', 'procedureExperience', PROCEDURE);
  radios('rec', 'wouldRecommend', RECOMMEND);
  radios('credit', 'creditPreference', CREDIT);

  /* ---------- Stars ---------- */
  var starBox = $('stars');
  var STAR_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.6l-5.8 3.1 1.1-6.5L2.6 9.6l6.5-.9z"/></svg>';
  var rating = 0;
  starBox.innerHTML = [1, 2, 3, 4, 5].map(function (n) {
    return '<button type="button" class="fb-star" role="radio" aria-checked="false" data-v="' + n +
      '" aria-label="' + n + ' star' + (n > 1 ? 's' : '') + '">' + STAR_SVG + '</button>';
  }).join('');
  var starBtns = starBox.querySelectorAll('.fb-star');

  function paint(n) {
    starBtns.forEach(function (b) {
      var v = +b.dataset.v;
      b.classList.toggle('on', v <= n);
      b.setAttribute('aria-checked', v === rating ? 'true' : 'false');
    });
  }
  function setRating(n) {
    rating = n;
    $('rating').value = n || '';
    $('starLabel').textContent = n ? n + ' / 5 — ' + STAR_TEXT[n] : 'Tap a star to rate';
    paint(n);
    clearErr('rating');
  }
  starBtns.forEach(function (b) {
    b.addEventListener('click', function () { setRating(+b.dataset.v); });
    b.addEventListener('mouseenter', function () { paint(+b.dataset.v); });
    b.addEventListener('focus', function () { paint(+b.dataset.v); });
  });
  starBox.addEventListener('mouseleave', function () { paint(rating); });
  starBox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setRating(Math.min(5, rating + 1)); starBtns[Math.max(rating - 1, 0)].focus(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setRating(Math.max(1, rating - 1)); starBtns[Math.max(rating - 1, 0)].focus(); }
  });

  /* ---------- Character counter ---------- */
  var ta = $('testimonial');
  ta.addEventListener('input', function () { $('tc').textContent = ta.value.length + ' / 1500'; clearErr('testimonial'); });

  /* ---------- Helpers ---------- */
  function setErr(key, msg) {
    var el = $('e-' + key); if (el) el.textContent = msg;
  }
  function clearErr(key) { var el = $('e-' + key); if (el) el.textContent = ''; }
  function val(name) { return (form.elements[name] && form.elements[name].value || '').trim(); }
  function checked(name) { var r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ''; }

  ['fullName', 'businessName', 'email'].forEach(function (id) {
    $(id).addEventListener('input', function () { clearErr(id); $(id).classList.remove('invalid'); });
  });
  form.addEventListener('change', function (e) {
    var map = { service: 'service', procedureExperience: 'procedure', wouldRecommend: 'recommend', creditPreference: 'credit', publishPermission: 'consent' };
    if (map[e.target.name]) clearErr(map[e.target.name]);
  });

  /* ---------- Validate ---------- */
  function validate() {
    var first = null, ok = true;
    function fail(key, msg, focusEl) {
      setErr(key, msg); ok = false;
      if (focusEl) focusEl.classList.add('invalid');
      if (!first) first = focusEl || $('e-' + key);
    }
    ['fullName', 'businessName', 'email', 'service', 'procedure', 'recommend', 'rating', 'testimonial', 'credit', 'consent'].forEach(clearErr);

    if (!val('fullName')) fail('fullName', 'Please enter your name.', $('fullName'));
    if (!val('businessName')) fail('businessName', 'Please enter your business name.', $('businessName'));
    var em = val('email');
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) fail('email', 'Please enter a valid email address.', $('email'));
    if (!checked('service')) fail('service', 'Please choose the service we provided.');
    if (!checked('procedureExperience')) fail('procedure', 'Please select your experience.');
    if (!checked('wouldRecommend')) fail('recommend', 'Please let us know.');
    if (!rating) fail('rating', 'Please give us a star rating.');
    if (val('testimonial').length < 20) fail('testimonial', 'Please write a few words (at least 20 characters).', ta);
    if (!checked('creditPreference')) fail('credit', 'Please choose how we may credit you.');
    if (!$('consent').checked) fail('consent', 'Please tick the permission box to submit.');

    if (first && first.scrollIntoView) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return ok;
  }

  /* ---------- Submit ---------- */
  var stat = $('stat'), go = $('go');
  function status(msg, isErr) { stat.textContent = msg; stat.className = 'fb-stat' + (isErr ? ' error' : ''); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.elements._honey.value) return; // bot
    if (!validate()) return;

    var id = 'FB-' + Date.now().toString(36).toUpperCase();
    $('sid').value = id;
    $('sdt').value = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    var payload = {
      _subject: 'New Client Feedback (' + rating + '/5) - ' + val('businessName'),
      _template: 'table',
      _captcha: 'false',
      'Reference': id,
      'Submitted': $('sdt').value,
      'Full name': val('fullName'),
      'Business name': val('businessName'),
      'Email': val('email') || '(not provided)',
      'Service provided': checked('service'),
      'Overall procedure experience': checked('procedureExperience'),
      'Would recommend Knovalab': checked('wouldRecommend'),
      'Star rating': rating + ' / 5',
      'Testimonial': val('testimonial'),
      'Credit preference': checked('creditPreference'),
      'Permission to publish': 'Agreed',
      'Source page': 'Knovalab Client Feedback'
    };
    if (val('email')) payload._replyto = val('email');

    go.disabled = true; status('Sending your feedback…');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok || res.d.success === 'false') throw new Error('send failed');
        $('ref').textContent = id;
        form.hidden = true;
        var done = $('done'); done.hidden = false; done.focus();
        done.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(function () {
        status('Something went wrong. Please try again, or email us at knovalab.inquiry@gmail.com.', true);
        go.disabled = false;
      });
  });

  /* ---------- Clear ---------- */
  $('clr').addEventListener('click', function () {
    form.reset(); setRating(0); $('tc').textContent = '0 / 1500'; status('');
    form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
    form.querySelectorAll('.err').forEach(function (el) { el.textContent = ''; });
  });
})();
