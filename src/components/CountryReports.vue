<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 mx-0 my-3">
      Country Reports
    </h5>
    <p class="small col-md-8">
      EHRI national reports provide an overview of the Second World War and Holocaust history as well as of the archival situation in the covered countries.
    </p>
  </div>
  <div v-if="loadingData">
    <LoadingComponent class="m-5"></LoadingComponent>
  </div>
  <div v-else>
    <CountryReportItems :items-to-display="countries" :total-items="pagination.total"
                      :total-pages="pagination.totalPages" :page-number="page" @pageChange="
                                (n) => {
                                  getNewPage(n);
                                }">
    </CountryReportItems>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref} from "vue";
import {fetchFacetedPortalSearch} from "../services/EHRIGetters";
import CountryReportItems from "./CountryReportItems.vue";

export default {
  name: "CountryReports",
  components: {CountryReportItems, LoadingComponent },
  props: {
    searchTerm: String,
  },
  setup(props){
    const countryQuery = toRef(props, 'searchTerm')
    const loadingData = ref(true)
    const facets = ref({
      type: "Country",
    })
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const countries = ref()

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
    };

    const getCountries = async (pageNo) => {
      const response = await fetchFacetedPortalSearch(countryQuery.value, pageNo,facets.value, 6)
      const data = response.data
      return data
    }

    const getNewPage = (pageNo) => {
      page.value = pageNo
      getCountries(page.value)
        .then(res => {
          countries.value = res.data
          configPagination(res.meta)
          loadingData.value = false
        })
    }

    getCountries(page.value)
      .then(
        (res) =>{
          countries.value = res.data
          configPagination(res.meta)
          loadingData.value = false
        }
    )
    return {countries, page, pagination, loadingData, getNewPage}
  }
}
</script>

<style scoped>

</style>