<template>
  <span class="col-span-12 mb-0 flex justify-center bg-ehri-purple py-2 text-white xl:hidden font-sans" @click="toggleFilterBar">
    <span v-if="!showFilterBar" class="xl:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          filter_alt
        </span>
        {{ $t('filters') }} 
    </span>
    <span v-else class="xl:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          close
        </span>
        {{ $t('close') }} 
    </span>
</span>
<div class="grid grid-cols-12 sm:grid-cols-8 sm:gap-0 h-screen xl:gap-4 max-w-full">
  <div class="col-span-12 h-screen xl:h-3/4 xl:col-span-6 xl:overflow-hidden">
    <VocabularyItems :search-term="campQuery" :holder="facets.holder" :type="facets.type" :desc="facets.desc">
    </VocabularyItems>
  </div>
  <div :class="[filterBarClass, 'bg-ehri-purple', 'overflow-y-auto', 'text-white','xl:text-ehri-dark', 'xl:col-span-2', 'col-span-12', 'xl:order-last', 'order-first', 'xl:bg-white', 'shadow-xl', 'xl:h-3/4']">
    <div>
      <div class="px-4 pt-4">
        <EHRIPortalTypeFilter>
        </EHRIPortalTypeFilter>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref, computed} from "vue";
import VocabularyItems from "./VocabularyItems.vue";
import EHRIPortalTypeFilter from "./EHRIPortalTypeFilter.vue";

export default {
  name: "EHRICamps",
  components: { VocabularyItems, LoadingComponent, EHRIPortalTypeFilter },
  props: {
    searchTerm: String,
    sortedTypes: Array,
  },
  setup(props){
    const campQuery = toRef(props, 'searchTerm')
    const sortedTypes = toRef(props, 'sortedTypes')
    const facets = ref({
      type: "CvocConcept",
      holder: "EHRI Camps",
      desc: "EHRI Authority list of Camps is predominantly based on the USHMM Encyclopedia of Camps and Ghettos (volumes 1-3). Other sources include the International Tracing Service, Wikidata, Wikipedia, and Bundesarchiv."
    })
    const showFilterBar = ref(false);


    const filterBarClass = computed(() => {
            return showFilterBar.value
            ? "w-full h-max m-0 p-0 bg-ehri-purple xl:w-auto xl:block transition-all ease-in-out duration-600 pb-3"
            : "w-full h-0 transition-all ease-in-out overflow-hidden xl:overflow-y-auto duration-800 xl:w-auto ";
        });

   
    const toggleFilterBar = () => {
      showFilterBar.value = !showFilterBar.value;
    };



    return { showFilterBar, filterBarClass, toggleFilterBar, campQuery, sortedTypes, facets }

  }
}
</script>

<style scoped>

</style>