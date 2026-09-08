import { Swiper } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

const mobileBreakpoint = 529;

const getSliderOffset = () => Math.max(16, (window.innerWidth - 1760) / 2);

const relatedSections = document.querySelectorAll(".products-related");

for (const relatedSection of relatedSections) {
  const relatedTarget = relatedSection.querySelector(".swiper");

  if (!relatedTarget) {
    continue;
  }

  let isMobile = window.innerWidth < mobileBreakpoint;
  let relatedSwiper;

  const initSlider = () => {
    const mobile = window.innerWidth < mobileBreakpoint;

    relatedSwiper = new Swiper(relatedTarget, {
      modules: [Navigation],

      slidesPerView: "auto",
      spaceBetween: mobile ? 16 : 20,
      centeredSlides: mobile,
      initialSlide: mobile ? 1 : 0,
      slidesOffsetBefore: mobile ? 0 : getSliderOffset(),
      slidesOffsetAfter: mobile ? 0 : getSliderOffset(),
      speed: 600,
      grabCursor: true,

      navigation: {
        prevEl: relatedSection.querySelector(".products-related__button--prev"),
        nextEl: relatedSection.querySelector(".products-related__button--next"),
      },
    });
  };

  initSlider();

  window.addEventListener("resize", () => {
    const mobile = window.innerWidth < mobileBreakpoint;

    if (mobile !== isMobile) {
      isMobile = mobile;

      relatedSwiper.destroy(true, true);
      initSlider();

      return;
    }

    if (!mobile) {
      const offset = getSliderOffset();

      relatedSwiper.params.slidesOffsetBefore = offset;
      relatedSwiper.params.slidesOffsetAfter = offset;
    }

    relatedSwiper.update();
  });
}