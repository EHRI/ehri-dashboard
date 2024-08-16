import axios from "axios";

// Document Blog
const DBapiClient = axios.create({
  baseURL: `https://blog.ehri-project.eu/wp-json/wp/v2/`,
});

// GraphQL endpoint
const ehriPortal = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/",
  method: "post",
  headers: { "x-stream": "true" },
});

// EHRI REST
const ehriPortalREST = axios.create({
  baseURL: "https://portal.ehri-project.eu/api/v1",
});

// EHRI REST STAGE for testing
const ehriPortalRESTstage = axios.create({
  baseURL: "https://portal.ehri-project-stage.eu/api/v1",
});

export default {
  getRepoName(query){
    return ehriPortalREST.get(`search?`, {
      params: {
        q: query,
        limit: 1,
      },
    })
  },
  generalPortalTypeSearch(query){
    return ehriPortalREST.get(`search?&facet=type`, {
      params: {
        q: query,
        limit: 1,
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

  getFacetedDocUnitResults(query, page, facets, limit){
    if(facets){
      const mapf = new Map(Object.entries(facets))
      var filters = ""
      mapf.forEach((k,v)=> {
        filters += `&${v}=${k}`
      })
      return ehriPortalREST.get(`search?&facet=type&facet=holder&facet=country&facet=lang&facet=dates${filters}`, {
        params: {
          q: query,
          type: 'DocumentaryUnit',
          page: page,
          limit: limit?limit:5,
        },
      })
    } else {
     let filters = ""
      return ehriPortalREST.get(`search?&facet=type&facet=holder&facet=country&facet=lang&facet=dates${filters}`, {
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
  getEditionItems(endpoint, query, page, per_page, filters){
    if(filters){
      const mapf = new Map(Object.entries(filters))
      var filterParams = ""
      mapf.forEach((k,v)=> {
        filterParams += `&f[]=${v}:${k}`
      })
      return axios.get(endpoint+`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    } else {
      let filterParams = ""
      return axios.get(endpoint+`search?${filterParams}`, {
        params: {
          q: query,
          page: page,
          per_page: per_page?per_page:5,
          details: 1
        },
      })
    }
  }
  ,
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
