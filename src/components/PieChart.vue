<template>
   
</template>

<script>
import { defineComponent, ref, toRef } from 'vue';



export default defineComponent({
  name: 'Chart',
  components: {},
  props:
      {
        dataset: Object
      },
  setup(props) {
    const dataset = toRef(props,'dataset')
    const countries = dataset.value.countries.map(c => c['count'])
    const options = ref(
        {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Archival Descriptions per Country',
            },
            legend: {
              display: false
            }
          },
          borderWidth: 0.4
        }
    )


    const data = {
      labels: dataset.value.countries.map(c => c['name']),
      datasets: [
        {
          label: "Archival Descriptions2",
          backgroundColor: ['#330033', '#731744', '#AE4249', '#DB774A', '#F5B651', '#F9F871', ],
          data: countries,
        },
      ],
    };


    return { data, countries, options};
  },
});
</script>