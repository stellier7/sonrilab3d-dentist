/**
 * =============================================================================
 * app.js — renders the entire site from window.SITE_CONFIG
 * No hardcoded client content. All copy/images come from config.js.
 * =============================================================================
 */

(function () {
  "use strict";

  const cfg = window.SITE_CONFIG;
  if (!cfg) {
    console.error("SITE_CONFIG missing — ensure config.js loads before app.js");
    return;
  }

  const LANG_KEY = "dental-site-lang";
  const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const MQ_DESKTOP_SERVICES = window.matchMedia("(min-width: 768px)");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Animation system variables (declared early to avoid TDZ errors)
  const DEBUG_MODE = false; // Set to false to remove debug overlay
  let animationObserver = null;
  let debugLog = [];

  /** @type {"en"|"es"} */
  let lang = getInitialLang();

  // -------------------------------------------------------------------------
  // Boot
  // -------------------------------------------------------------------------
  applyBranding();
  renderAll();
  bindGlobalUI();
  initHeaderScroll();
  initTestimonialsCarousel();
  initDentistsCarousel();
  
  // Initialize animations after content renders
  setTimeout(() => {
    initAnimations();
  }, 100);

  // Re-bind accordion behavior when breakpoint flips
  MQ_DESKTOP_SERVICES.addEventListener("change", () => {
    renderServices();
  });

  // -------------------------------------------------------------------------
  // Language helpers
  // -------------------------------------------------------------------------
  function getInitialLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "es") return saved;
    return cfg.defaultLanguage === "en" ? "en" : "es";
  }

  function setLanguage(next) {
    if (next !== "en" && next !== "es") return;
    lang = next;
    localStorage.setItem(LANG_KEY, lang);
    renderAll();
  }

  function t(path) {
    const parts = path.split(".");
    let node = cfg.ui[lang];
    for (const part of parts) {
      if (!node || typeof node !== "object") return path;
      node = node[part];
    }
    return typeof node === "string" ? node : path;
  }

  function localized(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang] || value.es || value.en || "";
  }

  // -------------------------------------------------------------------------
  // Branding tokens from config
  // -------------------------------------------------------------------------
  function applyBranding() {
    const root = document.documentElement;
    const b = cfg.branding || {};
    if (b.primaryColor) root.style.setProperty("--color-primary", b.primaryColor);
    if (b.accentColor) root.style.setProperty("--color-accent", b.accentColor);
    if (b.primaryDark) root.style.setProperty("--color-primary-dark", b.primaryDark);
    if (b.softBg) root.style.setProperty("--color-soft-bg", b.softBg);
  }

  // -------------------------------------------------------------------------
  // Full render (used on load + language swap — no page reload)
  // -------------------------------------------------------------------------
  function renderAll() {
    document.documentElement.lang = lang;
    document.title = `${cfg.practice.name} · ${localized(cfg.practice.tagline)}`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        `${cfg.practice.name} — ${localized(cfg.practice.tagline)}`
      );
    }

    renderBrand();
    renderNav();
    renderLangToggle();
    renderBookCTAs();
    renderHero();
    renderTrust();
    renderServices();
    renderGallery();
    renderTestimonials();
    renderLocation();
    renderFooter();
    renderStickyBar();
    applyStaticI18n();
    refreshAnimations();
  }

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
  }

  // -------------------------------------------------------------------------
  // Brand / Nav / CTAs
  // -------------------------------------------------------------------------
  function renderBrand() {
    const brand = document.querySelector("[data-brand]");
    if (!brand) return;

    const logoUrl = cfg.branding.logoUrl;
    const initials = cfg.practice.name
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase();

    brand.innerHTML = logoUrl
      ? `<img class="brand__logo" src="${escapeAttr(logoUrl)}" alt="${escapeAttr(cfg.practice.name)} logo" />
         <span class="brand__name">${escapeHtml(cfg.practice.name)}</span>`
      : `<span class="brand__mark" aria-hidden="true">${escapeHtml(initials)}</span>
         <span class="brand__name">${escapeHtml(cfg.practice.name)}</span>`;
  }

  function renderNav() {
    const list = document.querySelector("[data-nav-list]");
    if (!list) return;

    const items = [
      { href: "#services", key: "nav.services", section: "services" },
      { href: "#gallery", key: "nav.gallery", section: "gallery" },
      { href: "#testimonials", key: "nav.testimonials", section: "testimonials" },
      { href: "#location", key: "nav.location", section: "location" },
    ].filter((item) => isSectionVisible(item.section));

    list.innerHTML = items
      .map(
        (item) =>
          `<li><a class="nav__link" href="${item.href}">${escapeHtml(t(item.key))}</a></li>`
      )
      .join("");

    // Close mobile nav when a link is tapped
    list.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeNav);
    });

    const toggle = document.querySelector("[data-nav-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-label", t("nav.openMenu"));
    }
  }

  function renderLangToggle() {
    document.querySelectorAll("[data-lang-toggle] .lang-toggle__btn").forEach((btn) => {
      const code = btn.getAttribute("data-lang");
      btn.textContent = code === "en" ? t("langToggle.en") : t("langToggle.es");
      btn.setAttribute("aria-pressed", code === lang ? "true" : "false");
    });

    const group = document.querySelector("[data-lang-toggle]");
    if (group) group.setAttribute("aria-label", t("langToggle.label"));
  }

  function whatsappHref(message = "") {
    const digits = (cfg.practice.phoneTel || cfg.practice.phone || "").replace(/\D/g, "");
    if (!digits) return "#";
    
    // WhatsApp link format: https://wa.me/1234567890?text=Message
    const baseUrl = `https://wa.me/1${digits}`;
    if (message) {
      const encodedMessage = encodeURIComponent(message);
      return `${baseUrl}?text=${encodedMessage}`;
    }
    return baseUrl;
  }

  function renderBookCTAs() {
    const bookMessage = lang === "es" 
      ? "Hola, me gustaría agendar una cita" 
      : "Hello, I would like to book an appointment";
    
    document.querySelectorAll("[data-book-cta]").forEach((el) => {
      el.href = whatsappHref(bookMessage);
      el.target = "_blank";
      el.rel = "noopener noreferrer";
      
      // Sticky / header / hero share the book label
      if (el.closest("[data-sticky-bar]")) {
        el.textContent = t("stickyBar.cta");
      } else if (el.classList.contains("btn--header-cta")) {
        el.textContent = t("nav.book");
      } else {
        el.textContent = t("hero.cta");
      }
    });
  }

  function renderStickyBar() {
    const bar = document.querySelector("[data-sticky-bar]");
    if (!bar) return;
    // Always useful when phone exists; hide only if no phone configured
    const hasPhone = Boolean((cfg.practice.phoneTel || cfg.practice.phone || "").replace(/\D/g, ""));
    bar.hidden = !hasPhone;
  }

  // -------------------------------------------------------------------------
  // Hero
  // -------------------------------------------------------------------------
  function renderHero() {
    const nameEl = document.querySelector("[data-practice-name]");
    const taglineEl = document.querySelector("[data-hero-tagline]");
    const badgeEl = document.querySelector("[data-hero-badge]");
    const img = document.querySelector("[data-hero-image]");

    if (nameEl) nameEl.textContent = cfg.practice.name;
    if (taglineEl) taglineEl.textContent = localized(cfg.practice.tagline);
    if (badgeEl) badgeEl.textContent = t("hero.badge");

    if (img) {
      img.src = cfg.branding.heroImageUrl || "";
      img.alt = "";
      img.decoding = "async";
      img.fetchPriority = "high";
    }
  }

  // -------------------------------------------------------------------------
  // Trust bar
  // -------------------------------------------------------------------------
  function renderTrust() {
    const section = document.querySelector('[data-section="trust"]');
    const list = document.querySelector("[data-trust-list]");
    if (!section || !list) return;

    const items = [];
    if (cfg.practice.yearsInPractice) {
      items.push({
        icon: iconYears(),
        value: cfg.practice.yearsInPractice,
        label: t("trust.years"),
      });
    }
    if (cfg.practice.patientRating) {
      items.push({
        icon: iconStar(),
        value: cfg.practice.patientRating,
        label: t("trust.rating"),
      });
    }
    if (cfg.practice.insuranceAccepted) {
      items.push({
        icon: iconShield(),
        value: t("trust.insurance"),
        label: "",
      });
    }
    // Always show licensed when trust bar has anything else; still configurable via presence of other items
    if (items.length) {
      items.push({
        icon: iconBadge(),
        value: t("trust.licensed"),
        label: "",
      });
    }

    if (!items.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    list.innerHTML = items
      .map(
        (item) => `
      <li class="trust__item">
        <span class="trust__icon" aria-hidden="true">${item.icon}</span>
        <span class="trust__text">
          <span class="trust__value">${escapeHtml(item.value)}</span>
          ${item.label ? `<span class="trust__label">${escapeHtml(item.label)}</span>` : ""}
        </span>
      </li>`
      )
      .join("");
  }

  // -------------------------------------------------------------------------
  // Services
  // -------------------------------------------------------------------------
  function renderServices() {
    const section = document.querySelector('[data-section="services"]');
    const grid = document.querySelector("[data-services-grid]");
    if (!section || !grid) return;

    const services = Array.isArray(cfg.services) ? cfg.services : [];
    if (!services.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    const desktop = MQ_DESKTOP_SERVICES.matches;

    grid.innerHTML = services
      .map((service, index) => {
        const title = localized(service.name);
        const desc = localized(service.description);
        const icon = serviceIcon(service.icon);
        const id = `service-panel-${index}`;

        return `
        <article class="service-card" data-service-card>
          <button
            type="button"
            class="service-card__trigger"
            aria-expanded="false"
            aria-controls="${id}"
            ${desktop ? 'tabindex="-1"' : ""}
          >
            <span class="service-card__icon" aria-hidden="true">${icon}</span>
            <h3 class="service-card__title">${escapeHtml(title)}</h3>
            <span class="service-card__chevron" aria-hidden="true">${iconChevron()}</span>
          </button>
          <div class="service-card__panel" id="${id}" ${desktop ? "" : 'role="region"'}>
            <div class="service-card__panel-inner">
              <p class="service-card__desc">${escapeHtml(desc)}</p>
            </div>
          </div>
        </article>`;
      })
      .join("");

    if (!desktop) bindServicesAccordion(grid);
  }

  function bindServicesAccordion(grid) {
    const cards = Array.from(grid.querySelectorAll("[data-service-card]"));

    cards.forEach((card) => {
      const trigger = card.querySelector(".service-card__trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const willOpen = !card.classList.contains("is-open");

        // Single-open pattern
        cards.forEach((other) => {
          other.classList.remove("is-open");
          const btn = other.querySelector(".service-card__trigger");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });

        if (willOpen) {
          card.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");

          // Auto-scroll expanded card toward top of viewport (account for sticky header)
          requestAnimationFrame(() => {
            const headerOffset = document.querySelector(".site-header")?.offsetHeight || 64;
            const top = card.getBoundingClientRect().top + window.scrollY - headerOffset - 12;
            window.scrollTo({
              top,
              behavior: prefersReducedMotion.matches ? "auto" : "smooth",
            });
          });
        }
      });
    });
  }

  // -------------------------------------------------------------------------
  // Dentists
  // -------------------------------------------------------------------------
  function renderDentists() {
    const section = document.querySelector('[data-section="dentists"]');
    const grid = document.querySelector("[data-dentists-grid]");
    if (!section || !grid) return;

    const dentists = Array.isArray(cfg.dentists) ? cfg.dentists : [];
    if (!dentists.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    
    // Enable horizontal scroll for multiple dentists
    if (dentists.length > 1) {
      grid.setAttribute('data-scrollable', 'true');
    } else {
      grid.removeAttribute('data-scrollable');
    }
    
    grid.innerHTML = dentists
      .map((d) => {
        const initials = (d.name || "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();

        const photo = d.photoUrl
          ? `<img src="${escapeAttr(d.photoUrl)}" alt="${escapeAttr(d.name)}" loading="lazy" decoding="async" />`
          : `<div class="dentist-card__placeholder" aria-hidden="true">${escapeHtml(initials)}</div>`;

        return `
        <article class="dentist-card">
          <div class="dentist-card__photo">${photo}</div>
          <div class="dentist-card__body">
            <h3>${escapeHtml(d.name)}</h3>
            <p class="dentist-card__title">${escapeHtml(localized(d.title))}</p>
            <p class="dentist-card__bio">${escapeHtml(localized(d.bio))}</p>
          </div>
        </article>`;
      })
      .join("");
  }

  // -------------------------------------------------------------------------
  // Dentists Carousel (for multiple dentists)
  // -------------------------------------------------------------------------
  function initDentistsCarousel() {
    const grid = document.querySelector("[data-dentists-grid]");
    if (!grid || grid.getAttribute('data-scrollable') !== 'true') return;
    
    const cards = grid.querySelectorAll('.dentist-card');
    if (cards.length <= 1) return;
    
    let autoScrollInterval = null;
    let isPaused = false;
    let currentIndex = 0;
    
    function scrollToCard(index) {
      const card = cards[index];
      if (!card) return;
      
      grid.scrollTo({
        left: card.offsetLeft,
        behavior: 'smooth'
      });
    }
    
    function startAutoScroll() {
      if (isPaused || autoScrollInterval) return;
      
      autoScrollInterval = setInterval(() => {
        if (isPaused) return;
        
        currentIndex = (currentIndex + 1) % cards.length;
        scrollToCard(currentIndex);
      }, 5000); // Scroll every 5 seconds (longer for bio reading)
    }
    
    function pauseAutoScroll() {
      isPaused = true;
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    }
    
    function resumeAutoScroll() {
      isPaused = false;
      startAutoScroll();
    }
    
    // Pause on hover/touch
    grid.addEventListener('mouseenter', pauseAutoScroll);
    grid.addEventListener('mouseleave', resumeAutoScroll);
    grid.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    
    // Pause when user manually scrolls
    let scrollTimeout;
    grid.addEventListener('scroll', () => {
      pauseAutoScroll();
      clearTimeout(scrollTimeout);
      
      // Update current index based on scroll position
      scrollTimeout = setTimeout(() => {
        const scrollLeft = grid.scrollLeft;
        let closestIndex = 0;
        let closestDist = Infinity;
        
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - scrollLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        });
        
        currentIndex = closestIndex;
        resumeAutoScroll();
      }, 7000); // Resume after 7 seconds (extra time for reading bios)
    }, { passive: true });
    
    // Start auto-scrolling
    startAutoScroll();
  }

  // -------------------------------------------------------------------------
  // Gallery
  // -------------------------------------------------------------------------
  function renderGallery() {
    const section = document.querySelector('[data-section="gallery"]');
    const scroller = document.querySelector("[data-gallery-scroller]");
    if (!section || !scroller) return;

    const images = Array.isArray(cfg.gallery) ? cfg.gallery.filter(Boolean) : [];
    if (!images.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    scroller.innerHTML = images
      .map(
        (src, i) => `
      <figure class="gallery__item">
        <img src="${escapeAttr(src)}" alt="${escapeAttr(
          `${cfg.practice.name} — ${i + 1}`
        )}" loading="lazy" decoding="async" />
      </figure>`
      )
      .join("");
  }

  // -------------------------------------------------------------------------
  // Testimonials
  // -------------------------------------------------------------------------
  function renderTestimonials() {
    const section = document.querySelector('[data-section="testimonials"]');
    const track = document.querySelector("[data-testimonials-track]");
    const dots = document.querySelector("[data-testimonials-dots]");
    if (!section || !track || !dots) return;

    const items = Array.isArray(cfg.testimonials) ? cfg.testimonials : [];
    if (!items.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    track.innerHTML = items
      .map((item) => {
        const stars = Math.max(0, Math.min(5, Number(item.rating) || 0));
        return `
        <article class="testimonial-card">
          <div class="testimonial-card__stars" aria-label="${stars} / 5">
            ${Array.from({ length: 5 }, (_, i) => starSvg(i < stars)).join("")}
          </div>
          <p class="testimonial-card__quote">“${escapeHtml(localized(item.quote))}”</p>
          <p class="testimonial-card__author">${escapeHtml(item.author || "")}</p>
        </article>`;
      })
      .join("");

    dots.innerHTML = items
      .map(
        (_, i) =>
          `<button type="button" class="testimonials__dot" data-dot-index="${i}" aria-label="${
            i + 1
          }" ${i === 0 ? 'aria-current="true"' : ""}><span></span></button>`
      )
      .join("");

    // Dots click handlers
    dots.querySelectorAll("[data-dot-index]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-dot-index"));
        const card = track.children[index];
        if (card) {
          track.scrollTo({
            left: card.offsetLeft,
            behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          });
        }
      });
    });
  }

  function initTestimonialsCarousel() {
    const track = document.querySelector("[data-testimonials-track]");
    const dots = document.querySelector("[data-testimonials-dots]");
    if (!track || !dots) return;

    // Keep dots in sync while swiping
    let ticking = false;
    track.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const cards = Array.from(track.children);
          if (!cards.length) {
            ticking = false;
            return;
          }
          const scrollLeft = track.scrollLeft;
          let active = 0;
          let best = Infinity;
          cards.forEach((card, i) => {
            const dist = Math.abs(card.offsetLeft - scrollLeft);
            if (dist < best) {
              best = dist;
              active = i;
            }
          });
          dots.querySelectorAll(".testimonials__dot").forEach((dot, i) => {
            if (i === active) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
          });
          ticking = false;
        });
      },
      { passive: true }
    );
    
    // Auto-scroll testimonials
    initTestimonialsAutoScroll(track);
  }

  // -------------------------------------------------------------------------
  // TESTIMONIALS AUTO-SCROLL
  // -------------------------------------------------------------------------
  function initTestimonialsAutoScroll(track) {
    if (!track || prefersReducedMotion.matches) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    let autoScrollInterval;
    let isPaused = false;
    let currentIndex = 0;
    
    function scrollToCard(index) {
      const card = cards[index];
      if (!card) return;
      
      track.scrollTo({
        left: card.offsetLeft,
        behavior: 'smooth'
      });
    }
    
    function startAutoScroll() {
      if (isPaused) return;
      
      autoScrollInterval = setInterval(() => {
        if (isPaused) return;
        
        currentIndex = (currentIndex + 1) % cards.length;
        scrollToCard(currentIndex);
      }, 3500); // Scroll every 3.5 seconds
    }
    
    function pauseAutoScroll() {
      isPaused = true;
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    }
    
    function resumeAutoScroll() {
      isPaused = false;
      startAutoScroll();
    }
    
    // Pause on hover/touch
    track.addEventListener('mouseenter', pauseAutoScroll);
    track.addEventListener('mouseleave', resumeAutoScroll);
    track.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    
    // Pause when user manually scrolls
    let scrollTimeout;
    track.addEventListener('scroll', () => {
      pauseAutoScroll();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Update currentIndex based on current scroll position
        const cards = Array.from(track.querySelectorAll('.testimonial-card'));
        let closestIndex = 0;
        let closestDist = Infinity;
        
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - track.scrollLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        });
        
        currentIndex = closestIndex;
        resumeAutoScroll();
      }, 6000); // Resume after 6 seconds (longer for testimonials since they're text-heavy)
    }, { passive: true });
    
    // Start auto-scrolling
    startAutoScroll();
  }

  // -------------------------------------------------------------------------
  // Insurance
  // -------------------------------------------------------------------------
  function renderInsurance() {
    const section = document.querySelector('[data-section="insurance"]');
    const list = document.querySelector("[data-insurance-logos]");
    if (!section || !list) return;

    const logos = Array.isArray(cfg.insuranceLogos) ? cfg.insuranceLogos.filter(Boolean) : [];
    if (!logos.length) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    list.innerHTML = logos
      .map((logo) => {
        // Support string URLs or { name, src } objects
        const src = typeof logo === "string" ? logo : logo.src;
        const name = typeof logo === "string" ? "Insurance" : logo.name || "Insurance";
        if (!src) return "";
        return `
        <li>
          <img src="${escapeAttr(src)}" alt="${escapeAttr(name)}" loading="lazy" decoding="async" />
        </li>`;
      })
      .join("");
  }

  // -------------------------------------------------------------------------
  // Location
  // -------------------------------------------------------------------------
  function renderLocation() {
    const section = document.querySelector('[data-section="location"]');
    const card = document.querySelector("[data-location-card]");
    if (!section || !card) return;

    const addr = cfg.practice.address || {};
    const fullAddress = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean).join(", ");
    if (!fullAddress && !cfg.practice.phone) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    const query = encodeURIComponent(addr.mapsQuery || fullAddress);
    const mapsEmbed = `https://www.google.com/maps?q=${query}&output=embed`;
    const mapsLink = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

    const hoursRows = DAY_ORDER.map((day) => {
      const value = cfg.practice.hours?.[day];
      const label = t(`location.days.${day}`);
      const display = value ? value : t("location.closed");
      // Skip days with empty string AND we still show closed — task says empty to omit;
      // interpret empty as omit from list for cleaner UX
      if (!value) return "";
      return `<li><span>${escapeHtml(label)}</span><span>${escapeHtml(display)}</span></li>`;
    }).join("");

    card.innerHTML = `
      <div class="location__map">
        <iframe
          title="${escapeAttr(cfg.practice.name)}"
          src="${escapeAttr(mapsEmbed)}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
      </div>
      <div class="location__details">
        <address class="location__address">${escapeHtml(fullAddress)}</address>
        <h3 class="location__hours-title">${escapeHtml(t("location.hours"))}</h3>
        <ul class="location__hours">${hoursRows}</ul>
        <div class="location__actions">
          <a class="btn btn--primary" href="${whatsappHref(lang === 'es' ? 'Hola, tengo una pregunta' : 'Hello, I have a question')}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("location.call"))}</a>
          <a class="btn btn--secondary" href="${escapeAttr(mapsLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
            t("location.directions")
          )}</a>
        </div>
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Footer
  // -------------------------------------------------------------------------
  function renderFooter() {
    const footer = document.querySelector("[data-footer]");
    if (!footer) return;

    const addr = cfg.practice.address || {};
    const fullAddress = [addr.street, addr.city, addr.state, addr.zip].filter(Boolean).join(", ");
    const year = new Date().getFullYear();

    const hoursRows = DAY_ORDER.map((day) => {
      const value = cfg.practice.hours?.[day];
      if (!value) return "";
      return `<li><span>${escapeHtml(t(`location.days.${day}`))}</span>: ${escapeHtml(value)}</li>`;
    }).join("");

    const socials = cfg.socials || {};
    const socialLinks = [
      socials.instagram
        ? `<a href="${escapeAttr(socials.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${iconInstagram()}</a>`
        : "",
      socials.facebook
        ? `<a href="${escapeAttr(socials.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${iconFacebook()}</a>`
        : "",
    ]
      .filter(Boolean)
      .join("");

    footer.innerHTML = `
      <div class="site-footer__inner">
        <div>
          <p class="site-footer__brand">${escapeHtml(cfg.practice.name)}</p>
          <p class="site-footer__tagline">${escapeHtml(localized(cfg.practice.tagline))}</p>
        </div>
        <div class="site-footer__cols">
          <div>
            <h3>${escapeHtml(t("footer.contact"))}</h3>
            <ul class="site-footer__list">
              <li><a href="${whatsappHref()}" target="_blank" rel="noopener noreferrer">${escapeHtml(cfg.practice.phone || "")}</a></li>
              ${
                cfg.practice.email
                  ? `<li><a href="mailto:${escapeAttr(cfg.practice.email)}">${escapeHtml(
                      cfg.practice.email
                    )}</a></li>`
                  : ""
              }
              <li>${escapeHtml(fullAddress)}</li>
            </ul>
          </div>
          <div>
            <h3>${escapeHtml(t("footer.hours"))}</h3>
            <ul class="site-footer__list">${hoursRows}</ul>
          </div>
          <div>
            ${
              socialLinks
                ? `<h3>${escapeHtml(t("footer.follow"))}</h3>
                   <div class="site-footer__socials">${socialLinks}</div>`
                : ""
            }
          </div>
        </div>
        <div class="site-footer__bottom">
          © ${year} ${escapeHtml(cfg.practice.name)}. ${escapeHtml(t("footer.rights"))}
        </div>
      </div>`;
  }

  // -------------------------------------------------------------------------
  // Section visibility helpers (for empty arrays)
  // -------------------------------------------------------------------------
  function isSectionVisible(key) {
    switch (key) {
      case "services":
        return Array.isArray(cfg.services) && cfg.services.length > 0;
      case "dentists":
        return Array.isArray(cfg.dentists) && cfg.dentists.length > 0;
      case "gallery":
        return Array.isArray(cfg.gallery) && cfg.gallery.length > 0;
      case "testimonials":
        return Array.isArray(cfg.testimonials) && cfg.testimonials.length > 0;
      case "insurance":
        return Array.isArray(cfg.insuranceLogos) && cfg.insuranceLogos.length > 0;
      case "location":
        return Boolean(cfg.practice.address?.street || cfg.practice.phone);
      default:
        return true;
    }
  }

  // -------------------------------------------------------------------------
  // Global UI: nav toggle, language, etc.
  // -------------------------------------------------------------------------
  function bindGlobalUI() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = !nav.classList.contains("is-open");
        if (open) openNav();
        else closeNav();
      });
    }

    document.querySelectorAll("[data-lang-toggle] .lang-toggle__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLanguage(btn.getAttribute("data-lang"));
      });
    });

    // Close nav on resize to desktop
    window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => {
      if (e.matches) closeNav();
    });
  }

  function openNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", t("nav.closeMenu"));
    document.body.classList.add("nav-open");
  }

  function closeNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", t("nav.openMenu"));
    document.body.classList.remove("nav-open");
  }

  // -------------------------------------------------------------------------
  // Header — hide on scroll down, show on scroll up (iOS-friendly)
  // -------------------------------------------------------------------------
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    let lastY = window.scrollY || 0;
    let ticking = false;
    const showAtTop = 24;
    const deltaMin = 8;

    function update() {
      ticking = false;
      const y = window.scrollY || 0;
      const delta = y - lastY;

      header.classList.toggle("is-scrolled", y > showAtTop);

      // Always show near the top of the page, or when the mobile nav is open
      if (y <= showAtTop || document.body.classList.contains("nav-open")) {
        header.classList.remove("is-hidden");
        lastY = y;
        return;
      }

      if (prefersReducedMotion.matches) {
        header.classList.remove("is-hidden");
        lastY = y;
        return;
      }

      if (Math.abs(delta) < deltaMin) return;

      if (delta > 0) {
        // Scrolling down — tuck the header away
        header.classList.add("is-hidden");
        closeNav();
      } else {
        // Scrolling up — bring it back
        header.classList.remove("is-hidden");
      }

      lastY = y;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  // -------------------------------------------------------------------------
  // Parallax — transform-based (iOS Safari friendly)
  // -------------------------------------------------------------------------
  // NOTE: Parallax is now handled by initFixedHeroBackground() in the animation system above

  // =========================================================================
  // SCROLL ANIMATIONS & EFFECTS
  // =========================================================================

  function initAnimations() {
    if (prefersReducedMotion.matches) {
      console.log('[Animations] Respecting prefers-reduced-motion');
      return;
    }

    logDebug('Animation system initializing...');
    
    // 1. Hero entrance animation (on load, not scroll-triggered)
    initHeroEntrance();
    
    // 2. Fixed hero background effect
    initFixedHeroBackground();
    
    // 3. Scroll-triggered animations for all sections
    initScrollAnimations();
    
    // 4. Gallery navigation
    initGalleryNav();
    
    // 5. Show debug overlay if enabled
    if (DEBUG_MODE) {
      createDebugOverlay();
    }
    
    logDebug('✓ Animation system ready');
  }

  // -------------------------------------------------------------------------
  // HERO - Fixed background + slide-in entrance
  // -------------------------------------------------------------------------
  function initHeroEntrance() {
    // Trigger hero content slide-in from right
    setTimeout(() => {
      document.body.classList.add('hero-loaded');
      logDebug('hero-content: slide-right FIRED');
    }, 150);
  }

  function initFixedHeroBackground() {
    // JS-based fixed background (iOS Safari compatible)
    // The background stays put while content scrolls over it
    const hero = document.querySelector('[data-hero]');
    const media = document.querySelector('[data-hero-media]');
    
    if (!hero || !media) return;

    let ticking = false;
    let active = true;

    // Optimize with IntersectionObserver
    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (!active) {
          media.style.transform = 'translate3d(0, 0, 0)';
        }
      },
      { rootMargin: '50% 0px' }
    );
    io.observe(hero);

    function updateBackground() {
      ticking = false;
      if (!active || prefersReducedMotion.matches) {
        media.style.transform = 'translate3d(0, 0, 0)';
        return;
      }

      const rect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Keep background fixed by counteracting scroll
      // This creates the "fixed" effect without CSS background-attachment
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(scrolled / viewportHeight, 1);
      
      // Slight parallax on the background (moves slower than scroll)
      const offset = scrolled * 0.5;
      media.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateBackground);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    updateBackground();
  }

  // -------------------------------------------------------------------------
  // SCROLL-TRIGGERED ANIMATIONS
  // -------------------------------------------------------------------------
  function initScrollAnimations() {
    animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.classList.contains('in-view')) {
            const animType = entry.target.getAttribute('data-animate') || 'unknown';
            const label = entry.target.getAttribute('data-anim-label') || animType;
            
            entry.target.classList.add('in-view');
            logDebug(`${label}: FIRED`);
            
            // Remove will-change after animation completes
            setTimeout(() => {
              entry.target.classList.add('animated');
            }, 700);

            // Unobserve after animating (one-time animation)
            animationObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    // Set up all scroll animations
    setupTrustBarAnimations();
    setupServicesAnimations();
    setupDentistsAnimations();
    setupGalleryAnimations();
    setupTestimonialsAnimations();
    setupInsuranceAnimations();
    setupLocationAnimations();
    setupSectionHeaders();
  }

  // TRUST BAR - Staggered fade up
  function setupTrustBarAnimations() {
    const trustItems = document.querySelectorAll('.trust__list .trust__item');
    trustItems.forEach((item, i) => {
      item.setAttribute('data-animate', 'slide-up');
      item.setAttribute('data-anim-label', `trust-item-${i + 1}`);
      item.style.transitionDelay = `${i * 80}ms`;
      animationObserver.observe(item);
    });
  }

  // SERVICES - Alternating left/right with stagger
  function setupServicesAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
      const direction = i % 2 === 0 ? 'slide-left' : 'slide-right';
      card.setAttribute('data-animate', direction);
      card.setAttribute('data-anim-label', `service-card-${i + 1}-${direction}`);
      card.style.transitionDelay = `${i * 100}ms`;
      animationObserver.observe(card);
    });
  }

  // DENTISTS - Entire card slides in
  function setupDentistsAnimations() {
    const dentistCards = document.querySelectorAll('.dentist-card');
    dentistCards.forEach((card, i) => {
      const direction = i % 2 === 0 ? 'slide-left' : 'slide-right';
      card.setAttribute('data-animate', direction);
      card.setAttribute('data-anim-label', `dentist-card-${i + 1}`);
      animationObserver.observe(card);
    });
  }

  // GALLERY - Scale + fade with stagger
  function setupGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery__item');
    galleryItems.forEach((item, i) => {
      item.setAttribute('data-animate', 'fade-scale');
      item.setAttribute('data-anim-label', `gallery-item-${i + 1}`);
      item.style.transitionDelay = `${Math.min(i * 60, 400)}ms`;
      animationObserver.observe(item);
    });
  }

  // TESTIMONIALS - Fade up with stagger
  function setupTestimonialsAnimations() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, i) => {
      card.setAttribute('data-animate', 'slide-up');
      card.setAttribute('data-anim-label', `testimonial-${i + 1}`);
      card.style.transitionDelay = `${i * 120}ms`;
      animationObserver.observe(card);
    });
  }

  // INSURANCE - Simple fade for the entire grid
  function setupInsuranceAnimations() {
    const logoGrid = document.querySelector('.insurance__logos');
    if (logoGrid) {
      logoGrid.setAttribute('data-animate', 'fade');
      logoGrid.setAttribute('data-anim-label', 'insurance-logos');
      animationObserver.observe(logoGrid);
    }
  }

  // LOCATION - Fade up
  function setupLocationAnimations() {
    const locationCard = document.querySelector('.location__card');
    if (locationCard) {
      locationCard.setAttribute('data-animate', 'slide-up');
      locationCard.setAttribute('data-anim-label', 'location-card');
      animationObserver.observe(locationCard);
    }
  }

  // SECTION HEADERS - Fade up
  function setupSectionHeaders() {
    const headers = document.querySelectorAll('.section__header');
    headers.forEach((header, i) => {
      const section = header.closest('[data-section]');
      const sectionName = section ? section.getAttribute('data-section') : `section-${i}`;
      header.setAttribute('data-animate', 'slide-up');
      header.setAttribute('data-anim-label', `${sectionName}-header`);
      animationObserver.observe(header);
    });
  }

  // Re-initialize animations after content changes (language swap)
  function refreshAnimations() {
    if (!animationObserver || prefersReducedMotion.matches) return;
    
    // Clear previous animations
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.remove('in-view', 'animated');
      el.style.transitionDelay = '';
    });
    
    // Re-setup
    setupTrustBarAnimations();
    setupServicesAnimations();
    setupDentistsAnimations();
    setupGalleryAnimations();
    setupTestimonialsAnimations();
    setupInsuranceAnimations();
    setupLocationAnimations();
    setupSectionHeaders();
  }

  // -------------------------------------------------------------------------
  // DEBUG OVERLAY
  // -------------------------------------------------------------------------
  function logDebug(message) {
    console.log(`[Animations] ${message}`);
    if (DEBUG_MODE) {
      debugLog.push({
        message,
        time: Date.now(),
        isFired: message.includes('FIRED')
      });
      updateDebugOverlay();
    }
  }

  function createDebugOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'anim-debug';
    overlay.innerHTML = `
      <div class="debug-title">🎬 Animation Debug</div>
      <div class="debug-content"></div>
    `;
    document.body.appendChild(overlay);
    
    // Instructions
    console.log('%c═══════════════════════════════════════', 'color: #fbbf24');
    console.log('%c🎬 ANIMATION DEBUG MODE ACTIVE', 'color: #4ade80; font-weight: bold; font-size: 14px');
    console.log('%cTo disable: Open js/app.js and set DEBUG_MODE = false', 'color: #60a5fa');
    console.log('%c═══════════════════════════════════════', 'color: #fbbf24');
  }

  function updateDebugOverlay() {
    const content = document.querySelector('#anim-debug .debug-content');
    if (!content) return;
    
    // Show last 12 entries
    const recent = debugLog.slice(-12);
    content.innerHTML = recent
      .map(entry => {
        const className = entry.isFired ? 'debug-log fired' : 'debug-log';
        return `<div class="${className}">→ ${entry.message}</div>`;
      })
      .join('');
  }

  // -------------------------------------------------------------------------
  // GALLERY NAVIGATION
  // -------------------------------------------------------------------------
  function initGalleryNav() {
    const scroller = document.querySelector('[data-gallery-scroller]');
    const prevBtn = document.querySelector('[data-gallery-prev]');
    const nextBtn = document.querySelector('[data-gallery-next]');
    
    if (!scroller || !prevBtn || !nextBtn) return;

    function updateButtons() {
      const isAtStart = scroller.scrollLeft <= 10;
      const isAtEnd = scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 10;
      
      prevBtn.disabled = isAtStart;
      nextBtn.disabled = isAtEnd;
    }

    function scrollToNext() {
      const items = scroller.querySelectorAll('.gallery__item');
      if (items.length === 0) return;
      
      const scrollerCenter = scroller.scrollLeft + (scroller.clientWidth / 2);
      let nextItem = null;
      
      // Find the next item after the current center position
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
        if (itemCenter > scrollerCenter + 50) {
          nextItem = item;
          break;
        }
      }
      
      if (nextItem) {
        const itemLeft = nextItem.offsetLeft;
        const itemWidth = nextItem.offsetWidth;
        const scrollerWidth = scroller.clientWidth;
        const scrollPosition = itemLeft - (scrollerWidth / 2) + (itemWidth / 2);
        
        scroller.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
        });
      }
    }

    function scrollToPrev() {
      const items = scroller.querySelectorAll('.gallery__item');
      if (items.length === 0) return;
      
      const scrollerCenter = scroller.scrollLeft + (scroller.clientWidth / 2);
      let prevItem = null;
      
      // Find the previous item before the current center position
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
        if (itemCenter < scrollerCenter - 50) {
          prevItem = item;
          break;
        }
      }
      
      if (prevItem) {
        const itemLeft = prevItem.offsetLeft;
        const itemWidth = prevItem.offsetWidth;
        const scrollerWidth = scroller.clientWidth;
        const scrollPosition = itemLeft - (scrollerWidth / 2) + (itemWidth / 2);
        
        scroller.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
        });
      }
    }

    nextBtn.addEventListener('click', scrollToNext);
    prevBtn.addEventListener('click', scrollToPrev);
    scroller.addEventListener('scroll', updateButtons, { passive: true });
    
    updateButtons();
    
    // Auto-scroll gallery continuously
    initGalleryAutoScroll(scroller);
  }

  // -------------------------------------------------------------------------
  // GALLERY AUTO-SCROLL - Rebuilt for reliability
  // -------------------------------------------------------------------------
  function initGalleryAutoScroll(scroller) {
    if (!scroller || prefersReducedMotion.matches) return;
    
    const items = scroller.querySelectorAll('.gallery__item');
    if (items.length === 0) return;
    
    let autoScrollInterval = null;
    let isPaused = false;
    let currentIndex = 0;
    
    function scrollToIndex(index) {
      const item = items[index];
      if (!item) return;
      
      // Calculate scroll position to center the item
      const itemLeft = item.offsetLeft;
      const itemWidth = item.offsetWidth;
      const scrollerWidth = scroller.clientWidth;
      const scrollPosition = itemLeft - (scrollerWidth / 2) + (itemWidth / 2);
      
      scroller.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
    
    function startAutoScroll() {
      if (isPaused || autoScrollInterval) return;
      
      autoScrollInterval = setInterval(() => {
        if (isPaused) return;
        
        currentIndex = (currentIndex + 1) % items.length;
        scrollToIndex(currentIndex);
      }, 3000); // Scroll every 3 seconds
    }
    
    function pauseAutoScroll() {
      isPaused = true;
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    }
    
    function resumeAutoScroll() {
      isPaused = false;
      startAutoScroll();
    }
    
    // Pause on hover/touch
    scroller.addEventListener('mouseenter', pauseAutoScroll);
    scroller.addEventListener('mouseleave', resumeAutoScroll);
    scroller.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    
    // Pause when user manually scrolls
    let scrollTimeout;
    scroller.addEventListener('scroll', () => {
      pauseAutoScroll();
      clearTimeout(scrollTimeout);
      
      // Update current index based on scroll position
      scrollTimeout = setTimeout(() => {
        const scrollerCenter = scroller.scrollLeft + (scroller.clientWidth / 2);
        let closestIndex = 0;
        let closestDistance = Infinity;
        
        items.forEach((item, index) => {
          const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
          const distance = Math.abs(scrollerCenter - itemCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        
        currentIndex = closestIndex;
        resumeAutoScroll();
      }, 5000); // Resume after 5 seconds
    }, { passive: true });
    
    // Start auto-scrolling
    startAutoScroll();
  }

  // -------------------------------------------------------------------------
  // Icons (inline SVG — no icon font dependency)
  // -------------------------------------------------------------------------
  function serviceIcon(key) {
    switch (key) {
      case "cleaning":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3c2 3 2 5 2 7a2 2 0 1 1-4 0c0-2 0-4 2-7z"/><path d="M8 14c.8 2.2 2.2 4 4 6 1.8-2 3.2-3.8 4-6"/><path d="M7 17h10"/></svg>`;
      case "whitening":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3z"/><path d="M18 13l.8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13z"/></svg>`;
      case "aligners":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 10c2-3 5-4 8-4s6 1 8 4"/><path d="M4 14c2 3 5 4 8 4s6-1 8-4"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>`;
      case "emergency":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3v18"/><path d="M5 10h14"/><circle cx="12" cy="12" r="9"/></svg>`;
      case "implants":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3v8"/><path d="M9 7h6"/><path d="M10 11h4l-1 10h-2l-1-10z"/></svg>`;
      case "pediatric":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="8" r="3.5"/><path d="M6 19c1.5-3 4-4.5 6-4.5S16.5 16 18 19"/><path d="M9.5 9.5c.5.8 1.4 1.3 2.5 1.3s2-.5 2.5-1.3"/></svg>`;
      case "cosmetic":
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 21c4-3.5 7-6.8 7-11a7 7 0 1 0-14 0c0 4.2 3 7.5 7 11z"/></svg>`;
      default:
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3c2.5 3.5 3 6 3 8a3 3 0 1 1-6 0c0-2 .5-4.5 3-8z"/><path d="M7 15c1.2 2.5 2.8 4 5 5 2.2-1 3.8-2.5 5-5"/></svg>`;
    }
  }

  function iconChevron() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;
  }

  function iconYears() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/></svg>`;
  }

  function iconStar() {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.7 5.5 6 .9-4.4 4.2 1 5.9L12 17.3 6.7 20l1-5.9L3.3 9.9l6-.9L12 3.5z"/></svg>`;
  }

  function iconShield() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>`;
  }

  function iconBadge() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="9" r="4"/><path d="M7 20l1.5-4.5M17 20l-1.5-4.5M9.5 14.5L8 20h8l-1.5-5.5"/></svg>`;
  }

  function starSvg(filled) {
    if (filled) {
      return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3.5l2.7 5.5 6 .9-4.4 4.2 1 5.9L12 17.3 6.7 20l1-5.9L3.3 9.9l6-.9L12 3.5z"/></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3.5l2.7 5.5 6 .9-4.4 4.2 1 5.9L12 17.3 6.7 20l1-5.9L3.3 9.9l6-.9L12 3.5z"/></svg>`;
  }

  function iconInstagram() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`;
  }

  function iconFacebook() {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>`;
  }

  // -------------------------------------------------------------------------
  // Escaping
  // -------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }
})();
