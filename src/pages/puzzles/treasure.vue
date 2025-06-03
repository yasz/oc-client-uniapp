<template>
  <view class="fixed inset-0 bg-primary">
    <view class="flex flex-col items-center justify-center h-full">
      <image
        :src="
          count == 0
            ? '/static/puzzles/pity.png'
            : '/static/puzzles/treasure.png'
        "
        mode="widthFix"
        class="w-[100%]"
      />
      <text v-if="count > 0" class="text-white text-2xl mt-4">
        已收集{{ count }}副拼图
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const count = ref(0);

onLoad((options) => {
  if (options?.count) {
    count.value = Number(options.count);
  }
});
</script>
