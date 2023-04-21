<template>
  <div id="mapID">
  </div>
</template>

<script>
import { toRef, ref, onMounted, onUpdated, watch } from "vue";
import leaflet from "leaflet";
import icon from "@/assets/location_wine.svg"
import purple_icon from "@/assets/location_purple.svg"
import dark_icon from "@/assets/location_dark.svg"

export default {
  name: "VocabularyItemDetailsMap",
  props:
  {
    vocObject: {
      type: Object
    },
    long: {
        type: Number,
        default: null
      },
      lat: {
        type: Number,
        default: null
      },
  },
  setup(props){
    const long = toRef(props, "long")
    const lat = toRef(props, "lat")
    const vocObject = toRef(props, "vocObject")
    const map = ref();
    const tileLayer = ref();
    const mapKey = ref(0)
    const forceRerender = () => {
      mapKey.value += 1;
    };

    const customIcon = L.icon({
      iconUrl: icon,
      iconSize: [40,40], // specify the width and height of the SVG image
      iconAnchor: [20, 40],
      popupAnchor: [1,-39],
    });

    const purpleIcon = L.icon({
      iconUrl: purple_icon,
      iconSize: [50,50], // specify the width and height of the SVG image
      iconAnchor: [25, 50],
      popupAnchor: [1,-49],
    });

    const darkIcon = L.icon({
      iconUrl: dark_icon,
      iconSize: [30,30], // specify the width and height of the SVG image
      iconAnchor: [15, 30],
      popupAnchor: [1,-29],
    });


    const initMap = () => {
        if (map.value) {
          map.value.remove();
        }
      if (vocObject.value && long.value && lat.value) {
        map.value = leaflet
          .map("mapID", {
            preferCanvas: true,
          })
          .setView([lat.value, long.value], 7);
        tileLayer.value = leaflet.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
          }
        );
        tileLayer.value.addTo(map.value);
        if (
            vocObject.value.broader.length &&
            vocObject.value.broader[0].latitude &&
            vocObject.value.broader[0].longitude
        ) {
          leaflet
            .marker([
              vocObject.value.broader[0].latitude,
              vocObject.value.broader[0].longitude,
            ], {
              icon: purpleIcon
            })
            .addTo(map.value)
            .bindPopup(vocObject.value.broader[0].descriptions[0].name);
        }
        if (vocObject.value.narrower.length) {
          vocObject.value.narrower.forEach((c) => {
            if (c.latitude && c.longitude) {
              leaflet
                .marker([c.latitude, c.longitude], {
                  icon: darkIcon,
                })
                .addTo(map.value)
                .bindPopup(c.descriptions[0].name);
            }
          });
        }
        leaflet
          .marker([lat.value, long.value], {
            icon: customIcon
          })
          .addTo(map.value)
          .bindPopup(vocObject.value.descriptions[0].name);
      }
    };


    watch([vocObject], () => {
      forceRerender()
      initMap();
    });

    onMounted(() => {
      initMap();

    });

    onUpdated(()=> {
      initMap()
    })

    return {long, lat, mapKey}
  }

}
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