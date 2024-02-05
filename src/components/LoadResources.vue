<template>
      <ResourceTabs v-if="Object.values(badgesLoading).every((item) => !item)" :tabs="sortedResultsNonNull" @data-source-change="(d)=>emitDataSourceChange(d)" :search-term="searchTerm"></ResourceTabs>
      <LoadingComponent :color="'text-white'" v-else></LoadingComponent>
  </template>
  
<script>
import { toRef,ref, watch } from "vue";
import {
 fetchFacetedPortalSearch,
  fetchBlogPosts, fetchEditionItems,
} from "../services/EHRIGetters";
import { editionsConfig } from "../services/editionsConfig.js"
import LoadingComponent from "./LoadingComponent.vue";
import DocumentBlog from "./DocumentBlog.vue";
import DigitalEditions from "./DigitalEditions.vue";
import ResourceTabs from "./ResourceTabs.vue";

export default {
  name: "LoadResources",
  components: {
    ResourceTabs,
    LoadingComponent,
    DocumentBlog,
    DigitalEditions,
},
  props: {
    queryValue: String
  },
  emits: ["dataSourceChange"],
  setup(props, ctx) {
    const searchTerm = toRef(props,"queryValue");
    const emitDataSourceChange = (dataSource) =>{
        ctx.emit("dataSourceChange", (dataSource))
        }
    const badgesLoading = ref({
      DBLoading: true,
      portalSearchLoading: true,
      digitalEditionsLoading: true
    });
    const DigitalEditionsData = ref({});

    const generateEdition = (editionKey, config) => {
      return {
        edition: editionKey,
        pagination: {
          total: null,
        },
        loading: false,
        apiEndpoint: config.apiEndpoint,
        getCount: () => {
          DigitalEditionsData.value[editionKey].loading = true;
          fetchEditionItems(DigitalEditionsData.value[editionKey].apiEndpoint, searchTerm.value, 1, 1)
            .then((newUnits) => {
              DigitalEditionsData.value[editionKey].pagination['total'] = newUnits.data.total
              DigitalEditionsData.value[editionKey].loading = false
            })
            .catch((error) => {
                console.error(`Error fetching data for the ${editionKey}:`, error);
                DigitalEditionsData.value[editionKey].loading = false;
            });
        },
      };
    };

    for (const editionKey in editionsConfig) {
      DigitalEditionsData.value[editionKey] = generateEdition(editionKey, editionsConfig[editionKey]);
    }

    const resultStats = ref({
      DigitalEditions: {
        component: 'DigitalEditions',
        value: 0,
        title: 'Online Editions',
        description: 'The EHRI Online Editions consist of annotated digitized documents from various sources gathered around a theme, and are a new way of presenting digital archival content.'
      }
        ,
      portalSearchLength: {
        component: "EHRIPortalResource",
        value: 0,
        title: 'EHRI Portal',
        description: 'The EHRI portal offers access to information on Holocaust-related archival material held in institutions across Europe and beyond.'
      },
      DBLength: {
        component: 'EHRIDocumentBlog',
        value: 0,
        title: 'Document Blog',
        description: 'The EHRI Document Blog is a space to share ideas about Holocaust-related archival documents, and their presentation and interpretation using digital tools.'
      }
    })

    const portalResourceTypes = ref({
          docUnits: {
            value: 0,
            id: 'DocumentaryUnit',
            title: 'Archival Descriptions',
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
          everything: {
            value: 0,
            id: '',
            title: 'All'
          }
        }
    )

    const sortedResultStats = ref([])
    const sortedResultsNonNull = ref([])

    const getPortalSearchLength = (n) => {
      resultStats.value.portalSearchLength['value'] = +n;
      badgesLoading.value.portalSearchLoading = false;
    };
    
    const getDBLength = (n) => {
      resultStats.value.DBLength['value'] = +n;
      badgesLoading.value.DBLoading = false;
    };

    const getDigitalEditionsLength = (n) => {
      resultStats.value.DigitalEditions['value'] = +n;
      badgesLoading.value.digitalEditionsLoading = false;
    };

    const loadData = async () => {
      for (const editionKey in DigitalEditionsData.value) {
        if (DigitalEditionsData.value.hasOwnProperty(editionKey)) {
          DigitalEditionsData.value[editionKey].getCount();
        }
      }
      Object.keys(badgesLoading.value).every(
          (key) => (badgesLoading.value[key] = true)
      );
          Promise.all(
              [
                //Get results from EHRI Portal
                  //0
                fetchFacetedPortalSearch(searchTerm.value,1,
                    {
                      "type": "DocumentaryUnit"
                    }, 0),
                  //1
                fetchFacetedPortalSearch(searchTerm.value,1,
                    {
                      "type": "Country"
                    },0),
                  //2
                fetchFacetedPortalSearch(searchTerm.value,1,
                    {
                      "type": "Repository"
                    },0),
                  //3
                fetchFacetedPortalSearch(searchTerm.value,1,
                    {
                      "type": "HistoricalAgent"
                    },0),
                  //4
                fetchFacetedPortalSearch(searchTerm.value,1,
                    {
                      "type": "CvocConcept"
                    },0),
                //Get DB results
                  //5
                fetchBlogPosts(searchTerm.value,1,1),
              ]
          ).then(data => {
            const docUnitData = ref(data[0])
            const countryData = ref(data[1])
            const repoData = ref(data[2])
            const histAgentData = ref(data[3])
            const vocabData = ref(data[4])
            const DBData = ref(data[5])
            const editionsTotal = ref(0)

            getDBLength(+DBData.value.headers["x-wp-total"])

            for (const editionKey in DigitalEditionsData.value) {
              editionsTotal.value += +DigitalEditionsData.value[editionKey].pagination['total']
            }

            getDigitalEditionsLength(editionsTotal.value)

            var vocabStats = vocabData.value.data.meta.facets.find(h => {
              return h.key == "holderName"
            })
            var authorityStats = histAgentData.value.data.meta.facets.find(h => {
              return h.key == "holderName"
            })
            portalResourceTypes.value.docUnits.value = docUnitData.value.data.meta.total
            portalResourceTypes.value.repos.value = repoData.value.data.meta.total
            portalResourceTypes.value.countries.value = countryData.value.data.meta.total
            portalResourceTypes.value.camps.value = vocabStats.facets.find(h => {
              return h.value == portalResourceTypes.value.camps.title
            }) ? vocabStats.facets.find(h => {
              return h.value == portalResourceTypes.value.camps.title
            }).count : 0
            portalResourceTypes.value.ghettos.value = vocabStats.facets.find(h => {
              return h.value == portalResourceTypes.value.ghettos.title
            }) ? vocabStats.facets.find(h => {
              return h.value == portalResourceTypes.value.ghettos.title
            }).count : 0
            portalResourceTypes.value.keywords.value = vocabStats.facets.find(h => {
              return h.value == portalResourceTypes.value.keywords.title
            }) ? vocabStats.facets.find(h => {
              return h.value == portalResourceTypes.value.keywords.title
            }).count : 0
            portalResourceTypes.value.corporates.value = authorityStats.facets.find(h => {
              return h.value == portalResourceTypes.value.corporates.title
            }) ? authorityStats.facets.find(h => {
              return h.value == portalResourceTypes.value.corporates.title
            }).count : 0
            portalResourceTypes.value.personalities.value = authorityStats.facets.find(h => {
              return h.value == portalResourceTypes.value.personalities.title
            }) ? authorityStats.facets.find(h => {
              return h.value == portalResourceTypes.value.personalities.title
            }).count : 0
            portalResourceTypes.value.everything.value = 0
            portalResourceTypes.value.everything.value = Object.values(portalResourceTypes.value).reduce((a, b) => {
              return (a + b['value'])
            }, 0)
            getPortalSearchLength(portalResourceTypes.value.everything.value)
          })
    }

    loadData()
    // This refreshes the count numbers every time there's a change to the input
    watch(searchTerm, () => {
      loadData();
    });

    watch(sortedResultsNonNull, () => {
      if(sortedResultsNonNull.value.length){
          emitDataSourceChange(sortedResultsNonNull.value[0][1])
      }
    });

    // This refreshes the count numbers every time there's a change to the input
    watch(badgesLoading.value, ()=>{
      if (Object.values(badgesLoading.value).every((item) => !item)){
        let entries = Object.entries(resultStats.value);
        sortedResultStats.value = entries.sort((a, b) => b[1]['value'] - a[1]['value'])
        sortedResultsNonNull.value = sortedResultStats.value.filter(i => {
          if (i[1]['value']>0){
          return i
        }
        }
        )
        if(sortedResultsNonNull.value.length){
          emitDataSourceChange(sortedResultsNonNull.value[0][1])
        }
      }
    })


    return {
      searchTerm,
      sortedResultsNonNull,
      badgesLoading,
      emitDataSourceChange,
    };
  },
};
</script>
  
<style scoped>
</style>