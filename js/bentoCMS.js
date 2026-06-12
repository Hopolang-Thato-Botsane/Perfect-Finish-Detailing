/**
 * ==========================================================================
 * BOUTIQUE DETAILING ENGINE - BENTO GRID HEADLESS CMS MODULE
 * Engine Architecture: Dynamic Layout Class Injector & Asset Router
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const bentoContainer = document.getElementById('bentoGridContainer');
  if (!bentoContainer) return;

  const SPREADSHEET_ID = '1pIvyrhjkGEvs8PUMS-BIho4sPoJGgAGPzoIKTpgzAlE';
  const SHEET_NAME = 'bento';
  const CMS_ENDPOINT = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_NAME}`;

  async function initializeBentoCMS() {
    try {
      const response = await fetch(CMS_ENDPOINT);
      if (!response.ok) throw new Error(`Bento CMS Fetch Error: ${response.status}`);

      const bentoData = await response.json();
      if (!Array.isArray(bentoData)) throw new Error('Invalid bento array shape.');

      bentoContainer.innerHTML = '';

      bentoContainer.innerHTML = bentoData.map((card, index) => {
        const paddedIndex = String(index + 1).padStart(2, '0') + '/';
        const layoutClass = card.layout_class || 'card-small';
        const bgImage = card.image_url || 'public/interiorBanner.jpg';
        const label = card.label || 'Boutique Detail';
        const title = card.title || 'Service Block';
        const description = card.description || 'Description pending content configuration.';

        return `
          <div class="bento-card ${layoutClass}">
            <div class="card-bg-image" style="background-image: url('${bgImage}');"></div>
            
            <div class="card-meta">
              <span class="card-index">${paddedIndex}</span>
              <span class="card-label">${label}</span>
            </div>
            
            <div class="card-main">
              <h3 class="card-title">${title}</h3>
              <p class="card-hidden-para">${description}</p>
            </div>
          </div>
        `;
      }).join('');

    } catch (error) {
      console.error('⚠️ Bento Grid CMS Bridge Failure:', error);

      bentoContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-dim);">
          <p style="font-size: 0.875rem; letter-spacing: 0.05em; uppercase;">Engine offline / structural synchronization failed.</p>
        </div>
      `;
    }
  }

  initializeBentoCMS();
});