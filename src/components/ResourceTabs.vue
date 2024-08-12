<template>
  <div>
    <div v-if="tabComponent.length">
      <ul class="mx-0">
        <li
          v-for="tab in tabComponent" :key="tab['title']"
          @click="emitDataSourceChange(tab)"
        >
          <a 
            class="grid grid-cols-5 py-1 text-white px-1 hover:bg-white hover:text-ehri-purple text-sm font-sans font-light cursor-pointer" 
            :class="{
              'bg-black': tab['title'] === currentTab['title'],
              'bg-opacity-30': tab['title'] === currentTab['title'],
              'text-white': tab['title'] === currentTab['title'],
              'hover:text-ehri-purple': tab['title'] === currentTab['title'],
              'hover:bg-white': tab['title'] === currentTab['title'],
            }"
          >
            <p class="col-span-3">{{ getTranslatedTitle(tab['title']) }}</p>
            <span class="hover:text-ehri-purple text-end col-span-2 font-medium">{{ tab['value'].toLocaleString('en-GB') }}</span>
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
import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: "ResourceTabs",
  components: {},
  props: {
    tabs: {
      type: Array,
    },
    searchTerm: {
      type: String,
    },
  },
  emits: ["dataSourceChange"],
  setup(props, ctx) {
    const { t } = useI18n();
    const tabs = toRef(props, 'tabs');
    const searchTerm = toRef(props, 'searchTerm');

    const tabComponent = ref(tabs.value.map(t => ({
      component: t[1].component,
      title: t[1].title,
      value: t[1].value,
      description: t[1].description,
    })));

    const currentTab = ref(tabComponent.value[0]);

    const emitDataSourceChange = (dataSource) => {
      currentTab.value = dataSource;
      ctx.emit("dataSourceChange", dataSource);
    };

    if (!tabComponent.value.length) {
      ctx.emit("dataSourceChange", {
        component: "NoResults",
        title: "No Results",
        value: 0,
        description: "",
      });
    }

    const getTranslatedTitle = (title) => {
      const titleKey = title.toLowerCase();
      return t(`dataSource.${titleKey}`, title);
    };

    return { currentTab, tabComponent, searchTerm, emitDataSourceChange, getTranslatedTitle };
  },
};
</script>

<style scoped>
</style>
