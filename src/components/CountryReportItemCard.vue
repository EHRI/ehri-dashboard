<template>
  <div class="card doc-item-card">
    <div class="card-body p-0 mb-1">
      <h6 v-if="countryObject.attributes.name" class="card-title mb-0 text-truncate">{{countryObject.attributes.name}}</h6>
    </div>
    <hr class="my-2">
  </div>
</template>

<script>
import {toRef } from "vue";

export default {
  name: "CountryReportItemCard",
  props: {
    countryObject: Object
  },
  setup(props){
    const countryObject = toRef(props, 'countryObject')

    return {countryObject}
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