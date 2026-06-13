document.addEventListener('DOMContentLoaded', () => {
  
  const PROJECT_ID = 'updvtxpq'; 
  const DATASET = 'production';
  const API_VERSION = 'v2026-06-13'; 

  let runtimeServicesCache = [];
  
  let bookingServicesList = [];
  let bookingVehiclesList = [];

  const QUERY = encodeURIComponent(`{
    "hero": *[_type == "hero"][0]{
      branding,
      locationMarker,
      mainHeading,
      "bgUrl": backgroundImage.asset->url
    },
    "services": *[_type == "service"] | order(_createdAt asc) {
      idCode,
      title,
      cardDescription,
      overview,
      duration,
      highlights,
      priceSm,
      priceLg,
      "imageUrl": image.asset->url,
      processes[] {
        title,
        desc
      }
    },
    "faqs": *[_type == "faq"] | order(orderWeight asc) {
      _id,
      question,
      answer
    },
    "bookingConfig": *[_type == "bookingConfig"][0]{
      whatsappNumber,
      services,
      vehicles
    }
  }`);
  
  const URL = `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/query/${DATASET}?query=${QUERY}`;

  async function runPortfolioEngine() {
    try {
      const response = await fetch(URL);
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

      const { result } = await response.json();
      if (!result) return;

      if (result.hero) renderHeroSection(result.hero);
      
      if (result.services && result.services.length > 0) {
        runtimeServicesCache = result.services;
        renderServicesGrid(result.services);
      }

      if (result.faqs && result.faqs.length > 0) {
        renderFaqAccordion(result.faqs);
      }

      if (result.bookingConfig) {
        initializeBookingEngine(result.bookingConfig);
      }

      setupModalInteractions();
      setupScrollReveal();

    } catch (networkError) {
      console.error("❌ Critical Portfolio Engine Fault:", networkError);
    }
  }

  function renderHeroSection(heroData) {
    const heroAssetContainer = document.getElementById('heroAssetContainer');
    const brandingNode = document.getElementById('heroBrandingNode');
    const locationNode = document.getElementById('heroLocationNode');
    const titleNode = document.getElementById('heroTitleNode');

    if (heroAssetContainer && heroData.bgUrl) heroAssetContainer.style.backgroundImage = `url('${heroData.bgUrl}')`;
    if (brandingNode && heroData.branding) brandingNode.innerHTML = heroData.branding.replace(/\n/g, '<br>');
    if (locationNode) locationNode.textContent = heroData.locationMarker || '';
    if (titleNode && heroData.mainHeading) titleNode.innerHTML = heroData.mainHeading.replace(/\n/g, '<br>');
  }

  function renderServicesGrid(servicesArray) {
    const gridContainer = document.getElementById('servicesGridContainer');
    if (!gridContainer) return;
    gridContainer.innerHTML = ''; 

    servicesArray.forEach(packageData => {
      const cardElement = document.createElement('div');
      cardElement.className = 'service-card';
      cardElement.setAttribute('data-package-id', packageData.idCode || packageData.title);
      
      const imageSource = packageData.imageUrl ? packageData.imageUrl : '';

      cardElement.innerHTML = `
        <div class="service-image-placeholder">
          ${imageSource ? `<img src="${imageSource}" alt="${packageData.title}" class="service-card-img">` : ''}
        </div>
        <div class="service-content-body">
          <h3 class="service-title">${packageData.title || 'UNTITLED PACKAGE'}</h3>
          <p class="service-description">${packageData.cardDescription || ''}</p>
        </div>
        <div class="service-footer-line"></div>
        <div class="service-action-row">
          <span class="action-text">FROM ${packageData.priceSm || 'TBD'} — VIEW DETAILS</span>
        </div>
      `;

      gridContainer.appendChild(cardElement);
    });
  }

  function setupModalInteractions() {
    const gridContainer = document.getElementById('servicesGridContainer');
    const modalBackdrop = document.getElementById('packageDetailsModal');
    const closeModalTrigger = document.getElementById('closeModalTrigger');

    if (!gridContainer || !modalBackdrop) return;

    gridContainer.addEventListener('click', (event) => {
      const targetCard = event.target.closest('.service-card');
      if (!targetCard) return;

      const packageId = targetCard.getAttribute('data-package-id');
      const matchedData = runtimeServicesCache.find(p => (p.idCode || p.title) === packageId);

      if (matchedData) {
        populateModalData(matchedData);
        modalBackdrop.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });

    if (closeModalTrigger) {
      closeModalTrigger.addEventListener('click', closePackageModal);
    }

    modalBackdrop.addEventListener('click', (event) => {
      if (event.target === modalBackdrop) closePackageModal();
    });
  }

  function closePackageModal() {
    const modalBackdrop = document.getElementById('packageDetailsModal');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function populateModalData(data) {
    const heroImg = document.getElementById('modalHeroImage');
    const title = document.getElementById('modalPackageTitle');
    const desc = document.getElementById('modalPackageDescription');
    const stepsContainer = document.getElementById('modalStepsContainer');
    const highlightsList = document.getElementById('modalHighlightsList');
    const timeAlloc = document.getElementById('modalTimeAllocation');
    const pricingMatrix = document.getElementById('modalPricingMatrix');

    if (heroImg) { 
      if (data.imageUrl) {
        heroImg.src = data.imageUrl;
        heroImg.alt = data.title || '';
        heroImg.style.display = 'block';
      } else {
        heroImg.style.display = 'none';
      }
    }
    
    if (title) title.textContent = data.title || 'UNTITLED PACKAGE';
    if (desc) desc.textContent = data.overview || data.cardDescription || '';
    if (timeAlloc) timeAlloc.textContent = data.duration || 'TBD';

    if (stepsContainer) {
      stepsContainer.innerHTML = '';
      if (data.processes && data.processes.length > 0) {
        data.processes.forEach(step => {
          const stepBlock = document.createElement('div');
          stepBlock.className = 'process-item';
          stepBlock.innerHTML = `
            <h5 class="process-item-title">${step.title || ''}</h5>
            <p class="process-item-desc">${step.desc || ''}</p>
          `;
          stepsContainer.appendChild(stepBlock);
        });
      } else {
        stepsContainer.innerHTML = '<p class="process-item-desc">No process steps detailed for this package.</p>';
      }
    }

    if (highlightsList) {
      highlightsList.innerHTML = '';
      if (data.highlights && data.highlights.length > 0) {
        data.highlights.forEach(textLine => {
          const li = document.createElement('li');
          li.textContent = textLine;
          highlightsList.appendChild(li);
        });
      } else {
        highlightsList.innerHTML = '<li>No specific highlights listed</li>';
      }
    }

    if (pricingMatrix) {
      pricingMatrix.innerHTML = `
        <div class="price-tier">
          <span class="tier-label">Hatch</span>
          <span class="tier-cost">${data.priceSm || 'TBD'}</span>
        </div>
        <div class="price-tier">
          <span class="tier-label">Sedan / SUV</span>
          <span class="tier-cost">${data.priceLg || 'TBD'}</span>
        </div>
      `;
    }
  }

  function renderFaqAccordion(faqArray) {
    const container = document.getElementById('faqAccordionContainer');
    if (!container) return;

    container.innerHTML = '';

    faqArray.forEach(item => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';

      faqItem.innerHTML = `
        <button class="faq-trigger" aria-expanded="false">
          <span class="faq-question">${item.question || ''}</span>
          <div class="faq-icon-wrapper">
            <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line class="line-h" x1="5" y1="12" x2="19" y2="12" />
              <line class="line-v" x1="12" y1="5" x2="12" y2="19" />
            </svg>
          </div>
        </button>
        <div class="faq-answer-container">
          <div class="faq-answer-inner">
            <p class="faq-text">${item.answer || ''}</p>
          </div>
        </div>
      `;

      container.appendChild(faqItem);
    });

    setupFaqListeners(container);
  }

  function setupFaqListeners(container) {
    container.addEventListener('click', (event) => {
      const trigger = event.target.closest('.faq-trigger');
      if (!trigger) return;

      const currentItem = trigger.closest('.faq-item');
      const answerContainer = currentItem.querySelector('.faq-answer-container');
      const innerContent = currentItem.querySelector('.faq-answer-inner');
      const isExpanded = currentItem.classList.contains('is-expanded');

      const openItem = container.querySelector('.faq-item.is-expanded');
      if (openItem && openItem !== currentItem) {
        openItem.classList.remove('is-expanded');
        openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.faq-answer-container').style.maxHeight = '0';
      }

      if (!isExpanded) {
        currentItem.classList.add('is-expanded');
        trigger.setAttribute('aria-expanded', 'true');
        answerContainer.style.maxHeight = innerContent.scrollHeight + 'px';
      } else {
        currentItem.classList.remove('is-expanded');
        trigger.setAttribute('aria-expanded', 'false');
        answerContainer.style.maxHeight = '0';
      }
    });
  }

  function initializeBookingEngine(configData) {
    const configForm = document.getElementById("studioConfigForm");
    
    bookingServicesList = configData.services || [];
    bookingVehiclesList = configData.vehicles || [];

    if (configForm && configData.whatsappNumber) {
      configForm.setAttribute('data-phone', configData.whatsappNumber);
    }

    renderCalculationState();
    bindStepperInteractions();
    bindFormSubmission();
  }

  function renderCalculationState() {
    const serviceStepper = document.getElementById("serviceStepper");
    const vehicleStepper = document.getElementById("vehicleStepper");
    const totalDisplay = document.querySelector(".config-total-display");

    if (!serviceStepper || !vehicleStepper || !totalDisplay) return;
    if (!bookingServicesList.length || !bookingVehiclesList.length) return;

    const currentServiceIdx = parseInt(serviceStepper.dataset.index) || 0;
    const currentVehicleIdx = parseInt(vehicleStepper.dataset.index) || 0;

    serviceStepper.querySelector(".stepper-text").textContent = bookingServicesList[currentServiceIdx].name;
    vehicleStepper.querySelector(".stepper-text").textContent = bookingVehiclesList[currentVehicleIdx].name;

    const calculatedRawTotal = bookingServicesList[currentServiceIdx].basePrice + bookingVehiclesList[currentVehicleIdx].premium;
    
    totalDisplay.textContent = "R " + Math.round(calculatedRawTotal)
      .toLocaleString("en-ZA")
      .replace(/,/g, " ");
  }

  function executeStepSequence(clickEvent, targetStepperContainer, sourceDataArray) {
    let activeIndex = parseInt(targetStepperContainer.dataset.index) || 0;
    const triggerBtn = clickEvent.target;

    if (triggerBtn.classList.contains("next")) {
      activeIndex = (activeIndex + 1) % sourceDataArray.length;
    } else if (triggerBtn.classList.contains("prev")) {
      activeIndex = (activeIndex - 1 + sourceDataArray.length) % sourceDataArray.length;
    } else {
      return; 
    }

    targetStepperContainer.dataset.index = activeIndex;
    renderCalculationState();
  }

  function bindStepperInteractions() {
    const serviceStepper = document.getElementById("serviceStepper");
    const vehicleStepper = document.getElementById("vehicleStepper");

    if (serviceStepper) {
      serviceStepper.addEventListener("click", (e) => executeStepSequence(e, serviceStepper, bookingServicesList));
    }
    if (vehicleStepper) {
      vehicleStepper.addEventListener("click", (e) => executeStepSequence(e, vehicleStepper, bookingVehiclesList));
    }
  }

  function bindFormSubmission() {
    const configForm = document.getElementById("studioConfigForm");
    if (!configForm) return;

    configForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

      const serviceStepper = document.getElementById("serviceStepper");
      const vehicleStepper = document.getElementById("vehicleStepper");
      const totalDisplay = document.querySelector(".config-total-display");

      const currentServiceIdx = parseInt(serviceStepper.dataset.index) || 0;
      const currentVehicleIdx = parseInt(vehicleStepper.dataset.index) || 0;
      
      const clientName = document.getElementById("clientName")?.value || "Not Provided";
      const clientPhone = document.getElementById("clientPhone")?.value || "Not Provided";
      const detailDate = document.getElementById("detailDate")?.value || "Not Provided";
      const detailTime = document.getElementById("detailTime")?.value || "Not Provided";
      
      const selectedPackage = bookingServicesList[currentServiceIdx]?.name || "Not Selected";
      const selectedVehicleTier = bookingVehiclesList[currentVehicleIdx]?.name || "Not Selected";
      const finalPrice = totalDisplay?.textContent || "TBD";

      const messageText = 
        `*NEW SLOT RESERVATION*\n` +
        `----------------------------\n\n` +
        `*Client:* ${clientName}\n` +
        `*Contact:* ${clientPhone}\n\n` +
        `*Service:* ${selectedPackage}\n` +
        `*Vehicle:* ${selectedVehicleTier}\n\n` +
        `*Date:* ${detailDate}\n` +
        `*Time:* ${detailTime}\n\n` +
        `----------------------------\n` +
        `*Total Price:* ${finalPrice}\n\n` +
        `_Please confirm availability to lock in this booking._`;

      const whatsappNumber = configForm.getAttribute('data-phone');

      if (!whatsappNumber || whatsappNumber.includes("X")) {
        alert("Configuration Error: Booking system phone destination target missing on Dashboard.");
        return;
      }

      window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(messageText)}`, "_blank");
    });
  }

  function setupScrollReveal() {
    const faqSection = document.getElementById('faqSection');
    if (!faqSection) return;

    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          self.unobserve(entry.target); 
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(faqSection);
  }

  runPortfolioEngine();

  const yearContainer = document.getElementById('currentYearDisplay');
  if (yearContainer) {
    yearContainer.textContent = new Date().getFullYear();
  }
});