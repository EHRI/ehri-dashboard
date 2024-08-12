<template>
  <h5 class="mt-3 capitalize font-serif font-bold text-sm xl:text-ehri-dark">{{ filterName }}</h5>
  <select v-if="filterObject" @change="(e)=>onChange(e)" class="text-ehri-dark font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="filterName + ' Filter'">
    <option v-if="Object.keys(filterObject).length > 1" :value="filterName" :selected="!checkedVal">All</option>
    <option v-for="(c,i) in filterObject" :key="i" :value="i" :selected="checkedVal === i">{{
      i.length > 35? i.substring(0,35)+"...":i}} ({{c}})</option>
  </select>
</template>

<script>
import { toRef, ref } from "vue";

export default {
  name: "DigitalEditionsFilter",
  props: {
    filterName: String,
    filterObject: Object
  },
  emits: ["filterChange"]
  ,
  setup(props, ctx){
    const filterName = toRef(props, "filterName")
    const filterObject = toRef(props, "filterObject")
    const checkedVal = ref("")

    const onChange = (e) => {
      checkedVal.value = e.target.value
      ctx.emit("filterChange", checkedVal.value)
    }

    return {filterObject, filterName, onChange, checkedVal}
  }
}
</script>
