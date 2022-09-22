<template>
  <HeadingSection bg-color="#330033" text-color="#FFFFFF">
    Explore the EHRI Services
  </HeadingSection>
  <EhriServices></EhriServices>
  <HeadingSection bg-color="#E7E7F6" text-color="#6C003B">
    An Overview of the EHRI Portal
  </HeadingSection>
  <OverviewPortalStats :search-term="''" @portalType=""></OverviewPortalStats>
  <OverviewCountryStats></OverviewCountryStats>
</template>

<script>
import EhriServices from "../components/EHRIServices.vue";
import HeadingSection from "../components/HeadingSection.vue";
import OverviewCountryStats from "../components/OverviewCountryStats.vue";
import OverviewPortalStats from "../components/OverviewPortalStats.vue";

export default {
  name: "Home",
  components: {OverviewPortalStats, EhriServices, HeadingSection, OverviewCountryStats, }
  ,

}
</script>

<style scoped>

</style>