/**
 * ORCHARD CLIENT — Interactive Scripts & Cosmic Particle Engine
 * Features:
 * - Dynamic 3D-depth galaxy starfield canvas
 * - Scroll-aware sticky navigation with active link tracking
 * - Smooth FAQ accordion with keyboard accessibility
 * - Video showcase preview & modal player
 * - Smooth scroll anchor handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalaxyCanvas();
  initNavbar();
  initFaqAccordion();
  initShowcaseVideos();
  initSmoothScroll();
});

/* ==========================================================================
   1. GALAXY PARTICLES & STARFIELD ENGINE
   ========================================================================== */
function initGalaxyCanvas() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const starCount = Math.floor((width * height) / 3800);
  const stars = [];

  // Star creation
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.25 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      color: getRandomStarColor(),
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  function getRandomStarColor() {
    const colors = [
      'rgba(255, 255, 255,',     // White
      'rgba(186, 230, 253,',     // Ice blue
      'rgba(56, 189, 248,',      // Cyan glow
      'rgba(96, 165, 250,',      // Electric blue
      'rgba(192, 132, 252,'      // Cosmic violet
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Shooting stars
  const shootingStars = [];
  function createShootingStar() {
    shootingStars.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.5),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 10 + 12,
      angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
      opacity: 1
    });
  }

  setInterval(() => {
    if (Math.random() > 0.45 && shootingStars.length < 3) {
      createShootingStar();
    }
  }, 3200);

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Animation Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw Stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      // Twinkle calculation
      star.alpha += star.twinkleSpeed * star.direction;
      if (star.alpha >= 1) {
        star.alpha = 1;
        star.direction = -1;
      } else if (star.alpha <= 0.15) {
        star.alpha = 0.15;
        star.direction = 1;
      }

      // Drift upward slowly
      star.y -= star.speed;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `${star.color} ${star.alpha})`;
      ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
      ctx.fill();
    }

    // Draw Shooting Stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const endX = s.x - Math.cos(s.angle) * s.length;
      const endY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
      grad.addColorStop(0.3, `rgba(0, 240, 255, ${s.opacity * 0.8})`);
      grad.addColorStop(1, 'rgba(0, 102, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.025;

      if (s.opacity <= 0 || s.x > width || s.y > height) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   2. NAVBAR & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll listener for sticky styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   3. FAQ ACCORDION COMPONENT
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isAlreadyOpen = item.classList.contains('open');

      // Close other accordions for sleek singular focus
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question-btn');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isAlreadyOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   4. SHOWCASE VIDEO PREVIEWS & MODAL
   ========================================================================== */
function initShowcaseVideos() {
  const cards = document.querySelectorAll('.showcase-card');
  const modal = document.getElementById('video-modal');
  const modalIframe = document.getElementById('modal-video-iframe');
  const modalClose = document.getElementById('modal-close-btn');

  cards.forEach((card) => {
    const thumbWrap = card.querySelector('.video-thumbnail-wrap');
    const playBtn = card.querySelector('.video-play-btn');
    const videoUrl = card.getAttribute('data-video-url');

    const triggerPlay = () => {
      if (!videoUrl || videoUrl.includes('placeholder')) {
        // If placeholder URL, display a smooth simulated preview or alert modal
        openVideoModal('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1');
      } else {
        openVideoModal(videoUrl);
      }
    };

    if (thumbWrap) thumbWrap.addEventListener('click', triggerPlay);
    if (playBtn) playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerPlay();
    });
  });

  function openVideoModal(url) {
    if (!modal || !modalIframe) return;
    modalIframe.src = url;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!modal || !modalIframe) return;
    modal.classList.remove('active');
    modalIframe.src = '';
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeVideoModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVideoModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeVideoModal();
    }
  });
}

/* ==========================================================================
   5. SMOOTH SCROLLING FOR INTERNAL LINKS
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
