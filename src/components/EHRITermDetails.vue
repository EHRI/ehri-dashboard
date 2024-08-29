<template>
  <div class="flex flex-col h-fit h-max-full">
    <div v-if="descInLang && !loading" class="flex flex-col h-fit h-max-full">
      <div class="flex flex-col flex-1 h-fit h-max-full">
        <h5 v-if="descInLang" class="font-sans font-semibold text-ehri-wine line-clamp-1">{{descInLang.name}}</h5>
        <h6 v-if="otherNames.length"
            class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1">{{
          otherNames.join(', ')
        }}</h6>
        <div v-if="langs && langs.length > 1">
          <select @change="(e) => changeLang(e.target.value)" class="font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="'Choose Language'">
            <option selected disabled>{{ getLanguageName(descInLang.languageCode) }}</option>
            <option v-for="description in langs" :key="description.languageCode" :value="description.languageCode">{{ getLanguageName(description.languageCode) }}</option>
          </select>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex mt-2">
          <button v-if="broaderInLang.length || narrowerInLang.length"
                  class="capitalize">
            <span class="block mt-1 line-clamp-1">
              <span class="material-symbols-outlined w-6 h-6 align-top">
                account_tree
              </span>
              {{$t(`termHierarchy`)}}
            </span>
          </button>
        </div>
        <div class="flex-1 h-56 max-h-56 mt-4 overflow-auto border-2 border-ehri-light-grey">
          <EHRITermHierarchyViz
              v-if="narrowerInLang.length || broaderInLang.length"
              :broader="broaderInLang" :narrower="narrowerInLang" :selected="descInLang"
          ></EHRITermHierarchyViz>
        </div>
        <span class="text-ehri-dark text-xs font-sans">
          {{ $t('termHierarchyDesc') }}
        </span>
      </div>
      <div class="flex flex-col overflow-hidden items-start mt-auto">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top">
            link
          </span> {{ $t('totalLinkedItemsPortal') }}: {{relatedItemsTotal}}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10 " v-if="portalLink" >
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
import EHRITermHierarchyViz from "./EHRITermHierarchyViz.vue";
import LoadingComponent from "./LoadingComponent.vue";
import { useI18n } from "vue-i18n";

export default {
  name: "EHRITermDetails",
  components: { EHRITermHierarchyViz, LoadingComponent },
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
    const broaderInLang = ref([]);
    const narrowerInLang = ref([]);
    const loading = ref(true);

    const loadConceptInfo = async () => {
      loading.value = true;
      try {
        const res = await fetchCvocConceptInfo(conceptID.value, locale.value);
        const relatedRes = await fetchRelatedItems(conceptID.value);

        if (res.data && res.data.CvocConcept) {
          vocObject.value = res.data.CvocConcept;
          descInLang.value = vocObject.value.description;

          langs.value = vocObject.value.allDescriptions ? 
            vocObject.value.allDescriptions : 
            [];

          // Fallback logic
          if (!descInLang.value) {
            descInLang.value = vocObject.value.allDescriptions.find(d => d.languageCode === 'eng') || vocObject.value.allDescriptions[0];
          }

          updateOtherNames();
          updateBroaderNarrower();
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

    const updateBroaderNarrower = () => {
      broaderInLang.value = vocObject.value.broader.map(t => {
        return t.descriptions.find(d => d.languageCode === descInLang.value.languageCode) ||
          t.descriptions.find(d => d.languageCode === "eng") ||
          t.descriptions[0];
      });

      narrowerInLang.value = vocObject.value.narrower.map(t => {
        return t.descriptions.find(d => d.languageCode === descInLang.value.languageCode) ||
          t.descriptions.find(d => d.languageCode === "eng") ||
          t.descriptions[0];
      });
    };

    const changeLang = async (lang) => {
      loading.value = true;
      try {
        const description = vocObject.value.allDescriptions.find(d => d.languageCode === lang);
        if (description) {
          descInLang.value = description;
          updateOtherNames();
          updateBroaderNarrower();
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
      try {
        languageNames.value = new Intl.DisplayNames([locale], { type: "language" });
      } catch (error) {
        console.error("Error setting language names:", error);
      }
    };

    const getLanguageName = (code) => {
      try {
        return languageNames.value.of(code);
      } catch (error) {
        console.error("Invalid language code:", code);
        return code;
      }
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
      loading,
      broaderInLang,
      narrowerInLang,
      relatedItemsTotal,
      portalLink,
      languageNames,
      changeLang,
      descInLang,
      otherNames,
      getLanguageName,
    };
  },
};
</script>