import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { loadLocaleMessages } from './utils/loadLocales'
import './index.css'
import './assets/fonts.css'
import "leaflet/dist/leaflet.css"

async function setupI18n() {
  const messages = await loadLocaleMessages()
  
  const i18n = createI18n({
    legacy: false, 
    locale: 'en', 
    globalInjection: true,
    messages,
  })

  const app = createApp(App, {
    setup() {
      const { t } = useI18n() 
      return { t }
    }
  })

  const pinia = createPinia()
  app.use(pinia)
  app.use(i18n)
  app.use(router)
  app.mount('#app')
  
  // Inject Plausible analytics script and set meta tags based on environment
  const domain = import.meta.env.VITE_APP_DOMAIN
  const fullDomain = `https://${domain}`
  if (import.meta.env.PROD || import.meta.env.STAGING) {
    const script = document.getElementById('plausible-script')
    script.src = 'https://plausible.io/js/script.js'
    script.setAttribute('data-domain', domain)

    // Update meta tags
    document.querySelector('meta[property="og:url"]').setAttribute('content', fullDomain)
  }
}

setupI18n()