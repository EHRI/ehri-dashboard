<template>
  <div class="card mb-2 mx-2">
    <div class="row g-0 blog-card">
      <div class="col-3">
        <img v-if="thumbnail" :src="thumbnail" class="blog-image img-fluid rounded-start" alt="post thumbnail">
        <div v-else class="image-loader">
          <span class="spinner-grow text-center align-middle" role="status"></span>
        </div>
      </div>
      <div class="col-9 text-start">
        <div class="card-body">
          <div v-if="categories.length" class="mb-1 p-0">
            <span class="small badge card-badge-desc m-0" v-for="c in categories">{{c}}</span>
          </div>
          <a :href="link" target="_blank" rel="noopener" class="blog-post-link"><h5 class="card-title mb-0" v-html="title"></h5></a>
          <p class="mb-1 small purple fw-bold" v-if="authors.length">{{authors.join(', ')}}</p>
          <p class="desc mb-0 card-text mt-1" >{{excerpt}}</p>
          <p class="mt-0 purple small" v-if="pubDate">{{pubDate}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {toRef, ref, watch,} from "vue";
import moment from 'moment'

export default {
  name: "DocumentBlogItem",
  props: {
    BlogPost: Object
  },
  setup(props) {
    const post = toRef(props, 'BlogPost')
    const title = ref("")
    const authors = ref([])
    const pubDate = ref("")
    const categories = ref([])
    const excerpt = ref("")
    const thumbnail = ref("")
    const link = ref("")


    function strip(html){
      let doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    }

    const configData = () => {
      thumbnail.value = ""
      excerpt.value = ""
      link.value = ""
      title.value = ""
      authors.value = []
      categories.value = []
      pubDate.value = ""
      title.value = post.value.title.rendered ? post.value.title.rendered : ""
      authors.value = post.value._embedded.author.length?post.value._embedded.author.map(a => a.name):''
      excerpt.value = strip(post.value.excerpt.rendered)
      categories.value = post.value._embedded["wp:term"][0].length?post.value._embedded["wp:term"][0].map(c => c.name):[]
      link.value = post.value.link
      thumbnail.value= post.value._embedded["wp:featuredmedia"][0].source_url
      pubDate.value = moment(String(post.value.date_gmt)).format('MMMM DD, YYYY')

    }

    configData()

    watch(post, ()=>{
      configData()
    })

    return {
      title,
      excerpt,
      thumbnail,
      link,
      authors,
      categories,
      pubDate,
    }
  }
}
</script>

<style scoped>
  .blog-post-link {
    text-decoration: none;
    color: inherit;
  }
  .blog-post-link:hover {
    text-decoration: underline;
  }
  .desc {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card-title {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-card {
    height: 12em!important;
    overflow: hidden;
  }
  .blog-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-loader {
    display: table;
    min-height: 100%;
    min-width: 100%;
  }

  .card-badge-desc{
    background-color: #330033;
    color: #FFFFFF;
    margin: 0 0.3em 0 0!important;
  }

  .purple {
    color: #6C003B;
  }

</style>