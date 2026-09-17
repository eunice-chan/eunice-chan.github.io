async function loadContent() {
  const res = await fetch('data/content.json');
  if (!res.ok) throw new Error('Could not load content.json');
  return res.json();
}

function el(tag, opts = {}) {
  const e = document.createElement(tag);
  if (opts.class) e.className = opts.class;
  if (opts.text) e.textContent = opts.text;
  if (opts.html) e.innerHTML = opts.html;
  return e;
}

const ICONS = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>',
  scholar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5L2 10l10 5 10-5-10-5z"/><path d="M6 12.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7.5" y1="10.5" x2="7.5" y2="16.5"/><circle cx="7.5" cy="8" r="1.1" fill="currentColor" stroke="none"/><path d="M11.5 16.5v-4c0-1.4 1-2.3 2.3-2.3s2.2 1 2.2 2.3v4"/></svg>',
  cv: null
};
const ICON_LABELS = { email: 'Email', scholar: 'Google Scholar', github: 'GitHub', linkedin: 'LinkedIn', cv: 'CV' };

// Builds the set of icon links (email/scholar/github/linkedin/cv) into
// any container — used for both the hero row and the sticky side rail.
function renderIconLinks(container, links) {
  Object.keys(ICON_LABELS).forEach(key => {
    const href = links[key];
    if (!href) return;
    const a = el('a', { class: 'icon-link' });
    if (key === 'cv') {
      a.classList.add('icon-link-text');
      a.textContent = 'CV';
    } else {
      a.innerHTML = ICONS[key];
    }
    a.href = key === 'email' ? `mailto:${href}` : href;
    a.title = ICON_LABELS[key];
    a.setAttribute('aria-label', ICON_LABELS[key]);
    container.appendChild(a);
  });
}

function renderHero(data) {
  document.getElementById('hero-name').textContent = data.name;
  document.getElementById('hero-title').textContent = data.title;
  document.getElementById('hero-tagline').textContent = data.tagline;

  if (data.photo) {
    const img = document.getElementById('hero-photo');
    img.src = data.photo;
    img.alt = data.name;
    img.hidden = false;
  }

  renderIconLinks(document.getElementById('hero-links'), data.links);
}

// Sticky side rails: social icons on the left, plaintext email on the
// right. The email is a button rather than a mailto link — clicking it
// copies the address instead of opening a mail client, since the mailto
// affordance already exists on the icon in the hero.
function renderSideRails(data) {
  const iconsEl = document.getElementById('side-rail-icons');
  if (iconsEl) renderIconLinks(iconsEl, data.links);

  const emailBtn = document.getElementById('side-rail-email');
  if (emailBtn && data.links.email) {
    emailBtn.textContent = data.links.email;
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(data.links.email).then(() => {
        const original = emailBtn.textContent;
        emailBtn.textContent = 'Copied!';
        emailBtn.classList.add('is-copied');
        setTimeout(() => {
          emailBtn.textContent = original;
          emailBtn.classList.remove('is-copied');
        }, 1500);
      });
    });
  } else if (emailBtn) {
    emailBtn.remove();
  }
}

function renderAbout(data) {
  document.getElementById('about-text').textContent = data.about;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Bolds the site owner's name wherever it appears in an author list, and
// renders any trailing equal-contribution marker (*, †) as superscript
// on every author.
function authorsHtml(authors, ownerName) {
  return authors
    .split(', ')
    .map(token => {
      const m = token.match(/^(.*?)([*\u2020]+)?$/);
      const name = m[1];
      const marker = m[2] || '';
      const nameHtml = name === ownerName ? `<strong>${escapeHtml(name)}</strong>` : escapeHtml(name);
      return marker ? `${nameHtml}<sup>${marker}</sup>` : nameHtml;
    })
    .join(', ');
}

const EXTERNAL_LINK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg>';

function renderPublications(data) {
  const list = document.getElementById('pub-list');
  data.publications.forEach(pub => {
    const li = el('li', { class: 'reveal' });

    const head = el('div', { class: 'pub-head' });
    const titleEl = el('div', { class: 'pub-title', text: pub.title });
    head.appendChild(titleEl);
    head.appendChild(el('span', { class: 'pub-year', text: pub.year }));

    const authorsEl = el('div', { class: 'pub-authors', html: authorsHtml(pub.authors, data.name) });

    li.appendChild(head);
    li.appendChild(authorsEl);

    // Venue and the Paper/Code links share one line — venue on the left,
    // links right-aligned — rather than links getting their own row.
    if (pub.venue || pub.paper || pub.code) {
      const row = el('div', { class: 'pub-venue-row' });
      if (pub.venue) row.appendChild(el('div', { class: 'pub-venue', text: pub.venue }));

      if (pub.paper || pub.code) {
        const linksEl = el('div', { class: 'pub-links' });
        if (pub.paper) {
          const a = el('a', { class: 'pub-link' });
          a.href = pub.paper;
          a.target = '_blank';
          a.rel = 'noopener';
          a.appendChild(document.createTextNode('Paper'));
          a.insertAdjacentHTML('beforeend', EXTERNAL_LINK_SVG);
          linksEl.appendChild(a);
        }
        if (pub.code) {
          const a = el('a', { class: 'pub-link' });
          a.href = pub.code;
          a.target = '_blank';
          a.rel = 'noopener';
          a.appendChild(document.createTextNode('Code'));
          a.insertAdjacentHTML('beforeend', EXTERNAL_LINK_SVG);
          linksEl.appendChild(a);
        }
        row.appendChild(linksEl);
      }
      li.appendChild(row);
    }

    if (pub.notes) li.appendChild(el('div', { class: 'pub-notes', text: pub.notes }));

    list.appendChild(li);
  });
}

// Clicking the hero photo pops up a speech bubble with a random
// publication title
function initSpeechBubble(data) {
  const photo = document.getElementById('hero-photo');
  const bubble = document.getElementById('speech-bubble');
  if (!photo || !bubble) return;

  const titles = (data.publications || []).map(p => p.title).filter(Boolean);
  if (!titles.length) return;

  let lastIndex = -1;
  function randomTitle() {
    if (titles.length === 1) return titles[0];
    let i;
    do { i = Math.floor(Math.random() * titles.length); } while (i === lastIndex);
    lastIndex = i;
    return titles[i];
  }

  function show() {
    bubble.textContent = randomTitle();
    // Restart the animation
    bubble.classList.remove('is-active');
    void bubble.offsetWidth;
    bubble.classList.add('is-active');
  }

  photo.addEventListener('click', show);
  photo.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      show();
    }
  });
  bubble.addEventListener('animationend', () => {
    bubble.classList.remove('is-active');
  });
}

const CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6"/></svg>';
const MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// Parses the start of a "Mon YYYY – Mon YYYY" (or "... – Present") string
// into a sortable month-index, so Academic and Industry entries can be
// interleaved by actual start date rather than kept in two separate blocks.
function startDateKey(datesStr) {
  const start = datesStr.split('\u2013')[0].trim();
  const parts = start.split(' ');
  const month = MONTHS[parts[0]] ?? 0;
  const year = parseInt(parts[1], 10) || 0;
  return year * 12 + month;
}

// Experiences: Academic (research) and Industry entries merged into one
// grid of cards ordered by start date, each tagged with its category.
// The lab/organization is the card's title; the specific role moves to a
// footer beneath the bullets, with the academic subfield (department) on
// the opposite side of that same footer row.
let entryToggleCount = 0;
function renderExperiences(containerId, groups) {
  const container = document.getElementById(containerId);

  const all = [];
  groups.forEach(({ label, items }) => items.forEach(item => all.push({ label, item })));
  all.sort((a, b) => startDateKey(b.item.dates) - startDateKey(a.item.dates));

  all.forEach(({ label, item }) => {
    const entry = el('div', { class: 'entry reveal' });
    const hasDetails = !!(item.details && item.details.length);

    const main = el('div', { class: 'entry-toggle-main' });

    // Long titles with a comma ("Research Scientist Intern, Generative AI")
    // read better broken at the comma than left to wrap wherever the card
    // happens to be narrow.
    const titleEl = el('div', { class: 'exp-title' });
    const commaIdx = item.role.indexOf(',');
    if (commaIdx !== -1) {
      titleEl.appendChild(document.createTextNode(item.role.slice(0, commaIdx + 1)));
      titleEl.appendChild(document.createElement('br'));
      titleEl.appendChild(document.createTextNode(item.role.slice(commaIdx + 1).trim()));
    } else {
      titleEl.textContent = item.role;
    }
    main.appendChild(titleEl);

    const subtitle = item.lab || item.org;
    if (subtitle) main.appendChild(el('div', { class: 'exp-org', text: subtitle }));

    main.appendChild(el('div', { class: 'exp-dates', text: item.dates }));

    let wrap = null;
    if (hasDetails) {
      entryToggleCount += 1;
      const detailsId = `entry-details-${entryToggleCount}`;
      wrap = el('div', { class: 'details-wrap' });
      wrap.id = detailsId;
      const inner = el('div', { class: 'details-inner' });

      // A promotion within the same role gets its own small progression
      // list — title and dates for each stage — shown above the bullets.
      if (item.progression && item.progression.length) {
        const prog = el('div', { class: 'role-progression' });
        item.progression.forEach(stage => {
          const stageEl = el('div', { class: 'role-progression-item' });
          stageEl.appendChild(el('span', { class: 'role-progression-marker' }));
          const row = el('div', { class: 'role-progression-row' });
          row.appendChild(el('span', { text: stage.title }));
          row.appendChild(el('span', { class: 'prog-dates', text: stage.dates }));
          stageEl.appendChild(row);
          prog.appendChild(stageEl);
        });
        inner.appendChild(prog);
      }

      const ul = el('ul', { class: 'entry-details' });
      item.details.forEach(d => ul.appendChild(el('li', { text: d })));
      inner.appendChild(ul);
      wrap.appendChild(inner);

      const btn = el('button', { class: 'entry-toggle' });
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', detailsId);
      btn.appendChild(main);
      btn.appendChild(el('span', { class: 'entry-chevron', html: CHEVRON_SVG }));
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        wrap.classList.toggle('is-open', !open);
      });
      entry.appendChild(btn);
    } else {
      entry.appendChild(main);
    }

    if (wrap) entry.appendChild(wrap);

    const footer = el('div', { class: 'entry-footer' });
    footer.appendChild(el('span', { class: 'footer-role', text: label }));
    const subtype = item.department || item.subtype;
    if (subtype) footer.appendChild(el('span', { class: 'footer-subtype', text: subtype }));
    entry.appendChild(footer);

    container.appendChild(entry);
  });
}

function renderEducation(containerId, entries) {
  const container = document.getElementById(containerId);
  entries.forEach(item => {
    const row = el('div', { class: 'timeline-item reveal' });
    row.appendChild(el('div', { class: 'timeline-marker' }));

    const content = el('div', { class: 'timeline-content' });
    const head = el('div', { class: 'entry-head' });
    head.appendChild(el('span', { class: 'entry-role', text: item.org }));
    head.appendChild(el('span', { class: 'entry-dates', text: item.dates }));
    content.appendChild(head);
    content.appendChild(el('div', { class: 'entry-degree', text: item.degree }));
    if (item.extra) content.appendChild(el('div', { class: 'entry-extra', text: item.extra }));

    row.appendChild(content);
    container.appendChild(row);
  });
}

function renderTeaching(containerId, items) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
    const li = el('li', { class: 'reveal' });
    const left = el('div');
    const main = el('div', { class: 'item-main' });
    main.appendChild(el('span', { class: 'item-code', text: item.code + ' ' }));
    main.appendChild(document.createTextNode(item.name));
    left.appendChild(main);
    left.appendChild(el('div', { class: 'item-org', text: item.org }));
    li.appendChild(left);
    li.appendChild(el('span', { class: 'item-dates', text: item.dates }));
    container.appendChild(li);
  });
}

// Year leads each award row, in its own aligned column, followed by the
// award text.
function renderAwards(containerId, items) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
    const li = el('li', { class: 'reveal' });
    li.appendChild(el('span', { class: 'award-year', text: item.year }));
    const text = el('span', { class: 'award-text' });
    text.appendChild(el('span', { class: 'item-code', text: item.org + ' ' }));
    text.appendChild(el('span', { text: item.award }));
    li.appendChild(text);
    container.appendChild(li);
  });
}

// Light/dark theme, defaulting to system preference. index.html sets the
// initial data-theme attribute before paint to avoid a flash; this wires
// up the toggle button and keeps following the system while the visitor
// hasn't made an explicit choice.
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem('theme', next);
  });

  mq.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) apply(e.matches ? 'dark' : 'light');
  });
}

// Ambient float: each node drifts on its own slow, gently randomized
// sine path. Connected edges are redrawn every frame to follow along.
// Hovering a node highlights it and its direct connections; clicking
// sends a little pulse rippling out along the edges.
function initGraphAnimation() {
  const svg = document.getElementById('hero-graph');
  if (!svg) return;
  const nodeEls = Array.from(document.querySelectorAll('#graph-nodes circle'));
  const edgeEls = Array.from(document.querySelectorAll('#graph-edges line'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes = nodeEls.map(c => ({
    el: c,
    baseX: +c.getAttribute('cx'),
    baseY: +c.getAttribute('cy'),
    ampX: 8 + Math.random() * 9,
    ampY: 8 + Math.random() * 9,
    speedX: 0.15 + Math.random() * 0.15,
    speedY: 0.15 + Math.random() * 0.15,
    phase: Math.random() * Math.PI * 2
  }));

  function updateEdges() {
    edgeEls.forEach(edge => {
      const a = nodes[+edge.dataset.a].el;
      const b = nodes[+edge.dataset.b].el;
      edge.setAttribute('x1', a.getAttribute('cx'));
      edge.setAttribute('y1', a.getAttribute('cy'));
      edge.setAttribute('x2', b.getAttribute('cx'));
      edge.setAttribute('y2', b.getAttribute('cy'));
    });
  }

  if (reduceMotion) {
    updateEdges();
  } else {
    let t = 0;
    function tick() {
      t += 1;
      nodes.forEach(n => {
        const x = n.baseX + Math.sin(t * 0.02 * n.speedX + n.phase) * n.ampX;
        const y = n.baseY + Math.cos(t * 0.02 * n.speedY + n.phase * 1.3) * n.ampY;
        n.el.setAttribute('cx', x);
        n.el.setAttribute('cy', y);
      });
      updateEdges();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function neighbors(i) {
    return edgeEls
      .filter(e => +e.dataset.a === i || +e.dataset.b === i)
      .map(e => ({ edge: e, other: +e.dataset.a === i ? +e.dataset.b : +e.dataset.a }));
  }

  nodeEls.forEach((node, i) => {
    node.addEventListener('pointerenter', () => {
      node.classList.add('is-active');
      neighbors(i).forEach(({ edge, other }) => {
        edge.classList.add('is-active');
        nodeEls[other].classList.add('is-linked');
      });
    });
    node.addEventListener('pointerleave', () => {
      nodeEls.forEach(n => n.classList.remove('is-active', 'is-linked'));
      edgeEls.forEach(e => e.classList.remove('is-active'));
    });
    node.addEventListener('click', () => {
      if (reduceMotion) return;
      node.classList.add('is-pulsing');
      setTimeout(() => node.classList.remove('is-pulsing'), 600);
      neighbors(i).forEach(({ edge, other }, idx) => {
        setTimeout(() => {
          edge.classList.add('is-pulsing');
          nodeEls[other].classList.add('is-pulsing');
          setTimeout(() => {
            edge.classList.remove('is-pulsing');
            nodeEls[other].classList.remove('is-pulsing');
          }, 500);
        }, 80 + idx * 40);
      });
    });
  });
}

// Fills the thin progress bar under the nav as the page scrolls, highlights
// whichever section link is currently in view, and shows/hides the
// back-to-top button and side rails together once past the hero.
function initScrollProgress() {
  const fill = document.getElementById('progress-bar-fill');
  const backToTop = document.getElementById('back-to-top');
  const sideRails = Array.from(document.querySelectorAll('.side-rail'));
  const navLinks = Array.from(document.querySelectorAll('.topnav a'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    const doc = document.documentElement;
    const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight || 1);
    if (fill) fill.style.width = `${Math.min(1, Math.max(0, scrolled)) * 100}%`;
    const pastHero = doc.scrollTop > window.innerHeight * 0.8;
    if (backToTop) backToTop.classList.toggle('is-visible', pastHero);
    sideRails.forEach(rail => rail.classList.toggle('is-visible', pastHero));

    let current = sections[0];
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top < 120) current = sec;
    });
    navLinks.forEach(a => {
      a.classList.toggle('is-current', document.querySelector(a.getAttribute('href')) === current);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }
}

// One-time, orchestrated entrance for the hero on page load: photo,
// name, role, tagline, and the icon row step in in sequence rather
// than everything appearing at once.
function initHeroIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = document.querySelectorAll('.hero-intro');
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 90}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => item.classList.add('is-visible')));
  });
}

// Subtle parallax on the hero's background graph: it drifts slightly
// slower than the page as the visitor scrolls past the hero, giving it
// a sense of depth rather than sitting flat on the page.
function initHeroParallax() {
  const graph = document.getElementById('hero-graph');
  if (!graph || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function onScroll() {
    const offset = window.scrollY * 0.12;
    graph.style.transform = `translateY(${offset}px)`;
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// A one-time reveal as list items (publications, experience,
// teaching, awards) and section headings first scroll into view —
// staggered slightly so it reads as one gesture per section rather
// than a busy effect.
function initRevealOnScroll() {
  const items = Array.from(document.querySelectorAll('.reveal, .reveal-scale'));
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(i => i.classList.add('is-visible'));
    return;
  }
  const groups = new Map();
  items.forEach(item => {
    const parent = item.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(item);
  });
  groups.forEach(group => {
    group.forEach((item, i) => { item.style.transitionDelay = `${i * 40}ms`; });
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

// Keeps --nav-height in sync with the topnav's real rendered height, so
// the hero's top padding always clears it — whether the links wrap to
// one row, two, or three. ResizeObserver catches viewport resizes,
// orientation changes, and font-load reflows alike.
function initNavOffset() {
  const nav = document.querySelector('.topnav');
  if (!nav) return;
  const sync = () => {
    document.documentElement.style.setProperty('--nav-height', `${Math.ceil(nav.getBoundingClientRect().height)}px`);
  };
  sync();
  if ('ResizeObserver' in window) {
    new ResizeObserver(sync).observe(nav);
  } else {
    window.addEventListener('resize', sync);
  }
}

initNavOffset();

loadContent()
  .then(data => {
    renderHero(data);
    renderSideRails(data);
    renderAbout(data);
    renderPublications(data);
    renderExperiences('experiences-list', [
      { label: 'Academic', items: data.research_experience },
      { label: 'Industry', items: data.professional_experience }
    ]);
    renderEducation('education-list', data.education);
    renderTeaching('teaching-list', data.teaching);
    renderAwards('awards-list', data.awards);
    initTheme();
    initGraphAnimation();
    initScrollProgress();
    initRevealOnScroll();
    initHeroIntro();
    initHeroParallax();
    initSpeechBubble(data);
  })
  .catch(err => {
    document.getElementById('hero-tagline').textContent =
      'Could not load content.json — check that the file exists and you\u2019re viewing this over a local/hosted server (not file://).';
    console.error(err);
  });