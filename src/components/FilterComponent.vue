<template>
    <span @click="removeFilter" class="inline-block rounded-lg py-1 px-2 text-xs font-medium mr-1 mb-1 bg-ehri-purple text-white cursor-pointer">
      {{ filter.label }}
      <span class="material-symbols-outlined text-white ml-1 pointer-events-none align-bottom">close</span>
    </span>
  </template>
  
  <script>
  export default {
    name: "FilterTag",
    props: {
      filter: {
        type: Object,
        required: true
      }
    },
    emits: ["click"],
    methods: {
      removeFilter() {
        this.$emit('click', this.filter);
      }
    }
  };
  </script>
  
  <style scoped>
  .material-symbols-outlined {
    font-size: 12px;
    vertical-align: middle;
  }
  </style>
  