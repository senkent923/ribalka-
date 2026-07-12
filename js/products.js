/*
 * Каталог магазина «РЫБОЛОВ» (Санкт-Петербург).
 * Товары со своим фото содержат поле img (файл в assets/img).
 * Цены — в рублях, ориентированы на реальный рынок снастей.
 */

const CATEGORIES = [
  { id: 'spinning',    name: 'Спиннинги',     icon: '🎣', desc: 'Удилища для ловли хищника на искусственные приманки' },
  { id: 'reels',       name: 'Катушки',       icon: '🌀', desc: 'Безынерционные катушки для спиннинга и фидера' },
  { id: 'lines',       name: 'Лески и шнуры', icon: '🧵', desc: 'Монолеска, флюорокарбон и плетёные шнуры' },
  { id: 'rods',        name: 'Удилища',       icon: '🪝', desc: 'Поплавочные, фидерные и болонские удилища' },
  { id: 'lures',       name: 'Приманки',      icon: '🐟', desc: 'Воблеры, блёсны, силикон и джиг-головки' },
  { id: 'accessories', name: 'Аксессуары',    icon: '🧰', desc: 'Подсаки, садки, ящики, поводки и мелочёвка' },
];

const PRODUCTS = [
  // ---------------- Спиннинги (реальные фото) ----------------
  { id: 'sp-01', cat: 'spinning', brand: 'Graphiteleader', name: 'Спиннинг Graphiteleader Vivo 2.13 м 3-15 г', price: 24900, old: 27500, rating: 5.0, stock: true, img: 'sp-01.png',
    specs: { 'Длина': '2.13 м', 'Тест': '3–15 г', 'Строй': 'Extra Fast', 'Секций': '2', 'Материал': 'Углеволокно', 'Вес': '104 г' } },
  { id: 'sp-02', cat: 'spinning', brand: 'Daiwa', name: 'Спиннинг Daiwa Crossfire 2.40 м 10-40 г', price: 4990, old: 5690, rating: 4.8, stock: true, img: 'sp-02.jpg',
    specs: { 'Длина': '2.40 м', 'Тест': '10–40 г', 'Строй': 'Regular Fast', 'Секций': '2', 'Материал': 'Карбон', 'Вес': '178 г' } },
  { id: 'sp-03', cat: 'spinning', brand: 'Aiko', name: 'Спиннинг Aiko Baltasar 1.86 м 0.6-8 г', price: 5490, old: 0, rating: 4.9, stock: true, img: 'sp-03.jpg',
    specs: { 'Длина': '1.86 м', 'Тест': '0.6–8 г', 'Строй': 'Fast', 'Секций': '2', 'Класс': 'Ультралайт', 'Вес': '88 г' } },
  { id: 'sp-04', cat: 'spinning', brand: 'Maximus', name: 'Спиннинг Maximus Wild Power-X 1.98 м 3-15 г', price: 3290, old: 3790, rating: 4.7, stock: true, img: 'sp-04.jpg',
    specs: { 'Длина': '1.98 м', 'Тест': '3–15 г', 'Строй': 'Fast', 'Секций': '2', 'Класс': 'Лайт', 'Вес': '112 г' } },

  // ---------------- Катушки (реальные фото) ----------------
  { id: 'rl-01', cat: 'reels', brand: 'Kaida', name: 'Катушка Kaida SK-7000 карповая', price: 2790, old: 3290, rating: 4.6, stock: true, img: 'rl-01.jpg',
    specs: { 'Размер': '7000', 'Подшипников': '5', 'Передат. число': '4.7:1', 'Вес': '540 г', 'Назначение': 'Карп / фидер' } },
  { id: 'rl-02', cat: 'reels', brand: 'RST', name: 'Катушка RST Reflex 3000', price: 3490, old: 0, rating: 4.7, stock: true, img: 'rl-02.jpg',
    specs: { 'Размер': '3000', 'Подшипников': '6', 'Передат. число': '5.2:1', 'Вес': '265 г', 'Назначение': 'Спиннинг' } },
  { id: 'rl-03', cat: 'reels', brand: 'SPRO', name: 'Катушка SPRO Blackster 4000', price: 4290, old: 4990, rating: 4.8, stock: true, img: 'rl-03.jpg',
    specs: { 'Размер': '4000', 'Подшипников': '7', 'Передат. число': '5.1:1', 'Вес': '312 г', 'Назначение': 'Спиннинг / фидер' } },
  { id: 'rl-04', cat: 'reels', brand: 'Daiwa', name: 'Катушка Daiwa Regal 2500-5iA', price: 6490, old: 7200, rating: 4.9, stock: true, img: 'rl-04.jpg',
    specs: { 'Размер': '2500', 'Подшипников': '5', 'Передат. число': '5.3:1', 'Вес': '285 г', 'Леска': '0.25/150 м' } },
  { id: 'rl-05', cat: 'reels', brand: 'Shimano', name: 'Катушка Shimano Twin Power XD 4000', price: 32900, old: 0, rating: 5.0, stock: true, img: 'rl-05.jpg',
    specs: { 'Размер': '4000', 'Подшипников': '10', 'Передат. число': '5.8:1', 'Вес': '250 г', 'Технология': 'HAGANE / X-Protect' } },

  // ---------------- Лески и шнуры (реальные фото) ----------------
  { id: 'ln-01', cat: 'lines', brand: 'Петроканат', name: 'Леска Петроканат Uni-Line 0.16 мм 250 г', price: 340, old: 0, rating: 4.7, stock: true, img: 'ln-01.jpg',
    specs: { 'Диаметр': '0.16 мм', 'Намотка': '10700 м / 250 г', 'Нагрузка': '1.5 кг', 'Тип': 'Монолеска', 'Цвет': 'Прозрачный' } },
  { id: 'ln-02', cat: 'lines', brand: 'Kosadaka', name: 'Леска Kosadaka Infinity 0.30 мм 100 м', price: 220, old: 0, rating: 4.6, stock: true, img: 'ln-02.jpg',
    specs: { 'Диаметр': '0.30 мм', 'Длина': '100 м', 'Нагрузка': '7.2 кг', 'Тип': 'Монолеска', 'Память': 'низкая' } },
  { id: 'ln-03', cat: 'lines', brand: 'Kosadaka', name: 'Плетёный шнур Kosadaka Infinity PE 0.20 мм 150 м', price: 790, old: 950, rating: 4.8, stock: true, img: 'ln-03.jpg',
    specs: { 'Диаметр': '0.20 мм', 'Длина': '150 м', 'Нагрузка': '12.9 кг', 'Тип': 'Плетёнка (X4)', 'Цвет': 'Голубой' } },
  { id: 'ln-04', cat: 'lines', brand: 'Azor Fishing', name: 'Леска Azor Fishing 0.35 мм 100 м', price: 150, old: 0, rating: 4.4, stock: true, img: 'ln-04.jpg',
    specs: { 'Диаметр': '0.35 мм', 'Длина': '100 м', 'Нагрузка': '16.5 кг', 'Тип': 'Монолеска', 'Особенность': 'без перекручиваний' } },

  // ---------------- Удилища (ожидают фото) ----------------
  { id: 'rd-01', cat: 'rods', brand: 'Salmo', name: 'Удилище поплавочное Salmo Elite Pole 5.00 м', price: 2890, old: 3400, rating: 4.7, stock: true,
    specs: { 'Длина': '5.00 м', 'Тип': 'Маховое', 'Секций': '5', 'Вес': '210 г', 'Тест': 'до 25 г' } },
  { id: 'rd-02', cat: 'rods', brand: 'Mikado', name: 'Фидер Mikado Ultraviolet Feeder 3.60 м 120 г', price: 4590, old: 0, rating: 4.8, stock: true,
    specs: { 'Длина': '3.60 м', 'Тип': 'Фидер', 'Тест': 'до 120 г', 'Секций': '3+3', 'Вес': '285 г' } },
  { id: 'rd-03', cat: 'rods', brand: 'Trabucco', name: 'Болонское удилище Trabucco Selesta 6.00 м', price: 5290, old: 5990, rating: 4.6, stock: true,
    specs: { 'Длина': '6.00 м', 'Тип': 'Болонское', 'Секций': '6', 'Вес': '340 г', 'Тест': '5–25 г' } },
  { id: 'rd-04', cat: 'rods', brand: 'Nisus', name: 'Карповое удилище Nisus Carp 3.60 м 3.5 lb', price: 3990, old: 0, rating: 4.5, stock: false,
    specs: { 'Длина': '3.60 м', 'Тип': 'Карповое', 'Тест': '3.5 lb', 'Секций': '2', 'Вес': '395 г' } },

  // ---------------- Приманки (ожидают фото) ----------------
  { id: 'lu-01', cat: 'lures', brand: 'Rapala', name: 'Воблер Rapala Original Floater F07 7 см', price: 890, old: 0, rating: 4.9, stock: true,
    specs: { 'Длина': '7 см', 'Вес': '4 г', 'Заглубление': '0.9–1.8 м', 'Плавучесть': 'Floating', 'Тип': 'Minnow' } },
  { id: 'lu-02', cat: 'lures', brand: 'Yo-Zuri', name: 'Воблер Yo-Zuri 3DS Minnow 70SP', price: 1290, old: 1490, rating: 4.8, stock: true,
    specs: { 'Длина': '7 см', 'Вес': '5 г', 'Заглубление': '1.0–1.5 м', 'Плавучесть': 'Suspending', 'Тип': 'Minnow' } },
  { id: 'lu-03', cat: 'lures', brand: 'Mepps', name: 'Блесна вращающаяся Mepps Aglia №3', price: 490, old: 0, rating: 4.9, stock: true,
    specs: { 'Размер': '№3', 'Вес': '6.5 г', 'Тип': 'Вертушка', 'Лепесток': 'Aglia', 'Цвет': 'Серебро' } },
  { id: 'lu-04', cat: 'lures', brand: 'Acme', name: 'Колеблющаяся блесна Acme Kastmaster 14 г', price: 640, old: 0, rating: 4.7, stock: true,
    specs: { 'Вес': '14 г', 'Тип': 'Колебалка', 'Материал': 'Латунь', 'Дальность': 'высокая', 'Цвет': 'Хром' } },
  { id: 'lu-05', cat: 'lures', brand: 'Keitech', name: 'Силикон Keitech Easy Shiner 3" (10 шт)', price: 590, old: 720, rating: 4.9, stock: true,
    specs: { 'Длина': '3"', 'В упаковке': '10 шт', 'Тип': 'Виброхвост', 'Съедобный': 'Да', 'Аромат': 'Кальмар' } },
  { id: 'lu-06', cat: 'lures', brand: 'Fanatik', name: 'Джиг-головка Fanatik 10 г (5 шт)', price: 320, old: 0, rating: 4.6, stock: true,
    specs: { 'Вес': '10 г', 'В упаковке': '5 шт', 'Крючок': '#2/0', 'Тип': 'Джиг-головка', 'Материал': 'Свинец' } },

  // ---------------- Аксессуары (ожидают фото) ----------------
  { id: 'ac-01', cat: 'accessories', brand: 'Cottus', name: 'Подсак телескопический Cottus 2.0 м', price: 1490, old: 0, rating: 4.7, stock: true,
    specs: { 'Длина ручки': '2.0 м', 'Голова': '50×40 см', 'Сетка': 'нейлон', 'Складной': 'Да', 'Вес': '380 г' } },
  { id: 'ac-02', cat: 'accessories', brand: 'Plano', name: 'Ящик рыболовный Plano 3700 двусторонний', price: 2190, old: 2590, rating: 4.9, stock: true,
    specs: { 'Размер': '35×22×8 см', 'Секций': '20+', 'Материал': 'Пластик', 'Влагозащита': 'Да', 'Вес': '640 г' } },
  { id: 'ac-03', cat: 'accessories', brand: 'Aquatic', name: 'Садок прорезиненный Aquatic 3.0 м', price: 1290, old: 0, rating: 4.6, stock: true,
    specs: { 'Длина': '3.0 м', 'Диаметр': '40 см', 'Материал': 'ПВХ-сетка', 'Колец': '8', 'Чехол': 'В комплекте' } },
  { id: 'ac-04', cat: 'accessories', brand: 'Owner', name: 'Крючки Owner 50922 №8 (10 шт)', price: 290, old: 0, rating: 4.9, stock: true,
    specs: { 'Размер': '№8', 'В упаковке': '10 шт', 'Тип': 'С ушком', 'Покрытие': 'Никель', 'Заточка': 'химическая' } },
  { id: 'ac-05', cat: 'accessories', brand: 'Kosadaka', name: 'Поводковый материал Kosadaka 7×7 12 кг', price: 390, old: 0, rating: 4.5, stock: true,
    specs: { 'Нагрузка': '12 кг', 'Длина': '5 м', 'Плетение': '7×7', 'Тип': 'Стальной', 'Оболочка': 'нейлон' } },
];

// Путь к фото: реальный файл в assets/img или фирменная заглушка (для товаров без фото).
function photoUrl(product) {
  return product.img ? `assets/img/${product.img}` : productFallback(product);
}

const CAT_EMOJI = {
  spinning: '🎣', reels: '🌀', lines: '🧵',
  rods: '🪝', lures: '🐟', accessories: '🧰',
};

// Фирменная заглушка (тёмно-зелёный + чёрный, без жёлтого).
function productFallback(product) {
  const emoji = CAT_EMOJI[product.cat] || '🎣';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#14493a"/>
          <stop offset="0.55" stop-color="#0d3629"/>
          <stop offset="1" stop-color="#081c16"/>
        </linearGradient>
      </defs>
      <rect width="600" height="450" fill="url(#g)"/>
      <path d="M0 330 Q150 300 300 330 T600 330" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="3"/>
      <path d="M0 372 Q150 342 300 372 T600 372" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="3"/>
      <circle cx="300" cy="196" r="72" fill="#ffffff" fill-opacity="0.05" stroke="#8fbfa8" stroke-opacity="0.5" stroke-width="2"/>
      <text x="300" y="220" font-size="66" text-anchor="middle">${emoji}</text>
      <text x="300" y="310" font-size="25" fill="#eaf3ee" text-anchor="middle" font-family="Segoe UI, sans-serif" font-weight="bold">${product.brand}</text>
      <text x="300" y="342" font-size="14" fill="#8fbfa8" text-anchor="middle" font-family="Segoe UI, sans-serif" letter-spacing="1">РЫБОЛОВ · фото уточняется</text>
    </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
