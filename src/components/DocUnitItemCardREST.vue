<template>
  <li>
    <div class="grid grid-cols-8 max-h-32 h-32 flex items-center">
      <div class="col-span-8 sm:col-span-5">
        <h6 v-if="docUnit.attributes.descriptions[0].name" class="text-ehri-wine font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1"><a :href="portalLink" target="_blank" rel="noopener">{{docUnit.attributes.descriptions[0].name}}</a></h6>
        <h6 v-if="docUnit.repoName" class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1">{{docUnit.repoName}}</h6>
        <p v-if="docUnit.attributes.descriptions[0].scopeAndContent" class="text-sm overflow-hidden line-clamp-2">{{ docUnit.attributes.descriptions[0].scopeAndContent }}</p>
        <p v-if="docUnit.attributes.descriptions[0].extentAndMedium" class="capitalize text-ehri-dark font-sans opacity-80 text-xs line-clamp-1">{{docUnit.attributes.descriptions[0].extentAndMedium}}</p>
        <span v-if="docUnit.attributes.descriptions[0].language.length" :key="docUnit.attributes.localId" class="border border-ehri-wine rounded-full bg-ehri-wine text-white mr-1 px-2 font-sans text-xs">{{docUnit.attributes.descriptions[0].language}}</span>
        
      </div>
      <div class="hidden md:block col-span-2 col-start-7">
        <a :href="portalLink" target="_blank" rel="noopener">
          <div class="text-center border border-2 rounded border-ehri-wine font-serif font-bold text-sm text-ehri-wine py-2 px-1 w-3/4">
            GO TO EHRI PORTAL
          </div>
        </a>
      </div>
    </div>
  </li>
  <hr class="my-2 text-ehri-purple opacity-20">
</template>

<script>
import {toRef, ref, watch} from "vue";
import {fetchRepoName} from "../services/EHRIGetters";

export default {
  name: "DocUnitItemCardREST",
  props: {
    docUnitObject: Object
  },
  setup(props){
    const docUnit = toRef(props, 'docUnitObject')
    const portalLink = ref()

    if(docUnit.value.relationships.holder && docUnit.value.relationships.holder.data) {
      fetchRepoName(docUnit.value.relationships.holder.data.id)
      .then((res)=> {
        docUnit.value['repoName'] = res
      })

    }

    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu/units/${docUnit.value.id}`
    }
    
    

    configData()

    watch(docUnit, ()=> {
      configData()
    })

    return {docUnit,portalLink}
  }
}
</script>

<style scoped>

</style>