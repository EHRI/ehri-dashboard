<template>
  <div class="flex flex-col h-screen xl:3/4 overflow-hidden">
      <ul v-if="items.length > 0" ref="el" class="h-4/6 sm:h-5/6 xl:h-3/6 overflow-y-auto overscroll-auto px-4">
        <DocUnitItemCardREST v-for="item of items" :key="item.id" :doc-unit-object="item"></DocUnitItemCardREST>
        <li v-if="loading" class="w-full flex justify-center items-center py-2">
          <LoadingComponent></LoadingComponent>
        </li>
      </ul>
      <LoadingComponent v-else class="h-full w-full flex justify-center items-center"></LoadingComponent>
  </div>
</template>

<script>
import { ref, toRef, onMounted,} from "vue";
import DocUnitItemCardREST from "./DocUnitItemCardREST.vue";
import { useInfiniteScroll } from '@vueuse/core'
import { fetchFacetedDocUnits, } from "../services/EHRIGetters";
import LoadingComponent from "./LoadingComponent.vue";

export default {
  name: "DocUnitItemsREST",
  components: { DocUnitItemCardREST, LoadingComponent },
  props: {
    searchTerm: String,
    holder: String,
    country: String,
    language: String,
    dates: String,
    total: Number,
  },
  setup(props) {
    const items = ref([]);
    const docUnitQuery = toRef(props, "searchTerm");
    const holderFilter = toRef(props, "holder");
    const countryFilter = toRef(props, "country");
    const langFilter = toRef(props, "language");
    const dateFilter = toRef(props, "dates");
    const totalItems = toRef(props, "total")
    const page = ref(1);
    const el = ref(null);
    const filters = ref(new Object());
    const loading = ref(false);

    holderFilter.value ? (filters.value["holder"] = encodeURIComponent(holderFilter.value)) : null;
    countryFilter.value ? (filters.value["country"] = countryFilter.value) : null;
    langFilter.value ? (filters.value["lang"] = langFilter.value) : null;
    dateFilter.value ? (filters.value["dates"] = dateFilter.value) : null;

    const getUnitsOnScroll = async () => {
      loading.value = true;
      const newUnits = await fetchFacetedDocUnits(docUnitQuery.value, page.value, filters.value, 10);
      items.value.push(...newUnits.data.data);
      if (items.value.length < totalItems.value){
        page.value++;
      }
      loading.value = false;
    };
    useInfiniteScroll(
      el,
      async () => {
        if (items.value.length < totalItems.value){
          await getUnitsOnScroll();
        }
      },
      { distance: 300 }
    );

    onMounted(() => {
      getUnitsOnScroll();
    });

    return { items, el, loading };
  },
};
</script>

