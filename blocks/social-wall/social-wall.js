/*
 * social-wall — "Social Media Wall." (live `.aktuelles .posts.columns-4` with LinkedIn /
 * Instagram posts). Optional FIRST row = [intro p][tooltip p] (the live `.text-editor-container`
 * paragraph with its `a.toolTip-opener` and the `div.toolTip` panel). Then one row per column,
 * one cell per post: [network p][date p][account p][content p…][pictures][more p]. The network
 * cell names the post shape: Instagram = media FIRST (carousel, date, account, text), LinkedIn =
 * date, account, text, THEN the carousel. Multi-image posts get the live slider controls as
 * presentational elements (bullets "Zu dieser Folie" ×n, arrows "Zur vorherigen / nächsten
 * Folie"); the motion record (stardust/replica/motion/index.json) shows the active bullet
 * switching and `.post-content.expanded` + the arrow icon flip on "mehr anzeigen" — nothing else.
 */
const NETWORKS = /^(instagram|linkedin|facebook)$/i;

function control(cls, label, text) {
  const a = document.createElement('a');
  a.className = cls;
  a.href = '#';
  a.setAttribute('role', 'button');
  a.setAttribute('aria-label', label);
  if (text) a.textContent = text;
  return a;
}

function carousel(pics) {
  const wrap = document.createElement('div');
  wrap.className = 'social-wall-carousel';
  const slides = document.createElement('ul');
  slides.className = 'social-wall-slides';
  slides.style.width = `${pics.length * 100}%`;
  pics.forEach((p) => {
    const li = document.createElement('li');
    li.style.width = `${100 / pics.length}%`;
    li.append(p.querySelector('picture'));
    slides.append(li);
  });
  wrap.append(slides);
  if (pics.length > 1) {
    const controls = document.createElement('div');
    controls.className = 'social-wall-controls';
    const prev = control('social-wall-prev', 'Zur vorherigen Folie');
    const next = control('social-wall-next', 'Zur nächsten Folie');
    const bullets = document.createElement('ul');
    bullets.className = 'social-wall-bullets';
    const dots = pics.map((_, i) => {
      const li = document.createElement('li');
      const a = control(`social-wall-bullet${i === 0 ? ' active' : ''}`, 'Zu dieser Folie');
      li.append(a);
      bullets.append(li);
      return a;
    });
    let index = 0;
    const go = (i) => {
      index = Math.max(0, Math.min(pics.length - 1, i));
      slides.style.transform = `translateX(-${(index * 100) / pics.length}%)`;
      dots.forEach((d, k) => d.classList.toggle('active', k === index));
      prev.classList.toggle('social-wall-hidden', index === 0);
    };
    dots.forEach((d, i) => d.addEventListener('click', (e) => { e.preventDefault(); go(i); }));
    prev.addEventListener('click', (e) => { e.preventDefault(); go(index - 1); });
    next.addEventListener('click', (e) => { e.preventDefault(); go(index + 1); });
    prev.classList.add('social-wall-hidden');
    controls.append(prev, bullets, next);
    wrap.append(controls);
  }
  return wrap;
}

function intro(row) {
  const [introCell, tipCell] = [...row.children];
  const box = document.createElement('div');
  box.className = 'social-wall-intro';
  const text = introCell.querySelector('p') || introCell;
  text.className = 'social-wall-intro-text';
  box.append(text);
  if (tipCell && tipCell.textContent.trim()) {
    const opener = control('social-wall-tooltip-opener', 'Tooltip');
    const icon = document.createElement('span');
    icon.className = 'social-wall-tooltip-icon';
    icon.setAttribute('aria-hidden', 'true');
    opener.append(icon);
    text.append(opener);
    const tip = document.createElement('div');
    tip.className = 'social-wall-tooltip';
    tip.setAttribute('role', 'tooltip');
    tip.hidden = true;
    tip.append(...tipCell.childNodes);
    const close = control('social-wall-tooltip-close', 'Dialog schließen', '×');
    tip.append(close);
    const toggle = (open) => {
      tip.hidden = !open;
      opener.setAttribute('aria-expanded', String(open));
    };
    opener.setAttribute('aria-expanded', 'false');
    opener.addEventListener('click', (e) => { e.preventDefault(); toggle(tip.hidden); });
    close.addEventListener('click', (e) => { e.preventDefault(); toggle(false); });
    box.append(tip);
  }
  return box;
}

export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';
  const rows = [...block.children];
  const frag = document.createDocumentFragment();
  const isPostCell = (cell) => NETWORKS.test((cell.querySelector('p') || cell).textContent.trim());
  if (rows.length && ![...rows[0].children].some(isPostCell)) frag.append(intro(rows.shift()));
  const columns = document.createElement('ul');
  columns.className = 'social-wall-columns';
  rows.forEach((row) => {
    const col = document.createElement('li');
    col.className = 'social-wall-column';
    const list = document.createElement('ul');
    [...row.children].forEach((cell) => {
      const post = document.createElement('li');
      post.className = 'social-wall-post';
      const nodes = [...cell.children];
      const pics = nodes.filter((n) => n.querySelector && n.querySelector('picture'));
      const texts = nodes.filter((n) => !pics.includes(n));
      const [net, meta, account, ...rest] = texts;
      const more = rest.length && !rest[rest.length - 1].querySelector('a') ? rest.pop() : null;
      const network = net ? net.textContent.trim().toLowerCase() : '';
      const container = document.createElement('div');
      container.className = 'social-wall-container';
      post.classList.add(`social-wall-${network || 'web'}`);
      const media = pics.length ? carousel(pics) : null;
      if (media && network === 'instagram') {
        media.classList.add('social-wall-media');
        if (pics.length === 1) {
          // live li.video-post div.video: poster box capped (max-height 342, overflow hidden)
          // + the play disc
          media.classList.add('social-wall-video');
          const play = document.createElement('span');
          play.className = 'social-wall-play';
          play.setAttribute('aria-hidden', 'true');
          media.append(play);
        }
        container.append(media);
      }
      if (net && meta) {
        const date = document.createElement('div');
        date.className = 'social-wall-date';
        net.className = 'social-wall-net';
        meta.className = 'social-wall-day';
        date.append(net, meta);
        container.append(date);
      }
      if (account) {
        account.className = 'social-wall-account';
        container.append(account);
      }
      const content = document.createElement('div');
      content.className = 'social-wall-content';
      rest.forEach((p) => content.append(p));
      if (media && network !== 'instagram') {
        const wrapper = document.createElement('div');
        wrapper.className = 'social-wall-slider-wrap';
        wrapper.append(media);
        content.append(wrapper);
      }
      container.append(content);
      if (more) {
        more.className = 'social-wall-more';
        const a = document.createElement('a');
        a.href = '#';
        a.setAttribute('role', 'button');
        a.className = 'social-wall-more-link';
        a.append(...more.childNodes);
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const open = content.classList.toggle('expanded');
          a.classList.toggle('open', open);
        });
        more.append(a);
        container.append(more);
        // fix wave 11: live shows the row only when the post's TEXT overruns the 250 px cap —
        // a LinkedIn post whose paragraphs fit keeps its pictures clipped and no row (post 1
        // @1440: live 339 vs served 388 with the row; posts with long text keep it, 396 = 396).
        // The section is hidden until its blocks load, so measure once the content has a box.
        const fits = () => {
          if (!content.clientHeight) return false;
          const { top } = content.getBoundingClientRect();
          const paras = [...content.querySelectorAll(':scope > p')];
          const bottom = paras.reduce((m, p) => Math.max(m, p.getBoundingClientRect().bottom), top);
          return bottom - top <= content.clientHeight + 1;
        };
        if ('ResizeObserver' in window) {
          const ro = new ResizeObserver(() => {
            if (!content.clientHeight) return;
            if (!content.classList.contains('expanded')) more.hidden = fits();
            ro.disconnect();
          });
          ro.observe(content);
        }
      }
      post.append(container);
      list.append(post);
    });
    col.append(list);
    columns.append(col);
  });
  frag.append(columns);
  block.textContent = '';
  block.append(frag);
}
