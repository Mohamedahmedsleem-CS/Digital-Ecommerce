/**
 * بيانات تجريبية للمنتجات لاستخدامها كحل بديل عند عدم توفر الاتصال بالإنترنت
 * Mock data for products to use as fallback when network is unavailable
 */

export const mockProducts = [
  // منتج Man Power - المنتج الرئيسي
  {
    id: 1,
    documentId: "man-power-001",
    name: "Man Power - مان باور",
    description: "مكمل غذائي طبيعي مصمم خصيصاً لتعزيز الطاقة والحيوية والأداء الطبيعي للرجال. مصنوع من أجود الأعشاب الطبيعية والمكونات المختارة بعناية.",
    mrp: 250,
    sellingPrice: 199,
    category: "مكملات غذائية",
    image: {
      url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
      alt: "Man Power - مان باور"
    },
    files: [
      {
        id: "file-1",
        url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop",
        alt: "Man Power - صورة 1"
      },
      {
        id: "file-2", 
        url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=800&fit=crop",
        alt: "Man Power - صورة 2"
      },
      {
        id: "file-3",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop",
        alt: "Man Power - صورة 3"
      }
    ],
    isBestSeller: true,
    isWeighed: false,
    instantDelivery: true,
    benefits: "**فوائد Man Power المثبتة علمياً:**\n\n* **تعزيز الطاقة البدنية** - يزيد من القدرة على التحمل والنشاط\n* **تحسين الأداء الجنسي** - يعزز الرغبة والأداء الطبيعي\n* **تقوية العضلات** - يساعد في بناء كتلة عضلية صحية\n* **تعزيز الثقة بالنفس** - يحسن المزاج والثقة\n* **دعم صحة القلب** - يحتوي على مضادات أكسدة طبيعية\n* **تحسين التركيز** - يعزز الوظائف المعرفية",
    usageMethods: "**طريقة الاستخدام الموصى بها:**\n\n1. **الجرعة اليومية:** تناول كبسولة واحدة يومياً\n2. **وقت التناول:** يفضل تناوله مع وجبة الإفطار أو الغداء\n3. **المدة:** استخدم المنتج لمدة 3 أشهر للحصول على أفضل النتائج\n4. **الاستمرارية:** لا تتوقف عن الاستخدام فجأة\n5. **الماء:** اشرب كوب ماء كامل مع كل كبسولة\n6. **التخزين:** احفظ في مكان بارد وجاف بعيداً عن أشعة الشمس",
    warnings: "**تحذيرات هامة - اقرأ بعناية:**\n\n⚠️ **لا يستخدم للحوامل والمرضعات**\n⚠️ **استشر الطبيب قبل الاستخدام إذا كنت تعاني من:**\n   - أمراض القلب أو الضغط\n   - مشاكل في الكبد أو الكلى\n   - حساسية من أي من المكونات\n⚠️ **لا تتجاوز الجرعة الموصى بها**\n⚠️ **يحفظ بعيداً عن متناول الأطفال**\n⚠️ **لا يستخدم للأشخاص دون 18 سنة**\n⚠️ **في حالة ظهور أي أعراض جانبية، توقف عن الاستخدام واستشر الطبيب فوراً**",
    reviews: [
      {
        id: "review-1",
        userName: "أحمد محمد",
        rating: 5,
        comment: "منتج ممتاز! لاحظت تحسناً كبيراً في الطاقة والنشاط بعد أسبوعين من الاستخدام. أنصح به بشدة.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            alt: "صورة أحمد محمد"
          }
        ],
        createdAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "review-2",
        userName: "محمد علي",
        rating: 4,
        comment: "جودة عالية وسعر معقول. سأستمر في استخدامه وأوصي به للأصدقاء.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
            alt: "صورة محمد علي"
          }
        ],
        createdAt: "2024-01-10T14:20:00Z"
      }
    ]
  },

  // منتج العسل الطبيعي
  {
    id: 2,
    documentId: "natural-honey-002",
    name: "عسل طبيعي صافي",
    description: "عسل طبيعي خالص من أفضل المناحل العربية. غني بالفيتامينات والمعادن الطبيعية ومضادات الأكسدة.",
    mrp: 180,
    sellingPrice: 150,
    category: "أعشاب ومنتجات طبيعية",
    image: {
      url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop",
      alt: "عسل طبيعي صافي"
    },
    files: [
      {
        id: "file-honey-1",
        url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop",
        alt: "عسل طبيعي - صورة 1"
      },
      {
        id: "file-honey-2",
        url: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=800&fit=crop",
        alt: "عسل طبيعي - صورة 2"
      }
    ],
    isBestSeller: true,
    isWeighed: true,
    instantDelivery: false,
    unit: {
      name: "كيلوجرام",
      shortName: "كج",
      symbol: "kg"
    },
    quantity_options: [
      { weight: 0.5, price: 150 },
      { weight: 1, price: 280 },
      { weight: 2, price: 520 }
    ]
  },

  // حبة البركة
  {
    id: 3,
    documentId: "black-seed-003",
    name: "حبة البركة الأصلية",
    description: "حبة البركة الطبيعية عالية الجودة. معروفة بفوائدها الصحية المتعددة وقدرتها على تقوية المناعة.",
    mrp: 80,
    sellingPrice: 65,
    category: "أعشاب ومنتجات طبيعية",
    image: {
      url: "https://images.unsplash.com/photo-1609501676725-7186f34ac4b8?w=800&h=800&fit=crop",
      alt: "حبة البركة الأصلية"
    },
    files: [
      {
        id: "file-blackseed-1",
        url: "https://images.unsplash.com/photo-1609501676725-7186f34ac4b8?w=800&h=800&fit=crop",
        alt: "حبة البركة - صورة 1"
      }
    ],
    isBestSeller: false,
    isWeighed: true,
    instantDelivery: true,
    unit: {
      name: "جرام",
      shortName: "جم",
      symbol: "g"
    },
    quantity_options: [
      { weight: 250, price: 65 },
      { weight: 500, price: 120 },
      { weight: 1000, price: 220 }
    ]
  },

  // زيت الزيتون
  {
    id: 4,
    documentId: "olive-oil-004",
    name: "زيت الزيتون البكر",
    description: "زيت الزيتون البكر الممتاز، مستخرج بالطرق التقليدية من أجود أشجار الزيتون. مثالي للطبخ والاستخدامات الطبية.",
    mrp: 120,
    sellingPrice: 95,
    category: "زيوت طبيعية",
    image: {
      url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop",
      alt: "زيت الزيتون البكر"
    },
    files: [
      {
        id: "file-olive-1",
        url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop",
        alt: "زيت الزيتون - صورة 1"
      }
    ],
    isBestSeller: true,
    isWeighed: false,
    instantDelivery: true
  },

  // الحبهان
  {
    id: 5,
    documentId: "cardamom-005",
    name: "الهيل الأخضر الفاخر",
    description: "هيل أخضر فاخر من أجود الأنواع. رائحة عطرة ونكهة مميزة، مثالي للشاي والقهوة والطبخ.",
    mrp: 200,
    sellingPrice: 175,
    category: "بهارات وتوابل",
    image: {
      url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
      alt: "الهيل الأخضر الفاخر"
    },
    files: [
      {
        id: "file-cardamom-1",
        url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=800&fit=crop",
        alt: "الهيل الأخضر - صورة 1"
      }
    ],
    isBestSeller: false,
    isWeighed: true,
    instantDelivery: true,
    unit: {
      name: "جرام",
      shortName: "جم",
      symbol: "g"
    },
    quantity_options: [
      { weight: 100, price: 175 },
      { weight: 250, price: 400 },
      { weight: 500, price: 750 }
    ]
  },

  // الزعفران
  {
    id: 6,
    documentId: "saffron-006",
    name: "زعفران أصلي فاخر",
    description: "زعفران إيراني أصلي من أجود الأنواع. يضفي نكهة ولون مميز للأطباق التقليدية والحلويات.",
    mrp: 500,
    sellingPrice: 450,
    category: "بهارات وتوابل",
    image: {
      url: "https://images.unsplash.com/photo-1609501676725-7186f34ac4b8?w=800&h=800&fit=crop&saturation=50&hue=30",
      alt: "زعفران أصلي فاخر"
    },
    files: [
      {
        id: "file-saffron-1",
        url: "https://images.unsplash.com/photo-1609501676725-7186f34ac4b8?w=800&h=800&fit=crop&saturation=50&hue=30",
        alt: "زعفران أصلي - صورة 1"
      }
    ],
    isBestSeller: true,
    isWeighed: true,
    instantDelivery: false,
    unit: {
      name: "جرام",
      shortName: "جم",
      symbol: "g"
    },
    quantity_options: [
      { weight: 1, price: 450 },
      { weight: 2, price: 850 },
      { weight: 5, price: 2000 }
    ]
  },

  // الكركم
  {
    id: 7,
    documentId: "turmeric-007",
    name: "كركم طبيعي مطحون",
    description: "كركم طبيعي عالي الجودة، غني بالكركمين الطبيعي. معروف بخصائصه المضادة للالتهاب والأكسدة.",
    mrp: 45,
    sellingPrice: 35,
    category: "بهارات وتوابل",
    image: {
      url: "https://images.unsplash.com/photo-1615485020679-b4b0ac4ed19b?w=800&h=800&fit=crop",
      alt: "كركم طبيعي مطحون"
    },
    files: [
      {
        id: "file-turmeric-1",
        url: "https://images.unsplash.com/photo-1615485020679-b4b0ac4ed19b?w=800&h=800&fit=crop",
        alt: "كركم طبيعي - صورة 1"
      }
    ],
    isBestSeller: false,
    isWeighed: true,
    instantDelivery: true,
    unit: {
      name: "جرام",
      shortName: "جم",
      symbol: "g"
    },
    quantity_options: [
      { weight: 250, price: 35 },
      { weight: 500, price: 65 },
      { weight: 1000, price: 120 }
    ]
  },

  // الزنجبيل
  {
    id: 8,
    documentId: "ginger-008",
    name: "زنجبيل طازج مجفف",
    description: "زنجبيل طبيعي مجفف بعناية للحفاظ على خصائصه الطبية. مفيد للهضم وتقوية المناعة.",
    mrp: 60,
    sellingPrice: 50,
    category: "أعشاب ومنتجات طبيعية",
    image: {
      url: "https://images.unsplash.com/photo-1551029547-589b23e0aac3?w=800&h=800&fit=crop",
      alt: "زنجبيل طازج مجفف"
    },
    files: [
      {
        id: "file-ginger-1",
        url: "https://images.unsplash.com/photo-1551029547-589b23e0aac3?w=800&h=800&fit=crop",
        alt: "زنجبيل طازج - صورة 1"
      }
    ],
    isBestSeller: false,
    isWeighed: true,
    instantDelivery: true,
    unit: {
      name: "جرام",
      shortName: "جم",
      symbol: "g"
    },
    quantity_options: [
      { weight: 200, price: 50 },
      { weight: 500, price: 115 },
      { weight: 1000, price: 200 }
    ]
  }
];

// فلتر المنتجات الأكثر طلباً
export const getBestSellerProducts = () => {
  return mockProducts.filter(product => product.isBestSeller);
};

// الحصول على منتج واحد بالـ ID
export const getProductById = (id) => {
  return mockProducts.find(product => 
    product.id === parseInt(id) || product.documentId === id
  );
};

// الحصول على منتجات بالفئة
export const getProductsByCategory = (category) => {
  return mockProducts.filter(product => product.category === category);
};

// الحصول على جميع الفئات
export const getCategories = () => {
  const categories = [...new Set(mockProducts.map(product => product.category))];
  return categories.map((category, index) => ({
    id: index + 1,
    documentId: `category-${index + 1}`,
    name: category,
    slug: category.replace(/\s+/g, '-').toLowerCase()
  }));
};

export default mockProducts;