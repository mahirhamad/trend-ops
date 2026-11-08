// admin.js - محرك لوحة تحكم Trend Travel الإدارية

document.addEventListener('DOMContentLoaded', () => {
  // Authentication & Security Keys
  const AUTH_KEY = 'trend_admin_authenticated';
  const SESSION_COOKIE_NAME = 'trend_admin_session';
  const PASSWORD_KEY = 'trend_admin_password';
  const PASSWORD_HASH_KEY = 'trend_admin_password_hash';
  const LOCKOUT_KEY = 'trend_admin_lockout';
  // SHA-256 of default initial password ('admin') - only used if no custom password is set yet
  const DEFAULT_PASSWORD_SHA256 = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout

  // Global State
  let travelData = getTravelData();
  let currentTab = 'dashboard';
  let serviceFilterCategory = 'all';
  let serviceSearchQuery = '';
  let editingServiceId = null;
  let editingFaqId = null;
  let deleteActionTarget = null; // { type: 'service' | 'faq', id: string }

  // DOM Elements - Auth & Main Wrapper
  const loginOverlay = document.getElementById('loginOverlay');
  const adminMainWrapper = document.getElementById('adminMainWrapper') || document.querySelector('.admin-wrapper');
  const loginForm = document.getElementById('loginForm');
  const loginPasswordInput = document.getElementById('loginPasswordInput');
  const loginRememberCookie = document.getElementById('loginRememberCookie');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const loginErrorText = document.getElementById('loginErrorText');
  const btnLogout = document.getElementById('btnLogout');

  // DOM Elements - Navigation & Layout
  const adminSidebar = document.getElementById('adminSidebar');
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const navItems = document.querySelectorAll('.admin-nav-item');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // DOM Elements - Modals
  const serviceModal = document.getElementById('adminServiceModal');
  const serviceModalClose = document.getElementById('serviceModalClose');
  const serviceModalCancel = document.getElementById('serviceModalCancel');
  const serviceForm = document.getElementById('serviceForm');
  const serviceModalTitle = document.getElementById('serviceModalTitle');

  const faqModal = document.getElementById('adminFaqModal');
  const faqModalClose = document.getElementById('faqModalClose');
  const faqModalCancel = document.getElementById('faqModalCancel');
  const faqForm = document.getElementById('faqForm');
  const faqModalTitle = document.getElementById('faqModalTitle');

  const confirmModal = document.getElementById('adminConfirmModal');
  const confirmModalClose = document.getElementById('confirmModalClose');
  const confirmModalCancel = document.getElementById('confirmModalCancel');
  const confirmModalBtn = document.getElementById('confirmModalBtn');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalMessage = document.getElementById('confirmModalMessage');

  // Toast Container
  const toastContainer = document.getElementById('adminToastContainer');

  /* ===================================================
     1. Authentication, Cookies & Brute-Force Protection
     =================================================== */
  function setAdminCookie(name, value, maxAgeSeconds) {
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Strict${secureFlag}`;
  }

  function getAdminCookie(name) {
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

  function deleteAdminCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/; SameSite=Strict`;
  }

  // SHA-256 Hash helper (uses Web Crypto API with pure-JS fallback)
  async function hashPasswordSHA256(str) {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Simple deterministic fallback if non-secure context lacks crypto.subtle
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
  }

  async function verifyAdminPassword(candidatePassword) {
    const trimmed = (candidatePassword || '').trim();
    if (!trimmed) return false;

    const candidateHash = await hashPasswordSHA256(trimmed);
    travelData = getTravelData();

    // 1. Check custom hash in travelData.company (persisted in data.js for deployed site)
    const companyHash = travelData.company?.adminPasswordHash;
    const localHash = localStorage.getItem(PASSWORD_HASH_KEY);
    const activeHash = localHash || companyHash;

    if (activeHash) {
      return candidateHash === activeHash;
    }

    // 2. Check legacy plaintext password in localStorage if previously set
    const legacySaved = localStorage.getItem(PASSWORD_KEY);
    if (legacySaved && legacySaved.trim() !== '') {
      if (trimmed === legacySaved.trim()) {
        // Auto-upgrade legacy plaintext to SHA-256 hash
        localStorage.setItem(PASSWORD_HASH_KEY, candidateHash);
        localStorage.removeItem(PASSWORD_KEY);
        return true;
      }
      return false;
    }

    // 3. Initial default password ('admin') before custom password is set
    return candidateHash === DEFAULT_PASSWORD_SHA256 || trimmed === 'admin';
  }

  function getLockoutState() {
    try {
      const raw = localStorage.getItem(LOCKOUT_KEY) || getAdminCookie(LOCKOUT_KEY);
      if (!raw) return { attempts: 0, lockedUntil: 0 };
      return JSON.parse(raw);
    } catch (e) {
      return { attempts: 0, lockedUntil: 0 };
    }
  }

  function saveLockoutState(state) {
    const str = JSON.stringify(state);
    try { localStorage.setItem(LOCKOUT_KEY, str); } catch (e) {}
    setAdminCookie(LOCKOUT_KEY, str, 3600);
  }

  function isAuthenticatedSession() {
    const cookieSession = getAdminCookie(SESSION_COOKIE_NAME);
    if (cookieSession && cookieSession.startsWith('valid:')) {
      const exp = parseInt(cookieSession.split(':')[1], 10);
      if (!isNaN(exp) && Date.now() < exp) {
        return true;
      }
    }
    // Check sessionStorage fallback for current browser tab session
    const tabSession = sessionStorage.getItem(AUTH_KEY);
    if (tabSession === 'true') {
      return true;
    }
    return false;
  }

  function checkAuth() {
    if (isAuthenticatedSession()) {
      if (loginOverlay) loginOverlay.style.display = 'none';
      if (adminMainWrapper) adminMainWrapper.style.display = 'flex';
      initDashboard();
    } else {
      if (adminMainWrapper) adminMainWrapper.style.display = 'none';
      if (loginOverlay) loginOverlay.style.display = 'flex';
      if (loginPasswordInput) {
        loginPasswordInput.value = '';
        setTimeout(() => loginPasswordInput.focus(), 100);
      }
    }
  }

  async function handleLoginSubmit() {
    const lockState = getLockoutState();
    if (lockState.lockedUntil && Date.now() < lockState.lockedUntil) {
      const remainingSec = Math.ceil((lockState.lockedUntil - Date.now()) / 1000);
      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      if (loginErrorMsg) loginErrorMsg.style.display = 'block';
      if (loginErrorText) {
        loginErrorText.textContent = `تم قفل المحاولات مؤقتاً للحماية. يرجى الانتظار ${mins > 0 ? mins + ' دقيقة و ' : ''}${secs} ثانية.`;
      }
      return;
    }

    const enteredPassword = loginPasswordInput ? loginPasswordInput.value.trim() : '';
    const isValid = await verifyAdminPassword(enteredPassword);

    if (isValid) {
      // Clear failed attempts
      saveLockoutState({ attempts: 0, lockedUntil: 0 });
      deleteAdminCookie(LOCKOUT_KEY);

      // Set session cookie (7 days if Remember checked, otherwise 12 hours)
      const rememberDays = (loginRememberCookie && loginRememberCookie.checked) ? 7 : 0.5;
      const maxAgeSeconds = Math.floor(rememberDays * 24 * 60 * 60);
      const expiresAt = Date.now() + maxAgeSeconds * 1000;
      setAdminCookie(SESSION_COOKIE_NAME, `valid:${expiresAt}`, maxAgeSeconds);
      sessionStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_KEY, 'true');

      if (loginErrorMsg) loginErrorMsg.style.display = 'none';
      if (loginPasswordInput) loginPasswordInput.classList.remove('error');
      if (loginOverlay) loginOverlay.style.display = 'none';
      if (adminMainWrapper) adminMainWrapper.style.display = 'flex';
      showToast('تم تسجيل الدخول الآمن بنجاح! أهلاً بك في لوحة الإدارة', 'success');
      initDashboard();
    } else {
      const newAttempts = (lockState.attempts || 0) + 1;
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
        saveLockoutState({ attempts: newAttempts, lockedUntil });
        if (loginErrorText) {
          loginErrorText.textContent = 'تم استنفاد 5 محاولات خاطئة! تم قفل الدخول لمدة 5 دقائق للحماية.';
        }
      } else {
        saveLockoutState({ attempts: newAttempts, lockedUntil: 0 });
        const left = MAX_LOGIN_ATTEMPTS - newAttempts;
        if (loginErrorText) {
          loginErrorText.textContent = `كلمة المرور غير صحيحة (${left} محاولات متبقية قبل القفل المؤقت)`;
        }
      }
      if (loginErrorMsg) loginErrorMsg.style.display = 'block';
      if (loginPasswordInput) {
        loginPasswordInput.classList.add('error');
        loginPasswordInput.select();
      }
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLoginSubmit();
    });
  }

  const btnLoginSubmit = document.getElementById('btnLoginSubmit');
  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      handleLoginSubmit();
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      deleteAdminCookie(SESSION_COOKIE_NAME);
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
      showToast('تم تسجيل الخروج وإنهاء الجلسة بأمان', 'info');
      checkAuth();
    });
  }

  /* ===================================================
     2. Navigation & Tab Switching
     =================================================== */
  function switchTab(tabId) {
    currentTab = tabId;

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
    });

    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    // Close mobile sidebar if open
    if (adminSidebar) {
      adminSidebar.classList.remove('open');
    }

    // Refresh specific tab data
    if (tabId === 'dashboard') renderDashboardStats();
    if (tabId === 'services') renderServicesTable();
    if (tabId === 'categories') renderCategoriesList();
    if (tabId === 'faqs') renderFaqsList();
    if (tabId === 'settings') loadSettingsForm();
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });

  if (btnMobileMenu) {
    btnMobileMenu.addEventListener('click', () => {
      if (adminSidebar) {
        adminSidebar.classList.toggle('open');
      }
    });
  }

  /* ===================================================
     3. Dashboard Statistics & Overview
     =================================================== */
  function renderDashboardStats() {
    travelData = getTravelData();
    const services = travelData.services || [];

    const totalCount = services.length;
    const groupToursCount = services.filter(s => s.category === 'group-tours').length;
    const privateToursCount = services.filter(s => s.category === 'private-tours').length;
    const yachtCount = services.filter(s => s.category === 'private-yacht').length;
    const esimCount = services.filter(s => s.category === 'internet-sim').length;
    const faqsCount = (travelData.faqs || []).length;

    // Update Counter Elements
    const statTotalServices = document.getElementById('statTotalServices');
    const statGroupTours = document.getElementById('statGroupTours');
    const statPrivateTours = document.getElementById('statPrivateTours');
    const statYachts = document.getElementById('statYachts');
    const statEsim = document.getElementById('statEsim');
    const navServicesBadge = document.getElementById('navServicesBadge');
    const navFaqsBadge = document.getElementById('navFaqsBadge');

    if (statTotalServices) statTotalServices.textContent = totalCount;
    if (statGroupTours) statGroupTours.textContent = groupToursCount;
    if (statPrivateTours) statPrivateTours.textContent = privateToursCount;
    if (statYachts) statYachts.textContent = yachtCount;
    if (statEsim) statEsim.textContent = esimCount;
    if (navServicesBadge) navServicesBadge.textContent = totalCount;
    if (navFaqsBadge) navFaqsBadge.textContent = faqsCount;

    // Render Recent Services preview on dashboard
    const dashboardRecentServices = document.getElementById('dashboardRecentServices');
    if (dashboardRecentServices) {
      const recent = services.slice(0, 5);
      const currencySymbol = travelData.company?.currencySymbol || '$';

      if (recent.length === 0) {
        dashboardRecentServices.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#64748b;">لا توجد خدمات مضافة حالياً</td></tr>`;
      } else {
        dashboardRecentServices.innerHTML = recent.map(s => {
          const catObj = travelData.categories.find(c => c.id === s.category) || {};
          return `
            <tr>
              <td>
                <div class="table-thumb-wrap">
                  <img src="${s.image}" alt="${s.title}" class="table-thumb-img" onerror="this.src='assets/media/basiclogo.png'" />
                  <div>
                    <div class="table-item-title">${s.title}</div>
                    <div class="table-item-sub">${s.subtitle || ''}</div>
                  </div>
                </div>
              </td>
              <td><span class="badge-pill-cat cat-badge-${s.category}">${catObj.name || s.category}</span></td>
              <td><strong class="table-price-tag">${currencySymbol}${s.price}</strong> <span class="table-price-unit">/ ${s.priceUnit}</span></td>
              <td>${s.duration || '-'}</td>
              <td>
                <button class="btn-tbl-action btn-tbl-edit" onclick="window.editService('${s.id}')" title="تعديل"><i class="fa-solid fa-pen-to-square"></i></button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  /* ===================================================
     4. Services Management (CRUD)
     =================================================== */
  function renderServicesTable() {
    travelData = getTravelData();
    const servicesTableBody = document.getElementById('servicesTableBody');
    const servicesCountInfo = document.getElementById('servicesCountInfo');
    if (!servicesTableBody) return;

    let filtered = travelData.services || [];

    // Filter by Category
    if (serviceFilterCategory !== 'all') {
      filtered = filtered.filter(s => s.category === serviceFilterCategory);
    }

    // Filter by Search Query
    if (serviceSearchQuery.trim() !== '') {
      const q = serviceSearchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(q) || 
        (s.subtitle && s.subtitle.toLowerCase().includes(q)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (servicesCountInfo) {
      servicesCountInfo.textContent = `عرض ${filtered.length} من إجمالي ${travelData.services.length} خدمة`;
    }

    if (filtered.length === 0) {
      servicesTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--admin-text-muted);">
            <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #64748b;"></i>
            لم يتم العثور على خدمات مطابقة للبحث أو التصنيف المحدد.
          </td>
        </tr>
      `;
      return;
    }

    const currencySymbol = travelData.company?.currencySymbol || '$';

    servicesTableBody.innerHTML = filtered.map(s => {
      const catObj = travelData.categories.find(c => c.id === s.category) || {};
      const isVideo = s.mediaType === 'video' || (s.image && (s.image.startsWith('data:video/') || s.image.endsWith('.mp4') || s.image.endsWith('.webm')));
      return `
        <tr>
          <td>
            <div class="table-thumb-wrap">
              ${isVideo ? `
                <div style="position:relative; width:50px; height:50px; border-radius:10px; overflow:hidden; background:#000; flex-shrink:0;">
                  <video src="${s.image}" style="width:100%; height:100%; object-fit:cover;" muted></video>
                  <i class="fa-solid fa-play" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:0.75rem;"></i>
                </div>
              ` : `
                <img src="${s.image}" alt="${s.title}" class="table-thumb-img" onerror="this.src='assets/media/basiclogo.png'" />
              `}
              <div>
                <div class="table-item-title">${s.title}</div>
                <div class="table-item-sub">${s.subtitle || ''}</div>
                ${s.gallery && s.gallery.length >= 1 ? `
                  <div style="margin-top:3px;">
                    <span style="display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; color:var(--admin-cyan); background:rgba(56,189,248,0.12); padding:1px 6px; border-radius:4px; font-weight:700;">
                      <i class="fa-solid fa-photo-film"></i> ${s.gallery.length} وسائط
                    </span>
                  </div>
                ` : ''}
              </div>
            </div>
          </td>
          <td>
            <span class="badge-pill-cat cat-badge-${s.category}">${catObj.name || s.category}</span>
          </td>
          <td>
            <strong class="table-price-tag">${currencySymbol}${s.price}</strong>
            ${s.oldPrice ? `<small style="text-decoration:line-through; color:#64748b; margin-right:4px;">${currencySymbol}${s.oldPrice}</small>` : ''}
            <div class="table-price-unit">/ ${s.priceUnit}</div>
            ${s.bookingTypes && s.bookingTypes.length > 1 ? `
              <div style="margin-top:4px;">
                <span class="badge-pill-cat" style="background:rgba(56,189,248,0.15); color:var(--admin-cyan); font-size:0.72rem; padding:2px 6px;">
                  <i class="fa-solid fa-layer-group"></i> ${s.bookingTypes.length} باقات حجز
                </span>
              </div>
            ` : ''}
          </td>
          <td>${s.duration || '-'}</td>
          <td>
            ${s.featured ? `<span style="color:#fbbf24; font-size:0.8rem; font-weight:700;"><i class="fa-solid fa-star"></i> مميزة</span>` : '<span style="color:#64748b; font-size:0.8rem;">عادية</span>'}
          </td>
          <td>
            <div class="table-actions-cell">
              <button class="btn-tbl-action btn-tbl-edit" onclick="window.editService('${s.id}')" title="تعديل الخدمة">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-tbl-action" onclick="window.duplicateService('${s.id}')" title="نسخ الخدمة" style="color:var(--admin-cyan);">
                <i class="fa-solid fa-clone"></i>
              </button>
              <button class="btn-tbl-action btn-tbl-del" onclick="window.confirmDeleteService('${s.id}')" title="حذف الخدمة">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Live Service Search and Filter
  const serviceSearchInput = document.getElementById('serviceSearchInput');
  const serviceCategoryFilter = document.getElementById('serviceCategoryFilter');

  if (serviceSearchInput) {
    serviceSearchInput.addEventListener('input', (e) => {
      serviceSearchQuery = e.target.value;
      renderServicesTable();
    });
  }

  if (serviceCategoryFilter) {
    serviceCategoryFilter.addEventListener('change', (e) => {
      serviceFilterCategory = e.target.value;
      renderServicesTable();
    });
  }

  // Helper: Check if media is video
  function isVideoMedia(url, mediaType) {
    if (mediaType === 'video') return true;
    if (!url) return false;
    return url.startsWith('data:video/') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') || url.endsWith('.ogg') || url.includes('video');
  }

  // ================= Multi-Media Gallery & Device File Processing =================
  const mediaDropzone = document.getElementById('mediaDropzone');
  const serviceMediaFileInput = document.getElementById('serviceMediaFileInput');
  const mediaGalleryGrid = document.getElementById('mediaGalleryGrid');
  const mediaGalleryCountBadge = document.getElementById('mediaGalleryCountBadge');
  const mediaUrlToggleBtn = document.getElementById('mediaUrlToggleBtn');
  const mediaUrlInputContainer = document.getElementById('mediaUrlInputContainer');
  const serviceFormDirectUrl = document.getElementById('serviceFormDirectUrl');
  const serviceFormDirectUrlType = document.getElementById('serviceFormDirectUrlType');
  const btnAddDirectUrlMedia = document.getElementById('btnAddDirectUrlMedia');
  const serviceFormImage = document.getElementById('serviceFormImage');
  const serviceFormMediaType = document.getElementById('serviceFormMediaType');

  let currentMediaGallery = [];
  let isProcessingMedia = false;

  function renderMediaGallery() {
    if (mediaGalleryCountBadge) {
      mediaGalleryCountBadge.textContent = `${currentMediaGallery.length} وسائط`;
    }

    // Ensure at least one item is cover if list is not empty
    if (currentMediaGallery.length > 0) {
      const hasCover = currentMediaGallery.some(m => m.isCover);
      if (!hasCover) {
        currentMediaGallery[0].isCover = true;
      }
    }

    const coverItem = currentMediaGallery.find(m => m.isCover) || currentMediaGallery[0];
    if (serviceFormImage) {
      // Avoid stuffing huge multi-MB base64 strings into DOM hidden input attribute
      serviceFormImage.value = coverItem
        ? (coverItem.url && coverItem.url.startsWith('data:') ? 'data-media-ready' : coverItem.url)
        : '';
    }
    if (serviceFormMediaType) {
      serviceFormMediaType.value = coverItem ? coverItem.type : 'image';
    }

    if (!mediaGalleryGrid) return;

    if (currentMediaGallery.length === 0) {
      mediaGalleryGrid.style.display = 'none';
      mediaGalleryGrid.innerHTML = '';
      return;
    }

    mediaGalleryGrid.style.display = 'grid';
    mediaGalleryGrid.innerHTML = currentMediaGallery.map((m, idx) => {
      const isVideo = m.type === 'video' || isVideoMedia(m.url);
      return `
        <div class="gallery-item-card ${m.isCover ? 'is-cover' : ''}" data-index="${idx}">
          ${isVideo ? `
            <video src="${m.url}" class="gallery-item-thumb" muted playsinline></video>
          ` : `
            <img src="${m.url}" alt="وسيط ${idx + 1}" class="gallery-item-thumb" onerror="this.src='assets/media/basiclogo.png'" />
          `}
          ${m.isCover ? `
            <span class="gallery-item-cover-badge">
              <i class="fa-solid fa-star"></i> الغلاف الرئيسي
            </span>
          ` : ''}
          <span class="gallery-item-type-badge">
            ${isVideo ? '<i class="fa-solid fa-video"></i> فيديو' : '<i class="fa-solid fa-image"></i> صورة'}
          </span>
          <div class="gallery-item-actions">
            <button type="button" class="gallery-item-btn gallery-item-btn-star" onclick="window.setCoverMedia(${idx})" title="${m.isCover ? 'هو الغلاف الرئيسي للرحلة' : 'تعيين كغلاف رئيسي'}">
              <i class="fa-solid fa-star"></i>
            </button>
            <button type="button" class="gallery-item-btn gallery-item-btn-delete" onclick="window.removeMediaItem(${idx})" title="حذف هذا الوسيط">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  window.setCoverMedia = function(idx) {
    if (idx < 0 || idx >= currentMediaGallery.length) return;
    currentMediaGallery.forEach((m, i) => {
      m.isCover = (i === idx);
    });
    renderMediaGallery();
    showToast('تم تعيين الغلاف الرئيسي بنجاح', 'info');
  };

  window.removeMediaItem = function(idx) {
    if (idx < 0 || idx >= currentMediaGallery.length) return;
    const removedWasCover = currentMediaGallery[idx].isCover;
    currentMediaGallery.splice(idx, 1);
    if (removedWasCover && currentMediaGallery.length > 0) {
      currentMediaGallery[0].isCover = true;
    }
    renderMediaGallery();
    showToast('تم حذف الوسيط من المعرض', 'info');
  };

  // Optimize Image via Canvas (Smart Downscale for fast & high-quality storage)
  function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1000;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let compressedDataUrl = canvas.toDataURL('image/webp', 0.78);
        if (!compressedDataUrl || !compressedDataUrl.startsWith('data:image/webp')) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        }
        callback(compressedDataUrl);
      };
      img.onerror = () => {
        callback(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Helper: Check if current cover is a default Unsplash placeholder
  function hasOnlyDefaultUnsplashCover() {
    if (currentMediaGallery.length === 0) return true;
    const cover = currentMediaGallery.find(m => m.isCover) || currentMediaGallery[0];
    return Boolean(cover && cover.url && cover.url.includes('images.unsplash.com'));
  }

  // Handle Multi-Media File Upload (Images & Videos)
  async function handleMediaFiles(filesList) {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList);

    const validFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (validFiles.length === 0) {
      showToast('يرجى اختيار ملفات صور (JPG, PNG, WebP) أو فيديوهات (MP4, WebM)', 'error');
      return;
    }

    isProcessingMedia = true;
    const submitBtn = serviceForm ? serviceForm.querySelector('button[type="submit"]') : null;
    const origSubmitHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جاري تجهيز الوسائط...</span>';
    }

    showToast(`جاري معالجة ${validFiles.length} من الوسائط المحددة...`, 'info');

    // If current gallery only has the default Unsplash placeholder, remove it when uploading real media
    if (currentMediaGallery.length === 1 && hasOnlyDefaultUnsplashCover()) {
      currentMediaGallery = [];
    }

    // Always promote the first newly uploaded media item in this batch to be the cover image
    // so the main website card updates immediately with the new image
    let shouldPromoteFirstUploadToCover = true;

    let processedCount = 0;
    for (const file of validFiles) {
      const isVideo = file.type.startsWith('video/');
      if (isVideo) {
        if (file.size > 50 * 1024 * 1024) {
          showToast(`الفيديو ${file.name} حجمه كبير جداً (أكثر من 50 ميجا). تم تجاوزه.`, 'error');
          continue;
        }
        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const makeCover = currentMediaGallery.length === 0 || shouldPromoteFirstUploadToCover;
            if (makeCover) {
              currentMediaGallery.forEach(m => { m.isCover = false; });
              shouldPromoteFirstUploadToCover = false;
            }
            currentMediaGallery.push({
              url: e.target.result,
              type: 'video',
              isCover: makeCover
            });
            processedCount++;
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        });
      } else {
        await new Promise((resolve) => {
          compressImage(file, (dataUrl) => {
            const makeCover = currentMediaGallery.length === 0 || shouldPromoteFirstUploadToCover;
            if (makeCover) {
              currentMediaGallery.forEach(m => { m.isCover = false; });
              shouldPromoteFirstUploadToCover = false;
            }
            currentMediaGallery.push({
              url: dataUrl,
              type: 'image',
              isCover: makeCover
            });
            processedCount++;
            resolve();
          });
        });
      }
    }

    isProcessingMedia = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origSubmitHtml;
    }

    renderMediaGallery();
    if (processedCount > 0) {
      showToast(`تمت إضافة ${processedCount} من الوسائط وتعيينها كغلاف رئيسي للجولة`, 'success');
    }
  }

  if (mediaDropzone && serviceMediaFileInput) {
    mediaDropzone.addEventListener('click', () => {
      serviceMediaFileInput.click();
    });

    serviceMediaFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleMediaFiles(e.target.files);
      }
      serviceMediaFileInput.value = '';
    });

    mediaDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      mediaDropzone.classList.add('dragover');
    });

    mediaDropzone.addEventListener('dragleave', () => {
      mediaDropzone.classList.remove('dragover');
    });

    mediaDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      mediaDropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleMediaFiles(e.dataTransfer.files);
      }
    });
  }

  if (mediaUrlToggleBtn && mediaUrlInputContainer) {
    mediaUrlToggleBtn.addEventListener('click', () => {
      const isHidden = mediaUrlInputContainer.style.display === 'none';
      mediaUrlInputContainer.style.display = isHidden ? 'block' : 'none';
      if (isHidden && serviceFormDirectUrl) {
        serviceFormDirectUrl.focus();
      }
    });
  }

  if (btnAddDirectUrlMedia && serviceFormDirectUrl) {
    btnAddDirectUrlMedia.addEventListener('click', () => {
      const val = serviceFormDirectUrl.value.trim();
      if (!val) {
        showToast('يرجى إدخال رابط الوسيط أولاً', 'error');
        return;
      }
      if (currentMediaGallery.length === 1 && hasOnlyDefaultUnsplashCover()) {
        currentMediaGallery = [];
      }
      const chosenType = serviceFormDirectUrlType?.value || (isVideoMedia(val) ? 'video' : 'image');
      currentMediaGallery.forEach(m => { m.isCover = false; });
      currentMediaGallery.push({
        url: val,
        type: chosenType,
        isCover: true
      });
      serviceFormDirectUrl.value = '';
      renderMediaGallery();
      showToast('تمت إضافة الرابط وتعيينه كغلاف رئيسي للجولة بنجاح', 'success');
    });
  }

  // Add / Edit Service Modal logic
  const btnAddNewService = document.getElementById('btnAddNewService');
  if (btnAddNewService) {
    btnAddNewService.addEventListener('click', () => {
      openServiceFormModal(null);
    });
  }

  // Create dynamic booking type row for service form
  function createBookingTypeRow(type = {}) {
    const rowEl = document.createElement('div');
    rowEl.className = 'booking-type-row-item';
    rowEl.innerHTML = `
      <div class="booking-type-row-grid">
        <div class="admin-form-group" style="margin-bottom:0;">
          <label style="font-size:0.75rem; color:#94a3b8;">اسم نوع الحجز / الباقة:</label>
          <input type="text" class="admin-input btype-name" placeholder="مثال: شامل تذكرة التلفريك والغداء" value="${type.name || ''}" required />
        </div>
        <div class="admin-form-group" style="margin-bottom:0;">
          <label style="font-size:0.75rem; color:#94a3b8;">السعر ($):</label>
          <input type="number" step="0.01" class="admin-input btype-price" placeholder="30" value="${type.price !== undefined ? type.price : ''}" required />
        </div>
        <div class="admin-form-group" style="margin-bottom:0;">
          <label style="font-size:0.75rem; color:#94a3b8;">السعر القديم ($):</label>
          <input type="number" step="0.01" class="admin-input btype-oldprice" placeholder="40" value="${type.oldPrice !== null && type.oldPrice !== undefined ? type.oldPrice : ''}" />
        </div>
        <div class="admin-form-group" style="margin-bottom:0;">
          <label style="font-size:0.75rem; color:#94a3b8;">وحدة السعر:</label>
          <input type="text" class="admin-input btype-unit" placeholder="للشخص" value="${type.priceUnit || 'للشخص'}" />
        </div>
        <button type="button" class="btn-remove-type-row" title="حذف هذا الخيار">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="admin-form-group" style="margin-top:8px; margin-bottom:0;">
        <label style="font-size:0.75rem; color:#94a3b8;">وصف ومميزات هذا الخيار (اختياري):</label>
        <input type="text" class="admin-input btype-desc" placeholder="مثال: شامل تذاكر التلفريك والعبّارة ووجبة الغداء" value="${type.desc || ''}" />
      </div>
    `;

    rowEl.querySelector('.btn-remove-type-row')?.addEventListener('click', () => {
      rowEl.remove();
    });

    return rowEl;
  }

  // Button to add booking type row
  const btnAddBookingTypeRow = document.getElementById('btnAddBookingTypeRow');
  if (btnAddBookingTypeRow) {
    btnAddBookingTypeRow.addEventListener('click', () => {
      const container = document.getElementById('bookingTypesRowsContainer');
      if (container) {
        const defaultUnit = document.getElementById('serviceFormPriceUnit')?.value.trim() || 'للشخص';
        container.appendChild(createBookingTypeRow({ priceUnit: defaultUnit }));
      }
    });
  }

  function openServiceFormModal(serviceId = null) {
    editingServiceId = serviceId;
    travelData = getTravelData();
    const bookingTypesContainer = document.getElementById('bookingTypesRowsContainer');
    if (bookingTypesContainer) bookingTypesContainer.innerHTML = '';

    if (serviceId) {
      // Edit mode
      const s = travelData.services.find(item => item.id === serviceId);
      if (!s) return;

      if (serviceModalTitle) serviceModalTitle.textContent = 'تعديل تفاصيل الخدمة / الجولة';
      document.getElementById('serviceFormId').value = s.id;
      document.getElementById('serviceFormCategory').value = s.category || 'group-tours';
      document.getElementById('serviceFormTitle').value = s.title || '';
      document.getElementById('serviceFormSubtitle').value = s.subtitle || '';
      document.getElementById('serviceFormPrice').value = s.price || 0;
      document.getElementById('serviceFormOldPrice').value = s.oldPrice || '';
      document.getElementById('serviceFormPriceUnit').value = s.priceUnit || 'للشخص';
      document.getElementById('serviceFormDuration').value = s.duration || '';
      document.getElementById('serviceFormFeatured').checked = !!s.featured;
      document.getElementById('serviceFormTags').value = (s.tags || []).join(', ');
      document.getElementById('serviceFormHighlights').value = (s.highlights || []).join('\n');
      document.getElementById('serviceFormIncludes').value = (s.includes || []).join('\n');
      document.getElementById('serviceFormExcludes').value = (s.excludes || []).join('\n');

      // Populate booking types rows
      if (bookingTypesContainer && s.bookingTypes && s.bookingTypes.length > 0) {
        s.bookingTypes.forEach(bType => {
          bookingTypesContainer.appendChild(createBookingTypeRow(bType));
        });
      }

      if (s.gallery && Array.isArray(s.gallery) && s.gallery.length > 0) {
        currentMediaGallery = s.gallery.map((item, idx) => {
          if (typeof item === 'string') {
            return { url: item, type: isVideoMedia(item) ? 'video' : 'image', isCover: idx === 0 };
          }
          return {
            url: item.url || '',
            type: item.type || (isVideoMedia(item.url) ? 'video' : 'image'),
            isCover: typeof item.isCover === 'boolean' ? item.isCover : (idx === 0)
          };
        });
      } else if (s.image) {
        const isVideo = s.mediaType === 'video' || isVideoMedia(s.image);
        currentMediaGallery = [{ url: s.image, type: isVideo ? 'video' : 'image', isCover: true }];
      } else {
        currentMediaGallery = [];
      }
      renderMediaGallery();
      if (serviceFormDirectUrl) serviceFormDirectUrl.value = '';
    } else {
      // Create new mode
      if (serviceModalTitle) serviceModalTitle.textContent = 'إضافة خدمة سياحية أو جولة جديدة';
      if (serviceForm) serviceForm.reset();
      document.getElementById('serviceFormId').value = `service-${Date.now()}`;
      document.getElementById('serviceFormPriceUnit').value = 'للشخص';
      const defaultImg = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80';
      currentMediaGallery = [{ url: defaultImg, type: 'image', isCover: true }];
      renderMediaGallery();
      if (serviceFormDirectUrl) serviceFormDirectUrl.value = '';
    }

    if (mediaUrlInputContainer) mediaUrlInputContainer.style.display = 'none';
    if (serviceModal) serviceModal.classList.add('open');
  }

  function closeServiceFormModal() {
    if (serviceModal) serviceModal.classList.remove('open');
    editingServiceId = null;
  }

  if (serviceModalClose) serviceModalClose.addEventListener('click', closeServiceFormModal);
  if (serviceModalCancel) serviceModalCancel.addEventListener('click', closeServiceFormModal);

  if (serviceForm) {
    serviceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isProcessingMedia) {
        showToast('يرجى الانتظار لحظات حتى تكتمل معالجة الصور/الفيديوهات المرفوعة', 'info');
        return;
      }

      // If user typed a direct URL and forgot to click "+ إضافة", auto-include it
      if (serviceFormDirectUrl && serviceFormDirectUrl.value.trim() !== '') {
        if (currentMediaGallery.length === 1 && hasOnlyDefaultUnsplashCover()) {
          currentMediaGallery = [];
        }
        const pendingUrl = serviceFormDirectUrl.value.trim();
        const pendingType = serviceFormDirectUrlType?.value || (isVideoMedia(pendingUrl) ? 'video' : 'image');
        currentMediaGallery.forEach(m => { m.isCover = false; });
        currentMediaGallery.push({
          url: pendingUrl,
          type: pendingType,
          isCover: true
        });
        serviceFormDirectUrl.value = '';
      }

      travelData = getTravelData();

      // Place the cover item at index 0 so both card thumbnail and modal gallery start with the cover
      if (currentMediaGallery.length > 0) {
        let coverIdx = currentMediaGallery.findIndex(m => m.isCover);
        if (coverIdx === -1) {
          coverIdx = 0;
          currentMediaGallery[0].isCover = true;
        }
        if (coverIdx > 0) {
          const [coverElem] = currentMediaGallery.splice(coverIdx, 1);
          currentMediaGallery.unshift(coverElem);
        }
      }

      const coverItem = currentMediaGallery.find(m => m.isCover) || currentMediaGallery[0];
      const fallbackImg = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80';
      const mediaUrl = coverItem ? coverItem.url : fallbackImg;
      const mediaType = coverItem ? coverItem.type : (document.getElementById('serviceFormMediaType').value || 'image');

      // Collect multiple booking types if defined
      const bookingTypes = [];
      const typeRows = document.querySelectorAll('.booking-type-row-item');
      typeRows.forEach((row, idx) => {
        const name = row.querySelector('.btype-name')?.value.trim();
        const priceVal = parseFloat(row.querySelector('.btype-price')?.value);
        const oldPriceVal = row.querySelector('.btype-oldprice')?.value;
        const oldPrice = oldPriceVal ? parseFloat(oldPriceVal) : null;
        const priceUnit = row.querySelector('.btype-unit')?.value.trim() || 'للشخص';
        const desc = row.querySelector('.btype-desc')?.value.trim() || '';

        if (name && !isNaN(priceVal)) {
          bookingTypes.push({
            id: `type-${idx + 1}-${Date.now()}`,
            name,
            price: priceVal,
            oldPrice,
            priceUnit,
            desc
          });
        }
      });

      const clonedGallery = currentMediaGallery.length > 0
        ? JSON.parse(JSON.stringify(currentMediaGallery))
        : [{ url: mediaUrl, type: mediaType, isCover: true }];

      const serviceObj = {
        id: document.getElementById('serviceFormId').value.trim() || `service-${Date.now()}`,
        category: document.getElementById('serviceFormCategory').value,
        title: document.getElementById('serviceFormTitle').value.trim(),
        subtitle: document.getElementById('serviceFormSubtitle').value.trim(),
        price: parseFloat(document.getElementById('serviceFormPrice').value) || 0,
        oldPrice: document.getElementById('serviceFormOldPrice').value ? parseFloat(document.getElementById('serviceFormOldPrice').value) : null,
        priceUnit: document.getElementById('serviceFormPriceUnit').value.trim() || 'للشخص',
        duration: document.getElementById('serviceFormDuration').value.trim(),
        image: mediaUrl,
        mediaType: mediaType,
        gallery: clonedGallery,
        featured: document.getElementById('serviceFormFeatured').checked,
        tags: document.getElementById('serviceFormTags').value.split(',').map(t => t.trim()).filter(Boolean),
        highlights: document.getElementById('serviceFormHighlights').value.split('\n').map(h => h.trim()).filter(Boolean),
        includes: document.getElementById('serviceFormIncludes').value.split('\n').map(i => i.trim()).filter(Boolean),
        excludes: document.getElementById('serviceFormExcludes').value.split('\n').map(ex => ex.trim()).filter(Boolean),
      };

      if (bookingTypes.length > 0) {
        serviceObj.bookingTypes = bookingTypes;
      }

      if (!serviceObj.title) {
        showToast('يرجى كتابة عنوان الخدمة', 'error');
        return;
      }

      if (editingServiceId) {
        // Update existing
        const index = travelData.services.findIndex(s => s.id === editingServiceId || s.id === serviceObj.id);
        if (index !== -1) {
          travelData.services[index] = serviceObj;
        } else {
          travelData.services.unshift(serviceObj);
        }
      } else {
        // Prepend new service
        travelData.services.unshift(serviceObj);
      }

      const savedOk = saveTravelData(travelData);
      if (savedOk) {
        showToast(
          editingServiceId
            ? `تم حفظ تعديلات "${serviceObj.title}" (${clonedGallery.length} وسائط) بنجاح`
            : 'تمت إضافة الخدمة الجديدة بنجاح',
          'success'
        );
      } else {
        showToast('حدث خطأ أثناء حفظ البيانات', 'error');
      }

      closeServiceFormModal();
      renderServicesTable();
      renderDashboardStats();
    });
  }

  // Global window functions for table button actions
  window.editService = function(id) {
    openServiceFormModal(id);
  };

  window.duplicateService = function(id) {
    travelData = getTravelData();
    const orig = travelData.services.find(s => s.id === id);
    if (!orig) return;

    const clone = JSON.parse(JSON.stringify(orig));
    clone.id = `${orig.id}-copy-${Date.now()}`;
    clone.title = `${orig.title} (نسخة)`;
    travelData.services.unshift(clone);

    saveTravelData(travelData);
    showToast('تم نسخ الخدمة بنجاح', 'success');
    renderServicesTable();
    renderDashboardStats();
  };

  window.confirmDeleteService = function(id) {
    travelData = getTravelData();
    const target = travelData.services.find(s => s.id === id);
    if (!target) return;

    deleteActionTarget = { type: 'service', id: id };
    if (confirmModalTitle) confirmModalTitle.textContent = 'تأكيد حذف الخدمة';
    if (confirmModalMessage) confirmModalMessage.textContent = `هل أنت متأكد من رغبتك في حذف خدمة "${target.title}"؟ لا يمكن التراجع عن هذا الإجراء.`;
    if (confirmModal) confirmModal.classList.add('open');
  };

  /* ===================================================
     5. Categories List
     =================================================== */
  function renderCategoriesList() {
    travelData = getTravelData();
    const categoriesContainer = document.getElementById('categoriesGridContainer');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = (travelData.categories || []).map(cat => {
      const count = cat.id === 'all' 
        ? travelData.services.length 
        : travelData.services.filter(s => s.category === cat.id).length;

      return `
        <div class="action-card" style="cursor: default;">
          <div class="action-card-header">
            <div class="action-card-icon">
              <i class="fa-solid ${cat.icon}"></i>
            </div>
            <div>
              <div class="action-card-title">${cat.name}</div>
              <span class="sidebar-brand-badge">${count} خدمة مرتبطة</span>
            </div>
          </div>
          <p class="action-card-desc">${cat.desc || 'القسم الرئيسي لجميع الجولات والخدمات'}</p>
        </div>
      `;
    }).join('');
  }

  /* ===================================================
     6. FAQs Management (CRUD)
     =================================================== */
  function renderFaqsList() {
    travelData = getTravelData();
    const faqsContainer = document.getElementById('faqsManagerList');
    if (!faqsContainer) return;

    const faqs = travelData.faqs || [];

    if (faqs.length === 0) {
      faqsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--admin-text-muted);">
          <i class="fa-solid fa-circle-question" style="font-size: 2rem; margin-bottom: 10px; display: block; color: #64748b;"></i>
          لا توجد أسئلة شائعة مضافة حالياً.
        </div>
      `;
      return;
    }

    faqsContainer.innerHTML = faqs.map(faq => `
      <div class="faq-admin-card" data-faq-id="${faq.id || faq.q}">
        <div style="flex: 1;">
          <div class="faq-admin-question">
            <i class="fa-solid fa-circle-question" style="color: var(--admin-cyan); margin-left: 6px;"></i>
            ${faq.q}
          </div>
          <div class="faq-admin-answer">${faq.a}</div>
        </div>
        <div class="table-actions-cell" style="align-self: center;">
          <button class="btn-tbl-action btn-tbl-edit" onclick="window.editFaq('${faq.id || faq.q}')" title="تعديل السؤال">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-tbl-action btn-tbl-del" onclick="window.confirmDeleteFaq('${faq.id || faq.q}')" title="حذف السؤال">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  const btnAddNewFaq = document.getElementById('btnAddNewFaq');
  if (btnAddNewFaq) {
    btnAddNewFaq.addEventListener('click', () => {
      openFaqModal(null);
    });
  }

  function openFaqModal(faqIdentifier = null) {
    editingFaqId = faqIdentifier;
    travelData = getTravelData();

    if (faqIdentifier) {
      const target = (travelData.faqs || []).find(f => (f.id === faqIdentifier || f.q === faqIdentifier));
      if (!target) return;
      if (faqModalTitle) faqModalTitle.textContent = 'تعديل السؤال والإجابة';
      document.getElementById('faqQuestionInput').value = target.q || '';
      document.getElementById('faqAnswerInput').value = target.a || '';
    } else {
      if (faqModalTitle) faqModalTitle.textContent = 'إضافة سؤال وإجابة شائعة جديدة';
      if (faqForm) faqForm.reset();
    }

    if (faqModal) faqModal.classList.add('open');
  }

  function closeFaqModal() {
    if (faqModal) faqModal.classList.remove('open');
    editingFaqId = null;
  }

  if (faqModalClose) faqModalClose.addEventListener('click', closeFaqModal);
  if (faqModalCancel) faqModalCancel.addEventListener('click', closeFaqModal);

  if (faqForm) {
    faqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      travelData = getTravelData();
      if (!travelData.faqs) travelData.faqs = [];

      const q = document.getElementById('faqQuestionInput').value.trim();
      const a = document.getElementById('faqAnswerInput').value.trim();

      if (!q || !a) {
        showToast('يرجى ملء السؤال والإجابة', 'error');
        return;
      }

      if (editingFaqId) {
        const index = travelData.faqs.findIndex(f => (f.id === editingFaqId || f.q === editingFaqId));
        if (index !== -1) {
          travelData.faqs[index] = {
            id: travelData.faqs[index].id || `faq-${Date.now()}`,
            q: q,
            a: a
          };
          showToast('تم تحديث السؤال بنجاح', 'success');
        }
      } else {
        travelData.faqs.push({
          id: `faq-${Date.now()}`,
          q: q,
          a: a
        });
        showToast('تمت إضافة السؤال بنجاح', 'success');
      }

      saveTravelData(travelData);
      closeFaqModal();
      renderFaqsList();
      renderDashboardStats();
    });
  }

  window.editFaq = function(identifier) {
    openFaqModal(identifier);
  };

  window.confirmDeleteFaq = function(identifier) {
    deleteActionTarget = { type: 'faq', id: identifier };
    if (confirmModalTitle) confirmModalTitle.textContent = 'تأكيد حذف السؤال';
    if (confirmModalMessage) confirmModalMessage.textContent = `هل أنت متأكد من حذف هذا السؤال من قائمة الأسئلة الشائعة؟`;
    if (confirmModal) confirmModal.classList.add('open');
  };

  /* ===================================================
     7. Confirmation Modal Actions (Service / FAQ / Reset)
     =================================================== */
  function closeConfirmModal() {
    if (confirmModal) confirmModal.classList.remove('open');
    deleteActionTarget = null;
  }

  if (confirmModalClose) confirmModalClose.addEventListener('click', closeConfirmModal);
  if (confirmModalCancel) confirmModalCancel.addEventListener('click', closeConfirmModal);

  if (confirmModalBtn) {
    confirmModalBtn.addEventListener('click', () => {
      if (!deleteActionTarget) return;
      travelData = getTravelData();

      if (deleteActionTarget.type === 'service') {
        travelData.services = travelData.services.filter(s => s.id !== deleteActionTarget.id);
        saveTravelData(travelData);
        showToast('تم حذف الخدمة بنجاح', 'success');
        renderServicesTable();
        renderDashboardStats();
      } else if (deleteActionTarget.type === 'faq') {
        travelData.faqs = (travelData.faqs || []).filter(f => (f.id !== deleteActionTarget.id && f.q !== deleteActionTarget.id));
        saveTravelData(travelData);
        showToast('تم حذف السؤال بنجاح', 'success');
        renderFaqsList();
        renderDashboardStats();
      } else if (deleteActionTarget.type === 'reset') {
        resetTravelData();
        travelData = getTravelData();
        showToast('تمت استعادة البيانات المصنعية الافتراضية', 'success');
        renderDashboardStats();
        renderServicesTable();
        renderFaqsList();
        loadSettingsForm();
      }

      closeConfirmModal();
    });
  }

  /* ===================================================
     8. Settings & Company Information Management
     =================================================== */
  function loadSettingsForm() {
    travelData = getTravelData();
    const comp = travelData.company || {};

    const companyNameInput = document.getElementById('companyNameInput');
    const companyArabicNameInput = document.getElementById('companyArabicNameInput');
    const companySloganInput = document.getElementById('companySloganInput');
    const companyWhatsappInput = document.getElementById('companyWhatsappInput');
    const companyPhoneInput = document.getElementById('companyPhoneInput');
    const companyEmailInput = document.getElementById('companyEmailInput');
    const companyAddressInput = document.getElementById('companyAddressInput');
    const companyCurrencySymbol = document.getElementById('companyCurrencySymbol');
    const companyWebhookUrl = document.getElementById('companyWebhookUrl');

    if (companyNameInput) companyNameInput.value = comp.name || '';
    if (companyArabicNameInput) companyArabicNameInput.value = comp.arabicName || '';
    if (companySloganInput) companySloganInput.value = comp.slogan || '';
    if (companyWhatsappInput) companyWhatsappInput.value = comp.whatsapp || '';
    if (companyPhoneInput) companyPhoneInput.value = comp.phone || '';
    if (companyEmailInput) companyEmailInput.value = comp.email || '';
    if (companyAddressInput) companyAddressInput.value = comp.address || '';
    if (companyCurrencySymbol) companyCurrencySymbol.value = comp.currencySymbol || '$';
    if (companyWebhookUrl) companyWebhookUrl.value = comp.webhookUrl || comp.googleSheetsUrl || '';
  }

  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      travelData = getTravelData();
      const webhookUrlVal = document.getElementById('companyWebhookUrl')?.value.trim() || '';

      travelData.company = {
        ...travelData.company,
        name: document.getElementById('companyNameInput').value.trim() || 'Trend Travel',
        arabicName: document.getElementById('companyArabicNameInput').value.trim() || 'تريند ترافيل',
        slogan: document.getElementById('companySloganInput').value.trim() || '',
        whatsapp: document.getElementById('companyWhatsappInput').value.replace(/[^0-9]/g, '') || '905550000000',
        phone: document.getElementById('companyPhoneInput').value.trim() || '+905550000000',
        email: document.getElementById('companyEmailInput').value.trim() || 'info@trendtravel.com',
        address: document.getElementById('companyAddressInput').value.trim() || 'إسطنبول - تركيا',
        currency: 'USD',
        currencySymbol: document.getElementById('companyCurrencySymbol').value.trim() || '$',
        webhookUrl: webhookUrlVal,
        googleSheetsUrl: webhookUrlVal
      };

      saveTravelData(travelData);
      showToast('تم حفظ إعدادات الموقع ومعلومات الـ Webhook بنجاح', 'success');
      renderDashboardStats();
    });
  }

  // Test Webhook URL Trigger
  const btnTestWebhook = document.getElementById('btnTestWebhook');
  if (btnTestWebhook) {
    btnTestWebhook.addEventListener('click', async () => {
      const url = document.getElementById('companyWebhookUrl')?.value.trim();
      if (!url) {
        showToast('يرجى إدخال رابط Webhook أولاً لفحصه', 'error');
        document.getElementById('companyWebhookUrl')?.focus();
        return;
      }

      const testPayload = {
        bookingId: "TEST-BK-" + Math.floor(100000 + Math.random() * 900000),
        serviceTitle: "رحلة صبنجة ومعشوقية (فحص تجريبي)",
        serviceCategory: "group-tours",
        price: "$25 / للشخص",
        fullName: "Test User (مستخدم تجريبي)",
        countryCode: "+962",
        phone: "790000000",
        fullPhone: "+962 790000000",
        hotel: "Hilton Istanbul Bosphorus",
        tripDate: "2026-09-01",
        personsCount: "2",
        notes: "طلب تجريبي للتأكد من اتصال n8n / Webhook بنجاح",
        bookingStatus: "Test",
        createdAt: new Date().toISOString()
      };

      const origHtml = btnTestWebhook.innerHTML;
      btnTestWebhook.disabled = true;
      btnTestWebhook.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جاري الفحص...</span>';

      try {
        try {
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
          });
        } catch (e) {
          await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(testPayload)
          });
        }
        showToast('تم إرسال حجز تجريبي إلى الـ Webhook بنجاح! تفقد n8n الآن 🚀', 'success');
      } catch (err) {
        console.warn('Webhook test error:', err);
        showToast('تم إرسال الطلب، تفقد قسم Executions في n8n للتأكد من وصوله', 'info');
      } finally {
        btnTestWebhook.disabled = false;
        btnTestWebhook.innerHTML = origHtml;
      }
    });
  }

  // Change Admin Password Form (Saves SHA-256 hash into both localStorage & travelData.company for export)
  const passwordChangeForm = document.getElementById('passwordChangeForm');
  if (passwordChangeForm) {
    passwordChangeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPass = document.getElementById('currentPasswordInput').value;
      const newPass = document.getElementById('newPasswordInput').value.trim();
      const confirmPass = document.getElementById('confirmPasswordInput').value.trim();

      const isCurrentValid = await verifyAdminPassword(currentPass);
      if (!isCurrentValid) {
        showToast('كلمة المرور الحالية غير صحيحة', 'error');
        return;
      }

      if (newPass.length < 6) {
        showToast('كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف أو أرقام لضمان الحماية', 'error');
        return;
      }

      if (newPass !== confirmPass) {
        showToast('تأكيد كلمة المرور غير متطابق', 'error');
        return;
      }

      const newHash = await hashPasswordSHA256(newPass);
      localStorage.setItem(PASSWORD_HASH_KEY, newHash);
      localStorage.removeItem(PASSWORD_KEY);

      travelData = getTravelData();
      if (!travelData.company) travelData.company = {};
      travelData.company.adminPasswordHash = newHash;
      saveTravelData(travelData);

      showToast('تم تشفير وتحديث كلمة مرور لوحة التحكم بنجاح! تذكر تنزيل data.js لتطبيقها عند النشر', 'success');
      passwordChangeForm.reset();
    });
  }

  /* ===================================================
     9. Backup, Export & Restore
     =================================================== */
  async function exportDataJsFile() {
    if (window.travelDataReadyPromise) {
      try { await window.travelDataReadyPromise; } catch (e) {}
    }
    travelData = getTravelData();
    const timestamp = Date.now();
    const fileContent = `// data.js - قاعدة بيانات الخدمات لشركة Trend Travel
// تم التوليد وتحديث البيانات من لوحة التحكم: ${new Date().toLocaleString('ar-EG')}

const DEFAULT_TRAVEL_DATA = ${JSON.stringify(travelData, null, 2)};

// Storage Key & IndexedDB Configuration (يتحدث تلقائياً مع كل تصدير لتحديث الكاش لجميع الزوار فوراً)
const STORAGE_KEY = 'trend_travel_data_v_${timestamp}';
const IDB_NAME = 'TrendTravelDB';
const IDB_VERSION = 1;
const IDB_STORE = 'travel_data_store';

window.__TREND_TRAVEL_CACHE__ = window.__TREND_TRAVEL_CACHE__ || null;

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
`;

    const blob = new Blob([fileContent], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تنزيل ملف data.js بنجاح! ضعه في مجلد assets/js ثم ارفع الموقع', 'success');
  }

  const btnDownloadDataJsHeader = document.getElementById('btnDownloadDataJsHeader');
  if (btnDownloadDataJsHeader) {
    btnDownloadDataJsHeader.addEventListener('click', exportDataJsFile);
  }

  const btnDownloadDataJsBackup = document.getElementById('btnDownloadDataJsBackup');
  if (btnDownloadDataJsBackup) {
    btnDownloadDataJsBackup.addEventListener('click', exportDataJsFile);
  }

  const btnExportJson = document.getElementById('btnExportJson');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      travelData = getTravelData();
      const jsonStr = JSON.stringify(travelData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `trend-travel-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('تم تنزيل النسخة الاحتياطية بنجاح', 'success');
    });
  }

  const importFileInput = document.getElementById('importFileInput');
  if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (importedData && importedData.services && importedData.company) {
            saveTravelData(importedData);
            travelData = importedData;
            showToast('تم استيراد البيانات وتطبيقها بنجاح!', 'success');
            renderDashboardStats();
            renderServicesTable();
            renderFaqsList();
            loadSettingsForm();
          } else {
            showToast('الملف غير صالح أو لا يحتوي على بنية البيانات الصحيحة', 'error');
          }
        } catch (err) {
          showToast('حدث خطأ أثناء قراءة ملف JSON', 'error');
        }
      };
      reader.readAsText(file);
      importFileInput.value = '';
    });
  }

  const btnResetToFactory = document.getElementById('btnResetToFactory');
  if (btnResetToFactory) {
    btnResetToFactory.addEventListener('click', () => {
      deleteActionTarget = { type: 'reset' };
      if (confirmModalTitle) confirmModalTitle.textContent = 'استعادة البيانات الافتراضية للموقع';
      if (confirmModalMessage) confirmModalMessage.textContent = 'تحذير: سيتم مسح كافة التعديلات والخدمات المضافة واسترجاع بيانات المصنع الأصلية. هل أنت متأكد؟';
      if (confirmModal) confirmModal.classList.add('open');
    });
  }

  /* ===================================================
     10. Bookings Management Table
     =================================================== */
  function renderBookingsTable() {
    const tableBody = document.getElementById('adminBookingsTableBody');
    const badge = document.getElementById('navBookingsBadge');
    const bookings = JSON.parse(localStorage.getItem('trend_bookings') || '[]');

    if (badge) badge.textContent = bookings.length;

    if (!tableBody) return;

    if (bookings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:30px; color:var(--admin-text-muted);">
            <i class="fa-solid fa-inbox" style="font-size:2rem; margin-bottom:8px; display:block; opacity:0.5;"></i>
            <span>لا توجد حجوزات واردة حتى الآن. الحجوزات المسجلة من الموقع ستظهر هنا تلقائياً.</span>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = bookings.map(b => {
      const cleanPhone = (b.fullPhone || b.phone || '').replace(/[^0-9]/g, '');
      const whatsappLink = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(`مرحباً ${b.fullName || ''}، نتواصل معك من Trend Travel بخصوص طلب حجزك رقم ${b.bookingId || ''}`)}` : '#';

      return `
        <tr>
          <td>
            <span style="font-family:monospace; font-weight:800; color:#38bdf8; background:rgba(56,189,248,0.1); padding:3px 8px; border-radius:4px;">
              ${b.bookingId || 'BK-N/A'}
            </span>
          </td>
          <td>
            <strong style="color:#fff;">${b.fullName || 'غير محدد'}</strong>
          </td>
          <td dir="ltr" style="text-align:right;">
            <a href="${whatsappLink}" target="_blank" style="color:#22c55e; font-weight:700; display:inline-flex; align-items:center; gap:5px;">
              <i class="fa-brands fa-whatsapp"></i> ${b.fullPhone || b.phone || 'N/A'}
            </a>
          </td>
          <td>
            <div style="font-weight:700; color:#fff;">${b.serviceTitle || ''}</div>
            ${b.bookingType ? `<div style="font-size:0.75rem; color:#38bdf8; margin-top:2px;"><i class="fa-solid fa-layer-group"></i> ${b.bookingType}</div>` : ''}
            <div style="font-size:0.78rem; color:#f59e0b;">${b.price || ''}</div>
          </td>
          <td>
            <span>${b.hotel || 'غير محدد'}</span>
          </td>
          <td>
            <div>${b.tripDate || ''}</div>
            <small style="color:var(--admin-text-muted);">${b.personsCount ? `${b.personsCount} أشخاص` : ''}</small>
          </td>
          <td style="max-width:180px; font-size:0.8rem; color:var(--admin-text-muted);">
            ${b.notes || 'لا يوجد'}
          </td>
          <td>
            <a href="${whatsappLink}" target="_blank" class="btn-primary-admin" style="padding:6px 12px; font-size:0.8rem; background:#22c55e; border-color:#22c55e;">
              <i class="fa-brands fa-whatsapp"></i>
              <span>مراسلة</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }

  const btnClearBookings = document.getElementById('btnClearBookings');
  if (btnClearBookings) {
    btnClearBookings.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من رغبتك في مسح سجل الحجوزات المحلي؟')) {
        localStorage.removeItem('trend_bookings');
        renderBookingsTable();
        showToast('تم مسح سجل الحجوزات بنجاح', 'info');
      }
    });
  }

  /* ===================================================
     11. Toast Notification Helper
     =================================================== */
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }

  /* ===================================================
     12. Initialize Admin Dashboard
     =================================================== */
  function initDashboard() {
    renderDashboardStats();
    renderServicesTable();
    renderCategoriesList();
    renderFaqsList();
    renderBookingsTable();
    loadSettingsForm();
  }

  // Re-render dashboard as soon as IndexedDB finishes hydrating full media gallery
  if (window.travelDataReadyPromise) {
    window.travelDataReadyPromise.then(() => {
      travelData = getTravelData();
      if (isAuthenticatedSession()) {
        renderDashboardStats();
        renderServicesTable();
        renderCategoriesList();
        renderFaqsList();
        loadSettingsForm();
      }
    });
  }

  window.addEventListener('travelDataReady', () => {
    travelData = getTravelData();
    if (isAuthenticatedSession() && (!serviceModal || !serviceModal.classList.contains('open'))) {
      renderDashboardStats();
      renderServicesTable();
      renderCategoriesList();
      renderFaqsList();
    }
  });

  // Check login state on startup
  checkAuth();
});
