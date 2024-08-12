<template>
<h3 class="font-sans capitalize text-ehri-dark font-thin text-3xl mt-4">{{ $t('noResults') }}</h3>
  <div class="mt-3 font-sans text-ehri-dark text-sm">
      <p>{{ $t('noItems') + " " }}
        <span class="bg-ehri-wine px-2 py-0.5 text-lg align-middle text-white">
        {{query}}
      </span>. <br />{{ $t('tryAgain') }}</p>
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