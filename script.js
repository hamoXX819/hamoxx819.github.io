// ハンバーガーメニューの toggle 機能
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');
const progressBar = document.getElementById('scroll-progress-bar');
const sceneIndicator = document.getElementById('scene-indicator');
const header = document.querySelector('header');

const root = document.documentElement;
let savedTheme = null;

try {
  savedTheme = localStorage.getItem('theme');
} catch (error) {
  savedTheme = null;
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateHeaderOffset = () => {
  if (!header) {
    return;
  }

  const offset = Math.ceil(header.getBoundingClientRect().height + 12);
  root.style.setProperty('--header-offset', `${offset}px`);
};

const syncMenuVisibility = () => {
  if (!menu || !menuToggle) {
    return;
  }

  const isMobile = window.matchMedia('(max-width: 600px)').matches;
  const isExpanded = menuToggle.classList.contains('active');
  menu.setAttribute('aria-hidden', isMobile && !isExpanded ? 'true' : 'false');
};

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  if (!themeToggle) {
    return;
  }

  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
  themeToggle.textContent = theme === 'dark' ? '☀' : '◐';
};

applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
updateHeaderOffset();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('theme', nextTheme);
    } catch (error) {
      // 保存できない環境ではそのまま反映だけ行う
    }
  });
}

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
    const expanded = menuToggle.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    syncMenuVisibility();
    if (expanded) {
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      menuToggle.focus();
    }
  });
}

// リンククリック時にメニューを閉じる
const navLinks = menu ? menu.querySelectorAll('a') : [];
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (!menuToggle || !menu) {
      return;
    }

    menuToggle.classList.remove('active');
    menu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    syncMenuVisibility();
  });
});

// Close menu with Escape and ensure focus management
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    // if modal is open, close it first
    const modal = document.getElementById('card-modal');
    if (modal && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
      return;
    }

    if (menu && menuToggle && menu.classList.contains('active')) {
      menuToggle.classList.remove('active');
      menu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      syncMenuVisibility();
      menuToggle.focus();
    }
  }
});

// ページロード時のフェードインアニメーション
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  updateHeaderOffset();
});

window.addEventListener('resize', updateHeaderOffset, { passive: true });
window.addEventListener('resize', syncMenuVisibility, { passive: true });
syncMenuVisibility();

if (window.ResizeObserver && header) {
  const headerObserver = new ResizeObserver(() => {
    updateHeaderOffset();
  });
  headerObserver.observe(header);
}

const iconSvg = {
  frontend: '<svg viewBox="0 0 24 24"><path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/></svg>',
  mobile: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  backend: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></svg>',
  infra: '<svg viewBox="0 0 24 24"><path d="M17.5 18H8a5 5 0 1 1 1.2-9.8A6 6 0 0 1 20 12.5 3 3 0 0 1 17.5 18Z"/></svg>',
  language: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 10 3 2-3 2"/><path d="M12 15h5"/></svg>',
  engineering: '<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-3-3 2.4-2.4Z"/></svg>',
  usability: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  practical: '<svg viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"/><path d="M4 19h16"/></svg>',
  maintainable: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M3 18h5v-5"/><path d="M21 6h-5v5"/></svg>',
  certBasic: '<svg viewBox="0 0 24 24"><path d="M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2Z"/><path d="M9 8h6"/><path d="M9 12h4"/></svg>',
  certSecurity: '<svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3Z"/><path d="m9.5 12 1.8 1.8L15 10"/></svg>',
  certElectric: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z"/></svg>'
};

const cardData = {
  principles: [
    { className: 'skill-card-usability', icon: 'usability', title: '使いやすさ', text: '操作に迷わず、必要な情報へ自然にたどり着けるUIを意識します。' },
    { className: 'skill-card-practical', icon: 'practical', title: '実用性', text: '見た目だけでなく、実際の運用や管理のしやすさまで考えます。' },
    { className: 'skill-card-maintainable', icon: 'maintainable', title: '保守性', text: '後から読み返しやすく、改善しやすいHTML / CSS / JavaScriptを目指します。' }
  ],
  certifications: [
    { className: 'skill-card-cert-basic', icon: 'certBasic', title: '基本情報技術者', text: 'ITの基礎、アルゴリズム、システム開発、ネットワークなどの知識を学んでいます。' },
    { className: 'skill-card-cert-security', icon: 'certSecurity', title: '情報セキュリティマネジメント', text: '情報セキュリティの考え方、リスク管理、運用面の対策を意識しています。' },
    { className: 'skill-card-cert-electric', icon: 'certElectric', title: '第二種電気工事士', text: '電気設備や安全に関する基礎知識を、ものづくりの視点にも活かしています。' }
  ],
  skills: [
    { className: 'skill-card-frontend', icon: 'frontend', title: 'フロントエンド', tags: ['HTML', 'CSS', 'JavaScript'] },
    { className: 'skill-card-mobile', icon: 'mobile', title: 'モバイル', tags: ['Flutter', 'Dart'] },
    { className: 'skill-card-backend', icon: 'backend', title: 'バックエンド', tags: ['PHP', 'MySQL', 'Supabase'] },
    { className: 'skill-card-infra', icon: 'infra', title: 'インフラストラクチャ', tags: ['Linux', 'Docker', 'AWS', 'Azure'] },
    { className: 'skill-card-language', icon: 'language', title: '言語', tags: ['C', 'C#', 'SQL', 'Python', 'JavaScript', 'VBA'] },
    { className: 'skill-card-engineering', icon: 'engineering', title: '機械工学', tags: ['CAD', '電気制御', 'PLC', '画像処理'] }
  ],
  works: [
    {
      title: '学校ポータルアプリ',
      text: 'Flutter + Supabaseで開発した、学生向けポータルアプリです。',
      aboutText: '学生が必要な情報を確認しやすくすることを目的にした、モバイル向けの制作物です。',
      tags: ['iOS/Android', 'Flutter', 'Supabase/Postgres', '学生向け']
    },
    {
      title: '出欠管理システム',
      text: 'XAMPPで開発した、授業の出欠を管理するWebシステムです。',
      aboutText: '授業の出欠を管理しやすくすることを目的にした、Webベースの制作物です。',
      tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL']
    },
    {
      title: '防災アプリ',
      text: '災害情報・避難支援を目的とした地域向けアプリです。',
      aboutText: '災害情報や避難支援を分かりやすく届けることを目的にした、地域向けの制作物です。',
      tags: ['iOS/Android', 'Flutter', 'Supabase/Postgres', '地域向け']
    }
  ]
};

const renderSkillCards = (container, cards) => {
  container.innerHTML = cards.map((card) => {
    const body = card.tags
      ? `<div class="tag-list skill-tag-list">${card.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>`
      : `<p>${card.text}</p>`;

    return `
      <article class="skill-card ${card.className}">
        <h3><span class="skill-icon" aria-hidden="true">${iconSvg[card.icon]}</span>${card.title}</h3>
        ${body}
      </article>
    `;
  }).join('');
};

const renderWorkCards = (container, cards) => {
  const includeActions = container.dataset.cardActions === 'true';

  container.innerHTML = cards.map((card) => {
    const text = includeActions ? card.text : card.aboutText;
    const tags = card.tags.map((tag) => `<span>${tag}</span>`).join('');
    const actions = includeActions ? `
      <div class="card-links">
        <a href="#links">関連リンク</a>
        <button class="card-detail" type="button" aria-haspopup="dialog">詳細</button>
        <a href="#contact">相談する</a>
      </div>
    ` : '';

    return `
      <div class="card">
        <h3>${card.title}</h3>
        <p>${text}</p>
        <div class="tag-list">${tags}</div>
        ${actions}
      </div>
    `;
  }).join('');
};

document.querySelectorAll('[data-card-list]').forEach((container) => {
  const listName = container.dataset.cardList;
  const cards = cardData[listName];

  if (!cards) {
    return;
  }

  if (listName === 'works') {
    renderWorkCards(container, cards);
    return;
  }

  renderSkillCards(container, cards);
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
  links: '#links',
  contact: '#contact'
};

const sceneLabelMap = {
  intro: 'INTRO',
  skills: 'SKILLS',
  works: 'WORKS',
  links: 'LINKS',
  contact: 'CONTACT'
};

const updateActiveNav = (sceneName) => {
  if (!menu) {
    return;
  }

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

    document.body.classList.remove('scene-intro', 'scene-skills', 'scene-works', 'scene-links', 'scene-contact');
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

/* Modal: card details */
const modal = document.getElementById('card-modal');
const modalTitle = modal ? modal.querySelector('#modal-title') : null;
const modalBody = modal ? modal.querySelector('#modal-body') : null;
const modalClose = modal ? modal.querySelector('.modal-close') : null;
let lastFocusedElement = null;

const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function trapFocus(e) {
  if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
  const focusable = Array.from(modal.querySelectorAll(focusableSelectors));
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

function openModalFromCard(cardEl) {
  if (!modal) return;
  const titleEl = cardEl.querySelector('h3');
  const pEl = cardEl.querySelector('p');
  const tags = Array.from(cardEl.querySelectorAll('.tag-list span')).map(s => s.textContent.trim()).filter(Boolean);

  modalTitle.textContent = titleEl ? titleEl.textContent.trim() : '詳細';
  // build body content
  let html = '';
  if (pEl) html += `<p>${pEl.textContent.trim()}</p>`;
  if (tags.length) html += '<p class="modal-tags"><strong>タグ: </strong>' + tags.join(' ・ ') + '</p>';
  modalBody.innerHTML = html;

  lastFocusedElement = document.activeElement;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
  // focus close button
  if (modalClose) modalClose.focus();
  document.addEventListener('keydown', trapFocus);
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  document.removeEventListener('keydown', trapFocus);
  if (lastFocusedElement) lastFocusedElement.focus();
}

// attach handlers
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
  modal.querySelectorAll('[data-close="true"]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
}

// card detail buttons
document.querySelectorAll('.card .card-detail').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.currentTarget.closest('.card');
    if (card) openModalFromCard(card);
  });
});
