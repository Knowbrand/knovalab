/* ==========================================================================
   insights.js — the Insights page: card data, rendering and category filter.
   (Navbar and mobile menu are handled by /js/main.js.)

   HOW TO EDIT THE CARDS
   Each card is one line in HERO_CARDS or ARTICLES. The only thing you need is
   `url` (the blog page name, e.g. 'my-new-post') and `category` (a key from
   CATEGORIES). The folder and extension are added for you.

   Optional: title, excerpt, image. Anything you leave out is fetched from the
   blog page's <head>:
     <meta property="og:title"       content="Your article title">
     <meta property="og:description" content="One or two sentences.">
     <meta property="og:image"       content="../images/your-image.jpg">

   Fetching only works when the site is served over http(s) and the blog pages
   are on the same domain. Opened as a file, you'll see the typed title and
   excerpt with gradient placeholders instead of images.
   ========================================================================== */

/* ---------- CONFIG (edit this part) ---------- */

const SITE_URL       = 'https://knovalab.in';
const BLOG_PATH      = '/blogs/';
const BLOG_EXTENSION = '';          // use '.html' if your host needs it

/* Filter buttons. key = value used in `category`, label = text shown. */
const CATEGORIES = {
  signage:    'Digital Signage',
  menus:      'Digital Menus',
  systems:    'Business Systems',
  technology: 'Technology',
  web:        'Web & Digital'
};

/* The six floating cards in the hero. */
const HERO_CARDS = [
  { url: 'why-businesses-move-beyond-usb', category: 'signage',
    title: 'Why Businesses Are Moving Beyond USB',
    excerpt: 'How local media distribution makes operations dependable.' },

  { url: 'local-signage', category: 'signage',
    title: 'How Local Digital Signage Actually Works',
    excerpt: 'A clear breakdown of a local network architecture.' },

  { url: 'digital-menus', category: 'menus',
    title: 'Digital Menus vs Traditional Menu Boards',
    excerpt: 'Comparing cost, flexibility, and performance.' },

  { url: 'before-installing', category: 'systems',
    title: 'What Businesses Should Know Before Installing',
    excerpt: 'Key decisions around hardware and content.' },

  { url: 'websites-more-than-brochures', category: 'web',
    title: 'Why Your Website Is More Than Just a Brochure',
    excerpt: 'How a well-built website functions as a business system.' },

  { url: 'cloud-vs-local', category: 'technology',
    title: 'Cloud vs Local: Choosing the Right Architecture',
    excerpt: 'Understanding structural trade-offs.' }
];

/* The cards in the "Latest from Knovalab" grid. To add one, copy a line. */
const ARTICLES = [
  { url: 'scheduling-content', category: 'signage',
    title: 'Scheduling Content Without the Cloud',
    excerpt: 'Deep dive into Knovalab’s offline-first scheduling protocol. Learn how systems keep playing perfectly synchronized content.' },

  { url: 'rebuild-vs-patch', category: 'web',
    title: 'When to Rebuild vs Patch Your Website',
    excerpt: 'A practical guide to evaluating legacy code bases and maintenance parameters.' },

  { url: 'qr-signage', category: 'technology',
    title: 'How QR Codes Actually Work in Signage',
    excerpt: 'Maximizing scan conversions by optimizing display contrast, pixel density, and scan distance.' },

  { url: 'free-signage-cost', category: 'systems',
    title: 'The Real Cost of Free Signage Software',
    excerpt: 'Why ad-supported platforms cost double in security vulnerabilities and offline downtime failures.' },

  { url: 'menu-engineering', category: 'menus',
    title: 'Menu Engineering for Digital Boards',
    excerpt: 'Using typographical visual hierarchy to drive high-margin item selection automatically.' },

  { url: 'conversion-failure', category: 'web',
    title: 'Most Websites Fail at Conversions',
    excerpt: 'Why complex interactive scripts and page clutter slow digital media and hurt results.' },

  { url: 'network-architecture', category: 'systems',
    title: 'Network Architecture for Multi-Location Signage',
    excerpt: 'A production system blueprint for managing localized content across secure networks.' }
];


/* ---------- CODE (no need to edit below) ---------- */

/* Escape text so titles with & < > " are safe inside HTML. */
function esc(text) {
  return String(text ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

/* "scheduling-content" becomes "Scheduling Content" (shown while loading or if the page can't be fetched). */
function titleFromUrl(url) {
  const file = url.split('/').pop().replace(/\.html?$/i, '');
  return file.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* Read one meta tag by selector, '' if missing. */
function metaContent(doc, selector) {
  const el = doc.querySelector(selector);
  return el ? (el.getAttribute('content') || '').trim() : '';
}

/* Fetch a blog page and pull out title, description and image. Cached. Returns {} on failure. */
const pageCache = new Map();

function fetchPageInfo(url) {
  if (pageCache.has(url)) return pageCache.get(url);

  const job = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    try {
      const target   = url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) : url;
      const response = await fetch(target, { signal: controller.signal });
      if (!response.ok) return {};

      const html = await response.text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const base = new URL(url, location.href);   // so relative og:image paths resolve against the blog page

      const image = metaContent(doc, 'meta[property="og:image"]')
                 || metaContent(doc, 'meta[name="twitter:image"]');

      return {
        title:   metaContent(doc, 'meta[property="og:title"]') || (doc.title || '').trim(),
        excerpt: metaContent(doc, 'meta[property="og:description"]') || metaContent(doc, 'meta[name="description"]'),
        image:   image ? new URL(image, base).href : ''
      };
    } catch (error) {
      return {};   // offline, wrong path, blocked, or timed out
    } finally {
      clearTimeout(timer);
    }
  })();

  pageCache.set(url, job);
  return job;
}

/* Set a card's image via a CSS variable, so the gradient stays as the fallback if the image fails. */
function applyImage(element, src) {
  if (!src) return;
  const test = new Image();
  test.onload = () => element.style.setProperty('--thumb', `url("${src}")`);
  test.src = src;
}

/* Typed values win; fetched values fill in anything left blank. */
function pick(typed, fetched, fallback) {
  return typed || fetched || fallback || '';
}

/* "my-post", "blog/my-post.html" and "/blogs/my-post" all become the full blog address. */
function blogUrl(value) {
  const v = String(value || '').trim();
  if (/^(https?:)?\/\//i.test(v)) return v;
  const slug = v.replace(/^\/+/, '').replace(/^blogs?\//i, '').replace(/\.html?$/i, '');
  return SITE_URL + BLOG_PATH + slug + BLOG_EXTENSION;
}

HERO_CARDS.concat(ARTICLES).forEach(card => { card.url = blogUrl(card.url); });


/* ---------- Filter buttons ---------- */
document.getElementById('filters').innerHTML =
  '<button class="filter active" data-filter="all">All Articles</button>' +
  Object.entries(CATEGORIES).map(([key, label]) =>
    `<button class="filter" data-filter="${esc(key)}">${esc(label)}</button>`
  ).join('');


/* ---------- Hero cards ---------- */
const heroStack = document.getElementById('hero-stack');

HERO_CARDS.forEach((card, index) => {
  const el = document.createElement('article');
  el.className = `hero-card c${index + 1}`;
  el.innerHTML = `
    <small>${esc(CATEGORIES[card.category] || '')}</small>
    <h3>${esc(card.title || titleFromUrl(card.url))}</h3>
    <p>${esc(card.excerpt || '')}</p>
    <a href="${esc(card.url)}">Read article →</a>
  `;
  heroStack.appendChild(el);

  if (card.image) applyImage(el, card.image);

  fetchPageInfo(card.url).then(info => {
    el.querySelector('h3').textContent = pick(card.title,   info.title,   titleFromUrl(card.url));
    el.querySelector('p').textContent  = pick(card.excerpt, info.excerpt, '');
    applyImage(el, card.image || info.image);
  });
});

/* After the entrance animation, let hover take over. */
window.setTimeout(() => {
  document.querySelectorAll('.hero-card').forEach(c => c.classList.add('landed'));
}, 1600);


/* ---------- Article cards ---------- */
const postsBox = document.getElementById('posts');

ARTICLES.forEach(card => {
  const el = document.createElement('a');
  el.className = 'post';
  el.href = card.url;
  el.dataset.category = card.category;
  el.innerHTML = `
    <div class="art"></div>
    <small>${esc(CATEGORIES[card.category] || '')}</small>
    <h3>${esc(card.title || titleFromUrl(card.url))}</h3>
    <p>${esc(card.excerpt || '')}</p>
    <span class="more">Read article →</span>
  `;
  postsBox.appendChild(el);

  const art = el.querySelector('.art');
  if (card.image) applyImage(art, card.image);

  fetchPageInfo(card.url).then(info => {
    el.querySelector('h3').textContent = pick(card.title,   info.title,   titleFromUrl(card.url));
    el.querySelector('p').textContent  = pick(card.excerpt, info.excerpt, '');
    applyImage(art, card.image || info.image);
  });
});


/* ---------- Category filtering ---------- */
document.querySelectorAll('.filter').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.post').forEach(post => {
      const show = button.dataset.filter === 'all' || post.dataset.category === button.dataset.filter;
      post.classList.toggle('hidden', !show);
    });
  };
});


/* ---------- Newsletter (placeholder: shows a thank-you, nothing is sent yet) ---------- */
document.getElementById('subscribe-form').addEventListener('submit', e => {
  e.preventDefault();
  e.target.querySelector('input').value = 'Thanks — you are subscribed!';
});
