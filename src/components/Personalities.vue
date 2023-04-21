<template>
  <span class="flex justify-center bg-ehri-purple py-2 text-white lg:hidden col-span-12 text-ehri-dark font-sans " @click="toggleFilterBar">
    <span v-if="!showFilterBar" class="lg:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          filter_alt
        </span>
        Filter Results
    </span>
    <span v-else class="lg:hidden mr-2 cursor-pointer">
            <span
          class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
        >
          close
        </span>
        Close
    </span>
</span>
<div class="grid grid-cols-12 sm:grid-cols-8 gap-2 lg:gap-4 h-screen max-w-full">
    <div class="h-full col-span-12 lg:h-4/5 lg:col-span-6 overflow-hidden lg:px-3">
      <AuthoritySetItems :search-term="personalityQuery" :holder="facets.holder" :type="facets.type" :desc="facets.desc">
      </AuthoritySetItems>
    </div>
    <div :class="[filterBarClass, 'bg-ehri-purple', 'overflow-scroll', 'text-white','lg:text-ehri-dark', 'lg:col-span-2', 'col-span-12', 'lg:order-last', 'order-first', 'lg:bg-white', 'shadow-xl', 'lg:h-4/5']">
      <div :key="typeFilterKey">
        <div class="px-4 pt-4">
          <h4 class="uppercase font-serif font-bold text lg:text-ehri-dark">Filters</h4>
          <p class="font-sans text-sm font-light mb-4">Choose one or more filters</p>
          <EHRIPortalTypeFilter
          filter-name="ITEM TYPE"
          :key="typeFilterKey"
          :selectedType="'EHRIPersonalities'"
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
import {toRef,ref, computed} from "vue";
import AuthoritySetItems from "./AuthoritySetItems.vue";
import EHRIPortalTypeFilter from "./EHRIPortalTypeFilter.vue";

export default {
  name: "Personalities",
  components: { AuthoritySetItems, LoadingComponent, EHRIPortalTypeFilter },
  props: {
    searchTerm: String,
    sortedTypes: Array,
  },
  emits: ['portalType'],
  setup(props, ctx){
    const personalityQuery = toRef(props, 'searchTerm')
    const sortedTypes = toRef(props, 'sortedTypes')
    const typeFilterKey = ref(0)
    const facets = ref({
      type: "HistoricalAgent",
      holder: "EHRI Personalities",
      desc: "A (non-exhaustive) set of persons derived from both EHRI cataloguing activities and structured data provided by EHRI partner institutions."
    })
    const showFilterBar = ref(false);

    const handle = (val, type) => {
      type=="typeFilter"?ctx.emit('portalType',val):null
      typeFilterKey.value+=1
    }

    const filterBarClass = computed(() => {
            return showFilterBar.value
            ? "w-full h-max m-0 p-0 bg-ehri-purple lg:w-auto lg:block transition-all ease-in-out duration-600 pb-3"
            : "w-full h-0 transition-all ease-in-out overflow-hidden lg:overflow-scroll duration-800 lg:w-auto ";
        });

   
    const toggleFilterBar = () => {
      showFilterBar.value = !showFilterBar.value;
    };

    return { showFilterBar, filterBarClass, toggleFilterBar, sortedTypes, personalityQuery, handle, facets, typeFilterKey}
  }
}
</script>

<style scoped>

</style>