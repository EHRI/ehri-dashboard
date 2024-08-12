<template>
  <div class="flex flex-col flex-grow">
    <div class="flex mt-2">
      <button v-if="lat&&long"
              :class="historyTabClasses"
              @click="showDesc('map')">
        <span class="block mt-1 line-clamp-1">
          <span
                class="material-symbols-outlined w-6 h-6 align-top"
              >
                pin_drop
          </span>
          {{ $t('map') }}
        </span>
      </button>
      <button v-if="vocObject.broader.length||vocObject.narrower.length"
              :class="contextTabClasses"
              @click="showDesc('hierarchy')">
        <span class="block mt-1 line-clamp-1">
          <span
                class="material-symbols-outlined w-6 h-6 align-top"
              >
                account_tree
          </span>
          {{ $t('campHierarchy') }}
        </span>
      </button>
    </div>
    <div class="flex flex-col flex-grow h-80 max-h-80 mt-4 overflow-auto border-2 border-ehri-light-grey">
      <div v-if="clickedDesc === 'map'" class="w-full">
        <VocabularyItemDetailsMap  :lat="lat" :long="long" :voc-object="vocObject"/>
      </div>
      <div v-if="clickedDesc === 'hierarchy'" class="h-full">
          <CampHierarchyViz v-if="broaderCamp"  :camp-complex-object="broaderCamp" :selected-camp-object="vocObject"></CampHierarchyViz>
          <CampHierarchyViz v-else-if="vocObject.narrower && vocObject.narrower.length" :selected-camp-object="vocObject"></CampHierarchyViz>
      </div>
    </div>
  </div>
</template>

<script>
import { toRef, ref, onMounted, computed, watch } from "vue";
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

    const clickedDesc = ref("")

    const showDesc = (d) => {
      d==="map"?clickedDesc.value="map":d==="hierarchy"?clickedDesc.value="hierarchy":null
    }
    const historyTabClasses = computed(() => {
      // Dynamically apply Tailwind CSS classes to history tab based on clickedDesc value
      return ['px-1.5 pb-1 text-sm font-medium text-ehri-dark hover:text-ehri-wine ', clickedDesc.value === 'map' ? 'text-ehri-wine' : 'text-ehri-dark']
    });


    const contextTabClasses = computed(() => {
      // Dynamically apply Tailwind CSS classes to context tab based on clickedDesc value
      return ['px-1.5 pb-1 text-sm font-medium text-ehri-dark hover:text-ehri-wine', clickedDesc.value === 'hierarchy' ? 'text-ehri-wine' : 'text-ehri-dark']
    });


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


    watch([vocObject], () => {
      getCampComplex();
      clickedDesc.value = lat.value&&long.value?
                "map":vocObject.value.broader.length||vocObject.value.narrower.length?
                    "hierarchy":""
    });

    onMounted(() => {
      getCampComplex()
      clickedDesc.value = lat.value&&long.value?
                "map":vocObject.value.broader.length||vocObject.value.narrower.length?
                    "hierarchy":""
    });

    //

    return { lat, long, vocObject, broaderCamp, clickedDesc, showDesc, historyTabClasses, contextTabClasses};
  },
};
</script>

