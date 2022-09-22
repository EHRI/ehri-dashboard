<template>
<div v-if="descInLang" class="repo-details row m-0">
  <div class="col-md-9">
    <span class="badge card-badge me-1"
            v-for="description in langs"
            :key="description"
            @click="changeLang(description)"
      >{{languageNames.of(description)}}
    </span>
    <h5 v-if="descInLang"
        class="mt-2 name">
      {{descInLang.name}}
    </h5>
    <h6 v-if="otherNames.length"
        class="mt-2 text-muted other-names text-truncate">{{
        otherNames.join(', ')
      }}</h6>
    <span class="icon-details" v-if="descInLang.datesOfDescription">
      <span ><font-awesome-icon icon="calendar"/>
      </span>
      {{descInLang.datesOfDescription}}
    </span>
    <span class="icon-details"
          v-if="descInLang.addresses.length &&
            descInLang.addresses[0].street" >
      <span ><font-awesome-icon icon="location-dot"/>
      </span>
      {{descInLang.addresses[0].street}}{{descInLang.addresses[0].municipality?', '+descInLang.addresses[0].municipality:null}}{{descInLang.addresses[0].firstdem?', ' + descInLang.addresses[0].firstdem:null}}{{descInLang.addresses[0].postalCode?', '+descInLang.addresses[0].postalCode: null}}{{descInLang.addresses[0].countryCode?', '+countryNames.of(descInLang.addresses[0].countryCode):null}}
    </span>
    <span
        v-if="descInLang.history"
        class="badge card-badge-desc m-1"
        @click="showDesc('history')"
    >
      History
    </span>
    <span
        v-if="descInLang.geoculturalContext"
        class="badge card-badge-desc m-1"
        @click="showDesc('context')"
    >
    Context
    </span>
    <span
          v-if="descInLang.holdings"
          class="badge card-badge-desc m-1"
          @click="showDesc('holdings')"
      >
      Holdings
    </span>
    <span
          v-if="descInLang.findingAids"
          class="badge card-badge-desc m-1"
          @click="showDesc('findingAids')"
      >
      Finding Aids
    </span>
    <span
        v-if="descInLang.conditions"
        class="badge card-badge-desc m-1"
        @click="showDesc('conditions')"
    >
      Conditions of Access
    </span>
    <span
        v-if="descInLang.openingTimes"
        class="badge card-badge-desc m-1"
        @click="showDesc('times')"
    >
      Opening Times
    </span>
    <span v-if="descInLang.history && clickedDesc==='history'">
      <h6 class="mt-1 mb-0">History:</h6>
      <p class="card-text m-0">
        {{descInLang.history}}
      </p>
    </span>
    <span v-if="descInLang.geoculturalContext && clickedDesc==='context'">
      <h6 class="mt-1 mb-0">Context:</h6>
      <p class="card-text m-0">
      {{descInLang.geoculturalContext}}
      </p>
    </span>
    <span v-if="descInLang.holdings && clickedDesc==='holdings'">
      <h6 class="mt-1 mb-0">Holdings:</h6>
      <p class="card-text m-0">
      {{descInLang.holdings}}
      </p>
    </span>
    <span v-if="descInLang.findingAids && clickedDesc==='findingAids'">
      <h6 class="mt-1 mb-0">Finding Aids:</h6>
      <p class="card-text m-0" v-html="descInLang.findingAids">

      </p>
    </span>
    <span v-if="descInLang.conditions && clickedDesc==='conditions'">
      <h6 class="mt-1 mb-0">Conditions of Access:</h6>
      <p class="card-text m-0" v-html="descInLang.conditions">

      </p>
    </span>
    <span v-if="descInLang.openingTimes && clickedDesc==='times'">
      <h6 class="mt-1 mb-0">Opening Times:</h6>
      <p class="card-text m-0" v-html="descInLang.openingTimes">

      </p>
    </span>
    <span class="text-muted small d-block">Total Linked Items on the Portal: {{relatedItemsTotal}}</span>
    <span class="portal-span" v-if="portalLink" >
    <a :href="portalLink" class="portal-link" target="_blank" rel="noopener">
      <span style="margin: 0 0.2em">
        <font-awesome-icon icon="database"/>
      </span>
      EHRI Portal Link
    </a>
  </span>
  </div>
  <div class="col-md-3 mt-4">
    <span class="icon-details" v-if="descInLang.addresses[0].webpage.length">
      <span ><font-awesome-icon icon="computer-mouse"/>
      </span>
      <a
        v-for="webpage in descInLang.addresses[0].webpage"
        :href="webpage" target="_blank" rel="noopener"
        class="website-link m-0"
      >
        <p class="text-truncate">{{webpage}}</p>
      </a>
    </span>
  </div>
</div>
</template>

<script>
import {toRef, ref, watch} from "vue";
import {fetchRepositoryInfo, fetchRelatedItems} from "../services/EHRIGetters.js";

export default {
  name: "ArchivalInstitutionDetails",
  props: {
    selectedRepoID: String
  },
  setup(props) {
    const repoID = toRef(props,"selectedRepoID")
    const repoDetails = ref()
    const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    const countryNames = new Intl.DisplayNames(['en'], {type: 'region'});
    const langs = ref()
    const descInLang = ref()
    const otherNames = ref([])
    const changeLang = (lang) => {
      descInLang.value = repoDetails.value.find(d => {
        return d.languageCode === lang
      })
    }
    const clickedDesc = ref("")
    const showDesc = (d) => {
      clickedDesc.value = d
    }
    const portalLink = ref()
    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu/institutions/${repoID.value}`
    }
    const relatedItemsTotal = ref()

    configData()

    fetchRepositoryInfo(repoID.value)
    .then(
      (res)=> {
        fetchRelatedItems(repoID.value).then(
          (relatedRes) => {
            otherNames.value=[]
            repoDetails.value = res.data.Repository.descriptions
            langs.value = repoDetails.value.map(l => l.languageCode)
            descInLang.value = repoDetails.value[0]
            descInLang.value.history?
                clickedDesc.value="history":descInLang.value.geoculturalContext?
                    clickedDesc.value="context":descInLang.value.holdings?
                        clickedDesc.value="holdings":""
            descInLang.value.parallelFormsOfName.length?
                descInLang.value.parallelFormsOfName.forEach(n => {otherNames.value.push(n)}):null
            descInLang.value.otherFormsOfName.length?
                descInLang.value.otherFormsOfName.forEach(n => {otherNames.value.push(n)}):null
            relatedItemsTotal.value = relatedRes.meta.total
          }
        )
      }
    )

    watch(repoID, ()=> {
      configData()

      fetchRepositoryInfo(repoID.value)
          .then(
              (res)=> {
                fetchRelatedItems(repoID.value).then(
                    (relatedRes) => {
                      otherNames.value=[]
                      console.log(res)
                      repoDetails.value = res.data.Repository.descriptions
                      langs.value = repoDetails.value.map(l => l.languageCode)
                      descInLang.value = repoDetails.value[0]
                      descInLang.value.history?
                          clickedDesc.value="history":descInLang.value.geoculturalContext?
                              clickedDesc.value="context":descInLang.value.holdings?
                                  clickedDesc.value="holdings":""
                      descInLang.value.parallelFormsOfName.length?
                          descInLang.value.parallelFormsOfName.forEach(n => {otherNames.value.push(n)}):null
                      descInLang.value.otherFormsOfName.length?
                          descInLang.value.otherFormsOfName.forEach(n => {otherNames.value.push(n)}):null
                      relatedItemsTotal.value = relatedRes.meta.total
                    }
                )
              }
          )
    })
    return { langs, relatedItemsTotal, portalLink, languageNames, changeLang, descInLang, otherNames, countryNames, showDesc, clickedDesc}
  }
}
</script>

<style scoped>
.card-badge {
  background-color: #F5B651;
  color: #330033;
  cursor: pointer;
}
.card-badge-desc{
  background-color: #330033;
  color: #FFFFFF;
  cursor: pointer;
}
.name {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.other-names {
  font-size: 0.85em;
}
.repo-details {
  text-align: justify;
  margin-left: 0.5em;
  height: 22em;
  position: relative;
}
.card-text {
  border: 0.1em dotted #330033;
  background-color: #FFFFFF;
  padding: 0.3em;
  height: 5.5em;
  max-height: 12em;
  overflow: scroll;
}
.icon-details {
  display: block;
}
.icon-details span {
  display: inline-block;
  padding: 0.1em;
}
.portal-link {
  text-decoration: none!important;
  color: #FFFFFF;
  text-align: center;
  display: flex;
  background-color: #330033;
  padding: 0.3em 0.6em;
  border-radius: 5px;
  width: fit-content;
}
.website-link {
  text-decoration: none;
  color: #330033;
  font-style: italic;
  display: block;
}


</style>