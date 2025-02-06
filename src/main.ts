import { createSSRApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import uviewPlus from "uview-plus";
import "@/utils/common.scss";
import router from "@/router/index";
import i18n from "./lang";
import pinia from "./stores/store";
import { useAuthStore } from "./stores/authStore";
await useAuthStore().loadTokenFromStorage();
const app = createSSRApp(App);
export function createApp() {
  app.use(pinia);
  app.use(uviewPlus);
  app.use(i18n);
  return {
    app,
    router,
  };
}
