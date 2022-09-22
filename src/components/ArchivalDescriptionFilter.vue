<template>
  <h5>{{ filterName }}</h5>
  <select v-if="filterObject" @change="(e)=>onChange(e)" class="overflow-scroll form-select form-select-sm mb-3" size="5" aria-label="size 5 select">
    <option :value="filterName">All {{filterName}}</option>
    <option v-for="(c,i) in filterObject" :key="i" :value="c.value" >{{
      c.name.length > 35? c.name.substring(0,35)+"...":c.name}} ({{c.count}})</option>
  </select>
</template>

<script>
import { toRef, ref } from "vue";

export default {
  name: "ArchivalDescriptionFilter",
  props: {
    filterName: String,
    filterObject: Object
  },
  emits: ["filterChange"]
  ,
  setup(props, ctx){
    const filterName = toRef(props, "filterName")
    const filterObject = toRef(props, "filterObject")
    const checkedVal = ref()

    const onChange = (e) => {
      checkedVal.value = e.target.value
      ctx.emit("filterChange", checkedVal.value)
    }

    return {filterObject, filterName, onChange}
  }
}
</script>

<style scoped>

</style>