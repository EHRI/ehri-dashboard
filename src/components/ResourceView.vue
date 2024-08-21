<template>
  <div class="col-span-10 min-h-screen xl:h-screen" v-if="component">
    <component :is="component" v-bind="{'searchTerm': searchTerm,}"></component>
  </div>
</template>

<script>
import EHRIPortalResource from "./EHRIPortalResource.vue";
import {toRef, watch, shallowRef, computed} from "vue";
import DocumentBlog from "./DocumentBlog.vue";
import DigitalEditions from "./DigitalEditions.vue";
import NoResults from "./NoResults.vue";
import { useMainStore } from '@/stores/mainStore';

export default {
  name: "ResourceView",
  components: [EHRIPortalResource, DocumentBlog, DigitalEditions, NoResults],
  setup(){
    const store = useMainStore();
    const currentTab = computed(() => store.dataSource);
    const component = shallowRef();
    const searchTerm = computed(() => store.searchTerm);

    const componentMap = {
      EHRIPortalResource: EHRIPortalResource,
      EHRIDocumentBlog: DocumentBlog,
      DigitalEditions: DigitalEditions,
      NoResults: NoResults
    };

    watch(currentTab, () => {
      component.value = componentMap[currentTab.value?.component || 'NoResults'];
    }, { immediate: true });

    return {
      component,
      searchTerm
    }
  }
}
</script>

<style scoped>

</style>