/**
 * =============================================================================
 * CLIENT CONFIG — SINGLE SOURCE OF TRUTH
 * =============================================================================
 * Edit THIS FILE ONLY when customizing for a new dental practice.
 * Every label, nav item, section header, button, bio, service, and testimonial
 * is pulled from here at render time. Do not hardcode copy in HTML/CSS/JS.
 *
 * Languages: English (en) and Spanish (es). Default language is Spanish.
 * =============================================================================
 */

const config = {
  // ---------------------------------------------------------------------------
  // SITE DEFAULTS
  // ---------------------------------------------------------------------------
  // REQUIRED — default language when a visitor first loads the site ("es" | "en")
  defaultLanguage: "es",

  // ---------------------------------------------------------------------------
  // PRACTICE INFO
  // ---------------------------------------------------------------------------
  practice: {
    // REQUIRED — shown in hero, nav, footer, page title
    name: "SonriLab3D",

    // REQUIRED — warm one-line tagline under the practice name
    tagline: {
      en: "Advanced diagnostic center and digital dental laboratory in Comayagua. Elevating precision standards in modern dentistry through cutting-edge imaging and design technology.",
      es: "Centro de diagnóstico y laboratorio dental digital de vanguardia en Comayagua. Elevamos el estándar de precisión en la odontología moderna, integrando los procesos clínicos con la más alta tecnología de imagen y diseño.",
    },

    // REQUIRED — used for click-to-call (tel:) links. Digits only recommended for telHref.
    phone: "+504 9665-9980",
    // REQUIRED — raw digits for tel: links (no spaces or punctuation)
    phoneTel: "+50496659980",

    // REQUIRED — display address and map/directions helpers
    address: {
      street: "Boulevard Cuarto Centenario, Century Mall segundo nivel al frente de Wendy's",
      city: "Comayagua",
      state: "Honduras",
      zip: "12101",
      // OPTIONAL — override the Google Maps query; leave blank to auto-build from address
      mapsQuery: "Century Mall, Comayagua, Honduras",
    },

    // REQUIRED — hours shown in Location + Footer. Use empty string to omit a day.
    hours: {
      mon: "8:00 AM – 5:00 PM",
      tue: "8:00 AM – 5:00 PM",
      wed: "8:00 AM – 5:00 PM",
      thu: "8:00 AM – 5:00 PM",
      fri: "8:00 AM – 5:00 PM",
      sat: "8:00 AM – 5:00 PM",
      sun: "",
    },

    // OPTIONAL — email shown in footer when present
    email: "sonrilab3d01@gmail.com",

    // OPTIONAL — trust bar stats (leave a field blank to hide that trust item)
    yearsInPractice: "",
    patientRating: "",
    // OPTIONAL — short insurance blurb for trust bar
    insuranceAccepted: false,
  },

  // ---------------------------------------------------------------------------
  // BRANDING
  // ---------------------------------------------------------------------------
  branding: {
    // REQUIRED — soft clinical blue (CSS color value)
    primaryColor: "#0066CC",
    // REQUIRED — warmer accent for CTAs / highlights (avoid neon or flashy tones)
    accentColor: "#0099FF",
    // OPTIONAL — deeper shade for hover states; leave blank to auto-derive
    primaryDark: "#004C99",
    // OPTIONAL — soft page wash behind sections
    softBg: "#F0F7FF",
    // OPTIONAL — path or URL to logo (leave blank to show practice name as text logo)
    logoUrl: "assets/images/Logo-sonrilab.jpeg",
    // REQUIRED — full-bleed hero image (place file in /assets/images/)
    heroImageUrl: "assets/images/hero-sonrilab.jpeg",
  },

  // ---------------------------------------------------------------------------
  // UI COPY (labels, nav, section headers, buttons) — per language
  // ---------------------------------------------------------------------------
  // REQUIRED — edit wording if needed; structure keys must stay in sync with app.js
  ui: {
    en: {
      nav: {
        home: "Home",
        services: "Services",
        dentists: "Our Team",
        gallery: "Gallery",
        testimonials: "Testimonials",
        insurance: "Financing",
        location: "Location",
        book: "Contact Us",
        openMenu: "Open menu",
        closeMenu: "Close menu",
      },
      hero: {
        badge: "Digital Excellence",
        cta: "Contact Us",
      },
      trust: {
        years: "Years in practice",
        rating: "Partner rating",
        insurance: "Financing available",
        licensed: "Certified technology",
      },
      sections: {
        services: "Our Services",
        servicesLead: "Advanced imaging and digital lab solutions for modern dentistry.",
        dentists: "Meet Our Team",
        dentistsLead: "Expert specialists in digital diagnostics and dental technology.",
        gallery: "Our Work",
        galleryLead: "Precision results from our digital laboratory.",
        testimonials: "What Dentists Say",
        testimonialsLead: "Trusted by dental professionals across Honduras.",
        insurance: "Financing Options",
        insuranceLead: "Flexible payment solutions for your practice.",
        location: "Visit Us",
        locationLead: "Conveniently located in Century Mall, Comayagua.",
      },
      services: {
        expand: "Learn more",
        collapse: "Show less",
      },
      location: {
        hours: "Hours",
        call: "Call Us",
        directions: "Get Directions",
        closed: "Closed",
        days: {
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday",
          sun: "Sunday",
        },
      },
      stickyBar: {
        cta: "Contact Us",
      },
      footer: {
        contact: "Contact",
        hours: "Hours",
        follow: "Follow Us",
        rights: "All rights reserved.",
      },
      langToggle: {
        label: "Language",
        en: "EN",
        es: "ES",
      },
    },
    es: {
      nav: {
        home: "Inicio",
        services: "Servicios",
        dentists: "Nuestro Equipo",
        gallery: "Galería",
        testimonials: "Testimonios",
        insurance: "Financiamiento",
        location: "Ubicación",
        book: "Contáctanos",
        openMenu: "Abrir menú",
        closeMenu: "Cerrar menú",
      },
      hero: {
        badge: "Excelencia Digital",
        cta: "Contáctanos",
      },
      trust: {
        years: "Años de experiencia",
        rating: "Calificación de socios",
        insurance: "Financiamiento disponible",
        licensed: "Tecnología certificada",
      },
      sections: {
        services: "Nuestros Servicios",
        servicesLead: "Soluciones de imagen avanzada y laboratorio digital para la odontología moderna.",
        dentists: "Conoce Nuestro Equipo",
        dentistsLead: "Especialistas expertos en diagnóstico digital y tecnología dental.",
        gallery: "Nuestro Trabajo",
        galleryLead: "Resultados precisos de nuestro laboratorio digital.",
        testimonials: "Lo Que Dicen los Odontólogos",
        testimonialsLead: "Confianza de profesionales dentales en todo Honduras.",
        insurance: "Opciones de Financiamiento",
        insuranceLead: "Soluciones de pago flexibles para tu consultorio.",
        location: "Visítanos",
        locationLead: "Ubicados convenientemente en Century Mall, Comayagua.",
      },
      services: {
        expand: "Ver más",
        collapse: "Ver menos",
      },
      location: {
        hours: "Horario",
        call: "Llámanos",
        directions: "Cómo Llegar",
        closed: "Cerrado",
        days: {
          mon: "Lunes",
          tue: "Martes",
          wed: "Miércoles",
          thu: "Jueves",
          fri: "Viernes",
          sat: "Sábado",
          sun: "Domingo",
        },
      },
      stickyBar: {
        cta: "Contáctanos",
      },
      footer: {
        contact: "Contacto",
        hours: "Horario",
        follow: "Síguenos",
        rights: "Todos los derechos reservados.",
      },
      langToggle: {
        label: "Idioma",
        en: "EN",
        es: "ES",
      },
    },
  },

  // ---------------------------------------------------------------------------
  // DENTISTS / TEAM
  // ---------------------------------------------------------------------------
  // REQUIRED — at least one team member. Empty array hides the whole section.
  dentists: [],

  // ---------------------------------------------------------------------------
  // SERVICES
  // ---------------------------------------------------------------------------
  // REQUIRED for Services section. Empty array hides the section.
  // icon: short key used by app.js to pick an inline SVG ("cleaning", "whitening",
  // "aligners", "emergency", "implants", "pediatric", "general", "cosmetic")
  services: [
    {
      name: { en: "Zirconia Crowns", es: "Coronas de Zirconia" },
      description: {
        en: "High-strength, natural-looking zirconia crowns fabricated with precision 3D technology for superior fit and aesthetics.",
        es: "Coronas de zirconia de alta resistencia y aspecto natural, fabricadas con tecnología 3D de precisión para ajuste y estética superiores.",
      },
      icon: "cosmetic",
    },
    {
      name: { en: "Lithium Disilicate Crowns", es: "Coronas de Disilicato de Litio" },
      description: {
        en: "Premium aesthetic restorations with exceptional translucency and durability for optimal natural appearance.",
        es: "Restauraciones estéticas premium con translucidez y durabilidad excepcionales para una apariencia natural óptima.",
      },
      icon: "cosmetic",
    },
    {
      name: { en: "PMMA Provisionals", es: "Provisionales de PMMA" },
      description: {
        en: "Durable temporary restorations milled from high-quality PMMA material for reliable interim solutions.",
        es: "Restauraciones temporales duraderas fresadas de material PMMA de alta calidad para soluciones provisionales confiables.",
      },
      icon: "general",
    },
    {
      name: { en: "Digital Intraoral Scanning", es: "Escaneo Intraoral Digital" },
      description: {
        en: "Precise digital impressions eliminating traditional methods for accurate treatment planning and superior patient comfort.",
        es: "Impresiones digitales precisas eliminando métodos tradicionales para planificación exacta y comodidad superior del paciente.",
      },
      icon: "general",
    },
    {
      name: { en: "Veneers", es: "Carillas" },
      description: {
        en: "Custom-designed aesthetic veneers crafted with advanced CAD/CAM technology for beautiful smile transformations.",
        es: "Carillas estéticas diseñadas a medida con tecnología CAD/CAM avanzada para hermosas transformaciones de sonrisa.",
      },
      icon: "cosmetic",
    },
    {
      name: { en: "Inlays/Onlays/Overlays", es: "Inlay/Overlay/Onlay/Incrustación" },
      description: {
        en: "Precision-milled indirect restorations for optimal fit, longevity, and preservation of natural tooth structure.",
        es: "Restauraciones indirectas fresadas con precisión para ajuste óptimo, longevidad y preservación de estructura dental natural.",
      },
      icon: "general",
    },
    {
      name: { en: "Panoramic X-rays", es: "Radiografías Panorámicas" },
      description: {
        en: "Comprehensive panoramic imaging providing complete diagnostic overview of teeth, jaws, and surrounding structures.",
        es: "Imagenología panorámica completa proporcionando visión diagnóstica integral de dientes, mandíbulas y estructuras circundantes.",
      },
      icon: "general",
    },
    {
      name: { en: "Cephalometric X-rays", es: "AP/PA/LAT de Cráneo" },
      description: {
        en: "Specialized cephalometric imaging essential for orthodontic diagnosis and surgical treatment planning.",
        es: "Imagenología cefalométrica especializada esencial para diagnóstico ortodóntico y planificación de tratamiento quirúrgico.",
      },
      icon: "general",
    },
    {
      name: { en: "TMJ Comparative Studies", es: "ATM Comparativa" },
      description: {
        en: "Advanced TMJ analysis comparing joint positions for comprehensive evaluation of temporomandibular disorders.",
        es: "Análisis avanzado de ATM comparando posiciones articulares para evaluación integral de trastornos temporomandibulares.",
      },
      icon: "general",
    },
    {
      name: { en: "Bitewing X-rays", es: "Aleta de Mordida" },
      description: {
        en: "Detailed bitewing radiographs for precise caries detection and bone level assessment between teeth.",
        es: "Radiografías de aleta de mordida detalladas para detección precisa de caries y evaluación de nivel óseo entre dientes.",
      },
      icon: "general",
    },
    {
      name: { en: "Paranasal Sinuses", es: "Senos Paranasales" },
      description: {
        en: "Specialized imaging for comprehensive paranasal sinus evaluation essential for upper dental procedures.",
        es: "Imagenología especializada para evaluación completa de senos paranasales esencial para procedimientos dentales superiores.",
      },
      icon: "general",
    },
    {
      name: { en: "CBCT Bimaxillary", es: "CBCT Bimaxilar" },
      description: {
        en: "High-resolution 3D cone beam imaging for precise implant planning, complex extractions, and comprehensive diagnosis.",
        es: "Imagenología 3D de haz cónico de alta resolución para planificación precisa de implantes, extracciones complejas y diagnóstico integral.",
      },
      icon: "implants",
    },
    {
      name: { en: "Dynamic Functional TMJ CBCT", es: "CBCT Funcional Dinámico ATM" },
      description: {
        en: "Advanced dynamic CBCT technology for functional TMJ analysis capturing joint movement and relationships.",
        es: "Tecnología CBCT dinámica avanzada para análisis funcional de ATM capturando movimiento y relaciones articulares.",
      },
      icon: "general",
    },
    {
      name: { en: "Complete Orthodontic Study", es: "Estudio Completo de Ortodoncia" },
      description: {
        en: "Comprehensive orthodontic diagnostic package including all necessary imaging, models, and cephalometric analysis.",
        es: "Paquete diagnóstico ortodóntico completo incluyendo toda la imagenología, modelos y análisis cefalométrico necesarios.",
      },
      icon: "aligners",
    },
  ],

  // ---------------------------------------------------------------------------
  // TESTIMONIALS
  // ---------------------------------------------------------------------------
  // OPTIONAL — empty array hides the Testimonials section entirely.
  testimonials: [
    {
      quote: {
        en: "The precision and turnaround time for crowns from SonriLab3D has transformed my practice. The digital workflow is seamless and my patients love the results.",
        es: "La precisión y el tiempo de entrega de las coronas de SonriLab3D ha transformado mi consultorio. El flujo de trabajo digital es impecable y mis pacientes aman los resultados.",
      },
      author: "Dr. Carlos Mejía, DDS",
      rating: 5,
    },
    {
      quote: {
        en: "Having access to CBCT imaging locally has been a game-changer for implant planning. The quality and expertise at SonriLab3D is outstanding.",
        es: "Tener acceso a imagenología CBCT localmente ha sido un cambio radical para la planificación de implantes. La calidad y experiencia en SonriLab3D es sobresaliente.",
      },
      author: "Dra. Patricia Ramírez",
      rating: 5,
    },
    {
      quote: {
        en: "SonriLab3D brings cutting-edge technology to Honduras. The digital scans and lab work quality rivals anything I've seen internationally.",
        es: "SonriLab3D trae tecnología de vanguardia a Honduras. La calidad de los escaneos digitales y trabajo de laboratorio rivaliza con cualquier cosa que he visto internacionalmente.",
      },
      author: "Dr. Roberto Fernández",
      rating: 5,
    },
    {
      quote: {
        en: "The orthodontic studies are comprehensive and precise. My treatment planning has become much more accurate thanks to their advanced imaging.",
        es: "Los estudios ortodónticos son completos y precisos. Mi planificación de tratamientos se ha vuelto mucho más exacta gracias a su imagenología avanzada.",
      },
      author: "Dra. María José Sánchez, Ortodoncista",
      rating: 5,
    },
  ],

  // ---------------------------------------------------------------------------
  // INSURANCE LOGOS / FINANCING
  // ---------------------------------------------------------------------------
  // OPTIONAL — array of image URLs/paths. Empty array hides Insurance section.
  // Tip: drop SVGs/PNGs in /assets/images/insurance/ and reference them here.
  insuranceLogos: [],

  // ---------------------------------------------------------------------------
  // SMILE GALLERY
  // ---------------------------------------------------------------------------
  // OPTIONAL — empty array hides the Gallery section.
  gallery: [
    "assets/images/gallery/dentist-bonilla.jpeg",
    "assets/images/gallery/dentist-recarte.jpeg",
    "assets/images/gallery/IMG_0133.jpeg",
    "assets/images/gallery/IMG_0134.jpeg",
    "assets/images/gallery/IMG_0135.jpeg",
    "assets/images/gallery/IMG_0128.jpeg",
  ],

  // ---------------------------------------------------------------------------
  // SOCIAL LINKS
  // ---------------------------------------------------------------------------
  // OPTIONAL — leave blank to hide that icon in the footer
  socials: {
    instagram: "https://www.instagram.com/sonrilab.3d",
    facebook: "https://www.facebook.com/926058927263794",
  },
};

// Expose globally for app.js (no bundler / no modules required)
window.SITE_CONFIG = config;
