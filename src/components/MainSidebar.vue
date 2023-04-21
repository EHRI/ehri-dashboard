<template>
<div class="bg-ehri-purple">
    <div class="flex flex-row place-content-between items-center">
        <img :src="logo" class="h-16 ml-2 sm:hidden cursor-pointer" alt="EHRI logo" @click="handle"/>
        <h1 class="mt-2 sm:hidden text-white font-serif font-bold text-center text-base cursor-pointer" @click="handle">EHRI DASHBOARD</h1>
        <span @click="toggleSidebar" class="sm:hidden mr-2 text-white cursor-pointer">
            <span
          class="material-symbols-outlined pointer-events-none"
        >
          menu
        </span>
        </span>
    </div>
    <div class="flex-grow-0 flex-shrink-0 sm:hidden overflow-hidden">
        <div :class="sidebarClass">
            <div class="sm:hidden bg-ehri-purple mt-2 px-4 pb-3">
                <p class="break font-sans font-light text-xs text-justify text-white mx-auto p-2">
                Search for Holocaust-related information across the EHRI Portal, Document Blog and Online Editions.
                </p>
                <SearchBox :key="key" class="pt-4" @queryChange="(t) => {getQueryValue(t)}"></SearchBox>
                <h5 class="font-serif text-white font-medium mt-5 pl-6">DATA SOURCES</h5>
                <LoadResources @data-source-change="(d)=>{emitDataSourceChange(d)}"
                :query-value="routeQuery?routeQuery:query"></LoadResources>
            </div>
        </div>
    </div>
    <div class="hidden sm:block sm:min-h-screen sm:h-full sm:overflow-hidden sm:bg-ehri-purple">
        <img :src="logo" class="h-24 mt-2 mx-auto cursor-pointer" alt="EHRI logo" @click="handle"/>
        <h1 class="mt-2 text-white font-serif font-bold text-center text-base">EHRI DASHBOARD</h1>
        <p class="break font-sans font-light text-xs text-justify text-white mx-auto p-2 mb-5">
            Search for Holocaust-related information across the EHRI Portal, Document Blog and Online Editions.
        </p>
        <SearchBox :key="key" class="pt-4" @queryChange="(t) => {getQueryValue(t)}"></SearchBox>
            <h5 class="font-serif text-white font-medium mt-5 pl-6">DATA SOURCES</h5>
            <LoadResources @data-source-change="(d)=>{emitDataSourceChange(d)}"
             :query-value="routeQuery?routeQuery:query"></LoadResources>
    </div>
</div>
</template>
  
  <script>
  import { ref, computed } from "vue";  
  import logo from "@/assets/ehri_logo.png"
  import SearchBox from "@/components/SearchBox.vue"
  import LoadResources from "./LoadResources.vue";
  import { useRoute, useRouter } from "vue-router";

  export default {
    name: "MainSidebar",
    components: { SearchBox, LoadResources },
    emits: ["dataSourceChange"],
    setup(props, ctx){
        const route = useRoute()
        const router = useRouter();
        const query = ref("")
        const key = ref(1);
        const showSidebar = ref(false);

        const routeQuery = computed(()=> {
            query.value = route.params.query
        })

        const getQueryValue = (t) => {
            query.value = t
        }

        const handle = () => {
            query.value = ""
            routeQuery.value = ""
            key.value += 1
            router.push({
                name: "home",
                params: { query: "" },
                replace: false,
                })
            };

        const emitDataSourceChange = (dataSource) =>{
            ctx.emit("dataSourceChange", (dataSource))
            if (query.value) {
                router.push({
                name: "home",
                params: { query: query.value },
                replace: true,
                });
            } else {
                if(!routeQuery.value){
                    router.push({ name: "home", replace: true });
                } else {
                    router.push({
                name: "home",
                params: { query: routeQuery.value },
                replace: true,
                });
          }
          
      }
        }

        const sidebarClass = computed(() => {
            return showSidebar.value
            ? "sm:hidden w-full m-0 p-0 bg-ehri-purple md:w-auto md:block transition-all ease-in-out duration-00"
            : "sm:hidden w-full h-0 transition-all ease-in-out duration-800";
        });

        const toggleSidebar = () => {
            showSidebar.value = !showSidebar.value;
        };

        return {showSidebar, sidebarClass, toggleSidebar, logo, route, emitDataSourceChange, getQueryValue, query, routeQuery, handle, key}
    }
  }
  </script>
  
  <style scoped>
  </style>