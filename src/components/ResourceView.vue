<template>
  <div class="p-0 m-0 resource-view" v-if="component">
    <component :is="component" v-bind="{'searchTerm': searchTerm}"></component>
  </div>
</template>

<script>
import EHRIPortalResource from "./EHRIPortalResource.vue";
import {toRef, watch, shallowRef} from "vue";
import DocumentBlog from "./DocumentBlog.vue";
import DigitalEditions from "./DigitalEditions.vue";
import NoResults from "./NoResults.vue";

export default {
  name: "ResourceView",
  components: [EHRIPortalResource, DocumentBlog, DigitalEditions,NoResults],
  props: {
    current: {
      type: Object
    },
    searchTerm: {
      type: String
    }
  },
  setup(props){
    const currentTab = toRef(props, 'current')
    const component = shallowRef()

    const componentMap = {
      EHRIPortalResource: EHRIPortalResource,
      EHRIDocumentBlog: DocumentBlog,
      DigitalEditions: DigitalEditions,
      NoResults:NoResults
    }

    if(!currentTab.value){
      component.value=componentMap["NoResults"]
    } else {
      component.value=componentMap[currentTab.value['component']]
    }


    watch(currentTab, ()=> {
      component.value = componentMap[currentTab.value['component']]
    })
    return {
      component
    }
  }
}
</script>

<style scoped>
.resource-view {
  min-height: 100vh;
}
</style>