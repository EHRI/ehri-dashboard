<template>
  <div class="row mx-5">
    <div v-for="s in services" :key="s" class="col-md-4 col-sm-12">
      <div class="card" data-bs-toggle="tooltip" data-bs-placement="top" :title="s.description">
        <div class="card-body">
          <a v-if="!s.internal" :href="s.link" :target="s.target" rel="noopener noreferrer">
            <font-awesome-icon :icon="s.icon" size="2x" />
            <h5 class="card-title align-middle">{{ s.title }}</h5>
          </a>
          <router-link v-else :to="s.link">
            <font-awesome-icon :icon="s.icon" size="2x" />
            <h5 class="card-title align-middle">{{ s.title }}</h5>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "EhriServices",
  setup(){
    const services = ref({
      portal: {
        icon: "database",
        title: "Portal",
        link: "https://portal.ehri-project.eu/",
        target: "_blank",
        description: "The EHRI portal offers access to information on Holocaust-related archival material held in institutions across Europe and beyond.",
      },
      blog: {
        icon: "pen-nib",
        title: "Document Blog",
        link: "https://blog.ehri-project.eu/",
        target: "_blank",
        description: "The EHRI document blog is a space to share ideas about Holocaust-related archival documents, and their presentation and interpretation using digital tools."
      },
      editions: {
        icon: "book-open",
        title: "Online Editions",
        link: "https://www.ehri-project.eu/ehri-online-editions",
        target: "_blank",
        description: "The EHRI Online Editions consist of annotated digitized documents from various sources gathered around a theme, and are a new way of presenting digital archival content."
      },
      datasets: {
        icon: "download",
        title: "Downloadable Datasets",
        link: "https://portal.ehri-project.eu/api/datasets",
        target: "_blank",
        description: "EHRI datasets are dynamically-generated structured data about EHRI's collections and related information, available in JSON, CSV, and TSV formats."
      },
      board: {
        icon: "sticky-note",
        title: "Dashboard",
        link: "dashboard",
        target: "",
        description: "Search for Holocaust-related material across the Portal, the Document Blog, and the Digital Editions.",
        internal: true
      },
      georepo: {
        icon: "globe-europe",
        title: "Geospatial Repository",
        link: "https://geodata.ehri-project-test.eu/geonetwork/srv/eng/catalog.search#/home",
        description: "The EHRI Spatial Data Infrastructure.",
        target: "_blank"
      },
      training: {
        icon: "graduation-cap",
        title: "Training",
        link: "https://training.ehri-project.eu/",
        target: "_blank",
        description: "EHRI online course in Holocaust studies."
      },
      use: {
        icon: "lightbulb",
        title: "Digital Tools Guides",
        link: "http://github.com/EHRI/ehri-data-analysis-tools",
        target: "_blank",
        description: "A series of guides to help researchers of the Holocaust and other related fields use digital tools in their research."
      },
      irp2: {
        icon: "magnifying-glass",
        title: "IRP2",
        link: "https://irp2.ehri-project.eu/",
        target: "_blank",
        description: "International Research Portal for Records Related to Nazi-Era Cultural Property"
      },
      emt: {
        icon: "list-check",
        title: "Entity Matching Tool",
        link: "https://emt.ehri-project.eu/",
        target: "_blank",
        description: "This is a tool for translating a list of textual references to controlled vocabulary items, using fuzzy matching where appropriate."
      },
      apis: {
        icon:"server",
        title: "Data APIs",
        link: "https://portal.ehri-project.eu/api",
        target: "_blank",
        description: "The EHRI portal's APIs (application programming interfaces) allow users (researchers, developers, etc) to retrieve EHRI's information in a programmatic fashion."
      }
    })

    return {services}
  }
}
</script>

<style scoped>
.card {
  border: none;
  padding: 1.5em;
}
.card-title {
  margin-top: 0.5em;
  font-size: 1.25em;
  font-family: "Barlow Semi Condensed";
}

a {
  text-decoration: none;
  color: #6c003b;
}

a:hover {
  color: #6c003b;
}
</style>