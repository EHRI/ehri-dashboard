<!--Pagination configuration largely inspired by: https://gist.github.com/itzikbenh/90918f44b3f871d206e6f5dddaabcc49-->
<template>
  <nav class="pagination" aria-label="Document Blog Pagination">
    <ul class="pagination">
      <li v-if="pagination.prevPage" class="page-item">
        <a @click="$emit('prev')" class="page-link">Previous</a>
      </li>
      <li v-else class="page-item disabled">
        <span class="page-link">Previous</span>
      </li>
      <li class="page-item active">
        <span class="page-link">{{ currentPage }} of {{ pagination.totalPages }}</span>
      </li>
      <li v-if="pagination.nextPage" class="page-item">
        <a @click="$emit('next')" class="page-link">Next</a>
      </li>
      <li v-else class="page-item disabled">
        <span class="page-link">Next</span>
      </li>
    </ul>
  </nav>
</template>

<script>
import { toRef } from "vue";

export default {
  name: "EditionsPagination",
  props: {
    paginationObject: Object,
    currentPage: Number,
  },
  setup(props) {
    const pagination = toRef(props, "paginationObject");
    const currentPage = toRef(props, "currentPage");

    return { pagination, currentPage };
  },
};
</script>

<style>
.page-item.disabled .page-link {
  color: #666666!important;
  background-color: unset!important;
  border: solid 1px #666666!important ;
  z-index: 0!important;
}
.page-item.active .page-link {
  color: #FFFFFF!important;
  background-color: #6C003B!important;
  border: solid 1px #666666!important ;
  z-index: 0!important;
}
.page-item .page-link {
  color: #6C003B!important;
  background-color: unset!important;
  border: solid 1px #666666!important ;
  z-index: 0!important;
}

.page-item .page-link:hover {
  cursor: pointer;
}
</style>
