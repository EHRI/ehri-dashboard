<template>
    <li>
    <div class="flex items-center">
      <h6 v-if="countryObject.attributes.name" @click="changeCountryID(countryObject.id)" :class="classes">{{getLocalizedCountryName(countryObject.attributes.identifier.toUpperCase())}}</h6>
    </div>
  </li>
  <hr class="my-2 text-ehri-light-grey">
</template>

<script>
import {toRef, computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "CountryReportItemCard",
  props: {
    countryObject: Object,
    selectedItem: String
  },
  emits: ["idChange"],
  setup(props, ctx){
    const {t, locale} = useI18n()
    const countryObject = toRef(props, 'countryObject')
    const selected = toRef(props, 'selectedItem')

    const changeCountryID = (id)=> {
      ctx.emit('idChange', id)
    }

    const classes = computed(() => {
      return ['cursor-pointer font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1', countryObject.value.id === selected.value ? 'text-ehri-wine' : 'text-ehri-dark']
    });

    const getLocalizedCountryName = (iso2Code) => {
      const displayNames = new Intl.DisplayNames([locale.value], { type: "region" });
      return displayNames.of(iso2Code);
    };


    return {countryObject, changeCountryID, classes, getLocalizedCountryName}
  }
}
</script>

<style scoped>

.doc-item-card {
  background-color: rgba(0,0,0,0)!important;
  border: none;
  cursor: pointer;
}

.doc-item-card a {
  text-decoration: none;
  color: inherit;
}

.doc-item-card a:hover {
  text-decoration: underline;
}
</style>