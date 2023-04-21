import EHRIServices from "./EHRIServices";

export const fetchPortalTypeResults = async (query)=>{
  try {
    let res = await EHRIServices.generalPortalTypeSearch(query)
    return res
  } catch (err) {
    console.log(err)
  }
}

export const fetchRepoName = async (query)=>{
  try {
    let res = await EHRIServices.getRepoName(query)
    return res.data.data[0].attributes.name
  } catch (err) {
    console.log(err)
  }
}

export const fetchHistoricalAgentStats = async (query)=>{
  try {
    let res = await EHRIServices.getHistoricalAgentStats(query)
    return res
  } catch (err) {
    console.log(err)
  }
}

export const fetchCamps = async () => {
  try {
    let res = await EHRIServices.getCamps();
    return res.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchGhettos = async () => {
  try {
    let res = await EHRIServices.getGhettos();
    return res.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchHistAgentInfo = async (id) => {
  try {
    let res = await EHRIServices.getHistAgentInfo(id);
    return res.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchRepositoryInfo = async (id) => {
  try {
    let res = await EHRIServices.getRepositoryInfo(id);
    return res.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchRelatedItems = async (id, page,facets) => {
  try {
    let res = await EHRIServices.getRelatedItems(id, page, facets);
    return res.data;
  } catch (err) {
    // Handle Error Here
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
    // Handle Error Here
    console.error(err);
  }
};

export const fetchBlogPosts = async (query, page, per_page, category, order) => {
  try {
    let res = await EHRIServices.getDBPosts(query, page, per_page, category, order);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchDBCategories = async () => {
  try {
    let res = await EHRIServices.getDBCategories();
    return res.data
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchETEitems = async (query, page, per_page, filters) => {
  try {
    let res = await EHRIServices.getETEitems(query, page, per_page, filters);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchDRitems = async (query, page, per_page, filters) => {
  try {
    let res = await EHRIServices.getDRitems(query, page, per_page, filters);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchBGFitems = async (query, page, per_page, filters) => {
  try {
    let res = await EHRIServices.getBGFitems(query, page, per_page, filters);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchDocUnit = async (id) => {
  try {
    let res = await EHRIServices.getDocUnit(id);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const fetchDocUnitsREST = async (query, page) => {
  try {
    let res = await EHRIServices.getPortalDocUnitResults(query, page);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchDocUnitsStatsREST = async (query, page) => {
  try {
    let res = await EHRIServices.getPortalDocUnitResultsStats(query, page);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchFacetedDocUnits = async (query, page, facets, limit) => {
  try {
    let res = await EHRIServices.getFacetedDocUnitResults(query, page, facets, limit);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};
export const fetchFacetedPortalSearch = async (query, page, facets, limit) => {
  try {
    let res = await EHRIServices.getFacetedPortalSearch(query, page, facets, limit);
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchCountryStats = async () => {
  try {
    let res = await EHRIServices.getCountryStats();
    return res;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};



export const fetchGhettoDataset = async () => {
  try {
    let res = await EHRIServices.getGhettoDataset();
    return res.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const fetchEntityMatcherDataset = async () => {
  try {
    let res = await EHRIServices.getEntityMatcherDataset();
    return res.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};
export const fetchCampsDataset = async () => {
  try {
    let res = await EHRIServices.getCampDataset();
    return res.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};