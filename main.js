// ============ LUMEN EDU — shared interactions ============

document.addEventListener('DOMContentLoaded', () => {

  /* ---- nav scroll state ---- */
  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  /* ---- cursor glow (desktop only) ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  }

  /* ---- scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- destinations tabs ---- */
  const tabs = document.querySelectorAll('.dest-tab');
  const panels = document.querySelectorAll('.dest-panel');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(target)?.classList.add('active');
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---- consultation form ---- */
  const form = document.getElementById('consult-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // NOTE for Lumen Edu team: this currently only simulates a submission.
      // Wire this block up to your Telegram bot endpoint (POST name/phone/email/comment)
      // once the bot token & chat id are ready.
      const data = Object.fromEntries(new FormData(form).entries());
      console.log('Consultation request (placeholder — connect to Telegram bot):', data);
      form.style.display = 'none';
      document.getElementById('form-success')?.classList.add('show');
    });
  }

  /* ---- active nav link by page ---- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
});
