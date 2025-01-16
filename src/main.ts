import { createSSRApp } from "vue";
import App from "./App.vue";
import zhCN from "./lang/zh-CN";
import enUS from "./lang/en-US";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import uviewPlus from "uview-plus";
import "@/utils/common.scss";
import router from "@/router/index";
let lang = uni.getStorageSync("lang");
if (lang == "") uni.setStorageSync("lang", (lang = "zh-CN")); //默认中文

const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: lang,
  fallbackLocale: "en-US", // 备用语言
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});
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
