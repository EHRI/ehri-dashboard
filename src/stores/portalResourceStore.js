import { defineStore } from 'pinia';
import { fetchFacetedPortalSearch } from "../services/EHRIGetters.js";

export const usePortalResourceStore = defineStore('portalResource', {
  state: () => ({
    portalResourceTypes: {
      docUnits: { value: 0, id: 'DocumentaryUnit', title: 'Archival Descriptions', holders: [], countries: [], langs: [] },
      repos: { value: 0, id: 'Repository', title: 'Archival Institutions' },
      countries: { value: 0, id: 'Country', title: 'Country Reports' },
      camps: { value: 0, id: 'EHRICamps', title: 'EHRI Camps' },
      ghettos: { value: 0, id: 'EHRIGhettos', title: 'EHRI Ghettos' },
      keywords: { value: 0, id: 'EHRIKeywords', title: 'EHRI Terms' },
      corporates: { value: 0, id: 'EHRICorporateBodies', title: 'EHRI Corporate Bodies' },
      personalities: { value: 0, id: 'EHRIPersonalities', title: 'EHRI Personalities' },
    },
    sortedTypes: [],
    selectedType: "",
    isLoading: false,
  }),
  actions: {
    async fetchPortalResourceTypes(searchTerm) {
      this.isLoading = true;
      try {
        const data = await Promise.all([
          fetchFacetedPortalSearch(searchTerm, 1, { type: "DocumentaryUnit" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "Country" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "Repository" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "HistoricalAgent" }, 0),
          fetchFacetedPortalSearch(searchTerm, 1, { type: "CvocConcept" }, 0),
        ]);

        this.portalResourceTypes.docUnits['value'] = data[0].data.meta.total
        this.portalResourceTypes.docUnits['holders'] = data[0].data.meta.facets.find(h => h.key == "holderName")
        this.portalResourceTypes.docUnits['countries'] = data[0].data.meta.facets.find(c => c.key == "countryCode")
        this.portalResourceTypes.docUnits['langs'] = data[0].data.meta.facets.find(l => l.key == "languageCode")
        this.portalResourceTypes.repos['value'] = data[2].data.meta.total
        this.portalResourceTypes.countries['value'] = data[1].data.meta.total
        this.portalResourceTypes.camps['value'] = data[4].data.meta.facets.find(h => h.key == "holderName").facets.find(h => h.value == "EHRI Camps")?.count || 0
        this.portalResourceTypes.ghettos['value'] = data[4].data.meta.facets.find(h => h.key == "holderName").facets.find(h => h.value == "EHRI Ghettos")?.count || 0
        this.portalResourceTypes.keywords['value'] = data[4].data.meta.facets.find(h => h.key == "holderName").facets.find(h => h.value == "EHRI Terms")?.count || 0
        this.portalResourceTypes.corporates['value'] = data[3].data.meta.facets.find(h => h.key == "holderName").facets.find(h => h.value == "EHRI Corporate Bodies")?.count || 0
        this.portalResourceTypes.personalities['value'] = data[3].data.meta.facets.find(h => h.key == "holderName").facets.find(h => h. value == "EHRI Personalities")?.count || 0

        this.sortedTypes = Object.entries(this.portalResourceTypes).sort((a, b) => b[1].value - a[1].value);

        // Set selectedType to the first type in sortedTypes if available
        this.selectedType = this.sortedTypes.length > 0 ? this.portalResourceTypes[this.sortedTypes[0][0]]['id'] : "";
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        this.isLoading = false;
      }
    },
    setSelectedType(type) {
      this.selectedType = type;
    },
  },
});