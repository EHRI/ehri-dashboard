<template>
  <div class="row m-0">
    <h4 class="display-5 m-0 my-3">
      No Results
    </h4>
  </div>
  <div class="row g-0 mt-3 justify-content-center">
    <div class="col-6">
      <p>Unfortunately, we couldn't find any items related to <span
          style="
          color: #FFFFFF;
          background-color: #6C003B;
          padding: 2px 4px;
          font-size: 1.1em;
          border-radius: 5px;
">
        {{query}}
      </span>. <br />Please, try again.</p>
    </div>
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