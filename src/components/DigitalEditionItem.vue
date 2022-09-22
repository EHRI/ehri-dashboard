<template>
  <div class="card  doc-item-card">
    <div class="card-body p-0">
      <h5 v-if="title" class="card-title"><a :href="link" target="_blank" rel="noopener">{{title}}</a></h5>
      <p v-if="source" class="card-subtitle mb-2">{{source}}</p>
      <span v-if="date" class="badge card-badge me-1">{{date}}</span>
      <span v-if="languages.length"  v-for="(lang,i) in languages" :id="i" class="me-1 badge card-badge">{{lang}}</span>
    </div>
    <hr class="my-2">
  </div>
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
    const languages = ref([])
    const configData = () => {
      languages.value = []
      title.value = item.value.element_texts.find(e => e.element.name == "Title")?item.value.element_texts.find(e => e.element.name == "Title").text: "Title not Found"
      date.value = item.value.element_texts.find(e => e.element.name == "Date")? item.value.element_texts.find(e => e.element.name == "Date").text: "Date not Found"
      source.value = item.value.element_texts.find(e=>e.element.name == "Source")? item.value.element_texts.find(e=>e.element.name == "Source").text: null
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

    return {title, date, link, source,languages }
  }
}
</script>

<style scoped>
.card-badge {
  background-color: #6C003B;
  color: #FFFFFF;
}

.doc-item-card {
  background-color: rgba(0,0,0,0)!important;
  border: none;
}

.doc-item-card a {
  text-decoration: none;
  color: inherit;
}

.doc-item-card a:hover {
  text-decoration: underline;
}
</style>