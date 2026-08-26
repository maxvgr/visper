class ProductsCategoryNav {
  constructor() {
    this.items = document.querySelectorAll(".products-category__navigation");

    this.init();
  }

  init() {
    for (const item of this.items) {
      let isPointerDown = false;
      let isDragging = false;
      let startX = 0;
      let startScrollLeft = 0;
      let pointerId;

      item.addEventListener("dragstart", (event) => {
        event.preventDefault();
      });

      item.addEventListener("pointerdown", (event) => {
        isPointerDown = true;
        isDragging = false;

        startX = event.clientX;
        startScrollLeft = item.scrollLeft;
        pointerId = event.pointerId;
      });

      item.addEventListener("pointermove", (event) => {
        if (!isPointerDown) return;

        const distance = event.clientX - startX;

        if (!isDragging && Math.abs(distance) > 5) {
          isDragging = true;

          item.classList.add("is-dragging");
          item.setPointerCapture(pointerId);
        }

        if (!isDragging) return;

        event.preventDefault();

        item.scrollLeft = startScrollLeft - distance;
      });

      item.addEventListener("pointerup", (event) => {
        isPointerDown = false;

        item.classList.remove("is-dragging");

        if (isDragging && item.hasPointerCapture(event.pointerId)) {
          item.releasePointerCapture(event.pointerId);
        }

        isDragging = false;
      });

      item.addEventListener("pointercancel", () => {
        isPointerDown = false;
        isDragging = false;

        item.classList.remove("is-dragging");
      });

      item.addEventListener("click", (event) => {
        if (!isDragging) return;

        event.preventDefault();
      });
    }
  }
}

new ProductsCategoryNav();