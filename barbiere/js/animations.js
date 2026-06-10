/* ─── ANIMATIONS.JS — GSAP + ScrollTrigger ─── */
'use strict';

gsap.registerPlugin(ScrollTrigger);

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
