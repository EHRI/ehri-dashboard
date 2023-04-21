<template>
  <div id="countriesmapid"></div>
</template>

<script>
import {toRef,ref, onUpdated, onMounted, watch } from "vue"
import * as L from "leaflet";
import getCountryISO3 from "country-iso-2-to-3";
import boundaries from "../data/CNTR_RG_20M_2020_4326.json";

export default {
  name: "OverviewCountryStats",
  props:  {
      dataset: Object
  },
  setup(props){
    const data = toRef(props, 'dataset')
    const map = ref(null)
    const tileLayer = ref(null)
    const bounds = ref(boundaries)
    const geojson = ref(null)
    const info = ref(null)
    const legend = ref(null)

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
    }


    const style = (feature) => {
      return {
        fillColor: getColor(feature.properties.itemCount),
        weight: 1,
        opacity: 1,
        color: "#fff",
        dashArray: "0",
        fillOpacity: 0.8,
      };
    }

    const highlightFeature = (e) => {
      var layer = e.target;
      layer.setStyle({
        weight: 2,
        color: "#6c003b",
        dashArray: "",
        fillOpacity: 0.8,
      });

      info.value.update(layer.feature.properties);
    }

    const resetHighlight = (e) => {
      geojson.value.resetStyle(e.target);
      info.value.update();
    }

    const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });
    }

    const initMap = () => {
      info.value = L.control({position: "topright" })
      info.value.onAdd = function () {
        this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
        this.update();
        return this._div;
      };

      // method that we will use to update the control based on feature properties passed
      info.value.update = function (props) {
        this._div.innerHTML = props
            ? "<b>" +
            props.NAME_ENGL +
            "</b><br />" +
            (props.itemCount > 0 ? props.itemCount : 0) +
            " archival descriptions"
            : "Hover over a country";
      };


      if (map.value) {
        map.value.remove();
      }
      map.value = L.map("countriesmapid", {
        preferCanvas: true,
        minZoom: 1
      }).setView([48.8589465,2.2768236], 1);
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
    }


    bounds.value.features.forEach((feature) => {
      Object.assign(feature.properties, {
        itemCount: 0,
        url: ""
      });
    })


    onMounted(() => {
      let countries = data.value;
      bounds.value.features.forEach((feature) => {
        countries.forEach((country) => {
          if (
              feature.properties.ISO3_CODE ==
              getCountryISO3(country.value.toUpperCase())
          ) {
            Object.assign(feature.properties, {
              itemCount: country.count?country.count:0,
              url:
                  "https://portal.ehri-project.eu/countries/" +
                  country.value.toLowerCase(),
            });
          }
        });
      });
      initMap();
    });


    watch([data], () => {
    let countries = data.value;
    bounds.value.features.forEach((feature) => {
      Object.assign(feature.properties, {
        itemCount: 0,
        url: ""
      });
    })
    bounds.value.features.forEach((feature) => {
      countries.forEach((country) => {
        if (
            feature.properties.ISO3_CODE ==
            getCountryISO3(country.value.toUpperCase())
        ) {
          Object.assign(feature.properties, {
            itemCount: country.count?country.count:0,
            url:
                "https://portal.ehri-project.eu/countries/" +
                country.value.toLowerCase(),
          });
        }
      });
    });
    initMap();
    });



    return{ data }
  },
}
</script>

<style>
.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  color:black;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}


.leaflet-control-attribution svg {
  width: 10px!important;
  height: 10px!important;
  display: inline-block;
  margin-right: 2px;
}

#countriesmapid {
  height: 10rem;
  z-index: 0;
}






</style>