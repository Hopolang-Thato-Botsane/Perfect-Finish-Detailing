/**
 * PERFECT FINISH DETAIL - SERVICE MODAL CORE ENGINE
 * Layout: Asymmetric Editorial Lookbook
 */

// 1. GLOBAL STATE & DATA REPOSITORY
// Kept at file scope so it's instantly evaluated by the engine.
let activePackageValue = 'enhancement';

const packageDatabase = {
  enhancement: {
    title: "Enhancement Valet",
    heroBg: "assets/enhancement-hero.jpg",
    overview: "A meticulous, multi-stage machine treatment engineered specifically for newer vehicles or well-maintained paintwork showing signs of dullness and light surface degradation. This process clears away up to 60% of superficial micro-scratches and wash-hazing, permanently optical-clarifying the clear coat to restore a crisp, high-gloss factory reflection.",
    duration: "2 TO 3 DAYS",
    priceSm: "R1 200",
    priceLg: "R1 650",
    highlights: [
      "✓ 60% Permanent Micro-Scratch Elimination",
      "✓ 4-Stage Deionized Pure Water Hydro-Rinse",
      "✓ Hydrophobic Si02 Clear Coat Shield Protection",
      "✓ Safe Non-Contact Compressed Air Drying Cycle"
    ],
    processes: [
      { title: "01 / FOUR-STAGE DECONTAMINATION RECON", desc: "Standard washing fails to remove embedded road sediment. We initiate a rigorous decontamination sequence utilizing a high-pressure rinse with 4-stage filtered, deionized water to lift loose particulates safely. The wheels, inner arches, and exhaust tips are chemically broken down using targeted brake-dust dissolving agents." },
      { title: "02 / SURFACE PURIFICATION & STRIPPING", desc: "To ensure an uncompromised bond for paint correction, the vehicle undergoes a dedicated citrus pre-wash foam bath to strip legacy waxes and grease. This is immediately followed by a precision iron-fallout chemical treatment and a mechanical ultra-fine clay-bar pass, completely lifting invisible metallic shards and tar before any machine polishing begins." },
      { title: "03 / SINGLE-STAGE GLOSS CLARIFICATION", desc: "Utilizing professional-grade, long-throw dual-action polishers paired with premium jeweling compounds, we execute a flawless single-stage paint refinement pass. This active leveling eliminates hazy wash swirls, updates color depth, and levels out micro-defects without aggressively thinning your vehicle’s factory clear coat." },
      { title: "04 / SIO2 HYDRATION CERAMIC SEALING", desc: "The refined finish is locked down using an advanced silica-infused hydrophobic sealant layer. This creates an invisible, slick barrier that repels water, actively prevents dirt from bonding to the surface, and acts as a sacrificial shield defending your clear coat against intensive UV oxidation." }
    ]
  },
  interior: {
    title: "Interior Matte Sanitization",
    heroBg: "assets/interior-hero.jpg",
    overview: "An exhaustive, top-to-bottom hygienic remediation of your vehicle's entire cockpit environment. Designed to eliminate deeply embedded organic matter, sweat, and allergens, this tier bypasses cheap greasy silicones to restore all vinyl, leather, and fabric surfaces back to their original, sterile factory-matte appearance.",
    duration: "5 TO 7 HOURS",
    priceSm: "R750",
    priceLg: "R1 200",
    highlights: [
      "✓ 100°C Dry-Steam Microbial Sanitization",
      "✓ Zero-Residue Genuine OEM Matte Finish",
      "✓ Full Fluid Sub-Surface Fiber Extraction",
      "✓ Static Dust Resistant UV Shield Application"
    ],
    processes: [
      { title: "01 / HIGH-VACUUM & TORNADOR SEDIMENT PURGE", desc: "We begin with an intensive dry extraction phase, reaching deep beneath seat tracks, storage bins, and floor wells. Utilizing high-pressure pneumatic Tornador detailing tools, we forcefully dislodge tightly bound grit, sand, and dust trapped deep within fabric weave before liquids are introduced." },
      { title: "02 / THERMAL STEAM EXTRACTION DECONTAM", desc: "High-touch points—such as steering wheels, column stalks, door cards, and seat bolsters—are treated with pressurized dry steam at temperatures exceeding 100°C. This naturally destroys bacteria, neutralizes embedded odors, and dissolves grease without utilizing harsh, surface-bleaching chemical agents." },
      { title: "03 / SUB-SURFACE CARPET EXTRACTION", desc: "Carpets and upholstered floor mats are treated with an enzyme-based organic breakdown solution, agitated with precision detail brushes, and completely rinsed using a professional heated sub-surface extractor. This pulls years of body sweat, spilled fluids, and tracking dirt out of the fabric fiber entirely." },
      { title: "04 / TRUE OEM MATTE PROTECTION", desc: "All interior dashboard components, door panel materials, and consoles are conditioned using a premium, zero-gloss UV protection dressing. This applies a completely dry-to-the-touch protective coat that resists static dust accumulation and shields vulnerable leather and plastics from harsh South African dashboard cracking." }
    ]
  }
};

// 2. GLOBAL TRIGGER EXPOSURE (Bypasses Defer/Asynchronous Race Conditions)
window.openServiceModal = function(packageKey) {
  // Query DOM elements dynamically upon explicit invocation
  const modal = document.getElementById('service-modal');
  const packageTitle = document.getElementById('modal-package-title');
  const packageOverview = document.getElementById('modal-package-overview');
  const heroImg = document.getElementById('modal-hero-img');
  const processContainer = document.getElementById('modal-process-container');
  const highlightsList = document.getElementById('modal-highlights-list');
  const durationVal = document.getElementById('modal-duration-val');
  const priceSmVal = document.getElementById('price-sm-val');
  const priceLgVal = document.getElementById('price-lg-val');

  const data = packageDatabase[packageKey];
  if (!data) return;

  // Sync state tracking variable
  activePackageValue = packageKey;

  // Inject Text and Structural Content Data Sets
  packageTitle.textContent = data.title;
  packageOverview.textContent = data.overview;
  if (heroImg) heroImg.style.backgroundImage = `url('${data.heroBg}')`;
  if (durationVal) durationVal.textContent = data.duration;
  if (priceSmVal) priceSmVal.textContent = data.priceSm;
  if (priceLgVal) priceLgVal.textContent = data.priceLg;

  // Render Array Strings to List Sub-nodes
  if (highlightsList) {
    highlightsList.innerHTML = data.highlights.map(item => `<li>${item}</li>`).join('');
  }

  // Render Objects to Block Process Layout Components
  if (processContainer) {
    processContainer.innerHTML = data.processes.map(proc => `
      <div class="process-item">
        <h4 class="process-item-title">${proc.title}</h4>
        <p class="process-item-desc">${proc.desc}</p>
      </div>
    `).join('');
  }

  // Engage UI Layout Transitions via CSS State Changes
  if (modal) {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden'; // Lock main background view frame
};

// 3. INTERNAL STATIC MODAL CONTROL LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('service-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const reserveTrigger = document.getElementById('modal-reserve-trigger');
  
  // Elements linked to your down-page booking components
  const formElement = document.getElementById('valet-booking-form');
  const serviceDropdown = document.getElementById('service-select');

  function closeModal() {
    if (modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = ''; // Release view frame lock
  }

  // Close Event Triggers
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Close modal via ESC keyboard key for accessibility comfort
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Booking Auto-Selection Routing Mechanics
  if (reserveTrigger) {
    reserveTrigger.addEventListener('click', () => {
      if (serviceDropdown) {
        serviceDropdown.value = activePackageValue;
        serviceDropdown.dispatchEvent(new Event('change'));
      }
      
      closeModal();

      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});