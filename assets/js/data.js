// data.js - قاعدة بيانات الخدمات لشركة Trend Travel
// تم التوليد وتحديث البيانات من لوحة التحكم: ٨‏/١١‏/٢٠٢٦، ٥:١٤:٣٣ م

const DEFAULT_TRAVEL_DATA = {
  "company": {
    "name": "Trend Travel",
    "arabicName": "تريند ترافيل",
    "slogan": "بوابتك لتجارب سياحية استثنائية في تركيا",
    "whatsapp": "905375025692",
    "phone": "+905375025692",
    "email": "info@trendtravel.com.tr",
    "address": "إسطنبول - تركيا",
    "currency": "USD",
    "currencySymbol": "$",
    "webhookUrl": "https://n8n.automaten8.com/webhook/7f69eacd-cfb0-4066-9ecb-6886bd959a19",
    "googleSheetsUrl": "https://n8n.automaten8.com/webhook/7f69eacd-cfb0-4066-9ecb-6886bd959a19"
  },
  "categories": [
    {
      "id": "all",
      "name": "جميع الخدمات",
      "icon": "fa-compass",
      "badge": "الكل"
    },
    {
      "id": "group-tours",
      "name": "جولات مجموعات",
      "icon": "fa-users",
      "badge": "اقتصادي وممتع",
      "desc": "رحلات يومية منتظمة لأجمل المعالم مع مرشد سياحي ومجموعات مميزة"
    },
    {
      "id": "private-tours",
      "name": "جولات خاصة",
      "icon": "fa-car-side",
      "badge": "VIP وخصوصية",
      "desc": "سيارات فخمة حديثة مع سائق خاص ومرونة كاملة في الوقت والمسار"
    },
    {
      "id": "private-yacht",
      "name": "يخت خاص",
      "icon": "fa-ship",
      "badge": "فخامة وأجواء بحرية",
      "desc": "تأجير يخوت فاخرة في البسفور والجزر بالساعة أو باليوم لمناسباتكم الخاصة"
    },
    {
      "id": "internet-sim",
      "name": "خطوط الإنترنت",
      "icon": "fa-wifi",
      "badge": "تفعيل فوري eSIM",
      "desc": "باقات إنترنت سياحية فائقة السرعة وشريحة إلكترونية eSIM بدون عناء"
    }
  ],
  "services": [
    {
      "id": "group-sapanca",
      "category": "group-tours",
      "title": "رحلة صبنجة والمعشوقية",
      "subtitle": "طبيعة ساحرة وشلالات وأنشطة جبلية ممتعة وجلسات ريفية خضراء",
      "price": 10,
      "oldPrice": 15,
      "priceUnit": "للشخص",
      "duration": "12-14 ساعة",
      "image": "assets/media/group-sapanca-0.jpg",
      "mediaType": "image",
      "gallery": [
        {
          "url": "assets/media/group-sapanca-0.jpg",
          "type": "image",
          "isCover": true
        },
        {
          "url": "assets/media/group-sapanca-1.jpg",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-sapanca-2.jpg",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-sapanca-3.jpg",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-sapanca-4.mp4",
          "type": "video",
          "isCover": false
        },
        {
          "url": "assets/media/group-sapanca-5.mp4",
          "type": "video",
          "isCover": false
        }
      ],
      "featured": true,
      "tags": [
        "شامل الغداء",
        "مرشد عربي",
        "مواصلات فندقية"
      ],
      "highlights": [
        "زيارة حديقة الحيوانات + اكواريوم",
        "شلالات معشوقية",
        "تجربة السفاري ضمن الغابات و انفاق شجرية",
        "تجربة الزبلاين بوسط الغابة",
        "زيارة مصنع مبيع الحلويات و مناحل العسل",
        "تلفريك"
      ],
      "includes": [
        "مواصلات ذهاباً وإياباً من الفندق",
        "مرشد سياحي خبير يتحدث العربية",
        "وجبة غداء"
      ],
      "excludes": [
        "الأنشطة الاختيارية (السفاري، الزيبلاين)",
        "المشروبات الإضافية والمصاريف الشخصية"
      ],
      "bookingTypes": [
        {
          "id": "type-1-1794137204472",
          "name": "حجز قياسي شامل الغداء",
          "price": 10,
          "oldPrice": 25,
          "priceUnit": "للشخص",
          "desc": "شامل المواصلات، المرشد العربي، بحيرة صبنجة والشلالات، ووجبة الغداء"
        }
      ]
    },
    {
      "id": "group-bursa",
      "category": "group-tours",
      "title": "رحلة بورصة الخضراء وجبل أولوداغ والتلفريك",
      "subtitle": "قمة جبل أولوداغ، الشجرة المعمرة، وتجربة التلفريك الأطول عالمياً",
      "price": 20,
      "oldPrice": 25,
      "priceUnit": "للشخص",
      "duration": "12-14 ساعة",
      "image": "assets/media/group-bursa-0.jpg",
      "mediaType": "image",
      "gallery": [
        {
          "url": "assets/media/group-bursa-0.jpg",
          "type": "image",
          "isCover": true
        },
        {
          "url": "assets/media/group-bursa-1.jpg",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-bursa-2.jpg",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-bursa-3.webp",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-bursa-4.webp",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-bursa-5.webp",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-bursa-6.mp4",
          "type": "video",
          "isCover": false
        }
      ],
      "featured": true,
      "tags": [
        "ركوب التلفريك",
        "شامل الغداء",
        "العبّارة البحرية"
      ],
      "highlights": [
        "عبور بحر مرمرة بالعبارة البحرية السريعة وإطعام طيور النورس",
        "تجربة السفاري ضمن غابات يالوفا",
        "زيارة جبل اولوداغ",
        "تلفريك المكشوف",
        "زيارة مصنع و مشتريات الحلويات",
        "الصعود إلى قمة جبل أولوداغ الخلاب",
        "تجربة ركوب تلفريك بورصة التاريخي الشهير",
        "وجبة مشاوي تركية لذيذة على قمة الجبل"
      ],
      "includes": [
        "توصيل من وإلى الفندق",
        "تذاكر العبّارة والتلفريك الكبير",
        "غداء",
        "مرشد سياحي مرافق"
      ],
      "excludes": [
        "تلفريك الكراسي المفتوح على القمة",
        "دبابات السفاري الجبلية"
      ],
      "bookingTypes": [
        {
          "id": "type-1-1794139285859",
          "name": "غداء فقط",
          "price": 20,
          "oldPrice": 25,
          "priceUnit": "للشخص",
          "desc": "شامل المواصلات، العبّارة البحرية، المرشد السياحي، ووجبة الغداء"
        },
        {
          "id": "type-2-1794139285859",
          "name": "غداء و تلسياج",
          "price": 25,
          "oldPrice": 30,
          "priceUnit": "للشخص",
          "desc": "شامل تذكرة تلفريك أولوداغ المكشوف + الغداء والعبّارة"
        },
        {
          "id": "type-3-1794139285859",
          "name": "غداء وتلفريك",
          "price": 35,
          "oldPrice": 45,
          "priceUnit": "للشخص",
          "desc": "شامل تذكرة صعود جبل اولوداغ بالتلفريك الكبير + الغداء"
        }
      ]
    },
    {
      "id": "group-bosphorus-dinner",
      "category": "group-tours",
      "title": "سهرة عشاء البسفور الفاخرة مع العروض الفلكلورية",
      "subtitle": "إبحار ليلي رومانسي بين قارتي آسيا وأوروبا مع بوفيه مفتوح ملكي",
      "price": 25,
      "oldPrice": null,
      "priceUnit": "للشخص",
      "duration": "4 ساعات",
      "image": "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
      "mediaType": "image",
      "gallery": [
        {
          "url": "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
          "type": "image",
          "isCover": true
        }
      ],
      "featured": true,
      "tags": [
        "عشاء بوفيه مفتوح",
        "عروض فلكلورية",
        "إطلالة ليلية ساحرة"
      ],
      "highlights": [
        "إبحار تحت جسور البسفور المضيئة والقلاع والقصور التاريخية",
        "بوفيه عشاء مفتوح بأشهى الأطباق التركية والمقبلات الشامية والعالمية",
        "عروض فلكلورية، رقصات الدراويش الشامية والتركية، فقرات غنائية وتراثية",
        "أجواء عائلية راقية ومبهجة مع خدمة ممتازة"
      ],
      "includes": [
        "مواصلات من وإلى الفنادق المركزية",
        "عشاء ومشروبات غير كحولية",
        "العروض الفنية كاملة"
      ],
      "excludes": [
        "المشروبات الخاصة, المكسرات, الفواكه وخدمة التصوير التذكاري"
      ],
      "bookingTypes": [
        {
          "id": "type-1-1794135311763",
          "name": "سفينة سهر الليالي",
          "price": 25,
          "oldPrice": null,
          "priceUnit": "للشخص",
          "desc": "شامل المواصلات, الدخولية, العشاء, كولا, مياه"
        },
        {
          "id": "type-2-1794135311763",
          "name": "سفينة لؤلؤة البوسفور",
          "price": 25,
          "oldPrice": null,
          "priceUnit": "للشخص",
          "desc": "شامل المواصلات, الدخولية, العشاء, كولا, مياه"
        },
        {
          "id": "type-3-1794135311763",
          "name": "سفينة ليالي شامية",
          "price": 50,
          "oldPrice": null,
          "priceUnit": "للشخص",
          "desc": "شامل المواصلات, الدخولية, العشاء, كولا, مياه"
        }
      ]
    },
    {
      "id": "group-sile-agva",
      "category": "group-tours",
      "title": "رحلة شيلا وأغفا",
      "subtitle": "هدوء شواطئ البحر الأسود وركوب القارب في نهر غوكسو الساحر",
      "price": 28,
      "oldPrice": 38,
      "priceUnit": "للشخص",
      "duration": "10 ساعات",
      "image": "assets/media/group-sile-agva-1.webp",
      "mediaType": "image",
      "gallery": [
        {
          "url": "assets/media/group-sile-agva-0.webp",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/group-sile-agva-1.webp",
          "type": "image",
          "isCover": true
        },
        {
          "url": "assets/media/group-sile-agva-2.mp4",
          "type": "video",
          "isCover": false
        }
      ],
      "featured": false,
      "tags": [
        "جولة قارب نهري",
        "شاطئ البحر الأسود",
        "شامل الغداء"
      ],
      "highlights": [
        "العبور لقسم اسيا باستخدام جسر المعلق",
        "زيارة البحيرة المخفية",
        "زيارة منارة البحيرة",
        "زيارة حديقة الحيوانات",
        "وجبة الغداء",
        "زيارة نهر كوك سو",
        "تجربة جولة بالقارب داخل النهر",
        "زيارة شاطئ رملي للبحر الاسود",
        "وقت حر للسباحة (في الصيف)",
        "العودة للفندق",
        "شامل الغداء + مرشد عربي + المواصلات"
      ],
      "includes": [
        "المواصلات",
        "وجبة الغداء",
        "المرشد السياحي"
      ],
      "excludes": [
        "المصروفات الشخصية والأنشطة الإضافية"
      ]
    },
    {
      "id": "private-istanbul-vip",
      "category": "private-tours",
      "title": "جولة إسطنبول التاريخية والأوروبية VIP",
      "subtitle": "مرسيدس فيتو VIP فاخرة مع سائق خاص خبير تحت تصرفك طوال اليوم",
      "price": 140,
      "oldPrice": 150,
      "priceUnit": "للسيارة (حتى 7 أشخاص)",
      "duration": "10 ساعات",
      "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "mediaType": "image",
      "gallery": [
        {
          "url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
          "type": "image",
          "isCover": true
        }
      ],
      "featured": true,
      "tags": [
        "مرسيدس فيتو VIP",
        "سائق خاص",
        "تحكم كامل بالمسار"
      ],
      "highlights": [
        "سيارة مرسيدس فيتو VIP حديثة ومكيفة مع شاشات ترفيه وواي فاي وضيافة",
        "حرية اختيار المعالم: آيا صوفيا، قصر دولما بهجة، أورتاكوي، تل العرائس، مول وادي إسطنبول",
        "سائق خبير ومحترم ومساعد طوال اليوم وملتزم بالمواعيد بدقة",
        "خدمة من الباب إلى الباب مع وقت مرن وراحة تامة للعوائل"
      ],
      "includes": [
        "سيارة VIP خاصة مع الوقود ورسوم الطرق والجسور",
        "سائق مخصص طوال 10 ساعات"
      ],
      "excludes": [
        "تذاكر دخول المتاحف والمعالم",
        "وجبات الطعام"
      ]
    },
    {
      "id": "private-sapanca-vip",
      "category": "private-tours",
      "title": "جولة صبنجة وكارتبه والمطل الزجاجي VIP",
      "subtitle": "رحلة عائلية خاصة بأعلى درجات الراحة والخصوصية في الطبيعة الخضراء",
      "price": 180,
      "oldPrice": 220,
      "priceUnit": "للسيارة (حتى 7 أشخاص)",
      "duration": "12 ساعة",
      "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
      "mediaType": "image",
      "gallery": [
        {
          "url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
          "type": "image",
          "isCover": true
        }
      ],
      "featured": true,
      "tags": [
        "عائلات VIP",
        "خصوصية تامة",
        "وقود ورسوم مشمولة"
      ],
      "highlights": [
        "انطلاق خاص ومباشر من فندقكم بأي وقت تفضلونه صباحاً",
        "زيارة قمة كارتبه، بحيرة صبنجة، شلالات معشوقية، والقرية العثمانية",
        "التوقف في أجمل المطاعم الريفية حسب اختياركم وبدون أي استعجال",
        "سائق يتحدث العربية/الإنجليزية ومطلع على أفضل الأماكن الهادئة والمطلات"
      ],
      "includes": [
        "سيارة عائلية فارهة مع سائق خاص",
        "جميع رسوم الطرق السريعة ومواقف السيارات والوقود"
      ],
      "excludes": [
        "الوجبات ورسوم الأنشطة الترفيهية"
      ]
    },
    {
      "id": "private-bursa-vip",
      "category": "private-tours",
      "title": "جولة بورصة الخضراء وجبل أولوداغ خاصة VIP",
      "subtitle": "رحلة خاصة عبر جسر عثمان غازي أو العبارة بأعلى درجات الرفاهية",
      "price": 300,
      "oldPrice": 350,
      "priceUnit": "للسيارة (حتى 7 أشخاص)",
      "duration": "12-14 ساعة",
      "image": "assets/media/private-bursa-vip-3.mp4",
      "mediaType": "video",
      "gallery": [
        {
          "url": "assets/media/private-bursa-vip-0.webp",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/private-bursa-vip-1.webp",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/private-bursa-vip-2.webp",
          "type": "image",
          "isCover": false
        },
        {
          "url": "assets/media/private-bursa-vip-3.mp4",
          "type": "video",
          "isCover": true
        }
      ],
      "featured": false,
      "tags": [
        "مرسيدس VIP",
        "مرونة المسار",
        "توصيل باب الفندق"
      ],
      "highlights": [
        "عبور بحري ممتع أو عبر الجسر المعلق المباشر",
        "زيارة جبل أولوداغ، الشجرة التاريخية، والجامع الأخضر ومصانع الحلقوم",
        "تسوق حر في سوق الحرير ومحلات المناشف والعسل والمربيات الطبيعية",
        "سيارة فسيحة تتسع للأمتعة والمشتريات براحة ورفاهية"
      ],
      "includes": [
        "سيارة VIP خاصة مع سائق محترف",
        "تذاكر العبّارة أو رسوم الجسر السريع",
        "الوقود والمواقف"
      ],
      "excludes": [
        "تذاكر التلفريك والوجبات الشخصية"
      ]
    },
    {
      "id": "esim-turkey-10gb",
      "category": "internet-sim",
      "title": "شريحة إلكترونية eSIM تركيا - 10 جيجابايت",
      "subtitle": "تفعيل فوري خلال دقيقة عبر رمز QR وسرعة 5G/4G فائقة تغطي كل المدن",
      "price": 15,
      "oldPrice": 20,
      "priceUnit": "للشريحة",
      "duration": "صالحة 30 يوماً",
      "image": "assets/media/esim-turkey-10gb-0.webp",
      "mediaType": "image",
      "gallery": [
        {
          "url": "assets/media/esim-turkey-10gb-0.webp",
          "type": "image",
          "isCover": true
        }
      ],
      "featured": true,
      "tags": [
        "eSIM فوري",
        "تغطية 5G/4G",
        "تدعم نقطة الاتصال"
      ],
      "highlights": [
        "تفعيل فوري عبر مسح كود QR يصلك فوراً على الواتساب أو الإيميل",
        "تعمل على أقوى شبكة تركية (Turkcell / Vodafone) بتغطية شاملة ومستقرة",
        "إمكانية مشاركة الإنترنت (Hotspot) مع أجهزتك الأخرى بكل سلاسة",
        "بدون الحاجة لتبديل شريحتك الأصلية وبدون انتظار في طوابير المطار المرهقة"
      ],
      "includes": [
        "10GB إنترنت فائق السرعة",
        "صلاحية 30 يوماً من أول اتصال",
        "دعم فني للمساعدة في التثبيت"
      ],
      "excludes": [],
      "bookingTypes": [
        {
          "id": "type-1-1794147086720",
          "name": "10GB",
          "price": 20,
          "oldPrice": null,
          "priceUnit": "للشريحة",
          "desc": ""
        },
        {
          "id": "type-2-1794147086720",
          "name": "25GB",
          "price": 30,
          "oldPrice": null,
          "priceUnit": "للشريحة",
          "desc": ""
        },
        {
          "id": "type-3-1794147086720",
          "name": "50GB",
          "price": 40,
          "oldPrice": null,
          "priceUnit": "للشريحة",
          "desc": ""
        },
        {
          "id": "type-4-1794147086720",
          "name": "100GB",
          "price": 55,
          "oldPrice": null,
          "priceUnit": "للشريحة",
          "desc": ""
        }
      ]
    },
    {
      "id": "physical-sim-delivery",
      "category": "internet-sim",
      "title": "شريحة اتصال فعلية (Physical SIM) مع التوصيل للفندق",
      "subtitle": "للأجهزة التي لا تدعم eSIM - تتضمن إنترنت ومكالمات محلية ودولية",
      "price": 20,
      "oldPrice": null,
      "priceUnit": "للشريحة والتوصيل",
      "duration": "صالحة 30 يوماً",
      "image": "assets/media/physical-sim-delivery-0.webp",
      "mediaType": "image",
      "gallery": [
        {
          "url": "assets/media/physical-sim-delivery-0.webp",
          "type": "image",
          "isCover": true
        }
      ],
      "featured": true,
      "tags": [
        "توصيل للفندق",
        "شاملة مكالمات",
        "جاهزة ومفعلة"
      ],
      "highlights": [
        "شريحة تقليدية (Nano/Micro) جاهزة ومفعلة باسمك ومضمونة 100%",
        "توصيل مباشر إلى باب فندقك أو استلام عند الوصول في المطار",
        "تشمل 10GB إنترنت",
        "متوافقة مع جميع أنواع الهواتف الذكية القديمة والحديثة"
      ],
      "includes": [
        "الشريحة الفعلية مفعلة وجاهزة للعمل فوراً",
        "20GB بيانات",
        "توصيل سريع للفندق"
      ],
      "excludes": [
        "رقم هاتف"
      ],
      "bookingTypes": [
        {
          "id": "type-1-1794147267789",
          "name": "10GB",
          "price": 20,
          "oldPrice": null,
          "priceUnit": "للشريحة والتوصيل",
          "desc": "شامل التسليم"
        },
        {
          "id": "type-2-1794147267790",
          "name": "25GB",
          "price": 25,
          "oldPrice": null,
          "priceUnit": "للشريحة والتوصيل",
          "desc": "شامل التسليم"
        },
        {
          "id": "type-3-1794147267790",
          "name": "50GB",
          "price": 40,
          "oldPrice": null,
          "priceUnit": "للشريحة والتوصيل",
          "desc": "شامل التسليم"
        },
        {
          "id": "type-4-1794147267790",
          "name": "100GB",
          "price": 55,
          "oldPrice": null,
          "priceUnit": "للشريحة والتوصيل",
          "desc": "شامل التسليم"
        }
      ]
    }
  ],
  "faqs": [
    {
      "id": "faq-1",
      "q": "كيف يتم تأكيد الحجز والدفع؟",
      "a": "يمكنك الحجز بسهولة عبر اختيار الخدمة والضغط على زر (احجز الآن عبر واتساب)، حيث يتواصل معك فريق خدمة العملاء فوراً لتأكيد التفاصيل. الدفع متاح عبر التحويل البنكي، البطاقة الائتمانية، أو نقداً عند بدء الخدمة."
    },
    {
      "id": "faq-2",
      "q": "هل يمكنني تعديل مسار الجولات الخاصة؟",
      "a": "نعم بالتأكيد، في الجولات الخاصة تكون السيارة والسائق تحت تصرفكم بالكامل، ويمكنكم تخصيص المعالم والمحطات ووقت الانطلاق بما يناسب جدولكم وعائلتكم."
    },
    {
      "id": "faq-3",
      "q": "ما هي الأجهزة المتوافقة مع شرائح eSIM؟",
      "a": "تدعم معظم هواتف آيفون الحديثة (من iPhone XS فما بعد)، وكذلك أجهزة سامسونج الفئة العليا (S20 فما بعد) وجوجل بكسل. يمكنك التأكد بسهولة من إعدادات هاتفك أو التواصل معنا لإرشادك."
    },
    {
      "id": "faq-4",
      "q": "ما هي سياسة الإلغاء وتغيير الموعد؟",
      "a": "نقدم مرونة عالية؛ يمكنك إلغاء أو تغيير موعد الجولة مجاناً قبل 24 ساعة من موعد الانطلاق بدون أي رسوم إضافية."
    }
  ],
  "features": [
    {
      "icon": "fa-shield-halved",
      "title": "أمان وثقة تامة",
      "desc": "شركتنا مرخصة رسمياً وتضمن لكم رحلات آمنة ومحمية بالكامل"
    },
    {
      "icon": "fa-tags",
      "title": "أفضل الأسعار التنافسية",
      "desc": "أسعار مباشرة بدون وسطاء مع ضمان أعلى معايير الجودة والراحة"
    },
    {
      "icon": "fa-headset",
      "title": "دعم ومتابعة 24/7",
      "desc": "فريق متخصص يتحدث العربية يرافقك خطوة بخطوة طوال فترة سفرك"
    },
    {
      "icon": "fa-award",
      "title": "خدمات وسيارات VIP فاخرة",
      "desc": "أسطول حديث من سيارات المرسيدس واليخوت المجهزة بأعلى رفاهية"
    }
  ],
  "_updatedAt": 1794147267880
};

// Storage Key & IndexedDB Configuration (يتحدث تلقائياً مع كل تصدير لتحديث الكاش لجميع الزوار فوراً)
const STORAGE_KEY = 'trend_travel_data_v_1794152938828';
const IDB_NAME = 'TrendTravelDB';
const IDB_VERSION = 1;
const IDB_STORE = 'travel_data_store';

window.__TREND_TRAVEL_CACHE__ = window.__TREND_TRAVEL_CACHE__ || null;

// Clean up outdated storage keys so they never consume the 5MB localStorage quota
function cleanupOldStorageKeys() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('trend_travel_data_') && k !== STORAGE_KEY && k !== STORAGE_KEY + '_sync_ping') {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {}
}
cleanupOldStorageKeys();

// Ensure every service's cover image (s.image) matches its gallery cover item
function normalizeServicesMedia(data) {
  if (!data || !Array.isArray(data.services)) return data;
  data.services.forEach(s => {
    if (Array.isArray(s.gallery) && s.gallery.length > 0) {
      const normalized = s.gallery.map((item, idx) => {
        if (typeof item === 'string') {
          return { url: item, type: 'image', isCover: idx === 0 };
        }
        return {
          url: item.url || '',
          type: item.type || 'image',
          isCover: Boolean(item.isCover)
        };
      }).filter(item => Boolean(item.url));

      if (normalized.length > 0) {
        let coverIdx = normalized.findIndex(m => m.isCover);
        if (coverIdx === -1) {
          coverIdx = 0;
          normalized[0].isCover = true;
        }
        normalized.forEach((m, i) => { m.isCover = (i === coverIdx); });
        const coverItem = normalized[coverIdx];
        s.image = coverItem.url;
        s.mediaType = coverItem.type || 'image';
        s.gallery = normalized;
      }
    }
  });
  return data;
}

function openTravelIndexedDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error('IndexedDB not supported'));
    const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function saveToIndexedDB(key, data) {
  try {
    const db = await openTravelIndexedDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put(data, key);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = (e) => { db.close(); reject(e.target.error); };
    });
  } catch (err) {
    return false;
  }
}

async function loadFromIndexedDB(key) {
  try {
    const db = await openTravelIndexedDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => { db.close(); resolve(req.result || null); };
      req.onerror = (e) => { db.close(); reject(e.target.error); };
    });
  } catch (err) {
    return null;
  }
}

async function hydrateTravelDataFromIndexedDB() {
  try {
    const idbData = await loadFromIndexedDB(STORAGE_KEY);
    if (idbData && idbData.services && idbData.company && !idbData._isLightweight) {
      normalizeServicesMedia(idbData);
      window.__TREND_TRAVEL_CACHE__ = idbData;
      travelData = idbData;
      window.dispatchEvent(new CustomEvent('travelDataReady', { detail: travelData }));
      return travelData;
    }
    // Check if localStorage has valid non-lightweight data
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.services && parsed.company && !parsed._isLightweight) {
          normalizeServicesMedia(parsed);
          window.__TREND_TRAVEL_CACHE__ = parsed;
          travelData = parsed;
          await saveToIndexedDB(STORAGE_KEY, parsed);
          window.dispatchEvent(new CustomEvent('travelDataReady', { detail: travelData }));
          return travelData;
        }
      }
    } catch (e) {}

    const seedData = normalizeServicesMedia(JSON.parse(JSON.stringify(DEFAULT_TRAVEL_DATA)));
    seedData._updatedAt = DEFAULT_TRAVEL_DATA._updatedAt || Date.now();
    window.__TREND_TRAVEL_CACHE__ = seedData;
    travelData = seedData;
    await saveToIndexedDB(STORAGE_KEY, seedData);
    window.dispatchEvent(new CustomEvent('travelDataReady', { detail: travelData }));
    return travelData;
  } catch (e) {
    return travelData;
  }
}

function getTravelData() {
  if (window.__TREND_TRAVEL_CACHE__ && window.__TREND_TRAVEL_CACHE__.services && !window.__TREND_TRAVEL_CACHE__._isLightweight) {
    return window.__TREND_TRAVEL_CACHE__;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.services && parsed.categories && parsed.company && !parsed._isLightweight) {
        normalizeServicesMedia(parsed);
        window.__TREND_TRAVEL_CACHE__ = parsed;
        return parsed;
      } else if (parsed && parsed._isLightweight) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch (e) {}
  const fallback = normalizeServicesMedia(JSON.parse(JSON.stringify(DEFAULT_TRAVEL_DATA)));
  window.__TREND_TRAVEL_CACHE__ = fallback;
  return fallback;
}

function saveTravelData(data) {
  if (!data || typeof data !== 'object') return false;
  try {
    cleanupOldStorageKeys();
    const cleanData = normalizeServicesMedia(JSON.parse(JSON.stringify(data)));
    delete cleanData._isLightweight;
    cleanData._updatedAt = Date.now();
    window.__TREND_TRAVEL_CACHE__ = cleanData;
    travelData = cleanData;
    saveToIndexedDB(STORAGE_KEY, cleanData).then(() => {
      try { localStorage.setItem(STORAGE_KEY + '_sync_ping', String(cleanData._updatedAt)); } catch (e) {}
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanData));
    } catch (quotaErr) {
      // Never overwrite localStorage with stripped/old images; let IndexedDB serve full media
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
    try {
      localStorage.setItem(STORAGE_KEY + '_sync_ping', String(cleanData._updatedAt));
    } catch (e) {}
    return true;
  } catch (e) {
    return false;
  }
}

function resetTravelData() {
  const defClone = normalizeServicesMedia(JSON.parse(JSON.stringify(DEFAULT_TRAVEL_DATA)));
  saveTravelData(defClone);
  return defClone;
}

let travelData = getTravelData();
window.travelDataReadyPromise = hydrateTravelDataFromIndexedDB();
