<template>
    <DashboardMain :query-value="queryValue" :id="queryValue"></DashboardMain>
</template>

<script>
  import DashboardMain from "../components/DashboardMain.vue";
  import {computed} from "vue";

  export default {
    name: "Dashboard",
    components: {DashboardMain },
    props: {
      query: {type: String, required: true}
    },
    setup(props){
      const queryValue = computed(()=>props.query)

      return { queryValue}
    }
  };
</script>

<style scoped>
</style>