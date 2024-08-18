import { defineStore } from 'pinia';
import {
  fetchFacetedPortalSearch,
  fetchBlogPosts,
  fetchEditionItems,
} from "../services/EHRIGetters";
import { editionsConfig } from "../services/editionsConfig.js";

export const useMainStore = defineStore('main', {
  state: () => ({
    dataSource: null,
    searchTerm: '',
    resultStats: {
      DigitalEditions: {
        component: 'DigitalEditions',
        value: 0,
        title: 'editions',
      },
      portalSearchLength: {
        component: "EHRIPortalResource",
        value: 0,
        title: 'portal',
      },
      DBLength: {
        component: 'EHRIDocumentBlog',
        value: 0,
        title: 'blog',
      }
    },
    portalResourceTypes: {},
    currentTab: null,
    isLoading: false, 
  }),
  actions: {
    setDataSource(dataSource) {
      this.dataSource = dataSource;
    },
    setSearchTerm(searchTerm) {
        this.searchTerm = searchTerm;
        this.loadData(searchTerm); // Load data whenever the search term is set
    },
    setBadgesLoading(loadingState) {
      this.badgesLoading = loadingState;
    },
    setResultStats(stats) {
      this.resultStats = stats;
    },
    setPortalSearchLength(length) {
      this.resultStats.portalSearchLength.value = length;
    },
    setDBLength(length) {
      this.resultStats.DBLength.value = length;
    },
    async loadData(searchTerm) {
      this.isLoading = true; // Set loading state to true at the start of loadData

      try {
        const [docUnitData, countryData, repoData, histAgentData, vocabData, DBData] = await Promise.all([
          fetchFacetedPortalSearch(searchTerm, 1, { type: "DocumentaryUnit" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "Country" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "Repository" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "HistoricalAgent" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "CvocConcept" }, 0),
          fetchBlogPosts(searchTerm, 1, 1),
        ]);

        // Update counts based on fetched data
        this.setDBLength(+DBData.headers["x-wp-total"]);

        // Aggregate portal search results
        const totalPortalSearchLength = docUnitData.data.meta.total + countryData.data.meta.total + repoData.data.meta.total + histAgentData.data.meta.total + vocabData.data.meta.total;
        this.setPortalSearchLength(totalPortalSearchLength);

        // Load editions data
        const editionsData = {};
        for (const [editionKey, config] of Object.entries(editionsConfig)) {
          const data = await fetchEditionItems(config.apiEndpoint, searchTerm, 1, 1);
          editionsData[editionKey] = data.data.total;
        }
        this.resultStats.DigitalEditions.value = Object.values(editionsData).reduce((acc, curr) => acc + curr, 0);

        // Determine the resultStats item with the highest value
        const resultStatsArray = Object.values(this.resultStats);
        const highestValueItem = resultStatsArray.reduce((max, item) => item.value > max.value ? item : max, { value: 0 });

        // Set dataSource to the item with the highest value, or null if all are zero
        this.dataSource = highestValueItem.value > 0 ? highestValueItem : null;

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        this.isLoading = false; // Reset loading state to false after loadData is done
      }
    },
  },
});