<template>
  <li>
    <div class="flex items-center">
      <h6 v-if="prefLabel" @click="changeVocID(vocObject.id)" :class="classes">{{prefLabel}}</h6>
    </div>
  </li>
  <hr class="my-2 text-ehri-light-grey">
</template>

<script>
import {toRef, computed} from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "VocabularyItemCard",
  props: {
    vocObject: Object,
    selectedItem: String
  },
  emits: ["idChange"],
  setup(props, ctx){
    const { t, locale } = useI18n();
    const vocObject = toRef(props, 'vocObject')
    const selected = toRef(props, 'selectedItem')

    const classes = computed(() => {
      return ['cursor-pointer font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1', vocObject.value.id === selected.value ? 'text-ehri-wine' : 'text-ehri-dark']
    });

    const prefLabel = computed(() => {
      const descriptions = vocObject.value.attributes.descriptions;
      const localeDescription = descriptions.find(desc => desc.languageTag === locale.value);
      if (localeDescription) {
        return localeDescription.prefLabel;
      }
      const englishDescription = descriptions.find(desc => desc.languageCode === 'eng');
      if (englishDescription) {
        return englishDescription.prefLabel;
      }
      return descriptions[0].prefLabel;
    });

    const changeVocID = (id)=> {
      ctx.emit('idChange', id)
    }

    return { vocObject, changeVocID, classes, prefLabel}
  }
}
</script>
