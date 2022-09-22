<template>
  <div class="row g-0 mx-2 justify-content-center">
    <h4 id="portal-search-section" class="display-4 text-center pt-3 pb-2 mb-0">EHRI Portal</h4>
    <div class="col-md-6">
      <p class="small">The EHRI portal offers access to information on Holocaust-related archival material held in institutions across Europe and beyond.</p>
    </div>
  </div>
  <div class="portal-resources">
    <SelectPortalType :search-term="searchTerm" @portalType="(t) => {getPortalType(t)}"></SelectPortalType>
    <div v-if="selectedType">
      <component :is="portalTypeMappings[selectedType]" v-bind="{'searchTerm': searchTerm}"></component>
    </div>
    <LoadingComponent v-else></LoadingComponent>
  </div>
</template>

<script>
import { ref } from "vue"
import SelectPortalType from "./SelectPortalType.vue";
import EHRICamps from "./EHRICamps.vue";
import ArchivalDescriptions from "./ArchivalDescriptions.vue";
import CorporateBodies from "./CorporateBodies.vue";
import Personalities from "./Personalities.vue";
import EHRIGhettos from "./EHRIGhettos.vue";
import ArchivalInstitutions from "./ArchivalInstitutions.vue";
import EHRITerms from "./EHRITerms.vue";
import CountryReports from "./CountryReports.vue";
import LoadingComponent from "./LoadingComponent.vue";


export default {
  name: "EHRIPortalResource",
  components: {
    LoadingComponent, SelectPortalType, EHRICamps,
  ArchivalDescriptions, CorporateBodies, Personalities, EHRIGhettos, ArchivalInstitutions,
  EHRITerms, CountryReports},
  props:{
    searchTerm: {
      type: String
    }
  },
  setup(props){
    const searchTerm = props.searchTerm
    const selectedType = ref("")
    const portalTypeMappings = {
      DocumentaryUnit: ArchivalDescriptions,
      Repository: ArchivalInstitutions,
      EHRICorporateBodies: CorporateBodies,
      EHRIPersonalities: Personalities,
      Country: CountryReports,
      EHRICamps: EHRICamps,
      EHRIGhettos: EHRIGhettos,
      EHRIKeywords: EHRITerms,
    }

    const getPortalType = (t) => {
      selectedType.value = t
    }
    return {searchTerm, getPortalType, portalTypeMappings, selectedType}
  }
}
</script>

<style scoped>
.portal-resources {
  background-color: #F5F5F5;
  color: #330033;
  min-height: 100vh;
}

a, a:hover {
  text-decoration: none;
  color: inherit;
}
</style>