<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 my-3">
      EHRI Camps
    </h5>
    <p class="small col-md-8">
      EHRI Authority list of Camps is predominantly based on the USHMM Encyclopedia of Camps and Ghettos (volumes 1-3). Other sources for primary and alternative name labels, geographic coordinates, and hierarchical relationships came from the International Tracing Service, Wikidata, Wikipedia, and Bundesarchiv.
    </p>
  </div>
  <div v-if="loadingData">
    <LoadingComponent class="m-5"></LoadingComponent>
  </div>
  <div v-else>
    <VocabularyItems :items-to-display="camps" :total-items="pagination.total"
                       :total-pages="pagination.totalPages" :page-number="page" @pageChange="
                                (n) => {
                                  getNewPage(n);
                                }">
    </VocabularyItems>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref} from "vue";
import {fetchFacetedPortalSearch} from "../services/EHRIGetters";
import VocabularyItems from "./VocabularyItems.vue";

export default {
  name: "EHRICamps",
  components: {VocabularyItems, LoadingComponent, },
  props: {
    searchTerm: String,
  },
  setup(props){
    const campQuery = toRef(props, 'searchTerm')
    const loadingData = ref(true)
    const facets = ref({
      type: "CvocConcept",
      holder: "EHRI Camps"
    })
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const camps = ref()

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
    };

    const getCamp = async (pageNo) => {
      const response = await fetchFacetedPortalSearch(campQuery.value, pageNo,facets.value, 6)
      const data = response.data
      return data
    }

    const getNewPage = (pageNo) => {
      page.value = pageNo
      getCamp(page.value)
          .then(res => {
            camps.value = res.data
            configPagination(res.meta)
            loadingData.value = false
          })
    }

    getCamp(page.value)
        .then(
            (res) =>{
              camps.value = res.data
              configPagination(res.meta)
              loadingData.value = false
            }
        )
    return {camps, page, pagination, loadingData, getNewPage}

  }
}
</script>

<style scoped>

</style>