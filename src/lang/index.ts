// src/i18n/index.js
import { createI18n } from "vue-i18n";
import zhCN from "./zh-CN";
import enUS from "./en-US";

// 获取用户语言设置
let lang = uni.getStorageSync("lang");
if (lang === "") uni.setStorageSync("lang", (lang = "zh-CN")); // 默认中文

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API
  locale: lang,
  fallbackLocale: "en-US", // 备用语言
  messages: {
    "zh-CN": zhCN,
    "en-US": enUS,
  },
});

export default i18n;
