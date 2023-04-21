<template>
  <div class="grid grid-cols-8 gap-4">
    <div class="col-span-8" v-if="selectedType">
      <component :is="portalTypeMappings[selectedType]" v-bind="{'searchTerm': searchTerm, 'sortedTypes': sortedTypes}" @portalType="(t) => { getPortalType(t) }"></component>
    </div>
    <LoadingComponent class="col-span-8" v-else></LoadingComponent>
    <SelectPortalType :search-term="searchTerm" @portalType="(t) => { getPortalType(t) }" @sortedTypes="(s) => { getSortedTypes(s) }"></SelectPortalType>
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
    const sortedTypes = ref([]) 
    const getPortalType = (t) => {
      selectedType.value = t
    }

    const getSortedTypes = (s) => {
      sortedTypes.value = s
    }

    return {searchTerm, getPortalType, getSortedTypes, portalTypeMappings, selectedType, sortedTypes}
  }
}
</script>

<style scoped>
</style>