<template>
  <view class="hippo-card flex" style="height: 200rpx">
    <image
      src="/static/my/logo.png"
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
</template>

<script setup lang="ts">
// 无需 props
</script>

<style scoped lang="scss">
.hippo-card {
  background-color: #fce157;
  border-radius: 40rpx 40rpx 0 0;
  margin-bottom: 20rpx;
  display: flex;
}
</style>
