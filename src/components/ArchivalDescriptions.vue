<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 m-0 my-3">
      Archival Descriptions
    </h5>
    <p class="small col-md-8">Electronic descriptions and finding aids of Holocaust-related archival material.</p>
  </div>
  <div class="row mt-2 mx-0" v-if="!loadingDocUnits">
    <div class="col-md-3 text-start">
      <h4>Filters</h4>
      <p>Choose one or more filters:</p>
      <ArchivalDescriptionFilter
      filter-name="Countries"
      :key="countryFilterKey"
      :filter-object="stats.countries"
      @filterChange="(e) => {
        handle(e,'countryFilter')}"
      >
      </ArchivalDescriptionFilter>
      <ArchivalDescriptionFilter
          filter-name="Institutions"
          :key="repoFilterKey"
          :filter-object="stats.holders"
          @filterChange="(e) => {handle(e,'holderFilter')}"
      >
      </ArchivalDescriptionFilter>
      <ArchivalDescriptionFilter
          filter-name="Languages"
          :key="langFilterKey"
          :filter-object="stats.langs"
          @filterChange="(e) => {handle(e,'langFilter')}"
      >
      </ArchivalDescriptionFilter>
    </div>

    <div class="col-md-6">
      <div v-if="!loadingDocUnits">
        <h4 class="text-start mb-5">Descriptions</h4>
        <div v-if="!filtered">
          <DocUnitItemsRest :items-to-display="docUnits" :total-items="pagination.total"
                            :total-pages="pagination.totalPages" :page-number="page"
                            @pageChange="
                (n) => {
                  getNewPage(n);
                }"></DocUnitItemsRest>
        </div>
        <div v-else>
          <div><span class="badge remove p-sm-1 mb-1" id="remove-filter" @click="(e) => handle(e,'removeAll')">Remove All Filters</span></div>
          Filters:
          <span class="badge filter me-1" v-if="holderFilter" @click="handle('','holderFilter')">{{holderFilter.length>40?holderFilter.substring(0,40)+'...':holderFilter}}</span>
          <span class="badge filter me-1" v-if="langFilter" @click="handle('','langFilter')">{{languageNames.of(langFilter)}}</span>
          <span class="badge filter me-1" v-if="countryFilter" @click="handle('','countryFilter')">{{countryNames.of(countryFilter.toUpperCase())}}</span>
          <hr class="my-2">
          <DocUnitItemsRest :items-to-display="filteredUnits" :total-items="pagination.total"
                            :total-pages="pagination.totalPages" :page-number="page" @pageChange="
                                (n) => {
                                  getNewPage(n);
                                }">
          </DocUnitItemsRest>
        </div>
      </div>
      <div v-else>
        <loading-component></loading-component>
      </div>
    </div>
    <div class="col-md-3">
      <chart v-if="stats.countries&& stats.countries.length" :dataset="stats"></chart>
    </div>
  </div>
  <div v-else class="row g-0 justify-content-center">
    <loading-component class="m-5"></loading-component>
  </div>
</template>

<script>
import {toRef, ref } from "vue";
import DocUnitItemsRest from "./DocUnitItemsREST.vue"
import LoadingComponent from "./LoadingComponent.vue";
import {fetchFacetedDocUnits, fetchFacetedPortalSearch} from "../services/EHRIGetters";
import ArchivalDescriptionFilter from "./ArchivalDescriptionFilter.vue";
import Chart from "./PieChart.vue";

export default {
  name: "ArchivalDescriptions",
  components: {Chart, ArchivalDescriptionFilter, DocUnitItemsRest, LoadingComponent},
  props: {
    searchTerm: String,
  },
  setup(props) {
    const docUnitQuery = toRef(props, 'searchTerm')
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
    const langCounts = ref(new Map())
    const countryCounts = ref(new Map())
    const filterValue = ref();
    const filtered = ref(false);
    const filteredUnits = ref([]);
    const stats = ref({
      holders: null,
      countries: null,
      langs: null
    })
    const holderFilter = ref(null)
    const countryFilter = ref(null)
    const langFilter = ref(null)
    const facets = ref(new Object())
    const id_name_dict = ref(new Map())

    // Useful to reload filter components when filters get removed
    const countryFilterKey = ref(0)
    const repoFilterKey = ref(0)
    const langFilterKey = ref(0)
    const reloadingDescs =ref(false)

    const handle = (val, type) => {
      type=="holderFilter"&&val!="Institutions"?holderFilter.value=val:val=="Institutions"?holderFilter.value=null:null
      type=="countryFilter"&&val!="Countries"?countryFilter.value=val:val=="Countries"?countryFilter.value=null:null
      type=="langFilter"&&val!="Languages"?langFilter.value=val:val=="Languages"?langFilter.value=null:null

    // the name of the institution clicked
    if(type=="removeAll"){
      filtered.value = false;
      facets.value = new Object()
      holderFilter.value = null
      langFilter.value = null
      countryFilter.value = null
      countryFilterKey.value+=1
      langFilterKey.value+=1
      repoFilterKey.value+=1
    }
    if (!holderFilter.value &&
        !countryFilter.value &&
        !langFilter.value) {
      filtered.value = false;
      countryFilterKey.value+=1
      langFilterKey.value+=1
      repoFilterKey.value+=1
      facets.value = new Object()
      fetchFacetedDocUnits(docUnitQuery.value, 1)
          .then((res) => {
            docUnits.value = res.data.data
            docUnits.value.map((item) => {
              item['repoName'] = id_name_dict.value.get(item.relationships.holder.data.id)
            })
            page.value = 1
            configPagination(res.data.meta)
          })
    } else {
      facets.value = new Object()
      holderFilter.value ? facets.value['holder']=encodeURIComponent(holderFilter.value) : null
      countryFilter.value ? facets.value['country']= countryFilter.value: null
      langFilter.value ? facets.value['lang']= langFilter.value : null


      fetchFacetedDocUnits(docUnitQuery.value, 1, facets.value)
          .then(res => {
            filteredUnits.value = res.data.data
            filteredUnits.value.map((item) => {
              item['repoName'] = id_name_dict.value.get(item.relationships.holder.data.id)
            })
            page.value = 1
            configPagination(res.data.meta)
            filtered.value = true;
          })
    }
    }

    const getFacetedUnits = async (pageNo, facets) => {
      let res = await fetchFacetedDocUnits(docUnitQuery.value, pageNo, facets)
      const data = res.data.data
      configPagination(res.data.meta)
      return data
    }

    const getAllDocUnits = async (pageNo) => {
      repoCounts.value.clear()
      countryCounts.value.clear()
      langCounts.value.clear()
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
    };

    const getNewPage = (pageNo) => {
      reloadingDescs.value = true
      page.value = pageNo
      if(filtered.value){
        getFacetedUnits(page.value, facets.value)
            .then(res => {
              filteredUnits.value = res
              filteredUnits.value.map((item) =>{
                item['repoName']= id_name_dict.value.get(item.relationships.holder.data.id)
              })
              reloadingDescs.value = false
            })
      } else {
        fetchFacetedDocUnits(docUnitQuery.value, page.value)
            .then(res=>{
                  docUnits.value = res.data.data
                  docUnits.value.map((item) =>{
                    item['repoName']= id_name_dict.value.get(item.relationships.holder.data.id)
                  })
              reloadingDescs.value = false
                }
            )
      }
    }

    const getNames = () => {
      repoCounts.value.forEach((v,k) => {
        fetchFacetedPortalSearch(k,1, {'type': 'Repository'})
            .then((res)=>
                {
                  try{
                    let n = res.data.data[0].id
                    id_name_dict.value.set(n,k)
                  } catch (error) {
                    console.log(`Failed to add item to dict.`);
                  }
                }
            ).then(()=>{
          docUnits.value.map((item) =>{
            item['repoName']= id_name_dict.value.get(item.relationships.holder.data.id)
          })

          loadingDocUnits.value = false;
        })
      })
    }

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
            getNames()
            stats.value.langs.forEach((l)=>{
              langCounts.value.set(l.name, l.count)
            })
            stats.value.countries.forEach((c)=>{
              countryCounts.value.set(c.name, c.count)
            })
          loadingDocUnits.value=false
        }}
    )

    return{
      countryFilterKey,
      repoFilterKey,
      langFilterKey,
      stats,
      handle,
      filtered,
      filteredUnits,
      getNewPage,
      pagination,
      loadingDocUnits,
      docUnits,
      page,
      holderFilter,
      langFilter,
      countryFilter,
      languageNames,
      countryNames }
  }
}
</script>

<style scoped>
.badge {
  cursor: pointer;
}
.remove {
  background-color: #AE4249!important;
}

.filter {
  color: #330033;
  background-color: #F5B651!important;
}
</style>