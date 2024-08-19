<template>
  <div class="flex flex-col h-full h-max-full">
    <div v-if="descInLang" class="flex flex-col">
      <div class="flex flex-col flex-1">
        <h5 v-if="descInLang" class="font-sans font-semibold text-ehri-wine line-clamp-1">{{descInLang.name}}</h5>
        <h6 v-if="otherNames.length"
            class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1">{{
          otherNames.join(', ')
        }}</h6>
        <div>
          <span class="block mt-2 line-clamp-1 text-ehri-dark" v-if="descInLang.datesOfExistence">
            <span
                  class="material-symbols-outlined w-5 h-5 align-top"
                >
                  calendar_month
            </span>
            {{descInLang.datesOfExistence}}
          </span>
          <span class="block mt-1 line-clamp-1 text-ehri-dark" v-if="descInLang.place.length" >
            <span
                  class="material-symbols-outlined w-5 h-5 align-top "
                >
                location_on
            </span>
            {{descInLang.place.join('; ')}}
          </span>
        </div>
        <div class="flex-1" v-if="descInLang.biographicalHistory || descInLang.generalContext">
          <div class="flex mt-2">
            <!-- Conditionally show history tab if biographicalHistory exists -->
            <button v-if="descInLang.biographicalHistory"
                    :class="historyTabClasses"
                    class="capitalize"
                    @click="showDesc('history')">
              {{ $t('history') }}
            </button>
            <!-- Conditionally show context tab if generalContext exists -->
            <button v-if="descInLang.generalContext"
                    :class="contextTabClasses"
                    class="capitalize"
                    @click="showDesc('context')">
                    {{ $t('context') }}
            </button>
          </div>
          <div v-if="descInLang.biographicalHistory||descInLang.generalContext" class="mt-2 h-56 h-max-56 flex-1 p-3 overflow-auto border-2 border-ehri-light-grey">
            <!-- Show history content if clickedDesc is 'history' -->
            <div v-if="descInLang.biographicalHistory && clickedDesc === 'history'">
              <p class="text-base font-sans text-ehri-dark ">{{ descInLang.biographicalHistory }}</p>
            </div>
            <!-- Show context content if clickedDesc is 'context' -->
            <div v-if="descInLang.generalContext && clickedDesc === 'context'">
              <p class="text-base font-sans text-ehri-dark">{{ descInLang.generalContext }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col flex-1 w-fit">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span
                class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top"
              >
              link
        </span> {{ $t('totalLinkedItemsPortal') }}: {{relatedItemsTotal}}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10 " v-if="portalLink" >
      <a :href="portalLink" class="capitalize flex items-center" target="_blank" rel="noopener">
        <span
                class="mr-1 material-symbols-outlined w-5 h-5 align-top"
              >
              database
        </span>
        {{ $t('goToEHRIPortal') }}
        </a>
      </span>
      </div>
    </div>
</div>
</template>

<script>
import {toRef, ref, watch, computed } from "vue";
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
    const historyTabClasses = computed(() => {
      // Dynamically apply Tailwind CSS classes to history tab based on clickedDesc value
      return ['px-1.5 text-sm font-medium border-b-2 hover:border-ehri-wine text-ehri-wine', clickedDesc.value === 'history' ? 'border-ehri-wine' : 'border-white']
    });

    const contextTabClasses = computed(() => {
      // Dynamically apply Tailwind CSS classes to context tab based on clickedDesc value
      return ['px-1.5 text-sm font-medium border-b-2 hover:border-ehri-wine text-ehri-wine', clickedDesc.value === 'context' ? 'border-ehri-wine' : 'border-white']
    });
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
            descInLang.value = res.data.HistoricalAgent.descriptions[0]
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
                      descInLang.value = res.data.HistoricalAgent.descriptions[0]
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
    return {      historyTabClasses,
      contextTabClasses, relatedItemsTotal,authDetails, portalLink, descInLang, otherNames, showDesc, clickedDesc,}
  }
}
</script>

<style scoped>





</style>