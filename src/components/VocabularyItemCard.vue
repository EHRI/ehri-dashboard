<template>
  <li>
    <div class="flex items-center">
      <h6 v-if="vocObject.attributes.descriptions[0].prefLabel" @click="changeVocID(vocObject.id)" :class="classes">{{vocObject.attributes.descriptions[0].prefLabel}}</h6>
    </div>
  </li>
  <hr class="my-2 text-ehri-light-grey">
</template>

<script>
import {toRef, computed} from "vue";

export default {
  name: "VocabularyItemCard",
  props: {
    vocObject: Object,
    selectedItem: String
  },
  emits: ["idChange"],
  setup(props, ctx){
    const vocObject = toRef(props, 'vocObject')
    const selected = toRef(props, 'selectedItem')

    const classes = computed(() => {
      return ['cursor-pointer font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1', vocObject.value.id === selected.value ? 'text-ehri-wine' : 'text-ehri-dark']
    });

    const changeVocID = (id)=> {
      ctx.emit('idChange', id)
    }

    return { vocObject, changeVocID, classes}
  }
}
</script>
