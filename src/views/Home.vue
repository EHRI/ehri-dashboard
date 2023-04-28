<template>
  <div>
    <div class="grid grid-cols-8 gap-4">
      <div class="col-span-8 md:col-span-7 xl:mb-3">
        <h3 class="font-sans text-ehri-dark font-thin text-3xl mt-4">Showing results retrieved from the <span class="font-serif font-black">{{ dataSource.title }}</span></h3>
        <p class="font-sans text-ehri-dark text-sm md:w-4/5">{{ dataSource.description }}</p>
        <p v-if="queryValue.length" class="xl:hidden mt-2 text-sm font-medium text-ehri-dark">Showing results for: 
          <span class="font-light italic font-serif text-ehri-purple text-lg">
          "{{ queryValue }}"
          </span>
        </p>
      </div>
      <ResourceView class="col-span-8" :search-term="queryValue" :current="dataSource"></ResourceView>
    </div>
  </div>
  
</template>

<script>
import {computed, toRef} from "vue";
import ResourceView from "@/components/ResourceView.vue";

export default {
  name: "Dashboard",
  components: { ResourceView },
  props: {
    query: {
      type: String, 
      required: true,
    },
    dataSourceValue: {
      type: Object,
    }
  },
  setup(props){
    const queryValue = computed(()=>props.query)
    const dataSource = toRef(props,'dataSourceValue')


    return { queryValue, dataSource }
  }
};
</script>

<style scoped>
</style>