document.addEventListener('DOMContentLoaded', () => {

  const faqContainer = document.getElementById('faqContainer');
  
  if (!faqContainer) return;

  async function loadAndRenderFAQs() {
    try {
      let response;
      let dataLoaded = false;

      try {
        response = await fetch("./faqs-content.json");
        if (response.ok) dataLoaded = true;
      } catch (err) {
        console.log("Root fetch attempt bypassed, checking alternative paths...");
      }

      if (!dataLoaded) {
        console.warn("Primary root lookup returned 404, executing parent relative search path...");
        response = await fetch("../faqs-content.json");
        if (!response.ok) throw new Error(`Both target path tracks resolved with Status: ${response.status}`);
      }
      
      const faqData = await response.json();
      console.log("FAQ content dataset synced successfully.");
      
      faqContainer.innerHTML = faqData.map((item, index) => {

        const paddedIndex = String(index + 1).padStart(2, '0');
        
        return `
          <div class="faq-item" id="item-${item.id}">
            <button class="faq-trigger" 
                    aria-expanded="false" 
                    aria-controls="panel-${item.id}">
              <div class="faq-number-title">
                <span class="faq-index">${paddedIndex} / </span>
                <span class="faq-question">${item.question}</span>
              </div>
              <div class="faq-icon-wrapper" aria-hidden="true">
                <span class="icon-line horizontal"></span>
                <span class="icon-line vertical"></span>
              </div>
            </button>
            <div class="faq-panel" 
                 id="panel-${item.id}" 
                 aria-hidden="true" 
                 style="max-height: null;">
              <div class="faq-content-inner">
                <p>${item.answer}</p>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      // Wire interactive event loops once structural nodes populate the DOM tree
      initializeAccordionInteractions();
    } catch (error) {
      console.error("Critical Exception: Could not compile dynamic FAQ dataset:", error);
    }
  }

  function initializeAccordionInteractions() {
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const currentItem = trigger.closest('.faq-item');
        const currentPanel = currentItem.querySelector('.faq-panel');
        const isOpen = currentItem.classList.contains('is-open');

        // Mutual Exclusivity Layer (The Single-Open Rule Loop)
        document.querySelectorAll('.faq-item').forEach(item => {
          if (item !== currentItem) {
            item.classList.remove('is-open');
            
            const panel = item.querySelector('.faq-panel');
            panel.style.maxHeight = null;
            
            const button = item.querySelector('.faq-trigger');
            button.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
          }
        });

        // Toggle visibility state vectors on targeted frame entry
        if (isOpen) {
          currentItem.classList.remove('is-open');
          currentPanel.style.maxHeight = null;
          trigger.setAttribute('aria-expanded', 'false');
          currentPanel.setAttribute('aria-hidden', 'true');
        } else {
          currentItem.classList.add('is-open');
          // Dynamically compute precise content height to ensure a buttery layout animation
          currentPanel.style.maxHeight = currentPanel.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
          currentPanel.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  // Window Frame Mutex Tracking (Recalculates clear bounds during runtime resizing)
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.faq-item.is-open');
    if (activeItem) {
      const activePanel = activeItem.querySelector('.faq-panel');
      activePanel.style.maxHeight = activePanel.scrollHeight + 'px';
    }
  });

  // Launch network stream acquisition track
  loadAndRenderFAQs();
});