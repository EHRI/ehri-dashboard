<template>
  <form class="max-w-md flex text-white" @submit.prevent>
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
        @keyup.enter="redirect"
        :placeholder="placeholderText"
      />
    </div>
  </form>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {useI18n} from "vue-i18n";

export default {
  name: "SearchBox",
  emits: ["queryChange"],
  setup(props, ctx) {
    const router = useRouter();
    const route = useRoute();

    const routeQuery = computed(() => route.params.query);

    const query = ref("");

    const isFocused = ref(false)

    const { t, locale, availableLocales } = useI18n();

    const placeholderText = computed(() => {
      if (isFocused.value) {
          return t('searchPlaceholder')
      } else {
          if (routeQuery.value) {
              return routeQuery.value
          } else {
              return t('searchPlaceholder')
          }
      }
  })

  const onFocus = () => {
    isFocused.value = true
  }

  const redirect = () => {
    ctx.emit("queryChange", query.value);
  };


    return { query, redirect, routeQuery, placeholderText, onFocus };
  },
};
</script>
