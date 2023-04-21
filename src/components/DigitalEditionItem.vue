<template>
  <li>
    <div class="grid grid-cols-9 gap-4 max-h-32 h-32 flex items-center">
      <div class="col-span-9 lg:col-span-6">
        <h6 v-if="title" class="text-ehri-wine font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1"><a :href="link" target="_blank" rel="noopener">{{title}}</a></h6>
        <h6 v-if="source" class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1">{{source}}</h6>
        <span v-if="date" class="lg:hidden text-xs text-ehri-dark font-sans opacity-90" >{{date}}</span>
        <p v-if="source" class="text-sm overflow-hidden line-clamp-2">{{description}}</p>
        <span v-if="languages.length" class="border border-ehri-wine rounded-full bg-ehri-wine text-white mr-1 px-2 font-sans text-xs" v-for="(lang,i) in languages" :id="i" >{{lang}}</span>
      </div>
        <div class="hidden lg:block lg:col-span-3 text-end">
        <span v-if="date" class="text-ehri-wine mr-1 px-2 font-sans font-semibold text-sm" >{{date}}</span>
      </div>
    </div>
  </li>
  <hr class="my-2 text-ehri-purple opacity-20">
</template>

<script>
import {toRef, ref, watch} from "vue";

export default {
  name: "DigitalEditionItem",
  props: {
    editionObject: Object,
    editionString: String
  },
  setup(props){
    const item = toRef(props, "editionObject")
    const edition = toRef(props, "editionString")
    const title = ref()
    const date = ref()
    const link = ref()
    const source = ref()
    const description = ref()
    const languages = ref([])
    const configData = () => {
      languages.value = []
      title.value = item.value.element_texts.find(e => e.element.name == "Title")?item.value.element_texts.find(e => e.element.name == "Title").text: "Title not Found"
      date.value = item.value.element_texts.find(e => e.element.name == "Date")? item.value.element_texts.find(e => e.element.name == "Date").text: "Date not Found"
      source.value = item.value.element_texts.find(e=>e.element.name == "Source")? item.value.element_texts.find(e=>e.element.name == "Source").text: null
      description.value = item.value.element_texts.find(e=>e.element.name == "Description")? item.value.element_texts.find(e=>e.element.name == "Description").text: null
      item.value.element_texts.filter(e=>e.element.name == "Language")? item.value.element_texts.filter(e=>e.element.name == "Language").forEach(lang => {
        languages.value.push(lang.text)
      }) : null
      if(edition.value === "ETE"){
        link.value = `https://early-testimony.ehri-project.eu/document/${item.value.element_texts.find(e => e.element.name == 'Identifier').text}`
      } else if (edition.value === "DRE"){
        link.value = `https://diplomatic-reports.ehri-project.eu/document/${item.value.element_texts.find(e => e.element.name == 'Identifier').text}`
      } else if (edition.value ==="BGFE"){
        link.value = `https://begrenzte-flucht.ehri-project.eu/document/${item.value.element_texts.find(e => e.element.name == 'Identifier').text}`
      }
    }

    configData()

    watch(item, ()=>{
      configData()
    })

    return {title, date, link, source,languages, description }
  }
}
</script>

<style scoped>

</style>