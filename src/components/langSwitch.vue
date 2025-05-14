<template>
  <view
    class="f-c-c"
    :style="{ backgroundColor: 'black', color: 'white', width: '70rpx' }"
    @click="toggleLang"
  >
    <view v-if="lang == 'en-US'">En</view>
    <view v-else>中文</view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
const lang = ref(uni.getStorageSync("lang"));
if (lang.value == "") {
  lang.value = "zh-CN";
}
const toggleLang = () => {
  lang.value = lang.value == "en-US" ? "zh-CN" : "en-US";
  uni.setStorageSync("lang", lang.value);
};
watch(lang, (newLang) => {
  locale.value = newLang;
});
</script>
