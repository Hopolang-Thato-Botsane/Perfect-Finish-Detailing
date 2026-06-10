document.addEventListener('DOMContentLoaded', () => {
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    
    trigger.addEventListener('click', () => {
      const currentItem = trigger.closest('.faq-item');
      const currentPanel = currentItem.querySelector('.faq-panel');
      const isOpen = currentItem.classList.contains('is-open');

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

      if (isOpen) {
        currentItem.classList.remove('is-open');
        currentPanel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
        currentPanel.setAttribute('aria-hidden', 'true');
      } else {
        currentItem.classList.add('is-open');
        currentPanel.style.maxHeight = currentPanel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
        currentPanel.setAttribute('aria-hidden', 'false');
      }
    });
  });

  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.faq-item.is-open');
    if (activeItem) {
      const activePanel = activeItem.querySelector('.faq-panel');
      activePanel.style.maxHeight = activePanel.scrollHeight + 'px';
    }
  });
});