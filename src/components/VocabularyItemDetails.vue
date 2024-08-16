<template>
  <div class="flex flex-col h-full h-max-full">
    <div v-if="descInLang && !loading" class="flex flex-col">
      <div class="flex flex-col flex-1">
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
      <VocabularyItemDetailsViz class="h-72" v-if="(vocObject.broader.length||vocObject.narrower.length)|| (lat&&long)"
                  :voc-object="vocObject" :long="long" :lat="lat" :lang="descInLang.languageCode">
      </VocabularyItemDetailsViz>
      <div class="flex flex-col flex-1 w-fit">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span
                class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top"
              >
              link
        </span>{{ $t('totalLinkedItemsPortal') }}: {{relatedItemsTotal}}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10 " v-if="portalLink" >
      <a :href="portalLink" class="capitalize" target="_blank" rel="noopener">
        <span
                class="mx-1 material-symbols-outlined w-5 h-5 align-top"
              >
              database
        </span>
        {{ $t('goToEHRIPortal') }}
        </a>
      </span>
      </div>
    </div>
    <LoadingComponent v-else></LoadingComponent>
  </div>
</template>

<script>
import {toRef, ref, watch } from "vue";
import {fetchCvocConceptInfo, fetchRelatedItems} from "../services/EHRIGetters.js";
import LoadingComponent from "./LoadingComponent.vue";
import VocabularyItemDetailsViz from "./VocabularyItemDetailsViz.vue";
import { useI18n } from "vue-i18n";


export default {
  name: "VocabularyItemDetails",
  components: { VocabularyItemDetailsViz, LoadingComponent },
  props: {
    selectedVocConceptID: String,
  },
  setup(props) {
    const { t,locale} = useI18n();
    const conceptID = toRef(props,"selectedVocConceptID")
    const conceptDetails = ref()
    const languageNames = ref({})
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
    }
    const loading = ref(true)

    const getLangNames = (locale) => {
      languageNames.value = new Intl.DisplayNames([locale], { type: "language" });
    }

    getLangNames(locale.value)

    configData()

    fetchCvocConceptInfo(conceptID.value)
    .then(
      (res)=> {
        fetchRelatedItems(conceptID.value).then(
          (relatedRes) => {
            otherNames.value=[]
            vocObject.value = res.data.CvocConcept
            lat.value = vocObject.value.latitude
            long.value = vocObject.value.longitude
            conceptDetails.value = vocObject.value.descriptions
            langs.value = conceptDetails.value.map(l => l.languageCode)
            descInLang.value = conceptDetails.value.find(d => d.languageCode === locale.value) ||
              conceptDetails.value.find(d => d.languageCode === "eng") ||
              conceptDetails.value[0];
            descInLang.value.altLabel.length?
                descInLang.value.altLabel.forEach(n =>otherNames.value.push(n)):null
            descInLang.value.hiddenLabel?
                descInLang.value.hiddenLabel.forEach(n =>otherNames.value.push(n)):null
            relatedItemsTotal.value = relatedRes.meta.total
            loading.value=false
          }
        )
      }
    )

    watch([conceptID,lat, long], ()=> {
      configData()
      loading.value = true
      fetchCvocConceptInfo(conceptID.value)
          .then(
              (res)=> {
                fetchRelatedItems(conceptID.value).then(
                    (relatedRes) => {
                      otherNames.value=[]
                      vocObject.value = res.data.CvocConcept
                      lat.value = vocObject.value.latitude
                      long.value = vocObject.value.longitude
                      conceptDetails.value = vocObject.value.descriptions
                      langs.value = conceptDetails.value.map(l => l.languageCode)
                      descInLang.value = conceptDetails.value.find(d => d.languageCode === locale.value) ||
                        conceptDetails.value.find(d => d.languageCode === "eng") ||
                        conceptDetails.value[0];
                      descInLang.value.altLabel.length?
                          descInLang.value.altLabel.forEach(n =>otherNames.value.push(n)):null
                      descInLang.value.hiddenLabel?
                          descInLang.value.hiddenLabel.forEach(n =>otherNames.value.push(n)):null
                      relatedItemsTotal.value = relatedRes.meta.total
                      loading.value=false
                    }
                )
              }
          )
    })
    watch(
        () => locale.value,
        (newLocale) => {
          getLangNames(newLocale)
        }
    );
    return {langs,long,  loading,lat, vocObject,relatedItemsTotal,portalLink, languageNames, changeLang, descInLang, otherNames}
  }
}
</script>

<style>
svg {
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
} 
</style>


