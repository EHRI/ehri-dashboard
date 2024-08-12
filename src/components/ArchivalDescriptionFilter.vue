<template>
  <h5 class="mt-1 capitalize font-serif font-bold text-sm xl:text-ehri-dark">{{ translatedFilterName }}</h5>
  <select
    :key="itemKey"
    v-if="nonNullCategories"
    @change="onChange"
    class="capitalize text-ehri-dark font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full"
    size="1"
    :aria-label="translatedFilterName + ' Filter'"
  >
    <option v-if="nonNullCategories.length > 0" :value="filterName" :selected="!checkedVal">
      {{ translatedFilterName }} ({{ nonNullCategories.length }})
    </option>
    <option
      v-for="(c, i) in nonNullCategories"
      :key="i"
      :value="c.value"
      :selected="checkedVal === c.value"
    >
      {{ c.name.length > 25 ? c.name.substring(0, 25) + '...' : c.name }} ({{ c.count }})
    </option>
  </select>
</template>

<script>
import { toRef, ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ArchivalDescriptionFilter',
  props: {
    filterName: String,
    filterArray: Array,
  },
  emits: ['filterChange'],
  setup(props, ctx) {
    const { t, locale } = useI18n();
    const filterName = toRef(props, 'filterName');
    const filterArray = toRef(props, 'filterArray');
    const checkedVal = ref('');
    const itemKey = ref(0);

    const onChange = (e) => {
      checkedVal.value = e.target.value;
      ctx.emit('filterChange', checkedVal.value);
      itemKey.value++;
    };

    const getLocalizedCountryName = (iso2Code) => {
      const displayNames = new Intl.DisplayNames([locale.value], { type: "region" });
      return displayNames.of(iso2Code);
    };

    const getLocalizedLangName = (iso3Code) => {
      if (iso3Code === "mul") {
        return t('multipleLanguages');
      }
      const displayNames = new Intl.DisplayNames([locale.value], { type: "language" });
      return displayNames.of(iso3Code);
    };

    const getLocalizedDateName = (date) => {
      if (date === "Before 1913") {
        return t('before1913');
      }
      else if (date === "After 1946") {
        return t('after1946');
      }
      else {
        return date
      }
    };

    const updateNonNullCategories = () => {
      nonNullCategories.value = filterArray.value
        .filter((c) => c.count > 0)
        .map((c) => {
          if (filterName.value === 'countries') {
            return {
              ...c,
              name: getLocalizedCountryName(c.value.toUpperCase())
            };
          } else if (filterName.value === 'languages') {
            return {
              ...c,
              name: getLocalizedLangName(c.value)
            };
          } else if (filterName.value === 'dates') {
            return {
              ...c,
              name: getLocalizedDateName(c.name)
            }
          }
          else {
            return c;
          }
        });

      if (filterName.value === 'dates') {
        nonNullCategories.value.sort((a, b) => a.value - b.value);
      } else {
        nonNullCategories.value.sort((a, b) => b.count - a.count);
      }
    };

    const nonNullCategories = ref([]);
    updateNonNullCategories();

    const translatedFilterName = computed(() =>
      t(`filterNames.${filterName.value}`)
    );

    watch(() => locale.value, () => {
      updateNonNullCategories();
      itemKey.value++;
    });

    return {
      getLocalizedDateName,
      getLocalizedCountryName,
      getLocalizedLangName,
      filterArray,
      itemKey,
      nonNullCategories,
      filterName,
      onChange,
      checkedVal,
      translatedFilterName,
    };
  },
};
</script>
