<template>
  <div class="align-middle row m-0" :style="{'position': 'sticky', 'top': 2.7+'em', 'z-index': 3,'backgroundColor': '#6C003B',
  'color': '#FFFFFF'}">
    <div class="resource-tab p-2" v-if="tabComponent.length">
      <ul class="nav nav-pills justify-content-center">
        <li
            v-for="tab in tabComponent" :key="tab['title']"
            @click="currentTab = tab"
            class="nav-item small"
        >
          <a :class="
{active:tab['title']==currentTab['title'], 'nav-link':true}" >{{ tab['title'] }}<span class="badge">{{ tab['value'] }}</span></a>
        </li>
      </ul>
    </div>
    <div v-else class="resource-tab p-2">
      <ul class="nav nav-pills justify-content-center">
        <li
            class="nav-item small"
        >
          <a class="nav-link active">Results <span class="badge">0</span></a>
        </li>
      </ul>
    </div>
  </div>
  <ResourceView :search-term="searchTerm" :current="currentTab"></ResourceView>
</template>

<script>
import {ref} from 'vue'
import ResourceView from "./ResourceView.vue";

export default {
  name: "ResourceTabs",
  components: {ResourceView},
  props: {
    tabs: {
      type: Array
    },
    searchTerm: {
      type: String
    }
  },
  setup(props){

    const tabs = props.tabs

    const searchTerm = props.searchTerm

    const tabComponent = ref()

    tabComponent.value = tabs.map(t => {return{'component': t[1]['component'],
    'title': t[1]['title'], 'value': t[1]['value']}})

    const currentTab = ref(tabComponent.value[0])


    return {currentTab, tabComponent, searchTerm}
  }
}
</script>

<style scoped>
 a, a:hover {
    color: #F0E9F1;
}
.badge {
  background-color: #F0E9F1;
  color: #6C003B;
  padding: 0.3em!important;
  vertical-align: middle!important;
}
.active {
  color: #6C003B!important;
  background-color: #F0E9F1!important;
}
.active .badge {
  color: #F0E9F1;
  background-color: #6C003B;
}
.nav-link {
  padding: 0.6em!important;
  border: 2px solid transparent;
  margin: 0.2em;
}

.nav-item {
  margin-right: 0em!important;
  display:inline-flex!important;
}
.nav-item:hover {
  cursor: pointer;
}

</style>