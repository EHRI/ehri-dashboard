<template>
  <div class="mb-2">
    <h4 class="capitalize font-serif font-bold xl:text-ehri-dark">{{ translatedFilterName }}</h4>
    <select 
      v-if="filterArray" 
      @change="onChange" 
      class="text-ehri-dark font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-purple w-full" 
      size="1" 
      :aria-label="translatedFilterName + ' Selector'"
    >
      <option 
        v-for="(c,i) in filterArray" 
        :key="i" 
        :value="c[1].id" 
        :selected="selectedType === c[1].id"
      >
        {{ translatedTypeName(c[1].id).length > 35 ? translatedTypeName(c[1].id).substring(0,35) + "..." : translatedTypeName(c[1].id) }} ({{c[1].value}})
      </option>
    </select>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortalResourceStore } from "../stores/portalResourceStore";

export default {
  name: "EHRIPortalTypeFilter",
  emits: ["filterChange"],
  setup() {
    const { t } = useI18n();
    const store = usePortalResourceStore();
    const filterName = ref('itemType');
    const filterArray = computed(() => store.sortedTypes.filter(([, value]) => value.value > 0));
    const selectedType = computed(() => store.selectedType);

    const onChange = (e) => {
      store.setSelectedType(e.target.value);
    };

    const translatedFilterName = computed(() =>
      t(`filterNames.${filterName.value}`)
    );

    const translatedTypeName = (id) => t(`portalTypes.${id}`, 2);

    return {
      filterArray,
      translatedTypeName,
      filterName,
      onChange,
      selectedType,
      translatedFilterName,
    };
  }
};
</script>

<style scoped>
</style>