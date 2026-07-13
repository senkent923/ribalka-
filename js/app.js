/* ===== Магазин «РЫБОЛОВ» — общая логика (работает на всех страницах) ===== */
(function () {
  'use strict';

  const LS = { cart: 'rybolov_cart', fav: 'rybolov_fav', users: 'rybolov_users', session: 'rybolov_session' };

  const state = {
    category: 'all', query: '', sort: 'popular', brand: 'all',
    priceMin: null, priceMax: null, inStock: false, favOnly: false,
    cart: loadJSON(LS.cart, {}), fav: loadJSON(LS.fav, []), user: loadSession(),
  };

  const $ = (s) => document.querySelector(s);
  const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const imgFallback = (p) => `this.onerror=null;this.src='${productFallback(p)}'`;

  function loadJSON(k, f) { try { return JSON.parse(localStorage.getItem(k)) || f; } catch { return f; } }
  function loadSession() { const e = localStorage.getItem(LS.session); if (!e) return null; return loadJSON(LS.users, {})[e] || null; }
  function saveUsers(u) { localStorage.setItem(LS.users, JSON.stringify(u)); }
  function declProducts(n) { const a = n % 10, b = n % 100; if (a === 1 && b !== 11) return 'товар'; if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return 'товара'; return 'товаров'; }

  /* ---------- Карточка товара ---------- */
  function cardMarkup(p) {
    const disc = p.old > p.price ? `<span class="card__badge">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : '';
    const hit = p.rating >= 4.9 && p.stock ? `<span class="card__badge card__badge--hit">Хит</span>` : '';
    const out = !p.stock ? `<span class="card__badge card__badge--out">Нет в наличии</span>` : '';
    const fav = state.fav.includes(p.id);
    const href = `product.html?id=${p.id}`;
    return `<article class="card" data-id="${p.id}">
      <button class="card__fav ${fav ? 'is-active' : ''}" data-fav="${p.id}" aria-label="В избранное">${window.RB_ICON('heart')}</button>
      <a class="card__media" href="${href}">
        <img class="card__img" loading="lazy" alt="${esc(p.name)}" src="${photoUrl(p)}" onerror="${imgFallback(p)}">
        ${disc || hit}${out}
      </a>
      <div class="card__body">
        <span class="card__brand">${esc(p.brand)}</span>
        <a class="card__name" href="${href}">${esc(p.name)}</a>
        <div class="card__rating">★ ${p.rating.toFixed(1)} <span>· ${p.stock ? 'в наличии' : 'под заказ'}</span></div>
        <div class="card__price-row"><span class="card__price">${fmt(p.price)}</span>${p.old > p.price ? `<span class="card__old">${fmt(p.old)}</span>` : ''}</div>
        <button class="card__btn" data-add="${p.id}" ${p.stock ? '' : 'disabled'}>${p.stock ? 'В корзину' : 'Нет в наличии'}</button>
      </div>
    </article>`;
  }
  function wireCards(c) {
    c.querySelectorAll('[data-add]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); addToCart(el.dataset.add); }));
    c.querySelectorAll('[data-fav]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleFav(el.dataset.fav); }));
  }

  /* ---------- Хиты (главная) ---------- */
  function renderHits() {
    const grid = $('#hitsGrid'); if (!grid) return;
    const hits = PRODUCTS.filter((p) => p.stock)
      .sort((a, b) => (b.rating - a.rating) || ((b.img ? 1 : 0) - (a.img ? 1 : 0)) || (b.price - a.price)).slice(0, 4);
    grid.innerHTML = hits.map(cardMarkup).join(''); wireCards(grid);
  }

  /* ---------- Категории (главная) ---------- */
  function renderCategories() {
    const grid = $('#catsGrid'); if (!grid) return;
    grid.innerHTML = CATEGORIES.map((c) => {
      const inCat = PRODUCTS.filter((p) => p.cat === c.id);
      const cover = inCat.find((p) => p.img) || inCat[0];
      return `<a class="cat-card" href="catalog.html?cat=${c.id}">
        <div class="cat-card__media"><img loading="lazy" alt="${esc(c.name)}" src="${photoUrl(cover)}" onerror="${imgFallback(cover)}"></div>
        <div class="cat-card__foot">
          <div><div class="cat-card__name">${c.name}</div><div class="cat-card__count">${inCat.length} ${declProducts(inCat.length)}</div></div>
          <span class="cat-card__arrow">→</span>
        </div>
      </a>`;
    }).join('');
  }

  /* ---------- Акции (sale.html) ---------- */
  function renderSale() {
    const grid = $('#saleGrid'); if (!grid) return;
    const list = PRODUCTS.filter((p) => p.old > p.price)
      .sort((a, b) => (1 - a.price / a.old < 1 - b.price / b.old ? 1 : -1));
    grid.innerHTML = list.map(cardMarkup).join(''); wireCards(grid);
    if ($('#saleCount')) $('#saleCount').textContent = list.length;
  }

  /* ---------- Бренды (brands.html) ---------- */
  function renderBrands() {
    const grid = $('#brandsGrid'); if (!grid) return;
    const brands = [...new Set(PRODUCTS.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'ru'));
    grid.innerHTML = brands.map((brand) => {
      const items = PRODUCTS.filter((p) => p.brand === brand);
      const cover = items.find((p) => p.img) || items[0];
      return `<a class="cat-card" href="catalog.html?brand=${encodeURIComponent(brand)}">
        <div class="cat-card__media"><img loading="lazy" alt="${esc(brand)}" src="${photoUrl(cover)}" onerror="${imgFallback(cover)}"></div>
        <div class="cat-card__foot">
          <div><div class="cat-card__name">${esc(brand)}</div><div class="cat-card__count">${items.length} ${declProducts(items.length)}</div></div>
          <span class="cat-card__arrow">→</span>
        </div>
      </a>`;
    }).join('');
    if ($('#brandsCount')) $('#brandsCount').textContent = brands.length;
  }

  /* ---------- Каталог ---------- */
  function renderTabs() {
    const tabs = $('#filters'); if (!tabs) return;
    const items = [{ id: 'all', name: 'Все товары' }, ...CATEGORIES];
    tabs.innerHTML = items.map((c) =>
      `<button class="tab ${state.category === c.id && !state.favOnly ? 'is-active' : ''}" data-cat="${c.id}">${c.name}</button>`).join('');
    tabs.querySelectorAll('.tab').forEach((el) => el.addEventListener('click', () => {
      state.category = el.dataset.cat; state.favOnly = false; renderTabs(); renderProducts();
    }));
  }
  function renderBrandFilter() {
    const sel = $('#brandFilter'); if (!sel) return;
    const brands = [...new Set(PRODUCTS.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, 'ru'));
    sel.innerHTML = `<option value="all">Все бренды</option>` + brands.map((b) => `<option value="${esc(b)}">${esc(b)}</option>`).join('');
  }
  function getVisible() {
    let list = PRODUCTS.slice();
    if (state.favOnly) list = list.filter((p) => state.fav.includes(p.id));
    if (state.category !== 'all') list = list.filter((p) => p.cat === state.category);
    if (state.brand !== 'all') list = list.filter((p) => p.brand === state.brand);
    if (state.inStock) list = list.filter((p) => p.stock);
    if (state.priceMin != null) list = list.filter((p) => p.price >= state.priceMin);
    if (state.priceMax != null) list = list.filter((p) => p.price <= state.priceMax);
    if (state.query) { const q = state.query.toLowerCase(); list = list.filter((p) => (p.name + ' ' + p.brand).toLowerCase().includes(q)); }
    switch (state.sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: list.sort((a, b) => b.rating * (b.stock ? 1 : .5) - a.rating * (a.stock ? 1 : .5));
    }
    return list;
  }
  function renderProducts() {
    const wrap = $('#products'); if (!wrap) return;
    const list = getVisible();
    if ($('#empty')) $('#empty').hidden = list.length > 0;
    const scope = state.favOnly ? 'Избранное' : state.category === 'all' ? 'Все категории' : (CATEGORIES.find((c) => c.id === state.category) || {}).name;
    const extra = [];
    if (state.brand !== 'all') extra.push(`бренд «${state.brand}»`);
    if (state.inStock) extra.push('в наличии');
    if (state.priceMin != null || state.priceMax != null) extra.push(`цена ${state.priceMin ?? 0}–${state.priceMax ?? '∞'} ₽`);
    if (state.query) extra.push(`запрос «${state.query}»`);
    if ($('#catalogMeta')) $('#catalogMeta').textContent = `${scope} · найдено: ${list.length}${extra.length ? ' · ' + extra.join(' · ') : ''}`;
    wrap.innerHTML = list.map(cardMarkup).join(''); wireCards(wrap);
  }

  /* ---------- Страница товара (product.html?id=) ---------- */
  function renderProductPage() {
    const wrap = $('#productPage'); if (!wrap) return;
    const id = new URLSearchParams(location.search).get('id');
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) {
      wrap.innerHTML = `<div class="notfound"><h1>Товар не найден</h1><p>Возможно, он больше не в каталоге.</p><a class="btn btn--primary" href="catalog.html">В каталог →</a></div>`;
      return;
    }
    document.title = `${p.name} — РЫБОЛОВ`;
    const cat = CATEGORIES.find((c) => c.id === p.cat) || {};
    const fav = state.fav.includes(p.id);
    const disc = p.old > p.price ? `<span class="card__badge">−${Math.round((1 - p.price / p.old) * 100)}%</span>` : '';
    const specs = Object.entries(p.specs).map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join('');
    wrap.innerHTML = `
      <nav class="crumbs"><a href="index.html">Главная</a> <span>/</span> <a href="catalog.html">Каталог</a> <span>/</span> <a href="catalog.html?cat=${p.cat}">${esc(cat.name || '')}</a> <span>/</span> ${esc(p.name)}</nav>
      <div class="product">
        <div class="product__media"><img src="${photoUrl(p)}" alt="${esc(p.name)}" onerror="${imgFallback(p)}">${disc}</div>
        <div class="product__info">
          <span class="product__brand">${esc(p.brand)}</span>
          <h1 class="product__title">${esc(p.name)}</h1>
          <div class="product__rating">★ ${p.rating.toFixed(1)} <span>· ${p.stock ? 'в наличии' : 'под заказ'}</span></div>
          <div class="product__price">${fmt(p.price)} ${p.old > p.price ? `<s>${fmt(p.old)}</s>` : ''}</div>
          <p class="product__desc">${esc(productDesc(p))}</p>
          <ul class="product__specs">${specs}</ul>
          <div class="product__actions">
            <button class="btn btn--primary" id="ppAdd" ${p.stock ? '' : 'disabled'}>В корзину</button>
            <button class="btn btn--fav ${fav ? 'is-active' : ''}" id="ppFav">${fav ? 'В избранном' : 'В избранное'}</button>
          </div>
          <div class="product__perks">
            <span>${window.RB_ICON('truck')} Доставка по России за 1–3 дня</span>
            <span>${window.RB_ICON('shield')} Оригинал с гарантией производителя</span>
            <span>${window.RB_ICON('card')} Оплата картой онлайн или при получении</span>
          </div>
        </div>
      </div>`;
    $('#ppAdd')?.addEventListener('click', () => addToCart(p.id));
    $('#ppFav')?.addEventListener('click', () => { toggleFav(p.id); renderProductPage(); });
    const rel = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    if (rel.length && $('#relatedGrid')) { $('#relatedGrid').innerHTML = rel.map(cardMarkup).join(''); wireCards($('#relatedGrid')); $('#relatedSec').hidden = false; }
  }
  function closeModal() { $('#productModal').hidden = true; document.body.style.overflow = ''; }

  /* ---------- Избранное ---------- */
  function toggleFav(id) {
    const i = state.fav.indexOf(id);
    if (i >= 0) state.fav.splice(i, 1); else state.fav.push(id);
    localStorage.setItem(LS.fav, JSON.stringify(state.fav));
    updateFavBadge(); renderHits(); renderProducts();
    showToast(i >= 0 ? 'Удалено из избранного' : 'Добавлено в избранное');
  }
  function updateFavBadge() { const el = $('#favCount'); if (el) el.textContent = state.fav.length; }

  /* ---------- Корзина ---------- */
  function saveCart() { localStorage.setItem(LS.cart, JSON.stringify(state.cart)); }
  function addToCart(id) {
    const p = PRODUCTS.find((x) => x.id === id); if (!p || !p.stock) return;
    state.cart[id] = (state.cart[id] || 0) + 1; saveCart(); updateCartBadge(); renderCart();
    showToast(`«${p.name.slice(0, 34)}…» — в корзине`);
  }
  function changeQty(id, d) { if (!state.cart[id]) return; state.cart[id] += d; if (state.cart[id] <= 0) delete state.cart[id]; saveCart(); updateCartBadge(); renderCart(); }
  function removeFromCart(id) { delete state.cart[id]; saveCart(); updateCartBadge(); renderCart(); }
  function cartCount() { return Object.values(state.cart).reduce((a, b) => a + b, 0); }
  function cartTotal() { return Object.entries(state.cart).reduce((s, [id, q]) => { const p = PRODUCTS.find((x) => x.id === id); return s + (p ? p.price * q : 0); }, 0); }
  function updateCartBadge() { const el = $('#cartCount'); if (el) el.textContent = cartCount(); }
  function renderCart() {
    const body = $('#cartItems'); if (!body) return;
    const ids = Object.keys(state.cart);
    if (!ids.length) body.innerHTML = `<div class="cart-empty"><span class="cart-empty__ico">${window.RB_ICON('cart')}</span>Корзина пуста.<br>Самое время выбрать снасть!</div>`;
    else {
      body.innerHTML = ids.map((id) => {
        const p = PRODUCTS.find((x) => x.id === id); if (!p) return '';
        const q = state.cart[id];
        return `<div class="cart-item">
          <img class="cart-item__img" alt="${esc(p.name)}" src="${photoUrl(p)}" onerror="${imgFallback(p)}">
          <div class="cart-item__info"><div class="cart-item__name">${esc(p.name)}</div><div class="cart-item__price">${fmt(p.price * q)}</div>
            <div class="cart-item__qty"><button class="qty-btn" data-dec="${id}">−</button><span>${q}</span><button class="qty-btn" data-inc="${id}">+</button></div></div>
          <button class="cart-item__remove" data-rm="${id}">Удалить</button></div>`;
      }).join('');
      body.querySelectorAll('[data-inc]').forEach((el) => el.addEventListener('click', () => changeQty(el.dataset.inc, 1)));
      body.querySelectorAll('[data-dec]').forEach((el) => el.addEventListener('click', () => changeQty(el.dataset.dec, -1)));
      body.querySelectorAll('[data-rm]').forEach((el) => el.addEventListener('click', () => removeFromCart(el.dataset.rm)));
    }
    if ($('#cartTotal')) $('#cartTotal').textContent = fmt(cartTotal());
  }
  function openCart() { $('#cartDrawer').hidden = false; document.body.style.overflow = 'hidden'; renderCart(); }
  function closeCart() { $('#cartDrawer').hidden = true; document.body.style.overflow = ''; }
  const DELIVERY = {
    pickup:  { label: 'Самовывоз — Лиговский пр-т, 50', price: 0,   addr: false },
    courier: { label: 'Курьер по Санкт-Петербургу',      price: 300, addr: true },
    cdek:    { label: 'СДЭК — по России',                 price: 350, addr: true },
    post:    { label: 'Почта России',                     price: 250, addr: true },
  };

  function openProductModal() { $('#productModal').hidden = false; document.body.style.overflow = 'hidden'; }

  function checkout() {
    if (!cartCount()) { showToast('Корзина пуста'); return; }
    closeCart();
    if (!state.user) { renderAuthGate(); return; }
    renderCheckout();
  }

  // Гость: оформить заказ можно только после регистрации
  function renderAuthGate() {
    $('#modalCard').innerHTML = `
      <button class="modal__close" id="modalClose" aria-label="Закрыть">✕</button>
      <div class="confirm">
        <div class="confirm__check confirm__check--lock">${window.RB_ICON('lock')}</div>
        <h2 class="confirm__title">Сначала войдите в аккаунт</h2>
        <p class="confirm__sub">Оформить заказ можно только зарегистрированным покупателям.<br>Это займёт минуту — корзина сохранится.</p>
        <a href="account.html" class="btn btn--primary btn--block">Войти или зарегистрироваться →</a>
      </div>`;
    openProductModal();
    $('#modalClose').addEventListener('click', closeModal);
  }

  // Оформление: доставка → оплата → карта
  function renderCheckout() {
    const goods = cartTotal();
    const delOpts = Object.entries(DELIVERY).map(([k, d], i) =>
      `<label class="opt"><input type="radio" name="delivery" value="${k}" ${i === 0 ? 'checked' : ''}><span class="opt__main">${d.label}</span><span class="opt__price">${d.price ? fmt(d.price) : 'бесплатно'}</span></label>`).join('');
    $('#modalCard').innerHTML = `
      <button class="modal__close" id="modalClose" aria-label="Закрыть">✕</button>
      <div class="checkout">
        <h2 class="checkout__title">Оформление заказа</h2>
        <form id="checkoutForm" novalidate>
          <div class="checkout__block">
            <h3 class="checkout__h">1 · Способ доставки</h3>
            <div class="opts">${delOpts}</div>
            <div class="checkout__addr" id="addrBlock">
              <label class="field field--v"><span class="field__label">Город</span><input class="input" id="ckCity" placeholder="Санкт-Петербург"></label>
              <label class="field field--v"><span class="field__label">Адрес или пункт выдачи</span><input class="input" id="ckAddr" placeholder="улица, дом, кв. / № пункта выдачи"></label>
            </div>
          </div>
          <div class="checkout__block">
            <h3 class="checkout__h">2 · Оплата</h3>
            <div class="opts">
              <label class="opt"><input type="radio" name="pay" value="online" checked><span class="opt__main">Онлайн картой сейчас</span></label>
              <label class="opt"><input type="radio" name="pay" value="delivery"><span class="opt__main">Картой при получении</span></label>
            </div>
          </div>
          <div class="checkout__block" id="cardBlock">
            <h3 class="checkout__h">3 · Данные карты</h3>
            <label class="field field--v"><span class="field__label">Номер карты</span><input class="input" id="ckCard" inputmode="numeric" maxlength="19" placeholder="0000 0000 0000 0000"></label>
            <div class="feedback__row">
              <label class="field field--v"><span class="field__label">Срок (ММ/ГГ)</span><input class="input" id="ckExp" maxlength="5" placeholder="09/28"></label>
              <label class="field field--v"><span class="field__label">CVC</span><input class="input" id="ckCvc" inputmode="numeric" maxlength="3" placeholder="000"></label>
            </div>
            <label class="field field--v"><span class="field__label">Имя на карте</span><input class="input" id="ckHolder" placeholder="IVAN IVANOV"></label>
          </div>
          <div class="checkout__summary">
            <div><span>Товары</span><b>${fmt(goods)}</b></div>
            <div><span>Доставка</span><b id="ckDelivery">бесплатно</b></div>
            <div class="checkout__grand"><span>Итого к оплате</span><b id="ckTotal">${fmt(goods)}</b></div>
          </div>
          <button class="btn btn--primary btn--block" type="submit" id="ckSubmit">Оплатить ${fmt(goods)}</button>
          <p class="confirm__demo">Демо: данные карты не сохраняются и не списываются — в истории останутся только последние 4 цифры.</p>
        </form>
      </div>`;
    openProductModal();
    $('#modalClose').addEventListener('click', closeModal);

    const form = $('#checkoutForm');
    const recalc = () => {
      const d = DELIVERY[form.delivery.value];
      $('#addrBlock').style.display = d.addr ? '' : 'none';
      const online = form.pay.value === 'online';
      $('#cardBlock').style.display = online ? '' : 'none';   // карта только при онлайн-оплате
      $('#ckDelivery').textContent = d.price ? fmt(d.price) : 'бесплатно';
      const grand = goods + d.price;
      $('#ckTotal').textContent = fmt(grand);
      $('#ckSubmit').textContent = online ? `Оплатить ${fmt(grand)}` : `Оформить заказ · ${fmt(grand)}`;
    };
    form.querySelectorAll('input[name=delivery], input[name=pay]').forEach((el) => el.addEventListener('change', recalc));
    $('#ckCard').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
    $('#ckExp').addEventListener('input', (e) => { let v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2); e.target.value = v; });
    $('#ckCvc').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3); });
    recalc();
    form.addEventListener('submit', submitCheckout);
  }

  function submitCheckout(e) {
    e.preventDefault();
    const form = e.target;
    const d = DELIVERY[form.delivery.value];
    const pay = form.pay.value;
    let city = '', addr = '';
    if (d.addr) {
      city = $('#ckCity').value.trim(); addr = $('#ckAddr').value.trim();
      if (!city || !addr) { showToast('Укажите город и адрес доставки'); return; }
    }
    // Данные карты нужны только при онлайн-оплате
    let cardLast4 = '';
    if (pay === 'online') {
      const card = $('#ckCard').value.replace(/\s/g, '');
      const exp = $('#ckExp').value, cvc = $('#ckCvc').value, holder = $('#ckHolder').value.trim();
      if (card.length !== 16) { showToast('Введите 16 цифр номера карты'); return; }
      if (!/^\d{2}\/\d{2}$/.test(exp)) { showToast('Срок карты в формате ММ/ГГ'); return; }
      if (cvc.length !== 3) { showToast('CVC — 3 цифры'); return; }
      if (!holder) { showToast('Введите имя на карте'); return; }
      cardLast4 = card.slice(-4);
    }

    const goods = cartTotal();
    const items = Object.entries(state.cart).map(([id, q]) => { const p = PRODUCTS.find((x) => x.id === id); return { id, name: p ? p.name : id, qty: q, price: p ? p.price : 0 }; });
    const order = {
      no: Math.floor(100000 + Math.random() * 900000), date: new Date().toISOString(),
      goods, total: goods + d.price,
      delivery: { method: d.label, price: d.price, city, addr },
      payment: pay === 'online' ? 'Онлайн картой' : 'Оплата при получении',
      cardLast4, items,
    };
    const users = loadJSON(LS.users, {}); const u = users[state.user.email];
    u.orders = u.orders || []; u.orders.unshift(order); saveUsers(users); state.user = u;
    if ($('#accountView')) renderAccount();
    state.cart = {}; saveCart(); updateCartBadge();
    showOrderConfirm(order, state.user.email);
    showToast(`Заказ №${order.no} оформлен`);
  }

  function showOrderConfirm(order, email) {
    const rows = order.items.map((it) => `<div class="order__row"><span>${esc(it.name)} × ${it.qty}</span><b>${fmt(it.price * it.qty)}</b></div>`).join('');
    const paid = order.payment === 'Онлайн картой' ? `Оплачено картой •••• ${order.cardLast4}` : 'Оплата при получении';
    $('#modalCard').innerHTML = `
      <button class="modal__close" id="modalClose" aria-label="Закрыть">✕</button>
      <div class="confirm">
        <div class="confirm__check">✓</div>
        <h2 class="confirm__title">Заказ №${order.no} оформлен!</h2>
        <p class="confirm__sub">Спасибо за покупку в «РЫБОЛОВ».<br>Детали заказа отправлены на <b>${esc(email)}</b>.</p>
        <div class="confirm__box">
          ${rows}
          <div class="order__row"><span>Доставка · ${esc(order.delivery.method)}</span><b>${order.delivery.price ? fmt(order.delivery.price) : '0 ₽'}</b></div>
          ${order.delivery.addr ? `<div class="order__row"><span>Адрес</span><b>${esc(order.delivery.city)}, ${esc(order.delivery.addr)}</b></div>` : ''}
          <div class="order__row"><span>${paid}</span><b></b></div>
          <div class="order__row order__row--total"><span>Итого</span><b>${fmt(order.total)}</b></div>
        </div>
        <p class="confirm__demo">Демо-версия: письмо «уходит» на почту условно, реальная оплата не списывается.</p>
        <button class="btn btn--primary btn--block" id="confirmOk">Отлично!</button>
      </div>`;
    openProductModal();
    $('#modalClose').addEventListener('click', closeModal);
    $('#confirmOk').addEventListener('click', closeModal);
  }

  /* ---------- Личный кабинет (страница account.html) ---------- */
  let authTab = 'login';
  function renderAccount() {
    const card = $('#accountView'); if (!card) return;
    if (state.user) {
      const orders = state.user.orders || [];
      const ordersHtml = orders.length ? orders.map((o) => {
        const d = new Date(o.date);
        const rows = o.items.map((it) => `<div class="order__row"><span>${esc(it.name)} × ${it.qty}</span><b>${fmt(it.price * it.qty)}</b></div>`).join('');
        return `<div class="order"><div class="order__head"><b>Заказ №${o.no || ''} · ${d.toLocaleDateString('ru-RU')}</b><span>${fmt(o.total)}</span></div>${rows}</div>`;
      }).join('') : `<p class="account__empty">Заказов пока нет. Загляните в <a href="catalog.html">каталог</a>.</p>`;
      card.innerHTML = `
        <div class="account">
          <div class="account__head">
            <div class="account__ava">${esc((state.user.name || '?')[0].toUpperCase())}</div>
            <div><h2 class="account__name">${esc(state.user.name)}</h2><p class="account__email">${esc(state.user.email)}</p></div>
          </div>
          <div class="account__stats">
            <div><b>${orders.length}</b><span>заказов</span></div>
            <div><b>${state.fav.length}</b><span>в избранном</span></div>
            <div><b>${orders.reduce((s, o) => s + o.total, 0).toLocaleString('ru-RU')} ₽</b><span>на снасти</span></div>
          </div>
          <h3 class="account__subtitle">История заказов</h3>
          <div class="account__orders">${ordersHtml}</div>
          <button class="btn btn--dark btn--block" id="logoutBtn">Выйти из аккаунта</button>
        </div>`;
      $('#logoutBtn').addEventListener('click', logout);
    } else {
      card.innerHTML = `
        <div class="auth">
          <div class="auth__brand">Личный кабинет РЫБОЛОВ</div>
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
          <p class="auth__note">Демо-режим: данные хранятся только в вашем браузере.</p>
        </div>`;
      card.querySelectorAll('.auth__tab').forEach((el) => el.addEventListener('click', () => { authTab = el.dataset.tab; renderAccount(); }));
      $('#authForm').addEventListener('submit', (e) => { e.preventDefault(); authTab === 'login' ? doLogin() : doRegister(); });
    }
  }
  function updateAccountLabel() { const el = $('#accountLabel'); if (el) el.textContent = state.user ? (state.user.name || 'Кабинет').split(' ')[0] : 'Войти'; }
  function doRegister() {
    const name = $('#authName').value.trim(), email = $('#authEmail').value.trim().toLowerCase(), pass = $('#authPass').value;
    if (!name || !email || pass.length < 4) return;
    const users = loadJSON(LS.users, {});
    if (users[email]) { showToast('Такой email уже зарегистрирован'); authTab = 'login'; renderAccount(); return; }
    users[email] = { name, email, password: pass, orders: [] }; saveUsers(users);
    localStorage.setItem(LS.session, email); state.user = users[email];
    updateAccountLabel(); renderAccount(); showToast(`Добро пожаловать, ${name}!`);
  }
  function doLogin() {
    const email = $('#authEmail').value.trim().toLowerCase(), pass = $('#authPass').value;
    const users = loadJSON(LS.users, {});
    if (!users[email] || users[email].password !== pass) { showToast('Неверный email или пароль'); return; }
    localStorage.setItem(LS.session, email); state.user = users[email];
    updateAccountLabel(); renderAccount(); showToast(`С возвращением, ${users[email].name}!`);
  }
  function logout() { localStorage.removeItem(LS.session); state.user = null; updateAccountLabel(); renderAccount(); showToast('Вы вышли из аккаунта'); }

  /* ---------- Тост ---------- */
  let toastTimer;
  function showToast(msg) { const t = $('#toast'); if (!t) return; t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2400); }

  /* ---------- Поиск ---------- */
  function submitSearch(e) {
    if (e) e.preventDefault();
    const val = $('#searchInput').value.trim();
    if ($('#products')) { state.query = val; if (val) { state.category = 'all'; state.favOnly = false; } renderTabs(); renderProducts(); }
    else window.location.href = 'catalog.html?q=' + encodeURIComponent(val);
  }

  /* ---------- Инициализация ---------- */
  function init() {
    // общие бейджи
    updateCartBadge(); updateFavBadge(); updateAccountLabel();
    const stat = $('#statCount'); if (stat) stat.textContent = PRODUCTS.filter((p) => p.stock).length;

    // главная + витрины
    renderHits(); renderCategories(); renderSale(); renderBrands();

    // каталог: читаем параметры URL
    if ($('#products')) {
      const q = new URLSearchParams(location.search);
      if (q.get('cat') && CATEGORIES.some((c) => c.id === q.get('cat'))) state.category = q.get('cat');
      if (q.get('brand') && PRODUCTS.some((p) => p.brand === q.get('brand'))) state.brand = q.get('brand');
      if (q.get('fav') === '1') state.favOnly = true;
      if (q.get('q')) { state.query = q.get('q'); const si = $('#searchInput'); if (si) si.value = state.query; }
      renderTabs(); renderBrandFilter(); if ($('#brandFilter')) $('#brandFilter').value = state.brand; renderProducts();
      $('#sortSelect')?.addEventListener('change', (e) => { state.sort = e.target.value; renderProducts(); });
      $('#brandFilter')?.addEventListener('change', (e) => { state.brand = e.target.value; renderProducts(); });
      $('#inStock')?.addEventListener('change', (e) => { state.inStock = e.target.checked; renderProducts(); });
      $('#priceMin')?.addEventListener('input', (e) => { state.priceMin = e.target.value ? +e.target.value : null; renderProducts(); });
      $('#priceMax')?.addEventListener('input', (e) => { state.priceMax = e.target.value ? +e.target.value : null; renderProducts(); });
      const resetAll = () => { Object.assign(state, { category: 'all', query: '', sort: 'popular', brand: 'all', priceMin: null, priceMax: null, inStock: false, favOnly: false });
        ['#sortSelect'].forEach((s) => $(s) && ($(s).value = 'popular')); if ($('#brandFilter')) $('#brandFilter').value = 'all';
        if ($('#priceMin')) $('#priceMin').value = ''; if ($('#priceMax')) $('#priceMax').value = ''; if ($('#inStock')) $('#inStock').checked = false;
        renderTabs(); renderProducts(); };
      $('#resetFilters')?.addEventListener('click', resetAll);
      $('#resetBtn')?.addEventListener('click', resetAll);
    }

    // кабинет + страница товара
    renderAccount();
    renderProductPage();

    // корзина / модалки (везде)
    $('#cartToggle')?.addEventListener('click', openCart);
    $('#cartClose')?.addEventListener('click', closeCart);
    $('#cartOverlay')?.addEventListener('click', closeCart);
    $('#checkoutBtn')?.addEventListener('click', checkout);
    $('#modalOverlay')?.addEventListener('click', closeModal);

    // поиск в шапке
    $('#searchOpen')?.addEventListener('click', () => { const s = $('#headerSearch'); if (s) { s.hidden = !s.hidden; if (!s.hidden) $('#searchInput')?.focus(); } });
    $('#searchForm')?.addEventListener('submit', submitSearch);

    // мобильное меню
    $('#navToggle')?.addEventListener('click', () => $('#mainNav')?.classList.toggle('is-open'));

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCart(); closeModal(); } });

    const header = $('#siteHeader');
    if (header) { const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20); window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
