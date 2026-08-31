import { MediaQuery } from "../global/func";
import { breakpoint, StyleClass } from "../global/settings";
import { header } from "./header";

const menu = header?.querySelector(".mobile-menu");
const products = header?.querySelector(".mobile-products");

if (menu) {
  const button = header.querySelector(".hamburger");
  const mobileProductsButton = header.querySelector(
    ".header__action-icon--products",
  );
  const desktopProductsItem = header.querySelector(".nav__item--products");
  const desktopProductsLink = desktopProductsItem?.querySelector(".nav__link");

  const productsOpenClass = "mobile-products--open";

  let productsCloseTimeout;
  let desktopMode = MediaQuery(breakpoint.laptop);

  const isDesktop = () => MediaQuery(breakpoint.laptop);
  const canHover = () => MediaQuery("(hover: hover)");

  const syncScrollLock = () => {
    const isMenuOpen = menu.classList.contains(StyleClass.mobile.open);
    const isProductsOpen =
      products?.classList.contains(productsOpenClass) && !isDesktop();

    document.body.classList.toggle(
      StyleClass.body.scroll,
      isMenuOpen || isProductsOpen,
    );
  };

  const setProductsState = (isOpen) => {
    mobileProductsButton?.setAttribute(
      "aria-expanded",
      String(isOpen && !isDesktop()),
    );

    desktopProductsLink?.setAttribute(
      "aria-expanded",
      String(isOpen && isDesktop()),
    );

    desktopProductsItem?.classList.toggle(
      StyleClass.state.active,
      isOpen && isDesktop(),
    );
  };

  const toggleMenu = (isOpen) => {
    if (isOpen && products) {
      products.classList.remove(productsOpenClass);
      products.setAttribute("aria-hidden", "true");
      setProductsState(false);
    }

    menu.classList.toggle(StyleClass.mobile.open, isOpen);
    button.classList.toggle(StyleClass.state.active, isOpen);

    menu.setAttribute("aria-hidden", String(!isOpen));
    button.setAttribute("aria-expanded", String(isOpen));

    syncScrollLock();
  };

  const toggleProducts = (isOpen) => {
    if (!products) return;

    if (isOpen) {
      menu.classList.remove(StyleClass.mobile.open);
      button.classList.remove(StyleClass.state.active);

      menu.setAttribute("aria-hidden", "true");
      button.setAttribute("aria-expanded", "false");
    }

    products.classList.toggle(productsOpenClass, isOpen);
    products.setAttribute("aria-hidden", String(!isOpen));

    setProductsState(isOpen);
    syncScrollLock();
  };

  const clearProductsClose = () => {
    clearTimeout(productsCloseTimeout);
  };

  const scheduleProductsClose = () => {
    if (!isDesktop() || !canHover()) return;

    clearProductsClose();

    productsCloseTimeout = setTimeout(() => {
      toggleProducts(false);
    }, 140);
  };

  desktopProductsItem?.addEventListener("mouseenter", () => {
    if (!isDesktop() || !canHover()) return;

    clearProductsClose();
    toggleProducts(true);
  });

  desktopProductsItem?.addEventListener("mouseleave", scheduleProductsClose);

  products?.addEventListener("mouseenter", () => {
    if (isDesktop()) {
      clearProductsClose();
    }
  });

  products?.addEventListener("mouseleave", scheduleProductsClose);

  desktopProductsLink?.addEventListener("click", (e) => {
    if (!isDesktop() || canHover()) return;

    e.preventDefault();

    const isProductsOpen = products?.classList.contains(productsOpenClass);

    toggleProducts(!isProductsOpen);
  });

  window.addEventListener("click", (e) => {
    const target = e.target;

    if (target.closest(".hamburger")) {
      const isMenuOpen = menu.classList.contains(StyleClass.mobile.open);

      toggleMenu(!isMenuOpen);
    } else if (target.closest(".header__action-icon--products")) {
      const isProductsOpen = products?.classList.contains(productsOpenClass);

      toggleProducts(!isProductsOpen);
    } else {
      if (
        menu.classList.contains(StyleClass.mobile.open) &&
        !target.closest(".mobile-menu__content")
      ) {
        toggleMenu(false);
      }

      if (
        products?.classList.contains(productsOpenClass) &&
        !target.closest(".mobile-products__content") &&
        !target.closest(".nav__item--products")
      ) {
        toggleProducts(false);
      }
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMenu(false);
      toggleProducts(false);
    }
  });

  window.addEventListener("resize", () => {
    const nextDesktopMode = isDesktop();

    if (desktopMode !== nextDesktopMode) {
      desktopMode = nextDesktopMode;

      clearProductsClose();
      toggleMenu(false);
      toggleProducts(false);
    }
  });
}
