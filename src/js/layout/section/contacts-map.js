async function initContactsMap() {
  const mapTarget = document.querySelector("#contacts-map");

  if (!mapTarget || !window.ymaps3) {
    return;
  }

  await window.ymaps3.ready;

  const {
    YMap,
    YMapDefaultSchemeLayer,
    YMapDefaultFeaturesLayer,
    YMapMarker,
  } = window.ymaps3;

  const coordinates = [30.356, 59.957];

  const map = new YMap(mapTarget, {
    location: {
      center: coordinates,
      zoom: 12,
    },
    mode: "vector",
  });

  const schemeLayer = new YMapDefaultSchemeLayer({
    customization: [
      {
        stylers: [
          {
            saturation: -1,
          },
          {
            lightness: 0.35,
          },
        ],
      },
    ],
  });

  const featuresLayer = new YMapDefaultFeaturesLayer();

  map.addChild(schemeLayer);
  map.addChild(featuresLayer);

  const markerElement = document.createElement("div");

  markerElement.className = "contacts__marker";

  markerElement.innerHTML = `
    <img
      class="contacts__marker-image"
      src="assets/images/layout/section/contacts/marker.svg"
      alt=""
    >
  `;

  const marker = new YMapMarker(
    {
      coordinates,
    },
    markerElement,
  );

  map.addChild(marker);
}

document.addEventListener("DOMContentLoaded", () => {
  initContactsMap();
});