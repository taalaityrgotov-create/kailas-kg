/* Словари интерфейса. Сейчас заполнен только русский.
   Чтобы добавить кыргызский или английский — скопируйте блок `ru`
   в `ky` / `en`, переведите значения и включите язык в LANGS_ENABLED. */
const I18N = {
  ru: {
    topbar: 'Бесплатная доставка по Кыргызстану от 5 000 сом · Международная доставка в 200+ стран',
    nav_men: 'Мужское', nav_women: 'Женское', nav_equipment: 'Снаряжение', nav_footwear: 'Обувь',
    nav_new: 'Новинки', nav_sale: 'Распродажа', nav_about: 'О нас', nav_contacts: 'Контакты',
    search_ph: 'Поиск по каталогу…', search: 'Поиск', account: 'Аккаунт', cart: 'Корзина',
    shop_men: 'Мужское', shop_women: 'Женское', shop_now: 'Смотреть', view_all: 'Смотреть все',
    hero1_title: 'FUGA DU 2', hero1_text: 'Создано для подъёмов. Готово к любому рельефу Тянь-Шаня.',
    hero2_title: 'ВЫШЕ ЛИНИИ ЛЕСА', hero2_text: 'Техническое снаряжение для высотных восхождений — от Ала-Арчи до Хан-Тенгри.',
    hero3_title: 'ЧЕРНАЯ ПЯТНИЦА', hero3_text: 'Ранний доступ к скидкам до −40% на куртки и обувь.',
    banner_alpine: 'ВЫШЕ ЛИНИИ ЛЕСА', banner_alpine_t: 'Техническое горное снаряжение для альпинизма и непредсказуемой погоды.',
    banner_climb: 'К СЛЕДУЮЩЕЙ ЗАЦЕПКЕ', banner_climb_t: 'Лёгкое снаряжение для скалолазания — для каждого движения на скале.',
    banner_hike: 'ДЛИННЫЙ МАРШРУТ', banner_hike_t: 'Одежда и экипировка для однодневных походов и многодневных треков.',
    design_for: 'СОЗДАНО ДЛЯ ГОР',
    act_running: 'Трейлраннинг', act_hiking: 'Хайкинг', act_alpine: 'Альпинизм', act_climbing: 'Скалолазание', act_skiing: 'Лыжи', act_urban: 'Город',
    best_sellers: 'ХИТЫ ПРОДАЖ', new_arrivals: 'НОВИНКИ',
    tab_men: 'Мужчинам', tab_women: 'Женщинам', tab_equipment: 'Снаряжение', tab_all: 'Все',
    f_ship: 'БЕСПЛАТНАЯ ДОСТАВКА', f_ship_t: 'По Кыргызстану — от 5 000 сом, по миру — от $150',
    f_ret: '30 ДНЕЙ НА ВОЗВРАТ', f_ret_t: 'Обмен или возврат в течение 30 дней',
    f_sup: 'ПОДДЕРЖКА 7/7', f_sup_t: 'WhatsApp, Telegram и телефон — без выходных',
    f_pay: 'БЕЗОПАСНАЯ ОПЛАТА', f_pay_t: 'Visa, Mastercard, Элкарт, MBank, O!Деньги',
    made_to_climb: 'MADE TO CLIMB',
    stories: 'ИСТОРИИ KAILAS', read_more: 'Читать',
    store_title: 'МАГАЗИН KAILAS В БИШКЕКЕ', store_text: 'Приходите примерить: консультации по снаряжению, подбор обуви и прокат для восхождений.',
    store_btn: 'Как добраться',
    newsletter: 'Подпишитесь на рассылку', newsletter_t: 'Новинки, скидки и анонсы походов — раз в неделю.',
    email_ph: 'Ваш e-mail', subscribe: 'Подписаться', subscribed: 'Спасибо! Вы подписаны.',
    footer_shop: 'Магазин', footer_help: 'Покупателям', footer_company: 'Компания',
    delivery: 'Доставка и оплата', returns: 'Возврат и обмен', size_guide: 'Таблица размеров', faq: 'Вопросы и ответы',
    about: 'О компании', contacts: 'Контакты', stores: 'Магазины', rights: 'Все права защищены.',
    reviews: 'отзывов', sold_out: 'Нет в наличии', new_badge: 'Новинка', sale_badge: 'Скидка',
    catalog: 'Каталог', all_products: 'Все товары', filter: 'Фильтры', category: 'Категория', gender: 'Для кого',
    activity: 'Активность', price: 'Цена', sort: 'Сортировка',
    sort_pop: 'По популярности', sort_new: 'Сначала новинки', sort_low: 'Сначала дешевле', sort_high: 'Сначала дороже',
    g_men: 'Мужчинам', g_women: 'Женщинам', g_unisex: 'Унисекс',
    c_jackets: 'Куртки', c_pants: 'Брюки', c_tops: 'Футболки и кофты', c_footwear: 'Обувь', c_packs: 'Рюкзаки', c_climbing: 'Скалолазание', c_accessories: 'Аксессуары',
    products_found: 'товаров', reset: 'Сбросить', nothing_found: 'Ничего не найдено. Попробуйте изменить фильтры.',
    color: 'Цвет', size: 'Размер', qty: 'Количество', add_to_cart: 'Добавить в корзину', buy_now: 'Купить сейчас',
    choose_size: 'Выберите размер', added: 'Товар добавлен в корзину',
    description: 'Описание', features: 'Особенности', shipping_returns: 'Доставка и возврат',
    ship_info: 'Бишкек — 1 день, регионы КР — 2–4 дня, СНГ — 5–10 дней, весь мир — 7–21 день. Возврат в течение 30 дней.',
    related: 'Вам может понравиться', in_stock: 'В наличии',
    cart_title: 'Корзина', cart_empty: 'Ваша корзина пуста', continue: 'Продолжить покупки',
    subtotal: 'Подытог', checkout: 'Оформить заказ', remove: 'Удалить',
    free_ship_left: 'До бесплатной доставки осталось', free_ship_ok: 'Вам доступна бесплатная доставка по Кыргызстану!',
    checkout_title: 'Оформление заказа', contact_info: 'Контактные данные', shipping_addr: 'Адрес доставки',
    first_name: 'Имя', last_name: 'Фамилия', phone: 'Телефон', email: 'E-mail',
    country: 'Страна', city: 'Город', address: 'Адрес (улица, дом, квартира)', zip: 'Почтовый индекс', comment: 'Комментарий к заказу',
    ship_method: 'Способ доставки', pay_method: 'Способ оплаты',
    ship_pickup: 'Самовывоз из магазина в Бишкеке', ship_courier: 'Курьер по Бишкеку', ship_kg: 'Доставка по Кыргызстану',
    ship_cis: 'Доставка в страны СНГ (СДЭК / EMS)', ship_world: 'Международная доставка (DHL / EMS)',
    pay_card: 'Банковская карта (Visa, Mastercard, Элкарт)', pay_qr: 'QR-оплата (MBank, O!Деньги, Optima, Bakai)',
    pay_install: 'Рассрочка / оплата частями (по Кыргызстану)',
    pay_cod:'Наличными или картой при получении', pay_paypal: 'PayPal / международная карта',
    order_summary: 'Ваш заказ', shipping: 'Доставка', total: 'Итого', free: 'Бесплатно',
    place_order: 'Подтвердить заказ', agree: 'Нажимая кнопку, вы соглашаетесь с условиями оферты и политикой конфиденциальности.',
    required: 'Обязательное поле', invalid_email: 'Неверный e-mail',
    order_ok: 'Спасибо! Заказ оформлен', order_num: 'Номер заказа', order_ok_t: 'Мы свяжемся с вами в течение часа для подтверждения заказа и оплаты. Детали отправлены на ваш e-mail.',
    to_home: 'На главную',
    currency: 'Валюта', language: 'Язык',
    about_title: 'О Kailas Кыргызстан',
    contacts_title: 'Контакты',
    page_not_found: 'Страница не найдена'
  },
  ky: {},
  en: {}
};

const LANGS_ENABLED = ['ru']; // позже: ['ru', 'ky', 'en']

let LANG = 'ru';
function t(key) {
  return (I18N[LANG] && I18N[LANG][key]) || I18N.ru[key] || key;
}
