// NMD Associates – main.js (GSAP 3.12 + Lenis premium edition)

gsap.registerPlugin(ScrollTrigger);

// ── Lenis smooth scroll + GSAP ticker ──
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
window.__lenis = lenis;

// ─────────────────────────────────────────
//  UTILS
// ─────────────────────────────────────────

function splitByWords(el) {
  const html   = el.innerHTML;
  // Preserve inner HTML tags (em, strong) by working on childNodes
  const frag   = document.createDocumentFragment();
  const spans  = [];

  el.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(chunk => {
        if (/^\s+$/.test(chunk)) {
          frag.appendChild(document.createTextNode(chunk));
        } else if (chunk) {
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.className = 'split-word-inner';
          inner.textContent = chunk;
          outer.appendChild(inner);
          frag.appendChild(outer);
          spans.push(inner);
        }
      });
    } else {
      // Element node (em, strong, etc.) — wrap whole node
      const outer = document.createElement('span');
      outer.className = 'split-word';
      const inner = document.createElement('span');
      inner.className = 'split-word-inner';
      inner.appendChild(node.cloneNode(true));
      outer.appendChild(inner);
      frag.appendChild(outer);
      spans.push(inner);
    }
  });

  el.textContent = '';
  el.appendChild(frag);
  return spans;
}

// ─────────────────────────────────────────
//  CUSTOM CURSOR
// ─────────────────────────────────────────

const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
  document.body.style.cursor = 'none';
  document.querySelectorAll('a, button, input, select, textarea, label').forEach(el => {
    el.style.cursor = 'none';
  });

  window.addEventListener('mousemove', e => {
    gsap.to(cursorDot,  { x: e.clientX, y: e.clientY, duration: 0.06, ease: 'none' });
    gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.3,  ease: 'power2.out' });
  });

  document.querySelectorAll('a, button, .service-card, .partner-card, .review-card, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorRing, { scale: 1.75, opacity: 0.55, duration: 0.25, ease: 'power2.out' });
      gsap.to(cursorDot,  { scale: 1.6,  duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursorRing, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.to(cursorDot,  { scale: 1, duration: 0.2 });
    });
  });
}

// ─────────────────────────────────────────
//  MAIN INIT
// ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Email obfuscation ──
  const EMAIL = 'nmdassociates.insurancebanking' + '@' + 'gmail.com';
  document.querySelectorAll('[data-email]').forEach(el => {
    if (el.hasAttribute('data-email-text')) el.textContent = EMAIL;
    if (el.tagName === 'A') el.href = 'mailto:' + EMAIL;
  });

  // ─────────────────────────────────────────
  //  NAVBAR
  // ─────────────────────────────────────────

  const header   = document.querySelector('header');
  const nav      = document.querySelector('nav');
  const burger   = document.querySelector('.nav-burger');
  const navLinks = nav ? gsap.utils.toArray(nav.querySelectorAll('.nav-ul li a')) : [];
  const pill     = document.querySelector('.nav-pill');
  let   navOpen  = false;

  // Navbar entrance stagger on load
  if (header) {
    const logoEl   = header.querySelector('.logo');
    const contacts = header.querySelector('.hdr-contacts');
    const navItems = header.querySelectorAll('.nav-ul li a');

    gsap.set([logoEl, contacts, burger].filter(Boolean), { opacity: 0, y: -16 });
    gsap.set(navItems, { opacity: 0, y: -8 });

    const headerTl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });
    headerTl
      .to([logoEl, burger].filter(Boolean), { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 })
      .to(contacts, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
      .to(navItems,  { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 }, '-=0.3');
  }

  // Desktop nav pill indicator
  if (pill && nav && window.innerWidth > 768) {
    const ul = nav.querySelector('.nav-ul');

    const movePill = (target) => {
      const ulRect = ul.getBoundingClientRect();
      const tRect  = target.getBoundingClientRect();
      gsap.to(pill, {
        x: tRect.left - ulRect.left,
        width: tRect.width,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    const activeLink = ul.querySelector('a.active');
    if (activeLink) {
      setTimeout(() => { gsap.set(pill, { opacity: 1 }); movePill(activeLink); }, 700);
    }

    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => movePill(link));
    });
    ul.addEventListener('mouseleave', () => {
      const active = ul.querySelector('a.active');
      if (active) movePill(active);
      else gsap.to(pill, { opacity: 0, duration: 0.2 });
    });
  }

  // Mobile nav open
  const openNav = () => {
    navOpen = true;
    burger?.setAttribute('aria-expanded', 'true');
    burger?.classList.add('is-open');
    nav?.classList.add('nav-open');

    const lines = burger?.querySelectorAll('.burger-line');
    if (lines) {
      gsap.to(lines[0], { y: 7, rotation: 45,  duration: 0.35, ease: 'power2.inOut' });
      gsap.to(lines[1], { scaleX: 0, opacity: 0, duration: 0.2, ease: 'power2.in' });
      gsap.to(lines[2], { y: -7, rotation: -45, duration: 0.35, ease: 'power2.inOut' });
    }

    gsap.to(nav, { autoAlpha: 1, duration: 0.4, ease: 'power3.out' });
    gsap.fromTo(navLinks,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'power3.out', delay: 0.18 }
    );

    document.body.style.overflow = 'hidden';
    lenis.stop();
  };

  // Mobile nav close
  const closeNav = () => {
    navOpen = false;
    burger?.setAttribute('aria-expanded', 'false');

    const lines = burger?.querySelectorAll('.burger-line');
    if (lines) {
      gsap.to(lines[0], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(lines[1], { scaleX: 1, opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.08 });
      gsap.to(lines[2], { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' });
    }

    gsap.to(navLinks, { y: -10, opacity: 0, duration: 0.18, stagger: 0.04, ease: 'power2.in' });
    gsap.to(nav, {
      autoAlpha: 0, duration: 0.3, ease: 'power2.in', delay: 0.1,
      onComplete: () => {
        burger?.classList.remove('is-open');
        nav?.classList.remove('nav-open');
      }
    });

    document.body.style.overflow = '';
    lenis.start();
  };

  burger?.addEventListener('click', () => (navOpen ? closeNav() : openNav()));
  navLinks.forEach(link => link.addEventListener('click', () => { if (window.innerWidth <= 768 && navOpen) closeNav(); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && navOpen) closeNav(); });

  // Header hide/show on scroll direction
  let lastScrollY = 0;
  if (header) {
    lenis.on('scroll', ({ scroll }) => {
      header.style.boxShadow = scroll > 30 ? '0 4px 32px rgba(2,18,65,0.25)' : 'none';
      if (navOpen) return;
      const delta = scroll - lastScrollY;
      if (delta > 5 && scroll > 140) {
        gsap.to(header, { yPercent: -100, duration: 0.35, ease: 'power2.in', overwrite: true });
      } else if (delta < -5) {
        gsap.to(header, { yPercent: 0, duration: 0.35, ease: 'power2.out', overwrite: true });
      }
      lastScrollY = scroll;
    });
  }

  // ─────────────────────────────────────────
  //  MARQUEE TICKER
  // ─────────────────────────────────────────

  const marqueeBar = document.querySelector('.marquee-bar');
  if (marqueeBar) {
    const track = marqueeBar.querySelector('.marquee-track');
    if (track) {
      // Build: marqueeBar > marquee-inner > [track, clone]
      const inner = document.createElement('div');
      inner.className = 'marquee-inner';
      marqueeBar.appendChild(inner);
      const clone = track.cloneNode(true);
      inner.appendChild(track);
      inner.appendChild(clone);

      const trackW = track.offsetWidth;

      const marqueeTween = gsap.to(inner, {
        x: -trackW,
        duration: 32,
        ease: 'none',
        repeat: -1,
      });

      // Slow on hover by tweening the tween's timeScale
      marqueeBar.addEventListener('mouseenter', () => gsap.to(marqueeTween, { timeScale: 0.12, duration: 0.6 }));
      marqueeBar.addEventListener('mouseleave', () => gsap.to(marqueeTween, { timeScale: 1,    duration: 0.6 }));
    }
  }

  // ─────────────────────────────────────────
  //  HERO ENTRANCE + WORD-SPLIT H1
  // ─────────────────────────────────────────

  const hero = document.querySelector('.hero');
  if (hero) {
    const heroBadge = hero.querySelector('.hero-badge');
    const heroH1    = hero.querySelector('h1');
    const heroSub   = hero.querySelector('.hero-sub');
    const heroLoc   = hero.querySelector('.hero-location');
    const heroCta   = hero.querySelector('.hero-cta');
    const heroCards = gsap.utils.toArray(hero.querySelectorAll('.hero-card'));

    // Word-split H1 with overflow-clip reveal
    if (heroH1) {
      const words = splitByWords(heroH1);
      gsap.set(words, { y: '115%' });
      gsap.to(words, { y: '0%', duration: 0.85, stagger: 0.055, ease: 'power3.out', delay: 0.55 });
    }

    const rest = [heroBadge, heroSub, heroLoc, heroCta].filter(Boolean);
    gsap.set(rest, { opacity: 0, y: 20 });
    gsap.to(rest, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.3 });

    gsap.set(heroCards, { opacity: 0, y: 26, scale: 0.96 });
    gsap.to(heroCards, { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.14, ease: 'power3.out', delay: 1.05 });

    // Hero progress fill on load
    const heroProgress = hero.querySelector('.hero-progress-fill');
    if (heroProgress) {
      gsap.fromTo(heroProgress, { width: 0 }, { width: '10.847%', duration: 2, ease: 'power2.out', delay: 1.4 });
    }

    // Subtle parallax on hero background blobs
    const heroBg = hero.querySelector('.hero-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });
    }
  }

  // ─────────────────────────────────────────
  //  WORD-SPLIT FOR SECTION HEADINGS
  // ─────────────────────────────────────────

  document.querySelectorAll('h2').forEach(el => {
    if (el.closest('.hero')) return;
    // Skip if already animated by fade-up or stagger
    const words = splitByWords(el);
    if (!words.length) return;

    gsap.set(words, { y: '110%' });
    gsap.to(words, {
      y: '0%',
      duration: 0.72,
      stagger: 0.055,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 89%',
        toggleActions: 'play none none none',
        invalidateOnRefresh: true,
      },
    });
  });

  // ─────────────────────────────────────────
  //  GROUP STAGGER ANIMATIONS
  // ─────────────────────────────────────────

  const groupAnimated = new Set();

  function staggerGroup(selector, from, to, triggerEl) {
    const els = gsap.utils.toArray(selector);
    if (!els.length) return;
    els.forEach(el => groupAnimated.add(el));
    const trigger = typeof triggerEl === 'string'
      ? (document.querySelector(triggerEl) || els[0])
      : (triggerEl || els[0]);

    gsap.fromTo(els, from, {
      ...to,
      scrollTrigger: { trigger, start: 'top 83%', toggleActions: 'play none none none' },
    });
  }

  staggerGroup('.stat-item',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out' },
    '.stats-bar'
  );

  staggerGroup('.service-card, .service-full-card',
    { opacity: 0, y: 50, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
    document.querySelector('.services-grid') || document.querySelector('.services-section-grid') || null
  );

  staggerGroup('.partner-card',
    { opacity: 0, y: 24, scale: 0.93 },
    { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07, ease: 'power2.out' },
    '.partners-grid'
  );

  staggerGroup('.review-card',
    { opacity: 0, y: 40, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.14, ease: 'power2.out' },
    '.reviews-grid'
  );

  staggerGroup('.why-item',
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out' },
    '.why-reasons'
  );

  staggerGroup('.fstat',
    { opacity: 0, y: 20, scale: 0.84 },
    { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.1, ease: 'back.out(1.6)' },
    '.founder-stats'
  );

  staggerGroup('.value-card',
    { opacity: 0, y: 35, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.09, ease: 'power2.out' },
    '.values-grid'
  );

  // ─────────────────────────────────────────
  //  GENERIC FADE-UP
  // ─────────────────────────────────────────

  document.querySelectorAll('.fade-up').forEach(el => {
    if (groupAnimated.has(el)) return;
    if (el.closest('.hero')) return;
    if (el.tagName === 'H2') return; // handled by word-split above

    gsap.fromTo(el,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none', invalidateOnRefresh: true },
      }
    );
  });

  // ─────────────────────────────────────────
  //  COUNTERS
  // ─────────────────────────────────────────

  function animateCounter(el, target, duration = 1800) {
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const t0     = performance.now();
    const tick   = (now) => {
      const p    = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.floor(target * ease).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  document.querySelectorAll('[data-target]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // Already in viewport on load — fire immediately after a short delay
      setTimeout(() => animateCounter(el, parseInt(el.dataset.target)), 400);
    } else {
      ScrollTrigger.create({
        trigger: el, start: 'top 95%', once: true,
        onEnter: () => animateCounter(el, parseInt(el.dataset.target)),
      });
    }
  });

  // ─────────────────────────────────────────
  //  PROGRESS BAR
  // ─────────────────────────────────────────

  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    gsap.fromTo(progressFill, { width: 0 }, {
      width: '10.847%', duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: progressFill, start: 'top 87%', toggleActions: 'play none none none' },
    });
  }

  // ─────────────────────────────────────────
  //  SVG STROKE DRAW
  // ─────────────────────────────────────────

  document.querySelectorAll('.draw-path').forEach(path => {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0, duration: 1.5, ease: 'power2.out',
      scrollTrigger: {
        trigger: path.closest('svg') || path, start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // ─────────────────────────────────────────
  //  LEAD FORM ENTRANCE
  // ─────────────────────────────────────────

  const leadSection = document.querySelector('.lead-section');
  if (leadSection) {
    const leadText = leadSection.querySelector('.lead-text');
    const leadCard = leadSection.querySelector('.lead-form-card');
    if (leadText && leadCard) {
      gsap.fromTo([leadText, leadCard],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.85, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: leadSection, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
    }
  }

  // ─────────────────────────────────────────
  //  MAGNETIC BUTTONS
  // ─────────────────────────────────────────

  document.querySelectorAll('.btn-navy, .btn-gold').forEach(btn => {
    let rect = null;

    btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });

    btn.addEventListener('mousemove', e => {
      if (!rect) return;
      const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.3;
      const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: true });
    });

    btn.addEventListener('mouseleave', () => {
      rect = null;
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: true });
    });
  });

  // ─────────────────────────────────────────
  //  ANCHOR SCROLL VIA LENIS
  // ─────────────────────────────────────────

  document.querySelectorAll('a[href^="#"]').forEach(el => {
    el.addEventListener('click', e => {
      const id = el.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target && window.__lenis) {
        e.preventDefault();
        window.__lenis.scrollTo(target, { offset: -80 });
      }
    });
  });

  // ─────────────────────────────────────────
  //  REFRESH CASCADE
  // ─────────────────────────────────────────

  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 300);
  setTimeout(() => ScrollTrigger.refresh(), 800);
  setTimeout(() => ScrollTrigger.refresh(), 1400);

  const firstSection = document.querySelector('main > *:nth-child(2)');
  if (firstSection) {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { ScrollTrigger.refresh(); obs.disconnect(); } },
      { rootMargin: '200px 0px' }
    );
    obs.observe(firstSection);
  }

  // ─────────────────────────────────────────
  //  NEWSLETTER FORM — AJAX with success feedback
  // ─────────────────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  const subSuccess     = document.getElementById('subSuccess');
  if (newsletterForm && subSuccess) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button[type="submit"]');
      btn.textContent = 'Subscribing…';
      btn.disabled = true;
      try {
        const fd = new FormData(newsletterForm);
        await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
      } catch (_) {}
      newsletterForm.style.display = 'none';
      subSuccess.style.display = 'flex';
    });
  }

  // ─────────────────────────────────────────
  //  QUOTE FORM — web3forms
  // ─────────────────────────────────────────
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('quoteSubmitBtn');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      try {
        const fd = new FormData(quoteForm);
        const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.success) {
          showToast('Quote request sent! We\'ll call you within 2 hours.', 'success');
          quoteForm.reset();
        } else {
          showToast('Something went wrong. Please call us on 97888 39825.', 'error');
        }
      } catch (_) {
        showToast('Could not send. Please call us on 97888 39825.', 'error');
      }
      btn.textContent = 'Get Free Quote';
      btn.disabled = false;
    });
  }

  function showToast(msg, type) {
    let toast = document.querySelector('.nmd-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'nmd-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = 'nmd-toast nmd-toast--' + type + ' nmd-toast--visible';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('nmd-toast--visible'), 4000);
  }

  // ─────────────────────────────────────────
  //  LANGUAGE TOGGLE (EN / தமிழ்)
  // ─────────────────────────────────────────

  const TRANSLATIONS = {
    // NAV
    'nav-home':        { en: 'Home',         ta: 'முகப்பு' },
    'nav-about':       { en: 'About Us',     ta: 'எங்களை பற்றி' },
    'nav-services':    { en: 'Services',     ta: 'சேவைகள்' },
    'nav-partners':    { en: 'Partners',     ta: 'கூட்டாளர்கள்' },
    'nav-claims':      { en: 'Claims',       ta: 'கோரல் ஆதரவு' },
    'nav-contact':     { en: 'Contact',      ta: 'தொடர்பு' },
    'nav-video':       { en: 'Video Gallery', ta: 'வீடியோ தொகுப்பு' },
    'nav-privacy':     { en: 'Privacy Policy', ta: 'தனியுரிமைக் கொள்கை' },
    'nav-terms':       { en: 'Terms',          ta: 'விதிமுறைகள்' },
    // HERO
    'hero-badge':      { en: 'Since 2010 – Trusted Insurance Advisory', ta: '2010 முதல் – நம்பகமான காப்பீட்டு ஆலோசனை' },
    'hero-h1':         { en: 'Protecting Your <em>Family\'s Future</em> with the Right Insurance', ta: 'சரியான காப்பீட்டுடன் உங்கள் <em>குடும்பத்தின் எதிர்காலத்தை</em> பாதுகாக்கவும்' },
    'hero-sub':        { en: 'NMD Associates is a trusted insurance advisory service helping individuals and families choose the best Life, Health, and Motor Insurance solutions with expert guidance and reliable claim support.', ta: 'NMD Associates ஒரு நம்பகமான காப்பீட்டு ஆலோசனை சேவையாகும், இது தனிநபர்கள் மற்றும் குடும்பங்களுக்கு சிறந்த உயிர், சுகாதார மற்றும் வாகன காப்பீட்டு தீர்வுகளை தேர்ந்தெடுக்க உதவுகிறது.' },
    'hero-loc':        { en: 'Serving Tirunelveli • Tenkasi • Thoothukudi Districts', ta: 'திருநெல்வேலி · தென்காசி · தூத்துக்குடி மாவட்டங்களில் சேவை' },
    'hero-cta-quote':  { en: 'Get Free Insurance Quote', ta: 'இலவச காப்பீட்டு மதிப்பீடு பெறுக' },
    'hero-cta-wa':     { en: 'WhatsApp Consultation', ta: 'வாட்ஸ்அப் ஆலோசனை' },
    'hero-cta-call':   { en: 'Call Now', ta: 'இப்போது அழைக்கவும்' },
    // STATS
    'stat-years':      { en: 'Years Experience', ta: 'ஆண்டுகள் அனுபவம்' },
    'stat-customers':  { en: 'Customers Served', ta: 'வாடிக்கையாளர்கள்' },
    'stat-clients':    { en: 'Insurance Clients', ta: 'காப்பீட்டு வாடிக்கையாளர்கள்' },
    'stat-partners':   { en: 'Insurance Partners', ta: 'காப்பீட்டு கூட்டாளர்கள்' },
    'stat-districts':  { en: 'Districts Served', ta: 'மாவட்டங்கள்' },
    // MISSION
    'sec-purpose':     { en: 'Our Purpose', ta: 'எங்கள் நோக்கம்' },
    'mission-h2':      { en: 'Mission: Protecting 1 Lakh Families', ta: 'நோக்கம்: 1 லட்சம் குடும்பங்களை பாதுகாக்கிறோம்' },
    'mission-quote':   { en: '"Insurance is not just a policy — it is protection for your family\'s future."', ta: '"காப்பீடு வெறும் பாலிசி மட்டுமல்ல — அது உங்கள் குடும்பத்தின் எதிர்காலத்திற்கான பாதுகாப்பு."' },
    // SERVICES
    'sec-offer':       { en: 'What We Offer', ta: 'நாங்கள் வழங்குவது' },
    'services-h2':     { en: 'Insurance Services', ta: 'காப்பீட்டு சேவைகள்' },
    'svc-health':      { en: 'Health Insurance', ta: 'சுகாதார காப்பீடு' },
    'svc-life':        { en: 'Life Insurance', ta: 'உயிர் காப்பீடு' },
    'svc-motor':       { en: 'Motor Insurance', ta: 'வாகன காப்பீடு' },
    'svc-advisory':    { en: 'Insurance Advisory', ta: 'காப்பீட்டு ஆலோசனை' },
    // PARTNERS
    'sec-network':     { en: 'Our Network', ta: 'எங்கள் நெட்வொர்க்' },
    'partners-h2':     { en: 'Insurance Partners', ta: 'காப்பீட்டு கூட்டாளர்கள்' },
    // WHY
    'sec-advantage':   { en: 'Our Advantage', ta: 'எங்கள் சிறப்பு' },
    'why-h2':          { en: 'Why Choose NMD Associates', ta: 'ஏன் NMD Associates தேர்வு செய்ய வேண்டும்' },
    // FOUNDER
    'sec-founder':     { en: 'Meet the Founder', ta: 'நிறுவனரை சந்தியுங்கள்' },
    // TESTIMONIALS
    'sec-reviews':     { en: 'Client Reviews', ta: 'வாடிக்கையாளர் மதிப்புரைகள்' },
    'reviews-h2':      { en: 'What Our Clients Say', ta: 'எங்கள் வாடிக்கையாளர்கள் சொல்வது' },
    // FORM
    'sec-consultation':{ en: 'Free Consultation', ta: 'இலவச ஆலோசனை' },
    'quote-h2':        { en: 'Get Your Free Insurance Quote Today', ta: 'இன்றே இலவச காப்பீட்டு மதிப்பீடு பெறுங்கள்' },
    'form-name':       { en: 'Full Name', ta: 'முழு பெயர்' },
    'form-phone':      { en: 'Mobile Number', ta: 'மொபைல் எண்' },
    'form-city':       { en: 'City', ta: 'நகரம்' },
    'form-type':       { en: 'Insurance Type', ta: 'காப்பீட்டு வகை' },
    'form-msg':        { en: 'Message (Optional)', ta: 'செய்தி (விரும்பினால்)' },
    'form-submit':     { en: 'Get Free Quote', ta: 'இலவச மதிப்பீடு பெறுக' },
    // CLAIMS
    'sec-claims':      { en: 'Claim Support', ta: 'கோரல் ஆதரவு' },
    'claims-h2':       { en: 'We Support You Through Claims', ta: 'கோரல் செயல்முறையில் நாங்கள் உங்களுடன் இருக்கிறோம்' },
    // AREAS
    'areas-label':     { en: 'Service Areas', ta: 'சேவை பகுதிகள்' },
    // FOOTER
    'ftr-contact':     { en: 'Contact Us', ta: 'தொடர்பு கொள்ளுங்கள்' },
    'ftr-links':       { en: 'Quick Links', ta: 'விரைவு இணைப்புகள்' },
    'ftr-updates':     { en: 'Stay Updated', ta: 'புதுப்பித்த நிலையில் இருங்கள்' },
    'ftr-privacy':     { en: 'Privacy Policy', ta: 'தனியுரிமைக் கொள்கை' },
    'ftr-terms':       { en: 'Terms & Conditions', ta: 'விதிமுறைகள்' },
    // ABOUT PAGE
    'about-sec-label':    { en: 'Our Story',                           ta: 'எங்கள் கதை' },
    'about-h1':           { en: 'About NMD Associates',                ta: 'NMD Associates பற்றி' },
    'about-founder-sec':  { en: 'Founder',                             ta: 'நிறுவனர்' },
    'about-founder-h2':   { en: 'Muthukumaran Madasamy',               ta: 'முத்துக்குமாரன் மடாசாமி' },
    'about-mission-sec':  { en: 'Our Purpose',                         ta: 'எங்கள் நோக்கம்' },
    'about-mission-h2':   { en: 'Our Mission',                         ta: 'எங்கள் இலக்கு' },
    'about-loc-h3':       { en: 'Service Locations',                   ta: 'சேவை இடங்கள்' },
    'about-values-sec':   { en: 'What Drives Us',                      ta: 'என்ன நம்மை உந்துகிறது' },
    'about-values-h2':    { en: 'Our Core Values',                     ta: 'எங்கள் மதிப்புகள்' },
    'about-social-h3':    { en: 'Follow Us Online',                    ta: 'ஆன்லைனில் தொடரவும்' },
    'about-cta-h2':       { en: 'Let Us Protect Your Future Together', ta: 'சேர்ந்து உங்கள் எதிர்காலத்தை பாதுகாப்போம்' },
    // SERVICES PAGE
    'svc-pg-sec-label':   { en: 'What We Offer',                      ta: 'நாங்கள் வழங்குவது' },
    'svc-pg-h1':          { en: 'Insurance Services',                  ta: 'காப்பீட்டு சேவைகள்' },
    'svc-pg-core-sec':    { en: 'Core Services',                       ta: 'முக்கிய சேவைகள்' },
    'svc-pg-core-h2':     { en: 'Our Insurance Products',              ta: 'எங்கள் காப்பீட்டு தயாரிப்புகள்' },
    'svc-pg-health-h3':   { en: 'Health Insurance',                    ta: 'சுகாதார காப்பீடு' },
    'svc-pg-life-h3':     { en: 'Life Insurance',                      ta: 'உயிர் காப்பீடு' },
    'svc-pg-motor-h3':    { en: 'Motor Insurance',                     ta: 'வாகன காப்பீடு' },
    'svc-pg-advisory-h3': { en: 'Insurance Advisory',                  ta: 'காப்பீட்டு ஆலோசனை' },
    'svc-pg-partners-sec':{ en: 'Our Network',                         ta: 'எங்கள் நெட்வொர்க்' },
    'svc-pg-partners-h2': { en: 'Insurance Partners',                  ta: 'காப்பீட்டு கூட்டாளர்கள்' },
    'svc-pg-cta-h2':      { en: 'Ready to Find the Right Coverage?',   ta: 'சரியான கவரேஜ் கண்டுபிடிக்க தயாரா?' },
    // CONTACT PAGE
    'contact-sec-label':  { en: 'Reach Out',                           ta: 'தொடர்பு கொள்ளுங்கள்' },
    'contact-h1':         { en: 'Contact NMD Associates',              ta: 'NMD Associates ஐ தொடர்பு கொள்ளுங்கள்' },
    'contact-touch-h3':   { en: 'Get in Touch',                        ta: 'தொடர்பில் இருங்கள்' },
    'contact-form-h3':    { en: 'Send Us a Message',                   ta: 'எங்களுக்கு செய்தி அனுப்புங்கள்' },
    // VIDEO GALLERY PAGE
    'gallery-sec-label':  { en: 'Watch & Learn',                       ta: 'பாருங்கள் & கற்றுக்கொள்ளுங்கள்' },
    'gallery-h1':         { en: 'Video Gallery',                       ta: 'வீடியோ தொகுப்பு' },
    'gallery-ch-sec':     { en: 'Our Channel',                         ta: 'எங்கள் சேனல்' },
    'gallery-ch-h2':      { en: 'Insurance Education Videos',          ta: 'காப்பீட்டு கல்வி வீடியோக்கள்' },
    // ABOUT US page
    'about-hero-p':       { en: 'A dedicated insurance advisory committed to protecting your financial future — one family at a time.', ta: 'உங்கள் நிதி எதிர்காலத்தை பாதுகாக்க அர்ப்பணிக்கப்பட்ட காப்பீட்டு ஆலோசனை — ஒரு குடும்பம், ஒரு நேரம்.' },
    'about-founder-title':{ en: 'Founder & Insurance Advisor', ta: 'நிறுவனர் & காப்பீட்டு ஆலோசகர்' },
    'about-founder-quote':{ en: '"Insurance is not just a policy — it is protection for your family\'s future."', ta: '"காப்பீடு வெறும் பாலிசி மட்டுமல்ல — அது உங்கள் குடும்பத்தின் எதிர்காலத்திற்கான பாதுகாப்பு."' },
    'about-fstat-years':  { en: 'Years Exp.',  ta: 'ஆண்டுகள்' },
    'about-fstat-cust':   { en: 'Customers',   ta: 'வாடிக்கையாளர்கள்' },
    'about-fstat-clients':{ en: 'Clients',     ta: 'கிளையண்டுகள்' },
    'about-fstat-districts':{ en: 'Districts', ta: 'மாவட்டங்கள்' },
    'about-mission-p':    { en: 'At NMD Associates, our mission is simple: to provide honest insurance guidance, transparent policy comparisons, and reliable support during claims. Our goal is to bring 1,00,000 families under financial protection through the right insurance solutions.', ta: 'NMD Associates இல் எங்கள் நோக்கம் எளிமையானது: நேர்மையான காப்பீட்டு வழிகாட்டுதல், வெளிப்படையான பாலிசி ஒப்பீடு மற்றும் கோரல் நேரத்தில் நம்பகமான ஆதரவு வழங்குவது. சரியான காப்பீட்டு தீர்வுகளின் மூலம் 1,00,000 குடும்பங்களை நிதி பாதுகாப்பின் கீழ் கொண்டு வருவதே எங்கள் இலக்கு.' },
    'about-why1':         { en: 'Expert Guidance',     ta: 'நிபுணர் வழிகாட்டுதல்' },
    'about-why2':         { en: 'Multiple Options',    ta: 'பல விருப்பங்கள்' },
    'about-why3':         { en: 'Hassle-Free Process', ta: 'எளிமையான செயல்முறை' },
    'about-why4':         { en: 'Ongoing Support',     ta: 'தொடர்ந்த ஆதரவு' },
    'about-values-p':     { en: 'Every interaction, every policy, every claim — guided by these five principles.', ta: 'ஒவ்வொரு தொடர்பு, ஒவ்வொரு பாலிசி, ஒவ்வொரு கோரல் — இந்த ஐந்து கொள்கைகளால் வழிநடத்தப்படுகிறது.' },
    'about-val1':         { en: 'Integrity',      ta: 'நேர்மை' },
    'about-val2':         { en: 'Customer First', ta: 'வாடிக்கையாளர் முதல்' },
    'about-val3':         { en: 'Excellence',     ta: 'சிறப்பு' },
    'about-val4':         { en: 'Innovation',     ta: 'புதுமை' },
    'about-val5':         { en: 'Trust',          ta: 'நம்பிக்கை' },
    'about-social-p':     { en: 'Stay updated with insurance tips, policy updates, and more across all our channels.', ta: 'எங்கள் அனைத்து சேனல்களிலும் காப்பீட்டு குறிப்புகள், பாலிசி புதுப்பிப்புகள் மற்றும் மேலும் தகவல்களுடன் புதுப்பித்த நிலையில் இருங்கள்.' },
    'about-cta-p':        { en: 'Speak with our experts today for a free, no-obligation consultation.', ta: 'இன்றே எங்கள் நிபுணர்களிடம் இலவச ஆலோசனைக்காக பேசுங்கள்.' },
    'about-cta-btn1':     { en: 'Get In Touch',   ta: 'தொடர்பு கொள்ளுங்கள்' },
    // SERVICES page
    'svc-hero-p':         { en: 'Comprehensive insurance solutions tailored to protect you, your family, and your assets — backed by India\'s most trusted insurers.', ta: 'இந்தியாவின் மிகவும் நம்பகமான காப்பீட்டு நிறுவனங்களால் ஆதரிக்கப்படும் — உங்களையும், உங்கள் குடும்பத்தையும், உங்கள் சொத்துக்களையும் பாதுகாக்க வடிவமைக்கப்பட்ட விரிவான காப்பீட்டு தீர்வுகள்.' },
    'svc-health-p':       { en: 'Comprehensive health insurance plans that protect you and your family from rising medical expenses and hospitalization costs. Get cashless treatment at leading hospitals.', ta: 'அதிகரிக்கும் மருத்துவ செலவுகள் மற்றும் மருத்துவமனை செலவுகளிலிருந்து உங்களையும் உங்கள் குடும்பத்தையும் பாதுகாக்கும் விரிவான சுகாதார காப்பீட்டு திட்டங்கள். முன்னணி மருத்துவமனைகளில் பணமில்லா சிகிச்சை பெறுங்கள்.' },
    'svc-life-p':         { en: 'Secure your family\'s financial future with reliable life insurance protection and long-term savings plans. Ensure your loved ones are protected no matter what.', ta: 'நம்பகமான உயிர் காப்பீட்டு பாதுகாப்பு மற்றும் நீண்டகால சேமிப்பு திட்டங்களுடன் உங்கள் குடும்பத்தின் நிதி எதிர்காலத்தை உறுதிப்படுத்துங்கள்.' },
    'svc-motor-p':        { en: 'Affordable and reliable insurance coverage for cars and two-wheelers with quick policy issuance and hassle-free claim support when you need it most.', ta: 'கார்கள் மற்றும் இரு சக்கர வாகனங்களுக்கான மலிவான மற்றும் நம்பகமான காப்பீட்டு கவரேஜ் — விரைவான பாலிசி வழங்கல் மற்றும் எளிமையான கோரல் ஆதரவுடன்.' },
    'svc-advisory-p':     { en: 'Expert, unbiased guidance to compare policies across multiple insurers and select the best plan based on your unique needs, financial goals, and budget.', ta: 'பல காப்பீட்டு நிறுவனங்களில் பாலிசிகளை ஒப்பிட்டு உங்கள் தனித்துவமான தேவைகள், நிதி இலக்குகள் மற்றும் பட்ஜெட்டின் அடிப்படையில் சிறந்த திட்டத்தை தேர்ந்தெடுக்க நிபுணர் வழிகாட்டுதல்.' },
    'svc-partners-p':     { en: 'We work with India\'s most trusted insurance companies to bring you the best coverage options.', ta: 'சிறந்த கவரேஜ் விருப்பங்களை வழங்க இந்தியாவின் மிகவும் நம்பகமான காப்பீட்டு நிறுவனங்களுடன் நாங்கள் பணியாற்றுகிறோம்.' },
    'svc-cta-p':          { en: 'Get a free, personalised insurance quote from our expert advisors today.', ta: 'இன்றே எங்கள் நிபுணர் ஆலோசகர்களிடமிருந்து இலவச, தனிப்பயனாக்கப்பட்ட காப்பீட்டு மதிப்பீடு பெறுங்கள்.' },
    'svc-cta-btn1':       { en: 'Get Free Quote',  ta: 'இலவச மதிப்பீடு பெறுக' },
    'svc-cta-btn2':       { en: 'Contact Us',      ta: 'தொடர்பு கொள்ளுங்கள்' },
    // CONTACT page
    'contact-hero-p':     { en: 'Get a free, no-obligation insurance consultation. We typically respond within a few hours.', ta: 'இலவச, கட்டாயமற்ற காப்பீட்டு ஆலோசனை பெறுங்கள். நாங்கள் பொதுவாக சில மணி நேரங்களில் பதிலளிப்போம்.' },
    'contact-phone':      { en: 'Phone',           ta: 'தொலைபேசி' },
    'contact-email':      { en: 'Email',           ta: 'மின்னஞ்சல்' },
    'contact-whatsapp':   { en: 'WhatsApp',        ta: 'வாட்ஸ்அப்' },
    'contact-areas':      { en: 'Service Areas',   ta: 'சேவை பகுதிகள்' },
    'contact-hours':      { en: 'Office Hours',    ta: 'அலுவலக நேரம்' },
    'contact-hours-p1':   { en: 'Monday – Saturday: 9:00 AM – 6:00 PM IST', ta: 'திங்கள் – சனி: காலை 9:00 – மாலை 6:00' },
    'contact-hours-p2':   { en: 'Sunday: Closed',  ta: 'ஞாயிறு: மூடியிருக்கும்' },
    'contact-call-btn':   { en: 'Call Now',        ta: 'இப்போது அழைக்கவும்' },
    'contact-wa-btn':     { en: 'WhatsApp Consultation', ta: 'வாட்ஸ்அப் ஆலோசனை' },
    'contact-form-email': { en: 'Email Address',   ta: 'மின்னஞ்சல் முகவரி' },
    'contact-form-type':  { en: 'Insurance Enquiry Type', ta: 'காப்பீட்டு விசாரணை வகை' },
    'contact-submit':     { en: 'Send Message',    ta: 'செய்தி அனுப்புக' },
    // VIDEO GALLERY page
    'gallery-hero-p':     { en: 'Insurance education and guidance videos to help you make informed decisions for your family\'s financial future.', ta: 'உங்கள் குடும்பத்தின் நிதி எதிர்காலத்திற்கான தகவலறிந்த முடிவுகள் எடுக்க உதவும் காப்பீட்டு கல்வி மற்றும் வழிகாட்டுதல் வீடியோக்கள்.' },
    'gallery-ch-p':       { en: 'Watch our expert videos on health insurance, life insurance, claim processes, and more. Subscribe to our YouTube channel for the latest updates.', ta: 'சுகாதார காப்பீடு, உயிர் காப்பீடு, கோரல் செயல்முறைகள் மற்றும் பலவற்றில் எங்கள் நிபுணர் வீடியோக்களை பாருங்கள். சமீபத்திய புதுப்பிப்புகளுக்கு எங்கள் YouTube சேனலை சந்தா செலுத்துங்கள்.' },
    'gallery-yt-btn':     { en: 'Subscribe on YouTube', ta: 'YouTube இல் சந்தா செலுத்துங்கள்' },
    'gallery-vid1-h4':    { en: 'How to Choose the Right Health Insurance Plan', ta: 'சரியான சுகாதார காப்பீட்டு திட்டத்தை எவ்வாறு தேர்வு செய்வது' },
    'gallery-vid2-h4':    { en: 'Term Life Insurance: Complete Guide', ta: 'டேர்ம் லைஃப் இன்சூரன்ஸ்: முழுமையான வழிகாட்டி' },
    'gallery-vid3-h4':    { en: 'Motor Insurance Claim Process Explained', ta: 'மோட்டார் காப்பீட்டு கோரல் செயல்முறை விளக்கம்' },
    'gallery-cta-h2':     { en: 'Have Questions About Your Insurance?', ta: 'உங்கள் காப்பீட்டைப் பற்றி கேள்விகள் உள்ளதா?' },
    'gallery-cta-p':      { en: 'Our expert advisors are just a call away. Get personalised guidance for free.', ta: 'எங்கள் நிபுணர் ஆலோசகர்கள் ஒரு அழைப்பில் கிடைப்பார்கள். இலவச தனிப்பயன் வழிகாட்டுதல் பெறுங்கள்.' },
    'gallery-cta-btn1':   { en: 'Contact Us',      ta: 'தொடர்பு கொள்ளுங்கள்' },
    'gallery-yt-p':       { en: 'Visit our YouTube channel for all our educational videos and insurance tips.', ta: 'அனைத்து கல்வி வீடியோக்கள் மற்றும் காப்பீட்டு குறிப்புகளுக்கு எங்கள் YouTube சேனலை பார்வையிடுங்கள்.' },

    // Legal pages
    'legal-sec-label':    { en: 'Legal',                    ta: 'சட்டம்' },
    'privacy-h1':         { en: 'Privacy Policy',           ta: 'தனியுரிமைக் கொள்கை' },
    'privacy-h3-collect': { en: 'Information We Collect',   ta: 'நாங்கள் சேகரிக்கும் தகவல்' },
    'privacy-h3-use':     { en: 'How We Use Your Information', ta: 'உங்கள் தகவலை நாங்கள் எவ்வாறு பயன்படுத்துகிறோம்' },
    'privacy-h3-sharing': { en: 'Information Sharing',      ta: 'தகவல் பகிர்வு' },
    'privacy-h3-security':{ en: 'Data Security',            ta: 'தரவு பாதுகாப்பு' },
    'privacy-h3-cookies': { en: 'Cookies',                  ta: 'குக்கீகள்' },
    'privacy-h3-thirdparty':{ en: 'Third-Party Links',      ta: 'மூன்றாம் தரப்பு இணைப்புகள்' },
    'privacy-h3-rights':  { en: 'Your Rights',              ta: 'உங்கள் உரிமைகள்' },
    'privacy-h3-children':{ en: "Children's Privacy",       ta: 'குழந்தைகளின் தனியுரிமை' },
    'privacy-h3-changes': { en: 'Changes to This Policy',   ta: 'இந்தக் கொள்கையில் மாற்றங்கள்' },
    'privacy-h3-contact': { en: 'Contact Us',               ta: 'தொடர்பு கொள்ளுங்கள்' },
    'terms-h1':           { en: 'Terms & Conditions',       ta: 'விதிமுறைகள் & நிபந்தனைகள்' },
    'terms-h3-1':         { en: '1. Introduction & Acceptance of Terms', ta: '1. அறிமுகம் & விதிமுறைகளை ஏற்றுக்கொள்வு' },
    'terms-h3-2':         { en: '2. Services Offered',      ta: '2. வழங்கப்படும் சேவைகள்' },
    'terms-h3-3':         { en: '3. IRDAI Compliance',      ta: '3. IRDAI இணக்கம்' },
    'terms-h3-4':         { en: '4. Client Obligations',    ta: '4. வாடிக்கையாளர் கடமைகள்' },
    'terms-h3-5':         { en: '5. Disclaimer of Liability', ta: '5. பொறுப்பு மறுப்பு' },
    'terms-h3-6':         { en: '6. Privacy & Data',        ta: '6. தனியுரிமை & தரவு' },
    'terms-h3-7':         { en: '7. Payment Terms',         ta: '7. கட்டண விதிமுறைகள்' },
    'terms-h3-8':         { en: '8. Grievance Redressal',   ta: '8. புகார் தீர்வு' },
    'terms-h3-9':         { en: '9. Governing Law & Jurisdiction', ta: '9. நிர்வாக சட்டம் & அதிகார வரம்பு' },
    'terms-h3-10':        { en: '10. Amendments',           ta: '10. திருத்தங்கள்' },
    'terms-h3-11':        { en: '11. Contact',              ta: '11. தொடர்பு' },

    // Terms body text
    'terms-s1-p1': { en: 'Welcome to NMD Associates ("we," "our," or "us"). By accessing or using our website at <strong>nmdassociates.in</strong> and availing our insurance advisory services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.', ta: 'NMD Associates-க்கு வரவேற்கிறோம் ("நாங்கள்," "எங்கள்," அல்லது "எங்களை"). <strong>nmdassociates.in</strong> என்ற எங்கள் வலைதளத்தை அணுகுவதன் மூலம் அல்லது பயன்படுத்துவதன் மூலம் மற்றும் எங்கள் காப்பீட்டு ஆலோசனை சேவைகளை பெறுவதன் மூலம், நீங்கள் இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளால் கட்டுப்பட ஒப்புக்கொள்கிறீர்கள். இந்த விதிமுறைகளை ஏற்கவில்லை என்றால், தயவுசெய்து எங்கள் சேவைகளை பயன்படுத்தாதீர்கள்.' },
    'terms-s1-p2': { en: 'These Terms and Conditions govern your use of our website and the insurance advisory services provided by NMD Associates. We reserve the right to modify these terms at any time, and continued use of our services constitutes acceptance of any such modifications.', ta: 'இந்த விதிமுறைகள் மற்றும் நிபந்தனைகள் எங்கள் வலைதளத்தையும் NMD Associates வழங்கும் காப்பீட்டு ஆலோசனை சேவைகளையும் பயன்படுத்துவதை நிர்வகிக்கின்றன. எந்த நேரத்திலும் இந்த விதிமுறைகளை மாற்றிக்கொள்ள எங்களுக்கு உரிமை உண்டு; சேவைகளை தொடர்ந்து பயன்படுத்துவது அத்தகைய மாற்றங்களை ஏற்றுக்கொண்டதாக கருதப்படும்.' },
    'terms-s2-p1': { en: 'NMD Associates provides <strong>insurance advisory services</strong> to individuals and families. Our services include:', ta: 'NMD Associates தனிநபர்கள் மற்றும் குடும்பங்களுக்கு <strong>காப்பீட்டு ஆலோசனை சேவைகளை</strong> வழங்குகிறது. எங்கள் சேவைகளில் அடங்குவன:' },
    'terms-s2-li1': { en: 'Guidance and consultation on Life, Health, and Motor Insurance products', ta: 'ஆயுள், உடல்நலம் மற்றும் வாகன காப்பீட்டு தயாரிப்புகள் குறித்த வழிகாட்டுதல் மற்றும் ஆலோசனை' },
    'terms-s2-li2': { en: 'Comparison of insurance policies across multiple insurers', ta: 'பல காப்பீட்டு நிறுவனங்களில் பாலிசிகளை ஒப்பிட்டு பார்க்கும் சேவை' },
    'terms-s2-li3': { en: 'Assistance with insurance policy selection based on your needs and budget', ta: 'உங்கள் தேவை மற்றும் பட்ஜெட்டிற்கேற்ப பாலிசி தேர்வில் உதவி' },
    'terms-s2-li4': { en: 'Support during the policy issuance process', ta: 'பாலிசி வழங்கல் செயல்பாட்டின்போது ஆதரவு' },
    'terms-s2-li5': { en: 'Claim assistance and settlement support', ta: 'கோரல் உதவி மற்றும் தீர்வு ஆதரவு' },
    'terms-s2-li6': { en: 'Policy renewal reminders and management', ta: 'பாலிசி புதுப்பிப்பு நினைவூட்டல்கள் மற்றும் மேலாண்மை' },
    'terms-s2-p2': { en: '<strong>Important:</strong> NMD Associates acts solely as an insurance advisory intermediary. We do not underwrite, issue, or guarantee any insurance policy. All policies are issued directly by the respective IRDAI-registered insurance companies. The final decision on policy issuance rests with the insurer.', ta: '<strong>முக்கியம்:</strong> NMD Associates காப்பீட்டு ஆலோசனை இடைத்தரகராக மட்டுமே செயல்படுகிறது. எந்த காப்பீட்டு பாலிசியையும் நாங்கள் எழுதவோ, வழங்கவோ அல்லது உத்தரவாதம் அளிக்கவோ மாட்டோம். அனைத்து பாலிசிகளும் IRDAI-பதிவு செய்யப்பட்ட காப்பீட்டு நிறுவனங்களால் நேரடியாக வழங்கப்படுகின்றன. பாலிசி வழங்கல் குறித்த இறுதி முடிவு காப்பீட்டாளரிடமே உள்ளது.' },
    'terms-s3-p1': { en: 'NMD Associates operates as a licensed insurance advisor in accordance with the regulations of the <strong>Insurance Regulatory and Development Authority of India (IRDAI)</strong>. Our advisory services are governed by the IRDAI (Insurance Brokers) Regulations and applicable Indian insurance laws.', ta: 'NMD Associates <strong>இந்தியா காப்பீட்டு ஒழுங்குமுறை மற்றும் மேம்பாட்டு ஆணையம் (IRDAI)</strong> விதிமுறைகளின்படி உரிமம் பெற்ற காப்பீட்டு ஆலோசகராக செயல்படுகிறது. எங்கள் ஆலோசனை சேவைகள் IRDAI (காப்பீட்டு தரகர்கள்) விதிமுறைகள் மற்றும் பொருந்தக்கூடிய இந்திய காப்பீட்டு சட்டங்களால் நிர்வகிக்கப்படுகின்றன.' },
    'terms-s3-li1': { en: 'We are committed to maintaining full compliance with all IRDAI guidelines and regulations', ta: 'அனைத்து IRDAI வழிகாட்டுதல்கள் மற்றும் விதிமுறைகளுக்கு முழு இணக்கத்தை பராமரிக்க நாங்கள் உறுதிபூண்டுள்ளோம்' },
    'terms-s3-li2': { en: 'Our advisory recommendations are based on your declared needs and publicly available policy information', ta: 'எங்கள் ஆலோசனை பரிந்துரைகள் உங்கள் அறிவிக்கப்பட்ட தேவைகள் மற்றும் பொதுவில் கிடைக்கும் பாலிசி தகவல்களின் அடிப்படையில் அமைந்துள்ளன' },
    'terms-s3-li3': { en: 'We do not receive undisclosed commissions or incentives that would compromise the objectivity of our advice', ta: 'எங்கள் ஆலோசனையின் நடுநிலைமையை பாதிக்கும் வகையில் வெளிப்படுத்தப்படாத கமிஷன்கள் அல்லது ஊக்கத்தொகைகளை நாங்கள் பெறுவதில்லை' },
    'terms-s3-li4': { en: 'All insurance products recommended by us are offered by IRDAI-registered insurance companies', ta: 'நாங்கள் பரிந்துரைக்கும் அனைத்து காப்பீட்டு தயாரிப்புகளும் IRDAI-பதிவு செய்யப்பட்ட காப்பீட்டு நிறுவனங்களால் வழங்கப்படுகின்றன' },
    'terms-s4-p1': { en: 'As a client of NMD Associates, you agree to:', ta: 'NMD Associates-ன் வாடிக்கையாளராக, நீங்கள் பின்வருவனவற்றை ஒப்புக்கொள்கிறீர்கள்:' },
    'terms-s4-li1': { en: '<strong>Accuracy of Information:</strong> Provide complete, accurate, and truthful information when requesting advisory services or filling insurance proposal forms. Any misrepresentation may result in policy rejection or claim denial by the insurer.', ta: '<strong>தகவலின் துல்லியம்:</strong> ஆலோசனை சேவைகளை கோரும்போது அல்லது காப்பீட்டு முன்மொழிவு படிவங்களை நிரப்பும்போது முழுமையான, துல்லியமான மற்றும் உண்மையான தகவல்களை வழங்குங்கள். எந்த தவறான தகவலும் காப்பீட்டாளரால் பாலிசி நிராகரிப்பு அல்லது கோரல் மறுப்புக்கு வழிவகுக்கலாம்.' },
    'terms-s4-li2': { en: '<strong>Timely Premium Payment:</strong> Ensure timely payment of insurance premiums directly to the insurer as per the policy schedule. NMD Associates is not responsible for lapsed policies due to non-payment of premiums.', ta: '<strong>சரியான நேரத்தில் பிரீமியம் செலுத்துதல்:</strong> பாலிசி அட்டவணையின்படி நேரடியாக காப்பீட்டாளருக்கு சரியான நேரத்தில் பிரீமியம் செலுத்துவதை உறுதி செய்யுங்கள். பிரீமியம் செலுத்தாமல் காலாவதியான பாலிசிகளுக்கு NMD Associates பொறுப்பல்ல.' },
    'terms-s4-li3': { en: '<strong>Policy Document Review:</strong> Carefully read all policy documents, terms, conditions, and exclusions before signing or accepting any insurance policy.', ta: '<strong>பாலிசி ஆவண மதிப்பாய்வு:</strong> எந்த காப்பீட்டு பாலிசியையும் கையொப்பமிடுவதற்கு அல்லது ஏற்றுக்கொள்வதற்கு முன் அனைத்து பாலிசி ஆவணங்கள், விதிமுறைகள், நிபந்தனைகள் மற்றும் விலக்குகளை கவனமாக படிக்கவும்.' },
    'terms-s4-li4': { en: '<strong>Disclosure:</strong> Disclose all material facts relevant to the insurance proposal, including pre-existing medical conditions, vehicle modifications, or other pertinent information.', ta: '<strong>வெளிப்படுத்தல்:</strong> முன்பே இருக்கும் மருத்துவ நிலைகள், வாகன மாற்றங்கள் அல்லது பிற தொடர்புடைய தகவல்கள் உட்பட காப்பீட்டு முன்மொழிவுக்கு தொடர்புடைய அனைத்து முக்கிய உண்மைகளையும் வெளிப்படுத்துங்கள்.' },
    'terms-s4-li5': { en: '<strong>Compliance with Insurer Terms:</strong> Adhere to all terms and conditions set by the respective insurance company for your policy.', ta: '<strong>காப்பீட்டாளர் விதிமுறைகளுக்கு இணக்கம்:</strong> உங்கள் பாலிசிக்காக சம்பந்தப்பட்ட காப்பீட்டு நிறுவனம் நிர்ணயிக்கும் அனைத்து விதிமுறைகளையும் நிபந்தனைகளையும் பின்பற்றுங்கள்.' },
    'terms-s5-p1': { en: 'NMD Associates provides advisory services only. We expressly disclaim the following:', ta: 'NMD Associates ஆலோசனை சேவைகளை மட்டுமே வழங்குகிறது. நாங்கள் பின்வருவனவற்றை வெளிப்படையாக மறுக்கிறோம்:' },
    'terms-s5-li1': { en: 'We are not liable for any decisions made by insurance companies regarding policy acceptance, rejection, or claim settlement', ta: 'பாலிசி ஏற்பு, நிராகரிப்பு அல்லது கோரல் தீர்வு தொடர்பான காப்பீட்டு நிறுவனங்களின் எந்த முடிவுக்கும் நாங்கள் பொறுப்பேற்கவில்லை' },
    'terms-s5-li2': { en: 'We do not guarantee that any specific insurance claim will be approved or settled by the insurer', ta: 'எந்த குறிப்பிட்ட காப்பீட்டு கோரலும் காப்பீட்டாளரால் அனுமதிக்கப்படும் அல்லது தீர்க்கப்படும் என்று நாங்கள் உத்தரவாதம் அளிக்கவில்லை' },
    'terms-s5-li3': { en: 'The final terms, coverage, premiums, and conditions of any insurance policy are determined solely by the insurer', ta: 'எந்த காப்பீட்டு பாலிசியின் இறுதி விதிமுறைகள், கவரேஜ், பிரீமியம்கள் மற்றும் நிபந்தனைகள் காப்பீட்டாளரால் மட்டுமே தீர்மானிக்கப்படுகின்றன' },
    'terms-s5-li4': { en: 'We are not responsible for any losses, damages, or expenses arising from policy exclusions or insurer decisions', ta: 'பாலிசி விலக்குகள் அல்லது காப்பீட்டாளர் முடிவுகளிலிருந்து எழும் எந்த இழப்புகள், சேதங்கள் அல்லது செலவுகளுக்கும் நாங்கள் பொறுப்பல்ல' },
    'terms-s5-li5': { en: 'Our advisory opinions are based on information available at the time of consultation and may not account for subsequent regulatory or product changes', ta: 'எங்கள் ஆலோசனை கருத்துகள் ஆலோசனை நேரத்தில் கிடைக்கும் தகவல்களை அடிப்படையாகக் கொண்டவை மற்றும் பிறகு ஏற்படும் ஒழுங்குமுறை அல்லது தயாரிப்பு மாற்றங்களை கணக்கில் எடுக்காமல் போகலாம்' },
    'terms-s5-p2': { en: 'To the maximum extent permitted by applicable law, NMD Associates shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with our advisory services.', ta: 'பொருந்தக்கூடிய சட்டம் அனுமதிக்கும் அதிகபட்ச அளவிற்கு, NMD Associates எங்கள் ஆலோசனை சேவைகளிலிருந்து அல்லது அதனுடன் தொடர்புடைய எந்த மறைமுக, தற்செயல், சிறப்பு அல்லது விளைவான சேதங்களுக்கும் பொறுப்பேற்காது.' },
    'terms-s6-p1': { en: 'Your privacy is important to us. The collection, use, and protection of your personal information is governed by our <a href="privacy-policy.html">Privacy Policy</a>, which is incorporated into these Terms and Conditions by reference. By using our services, you consent to the data practices described in our Privacy Policy.', ta: 'உங்கள் தனியுரிமை எங்களுக்கு முக்கியமானது. உங்கள் தனிப்பட்ட தகவல்களை சேகரித்தல், பயன்படுத்துதல் மற்றும் பாதுகாத்தல் எங்கள் <a href="privacy-policy.html">தனியுரிமைக் கொள்கையால்</a> நிர்வகிக்கப்படுகிறது, இது குறிப்பு மூலம் இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளில் இணைக்கப்பட்டுள்ளது. எங்கள் சேவைகளை பயன்படுத்துவதன் மூலம், எங்கள் தனியுரிமைக் கொள்கையில் விவரிக்கப்பட்ட தரவு நடைமுறைகளுக்கு நீங்கள் ஒப்புதல் அளிக்கிறீர்கள்.' },
    'terms-s6-p2': { en: 'We collect personal information such as your name, mobile number, email address, and insurance requirements solely for the purpose of providing advisory services. This information may be shared with insurance companies for the purpose of obtaining quotes or issuing policies, with your explicit consent.', ta: 'ஆலோசனை சேவைகளை வழங்கும் நோக்கத்திற்காக மட்டுமே உங்கள் பெயர், மொபைல் எண், மின்னஞ்சல் முகவரி மற்றும் காப்பீட்டு தேவைகள் போன்ற தனிப்பட்ட தகவல்களை நாங்கள் சேகரிக்கிறோம். உங்கள் வெளிப்படையான ஒப்புதலுடன், மேற்கோள்கள் பெறுவதற்கு அல்லது பாலிசிகள் வழங்குவதற்கு இந்த தகவல் காப்பீட்டு நிறுவனங்களுடன் பகிரப்படலாம்.' },
    'terms-s7-p1': { en: 'NMD Associates may charge advisory fees for certain premium or specialised consultation services. Where applicable:', ta: 'சில பிரீமியம் அல்லது சிறப்பு ஆலோசனை சேவைகளுக்கு NMD Associates ஆலோசனை கட்டணங்களை வசூலிக்கலாம். பொருந்தும் இடத்தில்:' },
    'terms-s7-li1': { en: 'All fees will be clearly communicated to you before services are rendered', ta: 'சேவைகள் வழங்கப்படுவதற்கு முன் அனைத்து கட்டணங்களும் உங்களுக்கு தெளிவாக தெரிவிக்கப்படும்' },
    'terms-s7-li2': { en: 'Advisory fees, if any, are separate from insurance premiums payable to insurers', ta: 'ஆலோசனை கட்டணங்கள், ஏதேனும் இருந்தால், காப்பீட்டாளர்களுக்கு செலுத்த வேண்டிய காப்பீட்டு பிரீமியங்களிலிருந்து தனிப்பட்டவை' },
    'terms-s7-li3': { en: 'Insurance premiums are payable directly to the respective insurance company and not to NMD Associates', ta: 'காப்பீட்டு பிரீமியங்கள் NMD Associates-க்கு அல்ல, நேரடியாக சம்பந்தப்பட்ட காப்பீட்டு நிறுவனத்திற்கு செலுத்த வேண்டும்' },
    'terms-s7-li4': { en: 'Refund of advisory fees, if applicable, will be governed by the specific terms communicated at the time of engagement', ta: 'ஆலோசனை கட்டண திரும்பப் பெறுதல், பொருந்தும் பட்சத்தில், ஈடுபாட்டின் போது தெரிவிக்கப்பட்ட குறிப்பிட்ட விதிமுறைகளால் நிர்வகிக்கப்படும்' },
    'terms-s7-p2': { en: 'For standard advisory consultations and policy guidance, NMD Associates does not charge any direct fees to clients — our compensation is received from insurers in the form of commissions, as disclosed in accordance with IRDAI regulations.', ta: 'நிலையான ஆலோசனை கலந்தாய்வுகள் மற்றும் பாலிசி வழிகாட்டுதலுக்கு, NMD Associates வாடிக்கையாளர்களிடம் நேரடி கட்டணம் எதுவும் வசூலிக்கவில்லை — IRDAI விதிமுறைகளின்படி வெளியிடப்பட்டபடி, காப்பீட்டாளர்களிடமிருந்து கமிஷன் வடிவில் எங்கள் இழப்பீடு பெறப்படுகிறது.' },
    'terms-s8-p1': { en: 'We are committed to resolving any concerns or complaints promptly and fairly. If you have a grievance related to our services:', ta: 'எந்த கவலைகள் அல்லது புகார்களையும் உடனடியாகவும் நேர்மையாகவும் தீர்க்க நாங்கள் உறுதிபூண்டுள்ளோம். எங்கள் சேவைகள் தொடர்பான புகார் இருந்தால்:' },
    'terms-s8-li1': { en: '<strong>Step 1 — Contact Us Directly:</strong> Reach out to us via phone (+91 97888 39825 / +91 79046 99119) or email with details of your complaint. We aim to respond within 3 working days.', ta: '<strong>படி 1 — நேரடியாக தொடர்பு கொள்ளுங்கள்:</strong> உங்கள் புகாரின் விவரங்களுடன் தொலைபேசி (+91 97888 39825 / +91 79046 99119) அல்லது மின்னஞ்சல் மூலம் எங்களை தொடர்பு கொள்ளுங்கள். 3 வேலை நாட்களுக்குள் பதிலளிக்க நாங்கள் இலக்கு வைக்கிறோம்.' },
    'terms-s8-li2': { en: '<strong>Step 2 — Written Complaint:</strong> If your concern is not resolved satisfactorily, you may submit a written complaint to our office address in Tirunelveli, Tamil Nadu.', ta: '<strong>படி 2 — எழுத்துப்பூர்வ புகார்:</strong> உங்கள் கவலை திருப்திகரமாக தீர்க்கப்படவில்லை என்றால், திருநெல்வேலி, தமிழ்நாட்டில் உள்ள எங்கள் அலுவலக முகவரிக்கு எழுத்துப்பூர்வ புகாரை சமர்பிக்கலாம்.' },
    'terms-s8-li3': { en: '<strong>Step 3 — IRDAI Escalation:</strong> If your grievance remains unresolved after 15 days, you may escalate it to the IRDAI through the <strong>Bima Bharosa</strong> portal at <a href="https://bimabharosa.irdai.gov.in" target="_blank" rel="noopener">bimabharosa.irdai.gov.in</a> or call the IRDAI toll-free number <strong>155255</strong>.', ta: '<strong>படி 3 — IRDAI-க்கு உயர்த்துதல்:</strong> 15 நாட்களுக்குப் பிறகும் உங்கள் புகார் தீர்க்கப்படவில்லை என்றால், <a href="https://bimabharosa.irdai.gov.in" target="_blank" rel="noopener">bimabharosa.irdai.gov.in</a> என்ற <strong>பீமா பரோசா</strong> போர்ட்டல் மூலம் அல்லது IRDAI இலவச தொலைபேசி எண் <strong>155255</strong>-ஐ அழைத்து IRDAI-க்கு உயர்த்தலாம்.' },
    'terms-s8-li4': { en: '<strong>Insurance Ombudsman:</strong> You may also approach the Insurance Ombudsman having jurisdiction over Tirunelveli for disputes related to insurance policies or claims.', ta: '<strong>காப்பீட்டு ஒம்புட்ஸ்மேன்:</strong> காப்பீட்டு பாலிசிகள் அல்லது கோரல்கள் தொடர்பான தகராறுகளுக்கு திருநெல்வேலி மீது அதிகார வரம்பு கொண்ட காப்பீட்டு ஒம்புட்ஸ்மேனையும் அணுகலாம்.' },
    'terms-s9-p1': { en: 'These Terms and Conditions shall be governed by and construed in accordance with the <strong>Laws of India</strong>. Any disputes arising out of or in connection with these terms, or the services provided by NMD Associates, shall be subject to the exclusive jurisdiction of the courts located in <strong>Tirunelveli, Tamil Nadu, India</strong>.', ta: 'இந்த விதிமுறைகள் மற்றும் நிபந்தனைகள் <strong>இந்தியாவின் சட்டங்களின்</strong> படி நிர்வகிக்கப்பட்டு விளக்கப்படும். இந்த விதிமுறைகளிலிருந்து அல்லது NMD Associates வழங்கும் சேவைகளுடன் தொடர்புடைய எந்த தகராறும் <strong>திருநெல்வேலி, தமிழ்நாடு, இந்தியாவில்</strong> அமைந்துள்ள நீதிமன்றங்களின் பிரத்யேக அதிகார வரம்புக்கு உட்படும்.' },
    'terms-s9-p2': { en: 'Nothing in this clause shall limit your rights as a consumer under applicable Indian consumer protection laws.', ta: 'இந்த விதியில் உள்ள எதுவும் பொருந்தக்கூடிய இந்திய நுகர்வோர் பாதுகாப்பு சட்டங்களின் கீழ் நுகர்வோராக உங்கள் உரிமைகளை கட்டுப்படுத்தாது.' },
    'terms-s10-p1': { en: 'NMD Associates reserves the right to amend, update, or modify these Terms and Conditions at any time without prior notice. The updated terms will be posted on this page with a revised date. It is your responsibility to review these terms periodically. Your continued use of our services following the posting of changes constitutes your acceptance of those changes.', ta: 'NMD Associates முன் அறிவிப்பின்றி எந்த நேரத்திலும் இந்த விதிமுறைகள் மற்றும் நிபந்தனைகளை திருத்தவோ, புதுப்பிக்கவோ அல்லது மாற்றவோ உரிமை வைத்திருக்கிறது. புதுப்பிக்கப்பட்ட விதிமுறைகள் திருத்தப்பட்ட தேதியுடன் இந்தப் பக்கத்தில் வெளியிடப்படும். இந்த விதிமுறைகளை அவ்வப்போது மதிப்பாய்வு செய்வது உங்கள் பொறுப்பு. மாற்றங்கள் வெளியிடப்பட்ட பிறகு சேவைகளை தொடர்ந்து பயன்படுத்துவது அந்த மாற்றங்களை ஏற்றுக்கொண்டதாக கருதப்படும்.' },
    'terms-s10-p2': { en: 'Significant changes that materially affect your rights will be communicated via our website or through direct communication where reasonably practicable.', ta: 'உங்கள் உரிமைகளை கணிசமாக பாதிக்கும் முக்கியமான மாற்றங்கள் நடைமுறையில் சாத்தியமான இடத்தில் எங்கள் வலைதளம் வழியாக அல்லது நேரடி தொடர்பு மூலம் தெரிவிக்கப்படும்.' },
    'terms-s11-p1': { en: 'If you have any questions, concerns, or require clarification regarding these Terms and Conditions, please contact us:', ta: 'இந்த விதிமுறைகள் மற்றும் நிபந்தனைகள் தொடர்பான கேள்விகள், கவலைகள் அல்லது விளக்கம் தேவைப்பட்டால், தயவுசெய்து எங்களை தொடர்பு கொள்ளுங்கள்:' },
    'terms-s11-li1': { en: '<strong>Phone:</strong> +91 97888 39825 / +91 79046 99119', ta: '<strong>தொலைபேசி:</strong> +91 97888 39825 / +91 79046 99119' },
    'terms-s11-li2': { en: '<strong>Email:</strong> <a data-email data-email-text href="#">nmd@email.com</a>', ta: '<strong>மின்னஞ்சல்:</strong> <a data-email data-email-text href="#"></a>' },
    'terms-s11-li3': { en: '<strong>WhatsApp:</strong> <a href="https://wa.me/917904699119" target="_blank" rel="noopener">Chat with us on WhatsApp</a>', ta: '<strong>வாட்ஸ்அப்:</strong> <a href="https://wa.me/917904699119" target="_blank" rel="noopener">வாட்ஸ்அப்பில் பேசுங்கள்</a>' },
    'terms-s11-li4': { en: '<strong>Office:</strong> Tirunelveli, Tamil Nadu, India', ta: '<strong>அலுவலகம்:</strong> திருநெல்வேலி, தமிழ்நாடு, இந்தியா' },
    'terms-s11-li5': { en: '<strong>Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM IST', ta: '<strong>நேரம்:</strong> திங்கள் – சனி, காலை 9:00 – மாலை 6:00 IST' },
    'terms-disclaimer': { en: '<strong>*Disclaimer:</strong> Insurance policies are subject to the terms, conditions, and exclusions of the respective insurance companies. NMD Associates acts as an insurance advisory intermediary and does not underwrite insurance policies directly. All insurance products are subject to IRDAI regulations and the insurer\'s underwriting guidelines.', ta: '<strong>*மறுப்பு:</strong> காப்பீட்டு பாலிசிகள் சம்பந்தப்பட்ட காப்பீட்டு நிறுவனங்களின் விதிமுறைகள், நிபந்தனைகள் மற்றும் விலக்குகளுக்கு உட்பட்டவை. NMD Associates காப்பீட்டு ஆலோசனை இடைத்தரகராக செயல்படுகிறது, நேரடியாக காப்பீட்டு பாலிசிகளை எழுதுவதில்லை. அனைத்து காப்பீட்டு தயாரிப்புகளும் IRDAI விதிமுறைகள் மற்றும் காப்பீட்டாளரின் அண்டர்ரைட்டிங் வழிகாட்டுதல்களுக்கு உட்பட்டவை.' },

    // Privacy Policy body text
    'privacy-intro-p': { en: 'NMD Associates ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.', ta: 'NMD Associates ("நாங்கள்," "எங்கள்," அல்லது "எங்களை") உங்கள் தனியுரிமையை பாதுகாக்க உறுதிபூண்டுள்ளது. இந்த தனியுரிமைக் கொள்கை நீங்கள் எங்கள் வலைதளத்தை பார்வையிடும்போது அல்லது எங்கள் சேவைகளை பயன்படுத்தும்போது உங்கள் தகவல்களை நாங்கள் எவ்வாறு சேகரிக்கிறோம், பயன்படுத்துகிறோம், வெளிப்படுத்துகிறோம் மற்றும் பாதுகாக்கிறோம் என்பதை விளக்குகிறது.' },
    'privacy-collect-p': { en: 'We may collect information that you provide directly to us, including:', ta: 'நேரடியாக நீங்கள் வழங்கும் தகவல்களை நாங்கள் சேகரிக்கலாம், அவற்றில் அடங்குவன:' },
    'privacy-collect-li1': { en: 'Name, mobile number, and email address when you submit enquiry forms', ta: 'விசாரணை படிவங்களை சமர்பிக்கும்போது பெயர், மொபைல் எண் மற்றும் மின்னஞ்சல் முகவரி' },
    'privacy-collect-li2': { en: 'City and insurance type preference for consultation purposes', ta: 'ஆலோசனை நோக்கங்களுக்காக நகரம் மற்றும் காப்பீட்டு வகை விருப்பம்' },
    'privacy-collect-li3': { en: 'Messages and communication history for follow-up purposes', ta: 'தொடர்பு நோக்கங்களுக்காக செய்திகள் மற்றும் தொடர்பு வரலாறு' },
    'privacy-collect-li4': { en: 'Email address when you subscribe to our newsletter', ta: 'நியூஸ்லெட்டருக்கு சந்தா செலுத்தும்போது மின்னஞ்சல் முகவரி' },
    'privacy-use-p': { en: 'We use the information we collect to:', ta: 'நாங்கள் சேகரிக்கும் தகவல்களை பின்வரும் நோக்கங்களுக்கு பயன்படுத்துகிறோம்:' },
    'privacy-use-li1': { en: 'Respond to your enquiries and provide insurance consultation services', ta: 'உங்கள் விசாரணைகளுக்கு பதில் அளிக்கவும் காப்பீட்டு ஆலோசனை சேவைகள் வழங்கவும்' },
    'privacy-use-li2': { en: 'Send you insurance-related updates and educational content (with consent)', ta: 'காப்பீட்டு தொடர்பான புதுப்பிப்புகள் மற்றும் கல்வி உள்ளடக்கத்தை அனுப்பவும் (ஒப்புதலுடன்)' },
    'privacy-use-li3': { en: 'Improve our website and services', ta: 'எங்கள் வலைதளம் மற்றும் சேவைகளை மேம்படுத்தவும்' },
    'privacy-use-li4': { en: 'Comply with legal and regulatory obligations', ta: 'சட்டம் மற்றும் ஒழுங்குமுறை கடமைகளை நிறைவேற்றவும்' },
    'privacy-sharing-p': { en: 'We do not sell, trade, or rent your personal information to third parties. We may share your information only with:', ta: 'உங்கள் தனிப்பட்ட தகவல்களை மூன்றாம் தரப்பினருக்கு விற்பனை செய்வதோ, வர்த்தகம் செய்வதோ அல்லது வாடகைக்கு கொடுப்பதோ இல்லை. நாங்கள் உங்கள் தகவல்களை பின்வருவோருடன் மட்டுமே பகிரலாம்:' },
    'privacy-sharing-li1': { en: 'Insurance companies for the purpose of policy issuance (with your explicit consent)', ta: 'பாலிசி வழங்கல் நோக்கத்திற்காக காப்பீட்டு நிறுவனங்களுடன் (உங்கள் வெளிப்படையான ஒப்புதலுடன்)' },
    'privacy-sharing-li2': { en: 'Service providers who assist us in operating our website and services', ta: 'எங்கள் வலைதளம் மற்றும் சேவைகளை இயக்க உதவும் சேவை வழங்குநர்களுடன்' },
    'privacy-sharing-li3': { en: 'Regulatory authorities when required by law', ta: 'சட்டம் தேவைப்படும்போது ஒழுங்குமுறை அதிகாரிகளுடன்' },
    'privacy-security-p': { en: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.', ta: 'அங்கீகரிக்கப்படாத அணுகல், மாற்றம், வெளிப்படுத்தல் அல்லது அழிவிலிருந்து உங்கள் தனிப்பட்ட தகவல்களை பாதுகாக்க தகுந்த தொழில்நுட்ப மற்றும் நிறுவன நடவடிக்கைகளை நாங்கள் செயல்படுத்துகிறோம். இருப்பினும், எந்த இணைய பரிமாற்றமும் முற்றிலும் பாதுகாப்பானதல்ல, மேலும் நிரபாயமான பாதுகாப்பை நாங்கள் உத்தரவாதம் அளிக்க முடியாது.' },
    'privacy-cookies-p': { en: 'Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect some functionality of our website.', ta: 'உங்கள் உலாவல் அனுபவத்தை மேம்படுத்த எங்கள் வலைதளம் குக்கீகளை பயன்படுத்தலாம். உங்கள் உலாவி அமைப்புகள் மூலம் குக்கீகளை முடக்க தேர்வு செய்யலாம், இருப்பினும் இது எங்கள் வலைதளத்தின் சில செயல்பாடுகளை பாதிக்கலாம்.' },
    'privacy-thirdparty-p': { en: 'Our website may contain links to third-party websites, including insurance company websites and social media platforms. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.', ta: 'காப்பீட்டு நிறுவன வலைதளங்கள் மற்றும் சமூக ஊடக தளங்கள் உட்பட மூன்றாம் தரப்பு வலைதளங்களுக்கான இணைப்புகளை எங்கள் வலைதளம் கொண்டிருக்கலாம். இந்த வெளிப்புற தளங்களின் தனியுரிமை நடைமுறைகளுக்கு நாங்கள் பொறுப்பல்ல, மேலும் அவற்றின் தனியுரிமைக் கொள்கைகளை மதிப்பாய்வு செய்ய நாங்கள் உங்களை ஊக்குவிக்கிறோம்.' },
    'privacy-rights-p': { en: 'You have the right to:', ta: 'உங்களுக்கு பின்வரும் உரிமைகள் உள்ளன:' },
    'privacy-rights-li1': { en: 'Access the personal information we hold about you', ta: 'நாங்கள் வைத்திருக்கும் உங்கள் தனிப்பட்ட தகவல்களை அணுகும் உரிமை' },
    'privacy-rights-li2': { en: 'Request correction of inaccurate information', ta: 'தவறான தகவல்களை திருத்தும்படி கோரும் உரிமை' },
    'privacy-rights-li3': { en: 'Request deletion of your personal information', ta: 'உங்கள் தனிப்பட்ட தகவல்களை நீக்கும்படி கோரும் உரிமை' },
    'privacy-rights-li4': { en: 'Opt out of marketing communications at any time', ta: 'எந்த நேரத்திலும் சந்தைப்படுத்தல் தொடர்புகளிலிருந்து விலகும் உரிமை' },
    'privacy-children-p': { en: 'Our services are not directed at children under 18 years of age. We do not knowingly collect personal information from children.', ta: 'எங்கள் சேவைகள் 18 வயதுக்குட்பட்ட குழந்தைகளை நோக்கியவை அல்ல. குழந்தைகளிடமிருந்து தெரிந்தே தனிப்பட்ட தகவல்களை சேகரிப்பதில்லை.' },
    'privacy-changes-p': { en: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date.', ta: 'இந்த தனியுரிமைக் கொள்கையை நாங்கள் அவ்வப்போது புதுப்பிக்கலாம். புதுப்பிக்கப்பட்ட தேதியுடன் புதிய கொள்கையை இந்தப் பக்கத்தில் வெளியிடுவதன் மூலம் முக்கியமான மாற்றங்களை உங்களுக்கு தெரிவிப்போம்.' },
    'privacy-contact-p': { en: 'If you have questions about this Privacy Policy or how we handle your information, please contact us:', ta: 'இந்த தனியுரிமைக் கொள்கை அல்லது நாங்கள் உங்கள் தகவல்களை எவ்வாறு கையாள்கிறோம் என்று கேள்விகள் இருந்தால், தயவுசெய்து எங்களை தொடர்பு கொள்ளுங்கள்:' },
    'privacy-contact-li1': { en: 'Phone: +91 97888 39825 / +91 79046 99119', ta: 'தொலைபேசி: +91 97888 39825 / +91 79046 99119' },
    'privacy-contact-li2': { en: 'Email: <a data-email data-email-text href="#"></a>', ta: 'மின்னஞ்சல்: <a data-email data-email-text href="#"></a>' },
    'privacy-contact-li3': { en: 'WhatsApp: <a href="https://wa.me/917904699119" target="_blank" rel="noopener">Chat with us</a>', ta: 'வாட்ஸ்அப்: <a href="https://wa.me/917904699119" target="_blank" rel="noopener">எங்களிடம் பேசுங்கள்</a>' },
    'privacy-note': { en: '<strong>*Terms and Conditions Apply.</strong> Insurance policies are subject to the terms, conditions, and exclusions of the respective insurance companies. NMD Associates acts as an insurance advisory intermediary and does not underwrite insurance policies directly.', ta: '<strong>*விதிமுறைகள் மற்றும் நிபந்தனைகள் பொருந்தும்.</strong> காப்பீட்டு பாலிசிகள் சம்பந்தப்பட்ட காப்பீட்டு நிறுவனங்களின் விதிமுறைகள், நிபந்தனைகள் மற்றும் விலக்குகளுக்கு உட்பட்டவை. NMD Associates காப்பீட்டு ஆலோசனை இடைத்தரகராக செயல்படுகிறது, நேரடியாக காப்பீட்டு பாலிசிகளை எழுதுவதில்லை.' },
  };

  let currentLang = localStorage.getItem('nmd-lang') || 'en';

  function applyTranslation(lang) {
    currentLang = lang;
    localStorage.setItem('nmd-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const t = TRANSLATIONS[key];
      if (!t) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[lang] || el.placeholder;
      } else if (el.dataset.i18nHtml) {
        el.innerHTML = t[lang] || el.innerHTML;
      } else {
        el.textContent = t[lang] || el.textContent;
      }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTranslation(btn.dataset.lang));
  });

  // Apply saved language on load
  if (currentLang !== 'en') applyTranslation(currentLang);

});
