<template>
  <view>
    <view v-if="count==0">
      <image 
          :src="
           '/static/puzzles/pity.png'
          "
          mode="widthFix"
          class="w-full"
        />
    </view>
    <view v-else class="fixed inset-0 bg-primary pt-12">
    <view class="flex justify-center pt-[40%]">
      <image src="/static/puzzles/treasure_titlle.png" mode="widthFix" class="w-[50%]" />
    </view>

    <view class="mt-[30%]">
    

      <view class="flex flex-col items-center justify-center px-10">
        <text  class="text-white text-2xl mt-4">
          已收集{{ count }}副拼图
        </text>
      </view>
      <view v-if="count > 0" class="mt-[20%] flex justify-center items-center flex-wrap gap-x-2 px-4 mb-4">
        <image
          v-for="i in count"
          :key="i"
          :src="hippoImages[(i - 1) % hippoImages.length]"
          mode="widthFix"
          style="width: 20%;"
        />
      </view>
    </view>
  </view>
</view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";

const count = ref(0);
const hippoImages = [
  '/static/index/signin/hippo.png',
  '/static/index/signup/hippo.png'
];

onLoad((options) => {
  if (options?.count) {
    count.value = Number(options.count);
  }
});
</script>