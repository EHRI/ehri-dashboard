<template>
  <ResourceTabs
    v-if="!isLoading"
  />
  <LoadingComponent v-else :color="'text-white'" />
</template>

<script>
import { computed } from "vue";
import { useMainStore } from '@/stores/mainStore';
import LoadingComponent from "./LoadingComponent.vue";
import ResourceTabs from "./ResourceTabs.vue";

export default {
  name: "LoadResources",
  components: {
    LoadingComponent,
    ResourceTabs,
  },
  setup() {
    const mainStore = useMainStore();

    const isLoading = computed(() => mainStore.isLoading)

    return {
      isLoading
    };
  },
};
</script>