import { Swiper } from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

const aboutHero = document.querySelector("#cp-about-hero");

if (aboutHero) {
  const sliderTarget = aboutHero.querySelector(".about-hero__slider");
  const counter = aboutHero.querySelector(".about-hero__counter");

  if (sliderTarget) {
    const slides = sliderTarget.querySelectorAll(".swiper-slide");

    if (slides.length > 1) {
      new Swiper(sliderTarget, {
        modules: [Navigation],

        slidesPerView: 1,
        spaceBetween: 16,
        speed: 600,
        grabCursor: true,

        navigation: {
          prevEl: aboutHero.querySelector(
            ".about-hero__navigation-button--prev",
          ),
          nextEl: aboutHero.querySelector(
            ".about-hero__navigation-button--next",
          ),
        },

        on: {
          init(swiper) {
            if (counter) {
              counter.textContent = `${swiper.activeIndex + 1} / ${swiper.slides.length}`;
            }
          },

          slideChange(swiper) {
            if (counter) {
              counter.textContent = `${swiper.activeIndex + 1} / ${swiper.slides.length}`;
            }
          },
        },
      });
    }
  }

  const stats = aboutHero.querySelector(".about-hero__stats");
  const counters = [...aboutHero.querySelectorAll("[data-counter]")];

  if (stats && counters.length > 0) {
    const duration = 1000;

    const animateCounter = (element) => {
      const target = Number(element.dataset.counter);

      if (!Number.isFinite(target)) return;

      const startedAt = performance.now();

      const update = (currentTime) => {
        const elapsed = currentTime - startedAt;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * easedProgress);

        element.textContent = `${value}+`;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) return;

        for (const counterElement of counters) {
          counterElement.textContent = "0+";
          animateCounter(counterElement);
        }

        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(stats);
  }
}

const aboutRegions = document.querySelector("#cp-about-regions");

if (aboutRegions) {
  const points = aboutRegions.querySelectorAll(
    ".about-regions__point[data-region]",
  );
  const tooltip = aboutRegions.querySelector(".about-regions__tooltip");
  const tooltipTitle = aboutRegions.querySelector(
    ".about-regions__tooltip-title",
  );
  const tooltipValue = aboutRegions.querySelector(
    ".about-regions__tooltip-value",
  );
  const tooltipLabel = aboutRegions.querySelector(
    ".about-regions__tooltip-label",
  );

  const showTooltip = (point) => {
    if (!tooltip || !tooltipTitle || !tooltipValue || !tooltipLabel) return;

    tooltipTitle.textContent = point.dataset.region;
    tooltipValue.textContent = point.dataset.value;
    tooltipLabel.textContent = point.dataset.label;

    tooltip.style.left = `${point.offsetLeft + 18}px`;
    tooltip.style.top = `${point.offsetTop - 115}px`;

    point.classList.add("is-active");
    tooltip.classList.add("is-visible");
  };

  const hideTooltip = (point) => {
    point.classList.remove("is-active");
    tooltip?.classList.remove("is-visible");
  };

  for (const point of points) {
    point.addEventListener("mouseenter", () => showTooltip(point));
    point.addEventListener("mouseleave", () => hideTooltip(point));
    point.addEventListener("focus", () => showTooltip(point));
    point.addEventListener("blur", () => hideTooltip(point));
  }
}

const aboutProjects = document.querySelector("#cp-about-projects");

if (aboutProjects) {
  const projects = aboutProjects.querySelector(".about-projects");
  const list = aboutProjects.querySelector(".about-projects__list");
  const items = [...aboutProjects.querySelectorAll(".about-projects__item")];
  const media = aboutProjects.querySelector(".about-projects__media");
  const image = aboutProjects.querySelector(".about-projects__image");
  const description = aboutProjects.querySelector(
    ".about-projects__description",
  );
  const mobileProjects = window.matchMedia("(max-width: 815px)");

  const placeMedia = (item) => {
    if (!projects || !list || !media || !item) return;

    if (mobileProjects.matches) {
      item.after(media);
    } else {
      list.before(media);
    }
  };

  const setProject = (item) => {
    const imagePath = item.dataset.image;
    const projectDescription = item.dataset.description;

    for (const projectItem of items) {
      const isActive = projectItem === item;

      projectItem.classList.toggle("is-active", isActive);
      projectItem.setAttribute("aria-pressed", String(isActive));
    }

    if (image && imagePath) {
      image.dataset.src = imagePath;
      image.src = imagePath;
    }

    if (description && projectDescription) {
      description.textContent = projectDescription;
    }

    placeMedia(item);
  };

  for (const item of items) {
    item.addEventListener("click", () => setProject(item));
  }

  const activeItem = items.find((item) => item.classList.contains("is-active"));

  placeMedia(activeItem);

  mobileProjects.addEventListener("change", () => {
    const currentItem = items.find((item) =>
      item.classList.contains("is-active"),
    );

    placeMedia(currentItem);
  });
}

const aboutReviews = document.querySelector("#cp-about-reviews");

if (aboutReviews) {
  const sliderTarget = aboutReviews.querySelector(".about-reviews__slider");
  const counter = aboutReviews.querySelector(".about-reviews__counter");

  const updateCounter = (swiper) => {
    if (counter) {
      counter.textContent = `${swiper.snapIndex + 1} / ${swiper.snapGrid.length}`;
    }
  };

  if (sliderTarget) {
    new Swiper(sliderTarget, {
      modules: [Navigation],

      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 16,

      breakpoints: {
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 20,
        },

        1200: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 20,
        },
      },
      speed: 600,
      grabCursor: true,

      navigation: {
        prevEl: aboutReviews.querySelector(
          ".about-reviews__navigation-button--prev",
        ),
        nextEl: aboutReviews.querySelector(
          ".about-reviews__navigation-button--next",
        ),
      },

      on: {
        init(swiper) {
          updateCounter(swiper);
        },

        slideChange(swiper) {
          updateCounter(swiper);
        },
      },
    });
  }
}
