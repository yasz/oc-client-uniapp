<template>
  <view>

    <uni-collapse>
      <treeData :items="content"></treeData>
    </uni-collapse>
    <view style="height: 4000rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import treeData from './treeData.vue';  // 引入 TreeData 组件
defineProps<{ content: any }>();

</script>
