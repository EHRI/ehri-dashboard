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
  <div class="grid grid-cols-12 min-h-screen h-screen lg:max-h-screen lg:overflow-hidden bg-ehri-light-grey">
    <MainSidebar @data-source-change="(d)=>{getDataSource(d)}" class="col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-3"></MainSidebar>
    <router-view v-if="dataSource" class="col-span-12 px-4 overflow-scroll lg:overflow-hidden sm:col-span-8 lg:col-span-9 md:col-span-9 lg:pl-9 lg:pr-4" :key="$route.fullPath" :dataSourceValue="dataSource"></router-view>
    <!-- <router-view v-if="dataSource" class="col-span-12 overflow-scroll lg:overflow-hidden sm:col-span-8 lg:col-span-10 md:col-span-9" :key="$route.fullPath" :dataSourceValue="dataSource"></router-view> -->
    <div class="w-full bg-ehri-dark bottom-0 absolute">
        <p class="text-center text-ehri-beige font-light text-xs"><a href="https://www.ehri-project.eu/" target="_blank" rel="noopener noreferrer">&copy; Copyright EHRI Consortium
            {{new Date().getFullYear()}}</a></p>
    </div>
  </div>
</template>

<style scoped>

</style>
