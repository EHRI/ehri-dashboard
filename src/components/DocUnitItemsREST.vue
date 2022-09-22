<template>
  <div v-for="item of items" :key="item.id">
    <DocUnitItemCardREST :doc-unit-object="item"></DocUnitItemCardREST>
  </div>
  <EHRIPortalPagination
      v-if="pagination.total>1"
      class="justify-content-center"
      :pagination-object="pagination"
      :current-page="temp_page"
      @prev="()=>{
        --temp_page
      }"
      @next="()=>{
        temp_page++
      }"
  >
  </EHRIPortalPagination>
</template>

<script>
import { ref, toRef, watch } from "vue";
import DocUnitItemCardREST from "./DocUnitItemCardREST.vue";
import EHRIPortalPagination from "./EHRIPortalPagination.vue";

export default {
  name: "DocUnitItemsREST",
  components: {EHRIPortalPagination,DocUnitItemCardREST },
  props: {
    itemsToDisplay: Array,
    totalPages: Number,
    totalItems: Number,
    pageNumber: Number
  },
  emits: ["pageChange"],
  setup(props, ctx) {
    const items = toRef(props, "itemsToDisplay");
    const page = toRef(props, "pageNumber")
    const temp_page = ref(1)
    const pagination = ref({
      totalPages: null,
      total: null,
      prevPage: null,
      nextPage: null,
    });
    const emitPageChange = (n) => {
      ctx.emit("pageChange", n);
    };

    // Pagination configuration largely inspired by: https://gist.github.com/itzikbenh/90918f44b3f871d206e6f5dddaabcc49
    const configPagination = () => {
      pagination.value["totalPages"] = toRef(props,"totalPages");
      pagination.value["total"] =  toRef(props,"totalItems");
      pagination.value["prevPage"] = temp_page.value > 1 ? temp_page.value : ""
      pagination.value["nextPage"] = temp_page.value < pagination.value.totalPages ? temp_page.value + 1 : "";
    };

    configPagination();

    watch(temp_page, ()=>{
      emitPageChange(temp_page.value)
      configPagination();
    })
    watch(page, ()=>{
      if(page.value === 1){
        temp_page.value = 1
      }
      configPagination();
    })
    watch(items, () => {
      configPagination();
    });

    return { pagination,temp_page, items };
  },
};
</script>

<style scoped></style>
