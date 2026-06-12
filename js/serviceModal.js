let localPackageDatabase = null;
let activePackageValue = 'enhancement';

async function loadModalContentDatabase() {
  try {
    const response = await fetch("../packages-content.json");
    if (!response.ok) throw new Error(`Content JSON HTTP Error! Status: ${response.status}`);
    
    localPackageDatabase = await response.json();
    console.log("Lookbook content database synced successfully.");

    renderServiceCards();
  } catch (error) {
    console.error("Critical Exception: Could not resolve lookbook content stream:", error);
  }
}

function renderServiceCards() {
  const gridContainer = document.getElementById('servicesGridContainer');
  if (!gridContainer || !localPackageDatabase) return;

  gridContainer.innerHTML = Object.keys(localPackageDatabase).map(key => {
    const item = localPackageDatabase[key];
    return `
      <div class="service-card" onclick="window.openServiceModal('${key}')" role="button" tabindex="0" aria-label="Open ${item.title} details">
        <div class="service-image-placeholder" style="background-image: url('${item.imagePath}');"></div>
        <div class="service-content">
          <h3 class="service-title">${item.title.toUpperCase()}</h3>
          <p class="service-description">${item.cardDescription}</p>
          <div class="service-footer">
            <span class="action-text">From ${item.priceSm} — VIEW DETAILS</span>
            <span class="action-arrow">→</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openServiceModal = function(packageKey) {
  if (!localPackageDatabase) return;

  const modal = document.getElementById('service-modal');
  const packageTitle = document.getElementById('modal-package-title');
  const packageOverview = document.getElementById('modal-package-overview');
  const heroImg = document.getElementById('modal-hero-img');
  const processContainer = document.getElementById('modal-process-container');
  const highlightsList = document.getElementById('modal-highlights-list');
  const durationVal = document.getElementById('modal-duration-val');
  const priceSmVal = document.getElementById('price-sm-val');
  const priceLgVal = document.getElementById('price-lg-val');

  const data = localPackageDatabase[packageKey];
  if (!data) return;

  activePackageValue = packageKey;

  packageTitle.textContent = data.title;
  packageOverview.textContent = data.overview;
  if (heroImg) heroImg.style.backgroundImage = `url('${data.imagePath}')`;
  if (durationVal) durationVal.textContent = data.duration;
  if (priceSmVal) priceSmVal.textContent = data.priceSm;
  if (priceLgVal) priceLgVal.textContent = data.priceLg;

  if (highlightsList) {
    highlightsList.innerHTML = data.highlights.map(item => `<li>${item}</li>`).join('');
  }

  if (processContainer) {
    processContainer.innerHTML = data.processes.map(proc => `
      <div class="process-item">
        <h4 class="process-item-title">${proc.title}</h4>
        <p class="process-item-desc">${proc.desc}</p>
      </div>
    `).join('');
  }

  if (modal) {
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden'; 
};

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('service-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const reserveTrigger = document.getElementById('modal-reserve-trigger');
  const configForm = document.getElementById('studioConfigForm');
  const serviceStepper = document.getElementById('serviceStepper');

  loadModalContentDatabase();

  function closeModal() {
    if (modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = ''; 
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });

  if (reserveTrigger) {
    reserveTrigger.addEventListener('click', () => {
      if (serviceStepper) {
        if (activePackageValue === 'enhancement') {
          serviceStepper.dataset.index = 1; 
        } else if (activePackageValue === 'interior') {
          serviceStepper.dataset.index = 0; 
        }

        if (typeof window.renderCalculationState === 'function') {
          window.renderCalculationState();
        }
      }
      
      closeModal();

      if (configForm) {
        configForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});