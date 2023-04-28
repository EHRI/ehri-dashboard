<template>
  <h5 class="mt-3 uppercase font-serif font-bold text-sm xl:text-ehri-dark">{{ filterName }}</h5>
  <select v-if="filterArray" @change="(e)=>onChange(e)" class="text-ehri-dark font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="filterName + ' Filter'">
    <option v-for="(c,i) in filterArray" :key="i" :value="c[1].id" :selected="selectedType === c[1].id">{{ c[1].title.length > 35? c[1].title.substring(0,35)+"...":c[1].title}} ({{c[1].value}})</option>
  </select>
</template>

<script>
import { toRef } from "vue";

export default {
  name: "EHRIPortalTypeFilter",
  props: {
    filterName: String,
    filterArray: Array,
    selectedType: String
  },
  emits: ["filterChange"]
  ,
  setup(props, ctx){
    const filterName = toRef(props, "filterName")
    const filterArray = toRef(props, "filterArray")
    const selectedType = toRef(props, "selectedType")

    const onChange = (e) => {
      ctx.emit("filterChange", e.target.value)
    }

    return {filterArray, filterName, onChange, selectedType}
  }
}
</script>

<style scoped>

</style>
