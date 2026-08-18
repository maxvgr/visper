import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, EffectCreative } from "swiper/modules";

const heroSlider = document.querySelector("#cp-home-hero .hero");
const heroTarget = heroSlider?.querySelector(".swiper");

if (heroTarget) {
  new Swiper(heroTarget, {
    modules: [Navigation, Pagination],

    slidesPerView: 1,
    spaceBetween: 20,
    speed: 600,
    grabCursor: true,

    navigation: {
      prevEl: heroSlider.querySelector(".swiper-button-prev"),
      nextEl: heroSlider.querySelector(".swiper-button-next"),
    },

    // pagination: {
    //   el: heroSlider.querySelector(".swiper-pagination"),
    //   type: "fraction",
    // },

    pagination: {
      el: heroSlider.querySelector(".swiper-pagination-bullets"), // графическая пагинация (точки)
      clickable: true,
      type: "bullets",
    },

    // дополнительная числовая пагинация — реализуем через кастомный рендер
    on: {
      init: function () {
        updateNumericPagination(this);
      },
      slideChange: function () {
        updateNumericPagination(this);
      },
    },
  });

  function updateNumericPagination(swiper) {
    const numericPagination = document.querySelector(
      ".swiper-pagination-numeric",
    );
    numericPagination.textContent = `${swiper.realIndex + 1} / ${swiper.slides.length}`;
  }
}
