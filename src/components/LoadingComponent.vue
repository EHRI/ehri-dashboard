<template>
  <div class="justify-content-center row">
    <div class="text-center">
      <button class="btn border-0 loading-dashboard">
      <span
          class="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
      ></span>
        Loading...
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingComponent",
};
</script>

<style scoped>
.loading-dashboard {
  background-color: #6C003B!important;
  cursor: default;
  color: #FFFFFF;
}
</style>
