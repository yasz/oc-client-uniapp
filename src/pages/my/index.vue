<template>
  <view class="container">
    <!-- 头部区域 -->
    <view class="header px-20 pt-20">
      <view class="header-content">
        <view class="user-profile" @click="go('/my/profile')">
          <u-avatar
            :src="'avatars/wechat/defaultAvatar.png'"
            size="140rpx"
            shape="circle"
          ></u-avatar>
          <view class="user-text">
            <view class="user-name">{{
              useAuthStore().token ? useAuthStore().nickname : "MARY"
            }}</view>
            <view class="user-days">加入Lifefunner的第120天</view>
          </view>
        </view>
        <view class="header-icons"> </view>
      </view>
      <!-- 河马卡片 -->
      <view class="hippo-card flex" style="height: 200rpx">
        <image
          src=" /static/my/logo.png"
          mode="aspectFit"
          class="pl-30 pt-6"
          style="width: 200rpx; height: 200rpx"
        />
        <image
          src="/static/my/title.png"
          mode="aspectFit"
          class="pt-40"
          style="width: 200rpx; height: 100rpx"
        />
        <image
          src="/static/my/logo_puzzle.png"
          mode="aspectFit"
          style="width: 120rpx; height: 120rpx"
          class="pl-30 pt-40"
        />
      </view>
    </view>

    <!-- 菜单按钮区域 -->
    <view class="menu-list">
      <view
        class="menu-item"
        v-for="i in 6"
        :key="i"
        @click="handleMenuClick(i)"
      >
        <view class="menu-icon-wrapper">
          <image
            :src="`/static/my/i${i}.png`"
            mode="aspectFit"
            class="menu-icon"
          />
        </view>
        <text class="menu-text">{{ getMenuText(i) }}</text>
        <view class="menu-arrow">
          <text v-if="i === 1">查看收藏课程</text>
          <text v-else-if="i === 2">新消息查看</text>
          <text v-else-if="i === 3">去联系</text>
          <text v-else-if="i === 4">去查看</text>
          <text v-else-if="i === 5">去查看</text>
          <text v-else>去查看</text>
          <text class="arrow pl-6"> ＞</text>
        </view>
      </view>
    </view>

    <Layout />
  </view>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { bucketURL, go } from "@/utils/common";
import Layout from "../layout.vue";
import { onLoad } from "@dcloudio/uni-app";
import { getUserInfo } from "@/utils/api";

type MenuIndex = 1 | 2 | 3 | 4 | 5 | 6;
onLoad(() => {
  console.log(useAuthStore().token);
  getUserInfo(12).then((res) => {
    console.log(res);
  });
});

const menuTexts: Record<MenuIndex, string> = {
  1: "我的收藏",
  2: "系统提醒",
  3: "联系我们",
  4: "教学日志",
  5: "学生作业",
  6: "学生拼图账户",
};

const menuRoutes: Record<MenuIndex, string> = {
  1: "/my/favorites",
  2: "/my/notifications",
  3: "/my/contact",
  4: "/my/calendar-list",
  5: "/my/assignment-list",
  6: "/my/puzzle-list",
};

const getMenuText = (index: number): string => {
  return menuTexts[index as MenuIndex] || "";
};

const handleMenuClick = (index: number) => {
  const route = menuRoutes[index as MenuIndex];
  if (route) {
    go(route);
  }
};
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #fff;
}

.header {
  background-color: #f9b13c;
  border-radius: 0 0 40rpx 40rpx;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30rpx;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.user-text {
  color: #fff;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.user-days {
  font-size: 24rpx;
  opacity: 0.9;
}

.hippo-card {
  background-color: #fce157;
  border-radius: 40rpx 40rpx 0 0;
}

.hippo-image {
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
}

.hippo-text {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.puzzle-piece {
  width: 60rpx;
  height: 60rpx;
  position: absolute;
  right: 30rpx;
}

.menu-list {
  margin: 30rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 0 20rpx rgba(200, 200, 200, 0.5);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid rgba(238, 238, 238, 0.6);
  background-color: #fff;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border: 3rpx solid #fce157;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  background-color: transparent;
}

.menu-icon {
  width: 44rpx;
  height: 44rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  color: #bbbbbb;
  font-size: 22rpx;
  display: flex;
}
</style>
