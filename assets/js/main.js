document.addEventListener('DOMContentLoaded', function () {
  var parts = ['nmdassociates', '.', 'insurancebanking', '@', 'gmail', '.', 'com'];
  var E = parts.join('');
  document.querySelectorAll('[data-email]').forEach(function(el) {
    if (el.tagName.toLowerCase() === 'a') { el.href = 'mailto:' + E; }
    if (el.hasAttribute('data-email-text')) { el.textContent = E; }
  });
  var toggle = document.querySelector('.nav-toggle');
  var navUl = document.querySelector('.nav-ul');
  if (toggle && navUl) {
    toggle.addEventListener('click', function() { navUl.classList.toggle('open'); });
    document.querySelectorAll('.nav-ul a').forEach(function(a) {
      a.addEventListener('click', function() { if (window.innerWidth <= 768) navUl.classList.remove('open'); });
    });
  }
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-ul a').forEach(function(a) {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
  });
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isPhone(v) { return /^[\d\s\-\+\(\)]{10,15}$/.test(v); }
  function validateForm(form) {
    var ok = true;
    form.querySelectorAll('input[required],textarea[required],select[required]').forEach(function(inp) {
      var err = inp.parentElement.querySelector('.field-err');
      if (!err) {
        err = document.createElement('span'); err.className = 'field-err';
        err.style.cssText = 'color:#ef4444;font-size:0.78rem;margin-top:0.25rem;display:block;';
        inp.parentElement.appendChild(err);
      }
      if (!inp.value.trim()) { err.textContent='Required.'; inp.style.borderColor='#ef4444'; ok=false; }
      else if (inp.type==='email' && !isEmail(inp.value)) { err.textContent='Valid email required.'; inp.style.borderColor='#ef4444'; ok=false; }
      else if (inp.type==='tel' && !isPhone(inp.value)) { err.textContent='Valid phone required.'; inp.style.borderColor='#ef4444'; ok=false; }
      else { err.textContent=''; inp.style.borderColor=''; }
    });
    return ok;
  }
  document.querySelectorAll('.sub-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); e.stopPropagation();
      var inp=form.querySelector('input[type="email"]'), btn=form.querySelector('button');
      if (!inp||!btn) return;
      if (isEmail(inp.value.trim())) {
        var orig=btn.textContent;
        btn.textContent='\u2713 Subscribed!'; btn.style.background='#10b981'; btn.disabled=true;
        inp.value=''; inp.style.borderColor='';
        setTimeout(function(){ btn.textContent=orig; btn.style.background=''; btn.disabled=false; },3000);
      } else {
        inp.style.borderColor='#ef4444';
        var ph=inp.placeholder; inp.placeholder='Enter a valid email';
        setTimeout(function(){ inp.style.borderColor=''; inp.placeholder=ph; },3000);
      }
    });
  });
  var cf = document.getElementById('contact-form');
  if (cf) {
    cf.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateForm(cf)) {
        var btn=cf.querySelector('[type="submit"]'), orig=btn?btn.textContent:'';
        if (btn){ btn.textContent='\u2713 Sent!'; btn.style.background='#10b981'; btn.disabled=true; }
        cf.reset();
        cf.querySelectorAll('.field-err').forEach(function(s){ s.textContent=''; });
        setTimeout(function(){ if(btn){ btn.textContent=orig; btn.style.background=''; btn.disabled=false; } },3500);
      }
    });
  }
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.style.opacity='1'; en.target.style.transform='translateY(0)'; } });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.service-card,.feat-card,.cc,.vid-card').forEach(function(el){
    el.style.cssText+='opacity:0;transform:translateY(18px);transition:opacity 0.55s ease,transform 0.55s ease;';
    obs.observe(el);
  });
});
