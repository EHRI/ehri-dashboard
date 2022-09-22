<template>
  <div class="blog-section">
    <div class="row g-0 justify-content-center">
      <h4 class="display-4 text-center pt-3 pb-2">EHRI Document Blog</h4>
      <div class="col-md-6">
        <p class="small">The EHRI Document Blog is a space to share ideas about Holocaust-related archival documents, and their presentation and interpretation using digital tools.</p>
      </div>
    </div>
    <div v-if="DBCategories.length && !loading" class="row g-0 p-4">
      <div class="col-md-3 text-start">
        <h4>Filters</h4>
        <p>Choose one or more filters:</p>
        <div>
          <DocumentBlogFilter :filterName="'Categories'" :filterArray="DBCategories"
                              @filterChange="(e) => {
                  handleFilter(e)
                }"
          >
          </DocumentBlogFilter>
        </div>
      </div>
      <div class="col-md-7">
        <div v-if="!loading &&posts.length" class="row justify-content-center align-self-center g-0">
          <h4 class="text-start mb-3">Posts</h4>
          <div  v-if="selectedCategory">
          Category Filter:
          <div class="filter-div">
            <span class="badge filter me-1"  @click="handleFilter('')">
              {{DBCategories.find(c=>c.id==selectedCategory).name}}
            </span>
          </div>

          <hr class="my-2" style="width: 70%; margin: auto">

          </div>

          <div class="row g-0 justify-content-end mx-2">
            <span class="ranking d-inline small fw-light">Ranking:</span>
            <span v-if="orderDesc" class="order-switch d-inline small fw-bold"
                  @click="orderDesc = !orderDesc"
            >&bigtriangledown; Newer to Older</span>
            <span v-else class="order-switch d-inline small fw-bold"
                  @click="orderDesc = !orderDesc">
          &bigtriangleup; Older to Newer
        </span>
          </div>
            <div v-for="(post,i) in posts" :key="i">
              <DocumentBlogItem :BlogPost="post"></DocumentBlogItem>
            </div>

            <EditionsPagination
                class="justify-content-center mt-4"
                v-if="posts.length & posts.length>1"
                :pagination-object="pagination"
                :current-page="page"
                @prev="
        --page;
        getPosts();
      "
                @next="
        page++;
        getPosts();
      "
            ></EditionsPagination>
        </div>
        <div v-else>
          <LoadingComponent class="m-5 g-0"></LoadingComponent>
        </div>
      </div>
    </div>
    <div class="row g-0 justify-content-center" v-else>
      <LoadingComponent class="m-5 g-0"></LoadingComponent>
    </div>
  </div>
</template>

<script>
import { toRef, ref, watch } from "vue";
import { fetchBlogPosts, fetchDBCategories } from "../services/EHRIGetters.js";
import DocumentBlogItem from "./DocumentBlogItem.vue";
import LoadingComponent from "./LoadingComponent.vue";
import EditionsPagination from "./EditionsPagination.vue";
import DocumentBlogFilter from "./DocumentBlogFilter.vue";

export default {
  name: "DocumentBlog",
  components: {DocumentBlogFilter, EditionsPagination, LoadingComponent, DocumentBlogItem},
  props: {
    searchTerm: String,
  },
  setup(props ) {
    const searchTerm = toRef(props, "searchTerm");
    const posts = ref([]);
    const page = ref(1);
    const pagination = ref({
      totalPages: null,
      total: 0,
      prevPage: null,
      nextPage: null,
    });
    const loading = ref(true);
    const DBCategories = ref([])
    const orderDesc = ref(true)
    const selectedCategory = ref("")

    const getCategories = async () => {
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
    const configPagination = (headers) => {
      pagination.value["totalPages"] = +headers['x-wp-totalpages']
      pagination.value["total"] = +headers['x-wp-total']
      pagination.value["prevPage"] = page.value > 1 ? page.value : "";
      pagination.value["nextPage"] =
          page.value < pagination.value.totalPages ? page.value + 1 : "";
    };


    const getPosts = (category) => {
      category?posts.value = []:null
      let order = orderDesc.value?"desc":"asc"
      fetchBlogPosts(searchTerm.value, page.value,5,category,order)
      .then(res => {
        posts.value =res.data
        configPagination(res.headers);
        loading.value = false;
      })
    };

    const handleFilter = (e) => {
      e!=="Categories"?selectedCategory.value=+e:selectedCategory.value=""
      page.value = 1
      getPosts(selectedCategory.value)
    }


    getCategories()
        .then(res => {
          DBCategories.value.forEach(c => {
            let category = c.id
            fetchBlogPosts(searchTerm.value, page.value,5,category)
                .then(res => {
                  if(res.data.length){
                    c['searchTermCount'] = res.headers["x-wp-total"]
                  }
                });
          })
          getPosts();
        })

    watch(searchTerm, () => {
      getPosts();
    });

    watch(orderDesc, ()=> {
      page.value = 1
      if(selectedCategory.value){
        getPosts(selectedCategory.value)
      } else {
        getPosts()
      }
    })


    return { handleFilter,selectedCategory, posts, page, pagination, getPosts, loading, DBCategories, orderDesc };
  },
};
</script>

<style scoped>
 .ranking {
   width: fit-content;
   margin-right: 0.2em;
 }
.order-switch {
  width: fit-content;
  color: #330033;
  cursor: pointer;
}
 .badge {
   cursor: pointer;
 }

 .filter-div {
   display: inline-flex;
 }

 .filter {
   color: #330033;
   background-color: #F5B651!important;
 }

</style>
