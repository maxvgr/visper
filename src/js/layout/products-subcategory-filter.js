const productsSubcategory = document.querySelector(
  "#ap-products-subcategory-hero",
);

if (productsSubcategory) {
  const filters = [
    ...productsSubcategory.querySelectorAll(
      ".products-subcategory__filter[data-filter]",
    ),
  ];

  const products = [
    ...productsSubcategory.querySelectorAll(
      ".products-subcategory__grid .c-product-model[data-filter]",
    ),
  ];

  const updateProducts = () => {
    const activeFilters = filters
      .filter((filter) => filter.classList.contains("is-active"))
      .map((filter) => filter.dataset.filter);

    for (const product of products) {
      product.hidden =
        activeFilters.length > 0 &&
        !activeFilters.includes(product.dataset.filter);
    }
  };

  for (const filter of filters) {
    filter.addEventListener("click", () => {
      const isActive = filter.classList.toggle("is-active");

      filter.setAttribute("aria-pressed", String(isActive));

      updateProducts();
    });
  }
}
