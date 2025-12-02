import i18n from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'
const i18nDefaultNamespace = 'global'

i18n.setDefaultNamespace(i18nDefaultNamespace)
i18n
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      return import(`../locales/${language}/${namespace}.json`)
    })
  )
  .use(initReactI18next)
  .init({
    lng: 'ru',
    supportedLngs: ['ru'],
    fallbackLng: 'ru',
    ns: i18nDefaultNamespace,
    interpolation: {
      escapeValue: false,
    },
  })
