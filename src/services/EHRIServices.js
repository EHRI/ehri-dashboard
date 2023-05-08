import axios from "axios";

const DBapiClient = axios.create({
  baseURL: `https://blog.ehri-project.eu/wp-json/wp/v2/`,
});

// Early Testimony Edition REST API
const ETEapiClient = axios.create({
  baseURL: "https://early-testimony.ehri-project.eu/api/",
});

// Diplomatic Reports Edition REST API
const DRApiClient = axios.create({
  baseURL: "https://diplomatic-reports.ehri-project.eu/api/",
});


// BeGrenzte Flucht REST API
const BGFApiClient = axios.create({
  baseURL: "https://begrenzte-flucht.ehri-project.eu/api/",
});

// VON WIEN INS NIRGENDWO REST API
const VWINApiClient = axios.create({
  baseURL: "https://nisko-transports.ehri-project.eu/api/",
});

// for graphql queries
const ehriPortal = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/",
  method: "post",
  headers: { "x-stream": "true" },
});

// EHRI REST
const ehriPortalREST = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/v1",
});

const ehriPortalRESTstage = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/v1",
});

// EHRI GHETTO NAMES
const ehriCampsDataset = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/datasets/x4coOEPiJh?format=json",
});

const ehriGhettoDataset = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/datasets/znL7F0s3PB?format=json"
})

// EHRI ENTITY MATCHER
const ehriEntityMatcher = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/datasets/nmfUu4u9Hr?format=json"
})


export default {
  getRepoName(query){
    return ehriPortalRESTstage.get(`search?`, {
      params: {
        q: query,
        limit: 1,
      },
    })
  },
  generalPortalTypeSearch(query){
    return ehriPortalRESTstage.get(`search?&facet=type`, {
      params: {
        q: query,
        limit: 1,
      },
    })
  },
  getHistoricalAgentStats(query){
    return ehriPortalRESTstage.get(`search?&facet=type&type=HistoricalAgent&facet=holder`, {
      params: {
        q: query,
        limit: 1,
      },
    })
  },
  getCvocConceptStats(query){
    return ehriPortalRESTstage.get(`search?&facet=type&type=CvocConcept&facet=holder`, {
      params: {
        q: query,
        limit: 5,
      },
    })
  },
  getFacetedPortalSearch(query, page, facets, limit=5){
    const mapf = new Map(Object.entries(facets))
    let filters = ""
      mapf.forEach((k,v)=> {
      filters += `&${v}=${k}`
    })
    return ehriPortalREST.get(`search?&facet=type&facet=holder&facet=country&facet=lang&facet=dates${filters}`, {
      params: {
        q: query,
        page: page,
        limit: limit,
      },
    })
  },
  getCampDataset(){
    return ehriCampsDataset.get()
  },
  getGhettoDataset(){
    return ehriGhettoDataset.get()
  },
  getEntityMatcherDataset(){
    return ehriEntityMatcher.get()
  },
  getPortalDocUnitResults(query, page){
    return ehriPortalRESTstage.get(`search?`, {
      params: {
        q: query,
        type: "DocumentaryUnit",
        page: page,
        limit: 100
      }
    })
  },
  getPortalDocUnitResultsStats(query, page){
    return ehriPortalRESTstage.get(`search?&facet=type&facet=holder&facet=country&facet=lang`, {
      params: {
        q: query,
        type: "DocumentaryUnit",
        page: page,
        limit: 5,
      },
    })
  },

  getFacetedDocUnitResults(query, page, facets, limit){
    if(facets){
      const mapf = new Map(Object.entries(facets))
      var filters = ""
      mapf.forEach((k,v)=> {
        filters += `&${v}=${k}`
      })
      return ehriPortalRESTstage.get(`search?&facet=type&facet=holder&facet=country&facet=lang&facet=dates${filters}`, {
        params: {
          q: query,
          type: 'DocumentaryUnit',
          page: page,
          limit: limit?limit:5,
        },
      })
    } else {
     let filters = ""
      return ehriPortalRESTstage.get(`search?&facet=type&facet=holder&facet=country&facet=lang&facet=dates${filters}`, {
        params: {
          q: query,
          type: 'DocumentaryUnit',
          page: page,
          limit: limit?limit:5,
        },
      })
    }
  },
  getDBPosts(query, page, per_page, category, order) {
    return DBapiClient.get(`posts?`, {
      params: {
        type: "post",
        per_page: per_page?per_page:5,
        search: query,
        _embed: true,
        page: page,
        categories: category?category:[],
        order: order
      },
    });
  },
  getDBCategories() {
    return DBapiClient.get(`categories?`,{
      params: {
        per_page: 100,
      }
    })
  }
  ,
  getETEitems(query, page, per_page, filters) {
    if(filters){
      const mapf = new Map(Object.entries(filters))
      var filterParams = ""
      mapf.forEach((k,v)=> {
        filterParams += `&f[]=${v}:${k}`
      })
      return ETEapiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    } else {
      let filterParams = ""
      return ETEapiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    }
  },
  getDRitems(query, page, per_page, filters) {
    if(filters){
      const mapf = new Map(Object.entries(filters))
      let filterParams = ""
      mapf.forEach((k,v)=> {
        filterParams += `&f[]=${v}:${k}`
      })
      return DRApiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    } else {
      let filterParams = ""
      return DRApiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    }
  },
  getBGFitems(query, page, per_page, filters) {
    if(filters){
      const mapf = new Map(Object.entries(filters))
      let filterParams = ""
      mapf.forEach((k,v)=> {
        filterParams += `&f[]=${v}:${k}`
      })
      return BGFApiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    } else {
      let filterParams = ""
      return BGFApiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    }
  },
  getVWINitems(query, page, per_page, filters) {
    if(filters){
      const mapf = new Map(Object.entries(filters))
      let filterParams = ""
      mapf.forEach((k,v)=> {
        filterParams += `&f[]=${v}:${k}`
      })
      return VWINApiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    } else {
      let filterParams = ""
      return VWINApiClient.get(`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    }
  },
  getCamps() {
    return ehriPortal.post("graphql", {
      query: `
        query AllCamps {
          CvocVocabulary(id: "ehri_camps") {
            concepts {
              items {
                id
                identifier
                descriptions {
                  languageCode
                  name
                  altLabel
                  hiddenLabel
                }
              }
            }
          }
        }`,
    });
  },
  getGhettos() {
    return ehriPortal.post("graphql", {
      query: `
        query AllGhettos {
          CvocVocabulary(id: "ehri_ghettos") {
            concepts {
              items {
                id
                identifier
                descriptions {
                  name
                  languageCode
                  altLabel
                  hiddenLabel
                }
              }
            }
          }
        }`,
    });
  },
  getHistAgentInfo(query){
    return ehriPortal.post("graphql", {
      query: `
        query HistAgentInfo($id: ID!){
        HistoricalAgent(id: $id){
        id
        descriptions{
          name
          languageCode
          lastName
          firstName
          source
          typeOfEntity
          datesOfExistence
          biographicalHistory
          legalStatus
          structure
          generalContext
          occupation
          otherFormsOfName
          parallelFormsOfName
          functions
          mandates
          scripts
          sources
          place
        }
      }
    }
      `,
      variables: {id: query},
    })
  },
  getRepositoryInfo(id){
    return ehriPortal.post("graphql", {
      query: `
        query RepositoryInfo($id: ID!) {
          Repository(id: $id) {
            id
            itemCount
            latitude
            longitude
            descriptions {
              languageCode
              name
              addresses {
                street
                municipality
                firstdem
                countryCode
                postalCode
                webpage
              }
              history
              geoculturalContext
              holdings
              records
              buildings
              administrativeStructure
              findingAids
              openingTimes
              conditions
              accessibility
              datesOfDescriptions
              otherFormsOfName
              parallelFormsOfName
            }
            country {
              id
              name
              itemCount
            }
          }
        }`,
      variables: { id: id },
    });
  },
  getCvocConceptInfo(query) {
    return ehriPortal.post("graphql", {
      query: `
        query CvocConceptInfo($id: ID!) {
          CvocConcept(id: $id) {
            id
            identifier
            type
            seeAlso
            latitude
            longitude
            descriptions {
              languageCode
              name
              altLabel
              hiddenLabel
            }
            links {
              id
              type
              targets {
                id
                type
              }
            }
            broader {
              id
              type
              seeAlso
              latitude
              longitude
              descriptions {
                languageCode
                name
                altLabel
                hiddenLabel
              }
            }
            narrower {
              id
              type
              seeAlso
              latitude
              longitude
              descriptions {
                languageCode
                name
                altLabel
                hiddenLabel
              }
              narrower {
                id
              }
            }
          }
        }`,
      variables: { id: query },
    });
  },
  getGhettoInfo(query) {
    return ehriPortal.post("graphql", {
      query: `
        query GhettoInfo($id: ID!) {
          CvocConcept(id: $id) {
            id
            identifier
            type
            seeAlso
            latitude
            longitude
            descriptions {
              languageCode
              name
              altLabel
            }
            links {
              id
              type
              targets {
                id
                type
              }
            }
            broader {
              id
              type
              seeAlso
              latitude
              longitude
              descriptions {
                name
                altLabel
              }
            }
            narrower {
              id
              type
              seeAlso
              latitude
              longitude
              descriptions {
                name
              }
            }
          }
        }`,
      variables: { id: query },
    });
  },
  getCountryInfo(id) {
    return ehriPortal.post("graphql", {
      query: `
        query CountryInfo($id: ID!) {
          Country(id: $id) {
            id
            name
            itemCount
            history
            situation
            summary
            extensive
          }
        }`,
      variables: { id: id },
    });
  },
  getDocUnit(id) {
    return ehriPortal.post("graphql", {
      query: `
        query DocUnit($id: ID!) {
            DocumentaryUnit(id: $id) {
            id
                repository {
                    id
                    latitude
                    longitude
                    description {
                        name
                        otherFormsOfName
                        datesOfDescriptions
                    }
                    country {
                      identifier
                      name
                    }
                }
                description {
                    identifier
                    languageCode
                    name
                    dates {
                      startDate
                      endDate
                    }
                    unitDates
                    identifier
                    scopeAndContent
                    accessPoints {
                      name
                      type
                    }
                }
            }
        }`,
      variables: { id: id },
    });
  },
  getCountryStats(){
    return ehriPortalRESTstage.get(`search?`, {
      params: {
        type: "Country",
        limit: 100,
      },
    })
  },
  getRelatedItems(id, page, facets){
    if(facets){
      const mapf = new Map(Object.entries(facets))
      var filters = ""
      mapf.forEach((k,v)=> {
        filters += `&${v}=${k}`
      })
      return ehriPortalREST.get(`${id}/related?&facet=type&facet=holder&facet=country&facet=lang${filters}`, {
        params: {
          q: query,
          page: page,
          limit: 5,
        },
      })
    } else {
      let filters = ""
      return ehriPortalREST.get(`${id}/related?&facet=type&facet=holder&facet=country&facet=lang${filters}`, {
        params: {
          page: page,
          limit: 5,
        },
      })
    }
  },
  getAllRepos() {
    return ehriPortal.post("graphql", {
      query: `
query Repositories {
    repositories {
      items {
        id
        descriptions{
          name
          languageCode
        }
        latitude
        longitude
      }
    }
}`
    })
  },
};
