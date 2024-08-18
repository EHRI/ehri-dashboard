<template>
<span class="flex justify-center bg-ehri-purple py-2 text-white lg:hidden col-span-12 text-ehri-dark font-sans " @click="toggleFilterBar">
    <span v-if="!showFilterBar" class="lg:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          filter_alt
        </span>
        {{ $t('filters')}}
    </span>
    <span v-else class="lg:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          close
        </span>
        {{ $t('close')}}
    </span>
</span>
<div class="grid grid-cols-12 sm:grid-cols-8 gap-2 gap-4 h-screen max-w-full">
  <div class="h-full col-span-12 lg:h-full lg:col-span-6 overflow-hidden">
    <EHRITermItems :search-term="termQuery" :holder="facets.holder" :type="facets.type" :desc="facets.desc">
    </EHRITermItems>
  </div>
  <div :class="[filterBarClass, 'bg-ehri-purple', 'overflow-y-auto', 'text-white','lg:text-ehri-dark', 'lg:col-span-2', 'col-span-12', 'lg:order-last', 'order-first', 'lg:bg-white', 'shadow-xl', 'lg:h-3/4']">
    <div>
      <div class="px-4 pt-4">
        <EHRIPortalTypeFilter></EHRIPortalTypeFilter>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref, computed} from "vue";
import EHRITermItems from "./EHRITermItems.vue";
import VocabularyItems from "./VocabularyItems.vue";
import EHRIPortalTypeFilter from "./EHRIPortalTypeFilter.vue";

export default {
  name: "EHRITerms",
  components: {EHRITermItems, LoadingComponent, VocabularyItems, EHRIPortalTypeFilter},
  props: {
    searchTerm: String,
    sortedTypes: Array,
  },
  setup(props){
    const termQuery = toRef(props, 'searchTerm')
    const sortedTypes = toRef(props, 'sortedTypes')
    const facets = ref({
      type: "CvocConcept",
      holder: "EHRI Terms",
      desc: "A hierarchically organised, multi-lingual set of subject headings developed by EHRI."
    })
    const showFilterBar = ref(false);

    const filterBarClass = computed(() => {
            return showFilterBar.value
            ? "w-full h-max m-0 p-0 bg-ehri-purple lg:w-auto lg:block transition-all ease-in-out duration-600 pb-3"
            : "w-full h-0 transition-all ease-in-out overflow-hidden lg:overflow-y-auto duration-800 lg:w-auto ";
        });

   
    const toggleFilterBar = () => {
      showFilterBar.value = !showFilterBar.value;
    };

    return { showFilterBar, filterBarClass, toggleFilterBar, termQuery, sortedTypes, facets }

  }
}
</script>
