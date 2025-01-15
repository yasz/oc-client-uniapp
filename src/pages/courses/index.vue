<template>
    <view class="content">
        <!-- <image class="logo" src="/static/logo.png" /> -->
        <view class="text-area">
            <text class="title">{{ t("courses") }}</text>
        </view>
        <LangSwitch />
    </view>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useI18n } from 'vue-i18n';
import LangSwitch from "@/components/langSwitch.vue";

const { t, locale } = useI18n();
</script>
