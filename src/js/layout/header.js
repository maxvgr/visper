import { SetSize } from "../global/func";

export const header = document.querySelector('#header');

if (header) {
  const emailTriggers = header.querySelectorAll('[data-modal-open="write-us"]');

  const toggleEmailActive = (isActive) => {
    for (const trigger of emailTriggers) {
      trigger.classList.toggle('is-active', isActive);
    }
  };

  SetSize(header, 'header');

  window.addEventListener('modalOpened', (event) => {
    if (event.detail.modalId === 'write-us') {
      toggleEmailActive(true);
    }
  });

  window.addEventListener('modalClosed', (event) => {
    if (event.detail.modal?.dataset.modal === 'write-us') {
      toggleEmailActive(false);
    }
  });

  window.addEventListener('resize', () => {
    SetSize(header, 'header');
  });
}