<template>
    <view class="flex items-center pt-80 pb-40 px-30 bg-primary">
        <u-avatar :src="'avaters/wechat/defaultAvater.png'" size="106rpx" shape="circle"></u-avatar>

        <!-- <span @click="go('/pages/login')" class="ml-20 text-40 font-600">{{
            settings.nickname || $t("Login")
        }}</span> -->
    </view>
    <view class="pt-10 flex justify-between"> </view>
    <view class="flex-col px-20 py-20">
        <view class="flex py-20">
            <view class="mr-20">
                <u-image class="mr-20" radius="8rpx" src="/static/translate.png" width="36rpx" height="36rpx" />
            </view>

            <LangSwitch />
        </view>
        <view v-if="useAuthStore().token">
            <view @click="go('/pages/logoff')" class="flex f-b-c py-20">
                <view class="flex">
                    <view class="flex mr-20">
                        <u-image class="" radius="8rpx" src="/static/2983.png" width="36rpx" height="36rpx" />
                    </view>
                    {{ $t("apply logoff") }}
                </view>
                <u-icon class="mr-20" name="arrow-right" size="36rpx" />
            </view>
            <view class="flex h-90 mt-20rpx f-b-c py-20" @click="logout">
                <view class="flex">
                    <view class="mr-20">
                        <u-image class="" radius="8rpx" src="/static/2988.png" width="36rpx" height="36rpx" />
                    </view>
                    {{ $t("logout") }}
                </view>
            </view>
        </view>

    </view>
</template>
<script setup lang="ts">
import Tabbar from "@/components/tabbar.vue";
import LangSwitch from "@/components/langSwitch.vue";
import { useAuthStore } from "@/stores/authStore";
import { bucketURL, go, go2 } from "@/utils/common";
const logout = () => {
    useAuthStore().signOut();
};
console.log('【调试】~~~~~:【', process.env.VITE_SOME_KEY, import.meta.env.VITE_API_ENDPOINT, '】');
</script>