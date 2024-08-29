<template>
  <div ref="mapContainer" style="height: 230px;"></div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import L from 'leaflet';
import icon from "@/assets/location_wine.svg";
import purple_icon from "@/assets/location_purple.svg";
import dark_icon from "@/assets/location_dark.svg";

export default {
  name: "VocabularyItemDetailsMap",
  props: {
    vocObject: Object,
    long: Number,
    lat: Number,
    lang: String,
  },
  setup(props) {
    const mapContainer = ref(null);
    const mapInstance = ref(null);

    const customIcon = L.icon({
      iconUrl: icon,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [1, -39],
    });

    const purpleIcon = L.icon({
      iconUrl: purple_icon,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [1, -49],
    });

    const darkIcon = L.icon({
      iconUrl: dark_icon,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [1, -29],
    });

    const getNameInLang = (descriptions, lang) => {
      if (!descriptions || !Array.isArray(descriptions)) {
        console.warn('Invalid descriptions data:', descriptions);
        return '';
      }
      const description = descriptions.find(d => d.languageCode === lang);
      return description ? description.name : descriptions[0]?.name || '';
    };


    const initMap = () => {
      // Check if there's already a map instance and if so, clean it up
      if (mapInstance.value) {
        mapInstance.value.remove();
        mapInstance.value = null;
      }

      if (mapContainer.value) {
        mapInstance.value = L.map(mapContainer.value).setView([props.lat, props.long], 1); 
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(mapInstance.value);

        const markers = [];

        if (props.vocObject.broader && props.vocObject.broader.length) {
          props.vocObject.broader.forEach((b) => {
            if (b.latitude && b.longitude) {
              const marker = L.marker([b.latitude, b.longitude], { icon: purpleIcon })
                .addTo(mapInstance.value)
                .bindPopup(getNameInLang(b.descriptions, props.lang));
              markers.push(marker);
            }
          });
        }

        if (props.vocObject.narrower && props.vocObject.narrower.length) {
          props.vocObject.narrower.forEach((n) => {
            if (n.latitude && n.longitude) {
              const marker = L.marker([n.latitude, n.longitude], { icon: darkIcon })
                .addTo(mapInstance.value)
                .bindPopup(getNameInLang(n.descriptions, props.lang));
              markers.push(marker);
            }
          });
        }

        const mainMarker = L.marker([props.lat, props.long], { icon: customIcon })
          .addTo(mapInstance.value)
          .bindPopup(getNameInLang(props.vocObject.allDescriptions, props.lang));
        markers.push(mainMarker);

        if (markers.length > 0) {
          const group = new L.featureGroup(markers);
          mapInstance.value.fitBounds(group.getBounds(), { padding: [50, 50] }); 
        }

        if (markers.length === 1) {
          mapInstance.value.setView([props.lat, props.long], 12); 
        }
      }
    };

    onMounted(() => {
      initMap();
    });

    onUnmounted(() => {
      if (mapInstance.value) {
        mapInstance.value.remove();
      }
    });

    watch(() => [props.lat, props.long, props.vocObject], () => {
      initMap();
    }, { immediate: true });

    return {
      mapContainer,
      mapInstance
    };
  }
};
</script>

<style>
#mapID {
  height: 20rem;
  z-index: 0;
}

.leaflet-attribution-flag {
  width: 10px;
  height: 10px;
  display: inline;
}
</style>
