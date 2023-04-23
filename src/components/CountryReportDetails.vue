<template>
  <div class="flex flex-col h-fit h-max-full">
    <div v-if="countryDetails && !loading" class="flex flex-col h-fit h-max-full">
      <div class="flex flex-col flex-1 h-fit h-max-full">
        <h5 class="font-sans font-semibold text-ehri-wine line-clamp-1">{{countryDetails.name}}</h5>
      </div>
<div class="flex-1">
  <div class="flex mt-3 mb-1 grid-flow-col auto-cols-max justify-center divide-x-2 divide-ehri-light-grey">
      <button v-if="countryDetails.history"
              :class="tabClasses('history')"
              @click="showDesc('history')">
        <span>
          History
        </span>
      </button>
      <button v-if="countryDetails.summary"
              :class="tabClasses('summary')"
              @click="showDesc('summary')">
        <span>
          Summary
        </span>
      </button>
      <button v-if="countryDetails.extensive"
              :class="tabClasses('extensive')"
              @click="showDesc('extensive')">
        <span>
          Extensive Summary
        </span>
      </button>
      <button v-if="countryDetails.situation"
            :class="tabClasses('situation')"
              @click="showDesc('situation')">
        <span>
          Archival Situation
        </span>
      </button>
    </div>
    <div v-if="clickedDesc && clickedDesc.length>1" class="flex-1 h-56 max-h-56 p-1 mt-4 overflow-auto border-2 border-ehri-light-grey">
        <!-- Show history content if clickedDesc is 'history' -->
        <div v-if="countryDetails.history && clickedDesc === 'history'">
          <p class="text-base font-sans text-ehri-dark ">{{ countryDetails.history }}</p>
        </div>
        <div v-if="countryDetails.summary && clickedDesc === 'summary'">
          <p class="text-base font-sans text-ehri-dark">{{ countryDetails.summary }}</p>
        </div>
        <div v-if="countryDetails.extensive && clickedDesc === 'extensive'">
          <p class="text-base font-sans text-ehri-dark">{{ countryDetails.extensive }}</p>
        </div>
        <div v-if="countryDetails.situation && clickedDesc === 'situation'">
          <p class="text-base font-sans text-ehri-dark">{{ countryDetails.situation }}</p>
        </div>
    </div>
  </div>
      <div class="flex flex-col overflow-hidden items-start mt-auto">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span
                class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top"
              >
              link
        </span> Total Linked Archival Institutions on the Portal: {{relatedItemsTotal}}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10 " v-if="portalLink" >
      <a :href="portalLink" class="uppercase" target="_blank" rel="noopener">
        <span
                class="mx-1 material-symbols-outlined w-5 h-5 align-top"
              >
              database
        </span>
        Go to EHRI Portal
        </a>
      </span>
      </div>
    </div>
    <LoadingComponent v-else></LoadingComponent>
</div>
</template>

<script>
import {toRef, ref, watch} from "vue";
import {fetchFacetedPortalSearch } from "../services/EHRIGetters.js";
import LoadingComponent from "./LoadingComponent.vue";

export default {
  name: "CountryReportDetails",
  components: { LoadingComponent},
  props: {
    selectedCountryID: String
  },
  setup(props) {
    const countryID = toRef(props,"selectedCountryID")
    const countryDetails = ref()
    const clickedDesc = ref("")
    const showDesc = (d) => {
      clickedDesc.value = d
    }
    const portalLink = ref()
    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu/countries/${countryID.value}`
    }
    const relatedItemsTotal = ref()
    const facets = ref({
      type: "Country",
    })
    const loading = ref(true)

    configData()

    const tabClasses = (d) => {
      // Dynamically apply Tailwind CSS classes to context tab based on clickedDesc value
      return ['px-1.5 pb-1 text-xs font-medium text-ehri-dark hover:text-ehri-wine', clickedDesc.value === d ? 'text-ehri-wine' : 'text-ehri-dark']
    };
    

    fetchFacetedPortalSearch(countryID.value, 1, facets.value)
        .then(
            (res)=> {
              countryDetails.value = res.data.data[0].attributes
              countryDetails.value.history?
                  clickedDesc.value="history":countryDetails.value["summary"]?
                      clickedDesc.value="summary":countryDetails.value["situation"]?
                          clickedDesc.value="situation":countryDetails.value["extensive"]?
                              clickedDesc.value="extensive":""
              relatedItemsTotal.value = res.data.data[0].meta.subitems
              loading.value=false
            }
        )

    watch(countryID, ()=> {
      configData()

      fetchFacetedPortalSearch(countryID.value, 1, facets.value)
          .then(
              (res)=> {
                loading.value=true
                countryDetails.value = res.data.data[0].attributes
                countryDetails.value.history?
                    clickedDesc.value="history":countryDetails.value["summary"]?
                        clickedDesc.value="summary":countryDetails.value["situation"]?
                            clickedDesc.value="situation":countryDetails.value["extensive"]?
                                clickedDesc.value="extensive":""
                relatedItemsTotal.value = res.data.data[0].meta.subitems
                loading.value=false
              }
          )
    })
    return {relatedItemsTotal, portalLink, countryDetails, showDesc, clickedDesc, loading, tabClasses}
  }
}
</script>