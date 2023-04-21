<template>
  <h5 class="mt-3 uppercase font-serif font-bold text-sm lg:text-ehri-dark">{{ filterName }}</h5>
  <select :key="itemKey" v-if="nonNullCategories" @change="(e)=>onChange(e)" class="text-ehri-dark font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="filterName + ' Filter'">
    <option v-if="nonNullCategories.length > 1" :value="filterName" :selected="!checkedVal">All {{filterName}}</option>
    <option v-for="(c,i) in nonNullCategories" :key="i" :value="c.value" :selected="checkedVal === c.value">{{ c.name.length > 25? c.name.substring(0,25)+'...':c.name }} ({{c.count}})</option>
  </select>
</template>

<script>
import { toRef, ref } from "vue";

export default {
  name: "ArchivalDescriptionFilter",
  props: {
    filterName: String,
    filterArray: Array
  },
  emits: ["filterChange"]
  ,
  setup(props, ctx){
    const filterName = toRef(props, "filterName")
    const filterArray = toRef(props, "filterArray")
    const checkedVal = ref("")
    const itemKey = ref(0)

    const onChange = (e) => {
      checkedVal.value = e.target.value
      ctx.emit("filterChange", checkedVal.value)
      itemKey.value++
    }

    const nonNullCategories = ref()

    nonNullCategories.value = filterArray.value.filter(c => {
    return c.count > 0
    })

    nonNullCategories.value?nonNullCategories.value.sort((a, b) => {
      return b.count - a.count;
    }):null

    return {filterArray, itemKey, nonNullCategories, filterName, onChange, checkedVal}
  }
}
</script>

<style scoped>

</style>