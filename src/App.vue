<script>
import { RouterView } from 'vue-router'
import MainSidebar from './components/MainSidebar.vue';
import { ref } from 'vue';

export default {
  components: {MainSidebar},
  setup(){
    const dataSource = ref()

    const getDataSource = (d) => {
      dataSource.value = d
    }

    return { getDataSource, dataSource }
  }
};
</script>

<template>
  <div class="grid grid-cols-12 min-h-screen h-screen xl:max-h-screen xl:overflow-hidden bg-ehri-light-grey">
    <MainSidebar @data-source-change="(d)=>{getDataSource(d)}" class="col-span-12 fixed top-0 sm:relative sm:col-span-4 xl:col-span-3"></MainSidebar>
    <router-view v-if="dataSource" class="col-span-12 mt-16 sm:mt-0 px-4 overflow-auto xl:overflow-hidden sm:col-span-8 xl:col-span-9 xl:px-9" :key="$route.fullPath" :dataSourceValue="dataSource"></router-view>
    <div class="w-full bg-ehri-dark py-0.5 fixed bottom-0">
        <p class="text-center text-ehri-beige font-light text-xs"><a href="https://www.ehri-project.eu/" target="_blank" rel="noopener noreferrer">&copy; Copyright EHRI Consortium
            {{new Date().getFullYear()}}</a></p>
    </div>
  </div>
</template>

<style scoped>

</style>
