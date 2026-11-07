// Mobile menu
const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
});

// Logo: smooth scroll to the top (on the home page), otherwise go home
document.querySelectorAll('[data-totop]').forEach(a => a.addEventListener('click', e => {
  const home = location.pathname === '/' || location.pathname === '/index.html';
  if (!home) return; // on other pages the logo simply opens the home page
  e.preventDefault();
  nav.classList.remove('open'); burger.setAttribute('aria-expanded', false);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  if (location.hash) history.replaceState(null, '', '/');
}));

// Gallery lightbox
const lb = document.getElementById('lb');
if (lb) {
const lbImg = lb.querySelector('.lb__img');
const lbCount = lb.querySelector('.lb__count');
let set = [], idx = 0;

function show(i) {
  idx = (i + set.length) % set.length;
  lbImg.src = set[idx];
  lbCount.textContent = `${idx + 1} / ${set.length}`;
}
function openLb(name, count, start) {
  set = Array.from({ length: count }, (_, k) => `/images/${name}-${k + 1}.jpg`);
  show(start);
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }

document.querySelectorAll('.flat__gallery').forEach(g => {
  const name = g.dataset.gallery, count = +g.dataset.count;
  g.querySelector('.flat__main').addEventListener('click', () => openLb(name, count, 0));
  g.querySelectorAll('.flat__thumbs button').forEach(b =>
    b.addEventListener('click', () => openLb(name, count, +b.dataset.i - 1)));
});
lb.querySelector('.lb__close').addEventListener('click', closeLb);
lb.querySelector('.lb__prev').addEventListener('click', () => show(idx - 1));
lb.querySelector('.lb__next').addEventListener('click', () => show(idx + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') show(idx - 1);
  if (e.key === 'ArrowRight') show(idx + 1);
});

// Swipe in lightbox
let sx = null;
lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
  sx = null;
});
}
