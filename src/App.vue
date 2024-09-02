<script>
import { RouterView, useRoute } from 'vue-router'
import MainSidebar from './components/MainSidebar.vue';
import Home from './views/Home.vue';
import { useMainStore } from './stores/mainStore';
import { watch, computed } from 'vue';
import LoadingComponent from './components/LoadingComponent.vue';
import flag from './assets/eu_logo.svg';

export default {
  components: { MainSidebar, Home, LoadingComponent },
  setup() {
    const store = useMainStore();
    const route = useRoute();
    const isLoading = computed(() => store.isLoading);
    const dataSource = computed(() => store.dataSource);

    
    watch(
      () => route.params.query,
      (newQuery) => {
        store.setSearchTerm(newQuery || ''); 
      }
    );

    return { dataSource, isLoading, flag };
  }
};
</script>

<template>
  <div class="grid grid-cols-12 min-h-screen sm:h-screen overflow-hidden xl:max-h-screen bg-ehri-light-grey">
    <MainSidebar class="col-span-12 fixed sm:overflow-hidden top-0 sm:relative sm:col-span-4 xl:col-span-3"></MainSidebar>
    <router-view :key="$route.fullPath">
      <Home class="col-span-12 mt-16 sm:mt-0 px-0 overflow-y-auto xl:overflow-hidden sm:col-span-8 xl:col-span-9 sm:px-4 md:px-9" v-if="!isLoading" :dataSource="dataSource"></Home>
      <LoadingComponent v-else class="col-span-12 mt-16 sm:mt-0 px-2 overflow-y-auto sm:overflow-hidden sm:col-span-8 xl:col-span-9 xl:px-9"></LoadingComponent>
    </router-view>
    <div class="w-full bg-ehri-dark px-4 py-2 fixed bottom-0 flex flex-col sm:flex-row justify-between items-center text-center sm:space-y-0">
      <p class="text-ehri-beige font-light text-xs sm:text-left">
          <a href="https://portal.ehri-project.eu/data-policy" target="_blank" rel="noopener noreferrer" class="hover:underline">EHRI Data Policy</a>
      </p>
      <p class="text-ehri-beige font-light text-xs sm:text-center">
        <a href="https://www.ehri-project.eu/" target="_blank" rel="noopener noreferrer" class="hover:underline">
          &copy; {{ new Date().getFullYear() }} EHRI Consortium
        </a>
      </p>
      <p class="text-ehri-beige font-light text-xs flex items-center sm:justify-end">
        <a href="https://cordis.europa.eu/project/id/871111" target="_blank" rel="noopener noreferrer" class="inline-flex items-center hover:underline">
          <!-- <img :src="flag" alt="EHRI is funded by the European Commission." class="h-9 mr-2 hidden sm:block"> -->
          Funded by the European Commission
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>