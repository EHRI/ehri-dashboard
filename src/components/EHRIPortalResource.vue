<template>
  <div class="grid grid-cols-8 gap-4">
    <div class="col-span-8" v-if="!isLoading">
      <component :is="portalTypeMappings[selectedType]" :searchTerm="searchTerm" :sortedTypes="sortedTypes"></component>
    </div>
    <LoadingComponent class="col-span-8" v-else></LoadingComponent>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { usePortalResourceStore } from "../stores/portalResourceStore";
import { useMainStore } from "../stores/mainStore";
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
    LoadingComponent, EHRICamps,
    ArchivalDescriptions, CorporateBodies, Personalities, EHRIGhettos, ArchivalInstitutions,
    EHRITerms, CountryReports
  },
  setup() {
    const mainStore = useMainStore();
    const store = usePortalResourceStore();
    const searchTerm = computed(() => mainStore.searchTerm);
    const selectedType = computed(() => store.selectedType);
    const sortedTypes = computed(() => store.sortedTypes);
    const isLoading = computed(() => store.isLoading);

    watch(searchTerm, (newTerm) => {
      store.fetchPortalResourceTypes(newTerm);
    }, { immediate: true });


    return {
      searchTerm,
      portalTypeMappings: {
        DocumentaryUnit: ArchivalDescriptions,
        Repository: ArchivalInstitutions,
        EHRICorporateBodies: CorporateBodies,
        EHRIPersonalities: Personalities,
        Country: CountryReports,
        EHRICamps: EHRICamps,
        EHRIGhettos: EHRIGhettos,
        EHRIKeywords: EHRITerms,
      },
      selectedType,
      sortedTypes,
      isLoading
    };
  }
};
</script>

<style scoped>
</style>