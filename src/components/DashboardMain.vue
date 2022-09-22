<template>
  <div>
    <div v-if="Object.values(badgesLoading).find((item) => item === true)"
         class="align-middle row m-0" :style="{'position': 'sticky', 'top': 3.7+'em', 'z-index': 3,'backgroundColor': '#6C003B',
  'color': '#FFFFFF'}">
      <div class="resource-tab p-2"
      >
        <LoadingComponent class="p-1"> </LoadingComponent>
      </div>
    </div>
    <ResourceTabs v-else-if="Object.values(badgesLoading).every((item) => !item)" :tabs="sortedResultsNonNull" :search-term="searchTerm"></ResourceTabs>
  </div>
</template>

<script>
import { toRef,ref, watch } from "vue";
import {
 fetchFacetedPortalSearch,
  fetchBlogPosts, fetchETEitems, fetchBGFitems, fetchDRitems
} from "../services/EHRIGetters";
import LoadingComponent from "./LoadingComponent.vue";
import DocumentBlog from "./DocumentBlog.vue";
import DigitalEditions from "./DigitalEditions.vue";
import ResourceTabs from "./ResourceTabs.vue";

export default {
  name: "DashboardMain",
  components: {
    ResourceTabs,
    LoadingComponent,
    DocumentBlog,
    DigitalEditions,
  },
  props: {
    queryValue: String
  },
  setup(props) {
    const searchTerm = toRef(props,"queryValue");

    const badgesLoading = ref({
      DBLoading: true,
      portalSearchLoading: true,
      digitalEditionsLoading: true
    });

    const resultStats = ref({
      DigitalEditions: {
        component: 'DigitalEditions',
        value: 0,
        title: 'Digital Editions '
      }
        ,
      portalSearchLength: {
        component: "EHRIPortalResource",
        value: 0,
        title: 'EHRI Portal '
      },
      DBLength: {
        component: 'EHRIDocumentBlog',
        value: 0,
        title: 'Document Blog '
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

    const getPortalSearchLength=(n)=>{
      resultStats.value.portalSearchLength['value'] = +n
      badgesLoading.value.portalSearchLoading = false
    }
    const getDBLength = (n) => {
      resultStats.value.DBLength['value'] = +n;
      badgesLoading.value.DBLoading = false;
    };

    const getDigitalEditionsLength = (n) => {
      resultStats.value.DigitalEditions['value'] = +n;
      badgesLoading.value.digitalEditionsLoading = false;
    };

    const loadData = async () => {

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
                //Get Digital Editions results
                  //6
                fetchETEitems(searchTerm.value, 1,1),
                  //7
                fetchDRitems(searchTerm.value, 1, 1),
                  //8
                fetchBGFitems(searchTerm.value,1,1)
              ]
          ).then(data => {
            const docUnitData = ref(data[0])
            const countryData = ref(data[1])
            const repoData = ref(data[2])
            const histAgentData = ref(data[3])
            const vocabData = ref(data[4])
            const DBData = ref(data[5])
            const ETEData = ref(data[6])
            const DRData = ref(data[7])
            const BGFData = ref(data[8])

            getDBLength(+DBData.value.headers["x-wp-total"])

            // To get the sum of the count of all Editions
            const digitalEditionsTotal = ref(+ETEData.value.data.total+
                +DRData.value.data.total +
                +BGFData.value.data.total)

            getDigitalEditionsLength(digitalEditionsTotal.value)

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
            portalResourceTypes.value.everything.value = Object.values(portalResourceTypes.value).reduce((a, b) => {
              return (a + b['value'])
            }, 0)
            getPortalSearchLength(portalResourceTypes.value.everything.value)

          })
    }

    loadData()

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
      }
    })

    return {
      searchTerm,
      sortedResultsNonNull,
      badgesLoading
    };
  },
};
</script>

<style scoped>

.btn-portal span,.btn-db span,.btn-portal-search span, .btn-bgf span, .btn-dr span, .btn-et span {
  background-color: #330033!important;
  color: #fff;
}


a, a:hover {
  text-decoration: none;
  color: inherit;
}

</style>
