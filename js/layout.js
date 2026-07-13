/* ===== РЫБОЛОВ — общий каркас сайта (шапка, подвал, корзина, модалки) =====
 * Вставляется на каждой странице. data-page на <body> подсвечивает активный пункт меню.
 */
(function () {
  'use strict';

  // ===== Набор премиальных SVG-иконок (без эмодзи) =====
  const P = {
    truck: '<path d="M3 6.5h11v9H3z"/><path d="M14 9.5h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.3" cy="18" r="1.6"/>',
    shield: '<path d="M12 3l7 3v5c0 4.4-3 7.5-7 9-4-1.5-7-4.6-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    hook: '<path d="M15 4h1a2 2 0 0 1 2 2v6a6 6 0 0 1-12 0"/><circle cx="6" cy="18" r="1.4"/><path d="M15 4v3"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10.5h18"/>',
    store: '<path d="M4 9.5h16V19H4z"/><path d="M4 9.5L5.6 5h12.8L20 9.5"/><path d="M9.5 19v-5h5v5"/>',
    box: '<path d="M3 7.5l9-4 9 4v9l-9 4-9-4z"/><path d="M3 7.5l9 4 9-4M12 11.5v9"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 8l9 6 9-6"/>',
    phone: '<path d="M6 3.5h3l2 5-2.2 1.1a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5.5a2 2 0 0 1 2-2z"/>',
    clock: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.5V12l3 2"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    metro: '<rect x="4" y="4" width="16" height="12" rx="3"/><path d="M8 12h8M8 20l2-3M16 20l-2-3"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="8.5" r="1"/>',
    chat: '<path d="M4 5.5h16v9H9l-4 4v-4H4z"/>',
    spool: '<rect x="6" y="4" width="12" height="16" rx="2"/><path d="M6 8.5h12M6 15.5h12"/>',
    wrench: '<path d="M15.5 5.5a4 4 0 0 0-5.2 5.2l-5.6 5.6 2 2 5.6-5.6a4 4 0 0 0 5.2-5.2l-2.4 2.4-2-2z"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M4 13h16M12 9v11"/><path d="M12 9C10 9 8.3 8.2 8.3 6.6A2 2 0 0 1 12 6a2 2 0 0 1 3.7.6C15.7 8.2 14 9 12 9z"/>',
    trophy: '<path d="M7 4.5h10V8a5 5 0 0 1-10 0z"/><path d="M7 6.2H4V7a3 3 0 0 0 3 3M17 6.2h3V7a3 3 0 0 1-3 3M9.5 20h5M10 15h4l-.5 5h-3z"/>',
    calendar: '<rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M4 9.5h16M8.5 3.5v4M15.5 3.5v4"/>',
    cash: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.4"/><path d="M6.5 9.5v5M17.5 9.5v5"/>',
    qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z"/><path d="M14 14h2.5v2.5M19.5 14v2.5M14 18.5h2.5M18 18.5h2v2"/>',
    fish: '<path d="M3.5 12c3-4.5 8.5-4.5 12 0-3.5 4.5-9 4.5-12 0z"/><path d="M15.5 12c1.8-1.8 3.6-1.8 5-.8-1 1.8-1 1.8 0 3.6-1.4 1-3.2 1-5-2.8z"/><circle cx="7" cy="11" r=".7"/>',
    cart: '<circle cx="9.5" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2.2l2.1 10.4a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.5-1.2L21 8H6.2"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z"/>',
    heart: '<path d="M12 20.3C6.2 16.6 3.2 13.4 3.2 9.7 3.2 7.1 5.2 5.1 7.6 5.1c1.7 0 3.2 1 4.4 2.6 1.2-1.6 2.7-2.6 4.4-2.6 2.4 0 4.4 2 4.4 4.6 0 3.7-3 6.9-8.8 10.6z"/>',
  };
  function icon(name, cls) {
    return `<svg class="pico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
  }
  window.RB_ICON = icon;
  window.RB_HYDRATE = function (root) {
    (root || document).querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  };

  const NAV = [
    { href: 'index.html',    page: 'home',     label: 'Главная' },
    { href: 'catalog.html',  page: 'catalog',  label: 'Каталог' },
    { href: 'sale.html',     page: 'sale',     label: 'Акции' },
    { href: 'brands.html',   page: 'brands',   label: 'Бренды' },
    { href: 'blog.html',     page: 'blog',     label: 'Советы' },
    { href: 'services.html', page: 'services', label: 'Услуги' },
    { href: 'about.html',    page: 'about',    label: 'О магазине' },
    { href: 'contacts.html', page: 'contacts', label: 'Контакты' },
  ];

  const current = document.body.dataset.page || 'home';
  const navLinks = NAV.map((n) =>
    `<a href="${n.href}" class="nav__link ${n.page === current ? 'is-active' : ''}">${n.label}</a>`
  ).join('');

  const header = `
  <div class="topbar">
    <div class="container topbar__inner">
      <span class="topbar__item">${icon('truck')} Бесплатная доставка по Санкт-Петербургу от 3000 ₽</span>
      <span class="topbar__item topbar__item--mid">${icon('shield')} Оригинальные снасти · гарантия качества</span>
      <span class="topbar__phone">${icon('phone')} <a href="tel:+78121234567">+7 (812) 123-45-67</a></span>
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
        <a href="sale.html">Акции и скидки</a><a href="brands.html">Бренды</a>
        <a href="blog.html">Советы рыбакам</a><a href="services.html">Услуги</a>
        <a href="about.html">О магазине</a><a href="delivery.html">Доставка и оплата</a>
        <a href="account.html">Личный кабинет</a>
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
      <div class="drawer__head"><h3>Корзина</h3><button class="drawer__close" id="cartClose" aria-label="Закрыть">✕</button></div>
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
  window.RB_HYDRATE(document.body);
})();
