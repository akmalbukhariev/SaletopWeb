import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import HttpBackend from "i18next-http-backend"
import LanguageDetector from "i18next-browser-languagedetector"

i18n
  .use(HttpBackend) // JSON fayllardan tarjima yuklash
// detect user language
// learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector) // brauzer tilini aniqlash
// pass the i18n instance to react-i18next.
  .use(initReactI18next)
// init i18next
// for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en", // agar aniqlanmasa
    supportedLngs: ["en", "uz", "uz-Cyrl"],
    debug: import.meta.env.MODE === "development",
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`
    },
    ns: ["sidebar", "buttons", "titles", "texts", "headers", "placeholders"],  // namespacelar ro‘yxati
    //defaultNS: "common", // agar siz default namespace ishlatmoqchi bo‘lsangiz
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

export default i18n