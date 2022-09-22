<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 mx-0 my-3">
      Personalities
    </h5>
    <p class="small col-md-8">A (non-exhaustive) set of persons derived from both EHRI cataloguing activities and structured data provided by EHRI partner institutions.</p>
  </div>
  <div v-if="loadingData">
    <LoadingComponent class="m-5"></LoadingComponent>
  </div>
  <div v-else>
    <AuthoritySetDetails :items-to-display="personalities" :total-items="pagination.total"
                         :total-pages="pagination.totalPages" :page-number="page" @pageChange="
                                (n) => {
                                  getNewPage(n);
                                }">
    </AuthoritySetDetails>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref} from "vue";
import {fetchFacetedPortalSearch} from "../services/EHRIGetters";
import AuthoritySetDetails from "./AuthoritySetItems.vue";

export default {
  name: "Personalities",
  components: {AuthoritySetDetails,LoadingComponent },
  props: {
    searchTerm: String,
  },
  setup(props){
    const personalityQuery = toRef(props, 'searchTerm')
    const loadingData = ref(true)
    const facets = ref({
      type: "HistoricalAgent",
      holder: "EHRI Personalities"
    })
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const personalities = ref()

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
    };

    const getPersonalities = async (pageNo) => {
      const response = await fetchFacetedPortalSearch(personalityQuery.value, pageNo,facets.value, 6)
      const data = response.data
      return data
    }

    const getNewPage = (pageNo) => {
      page.value = pageNo
      getPersonalities(page.value)
          .then(res => {
            personalities.value = res.data
            configPagination(res.meta)
            loadingData.value = false
          })
    }

    getPersonalities(page.value)
        .then(
            (res) =>{
              personalities.value = res.data
              configPagination(res.meta)
              loadingData.value = false
            }
        )
    return { personalities, page, pagination, loadingData, getNewPage}
  }
}
</script>

<style scoped>

</style>