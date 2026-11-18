/* KAILAS Кыргызстан — логика интернет-магазина (одностраничное приложение, hash-роутинг) */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const app = $('#app');

  const U = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=72&auto=format&fit=crop`;
  const bg = (id, w) => `background-image:url('${U(id, w)}'),linear-gradient(135deg,#2b3440,#11161c)`;
  const IMG = {
    hero1: '1506905925346-21bda4d32df4', hero2: '1464822759023-fed622ff2c3b', hero3: '1519681393784-d120267933ba',
    alpine: '1454496522488-7a8e488e8606', climb: '1522163182402-834f871fd851', hike: '1551632811-561732d1e306',
    running: '1476480862126-209bfaa8edc8', hiking: '1501555088652-021faa106b9b', alpineAct: '1464822759023-fed622ff2c3b',
    climbing: '1522163182402-834f871fd851', skiing: '1551698618-1dfe5d97d256', urban: '1477959858617-67f85cf4f1df',
    statement: '1506905925346-21bda4d32df4', store: '1519681393784-d120267933ba'
  };

  /* ---------- State ---------- */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
  };
  let cart = store.get('kailas_cart', []);
  let currency = store.get('kailas_cur', 'KGS');
  LANG = store.get('kailas_lang', 'ru');
  if (!LANGS_ENABLED.includes(LANG)) LANG = 'ru';

  const byId = id => PRODUCTS.find(p => p.id === id);
  const fmt = kgs => {
    const cur = CURRENCIES[currency];
    let v = kgs * cur.rate;
    v = currency === 'USD' ? Math.round(v * 100) / 100 : Math.round(v);
    const s = v.toLocaleString('ru-RU', currency === 'USD' ? { minimumFractionDigits: 2, maximumFractionDigits: 2 } : {});
    return cur.pos === 'before' ? cur.symbol + s : s + ' ' + cur.symbol;
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stars = r => '★★★★★'.slice(0, Math.round(r)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(r));
  const plural = (n, f) => { const m10 = n % 10, m100 = n % 100; return n + ' ' + (m10 === 1 && m100 !== 11 ? f[0] : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? f[1] : f[2]); };

  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- Static i18n ---------- */
  function applyI18n() {
    document.documentElement.lang = LANG;
    $$('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
    $$('[data-i18n-ph]').forEach(el => el.placeholder = t(el.dataset.i18nPh));
  }

  const NAV = [
    ['#/shop?gender=men', 'nav_men'], ['#/shop?gender=women', 'nav_women'], ['#/shop?cat=footwear', 'nav_footwear'],
    ['#/shop?group=equipment', 'nav_equipment'], ['#/shop?sort=new', 'nav_new'], ['#/about', 'nav_about'], ['#/contacts', 'nav_contacts']
  ];
  function renderNav() {
    $('#nav').innerHTML = NAV.map(([h, k]) => `<a href="${h}">${t(k)}</a>`).join('');
    $('#mobilePanel').innerHTML = `<a href="#/">Главная</a>` + NAV.map(([h, k]) => `<a href="${h}">${t(k)}</a>`).join('') +
      `<a href="#/delivery">${t('delivery')}</a><a href="#/returns">${t('returns')}</a>`;
    $('#langSel').innerHTML = [['ru', 'RU'], ['ky', 'KG'], ['en', 'EN']].map(([v, l]) =>
      `<option value="${v}" ${v === LANG ? 'selected' : ''} ${LANGS_ENABLED.includes(v) ? '' : 'disabled'}>${l}${LANGS_ENABLED.includes(v) ? '' : ' (скоро)'}</option>`).join('');
    $('#curSel').innerHTML = Object.keys(CURRENCIES).map(c => `<option ${c === currency ? 'selected' : ''}>${c}</option>`).join('');
  }

  /* ---------- Product card ---------- */
  function card(p) {
    const labels = [
      p.soldOut ? `<span class="label out">${t('sold_out')}</span>` : '',
      p.isNew ? `<span class="label new">${t('new_badge')}</span>` : '',
      p.tag ? `<span class="label tag">${esc(p.tag)}</span>` : ''
    ].join('');
    return `<a class="card" href="#/product/${p.id}">
      <div class="thumb"><div class="labels">${labels}</div>${productArt(p)}
        ${p.soldOut ? '' : `<button class="btn btn-light btn-block quick-add" data-quick="${p.id}">${t('add_to_cart')}</button>`}
      </div>
      <div class="swatches">${p.colors.map(c => `<span style="background:${c.c}" title="${esc(c.n)}"></span>`).join('')}</div>
      <h4>${esc(p.name)}</h4>
      <div class="price">${fmt(p.price)}</div>
      ${p.reviews ? `<div class="stars"><i>${stars(p.rating)}</i>${plural(p.reviews, ['отзыв', 'отзыва', 'отзывов'])}</div>` : ''}
    </a>`;
  }

  /* ---------- Pages ---------- */
  function pageHome() {
    const slides = [
      { img: IMG.hero1, title: t('hero1_title'), text: t('hero1_text'), btns: [['#/shop?gender=women', t('shop_women')], ['#/shop?gender=men', t('shop_men')]] },
      { img: IMG.hero2, title: t('hero2_title'), text: t('hero2_text'), btns: [['#/shop?act=alpine', t('shop_now')]] },
      { img: IMG.hero3, title: t('hero3_title'), text: t('hero3_text'), btns: [['#/shop?sort=new', t('shop_now')]] }
    ];
    const acts = [['running', 'act_running', IMG.running], ['hiking', 'act_hiking', IMG.hiking], ['alpine', 'act_alpine', IMG.alpineAct],
      ['climbing', 'act_climbing', IMG.climbing], ['skiing', 'act_skiing', IMG.skiing], ['urban', 'act_urban', IMG.urban]];

    app.innerHTML = `
    <section class="hero" id="hero">
      ${slides.map((s, i) => `<div class="slide ${i === 0 ? 'active' : ''}">
        <div class="bg" style="${bg(s.img, 2000)}"></div>
        <div class="content wrap"><h1>${s.title}</h1><p>${s.text}</p>
        <div class="actions">${s.btns.map((b, j) => `<a class="btn ${j ? 'btn-light' : 'btn-ghost'}" href="${b[0]}">${b[1]}</a>`).join('')}</div></div>
      </div>`).join('')}
      <button class="hero-arrow prev" aria-label="Назад">‹</button><button class="hero-arrow next" aria-label="Вперёд">›</button>
      <div class="dots">${slides.map((_, i) => `<button class="${i === 0 ? 'active' : ''}" data-dot="${i}" aria-label="Слайд ${i + 1}"></button>`).join('')}</div>
    </section>

    <section class="banners">
      ${[[IMG.alpine, 'banner_alpine', 'banner_alpine_t', 'alpine'], [IMG.climb, 'banner_climb', 'banner_climb_t', 'climbing'], [IMG.hike, 'banner_hike', 'banner_hike_t', 'hiking']]
        .map(([img, h, p, act]) => `<a class="banner" href="#/shop?act=${act}"><div class="bg" style="${bg(img, 1000)}"></div>
          <div class="content"><h3>${t(h)}</h3><p>${t(p)}</p><span class="btn btn-light">${t('shop_now')}</span></div></a>`).join('')}
    </section>

    <section class="block"><div class="wrap">
      <div class="sec-head"><h2 class="sec-title">${t('design_for')}</h2></div>
      <div class="acts">${acts.map(([k, l, img]) => `<a class="act" href="#/shop?act=${k}"><div class="bg" style="${bg(img, 600)}"></div><span>${t(l)}</span></a>`).join('')}</div>
    </div></section>

    <section class="block" style="padding-top:0"><div class="wrap">
      <div class="sec-head"><h2 class="sec-title">${t('best_sellers')}</h2>
        <div class="tabs" data-tabs="best"><button class="active" data-g="men">${t('tab_men')}</button><button data-g="women">${t('tab_women')}</button></div></div>
      <div class="scroller" id="bestList"></div>
      <div style="text-align:center;margin-top:28px"><a class="btn btn-outline" href="#/shop">${t('view_all')}</a></div>
    </div></section>

    <section class="statement"><div class="bg" style="${bg(IMG.statement, 2000)}"></div><h2>${t('made_to_climb')}</h2></section>

    <section class="block"><div class="wrap">
      <div class="sec-head"><h2 class="sec-title">${t('new_arrivals')}</h2>
        <div class="tabs" data-tabs="new"><button class="active" data-g="men">${t('tab_men')}</button><button data-g="women">${t('tab_women')}</button><button data-g="equipment">${t('tab_equipment')}</button></div></div>
      <div class="scroller" id="newList"></div>
      <div style="text-align:center;margin-top:28px"><a class="btn btn-outline" href="#/shop?sort=new">${t('view_all')}</a></div>
    </div></section>

    <div class="wrap"><div class="perks">
      ${[['f_ship', 'f_ship_t', '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'],
        ['f_ret', 'f_ret_t', '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>'],
        ['f_sup', 'f_sup_t', '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1"/><rect x="17" y="13" width="4" height="6" rx="1"/>'],
        ['f_pay', 'f_pay_t', '<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>']]
        .map(([h, p, ic]) => `<div class="perk"><svg viewBox="0 0 24 24">${ic}</svg><div><h5>${t(h)}</h5><p>${t(p)}</p></div></div>`).join('')}
    </div></div>

    <section class="block"><div class="wrap">
      <div class="sec-head"><h2 class="sec-title">${t('stories')}</h2></div>
      <div class="stories">${STORIES.map(s => `<a class="story" href="#/about"><div class="img" style="background-image:url('${s.img}'),linear-gradient(135deg,#2b3440,#11161c)"></div>
        <small>${s.date}</small><h4>${esc(s.title)}</h4><span class="link-arrow">${t('read_more')}</span></a>`).join('')}</div>
    </div></section>

    <section class="store-band">
      <div class="img" style="${bg(IMG.store, 1400)}"></div>
      <div class="txt"><h3>${t('store_title')}</h3><p>${t('store_text')}</p>
        <div class="addr">${esc(CONFIG.address)}<br>${esc(CONFIG.hours)}<br>${esc(CONFIG.phone)}</div>
        <div><a class="btn btn-light" href="#/contacts">${t('store_btn')}</a></div></div>
    </section>`;

    // slider
    const slidesEl = $$('.slide'), dots = $$('[data-dot]');
    let cur = 0;
    const go = i => { cur = (i + slidesEl.length) % slidesEl.length; slidesEl.forEach((s, j) => s.classList.toggle('active', j === cur)); dots.forEach((d, j) => d.classList.toggle('active', j === cur)); };
    $('.hero-arrow.prev').onclick = () => { go(cur - 1); restart(); };
    $('.hero-arrow.next').onclick = () => { go(cur + 1); restart(); };
    dots.forEach(d => d.onclick = () => { go(+d.dataset.dot); restart(); });
    let timer; const restart = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000); };
    restart(); pageHome.cleanup = () => clearInterval(timer);

    const fill = (listId, g, isNew) => {
      let items = PRODUCTS.filter(p => (isNew ? p.isNew || p.best : p.best));
      if (g === 'equipment') items = PRODUCTS.filter(p => ['packs', 'climbing', 'accessories'].includes(p.cat));
      else items = items.filter(p => p.gender === g || p.gender === 'unisex');
      if (isNew) items = items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      $('#' + listId).innerHTML = items.slice(0, 10).map(card).join('');
    };
    fill('bestList', 'men'); fill('newList', 'men', true);
    $$('[data-tabs]').forEach(tb => tb.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', tb).forEach(x => x.classList.toggle('active', x === b));
      tb.dataset.tabs === 'best' ? fill('bestList', b.dataset.g) : fill('newList', b.dataset.g, true);
    }));
  }

  function pageShop(q) {
    const cats = ['jackets', 'tops', 'pants', 'footwear', 'packs', 'climbing', 'accessories'];
    const acts = ['running', 'hiking', 'alpine', 'climbing', 'skiing', 'urban'];
    const st = {
      cat: new Set(q.cat ? q.cat.split(',') : q.group === 'equipment' ? ['packs', 'climbing', 'accessories'] : []),
      gender: new Set(q.gender ? [q.gender] : []),
      act: new Set(q.act ? [q.act] : []),
      min: '', max: '', sort: q.sort || 'pop', q: q.q || ''
    };
    let title = t('all_products');
    if (q.gender) title = t(q.gender === 'men' ? 'nav_men' : 'nav_women');
    if (q.cat === 'footwear') title = t('nav_footwear');
    if (q.group === 'equipment') title = t('nav_equipment');
    if (q.act) title = t('act_' + q.act);
    if (q.sort === 'new') title = t('nav_new');
    if (q.q) title = `${t('search')}: «${esc(q.q)}»`;

    const box = (name, vals, labelFn) => vals.map(v => `<label><input type="checkbox" data-f="${name}" value="${v}" ${st[name].has(v) ? 'checked' : ''}>${labelFn(v)}</label>`).join('');
    app.innerHTML = `
    <div class="wrap page-head"><div class="crumbs"><a href="#/">Главная</a> / ${t('catalog')}</div><h1 class="page-title">${title}</h1></div>
    <div class="wrap catalog">
      <aside class="filters" id="filters">
        <h6>${t('category')}</h6>${box('cat', cats, v => t('c_' + v))}
        <h6>${t('gender')}</h6>${box('gender', ['men', 'women', 'unisex'], v => t('g_' + v))}
        <h6>${t('activity')}</h6>${box('act', acts, v => t('act_' + v))}
        <h6>${t('price')}, сом</h6><div class="price-range"><input type="number" placeholder="от" id="pmin"><input type="number" placeholder="до" id="pmax"></div>
        <button class="btn btn-outline btn-block" style="margin-top:22px" id="resetF">${t('reset')}</button>
      </aside>
      <div>
        <div class="toolbar">
          <button class="btn btn-outline filter-toggle" id="fToggle">${t('filter')}</button>
          <span id="count" style="color:var(--muted);font-size:14px"></span>
          <select id="sortSel">
            ${[['pop', 'sort_pop'], ['new', 'sort_new'], ['low', 'sort_low'], ['high', 'sort_high']].map(([v, k]) => `<option value="${v}" ${st.sort === v ? 'selected' : ''}>${t(k)}</option>`).join('')}
          </select>
        </div>
        <div class="grid" id="grid"></div>
      </div>
    </div>`;

    const render = () => {
      const qs = st.q.toLowerCase();
      let items = PRODUCTS.filter(p =>
        (!st.cat.size || st.cat.has(p.cat)) &&
        (!st.gender.size || st.gender.has(p.gender) || (p.gender === 'unisex' && (st.gender.has('men') || st.gender.has('women')))) &&
        (!st.act.size || p.act.some(a => st.act.has(a))) &&
        (!st.min || p.price >= +st.min) && (!st.max || p.price <= +st.max) &&
        (!qs || p.name.toLowerCase().includes(qs) || (p.tag || '').toLowerCase().includes(qs)));
      const sorters = { pop: (a, b) => b.reviews - a.reviews, new: (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0), low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price };
      items.sort(sorters[st.sort]);
      $('#count').textContent = plural(items.length, ['товар', 'товара', 'товаров']);
      $('#grid').innerHTML = items.length ? items.map(card).join('') : `<div class="empty" style="grid-column:1/-1">${t('nothing_found')}</div>`;
    };
    $('#filters').addEventListener('change', e => {
      const f = e.target.dataset.f; if (!f) return;
      e.target.checked ? st[f].add(e.target.value) : st[f].delete(e.target.value); render();
    });
    $('#pmin').oninput = e => { st.min = e.target.value; render(); };
    $('#pmax').oninput = e => { st.max = e.target.value; render(); };
    $('#sortSel').onchange = e => { st.sort = e.target.value; render(); };
    $('#resetF').onclick = () => { location.hash = '#/shop'; };
    $('#fToggle').onclick = () => $('#filters').classList.toggle('open');
    render();
  }

  function pageProduct(id) {
    const p = byId(id);
    if (!p) return pageNotFound();
    let ci = 0, size = p.sizes.length === 1 ? p.sizes[0] : null, qty = 1;
    const catName = t('c_' + p.cat);
    app.innerHTML = `
    <div class="wrap page-head" style="padding-bottom:10px"><div class="crumbs"><a href="#/">Главная</a> / <a href="#/shop">${t('catalog')}</a> / <a href="#/shop?cat=${p.cat}">${catName}</a></div></div>
    <div class="wrap pdp">
      <div class="gallery" id="gallery"></div>
      <div class="buybox">
        <div class="stars"><i>${stars(p.rating)}</i>${p.rating.toFixed(1)} · ${plural(p.reviews, ['отзыв', 'отзыва', 'отзывов'])}</div>
        <h1>${esc(p.name)}</h1>
        <div class="price">${fmt(p.price)}</div>
        <div class="alt-price">${currency !== 'USD' ? '≈ ' + (p.price * CURRENCIES.USD.rate).toFixed(2) + ' USD' : '≈ ' + p.price.toLocaleString('ru-RU') + ' сом'}</div>
        <div class="opt-label"><span>${t('color')}: <b id="colorName">${esc(p.colors[0].n)}</b></span></div>
        <div class="color-opts">${p.colors.map((c, i) => `<button data-ci="${i}" class="${i === 0 ? 'active' : ''}" style="background:linear-gradient(135deg,${c.c} 55%,${c.a} 55%)" aria-label="${esc(c.n)}"></button>`).join('')}</div>
        <div class="opt-label"><span>${t('size')}</span><a href="#/sizes">${t('size_guide')}</a></div>
        <div class="size-opts">${p.sizes.map(s => `<button data-size="${s}" class="${s === size ? 'active' : ''}">${s}</button>`).join('')}</div>
        <div class="opt-label"><span>${t('qty')}</span></div>
        <div class="qty"><button id="qm">−</button><input id="qv" value="1" inputmode="numeric"><button id="qp">+</button></div>
        <div class="err hidden" id="sizeErr">${t('choose_size')}</div>
        <div class="buy-row">
          <button class="btn btn-dark" id="addBtn" ${p.soldOut ? 'disabled' : ''}>${p.soldOut ? t('sold_out') : t('add_to_cart')}</button>
          <button class="btn btn-outline" id="buyBtn" ${p.soldOut ? 'disabled' : ''}>${t('buy_now')}</button>
        </div>
        <div class="trust">
          <div><svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>${t('f_ship_t')}</div>
          <div><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/></svg>${t('f_ret_t')}</div>
          <div><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>${t('f_pay_t')}</div>
        </div>
        <div class="acc">
          <details open><summary>${t('description')}</summary><div class="body">${esc(p.desc)}</div></details>
          <details><summary>${t('features')}</summary><div class="body"><ul>${p.feat.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></details>
          <details><summary>${t('shipping_returns')}</summary><div class="body">${t('ship_info')}</div></details>
        </div>
      </div>
    </div>
    <section class="block" style="padding-top:20px"><div class="wrap">
      <div class="sec-head"><h2 class="sec-title">${t('related')}</h2></div>
      <div class="scroller">${PRODUCTS.filter(x => x.id !== p.id && (x.cat === p.cat || x.act.some(a => p.act.includes(a)))).slice(0, 8).map(card).join('')}</div>
    </div></section>`;

    const drawGallery = () => $('#gallery').innerHTML = [0, 1, 2].map(v => `<div class="g">${productArt(p, ci, v)}</div>`).join('');
    drawGallery();
    $$('.color-opts button').forEach(b => b.onclick = () => {
      ci = +b.dataset.ci; $$('.color-opts button').forEach(x => x.classList.toggle('active', x === b));
      $('#colorName').textContent = p.colors[ci].n; drawGallery();
    });
    $$('.size-opts button').forEach(b => b.onclick = () => {
      size = b.dataset.size; $$('.size-opts button').forEach(x => x.classList.toggle('active', x === b)); $('#sizeErr').classList.add('hidden');
    });
    const setQ = v => { qty = Math.max(1, Math.min(20, v | 0 || 1)); $('#qv').value = qty; };
    $('#qm').onclick = () => setQ(qty - 1); $('#qp').onclick = () => setQ(qty + 1); $('#qv').onchange = e => setQ(+e.target.value);
    const add = () => { if (!size) { $('#sizeErr').classList.remove('hidden'); return false; } addToCart(p.id, ci, size, qty); return true; };
    $('#addBtn').onclick = () => { if (add()) openCart(); };
    $('#buyBtn').onclick = () => { if (add()) location.hash = '#/checkout'; };
  }

  /* ---------- Cart ---------- */
  function saveCart() { store.set('kailas_cart', cart); updateBadge(); renderDrawer(); }
  function addToCart(id, ci, size, qty) {
    const key = `${id}|${ci}|${size}`;
    const ex = cart.find(i => i.key === key);
    ex ? ex.qty = Math.min(20, ex.qty + qty) : cart.push({ key, id, ci, size, qty });
    saveCart(); toast(t('added'));
  }
  const subtotal = () => cart.reduce((s, i) => s + (byId(i.id)?.price || 0) * i.qty, 0);
  function updateBadge() {
    const n = cart.reduce((s, i) => s + i.qty, 0);
    $('#cartCount').textContent = n; $('#cartCount').classList.toggle('hidden', !n);
  }
  function lineItem(i, editable = true) {
    const p = byId(i.id); if (!p) return '';
    return `<div class="line-item" data-key="${i.key}">
      <a class="ti" href="#/product/${p.id}">${productArt(p, i.ci)}</a>
      <div><h5>${esc(p.name)}</h5><small>${esc(p.colors[i.ci]?.n || '')} · ${i.size}${editable ? '' : ' · ×' + i.qty}</small>
        ${editable ? `<div class="qty"><button data-q="-1">−</button><input value="${i.qty}" readonly><button data-q="1">+</button></div>` : ''}</div>
      <div class="right"><span>${fmt(p.price * i.qty)}</span>${editable ? `<button class="rm" data-rm>${t('remove')}</button>` : ''}</div>
    </div>`;
  }
  function renderDrawer() {
    const el = $('#drawerContent');
    if (!cart.length) {
      el.innerHTML = `<div class="empty" style="padding:80px 24px"><p style="margin-bottom:20px">${t('cart_empty')}</p><a class="btn btn-dark" href="#/shop" data-close>${t('continue')}</a></div>`;
      return;
    }
    const sub = subtotal(), left = CONFIG.freeShipKG - sub;
    el.innerHTML = `
      <div class="ship-bar">${left > 0 ? `${t('free_ship_left')}: <b>${fmt(left)}</b>` : t('free_ship_ok')}
        <div class="track"><div class="fill" style="width:${Math.min(100, sub / CONFIG.freeShipKG * 100)}%"></div></div></div>
      <div class="drawer-body">${cart.map(i => lineItem(i)).join('')}</div>
      <div class="drawer-foot">
        <div class="row" style="font-weight:700;font-size:16px"><span>${t('subtotal')}</span><span>${fmt(sub)}</span></div>
        <a class="btn btn-dark btn-block" href="#/checkout" data-close>${t('checkout')}</a>
        <button class="btn btn-outline btn-block" data-close>${t('continue')}</button>
      </div>`;
  }
  $('#drawerContent').addEventListener('click', e => {
    if (e.target.closest('[data-close]')) { closeCart(); return; }
    const li = e.target.closest('.line-item'); if (!li) return;
    const it = cart.find(i => i.key === li.dataset.key);
    const qb = e.target.closest('[data-q]');
    if (qb) { it.qty += +qb.dataset.q; if (it.qty < 1) cart = cart.filter(i => i !== it); else it.qty = Math.min(20, it.qty); saveCart(); }
    if (e.target.closest('[data-rm]')) { cart = cart.filter(i => i !== it); saveCart(); }
  });
  function openCart() { renderDrawer(); $('#drawer').classList.add('open'); $('#overlay').classList.add('open'); }
  function closeCart() { $('#drawer').classList.remove('open'); $('#overlay').classList.remove('open'); }

  /* ---------- Checkout ---------- */
  function pageCheckout() {
    if (!cart.length) {
      app.innerHTML = `<div class="success"><h1>${t('cart_empty')}</h1><p style="margin:16px 0 28px;color:var(--muted)">Добавьте товары, чтобы оформить заказ.</p><a class="btn btn-dark" href="#/shop">${t('continue')}</a></div>`;
      return;
    }
    const saved = store.get('kailas_customer', {});
    const f = (name, label, type = 'text', cls = '', req = true) =>
      `<div class="field ${cls}"><input name="${name}" type="${type}" placeholder="${label}${req ? ' *' : ''}" value="${esc(saved[name] || '')}" ${req ? 'required' : ''}><div class="msg">${t('required')}</div></div>`;
    app.innerHTML = `
    <div class="wrap page-head"><div class="crumbs"><a href="#/">Главная</a> / ${t('cart_title')} / ${t('checkout')}</div><h1 class="page-title">${t('checkout_title')}</h1></div>
    <form class="wrap checkout" id="coForm" novalidate>
      <div>
        <h3>${t('contact_info')}</h3>
        <div class="fields">${f('first', t('first_name'))}${f('last', t('last_name'))}${f('phone', t('phone'), 'tel')}${f('email', t('email'), 'email')}</div>
        <h3>${t('shipping_addr')}</h3>
        <div class="fields">
          <div class="field full"><select name="country" id="country">${COUNTRIES.map(([c, n]) => `<option value="${c}" ${c === (saved.country || 'KG') ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
          ${f('city', t('city'))}${f('zip', t('zip'), 'text', '', false)}
          ${f('address', t('address'), 'text', 'full')}
          <div class="field full"><textarea name="comment" rows="3" placeholder="${t('comment')}"></textarea></div>
        </div>
        <h3>${t('ship_method')}</h3><div class="radio-list" id="shipList"></div>
        <h3>${t('pay_method')}</h3><div class="radio-list" id="payList"></div>
      </div>
      <aside class="summary">
        <h3 style="margin-top:0">${t('order_summary')}</h3>
        <div>${cart.map(i => lineItem(i, false)).join('')}</div>
        <div class="rows">
          <div class="row"><span>${t('subtotal')}</span><span>${fmt(subtotal())}</span></div>
          <div class="row"><span>${t('shipping')}</span><span id="shipCost"></span></div>
          <div class="row total"><span>${t('total')}</span><span id="totalCost"></span></div>
        </div>
        <button class="btn btn-dark btn-block" style="margin-top:20px" type="submit">${t('place_order')}</button>
        <p class="note">${t('agree')}</p>
      </aside>
    </form>`;

    const form = $('#coForm');
    const zone = () => { const c = form.country.value; return c === 'KG' ? 'kg' : CIS.includes(c) ? 'cis' : 'world'; };
    const shipCost = m => {
      const sub = subtotal();
      if (m === 'pickup') return 0;
      if ((m === 'courier' || m === 'kg') && sub >= CONFIG.freeShipKG) return 0;
      if (m === 'world' && sub >= CONFIG.freeShipWorld) return 0;
      return CONFIG.shipping[m];
    };
    const drawShip = () => {
      const z = zone();
      const opts = z === 'kg' ? [['pickup', 'ship_pickup', 'сегодня'], ['courier', 'ship_courier', '1 день'], ['kg', 'ship_kg', '2–4 дня']]
        : z === 'cis' ? [['cis', 'ship_cis', '5–10 дней']] : [['world', 'ship_world', '7–21 день']];
      const prev = form.ship?.value;
      $('#shipList').innerHTML = opts.map(([v, k, d], i) => {
        const c = shipCost(v);
        return `<label><input type="radio" name="ship" value="${v}" ${(prev === v || (!opts.some(o => o[0] === prev) && i === 0)) ? 'checked' : ''}>
          <span>${t(k)}<br><small style="color:var(--muted)">${d}</small></span><span class="rp">${c ? fmt(c) : t('free')}</span></label>`;
      }).join('');
      const pays = [['card', 'pay_card'], ['qr', 'pay_qr'], ['install', 'pay_install'], ['cod', 'pay_cod'], ['paypal', 'pay_paypal']];
      const prevPay = form.pay?.value || 'card';
      $('#payList').innerHTML = pays.map(([v, k]) => {
        const dis = (v === 'qr' || v === 'cod' || v === 'install') && z !== 'kg';
        return `<label class="${dis ? 'dim' : ''}"><input type="radio" name="pay" value="${v}" ${dis ? 'disabled' : ''} ${v === prevPay && !dis ? 'checked' : ''}>${t(k)}</label>`;
      }).join('');
      if (!form.querySelector('[name=pay]:checked')) form.querySelector('[name=pay]:not(:disabled)').checked = true;
      totals();
    };
    const totals = () => {
      const s = shipCost(form.querySelector('[name=ship]:checked').value);
      $('#shipCost').textContent = s ? fmt(s) : t('free');
      $('#totalCost').textContent = fmt(subtotal() + s);
    };
    form.country.onchange = drawShip;
    $('#shipList').onchange = totals;
    drawShip();

    form.onsubmit = e => {
      e.preventDefault();
      let ok = true;
      $$('.field', form).forEach(fl => {
        const inp = fl.querySelector('input[required]'); if (!inp) return;
        let bad = !inp.value.trim();
        if (!bad && inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(inp.value)) { bad = true; fl.querySelector('.msg').textContent = t('invalid_email'); }
        fl.classList.toggle('invalid', bad); if (bad) ok = false;
      });
      if (!ok) { $('.field.invalid input', form).focus(); return; }
      const data = Object.fromEntries(new FormData(form));
      store.set('kailas_customer', { first: data.first, last: data.last, phone: data.phone, email: data.email, country: data.country, city: data.city, zip: data.zip, address: data.address });
      const ship = shipCost(data.ship);
      const order = {
        number: 'KG-' + Date.now().toString().slice(-7), date: new Date().toISOString(), customer: data,
        items: cart.map(i => ({ ...i, name: byId(i.id).name, price: byId(i.id).price })), subtotal: subtotal(), shipping: ship, total: subtotal() + ship, currency: 'KGS'
      };
      const orders = store.get('kailas_orders', []); orders.push(order); store.set('kailas_orders', orders);
      // TODO: здесь отправка заказа на сервер / в CRM / платёжную систему
      store.set('kailas_last_order', order);
      cart = []; saveCart();
      location.hash = '#/success/' + order.number;
    };
  }

  function pageSuccess(num) {
    const o = store.get('kailas_last_order', null);
    const country = o ? (COUNTRIES.find(c => c[0] === o.customer.country) || [])[1] : '';
    const msg = o ? encodeURIComponent(`Здравствуйте! Заказ ${o.number}\n` + o.items.map(i => `• ${i.name} (${i.size}) ×${i.qty}`).join('\n') +
      `\nИтого: ${o.total.toLocaleString('ru-RU')} сом\n${o.customer.first} ${o.customer.last}, ${o.customer.phone}\n${country}, ${o.customer.city}, ${o.customer.address}`) : '';
    app.innerHTML = `<div class="success"><div class="check">✓</div>
      <h1>${t('order_ok')}</h1>
      <p>${t('order_num')}: <b>${esc(num)}</b></p>
      <p style="color:var(--muted);margin:14px 0 28px">${t('order_ok_t')}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        ${o ? `<a class="btn btn-dark" target="_blank" rel="noopener" href="https://wa.me/${CONFIG.whatsapp}?text=${msg}">Отправить заказ в WhatsApp</a>` : ''}
        <a class="btn btn-outline" href="#/">${t('to_home')}</a></div></div>`;
  }

  /* ---------- Info pages ---------- */
  const info = (crumb, title, html) => {
    app.innerHTML = `<div class="wrap page-head"><div class="crumbs"><a href="#/">Главная</a> / ${crumb}</div><h1 class="page-title">${title}</h1></div><div class="wrap prose">${html}</div>`;
  };
  const pages = {
    about: () => info(t('about'), t('about_title'), `
      <p><b>KAILAS</b> — бренд профессиональной горной одежды и снаряжения, созданный альпинистами в 2003 году. Девиз бренда — <b>Made to Climb</b>: всё, что мы делаем, проверено на реальных вершинах — от Гималаев до Альп.</p>
      <p><b>KAILAS Кыргызстан</b> — официальный представитель бренда в Кыргызской Республике. Мы привозим в Бишкек технические куртки, пуховики, обувь для трейлраннинга и треккинга, снаряжение для скалолазания и альпинизма — и отправляем заказы по всему миру.</p>
      <h2>Почему Кыргызстан</h2>
      <p>94% территории страны — горы. Тянь-Шань и Памир, пик Ленина и Хан-Тенгри, Ала-Арча и Каракол — здесь каждый день проверяют снаряжение на прочность. Мы консультируем альпинистов, гидов, бегунов и туристов и помогаем подобрать экипировку под конкретный маршрут.</p>
      <h2>Что мы предлагаем</h2>
      <ul><li>Оригинальная продукция KAILAS с официальной гарантией</li><li>Примерка и подбор в магазине в Бишкеке</li><li>Доставка по Кыргызстану, в страны СНГ и по всему миру</li><li>Поддержка альпинистских сборов и горных забегов</li></ul>`),
    contacts: () => info(t('contacts'), t('contacts_title'), `
      <div class="contacts-grid">
        <div>
          <h2 style="margin-top:0">Магазин в Бишкеке</h2>
          <p>${esc(CONFIG.address)}<br>${esc(CONFIG.hours)}</p>
          <h2>Связаться с нами</h2>
          <p>Телефон: <a href="tel:+${CONFIG.whatsapp}" style="text-decoration:underline">${esc(CONFIG.phone)}</a><br>WhatsApp: <a href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener" style="text-decoration:underline">написать</a><br>
          Instagram: <a href="https://www.instagram.com/${CONFIG.instagram}/" target="_blank" rel="noopener" style="text-decoration:underline">@${esc(CONFIG.instagram)}</a>
          ${CONFIG.telegram ? `<br>Telegram: <a href="https://t.me/${CONFIG.telegram}" style="text-decoration:underline">@${esc(CONFIG.telegram)}</a>` : ''}
          ${CONFIG.email ? `<br>E-mail: <a href="mailto:${CONFIG.email}" style="text-decoration:underline">${esc(CONFIG.email)}</a>` : ''}</p>
          <p><a class="btn btn-dark" target="_blank" rel="noopener" href="https://2gis.kg/bishkek/search/${encodeURIComponent('Чынгыза Айтматова 88')}">Открыть в 2ГИС</a></p>
          <p style="color:var(--muted)">Обслуживаем покупателей на русском языке (скоро — на кыргызском и английском).</p>
        </div>
        <div class="map"><iframe loading="lazy" title="Карта" src="https://www.openstreetmap.org/export/embed.html?bbox=74.55%2C42.85%2C74.65%2C42.90&layer=mapnik"></iframe></div>
      </div>`),
    delivery: () => info(t('delivery'), t('delivery'), `
      <h2>Доставка</h2>
      <table><tr><th>Куда</th><th>Срок</th><th>Стоимость</th></tr>
        <tr><td>Самовывоз, Бишкек</td><td>в день заказа</td><td>бесплатно</td></tr>
        <tr><td>Курьер по Бишкеку</td><td>1 день</td><td>${fmt(CONFIG.shipping.courier)}, от ${fmt(CONFIG.freeShipKG)} — бесплатно</td></tr>
        <tr><td>Регионы Кыргызстана</td><td>2–4 дня</td><td>${fmt(CONFIG.shipping.kg)}, от ${fmt(CONFIG.freeShipKG)} — бесплатно</td></tr>
        <tr><td>Страны СНГ (СДЭК, EMS)</td><td>5–10 дней</td><td>${fmt(CONFIG.shipping.cis)}</td></tr>
        <tr><td>Весь мир (DHL, EMS)</td><td>7–21 день</td><td>${fmt(CONFIG.shipping.world)}, от ${fmt(CONFIG.freeShipWorld)} — бесплатно</td></tr></table>
      <p>Пошлины и налоги страны получателя (если применимы) оплачивает покупатель.</p>
      <h2>Оплата</h2>
      <ul><li>Банковские карты Visa, Mastercard, Элкарт</li><li>QR-оплата: MBank, O!Деньги, Optima Bank, Bakai Bank (для Кыргызстана)</li><li>Рассрочка — оплата частями (Кыргызстан, подробности уточняйте у менеджера в WhatsApp)</li><li>Наличными или картой при получении (Кыргызстан)</li><li>PayPal и международные карты — для покупателей из других стран</li></ul>`),
    returns: () => info(t('returns'), t('returns'), `
      <p>Вы можете обменять или вернуть товар в течение <b>30 дней</b> с момента получения, если он не был в использовании, сохранены ярлыки и упаковка.</p>
      <h2>Как оформить возврат</h2>
      <ul><li>Напишите нам в WhatsApp/Telegram или на e-mail, указав номер заказа</li><li>Привезите товар в магазин или отправьте почтой</li><li>Деньги вернутся тем же способом оплаты в течение 3–10 рабочих дней</li></ul>
      <h2>Гарантия</h2><p>На всю продукцию KAILAS действует гарантия производителя на производственные дефекты.</p>`),
    sizes: () => info(t('size_guide'), t('size_guide'), `
      <h2>Одежда</h2>
      <table><tr><th>Размер</th><th>XS</th><th>S</th><th>M</th><th>L</th><th>XL</th><th>XXL</th></tr>
        <tr><td>Рост, см</td><td>155–160</td><td>160–167</td><td>167–174</td><td>174–181</td><td>181–188</td><td>188–195</td></tr>
        <tr><td>Обхват груди, см</td><td>80–84</td><td>84–90</td><td>90–96</td><td>96–102</td><td>102–108</td><td>108–114</td></tr>
        <tr><td>Обхват талии, см</td><td>64–68</td><td>68–74</td><td>74–80</td><td>80–86</td><td>86–92</td><td>92–98</td></tr></table>
      <h2>Обувь</h2>
      <table><tr><th>EU</th><th>36</th><th>37</th><th>38</th><th>39</th><th>40</th><th>41</th><th>42</th><th>43</th><th>44</th><th>45</th><th>46</th></tr>
        <tr><td>Стопа, см</td><td>22,5</td><td>23</td><td>23,5</td><td>24,5</td><td>25</td><td>25,5</td><td>26,5</td><td>27</td><td>28</td><td>28,5</td><td>29,5</td></tr></table>
      <p>Если сомневаетесь — напишите нам, поможем подобрать размер.</p>`),
    faq: () => info(t('faq'), t('faq'), `
      <h2>Это оригинальная продукция?</h2><p>Да, мы официальный представитель KAILAS в Кыргызстане. Вся продукция поставляется напрямую.</p>
      <h2>Доставляете ли вы за границу?</h2><p>Да, отправляем в страны СНГ и по всему миру. Стоимость рассчитывается автоматически при оформлении заказа.</p>
      <h2>Можно ли примерить перед покупкой?</h2><p>Да, приходите в магазин в Бишкеке. При курьерской доставке по Бишкеку возможна примерка.</p>
      <h2>В какой валюте оплата?</h2><p>Основная валюта — сом (KGS). Цены в USD, RUB и KZT показаны для удобства по текущему курсу.</p>`)
  };

  function pageNotFound() {
    app.innerHTML = `<div class="success"><h1>404</h1><p style="margin:12px 0 26px">${t('page_not_found')}</p><a class="btn btn-dark" href="#/">${t('to_home')}</a></div>`;
  }

  /* ---------- Router ---------- */
  function router() {
    if (pageHome.cleanup) { pageHome.cleanup(); pageHome.cleanup = null; }
    closeCart(); $('#mobileMenu').classList.remove('open');
    const hash = location.hash.slice(1) || '/';
    const [path, qs] = hash.split('?');
    const q = Object.fromEntries(new URLSearchParams(qs || ''));
    const parts = path.split('/').filter(Boolean);
    $$('#nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === location.hash));
    if (!parts.length) pageHome();
    else if (parts[0] === 'shop') pageShop(q);
    else if (parts[0] === 'product') pageProduct(parts[1]);
    else if (parts[0] === 'checkout') pageCheckout();
    else if (parts[0] === 'success') pageSuccess(parts[1]);
    else if (pages[parts[0]]) pages[parts[0]]();
    else pageNotFound();
    window.scrollTo(0, 0);
  }

  // реальные ссылки на соцсети в подвале
  const soc = $$('.socials a');
  soc[0].href = `https://www.instagram.com/${CONFIG.instagram}/`;
  if (CONFIG.telegram) soc[1].href = `https://t.me/${CONFIG.telegram}`; else soc[1].remove();
  soc[2].href = `https://wa.me/${CONFIG.whatsapp}`;
  soc.forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });

  /* ---------- Global events ---------- */
  document.addEventListener('click', e => {
    const qa = e.target.closest('[data-quick]');
    if (qa) {
      e.preventDefault(); e.stopPropagation();
      const p = byId(qa.dataset.quick);
      if (p.sizes.length === 1) { addToCart(p.id, 0, p.sizes[0], 1); openCart(); }
      else location.hash = '#/product/' + p.id;
    }
  });
  $('#cartBtn').onclick = openCart;
  $('#closeCart').onclick = closeCart;
  $('#overlay').onclick = closeCart;
  $('#burger').onclick = () => $('#mobileMenu').classList.add('open');
  $('#mobileMenu').onclick = e => { if (e.target.id === 'mobileMenu' || e.target.closest('a')) $('#mobileMenu').classList.remove('open'); };
  $('#searchBtn').onclick = () => { $('#searchBar').classList.toggle('hidden'); $('#searchInput').focus(); };
  $('#searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) { location.hash = '#/shop?q=' + encodeURIComponent(e.target.value.trim()); $('#searchBar').classList.add('hidden'); }
  });
  $('#curSel').onchange = e => { currency = e.target.value; store.set('kailas_cur', currency); router(); updateBadge(); };
  $('#langSel').onchange = e => { LANG = e.target.value; store.set('kailas_lang', LANG); applyI18n(); renderNav(); router(); };
  $('#newsForm').onsubmit = e => { e.preventDefault(); e.target.reset(); toast(t('subscribed')); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
  $('#year').textContent = new Date().getFullYear();

  applyI18n(); renderNav(); updateBadge();
  window.addEventListener('hashchange', router);
  router();
})();
