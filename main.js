/* ============================
   GORN.IMPORT — Main JS
   ============================ */

(function () {
  'use strict';

  /* ===== PAGE REVEAL ===== */
  const pageReveal = document.querySelector('.page-reveal');
  if (pageReveal) {
    // Inject logo into preloader
    pageReveal.innerHTML = '<div class="page-reveal__logo">GORN<span>.</span>IMPORT</div>';
    requestAnimationFrame(() => {
      setTimeout(() => {
        pageReveal.classList.add('done');
        pageReveal.addEventListener('transitionend', () => {
          pageReveal.remove();
          initHeroAnims();
        }, { once: true });
      }, 500);
    });
  } else {
    initHeroAnims();
  }

  /* ===== CUSTOM CURSOR (desktop only) ===== */
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (cursor) cursor.style.display = isTouchDevice ? 'none' : '';
  if (follower) follower.style.display = isTouchDevice ? 'none' : '';
  if (!cursor || !follower || isTouchDevice) {
    // skip cursor init but continue rest of JS
  } else {

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let fx = mx, fy = my;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

  (function animateFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  const hoverEls = document.querySelectorAll('a, button, .btn, .benefit-card, .service-item, .faq__question, .service-card, .tilt-card, input, textarea, select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });

  } // end cursor else

  /* ===== NAV SCROLL ===== */
  const nav = document.getElementById('nav');
  if (nav) {
    const isDark = nav.classList.contains('nav--dark');
    const onScroll = () => {
      const scrolled = window.scrollY > 60;
      nav.classList.toggle('scrolled', scrolled);
      if (isDark && scrolled) {
        // Switch nav links to dark text when scrolled on dark nav
        nav.querySelectorAll('.nav__links a').forEach(a => {
          a.style.color = scrolled ? '' : '';
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===== MOBILE MENU ===== */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
      const tgFloat = document.querySelector('.tg-float');
      if (tgFloat) tgFloat.style.display = mobileMenu.classList.contains('open') ? 'none' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
        if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('http')) {
          e.preventDefault();
          setTimeout(() => { window.location.href = href; }, 50);
        }
      });
    });
  }

  /* ===== REVEAL ANIMATIONS ===== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-word').forEach(el => {
    revealObserver.observe(el);
  });

  /* ===== HERO ANIMATIONS (run after page reveal) ===== */
  function initHeroAnims() {
    const words = document.querySelectorAll('.hero .reveal-word, .page-hero .reveal-word');
    const upEls = document.querySelectorAll('.hero .reveal-up, .page-hero .reveal-up');

    words.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 130);
    });
    upEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 150 + i * 160);
    });
  }

  /* ===== COUNTERS ===== */
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2200;
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ===== 3D TILT ===== */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -5;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * 5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ===== MARQUEE CLONE ===== */
  document.querySelectorAll('.marquee__content').forEach(el => {
    const clone = el.cloneNode(true);
    el.parentNode.appendChild(clone);
  });

  /* ===== FAQ ACCORDION ===== */
  document.querySelectorAll('.faq__question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const answer = item.querySelector('.faq__answer');
      const wasOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq__item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq__answer').style.maxHeight = '0';
      });

      if (!wasOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ===== PAGE TRANSITIONS (desktop only) ===== */
  if (!isTouchDevice) document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'fixed', inset: '0', background: '#0D2137',
        zIndex: '8000', transform: 'scaleY(0)', transformOrigin: 'bottom',
        transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)'
      });
      document.body.appendChild(overlay);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.transform = 'scaleY(1)';
          setTimeout(() => { window.location.href = href; }, 550);
        });
      });
    });
  });

  /* ===== EXPANDABLE SERVICE CARDS ===== */
  document.querySelectorAll('.service-card__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.service-card--expandable');
      const isOpen = card.classList.contains('service-card--open');

      // Close all
      document.querySelectorAll('.service-card--expandable.service-card--open').forEach(c => {
        c.classList.remove('service-card--open');
        c.querySelector('.service-card__toggle-text').textContent = 'Подробнее';
      });

      if (!isOpen) {
        card.classList.add('service-card--open');
        btn.querySelector('.service-card__toggle-text').textContent = 'Свернуть';
        setTimeout(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 60);
      }
    });
  });

  /* ===== TELEGRAM FLOAT ===== */
  (function () {
    const TG_USERNAME = 'a_gorn';
    const TG_MSG = encodeURIComponent('Здравствуйте, Анна! Хочу обсудить импорт из Китая для своего бизнеса.');

    const wrap = document.createElement('div');
    wrap.className = 'tg-float';
    wrap.innerHTML = `
      <div class="tg-float__popup" id="tgPopup">
        <div class="tg-float__popup-header">
          <img src="anna.jpg" class="tg-float__avatar" alt="Анна Горн" onerror="this.style.display='none'">
          <div>
            <h4>Анна Горн</h4>
            <p><span class="tg-online"></span>ВЭД-эксперт · @a_gorn</p>
          </div>
          <button class="tg-close" id="tgClose" aria-label="Закрыть">×</button>
        </div>
        <div class="tg-float__popup-body">
          <div class="tg-bubble">
            Привет! 👋 Помогу разобраться с импортом из Китая. Напишите — отвечу быстро.
            <span>сейчас</span>
          </div>
        </div>
        <div class="tg-float__popup-footer">
          <a href="https://t.me/${TG_USERNAME}?text=${TG_MSG}" target="_blank" rel="noopener" class="tg-send-btn">
            Написать в Telegram
          </a>
        </div>
      </div>
      <button class="tg-float__btn" id="tgBtn" aria-label="Telegram">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.16 13.67l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.988.889z"/>
        </svg>
      </button>
    `;
    document.body.appendChild(wrap);

    const popup = document.getElementById('tgPopup');
    const btn   = document.getElementById('tgBtn');
    const close = document.getElementById('tgClose');

    let shown = false;
    btn.addEventListener('click', () => {
      shown = !shown;
      popup.classList.toggle('open', shown);
    });
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      shown = false;
      popup.classList.remove('open');
    });

    if (!sessionStorage.getItem('tg_shown')) {
      setTimeout(() => {
        shown = true;
        popup.classList.add('open');
        sessionStorage.setItem('tg_shown', '1');
      }, 30000);
    }
  })();

  /* ===== ROI CALCULATOR ===== */
  (function () {
    const calc = document.getElementById('roiCalc');
    if (!calc) return;
    calc.addEventListener('submit', function (e) {
      e.preventDefault();
      const budget  = parseFloat(document.getElementById('calcBudget').value) || 0;
      const margin  = parseFloat(document.getElementById('calcMargin').value) || 30;
      const category = document.getElementById('calcCategory').value;

      const savingsRate = { electronics: 0.42, textile: 0.38, machinery: 0.35, construction: 0.40, other: 0.32 };
      const rate = savingsRate[category] || 0.37;

      const savedMonth  = Math.round(budget * rate);
      const savedYear   = savedMonth * 12;
      const newMargin   = Math.round(margin + rate * 100 * 0.4);

      document.getElementById('calcSavMonth').textContent = savedMonth.toLocaleString('ru') + ' ₽';
      document.getElementById('calcSavYear').textContent  = savedYear.toLocaleString('ru') + ' ₽';
      document.getElementById('calcNewMargin').textContent = newMargin + '%';
      document.getElementById('calcResult').classList.add('show');
    });
  })();

  /* ===== SERVICE WORKER ===== */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  /* ===== CONTACT FORM ===== */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.textContent;
      btn.textContent = '✓ Отправлено!';
      btn.style.background = '#C8FF57';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  /* ===== ACTIVE NAV LINK ===== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

})();
