class NewsNavigation {
  constructor(root) {
    this.root = root;
    this.frameRequested = false;
    this.targetIndex = undefined;

    if (this.root) {
      this.init();
    }
  }

  init() {
    this.navigation = this.root.querySelector(".news-detail__navigation");

    if (!this.navigation) {
      return;
    }

    const links = this.navigation.querySelectorAll(
      ".news-detail__navigation-link",
    );

    this.items = [];

    for (const link of links) {
      const section = this.root.querySelector(link.hash);

      if (section) {
        this.items.push({
          link,
          section,
        });
      }
    }

    if (this.items.length === 0) {
      return;
    }

    for (const [index, item] of this.items.entries()) {
      item.link.addEventListener("click", () => {
        this.targetIndex = index;
        this.setActive(index);
      });
    }

    this.update();

    window.addEventListener(
      "scroll",
      () => {
        this.requestUpdate();
      },
      { passive: true },
    );

    window.addEventListener("resize", () => {
      this.requestUpdate();
    });
  }

  requestUpdate() {
    if (this.frameRequested) {
      return;
    }

    this.frameRequested = true;

    window.requestAnimationFrame(() => {
      this.update();
      this.frameRequested = false;
    });
  }

  update() {
    const stickyTop =
      Number.parseFloat(window.getComputedStyle(this.navigation).top) || 0;

    if (this.targetIndex !== undefined) {
      const targetTop =
        this.items[this.targetIndex].section.getBoundingClientRect().top;

      if (Math.abs(targetTop - stickyTop) > 2) {
        return;
      }

      this.targetIndex = undefined;
    }

    let activeIndex = 0;

    for (const [index, item] of this.items.entries()) {
      const sectionTop = item.section.getBoundingClientRect().top;

      if (sectionTop <= stickyTop + 1) {
        activeIndex = index;
      }
    }

    this.setActive(activeIndex);
  }

  setActive(activeIndex) {
    for (const [index, item] of this.items.entries()) {
      item.link.classList.toggle(
        "news-detail__navigation-link--active",
        index === activeIndex,
      );
    }

    const firstLink = this.items[0].link;
    const activeLink = this.items[activeIndex].link;
    const markerOffset = activeLink.offsetTop - firstLink.offsetTop;

    this.navigation.style.setProperty(
      "--news-navigation-marker-offset",
      `${markerOffset}px`,
    );
  }
}

class NewsShare {
  constructor(page) {
    this.page = page;

    if (this.page) {
      this.init();
    }
  }

  init() {
    this.page.addEventListener("click", (event) => {
      const button = event.target.closest(".news-detail__share");

      if (!button || !this.page.contains(button)) {
        return;
      }

      this.copyLink(button);
    });
  }

  async copyLink(button) {
    const article = button.closest("[data-news-url]");
    const articleUrl = article?.dataset.newsUrl || window.location.href;
    const url = new URL(articleUrl, window.location.href);

    url.hash = "";

    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(url.href);
    }
  }
}

class NewsInfinite {
  constructor(page, onArticleAdded) {
    this.page = page;
    this.onArticleAdded = onArticleAdded;
    this.articleIndex = 1;
    this.loadedUrls = new Set();

    if (this.page) {
      this.init();
    }
  }

  init() {
    const currentUrl = this.normalizeUrl(window.location.href);
    const firstArticle = this.page.querySelector(".news-detail");

    this.loadedUrls.add(currentUrl);

    if (firstArticle) {
      firstArticle.dataset.newsUrl = currentUrl;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.loadNext(entry.target);
          }
        }
      },
      {
        rootMargin: "600px 0px",
      },
    );

    const nextSection = this.page.querySelector(".news-next");

    this.observeNext(nextSection);
  }

  observeNext(section) {
    if (!section || !this.getNextUrl(section)) {
      return;
    }

    this.observer.observe(section);
  }

  getNextUrl(section, baseUrl = window.location.href) {
    const link = section.querySelector(".news-next__preview");
    const href = link?.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const url = new URL(href, baseUrl);

    url.hash = "";

    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.origin !== window.location.origin
    ) {
      return;
    }

    return url.href;
  }

  normalizeUrl(value, baseUrl = window.location.href) {
    const url = new URL(value, baseUrl);

    url.hash = "";

    return url.href;
  }

  async loadNext(section) {
    const nextUrl = this.getNextUrl(section);

    if (!nextUrl || this.loadedUrls.has(nextUrl)) {
      this.observer.unobserve(section);
      return;
    }

    this.observer.unobserve(section);
    section.dataset.newsLoading = "true";

    try {
      const response = await fetch(nextUrl);

      if (!response.ok) {
        section.dataset.newsLoading = "error";
        return;
      }

      const html = await response.text();
      const nextDocument = new DOMParser().parseFromString(html, "text/html");
      const sourcePage = nextDocument.querySelector("#sp-news");
      const sourceArticle = sourcePage?.querySelector(".news-detail");
      const sourceLayout = sourceArticle?.querySelector(".news-detail__layout");

      if (!sourceLayout) {
        section.dataset.newsLoading = "error";
        return;
      }

      this.articleIndex += 1;

      const layout = sourceLayout.cloneNode(true);

      this.prepareLayout(layout, this.articleIndex);
      this.resolveUrls(layout, nextUrl);

      section.classList.add("news-next--loaded", "news-detail");
      section.dataset.newsUrl = nextUrl;
      section.dataset.newsLoading = "complete";

      const preview = section.querySelector(".news-next__preview");

      if (preview) {
        preview.removeAttribute("href");
      }

      const container = section.querySelector(":scope > .container");

      if (!container) {
        section.dataset.newsLoading = "error";
        return;
      }

      container.append(layout);

      this.loadedUrls.add(nextUrl);
      this.onArticleAdded(section);

      const sourceNext = sourcePage?.querySelector(".news-next");

      if (sourceNext) {
        const nextSection = sourceNext.cloneNode(true);

        this.resolveUrls(nextSection, nextUrl);

        section.after(nextSection);

        window.App?.lazyImage?.update();

        this.observeNext(nextSection);
      } else {
        window.App?.lazyImage?.update();
      }
    } catch {
      section.dataset.newsLoading = "error";
    }
  }

  prepareLayout(layout, articleIndex) {
    const idMap = new Map();
    const elementsWithId = layout.querySelectorAll("[id]");

    for (const element of elementsWithId) {
      const previousId = element.id;
      const nextId = `${previousId}-${articleIndex}`;

      idMap.set(`#${previousId}`, `#${nextId}`);
      element.id = nextId;
    }

    const links = layout.querySelectorAll(".news-detail__navigation-link");

    for (const link of links) {
      const href = link.getAttribute("href");
      const nextHref = idMap.get(href);

      if (nextHref) {
        link.setAttribute("href", nextHref);
      }
    }
  }

  resolveUrls(root, baseUrl) {
    const attributes = ["href", "src", "data-src"];
    const selector = attributes.map((attribute) => `[${attribute}]`).join(",");

    const elements = root.querySelectorAll(selector);

    for (const element of elements) {
      for (const attribute of attributes) {
        const value = element.getAttribute(attribute);

        if (
          !value ||
          value.startsWith("#") ||
          value.startsWith("mailto:") ||
          value.startsWith("tel:") ||
          value.startsWith("data:")
        ) {
          continue;
        }

        element.setAttribute(attribute, new URL(value, baseUrl).href);
      }
    }
  }
}

const newsPage = document.querySelector("#sp-news");

if (newsPage) {
  const firstArticle = newsPage.querySelector(".news-detail");

  new NewsNavigation(firstArticle);
  new NewsShare(newsPage);

  new NewsInfinite(newsPage, (article) => {
    new NewsNavigation(article);
  });
}
