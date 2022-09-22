<template>
<footer class="dashboard-footer row g-0">
  <div class="row social-icons g-0">
    <a title="Link to the EHRI Project Facebook Page" href="https://facebook.com/EHRIproject" target="_blank" rel="noopener noreferrer">
      <font-awesome-icon icon="fa-brands fa-twitter" size="2x"/>
    </a>
    <a title="Link to the EHRI Project Twitter Page" href="https://twitter.com/EHRIproject" target="_blank" rel="noopener noreferrer">
      <font-awesome-icon icon="fa-brands fa-facebook" size="2x"/>
    </a>
  </div>
  <div class="row g-0">
    <div class="col-6 copyright ps-3 justify-content-start text-start mt-5">
      <span class="small ms-4 align-bottom">
        <a href="https://portal.ehri-project.eu/data-policy" target="_blank" rel="noopener noreferrer">EHRI Data Policy</a>
      </span>
      <span class="small ms-4 d-inline-block copyright-span align-bottom">
        <a href="https://www.ehri-project.eu/" target="_blank" rel="noopener noreferrer">&copy; Copyright EHRI Consortium {{new Date().getFullYear()}}</a>
      </span>
    </div>
    <div class="col-6 flag mt-5 pe-3 justify-content-end text-end">
      <span class="small me-2 align-bottom">The EHRI Project is supported by the European Commission.</span>
      <img :src="flag" alt="Flag of Europe."/>
    </div>
  </div>
</footer>
</template>

<script>
import flag from "@/assets/eu_flag.svg"
export default {
  name: "Footer",
  setup(){

    return {flag}
  }
}
</script>

<style scoped>
.dashboard-footer {
  height: 10em;
  position: relative;
  background-color: #330033;
  color: #FFFFFF;
}

.copyright {
  position: absolute;
  bottom: 10%;
  left: 0;
  color: #FFFFFF;
}
.copyright a{
 text-decoration: none;
  color: #FFFFFF;
  cursor: pointer;
}
.flag {
  position: absolute;
  bottom: 10%;
  right: 0;
}
.social-icons a{
  width: fit-content;
  color: #FFFFFF;
  padding: 2em 0 0 2em;
}
</style>