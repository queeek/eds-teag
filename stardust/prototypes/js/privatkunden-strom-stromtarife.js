// privatkunden-strom-stromtarife.js — only the behaviours motion-observe saw fire on live:
// FAQ accordion (li.entry gets "opened"/"read", arrow icon flips) and the filter pill chevron ("rotate180" on the .fa, list toggles).
(function () {
  document.querySelectorAll('.akkordeon-list > li.entry > p.topic').forEach(function (topic) {
    topic.addEventListener('click', function () {
      var li = topic.parentElement; var open = li.classList.toggle('opened'); li.classList.add('read');
      var icon = topic.querySelector('.icon'); if (icon) { icon.classList.toggle('icon-teag-arrow-down-pos', !open); icon.classList.toggle('icon-teag-arrow-up-pos', open); }
      if (li.parentElement.classList.contains('auto-close-opened-entries')) {
        li.parentElement.querySelectorAll(':scope > li.entry.opened').forEach(function (o) { if (o !== li) { o.classList.remove('opened'); var i = o.querySelector('.topic .icon'); if (i) { i.classList.add('icon-teag-arrow-down-pos'); i.classList.remove('icon-teag-arrow-up-pos'); } } });
      }
    });
  });
  document.querySelectorAll('.filter.drop-down-list .category-label > a').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); var f = a.closest('.filter'); var open = f.classList.toggle('opened'); var fa = a.querySelector('.fa'); if (fa) { fa.classList.toggle('rotate180', open); fa.classList.toggle('fa-chevron-up', open); } });
  });
})();
