/* ==========================================================================
   include.js — drops shared partials into any element like:
     <div data-include="navbar"></div>   ->  /partials/navbar.html
     <div data-include="footer"></div>   ->  /partials/footer.html
   When everything is loaded it fires "partials:loaded" so main.js can wire
   up the navbar. Needs the site served over http(s), not opened as a file.
   ========================================================================== */

(async function () {
  const slots = [...document.querySelectorAll('[data-include]')];

  await Promise.all(slots.map(async slot => {
    const name = slot.dataset.include;
    try {
      const res = await fetch(`/partials/${name}.html`);
      if (!res.ok) throw new Error(res.status);
      slot.outerHTML = await res.text();
    } catch (err) {
      console.error(`Could not load partial "${name}"`, err);
    }
  }));

  document.dispatchEvent(new Event('partials:loaded'));
})();
