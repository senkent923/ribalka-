/*
 * Каталог товаров магазина «Клёвое место» (Санкт-Петербург).
 * Цены указаны в рублях и ориентированы на реальный рынок рыболовных снастей.
 * Поле photo — ключевые слова для реального фото (loremflickr тянет снимки с Flickr),
 * seed фиксирует конкретную фотографию за товаром, чтобы она не менялась при перезагрузке.
 */

const CATEGORIES = [
  { id: 'spinning',    name: 'Спиннинги',        icon: '🎣', desc: 'Удилища для ловли хищника на искусственные приманки' },
  { id: 'rods',        name: 'Удилища',          icon: '🪝', desc: 'Поплавочные, фидерные и болонские удилища' },
  { id: 'reels',       name: 'Катушки',          icon: '🌀', desc: 'Безынерционные и мультипликаторные катушки' },
  { id: 'lures',       name: 'Приманки',         icon: '🐟', desc: 'Воблеры, блёсны, силикон и джиг-головки' },
  { id: 'lines',       name: 'Лески и шнуры',    icon: '🧵', desc: 'Монолеска, плетёные шнуры и флюорокарбон' },
  { id: 'accessories', name: 'Аксессуары',       icon: '🧰', desc: 'Подсаки, садки, ящики, поводки и мелочёвка' },
];

const PRODUCTS = [
  // ---------------- Спиннинги ----------------
  { id: 'sp-01', cat: 'spinning', brand: 'Shimano',  name: 'Спиннинг Shimano Catana FX 2.10 м 3-14 г',      price: 4290,  old: 4990, rating: 4.8, stock: true,  photo: 'fishing,spinning,rod', seed: 101,
    specs: { 'Длина': '2.10 м', 'Тест': '3–14 г', 'Строй': 'Fast', 'Секций': '2', 'Вес': '128 г' } },
  { id: 'sp-02', cat: 'spinning', brand: 'Favorite', name: 'Спиннинг Favorite Blue Bird 1.98 м 1-8 г',      price: 5690,  old: 0,    rating: 4.9, stock: true,  photo: 'fishing,rod,ultralight', seed: 102,
    specs: { 'Длина': '1.98 м', 'Тест': '1–8 г', 'Строй': 'Fast', 'Секций': '2', 'Вес': '96 г' } },
  { id: 'sp-03', cat: 'spinning', brand: 'Daiwa',    name: 'Спиннинг Daiwa Ninja X 2.40 м 10-40 г',         price: 6790,  old: 7500, rating: 4.7, stock: true,  photo: 'fishing,rod,river', seed: 103,
    specs: { 'Длина': '2.40 м', 'Тест': '10–40 г', 'Строй': 'Regular Fast', 'Секций': '2', 'Вес': '181 г' } },
  { id: 'sp-04', cat: 'spinning', brand: 'Maximus',  name: 'Спиннинг Maximus Black Widow 2.70 м 15-50 г',   price: 5290,  old: 0,    rating: 4.6, stock: false, photo: 'fishing,tackle,rod', seed: 104,
    specs: { 'Длина': '2.70 м', 'Тест': '15–50 г', 'Строй': 'Fast', 'Секций': '2', 'Вес': '196 г' } },
  { id: 'sp-05', cat: 'spinning', brand: 'Norstream',name: 'Спиннинг Norstream Standard 2.13 м 5-25 г',     price: 7990,  old: 8900, rating: 4.8, stock: true,  photo: 'spinning,fishing,lake', seed: 105,
    specs: { 'Длина': '2.13 м', 'Тест': '5–25 г', 'Строй': 'Fast', 'Секций': '2', 'Вес': '142 г' } },
  { id: 'sp-06', cat: 'spinning', brand: 'Aiko',     name: 'Спиннинг Aiko MargO 2.28 м 0.5-5 г',            price: 8490,  old: 0,    rating: 5.0, stock: true,  photo: 'fishing,rod,forest', seed: 106,
    specs: { 'Длина': '2.28 м', 'Тест': '0.5–5 г', 'Строй': 'Extra Fast', 'Секций': '2', 'Вес': '89 г' } },

  // ---------------- Удилища ----------------
  { id: 'rd-01', cat: 'rods', brand: 'Salmo',    name: 'Удилище поплавочное Salmo Elite Pole 5.00 м',   price: 2890, old: 3400, rating: 4.7, stock: true,  photo: 'fishing,pole,pond', seed: 201,
    specs: { 'Длина': '5.00 м', 'Тип': 'Маховое', 'Секций': '5', 'Вес': '210 г', 'Тест': 'до 25 г' } },
  { id: 'rd-02', cat: 'rods', brand: 'Mikado',   name: 'Фидер Mikado Ultraviolet Feeder 3.60 м 120 г',  price: 4590, old: 0,    rating: 4.8, stock: true,  photo: 'feeder,fishing,river', seed: 202,
    specs: { 'Длина': '3.60 м', 'Тип': 'Фидер', 'Тест': 'до 120 г', 'Секций': '3+3', 'Вес': '285 г' } },
  { id: 'rd-03', cat: 'rods', brand: 'Trabucco', name: 'Болонское удилище Trabucco Selesta 6.00 м',     price: 5290, old: 5990, rating: 4.6, stock: true,  photo: 'bolognese,fishing,rod', seed: 203,
    specs: { 'Длина': '6.00 м', 'Тип': 'Болонское', 'Секций': '6', 'Вес': '340 г', 'Тест': '5–25 г' } },
  { id: 'rd-04', cat: 'rods', brand: 'Nisus',    name: 'Карповое удилище Nisus Carp 3.60 м 3.5 lb',     price: 3990, old: 0,    rating: 4.5, stock: false, photo: 'carp,fishing,rod', seed: 204,
    specs: { 'Длина': '3.60 м', 'Тип': 'Карповое', 'Тест': '3.5 lb', 'Секций': '2', 'Вес': '395 г' } },

  // ---------------- Катушки ----------------
  { id: 'rl-01', cat: 'reels', brand: 'Shimano', name: 'Катушка Shimano Sedona 2500 FI',                price: 7690, old: 8900, rating: 4.9, stock: true,  photo: 'fishing,reel', seed: 301,
    specs: { 'Размер': '2500', 'Подшипников': '4', 'Передат. число': '5.0:1', 'Вес': '240 г', 'Леска': '0.25/140 м' } },
  { id: 'rl-02', cat: 'reels', brand: 'Daiwa',   name: 'Катушка Daiwa Revros LT 3000-C',                price: 6490, old: 0,    rating: 4.8, stock: true,  photo: 'fishing,reel,spinning', seed: 302,
    specs: { 'Размер': '3000', 'Подшипников': '5', 'Передат. число': '5.3:1', 'Вес': '220 г', 'Леска': '0.28/150 м' } },
  { id: 'rl-03', cat: 'reels', brand: 'Ryobi',   name: 'Катушка Ryobi Ecusima 2000 Vi',                 price: 3290, old: 3900, rating: 4.6, stock: true,  photo: 'fishing,reel,gear', seed: 303,
    specs: { 'Размер': '2000', 'Подшипников': '6', 'Передат. число': '5.1:1', 'Вес': '265 г', 'Леска': '0.20/180 м' } },
  { id: 'rl-04', cat: 'reels', brand: 'Okuma',   name: 'Катушка Okuma Ceymar C-30',                     price: 4890, old: 0,    rating: 4.7, stock: true,  photo: 'reel,fishing,metal', seed: 304,
    specs: { 'Размер': '3000', 'Подшипников': '8', 'Передат. число': '5.0:1', 'Вес': '272 г', 'Леска': '0.30/120 м' } },
  { id: 'rl-05', cat: 'reels', brand: 'Abu Garcia', name: 'Мультипликатор Abu Garcia Black Max',        price: 8990, old: 9990, rating: 4.8, stock: false, photo: 'baitcasting,reel,fishing', seed: 305,
    specs: { 'Тип': 'Мультипликатор', 'Подшипников': '4', 'Передат. число': '6.4:1', 'Вес': '207 г', 'Тормоз': 'до 8 кг' } },

  // ---------------- Приманки ----------------
  { id: 'lu-01', cat: 'lures', brand: 'Rapala',   name: 'Воблер Rapala Original Floater F07 7 см',      price: 890,  old: 0,    rating: 4.9, stock: true,  photo: 'fishing,lure,wobbler', seed: 401,
    specs: { 'Длина': '7 см', 'Вес': '4 г', 'Заглубление': '0.9–1.8 м', 'Плавучесть': 'Floating', 'Тип': 'Minnow' } },
  { id: 'lu-02', cat: 'lures', brand: 'Yo-Zuri',  name: 'Воблер Yo-Zuri 3DS Minnow 70SP',               price: 1290, old: 1490, rating: 4.8, stock: true,  photo: 'fishing,lure,bait', seed: 402,
    specs: { 'Длина': '7 см', 'Вес': '5 г', 'Заглубление': '1.0–1.5 м', 'Плавучесть': 'Suspending', 'Тип': 'Minnow' } },
  { id: 'lu-03', cat: 'lures', brand: 'Mepps',    name: 'Блесна вращающаяся Mepps Aglia №3',            price: 490,  old: 0,    rating: 4.9, stock: true,  photo: 'fishing,spinner,spoon', seed: 403,
    specs: { 'Размер': '№3', 'Вес': '6.5 г', 'Тип': 'Вертушка', 'Лепесток': 'Aglia', 'Цвет': 'Серебро' } },
  { id: 'lu-04', cat: 'lures', brand: 'Acme',     name: 'Колеблющаяся блесна Acme Kastmaster 14 г',     price: 640,  old: 0,    rating: 4.7, stock: true,  photo: 'fishing,spoon,metal', seed: 404,
    specs: { 'Вес': '14 г', 'Тип': 'Колебалка', 'Материал': 'Латунь', 'Дальность': 'высокая', 'Цвет': 'Хром' } },
  { id: 'lu-05', cat: 'lures', brand: 'Keitech',  name: 'Силикон Keitech Easy Shiner 3" (10 шт)',       price: 590,  old: 720,  rating: 4.9, stock: true,  photo: 'soft,bait,fishing', seed: 405,
    specs: { 'Длина': '3"', 'В упаковке': '10 шт', 'Тип': 'Виброхвост', 'Съедобный': 'Да', 'Аромат': 'Кальмар' } },
  { id: 'lu-06', cat: 'lures', brand: 'Fanatik',  name: 'Джиг-головка Fanatik 10 г (5 шт)',             price: 320,  old: 0,    rating: 4.6, stock: true,  photo: 'jig,fishing,hook', seed: 406,
    specs: { 'Вес': '10 г', 'В упаковке': '5 шт', 'Крючок': '#2/0', 'Тип': 'Джиг-головка', 'Материал': 'Свинец' } },
  { id: 'lu-07', cat: 'lures', brand: 'Strike Pro', name: 'Воблер Strike Pro Flap Jack 90 5 см',        price: 1090, old: 1290, rating: 4.7, stock: false, photo: 'crankbait,fishing,lure', seed: 407,
    specs: { 'Длина': '5 см', 'Вес': '9 г', 'Заглубление': '1.5–3.0 м', 'Плавучесть': 'Floating', 'Тип': 'Crankbait' } },

  // ---------------- Лески и шнуры ----------------
  { id: 'ln-01', cat: 'lines', brand: 'Power Pro', name: 'Плетёный шнур Power Pro 0.19 мм 135 м',        price: 1490, old: 1790, rating: 4.9, stock: true,  photo: 'fishing,line,braid', seed: 501,
    specs: { 'Диаметр': '0.19 мм', 'Длина': '135 м', 'Нагрузка': '13 кг', 'Тип': 'Плетёнка', 'Цвет': 'Мох' } },
  { id: 'ln-02', cat: 'lines', brand: 'Sunline',   name: 'Флюорокарбон Sunline FC 0.28 мм 50 м',         price: 990,  old: 0,    rating: 4.8, stock: true,  photo: 'fishing,line,spool', seed: 502,
    specs: { 'Диаметр': '0.28 мм', 'Длина': '50 м', 'Нагрузка': '5.5 кг', 'Тип': 'Флюорокарбон', 'Незаметность': 'высокая' } },
  { id: 'ln-03', cat: 'lines', brand: 'Salmo',     name: 'Монолеска Salmo Diamond 0.25 мм 150 м',        price: 340,  old: 0,    rating: 4.6, stock: true,  photo: 'fishing,line,nylon', seed: 503,
    specs: { 'Диаметр': '0.25 мм', 'Длина': '150 м', 'Нагрузка': '6.4 кг', 'Тип': 'Монолеска', 'Цвет': 'Прозрачный' } },
  { id: 'ln-04', cat: 'lines', brand: 'Varivas',   name: 'Плетёный шнур Varivas Avani 0.13 мм 150 м',    price: 2290, old: 2590, rating: 5.0, stock: false, photo: 'braid,fishing,line', seed: 504,
    specs: { 'Диаметр': '0.13 мм', 'Длина': '150 м', 'Нагрузка': '9 кг', 'Тип': 'Плетёнка', 'Цвет': 'Жёлтый' } },

  // ---------------- Аксессуары ----------------
  { id: 'ac-01', cat: 'accessories', brand: 'Cottus',   name: 'Подсак телескопический Cottus 2.0 м',    price: 1490, old: 0,    rating: 4.7, stock: true,  photo: 'fishing,net,landing', seed: 601,
    specs: { 'Длина ручки': '2.0 м', 'Голова': '50×40 см', 'Сетка': 'нейлон', 'Складной': 'Да', 'Вес': '380 г' } },
  { id: 'ac-02', cat: 'accessories', brand: 'Plano',    name: 'Ящик-рыболовный Plano 3700 двусторонний', price: 2190, old: 2590, rating: 4.9, stock: true,  photo: 'tackle,box,fishing', seed: 602,
    specs: { 'Размер': '35×22×8 см', 'Секций': '20+', 'Материал': 'Пластик', 'Влагозащита': 'Да', 'Вес': '640 г' } },
  { id: 'ac-03', cat: 'accessories', brand: 'Aquatic',  name: 'Садок прорезиненный Aquatic 3.0 м',       price: 1290, old: 0,    rating: 4.6, stock: true,  photo: 'fishing,keepnet,bag', seed: 603,
    specs: { 'Длина': '3.0 м', 'Диаметр': '40 см', 'Материал': 'ПВХ-сетка', 'Колец': '8', 'Чехол': 'В комплекте' } },
  { id: 'ac-04', cat: 'accessories', brand: 'Owner',    name: 'Крючки Owner 50922 №8 (10 шт)',           price: 290,  old: 0,    rating: 4.9, stock: true,  photo: 'fishing,hooks,tackle', seed: 604,
    specs: { 'Размер': '№8', 'В упаковке': '10 шт', 'Тип': 'С ушком', 'Покрытие': 'Никель', 'Заточка': 'химическая' } },
  { id: 'ac-05', cat: 'accessories', brand: 'Kosadaka', name: 'Поводковый материал Kosadaka 7×7 12 кг',  price: 390,  old: 0,    rating: 4.5, stock: true,  photo: 'fishing,leader,wire', seed: 605,
    specs: { 'Нагрузка': '12 кг', 'Длина': '5 м', 'Плетение': '7×7', 'Тип': 'Стальной', 'Оболочка': 'нейлон' } },
  { id: 'ac-06', cat: 'accessories', brand: 'Rapala',   name: 'Пассатижи рыболовные Rapala 15 см',        price: 1690, old: 1990, rating: 4.8, stock: false, photo: 'fishing,pliers,tool', seed: 606,
    specs: { 'Длина': '15 см', 'Материал': 'Нержавейка', 'Кусачки': 'Да', 'Чехол': 'В комплекте', 'Вес': '145 г' } },
];

// Реальные фото товара: сервис отдаёт снимок с Flickr по ключевым словам,
// seed фиксирует конкретное фото за карточкой.
function photoUrl(product, w = 600, h = 450) {
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(product.photo)}?lock=${product.seed}`;
}
