<template>
  <span class="flex justify-center bg-ehri-purple py-2 text-white xl:hidden col-span-12 text-ehri-dark font-sans " @click="toggleFilterBar">
      <span v-if="!showFilterBar" class="xl:hidden mr-2 cursor-pointer">
              <span
            class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
          >
            filter_alt
          </span>
          Filter Results
      </span>
      <span v-else class="xl:hidden mr-2 cursor-pointer">
              <span
            class="material-symbols-outlined text-ehri-white pointer-events-none align-bottom"
          >
            close
          </span>
          Close
      </span>
  </span>
  <div v-if="selectedCategory && !showFilterBar" class="xl:hidden pt-1 px-2">
          <h5 class="font-sans text-sm text-ehri-purple block font-medium">Active Filters:</h5>
            <span class="inline mt-1 w-fit cursor-pointer border border-ehri-dark rounded-full bg-ehri-dark text-white mr-1 px-2 py-0.5 text-xs"
              @click="handleFilter('')">{{DBCategories.find(c=>c.id==selectedCategory).name.substring(0,20)+"..."}}</span>
            <div class="flex items-center mt-1 cursor-pointer text-ehri-purple text-sm" id="remove-filter" @click="() => handleFilter('')">
              <span class="material-symbols-outlined pointer-events-none w-3 h-3 text-xs mr-1">
                close
              </span>
              <span>Remove All Filters</span>
            </div>
        </div>
  <div class="grid grid-cols-12 sm:grid-cols-8 gap-8 h-screen max-w-full"  v-if="!loadingCategories && pagination.total > 0">
    <div class="h-screen col-span-12 bg-white shadow-xl xl:h-3/4 xl:col-span-6 overflow-hidden px-7">
      <h4 class="font-sans text-ehri-dark font-extralight text-xl mt-4">Showing 
        <span v-if="pagination.total" class="font-serif font-extrabold">{{pagination.total}}</span>
        <LoadingComponent v-else></LoadingComponent> <span>{{ pagination.total>1?' results':' result' }}</span>
        from the EHRI Document Blog</h4>
      <p class="font-sans text-ehri-dark text-sm">The EHRI Document Blog is a space to share ideas about Holocaust-related archival documents, and their presentation and interpretation using digital tools.</p>
      <hr class="text-ehri-dark border-4 shadow-md mt-3">
      <div class="pr-1 pt-3 pb-0 h-full">
        <div class="h-5/6">
          <div class="h-full flex flex-col">
            <div class="text-end text-xs text-ehri-dark">
                <span class="font-medium">Ranking: </span>
                <span v-if="orderDesc" class="cursor-pointer"
                      @click="orderDesc = !orderDesc"
                >&bigtriangledown;Newer to Older</span>
                <span v-else class="cursor-pointer"
                      @click="orderDesc = !orderDesc">
              &bigtriangleup;Older to Newer
              </span>
            </div>
            <ul ref="el" class="h-5/6 overflow-y-auto">
              <li v-for="(post,i) in posts" :key="i">
                <DocumentBlogItem :BlogPost="post"></DocumentBlogItem>
              </li>
              <li v-if="loading" class="w-full flex justify-center items-center py-2">
                <LoadingComponent></LoadingComponent>
              </li>
            </ul>
        </div>
      </div>
    </div>
    </div>
      <div :class="[filterBarClass, 'bg-ehri-purple', 'overflow-y-auto', 'text-white','xl:text-ehri-dark', 'xl:col-span-2', 'col-span-12', 'xl:order-last', 'order-first', 'xl:bg-white', 'shadow-xl', 'xl:h-3/4',]">
        <div class="px-4 pt-4">
          <h4 class="uppercase font-serif font-bold text xl:text-ehri-dark">Filters</h4>
          <p class="font-sans text-sm font-light mb-4">Choose one or more filters</p>
          <div v-if="!loadingCategories" class="overflow-y-auto h-3/4">
            <DocumentBlogFilter :key="filterKey" :filterName="'Categories'" :filterArray="DBCategories"
                            @filterChange="(e) => {
                handleFilter(e)
              }"
        >
          </DocumentBlogFilter>
          </div>
        </div>
        <div v-if="selectedCategory" class="px-4 pt-4">
          <hr class="py-1 xl:text-ehri-dark">
          <h5 class="font-serif text-sm font-extralight">Active Filters:</h5>
            <span class="block mt-1 w-fit cursor-pointer border rounded-full xl:border-ehri-dark bg-white text-ehri-dark xl:bg-ehri-dark xl:text-white mr-1 px-2 py-0.5 text-xs"
              @click="handleFilter('')">{{DBCategories.find(c=>c.id==selectedCategory).name.substring(0,20)+"..."}}</span>
            <div class="flex items-center my-2 cursor-pointer xl:text-ehri-wine text-sm" id="remove-filter" @click="() => handleFilter('')">
              <span class="material-symbols-outlined pointer-events-none w-3 h-3 text-xs mr-1">
                close
              </span>
              <span>Remove All Filters</span>
            </div>
        </div>
      </div>
    </div>
    <LoadingComponent v-else></LoadingComponent>
</template>

<script>
import { toRef, ref, watch, onMounted, computed} from "vue";
import { fetchBlogPosts, fetchDBCategories } from "../services/EHRIGetters.js";
import DocumentBlogItem from "./DocumentBlogItem.vue";
import LoadingComponent from "./LoadingComponent.vue";
import DocumentBlogFilter from "./DocumentBlogFilter.vue";
import { useInfiniteScroll } from '@vueuse/core'


export default {
  name: "DocumentBlog",
  components: {DocumentBlogFilter, LoadingComponent, DocumentBlogItem},
  props: {
    searchTerm: String,
  },
  setup(props ) {
    const searchTerm = toRef(props, "searchTerm");
    const posts = ref([]);
    const page = ref(1);
    const pagination = ref({
      total: 0,
      totalPages: 1
    });
    const loading = ref(true);
    const DBCategories = ref([])
    const orderDesc = ref(true)
    const selectedCategory = ref("")
    const el = ref(null);
    const loadingCategories = ref(true)
    const filterKey = ref(0)
    const showFilterBar = ref(false);

    const getCategories = async () => {
      loadingCategories.value = true
      await fetchDBCategories()
      .then(res => {
        if(res.length){
          DBCategories.value = res.map(c => {
            return Object(
          {"id": c.id,
                  "name": c.name,
                  "count": c.count
                }
            )
          })
        }
      })
    }

    const getUnitsOnScroll = async () => {
      loading.value = true;
      let order = orderDesc.value?"desc":"asc"
      const newUnits = await fetchBlogPosts(searchTerm.value, page.value, 10, selectedCategory.value, order);
      if (posts.value.length <= pagination.value["total"]){
        if (page.value == 1 || page.value <= pagination.value["totalPages"]) {
          newUnits.data.forEach(newItem => {
              if (!posts.value.some(item => item.id === newItem.id)) {
                posts.value.push(newItem)
          }
        })
        }
        pagination.value["total"] = +newUnits.headers['x-wp-total']
        pagination.value["totalPages"]= +newUnits.headers['x-wp-totalpages']
        if (posts.value.length < pagination.value["total"]){
          page.value++;
        }
        loading.value = false;
      } else {
        loading.value = false
      }
      
    }

    useInfiniteScroll(
      el,
      async () => {
        await getUnitsOnScroll();
      },
      { distance: 300 }
    );

    onMounted(async () => {
      await getCategories();
      await Promise.all(
        DBCategories.value.map(async (c) => {
          let category = c.id;
          const res = await fetchBlogPosts(
            searchTerm.value,
            page.value,
            1,
            category
          );
          c["searchTermCount"] = res.data.length
            ? +res.headers["x-wp-total"]
            : 0;
        })
      );
      loadingCategories.value = false;
      filterKey.value++;
      getUnitsOnScroll();
    });


    const handleFilter = async (e) => {
      posts.value = [];
      e !== "Categories" ? (selectedCategory.value = +e) : (selectedCategory.value = "");
      page.value = 1;
      await getCategories();
      await Promise.all(
        DBCategories.value.map(async (c) => {
          let category = c.id;
          const res = await fetchBlogPosts(
            searchTerm.value,
            page.value,
            1,
            category
          );
          c["searchTermCount"] = res.data.length
            ? +res.headers["x-wp-total"]
            : 0;
        })
      );
      loadingCategories.value = false;
      filterKey.value++;
      getUnitsOnScroll();
    };

    const filterBarClass = computed(() => {
            return showFilterBar.value
            ? "w-full h-max pb-4 m-0 p-0 bg-ehri-purple xl:w-auto xl:block transition-all ease-in-out duration-600"
            : "w-full h-0 transition-all ease-in-out overflow-hidden xl:overflow-y-auto duration-800 xl:w-auto ";
        });

   
    const toggleFilterBar = () => {
      showFilterBar.value = !showFilterBar.value;
    };


    watch(searchTerm, () => {
      getCategories()
        .then(() => {
          DBCategories.value.forEach(c => {
            let category = c.id
            fetchBlogPosts(searchTerm.value, page.value,1,category)
                .then(res => {
                  c["searchTermCount"] = res.data.length?
                   +res.headers["x-wp-total"]
                  : 0;
                });
          })
        })
        
        loadingCategories.value = false
        filterKey.value++
        getUnitsOnScroll();
    });

    watch(orderDesc, ()=> {
      page.value = 1
      posts.value = []
      getUnitsOnScroll()
    })


    return { handleFilter, filterKey, loadingCategories,el,selectedCategory, posts, page, pagination, loading, DBCategories, orderDesc, showFilterBar, toggleFilterBar, filterBarClass };
  },
};
</script>
