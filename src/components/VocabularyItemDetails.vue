<template>
  <div class="flex flex-col h-full h-max-full">
    <div v-if="descInLang && !loading" class="flex flex-col">
      <div class="flex flex-col">
        <h5 v-if="descInLang" class="font-sans font-semibold text-ehri-wine line-clamp-1">{{descInLang.name}}</h5>
        <h6 v-if="otherNames.length"
            class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1">{{
          otherNames.join(', ')
        }}</h6>
        <div v-if="langs && langs.length > 1">
          <select @change="(e) => changeLang(e.target.value)" class="font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="'Choose Language'">
            <option selected disabled>{{ languageNames.of(descInLang.languageCode) }}</option>
            <option v-for="description in langs" :key="description" :value="description">{{ languageNames.of(description) }}</option>
          </select>
        </div>
      </div>
      <VocabularyItemDetailsViz class="h-72" v-if="(vocObject.broader.length || vocObject.narrower.length) || (lat && long)"
                  :voc-object="vocObject" :long="long" :lat="lat" :lang="descInLang.languageCode">
      </VocabularyItemDetailsViz>
      <div class="flex flex-col flex-1 w-fit">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top">
            link
          </span>{{ $t('totalLinkedItemsPortal') }}: {{ relatedItemsTotal }}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10" v-if="portalLink">
          <a :href="portalLink" class="capitalize" target="_blank" rel="noopener">
            <span class="mx-1 material-symbols-outlined w-5 h-5 align-top">
              database
            </span>
            {{ $t('goToEHRIPortal') }}
          </a>
        </span>
      </div>
    </div>
    <LoadingComponent v-else></LoadingComponent>
  </div>
</template>

<script>
import { toRef, ref, watch } from "vue";
import { fetchCvocConceptInfo, fetchRelatedItems } from "../services/EHRIGetters.js";
import LoadingComponent from "./LoadingComponent.vue";
import VocabularyItemDetailsViz from "./VocabularyItemDetailsViz.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "VocabularyItemDetails",
  components: { VocabularyItemDetailsViz, LoadingComponent },
  props: {
    selectedVocConceptID: String,
  },
  setup(props) {
    const { t, locale } = useI18n();
    const conceptID = toRef(props, "selectedVocConceptID");
    const languageNames = ref({});
    const descInLang = ref();
    const otherNames = ref([]);
    const portalLink = ref();
    const relatedItemsTotal = ref();
    const vocObject = ref();
    const langs = ref([]);
    const long = ref();
    const lat = ref();
    const loading = ref(true);

    const loadConceptInfo = async () => {
      loading.value = true;
      try {
        const res = await fetchCvocConceptInfo(conceptID.value, locale.value);
        const relatedRes = await fetchRelatedItems(conceptID.value);

        if (res.data && res.data.CvocConcept) {
          vocObject.value = res.data.CvocConcept;
          lat.value = vocObject.value.latitude;
          long.value = vocObject.value.longitude;
          descInLang.value = vocObject.value.description;

          langs.value = vocObject.value.allDescriptions ? 
            vocObject.value.allDescriptions.map(d => d.languageCode) : 
            [];

          // Fallback logic
          if (!descInLang.value) {
            descInLang.value = vocObject.value.allDescriptions.find(d => d.languageCode === 'eng') || vocObject.value.allDescriptions[0];
          }

          updateOtherNames();
          relatedItemsTotal.value = relatedRes.meta ? relatedRes.meta.total : 0;
        } else {
          console.error('Invalid response structure:', res);
        }
      } catch (error) {
        console.error("Error loading concept info:", error);
      } finally {
        loading.value = false;
      }
    };

    const updateOtherNames = () => {
      otherNames.value = [];
      if (descInLang.value) {
        if (descInLang.value.altLabel && Array.isArray(descInLang.value.altLabel)) {
          descInLang.value.altLabel.forEach(n => otherNames.value.push(n));
        }
        if (descInLang.value.hiddenLabel && Array.isArray(descInLang.value.hiddenLabel)) {
          descInLang.value.hiddenLabel.forEach(n => otherNames.value.push(n));
        }
      }
    };

    const changeLang = async (lang) => {
      loading.value = true;
      try {
        const description = vocObject.value.allDescriptions.find(d => d.languageCode === lang);
        if (description) {
          descInLang.value = description;
          updateOtherNames();
        }
      } catch (error) {
        console.error("Error changing language:", error);
      } finally {
        loading.value = false;
      }
    };

    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu/keywords/${conceptID.value}`;
    };

    const getLangNames = (locale) => {
      languageNames.value = new Intl.DisplayNames([locale], { type: "language" });
    };

    getLangNames(locale.value);
    configData();
    loadConceptInfo();

    watch([conceptID], () => {
      configData();
      loadConceptInfo();
    });

    watch(
      () => locale.value,
      (newLocale) => {
        getLangNames(newLocale);
        loadConceptInfo();
      }
    );

    return {
      langs,
      long,
      loading,
      lat,
      vocObject,
      relatedItemsTotal,
      portalLink,
      languageNames,
      changeLang,
      descInLang,
      otherNames,
    };
  },
};
</script>

<style>
svg {
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>


