/* ===== Магазин «РЫБОЛОВ» — клиентская логика ===== */
(function () {
  'use strict';

  const LS = {
    cart: 'rybolov_cart',
    fav: 'rybolov_fav',
    users: 'rybolov_users',
    session: 'rybolov_session',
  };

  const state = {
    category: 'all',
    query: '',
    sort: 'popular',
    brand: 'all',
    priceMin: null,
    priceMax: null,
    inStock: false,
    favOnly: false,
    cart: loadJSON(LS.cart, {}),
    fav: loadJSON(LS.fav, []),
    user: loadSession(),
  };

  const $ = (s) => document.querySelector(s);
  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const imgFallback = (p) => `this.onerror=null;this.src='${productFallback(p)}'`;

  function loadJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
  function loadSession() {
    const email = localStorage.getItem(LS.session);
    if (!email) return null;
    const users = loadJSON(LS.users, {});
    return users[email] || null;
  }
  function saveUsers(users) { localStorage.setItem(LS.users, JSON.stringify(users)); }

  /* ---------- Карточка товара ---------- */
  function cardMarkup(p) {
    const discount = p.old > p.price
      ? `<span class="card__badge">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : '';
    const hit = p.rating >= 4.9 && p.stock ? `<span class="card__badge card__badge--hit">Хит</span>` : '';
    const out = !p.stock ? `<span class="card__badge card__badge--out">Нет в наличии</span>` : '';
    const fav = state.fav.includes(p.id);
    return `<article class="card" data-id="${p.id}">
      <div class="card__media" data-open="${p.id}">
        <img class="card__img" loading="lazy" alt="${esc(p.name)}"
             src="${photoUrl(p)}" onerror="${imgFallback(p)}">
        ${discount || hit}${out}
        <button class="card__fav ${fav ? 'is-active' : ''}" data-fav="${p.id}" aria-label="В избранное" title="В избранное">♥</button>
      </div>
      <div class="card__body">
        <span class="card__brand">${esc(p.brand)}</span>
        <h3 class="card__name" data-open="${p.id}">${esc(p.name)}</h3>
        <div class="card__rating">★ ${p.rating.toFixed(1)} <span>· ${p.stock ? 'в наличии' : 'под заказ'}</span></div>
        <div class="card__price-row">
          <span class="card__price">${fmt(p.price)}</span>
          ${p.old > p.price ? `<span class="card__old">${fmt(p.old)}</span>` : ''}
        </div>
        <button class="card__btn" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>
          ${p.stock ? 'В корзину' : 'Нет в наличии'}
        </button>
      </div>
    </article>`;
  }

  function wireCards(container) {
    container.querySelectorAll('[data-add]').forEach((el) =>
      el.addEventListener('click', (e) => { e.stopPropagation(); addToCart(el.dataset.add); }));
    container.querySelectorAll('[data-fav]').forEach((el) =>
      el.addEventListener('click', (e) => { e.stopPropagation(); toggleFav(el.dataset.fav); }));
    container.querySelectorAll('[data-open]').forEach((el) =>
      el.addEventListener('click', () => openModal(el.dataset.open)));
  }

  /* ---------- Хиты продаж ---------- */
  function renderHits() {
    const grid = $('#hitsGrid');
    if (!grid) return;
    const hits = PRODUCTS.filter((p) => p.stock)
      .sort((a, b) => (b.rating - a.rating) || ((b.img ? 1 : 0) - (a.img ? 1 : 0)) || (b.price - a.price))
      .slice(0, 4);
    grid.innerHTML = hits.map(cardMarkup).join('');
    wireCards(grid);
  }

  /* ---------- Категории ---------- */
  function renderCategories() {
    const grid = $('#catsGrid');
    grid.innerHTML = CATEGORIES.map((c) => {
      const count = PRODUCTS.filter((p) => p.cat === c.id).length;
      return `<button class="cat-card" data-cat="${c.id}">
        <div class="cat-card__icon">${c.icon}</div>
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <span class="cat-card__count">${count} товаров →</span>
      </button>`;
    }).join('');
    grid.querySelectorAll('.cat-card').forEach((el) =>
      el.addEventListener('click', () => selectCategory(el.dataset.cat)));
  }

  function selectCategory(cat) {
    state.category = cat;
    state.query = '';
    state.favOnly = false;
    $('#searchInput').value = '';
    renderFilters();
    renderProducts();
    $('#catalog').scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------- Вкладки категорий ---------- */
  function renderFilters() {
    const tabs = $('#filters');
    const items = [{ id: 'all', name: 'Все товары', icon: '🗂️' }, ...CATEGORIES];
    tabs.innerHTML = items.map((c) =>
      `<button class="tab ${state.category === c.id && !state.favOnly ? 'is-active' : ''}" data-cat="${c.id}">
        <span>${c.icon || ''}</span> ${c.name}
      </button>`
    ).join('');
    tabs.querySelectorAll('.tab').forEach((el) => el.addEventListener('click', () => {
      state.category = el.dataset.cat; state.favOnly = false;
      renderFilters(); renderProducts();
    }));
  }

  /* ---------- Фильтр по брендам ---------- */
  function renderBrandFilter() {
    const sel = $('#brandFilter');
    const brands = [...new Set(PRODUCTS.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'ru'));
    sel.innerHTML = `<option value="all">Все бренды</option>` +
      brands.map((b) => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
  }

  /* ---------- Выборка ---------- */
  function getVisible() {
    let list = PRODUCTS.slice();
    if (state.favOnly) list = list.filter((p) => state.fav.includes(p.id));
    if (state.category !== 'all') list = list.filter((p) => p.cat === state.category);
    if (state.brand !== 'all') list = list.filter((p) => p.brand === state.brand);
    if (state.inStock) list = list.filter((p) => p.stock);
    if (state.priceMin != null) list = list.filter((p) => p.price >= state.priceMin);
    if (state.priceMax != null) list = list.filter((p) => p.price <= state.priceMax);
    if (state.query) {
      const q = state.query.toLowerCase();
      list = list.filter((p) => (p.name + ' ' + p.brand).toLowerCase().includes(q));
    }
    switch (state.sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      default:           list.sort((a, b) => b.rating * (b.stock ? 1 : .5) - a.rating * (a.stock ? 1 : .5));
    }
    return list;
  }

  function renderProducts() {
    const wrap = $('#products');
    const list = getVisible();
    $('#empty').hidden = list.length > 0;

    let scope = state.favOnly ? 'Избранное'
      : state.category === 'all' ? 'Все категории'
      : (CATEGORIES.find((c) => c.id === state.category) || {}).name;
    const extra = [];
    if (state.brand !== 'all') extra.push(`бренд «${state.brand}»`);
    if (state.inStock) extra.push('в наличии');
    if (state.priceMin != null || state.priceMax != null) extra.push(`цена ${state.priceMin ?? 0}–${state.priceMax ?? '∞'} ₽`);
    if (state.query) extra.push(`запрос «${state.query}»`);
    $('#catalogMeta').textContent = `${scope} · найдено: ${list.length}${extra.length ? ' · ' + extra.join(' · ') : ''}`;

    wrap.innerHTML = list.map(cardMarkup).join('');
    wireCards(wrap);
  }

  /* ---------- Модалка товара ---------- */
  function openModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const fav = state.fav.includes(p.id);
    const specs = Object.entries(p.specs).map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join('');
    $('#modalCard').innerHTML = `
      <button class="modal__close" id="modalClose" aria-label="Закрыть">✕</button>
      <div class="modal__grid">
        <img class="modal__img" alt="${esc(p.name)}" src="${photoUrl(p)}" onerror="${imgFallback(p)}">
        <div class="modal__info">
          <span class="modal__brand">${esc(p.brand)}</span>
          <h2 class="modal__title">${esc(p.name)}</h2>
          <div class="card__rating">★ ${p.rating.toFixed(1)} · ${p.stock ? 'В наличии' : 'Под заказ'}</div>
          <ul class="modal__specs">${specs}</ul>
          <div class="modal__price">${fmt(p.price)} ${p.old > p.price ? `<s>${fmt(p.old)}</s>` : ''}</div>
          <div class="modal__actions">
            <button class="btn btn--primary" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>
              ${p.stock ? '🛒 В корзину' : 'Нет в наличии'}
            </button>
            <button class="btn btn--fav ${fav ? 'is-active' : ''}" data-fav="${p.id}">♥ ${fav ? 'В избранном' : 'В избранное'}</button>
          </div>
        </div>
      </div>`;
    $('#productModal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#modalClose').addEventListener('click', closeModal);
    const addBtn = $('#modalCard [data-add]');
    if (addBtn) addBtn.addEventListener('click', () => { addToCart(id); closeModal(); });
    const favBtn = $('#modalCard [data-fav]');
    if (favBtn) favBtn.addEventListener('click', () => { toggleFav(id); openModal(id); });
  }
  function closeModal() { $('#productModal').hidden = true; document.body.style.overflow = ''; }

  /* ---------- Избранное ---------- */
  function toggleFav(id) {
    const i = state.fav.indexOf(id);
    if (i >= 0) state.fav.splice(i, 1); else state.fav.push(id);
    localStorage.setItem(LS.fav, JSON.stringify(state.fav));
    $('#favCount').textContent = state.fav.length;
    renderHits(); renderProducts();
    showToast(i >= 0 ? 'Удалено из избранного' : '♥ Добавлено в избранное');
  }

  /* ---------- Корзина ---------- */
  function saveCart() { localStorage.setItem(LS.cart, JSON.stringify(state.cart)); }
  function addToCart(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p || !p.stock) return;
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart(); updateCartBadge(); renderCart();
    showToast(`«${p.name.slice(0, 34)}…» — в корзине`);
  }
  function changeQty(id, d) {
    if (!state.cart[id]) return;
    state.cart[id] += d;
    if (state.cart[id] <= 0) delete state.cart[id];
    saveCart(); updateCartBadge(); renderCart();
  }
  function removeFromCart(id) { delete state.cart[id]; saveCart(); updateCartBadge(); renderCart(); }
  function cartCount() { return Object.values(state.cart).reduce((a, b) => a + b, 0); }
  function cartTotal() {
    return Object.entries(state.cart).reduce((s, [id, q]) => {
      const p = PRODUCTS.find((x) => x.id === id); return s + (p ? p.price * q : 0);
    }, 0);
  }
  function updateCartBadge() { $('#cartCount').textContent = cartCount(); }

  function renderCart() {
    const body = $('#cartItems');
    const ids = Object.keys(state.cart);
    if (!ids.length) {
      body.innerHTML = `<div class="cart-empty">🛒<br>Корзина пуста.<br>Самое время выбрать снасть!</div>`;
    } else {
      body.innerHTML = ids.map((id) => {
        const p = PRODUCTS.find((x) => x.id === id); if (!p) return '';
        const q = state.cart[id];
        return `<div class="cart-item">
          <img class="cart-item__img" alt="${esc(p.name)}" src="${photoUrl(p)}" onerror="${imgFallback(p)}">
          <div class="cart-item__info">
            <div class="cart-item__name">${esc(p.name)}</div>
            <div class="cart-item__price">${fmt(p.price * q)}</div>
            <div class="cart-item__qty">
              <button class="qty-btn" data-dec="${id}">−</button><span>${q}</span><button class="qty-btn" data-inc="${id}">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-rm="${id}">Удалить</button>
        </div>`;
      }).join('');
      body.querySelectorAll('[data-inc]').forEach((el) => el.addEventListener('click', () => changeQty(el.dataset.inc, 1)));
      body.querySelectorAll('[data-dec]').forEach((el) => el.addEventListener('click', () => changeQty(el.dataset.dec, -1)));
      body.querySelectorAll('[data-rm]').forEach((el) => el.addEventListener('click', () => removeFromCart(el.dataset.rm)));
    }
    $('#cartTotal').textContent = fmt(cartTotal());
  }
  function openCart() { $('#cartDrawer').hidden = false; document.body.style.overflow = 'hidden'; renderCart(); }
  function closeCart() { $('#cartDrawer').hidden = true; document.body.style.overflow = ''; }

  function showOrderConfirm(no, total, items, email) {
    const rows = items.map((it) => `<div class="order__row"><span>${esc(it.name)} × ${it.qty}</span><b>${fmt(it.price * it.qty)}</b></div>`).join('');
    $('#modalCard').innerHTML = `
      <button class="modal__close" id="modalClose" aria-label="Закрыть">✕</button>
      <div class="confirm">
        <div class="confirm__check">✓</div>
        <h2 class="confirm__title">Заказ №${no} оформлен!</h2>
        <p class="confirm__sub">Спасибо за покупку в «РЫБОЛОВ» 🎣<br>Детали заказа отправлены на <b>${esc(email)}</b>.</p>
        <div class="confirm__box">${rows}<div class="order__row order__row--total"><span>Итого</span><b>${fmt(total)}</b></div></div>
        <p class="confirm__demo">📧 Это демо-версия: письмо с деталями «уходит» на почту условно, реальная оплата не списывается.</p>
        <button class="btn btn--primary btn--block" id="confirmOk">Отлично!</button>
      </div>`;
    $('#productModal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#modalClose').addEventListener('click', closeModal);
    $('#confirmOk').addEventListener('click', closeModal);
  }

  function checkout() {
    if (!cartCount()) { showToast('Корзина пуста'); return; }
    const total = cartTotal();
    const items = Object.entries(state.cart).map(([id, q]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return { id, name: p ? p.name : id, qty: q, price: p ? p.price : 0 };
    });
    const orderNo = Math.floor(100000 + Math.random() * 900000);
    const email = state.user ? state.user.email : 'указанную почту';
    if (state.user) {
      const users = loadJSON(LS.users, {});
      const u = users[state.user.email];
      u.orders = u.orders || [];
      u.orders.unshift({ no: orderNo, date: new Date().toISOString(), total, items });
      saveUsers(users); state.user = u;
    }
    state.cart = {}; saveCart(); updateCartBadge();
    closeCart();
    showOrderConfirm(orderNo, total, items, email);
    showToast(`Заказ №${orderNo} оформлен! 🎣`);
  }

  /* ---------- Личный кабинет ---------- */
  function openAccount() { renderAccount(); $('#accountModal').hidden = false; document.body.style.overflow = 'hidden'; }
  function closeAccount() { $('#accountModal').hidden = true; document.body.style.overflow = ''; }

  let authTab = 'login';
  function renderAccount() {
    const card = $('#accountCard');
    if (state.user) {
      const orders = (state.user.orders || []);
      const favCount = state.fav.length;
      const ordersHtml = orders.length ? orders.map((o) => {
        const d = new Date(o.date);
        const rows = o.items.map((it) => `<div class="order__row"><span>${esc(it.name)} × ${it.qty}</span><b>${fmt(it.price * it.qty)}</b></div>`).join('');
        return `<div class="order">
          <div class="order__head"><b>Заказ от ${d.toLocaleDateString('ru-RU')}</b><span>${fmt(o.total)}</span></div>
          ${rows}
        </div>`;
      }).join('') : `<p class="account__empty">Заказов пока нет. Загляните в каталог 🎣</p>`;
      card.innerHTML = `
        <button class="modal__close" id="accountClose" aria-label="Закрыть">✕</button>
        <div class="account">
          <div class="account__head">
            <div class="account__ava">${esc((state.user.name || '?')[0].toUpperCase())}</div>
            <div>
              <h2 class="account__name">${esc(state.user.name)}</h2>
              <p class="account__email">${esc(state.user.email)}</p>
            </div>
          </div>
          <div class="account__stats">
            <div><b>${orders.length}</b><span>заказов</span></div>
            <div><b>${favCount}</b><span>в избранном</span></div>
            <div><b>${orders.reduce((s, o) => s + o.total, 0).toLocaleString('ru-RU')} ₽</b><span>на снасти</span></div>
          </div>
          <h3 class="account__subtitle">История заказов</h3>
          <div class="account__orders">${ordersHtml}</div>
          <button class="btn btn--dark btn--block" id="logoutBtn">Выйти из аккаунта</button>
        </div>`;
      $('#logoutBtn').addEventListener('click', logout);
    } else {
      card.innerHTML = `
        <button class="modal__close" id="accountClose" aria-label="Закрыть">✕</button>
        <div class="auth">
          <div class="auth__brand"><span class="logo__icon">🎣</span><b>Личный кабинет РЫБОЛОВ</b></div>
          <div class="auth__tabs">
            <button class="auth__tab ${authTab === 'login' ? 'is-active' : ''}" data-tab="login">Вход</button>
            <button class="auth__tab ${authTab === 'register' ? 'is-active' : ''}" data-tab="register">Регистрация</button>
          </div>
          <form class="auth__form" id="authForm">
            ${authTab === 'register' ? `<label class="field field--v"><span class="field__label">Имя</span><input class="input" id="authName" required placeholder="Как вас зовут?"></label>` : ''}
            <label class="field field--v"><span class="field__label">Email</span><input class="input" id="authEmail" type="email" required placeholder="you@mail.ru"></label>
            <label class="field field--v"><span class="field__label">Пароль</span><input class="input" id="authPass" type="password" required minlength="4" placeholder="минимум 4 символа"></label>
            <button class="btn btn--primary btn--block" type="submit">${authTab === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
          </form>
          <p class="auth__note">🔒 Демо-режим: данные хранятся только в вашем браузере.</p>
        </div>`;
      card.querySelectorAll('.auth__tab').forEach((el) => el.addEventListener('click', () => { authTab = el.dataset.tab; renderAccount(); }));
      $('#authForm').addEventListener('submit', (e) => { e.preventDefault(); authTab === 'login' ? doLogin() : doRegister(); });
    }
    $('#accountClose').addEventListener('click', closeAccount);
  }

  function updateAccountLabel() { $('#accountLabel').textContent = state.user ? (state.user.name || 'Кабинет').split(' ')[0] : 'Войти'; }

  function doRegister() {
    const name = $('#authName').value.trim();
    const email = $('#authEmail').value.trim().toLowerCase();
    const pass = $('#authPass').value;
    if (!name || !email || pass.length < 4) return;
    const users = loadJSON(LS.users, {});
    if (users[email]) { showToast('Такой email уже зарегистрирован'); authTab = 'login'; renderAccount(); return; }
    users[email] = { name, email, password: pass, orders: [] };
    saveUsers(users);
    localStorage.setItem(LS.session, email);
    state.user = users[email];
    updateAccountLabel(); renderAccount();
    showToast(`Добро пожаловать, ${name}! 🎣`);
  }
  function doLogin() {
    const email = $('#authEmail').value.trim().toLowerCase();
    const pass = $('#authPass').value;
    const users = loadJSON(LS.users, {});
    if (!users[email] || users[email].password !== pass) { showToast('Неверный email или пароль'); return; }
    localStorage.setItem(LS.session, email);
    state.user = users[email];
    updateAccountLabel(); renderAccount();
    showToast(`С возвращением, ${users[email].name}!`);
  }
  function logout() {
    localStorage.removeItem(LS.session);
    state.user = null;
    updateAccountLabel(); renderAccount();
    showToast('Вы вышли из аккаунта');
  }

  /* ---------- Тост ---------- */
  let toastTimer;
  function showToast(msg) {
    const t = $('#toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2400);
  }

  /* ---------- Поиск ---------- */
  function runSearch() {
    state.query = $('#searchInput').value.trim();
    if (state.query) { state.category = 'all'; state.favOnly = false; }
    renderFilters(); renderProducts();
    $('#catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Инициализация ---------- */
  function init() {
    renderHits();
    renderCategories();
    renderFilters();
    renderBrandFilter();
    renderProducts();
    updateCartBadge();
    $('#favCount').textContent = state.fav.length;
    updateAccountLabel();
    $('#statCount').textContent = PRODUCTS.filter((p) => p.stock).length;

    let searchTimer;
    $('#searchInput').addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.query = $('#searchInput').value.trim();
        if (state.query) { state.category = 'all'; state.favOnly = false; }
        renderFilters(); renderProducts();
      }, 250);
    });
    $('#searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });
    $('#searchBtn').addEventListener('click', runSearch);

    $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; renderProducts(); });
    $('#brandFilter').addEventListener('change', (e) => { state.brand = e.target.value; renderProducts(); });
    $('#inStock').addEventListener('change', (e) => { state.inStock = e.target.checked; renderProducts(); });
    $('#priceMin').addEventListener('input', (e) => { state.priceMin = e.target.value ? +e.target.value : null; renderProducts(); });
    $('#priceMax').addEventListener('input', (e) => { state.priceMax = e.target.value ? +e.target.value : null; renderProducts(); });

    const resetAll = () => {
      Object.assign(state, { category: 'all', query: '', sort: 'popular', brand: 'all', priceMin: null, priceMax: null, inStock: false, favOnly: false });
      $('#searchInput').value = ''; $('#sortSelect').value = 'popular'; $('#brandFilter').value = 'all';
      $('#priceMin').value = ''; $('#priceMax').value = ''; $('#inStock').checked = false;
      renderFilters(); renderProducts();
    };
    $('#resetFilters').addEventListener('click', resetAll);
    $('#resetBtn').addEventListener('click', resetAll);

    // Избранное
    $('#favToggle').addEventListener('click', () => {
      state.favOnly = !state.favOnly;
      if (state.favOnly) { state.category = 'all'; state.query = ''; $('#searchInput').value = ''; }
      renderFilters(); renderProducts();
      $('#catalog').scrollIntoView({ behavior: 'smooth' });
      if (state.favOnly && !state.fav.length) showToast('В избранном пока пусто — жмите ♥ на товарах');
    });

    // Корзина
    $('#cartToggle').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#cartOverlay').addEventListener('click', closeCart);
    $('#checkoutBtn').addEventListener('click', checkout);

    // Модалки
    $('#modalOverlay').addEventListener('click', closeModal);
    $('#accountToggle').addEventListener('click', openAccount);
    $('#accountOverlay').addEventListener('click', closeAccount);

    // Ссылки категорий в подвале
    document.querySelectorAll('.footer__col a[data-cat]').forEach((el) =>
      el.addEventListener('click', () => selectCategory(el.dataset.cat)));

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCart(); closeModal(); closeAccount(); } });

    // Сжатие шапки
    const header = $('#siteHeader');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
