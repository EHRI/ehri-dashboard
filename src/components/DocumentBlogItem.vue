<template>
  <li>
    <div class="grid grid-cols-8 gap-4 h-32 flex items-center">
      <div class="col-span-2 h-full">
        <img v-if="thumbnail" :src="thumbnail" class="h-32 w-full object-cover" alt="post thumbnail">
        <div v-else class="image-loader">
          <span class="spinner-grow text-center align-middle" role="status"></span>
        </div>
      </div>
      <div class="col-span-6">
        <a v-if="title" :href="link" target="_blank" rel="noopener"><h6 class="text-ehri-wine font-sans font-semibold text-sm mb-0 pb-0 overflow-hidden line-clamp-1"  v-html="title"></h6></a>
        <h6 class="text-ehri-dark font-sans font-medium opacity-90 text-sm line-clamp-1" v-if="authors.length">{{authors.join(', ')}}</h6>
        <p v-if="pubDate" class="text-xs text-ehri-dark font-sans opacity-90">{{pubDate}}</p>
        <p v-if="excerpt" class="text-sm overflow-hidden line-clamp-2">{{excerpt}}</p>
        <div v-if="categories.length" class="line-clamp-1">
          <span class="border border-ehri-wine rounded-full bg-ehri-wine text-white mr-1 px-2 font-sans text-xs" v-for="c in categories" :id="c" >{{c.length > 20? c.substring(0,20)+"...":c}}</span>
        </div>
      </div>
    </div>
  </li>
  <hr class="my-2 text-ehri-purple opacity-20">
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
      thumbnail.value= post.value._embedded["wp:featuredmedia"] && post.value._embedded["wp:featuredmedia"][0]?post.value._embedded["wp:featuredmedia"][0].source_url:""
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
