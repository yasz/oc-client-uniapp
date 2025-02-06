<script setup lang="ts">
import { go } from "@/utils/common";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const urls = ["index", "courses", "my"];

// 通过 urls 数组动态生成 routeIndexMap
const routeIndexMap = Object.fromEntries(urls.map((name, i) => [`/${name}`, i]));

// 设置初始值
const index = ref(routeIndexMap[route.path] ?? 0);

// 路由变化时更新 index
watch(
  () => route.path,
  (newPath) => {
    if (routeIndexMap[newPath] !== undefined) {
      index.value = routeIndexMap[newPath];
    }
  }
);

const change = (e: number) => {
  if (index.value !== e) {
    go(`/${urls[e]}`);
  }
};
</script>

<template>
  <view>
    <view class="mytab">
      <u-tabbar :border="false" :value="index" @change="change" fixed :placeholder="false" safeAreaInsetBottom
        activeColor="orange">
        <u-tabbar-item :text="$t('index')" icon="star"></u-tabbar-item>
        <u-tabbar-item :text="$t('courses')" icon="pushpin"></u-tabbar-item>
        <u-tabbar-item :text="$t('my')" icon="account"></u-tabbar-item>
      </u-tabbar>
    </view>
  </view>
</template>

<style lang="scss">
.mytab view,
.mytab uni-view {
  background-color: rgba(247, 247, 247, 0.7) !important;
  padding-top: 2px;
}
</style>
