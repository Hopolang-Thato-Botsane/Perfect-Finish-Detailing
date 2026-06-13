document.addEventListener('DOMContentLoaded', () => {
  
  const PROJECT_ID = 'updvtxpq'; 
  const DATASET = 'production';
  const API_VERSION = 'v2026-06-13'; 
  
  const GROQ_QUERY = encodeURIComponent(`*[_type == "service"] | order(_createdAt asc) {
    idCode,
    title,
    cardDescription,
    overview,
    duration,
    priceSm,
    priceLg,
    "imageUrl": image.asset->url
  }`);

  const CDN_ENDPOINT = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/query/${DATASET}?query=${GROQ_QUERY}`;
  const gridContainer = document.getElementById('servicesGridContainer');

  async function compileServicesFromSanity() {
    try {
      console.log("🔗 Connecting to Sanity CDN...");
      const response = await fetch(CDN_ENDPOINT);
      if (!response.ok) throw new Error(`CDN Access Fault: ${response.status}`);
      
      const { result } = await response.json();

      if (!result || result.length === 0) {
        if (gridContainer) {
          gridContainer.innerHTML = `<p class="error-msg">No published services found. Check Sanity Studio.</p>`;
        }
        return;
      }

      if (gridContainer) gridContainer.innerHTML = '';

      result.forEach(packageData => {
        const cardElement = document.createElement('div');
        cardElement.className = 'service-card';

        cardElement.setAttribute('data-service', packageData.title);
        cardElement.setAttribute('data-pricesm', packageData.priceSm);

        const imageSource = packageData.imageUrl ? packageData.imageUrl : '';

        cardElement.innerHTML = `
          <div class="service-image-placeholder">
            ${imageSource ? `<img src="${imageSource}" alt="${packageData.title}" class="service-card-img">` : '<div class="img-fallback"></div>'}
          </div>
          
          <div class="service-content">
            <h3 class="service-title">${packageData.title ? packageData.title.toUpperCase() : 'UNTITLED PACKAGE'}</h3>
            <p class="service-description">${packageData.cardDescription || ''}</p>
            
            <div class="service-footer">
              <span class="action-text">FROM ${packageData.priceSm || 'TBD'} — VIEW DETAILS</span>
            </div>
          </div>
        `;

        if (gridContainer) gridContainer.appendChild(cardElement);
      });

      console.log("✅ Dynamic cards successfully rendered!");
      initializeFormInteractions();

    } catch (error) {
      console.error("❌ Frontend Grid Engine Fault:", error);
      if (gridContainer) {
        gridContainer.innerHTML = `<p class="error-msg">Failed to connect to database. Please refresh.</p>`;
      }
    }
  }

  function initializeFormInteractions() {
    const bookingModal = document.getElementById('bookingModal');
    const serviceInputLock = document.getElementById('formSelectedService');
    const priceInputLock = document.getElementById('formSelectedPrice');
    const actionCards = document.querySelectorAll('.service-card');

    actionCards.forEach(card => {
      card.addEventListener('click', () => {
        const capturedService = card.getAttribute('data-service');
        const capturedPrice = card.getAttribute('data-pricesm');

        if (serviceInputLock) serviceInputLock.value = capturedService;
        if (priceInputLock) priceInputLock.value = `From ${capturedPrice}`;

        if (bookingModal) bookingModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
      });
    });
  }

  compileServicesFromSanity();
});

document.addEventListener('DOMContentLoaded', () => {
  
  const faqDataset = [
    {
      "id": "faq-1",
      "question": "How long do your detailing packages take to complete?",
      "answer": "Because we operate strictly on an editorial, quality-first basis, our packages cannot be rushed. An Enhancement Valet typically requires 2 to 3 full days of clear coat refinement, while our Interior Matte Sanitization cycles take between 5 to 7 hours of dedicated thermal decontamination."
    },
    {
      "id": "faq-2",
      "question": "What is the difference between a standard car wash and your services?",
      "answer": "Standard car washes use aggressive chemical stripping agents, recycled gritty water, and high-volume brushed assembly lines that actively inflict micro-scratches and wash haze. Perfect Finish Detail uses multi-stage decontamination sequences with 4-stage deionized filtered water, non-contact thermal steam, and single-pass dual-action jeweling polishers to safely correct and protect paintwork."
    },
    {
      "id": "faq-3",
      "question": "Will the single-stage paint clarification remove deep scratches?",
      "answer": "Our single-stage clarification process is engineered to safely permanently eliminate up to 60% of superficial micro-scratches, wash-hazing, and oxidation. Deep scratches that have fully penetrated the top clear coat layer down to the primer will require a specialized multi-stage correction pass or spot wet-sanding."
    },
    {
      "id": "faq-4",
      "question": "Why do you emphasize a true factory-matte finish for interiors?",
      "answer": "Cheap detailing silicone dressings leave behind a greasy, high-gloss residue that actively attracts South African road dust, reflects blinding sunlight off the dashboard, and traps body oils. We use premium, zero-gloss UV protective conditioning agents that restore surfaces to their original, sterile, non-slip matte appearance."
    },
    {
      "id": "faq-5",
      "question": "How do your vehicle footprint categories work?",
      "answer": "The Reality: To keep our pricing completely transparent, we split vehicles into a simple binary footprint matrix. Small to Medium Footprints encompass hatchbacks, sedans, and single-cab bakkies. Large Footprints include crossovers, compact/full-size SUVs, and double-cab bakkies, carrying a flat +R450 surcharge to account for the massive increase in surface area and chemical volume required."
    },
    {
      "id": "faq-6",
      "question": "Do you accept drive-in bookings, or is it appointment only?",
      "answer": "The Reality: We operate strictly on an advanced appointment-only framework. Because we limit our studio capacity to ensure unhurried focus on one vehicle at a time, we do not accommodate drive-ins. Bookings must be secured in advance through our digital routing form, allowing us to prep the specific chemical arrays your vehicle requires before it arrives."
    }
  ];

  const accordionStack = document.getElementById('faqAccordionStack');

  function renderFaqAccordion() {
    if (!accordionStack) return;
    accordionStack.innerHTML = '';

    faqDataset.forEach((item, index) => {

      const displayIndex = String(index + 1).padStart(2, '0');

      let finalAnswerHTML = item.answer;
      if (finalAnswerHTML.startsWith("The Reality:")) {
        finalAnswerHTML = finalAnswerHTML.replace(
          "The Reality:", 
          `<span class="reality-lead">The Reality:</span>`
        );
      }

      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      
      faqItem.innerHTML = `
        <button class="faq-trigger" aria-expanded="false">
          <div class="faq-number-title">
            <span class="faq-index">${displayIndex}</span>
            <span class="faq-question">${item.question}</span>
          </div>
          <div class="faq-icon-wrapper">
            <span class="icon-line horizontal"></span>
            <span class="icon-line vertical"></span>
          </div>
        </button>
        <div class="faq-panel">
          <div class="faq-content-inner">
            <p>${finalAnswerHTML}</p>
          </div>
        </div>
      `;

      accordionStack.appendChild(faqItem);
    });

    attachAccordionInteractionListeners();
  }

  function attachAccordionInteractionListeners() {
    const triggers = document.querySelectorAll('.faq-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const parentItem = trigger.parentElement;
        const panel = trigger.nextElementSibling;
        const isOpen = parentItem.classList.contains('is-open');

        document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== parentItem) {
            item.classList.remove('is-open');
            item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            item.querySelector('.faq-panel').style.maxHeight = null;
          }
        });

        if (isOpen) {
          parentItem.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          parentItem.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  renderFaqAccordion();
});

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Raw Structured FAQ Dataset (Local Cache Blueprint)
  const faqDataset = [
    {
      "id": "faq-1",
      "question": "How long do your detailing packages take to complete?",
      "answer": "Because we operate strictly on an editorial, quality-first basis, our packages cannot be rushed. An Enhancement Valet typically requires 2 to 3 full days of clear coat refinement, while our Interior Matte Sanitization cycles take between 5 to 7 hours of dedicated thermal decontamination."
    },
    {
      "id": "faq-2",
      "question": "What is the difference between a standard car wash and your services?",
      "answer": "Standard car washes use aggressive chemical stripping agents, recycled gritty water, and high-volume brushed assembly lines that actively inflict micro-scratches and wash haze. Perfect Finish Detail uses multi-stage decontamination sequences with 4-stage deionized filtered water, non-contact thermal steam, and single-pass dual-action jeweling polishers to safely correct and protect paintwork."
    },
    {
      "id": "faq-3",
      "question": "Will the single-stage paint clarification remove deep scratches?",
      "answer": "Our single-stage clarification process is engineered to safely permanently eliminate up to 60% of superficial micro-scratches, wash-hazing, and oxidation. Deep scratches that have fully penetrated the top clear coat layer down to the primer will require a specialized multi-stage correction pass or spot wet-sanding."
    },
    {
      "id": "faq-4",
      "question": "Why do you emphasize a true factory-matte finish for interiors?",
      "answer": "Cheap detailing silicone dressings leave behind a greasy, high-gloss residue that actively attracts South African road dust, reflects blinding sunlight off the dashboard, and traps body oils. We use premium, zero-gloss UV protective conditioning agents that restore surfaces to their original, sterile, non-slip matte appearance."
    },
    {
      "id": "faq-5",
      "question": "How do your vehicle footprint categories work?",
      "answer": "The Reality: To keep our pricing completely transparent, we split vehicles into a simple binary footprint matrix. Small to Medium Footprints encompass hatchbacks, sedans, and single-cab bakkies. Large Footprints include crossovers, compact/full-size SUVs, and double-cab bakkies, carrying a flat +R450 surcharge to account for the massive increase in surface area and chemical volume required."
    },
    {
      "id": "faq-6",
      "question": "Do you accept drive-in bookings, or is it appointment only?",
      "answer": "The Reality: We operate strictly on an advanced appointment-only framework. Because we limit our studio capacity to ensure unhurried focus on one vehicle at a time, we do not accommodate drive-ins. Bookings must be secured in advance through our digital routing form, allowing us to prep the specific chemical arrays your vehicle requires before it arrives."
    }
  ];

  const accordionStack = document.getElementById('faqAccordionStack');

  function renderFaqAccordion() {
    if (!accordionStack) return;
    accordionStack.innerHTML = '';

    faqDataset.forEach((item, index) => {
      const displayIndex = String(index + 1).padStart(2, '0');
      
      let finalAnswerHTML = item.answer;
      if (finalAnswerHTML.startsWith("The Reality:")) {
        finalAnswerHTML = finalAnswerHTML.replace(
          "The Reality:", 
          `<span class="reality-lead">The Reality:</span>`
        );
      }

      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      
      faqItem.innerHTML = `
        <button class="faq-trigger" aria-expanded="false">
          <div class="faq-number-title">
            <span class="faq-index">${displayIndex}</span>
            <span class="faq-question">${item.question}</span>
          </div>
          <div class="faq-icon-wrapper">
            <span class="icon-line horizontal"></span>
            <span class="icon-line vertical"></span>
          </div>
        </button>
        <div class="faq-panel">
          <div class="faq-content-inner">
            <p>${finalAnswerHTML}</p>
          </div>
        </div>
      `;

      accordionStack.appendChild(faqItem);
    });

    attachAccordionInteractionListeners();
  }

  function attachAccordionInteractionListeners() {
    const triggers = document.querySelectorAll('.faq-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const parentItem = trigger.parentElement;
        const panel = trigger.nextElementSibling;
        const isOpen = parentItem.classList.contains('is-open');

        document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== parentItem) {
            item.classList.remove('is-open');
            item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            item.querySelector('.faq-panel').style.maxHeight = null;
          }
        });

        if (isOpen) {
          parentItem.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          parentItem.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    });
  }

  renderFaqAccordion();
});