<template>
  <li>
    <div class="flex items-center">
      <h6 v-if="AuthObject.attributes.name" @click="changeAuthID(AuthObject.id)" :class="classes">{{AuthObject.attributes.name}}</h6>
    </div>
  </li>
  <hr class="my-2 text-ehri-light-grey">
</template>

<script>
import {toRef, computed} from "vue";

export default {
  name: "AuthoritySetItemCard",
  props: {
    AuthObject: Object,
    selectedItem: String
  },
  emits: ["idChange"],
  setup(props, ctx){
    const AuthObject = toRef(props, 'AuthObject')
    const selected = toRef(props, 'selectedItem')

    const classes = computed(() => {
      return ['cursor-pointer font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1', AuthObject.value.id === selected.value ? 'text-ehri-wine' : 'text-ehri-dark']
    });

    const changeAuthID = (id)=> {
      console.log("clicked" +id)
      ctx.emit('idChange', id)
    }



    return {AuthObject, changeAuthID, classes}
  }
}
</script>

<style scoped>



</style>