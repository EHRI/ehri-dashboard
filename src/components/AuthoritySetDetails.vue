<template>
<div v-if="descInLang" class="auth-details">
  <h5 v-if="descInLang" class="mt-2">{{descInLang.name}}</h5>
  <h6 v-if="otherNames.length"
      class="mt-2 text-muted other-names text-truncate">{{
      otherNames.join(', ')
    }}</h6>
  <span class="icon-details" v-if="descInLang.datesOfExistence">
    <span ><font-awesome-icon icon="calendar"/>
    </span>
    {{descInLang.datesOfExistence}}
  </span>
  <span class="icon-details" v-if="descInLang.place.length" >
    <span ><font-awesome-icon icon="location-dot"/>
    </span>
    {{descInLang.place.join('; ')}}
  </span>
  <span
      v-if="descInLang.biographicalHistory"
      class="badge card-badge-desc m-1"
      @click="showDesc('history')"
  >
    History
  </span>
  <span
      v-if="descInLang.generalContext"
      class="badge card-badge-desc m-1"
      @click="showDesc('context')"
  >
    Context
  </span>
  <span v-if="descInLang.biographicalHistory && clickedDesc==='history'">
    <h6 class="mt-1 mb-0">History:</h6>
    <p class="card-text m-0">
      {{descInLang.biographicalHistory}}
    </p>
  </span>
  <span v-if="descInLang.generalContext && clickedDesc==='context'">
    <h6 class="mt-1 mb-0">Context:</h6>
    <p class="card-text m-0">
    {{descInLang.generalContext}}
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
</template>

<script>
import {toRef, ref, watch} from "vue";
import {fetchHistAgentInfo, fetchRelatedItems} from "../services/EHRIGetters.js";

export default {
  name: "AuthoritySetDetails",
  props: {
    selectedAuthID: String
  },
  setup(props) {
    const authID = toRef(props,"selectedAuthID")
    const authDetails = ref()
    const descInLang = ref()
    const otherNames = ref([])
    const clickedDesc = ref("")
    const showDesc = (d) => {
      d==="history"?clickedDesc.value="history":d==="context"?clickedDesc.value="context":null
    }
    const portalLink = ref()
    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu/authorities/${authID.value}`
    }
    const relatedItemsTotal = ref()

    configData()

    fetchHistAgentInfo(authID.value)
    .then(
      (res)=> {
        fetchRelatedItems(authID.value).then(
          (relatedRes) => {
            otherNames.value=[]
            authDetails.value = res.data.HistoricalAgent.descriptions
            descInLang.value = authDetails.value[0]
            descInLang.value.biographicalHistory?
                clickedDesc.value="history":descInLang.value.generalContext?
                    clickedDesc.value="context":""
            descInLang.value.parallelFormsOfName.length?
                descInLang.value.parallelFormsOfName.forEach(n => {otherNames.value.push(n)}):null
            descInLang.value.otherFormsOfName.length?
                descInLang.value.otherFormsOfName.forEach(n => {otherNames.value.push(n)}):null
            relatedItemsTotal.value = relatedRes.meta.total
          }
        )
      }
    )

    watch(authID, ()=> {
      configData()

      fetchHistAgentInfo(authID.value)
          .then(
              (res)=> {
                fetchRelatedItems(authID.value).then(
                    (relatedRes) => {
                      otherNames.value=[]
                      authDetails.value = res.data.HistoricalAgent.descriptions
                      descInLang.value = authDetails.value[0]
                      descInLang.value.biographicalHistory?
                          clickedDesc.value="history":descInLang.value.generalContext?
                              clickedDesc.value="context":""
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
    return { relatedItemsTotal, portalLink, descInLang, otherNames, showDesc, clickedDesc}
  }
}
</script>

<style scoped>
.card-badge-desc{
  background-color: #330033;
  color: #FFFFFF;
  cursor: pointer;
}
.other-names {
  font-size: 0.85em;
}
.auth-details {
  text-align: justify;
  margin-left: 0.5em;
}
.card-text {
  border: 0.1em dotted #330033;
  background-color: #FFFFFF;
  padding: 0.3em;
  max-height: 8em;
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
</style>