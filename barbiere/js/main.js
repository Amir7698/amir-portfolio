/* ─── MAIN.JS — UI Logic ─── */
'use strict';

/* ── Custom Cursor ── */
const cursor       = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursor-follow');
let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) { cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px'; }
});

(function animateCursor() {
  followX += (mouseX - followX) * 0.1;
  followY += (mouseY - followY) * 0.1;
  if (cursorFollow) {
    cursorFollow.style.left = followX + 'px';
    cursorFollow.style.top  = followY + 'px';
  }
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── Magnetic buttons ── */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.3;
    const dy = (e.clientY - cy) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ── Navbar scroll state ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Burger menu ── */
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');
burger?.addEventListener('click', () => {
  const open = mobMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    mobMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Date input — min tomorrow, disable Sunday ── */
const dateInput = document.getElementById('fdate');
if (dateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
  dateInput.addEventListener('input', () => {
    const d = new Date(dateInput.value);
    dateInput.setCustomValidity(d.getDay() === 0 ? 'Siamo chiusi la domenica.' : '');
  });
}

/* ── Highlight today in orari ── */
const todayDay = new Date().getDay();
document.querySelectorAll('.ot-row[data-day]').forEach(row => {
  if (parseInt(row.dataset.day) === todayDay) row.classList.add('today');
});

/* ── Booking form submit ── */
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');
bookingForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn  = bookingForm.querySelector('.form-btn');
  const text = btn.querySelector('.btn-text');
  text.textContent = 'Invio in corso...';
  btn.disabled = true;
  setTimeout(() => {
    formSuccess.style.display = 'block';
    text.textContent = 'Conferma Prenotazione';
    btn.disabled = false;
    bookingForm.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1400);
});

/* ── Active nav link on scroll ── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('[data-nav]');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        const active = a.getAttribute('href') === '#' + entry.target.id;
        a.style.color = active ? 'var(--white)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => io.observe(s));
