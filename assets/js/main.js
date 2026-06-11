/* Caruk Audit — main.js (Thermal Editorial) */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Current year ──────────────────────────────────────── */
  const yr = new Date().getFullYear();
  document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = yr);

  /* ── Header scroll state → thermal bar ─────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ────────────────────────────────────────── */
  const btn  = document.querySelector('.mobile-menu-btn');
  const nav  = document.querySelector('.nav-links');
  const iconOpen  = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  const iconClose = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  if (btn && nav) {
    btn.innerHTML = iconOpen;

    const closeMenu = () => {
      nav.classList.remove('active');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Otwórz menu');
      btn.innerHTML = iconOpen;
    };

    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('active');
      document.body.style.overflow = open ? 'hidden' : '';
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
      btn.innerHTML = open ? iconClose : iconOpen;
    });

    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ── Dropdown (mobile tap) ──────────────────────────────── */
  document.querySelectorAll('.dropdown-toggle').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = link.closest('.dropdown');
        const open = parent.classList.toggle('active');
        link.setAttribute('aria-expanded', open);
      }
    });
  });

  /* ── Reveal on scroll (IntersectionObserver) ────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      reveals.forEach(el => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
      reveals.forEach(el => io.observe(el));
    }
  }

  /* ── Count-up ───────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const runCount = el => {
      const target  = parseInt(el.dataset.count, 10);
      const suffix  = el.dataset.suffix || '';
      const dur     = 1600;
      const fps     = 60;
      const steps   = dur / (1000 / fps);
      let current   = 0;
      const inc     = target / steps;
      const tick = () => {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current) + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io2 = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCount(entry.target); io2.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });

    counters.forEach(el => io2.observe(el));
  }

  /* ── Contact form (Web3Forms) ───────────────────────────── */
  const form    = document.querySelector('.js-contact-form');
  if (form) {
    const submitBtn  = form.querySelector('[type="submit"]');
    const successMsg = form.querySelector('.form-success');
    const origLabel  = submitBtn ? submitBtn.textContent : 'Wyślij';

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Wysyłam…'; }

      try {
        const resp = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const data = await resp.json();

        if (data.success) {
          form.reset();
          if (submitBtn)  submitBtn.style.display = 'none';
          if (successMsg) successMsg.style.display = 'flex';
        } else {
          throw new Error('error');
        }
      } catch {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origLabel; }
        alert('Coś poszło nie tak. Zadzwoń bezpośrednio: 505-705-131');
      }
    });
  }
});
