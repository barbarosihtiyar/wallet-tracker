import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const supportedLanguages = {
  tr: "Türkçe",
  en: "English",
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "tr",
    fallbackLng: "en",
    supportedLngs: Object.keys(supportedLanguages),
    defaultNS: "translation",
    debug: process.env.NODE_ENV === "development",

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },

    react: {
      useSuspense: false,
    },
  });

export const isRTL = (language: string): boolean => {
  return language === "ar";
};

export const setupLanguageDirection = (language: string): void => {
  const html = document.documentElement;

  if (isRTL(language)) {
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");
  } else {
    html.setAttribute("dir", "ltr");
    html.setAttribute("lang", language);
  }
};

i18n.on("languageChanged", (lng) => {
  setupLanguageDirection(lng);
});

export default i18n;
