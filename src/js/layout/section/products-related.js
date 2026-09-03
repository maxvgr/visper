import { Swiper } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

// const getSliderOffset = () => Math.max(16, (window.innerWidth - 1760) / 2);

const getSliderOffset = () => {
  if (window.innerWidth < 529) {
    return (window.innerWidth - 173) / 2;
  }

  return Math.max(16, (window.innerWidth - 1760) / 2);
};

const relatedSections = document.querySelectorAll(".products-related");

for (const relatedSection of relatedSections) {
  const relatedTarget = relatedSection.querySelector(".swiper");

  if (!relatedTarget) {
    continue;
  }

  const relatedSwiper = new Swiper(relatedTarget, {
    modules: [Navigation],

    slidesPerView: "auto",
    spaceBetween: 16,
    slidesOffsetBefore: getSliderOffset(),
    slidesOffsetAfter: getSliderOffset(),
    speed: 600,
    grabCursor: true,

    breakpoints: {
      529: {
        spaceBetween: 20,
      },
    },

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
