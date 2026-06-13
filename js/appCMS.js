document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Core Sanity Configuration Parameters
  const PROJECT_ID = 'updvtxpq'; 
  const DATASET = 'production';
  const API_VERSION = 'v2026-06-13'; 
  
  // Optimized GROQ Query fetching explicit card metrics and CDN image locations
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
      
      // Safety check: If the database returns nothing, show a clear message
      if (!result || result.length === 0) {
        if (gridContainer) {
          gridContainer.innerHTML = `<p class="error-msg">No published services found. Check Sanity Studio.</p>`;
        }
        return;
      }

      // Clear layout loading state from the container grid
      if (gridContainer) gridContainer.innerHTML = '';

      // 2. Process and loop through dynamic content cards straight into the grid
      result.forEach(packageData => {
        const cardElement = document.createElement('div');
        cardElement.className = 'service-card';
        
        // Stash dynamic data targets safely onto the element context for the booking modal
        cardElement.setAttribute('data-service', packageData.title);
        cardElement.setAttribute('data-pricesm', packageData.priceSm);

        // Fallback safety: If Sanity image isn't loaded yet, keep layout clean
        const imageSource = packageData.imageUrl ? packageData.imageUrl : '';

        // Clean structured markup matching your exact title and fields
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

  // 3. Appointment Form Modal Data-Binding Integration
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

