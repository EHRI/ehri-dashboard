<template>
  <div class="bg-ehri-purple z-10 sm:z-0">
    <div class="flex flex-row place-content-between items-center">
      <img :src="logo" class="h-16 pl-2 sm:hidden cursor-pointer" alt="EHRI logo" @click="handle"/>
      <h1 class="flex mx-0 items-center mt-2 sm:hidden text-white font-serif font-bold text-center text-xl cursor-pointer" @click="handle">{{$t('title').toUpperCase()}}</h1>
      <span @click="toggleSidebar" class="sm:hidden mr-2 text-white cursor-pointer">
        <span class="material-symbols-outlined pointer-events-none align-bottom">
          search
        </span>
      </span>
    </div>
    <div class="flex-grow-0 px-6 flex-shrink-0 shadow-xl sm:hidden overflow-hidden">
      <div :class="sidebarClass">
        <div class="sm:hidden bg-ehri-purple mt-2 pb-3">
          <p class="break font-sans font-light text-base text-justify text-pretty text-white mx-auto py-2">
            {{ $t("description") }}
          </p>
          <SearchBox></SearchBox>
          <h5 class="font-sans text-white font-semibold mt-5">{{$t("sources")}}</h5>
          <LoadResources class="sm:hidden"></LoadResources>
          <div class="flex justify-center items-center mt-4">
            <select v-model="$i18n.locale" class="bg-ehri-light-grey text-ehri-purple">
              <option v-for="locale in availableLocales" :key="locale" :value="locale">{{ languageNames.of(locale) }}</option>
            </select>
            <span class="ml-2 material-symbols-outlined text-white cursor-pointer" @click="changeLang">
              language
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden px-6 sm:block sm:min-h-screen sm:h-full sm:overflow-hidden sm:bg-ehri-purple">
      <div class="text-center">
        <img :src="logo" class="h-24 mt-2 mx-auto cursor-pointer" alt="EHRI logo" @click="handle"/>
        <h1 class="mt-2 text-white font-serif font-bold text-center text-xl">{{ $t('title').toUpperCase() }}</h1>
        <p class="break font-sans font-light text-base text-justify text-pretty text-white mx-auto mb-5">
          {{ $t("description") }}
        </p>
      </div>

      <div class="pt-4">
        <SearchBox></SearchBox>
        <h5 class="font-sans text-white font-semibold mt-5">{{ $t("sources") }}</h5>
        <LoadResources class="hidden sm:block">
        </LoadResources>
        <div class="flex justify-center items-center mt-4">
          <span class="mr-2 material-symbols-outlined text-white">
            language
          </span>
          <select v-model="$i18n.locale" class="bg-ehri-light-grey text-ehri-purple">
            <option v-for="locale in availableLocales" :key="locale" :value="locale">{{ languageNames.of(locale) }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import logo from "@/assets/ehri_logo.png"
import SearchBox from "@/components/SearchBox.vue"
import LoadResources from "./LoadResources.vue";
import { useMainStore } from "../stores/mainStore";
import {useI18n} from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "MainSidebar",
  components: { SearchBox, LoadResources },
  setup(){
    const key = ref(1);
    const showSidebar = ref(false);
    const { t, locale, availableLocales } = useI18n();
    const router = useRouter();
    const languageNames = ref({})
    const store = useMainStore();

    const getLangNames = (locale) => {
      languageNames.value = new Intl.DisplayNames([locale], { type: "language" });
    }

    getLangNames(locale.value)

    const handle = () => {
      router.push({ name: 'home', params: { query: "" } }); // Update the route
    };


    const sidebarClass = computed(() => {
      return showSidebar.value
          ? "sm:hidden w-full m-0 p-0 bg-ehri-purple md:w-auto md:block transition-all ease-in-out duration-00"
          : "sm:hidden w-full h-0 transition-all ease-in-out duration-800";
    });

    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };

    watch(
        () => locale.value,
        (newLocale) => {
          getLangNames(newLocale)
        }
    );

    return {
      languageNames,
      availableLocales,
      showSidebar,
      sidebarClass,
      toggleSidebar,
      logo,
      handle,
      key}
  }
}
</script>

<style scoped>
</style>