<template>
  <div class="row pb-3">
    <div
        style="max-width: 100%"
        class="entity-card"
    >
      <!-- Button trigger modal -->
      <button v-if="(vocObject['broader'] && vocObject['broader'].length) || (vocObject.narrower && vocObject.narrower.length)" class="card-link btn" data-bs-toggle="modal" data-bs-target="#campHierarchyModal">Camp Hierarchy</button>

      <!-- Modal -->
      <div class="modal fade" id="campHierarchyModal" tabindex="-1" aria-labelledby="campHierarchyModal" aria-hidden="true">
        <div class="modal-dialog" style="max-width: 80%">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="campHierarchyModalTitle">CAMP HIERARCHY</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <CampHierarchyViz v-if="broaderCamp"  :camp-complex-object="broaderCamp" :selected-camp-object="vocObject"></CampHierarchyViz>
              <CampHierarchyViz v-else-if="vocObject.narrower && vocObject.narrower.length" :selected-camp-object="vocObject"></CampHierarchyViz>
              <span class="text-dark">The camp hierarchy based on the EHRI vocabulary of
                <a href="https://portal.ehri-project.eu/vocabularies/ehri_camps" target="_blank" rel="noopener noreferrer">
                  Camps.
                </a></span>
            </div>
            <div class="modal-footer">
              <button type="button" id="close" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="lat && long" style="max-width: 100%">
        <VocabularyItemDetailsMap  :key="mapKey"/>
      </div>
    </div>
  </div>
</template>

<script>
import { toRef, ref, onMounted, watch, onUpdated } from "vue";
import leaflet from "leaflet";
import { fetchCvocConceptInfo } from "../services/EHRIGetters";
import CampHierarchyViz from "./CampHierarchyViz.vue";
import VocabularyItemDetailsMap from "./VocabularyItemDetailsMap.vue";

export default {
  name: "VocabularyItemDetailsViz",
  components: {VocabularyItemDetailsMap, CampHierarchyViz,  },
  props: {
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
    }
  },
  setup(props) {
    const long = toRef(props, "long")
    const lat = toRef(props, "lat")
    const vocObject = toRef(props, "vocObject");
    const broaderCamp = ref();
    const map = ref();
    const tileLayer = ref();
    const mapKey = ref(0)
    const forceRerender = () => {
      mapKey.value += 1;
    };


    const getCampComplex = () => {
      broaderCamp.value = null;
      if (vocObject.value["broader"].length) {
        try {
          let tempBroader = fetchCvocConceptInfo(vocObject.value["broader"][0].id);
          tempBroader.then((res) => {
            broaderCamp.value = res.data.CvocConcept;
          });
        } catch (e) {
          console.log("Couldn't find broader camp");
        }
      }
    };

    const initMap = () => {
      if (vocObject.value && long.value && lat.value) {
        if (map.value) {
          map.value.remove();
        }
        map.value = leaflet
          .map("mapID", {
            preferCanvas: true,
          })
          .setView([lat.value, long.value], 9);
        tileLayer.value = leaflet.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
          }
        );
        tileLayer.value.addTo(map.value);
        var selectedCampMarker = leaflet
          .marker([lat.value, long.value])
          .addTo(map.value)
          .bindPopup(vocObject.value.descriptions[0].name);
        selectedCampMarker._icon.classList.add("huechangeSelected");
        if (
            vocObject.value.broader.length &&
            vocObject.value.broader[0].latitude &&
            vocObject.value.broader[0].longitude
        ) {
          var marker1 = leaflet
            .marker([
              vocObject.value.broader[0].latitude,
              vocObject.value.broader[0].longitude,
            ])
            .addTo(map.value)
            .bindPopup(vocObject.value.broader[0].descriptions[0].name);
          marker1._icon.classList.add("huechangeBroader");
        }
        if (vocObject.value.narrower.length) {
          vocObject.value.narrower.forEach((c) => {
            if (c.latitude && c.longitude) {
              var marker2 = leaflet
                .marker([c.latitude, c.longitude])
                .addTo(map.value)
                .bindPopup(c.descriptions[0].name);
              marker2._icon.classList.add("huechangeNarrower");
            }
          });
        }
      }
    };

    watch([vocObject], () => {
      forceRerender()
      getCampComplex();
      initMap();
    });

    onMounted(() => {
      getCampComplex()
      initMap();
    });
    onUpdated(()=> {
      initMap()
    })
    //

    return { lat, mapKey, long, vocObject, broaderCamp, };
  },
};
</script>

<style>
.entity-card a{
  color: #6C003B!important;
}
.entity-card .btn,.entity-card .btn:hover {
  background-color: #6C003B!important;
  color: #FFFFFF;
  border: none;
}

img.huechangeSelected {
  filter: hue-rotate(400deg);
}
img.huechangeNarrower {
  filter: hue-rotate(600deg);
  width: 22px !important;
  height: 36px !important;
}

img.huechangeBroader {
  filter: hue-rotate(360deg);
  width: 27px !important;
  height: 45px !important;
}

svg {
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
