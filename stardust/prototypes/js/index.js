// Scroll-state chrome (recreation-procedure § Fixed and sticky chrome): the source swaps in a fixed
// `.combined-header.fixed` nav bar once the 170px page header has scrolled out. Same class, same
// threshold; no other behaviour.
(function () {
  var combined = document.querySelector('#PageHeader .combined-header');
  var separated = document.querySelector('#PageHeader .seperated-header');
  var mobile = window.matchMedia('(max-width: 1024px)');
  var threshold = document.getElementById('PageHeader').offsetHeight;
  var up = document.querySelector('.scroll-up');
  function update() { var on = window.scrollY > threshold; document.body.classList.toggle('nav-is-fixed', on); combined.classList.toggle('fixed', on && !mobile.matches); separated.classList.toggle('fixed', on && mobile.matches); if (up) up.classList.toggle('visible', window.scrollY > 900); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
// Mobile nav (≤1024): the source builds `ul.mobile-nav` client-side from the mega-menu link lists
// (6 level-1 items, their ul.level-2/3/4 lists, no teasers — observed live at 360: 226 links).
(function () {
  if (!window.matchMedia('(max-width: 1024px)').matches) return;
  var nav = document.querySelector('#PageHeader .seperated-header ul.mobile-nav');
  if (!nav || nav.children.length) return;
  document.querySelectorAll('#PageHeader .seperated-header ul.level-1 > li[class^="level-1-"]').forEach(function (li) {
    var mega = li.querySelector(':scope > .mega'); var list = mega && mega.querySelector(':scope > ul.level-2:not(.horizontal-bar)');
    if (!list) return;
    var item = document.createElement('li'); item.className = li.className + ' has-children closed';
    var a = li.querySelector(':scope > a').cloneNode(true); item.appendChild(a);
    var wrap = document.createElement('div'); var clone = list.cloneNode(true);
    clone.querySelectorAll('.nav-teasers, .box, figure').forEach(function (n) { n.remove(); });
    wrap.appendChild(clone); item.appendChild(wrap); nav.appendChild(item);
  });
})();
// Interaction parity (motion-observe stardust/replica/motion/index.json): tab switch (li.active /
// previous-is-active), post expand (.post-content.expanded + arrow glyph swap), contrast switch
// (body class toggle as on the source; the contrast restyle itself is not lifted).
(function () {
  document.querySelectorAll('.tab-control > ul').forEach(function (ul) {
    ul.addEventListener('click', function (e) {
      var a = e.target.closest('a.shadow'); if (!a) return; e.preventDefault();
      var items = Array.prototype.slice.call(ul.children);
      items.forEach(function (li) { li.classList.remove('active', 'previous-is-active'); });
      var li = a.parentElement; li.classList.add('active');
      var next = items[items.indexOf(li) + 1]; if (next) next.classList.add('previous-is-active');
    });
  });
  document.querySelectorAll('.aktuelles .posts li .commands a.icon').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); var pc = a.closest('.container').querySelector('.post-content'); if (!pc) return;
      var open = pc.classList.toggle('expanded');
      a.classList.toggle('icon-arrow-down-pos', !open); a.classList.toggle('icon-arrow-up-pos', open);
    });
  });
  var contrast = document.querySelector('#PageHeader .contrast-switch');
  if (contrast) contrast.addEventListener('click', function (e) {
    if (!e.target.closest('a.icon, label')) return; e.preventDefault();
    contrast.classList.toggle('active'); document.body.classList.toggle('user-prefers-more-contrast');
  });
})();
