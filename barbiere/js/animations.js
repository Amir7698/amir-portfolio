'use strict';
gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════════
   LENIS SMOOTH SCROLL
════════════════════════════ */
const lenis = new Lenis({
  duration: 1.2,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

/* ════════════════════════════
   TEXT SCRAMBLE
════════════════════════════ */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
function scramble(el, finalText, duration = 1200) {
  let frame = 0;
  const totalFrames = Math.floor(duration / 40);
  const original = finalText.toUpperCase();
  const interval = setInterval(() => {
    el.textContent = original.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (frame / totalFrames > i / original.length) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    if (++frame >= totalFrames) { el.textContent = finalText; clearInterval(interval); }
  }, 40);
}

/* ════════════════════════════
   PRELOADER
════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  const fill  = document.getElementById('preFill');
  const pre   = document.getElementById('preloader');

  // inject counter
  const countEl = document.createElement('div');
  countEl.className = 'pre-count';
  countEl.textContent = '0';
  document.querySelector('.pre-inner')?.prepend(countEl);

  let count = 0;
  const countInterval = setInterval(() => {
    count = Math.min(100, count + Math.floor(Math.random() * 12) + 3);
    countEl.textContent = count;
    if (count >= 100) clearInterval(countInterval);
  }, 60);

  gsap.to(fill, {
    width: '100%', duration: 1.6, ease: 'power2.inOut',
    onComplete: () => {
      gsap.to(pre, {
        clipPath: 'inset(0 0 100% 0)',
        duration: .8, ease: 'power3.inOut', delay: .1,
        onComplete: () => { pre.style.display = 'none'; heroEntrance(); }
      });
    }
  });
});

/* ════════════════════════════
   HERO ENTRANCE
════════════════════════════ */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-eyebrow',
    { opacity: 0, y: 15, filter: 'blur(4px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }
  );

  // title lines with letter-spacing trick
  document.querySelectorAll('.hh1-line').forEach((line, i) => {
    tl.add(() => line.classList.add('in'), i * 0.13);
  });

  tl.fromTo('.hero-desc',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: .9 }, '-=.3'
  ).fromTo('.hero-btns',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: .9 }, '-=.6'
  ).fromTo('.hero-scroll',
    { opacity: 0 },
    { opacity: 1, duration: .8 }, '-=.4'
  );

  // scramble hero eyebrow after entrance
  setTimeout(() => {
    const ey = document.querySelector('.hero-eyebrow');
    if (ey) scramble(ey, ey.textContent, 1000);
  }, 900);
}

/* ════════════════════════════
   HERO SLIDER
════════════════════════════ */
(function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.sdot');
  const wipe   = document.getElementById('slideWipe');
  const fill   = document.getElementById('spbFill');
  const curEl  = document.getElementById('slCur');
  const total  = slides.length;
  let cur = 0, busy = false, timer;

  const pad = n => String(n + 1).padStart(2, '0');

  function startProg() {
    if (!fill) return;
    fill.style.transition = 'none'; fill.style.width = '0%';
    void fill.offsetWidth;
    fill.style.transition = 'width 5s linear'; fill.style.width = '100%';
  }

  function go(next, dir = 1) {
    if (busy || next === cur) return;
    busy = true; clearTimeout(timer);
    const inSlide = slides[next], outSlide = slides[cur];
    const inImg = inSlide.querySelector('.slide-bg');
    gsap.set(inSlide, { opacity: 1, zIndex: 2 });
    gsap.set(outSlide, { zIndex: 1 });
    gsap.set(inImg, { scale: 1.07 });
    gsap.to(inImg, { scale: 1, duration: 7, ease: 'none' });
    const fromX = dir >= 0 ? '100%' : '-100%';
    const toX   = dir >= 0 ? '-100%' : '100%';
    gsap.set(wipe, { x: fromX, opacity: 1 });
    gsap.timeline({ onComplete() {
      gsap.set(outSlide, { opacity: 0, zIndex: 0 });
      gsap.set(wipe, { opacity: 0 });
      cur = next; busy = false;
      dots.forEach((d, i) => d.classList.toggle('is-active', i === cur));
      if (curEl) curEl.textContent = pad(cur);
      schedNext(); startProg();
    }})
    .to(wipe, { x: '0%', duration: .55, ease: 'power3.inOut' })
    .to(wipe, { x: toX,  duration: .55, ease: 'power3.inOut', delay: .04 });
  }

  function schedNext() {
    clearTimeout(timer);
    timer = setTimeout(() => go((cur + 1) % total, 1), 5000);
  }

  document.getElementById('slNext')?.addEventListener('click', () => go((cur+1)%total, 1));
  document.getElementById('slPrev')?.addEventListener('click', () => go((cur-1+total)%total, -1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i, i>cur?1:-1)));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') go((cur+1)%total, 1);
    if (e.key === 'ArrowLeft')  go((cur-1+total)%total, -1);
  });
  const hs = document.getElementById('heroSlider');
  hs?.addEventListener('mouseenter', () => clearTimeout(timer));
  hs?.addEventListener('mouseleave', () => { if (!busy) schedNext(); });

  schedNext(); startProg();
})();

/* ════════════════════════════
   GALLERY — CLIP-PATH STAGGER
════════════════════════════ */
const galleryItems = document.querySelectorAll('.gm-item');
if (galleryItems.length) {
  ScrollTrigger.create({
    trigger: '.gallery-mosaic',
    start: 'top 80%',
    once: true,
    onEnter() {
      galleryItems.forEach((item, i) => {
        setTimeout(() => item.classList.add('revealed'), i * 140);
      });
    }
  });
}

/* ════════════════════════════
   3D TILT — gallery + team + about
════════════════════════════ */
function addTilt(selector, strength = 12) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / r.height) * -strength;
      const ry = ((e.clientX - cx) / r.width)  *  strength;
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
addTilt('.gm-item', 8);
addTilt('.wk-img', 10);
addTilt('.ai-main', 6);
addTilt('.tim-frame', 6);

/* ════════════════════════════
   WORKS CARDS — stagger on enter
════════════════════════════ */
ScrollTrigger.create({
  trigger: '#galleria',
  start: 'top 75%',
  once: true,
  onEnter() {
    gsap.fromTo('.wk-card',
      { opacity: 0, y: 60, rotateY: -8 },
      { opacity: 1, y: 0, rotateY: 0, duration: .9, stagger: .12, ease: 'power3.out' }
    );
  }
});

/* ════════════════════════════
   SCROLL REVEALS — enhanced
════════════════════════════ */
document.querySelectorAll('[data-reveal]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -50, filter: 'blur(3px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 83%', once: true } }
  );
});
document.querySelectorAll('[data-reveal-r]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 50, filter: 'blur(3px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 83%', once: true } }
  );
});
document.querySelectorAll('[data-reveal-up]').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 55 },
    { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 83%', once: true } }
  );
});

/* ════════════════════════════
   SECTION TITLES — SCRAMBLE
════════════════════════════ */
document.querySelectorAll('.s-title').forEach(el => {
  // strip em tags text
  const plainText = el.innerText;
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter() {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: .8, ease: 'power3.out',
          onComplete() { scramble(el, plainText, 900); }
        }
      );
    }
  });
});

/* ════════════════════════════
   SERVICE + REVIEW CARDS
════════════════════════════ */
['[data-reveal-up].sv-card', '[data-reveal-up].rv-card'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter: () => el.classList.add('in')
    });
  });
});

/* ════════════════════════════
   ANIMATED COUNTERS
════════════════════════════ */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  ScrollTrigger.create({
    trigger: el, start: 'top 85%', once: true,
    onEnter() {
      gsap.to({ val: 0 }, {
        val: target, duration: 2, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
      });
    }
  });
});

/* ════════════════════════════
   HERO PARALLAX
════════════════════════════ */
gsap.to('.hero-content', {
  yPercent: 22, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
});

// about images parallax
gsap.to('.ai-main img', {
  yPercent: -12, ease: 'none',
  scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: true }
});
gsap.to('.ai-accent img', {
  yPercent: 10, ease: 'none',
  scrollTrigger: { trigger: '.about-grid', start: 'top bottom', end: 'bottom top', scrub: true }
});
gsap.to('.tim-frame img', {
  yPercent: -10, ease: 'none',
  scrollTrigger: { trigger: '.team-grid', start: 'top bottom', end: 'bottom top', scrub: true }
});

// gallery mosaic parallax
document.querySelectorAll('.gm-item img').forEach((img, i) => {
  const dir = i % 2 === 0 ? -10 : 10;
  gsap.fromTo(img, { yPercent: -dir },
    { yPercent: dir, ease: 'none',
      scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }
  );
});

/* ════════════════════════════
   MARQUEE — speed on scroll
════════════════════════════ */
lenis.on('scroll', ({ velocity }) => {
  const t = document.querySelector('.marquee-inner');
  if (!t) return;
  const base = 20, speed = Math.max(base, base + Math.abs(velocity) * 3);
  t.style.animationDuration = speed + 's';
});

/* ════════════════════════════
   WA FAB
════════════════════════════ */
ScrollTrigger.create({
  trigger: '#servizi', start: 'top 80%',
  onEnter: () => document.querySelector('.wa-fab')?.classList.add('show'),
  onLeaveBack: () => document.querySelector('.wa-fab')?.classList.remove('show'),
});
