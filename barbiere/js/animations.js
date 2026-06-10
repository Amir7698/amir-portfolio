/* ─── ANIMATIONS.JS — GSAP + ScrollTrigger ─── */
'use strict';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   HERO SLIDER — curtain wipe + ken burns
   ══════════════════════════════════════ */
(function initSlider() {
  const slides    = document.querySelectorAll('.slide');
  const dots      = document.querySelectorAll('.sdot');
  const curtain   = document.getElementById('slideCurtain');
  const fill      = document.getElementById('slideProgressFill');
  const counterEl = document.querySelector('.sc-current');
  const total     = slides.length;
  let current     = 0;
  let timer       = null;
  let isAnimating = false;

  function pad(n) { return String(n + 1).padStart(2, '0'); }

  function startProgress() {
    if (!fill) return;
    fill.classList.remove('running');
    fill.style.width = '0%';
    void fill.offsetWidth; // reflow
    fill.classList.add('running');
    fill.style.width = '100%';
  }

  function goTo(next, dir = 1) {
    if (isAnimating || next === current) return;
    isAnimating = true;
    clearTimeout(timer);

    const outSlide = slides[current];
    const inSlide  = slides[next];

    /* 1 — incoming slide instantly visible but under curtain */
    gsap.set(inSlide, { opacity: 1, zIndex: 2 });
    gsap.set(outSlide, { zIndex: 1 });

    /* 2 — reset + position curtain on the entry side */
    const fromX = dir >= 0 ? '100%' : '-100%';
    const toX   = dir >= 0 ? '-100%' : '100%';
    gsap.set(curtain, { x: fromX, opacity: 1 });

    /* 3 — ken burns on incoming image */
    const inImg = inSlide.querySelector('.slide-img');
    gsap.set(inImg, { scale: 1.08 });
    gsap.to(inImg, { scale: 1.0, duration: 7, ease: 'none' });

    /* 4 — curtain sweeps across: enter → pause → exit */
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(outSlide, { opacity: 0, zIndex: 0 });
        gsap.set(curtain, { opacity: 0 });
        current = next;
        isAnimating = false;
        updateUI();
        scheduleNext();
        startProgress();
      }
    });

    tl.to(curtain, { x: '0%', duration: 0.55, ease: 'power3.inOut' })
      .to(curtain, { x: toX,  duration: 0.55, ease: 'power3.inOut', delay: 0.05 });
  }

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (counterEl) counterEl.textContent = pad(current);
  }

  function scheduleNext() {
    clearTimeout(timer);
    timer = setTimeout(() => goTo((current + 1) % total, 1), 5000);
  }

  /* controls */
  document.getElementById('slideNext')?.addEventListener('click', () => {
    goTo((current + 1) % total, 1);
  });
  document.getElementById('slidePrev')?.addEventListener('click', () => {
    goTo((current - 1 + total) % total, -1);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i, i > current ? 1 : -1));
  });

  /* keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo((current + 1) % total, 1);
    if (e.key === 'ArrowLeft')  goTo((current - 1 + total) % total, -1);
  });

  /* pause on hover */
  document.getElementById('heroSlider')?.addEventListener('mouseenter', () => clearTimeout(timer));
  document.getElementById('heroSlider')?.addEventListener('mouseleave', () => {
    if (!isAnimating) scheduleNext();
  });

  /* init first slide */
  gsap.set(slides[0], { opacity: 1 });
  scheduleNext();
  startProgress();
})();

/* ── Lenis smooth scroll ── */
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

/* ── Preloader ── */
window.addEventListener('DOMContentLoaded', () => {
  const fill = document.querySelector('.pre-fill');
  const pre  = document.getElementById('preloader');

  gsap.to(fill, { width: '100%', duration: 1.4, ease: 'power2.inOut', onComplete: () => {
    gsap.to(pre, {
      opacity: 0, duration: 0.6, ease: 'power2.inOut', delay: 0.2,
      onComplete: () => { pre.style.display = 'none'; revealHero(); }
    });
  }});
});

/* ── Hero entrance ── */
function revealHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8 })
    .to('.hero-title .word', {
      y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out'
    }, '-=0.4')
    .to('.hero-logo-wrap', { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.hero-address', { opacity: 1, duration: 0.6 }, '-=0.5');
}

/* ── Scroll reveal — data-reveal ── */
document.querySelectorAll('[data-reveal]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});

/* ── Scroll reveal up — data-reveal-up ── */
document.querySelectorAll('[data-reveal-up]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    }
  );
});

/* ── Service items stagger ── */
gsap.fromTo('[data-service]',
  { opacity: 0, x: -30 },
  {
    opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '#servizi', start: 'top 70%', once: true }
  }
);

/* ── Gallery parallax ── */
document.querySelectorAll('[data-parallax]').forEach(el => {
  const speed = parseFloat(el.dataset.parallax);
  const img = el.querySelector('img');
  if (!img) return;
  gsap.to(img, {
    yPercent: -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
});

/* ── Orari rows stagger ── */
gsap.fromTo('.ot-row',
  { opacity: 0, x: 20 },
  {
    opacity: 1, x: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.orari-table', start: 'top 80%', once: true }
  }
);

/* ── Section number counter feel ── */
document.querySelectorAll('.section-num').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});

/* ── Nav parallax on hero ── */
gsap.to('#hero .hero-content', {
  yPercent: 25,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});

/* ── WA float show after scroll ── */
ScrollTrigger.create({
  trigger: '#servizi',
  start: 'top 80%',
  onEnter: () => document.querySelector('.wa-float')?.classList.add('visible'),
  onLeaveBack: () => document.querySelector('.wa-float')?.classList.remove('visible'),
});
