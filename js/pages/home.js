/* home.js — scroll-reveal animation for the home page.
   (The FAQ is now a native <details> list and needs no script; the mobile menu
   is handled by /js/main.js.) */

(function () {
  // [CSS selector, slide direction]. Leave direction '' for a plain slide-up.
  const groups = [
    ['.hero-copy',                        'from-left'],
    ['.hero-visual',                      'from-right'],
    ['#solutions .solution',              ''],
    ['.why-grid > div:first-child',       'from-left'],
    ['.why-grid > .benefit-list',         'from-right'],
    ['#signage .workflow',                ''],
    ['#menus .menu-grid > div:first-child', 'from-left'],
    ['#menus .menu-scene',                'from-right'],
    ['#portfolio .project',               ''],
    ['.principles > div:first-child',     'from-left'],
    ['.principles > div:last-child',      'from-right'],
    ['#faq .faq',                         '']
  ];

  const items = [];

  groups.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('scroll-reveal');
      if (direction) el.classList.add(direction);
      if (i % 4) el.classList.add(`delay-${i % 4}`);   // small stagger between neighbours
      items.push(el);
    });
  });

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduced) {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting)),
      { threshold: .12, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach(el => observer.observe(el));
  } else {
    items.forEach(el => el.classList.add('in-view'));
  }
})();
