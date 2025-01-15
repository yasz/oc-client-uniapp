import { createSSRApp } from "vue";
import App from "./App.vue";
import zhCN from "./lang/zh-CN";
import enUS from "./lang/en-US";
import { createI18n } from "vue-i18n";
const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: "zh-CN", // 默认语言
  fallbackLocale: "en-US", // 备用语言
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

export function createApp() {
  const app = createSSRApp(App);
  app.use(i18n);
  return {
    app,
  };
}
