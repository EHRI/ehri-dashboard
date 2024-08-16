<template>
  <div id="countriesmapid"></div>
</template>

<script>
import { toRef, ref, onMounted, watch } from "vue";
import * as L from "leaflet";
import getCountryISO3 from "country-iso-2-to-3";
import boundaries from "../data/CNTR_RG_20M_2020_4326.json";
import { useI18n } from "vue-i18n";

export default {
  name: "OverviewCountryStats",
  props: {
    dataset: Object,
  },
  setup(props) {
    const { t, locale } = useI18n();
    const data = toRef(props, "dataset");
    const map = ref(null);
    const tileLayer = ref(null);
    const bounds = ref(boundaries);
    const geojson = ref(null);
    const info = ref(null);

    const getColor = (d) => {
      return d >= 1000
        ? "rgb(51, 0, 51)"
        : d >= 100
        ? "rgb(115, 23, 68)"
        : d >= 50
        ? "rgb(174, 66, 73)"
        : d >= 10
        ? "rgb(219, 119, 74)"
        : d >= 5
        ? "rgb(245, 182, 81)"
        : "rgba(0,0,0,0.6)";
    };

    const style = (feature) => {
      return {
        fillColor: getColor(feature.properties.itemCount),
        weight: 1,
        opacity: 1,
        color: "#fff",
        dashArray: "0",
        fillOpacity: 0.8,
      };
    };

    const highlightFeature = (e) => {
      const layer = e.target;
      if (layer.feature.properties.itemCount !== undefined) {
        layer.setStyle({
          weight: 2,
          color: "#6c003b",
          dashArray: "",
          fillOpacity: 0.8,
        });
        info.value.update(layer.feature.properties);
      }
    };

    const resetHighlight = (e) => {
      geojson.value.resetStyle(e.target);
      info.value.update();
    };

    const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });
    };

    const getLocalizedCountryName = (iso2Code) => {
      const displayNames = new Intl.DisplayNames([locale.value], { type: "region" });
      return displayNames.of(iso2Code);
    };

    info.value = L.control({ position: "topright" });
    info.value.onAdd = function () {
      this._div = L.DomUtil.create("div", "info");
      this.update();
      return this._div;
    };

    info.value.update = function (props) {
      this._div.innerHTML = props && props.ISO2_CODE
        ? `<b>${getLocalizedCountryName(props.ISO2_CODE)}</b><br />` +
          `${props.itemCount > 0 ? props.itemCount : 0} ${t('portalTypes.DocumentaryUnit', 2)}`
        : t("hoverOverCountry");
    };

    const initMap = () => {
      if (map.value) {
        map.value.remove();
      }
      map.value = L.map("countriesmapid", {
        preferCanvas: true,
        minZoom: 1,
      }).setView([48.8589465, 2.2768236], 1);

      tileLayer.value = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 15,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>. &copy; EuroGeographics.',
        }
      );
      tileLayer.value.addTo(map.value);

      geojson.value = L.geoJson(bounds.value, {
        style: style,
        onEachFeature: onEachFeature,
      });
      geojson.value.addTo(map.value);

      info.value.addTo(map.value);
    };

    const updateFeatures = () => {
      bounds.value.features.forEach((feature) => {
        const countryData = data.value.find(
          (country) => feature.properties.ISO3_CODE === getCountryISO3(country.value.toUpperCase())
        );
        Object.assign(feature.properties, {
          itemCount: countryData ? countryData.count : 0,
          url: countryData
            ? "https://portal.ehri-project.eu/countries/" + countryData.value.toLowerCase()
            : "",
          ISO2_CODE: countryData ? countryData.value.toUpperCase() : "",
        });
      });
      if (geojson.value) {
        geojson.value.clearLayers(); // Remove existing layers
        geojson.value = L.geoJson(bounds.value, {
          style: style,
          onEachFeature: onEachFeature,
        });
        geojson.value.addTo(map.value);
      }
    };

    onMounted(() => {
      updateFeatures();
      initMap();
    });

    watch([data], () => {
      updateFeatures();
    });

    return { data };
  },
};
</script>

<style>
.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  color: black;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.leaflet-control-attribution svg {
  width: 10px !important;
  height: 10px !important;
  display: inline-block;
  margin-right: 2px;
}

#countriesmapid {
  height: 10rem;
  z-index: 0;
}
</style>
