import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import global_en from './translations/en';
import global_fr from './translations/fr';


i18next.use(initReactI18next).init({
    interpolation: {escapeValue: false},
    fallbackLng: 'en',
    lng: localStorage.getItem("language") || "en",
    resources: {
        en: {
            translation: global_en,
        },
        fr: {
            translation: global_fr,
        }
    }
});

export default i18next;
