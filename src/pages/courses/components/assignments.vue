<script setup lang="ts">
import { defineProps, ref } from 'vue';

defineProps<{ content: any[] }>();

const show = ref(false);
const currentDescription = ref("");

function openContent(description: string) {
  currentDescription.value = description;
  show.value = true;
}

function close() {
  show.value = false;
}
</script>

<template>
  <view>
    <view v-for="item in content" :key="item.id" class="p-20 border-b">
      <view class="flex baseline pl-20">
        <uni-icons type="circle" size="22" color="#9298a5"></uni-icons>
        <text @click="openContent(item.description)" class="children-item py-10 pl-10">
          {{ item.title }}
        </text>
      </view>
    </view>

    <up-popup mode="center" :round="10" :show="show" @close="close">
      <view style="width: calc(100vw - 20px); height: 50vh; overflow: hidden; margin: 0 auto;">
        <scroll-view style="width: 100%; height: 100%;" scroll-y>
          <up-parse :content="currentDescription"></up-parse>
        </scroll-view>
      </view>
    </up-popup>
  </view>
</template>

<style lang="scss">
.children-item {
  color: #9298a5;
  font-size: 24rpx;
  line-height: 20px;
}
</style>
