async function initContactsMap() {
  const mapTarget = document.querySelector("#contacts-map");

  if (!mapTarget || !window.ymaps3) {
    return;
  }

  await window.ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } =
    window.ymaps3;

  const coordinates = [30.3718, 59.9564];

  const map = new YMap(mapTarget, {
    location: {
      center: coordinates,
      zoom: 12,
    },
  });

  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(new YMapDefaultFeaturesLayer());

  const markerElement = document.createElement("div");

  markerElement.className = "contacts__marker";
  markerElement.innerHTML = `
    <img
      class="contacts__marker-image"
      src="assets/images/marker.svg"
      alt=""
    >
  `;

  map.addChild(
    new YMapMarker(
      {
        coordinates,
      },
      markerElement,
    ),
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initContactsMap();
});
