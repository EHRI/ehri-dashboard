<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 my-3 mx-0">
      EHRI Terms
    </h5>
    <p class="small col-md-8">A hierarchically organised, multi-lingual set of subject headings developed by EHRI.</p>
  </div>
  <div v-if="loadingData">
    <LoadingComponent class="m-5"></LoadingComponent>
  </div>
  <div v-else>
    <EHRITermItems :items-to-display="terms" :total-items="pagination.total"
                     :total-pages="pagination.totalPages" :page-number="page" @pageChange="
                                (n) => {
                                  getNewPage(n);
                                }">
    </EHRITermItems>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref} from "vue";
import {fetchFacetedPortalSearch} from "../services/EHRIGetters";
import EHRITermItems from "./EHRITermItems.vue";

export default {
  name: "EHRITerms",
  components: {EHRITermItems, LoadingComponent, },
  props: {
    searchTerm: String,
  },
  setup(props){
    const termQuery = toRef(props, 'searchTerm')
    const loadingData = ref(true)
    const facets = ref({
      type: "CvocConcept",
      holder: "EHRI Terms"
    })
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const terms = ref()

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
    };

    const getTerms = async (pageNo) => {
      const response = await fetchFacetedPortalSearch(termQuery.value, pageNo,facets.value, 6)
      const data = response.data
      return data
    }

    const getNewPage = (pageNo) => {
      page.value = pageNo
      getTerms(page.value)
          .then(res => {
            terms.value = res.data
            configPagination(res.meta)
            loadingData.value = false
          })
    }

    getTerms(page.value)
        .then(
            (res) =>{
              terms.value = res.data
              configPagination(res.meta)
              loadingData.value = false
            }
        )
    return { terms,page, pagination, loadingData, getNewPage}

  }
}
</script>

<style scoped>

</style>