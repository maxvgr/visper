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
  const items = [...aboutProjects.querySelectorAll(".about-projects__item")];
  const image = aboutProjects.querySelector(".about-projects__image");
  const description = aboutProjects.querySelector(".about-projects__description");

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
  };

  for (const item of items) {
    item.addEventListener("click", () => setProject(item));
  }
}