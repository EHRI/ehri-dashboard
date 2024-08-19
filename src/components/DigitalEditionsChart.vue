<template>
  <DoughnutChart v-if="data" :chartData="data" :options="options"></DoughnutChart>
</template>

<script>
import { defineComponent, ref, toRef, watch } from 'vue';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import { useI18n } from 'vue-i18n';

Chart.register(...registerables);

export default defineComponent({
  name: 'Chart',
  components: { DoughnutChart },
  props: {
    dataset: Object
  },
  setup(props) {
    const { t, locale } = useI18n();
    const dataset = toRef(props, 'dataset');
    const data = ref();

    const options = ref({
      indexAxis: 'y',
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: t('topSubjects'),
        },
        legend: {
          display: false
        }
      },
      borderWidth: 0.4
    });

    if (dataset.value) {
      // Convert the dataset into an array of [subject, value] pairs
      const sortedSubjects = Object.entries(dataset.value)
        .sort((a, b) => b[1] - a[1]) // Sort by value descending
        .slice(0, 10); // Keep only the top 10

      data.value = {
        labels: sortedSubjects.map(([subject]) => subject),
        datasets: [
          {
            label: "Archival Descriptions2",
            backgroundColor: ['#330033', '#731744', '#B7A6B5', '#827280', '#380900', '#683611', '#50424F', '#B7A6B5', '#003939', '#006A68', '#AE4249', '#DB774A', '#F5B651', '#F9F871'],
            data: sortedSubjects.map(([, value]) => value),
          },
        ],
      };
    } else {
      data.value = null;
    }

    watch(() => locale.value, () => {
      options.value.plugins.title.text = t('topSubjects');
    });

    return { data, options };
  },
});
</script>
