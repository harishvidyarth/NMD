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

  // ── Toast notification ──
  function showToast(title, message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <div class="toast-icon ${type}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="toast-text">
          <strong></strong>
          <span></span>
        </div>`;
      document.body.appendChild(toast);
    }
    toast.querySelector('strong').textContent = title;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ── Lead / Contact form submission (EmailJS or fallback) ──
  function handleFormSubmit(form, successMsg) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], .form-submit, .contact-submit');
      const originalText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

      const data = Object.fromEntries(new FormData(form));

      // Build mailto fallback (always works without backend)
      const subject = encodeURIComponent('NMD Associates – Website Inquiry');
      const body = encodeURIComponent(
        Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n')
      );
      const mailtoLink = `mailto:nmdassociates@gmail.com?subject=${subject}&body=${body}`;

      // Try to open mail client after a short delay
      setTimeout(() => {
        window.location.href = mailtoLink;
        showToast('Message Sent', successMsg);
        form.reset();
        if (btn) { btn.textContent = originalText; btn.disabled = false; }
      }, 600);
    });
  }

  document.querySelectorAll('.lead-form, #contactForm').forEach(form => {
    const msg = form.classList.contains('lead-form')
      ? 'We will call you within 24 hours.'
      : 'Our team will respond shortly.';
    handleFormSubmit(form, msg);
  });

  // ── Subscribe form ──
  document.querySelectorAll('.sub-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input ? input.value : '';
      if (!email) return;

      const btn = form.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      btn.style.background = '#1a7a4a';
      btn.style.color = '#fff';

      showToast('Subscribed', `${email} has been added to our list.`);
      form.reset();

      // Open mailto so subscriber list gets captured
      window.location.href = `mailto:nmdassociates@gmail.com?subject=${encodeURIComponent('New Newsletter Subscription')}&body=${encodeURIComponent('New subscriber: ' + email)}`;

      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 5000);
    });
  });

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
