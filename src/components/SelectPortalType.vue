<template>
  <template v-for="v in sortedTypes" :key="v">
    <button v-if="v[1]['value']>0" :id="v[1]['id']"
            type="button" @click="emitPortalType(v[1]['id'])"
            class="mx-3 my-2 btn-sm stats-btn position-relative"
            :class="{active:v[1]['id']==selectedType}"
    >
      {{v[1]['title']}}
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill stats-span">
 {{v[1]['value']}}
    </span>
    </button>
  </template>
</template>

<script>
import {toRef, ref } from "vue";
import { fetchFacetedPortalSearch } from "../services/EHRIGetters.js";
import LoadingComponent from "./LoadingComponent.vue";


export default {
  name: "SelectPortalType",
  components: { LoadingComponent},
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
        holders: [],
        countries: [],
        langs: []
      },
      repos: {
        value: 0,
        id: 'Repository',
        title: 'Archival Institutions'
      },
      countries: {
        value: 0,
        id: 'Country',
        title: 'Country Reports'
      },
      camps: {
        value: 0,
        id: 'EHRICamps',
        title: 'EHRI Camps'
      },
      ghettos: {
        value: 0,
        id: 'EHRIGhettos',
        title: 'EHRI Ghettos'
      },
      keywords: {
        value: 0,
        id: 'EHRIKeywords',
        title: 'EHRI Terms',
      },
      corporates: {
        value: 0,
        id: 'EHRICorporateBodies',
        title: 'EHRI Corporate Bodies'
      },
      personalities: {
        value: 0,
        id: 'EHRIPersonalities',
        title: 'EHRI Personalities'
      },
      }
    )
    const sortedTypes = ref({})
    const selectedType = ref("")
    const emitPortalType = (type) =>{
      selectedType.value = type
      ctx.emit("portalType", (type));
    }


    Promise.all(
        [
          fetchFacetedPortalSearch(searchTerm.value,1,
                {
                  "type": "DocumentaryUnit"
                },0),
          fetchFacetedPortalSearch(searchTerm.value,1,
              {
                "type": "Country"
              },0),
          fetchFacetedPortalSearch(searchTerm.value,1,
              {
                "type": "Repository"
              },0),
          fetchFacetedPortalSearch(searchTerm.value,1,
              {
                "type": "HistoricalAgent"
              },0),
          fetchFacetedPortalSearch(searchTerm.value,1,
              {
                "type": "CvocConcept"
              },0),

        ]
    ).then(data =>{
      const docUnitData = ref(data[0])
      const countryData = ref(data[1])
      const repoData = ref(data[2])
      const histAgentData = ref(data[3])
      const vocabData = ref(data[4])

      var vocabStats = vocabData.value.data.meta.facets.find( h => {
        return h.key == "holderName"
      })
      var authorityStats = histAgentData.value.data.meta.facets.find( h => {
        return h.key == "holderName"
      })

      portalResourceTypes.value.docUnits.value = docUnitData.value.data.meta.total
      portalResourceTypes.value.docUnits.holders = docUnitData.value.data.meta.facets.find( h => {
            return h.key == "holderName"
      }
      )
      portalResourceTypes.value.docUnits.countries = docUnitData.value.data.meta.facets.find( c => {
            return c.key == "countryCode"
          }
      )
      portalResourceTypes.value.docUnits.langs = docUnitData.value.data.meta.facets.find( l => {
            return l.key == "languageCode"
          }
      )
      portalResourceTypes.value.repos.value = repoData.value.data.meta.total
      portalResourceTypes.value.countries.value = countryData.value.data.meta.total
      portalResourceTypes.value.camps.value = vocabStats.facets.find(h => {
        return h.value ==  portalResourceTypes.value.camps.title
      }) ?vocabStats.facets.find(h => {
        return h.value == portalResourceTypes.value.camps.title
      }).count : 0
      portalResourceTypes.value.ghettos.value = vocabStats.facets.find(h => {
        return h.value ==  portalResourceTypes.value.ghettos.title
      }) ?vocabStats.facets.find(h => {
        return h.value == portalResourceTypes.value.ghettos.title
      }).count : 0
      portalResourceTypes.value.keywords.value = vocabStats.facets.find(h => {
        return h.value ==  portalResourceTypes.value.keywords.title
      }) ? vocabStats.facets.find(h => {
        return h.value == portalResourceTypes.value.keywords.title
      }).count : 0
      portalResourceTypes.value.corporates.value = authorityStats.facets.find(h => {
        return h.value ==  portalResourceTypes.value.corporates.title
      }) ? authorityStats.facets.find(h => {
        return h.value == portalResourceTypes.value.corporates.title
      }).count : 0
      portalResourceTypes.value.personalities.value = authorityStats.facets.find(h => {
        return h.value ==  portalResourceTypes.value.personalities.title
      }) ? authorityStats.facets.find(h => {
        return h.value == portalResourceTypes.value.personalities.title
      }).count : 0

      let entries = Object.entries(portalResourceTypes.value);
      sortedTypes.value = entries.sort((a, b) => b[1]['value'] - a[1]['value']);
      selectedType.value = sortedTypes.value[0][1]['id']
      ctx.emit("portalType", (selectedType.value));
    })

    return { sortedTypes,emitPortalType, selectedType}
  }
}
</script>

<style scoped>
.stats-btn {
  background-color: #330033;
  color: #FFFFFF;
  opacity: 1!important;
}
.stats-btn:hover {
  border: 3px solid #47817E;
}

.stats-btn:focus {
  box-shadow: none;
}

.stats-span {
  background-color: #47817E;
  color: #FFF;
}
.btn-sm {
  border: 3px solid transparent;
}
.active {
  background-color: #47817E;
  color: #FFFFFF;
}
.active .stats-span {
  background-color: #330033;
  color: #FFFFFF;
}

</style>