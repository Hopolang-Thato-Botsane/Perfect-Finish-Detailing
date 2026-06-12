document.addEventListener('DOMContentLoaded', () => {
  const faqContainer = document.getElementById('faqContainer');
  if (!faqContainer) return;

  const SPREADSHEET_ID = '1pIvyrhjkGEvs8PUMS-BIho4sPoJGgAGPzoIKTpgzAlE';
  const SHEET_NAME = 'faqs';
  const CMS_ENDPOINT = `https://opensheet.elk.sh/${SPREADSHEET_ID}/${SHEET_NAME}`;

  async function initializeFaqCMS() {
    try {
      const response = await fetch(CMS_ENDPOINT);
      
      if (!response.ok) {
        throw new Error(`CMS Fetch Failure Status: ${response.status}`);
      }

      const faqData = await response.json();

      if (!Array.isArray(faqData)) {
        throw new Error('Data returned from sheet is not a valid array structure.');
      }

      faqContainer.innerHTML = '';

      faqContainer.innerHTML = faqData.map((item, index) => {
        const paddedIndex = String(index + 1).padStart(2, '0');
        const itemId = item.id || index;
        
        return `
          <div class="faq-item" id="item-${itemId}">
            <button class="faq-trigger" 
                    aria-expanded="false" 
                    aria-controls="panel-${itemId}">
              <div class="faq-number-title">
                <span class="faq-index">${paddedIndex} / </span>
                <span class="faq-question">${item.question || 'Missing Question'}</span>
              </div>
              <div class="faq-icon-wrapper" aria-hidden="true">
                <span class="icon-line horizontal"></span>
                <span class="icon-line vertical"></span>
              </div>
            </button>
            <div class="faq-panel" 
                 id="panel-${itemId}" 
                 aria-hidden="true" 
                 style="max-height: 0px;">
              <div class="faq-content-inner">
                <p>${item.answer || 'Missing Answer'}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');

      attachAccordionEventListeners();

    } catch (error) {
      console.error('⚠️ Headless CMS Integration Error:', error);
      faqContainer.innerHTML = `
        <p class="cms-error-fallback" style="color: var(--text-dim); font-size: 0.875rem; text-align: center; padding: 2rem;">
          Unable to stream live content at this time. Please refresh or check back shortly.
        </p>
      `;
    }
  }

  function attachAccordionEventListeners() {
    const triggers = faqContainer.querySelectorAll('.faq-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const currentItem = this.closest('.faq-item');
        const panel = currentItem.querySelector('.faq-panel');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherItem = otherTrigger.closest('.faq-item');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherPanel) {
            otherPanel.setAttribute('aria-hidden', 'true');
            // FIXED SYNTAX: Using strict property mapping string keys
            otherPanel.style.setProperty('max-height', '0px');
          }
        }
      });

      this.setAttribute('aria-expanded', !isExpanded);
      panel.setAttribute('aria-hidden', isExpanded);

      if (!isExpanded) {
        panel.style.setProperty('max-height', `${panel.scrollHeight}px`);
      } else {
        panel.style.setProperty('max-height', '0px');
      }
      });
    });
  }

  initializeFaqCMS();
});