<template>
  <div>
    <div class="grid grid-cols-10 gap-4">
      <div v-if="dataSource && dataSource.component !== 'NoResults'" class="px-2 sm:px-0 col-span-10 sm:mx-0 xl:mb-3">
        <h3 class="font-sans capitalize text-ehri-dark font-thin text-3xl mt-4">{{ $t("resultsFrom",2) }} <span class="font-serif font-bold">{{ dataSourceTitle }}</span></h3>
        <p class="font-sans text-ehri-dark text-sm md:w-4/5">{{ dataSourceDescription }}</p>
        <p v-if="queryValue && queryValue.length" class="xl:hidden mt-2 text-sm font-medium text-ehri-dark">{{ $t("queryResultsMobile") }} 
          <span class="font-light italic font-serif text-ehri-purple text-lg">
          "{{ queryValue }}"
          </span>
        </p>
      </div>
      <ResourceView class="col-span-10"></ResourceView>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import ResourceView from "@/components/ResourceView.vue";
import { useI18n } from "vue-i18n";
import { useMainStore } from '@/stores/mainStore';

export default {
  name: "Home",
  components: { ResourceView },
  setup() {
    const { t } = useI18n();
    const store = useMainStore();
    const queryValue = computed(() => store.searchTerm) ;

    const dataSource = computed(() => store.dataSource);

    const dataSourceTitle = computed(() => {
      const titleKey = store.dataSource?.title?.replace(/\s+/g, '').toLowerCase();
      return t(`dataSource.${titleKey}`, store.dataSource?.title);
    });

    const dataSourceDescription = computed(() => {
      const titleKey = store.dataSource?.title?.replace(/\s+/g, '').toLowerCase();
      return t(`dataSourceDescriptions.${titleKey}`, store.dataSource?.title);
    });

    return { dataSource, dataSourceTitle, dataSourceDescription, queryValue }
  }
};
</script>

<style scoped>
</style>