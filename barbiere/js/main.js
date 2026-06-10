'use strict';

/* ── Custom cursor ── */
const cur   = document.getElementById('cursor');
const trail = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
});
(function loop() {
  tx += (mx - tx) * .1; ty += (my - ty) * .1;
  if (trail) { trail.style.left = tx + 'px'; trail.style.top = ty + 'px'; }
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});

/* ── Magnetic buttons ── */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) * .28;
    const dy = (e.clientY - r.top  - r.height / 2) * .28;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

/* ── Nav scroll state ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav')?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Burger menu ── */
const burger  = document.getElementById('burger');
const mobOver = document.getElementById('mobOverlay');
burger?.addEventListener('click', () => {
  const open = mobOver.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mob-link').forEach(a => {
  a.addEventListener('click', () => {
    mobOver.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Date input ── */
const bDate = document.getElementById('bDate');
if (bDate) {
  const t = new Date(); t.setDate(t.getDate() + 1);
  bDate.min = t.toISOString().split('T')[0];
  bDate.addEventListener('input', () => {
    bDate.setCustomValidity(new Date(bDate.value).getDay() === 0 ? 'Siamo chiusi la domenica.' : '');
  });
}

/* ── Highlight today ── */
const today = new Date().getDay();
document.querySelectorAll('.ot-row[data-day]').forEach(r => {
  if (parseInt(r.dataset.day) === today) r.classList.add('today');
});

/* ── Booking form ── */
document.getElementById('bookForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const btn  = this.querySelector('button[type=submit]');
  const orig = btn.querySelector('.btn-arr') ? btn.innerHTML : btn.textContent;
  btn.textContent = 'Invio in corso...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('bfSuccess').style.display = 'block';
    btn.innerHTML = orig;
    btn.disabled = false;
    this.reset();
  }, 1400);
});

/* ── Smooth anchor clicks ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── nav-links wrap on small screens ── */
const hh1Lines = document.querySelectorAll('.hh1-line');
hh1Lines.forEach(line => {
  const text = line.textContent;
  line.innerHTML = `<span class="hh1-inner">${text}</span>`;
});
