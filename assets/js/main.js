// main.js - المنطق التفاعلي لموقع Trend Travel

// World Countries database with dialing codes, flags, and Arabic & English names (Jordan +962 is default)
const WORLD_COUNTRIES = [
  { code: "+962", nameAr: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
  { code: "+966", nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+965", nameAr: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
  { code: "+974", nameAr: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
  { code: "+973", nameAr: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
  { code: "+968", nameAr: "سلطنة عُمان", nameEn: "Oman", flag: "🇴🇲" },
  { code: "+964", nameAr: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
  { code: "+20", nameAr: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
  { code: "+970", nameAr: "فلسطين", nameEn: "Palestine", flag: "🇵🇸" },
  { code: "+961", nameAr: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
  { code: "+963", nameAr: "سوريا", nameEn: "Syria", flag: "🇸🇾" },
  { code: "+967", nameAr: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
  { code: "+90", nameAr: "تركيا", nameEn: "Turkey", flag: "🇹🇷" },
  { code: "+213", nameAr: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
  { code: "+212", nameAr: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
  { code: "+216", nameAr: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
  { code: "+218", nameAr: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
  { code: "+249", nameAr: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
  { code: "+222", nameAr: "موريتانيا", nameEn: "Mauritania", flag: "🇲🇷" },
  { code: "+252", nameAr: "الصومال", nameEn: "Somalia", flag: "🇸🇴" },
  { code: "+253", nameAr: "جيبوتي", nameEn: "Djibouti", flag: "🇩🇯" },
  { code: "+269", nameAr: "جزر القمر", nameEn: "Comoros", flag: "🇰🇲" },
  { code: "+1", nameAr: "الولايات المتحدة الأمريكية", nameEn: "United States", flag: "🇺🇸" },
  { code: "+1", nameAr: "كندا", nameEn: "Canada", flag: "🇨🇦" },
  { code: "+44", nameAr: "المملكة المتحدة (بريطانيا)", nameEn: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", nameAr: "ألمانيا", nameEn: "Germany", flag: "🇩🇪" },
  { code: "+33", nameAr: "فرنسا", nameEn: "France", flag: "🇫🇷" },
  { code: "+39", nameAr: "إيطاليا", nameEn: "Italy", flag: "🇮🇹" },
  { code: "+34", nameAr: "إسبانيا", nameEn: "Spain", flag: "🇪🇸" },
  { code: "+31", nameAr: "هولندا", nameEn: "Netherlands", flag: "🇳🇱" },
  { code: "+41", nameAr: "سويسرا", nameEn: "Switzerland", flag: "🇨🇭" },
  { code: "+46", nameAr: "السويد", nameEn: "Sweden", flag: "🇸🇪" },
  { code: "+47", nameAr: "النرويج", nameEn: "Norway", flag: "🇳🇴" },
  { code: "+45", nameAr: "الدنمارك", nameEn: "Denmark", flag: "🇩🇰" },
  { code: "+32", nameAr: "بلجيكا", nameEn: "Belgium", flag: "🇧🇪" },
  { code: "+43", nameAr: "النمسا", nameEn: "Austria", flag: "🇦🇹" },
  { code: "+351", nameAr: "البرتغال", nameEn: "Portugal", flag: "🇵🇹" },
  { code: "+30", nameAr: "اليونان", nameEn: "Greece", flag: "🇬🇷" },
  { code: "+48", nameAr: "بولندا", nameEn: "Poland", flag: "🇵🇱" },
  { code: "+380", nameAr: "أوكرانيا", nameEn: "Ukraine", flag: "🇺🇦" },
  { code: "+7", nameAr: "روسيا", nameEn: "Russia", flag: "🇷🇺" },
  { code: "+86", nameAr: "الصين", nameEn: "China", flag: "🇨🇳" },
  { code: "+81", nameAr: "اليابان", nameEn: "Japan", flag: "🇯🇵" },
  { code: "+82", nameAr: "كوريا الجنوبية", nameEn: "South Korea", flag: "🇰🇷" },
  { code: "+91", nameAr: "الهند", nameEn: "India", flag: "🇮🇳" },
  { code: "+92", nameAr: "باكستان", nameEn: "Pakistan", flag: "🇵🇰" },
  { code: "+60", nameAr: "ماليزيا", nameEn: "Malaysia", flag: "🇲🇾" },
  { code: "+62", nameAr: "إندونيسيا", nameEn: "Indonesia", flag: "🇮🇩" },
  { code: "+65", nameAr: "سنغافورة", nameEn: "Singapore", flag: "🇸🇬" },
  { code: "+61", nameAr: "أستراليا", nameEn: "Australia", flag: "🇦🇺" },
  { code: "+64", nameAr: "نيوزيلندا", nameEn: "New Zealand", flag: "🇳🇿" },
  { code: "+55", nameAr: "البرازيل", nameEn: "Brazil", flag: "🇧🇷" },
  { code: "+54", nameAr: "الأرجنتين", nameEn: "Argentina", flag: "🇦🇷" },
  { code: "+52", nameAr: "المكسيك", nameEn: "Mexico", flag: "🇲🇽" },
  { code: "+27", nameAr: "جنوب أفريقيا", nameEn: "South Africa", flag: "🇿🇦" },
  { code: "+234", nameAr: "نيجيريا", nameEn: "Nigeria", flag: "🇳🇬" },
  { code: "+254", nameAr: "كينيا", nameEn: "Kenya", flag: "🇰🇪" },
  { code: "+353", nameAr: "أيرلندا", nameEn: "Ireland", flag: "🇮🇪" },
  { code: "+40", nameAr: "رومانيا", nameEn: "Romania", flag: "🇷🇴" },
  { code: "+420", nameAr: "التشيك", nameEn: "Czech Republic", flag: "🇨🇿" },
  { code: "+36", nameAr: "المجر", nameEn: "Hungary", flag: "🇭🇺" },
  { code: "+994", nameAr: "أذربيجان", nameEn: "Azerbaijan", flag: "🇦🇿" },
  { code: "+995", nameAr: "جورجيا", nameEn: "Georgia", flag: "🇬🇪" },
  { code: "+998", nameAr: "أوزبكستان", nameEn: "Uzbekistan", flag: "🇺🇿" },
  { code: "+7", nameAr: "كازاخستان", nameEn: "Kazakhstan", flag: "🇰🇿" },
  { code: "+66", nameAr: "تايلاند", nameEn: "Thailand", flag: "🇹🇭" },
  { code: "+63", nameAr: "الفلبين", nameEn: "Philippines", flag: "🇵🇭" },
  { code: "+84", nameAr: "فيتنام", nameEn: "Vietnam", flag: "🇻🇳" },
  { code: "+357", nameAr: "قبرص", nameEn: "Cyprus", flag: "🇨🇾" },
  { code: "+98", nameAr: "إيران", nameEn: "Iran", flag: "🇮🇷" },
  { code: "+93", nameAr: "أفغانستان", nameEn: "Afghanistan", flag: "🇦🇫" },
  { code: "+358", nameAr: "فنلندا", nameEn: "Finland", flag: "🇫🇮" },
  { code: "+421", nameAr: "سلوفاكيا", nameEn: "Slovakia", flag: "🇸🇰" },
  { code: "+385", nameAr: "كرواتيا", nameEn: "Croatia", flag: "🇭🇷" },
  { code: "+381", nameAr: "صربيا", nameEn: "Serbia", flag: "🇷🇸" },
  { code: "+359", nameAr: "بلغاريا", nameEn: "Bulgaria", flag: "🇧🇬" }
];

document.addEventListener('DOMContentLoaded', () => {
  // Refresh travel data from localStorage
  travelData = getTravelData();

  // Current State
  let currentCategory = 'all';
  let searchQuery = '';
  let activeModalService = null;
  let activeSelectedBookingType = null;
  let activeFlatpickr = null;

  // DOM Elements
  const servicesGrid = document.getElementById('servicesGrid');
  const categoryPillsContainer = document.getElementById('categoryPills');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const btnSearchTrigger = document.getElementById('btnSearchTrigger');
  const resultsCountBadge = document.getElementById('resultsCountBadge');
  const activeCategoryTitle = document.getElementById('activeCategoryTitle');
  const activeCategoryDesc = document.getElementById('activeCategoryDesc');
  const serviceModal = document.getElementById('serviceModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBodyContent = document.getElementById('modalBodyContent');
  const modalHeaderImg = document.getElementById('modalHeaderImg');
  const modalBtnWhatsApp = document.getElementById('modalBtnWhatsApp');
  const modalBtnOnline = document.getElementById('modalBtnOnline');
  const modalPriceDisplay = document.getElementById('modalPriceDisplay');
  const faqListContainer = document.getElementById('faqListContainer');
  const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

  // Format Price with Company Currency Symbol
  function formatPrice(amount) {
    const symbol = travelData.company?.currencySymbol || '$';
    return `${symbol}${amount}`;
  }

  // Update Dynamic Company Information across the page
  function updateCompanyInfo() {
    const comp = travelData.company;
    if (!comp) return;

    // Update WhatsApp links
    const defaultWhatsAppMsg = encodeURIComponent("مرحباً تريند ترافيل، أود الاستفسار عن الخدمات والرحلات السياحية المتوفرة");
    const topContactBtn = document.querySelector('.btn-contact-top');
    if (topContactBtn) {
      topContactBtn.href = `https://api.whatsapp.com/send?phone=${comp.whatsapp}&text=${defaultWhatsAppMsg}`;
    }

    const floatingWhatsAppBtn = document.querySelector('.floating-whatsapp-btn');
    if (floatingWhatsAppBtn) {
      floatingWhatsAppBtn.href = `https://api.whatsapp.com/send?phone=${comp.whatsapp}&text=${defaultWhatsAppMsg}`;
    }

    const vipBannerWhatsAppBtn = document.querySelector('.vip-banner-actions .btn-vip-gold');
    if (vipBannerWhatsAppBtn) {
      vipBannerWhatsAppBtn.href = `https://api.whatsapp.com/send?phone=${comp.whatsapp}&text=${encodeURIComponent("مرحباً تريند ترافيل، أود تفاصيل وحجز يخت VIP خاص في البسفور")}`;
    }

    // Update Footer Contact Items
    const footerPhoneLinks = document.querySelectorAll('a[href*="whatsapp.com"]');
    footerPhoneLinks.forEach(link => {
      if (!link.classList.contains('btn-vip-gold') && !link.classList.contains('btn-contact-top') && !link.classList.contains('floating-whatsapp-btn')) {
        link.href = `https://api.whatsapp.com/send?phone=${comp.whatsapp}`;
        if (link.style.direction === 'ltr') {
          link.textContent = comp.phone || `+${comp.whatsapp}`;
        }
      }
    });

    const footerEmail = document.querySelector('.footer-contact-item span:has(i.fa-envelope), .footer-contact-item i.fa-envelope + span');
    if (footerEmail) {
      footerEmail.textContent = comp.email || 'info@trendtravel.com';
    }

    const footerLocation = document.querySelector('.footer-contact-item i.fa-location-dot + span');
    if (footerLocation) {
      footerLocation.textContent = comp.address || 'إسطنبول - تركيا';
    }
  }

  // Render Categories Pills
  function renderCategories() {
    if (!categoryPillsContainer) return;
    categoryPillsContainer.innerHTML = travelData.categories.map(cat => `
      <button class="category-pill ${cat.id === currentCategory ? 'active' : ''}" data-category="${cat.id}">
        <i class="fa-solid ${cat.icon}"></i>
        <span>${cat.name}</span>
      </button>
    `).join('');

    // Attach Click Events
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const catId = pill.getAttribute('data-category');
        selectCategory(catId);
      });
    });
  }

  // Select Category
  function selectCategory(catId) {
    currentCategory = catId;
    
    // Update Pills Active Class
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-category') === catId);
    });

    // Update Bottom Nav
    bottomNavItems.forEach(item => {
      const targetCat = item.getAttribute('data-nav-category');
      if (targetCat) {
        item.classList.toggle('active', targetCat === catId);
      }
    });

    // Update Category Header Titles
    const matchedCategory = travelData.categories.find(c => c.id === catId);
    if (matchedCategory) {
      if (activeCategoryTitle) {
        activeCategoryTitle.textContent = matchedCategory.id === 'all' ? 'أبرز البرامج والخدمات السياحية' : matchedCategory.name;
      }
      if (activeCategoryDesc) {
        activeCategoryDesc.textContent = matchedCategory.desc || 'اختر من بين تشكيلة واسعة من أفضل الخدمات السياحية الفاخرة بأفضل الأسعار';
      }
    }

    renderServices();
  }

  // Filter Services Logic
  function getFilteredServices() {
    return travelData.services.filter(service => {
      const matchCat = (currentCategory === 'all' || service.category === currentCategory);
      const matchSearch = searchQuery.trim() === '' || 
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.tags && service.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchCat && matchSearch;
    });
  }

  // Helper: Check if media is video
  function isVideoMedia(url, mediaType) {
    if (mediaType === 'video') return true;
    if (!url) return false;
    return url.startsWith('data:video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.endsWith('.ogg');
  }

  // Render Services Cards
  function renderServices() {
    if (!servicesGrid) return;
    const services = getFilteredServices();

    if (resultsCountBadge) {
      resultsCountBadge.textContent = `${services.length} خدمة متوفرة`;
    }

    if (services.length === 0) {
      servicesGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-magnifying-glass"></i>
          <h3>لم نجد أي خدمة مطابقة لبحثك</h3>
          <p>جرّب البحث بكلمات أخرى أو اختر تصنيفاً من القائمة أعلاه</p>
        </div>
      `;
      return;
    }

    servicesGrid.innerHTML = services.map(s => {
      const catObj = travelData.categories.find(c => c.id === s.category) || {};
      const highlightPreview = s.highlights && s.highlights.length > 0 ? s.highlights[0] : '';
      const isVideo = isVideoMedia(s.image, s.mediaType);
      const hasMultipleTypes = s.bookingTypes && s.bookingTypes.length > 1;
      let minPrice = s.price;
      let displayUnit = s.priceUnit;
      if (hasMultipleTypes) {
        minPrice = Math.min(...s.bookingTypes.map(b => b.price));
        const minType = s.bookingTypes.find(b => b.price === minPrice);
        if (minType && minType.priceUnit) {
          displayUnit = minType.priceUnit;
        }
      }

      return `
        <div class="service-card" data-service-id="${s.id}">
          <div class="service-card-media">
            ${isVideo ? `
              <video src="${s.image}" class="service-card-img" autoplay muted loop playsinline></video>
              <span style="position:absolute; top:12px; left:12px; background:rgba(15,23,42,0.85); color:#38bdf8; font-size:0.75rem; font-weight:700; padding:3px 10px; border-radius:9999px; display:flex; align-items:center; gap:5px; z-index:2; backdrop-filter:blur(4px);">
                <i class="fa-solid fa-play"></i> فيديو
              </span>
            ` : `
              <img src="${s.image}" alt="${s.title}" class="service-card-img" loading="lazy" />
            `}
            <div class="service-card-overlay"></div>
            <span class="category-tag-floating">${catObj.name || 'سياحة'}</span>
            <span class="duration-tag-floating">
              <i class="fa-regular fa-clock"></i>
              <span>${s.duration}</span>
            </span>
          </div>

          <div class="service-card-body">
            <div class="service-tags-list">
              ${(s.tags || []).map(t => `<span class="service-tag-pill">${t}</span>`).join('')}
            </div>

            <h3 class="service-card-title">${s.title}</h3>
            <p class="service-card-subtitle">${s.subtitle}</p>

            ${highlightPreview ? `
              <div class="card-highlights-preview">
                <div class="card-highlight-line">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>${highlightPreview}</span>
                </div>
              </div>
            ` : ''}

            <div class="service-card-footer">
              <div class="price-box">
                ${s.oldPrice && !hasMultipleTypes ? `<span class="price-old">${formatPrice(s.oldPrice)}</span>` : ''}
                <div class="price-current-wrap">
                  ${hasMultipleTypes ? `<span class="price-from-label">يبدأ من</span>` : ''}
                  <span class="price-current">${formatPrice(minPrice)}</span>
                  <span class="price-unit">/ ${displayUnit}</span>
                </div>
                ${hasMultipleTypes ? `
                  <span class="badge-multi-options">
                    <i class="fa-solid fa-layer-group"></i> ${s.bookingTypes.length} خيارات حجز
                  </span>
                ` : ''}
              </div>

              <div class="card-actions-group">
                <button class="btn-card-details btn-open-modal" data-id="${s.id}">
                  التفاصيل
                </button>
                <button class="btn-card-book btn-quick-book" data-id="${s.id}">
                  <i class="fa-brands fa-whatsapp"></i>
                  <span>حجز</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Event Listeners to cards
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openServiceModal(id);
      });
    });

    document.querySelectorAll('.btn-quick-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const s = travelData.services.find(item => item.id === id);
        if (s) {
          sendWhatsAppInquiry(s);
        }
      });
    });

    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-service-id');
        openServiceModal(id);
      });
    });
  }

  // Helper to update modal price display based on selected booking type
  function updateModalPriceDisplay(service, chosenType) {
    if (!modalPriceDisplay || !service) return;
    const priceToUse = chosenType ? chosenType.price : service.price;
    const unitToUse = chosenType ? (chosenType.priceUnit || service.priceUnit) : service.priceUnit;
    const hasOptions = service.bookingTypes && service.bookingTypes.length > 1;
    const typeLabel = chosenType && hasOptions
      ? `<span style="font-size:0.76rem; color:var(--color-accent-blue); font-weight:800; margin-bottom:2px; display:block; max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${chosenType.name}"><i class="fa-solid fa-check"></i> ${chosenType.name}</span>`
      : '';

    modalPriceDisplay.innerHTML = `
      ${typeLabel}
      <div style="display:flex; align-items:baseline; gap:4px;">
        <span style="font-size:0.8rem; color:#64748b;">السعر:</span>
        <strong style="font-size:1.3rem; color:var(--color-primary-navy);">${formatPrice(priceToUse)}</strong>
        <span style="font-size:0.78rem; color:#64748b;">/ ${unitToUse}</span>
      </div>
    `;
  }

  // Open Service Details Modal
  function openServiceModal(serviceId) {
    const s = travelData.services.find(item => item.id === serviceId);
    if (!s) return;
    activeModalService = s;

    // Set initial active booking type if available
    if (s.bookingTypes && s.bookingTypes.length > 0) {
      activeSelectedBookingType = s.bookingTypes[0];
    } else {
      activeSelectedBookingType = null;
    }

    const catObj = travelData.categories.find(c => c.id === s.category) || {};
    const modalHeaderMediaContainer = document.getElementById('modalHeaderMediaContainer');

    const rawGallery = (s.gallery && Array.isArray(s.gallery) && s.gallery.length > 0)
      ? s.gallery
      : [{ url: s.image, type: s.mediaType || (isVideoMedia(s.image) ? 'video' : 'image') }];

    const gallery = rawGallery.map((item) => {
      if (typeof item === 'string') {
        return { url: item, type: isVideoMedia(item) ? 'video' : 'image' };
      }
      return {
        url: item.url || '',
        type: item.type || (isVideoMedia(item.url) ? 'video' : 'image')
      };
    }).filter(item => Boolean(item.url));

    let currentGalleryIndex = 0;

    function renderModalGalleryItem(index) {
      if (index < 0) index = gallery.length - 1;
      if (index >= gallery.length) index = 0;
      currentGalleryIndex = index;

      const currentItem = gallery[currentGalleryIndex];
      const isVid = isVideoMedia(currentItem.url, currentItem.type);

      const viewport = document.getElementById('modalGalleryViewport');
      if (viewport) {
        if (isVid) {
          viewport.innerHTML = `<video src="${currentItem.url}" class="modal-gallery-item" controls autoplay muted loop playsinline></video>`;
        } else {
          viewport.innerHTML = `<img src="${currentItem.url}" alt="${s.title}" class="modal-gallery-item" />`;
        }
      }

      const counter = document.getElementById('modalGalleryCounter');
      if (counter) {
        counter.innerHTML = `<i class="fa-solid fa-images"></i> ${currentGalleryIndex + 1} / ${gallery.length}`;
      }

      document.querySelectorAll('.modal-thumb-btn').forEach((btn, i) => {
        if (i === currentGalleryIndex) {
          btn.classList.add('active');
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          btn.classList.remove('active');
        }
      });
    }

    if (modalHeaderMediaContainer) {
      if (gallery.length > 1) {
        // Multi-media interactive slider
        modalHeaderMediaContainer.innerHTML = `
          <div class="modal-gallery-container">
            <div class="modal-gallery-viewport" id="modalGalleryViewport">
              <!-- Injected by renderModalGalleryItem -->
            </div>

            <button class="modal-gallery-nav modal-gallery-prev" id="modalGalleryPrev" aria-label="السابق">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button class="modal-gallery-nav modal-gallery-next" id="modalGalleryNext" aria-label="التالي">
              <i class="fa-solid fa-chevron-left"></i>
            </button>

            <span class="modal-gallery-counter" id="modalGalleryCounter">
              <i class="fa-solid fa-images"></i> 1 / ${gallery.length}
            </span>

            <button class="modal-close-btn" id="modalCloseBtn" aria-label="إغلاق النافذة">
              <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="modal-gallery-thumbs-strip" id="modalGalleryThumbs">
              ${gallery.map((m, idx) => {
                const isVid = isVideoMedia(m.url, m.type);
                return `
                  <button type="button" class="modal-thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-index="${idx}" aria-label="عرض الوسيط ${idx + 1}">
                    ${isVid ? `
                      <video src="${m.url}" class="modal-thumb-img" muted></video>
                      <span class="modal-thumb-video-icon"><i class="fa-solid fa-play"></i></span>
                    ` : `
                      <img src="${m.url}" alt="مصغرة ${idx + 1}" class="modal-thumb-img" onerror="this.src='assets/media/basiclogo.png'" />
                    `}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;

        renderModalGalleryItem(0);

        document.getElementById('modalGalleryPrev')?.addEventListener('click', (e) => {
          e.stopPropagation();
          renderModalGalleryItem(currentGalleryIndex - 1);
        });

        document.getElementById('modalGalleryNext')?.addEventListener('click', (e) => {
          e.stopPropagation();
          renderModalGalleryItem(currentGalleryIndex + 1);
        });

        document.querySelectorAll('.modal-thumb-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetIdx = parseInt(btn.getAttribute('data-thumb-index'), 10);
            if (!isNaN(targetIdx)) {
              renderModalGalleryItem(targetIdx);
            }
          });
        });
      } else {
        // Single media view
        const singleItem = gallery[0] || { url: s.image, type: s.mediaType };
        const isSingleVid = isVideoMedia(singleItem.url, singleItem.type);

        if (isSingleVid) {
          modalHeaderMediaContainer.innerHTML = `
            <video src="${singleItem.url}" class="modal-header-img" controls autoplay muted loop playsinline></video>
            <button class="modal-close-btn" id="modalCloseBtn" aria-label="إغلاق النافذة">
              <i class="fa-solid fa-xmark"></i>
            </button>
          `;
        } else {
          modalHeaderMediaContainer.innerHTML = `
            <img src="${singleItem.url}" alt="${s.title}" id="modalHeaderImg" class="modal-header-img" />
            <button class="modal-close-btn" id="modalCloseBtn" aria-label="إغلاق النافذة">
              <i class="fa-solid fa-xmark"></i>
            </button>
          `;
        }
      }

      // Reattach modal close event listener
      document.getElementById('modalCloseBtn')?.addEventListener('click', closeServiceModal);
    }

    updateModalPriceDisplay(s, activeSelectedBookingType);

    if (modalBodyContent) {
      modalBodyContent.innerHTML = `
        <span class="modal-service-category">${catObj.name}</span>
        <h2 class="modal-service-title">${s.title}</h2>
        <p style="font-size:0.92rem; color:#64748b; margin-bottom:14px;">${s.subtitle}</p>

        <div class="modal-meta-row">
          <div class="modal-meta-pill">
            <i class="fa-regular fa-clock" style="color:var(--color-accent-blue);"></i>
            <span>المدة: ${s.duration}</span>
          </div>
        </div>

        ${s.highlights && s.highlights.length > 0 ? `
          <h4 class="modal-section-title">✨ أبرز مميزات وبرنامج الرحلة:</h4>
          <ul class="modal-highlights-list">
            ${s.highlights.map(h => `
              <li class="modal-highlight-item">
                <i class="fa-solid fa-circle-check"></i>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        ` : ''}

        ${(s.includes && s.includes.length > 0) || (s.excludes && s.excludes.length > 0) ? `
          <div class="modal-inc-exc-grid">
            ${s.includes && s.includes.length > 0 ? `
              <div class="inc-box">
                <h5><i class="fa-solid fa-check"></i> السعر يشمل:</h5>
                <ul style="padding-right:16px; margin:0; line-height:1.6;">
                  ${s.includes.map(inc => `<li>${inc}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            ${s.excludes && s.excludes.length > 0 ? `
              <div class="exc-box">
                <h5><i class="fa-solid fa-xmark"></i> السعر لا يشمل:</h5>
                <ul style="padding-right:16px; margin:0; line-height:1.6;">
                  ${s.excludes.map(exc => `<li>${exc}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <div class="modal-booking-panel">
          <h4 style="font-size:0.98rem; font-weight:800; color:var(--color-primary-navy); margin-bottom:4px;">
            <i class="fa-solid fa-calendar-check" style="color:var(--color-accent-blue);"></i> بيانات وتفاصيل الحجز
          </h4>
          <p style="font-size:0.8rem; color:#64748b; margin-bottom:14px;">يرجى اختيار نوع الحجز المناسب وملء البيانات التالية لتأكيد حجزك أونلاين أو عبر واتساب</p>

          ${s.bookingTypes && s.bookingTypes.length > 0 ? `
            <div class="booking-types-section">
              <div class="booking-types-title">
                <i class="fa-solid fa-layer-group" style="color:var(--color-accent-blue);"></i>
                <span>اختر نوع الحجز / الباقة:</span>
              </div>
              <div class="booking-types-subtitle">حدد الباقة المناسبة لاحتياجاتكم مع معاينة التكلفة والمميزات فوراً</div>
              <div class="booking-types-grid" id="modalBookingTypesGrid">
                ${s.bookingTypes.map((bType, idx) => `
                  <div class="booking-type-option-card ${idx === 0 ? 'selected' : ''}" data-type-id="${bType.id}">
                    <div class="booking-type-radio-dot"></div>
                    <div class="booking-type-content">
                      <div class="booking-type-header-row">
                        <span class="booking-type-name">${bType.name}</span>
                        <div class="booking-type-price-badge">
                          ${bType.oldPrice ? `<span class="booking-type-old-price">${formatPrice(bType.oldPrice)}</span>` : ''}
                          <span>${formatPrice(bType.price)}</span>
                          <span style="font-size:0.75rem; margin-right:3px; opacity:0.85;">/ ${bType.priceUnit || s.priceUnit}</span>
                        </div>
                      </div>
                      ${bType.desc ? `<p class="booking-type-desc">${bType.desc}</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="booking-form-grid">
            <!-- الاسم واللقب -->
            <div class="form-group">
              <label for="bookFullName">الاسم واللقب: <span class="required-star">*</span></label>
              <input type="text" id="bookFullName" class="form-control" placeholder="e.g. John Smith" required />
            </div>

            <!-- رقم الواتساب مع بحث الدول الشامل (الأردن الافتراضي) -->
            <div class="form-group">
              <label for="bookPhone">رقم الواتساب: <span class="required-star">*</span></label>
              <div class="phone-input-group">
                <div class="country-picker-container" id="countryPickerContainer">
                  <button type="button" class="country-picker-btn" id="countryPickerBtn" aria-label="تحديد رمز الدولة">
                    <span class="selected-flag-code" id="selectedFlagCode">🇯🇴 +962</span>
                    <i class="fa-solid fa-chevron-down country-chevron"></i>
                  </button>
                  <input type="hidden" id="bookCountryCode" value="+962" />

                  <!-- القائمة المنسدلة للبحث في الدول -->
                  <div class="country-dropdown-popover" id="countryDropdownPopover" style="display:none;">
                    <div class="country-search-bar">
                      <i class="fa-solid fa-magnifying-glass"></i>
                      <input type="text" id="countrySearchInput" placeholder="ابحث عن الدولة أو الرمز (Jordan, +962)..." autocomplete="off" />
                    </div>
                    <div class="country-scroll-list" id="countryScrollList"></div>
                  </div>
                </div>
                <input type="tel" id="bookPhone" class="form-control phone-number-input" placeholder="7xxxxxxx" dir="ltr" required />
              </div>
            </div>

            <!-- اسم الفندق -->
            <div class="form-group">
              <label for="bookHotel">اسم الفندق / مكان الإقامة:</label>
              <input type="text" id="bookHotel" class="form-control" placeholder="مثال: فندق هيلتون تقسيم / عنوان الشقة" />
            </div>

            <!-- تاريخ الرحلة مع Flatpickr العصري -->
            <div class="form-group">
              <label for="bookDate">تاريخ الرحلة المفضل: <span class="required-star">*</span></label>
              <div class="date-picker-wrap">
                <i class="fa-regular fa-calendar-days date-icon-badge"></i>
                <input type="text" id="bookDate" class="form-control modern-date-input" placeholder="اختر تاريخ الرحلة..." readonly required />
              </div>
              ${s.category === 'internet-sim' ? `
                <span class="date-helper-note"><i class="fa-solid fa-bolt"></i> متاح التفعيل بنفس اليوم فوراً.</span>
              ` : `
                <span class="date-helper-note"><i class="fa-solid fa-circle-info"></i> تبدأ الحجوزات من الغد فصاعداً لضمان جاهزية الخدمة.</span>
              `}
            </div>

            <!-- عدد الأشخاص -->
            <div class="form-group">
              <label for="bookPersons">عدد الأشخاص / الباقات:</label>
              <select id="bookPersons" class="form-control">
                <option value="1">1 شخص / باقة</option>
                <option value="2" selected>2 أشخاص</option>
                <option value="3">3 أشخاص</option>
                <option value="4">4 أشخاص</option>
                <option value="5">5 أشخاص</option>
                <option value="6+">6 أشخاص فما فوق (عائلة VIP)</option>
              </select>
            </div>

            <!-- ملاحظات إضافية -->
            <div class="form-group">
              <label for="bookNotes">ملاحظات أو طلبات خاصة:</label>
              <input type="text" id="bookNotes" class="form-control" placeholder="مثال: كراسي أطفال، باقة إنترنت، وقت محدد..." />
            </div>
          </div>

          <!-- تنبيه حالة الإرسال أونلاين -->
          <div id="bookingAlertStatus" class="booking-status-alert" style="display:none;"></div>
        </div>
      `;

      // Attach Interactive Booking Type selection event listeners
      if (s.bookingTypes && s.bookingTypes.length > 0) {
        const optionCards = modalBodyContent.querySelectorAll('.booking-type-option-card');
        optionCards.forEach(card => {
          card.addEventListener('click', () => {
            optionCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            const typeId = card.getAttribute('data-type-id');
            const chosen = s.bookingTypes.find(t => t.id === typeId);
            if (chosen) {
              activeSelectedBookingType = chosen;
              updateModalPriceDisplay(s, chosen);
            }
          });
        });
      }

      // Initialize Modern Flatpickr with strict validation rules
      if (activeFlatpickr) {
        try { activeFlatpickr.destroy(); } catch (e) {}
        activeFlatpickr = null;
      }

      const isSimCategory = (s.category === 'internet-sim');
      let minAllowedDate;
      let defaultSelectedDate;

      if (isSimCategory) {
        minAllowedDate = 'today';
        defaultSelectedDate = new Date();
      } else {
        // Strictly block today and past days for all tours/yachts
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        minAllowedDate = tomorrow;
        defaultSelectedDate = tomorrow;
      }

      if (window.flatpickr) {
        activeFlatpickr = flatpickr('#bookDate', {
          locale: (window.flatpickr.l10ns && window.flatpickr.l10ns.ar) ? window.flatpickr.l10ns.ar : 'ar',
          dateFormat: 'Y-m-d',
          altInput: true,
          altFormat: 'l، j F Y', // e.g. "الإثنين، 31 أغسطس 2026"
          altInputClass: 'form-control modern-date-input',
          minDate: minAllowedDate,
          defaultDate: defaultSelectedDate,
          disableMobile: true, // Use custom modern flatpickr UI across all devices
          animate: true
        });
      }

      // Initialize Searchable Country Picker
      initSearchableCountryPicker();

      // Pre-fill customer details from saved Cookie if available
      prefillBookingFormFromCookies();
    }

    if (serviceModal) {
      serviceModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  // Searchable Country Picker Initialization
  function initSearchableCountryPicker() {
    const btn = document.getElementById('countryPickerBtn');
    const popover = document.getElementById('countryDropdownPopover');
    const searchInput = document.getElementById('countrySearchInput');
    const listContainer = document.getElementById('countryScrollList');
    const hiddenCode = document.getElementById('bookCountryCode');
    const flagCodeSpan = document.getElementById('selectedFlagCode');

    if (!btn || !popover || !listContainer) return;

    function renderList(query = '') {
      const q = query.trim().toLowerCase();
      const filtered = WORLD_COUNTRIES.filter(c => {
        if (!q) return true;
        return c.nameAr.toLowerCase().includes(q) ||
               c.nameEn.toLowerCase().includes(q) ||
               c.code.toLowerCase().includes(q);
      });

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="country-no-results">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>لم يتم العثور على دولة مطابقة</span>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = filtered.map(c => {
        const isSelected = (hiddenCode.value === c.code && flagCodeSpan.textContent.includes(c.flag));
        return `
          <div class="country-option-item ${isSelected ? 'selected' : ''}" data-code="${c.code}" data-flag="${c.flag}" data-name="${c.nameAr}">
            <span class="country-flag-icon">${c.flag}</span>
            <div class="country-names-wrap">
              <span class="country-name-ar">${c.nameAr}</span>
              <span class="country-name-en">${c.nameEn}</span>
            </div>
            <span class="country-code-badge" dir="ltr">${c.code}</span>
          </div>
        `;
      }).join('');

      listContainer.querySelectorAll('.country-option-item').forEach(el => {
        el.addEventListener('click', () => {
          const code = el.getAttribute('data-code');
          const flag = el.getAttribute('data-flag');
          hiddenCode.value = code;
          flagCodeSpan.textContent = `${flag} ${code}`;
          popover.style.display = 'none';
        });
      });
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShown = (popover.style.display === 'block');
      if (isShown) {
        popover.style.display = 'none';
      } else {
        popover.style.display = 'block';
        searchInput.value = '';
        renderList('');
        setTimeout(() => searchInput.focus(), 60);
      }
    });

    searchInput.addEventListener('input', (e) => {
      renderList(e.target.value);
    });

    searchInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      if (popover.style.display === 'block' && !popover.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        popover.style.display = 'none';
      }
    });

    renderList('');
  }

  // Close Modal
  function closeServiceModal() {
    if (serviceModal) {
      serviceModal.classList.remove('open');
      document.body.style.overflow = '';
      if (activeFlatpickr) {
        try { activeFlatpickr.destroy(); } catch (e) {}
        activeFlatpickr = null;
      }
      activeModalService = null;
      activeSelectedBookingType = null;
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeServiceModal);
  }

  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        closeServiceModal();
      }
    });
  }

  // Helper to gather modal booking form data
  function getModalFormData() {
    const fullName = document.getElementById('bookFullName')?.value.trim() || '';
    const countryCode = document.getElementById('bookCountryCode')?.value || '+962';
    const phone = document.getElementById('bookPhone')?.value.trim() || '';
    const fullPhone = phone ? `${countryCode} ${phone}`.trim() : '';
    const hotel = document.getElementById('bookHotel')?.value.trim() || '';
    const altDateInput = document.querySelector('.modern-date-input');
    const dateVal = altDateInput?.value || document.getElementById('bookDate')?.value || 'غير محدد';
    const personsVal = document.getElementById('bookPersons')?.value || '2';
    const notesVal = document.getElementById('bookNotes')?.value.trim() || '';

    const currentType = activeSelectedBookingType || (activeModalService && activeModalService.bookingTypes && activeModalService.bookingTypes.length > 0 ? activeModalService.bookingTypes[0] : null);
    const priceVal = currentType ? formatPrice(currentType.price) : (activeModalService ? formatPrice(activeModalService.price) : '');
    const unitVal = currentType ? (currentType.priceUnit || activeModalService?.priceUnit) : (activeModalService?.priceUnit || 'للشخص');
    const bookingTypeName = currentType ? currentType.name : '';
    const bookingTypeId = currentType ? currentType.id : '';

    // Persist customer contact preferences in Cookie for faster future bookings
    saveBookingProfileToCookies({ fullName, countryCode, phone, hotel });

    return {
      service: activeModalService,
      bookingType: currentType,
      bookingTypeName,
      bookingTypeId,
      fullName,
      countryCode,
      phone,
      fullPhone,
      hotel,
      date: dateVal,
      persons: personsVal,
      notes: notesVal,
      price: priceVal,
      priceUnit: unitVal,
      createdAt: new Date().toISOString()
    };
  }

  // Modal WhatsApp Booking Trigger
  if (modalBtnWhatsApp) {
    modalBtnWhatsApp.addEventListener('click', () => {
      if (!activeModalService) return;
      const data = getModalFormData();
      const whatsappNum = travelData.company?.whatsapp || "905550000000";

      let textMsg = `مرحباً تريند ترافيل 👋%0A%0Aأود تأكيد الحجز والاستفسار عن خدمة:%0A⭐ *${activeModalService.title}*%0A`;
      if (data.bookingTypeName) {
        textMsg += `🎫 *نوع الحجز:* ${encodeURIComponent(data.bookingTypeName)}%0A`;
      }
      if (data.fullName) textMsg += `👤 *الاسم:* ${encodeURIComponent(data.fullName)}%0A`;
      if (data.fullPhone) textMsg += `📱 *رقم التواصل:* ${encodeURIComponent(data.fullPhone)}%0A`;
      if (data.hotel) textMsg += `🏨 *الفندق / الإقامة:* ${encodeURIComponent(data.hotel)}%0A`;
      textMsg += `📅 *التاريخ:* ${encodeURIComponent(data.date)}%0A`;
      textMsg += `👥 *العدد:* ${encodeURIComponent(data.persons)}%0A`;
      textMsg += `💵 *السعر التقديري:* ${encodeURIComponent(data.price)} / ${encodeURIComponent(data.priceUnit)}%0A`;
      if (data.notes) textMsg += `📝 *ملاحظات:* ${encodeURIComponent(data.notes)}%0A`;
      textMsg += `%0Aأرجو مراجعة الطلب وتأكيد الحجز. شكراً لكم!`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNum}&text=${textMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // Modal Online Booking Trigger (Connected directly to Google Sheets & Webhook)
  if (modalBtnOnline) {
    modalBtnOnline.addEventListener('click', async () => {
      if (!activeModalService) return;
      const data = getModalFormData();
      const alertBox = document.getElementById('bookingAlertStatus');

      // Validation
      if (!data.fullName) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.className = 'booking-status-alert error';
          alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> يرجى كتابة الاسم واللقب للمتابعة.';
        }
        document.getElementById('bookFullName')?.focus();
        return;
      }

      if (!data.phone) {
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.className = 'booking-status-alert error';
          alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> يرجى إدخال رقم الواتساب للتواصل وتأكيد الحجز.';
        }
        document.getElementById('bookPhone')?.focus();
        return;
      }

      // Generate unique human-readable booking ID
      const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);

      // Prepare payload matching Google Sheets Columns
      const payload = {
        bookingId: bookingId,
        serviceTitle: activeModalService.title,
        bookingType: data.bookingTypeName || 'حجز قياسي',
        bookingTypeId: data.bookingTypeId || 'standard',
        serviceCategory: activeModalService.category,
        price: `${data.price} / ${data.priceUnit}`,
        fullName: data.fullName,
        countryCode: data.countryCode,
        phone: data.phone,
        fullPhone: data.fullPhone,
        hotel: data.hotel || 'غير محدد',
        tripDate: data.date,
        personsCount: data.persons,
        notes: data.notes || 'لا يوجد',
        bookingStatus: "New",
        createdAt: new Date().toISOString()
      };

      // Set Loading State on Button
      const originalBtnHTML = modalBtnOnline.innerHTML;
      modalBtnOnline.disabled = true;
      modalBtnOnline.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جاري إرسال الحجز...</span>';

      // Refresh latest travelData from storage to ensure updated webhookUrl is used
      travelData = getTravelData();
      const webhookEndpoint = travelData.company?.webhookUrl || travelData.company?.googleSheetsUrl || "";
      console.log('🔗 Sending booking payload to Webhook:', webhookEndpoint, payload);

      if (!webhookEndpoint) {
        if (alertBox) {
          alertBox.style.display = 'flex';
          alertBox.className = 'booking-status-alert error';
          alertBox.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> يرجى ضبط رابط الـ Webhook أولاً من لوحة تحكم الإدارة (الإعدادات).';
        }
        modalBtnOnline.disabled = false;
        modalBtnOnline.innerHTML = originalBtnHTML;
        return;
      }

      // Timeout controller for webhook transmission (8 seconds max for response, background processing)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        // Save to browser backup immediately
        try {
          const localBookings = JSON.parse(localStorage.getItem('trend_bookings') || '[]');
          localBookings.unshift({
            ...payload,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('trend_bookings', JSON.stringify(localBookings));
        } catch (e) {}

        // Send directly to n8n / Webhook URL
        try {
          await fetch(webhookEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (fetchErr) {
          console.warn('Standard webhook fetch encountered CORS/Preflight, executing simple-request fallback:', fetchErr);
          // Fallback with simple request without triggering CORS preflight
          try {
            await fetch(webhookEndpoint, {
              method: 'POST',
              mode: 'no-cors',
              headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
              },
              body: JSON.stringify(payload)
            });
          } catch (e2) {
            console.warn('Fallback beacon pinged:', e2);
            // Final fallback: sendBeacon
            if (navigator.sendBeacon) {
              const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' });
              navigator.sendBeacon(webhookEndpoint, blob);
            }
          }
        }
        clearTimeout(timeoutId);

        // Show Success Alert
        if (alertBox) {
          alertBox.style.display = 'flex';
          alertBox.className = 'booking-status-alert success';
          alertBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size:1.3rem; margin-top:2px;"></i>
            <div>
              <strong style="font-size:0.95rem; color:#166534;">تم تسجيل وإرسال طلب الحجز بنجاح! 🚀</strong><br />
              <span style="font-size:0.82rem; color:#14532d; display:block; margin:4px 0;">
                رقم الحجز: <b style="background:#dcfce7; padding:2px 6px; border-radius:4px; font-family:monospace;">${bookingId}</b>
              </span>
              <span style="font-size:0.8rem; color:#166534; line-height:1.4;">
                شكراً لك يا <b>${data.fullName}</b>، تم استلام بيانات حجزك لـ (<b>${activeModalService.title}</b>${data.bookingTypeName ? ` - <b>${data.bookingTypeName}</b>` : ''}) وسيتم التواصل معك مباشرة على الرقم <b>${data.fullPhone}</b>.
              </span>
            </div>
          `;
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('Error submitting booking:', err);

        // Even if network was slow, the booking is saved locally
        if (alertBox) {
          alertBox.style.display = 'flex';
          alertBox.className = 'booking-status-alert success';
          alertBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size:1.3rem; margin-top:2px;"></i>
            <div>
              <strong style="font-size:0.95rem; color:#166534;">تم حفظ وتأكيد الحجز بنجاح!</strong><br />
              <span style="font-size:0.82rem; color:#14532d; display:block; margin:4px 0;">
                رقم الحجز: <b style="background:#dcfce7; padding:2px 6px; border-radius:4px; font-family:monospace;">${bookingId}</b>
              </span>
              <span style="font-size:0.8rem; color:#166534; line-height:1.4;">
                تم تسجيل بياناتك لخدمة (<b>${activeModalService.title}</b>${data.bookingTypeName ? ` - <b>${data.bookingTypeName}</b>` : ''}) وسيصلك تأكيد فوري عبر واتساب على الرقم <b>${data.fullPhone}</b>.
              </span>
            </div>
          `;
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        modalBtnOnline.disabled = false;
        modalBtnOnline.innerHTML = originalBtnHTML;
      }
    });
  }

  // Generic WhatsApp Inquiry
  function sendWhatsAppInquiry(service) {
    const whatsappNum = travelData.company?.whatsapp || "905550000000";
    let priceText = `${formatPrice(service.price)} / ${service.priceUnit}`;
    if (service.bookingTypes && service.bookingTypes.length > 1) {
      const minP = Math.min(...service.bookingTypes.map(b => b.price));
      priceText = `يبدأ من ${formatPrice(minP)} (${service.bookingTypes.length} باقات متاحة)`;
    }
    const textMsg = `مرحباً Trend Travel 👋%0A%0Aأرغب في الاستفسار والحجز لـ:%0A⭐ *${service.title}*%0A💵 *السعر:* ${encodeURIComponent(priceText)}%0A%0Aأرجو تزويدي بالخيارات المتاحة وتأكيد الحجز.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNum}&text=${textMsg}`;
    window.open(whatsappUrl, '_blank');
  }

  // Render FAQs
  function renderFAQs() {
    if (!faqListContainer) return;
    faqListContainer.innerHTML = (travelData.faqs || []).map((faq, index) => `
      <div class="faq-item ${index === 0 ? 'active' : ''}">
        <button class="faq-question">
          <span>${faq.q}</span>
          <i class="fa-solid fa-chevron-down faq-chevron"></i>
        </button>
        <div class="faq-answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // Search Bar logic
  function handleSearch() {
    searchQuery = heroSearchInput ? heroSearchInput.value.trim() : '';
    renderServices();
    // Smooth scroll to services section
    const sec = document.getElementById('servicesSection');
    if (sec) {
      sec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderServices();
    });

    heroSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }

  if (btnSearchTrigger) {
    btnSearchTrigger.addEventListener('click', handleSearch);
  }

  // Bottom Nav Bar Links
  bottomNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const targetCat = item.getAttribute('data-nav-category');
      const targetScroll = item.getAttribute('data-scroll-to');

      if (targetCat) {
        selectCategory(targetCat);
        const sec = document.getElementById('servicesSection');
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (targetScroll) {
        const targetEl = document.getElementById(targetScroll);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        bottomNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // Header Scroll effect
  const mainHeader = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader?.classList.add('scrolled');
    } else {
      mainHeader?.classList.remove('scrolled');
    }
  });

  // Listen to Storage changes (Sync live if changed in another tab or Admin Panel)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === STORAGE_KEY + '_sync_ping') {
      if (typeof hydrateTravelDataFromIndexedDB === 'function') {
        hydrateTravelDataFromIndexedDB().then(() => {
          travelData = getTravelData();
          updateCompanyInfo();
          renderCategories();
          renderServices();
          renderFAQs();
        });
      } else {
        travelData = getTravelData();
        updateCompanyInfo();
        renderCategories();
        renderServices();
        renderFAQs();
      }
    }
  });

  // Refresh UI when IndexedDB finishes loading full media gallery
  if (window.travelDataReadyPromise) {
    window.travelDataReadyPromise.then(() => {
      travelData = getTravelData();
      updateCompanyInfo();
      renderCategories();
      renderServices();
      renderFAQs();
    });
  }

  window.addEventListener('travelDataReady', () => {
    travelData = getTravelData();
    updateCompanyInfo();
    renderCategories();
    renderServices();
    renderFAQs();
  });

  // ===================================================
  // Cookie Management & Consent Banner
  // ===================================================
  const COOKIE_CONSENT_KEY = 'trend_cookie_consent';
  const COOKIE_PROFILE_KEY = 'trend_customer_profile';
  const COOKIE_VISITOR_KEY = 'trend_visitor_id';

  function setSiteCookie(name, value, days = 365) {
    const maxAge = days * 24 * 60 * 60;
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax${secureFlag}`;
  }

  function getSiteCookie(name) {
    const target = `${encodeURIComponent(name)}=`;
    const parts = document.cookie ? document.cookie.split(';') : [];
    for (let i = 0; i < parts.length; i++) {
      const c = parts[i].trim();
      if (c.indexOf(target) === 0) {
        return decodeURIComponent(c.substring(target.length));
      }
    }
    return null;
  }

  function saveBookingProfileToCookies(profile) {
    const consent = getSiteCookie(COOKIE_CONSENT_KEY);
    if (consent === 'essential') return; // Only save functional profile if accepted or default
    try {
      const cleanProfile = {
        fullName: profile.fullName || '',
        countryCode: profile.countryCode || '+962',
        phone: profile.phone || '',
        hotel: profile.hotel || ''
      };
      if (cleanProfile.fullName || cleanProfile.phone || cleanProfile.hotel) {
        setSiteCookie(COOKIE_PROFILE_KEY, JSON.stringify(cleanProfile), 30);
      }
    } catch (e) {}
  }

  function prefillBookingFormFromCookies() {
    try {
      const raw = getSiteCookie(COOKIE_PROFILE_KEY);
      if (!raw) return;
      const profile = JSON.parse(raw);
      if (!profile) return;

      const nameEl = document.getElementById('bookFullName');
      const phoneEl = document.getElementById('bookPhone');
      const hotelEl = document.getElementById('bookHotel');
      const codeEl = document.getElementById('bookCountryCode');
      const flagSpan = document.getElementById('selectedFlagCode');

      if (nameEl && !nameEl.value && profile.fullName) nameEl.value = profile.fullName;
      if (phoneEl && !phoneEl.value && profile.phone) phoneEl.value = profile.phone;
      if (hotelEl && !hotelEl.value && profile.hotel) hotelEl.value = profile.hotel;
      if (codeEl && flagSpan && profile.countryCode) {
        const matchedCountry = WORLD_COUNTRIES.find(c => c.code === profile.countryCode);
        if (matchedCountry) {
          codeEl.value = matchedCountry.code;
          flagSpan.textContent = `${matchedCountry.flag} ${matchedCountry.code}`;
        }
      }
    } catch (e) {}
  }

  function initCookieConsent() {
    const banner = document.getElementById('cookieConsentBanner');
    const btnAccept = document.getElementById('btnCookieAccept');
    const btnEssential = document.getElementById('btnCookieEssential');

    // Ensure unique visitor session cookie
    if (!getSiteCookie(COOKIE_VISITOR_KEY)) {
      setSiteCookie(COOKIE_VISITOR_KEY, `v-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`, 365);
    }

    const existingConsent = getSiteCookie(COOKIE_CONSENT_KEY);
    if (!existingConsent && banner) {
      setTimeout(() => {
        banner.style.display = 'block';
      }, 800);
    }

    if (btnAccept) {
      btnAccept.addEventListener('click', () => {
        setSiteCookie(COOKIE_CONSENT_KEY, 'accepted', 365);
        if (banner) banner.style.display = 'none';
      });
    }

    if (btnEssential) {
      btnEssential.addEventListener('click', () => {
        setSiteCookie(COOKIE_CONSENT_KEY, 'essential', 365);
        if (banner) banner.style.display = 'none';
      });
    }
  }

  // Initialize
  updateCompanyInfo();
  renderCategories();
  renderServices();
  renderFAQs();
  initCookieConsent();
});
