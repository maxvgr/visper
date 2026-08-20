import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCreative,
} from "swiper/modules";

const heroSlider = document.querySelector("#cp-home-hero .hero");
const heroTarget = heroSlider?.querySelector(".swiper");

if (heroTarget) {
  new Swiper(heroTarget, {
    modules: [Navigation, Pagination, Autoplay],

    slidesPerView: 1,
    spaceBetween: 20,
    speed: 600,
    grabCursor: true,

    autoplay: {
      delay: 4400,
      disableOnInteraction: false,
    },

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

const switchSlider = document.querySelector("#cp-home-switch .switch");
const switchTarget = switchSlider?.querySelector(".swiper");

if (heroTarget) {
  new Swiper(switchTarget, {
    modules: [Navigation, Pagination, Autoplay],

    slidesPerView: 3, // показываем 3 слайда
    centeredSlides: true, // центральный слайд по центру
    spaceBetween: 30,
    // spaceBetween: 60,
    speed: 600,
    grabCursor: true,

    // autoplay: {
    //   delay: 4400,
    //   disableOnInteraction: false,
    // },

    navigation: {
      prevEl: switchSlider.querySelector(".swiper-button-prev"),
      nextEl: switchSlider.querySelector(".swiper-button-next"),
    },

    pagination: {
      el: switchSlider.querySelector(".swiper-pagination"),
      type: "fraction",
    },
  });
}

// document.addEventListener("DOMContentLoaded", () => {
//   const indicator = document.querySelector(".timeline-indicator");
//   const points = [...document.querySelectorAll(".timeline-point")];
//   const timeline = document.querySelector(".timeline-container");

//   if (!indicator || points.length === 0 || !timeline) {
//     console.warn("Не найдены необходимые элементы для таймлайна");
//     return;
//   }

//   // Получаем позиции точек относительно документа
//   let pointsPositions = points.map((p) => {
//     const rect = p.getBoundingClientRect();
//     return rect.top + window.pageYOffset;
//   });

//   function updateIndicator() {
//     const scrollY = window.pageYOffset + window.innerHeight / 2;
//     let closestIndex = 0;
//     let minDist = Number.POSITIVE_INFINITY;

//     for (const [i, pos] of pointsPositions.entries()) {
//       const dist = Math.abs(pos - scrollY);
//       if (dist < minDist) {
//         minDist = dist;
//         closestIndex = i;
//       }
//     }

//     // Позиция выбранной точки относительно контейнера
//     const topRelative = points[closestIndex].offsetTop;

//     indicator.style.top = topRelative + "px";
//   }

//   // Инициализируем позицию
//   updateIndicator();

//   window.addEventListener("scroll", updateIndicator);
//   window.addEventListener("resize", () => {
//     pointsPositions = points.map((p) => {
//       const rect = p.getBoundingClientRect();
//       return rect.top + window.pageYOffset;
//     });
//     updateIndicator();
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const indicator = document.querySelector(".timeline-indicator");
  const points = [...document.querySelectorAll(".timeline-point")];
  const timeline = document.querySelector(".timeline-container");

  if (!indicator || points.length === 0 || !timeline) {
    console.warn("Не найдены необходимые элементы для таймлайна");
    return;
  }

  const spacing = 200; // расстояние между точками в пикселях
  const neededHeight = spacing * (points.length - 1) + 250; // высота контейнера
  timeline.style.height = neededHeight + "px";

  // Располагаем точки
  for (const [i, point] of points.entries()) {
    point.style.position = "absolute";
    point.style.top = spacing * i + "px";
  }

  function updateIndicator() {
    const scrollY = window.pageYOffset + window.innerHeight / 2;
    let closestIndex = 0;
    let minDist = Number.POSITIVE_INFINITY;

    for (const [i, point] of points.entries()) {
      const rect = point.getBoundingClientRect();
      const pointY = rect.top + window.pageYOffset;
      const dist = Math.abs(pointY - scrollY);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    }

    const topRelative = points[closestIndex].offsetTop;
    indicator.style.top = topRelative + "px";
  }

  updateIndicator();

  window.addEventListener("scroll", updateIndicator);
  window.addEventListener("resize", updateIndicator);
});
