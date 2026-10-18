/* ==========================================================================
   main.js — behaviour shared by every page.
   Runs after include.js has inserted the navbar.
   Page-specific scripts (FAQ accordion, scroll reveal, quote form, blog
   cards) stay in their own files, e.g. js/pages/quote.js.
   ========================================================================== */

document.addEventListener('partials:loaded', () => {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const page    = document.body.dataset.page;
  const pill    = nav.querySelector('.nav__pill');
  const hl      = nav.querySelector('.nav__hl');
  const links   = [...pill.querySelectorAll(':scope > a')];
  const more    = nav.querySelector('.nav__more');
  const moreBtn = nav.querySelector('.nav__more-btn');
  const toggle  = nav.querySelector('.nav__toggle');

  /* ---------- Mark the current page ---------- */
  nav.querySelectorAll('[data-page]').forEach(a => {
    if (a.dataset.page === page) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });
  // "Get a Quote" button style when you're on the quote page
  if (page === 'quote') nav.querySelector('.nav__cta')?.classList.add('is-active');
  // Current page lives in the dropdown -> light up the circle button
  if (more.querySelector('.nav__drop .is-active')) moreBtn.classList.add('is-active');

  /* ---------- Sliding orange highlight ---------- */
  const current = links.find(a => a.classList.contains('is-active'));

  function moveTo(el) {
    if (!el) { hl.style.opacity = 0; return; }
    hl.style.opacity = 1;
    hl.style.width = el.offsetWidth + 'px';
    hl.style.transform = `translateX(${el.offsetLeft}px)`;
  }

  links.forEach(a => {
    a.addEventListener('mouseenter', () => moveTo(a));
    a.addEventListener('focus', () => moveTo(a));
  });
  pill.addEventListener('mouseleave', () => moveTo(current));
  pill.addEventListener('focusout', () => moveTo(current));

  // Place it without animation first, then allow transitions
  hl.style.transition = 'none';
  moveTo(current);
  requestAnimationFrame(() => { hl.style.transition = ''; });
  window.addEventListener('resize', () => moveTo(current));
  window.addEventListener('load', () => moveTo(current)); // after web fonts settle

  /* ---------- Circular dropdown ---------- */
  function setMore(open) {
    more.classList.toggle('open', open);
    moreBtn.setAttribute('aria-expanded', open);
  }
  moreBtn.addEventListener('click', e => { e.stopPropagation(); setMore(!more.classList.contains('open')); });
  document.addEventListener('click', e => { if (!more.contains(e.target)) setMore(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMore(false); setMenu(false); } });

  /* ---------- Mobile / tablet menu ---------- */
  function setMenu(open) {
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('.nav__panel a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.matchMedia('(min-width: 1101px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
});
