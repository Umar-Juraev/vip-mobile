import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ru from './ru.json';
import uz from './uz.json';
import zh from './zh.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      uz: {
        translation: uz,
      },
      ru: {
        translation: ru,
      },
      zh: {
        translation: zh,
      },
    },
    fallbackLng: 'uz', 

    lng: 'uz',

    interpolation: {
      escapeValue: false, 
    },

    debug: false, 
  });

export default i18n;
