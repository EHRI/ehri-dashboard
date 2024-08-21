<template>
  <form class="max-w-md flex text-white" @submit.prevent="handleEnter">
    <div class="flex-1 relative">
      <span
        class="absolute h-5 pt-2 material-symbols-outlined pointer-events-none text-white left-0 ml-2"
      >
        search
      </span>
      <input
        class="pl-10 border border-white bg-white bg-opacity-20 py-2 w-full text-white placeholder:text-white font-light text-sm"
        type="text"
        v-model="query"
        autocomplete="off"
        @focus="onFocus"
        @keyup.enter="handleEnter"
        :placeholder="placeholderText"
      />
    </div>
    <button
      type="submit"
      class="ml-2 px-4 py-2 border border-1 border-white bg-white text-ehri-purple font-light text-sm capitalize hover:bg-ehri-purple hover:text-white"
    >
      {{ $t('search') }}
    </button>
  </form>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default {
  name: "SearchBox",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();

    const query = ref(route.params.query || ""); // Initialize query from route params
    const isFocused = ref(false);
    const placeholderText = computed(() => {
      return isFocused.value ? t('searchPlaceholder') : route.params.query || t('searchPlaceholder');
    });

    const onFocus = () => {
      isFocused.value = true;
    }

    const handleEnter = () => {
      router.push({ name: 'home', params: { query: query.value } }); // Update the route
    };

    // Watch for changes in the route parameter and update the query
    watch(() => route.params.query, (newQuery) => {
      if (newQuery !== query.value) {
        query.value = newQuery; // Update the query
      }
    });

    return { query, handleEnter, placeholderText, onFocus };
  },
};
</script>

<style scoped>
</style>