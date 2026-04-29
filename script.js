// ハンバーガーメニューの toggle 機能
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu');

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

// カード要素を監視
document.querySelectorAll('.card').forEach(card => {
  observer.observe(card);
});

// セクションのフェードインアニメーション
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});
