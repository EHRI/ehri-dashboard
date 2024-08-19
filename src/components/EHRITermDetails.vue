<template>
  <div class="flex flex-col h-fit h-max-full">
    <div v-if="descInLang && !loading" class="flex flex-col h-fit h-max-full">
      <div class="flex flex-col flex-1 h-fit h-max-full">
        <h5 v-if="descInLang" class="font-sans font-semibold text-ehri-wine line-clamp-1">{{descInLang.name}}</h5>
        <h6 v-if="otherNames.length"
            class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1">{{
          otherNames.join(', ')
        }}</h6>
        <div v-if="langs&&langs.length >1">
          <select @change="(e)=>changeLang(e.target.value)" class="font-sans text-xs p-1 font-light border border-[1.5px] border-ehri-dark w-full" size="1" :aria-label="'Choose Language'">
            <option selected disabled>{{ languageNames.of(descInLang.languageCode) }}</option>
            <option v-for="description in langs" :key="description" :value="description">{{languageNames.of(description)}}</option>
          </select>
        </div>
      </div>
      <div class="flex-1">
  <div class="flex mt-2">
      <button v-if="broaderInLang.length||narrowerInLang.length"
              :class="contextTabClasses"
              class="capitalize"
              @click="showDesc('hierarchy')">
        <span class="block mt-1 line-clamp-1">
          <span
                class="material-symbols-outlined w-6 h-6 align-top"
              >
                account_tree
          </span>
          {{$t(`termHierarchy`)}}
        </span>
      </button>
    </div>
    <div class="flex-1 h-56 max-h-56 mt-4 overflow-auto border-2 border-ehri-light-grey">
      <div v-if="clickedDesc === 'hierarchy'">
        <EHRITermHierarchyViz
            v-if="narrowerInLang.length||broaderInLang.length"
            :broader="broaderInLang" :narrower="narrowerInLang" :selected="descInLang"
        ></EHRITermHierarchyViz>
      </div>
    </div>
    <span v-if="clickedDesc === 'hierarchy'" class="text-ehri-dark text-xs font-sans">
      {{ $t('termHierarchyDesc') }}
    </span>
  </div>
      <div class="flex flex-col overflow-hidden items-start mt-auto">
        <span class="mt-2 text-sm font-medium text-ehri-dark block mb-2">
          <span
                class="mr-1 material-symbols-outlined w-5 h-5 text-ehri-dark align-top"
              >
              link
        </span> {{ $t('totalLinkedItemsPortal') }}: {{relatedItemsTotal}}</span>
        <span class="inline-block cursor-pointer border-2 text-ehri-wine font-semibold py-1 px-2 rounded border-ehri-wine hover:bg-ehri-wine hover:bg-opacity-10 " v-if="portalLink" >
      <a :href="portalLink" class="capitalize" target="_blank" rel="noopener">
        <span
                class="mx-1 material-symbols-outlined w-5 h-5 align-top"
              >
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
import { toRef, ref, watch, computed } from "vue";
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
    const ConceptID = toRef(props, "selectedVocConceptID");
    const ConceptDetails = ref();
    const languageNames = ref({});
    const descInLang = ref();
    const broaderInLang = ref();
    const narrowerInLang = ref();
    const otherNames = ref([]);
    const loading = ref(true);
    const langs = ref([]);

    const changeLang = (lang) => {
      loading.value = true;
      descInLang.value = ConceptDetails.value.find(d => d.languageCode === lang) ||
        ConceptDetails.value.find(d => d.languageCode === "eng") ||
        ConceptDetails.value[0];

      if (broader.value.length) {
        broaderInLang.value = broader.value.map(t => {
          return t.descriptions.find(d => d.languageCode === lang) ||
            t.descriptions.find(d => d.languageCode === "eng") ||
            t.descriptions[0];
        });
      }

      if (narrower.value.length) {
        narrowerInLang.value = narrower.value.map(t => {
          return t.descriptions.find(d => d.languageCode === lang) ||
            t.descriptions.find(d => d.languageCode === "eng") ||
            t.descriptions[0];
        });
      }

      loading.value = false;
    };

    const getLangNames = (locale) => {
      languageNames.value = new Intl.DisplayNames([locale], { type: "language" });
    };

    getLangNames(locale.value);

    const clickedDesc = ref("");

    const showDesc = (d) => {
      d === "map" ? clickedDesc.value = "map" : d === "hierarchy" ? clickedDesc.value = "hierarchy" : null;
    };

    const contextTabClasses = computed(() => {
      return ['px-1.5 pb-1 text-sm font-medium text-ehri-dark hover:text-ehri-wine', clickedDesc.value === 'hierarchy' ? 'text-ehri-wine' : 'text-ehri-dark'];
    });

    const portalLink = ref();
    const relatedItemsTotal = ref();

    const configData = () => {
      portalLink.value = `https://portal.ehri-project.eu//keywords//${ConceptID.value}`;
    };

    const termObject = ref();
    const narrower = ref();
    const broader = ref();

    const fetchData = () => {
      fetchCvocConceptInfo(ConceptID.value)
        .then((res) => {
          fetchRelatedItems(ConceptID.value).then((relatedRes) => {
            langs.value = [];
            broaderInLang.value = [];
            narrowerInLang.value = [];
            otherNames.value = [];
            termObject.value = {};
            ConceptDetails.value = [];
            termObject.value = res.data.CvocConcept;
            ConceptDetails.value = termObject.value.descriptions;
            ConceptDetails.value.forEach(l => langs.value.push(l.languageCode));

            descInLang.value = ConceptDetails.value.find(d => d.languageCode === locale.value) ||
              ConceptDetails.value.find(d => d.languageCode === "eng") ||
              ConceptDetails.value[0];

            if (descInLang.value.altLabel) {
              descInLang.value.altLabel.forEach(n => otherNames.value.push(n));
            }

            if (descInLang.value.hiddenLabel) {
              descInLang.value.hiddenLabel.forEach(n => otherNames.value.push(n));
            }

            relatedItemsTotal.value = relatedRes.meta.total;
            narrower.value = termObject.value.narrower;
            broader.value = termObject.value.broader;

            if (broader.value.length) {
              broaderInLang.value = broader.value.map(t => {
                return t.descriptions.find(d => d.languageCode === locale.value) ||
                  t.descriptions.find(d => d.languageCode === "eng") ||
                  t.descriptions[0];
              });
            }

            if (narrower.value.length) {
              narrowerInLang.value = narrower.value.map(t => {
                return t.descriptions.find(d => d.languageCode === locale.value) ||
                  t.descriptions.find(d => d.languageCode === "eng") ||
                  t.descriptions[0];
              });
            }

            clickedDesc.value = narrower.value.length || broader.value.length ? "hierarchy" : "";
            loading.value = false;
          });
        });
    };

    configData();
    fetchData();

    watch(ConceptID, () => {
      configData();
      loading.value = true;
      fetchData();
    });

    watch(() => locale.value, (newLocale) => {
      getLangNames(newLocale);
      fetchData();
    });

    return {
      narrowerInLang,
      broaderInLang,
      langs,
      relatedItemsTotal,
      portalLink,
      languageNames,
      changeLang,
      descInLang,
      otherNames,
      showDesc,
      contextTabClasses,
      clickedDesc,
      loading
    };
  }
};
</script>