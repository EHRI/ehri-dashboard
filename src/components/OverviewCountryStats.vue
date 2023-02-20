<template>
  <div class="row justify-content-around g-0 mt-4">
    <div class="col-md-10 p-3">
      <h3 class="text-start">Archival Institutions per Country</h3>
      <p class="text-start click">
        Click on a country to get the link to its report and explore its
        archival institutions on the EHRI Portal.
      </p>
    </div>
  </div>
  <div class="row justify-content-around gx-0 mb-5">
    <div class="col-md-10 mb-4">
      <div id="countriesmapid"></div>
    </div>
  </div>
</template>

<script>
import {ref, onUpdated } from "vue"
import * as L from "leaflet";
import getCountryISO3 from "country-iso-2-to-3";
import boundaries from "../data/CNTR_RG_20M_2020_4326.json";
import { fetchCountryStats, fetchRepos } from "../services/EHRIGetters.js";

export default {
  name: "OverviewCountryStats",
  setup(){
    const map = ref(null)
    const tileLayer = ref(null)
    const bounds = ref(boundaries)
    const geojson = ref(null)
    const info = ref(null)
    const legend = ref(null)
    const allRepos = ref([]);
    const repoLayer = ref(L.layerGroup());

    const emptyLayer = L.layerGroup().addTo(repoLayer.value); // create an empty layer and add it to repoLayer

    try {
      let tempRepos = fetchRepos();
      tempRepos.then((res) => {
        allRepos.value = res.data.repositories.items;
        allRepos.value.forEach((r)=>{
          if(r.latitude && r.longitude ){
            emptyLayer.addLayer(L.circleMarker([r.latitude, r.longitude], {radius: 2}).bindPopup(
            `<strong>
            ${r.descriptions[0].name}
            </strong>
           <br /><a href="https://portal.ehri-project.eu/institutions/${r.id}" target='_blank'>EHRI Portal Link</a>`))
          }
        })
      });
    } catch (error) {
      console.log(`Failed loading repos. Error: ${error}`);
    }

    const getColor = (d) => {
      return d >= 200
          ? "rgb(51, 0, 51)"
          : d >= 100
              ? "rgb(115, 23, 68)"
              : d >= 50
                  ? "rgb(174, 66, 73)"
                  : d >= 10
                      ? "rgb(219, 119, 74)"
                      : d >= 1
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
      if (feature.properties.url) {
        layer.bindPopup(
            "<h4>" +
            feature.properties.NAME_ENGL +
            "</h4><strong>Archival Institutions: </strong>" +
            feature.properties.itemCount +
            "<br />Read the country report and browse the repositories on the <a href=" +
            feature.properties.url +
            ' target="_blank" >EHRI Portal</a>.'
        );
      }
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
            " repositories"
            : "Hover over a country";
      };

      legend.value = L.control();
      legend.value.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend"),
            grades = [-1, 1, 10, 50, 100, 200],
            labels = [0, 1, 10, 50, 100, 200];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' +
              getColor(grades[i] + 1) +
              '"></i> ' +
              labels[i] +
              (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }

        return div;
      };
      if (map.value) {
        map.value.remove();
      }
      map.value = L.map("countriesmapid", {
        preferCanvas: true,
      }).setView([39.099438, 15.064282], 2);
      tileLayer.value = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors. &copy; EuroGeographics for the administrative boundaries.',
          }
      );
      tileLayer.value.addTo(map.value);
      geojson.value = L.geoJson(bounds.value, {
        style: style,
        onEachFeature: onEachFeature,
      });
      geojson.value.addTo(map.value);

      var layerControl = L.control.layers(null, {"Boundaries": geojson.value, "Repositories": repoLayer.value},{position: "bottomleft"}).addTo(map.value);
      info.value.addTo(map.value);
      legend.value.addTo(map.value);
    }
    bounds.value.features.forEach((feature) => {
      Object.assign(feature.properties, {
        itemCount: 0,
        url: ""
      });
    })
    try {
      let tempStats = fetchCountryStats();
      tempStats
          .then((data) => {
            let countries = data.data.data;
            bounds.value.features.forEach((feature) => {
              countries.forEach((country) => {
                if (
                    feature.properties.ISO3_CODE ==
                    getCountryISO3(country.id.toUpperCase())
                ) {
                  Object.assign(feature.properties, {
                    itemCount: country.meta.subitems?country.meta.subitems:0,
                    url:
                        "https://portal.ehri-project.eu/countries/" +
                        country.id.toLowerCase(),
                  });
                }
              });
            });
            initMap()
          })
    } catch (err) {
       console.log(err.message)
    };
    onUpdated(() => {
      initMap();
    });
    return{repoLayer, allRepos}
  },
}
</script>

<style>
.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.legend {
  line-height: 18px!important;
  color: #555;
}
.legend i {
  width: 18px!important;
  height: 18px!important;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

.leaflet-control-attribution svg {
  width: 18px!important;
  height: 18px!important;
  display: inline-block;
  float: left;
  margin-right: 8px;
}

#countriesmapid {
  height: 50em;
  z-index: 0;
}

.overview h2 {
  font-family: "Barlow Semi Condensed";
  color: #6c003b;
}

.click {
  font-family: "Roboto";
  color: #000;
}

h3 {
  font-family: "Barlow Semi Condensed";
}

p {
  font-family: "Roboto";
}


</style>