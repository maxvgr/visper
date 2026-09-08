import { Swiper } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

const purposeSliders = document.querySelectorAll(".product-detail__purpose-slider");

for (const purposeSlider of purposeSliders) {
  const purposeDrawing = purposeSlider.closest(".product-detail__purpose-drawing");

  if (!purposeDrawing) {
    continue;
  }

  new Swiper(purposeSlider, {
    modules: [Navigation],

    slidesPerView: 1,
    spaceBetween: 0,
    speed: 400,
    grabCursor: true,

    navigation: {
      prevEl: purposeDrawing.querySelector(".product-detail__purpose-button--prev"),
      nextEl: purposeDrawing.querySelector(".product-detail__purpose-button--next"),
    },
  });
}
