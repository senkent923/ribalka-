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
        <button class="icon-btn icon-btn--search" id="searchOpen" aria-label="Поиск">
          <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>
        </button>
        <a href="catalog.html?fav=1" class="icon-btn" id="favLink" aria-label="Избранное">
          <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5C6 16.7 3 13.4 3 9.6 3 7 5 5 7.5 5c1.7 0 3.3 1 4.5 2.6C13.2 6 14.8 5 16.5 5 19 5 21 7 21 9.6c0 3.8-3 7.1-9 10.9z"/></svg>
          <span class="icon-btn__count" id="favCount">0</span>
        </a>
        <a href="account.html" class="icon-btn" aria-label="Личный кабинет">
          <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.6-4 3.7-6 7.5-6s6.9 2 7.5 6"/></svg>
          <span class="icon-btn__label" id="accountLabel">Войти</span>
        </a>
        <button class="cart-toggle" id="cartToggle" aria-label="Корзина">
          <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2.2l2.1 10.4a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.5-1.2L21 8H6.2"/></svg>
          <span class="cart-toggle__count" id="cartCount">0</span>
        </button>
        <button class="nav-toggle" id="navToggle" aria-label="Меню">
          <svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </button>
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
