<script setup>
import NavBar from '@/components/NavBar.vue'
import SearchBox from '@/components/SearchBox.vue'
import Footer from "@/components/Footer.vue";
</script>

<template>
  <NavBar></NavBar>
  <SearchBox></SearchBox>
  <router-view class="main-view" :key="$route.fullPath"></router-view>
  <Footer></Footer>
</template>

<style>
/*@import url("https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");*/
/*@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");*/
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 0;
  margin: 0;
  background-color: #fff;
}

h1,
h2,
h3,
h4,
h5
{
  color: #6c003b;
}
.main-view {
  min-height: 90vh;
  background-color: #F5F5F5;
}
</style>
