import { header } from "./header";
import { StyleClass } from "../global/settings";

const menu = header?.querySelector('.mobile-menu');
const products = header?.querySelector('.mobile-products');

if (menu) {
  const button = header.querySelector('.hamburger');
  const productsButton = header.querySelector('.header__action-icon--products');

  const productsOpenClass = 'mobile-products--open';

  const syncScrollLock = () => {
    const isMenuOpen = menu.classList.contains(StyleClass.mobile.open);
    const isProductsOpen = products?.classList.contains(productsOpenClass);

    document.body.classList.toggle(StyleClass.body.scroll, isMenuOpen || isProductsOpen);
  };

  const toggleMenu = (isOpen) => {
    if (isOpen && products) {
      products.classList.remove(productsOpenClass);
      products.setAttribute('aria-hidden', 'true');
      productsButton?.setAttribute('aria-expanded', 'false');
    }

    menu.classList.toggle(StyleClass.mobile.open, isOpen);
    button.classList.toggle(StyleClass.state.active, isOpen);

    menu.setAttribute('aria-hidden', String(!isOpen));
    button.setAttribute('aria-expanded', String(isOpen));

    syncScrollLock();
  };

  const toggleProducts = (isOpen) => {
    if (!products) return;

    if (isOpen) {
      menu.classList.remove(StyleClass.mobile.open);
      button.classList.remove(StyleClass.state.active);

      menu.setAttribute('aria-hidden', 'true');
      button.setAttribute('aria-expanded', 'false');
    }

    products.classList.toggle(productsOpenClass, isOpen);
    products.setAttribute('aria-hidden', String(!isOpen));
    productsButton?.setAttribute('aria-expanded', String(isOpen));

    syncScrollLock();
  };

  window.addEventListener('click', (e) => {
    const target = e.target;

    if (target.closest('.hamburger')) {
      const isMenuOpen = menu.classList.contains(StyleClass.mobile.open);

      toggleMenu(!isMenuOpen);
    } else if (target.closest('.header__action-icon--products')) {
      const isProductsOpen = products?.classList.contains(productsOpenClass);

      toggleProducts(!isProductsOpen);
    } else {
      if (
        menu.classList.contains(StyleClass.mobile.open) &&
        !target.closest('.mobile-menu__content')
      ) {
        toggleMenu(false);
      }

      if (
        products?.classList.contains(productsOpenClass) &&
        !target.closest('.mobile-products__content')
      ) {
        toggleProducts(false);
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMenu(false);
      toggleProducts(false);
    }
  });
}