<template>
    <view class="flex items-center pt-80 pb-40 px-30 bg-primary">
        <u-avatar :src="'avatars/wechat/defaultAvatar.png'" size="106rpx" shape="circle"></u-avatar>
        <view v-if="useAuthStore().token" class="pl-20 fixed-height">
            {{ $t("Hi") }} , {{ useAuthStore().nickname }}
            {{ useAuthStore().role }}
            {{ useAuthStore().userId }}
        </view>
        <view v-if="!useAuthStore().token">
            <view class="pl-20 fixed-height" @click="go('/sign-in')">
                <view class="flex">
                    {{ $t("sign in") }}
                </view>
            </view>
        </view>
    </view>
    <view class="pt-10 flex justify-between"> </view>
    <view class="flex-col px-20">
        <view class="flex py-10 baseline fixed-height" style="align-items: center;">
            <view class="mr-20">
                <u-image src="/static/translate.png" width="36rpx" height="36rpx" />
            </view>

            <LangSwitch />
        </view>
        <view class="divider"></view>
        <view v-if="useAuthStore().token">
            <view class="flex py-10 baseline fixed-height" style="align-items: center;" @click="logout">
                <view class="mr-20">
                    <u-image src="/static/2988.png" width="36rpx" height="36rpx" />
                </view>
                <view>
                    {{ $t("logout") }}
                </view>
            </view>
        </view>
        <Layout></Layout>
    </view>
</template>

<style scoped>
/* 定义固定高度 */
.fixed-height {
    min-height: 60rpx;
    /* 根据需求设置固定行高 */
    line-height: 60rpx;
    /* 确保内容垂直居中 */
    overflow: hidden;
    /* 防止内容溢出 */
    white-space: nowrap;
    /* 避免文本换行 */
    text-overflow: ellipsis;
    /* 超出显示省略号 */
}
</style>

<script setup lang="ts">
import Tabbar from "@/components/tabbar.vue";
import LangSwitch from "@/components/langSwitch.vue";
import { useAuthStore } from "@/stores/authStore";
import { bucketURL, go } from "@/utils/common";
import Layout from "../layout.vue";
const logout = () => {
    useAuthStore().signOut();
};
</script>