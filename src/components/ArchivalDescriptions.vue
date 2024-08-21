<template>
    <span class="col-span-12 flex justify-center bg-ehri-purple py-2 text-white xl:hidden col-span-12 font-sans" @click="toggleFilterBar">
      <span v-if="!showFilterBar" class="xl:hidden mr-2 cursor-pointer">
          <span
            class="material-symbols-outlined text-white pointer-events-none align-bottom"
          >
            filter_alt
          </span>
        {{ $t('filters') }} 
        <span v-if="filtered && !showFilterBar" class="xl:hidden mr-2 cursor-pointer">
          ({{ (holderFilter ? 1 : 0) + (langFilter ? 1 : 0) + (countryFilter ? 1 : 0) + (dateFilter ? 1 : 0) }})
        </span>
      </span>
      <span v-else class="xl:hidden mr-2 cursor-pointer">
              <span
            class="material-symbols-outlined text-white pointer-events-none align-bottom"
          >
            close
          </span>
          {{ $t('close') }} 
      </span>
  </span>
    <div  v-if="pagination.total" class="grid grid-cols-12 sm:grid-cols-8 sm:gap-0 h-screen xl:gap-4 max-w-full">
      <div class="col-span-12 bg-white shadow-xl h-screen xl:h-3/4 xl:col-span-5 xl:overflow-hidden">
        <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4 px-4">
          <span  class="font-serif font-extrabold">{{pagination.total}} </span>
          {{ pagination.total>1?$t('portalTypes.DocumentaryUnit',2):$t('portalTypes.DocumentaryUnit',1) }}
        </h4>
        <p class="font-sans text-ehri-dark text-sm px-4">{{ $t('portalTypesDesc.DocumentaryUnit') }}</p>
        <hr class="text-ehri-dark border-4 shadow-md mt-3 mx-4">
        <div class="pt-3 pb-0 h-full">
          <div v-if="!loadingDocUnits" class="h-full">
            <div :key="listKey" class="h-full">
                <Suspense>
                  <DocUnitItemsRest :search-term="docUnitQuery" :holder="holderFilter" :country="countryFilter" :language="langFilter" :dates="dateFilter" :total="pagination.total"></DocUnitItemsRest>
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
      <div :class="[filterBarClass, 'bg-ehri-purple', 'text-white', 'xl:text-ehri-dark', 'xl:col-span-3', 'col-span-12', 'xl:order-last', 'order-first', 'xl:bg-white', 'shadow-xl', 'xl:h-3/4', 'flex', 'flex-col']">
        <div v-if="!loadingDocUnits" class="h-full flex flex-col">
          <div class="px-4 pt-4 flex-shrink-0">
            <EHRIPortalTypeFilter
            :key="typeFilterKey"
            :selectedType="'DocumentaryUnit'"
            >
            </EHRIPortalTypeFilter>
            <OverviewCountryStats :key="countryFilterKey" class="mb-2" :dataset="stats.countries"></OverviewCountryStats>
            <h4 class="capitalize font-serif font-bold xl:text-ehri-dark">{{ $t('filters') }}</h4>
            <p v-if="!filtered" class="font-sans text-sm font-light">{{ $t('chooseFilters') }}</p>
            <div v-if="filtered">
                <h5 class="font-sans text-sm font-light">{{ $t('activeFilters') }}:</h5>
                <span class="w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="holderFilter" @click="handle('Institutions','holderFilter')">{{holderFilter.length>25?holderFilter.substring(0,25)+'...':holderFilter}}</span>
                <span class="w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="langFilter" @click="handle('','langFilter')">{{ getLocalizedLangName(langFilter)}} </span>
                <span class=" w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="countryFilter" @click="handle('','countryFilter')">{{getLocalizedCountryName(countryFilter.toUpperCase())}}</span>
                <span class="w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs" v-if="dateFilter" @click="handle('','dateFilter')">{{getLocalizedDateName(dateFilter).length>25?getLocalizedDateName(dateFilter).substring(0,25)+'...':getLocalizedDateName(dateFilter)}}</span>
                <div class="flex items-center my-2 cursor-pointer xl:text-ehri-wine text-sm" id="remove-filter" @click="(e) => handle(e,'removeAll')">
                  <span class="material-symbols-outlined pointer-events-none text-xs">
                    close
                  </span>
                  <span>{{ $t('removeAllFilters') }}</span>
                </div>
            </div>
            <hr class="hidden xl:block text-ehri-dark border-b-4 shadow-md pb-0 mb-0"/>
          </div>
          <div class="overflow-y-auto flex-grow">
            <div class="px-4 pb-6">
              <ArchivalDescriptionFilter
                filter-name="countries"
                :key="countryFilterKey"
                :filter-array="stats.countries"
                @filterChange="(e) => {
                  handle(e,'countryFilter')}"
              >
              </ArchivalDescriptionFilter>
              <ArchivalDescriptionFilter
                  filter-name="institutions"
                  :key="repoFilterKey"
                  :filter-array="stats.holders"
                  @filterChange="(e) => {handle(e,'holderFilter')}"
              >
              </ArchivalDescriptionFilter>
              <ArchivalDescriptionFilter
                  filter-name="languages"
                  :key="langFilterKey"
                  :filter-array="stats.langs"
                  @filterChange="(e) => {handle(e,'langFilter')}"
              >
              </ArchivalDescriptionFilter>
              <ArchivalDescriptionFilter
                  filter-name="dates"
                  :key="dateFilterKey"
                  :filter-array="stats.dates"
                  @filterChange="(e) => {handle(e,'dateFilter')}"
              >
              </ArchivalDescriptionFilter>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <loading-component class="m-5"></loading-component>
    </div>
</template> 

<script>
import {toRef, ref, Suspense, computed,} from "vue";
import DocUnitItemsRest from "./DocUnitItemsREST.vue"
import LoadingComponent from "./LoadingComponent.vue";
import { fetchFacetedDocUnits } from "../services/EHRIGetters";
import ArchivalDescriptionFilter from "./ArchivalDescriptionFilter.vue";
import EHRIPortalTypeFilter from "./EHRIPortalTypeFilter.vue";
import OverviewCountryStats from "./OverviewCountryStats.vue";
import { useI18n } from 'vue-i18n';

export default {
  name: "ArchivalDescriptions",
  components: { EHRIPortalTypeFilter, ArchivalDescriptionFilter, DocUnitItemsRest, LoadingComponent, OverviewCountryStats },
  props: {
    searchTerm: String,
    sortedTypes: Array,
  },
  setup(props) {
    const { t, locale } = useI18n();
    const docUnitQuery = toRef(props, 'searchTerm')
    const sortedTypes = toRef(props, 'sortedTypes')
    const listKey = ref(0)
    const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    const countryNames = new Intl.DisplayNames(['en'], {type: 'region'});
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
    const activeTab = ref('filters')
  

    // Useful to reload filter components when filters get removed
    const typeFilterKey = ref(0)
    const countryFilterKey = ref(0)
    const repoFilterKey = ref(0)
    const langFilterKey = ref(0)
    const dateFilterKey = ref(0)

    const handle = (val, type) => {
      filtered.value = false;
      type=="holderFilter"&&val!="Institutions"?holderFilter.value=val:val=="Institutions"?holderFilter.value=null:null
      type=="countryFilter"&&val!="Countries"?countryFilter.value=val:val=="Countries"?countryFilter.value=null:null
      type=="langFilter"&&val!="Languages"?langFilter.value=val:val=="Languages"?langFilter.value=null:null
      type=="dateFilter"&&val!="Dates"?dateFilter.value=val:val=="Dates"?dateFilter.value=null:null


    if(type=="removeAll"){
      loadingDocUnits.value = true
      facets.value = new Object()
      holderFilter.value = null
      langFilter.value = null
      dateFilter.value = null
      countryFilter.value = null
      fetchFacetedDocUnits(docUnitQuery.value, 1, null, 1)
          .then((res) => {
            configStats(res.data.meta.facets)
            page.value = 1
            configPagination(res.data.meta)
            loadingDocUnits.value = false
          })
    }
    if (!holderFilter.value &&
        !countryFilter.value &&
        !langFilter.value &&
        !dateFilter.value) {
      loadingDocUnits.value = true
      facets.value = new Object()
      fetchFacetedDocUnits(docUnitQuery.value, 1, null, 1)
          .then((res) => {
            configStats(res.data.meta.facets)
            page.value = 1
            configPagination(res.data.meta)
            loadingDocUnits.value = false
          })
    } else {
      loadingDocUnits.value = true
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
            loadingDocUnits.value = false
          })
    }
    }

    const getLocalizedCountryName = (iso2Code) => {
      const displayNames = new Intl.DisplayNames([locale.value], { type: "region" });
      return displayNames.of(iso2Code);
    };

    const getLocalizedLangName = (iso3Code) => {
      if (iso3Code === "mul") {
        return t('multipleLanguages');
      }
      const displayNames = new Intl.DisplayNames([locale.value], { type: "language" });
      return displayNames.of(iso3Code);
    };

    const getLocalizedDateName = (date) => {
      if (date === "-1913") {
        return t('before1913');
      }
      else if (date === "1946-") {
        return t('after1946');
      }
      else {
        return date
      }
    };

    const getAllDocUnits = async (pageNo) => {
      repoCounts.value.clear()
      countryCounts.value.clear()
      langCounts.value.clear()
      dateCounts.value.clear()
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
      getLocalizedDateName,
      getLocalizedCountryName,
      getLocalizedLangName,
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
      page,
      holderFilter,
      langFilter,
      countryFilter,
      dateFilter,
      languageNames,
      countryNames,
      sortedTypes,
      facets,
      listKey,
      activeTab
    }
  }
}
</script>
