<template>
  <view class="content">
    <u-image  src="/src/static/delete.png" width="20rpx" height="20rpx" />
    <image class="logo" mode="scaleToFill" src="/static/images/title.jpg" />
    <view class="text-area">
      <!-- <text class="title">{{ t("pages.new activities") }}</text> -->
    </view>
    <!-- <button @click="() => { go('/courses') }">Go to Courses Index</button> -->
    <Layout />
  </view>
</template>

<script setup lang="ts">
import {
  go
} from "@/utils/common";

import { useI18n } from 'vue-i18n';
import Layout from "../layout.vue";

const { t, locale } = useI18n();
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 100vw;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
