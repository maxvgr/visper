import { SetSize } from "../global/func";

export const header = document.querySelector('#header');

if (header) {
  const emailTriggers = header.querySelectorAll('[data-modal-open="write-us"]');
  const callbackTriggers = header.querySelectorAll('[data-modal-open="callback"]');

  const toggleTriggersActive = (triggers, isActive) => {
    for (const trigger of triggers) {
      trigger.classList.toggle('is-active', isActive);
    }
  };

  SetSize(header, 'header');

  window.addEventListener('modalOpened', (event) => {
    if (event.detail.modalId === 'write-us') {
      toggleTriggersActive(emailTriggers, true);
    }

    if (event.detail.modalId === 'callback') {
      toggleTriggersActive(callbackTriggers, true);
    }
  });

  window.addEventListener('modalClosed', (event) => {
    const modalId = event.detail.modal?.dataset.modal;

    if (modalId === 'write-us') {
      toggleTriggersActive(emailTriggers, false);
    }

    if (modalId === 'callback') {
      toggleTriggersActive(callbackTriggers, false);
    }
  });

  window.addEventListener('resize', () => {
    SetSize(header, 'header');
  });
}