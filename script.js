// ハンバーガーメニューの toggle 機能
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

const root = document.documentElement;
let savedTheme = null;

try {
  savedTheme = localStorage.getItem('theme');
} catch (error) {
  savedTheme = null;
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

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
});

// リンククリック時にメニューを閉じる
const navLinks = menu.querySelectorAll('a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    menu.classList.remove('active');
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

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// 表示アニメーションの対象をまとめて監視
document.querySelectorAll('.card, .skill-card, .hero-visual, section').forEach(element => {
  observer.observe(element);
});
