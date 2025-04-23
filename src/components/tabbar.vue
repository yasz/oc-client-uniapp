<script setup lang="ts">
import { go } from "@/utils/common";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const urls = ["index", "courses", "my"] as const;
type TabUrl = typeof urls[number];

// 通过 urls 数组动态生成 routeIndexMap
const routeIndexMap = Object.fromEntries(urls.map((name, i) => [`/${name}`, i]));

// 设置初始值
const index = ref(routeIndexMap[route.path] ?? 0);

// 图标映射
const icons: Record<TabUrl, { active: string; inactive: string }> = {
  index: {
    active: './src/static/tabbar/index_active.png',
    inactive: './src/static/tabbar/index.png'
  },
  courses: {
    active: './src/static/tabbar/courses_active.png',
    inactive: './src/static/tabbar/courses.png'
  },
  my: {
    active: './src/static/tabbar/my_active.png',
    inactive: './src/static/tabbar/my.png'
  }
};

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
      <view class="tab-bar">
        <view v-for="(url, idx) in urls" :key="url" class="tab-item" :class="{ active: index === idx }"
          @click="change(idx)">
          <image :src="index === idx ? icons[url].active : icons[url].inactive" mode="aspectFit" class="tab-icon" />
          <text>{{ $t(url) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.mytab {
  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #f7f7f7;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1rpx solid #eee;
    padding-top: 2px;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
    color: #999;

    &.active {
      color: #F8AE3D;
    }

    .tab-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 6rpx;
    }
  }
}
</style>
