<template>
  <h5 class="mt-3 uppercase font-serif font-bold text-sm xl:text-ehri-dark">{{ filterName }}</h5>
  <select v-if="nonNullCategories" @change="(e)=>onChange(e)" class="text-ehri-dark font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="filterName + ' Filter'">
    <option v-if="nonNullCategories.length > 1" :value="filterName" :selected="!checkedVal">All</option>
    <option v-for="c in nonNullCategories" :key="c.id" :value="c.id" :selected="checkedVal === c.id">{{
      c.name.length > 35? c.name.substring(0,35)+"...":c.name}} ({{c.searchTermCount}})</option>
  </select>
</template>

<script>
import { toRef, ref, onMounted, watch } from "vue";

export default {
  name: "DocumentBlogFilter",
  props: {
    filterName: String,
    filterArray: Array
  },
  emits: ["filterChange"]
  ,
  setup(props, ctx){
    const filterName = toRef(props, "filterName")
    const filterArray = toRef(props, "filterArray")
    const checkedVal = ref()

    const nonNullCategories = ref()

    onMounted(()=>{
      nonNullCategories.value = filterArray.value.filter(c => {
    return c.searchTermCount > 0
    })

    nonNullCategories.value?nonNullCategories.value.sort((a, b) => {
      return b.searchTermCount - a.searchTermCount;
    }):null

    })


    const onChange = (e) => {
      checkedVal.value = e.target.value
      ctx.emit("filterChange", checkedVal.value)
    }

    return {nonNullCategories, filterName, onChange, checkedVal}
  }
}
</script>

