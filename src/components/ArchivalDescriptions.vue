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
  <div v-if="filtered && !showFilterBar" class="xl:hidden pt-1 px-2">
          <h5 class="font-sans text-sm text-ehri-purple block font-medium">Active Filters: </h5>
            <span class="inline w-fit cursor-pointer border border-ehri-dark rounded-full bg-ehri-dark text-white mr-1 px-2 py-0.5 text-xs" v-if="holderFilter" @click="handle('Institutions','holderFilter')">{{holderFilter.length>25?holderFilter.substring(0,25)+'...':holderFilter}}</span>
            <span class="inline mt-1 w-fit cursor-pointer border border-ehri-dark rounded-full bg-ehri-dark text-white mr-1 px-2 py-0.5 text-xs" v-if="langFilter" @click="handle('','langFilter')">{{languageNames.of(langFilter)}}</span>
            <span class="inline mt-1 w-fit cursor-pointer border border-ehri-dark rounded-full bg-ehri-dark text-white mr-1 px-2 py-0.5 text-xs" v-if="countryFilter" @click="handle('','countryFilter')">{{countryNames.of(countryFilter.toUpperCase())}}</span>
            <span class="inline mt-1 w-fit cursor-pointer border border-ehri-dark rounded-full bg-ehri-dark text-white mr-1 px-2 py-0.5 text-xs" v-if="dateFilter" @click="handle('','dateFilter')">{{dateFilter.length>25?dateFilter.substring(0,25)+'...':dateFilter}}</span>
            <div class="flex items-center mt-1 cursor-pointer text-ehri-purple text-sm" id="remove-filter" @click="(e) => handle(e,'removeAll')">
              <span class="material-symbols-outlined pointer-events-none w-3 h-3 text-xs mr-1">
                close
              </span>
              <span>Remove All Filters</span>
            </div>
  </div>
  <!-- Creating the grid -->
  <div class="grid grid-cols-12 sm:grid-cols-8 gap-4 h-screen max-w-full">
    <!-- first column -->
    <div class="h-screen col-span-12 bg-white shadow-xl xl:h-3/4 xl:col-span-6 overflow-hidden px-7">
      <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4">Showing 
        <span v-if="pagination.total" class="font-serif font-extrabold">{{pagination.total}}</span>
        <LoadingComponent v-else></LoadingComponent> 
        Archival Descriptions</h4>
      <p class="font-sans text-ehri-dark text-sm">Electronic descriptions and finding aids of Holocaust-related archival material.</p>
      <hr class="text-ehri-dark border-4 shadow-md mt-3">
      <div class="pt-3 pb-0 h-full">
        <div v-if="!loadingDocUnits" class="h-full">
          <div :key="listKey" class="h-full">
              <Suspense>
                <DocUnitItemsRest :search-term="docUnitQuery" :holder="holderFilter" :country="countryFilter" :language="langFilter" :dates="dateFilter"></DocUnitItemsRest>
                <template #fallback>
                  <LoadingComponent></LoadingComponent>
                </template>
              </Suspense>
          </div>
        </div>
        <div v-else class="h-full w-full flex justify-center items-center">
          <LoadingComponent></LoadingComponent>
        </div>
      </div>
    </div>
    <!-- second column -->
    <div :class="[filterBarClass, 'bg-ehri-purple', 'text-white', 'xl:text-ehri-dark', 'xl:col-span-2', 'col-span-12', 'xl:order-last', 'order-first', 'xl:bg-white', 'shadow-xl', 'xl:h-3/4',]">
      <div v-if="!loadingDocUnits">
        <div class="h-full px-4 pt-4">
          <h4 class="uppercase font-serif font-bold xl:text-ehri-dark">Filters</h4>
          <p class="font-sans text-sm font-light">Choose one or more filters</p>
          <div class="overflow-y-auto h-full">
            <EHRIPortalTypeFilter
            filter-name="ITEM TYPE"
            :key="typeFilterKey"
            :selectedType="'DocumentaryUnit'"
            :filter-array="sortedTypes"
            @filterChange="(e) => {
              handle(e,'typeFilter')}"
            >
            </EHRIPortalTypeFilter>
            <ArchivalDescriptionFilter
            filter-name="Countries"
            :key="countryFilterKey"
            :filter-array="stats.countries"
            @filterChange="(e) => {
              handle(e,'countryFilter')}"
            >
            </ArchivalDescriptionFilter>
            <ArchivalDescriptionFilter
                filter-name="Institutions"
                :key="repoFilterKey"
                :filter-array="stats.holders"
                @filterChange="(e) => {handle(e,'holderFilter')}"
            >
            </ArchivalDescriptionFilter>
            <ArchivalDescriptionFilter
                filter-name="Languages"
                :key="langFilterKey"
                :filter-array="stats.langs"
                @filterChange="(e) => {handle(e,'langFilter')}"
            >
            </ArchivalDescriptionFilter>
            <ArchivalDescriptionFilter
                filter-name="Dates"
                :key="dateFilterKey"
                :filter-array="stats.dates"
                @filterChange="(e) => {handle(e,'dateFilter')}"
            >
            </ArchivalDescriptionFilter>
          
          <div v-if="filtered" class="px-4 pt-4">
            <hr class="py-1 xl:text-ehri-dark">
            <h5 class="font-serif text-sm font-extralight">Active Filters:</h5>
              <span class="block w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="holderFilter" @click="handle('Institutions','holderFilter')">{{holderFilter.length>25?holderFilter.substring(0,25)+'...':holderFilter}}</span>
              <span class="block mt-1 w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="langFilter" @click="handle('','langFilter')">{{languageNames.of(langFilter)}}</span>
              <span class="block mt-1 w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="countryFilter" @click="handle('','countryFilter')">{{countryNames.of(countryFilter.toUpperCase())}}</span>
              <span class="block mt-1 w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="dateFilter" @click="handle('','dateFilter')">{{dateFilter.length>25?dateFilter.substring(0,25)+'...':dateFilter}}</span>
              <div class="flex items-center my-2 cursor-pointer xl:text-ehri-wine text-sm" id="remove-filter" @click="(e) => handle(e,'removeAll')">
                <span class="material-symbols-outlined pointer-events-none w-3 h-3 text-xs mr-1">
                  close
                </span>
                <span>Remove All Filters</span>
              </div>
          </div>
          <div class="pt-2">
            <OverviewCountryStats :key="countryFilterKey" class="mb-5" :dataset="stats.countries"></OverviewCountryStats>
          </div>
        </div>
        </div>
      </div>
      <div v-else class="">
        <loading-component class="m-5"></loading-component>
      </div>
    </div>
  </div>
</template>

<script>
import {toRef, ref, computed,} from "vue";
import DocUnitItemsRest from "./DocUnitItemsREST.vue"
import LoadingComponent from "./LoadingComponent.vue";
import { fetchFacetedDocUnits } from "../services/EHRIGetters";
import ArchivalDescriptionFilter from "./ArchivalDescriptionFilter.vue";
import EHRIPortalTypeFilter from "./EHRIPortalTypeFilter.vue";
import OverviewCountryStats from "./OverviewCountryStats.vue";

export default {
  name: "ArchivalDescriptions",
  components: { EHRIPortalTypeFilter, ArchivalDescriptionFilter, DocUnitItemsRest, LoadingComponent, OverviewCountryStats },
  props: {
    searchTerm: String,
    sortedTypes: Array,
  },
  emits: ["portalType"],
  setup(props, ctx) {

    const docUnitQuery = toRef(props, 'searchTerm')
    const sortedTypes = toRef(props, 'sortedTypes')
    const listKey = ref(0)
    const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    const countryNames = new Intl.DisplayNames(['en'], {type: 'region'});
    const docUnits = ref([]);
    const loadingDocUnits = ref(true);
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const repoCounts = ref(new Map());
    const dateCounts = ref(new Map());
    const langCounts = ref(new Map())
    const countryCounts = ref(new Map())
    const filterValue = ref();
    const filtered = ref(false);
    const filteredUnits = ref([]);
    const stats = ref({
      holders: null,
      countries: null,
      langs: null,
      dates: null
    })
    const holderFilter = ref(null)
    const countryFilter = ref(null)
    const langFilter = ref(null)
    const dateFilter = ref(null)
    const facets = ref(new Object())
    const showFilterBar = ref(false);
  

    // Useful to reload filter components when filters get removed
    const typeFilterKey = ref(0)
    const countryFilterKey = ref(0)
    const repoFilterKey = ref(0)
    const langFilterKey = ref(0)
    const dateFilterKey = ref(0)

    const handle = (val, type) => {
      filtered.value = false;

      type=="typeFilter"?ctx.emit('portalType',val):null
      type=="holderFilter"&&val!="Institutions"?holderFilter.value=val:val=="Institutions"?holderFilter.value=null:null
      type=="countryFilter"&&val!="Countries"?countryFilter.value=val:val=="Countries"?countryFilter.value=null:null
      type=="langFilter"&&val!="Languages"?langFilter.value=val:val=="Languages"?langFilter.value=null:null
      type=="dateFilter"&&val!="Dates"?dateFilter.value=val:val=="Dates"?dateFilter.value=null:null


    if(type=="removeAll"){
      facets.value = new Object()
      holderFilter.value = null
      langFilter.value = null
      dateFilter.value = null
      countryFilter.value = null
      fetchFacetedDocUnits(docUnitQuery.value, 1, null, 1)
          .then((res) => {
            configStats(res.data.meta.facets)
            docUnits.value = res.data.data
            page.value = 1
            configPagination(res.data.meta)
          })
    }
    if (!holderFilter.value &&
        !countryFilter.value &&
        !langFilter.value &&
        !dateFilter.value) {
      facets.value = new Object()
      fetchFacetedDocUnits(docUnitQuery.value, 1, null, 1)
          .then((res) => {
            configStats(res.data.meta.facets)
            docUnits.value = res.data.data
            page.value = 1
            configPagination(res.data.meta)
          })
    } else {
      facets.value = new Object()
      holderFilter.value ? facets.value['holder']=encodeURIComponent(holderFilter.value) : null
      countryFilter.value ? facets.value['country']= countryFilter.value: null
      langFilter.value ? facets.value['lang']= langFilter.value : null
      dateFilter.value ? facets.value['dates']= dateFilter.value : null
      fetchFacetedDocUnits(docUnitQuery.value, 1, facets.value, 1)
          .then(res => {
            configStats(res.data.meta.facets)
            filteredUnits.value = res.data.data
            page.value = 1
            configPagination(res.data.meta)
            filtered.value = true;
          })
    }
    }


    const getAllDocUnits = async (pageNo) => {
      repoCounts.value.clear()
      countryCounts.value.clear()
      langCounts.value.clear()
      dateCounts.value.clear()
      docUnits.value = []
      filteredUnits.value = []
      filterValue.value = ""
      filtered.value = false

      const response = await fetchFacetedDocUnits(docUnitQuery.value, pageNo)
      const data = response.data.data
      configPagination(response.data.meta)
      configStats(response.data.meta.facets)
      return data
    }

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
      typeFilterKey.value+=1
      countryFilterKey.value+=1
      langFilterKey.value+=1
      dateFilterKey.value+=1
      repoFilterKey.value+=1
      listKey.value +=1
    };

    const configStats = (meta) => {
      stats.value["holders"] = meta.find(i => {
        return i.param == "holder"
      }).facets;
      stats.value["countries"] = meta.find(i => {
        return i.param == "country"
      }).facets;
      stats.value["langs"] = meta.find(i => {
        return i.param == "lang"
      }).facets;
      stats.value["dates"] = meta.find(i => {
        return i.param == "dates"
      }).facets;
    };


    getAllDocUnits(1).then(
        (res) => {
          docUnits.value = res
          if(pagination.value['total']===0){
            loadingDocUnits.value = false
          } else {
            stats.value.holders.forEach((i)=>{
                  repoCounts.value.set(i.name,i.count)
                }
            )
            stats.value.langs.forEach((l)=>{
              langCounts.value.set(l.name, l.count)
            })
            stats.value.countries.forEach((c)=>{
              countryCounts.value.set(c.name, c.count)
            })
            stats.value.dates.forEach((c)=>{
              dateCounts.value.set(c.name, c.count)
            })
          loadingDocUnits.value=false
        }}
    )

    const filterBarClass = computed(() => {
            return showFilterBar.value
            ? "w-full h-max m-0 p-0 bg-ehri-purple xl:w-auto xl:block transition-all ease-in-out duration-600"
            : "w-full h-0 transition-all ease-in-out overflow-y-auto duration-800 xl:w-auto ";
        });

   
    const toggleFilterBar = () => {
      showFilterBar.value = !showFilterBar.value;
    };


    return{
      filterBarClass,
      toggleFilterBar,
      showFilterBar,
      docUnitQuery,
      typeFilterKey,
      countryFilterKey,
      repoFilterKey,
      langFilterKey,
      dateFilterKey,
      stats,
      handle,
      filtered,
      filteredUnits,
      pagination,
      loadingDocUnits,
      docUnits,
      page,
      holderFilter,
      langFilter,
      countryFilter,
      dateFilter,
      languageNames,
      countryNames,
      sortedTypes,
      facets,
      listKey
    }
  }
}
</script>
