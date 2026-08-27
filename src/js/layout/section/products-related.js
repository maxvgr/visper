import { Swiper } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

const getSliderOffset = () => Math.max(16, (window.innerWidth - 1760) / 2);

const relatedSections = document.querySelectorAll(".products-related");

for (const relatedSection of relatedSections) {
  const relatedTarget = relatedSection.querySelector(".swiper");

  if (!relatedTarget) {
    continue;
  }

  const relatedSwiper = new Swiper(relatedTarget, {
    modules: [Navigation],

    slidesPerView: "auto",
    spaceBetween: 20,
    slidesOffsetBefore: getSliderOffset(),
    slidesOffsetAfter: getSliderOffset(),
    speed: 600,
    grabCursor: true,

    navigation: {
      prevEl: relatedSection.querySelector(".products-related__button--prev"),
      nextEl: relatedSection.querySelector(".products-related__button--next"),
    },
  });

  window.addEventListener("resize", () => {
    const offset = getSliderOffset();

    relatedSwiper.params.slidesOffsetBefore = offset;
    relatedSwiper.params.slidesOffsetAfter = offset;
    relatedSwiper.update();
  });
}