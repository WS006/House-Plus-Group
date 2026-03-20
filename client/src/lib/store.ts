// ============================================================
// House Plus Group - Local Storage Data Store
// Manages: products, messages, admin auth, favorites
// ============================================================

export interface Product {
  id: string;
  category: 'solar' | 'appliances' | '3c';
  nameEn: string;
  nameZh: string;
  nameFr: string;
  nameRu: string;
  nameEs: string;
  nameAr: string;
  descEn: string;
  descZh: string;
  descFr: string;
  descRu: string;
  descEs: string;
  descAr: string;
  image: string;
  images: string[];
  moq: string;
  delivery: string;
  payment: string;
  specs: { key: string; value: string }[];
  tags: string[];
  isNew: boolean;
  isHot: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  product?: string;
  quantity?: string;
  requirements?: string;
  type: 'contact' | 'inquiry';
  isRead: boolean;
  createdAt: string;
}

const PRODUCTS_KEY = 'houseplus_products';
const MESSAGES_KEY = 'houseplus_messages';
const FAVORITES_KEY = 'houseplus_favorites';

// Default products data
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'solar-panel-mono-400w',
    category: 'solar',
    nameEn: '400W Monocrystalline Solar Panel',
    nameZh: '400W单晶硅太阳能板',
    nameFr: 'Panneau Solaire Monocristallin 400W',
    nameRu: 'Монокристаллическая Солнечная Панель 400Вт',
    nameEs: 'Panel Solar Monocristalino 400W',
    nameAr: 'لوح شمسي أحادي البلورة 400 واط',
    descEn: 'High-efficiency 400W monocrystalline solar panel with 21% efficiency. Ideal for home and commercial solar systems. Durable aluminum frame, IP67 junction box.',
    descZh: '高效率400W单晶硅太阳能板，效率21%。适用于家用和商业太阳能系统。耐用铝合金边框，IP67接线盒。',
    descFr: 'Panneau solaire monocristallin 400W haute efficacité avec 21% d\'efficacité. Idéal pour les systèmes solaires domestiques et commerciaux.',
    descRu: 'Высокоэффективная монокристаллическая солнечная панель 400Вт с КПД 21%. Идеально подходит для домашних и коммерческих солнечных систем.',
    descEs: 'Panel solar monocristalino 400W de alta eficiencia con 21% de eficiencia. Ideal para sistemas solares domésticos y comerciales.',
    descAr: 'لوح شمسي أحادي البلورة 400 واط عالي الكفاءة بكفاءة 21٪. مثالي للأنظمة الشمسية المنزلية والتجارية.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&q=80',
    ],
    moq: '10 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Power', value: '400W' },
      { key: 'Efficiency', value: '21%' },
      { key: 'Voc', value: '48.8V' },
      { key: 'Isc', value: '10.5A' },
      { key: 'Size', value: '1755×1038×35mm' },
      { key: 'Weight', value: '19.5kg' },
      { key: 'Frame', value: 'Anodized Aluminum' },
      { key: 'Warranty', value: '25 years' },
    ],
    tags: ['solar', 'monocrystalline', 'high-efficiency', 'residential'],
    isNew: false,
    isHot: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'solar-inverter-5kw',
    category: 'solar',
    nameEn: '5KW Hybrid Solar Inverter',
    nameZh: '5KW混合型太阳能逆变器',
    nameFr: 'Onduleur Solaire Hybride 5KW',
    nameRu: 'Гибридный Солнечный Инвертор 5КВт',
    nameEs: 'Inversor Solar Híbrido 5KW',
    nameAr: 'عاكس شمسي هجين 5 كيلوواط',
    descEn: '5KW hybrid solar inverter with built-in MPPT charge controller. Supports grid-tie and off-grid modes. LCD display, WiFi monitoring.',
    descZh: '5KW混合型太阳能逆变器，内置MPPT充电控制器。支持并网和离网模式。LCD显示屏，WiFi监控。',
    descFr: 'Onduleur solaire hybride 5KW avec contrôleur de charge MPPT intégré. Supporte les modes réseau et hors réseau.',
    descRu: 'Гибридный солнечный инвертор 5КВт со встроенным контроллером заряда MPPT. Поддерживает режимы с сетью и без сети.',
    descEs: 'Inversor solar híbrido 5KW con controlador de carga MPPT integrado. Admite modos de red y fuera de red.',
    descAr: 'عاكس شمسي هجين 5 كيلوواط مع وحدة تحكم في الشحن MPPT مدمجة. يدعم أوضاع الشبكة وخارج الشبكة.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    moq: '5 pcs',
    delivery: '10-20 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Power', value: '5KW' },
      { key: 'Input Voltage', value: '120-450VDC' },
      { key: 'Output Voltage', value: '220/230VAC' },
      { key: 'MPPT Efficiency', value: '99.9%' },
      { key: 'Battery Voltage', value: '48V' },
      { key: 'Protection', value: 'IP20' },
    ],
    tags: ['solar', 'inverter', 'hybrid', 'MPPT'],
    isNew: true,
    isHot: true,
    createdAt: '2024-02-01',
  },
  {
    id: 'lithium-battery-100ah',
    category: 'solar',
    nameEn: '100Ah LiFePO4 Lithium Battery',
    nameZh: '100Ah磷酸铁锂电池',
    nameFr: 'Batterie Lithium LiFePO4 100Ah',
    nameRu: 'Литиевый Аккумулятор LiFePO4 100Ач',
    nameEs: 'Batería de Litio LiFePO4 100Ah',
    nameAr: 'بطارية ليثيوم LiFePO4 100 أمبير',
    descEn: '100Ah LiFePO4 lithium battery with BMS protection. 4000+ cycle life, lightweight design. Perfect for solar energy storage systems.',
    descZh: '100Ah磷酸铁锂电池，带BMS保护。4000+循环寿命，轻量化设计。完美适配太阳能储能系统。',
    descFr: 'Batterie lithium LiFePO4 100Ah avec protection BMS. Durée de vie 4000+ cycles, conception légère.',
    descRu: 'Литиевый аккумулятор LiFePO4 100Ач с защитой BMS. Срок службы 4000+ циклов, легкая конструкция.',
    descEs: 'Batería de litio LiFePO4 100Ah con protección BMS. Vida útil de 4000+ ciclos, diseño ligero.',
    descAr: 'بطارية ليثيوم LiFePO4 100 أمبير مع حماية BMS. عمر 4000+ دورة، تصميم خفيف الوزن.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80'],
    moq: '10 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Capacity', value: '100Ah' },
      { key: 'Voltage', value: '12.8V' },
      { key: 'Cycle Life', value: '4000+' },
      { key: 'Chemistry', value: 'LiFePO4' },
      { key: 'Weight', value: '11.5kg' },
      { key: 'BMS', value: 'Built-in' },
    ],
    tags: ['solar', 'battery', 'LiFePO4', 'storage'],
    isNew: false,
    isHot: true,
    createdAt: '2024-01-20',
  },
  {
    id: 'solar-street-light-100w',
    category: 'solar',
    nameEn: '100W All-in-One Solar Street Light',
    nameZh: '100W一体化太阳能路灯',
    nameFr: 'Lampadaire Solaire Tout-en-Un 100W',
    nameRu: 'Солнечный Уличный Фонарь 100Вт Все-в-Одном',
    nameEs: 'Farola Solar Todo-en-Uno 100W',
    nameAr: 'مصباح شارع شمسي متكامل 100 واط',
    descEn: '100W all-in-one solar street light with motion sensor. IP65 waterproof, 3 lighting modes, remote control. Easy installation.',
    descZh: '100W一体化太阳能路灯，带运动传感器。IP65防水，3种照明模式，遥控器。安装简便。',
    descFr: 'Lampadaire solaire tout-en-un 100W avec détecteur de mouvement. IP65 étanche, 3 modes d\'éclairage.',
    descRu: 'Солнечный уличный фонарь 100Вт все-в-одном с датчиком движения. IP65 водонепроницаемый, 3 режима освещения.',
    descEs: 'Farola solar todo-en-uno 100W con sensor de movimiento. IP65 impermeable, 3 modos de iluminación.',
    descAr: 'مصباح شارع شمسي متكامل 100 واط مع مستشعر حركة. مقاوم للماء IP65، 3 أوضاع إضاءة.',
    image: 'https://images.unsplash.com/photo-1548613053-22087dd8edb8?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1548613053-22087dd8edb8?w=600&q=80'],
    moq: '20 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Power', value: '100W' },
      { key: 'Lumens', value: '12000lm' },
      { key: 'Battery', value: '30000mAh' },
      { key: 'IP Rating', value: 'IP65' },
      { key: 'Sensor', value: 'PIR Motion' },
      { key: 'Warranty', value: '2 years' },
    ],
    tags: ['solar', 'street light', 'outdoor', 'LED'],
    isNew: false,
    isHot: false,
    createdAt: '2024-01-10',
  },
  {
    id: 'air-fryer-5l',
    category: 'appliances',
    nameEn: '5L Digital Air Fryer',
    nameZh: '5L数字空气炸锅',
    nameFr: 'Friteuse à Air Numérique 5L',
    nameRu: 'Цифровая Аэрофритюрница 5Л',
    nameEs: 'Freidora de Aire Digital 5L',
    nameAr: 'قلاية هواء رقمية 5 لتر',
    descEn: '5L digital air fryer with 8 preset cooking modes. 1800W power, 360° hot air circulation, non-stick basket. Healthier cooking with 80% less oil.',
    descZh: '5L数字空气炸锅，8种预设烹饪模式。1800W功率，360°热风循环，不粘锅篮。减少80%用油，更健康烹饪。',
    descFr: 'Friteuse à air numérique 5L avec 8 modes de cuisson prédéfinis. Puissance 1800W, circulation d\'air chaud 360°.',
    descRu: 'Цифровая аэрофритюрница 5Л с 8 предустановленными режимами приготовления. Мощность 1800Вт.',
    descEs: 'Freidora de aire digital 5L con 8 modos de cocción preestablecidos. Potencia 1800W, circulación de aire caliente 360°.',
    descAr: 'قلاية هواء رقمية 5 لتر مع 8 أوضاع طهي مسبقة الضبط. قدرة 1800 واط، تدوير هواء ساخن 360°.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80'],
    moq: '50 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Capacity', value: '5L' },
      { key: 'Power', value: '1800W' },
      { key: 'Temperature', value: '80-200°C' },
      { key: 'Timer', value: '0-60 min' },
      { key: 'Presets', value: '8 modes' },
      { key: 'Voltage', value: '220V/50Hz' },
    ],
    tags: ['appliances', 'air fryer', 'kitchen', 'cooking'],
    isNew: true,
    isHot: true,
    createdAt: '2024-02-10',
  },
  {
    id: 'blender-1200w',
    category: 'appliances',
    nameEn: '1200W Professional Blender',
    nameZh: '1200W专业搅拌机',
    nameFr: 'Blender Professionnel 1200W',
    nameRu: 'Профессиональный Блендер 1200Вт',
    nameEs: 'Licuadora Profesional 1200W',
    nameAr: 'خلاط محترف 1200 واط',
    descEn: '1200W professional blender with 2L BPA-free jar. 6 stainless steel blades, 3 speed settings + pulse. Perfect for smoothies, soups, and more.',
    descZh: '1200W专业搅拌机，2L无BPA容器。6片不锈钢刀片，3档速度+脉冲功能。完美制作冰沙、汤品等。',
    descFr: 'Blender professionnel 1200W avec bol de 2L sans BPA. 6 lames en acier inoxydable, 3 vitesses + impulsion.',
    descRu: 'Профессиональный блендер 1200Вт с чашей 2Л без BPA. 6 лезвий из нержавеющей стали, 3 скорости + импульс.',
    descEs: 'Licuadora profesional 1200W con jarra de 2L libre de BPA. 6 cuchillas de acero inoxidable, 3 velocidades + pulso.',
    descAr: 'خلاط محترف 1200 واط مع وعاء 2 لتر خالٍ من BPA. 6 شفرات من الفولاذ المقاوم للصدأ، 3 سرعات + نبض.',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80'],
    moq: '50 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Power', value: '1200W' },
      { key: 'Capacity', value: '2L' },
      { key: 'Blades', value: '6 SS blades' },
      { key: 'Speed', value: '3 + Pulse' },
      { key: 'Material', value: 'BPA-Free' },
      { key: 'Voltage', value: '220V/50Hz' },
    ],
    tags: ['appliances', 'blender', 'kitchen', 'cooking'],
    isNew: false,
    isHot: false,
    createdAt: '2024-01-05',
  },
  {
    id: 'smart-watch-pro',
    category: '3c',
    nameEn: 'Smart Watch Pro - Health Monitor',
    nameZh: '智能手表Pro - 健康监测',
    nameFr: 'Montre Connectée Pro - Moniteur de Santé',
    nameRu: 'Умные Часы Pro - Монитор Здоровья',
    nameEs: 'Reloj Inteligente Pro - Monitor de Salud',
    nameAr: 'ساعة ذكية برو - مراقب الصحة',
    descEn: 'Smart watch with heart rate, blood oxygen, sleep tracking. 1.7" HD display, IP68 waterproof, 7-day battery life. Compatible with iOS and Android.',
    descZh: '智能手表，支持心率、血氧、睡眠监测。1.7英寸高清显示屏，IP68防水，7天续航。兼容iOS和Android。',
    descFr: 'Montre connectée avec surveillance de la fréquence cardiaque, de l\'oxygène sanguin et du sommeil. Écran HD 1,7", IP68 étanche.',
    descRu: 'Умные часы с мониторингом сердечного ритма, кислорода в крови и сна. Дисплей HD 1,7", IP68 водонепроницаемые.',
    descEs: 'Reloj inteligente con monitoreo de frecuencia cardíaca, oxígeno en sangre y sueño. Pantalla HD 1.7", IP68 impermeable.',
    descAr: 'ساعة ذكية مع مراقبة معدل ضربات القلب والأكسجين في الدم والنوم. شاشة HD 1.7 بوصة، مقاوم للماء IP68.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    moq: '100 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Display', value: '1.7" HD TFT' },
      { key: 'Battery', value: '300mAh, 7 days' },
      { key: 'Water Resistance', value: 'IP68' },
      { key: 'Sensors', value: 'HR, SpO2, Accelerometer' },
      { key: 'Connectivity', value: 'Bluetooth 5.0' },
      { key: 'Compatibility', value: 'iOS & Android' },
    ],
    tags: ['3c', 'smartwatch', 'wearable', 'health'],
    isNew: true,
    isHot: true,
    createdAt: '2024-02-15',
  },
  {
    id: 'tws-earphone',
    category: '3c',
    nameEn: 'TWS Bluetooth Earphones with ANC',
    nameZh: 'TWS蓝牙耳机（主动降噪）',
    nameFr: 'Écouteurs Bluetooth TWS avec ANC',
    nameRu: 'TWS Bluetooth Наушники с ANC',
    nameEs: 'Auriculares Bluetooth TWS con ANC',
    nameAr: 'سماعات بلوتوث TWS مع ANC',
    descEn: 'TWS earphones with active noise cancellation. Bluetooth 5.3, 30-hour total battery life, IPX5 water resistant. Hi-Fi sound quality.',
    descZh: 'TWS蓝牙耳机，主动降噪。蓝牙5.3，总续航30小时，IPX5防水。Hi-Fi音质。',
    descFr: 'Écouteurs TWS avec réduction active du bruit. Bluetooth 5.3, autonomie totale 30 heures, résistance à l\'eau IPX5.',
    descRu: 'TWS наушники с активным шумоподавлением. Bluetooth 5.3, общее время работы 30 часов, IPX5 водонепроницаемые.',
    descEs: 'Auriculares TWS con cancelación activa de ruido. Bluetooth 5.3, batería total de 30 horas, resistencia al agua IPX5.',
    descAr: 'سماعات TWS مع إلغاء الضوضاء النشط. بلوتوث 5.3، عمر بطارية إجمالي 30 ساعة، مقاومة للماء IPX5.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'],
    moq: '100 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Bluetooth', value: '5.3' },
      { key: 'Battery (Earphone)', value: '50mAh, 6h' },
      { key: 'Battery (Case)', value: '400mAh, 24h' },
      { key: 'ANC', value: 'Active Noise Cancellation' },
      { key: 'Water Resistance', value: 'IPX5' },
      { key: 'Driver', value: '10mm Dynamic' },
    ],
    tags: ['3c', 'earphone', 'bluetooth', 'TWS', 'ANC'],
    isNew: false,
    isHot: true,
    createdAt: '2024-01-25',
  },
  {
    id: 'power-bank-20000',
    category: '3c',
    nameEn: '20000mAh Solar Power Bank',
    nameZh: '20000mAh太阳能充电宝',
    nameFr: 'Batterie Externe Solaire 20000mAh',
    nameRu: 'Солнечный Павербанк 20000мАч',
    nameEs: 'Batería Externa Solar 20000mAh',
    nameAr: 'بنك طاقة شمسي 20000 مللي أمبير',
    descEn: '20000mAh solar power bank with dual USB + Type-C output. Built-in solar panel for emergency charging. LED flashlight, IP65 waterproof.',
    descZh: '20000mAh太阳能充电宝，双USB+Type-C输出。内置太阳能板应急充电。LED手电筒，IP65防水。',
    descFr: 'Batterie externe solaire 20000mAh avec double sortie USB + Type-C. Panneau solaire intégré pour charge d\'urgence.',
    descRu: 'Солнечный павербанк 20000мАч с двойным USB + Type-C выходом. Встроенная солнечная панель для аварийной зарядки.',
    descEs: 'Batería externa solar 20000mAh con salida USB dual + Type-C. Panel solar integrado para carga de emergencia.',
    descAr: 'بنك طاقة شمسي 20000 مللي أمبير مع مخرج USB مزدوج + Type-C. لوح شمسي مدمج للشحن الطارئ.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80'],
    moq: '100 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Capacity', value: '20000mAh' },
      { key: 'Output', value: '2x USB + Type-C' },
      { key: 'Solar Panel', value: '5W' },
      { key: 'Input', value: 'Micro USB + Type-C' },
      { key: 'Water Resistance', value: 'IP65' },
      { key: 'LED', value: 'Flashlight' },
    ],
    tags: ['3c', 'power bank', 'solar', 'portable'],
    isNew: false,
    isHot: false,
    createdAt: '2024-01-08',
  },
  {
    id: 'sd-card-128gb',
    category: '3c',
    nameEn: '128GB High-Speed SD Memory Card',
    nameZh: '128GB高速SD存储卡',
    nameFr: 'Carte Mémoire SD 128Go Haute Vitesse',
    nameRu: 'Высокоскоростная SD Карта Памяти 128ГБ',
    nameEs: 'Tarjeta de Memoria SD 128GB Alta Velocidad',
    nameAr: 'بطاقة ذاكرة SD عالية السرعة 128 جيجابايت',
    descEn: '128GB Class 10 UHS-I SD card. Read speed up to 100MB/s, write speed up to 80MB/s. Compatible with cameras, phones, and tablets.',
    descZh: '128GB Class 10 UHS-I SD卡。读取速度高达100MB/s，写入速度高达80MB/s。兼容相机、手机和平板。',
    descFr: 'Carte SD 128Go Class 10 UHS-I. Vitesse de lecture jusqu\'à 100Mo/s, vitesse d\'écriture jusqu\'à 80Mo/s.',
    descRu: 'SD карта 128ГБ Class 10 UHS-I. Скорость чтения до 100МБ/с, скорость записи до 80МБ/с.',
    descEs: 'Tarjeta SD 128GB Class 10 UHS-I. Velocidad de lectura hasta 100MB/s, velocidad de escritura hasta 80MB/s.',
    descAr: 'بطاقة SD 128 جيجابايت Class 10 UHS-I. سرعة قراءة تصل إلى 100 ميجابايت/ثانية، سرعة كتابة تصل إلى 80 ميجابايت/ثانية.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    moq: '500 pcs',
    delivery: '5-10 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Capacity', value: '128GB' },
      { key: 'Class', value: 'Class 10 UHS-I' },
      { key: 'Read Speed', value: 'Up to 100MB/s' },
      { key: 'Write Speed', value: 'Up to 80MB/s' },
      { key: 'Format', value: 'exFAT' },
      { key: 'Compatibility', value: 'Universal' },
    ],
    tags: ['3c', 'SD card', 'memory', 'storage'],
    isNew: false,
    isHot: false,
    createdAt: '2024-01-01',
  },
  {
    id: 'charge-controller-40a',
    category: 'solar',
    nameEn: '40A MPPT Solar Charge Controller',
    nameZh: '40A MPPT太阳能充电控制器',
    nameFr: 'Contrôleur de Charge Solaire MPPT 40A',
    nameRu: 'MPPT Контроллер Заряда Солнечной Батареи 40А',
    nameEs: 'Controlador de Carga Solar MPPT 40A',
    nameAr: 'وحدة تحكم شحن شمسية MPPT 40 أمبير',
    descEn: '40A MPPT solar charge controller with LCD display. Supports 12V/24V/48V battery systems. Multiple protection functions, high efficiency up to 98%.',
    descZh: '40A MPPT太阳能充电控制器，带LCD显示屏。支持12V/24V/48V电池系统。多重保护功能，效率高达98%。',
    descFr: 'Contrôleur de charge solaire MPPT 40A avec écran LCD. Prend en charge les systèmes de batterie 12V/24V/48V.',
    descRu: 'MPPT контроллер заряда 40А с LCD дисплеем. Поддерживает аккумуляторные системы 12В/24В/48В.',
    descEs: 'Controlador de carga solar MPPT 40A con pantalla LCD. Compatible con sistemas de batería 12V/24V/48V.',
    descAr: 'وحدة تحكم شحن شمسية MPPT 40 أمبير مع شاشة LCD. تدعم أنظمة البطاريات 12 فولت/24 فولت/48 فولت.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80'],
    moq: '20 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Current', value: '40A' },
      { key: 'Voltage', value: '12V/24V/48V' },
      { key: 'Max PV Input', value: '150V' },
      { key: 'Efficiency', value: '98%' },
      { key: 'Display', value: 'LCD' },
      { key: 'Protection', value: 'Over-charge, Over-discharge, Short circuit' },
    ],
    tags: ['solar', 'charge controller', 'MPPT'],
    isNew: false,
    isHot: false,
    createdAt: '2024-01-12',
  },
  {
    id: 'rice-cooker-5l',
    category: 'appliances',
    nameEn: '5L Digital Rice Cooker',
    nameZh: '5L数字电饭煲',
    nameFr: 'Cuiseur à Riz Numérique 5L',
    nameRu: 'Цифровая Рисоварка 5Л',
    nameEs: 'Arrocera Digital 5L',
    nameAr: 'طنجرة أرز رقمية 5 لتر',
    descEn: '5L digital rice cooker with 12 cooking functions. Non-stick inner pot, keep warm function, delay timer. Perfect for families.',
    descZh: '5L数字电饭煲，12种烹饪功能。不粘内锅，保温功能，延时定时器。适合家庭使用。',
    descFr: 'Cuiseur à riz numérique 5L avec 12 fonctions de cuisson. Cuve intérieure antiadhésive, fonction maintien au chaud.',
    descRu: 'Цифровая рисоварка 5Л с 12 функциями приготовления. Антипригарная внутренняя кастрюля, функция поддержания тепла.',
    descEs: 'Arrocera digital 5L con 12 funciones de cocción. Olla interior antiadherente, función de mantenimiento caliente.',
    descAr: 'طنجرة أرز رقمية 5 لتر مع 12 وظيفة طهي. وعاء داخلي غير لاصق، وظيفة الإبقاء دافئاً.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
    moq: '50 pcs',
    delivery: '7-15 days',
    payment: 'T/T, L/C',
    specs: [
      { key: 'Capacity', value: '5L' },
      { key: 'Power', value: '900W' },
      { key: 'Functions', value: '12 cooking modes' },
      { key: 'Inner Pot', value: 'Non-stick' },
      { key: 'Timer', value: 'Delay up to 24h' },
      { key: 'Voltage', value: '220V/50Hz' },
    ],
    tags: ['appliances', 'rice cooker', 'kitchen', 'cooking'],
    isNew: false,
    isHot: false,
    createdAt: '2024-01-18',
  },
];

// Products Store
export const productsStore = {
  getAll(): Product[] {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_PRODUCTS;
  },

  save(products: Product[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },

  add(product: Product): void {
    const products = this.getAll();
    products.unshift(product);
    this.save(products);
  },

  update(id: string, updated: Partial<Product>): void {
    const products = this.getAll();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updated };
      this.save(products);
    }
  },

  delete(id: string): void {
    const products = this.getAll().filter(p => p.id !== id);
    this.save(products);
  },

  getById(id: string): Product | undefined {
    return this.getAll().find(p => p.id === id);
  },

  reset(): void {
    this.save(DEFAULT_PRODUCTS);
  },
};

// Messages Store
export const messagesStore = {
  getAll(): Message[] {
    try {
      const data = localStorage.getItem(MESSAGES_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  save(messages: Message[]): void {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },

  add(message: Omit<Message, 'id' | 'isRead' | 'createdAt'>): void {
    const messages = this.getAll();
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    messages.unshift(newMessage);
    this.save(messages);
  },

  markRead(id: string): void {
    const messages = this.getAll();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx].isRead = true;
      this.save(messages);
    }
  },

  delete(id: string): void {
    const messages = this.getAll().filter(m => m.id !== id);
    this.save(messages);
  },

  getUnreadCount(): number {
    return this.getAll().filter(m => !m.isRead).length;
  },
};

// Favorites Store
export const favoritesStore = {
  getAll(): string[] {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  toggle(productId: string): boolean {
    const favorites = this.getAll();
    const idx = favorites.indexOf(productId);
    if (idx === -1) {
      favorites.push(productId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return true;
    } else {
      favorites.splice(idx, 1);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      return false;
    }
  },

  isFavorite(productId: string): boolean {
    return this.getAll().includes(productId);
  },
};

// Admin Auth
const ADMIN_KEY = 'houseplus_admin';
const DEFAULT_ADMIN = { username: 'admin', password: 'houseplus2024' };

export const adminStore = {
  login(username: string, password: string): boolean {
    const stored = localStorage.getItem(ADMIN_KEY);
    const admin = stored ? JSON.parse(stored) : DEFAULT_ADMIN;
    if (username === admin.username && password === admin.password) {
      sessionStorage.setItem('houseplus_auth', 'true');
      return true;
    }
    return false;
  },

  logout(): void {
    sessionStorage.removeItem('houseplus_auth');
  },

  isLoggedIn(): boolean {
    return sessionStorage.getItem('houseplus_auth') === 'true';
  },

  changePassword(oldPwd: string, newPwd: string): boolean {
    const stored = localStorage.getItem(ADMIN_KEY);
    const admin = stored ? JSON.parse(stored) : DEFAULT_ADMIN;
    if (oldPwd === admin.password) {
      admin.password = newPwd;
      localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
      return true;
    }
    return false;
  },
};

// Export utilities
export function exportToCSV(data: object[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = (row as Record<string, unknown>)[h];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
