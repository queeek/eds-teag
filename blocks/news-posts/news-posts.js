/*
 * news-posts — "News & Presse." (live `.aktuelles .posts.columns-4`): one row per column,
 * one cell per post ([date p][label p?][h3][description p][link p]). Reconstructive tier:
 * the captured posts are static content (capture-state policy: no live feed).
 */
export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';
  const columns = document.createElement('ul');
  columns.className = 'news-posts-columns';
  [...block.children].forEach((row) => {
    const col = document.createElement('li');
    col.className = 'news-posts-column';
    const list = document.createElement('ul');
    [...row.children].forEach((cell) => {
      const post = document.createElement('li');
      post.className = 'news-posts-post';
      const link = cell.querySelector('a[href]');
      const a = document.createElement('a');
      a.className = 'news-posts-link';
      if (link) a.href = link.href;
      const body = document.createElement('div');
      body.className = 'news-posts-body';
      const ps = [...cell.querySelectorAll(':scope > p')];
      const heading = cell.querySelector('h1, h2, h3, h4');
      const date = ps[0];
      if (date) { date.className = 'news-posts-date'; body.append(date); }
      const label = ps.length > 3 ? ps[1] : null;
      if (label) { label.className = 'news-posts-label'; body.append(label); }
      if (heading) {
        heading.className = 'news-posts-text';
        body.append(heading);
      }
      const rest = ps.filter((p) => p !== date && p !== label);
      rest.forEach((p) => {
        if (p.querySelector('a')) {
          p.className = 'news-posts-more';
          const icon = document.createElement('span');
          icon.className = 'news-posts-icon';
          icon.setAttribute('aria-hidden', 'true');
          // live p.link: icon + text in one block (gate units 1440 r2: "weiterlesen" box 276 wide
          // at x 20, the served inline a measured 102 at x 38): the icon goes inside the link
          (p.querySelector('a') || p).prepend(icon);
        } else p.className = 'news-posts-description';
        body.append(p);
      });
      a.append(body);
      post.append(a);
      list.append(post);
    });
    col.append(list);
    columns.append(col);
  });
  block.textContent = '';
  block.append(columns);
}
