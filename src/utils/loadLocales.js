export async function loadLocaleMessages() {
    const locales = import.meta.glob('../locales/*.json')
    const messages = {}
    
    for (const path in locales) {
      const locale = path.match(/\/(\w+)\.json$/)[1]
      messages[locale] = (await locales[path]()).default
    }
  
    return messages
  }