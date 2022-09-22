<template>
  <div v-if="descInLang" class="cb-details">
    <span class="badge card-badge me-1"
          v-for="description in langs"
          @click="changeLang(description)"
    >{{languageNames.of(description)}}</span>
      <h5 v-if="descInLang" class="mt-2">{{descInLang.name}}</h5>
      <h6 v-if="otherNames.length"
          class="mt-2 text-muted other-names">{{
          otherNames.join(', ')
        }}
      </h6>
      <EHRITermHierarchyViz
          v-if="narrowerInLang.length||broaderInLang.length"
          :broader="broaderInLang" :narrower="narrowerInLang" :selected="descInLang"
      ></EHRITermHierarchyViz>
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
import {fetchCvocConceptInfo, fetchRelatedItems} from "../services/EHRIGetters.js";
import EHRITermHierarchyViz from "./EHRITermHierarchyViz.vue";

export default {
  name: "EHRITermDetails",
  components: {EHRITermHierarchyViz},
  props: {
    selectedVocConceptID: String,
  },
  setup(props){
    const ConceptID = toRef(props,"selectedVocConceptID")
    const ConceptDetails = ref()
    const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    const descInLang = ref()
    const broaderInLang = ref()
    const narrowerInLang = ref()
    const otherNames = ref([])
    const langs = ref([])
    const changeLang = (lang) => {
      descInLang.value = ConceptDetails.value.find(d => {
        return d.languageCode === lang
      })
      if(broader.value.length){
        broaderInLang.value = broader.value.map(t => {
          if (t.descriptions.some(d => {
            return d.languageCode===lang
          })){
            return t.descriptions.find(d => {
              return d.languageCode===lang
            })
          } else {
            return t.descriptions.find(d => {
              return d.languageCode==="eng"
            })
          }
        })
      }
      if(narrower.value.length){
        narrowerInLang.value = narrower.value.map(t => {
          if (t.descriptions.some(d => {
            return d.languageCode===lang
          })){
            return t.descriptions.find(d => {
              return d.languageCode===lang
            })
          } else {
            return t.descriptions.find(d => {
              return d.languageCode==="eng"
            })
          }
        })
      }
    }

    const portalLink = ref()
    const relatedItemsTotal = ref()

    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu//keywords//${ConceptID.value}`
    }
    const termObject = ref()
    const narrower = ref()
    const broader = ref()


    configData()

    fetchCvocConceptInfo(ConceptID.value)
      .then(
        (res)=> {
          fetchRelatedItems(ConceptID.value).then(
              (relatedRes) => {
                langs.value = []
                broaderInLang.value = []
                narrowerInLang.value = []
                otherNames.value=[]
                termObject.value = {}
                ConceptDetails.value = []
                termObject.value = res.data.CvocConcept
                ConceptDetails.value = termObject.value.descriptions
                ConceptDetails.value.forEach(l => langs.value.push(l.languageCode))
                descInLang.value = ConceptDetails.value.find(d => d.languageCode==="eng")?
                    ConceptDetails.value.find(d => d.languageCode==="eng"):ConceptDetails.value[0]
                descInLang.value.altLabel.length?
                    descInLang.value.altLabel.forEach(n =>otherNames.value.push(n)):null
                descInLang.value.hiddenLabel?
                    descInLang.value.hiddenLabel.forEach(n =>otherNames.value.push(n)):null
                relatedItemsTotal.value = relatedRes.meta.total
                narrower.value = termObject.value.narrower
                broader.value = termObject.value.broader
                if(broader.value.length){
                  broaderInLang.value = broader.value.map(t => {
                    if (t.descriptions.some(d => {
                      return d.languageCode==="eng"
                    })){
                      return t.descriptions.find(d => {
                        return d.languageCode==="eng"
                      })
                    } else {
                      return t.descriptions[0]
                    }
                  })
                }
                if(narrower.value.length){
                  narrowerInLang.value = narrower.value.map(t => {
                    if (t.descriptions.some(d => {
                      return d.languageCode==="eng"
                    })){
                      return t.descriptions.find(d => {
                        return d.languageCode==="eng"
                      })
                    } else {
                      return t.descriptions[0]
                    }
                  })
                }
        })
      })
    watch(ConceptID, ()=> {
      configData()
      fetchCvocConceptInfo(ConceptID.value)
          .then(
              (res)=> {
                fetchRelatedItems(ConceptID.value).then(
                    (relatedRes) => {
                      langs.value = []
                      broaderInLang.value = []
                      narrowerInLang.value = []
                      otherNames.value=[]
                      termObject.value = {}
                      ConceptDetails.value = []
                      termObject.value = res.data.CvocConcept
                      ConceptDetails.value = termObject.value.descriptions
                      ConceptDetails.value.forEach(l => langs.value.push(l.languageCode))
                      descInLang.value = ConceptDetails.value.find(d => d.languageCode==="eng")?
                          ConceptDetails.value.find(d => d.languageCode==="eng"):ConceptDetails.value[0]
                      descInLang.value.altLabel.length?
                          descInLang.value.altLabel.forEach(n =>otherNames.value.push(n)):null
                      descInLang.value.hiddenLabel?
                          descInLang.value.hiddenLabel.forEach(n =>otherNames.value.push(n)):null
                      relatedItemsTotal.value = relatedRes.meta.total
                      narrower.value = termObject.value.narrower
                      broader.value = termObject.value.broader
                      if(broader.value.length){
                        broaderInLang.value = broader.value.map(t => {
                          if (t.descriptions.some(d => {
                            return d.languageCode==="eng"
                          })){
                            return t.descriptions.find(d => {
                              return d.languageCode==="eng"
                            })
                          } else {
                            return t.descriptions[0]
                          }
                        })
                      }
                      if(narrower.value.length){
                        narrowerInLang.value = narrower.value.map(t => {
                          if (t.descriptions.some(d => {
                            return d.languageCode==="eng"
                          })){
                            return t.descriptions.find(d => {
                              return d.languageCode==="eng"
                            })
                          } else {
                            return t.descriptions[0]
                          }
                        })
                      }
              }
          )
    })
    })

    return {
      narrowerInLang,
      broaderInLang,
      langs,
      relatedItemsTotal,
      portalLink,
      languageNames,
      changeLang,
      descInLang,
      otherNames,}
  }
}
</script>

<style scoped>
.card-badge {
  background-color: #F5B651;
  color: #330033;
  cursor: pointer;
}

.other-names {
  font-size: 0.85em;
}
.cb-details {
  text-align: justify;
  margin-left: 0.5em;
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