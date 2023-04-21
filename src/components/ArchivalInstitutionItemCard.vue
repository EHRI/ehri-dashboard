<template>
  <li>
    <div class="flex items-center">
      <h6 v-if="repoObject.attributes.name" @click="changeRepoID(repoObject.id)" :class="classes">{{repoObject.attributes.name}}</h6>
    </div>
  </li>
  <hr class="my-2 text-ehri-light-grey">
</template>

<script>
import {toRef, computed } from "vue";

export default {
  name: "ArchivalInstitutionItemCard",
  props: {
    repoObject: Object,
    selectedItem: String
  },
  emits: ["idChange"],
  setup(props, ctx){
    const repoObject = toRef(props, 'repoObject')
    const selected = toRef(props, 'selectedItem')

    const changeRepoID = (id)=> {
      ctx.emit('idChange', id)
    }

    const classes = computed(() => {
      return ['cursor-pointer font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1', repoObject.value.id === selected.value ? 'text-ehri-wine' : 'text-ehri-dark']
    });


    return {repoObject, changeRepoID, classes}
  }
}
</script>
