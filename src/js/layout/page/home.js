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

if (switchTarget) {
  new Swiper(switchTarget, {
    modules: [Navigation, Pagination, Autoplay],

    slidesPerView: 2.2,
    centeredSlides: true, // центральный слайд по центру
    spaceBetween: 30,

    speed: 600,
    grabCursor: true,

    breakpoints: {
      540: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },

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

// Time Line
document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#cp-home-about");

  if (!section) return;

  const indicator = section.querySelector(".timeline-indicator");
  const points = [...section.querySelectorAll(".timeline-point")];
  const timeline = section.querySelector(".timeline-container");

  if (!indicator || points.length === 0 || !timeline) return;

  const rootStyles = getComputedStyle(document.documentElement);
  const tabletBreakpoint = Number.parseFloat(
    rootStyles.getPropertyValue("--bp-tablet"),
  );
  const mobileBreakpoint = Number.parseFloat(
    rootStyles.getPropertyValue("--bp-mobile"),
  );

  const snapRadius = 35;
  const releaseRadius = 75;

  let pointPositions = [];
  let firstPoint = 0;
  let lastPoint = 0;
  let currentPosition = 0;
  let targetPosition = 0;
  let activeSnapIndex = -1;
  let animationFrame;

  const layoutTimeline = () => {
    const isTablet = window.innerWidth < tabletBreakpoint;
    const isMobile = window.innerWidth < mobileBreakpoint;

    if (isTablet) {
      const pointGap = 40;
      const bottomSpacing = isMobile ? 98 : 110;

      let pointTop = 0;

      for (const point of points) {
        point.style.position = "absolute";
        point.style.top = `${pointTop}px`;

        const content = point.querySelector(".timeline-content");

        if (!content) continue;

        const contentStyles = getComputedStyle(content);
        const contentTop = Number.parseFloat(contentStyles.marginTop) || 0;

        pointTop += contentTop + content.offsetHeight + pointGap;
      }

      const lastPointElement = points.at(-1);
      const lastContent = lastPointElement.querySelector(".timeline-content");

      if (lastContent) {
        const lastContentStyles = getComputedStyle(lastContent);
        const lastContentTop =
          Number.parseFloat(lastContentStyles.marginTop) || 0;

        const lastContentBottom =
          lastPointElement.offsetTop +
          lastContentTop +
          lastContent.offsetHeight;

        timeline.style.height = `${lastContentBottom + bottomSpacing}px`;
      }
    } else {
      const spacing = 200;
      const neededHeight = spacing * (points.length - 1) + 250;

      timeline.style.height = `${neededHeight}px`;

      for (const [i, point] of points.entries()) {
        point.style.position = "absolute";
        point.style.top = `${spacing * i}px`;
      }
    }

    pointPositions = points.map((point) => point.offsetTop);
    firstPoint = pointPositions[0];
    lastPoint = pointPositions.at(-1);
  };

  const getTargetPosition = () => {
    const timelineRect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const rawPosition = viewportCenter - timelineRect.top;

    const clampedPosition = Math.min(
      Math.max(rawPosition, firstPoint),
      lastPoint,
    );

    if (activeSnapIndex >= 0) {
      const snappedPosition = pointPositions[activeSnapIndex];
      const distanceFromSnap = Math.abs(clampedPosition - snappedPosition);

      if (distanceFromSnap <= releaseRadius) {
        targetPosition = snappedPosition;
        return;
      }

      activeSnapIndex = -1;
    }

    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const [index, pointPosition] of pointPositions.entries()) {
      const distance = Math.abs(clampedPosition - pointPosition);

      if (distance < nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    }

    if (nearestDistance <= snapRadius) {
      activeSnapIndex = nearestIndex;
      targetPosition = pointPositions[nearestIndex];
      return;
    }

    targetPosition = clampedPosition;
  };

  const animateIndicator = () => {
    const difference = targetPosition - currentPosition;

    currentPosition += difference * 0.14;

    currentPosition =
      Math.abs(difference) < 0.1 ? targetPosition : currentPosition;

    indicator.style.top = `${currentPosition}px`;

    animationFrame =
      Math.abs(targetPosition - currentPosition) > 0.1
        ? requestAnimationFrame(animateIndicator)
        : undefined;
  };

  const updateIndicator = () => {
    getTargetPosition();

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animateIndicator);
    }
  };

  layoutTimeline();
  getTargetPosition();

  currentPosition = targetPosition;
  indicator.style.top = `${currentPosition}px`;

  window.addEventListener("scroll", updateIndicator, {
    passive: true,
  });

  window.addEventListener(
    "resize",
    () => {
      layoutTimeline();
      updateIndicator();
    },
    {
      passive: true,
    },
  );
});

const newsSlider = document.querySelector("#cp-home-news");
const newsTarget = newsSlider?.querySelector(".swiper");

if (newsTarget) {
  const newsSwiper = new Swiper(newsTarget, {
    modules: [Navigation, Pagination],

    slidesPerView: "auto",
    spaceBetween: 20,
    slidesOffsetAfter: newsTarget.clientWidth / 3,
    speed: 600,
    grabCursor: true,
    centeredSlides: false,

    navigation: {
      prevEl: newsSlider.querySelector(".swiper-button-prev"),
      nextEl: newsSlider.querySelector(".swiper-button-next"),
    },

    pagination: {
      el: newsSlider.querySelector(".swiper-pagination"),
      type: "fraction",
    },
  });

  window.addEventListener("resize", () => {
    newsSwiper.params.slidesOffsetAfter = newsTarget.clientWidth / 3;
    newsSwiper.update();
  });
}
