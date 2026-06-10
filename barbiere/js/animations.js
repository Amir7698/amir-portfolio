'use strict';
gsap.registerPlugin(ScrollTrigger);

/* ── Lenis smooth scroll ── */
const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

/* ══════════════════════════
   PRELOADER
══════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  const fill = document.getElementById('preFill');
  const pre  = document.getElementById('preloader');
  gsap.to(fill, {
    width: '100%', duration: 1.5, ease: 'power2.inOut',
    onComplete: () => gsap.to(pre, {
      opacity: 0, duration: .6, delay: .15,
      onComplete: () => { pre.style.display = 'none'; heroEntrance(); }
    })
  });
});

/* ══════════════════════════
   HERO ENTRANCE
══════════════════════════ */
function heroEntrance() {
  // eyebrow
  document.querySelector('.hero-eyebrow')?.classList.add('in');

  // title lines — stagger
  setTimeout(() => {
    document.querySelectorAll('.hh1-line').forEach((line, i) => {
      setTimeout(() => line.classList.add('in'), i * 130);
    });
  }, 200);

  // desc + btns + scroll
  setTimeout(() => {
    document.querySelector('.hero-desc')?.classList.add('in');
  }, 650);
  setTimeout(() => {
    document.querySelector('.hero-btns')?.classList.add('in');
  }, 800);
  setTimeout(() => {
    document.querySelector('.hero-scroll')?.classList.add('in');
  }, 1100);
}

/* ══════════════════════════
   HERO SLIDER
══════════════════════════ */
(function initSlider() {
  const slides  = document.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.sdot');
  const wipe    = document.getElementById('slideWipe');
  const fill    = document.getElementById('spbFill');
  const curEl   = document.getElementById('slCur');
  const total   = slides.length;
  let cur       = 0;
  let busy      = false;
  let timer;

  const pad = n => String(n + 1).padStart(2, '0');

  function startProg() {
    if (!fill) return;
    fill.style.transition = 'none';
    fill.style.width = '0%';
    void fill.offsetWidth;
    fill.style.transition = 'width 5s linear';
    fill.style.width = '100%';
  }

  function go(next, dir = 1) {
    if (busy || next === cur) return;
    busy = true;
    clearTimeout(timer);

    const outSlide = slides[cur];
    const inSlide  = slides[next];
    const inImg    = inSlide.querySelector('.slide-bg');

    // prepare incoming
    gsap.set(inSlide, { opacity: 1, zIndex: 2 });
    gsap.set(outSlide, { zIndex: 1 });

    // ken burns reset on incoming
    gsap.set(inImg, { scale: 1.07 });
    gsap.to(inImg, { scale: 1, duration: 7, ease: 'none' });

    // curtain from entry side, sweep, exit
    const fromX = dir >= 0 ? '100%' : '-100%';
    const toX   = dir >= 0 ? '-100%' : '100%';
    gsap.set(wipe, { x: fromX, opacity: 1 });

    gsap.timeline({ onComplete() {
      gsap.set(outSlide, { opacity: 0, zIndex: 0 });
      gsap.set(wipe, { opacity: 0 });
      cur = next;
      busy = false;
      updateUI();
      schedNext();
      startProg();
    }})
    .to(wipe, { x: '0%',  duration: .55, ease: 'power3.inOut' })
    .to(wipe, { x: toX,   duration: .55, ease: 'power3.inOut', delay: .04 });
  }

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('is-active', i === cur));
    if (curEl) curEl.textContent = pad(cur);
  }

  function schedNext() {
    clearTimeout(timer);
    timer = setTimeout(() => go((cur + 1) % total, 1), 5000);
  }

  document.getElementById('slNext')?.addEventListener('click', () => go((cur + 1) % total, 1));
  document.getElementById('slPrev')?.addEventListener('click', () => go((cur - 1 + total) % total, -1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i, i > cur ? 1 : -1)));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go((cur + 1) % total, 1);
    if (e.key === 'ArrowLeft')  go((cur - 1 + total) % total, -1);
  });
  const hs = document.getElementById('heroSlider');
  hs?.addEventListener('mouseenter', () => clearTimeout(timer));
  hs?.addEventListener('mouseleave', () => { if (!busy) schedNext(); });

  schedNext();
  startProg();
})();

/* ══════════════════════════
   SCROLL REVEAL — GSAP
══════════════════════════ */
// left reveal
document.querySelectorAll('[data-reveal]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
  );
});

// right reveal
document.querySelectorAll('[data-reveal-r]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
  );
});

// up reveal
document.querySelectorAll('[data-reveal-up]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 45 },
    { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
  );
});

// service + review cards (JS-driven because of CSS transition fallback)
['[data-reveal-up].sv-card', '[data-reveal-up].rv-card'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => el.classList.add('in')
    });
  });
});

// section titles split + clip
document.querySelectorAll('.s-title').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 25 },
    { opacity: 1, y: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
  );
});

/* ── Gallery parallax ── */
document.querySelectorAll('.gm-item img').forEach(img => {
  gsap.fromTo(img,
    { yPercent: -8 },
    { yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }
  );
});

/* ── Hero content parallax ── */
gsap.to('.hero-content', {
  yPercent: 18, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

/* ══════════════════════════
   ANIMATED COUNTERS
══════════════════════════ */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter() {
      gsap.to({ val: 0 }, {
        val: target, duration: 1.8, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
      });
    }
  });
});

/* ── WA FAB show ── */
ScrollTrigger.create({
  trigger: '#servizi', start: 'top 80%',
  onEnter: () => document.querySelector('.wa-fab')?.classList.add('show'),
  onLeaveBack: () => document.querySelector('.wa-fab')?.classList.remove('show'),
});
