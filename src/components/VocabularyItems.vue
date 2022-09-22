<template>
  <div class="row justify-content-center m-0">
    <div class="col-md-3 item-list">
      <h4 class="text-start mb-3">Select Item:</h4>
      <div class="items">
        <div v-if="items.length" v-for="item of items" :key="item.id" >
          <VocabularyItemCard
              v-if="item"
              :VocObjectName="item['attributes']['descriptions'][0]['prefLabel']"
              @click="changeVocConceptId(item)">
          </VocabularyItemCard>
        </div>
      </div>
      <EHRIPortalPagination
          v-if="pagination.total>1"
          class="justify-content-center pagination"
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
    </div>
    <div class="vr mb-3 d-none d-md-block"></div>
    <div class="col-md-8">
      <h4 class="text-start mb-3">Item Details:</h4>
      <VocabularyItemDetails
          :selected-voc-concept-i-d="selectedVocConceptId"
          :coordinates="selectedVocConceptCoordinates"
      ></VocabularyItemDetails>
    </div>
  </div>
</template>

<script>
import { ref, toRef, watch } from "vue";
import EHRIPortalPagination from "./EHRIPortalPagination.vue";
import VocabularyItemCard from "./VocabularyItemCard.vue";
import VocabularyItemDetails from "./VocabularyItemDetails.vue";

export default {
  name: "VocabularyItems",
  components: {VocabularyItemDetails, EHRIPortalPagination, VocabularyItemCard},
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
    const selectedVocConceptCoordinates = ref()

    const selectedVocConceptId = ref(items.value[0].id)

    items.value[0].attributes.geo && items.value[0].attributes.geo.coordinates?
        selectedVocConceptCoordinates.value = items.value[0].attributes.geo.coordinates:
        selectedVocConceptCoordinates.value=null

    const changeVocConceptId = (item)=> {
      selectedVocConceptId.value = item.id
      item.attributes.geo&&item.attributes.geo.coordinates?
          selectedVocConceptCoordinates.value = item.attributes.geo.coordinates:
          selectedVocConceptCoordinates.value=null
    }
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
      } else {
        temp_page.value = page.value
      }
      configPagination();
    })
    watch(items, () => {
      configPagination();
    });

    return { selectedVocConceptCoordinates, pagination,temp_page, items, selectedVocConceptId, changeVocConceptId };
  },
};
</script>

<style scoped>
.vr {
  border-radius: 10px;
  padding: 0.15em;
}
.item-list {
  height: 22em;
  position: relative;
}

.pagination {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0
}

</style>
