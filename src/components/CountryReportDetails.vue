<template>
<div v-if="CountryDetails" class="country-details row m-0">
  <div>
    <h4 class="text-start mb-3">Item Details:</h4>
    <h5
        class="mt-2 name">
      {{CountryDetails.name}}
    </h5>
    <span
        v-if="CountryDetails.history"
        class="badge card-badge-desc m-1"
        @click="showDesc('history')"
    >
      History
    </span>
    <span
        v-if="CountryDetails.summary"
        class="badge card-badge-desc m-1"
        @click="showDesc('summary')"
    >
    Summary
    </span>
    <span
          v-if="CountryDetails.extensive"
          class="badge card-badge-desc m-1"
          @click="showDesc('extensive')"
      >
      Extensive Summary
    </span>
    <span
          v-if="CountryDetails.situation"
          class="badge card-badge-desc m-1"
          @click="showDesc('situation')"
      >
      Archival Situation
    </span>
    <span v-if="CountryDetails.history && clickedDesc==='history'">
      <h6 class="mt-1 mb-0">History:</h6>
      <p class="card-text m-0">
        {{CountryDetails.history}}
      </p>
    </span>
    <span v-if="CountryDetails.summary && clickedDesc==='summary'">
      <h6 class="mt-1 mb-0">Summary:</h6>
      <p class="card-text m-0">
      {{CountryDetails.summary}}
      </p>
    </span>
    <span v-if="CountryDetails.extensive && clickedDesc==='extensive'">
      <h6 class="mt-1 mb-0">Extensive Summary:</h6>
      <p class="card-text m-0">
      {{CountryDetails.extensive}}
      </p>
    </span>
    <span v-if="CountryDetails.situation && clickedDesc==='situation'">
      <h6 class="mt-1 mb-0">Archival Situation:</h6>
      <p class="card-text m-0">
      {{CountryDetails.situation}}
      </p>
    </span>
    <span class="text-muted small d-block">Total Linked Archival Institutions on the Portal: {{relatedItemsTotal}}</span>
  </div>
  <span class="portal-span" v-if="portalLink" >
    <a :href="portalLink" class="portal-link" target="_blank" rel="noopener">
      <span style="margin: 0 0.2em">
        <font-awesome-icon icon="database"/>
      </span>
      EHRI Portal Link
    </a>
  </span>
</div>
</template>

<script>
import {toRef, ref, watch} from "vue";
import {fetchFacetedPortalSearch } from "../services/EHRIGetters.js";

export default {
  name: "CountryReportDetails",
  props: {
    selectedCountryID: String
  },
  setup(props) {
    const countryID = toRef(props,"selectedCountryID")
    const CountryDetails = ref()
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

    configData()

    fetchFacetedPortalSearch(countryID.value, 1, facets.value)
        .then(
            (res)=> {
              CountryDetails.value = res.data.data[0].attributes
              CountryDetails.value.history?
                  clickedDesc.value="history":CountryDetails.value["summary"]?
                      clickedDesc.value="summary":CountryDetails.value["situation"]?
                          clickedDesc.value="situation":CountryDetails.value["extensive"]?
                              clickedDesc.value="extensive":""
              relatedItemsTotal.value = res.data.data[0].meta.subitems
            }
        )

    watch(countryID, ()=> {
      configData()

      fetchFacetedPortalSearch(countryID.value, 1, facets.value)
          .then(
              (res)=> {
                CountryDetails.value = res.data.data[0].attributes
                CountryDetails.value.history?
                    clickedDesc.value="history":CountryDetails.value["summary"]?
                        clickedDesc.value="summary":CountryDetails.value["situation"]?
                            clickedDesc.value="situation":CountryDetails.value["extensive"]?
                                clickedDesc.value="extensive":""
                relatedItemsTotal.value = res.data.data[0].meta.subitems
              }
          )
    })
    return {relatedItemsTotal, portalLink, CountryDetails, showDesc, clickedDesc}
  }
}
</script>

<style scoped>
.card-badge-desc{
  background-color: #330033;
  color: #FFFFFF;
  cursor: pointer;
}
.name {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.country-details {
  text-align: justify;
  margin-left: 0.5em;
  height: 22em;
  position: relative;
}
.card-text {
  border: 0.1em dotted #330033;
  background-color: #FFFFFF;
  padding: 0.3em;
  height: 12em;
  max-height: 12em;
  overflow: scroll;
}

.icon-details span {
  display: inline-block;
  padding: 0.1em;
}
.portal-link {
  text-decoration: none!important;
  color: #FFFFFF;
  text-align: center;
  display: flex;
  background-color: #330033;
  padding: 0.3em 0.6em;
  border-radius: 5px;
  width: fit-content;
}
</style>