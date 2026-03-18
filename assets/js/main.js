// NMD Associates – main.js

document.addEventListener('DOMContentLoaded', () => {

  // ── Email obfuscation ──
  const EMAIL = 'nmdassociates' + '@' + 'gmail.com';
  document.querySelectorAll('[data-email]').forEach(el => {
    if (el.hasAttribute('data-email-text')) {
      el.textContent = EMAIL;
    }
    if (el.tagName === 'A') el.href = 'mailto:' + EMAIL;
  });

  // ── Mobile nav toggle ──
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // ── Scroll fade-up animation ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Progress bar animation ──
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    const progObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            progressFill.style.width = '0.126%';
            // Actually show a visible bar (126 out of 100000)
            progressFill.style.width = 'calc(0.126% + 24px)';
          }, 300);
          progObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    progObserver.observe(progressFill);
  }

  // ── Counter animation ──
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const startVal = 0;
    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * ease);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  // ── Header scroll shadow ──
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.style.boxShadow = '0 4px 32px rgba(2,18,65,0.25)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });

});
