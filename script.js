/* =============================================
   NEXUS-7 | CYBORG LANDING PAGE
   JavaScript — Animations & Interactivity
   ============================================= */

'use strict';

/* ---- NAVBAR SCROLL BEHAVIOR ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Scrolled state
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link highlighting
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---- MOBILE HAMBURGER MENU ---- */
const hamburger   = document.getElementById('hamburger');
const mobileLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileLinks.classList.toggle('open');
});

// Close menu on link click
mobileLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileLinks.classList.remove('open');
  });
});

/* =============================================
   PARTICLE CANVAS
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const COLORS = ['rgba(0,245,255,', 'rgba(0,255,136,', 'rgba(255,0,204,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 5;
      this.r  = Math.random() * 1.4 + 0.3;
      this.vy = -(Math.random() * 0.5 + 0.1);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.op = Math.random() * 0.6 + 0.1;
      this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = Math.random() * 200 + 100;
      this.age  = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.y < -5) this.reset(false);
    }
    draw() {
      const fade = this.age < 20
        ? this.age / 20
        : this.age > this.life - 20
          ? (this.life - this.age) / 20
          : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.c + (this.op * fade) + ')';
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 14000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
  init();
  loop();
})();

/* =============================================
   INTERSECTION OBSERVER — SCROLL REVEAL
   ============================================= */
function createObserver(selector, options = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const opts = Object.assign({ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }, options);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay ? parseFloat(el.dataset.delay) * 80 : 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, opts);

  els.forEach(el => observer.observe(el));
}

createObserver('.feature-card');
createObserver('.spec-row');
createObserver('.reveal');

/* =============================================
   COUNTER ANIMATION — HERO STATS
   ============================================= */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out expo
    const eased = 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* =============================================
   TERMINAL TYPEWRITER EFFECT
   ============================================= */
(function initTerminal() {
  const output = document.getElementById('terminal-output');
  if (!output) return;

  const lines = [
    { type: 'cmd',     text: 'Initializing NEXUS-7...' },
    { type: 'output',  text: '  [OK] Quantum core: ONLINE' },
    { type: 'output',  text: '  [OK] Neural bridge: SYNCED' },
    { type: 'output',  text: '  [OK] Exo-shield: ARMED' },
    { type: 'output',  text: '  [OK] Bio-sync: CALIBRATED' },
    { type: 'warning', text: '  [!!] Augmentation level: MAXIMUM' },
    { type: 'output',  text: '  [OK] Memory: 512 PB available' },
    { type: 'output',  text: '  [OK] Encryption: AES-4096 active' },
    { type: 'cmd',     text: 'System status check...' },
    { type: 'output',  text: '  All modules nominal.' },
    { type: 'output',  text: '  Uptime: 99.97%' },
    { type: 'output',  text: '' },
    { type: 'output',  text: '  Welcome, Operative.' },
    { type: 'output',  text: '  You are now NEXUS-7 certified.' },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentEl = null;
  let cursor = null;

  // Clear initial content
  output.innerHTML = '';

  // Create cursor element
  cursor = document.createElement('span');
  cursor.className = 't-cursor';

  function typeNext() {
    if (lineIndex >= lines.length) {
      output.appendChild(cursor);
      return;
    }

    const { type, text } = lines[lineIndex];

    if (charIndex === 0) {
      // Create new line element
      const lineEl = document.createElement('div');
      lineEl.className = 't-line';

      if (type === 'cmd') {
        lineEl.innerHTML = `<span class="t-prompt">&gt;</span> `;
      }

      const contentSpan = document.createElement('span');
      contentSpan.className = `t-${type}`;
      lineEl.appendChild(contentSpan);
      output.appendChild(lineEl);
      currentEl = contentSpan;

      // Auto-scroll
      output.scrollTop = output.scrollHeight;
    }

    if (charIndex < text.length) {
      currentEl.textContent += text[charIndex];
      charIndex++;
      setTimeout(typeNext, text === '' ? 0 : 28 + Math.random() * 30);
    } else {
      lineIndex++;
      charIndex = 0;
      currentEl = null;
      const pause = type === 'cmd' ? 300 : 80;
      setTimeout(typeNext, pause);
    }
  }

  // Start when terminal scrolls into view
  const termObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(typeNext, 600);
      termObs.disconnect();
    }
  }, { threshold: 0.3 });

  const termBox = document.querySelector('.terminal-box');
  if (termBox) termObs.observe(termBox);
})();

/* =============================================
   RADAR CHART CANVAS
   ============================================= */
(function initRadar() {
  const canvas = document.getElementById('radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const labels = ['SPEED', 'POWER', 'DEFENSE', 'INTEL', 'STEALTH', 'AGILITY'];
  const values = [0.92, 0.88, 0.95, 0.97, 0.78, 0.85]; // 0–1
  const sides  = labels.length;
  const cx     = canvas.width  / 2;
  const cy     = canvas.height / 2;
  const maxR   = Math.min(cx, cy) - 40;

  let progress = 0;
  let animating = false;

  function drawRadar(p) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const levels = 5;

    // Draw background grid rings
    for (let l = 1; l <= levels; l++) {
      const r = (maxR / levels) * l;
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(0,245,255,${0.04 + l * 0.02})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
      ctx.strokeStyle = 'rgba(0,245,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw data polygon
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
      const r = maxR * values[i] * p;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Fill
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
    grad.addColorStop(0, 'rgba(0,245,255,0.18)');
    grad.addColorStop(1, 'rgba(0,245,255,0.04)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke
    ctx.strokeStyle = 'rgba(0,245,255,0.7)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur  = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw data points
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
      const r = maxR * values[i] * p;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00f5ff';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur  = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,245,255,0.5)';
    ctx.fill();
  }

  function animate() {
    if (!animating) return;
    progress += 0.025;
    if (progress >= 1) { progress = 1; animating = false; }
    drawRadar(progress);
    if (animating) requestAnimationFrame(animate);
  }

  // Initial draw at 0
  drawRadar(0);

  // Start animation on scroll into view
  const radarObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animating && progress < 1) {
      animating = true;
      animate();
      radarObs.disconnect();
    }
  }, { threshold: 0.3 });

  radarObs.observe(canvas);
})();

/* =============================================
   TESTIMONIALS CAROUSEL
   ============================================= */
(function initCarousel() {
  const track  = document.getElementById('testimonials-track');
  const dotsEl = document.getElementById('t-dots');
  const btnPrev = document.getElementById('t-prev');
  const btnNext = document.getElementById('t-next');
  if (!track || !dotsEl || !btnPrev || !btnNext) return;

  const cards     = track.querySelectorAll('.testimonial-card');
  const total     = cards.length;
  const visible   = window.innerWidth <= 768 ? 1 : 2;
  const maxIndex  = Math.ceil(total / visible) - 1;
  let current     = 0;
  let autoTimer;

  // Create dots
  function createDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('div');
      dot.className = 't-dot-item' + (i === current ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    const cardW    = track.parentElement.offsetWidth;
    const gapW     = 24; // matches gap: 1.5rem
    const offsetW  = visible === 1 ? cardW + gapW : (cardW / 2 - gapW / 2 + gapW);
    const offset   = current * (visible === 1 ? cardW + gapW : cardW / 2 + gapW / 2);

    // Simpler: each step moves by half the wrapper width + gap
    const stepSize = track.parentElement.offsetWidth / visible + gapW;
    track.style.transform = `translateX(-${current * stepSize * visible}px)`;

    // Update dots
    dotsEl.querySelectorAll('.t-dot-item').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current >= maxIndex ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? maxIndex : current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5000);
  }

  btnNext.addEventListener('click', () => { next(); startAuto(); });
  btnPrev.addEventListener('click', () => { prev(); startAuto(); });

  createDots();
  startAuto();

  window.addEventListener('resize', () => {
    goTo(0);
    startAuto();
  }, { passive: true });
})();

/* =============================================
   CTA FORM
   ============================================= */
(function initForm() {
  const form    = document.getElementById('cta-form');
  const message = document.getElementById('form-message');
  if (!form || !message) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name   = form.querySelector('#name').value.trim();
    const email  = form.querySelector('#email').value.trim();
    const module = form.querySelector('#module').value;

    // Simple validation
    if (!name) {
      showMessage('ERROR: Designation field is required.', 'error');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage('ERROR: Valid comm channel (email) required.', 'error');
      return;
    }
    if (!module) {
      showMessage('ERROR: Please select an augmentation module.', 'error');
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'PROCESSING...';

    setTimeout(() => {
      showMessage(`CONFIRMED: ${name.toUpperCase()}, your request for ${module.toUpperCase()} augmentation has been queued. Stand by.`, 'success');
      form.reset();
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'SUBMIT REQUEST';
    }, 1800);
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `form-message ${type}`;
  }
})();

/* =============================================
   CURSOR GLOW EFFECT (desktop only)
   ============================================= */
(function initCursorGlow() {
  if (window.innerWidth <= 768) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

/* =============================================
   FEATURE CARD MOUSE PARALLAX TILT (desktop)
   ============================================= */
(function initCardTilt() {
  if (window.innerWidth <= 768) return;

  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* =============================================
   SMOOTH ANCHOR SCROLLING
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =============================================
   GLITCH TEXT — random re-trigger on hover
   ============================================= */
document.querySelectorAll('.glitch-text').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.animation = 'none';
    void el.offsetWidth; // reflow
    el.style.animation = '';
  });
});

/* =============================================
   SECTION REVEAL — general .reveal elements
   ============================================= */
document.querySelectorAll(
  '.section-header, .about-text, .about-visual, .cta-content, .testimonials .section-header'
).forEach(el => el.classList.add('reveal'));

createObserver('.reveal', { threshold: 0.1 });
