<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 mx-0 my-3">
      EHRI Ghettos
    </h5>
    <p class="small col-md-8">EHRI Authority list of Ghettos in Nazi-occupied Europe. This authority list is based on the Encyclopedia of Ghettos of Yad Vashem and the Encyclopedia of Camps and Ghettos of the USHMM.</p>
  </div>
  <div v-if="loadingData">
    <LoadingComponent class="m-5"></LoadingComponent>
  </div>
  <div v-else>
    <VocabularyItems :items-to-display="ghettos" :total-items="pagination.total"
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
  name: "EHRIGhettos",
  components: {VocabularyItems, LoadingComponent, },
  props: {
    searchTerm: String,
  },
  setup(props){
    const ghettoQuery = toRef(props, 'searchTerm')
    const loadingData = ref(true)
    const facets = ref({
      type: "CvocConcept",
      holder: "EHRI Ghettos"
    })
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const ghettos = ref()

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
    };

    const getGhetto = async (pageNo) => {
      const response = await fetchFacetedPortalSearch(ghettoQuery.value, pageNo,facets.value, 6)
      const data = response.data
      return data
    }

    const getNewPage = (pageNo) => {
      page.value = pageNo
      getGhetto(page.value)
          .then(res => {
            ghettos.value = res.data
            configPagination(res.meta)
            loadingData.value = false
          })
    }

    getGhetto(page.value)
        .then(
            (res) =>{
              ghettos.value = res.data
              configPagination(res.meta)
              loadingData.value = false
            }
        )
    return {ghettos, page, pagination, loadingData, getNewPage}

  }
}
</script>

<style scoped>

</style>