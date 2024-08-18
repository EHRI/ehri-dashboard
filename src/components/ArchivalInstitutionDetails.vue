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
        <div v-if="descInLang.addresses[0].webpage.length">
          <span class="block mt-1 line-clamp-1 text-sm text-ehri-dark" v-for="webpage in descInLang.addresses[0].webpage">
            <span
                  class="material-symbols-outlined text-sm w-5 h-5 align-top"
                >
                link
            </span>
            <a
              :href="webpage" target="_blank" rel="noopener"
              class="text-ehri-wine line-clamp-1"
            >{{ webpage }}
            </a>
        </span>
        </div>
        <span class="block mt-1 line-clamp-1 text-sm text-ehri-dark" v-if="descInLang.addresses.length &&
            descInLang.addresses[0].street">
            <span
                  class="material-symbols-outlined text-sm w-5 h-5 align-top "
                >
                location_on
            </span>
            {{descInLang.addresses[0].street}}{{descInLang.addresses[0].municipality?', '+descInLang.addresses[0].municipality:null}}{{descInLang.addresses[0].firstdem?', ' + descInLang.addresses[0].firstdem:null}}{{descInLang.addresses[0].postalCode?', '+descInLang.addresses[0].postalCode: null}}{{descInLang.addresses[0].countryCode?', '+countryNames.of(descInLang.addresses[0].countryCode):null}}
        </span>
      </div>
<div class="flex-1">
  <div class="flex mt-3 mb-1 grid-flow-col auto-cols-max justify-center divide-x-2 divide-ehri-light-grey">
      <button v-if="descInLang.history"
              :class="tabClasses('history')"
              class="capitalize"
              @click="showDesc('history')">
        <span>
          {{$t('history')}}
        </span>
      </button>
      <button v-if="descInLang.geoculturalContext"
              :class="tabClasses('context')"
              class="capitalize"
              @click="showDesc('context')">
        <span>
          {{$t('context')}}
        </span>
      </button>
      <button v-if="descInLang.holdings"
              :class="tabClasses('holdings')"
              class="capitalize"
              @click="showDesc('holdings')">
        <span>
          {{$t('holdings')}}
        </span>
      </button>
      <button v-if="descInLang.findingAids"
            :class="tabClasses('findingAids')"
            class="capitalize"
              @click="showDesc('findingAids')">
        <span>
          {{$t('findingAids')}}
        </span>
      </button>
      <button v-if="descInLang.conditions"
              :class="tabClasses('conditions')"
              class="capitalize"
              @click="showDesc('conditions')">
        <span>
          {{$t('conditionsOfAccess')}}
        </span>
      </button>
      <button v-if="descInLang.openingTimes"
              :class="tabClasses('times')"
              class="capitalize"
              @click="showDesc('times')">
        <span>
          {{$t('openingTimes')}}
        </span>
      </button>
    </div>
    <div v-if="clickedDesc && clickedDesc.length>1" class="flex-1 h-44 max-h-44 p-1 mt-4 overflow-y-auto border-2 border-ehri-light-grey">
        <div v-if="descInLang.history && clickedDesc === 'history'">
          <p class="text-base font-sans text-ehri-dark ">{{ descInLang.history }}</p>
        </div>
        <div v-if="descInLang.geoculturalContext && clickedDesc === 'context'">
          <p class="text-base font-sans text-ehri-dark">{{ descInLang.geoculturalContext }}</p>
        </div>
        <div v-if="descInLang.holdings && clickedDesc === 'holdings'">
          <p class="text-base font-sans text-ehri-dark">{{ descInLang.holdings }}</p>
        </div>
        <div v-if="descInLang.findingAids && clickedDesc === 'findingAids'">
          <p class="text-base font-sans text-ehri-dark" v-html="descInLang.findingAids"></p>
        </div>
        <div v-if="descInLang.conditions && clickedDesc === 'conditions'">
          <p class="text-base font-sans text-ehri-dark">{{ descInLang.conditions }}</p>
        </div>
        <div v-if="descInLang.openingTimes && clickedDesc === 'times'">
          <p class="text-base font-sans text-ehri-dark" v-html="descInLang.openingTimes"></p>
        </div>
    </div>
    <div class="flex flex-col overflow-hidden items-start mt-auto">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span
                class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top"
              >
              link
        </span> {{$t('totalLinkedItemsPortal')}} {{relatedItemsTotal}}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10 " v-if="portalLink" >
      <a :href="portalLink" class="capitalize" target="_blank" rel="noopener">
        <span
                class="mx-1 material-symbols-outlined w-5 h-5 align-top"
              >
              database
        </span>
        {{$t('goToEHRIPortal')}}
        </a>
      </span>
      </div>
  </div>
    </div>
    <LoadingComponent v-else></LoadingComponent>
</div>
</template>

<script>
import {toRef, ref, watch } from "vue";
import {fetchRepositoryInfo, fetchRelatedItems} from "../services/EHRIGetters.js";
import LoadingComponent from "./LoadingComponent.vue";

export default {
  name: "ArchivalInstitutionDetails",
  components: { LoadingComponent},
  props: {
    selectedRepoID: String
  },
  setup(props) {
    const repoID = toRef(props,"selectedRepoID")
    const repoDetails = ref()
    const languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    const countryNames = new Intl.DisplayNames(['en'], {type: 'region'});
    const langs = ref([])
    const descInLang = ref()
    const otherNames = ref([])
    const loading = ref(true)

    const changeLang = (lang) => {
      loading.value = true
      descInLang.value = repoDetails.value.find(d => {
        return d.languageCode === lang
      })
      loading.value = false
    }

    const clickedDesc = ref("")
    const showDesc = (d) => {
      clickedDesc.value = d
    }

    const tabClasses = (d) => {
      // Dynamically apply Tailwind CSS classes to context tab based on clickedDesc value
      return ['px-1.5 pb-1 text-xs font-medium text-ehri-dark hover:text-ehri-wine', clickedDesc.value === d ? 'text-ehri-wine' : 'text-ehri-dark']
    };


    const portalLink = ref()
    const relatedItemsTotal = ref()

    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu/institutions/${repoID.value}`
    }
    
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
                                  clickedDesc.value="holdings":descInLang.value.findingAids?clickedDesc.value="findingAids":descInLang.value.conditions?
                                  clickedDesc.value="conditions":descInLang.value.openingTimes?clickedDesc.value="times":""
                      descInLang.value.parallelFormsOfName.length?
                          descInLang.value.parallelFormsOfName.forEach(n => {otherNames.value.push(n)}):null
                      descInLang.value.otherFormsOfName.length?
                          descInLang.value.otherFormsOfName.forEach(n => {otherNames.value.push(n)}):null
                      relatedItemsTotal.value = relatedRes.meta.total
                      loading.value = false
                    }
                )
              }
          )

    watch(repoID, ()=> {
      configData()
      loading.value=true
      clickedDesc.value = ""
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
                                  clickedDesc.value="holdings":descInLang.value.findingAids?clickedDesc.value="findingAids":descInLang.value.conditions?
                                  clickedDesc.value="conditions":descInLang.value.openingTimes?clickedDesc.value="times":""
                      descInLang.value.parallelFormsOfName.length?
                          descInLang.value.parallelFormsOfName.forEach(n => {otherNames.value.push(n)}):null
                      descInLang.value.otherFormsOfName.length?
                          descInLang.value.otherFormsOfName.forEach(n => {otherNames.value.push(n)}):null
                      relatedItemsTotal.value = relatedRes.meta.total
                      loading.value = false
                    }
                )
              }
          )
    })
    return { langs, relatedItemsTotal, portalLink, languageNames, changeLang, descInLang, otherNames, countryNames, showDesc, clickedDesc, loading, tabClasses }
  }
}
</script>
