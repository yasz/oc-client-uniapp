<template>
  <div class="numeric-indicator fixed">
    {{ currentSwiperPage + 1 }}/{{ imgUrls.length }}
  </div>

  <view class="aswiper">
    <u-swiper @click="invokeClick" keyName="image" showTitle :interval="5000" :list="imgUrls"
      @change="(e: any) => (currentSwiperPage = e.current)" indicator circular :duration="500"
      indicatorStyle="bottom: 20px" indicatorMode="line" indicatorActiveColor="gray" :width="`${viewportWidth * 2}rpx`"
      :height="`${viewportWidth}rpx`" imgMode="aspectFit"></u-swiper>
  </view>
</template>

<script setup lang="ts">
import { getViewportWidth } from "@/utils/common";
import { ref } from "vue";

// 当前轮播图页码
const currentSwiperPage = ref(0);

// 视口宽度
const viewportWidth = ref();

// 接收外部传入的属性
const props = defineProps<{
  imgUrls: { image: string; title: string; id?: number }[];
  eclick?: (item: any, index: number) => void;
}>();

// 处理点击事件
const invokeClick = (index: number) => {
  const item = props.imgUrls[index];

  if (props.eclick) {
    // 如果传入 eclick，则调用 eclick，并传递 item 和 index
    props.eclick(item, index);
  } else {
    // 如果未传入 eclick，则默认使用图片预览
    uni.previewImage({
      urls: props.imgUrls.map((item) => item.image),
      current: index,
    });
  }
};

// 初始化视口宽度
const init = async () => {
  viewportWidth.value = await getViewportWidth();
};
init();
</script>

<style>
.numeric-indicator {
  right: 30rpx;
  top: 60rpx;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 24rpx;
  padding: 8rpx 12rpx;
  border-radius: 16rpx;
  text-align: center;
  z-index: 10;
}
</style>
