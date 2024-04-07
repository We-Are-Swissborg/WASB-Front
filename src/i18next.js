import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import global_en from './translations/en';
import global_fr from './translations/fr';


i18next.use(initReactI18next).init({
  interpolation: {escapeValue: false},
  lng: localStorage.getItem("language") || "en",
  resources: {
    en: {
      global: global_en,
    },
    fr: {
      global: global_fr,
    }
  }
})

export default i18next;