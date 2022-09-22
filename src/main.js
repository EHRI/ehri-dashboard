import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faDatabase,
  faDownload,
  faGraduationCap,
  faBookOpen,
  faGlobeEurope,
  faLightbulb,
  faStickyNote,
  faPenNib,
  faCalendar,
  faLocationDot,
  faComputerMouse,
  faClock,
  faMagnifyingGlass,
  faListCheck,
  faServer
} from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faFacebook
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* add icons to the library */
library.add(
  faDatabase,
  faDownload,
  faGraduationCap,
  faBookOpen,
  faGlobeEurope,
  faLightbulb,
  faStickyNote,
  faPenNib,
  faCalendar,
  faLocationDot,
  faComputerMouse,
  faClock,
  faTwitter,
  faFacebook,
  faMagnifyingGlass,
  faListCheck,
  faServer
);

const app = createApp(App)

app.use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount('#app');