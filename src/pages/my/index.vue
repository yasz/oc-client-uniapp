<template>
    <view class="container">
        <!-- 头部区域 -->
        <view class="header">
            <view class="header-content">
                <view class="user-profile">
                    <u-avatar :src="'avatars/wechat/defaultAvatar.png'" size="140rpx" shape="circle"></u-avatar>
                    <view class="user-text">
                        <view class="user-name">{{ useAuthStore().token ? useAuthStore().nickname : 'MARY' }}</view>
                        <view class="user-days">加入Lifefunner的第120天</view>
                    </view>
                </view>
                <view class="header-icons">
                    <image src="/static/my/logo.png" mode="aspectFit" class="header-icon" />
                    <image src="/static/my/logo_puzzle.png" mode="aspectFit" class="header-icon" />
                </view>
            </view>
            <!-- 河马卡片 -->
            <view class="hippo-card">
                <image src="/static/my/hippo.png" mode="aspectFit" class="hippo-image" />
                <view class="hippo-text">
                    MERRY MANDARIN:
                    <view>HAPPY AS A HIPPO</view>
                </view>
                <image src="/static/my/puzzle-piece.png" mode="aspectFit" class="puzzle-piece" />
            </view>
        </view>

        <!-- 菜单按钮区域 -->
        <view class="menu-list">
            <view class="menu-item" v-for="i in 6" :key="i" @click="handleMenuClick(i)">
                <view class="menu-icon-wrapper">
                    <image :src="`/static/my/i${i}.png`" mode="aspectFit" class="menu-icon" />
                </view>
                <text class="menu-text">{{ getMenuText(i) }}</text>
                <view class="menu-arrow">
                    <text class="arrow">></text>
                </view>
            </view>
        </view>

        <Layout />
    </view>
</template>

<script setup lang="ts">
import Tabbar from "@/components/tabbar.vue";
import LangSwitch from "@/components/langSwitch.vue";
import { useAuthStore } from "@/stores/authStore";
import { bucketURL, go } from "@/utils/common";
import Layout from "../layout.vue";

const logout = () => {
    useAuthStore().signOut();
};

type MenuIndex = 1 | 2 | 3 | 4 | 5 | 6;

const menuTexts: Record<MenuIndex, string> = {
    1: '学习日历',
    2: '拼图账户',
    3: '联系我们',
    4: '关于我们',
    5: '使用帮助',
    6: '意见反馈'
};

const menuRoutes: Record<MenuIndex, string> = {
    1: '/my/calendar',
    2: '/my/puzzle-account',
    3: '/my/contact',
    4: '/my/about',
    5: '/my/help',
    6: '/my/feedback'
};

const getMenuText = (index: number): string => {
    return menuTexts[index as MenuIndex] || '';
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
    background-color: #F9B13C;
    padding: 60rpx 30rpx 30rpx;
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

.header-icons {
    display: flex;
    gap: 20rpx;
}

.header-icon {
    width: 60rpx;
    height: 60rpx;
}

.hippo-card {
    background-color: #FFF9E7;
    border-radius: 20rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 20rpx;
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
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #eee;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-icon-wrapper {
    width: 80rpx;
    height: 80rpx;
    border: 3rpx solid #FCE157;
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
    color: #999;
    font-size: 24rpx;
}

.arrow {
    font-family: "宋体";
}
</style>