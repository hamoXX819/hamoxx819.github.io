// ハンバーガーメニューの toggle 機能
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');
const progressBar = document.getElementById('scroll-progress-bar');
const sceneIndicator = document.getElementById('scene-indicator');

const root = document.documentElement;
let savedTheme = null;

try {
  savedTheme = localStorage.getItem('theme');
} catch (error) {
  savedTheme = null;
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
  themeToggle.textContent = theme === 'dark' ? '☀' : '◐';
};

applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  try {
    localStorage.setItem('theme', nextTheme);
  } catch (error) {
    // 保存できない環境ではそのまま反映だけ行う
  }
});

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  menu.classList.toggle('active');
  const expanded = menuToggle.classList.contains('active');
  menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  menu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
});

// リンククリック時にメニューを閉じる
const navLinks = menu.querySelectorAll('a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    menu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  });
});

// ページロード時のフェードインアニメーション
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// スクロール時のカード出現アニメーション
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

// IntersectionObserver: reveal elements. For `.card` elements, apply alternating
// `from-left` / `from-right` classes based on document order so they flow in alternately.
const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

      if (el.classList.contains('card')) {
        if (!prefersReducedMotion) {
          // compute index among all cards to decide parity
          const cards = Array.from(document.querySelectorAll('.card'));
          const idx = cards.indexOf(el);
          const cls = (idx % 2 === 0) ? 'from-left' : 'from-right';
          el.classList.add(cls);
          // small stagger for nicer effect (cap to keep snappy)
          el.style.animationDelay = (Math.min(idx, 4) * 60) + 'ms';
        } else {
          // reduced motion: no lateral classes or stagger
          el.style.animationDelay = '0ms';
        }
      }

      el.classList.add('in-view');
      observer.unobserve(el);
  });
}, observerOptions);

// 表示アニメーションの対象をまとめて監視
document.querySelectorAll('.card, .skill-card, .hero-visual, section').forEach(element => {
  observer.observe(element);
});

// スクロール位置に応じて背景シーンを切り替える
const sceneSections = document.querySelectorAll('section[data-scene]');
const sceneNavMap = {
  skills: '#skills',
  works: '#works',
  contact: '#contact'
};

const sceneLabelMap = {
  intro: 'INTRO',
  skills: 'SKILLS',
  works: 'WORKS',
  contact: 'CONTACT'
};

const updateActiveNav = (sceneName) => {
  const menuLinks = menu.querySelectorAll('a[href^="#"]');
  menuLinks.forEach((link) => {
    link.classList.remove('is-active');
  });

  const targetSelector = sceneNavMap[sceneName];
  if (!targetSelector) {
    return;
  }

  const targetLink = menu.querySelector(`a[href="${targetSelector}"]`);
  if (targetLink) {
    targetLink.classList.add('is-active');
  }

  if (sceneIndicator) {
    sceneIndicator.textContent = sceneLabelMap[sceneName] || 'INTRO';
  }
};

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const sceneName = entry.target.getAttribute('data-scene');
    if (!sceneName) {
      return;
    }

    document.body.classList.remove('scene-intro', 'scene-skills', 'scene-works', 'scene-contact');
    document.body.classList.add(`scene-${sceneName}`);
    updateActiveNav(sceneName);
  });
}, {
  threshold: 0.55,
  rootMargin: '-10% 0px -20% 0px'
});

sceneSections.forEach((section) => {
  sceneObserver.observe(section);
});

if (!document.body.classList.contains('scene-intro')) {
  document.body.classList.add('scene-intro');
}

if (sceneIndicator) {
  sceneIndicator.textContent = 'INTRO';
}

const updateScrollProgress = () => {
  if (!progressBar) {
    return;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
};

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();
