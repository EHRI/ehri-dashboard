<template>
  <h5>{{ filterName }}</h5>
  <select v-if="nonNullCategories" @change="(e)=>onChange(e)" class="overflow-scroll form-select form-select-sm mb-3" size="10" aria-label="size 10 select">
    <option :value="filterName">All {{filterName}}</option>
    <option v-for="c in nonNullCategories" :key="c.id" :value="c.id" >{{
      c.name.length > 35? c.name.substring(0,35)+"...":c.name}} ({{c.searchTermCount}})</option>
  </select>
</template>

<script>
import { toRef, ref } from "vue";

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

    nonNullCategories.value = filterArray.value.filter(c => {
      return c.searchTermCount
    })

    nonNullCategories.value.sort((a, b) => {
      return b.searchTermCount - a.searchTermCount;
    });

    const onChange = (e) => {
      checkedVal.value = e.target.value
      ctx.emit("filterChange", checkedVal.value)
    }

    return {nonNullCategories, filterName, onChange }
  }
}
</script>

<style scoped>
select {
  width: 85%;
}
</style>