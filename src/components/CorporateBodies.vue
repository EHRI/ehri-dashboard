<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 mx-0 my-3">
      Corporate Bodies
    </h5>
    <p class="small col-md-8">A (non-exhaustive) set of corporate bodies derived from both EHRI cataloguing activities and structured data provided by EHRI partner institutions.</p>
  </div>
  <div v-if="loadingData">
    <LoadingComponent class="m-5"></LoadingComponent>
  </div>
  <div v-else>
    <AuthoritySetItems :items-to-display="CBs" :total-items="pagination.total"
                      :total-pages="pagination.totalPages" :page-number="page" @pageChange="
                                (n) => {
                                  getNewPage(n);
                                }">
    </AuthoritySetItems>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref} from "vue";
import {fetchFacetedPortalSearch} from "../services/EHRIGetters";
import AuthoritySetItems from "./AuthoritySetItems.vue";

export default {
  name: "CorporateBodies",
  components: {AuthoritySetItems,LoadingComponent },
  props: {
    searchTerm: String,
  },
  setup(props){
    const CBQuery = toRef(props, 'searchTerm')
    const loadingData = ref(true)
    const facets = ref({
      type: "HistoricalAgent",
      holder: "EHRI Corporate Bodies"
    })
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const CBs = ref()

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
    };

    const getCB = async (pageNo) => {
      const response = await fetchFacetedPortalSearch(CBQuery.value, pageNo,facets.value, 6)
      const data = response.data
      return data
    }

    const getNewPage = (pageNo) => {
      page.value = pageNo
      getCB(page.value)
        .then(res => {
          CBs.value = res.data
          configPagination(res.meta)
          loadingData.value = false
        })
    }

    getCB(page.value)
      .then(
        (res) =>{
          CBs.value = res.data
          configPagination(res.meta)
          loadingData.value = false
        }
    )
    return { CBs, page, pagination, loadingData, getNewPage}
  }
}
</script>

<style scoped>

</style>