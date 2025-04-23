<template>
    <view class="menu-item" @click="$emit('click')">
        <view class="menu-item__left">
            <text class="menu-item__label">{{ label }}</text>
        </view>
        <view class="menu-item__right">
            <text class="menu-item__value" :style="{ color: valueColor }">{{ value }}</text>
            <text class="menu-item__arrow" v-if="arrow">></text>
        </view>
    </view>
</template>

<script setup lang="ts">
defineProps({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ''
    },
    arrow: {
        type: Boolean,
        default: true
    },
    valueColor: {
        type: String,
        default: '#999'
    }
})
</script>

<style lang="scss">
.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    background-color: #fff;
    border-bottom: 2rpx solid #f5f5f5;

    &__left {
        flex: 1;
    }

    &__label {
        font-size: 28rpx;
        color: #333;
    }

    &__right {
        display: flex;
        align-items: center;
        gap: 8rpx;
    }

    &__value {
        font-size: 28rpx;
        margin-right: 8rpx;
    }

    &__arrow {
        color: #ccc;
        font-size: 24rpx;
    }
}
</style>