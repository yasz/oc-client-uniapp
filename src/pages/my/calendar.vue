<template>
    <view class="pt-10">
        <view class="container">
            <wn-calendar :isEn="isEn" ref="calendar" :isBorder="true" :isLess="false"
                :colors="['#f3a73f', '#2979ff', '#8f939c', '#18bc37', '#e43d33']" @choose="onChoose"></wn-calendar>
        </view>


    </view>
</template>


<script setup lang="ts">

import { useI18n } from "vue-i18n";
import { computed, ref, watch } from "vue";

// Define props

// I18n setup
const { t, locale } = useI18n();
const isEn = computed(() => locale.value === "en-US");
const onChoose = (e: any) => {
    //   curActs.value = actsByDate.value[e.date] || [];
    //   if (curActs.value.length > 0) {
    //     show.value = true;
    //   }
};
</script>