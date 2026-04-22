// script.js
document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle.querySelector('.material-icons');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', function () {
    const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => (themeToggle.style.transform = 'rotate(0deg)'), 300);
  });

  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  // ============================================================
  // MOBILE NAV
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(link =>
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    })
  );

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor =>
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    })
  );

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    const dark = body.getAttribute('data-theme') === 'dark';
    const scrolled = window.scrollY > 100;
    navbar.style.background = scrolled
      ? (dark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.98)')
      : (dark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)');
    navbar.classList.toggle('scrolled', scrolled);
  });

  // ============================================================
  // ACTIVE NAV HIGHLIGHT
  // ============================================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function setActiveNavByPath() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) {
        link.classList.toggle('active', href === path);
      }
    });
  }

  setActiveNavByPath();

  window.addEventListener('scroll', () => {
    const hasHashLinks = [...navLinks].some(link => (link.getAttribute('href') || '').startsWith('#'));
    if (!hasHashLinks) return;

    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        link.classList.toggle('active', href === `#${current}`);
      }
    });
  });

  // ============================================================
  // ★ SCROLL REVEAL SYSTEM
  // Attribute: data-reveal="fade-up|fade-left|fade-right|zoom|flip"
  // Attribute: data-delay="150"  (ms, optional)
  // ============================================================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('reveal-visible'), delay);
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  function registerRevealEls() {
    document.querySelectorAll('[data-reveal]:not(.reveal-registered)').forEach(el => {
      el.classList.add('reveal-hidden', 'reveal-registered');
      revealObserver.observe(el);
    });
  }
  registerRevealEls();

  // ============================================================
  // LEGACY FADE-IN (for dynamically added cards)
  // ============================================================
  const fadeObserver = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  function initLegacyFadeIn() {
    document.querySelectorAll('.fade-in:not(.fade-registered)').forEach((el, i) => {
      el.classList.add('fade-registered');
      el.style.transitionDelay = `${i * 0.07}s`;
      fadeObserver.observe(el);
    });
  }
  initLegacyFadeIn();

  // ============================================================
  // HERO TYPEWRITER
  // ============================================================
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    let i = 0;
    const type = () => { if (i < text.length) { heroTitle.innerHTML += text.charAt(i++); setTimeout(type, 48); } };
    setTimeout(type, 800);
  }

  // ============================================================
  // HERO PARALLAX
  // ============================================================
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const visual = hero.querySelector('.hero-visual');
      if (visual) visual.style.transform = `translateY(${window.pageYOffset * 0.4}px)`;
    });
  }

  // ============================================================
  // STAT COUNTER ANIMATION
  // ============================================================
  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const h3 = entry.target;
        if (h3.dataset.counted) return;
        const raw = h3.textContent.trim();
        const num = parseInt(raw, 10);
        if (Number.isNaN(num)) return;
        h3.dataset.counted = '1';
        const suffix = raw.replace(String(num), '');
        let start = null;
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1200, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          h3.textContent = Math.floor(eased * num) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 }).observe(statsSection);
  }

  // ============================================================
  // TILT EFFECT ON PROJECT CARDS (subtle 3D)
  // ============================================================
  document.querySelectorAll('.project-card.featured-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });

  // Standard hover for auto + cert cards
  document.querySelectorAll('.project-card:not(.featured-card), .certificate-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px) scale(1.01)');
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // ============================================================
  // SKILL TAG HOVER
  // ============================================================
  document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => tag.style.transform = 'scale(1.1) rotate(4deg)');
    tag.addEventListener('mouseleave', () => tag.style.transform = '');
  });

  // ============================================================
  // ★ SMART GITHUB PROJECT LOADER
  // ============================================================
  async function loadProjects() {
    const container = document.getElementById('auto-projects-container');
    if (!container) return;

    container.innerHTML = Array(3).fill(`
      <div class="project-card skeleton-card">
        <div class="skeleton skeleton-icon"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
        <div class="skeleton skeleton-tags"></div>
      </div>`).join('');

    try {
      const res = await fetch(
        'https://api.github.com/users/aswin-m-kumar/repos?per_page=100',
        { headers: { Accept: 'application/vnd.github.mercy-preview+json' } }
      );
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      let repos = await res.json();

      repos = repos.filter(r =>
        !r.fork && r.description?.trim() && !r.name.includes('.github.io')
      );
      repos.sort((a, b) =>
        b.stargazers_count - a.stargazers_count ||
        new Date(b.updated_at) - new Date(a.updated_at)
      );

      container.innerHTML = '';
      const top = repos.slice(0, 6);

      if (!top.length) {
        container.innerHTML = `
          <div class="no-projects-msg">
            <span class="material-icons">info</span>
            <p>No public repos with descriptions found. Add descriptions on GitHub to show them here!</p>
          </div>`;
        return;
      }

      top.forEach((repo, idx) => {
        const card = document.createElement('div');
        card.className = 'project-card auto-project-card';
        card.setAttribute('data-reveal', 'fade-up');
        card.setAttribute('data-delay', String(idx * 90));
        // Store topics + language for client-side filtering
        card.dataset.topics = (repo.topics || []).join(',').toLowerCase();
        card.dataset.lang   = (repo.language || '').toLowerCase();

        const lang = getLangColor(repo.language);
        const date = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const topicsHTML = (repo.topics || []).slice(0, 3)
          .map(t => `<span class="tag topic-tag">${t}</span>`).join('');

        card.innerHTML = `
          <div class="project-icon" style="background:${lang.bg}">
            <span class="material-icons" style="color:${lang.icon}">code</span>
          </div>
          <h3>${fmtName(repo.name)}</h3>
          <p>${repo.description}</p>
          <div class="project-meta-row">
            ${repo.language ? `<span class="meta-badge"><span class="lang-dot" style="background:${lang.dot}"></span>${repo.language}</span>` : ''}
            ${repo.stargazers_count > 0 ? `<span class="meta-badge"><span class="material-icons" style="font-size:.9rem">star</span>${repo.stargazers_count}</span>` : ''}
            <span class="meta-badge"><span class="material-icons" style="font-size:.9rem">schedule</span>${date}</span>
          </div>
          <div class="project-tags">${topicsHTML}</div>
          <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-secondary project-btn">
            <span class="material-icons">open_in_new</span> View on GitHub
          </a>`;

        container.appendChild(card);
      });

      registerRevealEls();
      initLegacyFadeIn();

    } catch (err) {
      console.error('GitHub load failed:', err);
      container.innerHTML = `
        <div class="no-projects-msg">
          <span class="material-icons">wifi_off</span>
          <p>Couldn't load projects. <a href="https://github.com/aswin-m-kumar" target="_blank">View on GitHub →</a></p>
        </div>`;
    }
  }

  function fmtName(n) {
    return n.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  function getLangColor(lang) {
    const m = {
      Python:     { bg: 'linear-gradient(135deg,#3572A5,#1e4d6b)', icon: '#fff', dot: '#3572A5' },
      JavaScript: { bg: 'linear-gradient(135deg,#f1e05a,#b8a800)', icon: '#1a1a1a', dot: '#f1e05a' },
      HTML:       { bg: 'linear-gradient(135deg,#e34c26,#a0311a)', icon: '#fff', dot: '#e34c26' },
      CSS:        { bg: 'linear-gradient(135deg,#563d7c,#3a2752)', icon: '#fff', dot: '#563d7c' },
      C:          { bg: 'linear-gradient(135deg,#555,#333)', icon: '#fff', dot: '#555' },
      'C++':      { bg: 'linear-gradient(135deg,#f34b7d,#a0183f)', icon: '#fff', dot: '#f34b7d' },
      Dart:       { bg: 'linear-gradient(135deg,#00B4AB,#006b67)', icon: '#fff', dot: '#00B4AB' },
      default:    { bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)', icon: '#fff', dot: '#6366f1' },
    };
    return m[lang] || m.default;
  }

  loadProjects().then(() => initTopicFilter());

  // ============================================================
  // ★ TOPIC TAG FILTER
  // ============================================================
  const FILTER_MAP = {
    ai:       ['ai', 'ml', 'machine-learning', 'deep-learning', 'computer-vision', 'nlp', 'tensorflow', 'pytorch'],
    iot:      ['iot', 'esp32', 'arduino', 'raspberry-pi', 'sensors', 'mqtt'],
    embedded: ['embedded', 'embedded-systems', 'firmware', 'rtos', 'stm32', 'microcontroller', 'c', 'arm'],
    flutter:  ['flutter', 'dart', 'mobile', 'android', 'ios', 'app'],
    web:      ['web', 'html', 'css', 'javascript', 'react', 'nodejs', 'frontend'],
  };

  function initTopicFilter() {
    const btns = document.querySelectorAll('.topic-filter-btn');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProjects(btn.dataset.filter);
      });
    });
  }

  function filterProjects(filter) {
    const cards = document.querySelectorAll('#auto-projects-container .auto-project-card');
    const allowed = filter === 'all' ? null : (FILTER_MAP[filter] || []);
    cards.forEach(card => {
      if (!allowed) { card.style.display = ''; return; }
      const topics = (card.dataset.topics || '').toLowerCase().split(',');
      const lang   = (card.dataset.lang   || '').toLowerCase();
      card.style.display = allowed.some(kw => topics.includes(kw) || lang.includes(kw)) ? '' : 'none';
    });
    const container = document.getElementById('auto-projects-container');
    const existing  = container.querySelector('.filter-empty');
    if (existing) existing.remove();
    const visible = [...cards].filter(c => c.style.display !== 'none');
    if (visible.length === 0 && filter !== 'all') {
      const msg = document.createElement('div');
      msg.className = 'filter-empty no-projects-msg';
      msg.innerHTML = `<span class="material-icons">filter_list_off</span>
        <p>No repos tagged <strong>${filter}</strong> yet.
        <a href="https://github.com/aswin-m-kumar" target="_blank">Add topics on GitHub →</a></p>`;
      container.appendChild(msg);
    }
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('contactSubmitBtn');
  const formResp    = document.getElementById('form-response');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const fd = new FormData(contactForm);
      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending…';
      submitBtn.disabled = true;
      try {
        const r = await fetch(contactForm.action, {
          method: 'POST', body: fd, headers: { Accept: 'application/json' },
        });
        if (!r.ok) throw new Error('Formspree failed');
        let msg = "Thank you! I'll get back to you soon.";
        formResp.textContent = `✨ ${msg}`;
        formResp.className = 'form-response success';
        formResp.style.display = 'block';
        submitBtn.innerHTML = 'Message Sent!';
        contactForm.reset();
      } catch {
        formResp.textContent = 'Sorry, there was an error. Please try again.';
        formResp.className = 'form-response error';
        formResp.style.display = 'block';
      } finally {
        setTimeout(() => { submitBtn.innerHTML = orig; submitBtn.disabled = false; formResp.style.display = 'none'; }, 5000);
      }
    });
  }

  window.addEventListener('load', () => body.classList.add('loaded'));
});