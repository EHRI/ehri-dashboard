<template>
  <div>
    <button v-for="v in sortedTypes" :id="v[1]['id']" type="button" data-bs-trigger="hover" data-delay='{"show":0, "hide":1}' data-bs-toggle="tooltip" data-bs-placement="top" :title="v[1]['description']" class="m-3 btn stats-btn position-relative disabled">
      {{v[1]['title']}}
      <span class="stats-span position-absolute top-0 start-100 translate-middle badge rounded-pill">
   {{v[1]['value']}}
      </span>
    </button>
  </div>
</template>

<script>
import {toRef, ref } from "vue";
import { fetchPortalTypeResults} from "../services/EHRIGetters.js";

export default {
  name: "OverviewPortalStats",
  props: {
    searchTerm: String,
  },
  emits: ["portalType"],
  setup(props,ctx){
    const searchTerm = toRef(props, "searchTerm")
    const portalResourceTypes = ref({
          docUnits: {
            value: 0,
            id: 'DocumentaryUnit',
            title: 'Archival Descriptions',
            description: "Electronic descriptions and finding aids of Holocaust-related archival material."
          },
          histAgents: {
            value: 0,
            id: 'HistoricalAgent',
            title: 'Authority Set Items',
            description: "Authority sets are collections of people, families, or corporate bodies."
          },
          repos: {
            value: 0,
            id: 'Repository',
            title: 'Archival Institutions',
            description: "An inventory of archival institutions that hold Holocaust-related material."
          },
          countries: {
            value: 0,
            id: 'Country',
            title: 'Country Reports',
            description: "EHRI national reports provide an overview of the Second World War and Holocaust history as well as of the archival situation in the covered countries."
          },
          CvocConcepts: {
            value: 0,
            id: 'CvocConcept',
            title: 'Vocabulary Entries',
            description: "Vocabularies are collections of subject headings or places."
          },
        }
    )
    const sortedTypes = ref({})

    const emitPortalType = (type) =>{
      ctx.emit("portalType", (type,searchTerm.value));
    }

    try {
      fetchPortalTypeResults(searchTerm.value)
          .then(res=>{
            var typeStats = res.data.meta.facets.find(t => {
              return t.key == "type"
            })
            portalResourceTypes.value.docUnits.value = typeStats.facets.find(t => {
              return t.value == "DocumentaryUnit"
            }).count
            portalResourceTypes.value.histAgents.value = typeStats.facets.find(t => {
              return t.value == "HistoricalAgent"
            }).count
            portalResourceTypes.value.countries.value = typeStats.facets.find(t => {
              return t.value == "Country"
            }).count
            portalResourceTypes.value.repos.value = typeStats.facets.find(t => {
              return t.value == "Repository"
            }).count
            portalResourceTypes.value.CvocConcepts.value = typeStats.facets.find(t => {
              return t.value == "CvocConcept"
            }).count
            let entries = Object.entries(portalResourceTypes.value);
            sortedTypes.value = entries.sort((a, b) => b[1]['value'] - a[1]['value']);
          })
    } catch (err)
    {
      console.log(err)
    }

    return { sortedTypes,emitPortalType }
  }
}
</script>

<style scoped>
.stats-btn {
  background-color: #6C003B;
  color: #fff;
  opacity: 1!important;
  pointer-events: auto!important;
}
.stats-btn:hover {
  background-color: #6C003B;
  color: #fff;
  opacity: 1!important;
  pointer-events: auto!important;
  cursor: default;
}
.stats-btn:focus {
  box-shadow: none;
}

.stats-span {
  background-color: #648177;
  color: #FFF;
}
</style>