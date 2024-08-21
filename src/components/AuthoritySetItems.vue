<template>
  <div v-if="total" class="grid grid-cols-12 xl:grid-cols-8 gap-2 xl:gap-4 h-screen max-w-full overflow-hidden">
    <!-- SMALL SCREEN UI -->
    <div v-if="!isLargeScreen && !expandFocusedItem" class="xl:hidden h-screen col-span-11 shadow-xl bg-white overflow-hidden px-7">
      <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4"><span class="font-serif font-extrabold">{{total}}</span> {{ total>1?$t(`portalTypes.${holder.replace(/\s/g, '')}`,2):$t(`portalTypes.${holder.replace(/\s/g, '')}`,1) }}</h4>
      <p class="font-sans text-ehri-dark text-xs text-justify pb-4">{{ $t(`portalTypesDesc.${holder.replace(/\s/g, '')}`)}}</p>
      <div class="flex flex-col h-screen overflow-hidden" >
        <ul ref="el" class="h-4/6 overflow-y-auto overscroll-auto px-4">
          <AuthoritySetItemCard v-for="item of items" :key="item.id" :AuthObject="item" :selectedItem="selectedAuthID" @idChange="(id)=>changeAuthID(id)"></AuthoritySetItemCard>
          <li v-if="loading" class="w-full flex justify-center items-center py-2">
            <LoadingComponent></LoadingComponent>
          </li>
        </ul>
      </div>
    </div>
    <div :class="[focusedItemClass,'flex', 'h-screen', 'xl:hidden', 'shadow-xl', ]">
      <span v-if="!expandFocusedItem" class="cursor-pointer flex justify-center align-middle items-center" @click="toggleFocusedItemClass">
        <span
            class="material-symbols-outlined text-white pointer-events-none"
        >
          chevron_left
        </span>
      </span>
      <div v-else class="overflow-hidden">
        <span class="cursor-pointer bg-ehri-dark text-white px-5 py-1" @click="toggleFocusedItemClass">
          <span
            class="pt-3 material-symbols-outlined pointer-events-none align-bottom"
          >
            close
          </span>
          {{ $t('close') }}
        </span>
        <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4">{{ $t('itemDetails') }}</h4>
        <AuthoritySetDetails v-if="selectedAuthID" :selectedAuthID="selectedAuthID"></AuthoritySetDetails>
      </div>
    </div>

    <!-- LARGE SCREEN UI -->
    <div v-if="isLargeScreen" class="hidden xl:block shadow-xl bg-white xl:h-3/4 xl:col-span-3 overflow-hidden px-7">
      <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4"><span class="font-serif font-extrabold">{{total}}</span>  {{ total>1?$t(`portalTypes.${holder.replace(/\s/g, '')}`,2):$t(`portalTypes.${holder.replace(/\s/g, '')}`,1) }}</h4>
      <p class="font-sans text-ehri-dark text-xs text-justify pb-4">{{  $t(`portalTypesDesc.${holder.replace(/\s/g, '')}`) }}</p>
      <div class="h-3/6 flex flex-col">
        <ul ref="el" class="h-full hidden xl:block overflow-y-auto">
          <AuthoritySetItemCard v-for="item of items" :key="item.id" :AuthObject="item" :selectedItem="selectedAuthID" @idChange="(id)=>changeAuthID(id)"></AuthoritySetItemCard>
          <li v-if="loading" class="w-full flex justify-center items-center py-2">
            <LoadingComponent></LoadingComponent>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="isLargeScreen" class="hidden xl:block xl:col-span-5 bg-white shadow-xl h-3/4 pb-7 px-7">
      <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4">{{ $t('itemDetails') }} </h4>
      <AuthoritySetDetails v-if="selectedAuthID" :selectedAuthID="selectedAuthID"></AuthoritySetDetails>
    </div>
  </div>
  <div v-else>
    <loading-component class="m-5"></loading-component>
  </div>
</template>

<script>
import { ref, toRef, onMounted, computed } from "vue";
import AuthoritySetItemCard from "./AuthoritySetItemCard.vue";
import AuthoritySetDetails from "./AuthoritySetDetails.vue";
import { useInfiniteScroll } from '@vueuse/core'
import {fetchFacetedPortalSearch} from "../services/EHRIGetters";
import LoadingComponent from "./LoadingComponent.vue";


export default {
  name: "AuthoritySetItems",
  components: { AuthoritySetDetails, AuthoritySetItemCard, LoadingComponent },
  props: {
    searchTerm: String,
    holder: String,
    type: String,
    desc: String
  },
  setup(props) {
    const items = ref([])
    const CBQuery = toRef(props, 'searchTerm')
    const holderFilter = toRef(props, 'holder')
    const typeFilter = toRef(props, 'type')
    const page = ref(1)
    const el = ref(null)
    const filters = ref(new Object())
    const total = ref()
    const loading = ref(false)
    const expandFocusedItem = ref(false);
    const screenWidth = ref(window.innerWidth);

    const isLargeScreen = computed(() => {
      return screenWidth.value >= 1280;
    });

    window.addEventListener('resize', () => {
      screenWidth.value = window.innerWidth;
    });

    
    holderFilter.value ? filters.value['holder']=encodeURIComponent(holderFilter.value) : null
    typeFilter.value ? filters.value['type']= typeFilter.value: null

    const selectedAuthID = ref("")

    const focusedItemClass = computed(() => {
            return expandFocusedItem.value
            ? "w-full h-screen bg-white text-ehri-purple px-7 overflow-y-auto col-span-12 m-0 transition-all ease-in-out duration-800 pb-3"
            : "w-full bg-ehri-dark col-span-1 transition-all ease-in-out  duration-800";
        });

   
    const toggleFocusedItemClass = () => {
      expandFocusedItem.value = !expandFocusedItem.value;
    };

    const changeAuthID = (id)=> {
      selectedAuthID.value = id
      expandFocusedItem.value = true
    }


    const getUnitsOnScroll = async () => {
      loading.value = true;
      const newUnits = await fetchFacetedPortalSearch(CBQuery.value, page.value, filters.value, 25)
      newUnits.data.data.forEach(newItem => {
        if (!items.value.some(item => item.id === newItem.id)) {
          items.value.push(newItem)
        }
      })
      total.value = newUnits.data.meta.total
      if (items.value.length < total.value){
        page.value++
      }
      loading.value = false;
    }

    useInfiniteScroll(
      el,
      async () => {
        if (items.value.length < total.value){
          await getUnitsOnScroll()
        }
      },
      { distance: 300 }
    )


    onMounted(()=>{
      getUnitsOnScroll()
      .then(()=>{
        selectedAuthID.value = items.value.length>0?items.value[0].id:null
      })
    })

    return { isLargeScreen, expandFocusedItem, focusedItemClass, toggleFocusedItemClass, total, items, el, selectedAuthID, changeAuthID, loading};
  },
};
</script>

<style scoped>


</style>