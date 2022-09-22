<template>
  <div class="row g-0 my-3 justify-content-center">
    <h5 class="display-5 mx-0 my-3">
      Archival Institutions
    </h5>
    <p class="small col-md-8">An inventory of archival institutions that hold Holocaust-related material.</p>
  </div>
  <div v-if="loadingData">
    <LoadingComponent class="m-5"></LoadingComponent>
  </div>
  <div class="m-0" v-else>
    <ArchivalInstitutionItems :items-to-display="repos" :total-items="pagination.total"
                       :total-pages="pagination.totalPages" :page-number="page" @pageChange="
                                (n) => {
                                  getNewPage(n);
                                }">
    </ArchivalInstitutionItems>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import {toRef,ref} from "vue";
import {fetchFacetedPortalSearch} from "../services/EHRIGetters";
import ArchivalInstitutionItems from "./ArchivalInstitutionItems.vue";

export default {
  name: "Archival Institutions",
  components: {ArchivalInstitutionItems, LoadingComponent, },
  props: {
    searchTerm: String,
  },
  setup(props){
    const repoQuery = toRef(props, 'searchTerm')
    const loadingData = ref(true)
    const facets = ref({
      type: "Repository"
    })
    const page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
    });
    const repos = ref()

    const configPagination = (meta) => {
      pagination.value["totalPages"] = meta.pages;
      pagination.value["total"] = meta.total;
    };

    const getRepos = async (pageNo) => {
      const response = await fetchFacetedPortalSearch(repoQuery.value, pageNo,facets.value, 6)
      const data = response.data
      return data
    }

    const getNewPage = (pageNo) => {
      page.value = pageNo
      getRepos(page.value)
          .then(res => {
            repos.value = res.data
            configPagination(res.meta)
            loadingData.value = false
          })
    }

    getRepos(page.value)
        .then(
            (res) =>{
              repos.value = res.data
              configPagination(res.meta)
              loadingData.value = false
            }
        )
    return {repos, page, pagination, loadingData, getNewPage}
  }
}
</script>

<style scoped>

</style>