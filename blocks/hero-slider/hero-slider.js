/*
 * hero-slider — the landing page's `.slider-section` (one slide: picture rows, credits row,
 * title + description row, tabs row). Template-slotted: the 3 picture rows are the desktop /
 * tablet / mobile renditions of the slide; the controls (arrows, bullet, play) are restored as
 * the live slider renders them (capture state: controls opacity 0, visible on hover / focus).
 */
function pictureFrom(pics) {
  const picture = document.createElement('picture');
  const imgs = pics.map((p) => p.querySelector('img')).filter(Boolean);
  const [desk, tab, mob] = imgs;
  const medias = ['(min-width: 840px)', '(min-width: 415px)'];
  [desk, tab].forEach((img, i) => {
    if (!img || imgs.length < 2) return;
    const source = document.createElement('source');
    source.srcset = img.getAttribute('src');
    source.media = medias[i];
    picture.append(source);
  });
  const img = document.createElement('img');
  img.src = (mob || tab || desk).getAttribute('src');
  img.alt = (desk || mob).alt || '';
  img.loading = 'eager';
  picture.append(img);
  return picture;
}

export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';
  const rows = [...block.children].map((r) => r.firstElementChild).filter(Boolean);
  const pics = [];
  let credits = null;
  let text = null;
  let tabs = null;
  rows.forEach((c) => {
    if (c.querySelector('h1, h2, h3')) text = c;
    else if (c.querySelector('ul')) tabs = c.querySelector('ul');
    else if (c.querySelector('picture')) pics.push(...c.querySelectorAll('picture'));
    else credits = c.querySelector('p') || c;
  });
  block.textContent = '';
  const slider = document.createElement('div');
  slider.className = 'hero-slider-slider';
  const figure = document.createElement('figure');
  if (pics.length) figure.append(pictureFrom(pics));
  const caption = document.createElement('figcaption');
  if (credits) {
    const cr = document.createElement('div');
    cr.className = 'hero-slider-credits';
    cr.append(credits);
    caption.append(cr);
  }
  figure.append(caption);
  if (text) {
    const bar = document.createElement('div');
    bar.className = 'hero-slider-bar';
    const heading = text.querySelector('h1, h2, h3');
    heading.className = 'hero-slider-title';
    const desc = [...text.querySelectorAll('p')].find((p) => p.textContent.trim());
    // the live bar is ONE link around title + description: move both into it
    const inner = heading.querySelector('a[href]');
    const link = document.createElement('a');
    if (inner) {
      link.href = inner.href;
      inner.replaceWith(...inner.childNodes);
    }
    link.append(heading);
    if (desc) {
      desc.className = 'hero-slider-description';
      const icon = document.createElement('span');
      icon.className = 'hero-slider-icon';
      icon.setAttribute('aria-hidden', 'true');
      desc.append(icon);
      link.append(desc);
    }
    bar.append(link);
    figure.append(bar);
  }
  slider.append(figure);
  // controls: one slide → the bullet is active, arrows are no-ops; auto-switch is a no-op
  const controls = document.createElement('div');
  controls.className = 'hero-slider-controls';
  controls.setAttribute('aria-label', 'Navigation des Sliders');
  controls.innerHTML = '<div class="group"><a class="arrow arrow-left" href="#" aria-label="Vorherige Folie"></a>'
    + '<ul><li class="active"><a class="bullet" href="#" aria-label="Folie 1"></a></li></ul>'
    + '<a class="arrow arrow-right" href="#" aria-label="Nächste Folie"></a></div>'
    + '<div class="group"><a class="play" href="#" aria-label="Animation fortsetzen"></a></div>';
  controls.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
  slider.append(controls);
  block.append(slider);
  if (tabs) {
    const wrap = document.createElement('div');
    wrap.className = 'hero-slider-tabs';
    const ul = document.createElement('ul');
    [...tabs.children].forEach((li) => {
      const item = document.createElement('li');
      if (li.querySelector('strong')) item.className = 'active';
      const a = document.createElement('a');
      a.href = '#';
      a.addEventListener('click', (e) => e.preventDefault());
      const ic = document.createElement('span');
      ic.className = 'hero-slider-tab-icon';
      ic.setAttribute('aria-hidden', 'true');
      a.append(ic, li.textContent.trim());
      item.append(a);
      ul.append(item);
    });
    wrap.append(ul);
    block.append(wrap);
  }
}
