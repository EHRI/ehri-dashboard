import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import { loadLocaleMessages } from './utils/loadLocales'
import './index.css'
import './assets/fonts.css'
import "leaflet/dist/leaflet.css"

async function setupI18n() {
  const messages = await loadLocaleMessages()
  
  const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    locale: 'eng', // set default locale
    globalInjection: true,
    messages,
  })

  const app = createApp(App, {
    setup() {
      const { t } = useI18n() // call `useI18n`, and spread `t` from `useI18n` returning
      return { t } // return render context that included `t`
    }
  })

  app.use(i18n)
  app.use(router)
  app.mount('#app')
}

setupI18n()
