import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: new URLSearchParams(window.location.search).get("locale") ?? "en",
    fallbackLng: "en",
    backend: {
      loadPath: "/game/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;