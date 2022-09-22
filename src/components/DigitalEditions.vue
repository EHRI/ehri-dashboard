<template>
  <div class="blog-section">
    <div class="row g-0 mx-2 justify-content-center">
      <h4 class="display-4 text-center pt-3 pb-2">EHRI Digital TEI Editions</h4>
      <div class="col-md-6">
        <p class="small">The EHRI Online Editions consist of annotated digitized documents from various sources gathered around a theme, and are a new way of presenting digital archival content.</p>
      </div>
    </div>
    <div class="row g-0 justify-content-center"
       v-if="sortedDEResultsNonNull.length">
      <div v-for="i in sortedDEResultsNonNull"
           class="buttons m-0"
           @click="selectEdition(i[0])"
      >
        <button v-if="i[1]['pagination']['total']>0"
                type="button"
                class="mx-4 my-2 btn-sm stats-btn position-relative"
                :class="
{ active:i[1]['title']==selectedEdition['title'],}"
        >
          {{i[1]['title']}}
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill stats-span">
 {{i[1]['pagination']['total']}}{{i[1].isFiltered()?' (Filtered)':null}}
      </span>
        </button>
      </div>
      <div class="row p-4">
        <div class="row g-0 my-3 justify-content-center">
          <h4 class="display-5 mb-4">{{selectedEdition['title']}}</h4>
          <p class="small col-md-8">{{ selectedEdition['description']}}</p>
        </div>
        <div class="col-md-3 text-start">
          <h4>Filters</h4>
          <p>Choose one or more filters:</p>
          <div
              v-for="f in Object.entries(selectedEdition['facets'])">
            <DigitalEditionsFilter
                v-if="Object.keys(f[1]).length!==0&&f[0]!=='Featured'"
                :filter-name="f[0]"
                :filter-object="f[1]"
                @filterChange="(e) => {
                  handleFilter(e, f[0], selectedEdition['edition'])
                }"
            >
            </DigitalEditionsFilter>
          </div>

        </div>
        <div class="col-md-6">
          <h4 class="text-start mb-3">Documents</h4>
          <div v-if="selectedEdition.isFiltered()">
           <div> <span class="badge remove p-sm-1 mb-1" id="remove-filter" @click="handleFilter('','removeAll',selectedEdition['edition'])">Remove All Filters</span></div>
          Filters:
          <div class="filter-div" v-for="f in Object.entries(selectedEdition['filters'])">
            <span v-if="f[1]!==''" class="badge filter me-1"  @click="handleFilter('',f[0],selectedEdition['edition'])">{{f[1]}}</span>
          </div>

          <hr class="my-2">
          </div>

          <DigitalEditionItems
              :editionItemsArray="selectedEdition.isFiltered()?selectedEdition['filteredItems']:selectedEdition['items']"
              :headlineString="selectedEdition['title']" :edition="selectedEdition['edition']"></DigitalEditionItems>
          <EditionsPagination
              class="justify-content-center"
              v-if="selectedEdition.isFiltered()?selectedEdition['filteredItems'].length&&selectedEdition['filteredItems'].length>1:selectedEdition['items'].length&&selectedEdition['items'].length>1"
              :pagination-object="selectedEdition['pagination']"
              :current-page="selectedEdition['page']"
              @prev="
        --selectedEdition['page'];
        selectedEdition.getItems();
      "
              @next="
        selectedEdition['page']++;
        selectedEdition.getItems();
      "
          ></EditionsPagination>
        </div>
        <div class="col-md-3">
          <Chart
              :key="chartKey"
              v-if="selectedEdition.isFiltered()?selectedEdition['filteredItems'].length:selectedEdition['items'].length"
              :dataset="selectedEdition['facets']['Subject']">
          </Chart>
        </div>
      </div>
    </div>
    <div class="row g-0 justify-content-center" v-else>
      <LoadingComponent class="m-5 g-0"></LoadingComponent>
    </div>
  </div>

</template>

<script>
import { toRef, ref, watch } from "vue";
import {
  fetchETEitems,
  fetchDRitems,
  fetchBGFitems,
} from "../services/EHRIGetters.js";
import DigitalEditionItems from "./DigitalEditionItems.vue";
import EditionsPagination from "./EditionsPagination.vue";
import LoadingComponent from "./LoadingComponent.vue";
import DigitalEditionsFilter from "./DigitalEditionsFilter.vue";
import Chart from "./DigitalEditionsChart.vue";

export default {
  name: "DigitalEditions",
  props: {
    searchTerm: String,
  },
  components: {Chart, EditionsPagination, DigitalEditionItems, LoadingComponent, DigitalEditionsFilter},
  setup(props) {
    const searchTerm = toRef(props, "searchTerm");
    const per_page = ref(5)
    const sortedDEResults = ref([])
    const sortedDEResultsNonNull = ref([])
    const selectedEdition = ref({})
    const selectEdition = (key)=>{
      selectedEdition.value = DigitalEditionsData.value[key]
      chartRerender()
    }
    const chartKey = ref(0)

    const DigitalEditionsData = ref({
      ETE: {
        edition: "ETE",
        title: "Early Holocaust Testimony Edition",
        description: "This edition, for the first time, brings together samples of early testmonies of Jewish witnesses and survivors taken before the 1960s.",
        pagination:{
          totalPages: null,
          total: null,
          prevPage: null,
          nextPage: null,
        },
        page: 1,
        items: [],
        filteredItems: [],
        facets: {},
        filters: {
          Archive: "",
          Creator: "",
          Subject: "",
          Person: "",
          Organisation: "",
          Place: ""
        },
        loading: true,
        configPagination: () => {
          DigitalEditionsData.value.ETE.pagination["totalPages"] = (Math.floor(DigitalEditionsData.value.ETE.pagination['total']/per_page.value) + (DigitalEditionsData.value.ETE.pagination['total']%per_page.value?1:0));
          DigitalEditionsData.value.ETE.pagination["prevPage"] = DigitalEditionsData.value.ETE.page > 1 ? DigitalEditionsData.value.ETE.page : "";
          DigitalEditionsData.value.ETE.pagination["nextPage"] =
              DigitalEditionsData.value.ETE.page < DigitalEditionsData.value.ETE.pagination["totalPages"] ? DigitalEditionsData.value.ETE.page + 1 : "";
        },
        getItems: () => {
          fetchETEitems(searchTerm.value,DigitalEditionsData.value.ETE.page, 5, DigitalEditionsData.value.ETE.filters)
              .then((res) => {
            if(Object.entries(DigitalEditionsData.value.ETE.filters).map(v=>v[0]).some(v=> DigitalEditionsData.value.ETE.filters[v]!=="")){
              DigitalEditionsData.value.ETE.filteredItems = res.data.records;
            } else {
              DigitalEditionsData.value.ETE.items = res.data.records;
            }
            DigitalEditionsData.value.ETE.facets = res.data.facets
            DigitalEditionsData.value.ETE.pagination['total'] = +res.data.total
            DigitalEditionsData.value.ETE.configPagination()
            DigitalEditionsData.value.ETE.loading = false;
          });
        },
        isFiltered: () => {
          if(Object.entries(DigitalEditionsData.value.ETE.filters).map(v=>v[0]).some(v=> DigitalEditionsData.value.ETE.filters[v]!=="")){
            return true
          } else {
            return false
          }
        },
      },
      DRE: {
        edition: "DRE",
        title: "Diplomatic Reports Edition",
        description: "The online edition \"Diplomatic Reports\" focuses on how diplomatic staff reported the persecution and murder of European Jews during World War II.",
        pagination:{
          totalPages: null,
          total: null,
          prevPage: null,
          nextPage: null,
        },
        page: 1,
        items: [],
        filtered: false,
        filteredItems: [],
        facets: {},
        filters: {
          Coverage: "",
          Creator: "",
          Subject: "",
          Person: "",
          Organisation: ""
        },
        loading: true,
        configPagination: () => {
          DigitalEditionsData.value.DRE.pagination["totalPages"] = (Math.floor(DigitalEditionsData.value.DRE.pagination['total']/per_page.value) + (DigitalEditionsData.value.DRE.pagination['total']%per_page.value?1:0));
          DigitalEditionsData.value.DRE.pagination["prevPage"] = DigitalEditionsData.value.DRE.page > 1 ? DigitalEditionsData.value.DRE.page : "";
          DigitalEditionsData.value.DRE.pagination["nextPage"] =
              DigitalEditionsData.value.DRE.page < DigitalEditionsData.value.DRE.pagination["totalPages"] ? DigitalEditionsData.value.DRE.page + 1 : "";
        },
        getItems: () => {
          fetchDRitems(searchTerm.value,DigitalEditionsData.value.DRE.page,5, DigitalEditionsData.value.DRE.filters).then((res) => {
            if(Object.values(DigitalEditionsData.value.DRE.filters).map(v=>v).some(v=> v!=="")){
              DigitalEditionsData.value.DRE.filteredItems = res.data.records;
            } else {
              DigitalEditionsData.value.DRE.items = res.data.records;
            }
            DigitalEditionsData.value.DRE.facets = res.data.facets
            DigitalEditionsData.value.DRE.pagination['total'] = +res.data.total
            DigitalEditionsData.value.DRE.configPagination()
            DigitalEditionsData.value.DRE.loading = false;
          });
        },
        isFiltered: () => {
          if(Object.entries(DigitalEditionsData.value.DRE.filters).map(v=>v[0]).some(v=> DigitalEditionsData.value.DRE.filters[v]!=="")){
            return true
          } else {
            return false
          }
        }
      },
      BGFE: {
        edition: "BGFE",
        title: "BeGrenzte Flucht Edition",
        description: "The Austrian refugees on the border with Czechoslovakia in the crisis year 1938. (Edition available in German)",
        pagination:{
          totalPages: null,
          total: null,
          prevPage: null,
          nextPage: null,
        },
        page: 1,
        items: [],
        filtered: false,
        filteredItems: [],
        facets: {},
        filters: {
          Type: "",
          Creator: "",
          Subject: "",
          Person: "",
          Organisation: "",
          Place: ""
        },
        loading: true,
        configPagination: () => {
          DigitalEditionsData.value.BGFE.pagination["totalPages"] = (Math.floor(DigitalEditionsData.value.BGFE.pagination['total']/per_page.value) + (DigitalEditionsData.value.BGFE.pagination['total']%per_page.value?1:0));
          DigitalEditionsData.value.BGFE.pagination["prevPage"] = DigitalEditionsData.value.BGFE.page > 1 ? DigitalEditionsData.value.BGFE.page : "";
          DigitalEditionsData.value.BGFE.pagination["nextPage"] =
              DigitalEditionsData.value.BGFE.page < DigitalEditionsData.value.BGFE.pagination["totalPages"] ? DigitalEditionsData.value.BGFE.page + 1 : "";
        },
        getItems: () => {
          fetchBGFitems(searchTerm.value, DigitalEditionsData.value.BGFE.page, 5, DigitalEditionsData.value.BGFE.filters).then((res) => {
            if(Object.values(DigitalEditionsData.value.BGFE.filters).map(v=>v).some(v=> v!=="")){
              DigitalEditionsData.value.BGFE.filteredItems = res.data.records;
            } else {
              DigitalEditionsData.value.BGFE.items = res.data.records;
            }
            DigitalEditionsData.value.BGFE.facets = res.data.facets
            DigitalEditionsData.value.BGFE.pagination['total'] = res.data.total
            DigitalEditionsData.value.BGFE.configPagination()
            DigitalEditionsData.value.BGFE.loading = false
          });
        },
        isFiltered: () => {
          if(Object.entries(DigitalEditionsData.value.BGFE.filters).map(v=>v[0]).some(v=> DigitalEditionsData.value.BGFE.filters[v]!=="")){
            return true
          } else {
            return false
          }
        },
      },
    })

    const handleFilter = (val, type, edition) => {
      if (type ==='removeAll'){
        Object.keys(DigitalEditionsData.value[edition].filters).forEach(
            k=> {
              DigitalEditionsData.value[edition].filters[k]=''
            }
        )
        DigitalEditionsData.value[edition].getItems()
      }
      else if(val!==type) {
        DigitalEditionsData.value[edition].filters[type]=val
        DigitalEditionsData.value[edition].getItems()
      }
      else {
        DigitalEditionsData.value[edition].filters[type]=""
        DigitalEditionsData.value[edition].getItems()
      }
    }

    DigitalEditionsData.value.ETE.getItems()
    DigitalEditionsData.value.DRE.getItems()
    DigitalEditionsData.value.BGFE.getItems()
    const chartRerender = () => {
      chartKey.value+=1
    }
    watch(searchTerm, () => {
      DigitalEditionsData.value.ETE.getItems()
      DigitalEditionsData.value.DRE.getItems()
      DigitalEditionsData.value.BGFE.getItems()
    });

    watch([DigitalEditionsData.value], ()=>{
      if (Object.values(DigitalEditionsData.value).map(v => v).every(v => !v.loading)
          && (!selectedEdition.value || (selectedEdition.value && !selectedEdition.value['isFiltered']))
      ){
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
      }
      chartRerender()
    })

    return {
      sortedDEResultsNonNull,
      selectEdition,
      selectedEdition,
      handleFilter,
      chartKey
    };
  },
};
</script>

<style scoped>
.buttons {
  display: inline-flex!important;
  width: fit-content;
}
.stats-btn {
  background-color: #330033;
  color: #FFFFFF;
  opacity: 1!important;
  width:fit-content!important;
}
.stats-btn:hover {
  border: 3px solid #47817E;
}

.stats-btn:focus {
  box-shadow: none;
}

.stats-span {
  background-color: #47817E;
  color: #FFF;
}
.btn-sm {
  border: 3px solid transparent;
}
.active {
  background-color: #47817E;
  color: #FFFFFF;
}
.active .stats-span {
  background-color: #330033;
  color: #FFFFFF;
}
.badge {
  cursor: pointer;
}
.remove {
  background-color: #AE4249!important;
}

.filter-div {
  display: inline-flex;
}

.filter {
  color: #330033;
  background-color: #F5B651!important;
}
</style>
