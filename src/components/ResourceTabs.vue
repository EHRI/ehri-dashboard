<template>
  <div>
    <div v-if="filteredTabComponent.length">
      <ul class="mx-0">
        <li
          v-for="tab in filteredTabComponent" :key="tab.title"
          @click="dataSourceChange(tab)"
        >
          <a 
            class="grid grid-cols-5 py-1 text-white px-1 hover:bg-white hover:text-ehri-purple text-sm font-sans font-light cursor-pointer" 
            :class="{
              'bg-black': tab.title === currentTab?.title, // Use optional chaining
              'bg-opacity-30': tab.title === currentTab?.title,
              'text-white': tab.title === currentTab?.title,
              'hover:text-ehri-purple': tab.title === currentTab?.title,
              'hover:bg-white': tab.title === currentTab?.title,
            }"
          >
            <p class="col-span-3">{{ getTranslatedTitle(tab.title) }}</p>
            <span class="hover:text-ehri-purple text-end col-span-2 font-medium">{{ tab.value }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div v-else>
      <ul class="mx-0">
        <li
          class="grid grid-cols-4 py-1 hover:bg-white hover:text-ehri-purple text-white text-sm font-sans font-light cursor-pointer" 
        >
          <p class="col-span-3">{{ $t("results") }}</p>
          <span class="text-end col-span-1 font-medium">0</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMainStore } from '@/stores/mainStore';

export default {
  name: "ResourceTabs",
  setup() {
    const { t } = useI18n();
    const mainStore = useMainStore(); 

    // Create a computed property for tabComponent to always reflect the latest values
    const tabComponent = computed(() => {
      return [
        mainStore.resultStats.DigitalEditions,
        mainStore.resultStats.portalSearchLength,
        mainStore.resultStats.DBLength,
      ];
    });

    // Filtered and sorted tabComponent to exclude items with 0 or null values
    const filteredTabComponent = computed(() => {
      return tabComponent.value
        .filter(tab => tab.value > 0) // Only include items with value greater than 0
        .sort((a, b) => b.value - a.value); // Sort by value in descending order
    });

    const currentTab = ref(filteredTabComponent.value.length ? filteredTabComponent.value[0] : null); // Initialize only if there are items

    const dataSourceChange = (dataSource) => {
      currentTab.value = dataSource;
      mainStore.setDataSource(dataSource)
    };

    const getTranslatedTitle = (title) => {
      const titleKey = title.toLowerCase();
      return t(`dataSource.${titleKey}`, title);
    };

    return { currentTab, filteredTabComponent, getTranslatedTitle, dataSourceChange };
  },
};
</script>

<style scoped>
</style>