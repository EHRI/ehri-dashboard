<template>
  <div
      :style="{ 'background-image':`url(${image})`}"
  >
    <div class="mask" style="background-color: rgba(0, 0, 0, 0.6)">
      <div class="row justify-content-center m-0" :style="{'height':'16em', 'position': 'relative'}">
        <div class="bg-image d-flex justify-content-center align-items-center">
           <div class="col-md-5" v-if="!loadingEntities && !loadingGhettos && !loadingCamps">
             <h1 class="mb-0 text-white display-4">EHRI Dashboard</h1>
             <p class="mb-4 available-resources text-white">Use this service to search for Holocaust-related information across the EHRI Portal, Document Blog and Online Editions.</p>
              <form class="mb-4" onsubmit="return false">
                <input
                    class="form-control form-control-lg text-center"
                    type="text"
                    list="DataList"
                    v-model="query"
                    autocomplete="off"
                    @keyup="handle"
                    @keyup.enter="redirect"
                    placeholder="Search across EHRI">
                <datalist id="DataList">
                  <option v-for="(suggestion,i) in suggestions" :key="i" :value="suggestion[2]"
                          :label="Array.isArray(suggestion[3])?suggestion[2]+' | '+suggestion[3].join(' | '):suggestion[2]">
                  </option>
                </datalist>
              </form>
            </div>
            <div v-else>
              <LoadingComponent/>
            </div>
        </div>
        <span class="img-credit fst-italic small text-muted">Image: Michael Fousert via Unsplash</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  fetchCampsDataset,
  fetchEntityMatcherDataset,
  fetchGhettoDataset
} from "../services/EHRIGetters.js";
import LoadingComponent from "./LoadingComponent.vue";
import {useRouter} from "vue-router";

export default {
  name: "SearchBox",
  components:{LoadingComponent},
  setup(){
    const router = useRouter()
    const image= `'../images/michael-fousert-l1Kku7W1EdY-unsplash.jpg'`
    const query = ref("")
    const ghettoSuggests = ref([])
    const entitySuggests = ref([])
    const campSuggests = ref([])
    const suggestions =ref([])
    const ghettosDataset = ref([])
    const entitiesDataset = ref([])
    const campDataset = ref([])
    const loadingEntities = ref(true)
    const loadingGhettos = ref(true)
    const loadingCamps = ref(true)

    try {
      let tempGhettos = fetchGhettoDataset();
      tempGhettos.then((res) => {
        ghettosDataset.value = res
        loadingGhettos.value = false
      });
    } catch (error) {
      console.log(`Failed loading ghettos. Error: ${error}`);
    }
    try {
      let tempEntities = fetchEntityMatcherDataset();
      tempEntities.then((res) => {
        entitiesDataset.value = res
        loadingEntities.value = false
      });
    } catch (error) {
      console.log(`Failed loading entities. Error: ${error}`);
    }
    try {
      let tempCamps = fetchCampsDataset();
      tempCamps.then((res) => {
        campDataset.value = res
        loadingCamps.value = false
      });
    } catch (error) {
      console.log(`Failed loading entities. Error: ${error}`);
    }

    const redirect = () => {
      if (query.value){
        router.push({ name: 'dashboard', params: { query: query.value }, replace:true})
      } else {
        router.push({ name: 'dashboard', replace:true})
      }

    }
    const handle = () => {
      if (query.value === "") {
        suggestions.value = []
        entitySuggests.value = []
        ghettoSuggests.value = []
        campSuggests.value = []
      } else {
        if (query.value.length>2){
          suggestions.value = []
          entitySuggests.value = []
          ghettoSuggests.value = []
          campSuggests.value = []
          ghettoSuggests.value = ghettosDataset.value.data.filter(g => {
            return g[2].toLowerCase().includes(query.value.toLowerCase())
          })
          campSuggests.value = campDataset.value.data.filter(c => {
            return c[2].toLowerCase().includes(query.value.toLowerCase())
          })
          entitySuggests.value = entitiesDataset.value.data.filter(e => {
            if (e[2].toLowerCase().includes(query.value.toLowerCase())) {
              return true
            } else if (e[3].flat(3).some(c => c.toLowerCase().includes(query.value.toLowerCase()))) {
              return true
            } else {
              return false
            }
          })

          suggestions.value = ghettoSuggests.value.concat(campSuggests.value, entitySuggests.value)
        }
      }
    }




    return {image, query, redirect,handle, suggestions, loadingEntities,loadingCamps, loadingGhettos,}
  }
}
</script>

<style scoped>

.form-control-lg {
  background-color: #FFF7FE;
}

.form-control-lg:focus {
  background-color: #FFF7FE;
  color: #330033;
}

.form-control::-webkit-input-placeholder {
  color: #330033;
  opacity: 0.7;
}

.img-credit {
  text-align: end;
  height: fit-content;
  position: absolute;
  bottom: 0;

}

.available-resources {
  font-size: 1.14em;
  text-shadow: 1px 1px 4px #000000;
}
</style>