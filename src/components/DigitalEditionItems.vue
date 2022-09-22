<template>
  <div class="row">
    <div class="col-12 ps-4">
      <span v-if="filtered" class="mb-2 badge filter edition-filter">Filter: {{ filterValue }}</span>
      <div v-for="item in filteredItems">
        <DigitalEditionItem :editionObject="item" :edition-string="edition"></DigitalEditionItem>
      </div>
    </div>
  </div>
</template>

<script>
import { toRef, ref, watch } from "vue";
import DigitalEditionItem from "./DigitalEditionItem.vue";

export default {
  name: "DigitalEditionItems",
  props: {
    editionItemsArray: Array,
    headlineString: String,
    edition: String
  },
  components: {DigitalEditionItem}
  ,
  setup(props) {
    const items = toRef(props, "editionItemsArray");
    const edition = toRef(props, "edition")

    const filterValue = ref("")
    const filteredItems = ref()
    const filtered = ref(false)

    filteredItems.value = items.value

    watch(items, ()=>{

      filteredItems.value = items.value
    })

    return { filteredItems, filtered, filterValue, edition };
  },
};
</script>

<style>
.edition-filter {
  background-color: #36FFD3;
}
</style>
