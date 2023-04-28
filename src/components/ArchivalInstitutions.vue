<template>
  <span class="flex justify-center bg-ehri-purple py-2 text-white xl:hidden col-span-12 text-ehri-dark font-sans " @click="toggleFilterBar">
    <span v-if="!showFilterBar" class="xl:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          filter_alt
        </span>
        Filter Results
    </span>
    <span v-else class="xl:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          close
        </span>
        Close
    </span>
</span>
<div class="grid grid-cols-12 sm:grid-cols-8 gap-2 gap-4 h-screen max-w-full">
  <div class="h-full col-span-12 xl:h-full xl:col-span-6 overflow-hidden">
      <ArchivalInstitutionItems :search-term="repoQuery" :holder="facets.holder" :type="facets.type" :desc="facets.desc">
      </ArchivalInstitutionItems>
    </div>
    <div :class="[filterBarClass, 'bg-ehri-purple', 'overflow-y-auto', 'text-white','xl:text-ehri-dark', 'xl:col-span-2', 'col-span-12', 'xl:order-last', 'order-first', 'xl:bg-white', 'shadow-xl', 'xl:h-3/4']">
      <div :key="typeFilterKey">
        <div class="px-4 pt-4">
          <h4 class="uppercase font-serif font-bold text xl:text-ehri-dark">Filters</h4>
          <p class="font-sans text-sm font-light mb-4">Choose one or more filters</p>
          <EHRIPortalTypeFilter
          filter-name="ITEM TYPE"
          :key="typeFilterKey"
          :selectedType="'Repository'"
          :filter-array="sortedTypes"
          @filterChange="(e) => {
            handle(e,'typeFilter')}"
          >
          </EHRIPortalTypeFilter>
        </div>
      </div>
    </div>
</div>  
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import { toRef, ref, computed } from "vue";
import ArchivalInstitutionItems from "./ArchivalInstitutionItems.vue";
import EHRIPortalTypeFilter from "./EHRIPortalTypeFilter.vue";



export default {
  name: "Archival Institutions",
  components: {ArchivalInstitutionItems, LoadingComponent, EHRIPortalTypeFilter},
  props: {
    searchTerm: String,
    sortedTypes: Array,
  },
  emits: ['portalType'],
  setup(props, ctx){
    const repoQuery = toRef(props, 'searchTerm')
    const sortedTypes = toRef(props, 'sortedTypes')
    const facets = ref({
      type: "Repository",
      desc: "An inventory of archival institutions that hold Holocaust-related material."
    })
    const showFilterBar = ref(false);
    
    const typeFilterKey = ref(0)

    const handle = (val, type) => {
      type=="typeFilter"?ctx.emit('portalType',val):null
      typeFilterKey.value+=1
    }

    const filterBarClass = computed(() => {
            return showFilterBar.value
            ? "w-full h-max m-0 p-0 bg-ehri-purple xl:w-auto xl:block transition-all ease-in-out duration-600 pb-3"
            : "w-full h-0 transition-all ease-in-out overflow-hidden xl:overflow-y-auto duration-800 xl:w-auto ";
        });

   
    const toggleFilterBar = () => {
      showFilterBar.value = !showFilterBar.value;
    };

    return { showFilterBar, filterBarClass, toggleFilterBar, repoQuery, facets, sortedTypes, typeFilterKey, handle}
  }
}
</script>
