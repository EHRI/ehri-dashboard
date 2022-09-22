<template>
<div v-if="descInLang" class="cb-details">
  <h5 v-if="descInLang" class="mt-2">{{descInLang.name}}</h5>
  <div v-if="langs&&langs.length >1">
    <span class="badge card-badge me-1"
          v-for="description in langs"
          :key="description"
          @click="changeLang(description)"
    >{{languageNames.of(description)}}</span>
  </div>
  <h6 v-if="otherNames.length"
      class="mt-2 text-muted other-names">{{
      otherNames.join(', ')
    }}
  </h6>
  <VocabularyItemDetailsViz class="mt-2" v-if="(vocObject.broader.length||vocObject.narrower.length)||
(lat&&long)"
                  :voc-object="vocObject" :long="long" :lat="lat"></VocabularyItemDetailsViz>
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
import VocabularyItemDetailsViz from "./VocabularyItemDetailsViz.vue";

export default {
  name: "VocabularyItemDetails",
  components: {VocabularyItemDetailsViz},
  props: {
    selectedVocConceptID: String,
    coordinates: {
      type: Array,
      default: null
    }
  },
  setup(props) {
    const conceptID = toRef(props,"selectedVocConceptID")
    const coordinates = toRef(props, "coordinates")
    const conceptDetails = ref()
    const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    const descInLang = ref()
    const otherNames = ref([])
    const changeLang = (lang) => {
      descInLang.value = conceptDetails.value.find(d => {
        return d.languageCode === lang
      })
    }

    const portalLink = ref()
    const relatedItemsTotal = ref()
    const vocObject = ref()
    const langs = ref()
    const long = ref()
    const lat = ref()
    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu/keywords/${conceptID.value}`
      if(coordinates.value){
        long.value = coordinates.value[1]
        lat.value = coordinates.value[0]
      } else {
        long.value = null
        lat.value = null
      }
    }


    configData()

    fetchCvocConceptInfo(conceptID.value)
    .then(
      (res)=> {
        fetchRelatedItems(conceptID.value).then(
          (relatedRes) => {
            otherNames.value=[]
            vocObject.value = res.data.CvocConcept
            conceptDetails.value = vocObject.value.descriptions
            langs.value = conceptDetails.value.map(l => l.languageCode)
            descInLang.value = conceptDetails.value[0]
            descInLang.value.altLabel.length?
                descInLang.value.altLabel.forEach(n =>otherNames.value.push(n)):null
            descInLang.value.hiddenLabel?
                descInLang.value.hiddenLabel.forEach(n =>otherNames.value.push(n)):null
            relatedItemsTotal.value = relatedRes.meta.total
          }
        )
      }
    )

    watch([conceptID,coordinates], ()=> {
      configData()
      fetchCvocConceptInfo(conceptID.value)
          .then(
              (res)=> {
                fetchRelatedItems(conceptID.value).then(
                    (relatedRes) => {
                      otherNames.value=[]
                      vocObject.value = res.data.CvocConcept
                      conceptDetails.value = vocObject.value.descriptions
                      langs.value = conceptDetails.value.map(l => l.languageCode)
                      descInLang.value = conceptDetails.value[0]
                      descInLang.value.altLabel.length?
                          descInLang.value.altLabel.forEach(n =>otherNames.value.push(n)):null
                      descInLang.value.hiddenLabel?
                          descInLang.value.hiddenLabel.forEach(n =>otherNames.value.push(n)):null
                      relatedItemsTotal.value = relatedRes.meta.total
                    }
                )
              }
          )
    })
    return {langs,long, lat, vocObject,relatedItemsTotal,portalLink, languageNames, changeLang, descInLang, otherNames}
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