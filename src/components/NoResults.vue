<template>
<h3 class="font-sans text-ehri-dark font-thin text-3xl mt-4">No Results</h3>
  <div class="mt-3 font-sans text-ehri-dark text-sm">
      <p>Unfortunately, we couldn't find any items related to 
        <span class="bg-ehri-wine px-2 py-0.5 text-lg align-middle text-white">
        {{query}}
      </span>. <br />Please, try again.</p>
    </div>
</template>

<script>
import {toRef} from "vue"
export default {
  name: "NoResults",
  props: {
    searchTerm: String,
  },
  setup(props){
    const query = toRef(props, 'searchTerm')
    return {query}
  }
}
</script>

<style scoped>

</style>