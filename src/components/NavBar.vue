<template>
  <nav class="navbar navbar-custom sticky-top navbar-light">
    <div class="container-fluid ">
      <router-link class="nav-link"  :to="{ name: 'home'}"><span class="navbar-brand">EHRI Dashboard</span></router-link>
      <div>
        <ul class="navbar-nav d-inline me-auto mb-2 mb-lg-0">
          <li class="nav-item d-inline">
            <router-link class="nav-link text-white d-inline"  :to="{ name: 'home'}">Home</router-link>
          </li>
          <li class="nav-item d-inline">
            <router-link class="nav-link text-white d-inline ps-2" :to="{ name: 'dashboard'}">Dashboard</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
}
</script>

<style scoped>
.navbar-custom  {
  background-color: #330033;
  color: #FFFFFF;
}

.navbar-custom span{
  color: #FFFFFF;
}
.navbar-custom span:hover{
  color: #FFFFFF;
}
</style>