<template>
  <div class="flex flex-col h-fit h-max-full">
    <div v-if="descInLang && !loading" class="flex flex-col h-fit h-max-full">
      <div class="flex flex-col flex-1 h-fit h-max-full">
        <h5 v-if="descInLang" class="font-sans font-semibold text-ehri-wine line-clamp-1">{{descInLang.name}}</h5>
        <h6 v-if="otherNames.length"
            class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1">{{
          otherNames.join(', ')
        }}</h6>
        <div v-if="langs&&langs.length >1">
          <select @change="(e)=>changeLang(e.target.value)" class="font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="'Choose Language'">
            <option selected disabled>{{ languageNames.of(descInLang.languageCode) }}</option>
            <option v-for="description in langs" :key="description" :value="description">{{languageNames.of(description)}}</option>
          </select>
        </div>
      </div>
      <div class="flex-1">
  <div class="flex mt-2">
      <button v-if="broaderInLang.length||narrowerInLang.length"
              :class="contextTabClasses"
              @click="showDesc('hierarchy')">
        <span class="block mt-1 line-clamp-1">
          <span
                class="material-symbols-outlined w-6 h-6 align-top"
              >
                account_tree
          </span>
          Term Hierarchy
        </span>
      </button>
    </div>
    <div class="flex-1 h-72 max-h-72 mt-4 overflow-auto border-2 border-ehri-light-grey">
      <div v-if="clickedDesc === 'hierarchy'">
        <EHRITermHierarchyViz
            v-if="narrowerInLang.length||broaderInLang.length"
            :broader="broaderInLang" :narrower="narrowerInLang" :selected="descInLang"
        ></EHRITermHierarchyViz>
      </div>
    </div>
    <span v-if="clickedDesc === 'hierarchy'" class="text-ehri-dark text-xs font-sans">The term hierarchy is based on the EHRI vocabulary of
            <a class="underline text-ehri-wine" href="https://portal.ehri-project.eu/vocabularies/ehri_terms" target="_blank" rel="noopener noreferrer">
              Terms</a>.
    </span>
  </div>
      <div class="flex flex-col overflow-hidden items-start mt-auto">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span
                class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top"
              >
              link
        </span> Total Linked Items on the Portal: {{relatedItemsTotal}}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10 " v-if="portalLink" >
      <a :href="portalLink" class="uppercase" target="_blank" rel="noopener">
        <span
                class="mx-1 material-symbols-outlined w-5 h-5 align-top"
              >
              database
        </span>
        Go to EHRI Portal
        </a>
      </span>
      </div>
    </div>
    <LoadingComponent v-else></LoadingComponent>
</div>
</template>

<script>
import {toRef, ref, watch, computed} from "vue";
import {fetchCvocConceptInfo, fetchRelatedItems} from "../services/EHRIGetters.js";
import EHRITermHierarchyViz from "./EHRITermHierarchyViz.vue";
import LoadingComponent from "./LoadingComponent.vue";

export default {
  name: "EHRITermDetails",
  components: {EHRITermHierarchyViz, LoadingComponent},
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
    const loading = ref(true)
    const langs = ref([])
    const changeLang = (lang) => {
      loading.value = true
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
      loading.value = false
    }


    const clickedDesc = ref("")

    const showDesc = (d) => {
      d==="map"?clickedDesc.value="map":d==="hierarchy"?clickedDesc.value="hierarchy":null
    }

    const contextTabClasses = computed(() => {
      // Dynamically apply Tailwind CSS classes to context tab based on clickedDesc value
      return ['px-1.5 pb-1 text-sm font-medium text-ehri-dark hover:text-ehri-wine', clickedDesc.value === 'hierarchy' ? 'text-ehri-wine' : 'text-ehri-dark']
    });

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
                clickedDesc.value = narrower.value.length||broader.value.length?
                    "hierarchy":""
                loading.value=false
        })
      })
    watch(ConceptID, ()=> {
      configData()
      loading.value=true
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
                      clickedDesc.value = narrower.value.length||broader.value.length?
                    "hierarchy":""
                    loading.value=false
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
      otherNames,
      showDesc,
      contextTabClasses,
      clickedDesc,
      loading
    }
  }
}
</script>
