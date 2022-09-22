<template>
  <div class="row p-4 g-0" :style="{'background-color':bgColor,}">
    <h2 :style="{'color': textColor}">
      <slot></slot>
    </h2>
  </div>
</template>

<script>
import { toRef } from "vue";

export default {
  name: "HeadingSection",
  props: {
    textColor: String,
    bgColor: String,
  },
  setup(props){
    const textColor = toRef(props, "textColor")
    const bgColor = toRef(props,"bgColor")

    return {textColor, bgColor}
  }
}
</script>

<style scoped>
h2 {
  font-family: "Barlow Semi Condensed"
}
</style>