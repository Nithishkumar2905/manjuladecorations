/* ======================================
   THE DIGITAL CONCIERGE — Interactions
   ====================================== */

document.addEventListener('DOMContentLoaded', () => {

  const splashScreen  = document.getElementById('splashScreen');
  const loginScreen   = document.getElementById('loginScreen');
  const exploreScreen = document.getElementById('exploreScreen');

  // ---------- Screen Transition Helper ----------
  function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });
    screen.classList.remove('hidden');
    screen.classList.add('active');
  }

  // ---------- Splash → Login (after progress bar animation) ----------
  const progressBar = document.querySelector('.splash-progress-bar');
  if (progressBar) {
    progressBar.addEventListener('animationend', () => {
      setTimeout(() => showScreen(loginScreen), 300);
    });
  }

  // ---------- Login OTP Flow ----------
  const loginForm = document.getElementById('loginForm');
  const googleBtn = document.getElementById('googleSignIn');
  const sendOtpBtn = document.getElementById('sendOtpBtn');
  const otpGroup = document.getElementById('otpGroup');

  if (sendOtpBtn && otpGroup) {
    sendOtpBtn.addEventListener('click', () => {
      const phoneInput = document.getElementById('phone');
      if (phoneInput && phoneInput.value.length < 5) {
        // Just mock validation
        phoneInput.parentElement.style.border = '1px solid var(--accent-red)';
        setTimeout(() => { phoneInput.parentElement.style.border = ''; }, 1000);
        return;
      }
      sendOtpBtn.style.display = 'none';
      otpGroup.classList.remove('hidden');
    });
  }

  function goToExplore(e) {
    if (e) e.preventDefault();

    // Button feedback
    const btn = document.querySelector('.signin-btn') || googleBtn;
    if (btn) {
      btn.style.transform = 'scale(0.97)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    }

    // Show global app UI
    document.body.classList.add('app-ready');
    const mainNav = document.getElementById('mainNav');
    const fabBtn = document.getElementById('fabBtn');
    if (mainNav) mainNav.style.display = 'flex';
    if (fabBtn) fabBtn.style.display = 'flex';

    setTimeout(() => showScreen(exploreScreen), 200);
  }

  if (loginForm) loginForm.addEventListener('submit', goToExplore);
  if (googleBtn) googleBtn.addEventListener('click', goToExplore);

  // ---------- Bottom Navigation ----------
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Switch main screen
      const targetId = tab.dataset.tab + 'Screen';
      const targetScreen = document.getElementById(targetId);
      if (targetScreen) {
        // Keep splash, login, service-details hidden
        document.querySelectorAll('.screen').forEach(s => {
          if (s.id !== 'splashScreen' && s.id !== 'loginScreen' && s.id !== 'serviceDetailsScreen') {
            s.classList.remove('active');
            s.classList.add('hidden');
          }
        });
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
      }
    });
  });

  // ---------- Favorite Toggle ----------
  document.querySelectorAll('.service-fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isFav = btn.textContent.trim() === '♥';
      btn.textContent = isFav ? '♡' : '♥';
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
    });
  });

  // ---------- Search Filter ----------
  const searchInput = document.getElementById('searchInput');
  const serviceCards = document.querySelectorAll('.service-card');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      serviceCards.forEach(card => {
        const name = card.querySelector('.service-name').textContent.toLowerCase();
        const loc  = card.querySelector('.service-location').textContent.toLowerCase();
        if (name.includes(query) || loc.includes(query) || query === '') {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // ---------- Occasion Filter ----------
  document.querySelectorAll('.occasion-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.querySelector('.occasion-name').textContent.toLowerCase().trim();
      serviceCards.forEach(sc => {
        const cat = sc.dataset.category;
        if (category === 'wedding' && cat === 'wedding') {
          sc.style.display = '';
        } else if (category === 'birthday' && cat === 'birthday') {
          sc.style.display = '';
        } else if (category === 'engagement' && cat === 'engagement') {
          sc.style.display = '';
        } else if (category === 'baby shower') {
          sc.style.display = '';
        } else {
          sc.style.display = 'none';
        }
      });

      // Visual feedback
      document.querySelectorAll('.occasion-card').forEach(c => {
        c.style.outline = 'none';
      });
      card.style.outline = '2px solid #5C59E8';
      card.style.outlineOffset = '2px';
    });
  });

  // Reset filter when clicking "See All"
  document.querySelectorAll('.section-header a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      serviceCards.forEach(sc => { sc.style.display = ''; });
      document.querySelectorAll('.occasion-card').forEach(c => {
        c.style.outline = 'none';
      });
      if (searchInput) searchInput.value = '';
    });
  });

  // ---------- FAB pulse ----------
  const fab = document.getElementById('fabBtn');
  if (fab) {
    fab.addEventListener('click', () => {
      fab.style.transform = 'scale(0.9) rotate(45deg)';
      setTimeout(() => {
        fab.style.transform = '';
      }, 300);
    });
  }

  // ---------- Service Card Click ----------
  const serviceDetailsScreen = document.getElementById('serviceDetailsScreen');
  const backBtn = document.getElementById('backBtn');
  const detailImg = document.getElementById('detailImg');
  const detailName = document.getElementById('detailName');
  const detailLoc = document.getElementById('detailLoc');
  const detailPrice = document.getElementById('detailPrice');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      // Animate click
      card.style.transform = 'scale(0.98)';
      setTimeout(() => { card.style.transform = ''; }, 150);

      // Populate data
      const img = card.querySelector('img').src;
      const name = card.querySelector('.service-name').textContent;
      const locText = card.querySelector('.service-location').textContent.trim();
      const priceNode = card.querySelector('.service-price');
      const price = priceNode ? priceNode.childNodes[0].nodeValue.trim() : '$0';

      if (detailImg) detailImg.src = img;
      if (detailName) detailName.textContent = name;
      if (detailLoc) detailLoc.innerHTML = '📍 ' + locText;
      if (detailPrice) detailPrice.textContent = price;

      // Show Details Screen over the current screen
      setTimeout(() => {
        serviceDetailsScreen.classList.remove('hidden');
        serviceDetailsScreen.classList.add('active');
        serviceDetailsScreen.style.animation = 'slideUp 0.3s ease forwards';
      }, 150);
    });
  });

  if (backBtn && serviceDetailsScreen) {
    backBtn.addEventListener('click', () => {
      serviceDetailsScreen.style.animation = 'slideDown 0.3s ease forwards';
      setTimeout(() => {
        serviceDetailsScreen.classList.remove('active');
        serviceDetailsScreen.classList.add('hidden');
        serviceDetailsScreen.style.animation = '';
      }, 300);
    });
  }

  // Check out elements
  const paymentScreen = document.getElementById('paymentScreen');
  const paymentBackBtn = document.getElementById('paymentBackBtn');
  const payConfirmBtn = document.getElementById('payConfirmBtn');
  const paymentServiceName = document.getElementById('paymentServiceName');
  const paymentServicePrice = document.getElementById('paymentServicePrice');
  const paymentTotalAmount = document.getElementById('paymentTotalAmount');

  // New Funnel Elements
  const bookingConfigScreen = document.getElementById('bookingConfigScreen');
  const configBackBtn = document.getElementById('configBackBtn');
  const configContinueBtn = document.getElementById('configContinueBtn');
  const addonsScreen = document.getElementById('addonsScreen');
  const addonsBackBtn = document.getElementById('addonsBackBtn');
  const addonsContinueBtn = document.getElementById('addonsContinueBtn');

  // 1. Book Now button (Opens Booking Config screen)
  const bookNowBtn = document.getElementById('bookNowBtn');
  if (bookNowBtn && serviceDetailsScreen && bookingConfigScreen) {
    bookNowBtn.addEventListener('click', () => {
      bookingConfigScreen.classList.remove('hidden');
      bookingConfigScreen.classList.add('active');
      bookingConfigScreen.style.animation = 'slideUp 0.3s ease forwards';
    });
  }

  // 1b. Config Back
  if (configBackBtn && bookingConfigScreen) {
    configBackBtn.addEventListener('click', () => {
      bookingConfigScreen.style.animation = 'slideDown 0.3s ease forwards';
      setTimeout(() => {
        bookingConfigScreen.classList.remove('active');
        bookingConfigScreen.classList.add('hidden');
        bookingConfigScreen.style.animation = '';
      }, 300);
    });
  }

  // 2. Config Continue (Opens Add-ons)
  if (configContinueBtn && addonsScreen) {
    configContinueBtn.addEventListener('click', () => {
      addonsScreen.classList.remove('hidden');
      addonsScreen.classList.add('active');
      addonsScreen.style.animation = 'slideUp 0.3s ease forwards';
    });
  }

  // 2b. Add-ons Back
  if (addonsBackBtn && addonsScreen) {
    addonsBackBtn.addEventListener('click', () => {
      addonsScreen.style.animation = 'slideDown 0.3s ease forwards';
      setTimeout(() => {
        addonsScreen.classList.remove('active');
        addonsScreen.classList.add('hidden');
        addonsScreen.style.animation = '';
      }, 300);
    });
  }

  // 3. Add-ons Continue (Opens Payment screen)
  if (addonsContinueBtn && paymentScreen) {
    addonsContinueBtn.addEventListener('click', () => {
      // Transfer details
      if (detailName && paymentServiceName) paymentServiceName.textContent = detailName.textContent;
      if (detailPrice && paymentServicePrice) {
        paymentServicePrice.textContent = detailPrice.textContent;
        // Mock add-on price addition ($120 for the floral arch)
        const basePrice = parseInt(detailPrice.textContent.replace('$', '')) || 0;
        const total = basePrice + 120;
        if (paymentTotalAmount) paymentTotalAmount.textContent = '$' + total;
      }

      // Show payment screen
      paymentScreen.classList.remove('hidden');
      paymentScreen.classList.add('active');
      paymentScreen.style.animation = 'slideUp 0.3s ease forwards';
    });
  }

  // 3b. Payment Back Button
  if (paymentBackBtn && paymentScreen) {
    paymentBackBtn.addEventListener('click', () => {
      paymentScreen.style.animation = 'slideDown 0.3s ease forwards';
      setTimeout(() => {
        paymentScreen.classList.remove('active');
        paymentScreen.classList.add('hidden');
        paymentScreen.style.animation = '';
      }, 300);
    });
  }

  // Pay Confirm Button functionality
  const confirmationScreen = document.getElementById('confirmationScreen');
  const viewBookingsBtn = document.getElementById('viewBookingsBtn');

  if (payConfirmBtn && paymentScreen && confirmationScreen) {
    payConfirmBtn.addEventListener('click', () => {
      // Change button text to reflect action
      const originalText = payConfirmBtn.textContent;
      payConfirmBtn.textContent = 'Processing Payment...';
      payConfirmBtn.style.opacity = '0.8';

      setTimeout(() => {
        payConfirmBtn.textContent = 'Confirmed ✓';
        payConfirmBtn.style.background = '#10B981'; // Green color

        // Show Full Screen Confirmation Overlay
        setTimeout(() => {
          // Reset button for future clicks
          payConfirmBtn.textContent = originalText;
          payConfirmBtn.style.background = 'var(--primary)';
          payConfirmBtn.style.opacity = '1';

          confirmationScreen.classList.remove('hidden');
          confirmationScreen.classList.add('active');
          confirmationScreen.style.animation = 'slideUp 0.3s ease forwards';
        }, 600);
      }, 1000);
    });
  }

  // Final Action: View Bookings
  if (viewBookingsBtn) {
    viewBookingsBtn.addEventListener('click', () => {
      // Close all overlays
      const screensToClose = [
        confirmationScreen, 
        paymentScreen, 
        document.getElementById('addonsScreen'), 
        document.getElementById('bookingConfigScreen'), 
        document.getElementById('serviceDetailsScreen')
      ];

      screensToClose.forEach(s => {
        if (s) {
          s.style.animation = 'slideDown 0.3s ease forwards';
          setTimeout(() => {
            s.classList.remove('active');
            s.classList.add('hidden');
            s.style.animation = '';
          }, 300);
        }
      });

      // Navigate to Bookings tab programmatically
      setTimeout(() => {
        const bookingsTab = document.querySelector('.nav-tab[data-tab="bookings"]');
        if (bookingsTab) {
          bookingsTab.click(); 
        }
      }, 350);
    });
  }

  // Logout mockup
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      document.body.classList.remove('app-ready');
      const mainNav = document.getElementById('mainNav');
      const fabBtn = document.getElementById('fabBtn');
      if (mainNav) mainNav.style.display = 'none';
      if (fabBtn) fabBtn.style.display = 'none';

      showScreen(loginScreen);
      // reset tabs
      navTabs.forEach(t => t.classList.remove('active'));
      document.querySelector('.nav-tab[data-tab="explore"]').classList.add('active');
    });
  }

});
