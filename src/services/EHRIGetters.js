import EHRIServices from "./EHRIServices";

export const fetchFacetedPortalSearch = async (query, page, facets, limit) => {
  try {
    let res = await EHRIServices.getFacetedPortalSearch(query, page, facets, limit);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const fetchFacetedDocUnits = async (query, page, facets, limit) => {
  try {
    let res = await EHRIServices.getFacetedDocUnitResults(query, page, facets, limit);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const fetchRepoName = async (query)=>{
  try {
    let res = await EHRIServices.getRepoName(query)
    return res.data.data[0].attributes.name
  } catch (err) {
    console.log(err)
  }
}

export const fetchHistAgentInfo = async (id) => {
  try {
    let res = await EHRIServices.getHistAgentInfo(id);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchRepositoryInfo = async (id) => {
  try {
    let res = await EHRIServices.getRepositoryInfo(id);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchRelatedItems = async (id, page,facets) => {
  try {
    let res = await EHRIServices.getRelatedItems(id, page, facets);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchRepos = async () => {
  try {
    let res = await EHRIServices.getAllRepos()
    return res.data
  } catch (err) {
    console.log(err)
  }
}

export const fetchCvocConceptInfo = async (id) => {
  try {
    let res = await EHRIServices.getCvocConceptInfo(id);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const fetchBlogPosts = async (query, page, per_page, category, order) => {
  try {
    let res = await EHRIServices.getDBPosts(query, page, per_page, category, order);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const fetchDBCategories = async () => {
  try {
    let res = await EHRIServices.getDBCategories();
    return res.data
  } catch (err) {
    console.error(err);
  }
};

export const fetchEditionItems = async (endpoint, query, page, per_page, filters) => {
  try {
    let res = await EHRIServices.getEditionItems(endpoint, query, page, per_page, filters);
    return res;
  } catch (err) {
    console.error(err);
  }
};


