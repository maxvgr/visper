class ProductsCategoryNav {
  constructor() {
    this.items = document.querySelectorAll(".products-category__navigation");

    this.init();
  }

  init() {
    for (const item of this.items) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      item.addEventListener("mousedown", (event) => {
        isDown = true;
        startX = event.pageX - item.offsetLeft;
        scrollLeft = item.scrollLeft;

        item.classList.add("is-dragging");
      });

      item.addEventListener("mouseleave", () => {
        isDown = false;
        item.classList.remove("is-dragging");
      });

      item.addEventListener("mouseup", () => {
        isDown = false;
        item.classList.remove("is-dragging");
      });

      item.addEventListener("mousemove", (event) => {
        if (!isDown) return;

        event.preventDefault();

        const x = event.pageX - item.offsetLeft;
        const walk = x - startX;

        item.scrollLeft = scrollLeft - walk;
      });
    }
  }
}

export default ProductsCategoryNav;
