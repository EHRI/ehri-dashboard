<template>
  <div>
    <div class="grid grid-cols-10 gap-4">
      <div v-if="dataSource.component !== 'NoResults'" class="col-span-10 sm:mx-0 xl:mb-3">
        <h3 class="font-sans capitalize text-ehri-dark font-thin text-3xl mt-4">{{ $t("resultsFrom",2) }} <span class="font-serif font-bold">{{ dataSourceTitle }}</span></h3>
        <p class="font-sans text-ehri-dark text-sm md:w-4/5">{{ dataSourceDescription }}</p>
        <p v-if="queryValue.length" class="xl:hidden mt-2 text-sm font-medium text-ehri-dark">{{ $t("queryResultsMobile") }} 
          <span class="font-light italic font-serif text-ehri-purple text-lg">
          "{{ queryValue }}"
          </span>
        </p>
      </div>
      <ResourceView class="col-span-10" :search-term="queryValue" :current="dataSource"></ResourceView>
    </div>
  </div>
  
</template>

<script>
import {computed, toRef} from "vue";
import ResourceView from "@/components/ResourceView.vue";
import {useI18n} from "vue-i18n";

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
    const { t } = useI18n();
    const queryValue = computed(()=>props.query)
    const dataSource = toRef(props,'dataSourceValue')

    const dataSourceTitle = computed(() => {
      const titleKey = dataSource.value.title.replace(/\s+/g, '').toLowerCase();
      return t(`dataSource.${titleKey}`, dataSource.value.title);
    });

    const dataSourceDescription = computed(() => {
      const titleKey = dataSource.value.title.replace(/\s+/g, '').toLowerCase();
      return t(`dataSourceDescriptions.${titleKey}`, dataSource.value.title);
    });


    return { queryValue, dataSource, dataSourceTitle, dataSourceDescription }
  }
};
</script>

<style scoped>
</style>