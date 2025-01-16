import { createSSRApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import uviewPlus from "uview-plus";
import "@/utils/common.scss";
import router from "@/router/index";
import i18n from "./lang";

const pinia = createPinia();

export function createApp() {
  const app = createSSRApp(App);

  app.use(pinia);
  app.use(uviewPlus);
  app.use(i18n);
  return {
    app,
    router,
  };
}
