/* ===== РЫБОЛОВ — общий каркас сайта (шапка, подвал, корзина, модалки) =====
 * Вставляется на каждой странице. data-page на <body> подсвечивает активный пункт меню.
 */
(function () {
  'use strict';

  const NAV = [
    { href: 'index.html',    page: 'home',     label: 'Главная' },
    { href: 'catalog.html',  page: 'catalog',  label: 'Каталог' },
    { href: 'about.html',    page: 'about',    label: 'О магазине' },
    { href: 'delivery.html', page: 'delivery', label: 'Доставка и оплата' },
    { href: 'contacts.html', page: 'contacts', label: 'Контакты' },
  ];

  const current = document.body.dataset.page || 'home';
  const navLinks = NAV.map((n) =>
    `<a href="${n.href}" class="nav__link ${n.page === current ? 'is-active' : ''}">${n.label}</a>`
  ).join('');

  const header = `
  <div class="topbar">
    <div class="container topbar__inner">
      <span class="topbar__item">🚚 Бесплатная доставка по Санкт-Петербургу от 3000 ₽</span>
      <span class="topbar__item topbar__item--mid">🏆 Оригинальные снасти · гарантия качества</span>
      <span class="topbar__phone">📞 <a href="tel:+78121234567">+7 (812) 123-45-67</a></span>
    </div>
  </div>
  <header class="header" id="siteHeader">
    <div class="container header__inner">
      <a href="index.html" class="logo logo--emblem" aria-label="РЫБОЛОВ">
        <img src="assets/img/logo-horizontal.jpeg" alt="РЫБОЛОВ — премиальные товары для рыбалки" class="logo__img">
      </a>
      <nav class="nav" id="mainNav">${navLinks}</nav>
      <div class="header__actions">
        <button class="icon-btn icon-btn--search" id="searchOpen" aria-label="Поиск"><span class="icon-btn__ico">🔍</span></button>
        <a href="catalog.html?fav=1" class="icon-btn" id="favLink" aria-label="Избранное">
          <span class="icon-btn__ico">♥</span><span class="icon-btn__count" id="favCount">0</span>
        </a>
        <a href="account.html" class="icon-btn" aria-label="Личный кабинет">
          <span class="icon-btn__ico">👤</span><span class="icon-btn__label" id="accountLabel">Войти</span>
        </a>
        <button class="cart-toggle" id="cartToggle" aria-label="Корзина">
          <span class="cart-toggle__ico">🛒</span><span class="cart-toggle__count" id="cartCount">0</span>
        </button>
        <button class="nav-toggle" id="navToggle" aria-label="Меню">☰</button>
      </div>
    </div>
    <div class="header__search" id="headerSearch" hidden>
      <div class="container">
        <form class="search" id="searchForm">
          <input type="search" id="searchInput" class="search__input" placeholder="Найти снасть: спиннинг, катушка, воблер…" autocomplete="off">
          <button class="search__btn" type="submit">Найти</button>
        </form>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__col footer__brand">
        <a href="index.html" class="logo logo--footer"><img src="assets/img/logo-horizontal.jpeg" alt="РЫБОЛОВ" class="logo__img"></a>
        <p class="footer__about">Премиальные снасти для рыбалки в Санкт-Петербурге. Всё — от поплавка до трофея.</p>
        <div class="footer__pay"><span>Visa</span><span>Mir</span><span>СБП</span><span>MC</span></div>
      </div>
      <div class="footer__col">
        <h4>Каталог</h4>
        <a href="catalog.html?cat=spinning">Спиннинги</a><a href="catalog.html?cat=reels">Катушки</a>
        <a href="catalog.html?cat=lines">Лески и шнуры</a><a href="catalog.html?cat=lures">Приманки</a>
        <a href="catalog.html?cat=accessories">Аксессуары</a>
      </div>
      <div class="footer__col">
        <h4>Магазин</h4>
        <a href="about.html">О магазине</a><a href="delivery.html">Доставка и оплата</a>
        <a href="contacts.html">Контакты</a><a href="account.html">Личный кабинет</a>
      </div>
      <div class="footer__col">
        <h4>Контакты</h4>
        <a href="tel:+78121234567">+7 (812) 123-45-67</a>
        <a href="mailto:info@rybolov.spb.ru">info@rybolov.spb.ru</a>
        <span class="footer__muted">Лиговский пр-т, 50<br>ежедневно 09:00–21:00</span>
      </div>
    </div>
    <div class="footer__bottom"><div class="container">© 2026 «РЫБОЛОВ», Санкт-Петербург. Всё для рыбалки.</div></div>
  </footer>`;

  const overlays = `
  <div class="drawer" id="cartDrawer" hidden>
    <div class="drawer__overlay" id="cartOverlay"></div>
    <aside class="drawer__panel">
      <div class="drawer__head"><h3>🛒 Корзина</h3><button class="drawer__close" id="cartClose" aria-label="Закрыть">✕</button></div>
      <div class="drawer__body" id="cartItems"></div>
      <div class="drawer__foot">
        <div class="drawer__total"><span>Итого:</span><b id="cartTotal">0 ₽</b></div>
        <button class="btn btn--primary btn--block" id="checkoutBtn">Оформить заказ</button>
      </div>
    </aside>
  </div>
  <div class="modal" id="productModal" hidden>
    <div class="modal__overlay" id="modalOverlay"></div>
    <div class="modal__card" id="modalCard"></div>
  </div>
  <div class="toast" id="toast" hidden></div>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer + overlays);
})();
