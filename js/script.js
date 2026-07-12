/* ==========================================================
   Basudeb Nayak — Portfolio
   script.js — interactivity (shared across all pages)
   ========================================================== */

/* ---------------- PROJECT DATA (used by modal on any page) ---------------- */
const PROJECTS = {
  'neon-runner': {
    name: 'Neon Runner',
    image: 'images/project1.png',
    video: '', // paste a YouTube embed URL here, e.g. https://www.youtube.com/embed/VIDEO_ID
    tags: ['games'],
    tech: ['Unreal Engine 5', 'Blueprint', 'C++'],
    short: 'An endless runner prototype built in Unreal Engine 5, focused on fast, responsive movement.',
    about: 'Neon Runner is a fast-paced endless runner prototype built in Unreal Engine 5. The goal was to explore procedural level generation and see how far I could push tight, responsive controls in a 3D runner.',
    problem: 'Endless runners live or die on how the level streams in and how the controls feel. I needed a system that could generate track segments on the fly without hitching, and input handling tight enough that dying always felt like the player\'s fault, not the game\'s.',
    features: [
      'Procedural track segment streaming with object pooling',
      'Custom input buffering for jump and slide',
      'Difficulty ramp that reacts to player performance',
      'Simple scoring and combo system'
    ],
    challenges: 'The hardest part was keeping frame time stable while streaming new segments — early versions had visible hitches every time a new chunk loaded. I solved it by pre-warming segment pools a few chunks ahead instead of instantiating on demand.',
    journey: 'This was one of my first deeper dives into Blueprint + C++ together — starting from a rough grey-box prototype and iterating on feel for several weeks before adding art and lighting.',
    github: 'https://github.com/yourusername',
    demo: '#'
  },
  'portfolio-site': {
    name: 'Developer Portfolio',
    image: 'images/project2.png',
    video: '',
    tags: ['web', 'javascript'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    short: 'A responsive personal portfolio with dark/light themes and scroll-based interactions.',
    about: 'This very site — a responsive personal portfolio built from scratch with plain HTML, CSS and JavaScript, no frameworks or build tools.',
    problem: 'I wanted a fast, dependency-free site I could fully understand and customize, that still felt polished: smooth animations, a real dark/light theme, and a clean way to showcase projects.',
    features: [
      'Dark / light theme toggle saved to localStorage',
      'Typing animation, scroll reveals and animated skill indicators',
      'Project filter system and a details modal',
      'Fully responsive layout with a mobile menu'
    ],
    challenges: 'Keeping the JavaScript framework-free while still feeling smooth took some care — especially the scroll-driven animations, which needed IntersectionObserver rather than scroll-event listeners to stay performant.',
    journey: 'Built iteratively: static structure first, then layered on theme support, then animation and interaction passes.',
    github: 'https://github.com/yourusername',
    demo: '#'
  },
  'dungeon-blueprint': {
    name: 'Dungeon Blueprint Kit',
    image: 'images/project3.png',
    video: '',
    tags: ['games'],
    tech: ['Unreal Engine 5', 'Blueprint', 'Lighting'],
    short: 'A modular dungeon-generation Blueprint system for quickly assembling levels.',
    about: 'A modular dungeon-generation kit built entirely in Blueprint, letting a designer snap together rooms, corridors and lighting presets to block out a playable dungeon in minutes.',
    problem: 'Hand-placing every room and light for level prototypes was slow and made it hard to iterate on layout ideas. I wanted a kit that turned level layout into an assembly problem instead of a modeling one.',
    features: [
      'Snap-to-grid modular room and corridor pieces',
      'One-click lighting presets (torch-lit, moonlit, eerie)',
      'Randomized dungeon layout generator for quick blockouts',
      'Reusable across multiple prototype projects'
    ],
    challenges: 'Getting the lighting presets to look good across very different room shapes took a lot of trial and error — I ended up building relative light-placement rules instead of fixed positions.',
    journey: 'Started as a personal tool to speed up my own prototyping, then grew into a small reusable kit I now drop into every new level design project.',
    github: 'https://github.com/yourusername',
    demo: '#'
  }
};

document.addEventListener('DOMContentLoaded', () => {

  
  
  /* ---------------- LOADING SCREEN ---------------- 
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 900);
    });
  }
  */

  /* ---------------- LOADING SCREEN (shows once per visit/session) ---------------- */
  const loader = document.getElementById('loader');
  if (loader) {
    if (sessionStorage.getItem('loaderShown')) {
      // Already shown once this session — skip it instantly, no animation.
      loader.classList.add('hidden');
      loader.style.transition = 'none';
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('hidden');
          sessionStorage.setItem('loaderShown', 'true');
        }, 900);
      });
    }
  }

  /* ---------------- YEAR IN FOOTER ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- THEME TOGGLE ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function applyIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    icon.className = current === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') root.setAttribute('data-theme', 'light');
  applyIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      if (next === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        root.removeAttribute('data-theme');
      }
      applyIcon();
      localStorage.setItem('portfolio-theme', next);
      document.dispatchEvent(new CustomEvent('themechange'));
    });
  }

  /* ---------------- MOBILE HAMBURGER MENU ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navRight = document.getElementById('navRight');

  if (hamburger && navRight) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navRight.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navRight.classList.remove('open');
      });
    });
  }

  /* ---------------- ACTIVE NAV HIGHLIGHT (per current page) ---------------- */
  const navItems = document.querySelectorAll('.nav-link');
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html');

  navItems.forEach(item => {
    const href = item.getAttribute('href').split('#')[0] || 'index.html';
    const isHome = (currentPage === '' || currentPage === 'index.html') && (href === 'index.html' || href === '');
    if (href === currentPage || isHome) {
      item.classList.add('active');
    }
  });

  /* ---------------- SCROLL PROGRESS BAR ---------------- */
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }

  /* ---------------- BACK TO TOP BUTTON (shows as soon as scroll starts) ---------------- */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 80);
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    toggleBackToTop();
  });
  updateScrollProgress();
  toggleBackToTop();

  /* ---------------- TYPING ANIMATION ---------------- */
  const typedTextEl = document.getElementById('typedText');
  if (typedTextEl) {
    const roles = ['Game Developer', 'Game Designer', 'Unreal Engine 5 Enthusiast'];
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedTextEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typedTextEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 80);
    }
    typeLoop();
  }

  /* ---------------- SCROLL REVEAL ANIMATION ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- ANIMATED COUNTERS ---------------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let count = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const tick = () => {
          count += step;
          if (count >= target) {
            el.textContent = target;
          } else {
            el.textContent = count;
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------- ANIMATED SKILL BARS ---------------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.width}%`;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(el => skillObserver.observe(el));

  /* ---------------- CIRCULAR SKILL INDICATORS ---------------- */
  const circleSkills = document.querySelectorAll('.circle-skill');
  const CIRCUMFERENCE = 2 * Math.PI * 42;

  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const percent = parseInt(el.dataset.percent, 10);
        const fg = el.querySelector('.fg');
        const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
        fg.style.strokeDashoffset = offset;
        circleObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  circleSkills.forEach(el => circleObserver.observe(el));

  /* ---------------- PROJECT FILTER ---------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const categories = (card.dataset.category || '').split(' ');
        const show = filter === 'all' || categories.includes(filter);
        card.classList.toggle('hide', !show);
      });
    });
  });

  /* ---------------- PROJECT MODAL ---------------- */
  const modalOverlay = document.getElementById('projectModal');

  function openProjectModal(id) {
    const data = PROJECTS[id];
    if (!data || !modalOverlay) return;

    const media = modalOverlay.querySelector('.modal-media');
    media.innerHTML = data.video
      ? `<iframe src="${data.video}" title="${data.name} gameplay trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
      : `<img src="${data.image}" alt="${data.name} screenshot">`;

    modalOverlay.querySelector('.modal-title').textContent = data.name;
    modalOverlay.querySelector('.modal-tags').innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');
    modalOverlay.querySelector('.modal-about').textContent = data.about;
    modalOverlay.querySelector('.modal-problem').textContent = data.problem;
    modalOverlay.querySelector('.modal-features').innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
    modalOverlay.querySelector('.modal-challenges').textContent = data.challenges;
    modalOverlay.querySelector('.modal-journey').textContent = data.journey;
    modalOverlay.querySelector('.modal-github').href = data.github;
    modalOverlay.querySelector('.modal-demo').href = data.demo;

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      const media = modalOverlay.querySelector('.modal-media');
      if (media) media.innerHTML = '';
    }, 350);
  }

  if (modalOverlay) {
    document.querySelectorAll('[data-project]').forEach(card => {
      card.addEventListener('click', () => openProjectModal(card.dataset.project));
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openProjectModal(card.dataset.project);
      });
    });

    modalOverlay.querySelector('.modal-close').addEventListener('click', closeProjectModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeProjectModal();
    });
  }

  /* ---------------- CONTACT FORM (front-end only demo) ---------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formNote.textContent = 'Message ready — connect a backend or form service (e.g. Formspree) to deliver it.';
      contactForm.reset();
    });
  }

  /* ---------------- PARTICLE BACKGROUND (canvas) ---------------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    }

    function currentPalette() {
      const isLight = root.getAttribute('data-theme') === 'light';
      return isLight
        ? ['232,103,42', '105,71,224']   // amber, violet (light theme)
        : ['255,138,61', '139,108,255']; // amber, violet (dark theme)
    }

    function initParticles() {
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 34000));
      const palette = currentPalette();
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.5,
        dx: (Math.random() - 0.5) * 0.22,
        dy: (Math.random() - 0.5) * 0.22,
        color: palette[Math.random() > 0.5 ? 0 : 1]
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, 0.45)`;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      resizeCanvas();
      initParticles();
      drawParticles();

      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          resizeCanvas();
          initParticles();
        }, 250);
      });

      document.addEventListener('themechange', initParticles);
    }
  }

});
