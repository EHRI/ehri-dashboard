<template>
  <div class="card doc-item-card">
    <div class="card-body p-0">
      <h6 v-if="docUnit.attributes.descriptions[0].name" class="card-title"><a :href="portalLink" target="_blank" rel="noopener">{{docUnit.attributes.descriptions[0].name}}</a></h6>
      <h6 v-if="docUnit.repoName" class="card-subtitle mb-2 text-muted">{{docUnit.repoName}}</h6>
      <span v-if="docUnit.attributes.localId" class="badge card-badge me-1">{{docUnit.attributes.localId}}</span>
      <span v-if="docUnit.attributes.descriptions[0].language.length" :key="docUnit.attributes.localId" class="badge card-badge me-1">{{docUnit.attributes.descriptions[0].language}}</span>
    </div>
    <hr class="my-2">
  </div>
</template>

<script>
import {toRef, ref, watch} from "vue";

export default {
  name: "DocUnitItemCardREST",
  props: {
    docUnitObject: Object
  },
  setup(props){
    const docUnit = toRef(props, 'docUnitObject')
    const portalLink = ref()

    const configData = () => {
      portalLink.value = `https://portal.ehri-project-stage.eu/units/${docUnit.value.id}`
    }

    configData()

    watch(docUnit, ()=> {
      configData()
    })

    return {docUnit,portalLink}
  }
}
</script>

<style scoped>
.card-badge {
  background-color: #6C003B;
  color: #FFFFFF;
}

.doc-item-card {
  background-color: rgba(0,0,0,0)!important;
  border: none;
}

.doc-item-card a {
  text-decoration: none;
  color: inherit;
}

.doc-item-card a:hover {
  text-decoration: underline;
}
</style>