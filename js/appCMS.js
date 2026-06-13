document.addEventListener('DOMContentLoaded', () => {
  
  const PROJECT_ID = 'updvtxpq'; 
  const DATASET = 'production';
  const API_VERSION = 'v2026-06-13'; 

  let runtimeServicesCache = [];

  // FIXED: Query updated to match your exact services.js schema field names
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

      setupModalInteractions();

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

  // FIXED: Data bindings mapped accurately to match schema array structures
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

    // Processes loop updated to map to step.title and step.desc
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

    // Highlights list loop updated to read data.highlights
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

    // Pricing Matrix aligned with your binary tier properties (priceSm & priceLg)
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

  runPortfolioEngine();
});