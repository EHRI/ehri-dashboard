<template>
    <span class="flex justify-center bg-ehri-purple py-2 text-white xl:hidden col-span-12 text-ehri-dark font-sans " @click="toggleFilterBar">
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
  <div v-if="!loading && !showFilterBar && selectedEdition.isFiltered()" class="xl:hidden pt-1 px-2">
            <h5 class="font-sans text-sm text-ehri-purple block font-medium">{{ $t('activeFilters') }}:</h5>
              <div class="" v-for="f in Object.entries(selectedEdition['filters'])">
                <span v-if="f[1]!==''" class="inline mt-1 w-fit cursor-pointer border border-ehri-dark rounded-full bg-ehri-dark text-white mr-1 px-2 py-0.5 text-xs"
                  @click="handleFilter('',f[0],selectedEdition['edition'])">{{f[1]}}</span>
              </div>
              <div class="flex items-center mt-1 cursor-pointer text-ehri-purple text-sm" id="remove-filter" @click="() => handleFilter('','removeAll',selectedEdition['edition'])">
                <span class="material-symbols-outlined pointer-events-none text-xs">
                  close
                </span>
                <span>{{ $t('removeAllFilters') }}</span>
              </div>
  </div>
  <div class="grid grid-cols-12 sm:grid-cols-8 gap-8 h-screen max-w-full"  v-if="!loading">
    <div class="h-5/6 col-span-12 bg-white shadow-xl xl:h-3/4 xl:col-span-6 overflow-hidden px-7">
      <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4">
        <span v-if="selectedEdition.pagination.total" class="font-serif font-extrabold">{{selectedEdition.pagination.total + " "}}</span> 
        <LoadingComponent v-else></LoadingComponent> 
        <span> {{ selectedEdition.pagination.total>1 ? $t('resultsFrom', 2)  + " ": $t('resultsFrom', 1)  + " "}} </span> 
        <span class="font-serif font-extrabold"> {{ selectedEdition['title'] }} </span>
      </h4>
      <p class="font-sans text-ehri-dark text-sm">{{ selectedEdition['description'] }}</p>
      <hr class="text-ehri-dark border-4 shadow-md mt-3">
      <div class="pr-1 pt-3 pb-0 h-full">
        <div class="h-5/6">
          <div class="h-full flex flex-col">
            <ul  v-if="selectedEdition && !selectedEdition.isFiltered()" ref="el" class="h-5/6 overflow-y-auto">
              <DigitalEditionItem v-for="item of selectedEdition['items']" :key="item.id" :editionObject="item" :edition-string="selectedEdition['edition']"></DigitalEditionItem>
              <li v-if="selectedEdition.loading" class="w-full flex justify-center items-center py-2">
                <LoadingComponent></LoadingComponent>
              </li>
            </ul>
            <ul v-else ref="el" class="h-5/6 overflow-y-auto">
              <DigitalEditionItem v-for="item of selectedEdition['filteredItems']" :key="item.id" :editionObject="item" :edition-string="selectedEdition['edition']"></DigitalEditionItem>
              <li v-if="selectedEdition.loading" class="w-full flex justify-center items-center py-2">
                <LoadingComponent></LoadingComponent>
              </li>
            </ul>
        </div>
      </div>
    </div>
    </div>
    <div :class="[filterBarClass, 'bg-ehri-purple','overflow-hidden', 'text-white','xl:text-ehri-dark', 'xl:col-span-2', 'col-span-12', 'xl:order-last', 'order-first', 'xl:bg-white', 'shadow-xl', 'xl:h-3/4',]">
      <div class="h-full flex flex-col">
        <div class="px-4 flex-shrink-0">
          <h5 class="mt-3 capitalize font-serif font-bold text-sm xl:text-ehri-dark ">{{ $t('onlineEdition') }}</h5>
          <select v-if="sortedDEResultsNonNull" @change="(e)=>selectEdition(e)" class="text-ehri-dark font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" aria-label="Online Edition Filter">
            <option v-for="i in sortedDEResultsNonNull" :key="i[0]" :value="i[0]" :selected="selectedEdition['edition'] === i[0]">{{ i[1]['title']+" (" +i[1]['pagination']['total']+")" }} </option>
          </select>
        <Chart
          class="w-1/4 xl:w-full mx-auto pb-2 z-0"
              :key="chartKey"
              v-if="selectedEdition.isFiltered()?selectedEdition['filteredItems'].length:selectedEdition['items'].length"
              :dataset="selectedEdition['facets']['Subject']?selectedEdition['facets']['Subject']:selectedEdition['facets']['Klíčová slova']?selectedEdition['facets']['Klíčová slova']:null">
        </Chart>
        <h4 class="capitalize font-serif font-bold text xl:text-ehri-dark">{{ $t('filters') }}</h4>
        <p v-if="!selectedEdition.isFiltered()" class="font-sans text-sm font-light mb-4">{{ $t('chooseFilters') }}</p>
        <div v-if="selectedEdition.isFiltered()">
            <h5 class="font-serif text-sm font-extralight">{{ $t('activeFilters') }}:</h5>
              <div class="" v-for="f in Object.entries(selectedEdition['filters'])">
                <span v-if="f[1]!==''" class="block mt-1 w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs"
                  @click="handleFilter('',f[0],selectedEdition['edition'])">{{
      f[1].length > 15? f[1].substring(0,15)+"...":f[1]}}</span>
              </div>
              <div class="flex items-center my-2 cursor-pointer xl:text-ehri-wine text-sm" id="remove-filter" @click="() => handleFilter('','removeAll',selectedEdition['edition'])">
                <span class="material-symbols-outlined pointer-events-none text-xs">
                  close
                </span>
                <span>{{$t('removeAllFilters')}}</span>
              </div>
          </div>
          <hr class="hidden xl:block text-ehri-dark border-b-4 shadow-md pb-0 mb-0"/>
        </div>
        <div class="overflow-y-auto flex-grow pb-6">
          <div class="px-4"
              v-for="f in Object.entries(selectedEdition['facets'])">
            <DigitalEditionsFilter
                v-if="Object.keys(f[1]).length!==0&&f[0]!=='Featured'"
                :key="filterKey"
                :filter-name="f[0]"
                :filter-object="f[1]"
                @filterChange="(e) => {
                  handleFilter(e, f[0], selectedEdition['edition'])
                }"
            >
            </DigitalEditionsFilter>
          </div>
        </div>
      </div>
    </div>
  </div>
  <LoadingComponent v-else></LoadingComponent>
</template>

<script>
import { toRef, ref, watch, computed } from "vue";
import {
  fetchEditionItems,
} from "../services/EHRIGetters.js";
import { editionsConfig } from "../services/editionsConfig.js"
import LoadingComponent from "./LoadingComponent.vue";
import DigitalEditionsFilter from "./DigitalEditionsFilter.vue";
import Chart from "./DigitalEditionsChart.vue";
import { useInfiniteScroll } from '@vueuse/core'
import DigitalEditionItem from "./DigitalEditionItem.vue"

export default {
  name: "DigitalEditions",
  props: {
    searchTerm: String,
  },
  components: {Chart, DigitalEditionItem, LoadingComponent, DigitalEditionsFilter},
  setup(props) {
    const searchTerm = toRef(props, "searchTerm");
    const sortedDEResults = ref([])
    const sortedDEResultsNonNull = ref([])
    const selectedEdition = ref({})
    const chartKey = ref(0)
    const el = ref(null)
    const filterKey = ref(0)
    const showFilterBar = ref(false);
    const DigitalEditionsData = ref({});

    const generateEdition = (editionKey, config) => {
      return {
        edition: editionKey,
        title: config.title,
        description: config.description,
        pagination: {
          total: null,
        },
        page: 1,
        items: [],
        filteredItems: [],
        facets: {},
        filters: { ...config.filters },
        loading: false,
        apiEndpoint: config.apiEndpoint,
        getUnitsOnScroll: async ()=> {
        try {
          DigitalEditionsData.value[editionKey].loading = true;
          const newUnits = await fetchEditionItems(
            DigitalEditionsData.value[editionKey].apiEndpoint,
            searchTerm.value,
            DigitalEditionsData.value[editionKey].page,
            10,
            DigitalEditionsData.value[editionKey].filters
          );
          
          const targetItems = Object.values(DigitalEditionsData.value[editionKey].filters).some(v => v !== "")
            ? DigitalEditionsData.value[editionKey].filteredItems
            : DigitalEditionsData.value[editionKey].items;

          newUnits.data.records.forEach(newItem => {
            if (!targetItems.some(item => item.id === newItem.id)) {
              targetItems.push(newItem);
            }
          });

          DigitalEditionsData.value[editionKey].facets = newUnits.data.facets;
          DigitalEditionsData.value[editionKey].pagination.total = newUnits.data.total;
          DigitalEditionsData.value[editionKey].page++;
        } catch (error) {
          console.error(`Error fetching data for the ${editionKey}:`, error);
        } finally {
          DigitalEditionsData.value[editionKey].loading = false;
        }
        },
        isFiltered: () => {
          return Object.entries(DigitalEditionsData.value[editionKey].filters).some((v) => v[0] !== "" && v[1] !== "");
        },
      };
    };

    for (const editionKey in editionsConfig) {
      DigitalEditionsData.value[editionKey] = generateEdition(editionKey, editionsConfig[editionKey]);
    }

    const handleFilter = (val, type, edition) => {
      if (type ==='removeAll'){
        Object.keys(DigitalEditionsData.value[edition].filters).forEach(
            k=> {
              DigitalEditionsData.value[edition].filters[k]=''
            }
        )
        DigitalEditionsData.value[edition].page = 1
        DigitalEditionsData.value[edition].items = []
        DigitalEditionsData.value[edition].filteredItems = []
        filterKey.value+=1
        DigitalEditionsData.value[edition].getUnitsOnScroll()
      }
      else if(val.length && val!==type) {
        DigitalEditionsData.value[edition].page = 1
        DigitalEditionsData.value[edition].items = []
        DigitalEditionsData.value[edition].filteredItems = []
        DigitalEditionsData.value[edition].filters[type]=val
        filterKey.value+=1
        DigitalEditionsData.value[edition].getUnitsOnScroll()
      }
      else if(!val.length && val!==type) {
        DigitalEditionsData.value[edition].filters[type]=""
        DigitalEditionsData.value[edition].page = 1
        DigitalEditionsData.value[edition].items = []
        DigitalEditionsData.value[edition].filteredItems = []
        filterKey.value+=1
        DigitalEditionsData.value[edition].getUnitsOnScroll()
      }
      chartRerender()
    }

    const selectEdition = (key)=>{
      selectedEdition.value = {}
      selectedEdition.value.page = 1
      selectedEdition.value = DigitalEditionsData.value[key.target.value]
      selectedEdition.value.getUnitsOnScroll()
      chartRerender()
    }

    const chartRerender = () => {
      chartKey.value+=1
    }

    const filterBarClass = computed(() => {
            return showFilterBar.value
            ? "w-full h-max m-0 p-0 bg-ehri-purple xl:w-auto xl:block transition-all ease-in-out duration-600"
            : "w-full h-0 transition-all ease-in-out overflow-hidden duration-800 xl:w-auto ";
        });

   
    const toggleFilterBar = () => {
      showFilterBar.value = !showFilterBar.value;
    };

    watch(searchTerm, () => {
      for (const editionKey in DigitalEditionsData.value) {
        if (DigitalEditionsData.value.hasOwnProperty(editionKey)) {
          DigitalEditionsData.value[editionKey].getUnitsOnScroll()
        }
      }
    });

    const loading = ref(true)

    watch([DigitalEditionsData.value], ()=>{
      if (Object.values(DigitalEditionsData.value).map(v => v).every(v => !v.loading)
          && (!selectedEdition.value || (selectedEdition.value && !selectedEdition.value['isFiltered']))
      ){
        loading.value = true
        let entries = Object.entries(DigitalEditionsData.value).map(v => v);
        sortedDEResults.value = entries.sort((a, b) => b[1]['pagination']['total'] - a[1]['pagination']['total'])
        sortedDEResultsNonNull.value = sortedDEResults.value.filter(i => {
              if (i[1]['pagination']['total']>0){
                return i
              }
            }
        )
        if(selectedEdition.value['items']&&selectedEdition.value['items'].length){
          return false
        } else {
          selectedEdition.value = DigitalEditionsData.value[sortedDEResultsNonNull.value[0][0]]
        }
        loading.value = false
      }
    })

    useInfiniteScroll(
      el,
      async () => {
        if (selectedEdition.value.page <= Math.ceil(selectedEdition.value.pagination.total / 10)) {
          await selectedEdition.value.getUnitsOnScroll()
        }
      },
      { distance: 10 }
    )

    for (const editionKey in DigitalEditionsData.value) {
      if (DigitalEditionsData.value.hasOwnProperty(editionKey)) {
        DigitalEditionsData.value[editionKey].getUnitsOnScroll();
      }
    }

    return {
      loading,
      sortedDEResultsNonNull,
      selectEdition,
      selectedEdition,
      handleFilter,
      chartKey,
      el,
      filterKey,
      showFilterBar,
      toggleFilterBar,
      filterBarClass
    };
  },
};
</script>

<style scoped>

</style>
