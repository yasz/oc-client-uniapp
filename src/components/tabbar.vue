<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  initialIndex: Number, // 父组件传递的初始值
});


const route = useRoute();
const urls = ["index", "courses", "my"];
const routeIndexMap: Record<string, number> = {
  "/index": 0,
  "/courses": 1,
  "/my": 2,
};

// 设置初始值
const index = ref(routeIndexMap[route.path] || props.initialIndex || 0);

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
    uni.switchTab({ url: `/${urls[e]}` });
  }
};
</script>

<template>
  <view>
    <view class="mytab">
      <u-tabbar :border="false" :value="index" @change="change" fixed :placeholder="false" safeAreaInsetBottom
        activeColor="#d81e06">
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
