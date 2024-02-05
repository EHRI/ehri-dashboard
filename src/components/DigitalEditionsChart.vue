<template>
  <DoughnutChart v-if="data" :chartData="data" :options="options"></DoughnutChart>
</template>

<script>
import { defineComponent, ref, toRef } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default defineComponent({
name: 'Chart',
components: { DoughnutChart,},
props:
    {
      dataset: Object
    },
setup(props) {
  const dataset = toRef(props,'dataset')
  const subjects = ref()
  const data = ref()

  const options = ref(
      {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Subject Distribution',
          },
          legend: {
            display: false
          }
        },
        borderWidth: 0.4
      }
  )

  if (dataset.value){
    subjects.value = Object.keys(dataset.value).map(c => dataset.value[c])

    data.value = {
      labels: Object.keys(dataset.value).map(c => c),
      datasets: [
        {
          label: "Archival Descriptions2",
          backgroundColor: ['#330033','#731744', '#B7A6B5', '#827280', '#380900', '#683611','#50424F', '#B7A6B5', '#003939', '#006A68', '#AE4249', '#DB774A', '#F5B651', '#F9F871',],
          data: subjects.value,
        },
      ],
    };
  } else {
    data.value = null
  }

  return { data, options,};
},
});
</script>