/* ===== Магазин «РЫБОЛОВ» — клиентская логика ===== */
(function () {
  'use strict';

  const state = {
    category: 'all',
    query: '',
    sort: 'popular',
    cart: loadCart(),
  };

  const $ = (sel) => document.querySelector(sel);
  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';

  // onerror-фолбэк на фирменную заглушку, если файла фото нет.
  const imgFallback = (p) => `this.onerror=null;this.src='${productFallback(p)}'`;

  /* ---------- Разметка карточки товара (общая) ---------- */
  function cardMarkup(p) {
    const discount = p.old > p.price
      ? `<span class="card__badge">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : '';
    const hit = p.rating >= 4.9 && p.stock ? `<span class="card__badge card__badge--hit">Хит</span>` : '';
    const out = !p.stock ? `<span class="card__badge card__badge--out">Нет в наличии</span>` : '';
    const topBadge = discount || hit;
    return `<article class="card" data-id="${p.id}">
      <div class="card__media" data-open="${p.id}">
        <img class="card__img" loading="lazy" alt="${p.name}"
             src="${photoUrl(p)}" onerror="${imgFallback(p)}">
        ${topBadge}${out}
      </div>
      <div class="card__body">
        <span class="card__brand">${p.brand}</span>
        <h3 class="card__name" data-open="${p.id}">${p.name}</h3>
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
    container.querySelectorAll('[data-open]').forEach((el) =>
      el.addEventListener('click', () => openModal(el.dataset.open)));
  }

  /* ---------- Хиты продаж ---------- */
  function renderHits() {
    const grid = $('#hitsGrid');
    if (!grid) return;
    const hits = PRODUCTS
      .filter((p) => p.stock)
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

    grid.querySelectorAll('.cat-card').forEach((el) => {
      el.addEventListener('click', () => {
        state.category = el.dataset.cat;
        state.query = '';
        $('#searchInput').value = '';
        renderFilters();
        renderProducts();
        $('#catalog').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ---------- Фильтры (чипы) ---------- */
  function renderFilters() {
    const filters = $('#filters');
    const items = [{ id: 'all', name: 'Все' }, ...CATEGORIES];
    filters.innerHTML = items.map((c) =>
      `<button class="chip ${state.category === c.id ? 'is-active' : ''}" data-cat="${c.id}">${c.name}</button>`
    ).join('');
    filters.querySelectorAll('.chip').forEach((el) => {
      el.addEventListener('click', () => {
        state.category = el.dataset.cat;
        renderFilters();
        renderProducts();
      });
    });
  }

  /* ---------- Каталог ---------- */
  function getVisible() {
    let list = PRODUCTS.slice();
    if (state.category !== 'all') list = list.filter((p) => p.cat === state.category);
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

    const catName = state.category === 'all'
      ? 'Все категории'
      : (CATEGORIES.find((c) => c.id === state.category) || {}).name;
    $('#catalogMeta').textContent =
      `${catName} · найдено товаров: ${list.length}${state.query ? ` · запрос «${state.query}»` : ''}`;

    wrap.innerHTML = list.map(cardMarkup).join('');
    wireCards(wrap);
  }

  /* ---------- Модалка товара ---------- */
  function openModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    const specs = Object.entries(p.specs)
      .map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join('');
    $('#modalCard').innerHTML = `
      <button class="modal__close" id="modalClose" aria-label="Закрыть">✕</button>
      <div class="modal__grid">
        <img class="modal__img" alt="${p.name}" src="${photoUrl(p)}" onerror="${imgFallback(p)}">
        <div class="modal__info">
          <span class="modal__brand">${p.brand}</span>
          <h2 class="modal__title">${p.name}</h2>
          <div class="card__rating">★ ${p.rating.toFixed(1)} · ${p.stock ? 'В наличии' : 'Под заказ'}</div>
          <ul class="modal__specs">${specs}</ul>
          <div class="modal__price">${fmt(p.price)} ${p.old > p.price ? `<s>${fmt(p.old)}</s>` : ''}</div>
          <button class="btn btn--primary btn--block" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>
            ${p.stock ? '🛒 Добавить в корзину' : 'Нет в наличии'}
          </button>
        </div>
      </div>`;
    $('#productModal').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#modalClose').addEventListener('click', closeModal);
    const addBtn = $('#modalCard [data-add]');
    if (addBtn) addBtn.addEventListener('click', () => { addToCart(id); closeModal(); });
  }
  function closeModal() {
    $('#productModal').hidden = true;
    document.body.style.overflow = '';
  }

  /* ---------- Корзина ---------- */
  function loadCart() {
    try { return JSON.parse(localStorage.getItem('rybolov_cart')) || {}; }
    catch { return {}; }
  }
  function saveCart() { localStorage.setItem('rybolov_cart', JSON.stringify(state.cart)); }

  function addToCart(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p || !p.stock) return;
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart(); updateCartBadge(); renderCart();
    showToast(`«${p.name.slice(0, 34)}…» — в корзине`);
  }
  function changeQty(id, delta) {
    if (!state.cart[id]) return;
    state.cart[id] += delta;
    if (state.cart[id] <= 0) delete state.cart[id];
    saveCart(); updateCartBadge(); renderCart();
  }
  function removeFromCart(id) { delete state.cart[id]; saveCart(); updateCartBadge(); renderCart(); }

  function cartCount() { return Object.values(state.cart).reduce((a, b) => a + b, 0); }
  function cartTotal() {
    return Object.entries(state.cart).reduce((sum, [id, q]) => {
      const p = PRODUCTS.find((x) => x.id === id);
      return sum + (p ? p.price * q : 0);
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
        const p = PRODUCTS.find((x) => x.id === id);
        if (!p) return '';
        const q = state.cart[id];
        return `<div class="cart-item">
          <img class="cart-item__img" alt="${p.name}" src="${photoUrl(p)}" onerror="${imgFallback(p)}">
          <div class="cart-item__info">
            <div class="cart-item__name">${p.name}</div>
            <div class="cart-item__price">${fmt(p.price * q)}</div>
            <div class="cart-item__qty">
              <button class="qty-btn" data-dec="${id}">−</button>
              <span>${q}</span>
              <button class="qty-btn" data-inc="${id}">+</button>
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

  /* ---------- Тост ---------- */
  let toastTimer;
  function showToast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 2400);
  }

  /* ---------- Поиск ---------- */
  function runSearch() {
    state.query = $('#searchInput').value.trim();
    if (state.query) state.category = 'all';
    renderFilters();
    renderProducts();
    $('#catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Инициализация ---------- */
  function init() {
    renderHits();
    renderCategories();
    renderFilters();
    renderProducts();
    updateCartBadge();
    $('#statCount').textContent = PRODUCTS.filter((p) => p.stock).length;

    let searchTimer;
    $('#searchInput').addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.query = $('#searchInput').value.trim();
        if (state.query) state.category = 'all';
        renderFilters();
        renderProducts();
      }, 250);
    });
    $('#searchInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') runSearch(); });
    $('#searchBtn').addEventListener('click', runSearch);

    $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; renderProducts(); });

    $('#resetBtn').addEventListener('click', () => {
      state.category = 'all'; state.query = ''; state.sort = 'popular';
      $('#searchInput').value = ''; $('#sortSelect').value = 'popular';
      renderFilters(); renderProducts();
    });

    $('#cartToggle').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#cartOverlay').addEventListener('click', closeCart);
    $('#modalOverlay').addEventListener('click', closeModal);
    $('#checkoutBtn').addEventListener('click', () => {
      if (!cartCount()) { showToast('Корзина пуста'); return; }
      showToast(`Заказ на ${fmt(cartTotal())} оформлен! Менеджер свяжется с вами 📞`);
      state.cart = {}; saveCart(); updateCartBadge(); renderCart();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeModal(); }
    });

    // Сжатие шапки при прокрутке
    const header = $('#siteHeader');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
